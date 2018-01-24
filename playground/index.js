const Playground = {
  init() {
    this._container = document.querySelector('#map');
    this._map = null;

    this.mountMap();
  },
  mountMap() {
    this._map = L.map('map', {
      center: [53, 13.4],
      zoom: 10,
      zoomControl: false,
      zoomDelta: .25,
      zoomSnap: .25
    });

    new L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png', {
      attribution: `attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>`,
      detectRetina: true
    }).addTo(this._map);
  }
}

Playground.init();