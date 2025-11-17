let osmLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }),
});

let wmsLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'https://api.ensg.eu/geoserver/wms',
        params: {
            LAYERS: 'ensg:hydro',
        },
    })
});


let map = new ol.Map({
    target: 'map',
    layers: [
        osmLayer
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([5.78, 43.96]),
        zoom: 15,
    }),
});