USE apjv_admin;

-- Table des actions
CREATE TABLE IF NOT EXISTS actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    link VARCHAR(255) NULL,
    image_path VARCHAR(255) NULL,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    admin_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ajout d'un commentaire pour documenter le changement de nom de colonne
-- NOTE: La colonne a été renommée de 'created_by' à 'admin_id' pour correspondre à la structure existante de la base de données
