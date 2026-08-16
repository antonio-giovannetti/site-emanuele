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

CREATE TABLE contatto_orari (
    id INT PRIMARY KEY AUTO_INCREMENT,
    contatto_id INT NOT NULL,
    orario VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (contatto_id) REFERENCES contatto(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    autoPlayAudio TINYINT(1) NOT NULL,
    autoPlayVideo TINYINT(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    src LONGBLOB,
    caption VARCHAR(255) NOT NULL,
    date DATETIME,
    type VARCHAR(10) NOT NULL CHECK (type IN ('VIDEO', 'IMAGE', 'AUDIO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

CREATE TABLE titolare_formazione (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titolare_id INT NOT NULL,
    formazione VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (titolare_id) REFERENCES titolare(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE titolare_spec (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titolare_id INT NOT NULL,
    spec VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (titolare_id) REFERENCES titolare(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE titolare_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titolare_id INT NOT NULL,
    media_id INT NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (titolare_id) REFERENCES titolare(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE site (
    id INT PRIMARY KEY AUTO_INCREMENT,
    settings_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    contatto_id INT NOT NULL,
    titolare_id INT NOT NULL,
    FOREIGN KEY (settings_id) REFERENCES settings(id) ON DELETE RESTRICT,
    FOREIGN KEY (contatto_id) REFERENCES contatto(id) ON DELETE RESTRICT,
    FOREIGN KEY (titolare_id) REFERENCES titolare(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE social (
    id INT PRIMARY KEY AUTO_INCREMENT,
    site_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    link VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE aforisma (
    id INT PRIMARY KEY AUTO_INCREMENT,
    site_id INT NOT NULL,
    text TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE servizio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    site_id INT NOT NULL,
    icon VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    cost DECIMAL(10,2),
    position INT NOT NULL,
    FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE process_step (
    id INT PRIMARY KEY AUTO_INCREMENT,
    site_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

CREATE TABLE webinar_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    webinar_id INT NOT NULL,
    info TEXT NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (webinar_id) REFERENCES webinar(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE webinar_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    webinar_id INT NOT NULL,
    media_id INT NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (webinar_id) REFERENCES webinar(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE site_webinar (
    site_id INT NOT NULL,
    webinar_id INT NOT NULL,
    PRIMARY KEY (site_id, webinar_id),
    FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE,
    FOREIGN KEY (webinar_id) REFERENCES webinar(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE site_media (
    site_id INT NOT NULL,
    media_id INT NOT NULL,
    PRIMARY KEY (site_id, media_id),
    FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
