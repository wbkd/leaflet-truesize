import L from 'leaflet';
import turf from '@turf/helpers';
import turfCenter from '@turf/center';

let id = 0;

L.TrueSize = L.Layer.extend({
  geoJSON: [],
  options: {
    style: {
      color: '#FF6666',
      weight: 4,
      opacity: 1,
      dashArray: "5, 10"
    }
  },

  initialize: function (geoJSON, options) {
    L.Util.setOptions(this, options);

    this._geoJSON = geoJSON;
    this._options = options;

    this.initShape();
  },

  initShape: function() {
    this._geoJsonLayer = L.geoJSON(this._geoJSON, this._options);
    this._currentId = id++;
  },

  onAdd: function (map) {
    this._map = map;
    this._geoJsonLayer.addTo(this._map);

    this._draggables = Object.keys(this._geoJsonLayer._layers).map(layer => {
      const draggable = new L.Draggable(this._geoJsonLayer._layers[layer]._path);
      draggable.enable();

      return draggable;
    });

    this.update(this._map);
  },

  getEvents: function () {
    return {
      zoom: this.update,
      viewreset: this.update
    };
  },

  update: function(map) {
    return this;
  },

  onRemove: function(map) {
    // this._map = map;
    // this._currentPath.parentNode.removeChild(this._currentPath);
    // this._map.removeLayer(this._currentMarker);
  }
});

L.trueSize = (geoJSON, options) => new L.TrueSize(geoJSON, options);
