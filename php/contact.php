<?php
/**
 * Contact Form API Handler
 * DAGAM CHANDRAMOHAN Portfolio Website
 *
 * Implements:
 * - CSRF verification via token generator & hash_equals
 * - Honeypot spam trap
 * - Submission timing anti-bot threshold (>= 3 seconds)
 * - Per-IP SHA-256 hash rate-limiting (max 5 submissions per hour)
 * - Header injection prevention
 * - Input validation and sanitization
 * - PDO prepared statements with utf8mb4
 * - Safe JSON error responses without leaking server/database internals
 */

// Set secure session cookie parameters before session_start
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
    ini_set('session.cookie_secure', 1);
}

session_start();

// Always return JSON
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

function sendResponse(int $statusCode, bool $success, string $message, array $extra = []): void {
    http_response_code($statusCode);
    echo json_encode(array_merge([
        'success' => $success,
        'message' => $message
    ], $extra), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

// -----------------------------------------------------------------------------
// 1. Action: Token Request (GET ?action=token)
// -----------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'token') {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    $_SESSION['token_generated_at'] = time();
    sendResponse(200, true, 'Token generated', ['token' => $_SESSION['csrf_token']]);
}

// -----------------------------------------------------------------------------
// 2. Enforce POST for submission
// -----------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, false, 'Method not allowed. Only POST is accepted.');
}

// -----------------------------------------------------------------------------
// 3. Check for Configuration File
// -----------------------------------------------------------------------------
$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    error_log('Contact form error: php/config.php not found. Copy config.sample.php to config.php.');
    sendResponse(503, false, 'The message service is unavailable right now. Please email me directly instead.');
}

$config = require $configFile;

// -----------------------------------------------------------------------------
// 4. Honeypot Verification (Anti-bot trap)
// -----------------------------------------------------------------------------
// Form includes a hidden field named "website_hp" styled display:none
if (!empty($_POST['website_hp'])) {
    // Silently reject bots
    sendResponse(400, false, 'Invalid submission detected.');
}

// -----------------------------------------------------------------------------
// 5. Time Trap Verification (Anti-bot speed threshold >= 3 seconds)
// -----------------------------------------------------------------------------
$formTime = isset($_POST['form_time']) ? filter_var($_POST['form_time'], FILTER_VALIDATE_INT) : null;
$currentTime = time();
$minSeconds = $config['security']['min_submit_seconds'] ?? 3;

if (!$formTime || ($currentTime - $formTime) < $minSeconds) {
    sendResponse(400, false, 'Submission completed too quickly. Please take your time and try again.');
}

// -----------------------------------------------------------------------------
// 6. CSRF Token Verification
// -----------------------------------------------------------------------------
$providedToken = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
$sessionToken  = $_SESSION['csrf_token'] ?? '';

if (empty($providedToken) || empty($sessionToken) || !hash_equals($sessionToken, $providedToken)) {
    sendResponse(403, false, 'Security token invalid or expired. Please refresh the page and try again.');
}

