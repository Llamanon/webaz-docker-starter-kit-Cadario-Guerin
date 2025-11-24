let wsmLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/projet_web',
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


let objets_php =  document.getElementById("data_objet").dataset.objets;
let objets = JSON.parse(objets_php);

let images_php =  document.getElementById("data_image").dataset.objets;
let images = JSON.parse(images_php);
console.log(images);

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



let featuresDict = {};

objets.forEach(item => {
  let coords = item.point.replace(/[()]/g, '').split(',').map(Number);
  let key = item.id;
  let temp_dispo = ''
  if (item.visible == 't') {
    temp_dispo = true
  } else {
    temp_dispo = false
  }

  let image_corres = images.find(obj => obj.id_objet == item.id)

  featuresDict[key] = {
    coords: coords,
    minZoom: parseInt(item.minzoomvisible),
    maxZoom: parseInt(item.maxzoomvisible),
    icon: item.image,
    dispo: temp_dispo,
    echelle: image_corres.ratio_taille,
    classe: item.attribut
  };
});


/*
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

*/

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
  f.set('echelle', featuresDict[id].echelle)
  f.set('classe', featuresDict[id].classe)
  featuresList.push(f);
  featuresDict[id].feature = f;
};

console.log(featuresDict);



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
console.log(featuresDict)
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




Vue.createApp({
    data() {
        return {
            user : "test",
            inventaire: [],
            selectedIndex: null,
            codeSaisi: "",
            codeSaisi2: "",
            el: null,
            el2: null,
            time: 0,
            timer: null
          }
    },
    mounted() {
      this.el = document.getElementById('popup');
      this.el2 = document.getElementById('popup2');

      this.timer = setInterval(() => {
          this.time++;

        // convertit en mm:ss
        let minutes = Math.floor(this.time / 60);
        let seconds = this.time % 60;

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
            if (this.selectedIndex != null && this.inventaire[this.selectedIndex].id == 2) {
            console.log('le code est 5566');
            featuresDict[4].feature.set('dispo', true);
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
        console.log(ol.proj.toLonLat([643060.5345882539, 5462232.7063586535]), center);
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
            } else if (featuress.get("classe") == 'ob') {
              console.log('bloque');
              if (this.selectedIndex != null && this.inventaire[this.selectedIndex].id == 5) {
                this.ajouterObjet("assets/ordi.png", 7);
                featuress.set('dispo', false);
                featuresDict[7].feature.set('dispo', true);
              }
            }
          };
      });
    },
    methods: {
      ajouterObjet(src, id) {
        this.inventaire.push({
          src: src,
          id: id
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
          featuresDict[6].feature.set('dispo', true);
          featuresDict[5].feature.set('dispo', true)
          this.el.style.display = 'none';
          featuresDict[4].feature.set('dispo', false);
        } else {
          console.log('mauvais code')
        }
      },
      validerCode2() {
        console.log("Code saisi :", this.codeSaisi2);
        if (this.codeSaisi2 == 7788) {
          this.el2.style.display = 'none';
          featuresDict[7].feature.set('dispo', false);
          clearInterval(this.timer);
          
          console.log('oui je suis la')
          const formData = new FormData();
          formData.append('timer', this.time);
          console.log(this.time, formData)
            fetch("/time", {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                }
            });
        } else {
          console.log('mauvais code')
        }
      }
    }  
}).mount('#app');