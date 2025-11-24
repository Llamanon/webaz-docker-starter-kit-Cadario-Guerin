<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAP</title>
    <link rel="stylesheet" href="https://unpkg.com/ol/ol.css">
    <script src="https://unpkg.com/ol/dist/ol.js"></script>
    <link rel="stylesheet" href="assets/map.css">
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
</head>
<body>
    <div id="map"></div>

    <div id="app">
        <div id ="inventaire">
            <h2> Inventaire de {{ user }}</h2>
            <img v-for="(item, index) in inventaire" 
                :src="item.src" 
                class="image"
                :class="{ selected: index === selectedIndex }"
                @click="imageCliquee(item, index)">
        </div>
        <div id="popup">
            <p>Entrez le code :</p>
            <input type="text" id="code-input" v-model="codeSaisi" placeholder="Votre code ici">
            <button @click="validerCode">Valider</button>
        </div>
        <div id="popup2">
            <p>Entrez le code :</p>
            <input type="text" id="code-input" v-model="codeSaisi2" placeholder="Votre code ici">
            <button @click="validerCode2">Valider</button>
        </div>
    </div>

    <div id="commentaire">commentaire</div>

    <div id="score">Temps : {{ timer }} s</div>

    <div id="data_objet" data-objets='<?php echo $objets_json; ?>'> </div>

    <div id="data_image" data-objets='<?php echo $images_json; ?>'> </div>

    

    <script src="assets/map.js"></script>
</body>
</html>