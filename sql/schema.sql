-- ==============================================================================
-- Portfolio Contact Database Schema
-- DAGAM CHANDRAMOHAN | Portfolio Contact Submissions
-- ==============================================================================

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `subject` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `ip_hash` VARCHAR(64) NOT NULL COMMENT 'SHA-256 hash of client IP for privacy & rate-limiting',
  `user_agent` VARCHAR(255) DEFAULT NULL COMMENT 'Truncated client user-agent string',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ip_created` (`ip_hash`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
