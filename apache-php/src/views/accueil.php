<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
</head>
<body>
    <h1>Escape Game</h1>
    <form action="/new_game">
        <p><label>Username: <input type="text" name="user"></label></p>
        <p><button>Nouvelle partie</button></p>
    </form>
    <h1>Hall of Fame</h1>
    <p><?php
        $host = 'db';
        $port = 5432;
        $dbname = 'mydb';
        $user = 'postgres';
        $pass = 'postgres';
        // Connexion BDD
        $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

        $sql = "SELECT name,score FROM joueurs ORDER BY score LIMIT 10";
        $query = pg_query($link, $sql);
        $results = pg_fetch_all($query);
        echo "<table border='1' cellpadding='8' cellspacing='0'>";
        if ($results) {
            // afficher les colonnes
            echo "<tr>";
            foreach (array_keys($results[0]) as $column) {
                echo "<th>" . htmlspecialchars($column) . "</th>";
            }
            echo "</tr>";

            // Données des joueurs
            foreach ($results as $row) {
                echo "<tr>";
                foreach ($row as $value) {
                    echo "<td>" . htmlspecialchars($value) . "</td>";
                }
                echo "</tr>";
            }

        } else {
            echo "<tr><td>Aucune donnée trouvée</td></tr>";
        }

        echo "</table>";?></p>

</body>
</html>