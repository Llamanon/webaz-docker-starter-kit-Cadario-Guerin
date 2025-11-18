<?php

declare(strict_types=1);

require_once 'flight/Flight.php';

Flight::route('/', function() {
    Flight::render('accueil');
});

Flight::route('/map', function() {
    Flight::render('map');
});

Flight::route('/test-db', function () {
    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';

    // Connexion BDD
    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

    $sql = "SELECT * FROM points";
    $query = pg_query($link, $sql);
    $results = pg_fetch_all($query);

    Flight::json($results);
});

Flight::route('/test-db2', function () {
    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';

    // Connexion BDD
    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

    $sql2 = "INSERT INTO points (name, geom) VALUES
        ('Forcalquier', ST_SetSRID(ST_MakePoint(5.78, 43.96), 4326));
        SELECT * FROM points";
    $query = pg_query($link, $sql2);
    $results = pg_fetch_all($query);

    Flight::json($results);
});

Flight::start();

?>