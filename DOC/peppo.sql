-- Adminer 4.7.7 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP DATABASE IF EXISTS `peppo`;
CREATE DATABASE `peppo` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `peppo`;

DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `address_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `address1` varchar(30) NOT NULL,
  `address2` varchar(30) NOT NULL,
  `country` varchar(30) NOT NULL,
  `state` varchar(30) NOT NULL,
  `city` varchar(30) NOT NULL,
  `street` varchar(30) NOT NULL,
  `apartment` varchar(30) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `postal_code` varchar(7) NOT NULL,
  `is_primary` tinyint(1) NOT NULL,
  PRIMARY KEY (`address_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `address_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `address_id` int(11) NOT NULL,
  `total_price` decimal(20,0) NOT NULL,
  `coupon` varchar(15) NOT NULL,
  `items` text NOT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `login_history`;
CREATE TABLE `login_history` (
  `login_history_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `ip_info` varchar(200) NOT NULL,
  `agent_details` varchar(600) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`login_history_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `login_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4642 DEFAULT CHARSET=latin1;

INSERT INTO `login_history` (`login_history_id`, `user_id`, `ip_info`, `agent_details`, `createdAt`) VALUES
(4641,	52639,	'{\"ip\":\"::1\",\"error\":\"This won\'t work on localhost\"}',	'{\"isSafari\":false,\"isFirefox\":false,\"isChrome\":false,\"isDesktop\":false,\"isWindows\":false,\"isLinux\":false,\"isLinux64\":false,\"isMac\":false,\"isChromeOS\":false,\"isSamsung\":false,\"isBot\":\"postman\",\"isUC\":false,\"browser\":\"PostmanRuntime\",\"version\":\"7.26.5\",\"os\":\"unknown\",\"platform\":\"unknown\",\"geoIp\":{},\"source\":\"PostmanRuntime/7.26.5\"}',	'2020-09-12 18:42:38');

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`role_id`),
  KEY `role` (`name`),
  CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `users` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) DEFAULT NULL,
  `mobile_number` varchar(20) DEFAULT NULL,
  `email` varchar(65) DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  `role_id` int(10) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '0',
  `email_verified` tinyint(1) DEFAULT '0',
  `phone_verified` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `mobile_number` (`mobile_number`),
  UNIQUE KEY `mobile_number_2` (`mobile_number`),
  KEY `user_id` (`user_id`),
  KEY `name` (`name`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=52640 DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `wish_list`;
CREATE TABLE `wish_list` (
  `wish_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL,
  `product_id` int(11) NOT NULL,
  PRIMARY KEY (`wish_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `wish_list_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- 2020-09-12 14:02:03
