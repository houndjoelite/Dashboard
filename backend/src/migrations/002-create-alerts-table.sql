USE apjv_admin;

-- Table des alertes
CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
    status ENUM('pending', 'published', 'rejected') NOT NULL DEFAULT 'pending',
    
    -- Informations du lanceur d'alerte (si non anonyme)
    reporter_name VARCHAR(100) NULL,
    reporter_email VARCHAR(100) NULL,
    reporter_phone VARCHAR(20) NULL,
    
    -- Métadonnées
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL,
    
    -- Clé étrangère vers l'admin qui a traité l'alerte
    processed_by INT NULL,
    
    FOREIGN KEY (processed_by) REFERENCES admins(id) ON DELETE SET NULL,
    
    -- Index pour les recherches courantes
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
