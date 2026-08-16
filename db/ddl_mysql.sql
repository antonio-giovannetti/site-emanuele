

-- ============================================
-- MariaDB / MySQL version of the schema
-- ============================================

-- Tabella Contatto
CREATE TABLE contatto (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          indirizzo1 VARCHAR(255) NOT NULL,
                          indirizzo2 VARCHAR(255) NOT NULL,
                          indirizzo3 VARCHAR(255) NOT NULL,
                          tel VARCHAR(50) NOT NULL,
                          cell VARCHAR(50) NOT NULL,
                          email VARCHAR(255),
                          pec VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orari del contatto
CREATE TABLE contatto_orari (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                contatto_id INT NOT NULL,
                                orario VARCHAR(255) NOT NULL,
                                position INT NOT NULL,
                                FOREIGN KEY (contatto_id) REFERENCES contatto(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Settings
CREATE TABLE settings (
                          k VARCHAR(40) NOT NULL PRIMARY KEY,
                          v VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Media (usato in Webinar, Titolare.certs e Site.cert)
CREATE TABLE media (
                       id INT PRIMARY KEY AUTO_INCREMENT,
                       src VARCHAR(255),
                       caption VARCHAR(255) NOT NULL,
                       date DATETIME,
                       type VARCHAR(10) NOT NULL CHECK (type IN ('VIDEO', 'IMAGE', 'AUDIO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Titolare
CREATE TABLE titolare (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          contatto_id INT NOT NULL,
                          name VARCHAR(255) NOT NULL,
                          sub1 VARCHAR(255) NOT NULL,
                          sub2 VARCHAR(255),
                          image VARCHAR(255) NOT NULL,
                          description TEXT NOT NULL,
                          email VARCHAR(255),
                          ordine VARCHAR(255) NOT NULL,
                          linkOrdine VARCHAR(255) NOT NULL,
                          FOREIGN KEY (contatto_id) REFERENCES contatto(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Formazione
CREATE TABLE titolare_formazione (
                                     id INT PRIMARY KEY AUTO_INCREMENT,
                                     titolare_id INT NOT NULL,
                                     formazione VARCHAR(255) NOT NULL,
                                     position INT NOT NULL,
                                     FOREIGN KEY (titolare_id) REFERENCES titolare(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Spec
CREATE TABLE titolare_spec (
                               id INT PRIMARY KEY AUTO_INCREMENT,
                               titolare_id INT NOT NULL,
                               spec VARCHAR(255) NOT NULL,
                               position INT NOT NULL,
                               FOREIGN KEY (titolare_id) REFERENCES titolare(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Media associati a Titolare (certs)
CREATE TABLE titolare_media (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                titolare_id INT NOT NULL,
                                media_id INT NOT NULL,
                                position INT NOT NULL,
                                FOREIGN KEY (titolare_id) REFERENCES titolare(id) ON DELETE CASCADE,
                                FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Site (radice)
CREATE TABLE site (
                      id INT PRIMARY KEY AUTO_INCREMENT,
                      settings_id INT NOT NULL,
                      title VARCHAR(255) NOT NULL,
                      subtitle VARCHAR(255) NOT NULL,
                      contatto_id INT NOT NULL,
                      titolare_id INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Social
CREATE TABLE social (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(255) NOT NULL,
                        icon VARCHAR(255) NOT NULL,
                        link VARCHAR(255) NOT NULL,
                        position INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Aforisma
CREATE TABLE aforisma (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          text TEXT NOT NULL,
                          author VARCHAR(255) NOT NULL,
                          position INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Servizio
CREATE TABLE servizio (
                          id INT PRIMARY KEY AUTO_INCREMENT,
                          icon VARCHAR(255),
                          title VARCHAR(255),
                          description TEXT,
                          cost DECIMAL(10,2),
                          position INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ProcessStep
CREATE TABLE process_step (
                              id INT PRIMARY KEY AUTO_INCREMENT,
                              title VARCHAR(255) NOT NULL,
                              description TEXT NOT NULL,
                              position INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Webinar
CREATE TABLE webinar (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         type VARCHAR(10) NOT NULL CHECK (type IN ('WEBINAR', 'LIVE')),
                         state VARCHAR(10) NOT NULL DEFAULT 'DRAFT' CHECK (state IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
                         location_indirizzo1 VARCHAR(255),
                         location_indirizzo2 VARCHAR(255),
                         location_indirizzo3 VARCHAR(255),
                         title VARCHAR(255) NOT NULL,
                         description TEXT NOT NULL,
                         utcDate DATETIME NOT NULL,
                         people INT NOT NULL,
                         extra TEXT NOT NULL,
                         price DECIMAL(10,2) NOT NULL,
                         form TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Media associati a Webinar
CREATE TABLE webinar_media (
                               id INT PRIMARY KEY AUTO_INCREMENT,
                               webinar_id INT NOT NULL,
                               media_id INT NOT NULL,
                               position INT NOT NULL,
                               FOREIGN KEY (webinar_id) REFERENCES webinar(id) ON DELETE CASCADE,
                               FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
