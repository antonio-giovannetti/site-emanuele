-- Tabella Contatto (usata da Site e Titolare)
CREATE TABLE contatto (
                          id SERIAL PRIMARY KEY,
                          indirizzo1 VARCHAR(255) NOT NULL,
                          indirizzo2 VARCHAR(255) NOT NULL,
                          indirizzo3 VARCHAR(255) NOT NULL,
                          tel VARCHAR(50) NOT NULL,
                          cell VARCHAR(50) NOT NULL,
                          email VARCHAR(255),
                          pec VARCHAR(255)
);

-- Orari del contatto (array di stringhe)
CREATE TABLE contatto_orari (
                                id SERIAL PRIMARY KEY,
                                contatto_id INTEGER NOT NULL REFERENCES contatto(id) ON DELETE CASCADE,
                                orario VARCHAR(255) NOT NULL,
                                position INTEGER NOT NULL -- per ordinamento
);

-- Settings
CREATE TABLE settings (
                          id SERIAL PRIMARY KEY,
                          autoPlayAudio BOOLEAN NOT NULL,
                          autoPlayVideo BOOLEAN NOT NULL
);

-- Media (usato in Webinar, Titolare.certs e Site.cert)
CREATE TABLE media (
                       id SERIAL PRIMARY KEY,
                       src BYTEA, -- <--- CAMBIATO: da VARCHAR a BYTEA
                       caption VARCHAR(255) NOT NULL,
                       date TIMESTAMP,
                       type VARCHAR(10) NOT NULL CHECK (type IN ('VIDEO', 'IMAGE', 'AUDIO'))
);

-- Titolare
CREATE TABLE titolare (
                          id SERIAL PRIMARY KEY,
                          contatto_id INTEGER NOT NULL REFERENCES contatto(id) ON DELETE RESTRICT,
                          name VARCHAR(255) NOT NULL,
                          sub1 VARCHAR(255) NOT NULL,
                          sub2 VARCHAR(255),
                          image VARCHAR(255) NOT NULL,
                          description TEXT NOT NULL,
                          email VARCHAR(255),
                          ordine VARCHAR(255) NOT NULL,
                          linkOrdine VARCHAR(255) NOT NULL
);

-- Formazione (array di stringhe)
CREATE TABLE titolare_formazione (
                                     id SERIAL PRIMARY KEY,
                                     titolare_id INTEGER NOT NULL REFERENCES titolare(id) ON DELETE CASCADE,
                                     formazione VARCHAR(255) NOT NULL,
                                     position INTEGER NOT NULL
);

-- Spec (array di stringhe)
CREATE TABLE titolare_spec (
                               id SERIAL PRIMARY KEY,
                               titolare_id INTEGER NOT NULL REFERENCES titolare(id) ON DELETE CASCADE,
                               spec VARCHAR(255) NOT NULL,
                               position INTEGER NOT NULL
);

-- Media associati a Titolare (certs)
CREATE TABLE titolare_media (
                                id SERIAL PRIMARY KEY,
                                titolare_id INTEGER NOT NULL REFERENCES titolare(id) ON DELETE CASCADE,
                                media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
                                position INTEGER NOT NULL
);

-- Site (radice)
CREATE TABLE site (
                      id SERIAL PRIMARY KEY,
                      settings_id INTEGER NOT NULL REFERENCES settings(id) ON DELETE RESTRICT,
                      title VARCHAR(255) NOT NULL,
                      subtitle VARCHAR(255) NOT NULL,
                      contatto_id INTEGER NOT NULL REFERENCES contatto(id) ON DELETE RESTRICT,
                      titolare_id INTEGER NOT NULL REFERENCES titolare(id) ON DELETE RESTRICT,
);

-- Social (array)
CREATE TABLE social (
                        id SERIAL PRIMARY KEY,
                        site_id INTEGER NOT NULL REFERENCES site(id) ON DELETE CASCADE,
                        name VARCHAR(255) NOT NULL,
                        icon VARCHAR(255) NOT NULL,
                        link VARCHAR(255) NOT NULL,
                        position INTEGER NOT NULL
);

-- Aforisma (array dentro WrapperAforisma)
CREATE TABLE aforisma (
                          id SERIAL PRIMARY KEY,
                          site_id INTEGER NOT NULL REFERENCES site(id) ON DELETE CASCADE,
                          text TEXT NOT NULL,
                          author VARCHAR(255) NOT NULL,
                          position INTEGER NOT NULL
);

-- Servizio (array)
CREATE TABLE servizio (
                          id SERIAL PRIMARY KEY,
                          site_id INTEGER NOT NULL REFERENCES site(id) ON DELETE CASCADE,
                          icon VARCHAR(255),
                          title VARCHAR(255),
                          description TEXT,
                          cost NUMERIC(10,2),
                          position INTEGER NOT NULL
);

-- ProcessStep (array)
CREATE TABLE process_step (
                              id SERIAL PRIMARY KEY,
                              site_id INTEGER NOT NULL REFERENCES site(id) ON DELETE CASCADE,
                              title VARCHAR(255) NOT NULL,
                              description TEXT NOT NULL,
                              position INTEGER NOT NULL
);

