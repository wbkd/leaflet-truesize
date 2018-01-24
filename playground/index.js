const data = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              10.107421874999998,
              50.736455137010665
            ],
            [
              8.54736328125,
              49.28214015975995
            ],
            [
              12.0849609375,
              48.50204750525715
            ],
            [
              17.2265625,
              49.83798245308484
            ],
            [
              10.107421874999998,
              50.736455137010665
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              50.2734375,
              59.977005492196
            ],
            [
              57.30468749999999,
              55.3791104480105
            ],
            [
              72.421875,
              56.36525013685606
            ],
            [
              72.94921875,
              60.413852350464914
            ],
            [
              62.9296875,
              63.704722429433225
            ],
            [
              50.2734375,
              59.977005492196
            ]
          ]
        ]
      }
    }
  ]
};

const options = {
  style: {
    color: '#FF6666',
    weight: 4,
    opacity: 1,
    dashArray: "5, 10"
  }
};

const Playground = {
  init() {
    this._container = document.querySelector('#map');
    this._map = null;

    this.mountMap();
    this.draw();
  },
  mountMap() {
    this._map = L.map('map', {
      center: [53, 13.4],
      zoom: 2,
      zoomControl: false,
      zoomDelta: .25,
      zoomSnap: .25
    });

    new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
      attribution: `attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>`,
      detectRetina: true
    }).addTo(this._map);
  },
  draw() {
    new L.TrueSize(data, options).addTo(this._map);
  }
}

Playground.init();