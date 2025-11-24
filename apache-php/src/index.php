<?php

declare(strict_types=1);

require_once 'flight/Flight.php';

$host = 'db';
$port = 5432;
$dbname = 'mydb';
$user = 'postgres';
$pass = 'postgres';

$link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");
Flight::set('connexion', $link);

Flight::route('/', function() {
    Flight::render('accueil');
});

Flight::route('/map', function() {
    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';

    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

    $sql = "SELECT id, name, ST_AsGeoJSON(point) AS point, image, minZoomVisible, maxZoomVisible, visible, attribut FROM objets";

    $query = pg_query($link, $sql);
    $objets = pg_fetch_all($query);

    $sql_im = "SELECT * FROM images";

    $query_im = pg_query($link, $sql_im);
    $images = pg_fetch_all($query_im);


    Flight::render('map', ['objets_json' => json_encode($objets), 'images_json' => json_encode($images)]);
});

Flight::route('/new_game', function() {
    $player = $_GET['user'];

    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';

    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

    $sql = "INSERT INTO joueurs(name) VALUES
        ('$player')";
    $query = pg_query($link, $sql);

    Flight::redirect('map');
});

Flight::route('POST /time', function() {
    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';

    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");
    // Vérification que le timer est envoyé
    if (!isset($_POST['timer'])) {
        echo "Erreur : timer non défini";
        return;
    }

    $timer = $_POST['timer'];

    // Mise à jour sécurisée du score du dernier joueur
    $sql = "UPDATE joueurs SET score = $1 WHERE id = (SELECT MAX(id) FROM joueurs)";
    $result = pg_query_params($link, $sql, [$timer]);

    if (!$result) {
        echo "Erreur SQL : " . pg_last_error($link);
        return;
    }

    Flight::redirect('/');
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

    $sql2 = "SELECT * FROM objets";
    $query = pg_query($link, $sql2);
    $results = pg_fetch_all($query);

    Flight::json($results);
});

Flight::start();

?>