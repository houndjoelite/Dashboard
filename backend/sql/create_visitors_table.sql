-- Table pour suivre les visites sur le site
CREATE TABLE IF NOT EXISTS `apjv_admin`.`visitors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `page_visited` VARCHAR(255) NULL,
  `referrer` VARCHAR(512) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_created_at` (`created_at` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
