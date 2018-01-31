import L from 'leaflet';
import turfCenter from '@turf/center';
import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfDestination from '@turf/destination';
import { coordAll as turfCoordAll } from '@turf/meta';

let id = 0;

L.TrueSize = L.Layer.extend({
  geoJSON: {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": []
    }
  },
  options: {
    color: '#886699',
    weight: 1,
    opacity: 1,
    markerDiv: '',
    markerClass: ''
  },

  initialize(geoJSON = this.geoJSON, options = {}) {
    // merge default and passed options
    this._options = L.Util.extend(this.options, options);

    this._geometryType = geoJSON.geometry.type;

    L.Util.setOptions(this, this._options);
    this._initGeoJson(geoJSON, this._options);
  },

  _initGeoJson(geoJSON, options) {
    this._geoJSONLayer = L.geoJSON(geoJSON, options);
    // for unique plugin id
    this._currentId = id++;
  },

  onAdd(map) {
    this._map = map;
    this._geoJSONLayer.addTo(this._map);

    // our currentlayer is always the first layer of geoJson layersgroup
    // but has a dynamic key
    const currentLayer = this._geoJSONLayer._layers[Object.keys(this._geoJSONLayer._layers)[0]];

    this._draggableLayer = this._createDraggable(currentLayer);

    if (this._options.markerDiv.length) {
      this._dragMarker = this._createMarker(currentLayer, this._options);
      this._dragMarker.addTo(this._map);
    }
  },

  _createMarker(layer, options) {
    const { markerClass, markerDiv } = options;
    const dragIcon = L.divIcon({ className: markerClass, html: markerDiv });
    const dragMarker = L.marker(layer.getCenter(), { icon: dragIcon, draggable: true });

    return this._addHooks(dragMarker, layer);
  },

  _createDraggable(layer) {
    const draggable = new L.Draggable(layer._path);
    draggable.enable();

    return this._addHooks(draggable, layer);
  },

  _addHooks(item, layer) {
    return item.on('drag', evt => this._onDrag(evt, layer));
  },

  _onDrag(evt, layer) {
    const { clientX, clientY } = evt.originalEvent;
    const pointerPos = L.point(clientX, clientY);
    const { lng, lat } = this._map.containerPointToLatLng(pointerPos);

    const newCenter = [lng, lat];
    const prevBearingDistance = this._getBearingDistance(layer);
    this._redraw(layer, newCenter, prevBearingDistance);
  },

  _getBearingDistance(layer) {
    const prevCenter = turfCenter(layer.feature).geometry.coordinates;
    return turfCoordAll(layer.feature).map(coord => {
      const bearing = turfBearing(prevCenter, coord);
      const distance = turfDistance(prevCenter, coord, { units: 'kilometers' });
      return { bearing, distance };
    });
  },

  _redraw(layer, newCenter, bearingDistance) {
    const newPoints = bearingDistance.map(params => {
      return turfDestination(newCenter, params.distance, params.bearing, { units: 'kilometers' }).geometry.coordinates;
    });

    const newFeature = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": this._geometryType,
        "coordinates": this._getCoordsByType(newPoints, this._geometryType)
      }
    }

    this._geoJSONLayer.clearLayers();
    this._geoJSONLayer.addData(newFeature);
    // our currentlayer is always the first layer of geoJson layersgroup
    // but has a dynamic key
    const currentLayer = this._geoJSONLayer._layers[Object.keys(this._geoJSONLayer._layers)[0]];

    // add draggable hook again, as we using internal a new layer
    // center marker if existing
    this._draggableLayer = this._createDraggable(currentLayer);
    this._dragMarker && this._dragMarker.setLatLng(currentLayer.getCenter());
  },

  onRemove(map) {
    this._map = map;
    this._map.removeLayer(this._geoJSONLayer);
    if (this._dragMarker) {
      this._map.removeLayer(this._dragMarker);
    }

    return this;
  },

  _getCoordsByType(point, type) {
    switch (type) {
      case 'LineString': {
        return point;
        break;
      }
      case 'Polygon': {
        return [point];
        break;
      }
      case 'MultiPolygon': {
        return [[point]];
        break;
      }
      default: {
        return [point];
        break;
      }
    }
  }
});

L.trueSize = (geoJSON, options) => new L.TrueSize(geoJSON, options);
