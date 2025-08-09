-- Script pour ajouter les nouveaux champs à la table alerts
ALTER TABLE `alerts` 
ADD COLUMN `title` VARCHAR(255) NOT NULL AFTER `id`,
ADD COLUMN `category` VARCHAR(100) AFTER `content`,
ADD COLUMN `urgency` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium' AFTER `category`,
ADD COLUMN `description` TEXT AFTER `urgency`,
ADD COLUMN `evidence` TEXT AFTER `description`,
MODIFY COLUMN `content` TEXT NOT NULL COMMENT 'Contenu court (500 caractères max)';

-- Mettre à jour les enregistrements existants avec des valeurs par défaut
UPDATE `alerts` SET 
  `title` = CONCAT('Alerte #', id),
  `description` = content,
  `category` = 'Autre'
WHERE `title` = '' OR `title` IS NULL;

-- Ajouter des contraintes pour les champs obligatoires
ALTER TABLE `alerts` 
MODIFY COLUMN `title` VARCHAR(255) NOT NULL,
MODIFY COLUMN `description` TEXT NOT NULL;
