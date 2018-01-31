import L from 'leaflet';
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
    const currentLayer = this._geoJSONLayer.getLayers()[0];
    const centerCoords = currentLayer.getCenter();
    const center = [centerCoords.lng, centerCoords.lat];

    this._initialBearingDistance = this._getBearingDistance(currentLayer, center);

    this._draggableLayer = this._createDraggable(currentLayer);

    if (this._options.markerDiv.length) {
      this._dragMarker = this._createMarker(centerCoords, this._options);
      this._dragMarker.addTo(this._map);
    }
  },

  _createMarker(center, options) {
    const { markerClass, markerDiv } = options;
    const dragIcon = L.divIcon({ className: markerClass, html: markerDiv });
    const dragMarker = L.marker(center, { icon: dragIcon, draggable: true });

    return this._addHooks(dragMarker);
  },

  _createDraggable(layer) {
    const draggable = new L.Draggable(layer._path);
    draggable.enable();

    return this._addHooks(draggable);
  },

  _addHooks(item) {
    return item
      .on('drag', (evt) => this._onDrag(evt))
  },

  _onDrag(evt) {
    const { lng, lat } = this._map.mouseEventToLatLng(evt.originalEvent);
    this._redraw([lng, lat]);
  },

  _getBearingDistance(layer, center) {
    return turfCoordAll(layer.feature).map(coord => {
      const bearing = turfBearing(center, coord);
      const distance = turfDistance(center, coord, { units: 'kilometers' });
      return { bearing, distance };
    });
  },

  _redraw(newPos) {
    const newPoints = this._initialBearingDistance.map(params => {
      return turfDestination(newPos, params.distance, params.bearing, { units: 'kilometers' }).geometry.coordinates;
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
