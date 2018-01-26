const Playground = {
  init(_config = {}) {
    this._container = document.querySelector(_config.containerId);

    this._map = this.mountMap(this._container);
    this._plugin = this.mountPlugin(this._map, _config.data, _config.options);
    this.addButtonHandler(this._container, this._map, this._plugin);
  },

  mountMap(_container) {
    const mapNode = _container.querySelector('.map');

    const map = L.map(mapNode, {
      center: [53, 13.4],
      zoom: 2,
      zoomControl: false,
      zoomDelta: .25,
      zoomSnap: .25
    });

    new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
      attribution: `attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>`,
      detectRetina: true
    }).addTo(map);

    return map;
  },

  mountPlugin(_map, _data, _options) {
    return new L.TrueSize(_data, _options).addTo(_map);
  },

  addButtonHandler(_container, _map, _plugin) {
    const removeBtn = _container.querySelector('.remove');
    removeBtn.addEventListener('click', () => _map.removeLayer(_plugin));
  },
}

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

Playground.init({containerId: '#map1', data, options});