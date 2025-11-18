<?php

declare(strict_types=1);

require_once 'flight/Flight.php';

Flight::route('/', function() {
    Flight::render('accueil');
});

Flight::route('/map', function() {
    Flight::render('map');
});

Flight::route('/new_game', function() {
    $player = $_GET['user'];

    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';

    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

    $sql = "DROP TABLE joueurs;
        CREATE TABLE joueurs(
        id SERIAL PRIMARY KEY,
        nom TEXT,
        score INTEGER DEFAULT 0);
        INSERT INTO joueurs(nom) VALUES
        ('$player')";
    $query = pg_query($link, $sql);

    Flight::redirect('map');
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

    $sql2 = "SELECT * FROM joueurs";
    $query = pg_query($link, $sql2);
    $results = pg_fetch_all($query);

    Flight::json($results);
});

Flight::start();

?>