-- Webinar
CREATE TABLE webinar (
                         id SERIAL PRIMARY KEY,
                         type VARCHAR(10) NOT NULL CHECK (type IN ('WEBINAR', 'LIVE')),
                         state VARCHAR(10) NOT NULL default 'DRAFT' CHECK (state IN ('DRAFT', 'PUBLISHED','ARCHIVED')) ,
    -- Location (embedded)
                         location_indirizzo1 VARCHAR(255),
                         location_indirizzo2 VARCHAR(255),
                         location_indirizzo3 VARCHAR(255),
                         title VARCHAR(255) NOT NULL,
                         description TEXT NOT NULL,
                         utcDate TIMESTAMP NOT NULL,
                         people INTEGER NOT NULL,
                         extra TEXT NOT NULL,
                         price NUMERIC(10,2) NOT NULL,
                         form BOOLEAN NOT NULL
);

-- Info di Webinar (array di stringhe)
CREATE TABLE webinar_info (
                              id SERIAL PRIMARY KEY,
                              webinar_id INTEGER NOT NULL REFERENCES webinar(id) ON DELETE CASCADE,
                              info TEXT NOT NULL,
                              position INTEGER NOT NULL
);

-- Media associati a Webinar
CREATE TABLE webinar_media (
                               id SERIAL PRIMARY KEY,
                               webinar_id INTEGER NOT NULL REFERENCES webinar(id) ON DELETE CASCADE,
                               media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
                               position INTEGER NOT NULL
);


-- ============================================
-- FOREIGN KEY - CONTATTO_ORARI
-- ============================================
ALTER TABLE contatto_orari
    ADD CONSTRAINT fk_contatto_orari_contatto
        FOREIGN KEY (contatto_id) REFERENCES contatto(id) ON DELETE CASCADE;

-- ============================================
-- FOREIGN KEY - TITOLARE
-- ============================================
ALTER TABLE titolare
    ADD CONSTRAINT fk_titolare_contatto
        FOREIGN KEY (contatto_id) REFERENCES contatto(id) ON DELETE RESTRICT;

-- ============================================
-- FOREIGN KEY - TITOLARE FORMAZIONE
-- ============================================
ALTER TABLE titolare_formazione
    ADD CONSTRAINT fk_titolare_formazione_titolare
        FOREIGN KEY (titolare_id) REFERENCES titolare(id) ON DELETE CASCADE;

-- ============================================
-- FOREIGN KEY - TITOLARE SPEC
-- ============================================
ALTER TABLE titolare_spec
    ADD CONSTRAINT fk_titolare_spec_titolare
        FOREIGN KEY (titolare_id) REFERENCES titolare(id) ON DELETE CASCADE;

-- ============================================
-- FOREIGN KEY - TITOLARE MEDIA (certs)
-- ============================================
ALTER TABLE titolare_media
    ADD CONSTRAINT fk_titolare_media_titolare
        FOREIGN KEY (titolare_id) REFERENCES titolare(id) ON DELETE CASCADE;

ALTER TABLE titolare_media
    ADD CONSTRAINT fk_titolare_media_media
        FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE;

-- ============================================
-- FOREIGN KEY - SITE
-- ============================================
ALTER TABLE site
    ADD CONSTRAINT fk_site_settings
        FOREIGN KEY (settings_id) REFERENCES settings(id) ON DELETE RESTRICT;

ALTER TABLE site
    ADD CONSTRAINT fk_site_contatto
        FOREIGN KEY (contatto_id) REFERENCES contatto(id) ON DELETE RESTRICT;

ALTER TABLE site
    ADD CONSTRAINT fk_site_titolare
        FOREIGN KEY (titolare_id) REFERENCES titolare(id) ON DELETE RESTRICT;

-- ============================================
-- FOREIGN KEY - SOCIAL
-- ============================================
ALTER TABLE social
    ADD CONSTRAINT fk_social_site
        FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE;

-- ============================================
-- FOREIGN KEY - AFORISMA
-- ============================================
ALTER TABLE aforisma
    ADD CONSTRAINT fk_aforisma_site
        FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE;

-- ============================================
-- FOREIGN KEY - SERVIZIO
-- ============================================
ALTER TABLE servizio
    ADD CONSTRAINT fk_servizio_site
        FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE;

-- ============================================
-- FOREIGN KEY - PROCESS_STEP
-- ============================================
ALTER TABLE process_step
    ADD CONSTRAINT fk_process_step_site
        FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE;

-- ============================================
-- FOREIGN KEY - WEBINAR_INFO
-- ============================================
ALTER TABLE webinar_info
    ADD CONSTRAINT fk_webinar_info_webinar
        FOREIGN KEY (webinar_id) REFERENCES webinar(id) ON DELETE CASCADE;

-- ============================================
-- FOREIGN KEY - WEBINAR_MEDIA
-- ============================================
ALTER TABLE webinar_media
    ADD CONSTRAINT fk_webinar_media_webinar
        FOREIGN KEY (webinar_id) REFERENCES webinar(id) ON DELETE CASCADE;

ALTER TABLE webinar_media
    ADD CONSTRAINT fk_webinar_media_media
        FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE;

-- ============================================
-- FOREIGN KEY - SITE_WEBINAR
-- ============================================
ALTER TABLE site_webinar
    ADD CONSTRAINT fk_site_webinar_site
        FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE;

ALTER TABLE site_webinar
    ADD CONSTRAINT fk_site_webinar_webinar
        FOREIGN KEY (webinar_id) REFERENCES webinar(id) ON DELETE CASCADE;

-- ============================================
-- FOREIGN KEY - SITE_MEDIA (cert)
-- ============================================
ALTER TABLE site_media
    ADD CONSTRAINT fk_site_media_site
        FOREIGN KEY (site_id) REFERENCES site(id) ON DELETE CASCADE;

ALTER TABLE site_media
    ADD CONSTRAINT fk_site_media_media
        FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE;

