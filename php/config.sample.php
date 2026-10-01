<?php
/**
 * Database & Application Configuration Sample
 *
 * COPY this file to config.php in production and fill in your actual credentials.
 * NEVER commit config.php to version control.
 */

return [
    'db' => [
        'host'     => '127.0.0.1',
        'port'     => 3306,
        'database' => 'chandramohan_portfolio',
        'username' => 'portfolio_user',
        'password' => 'YOUR_SECURE_DATABASE_PASSWORD_HERE', // <!-- PLACEHOLDER: Update before production -->
        'charset'  => 'utf8mb4'
    ],
    'security' => [
        'rate_limit_max'     => 5,    // Max submissions per IP hash within the window
        'rate_limit_window'  => 3600, // Rate limit window in seconds (1 hour)
        'min_submit_seconds' => 3,    // Minimum time in seconds before submission is allowed (anti-bot)
        'ip_salt'            => 'change_this_to_a_random_salt_string_before_production' // <!-- PLACEHOLDER -->
    ],
    'mail' => [
        'notification_email' => 'YOUR_EMAIL@example.com', // <!-- PLACEHOLDER: Set your notification email -->
        'send_email_copy'    => false                      // Set to true if mail server is configured
    ]
];
