const data = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          14.765625,
          50.98609893339354
        ],
        [
          13.359375,
          47.81315451752768
        ],
        [
          19.0283203125,
          49.15296965617042
        ],
        [
          24.1259765625,
          50.28933925329178
        ],
        [
          21.3134765625,
          54.87660665410869
        ],
        [
          14.501953124999998,
          53.54030739150022
        ],
        [
          14.765625,
          50.98609893339354
        ]
      ]
    ]
  }
};

const options = {
  style: {
    color: '#FF6666',
    weight: 1,
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