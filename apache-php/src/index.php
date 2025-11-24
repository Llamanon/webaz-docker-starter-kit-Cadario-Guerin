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
    $link = Flight::get('connexion');

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

    $link = Flight::get('connexion');

    $sql = "INSERT INTO joueurs(name) VALUES
        ('$player')";
    $query = pg_query($link, $sql);

    Flight::redirect('map');
});

Flight::route('POST /time', function() {
    $link = Flight::get('connexion');

    $timer = $_POST['timer'];

    $sql = "UPDATE joueurs SET score = $1 WHERE id = (SELECT MAX(id) FROM joueurs)";
    $result = pg_query_params($link, $sql, [$timer]);

    Flight::redirect('/');
});


Flight::start();

?>