// -----------------------------------------------------------------------------
// 7. Input Extraction & Sanitization
// -----------------------------------------------------------------------------
$name    = isset($_POST['name']) ? trim((string)$_POST['name']) : '';
$email   = isset($_POST['email']) ? trim((string)$_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim((string)$_POST['subject']) : '';
$message = isset($_POST['message']) ? trim((string)$_POST['message']) : '';

// Check for header injection attempts (newlines in single-line fields)
if (preg_match("/[\r\n]/", $name) || preg_match("/[\r\n]/", $email) || preg_match("/[\r\n]/", $subject)) {
    sendResponse(400, false, 'Invalid characters detected in submitted fields.');
}

// Validation rules matching frontend
if (mb_strlen($name) < 1 || mb_strlen($name) > 100) {
    sendResponse(400, false, 'Please enter your name.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 254) {
    sendResponse(400, false, 'Please enter a valid email address.');
}

if (mb_strlen($subject) < 1 || mb_strlen($subject) > 150) {
    sendResponse(400, false, 'Please add a short subject.');
}

if (mb_strlen($message) < 10 || mb_strlen($message) > 2000) {
    sendResponse(400, false, 'Please write a message of at least 10 characters.');
}

// -----------------------------------------------------------------------------
// 8. Database Connection & Privacy-Friendly IP Hashing
// -----------------------------------------------------------------------------
$rawIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$ipSalt = $config['security']['ip_salt'] ?? 'default_salt_key_dgcm';
$ipHash = hash('sha256', $rawIp . $ipSalt);

$userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? mb_substr($_SERVER['HTTP_USER_AGENT'], 0, 255) : null;

try {
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $config['db']['host'] ?? '127.0.0.1',
        $config['db']['port'] ?? 3306,
        $config['db']['database'],
        $config['db']['charset'] ?? 'utf8mb4'
    );

    $pdo = new PDO($dsn, $config['db']['username'], $config['db']['password'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false
    ]);

    // -------------------------------------------------------------------------
    // 9. Rate Limiting Check (Max 5 submissions per hour per IP hash)
    // -------------------------------------------------------------------------
    $rateLimitWindow = (int)($config['security']['rate_limit_window'] ?? 3600);
    $rateLimitMax    = (int)($config['security']['rate_limit_max'] ?? 5);

    $rateCheckStmt = $pdo->prepare(
        'SELECT COUNT(*) FROM `contact_messages` 
         WHERE `ip_hash` = :ip_hash AND `created_at` >= (NOW() - INTERVAL :window SECOND)'
    );
    $rateCheckStmt->bindValue(':ip_hash', $ipHash, PDO::PARAM_STR);
    $rateCheckStmt->bindValue(':window', $rateLimitWindow, PDO::PARAM_INT);
    $rateCheckStmt->execute();

    $submissionCount = (int)$rateCheckStmt->fetchColumn();
    if ($submissionCount >= $rateLimitMax) {
        sendResponse(429, false, 'Too many requests. Please try again later or email me directly.');
    }

    // -------------------------------------------------------------------------
    // 10. Insert Record into Database
    // -------------------------------------------------------------------------
    $insertStmt = $pdo->prepare(
        'INSERT INTO `contact_messages` (`name`, `email`, `subject`, `message`, `ip_hash`, `user_agent`) 
         VALUES (:name, :email, :subject, :message, :ip_hash, :user_agent)'
    );
    $insertStmt->execute([
        ':name'       => $name,
        ':email'      => $email,
        ':subject'    => $subject,
        ':message'    => $message,
        ':ip_hash'    => $ipHash,
        ':user_agent' => $userAgent
    ]);

    // Invalidate CSRF token after successful submission to prevent replay
    unset($_SESSION['csrf_token']);

    // Optional email notification if configured
    if (!empty($config['mail']['send_email_copy']) && !empty($config['mail']['notification_email'])) {
        $to = $config['mail']['notification_email'];
        $emailSubject = "Portfolio Contact: " . $subject;
        $emailBody = "Name: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$message\n";
        $headers = "From: noreply@" . ($_SERVER['SERVER_NAME'] ?? 'localhost') . "\r\n" .
                   "Reply-To: " . $email . "\r\n" .
                   "X-Mailer: PHP/" . phpversion();
        @mail($to, $emailSubject, $emailBody, $headers);
    }

    sendResponse(200, true, 'Thank you. Your message has been received.');

} catch (PDOException $e) {
    // Log detailed DB error locally, but never expose it to user
    error_log('Database error in contact.php: ' . $e->getMessage());
    sendResponse(500, false, 'Something went wrong. Please try again in a moment.');
} catch (Throwable $t) {
    error_log('General error in contact.php: ' . $t->getMessage());
    sendResponse(500, false, 'Something went wrong. Please try again in a moment.');
}
