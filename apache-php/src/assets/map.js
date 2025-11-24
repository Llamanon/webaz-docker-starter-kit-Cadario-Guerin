let wsmLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/projet_web/wms',
        crossOrigin: 'anonymous',
        params: { LAYERS: 'projet_web:objets' },
    }),
});

let osmLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }),
});

let objets_php = document.getElementById("data_objet").dataset.objets;
let objets = JSON.parse(objets_php);

let images_php = document.getElementById("data_image").dataset.objets;
let images = JSON.parse(images_php);

let map = new ol.Map({
    target: 'map',
    layers: [osmLayer],
    view: new ol.View({
        center: ol.proj.fromLonLat([5.773880655629994, 43.962061335298245]),
        zoom: 19,
    }),
});


let checkbox = document.getElementById('maCase');

checkbox.addEventListener('change', function() {
    if (this.checked) {
        map.addLayer(wsmLayer);
        console.log('ajouté');
    } else {
        map.removeLayer(wsmLayer);
        console.log('retire');
    }
});

let featuresDict = {};
objets.forEach(item => {
    let coords = JSON.parse(item.point).coordinates;
    let key = item.id;
    let temp_dispo = item.visible === 't';

    let image_corres = images.find(obj => obj.id_objet == item.id);
    featuresDict[key] = {
        coords: coords,
        minZoom: item.minzoomvisible,
        maxZoom: item.maxzoomvisible,
        icon: item.image,
        dispo: temp_dispo,
        echelle: image_corres.ratio_taille,
        classe: item.attribut
    };
});

let featuresList = [];
for (let id in featuresDict) {
    let f = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(featuresDict[id].coords))
    });
    f.set('id', id);
    f.set('minZoom', featuresDict[id].minZoom);
    f.set('maxZoom', featuresDict[id].maxZoom);
    f.set('icon', featuresDict[id].icon);
    f.set('dispo', featuresDict[id].dispo);
    f.set('echelle', featuresDict[id].echelle);
    f.set('classe', featuresDict[id].classe);
    featuresList.push(f);
    featuresDict[id].feature = f;
}

let couche = new ol.layer.Vector({
    source: new ol.source.Vector({ features: featuresList }),
    style: function (feature) {
        let zoom = map.getView().getZoom();
        let min = feature.get('minZoom');
        let max = feature.get('maxZoom');
        let dispo = feature.get('dispo');

        if (zoom < min || zoom > max) return null;

        if (dispo) return new ol.style.Style({
            image: new ol.style.Icon({
                src: feature.get('icon'),
                scale: feature.get('echelle')
            })
        });

        return null;
    }
});

map.addLayer(couche);

Vue.createApp({
    data() {
        return {
            user: "test",
            inventaire: [],
            selectedIndex: null,
            codeSaisi: "",
            codeSaisi2: "",
            el: null,
            el2: null,
            time: 0,
            timer: null,
            commentaire: "COUCOU, bienvenue à forca pour cette journée de stage ! Il faut que tu récupères le tachéomètre vert et que tu ailles stationner aux Mourres. Pour se faire, double-clic entre le banc et le panneau, zoom bien !"
          }
    },
    mounted() {
        document.getElementById('commentaire').textContent = this.commentaire;
        this.el = document.getElementById('popup');
        this.el2 = document.getElementById('popup2');

        this.timer = setInterval(() => {
            this.time++;
            let minutes = Math.floor(this.time / 60);
            let seconds = this.time % 60;
            let mm = minutes.toString().padStart(2, '0');
            let ss = seconds.toString().padStart(2, '0');
            document.getElementById('score').textContent = `Temps : ${mm}:${ss}`;
        }, 1000);

        map.on('moveend', () => {
            couche.getSource().getFeatures().forEach(f => f.changed());
        });

        map.on('dblclick', evt => {
            const featuress = map.forEachFeatureAtPixel(evt.pixel, f => f);

            if (featuress) {
              const src = couche.getStyle()(featuress).getImage().getSrc();
              let coord = evt.coordinate;
              if (featuress.get("classe") == "ob") {
                  if (this.selectedIndex != null && this.inventaire[this.selectedIndex].id == 2) {
                      this.commentaire = "le code est 5566, rend toi au centre ign à forca";
                      featuresDict[4].feature.set('dispo', true);
                      featuresDict[3].feature.set('dispo', false);
                  } else {
                      this.commentaire = 'choisi un ou le bon tacheo';
                  }
            }
            };
            document.getElementById('commentaire').textContent = this.commentaire;
        });

        map.on('click', evt => {
            const featuress = map.forEachFeatureAtPixel(evt.pixel, f => f);

            if (featuress) {
                const src = couche.getStyle()(featuress).getImage().getSrc();

                if (featuress.get("classe") == "or") {
                    this.ajouterObjet(src, featuress.get("id"));
                    couche.getSource().removeFeature(featuress);
                } else if (featuress.get("classe") == 'oc' && featuress.get("id") == 4) {
                    let popup = new ol.Overlay({
                        element: this.el,
                        positioning: 'bottom-center',
                        offset: [70, -30],
                    });
                    popup.setPosition(featuress.getGeometry().getCoordinates());
                    map.addOverlay(popup);
                    this.el.style.display = 'block';
                } else if (featuress.get("classe") == 'oc' && featuress.get("id") == 7) {
                    let popup2 = new ol.Overlay({
                        element: this.el2,
                        positioning: 'bottom-center',
                        offset: [70, -30],
                    });
                    popup2.setPosition(featuress.getGeometry().getCoordinates());
                    map.addOverlay(popup2);
                    this.el2.style.display = 'block';
                } else if (featuress.get("classe") == 'ob' && featuress.get("id") == 6) {
                    if (this.selectedIndex != null && this.inventaire[this.selectedIndex].id == 5) {
                        this.commentaire = "bien joué le code est 7788, va le donner au centre ign pour finir ta journee"
                        this.ajouterObjet("assets/ordi.png", 7);
                        featuress.set('dispo', false);
                        featuresDict[7].feature.set('dispo', true);
                    } else {
                      this.commentaire = 'tu es sur davoir trouve/selectionne la carte sd que tu as oublié à la boulangerie de forca';
                    }
                }
            };
            document.getElementById('commentaire').textContent = this.commentaire;
        });
    },
    methods: {
        ajouterObjet(src, id) {
            this.inventaire.push({ src, id });
        },
        imageCliquee(item, index) {
            this.selectedIndex = this.selectedIndex === index ? null : index;
        },
        validerCode() {
            if (this.codeSaisi == 5566) {
                this.commentaire = "bien, poursuis ta journée en allant à la chapelle de pierrerue pour de la photogra"
                featuresDict[6].feature.set('dispo', true);
                featuresDict[5].feature.set('dispo', true);
                this.el.style.display = 'none';
                featuresDict[4].feature.set('dispo', false);
            } else {
                this.commentaire = 'mauvais code';
            };
            document.getElementById('commentaire').textContent = this.commentaire;
        },
        validerCode2() {
            if (this.codeSaisi2 == 7788) {
                this.commentaire = "gagne"
                this.el2.style.display = 'none';
                featuresDict[7].feature.set('dispo', false);
                clearInterval(this.timer);

                const formData = new FormData();
                formData.append('timer', this.time);
                fetch("/time", {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                });
            } else {
                this.commentaire = 'mauvais code';
            };
            document.getElementById('commentaire').textContent = this.commentaire;
        }
    }
}).mount('#app');
