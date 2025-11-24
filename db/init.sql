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
    id_objet INTEGER,
    name TEXT,
    ratio_taille float,
    url TEXT
);

INSERT INTO objets (name, point, minZoomVisible, maxZoomVisible, visible, image, attribut) VALUES
('tacheometre', ST_SetSRID(ST_MakePoint(5.7741, 43.96225), 4326), 17, 19, TRUE, 'assets/tacheo.jpg', 'or'),
('gs18', ST_SetSRID(ST_MakePoint(5.7741, 43.96225), 4326), 17, 19, TRUE, 'assets/tacheo2.jpg', 'or'),
('papier code', ST_SetSRID(ST_MakePoint(5.776711068346986, 43.97925692971896), 4326), 18, 20, TRUE, 'assets/code.jpg', 'ob'),
('tacheometre 2', ST_SetSRID(ST_MakePoint(5.7741, 43.96225), 4326), 15, 19, FALSE, 'assets/tacheo.jpg', 'oc'),
('carteSD', ST_SetSRID(ST_MakePoint(5.7789702, 43.960561), 4326), 14, 19, FALSE, 'assets/carteSD.png', 'or'),
('tacheometre 3', ST_SetSRID(ST_MakePoint(5.8387194, 43.9676102), 4326), 14, 19, FALSE, 'assets/tacheo.jpg', 'ob'),
('ordinateur', ST_SetSRID(ST_MakePoint(5.7741, 43.96225), 4326), 17, 19, FALSE, 'assets/ordi.png', 'oc');



INSERT INTO images (name, ratio_taille, url) VALUES
('tacheometre', 0.3, 'assets/tacheo.jpg'),
('gs18', 0.1, 'assets/tacheo2.jpg'),
('papier code', 1, 'assets/code.jpg'),
('tacheometre 2', 0.3, 'assets/tacheo.jpg'),
('carteSD', 0.03, 'assets/carteSD.png'),
('tacheometre 3', 0.3, 'assets/tacheo.jpg'),
('ordinateur', 0.1, 'assets/tacheo.png')
;

UPDATE images i 
SET id_objet = o.id
FROM objets o
WHERE o.name = i.name;
