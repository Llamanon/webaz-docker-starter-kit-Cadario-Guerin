let osmLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }),
});

let test = new ol.Feature({
  geometry: new ol.geom.Point(ol.proj.fromLonLat([5.78, 43.98]))
});

test.setStyle(
  new ol.style.Style({
    image: new ol.style.Icon({
      src: 'assets/tacheo.jpg',
      scale: 1
    })
  })
);

let tacheo = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: [test]
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

map.addLayer(tacheo);