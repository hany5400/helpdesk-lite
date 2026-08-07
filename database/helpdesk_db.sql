-- ========================================================
-- HelpDesk Lite Database Schema & Seed Data
-- Compatible with MySQL 5.7+ & phpMyAdmin
-- ========================================================

CREATE DATABASE IF NOT EXISTS `helpdesk_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `helpdesk_db`;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `tickets`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('employee', 'support', 'manager') NOT NULL DEFAULT 'employee',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `tickets`
-- --------------------------------------------------------

CREATE TABLE `tickets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `assigned_to` INT DEFAULT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `priority` ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
  `status` ENUM('To Do', 'In Progress', 'In Review', 'Done') NOT NULL DEFAULT 'To Do',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tickets_employee` (`employee_id`),
  KEY `idx_tickets_assigned` (`assigned_to`),
  KEY `idx_tickets_status` (`status`),
  CONSTRAINT `fk_tickets_employee` FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tickets_assigned` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for table `users`
-- Note: All passwords below are hashed for 'password123'
-- --------------------------------------------------------

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Sarah Jenkins', 'employee@helpdesk.com', '$2a$10$RrAax63WcAhYEsnvxEGDiuZO5qTYu8Nj.87vMPFbsXEEA2X/hbtsq', 'employee'),
(2, 'Alex Rivera', 'support@helpdesk.com', '$2a$10$RrAax63WcAhYEsnvxEGDiuZO5qTYu8Nj.87vMPFbsXEEA2X/hbtsq', 'support'),
(3, 'Marcus Vance', 'manager@helpdesk.com', '$2a$10$RrAax63WcAhYEsnvxEGDiuZO5qTYu8Nj.87vMPFbsXEEA2X/hbtsq', 'manager'),
(4, 'David Kim', 'david.kim@helpdesk.com', '$2a$10$RrAax63WcAhYEsnvxEGDiuZO5qTYu8Nj.87vMPFbsXEEA2X/hbtsq', 'employee'),
(5, 'Elena Rostova', 'elena.rostova@helpdesk.com', '$2a$10$RrAax63WcAhYEsnvxEGDiuZO5qTYu8Nj.87vMPFbsXEEA2X/hbtsq', 'support');

-- --------------------------------------------------------
-- Dumping data for table `tickets`
-- --------------------------------------------------------

INSERT INTO `tickets` (`id`, `employee_id`, `assigned_to`, `title`, `description`, `category`, `priority`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'VPN Connection Failing on MacOS Sequoia', 'Unable to establish secure tunnel via GlobalProtect after OS update. Error log indicates SSL handshake failure.', 'Network', 'High', 'To Do', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY),
(2, 1, 2, 'Request for Dual Monitor Setup in Office 3B', 'Requring an additional 27-inch 4K monitor and USB-C docking station for graphic design workflow.', 'Hardware', 'Medium', 'In Progress', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 2 DAY),
(3, 4, 5, 'Need Access to Financial Reporting Module', 'Need read and export privileges for Q3 ERP reporting module to complete month-end audit.', 'Access', 'High', 'In Review', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY),
(4, 1, 2, 'Email Signature Sync Issue in Outlook', 'Corporate HTML email signature fails to render logo images properly on mobile client.', 'Software', 'Low', 'Done', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 1 DAY),
(5, 4, NULL, 'Laptop Battery Draining Rapidly', 'MacBook Air M2 battery drops from 100% to 20% in under 2 hours. Battery health indicator shows warning.', 'Hardware', 'Medium', 'To Do', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY);
