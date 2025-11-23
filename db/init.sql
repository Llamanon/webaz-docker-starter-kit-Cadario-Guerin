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
    point GEOMETRY,
    image TEXT,
    minZoomVisible INTEGER DEFAULT 15,
    maxZoomVisible INTEGER DEFAULT 18,
    visible BOOLEAN DEFAULT FALSE,
    attribut TEXT  -- or : objet recupereable; oc : classe code, ob : objet bloque
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    name TEXT,
    url TEXT
);

INSERT INTO objets (name, point, minZoomVisible, maxZoomVisible, visible, image, attribut) VALUES
('tacheometre', '(5.7741, 43.96225)', 17, 19, TRUE, 'assets/tacheo.jpg', 'or'),
('gs18', '(5.7741, 43.96225)', 17, 19, TRUE, 'assets/tacheo2.jpg', 'or'),
('papier code', '(5.776772841012113, 43.97929133428411)', 18, 20, TRUE, 'assets/tacheo.jpg', 'or'),
('tacheometre 2', '(5.7741, 43.96225)', 15, 19, FALSE, 'assets/tacheo.jpg', 'oc'),
('carteSD', '(5.7789702, 43.960561)', 14, 19, FALSE, 'assets/carteSD.png', 'or'),
('tacheometre 3', '(5.8387194, 43.9676102)', 14, 19, FALSE, 'assets/tacheo.jpg', 'ob'),
('ordinateur', '(5.7741, 43.96225)', 14, 19, FALSE, 'assets/ordi.png', 'oc')
;


INSERT INTO images (name, url) VALUES
('tacheometre', 'assets/tacheo.jpg');

