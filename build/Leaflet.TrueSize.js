(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('leaflet'), require('@turf/helpers'), require('@turf/center')) :
	typeof define === 'function' && define.amd ? define(['leaflet', '@turf/helpers', '@turf/center'], factory) :
	(factory(global.L,global.helpers,global.center));
}(this, (function (L,helpers,center) { 'use strict';

L = L && L.hasOwnProperty('default') ? L['default'] : L;
helpers = helpers && helpers.hasOwnProperty('default') ? helpers['default'] : helpers;
center = center && center.hasOwnProperty('default') ? center['default'] : center;

var id = 0;

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

  initialize: function initialize(geoJSON, options) {
    L.Util.setOptions(this, options);

    this._geoJSON = geoJSON;
    this._options = options;

    this.initShape();
  },

  initShape: function initShape() {
    this._geoJsonLayer = L.geoJSON(this._geoJSON, this._options);
    this._currentId = id++;
  },

  onAdd: function onAdd(map) {
    var _this = this;

    this._map = map;
    this._geoJsonLayer.addTo(this._map);

    this._draggables = Object.keys(this._geoJsonLayer._layers).map(function (layer) {
      var draggable = new L.Draggable(_this._geoJsonLayer._layers[layer]._path);
      draggable.enable();

      return draggable;
    });

    this.update(this._map);
  },

  getEvents: function getEvents() {
    return {
      zoom: this.update,
      viewreset: this.update
    };
  },

  update: function update(map) {
    return this;
  },

  onRemove: function onRemove(map) {
    // this._map = map;
    // this._currentPath.parentNode.removeChild(this._currentPath);
    // this._map.removeLayer(this._currentMarker);
  }
});

L.trueSize = function (geoJSON, options) {
  return new L.TrueSize(geoJSON, options);
};

})));
//# sourceMappingURL=Leaflet.TrueSize.js.map
