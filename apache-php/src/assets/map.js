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


let dico = {tacheo : 1, tacheo1 : 2, tacheo2 : 3, tacheoGS : 1, carteSD: 1};

//tacheo et tacheoGS à forca des le debut sur le meme point
//tacheo1 a forca pour le code
//tacheo2 a saint pierre pour les photos



let map = new ol.Map({
    target: 'map',
    layers: [
        osmLayer
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([5.773880655629994, 43.962061335298245]),
        zoom: 19,
    }),
});

/*
let featuresList = [tacheo, tacheo1, tacheo2, tacheoGS];
let minZoomList   = [17, 4, 4, 17];
let maxZoomList   = [19, 5, 5, 19];


featuresList.forEach((f, i) => {
    f.set('minZoom', minZoomList[i]);
    f.set('maxZoom', maxZoomList[i]);
});

*/


let featuresDict = {
  tacheo: {
    coords: [5.7741, 43.96225],
    minZoom: 17,
    maxZoom: 19,
    icon: 'assets/tacheo.jpg',
    dispo: true,
    echelle: 0.3
  },
  tacheo1: {
    coords: [5.7741, 43.96225],
    minZoom: 14,
    maxZoom: 19,
    icon: 'assets/tacheo.jpg',
    dispo: false,
    echelle: 0.3
  },
  tacheo2: {
    coords: [5.8387194, 43.9676102],
    minZoom: 12,
    maxZoom: 19,
    icon: 'assets/tacheo.jpg',
    dispo: true,
    echelle: 0.3
  },
  tacheoGS: {
    coords: [5.7741, 43.96225],
    minZoom: 17,
    maxZoom: 19,
    icon: 'assets/tacheo2.jpg',
    dispo: true,
    echelle: 0.1
  },
  carteSD: {
    coords: [5.7789702, 43.960561],
    minZoom: 14,
    maxZoom: 19,
    icon: 'assets/carteSD.png',
    dispo: true,
    echelle: 0.03
  },
  ordi: {
    coords: [5.7741, 43.96225],
    minZoom: 14,
    maxZoom: 19,
    icon: 'assets/ordi.png',
    dispo: false,
    echelle: 0.3
  }
};

let featuresList = [];
for (let name in featuresDict) {
  let f = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(featuresDict[name].coords))
  });
  f.set('name', name);
  f.set('minZoom', featuresDict[name].minZoom);
  f.set('maxZoom', featuresDict[name].maxZoom);
  f.set('icon', featuresDict[name].icon);
  f.set('dispo', featuresDict[name].dispo);
  f.set('echelle', featuresDict[name].echelle)
  featuresList.push(f);
  featuresDict[name].feature = f;
};

let couche = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: featuresList
  }),
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
    return null
  }
});

/*

let couche = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: featuresList
  }),
  style: function (feature) {
    let zoom = map.getView().getZoom();
    let min = feature.get('minZoom');
    let max = feature.get('maxZoom');

    if (zoom < min || zoom > max) return null;

    return new ol.style.Style({
      image: new ol.style.Icon({
        src: 'assets/tacheo.jpg',
        scale: 0.3
      })
    });
  }
});


*/





map.addLayer(couche);


let time = 0;

setInterval(() => {
    time++;

    // convertit en mm:ss
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    let mm = minutes.toString().padStart(2, '0');
    let ss = seconds.toString().padStart(2, '0');

    document.getElementById('score').textContent = `Temps : ${mm}:${ss}`;
}, 1000);



Vue.createApp({
    data() {
        return {
            user : "test",
            inventaire: [],
            selectedIndex: null,
            codeSaisi: "",
            el: null,
          }
    },
    mounted() {
      this.el = document.getElementById('popup');
      let time = 0;

      setInterval(() => {
          time++;

        // convertit en mm:ss
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        let mm = minutes.toString().padStart(2, '0');
        let ss = seconds.toString().padStart(2, '0');

        document.getElementById('score').textContent = `Temps : ${mm}:${ss}`;
      }, 1000);


      map.on('moveend', () => {
        couche.getSource().getFeatures().forEach(f => {
          f.changed();
        });

      });
      map.on('dblclick', evt => {
        let coord = evt.coordinate;
        if (coord[0] >= 643060.5345882539 && coord[0] <= 643071.2921793308 && coord[1] >= 5462232.7063586535 && coord[1] <= 5462244.240776347) {
          if (this.selectedIndex != null && this.inventaire[this.selectedIndex].name == 'tacheoGS') {
            console.log('le code est 5566');
            featuresDict['tacheo1'].feature.set('dispo', true);
          } else {
            console.log('choisi un/le bon tacheo')
          };
        } else {
          console.log('pas au bon endroit')
          
        }
      });

      map.on('click', evt => {
        let center = evt.coordinate; // renvoie en projection EPSG:3857 ------------------------------------------------------------------------------
        let lonLat = ol.proj.toLonLat(center);  // convertit en [lon, lat]
        console.log(lonLat, center);
          const featuress = map.forEachFeatureAtPixel(evt.pixel, f => f);
          if (featuress) {
            const src = couche.getStyle()(featuress).getImage().getSrc();
            if (dico[featuress.get("name")] == 1) {
              this.ajouterObjet(src, featuress.get("name"));
              couche.getSource().removeFeature(featuress);
            } else if (dico[featuress.get("name")] == 2) {
              let popup = new ol.Overlay({
                  element: this.el,
                  positioning: 'bottom-center',
                  offset: [70, -30],
              });
              popup.setPosition(featuress.getGeometry().getCoordinates());
              map.addOverlay(popup);
              this.el.style.display = 'block'; 
            } else if (dico[featuress.get("name")] == 3) {
              console.log('bloque');
              if (this.selectedIndex != null && this.inventaire[this.selectedIndex].name == 'carteSD') {
                this.ajouterObjet("assets/ordi.png", "ordi");
                featuress.set('dispo', false);
                featuresDict['ordi'].feature.set('dispo', true);
              }
            }
          };
      });
    },
    methods: {
      ajouterObjet(src, name) {
        this.inventaire.push({
          src: src,
          name: name
        });
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
        if (this.codeSaisi == 5566) {
          featuresDict['tacheo2'].feature.set('dispo', true);
          this.el.style.display = 'none';
          featuresDict['tacheo1'].feature.set('dispo', false);
        } else {
          console.log('mauvais code')
        }
      }
    }  
}).mount('#app');