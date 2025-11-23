let osmLayer = new ol.layer.Tile({
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
tacheo.set('name', 'tacheo');

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
tacheo1.set('name', 'tacheo1');

let tacheo2 = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.fromLonLat([5.80, 43.98]))
});

tacheo2.setStyle(
  new ol.style.Style({
    image: new ol.style.Icon({
      src: 'assets/tacheo.jpg',
      scale: 0.5
    })
  })
);
tacheo2.set('name', 'tacheo2');

let couche = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [tacheo, tacheo1, tacheo2]
  }),
  minZoom: 14,  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// a chnager
  maxZoom: 17
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
            selectedIndex: null,
            codeSaisi: "",
          }
    },
    mounted() {
      let el = document.getElementById('popup');
      let dico = {tacheo : 1, tacheo1 : 2, tacheo2 : 1};



          

      map.on('click', evt => {
          const featuress = map.forEachFeatureAtPixel(evt.pixel, f => f);
          if (featuress) {
            const src = featuress.getStyle().getImage().getSrc();
            if (dico[featuress.get("name")] == 1) {
              this.ajouterObjet(src);
              couche.getSource().removeFeature(featuress);
            } else if (dico[featuress.get("name")] == 2) {
              let popup = new ol.Overlay({
                  element: el,
                  positioning: 'bottom-center',
                  offset: [70, -30],
              });
              popup.setPosition(featuress.getGeometry().getCoordinates());
              map.addOverlay(popup);
              el.style.display = 'block'; 
            };
          };
      });
    },
    methods: {
      ajouterObjet(item) {
          this.inventaire.push(item);
          console.log(this.inventaire);
      },
      imageCliquee(item, index) {
        if (this.selectedIndex == index) {
          this.selectedIndex = null
        } else {
        this.selectedIndex = index; 
        }
      },
      validerCode() {
        console.log("Code saisi :", this.codeSaisi);
        // ici tu peux faire ce que tu veux avec le code
        // par exemple fermer le popup
      }
    }  
}).mount('#app');