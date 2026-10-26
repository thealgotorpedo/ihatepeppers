-- 1. Create and select the database
CREATE DATABASE IF NOT EXISTS `PepperContactsDB`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE `PepperContactsDB`;

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS `Users` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(50) NOT NULL DEFAULT '',
    `LastName` VARCHAR(50) NOT NULL DEFAULT '',
    `Login` VARCHAR(50) NOT NULL DEFAULT '',
    `Password` VARCHAR(255) NOT NULL DEFAULT '',
    `DateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `DateUpdated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`ID`),
    UNIQUE INDEX `idx_users_login` (`Login`)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- 3. Create Contacts Table
CREATE TABLE IF NOT EXISTS `Contacts` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(50) NOT NULL DEFAULT '',
    `LastName` VARCHAR(50) NOT NULL DEFAULT '',
    `EmailAddress` VARCHAR(255) NOT NULL DEFAULT '',
    `PhoneNumber` VARCHAR(30) NOT NULL DEFAULT '',
    `DateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `DateUpdated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    `UserID` INT NOT NULL,

    PRIMARY KEY (`ID`),

    INDEX `idx_contacts_userid` (`UserID`),

    CONSTRAINT `fk_contacts_users`
        FOREIGN KEY (`UserID`)
        REFERENCES `Users` (`ID`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;


-- 4. Create Application Database User & Grant Permissions

CREATE USER IF NOT EXISTS 'PepperContactsUser'@'localhost'
IDENTIFIED BY 'redpepper';

GRANT ALL PRIVILEGES
ON `PepperContactsDB`.*
TO 'PepperContactsUser'@'localhost';


-- Allow connection from any host
-- Useful if the API is running inside Docker
CREATE USER IF NOT EXISTS 'PepperContactsUser'@'%'
IDENTIFIED BY 'redpepper';

GRANT ALL PRIVILEGES
ON `PepperContactsDB`.*
TO 'PepperContactsUser'@'%';


FLUSH PRIVILEGES;
