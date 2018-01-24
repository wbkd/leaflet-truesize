(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('leaflet'), require('@webk1d/leaflet-curve'), require('@turf/helpers'), require('@turf/center')) :
	typeof define === 'function' && define.amd ? define(['leaflet', '@webk1d/leaflet-curve', '@turf/helpers', '@turf/center'], factory) :
	(factory(global.L,null,global.turf,global.turfCenter));
}(this, (function (L,leafletCurve,turf,turfCenter) { 'use strict';

L = L && L.hasOwnProperty('default') ? L['default'] : L;
turf = turf && turf.hasOwnProperty('default') ? turf['default'] : turf;
turfCenter = turfCenter && turfCenter.hasOwnProperty('default') ? turfCenter['default'] : turfCenter;

var id = 0;

L.SwoopyArrow = L.Layer.extend({
  fromLatlng: [],
  toLatlng: [],
  options: {
    color: '#222422',
    weight: 1,
    opacity: 1,
    factor: 0.5,
    arrowFilled: false,
    arrowId: null,
    minZoom: 0,
    maxZoom: 22,
    label: '',
    labelClassName: '',
    labelFontSize: 12,
    labelColor: '#222222',
    html: '',
    iconAnchor: [0, 0],
    iconSize: [50, 20]
  },

  initialize: function initialize(fromLatlng, toLatlng, options) {
    L.Util.setOptions(this, options);

    this._currentPathVisible = true;
    this._fromLatlng = L.latLng(fromLatlng);
    this._toLatlng = L.latLng(toLatlng);
    this._factor = this.options.factor;
    this._label = this.options.label;
    this._labelFontSize = this.options.labelFontSize;
    this._labelColor = this.options.labelColor;
    this._color = this.options.color;
    this._labelClassName = this.options.labelClassName;
    this._html = this.options.html;
    this._opacity = this.options.opacity;
    this._minZoom = this.options.minZoom;
    this._maxZoom = this.options.maxZoom;
    this._iconAnchor = this.options.iconAnchor;
    this._iconSize = this.options.iconSize;
    this._weight = this.options.weight;
    this._arrowFilled = this.options.arrowFilled;
    this._arrowId = this.options.arrowId;

    this._initSVG();
  },

  _initSVG: function _initSVG() {
    this._svg = L.SVG.create('svg');
    this._currentId = id++;
    this._arrow = this._createArrow();
    this._svg.appendChild(this._arrow);
  },

  onAdd: function onAdd(map) {
    this._map = map;
    this.getPane().appendChild(this._svg);

    this._drawSwoopyArrows();

    this.update(this._map);
  },

  getEvents: function getEvents() {
    return {
      zoom: this.update,
      viewreset: this.update
    };
  },

  _drawSwoopyArrows: function _drawSwoopyArrows() {
    var swoopyPath = this._createPath();
    this._currentPath = swoopyPath._path;

    var swoopyLabel = this._createLabel();
    this._currentMarker = L.marker([this._fromLatlng.lat, this._fromLatlng.lng], { icon: swoopyLabel }).addTo(this._map);
  },

  _createArrow: function _createArrow() {
    this._container = this._container || L.SVG.create('defs');
    var marker = L.SVG.create('marker');
    var path = L.SVG.create('polyline');

    marker.setAttribute('class', 'swoopyArrow__marker');
    marker.setAttribute('id', 'swoopyarrow__arrowhead' + this._currentId);
    marker.setAttribute('markerWidth', '6.75');
    marker.setAttribute('markerHeight', '6.75');
    marker.setAttribute('viewBox', '-10 -10 20 20');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('refX', '0');
    marker.setAttribute('refY', '0');
    marker.setAttribute('fill', 'none');
    marker.setAttribute('stroke', this._color);
    marker.setAttribute('stroke-width', this._weight);
    marker.setAttribute('opacity', this._opacity);

    path.setAttribute('stroke-linejoin', 'bevel');
    path.setAttribute('fill', this._arrowFilled ? this._color : 'none');
    path.setAttribute('stroke', this._color);
    path.setAttribute('points', '-6.75,-6.75 0,0 -6.75,6.75');
    marker.appendChild(path);

    this._container.appendChild(marker);

    return this._container;
  },

  _createPath: function _createPath() {
    var controlLatlng = this._getControlPoint(L.latLng(this._fromLatlng), L.latLng(this._toLatlng), this.options.factor);
    var pathOne = L.curve(['M', [this._fromLatlng.lat, this._fromLatlng.lng], 'Q', [controlLatlng.lat, controlLatlng.lng], [this._toLatlng.lat, this._toLatlng.lng]], {
      animate: false,
      color: this._color,
      fill: false,
      opacity: this._opacity,
      weight: this._weight,
      className: 'swoopyarrow__path'
    }).addTo(this._map);

    pathOne._path.setAttribute('id', 'swoopyarrow__path' + this._currentId);
    pathOne._path.setAttribute('marker-end', !this._arrowId ? 'url(#swoopyarrow__arrowhead' + this._currentId + ')' : 'url(' + this._arrowId + ')');

    return pathOne;
  },

  _rotatePoint: function _rotatePoint(origin, point, angle) {
    var radians = angle * Math.PI / 180.0;

    return {
      x: Math.cos(radians) * (point.x - origin.x) - Math.sin(radians) * (point.y - origin.y) + origin.x,
      y: Math.sin(radians) * (point.x - origin.x) + Math.cos(radians) * (point.y - origin.y) + origin.y
    };
  },

  _getControlPoint: function _getControlPoint(start, end, factor) {
    var features = turf.featureCollection([turf.point([start.lat, start.lng]), turf.point([end.lat, end.lng])]);

    var center = turfCenter(features);

    // get pixel coordinates for start, end and center
    var startPx = this._map.latLngToContainerPoint(start);
    var centerPx = this._map.latLngToContainerPoint(L.latLng(center.geometry.coordinates[0], center.geometry.coordinates[1]));
    var rotatedPx = this._rotatePoint(centerPx, startPx, 90);

    var distance = Math.sqrt(Math.pow(startPx.x - centerPx.x, 2) + Math.pow(startPx.y - centerPx.y, 2));
    var angle = Math.atan2(rotatedPx.y - centerPx.y, rotatedPx.x - centerPx.x);
    var offset = factor * distance - distance;

    var sin = Math.sin(angle) * offset;
    var cos = Math.cos(angle) * offset;

    var controlPoint = L.point(rotatedPx.x + cos, rotatedPx.y + sin);

    return this._map.containerPointToLatLng(controlPoint);
  },

  _createLabel: function _createLabel() {
    return L.divIcon({
      className: this._html === '' && this._labelClassName,
      html: this._html === '' ? '<span id="marker-label' + this._currentId + '" style="font-size: ' + this._labelFontSize + 'px; color: ' + this._labelColor + '">' + this._label + '</span>' : this._html,
      iconAnchor: this._iconAnchor,
      iconSize: this._iconSize
    });
  },

  update: function update(map) {
    this._checkZoomLevel();

    var arrowHead = this._svg.getElementById('swoopyarrow__arrowhead' + this._currentId);
    arrowHead.setAttribute('markerWidth', '' + 2.5 * this._map.getZoom());
    arrowHead.setAttribute('markerHeight', '' + 2.5 * this._map.getZoom());

    return this;
  },

  _checkZoomLevel: function _checkZoomLevel() {
    var currentZoomLevel = this._map.getZoom();

    if (!this._currentPathVisible) {
      this._currentPath.setAttribute('opacity', this._opacity);
      this._currentMarker.setOpacity(this._opacity);
    }

    if (currentZoomLevel < this._minZoom || currentZoomLevel > this._maxZoom) {
      this._currentPath.setAttribute('opacity', 0);
      this._currentMarker.setOpacity(0);

      this._currentPathVisible = false;
    }
  },

  onRemove: function onRemove(map) {
    this._map = map;
    this._currentPath.parentNode.removeChild(this._currentPath);
    this._map.removeLayer(this._currentMarker);
  }
});

L.swoopyArrow = function (fromLatlng, toLatlng, options) {
  return new L.SwoopyArrow(fromLatlng, toLatlng, options);
};

})));
//# sourceMappingURL=Leaflet.TrueSize.js.map
