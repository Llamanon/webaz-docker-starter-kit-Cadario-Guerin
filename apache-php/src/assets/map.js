let osmLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/projet_web',
        crossOrigin: 'anonymous',
        params: { LAYERS: 'projet_web:objets' },
    }),
});

let wmsLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }),
});

let tacheo = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.fromLonLat([5.78, 43.98]))
});

tacheo.setStyle(
  new ol.style.Style({
    image: new ol.style.Icon({
      src: 'assets/tacheo.jpg',
      scale: 0.5
    })
  })
);
tacheo.set('name', tacheo);

let tacheo1 = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.fromLonLat([5.79, 43.98]))
});

tacheo1.setStyle(
  new ol.style.Style({
    image: new ol.style.Icon({
      src: 'assets/tacheo.jpg',
      scale: 0.5
    })
  })
);
tacheo1.set('name', tacheo1);

let couche = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [tacheo, tacheo1]
  })
});



let map = new ol.Map({
    target: 'map',
    layers: [
        osmLayer,
        //tacheo
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([5.78, 43.96]),
        zoom: 15,
    }),
});

map.addLayer(couche);





Vue.createApp({
    data() {
        return {
            user : "test",
            inventaire: [],
            selectedIndex: null
        }
    },
    mounted() {
        map.on('click', evt => {
            const featuress = map.forEachFeatureAtPixel(evt.pixel, f => f);
            const src = featuress.getStyle().getImage().getSrc();
            this.ajouterObjet(src);
            couche.getSource().removeFeature(featuress);
        });
    },
    methods: {
      ajouterObjet(item) {
          this.inventaire.push(item);
          console.log(this.inventaire)
      },
      imageCliquee(item, index) {
        if (this.selectedIndex == index) {
          this.selectedIndex = null
        } else {
        this.selectedIndex = index; 
        }
      }
    }  
}).mount('#inventaire');