-- Activer PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Créer une table points avec un champ géométrie
CREATE TABLE points (
    id SERIAL PRIMARY KEY,
    name TEXT,
    geom geometry(Point, 4326)
);

-- Insérer des données exemples
INSERT INTO points (name, geom) VALUES
('Paris', ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326)),
('Lyon', ST_SetSRID(ST_MakePoint(4.8357, 45.7640), 4326)),
('Marseille', ST_SetSRID(ST_MakePoint(5.3698, 43.2965), 4326));

-- Créer une table joueurs avec les données des joueurs
CREATE TABLE joueurs (
    id SERIAL PRIMARY KEY,
    name TEXT,
    score INTEGER DEFAULT 2147483647
);

CREATE TABLE objets (
    id SERIAL PRIMARY KEY,
    name TEXT,
    point POINT,
    image TEXT,
    minZoomVisible INTEGER DEFAULT 15,
    visible BOOLEAN DEFAULT FALSE,
    attribut TEXT,
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    name TEXT,
    url TEXT
);

INSERT INTO objets (name, point, image, attribut) VALUES
('tacheometre', '(5.908640, 43.984596)', 'assets/tacheo.jpg', 'Objet recuperable'),
('papier code', '(5.775520, 43.979724)', 'assets/tacheo.jpg', 'Objet recuperable'),
('batterie', '(5.779087, 43.960778)', 'assets/tacheo.jpg', 'Objet recuperable'),
('gs18','(5.773650, 43.962458)', 'assets/tacheo.jpg', 'Objet recuperable'),
('carte SD', '(5.773650, 43.962458)', 'assets/tacheo.jpg', 'Objet recuperable')
;


INSERT INTO images (name, url) VALUES
('tacheometre', 'assets/tacheo.jpg');

