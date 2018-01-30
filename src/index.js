import L from 'leaflet';
import turfCenter from '@turf/center';
import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfDestination from '@turf/destination';
import { coordAll as turfCoordAll } from '@turf/meta';
import turfUnion from '@turf/union';
import turf from '@turf/helpers';

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
    this._makeDraggable(currentLayer);

    this._options.markerDiv.length && this._addMarker(currentLayer, this._options);
  },

  _addMarker(layer, options) {
    const { markerClass, markerDiv } = options;
    const dragIcon = L.divIcon({ className: markerClass, html: markerDiv });
    this._dragMarker = L.marker(layer.getCenter(), { icon: dragIcon, draggable: true })
      .on('drag', evt => this._onDrag(evt, layer))
      .addTo(this._map);
  },

  _makeDraggable(layer) {
    const draggable = new L.Draggable(layer._path);
    draggable
      .on('drag', evt => this._onDrag(evt, layer))
      .enable();
  },

  _onDrag(evt, layer) {
    const newPoint = L.point(evt.originalEvent.clientX, evt.originalEvent.clientY);
    const latlng = this._map.containerPointToLatLng(newPoint);

    const newCenter = [latlng.lng, latlng.lat];
    const prevBearingDistance = this._getBearingDistance(layer);
    this._redraw(layer, newCenter, prevBearingDistance);
  },

  _getBearingDistance(layer) {
    const center = turfCenter(layer.feature).geometry.coordinates;

    return turfCoordAll(layer.feature).map(coord => {
      const bearing = turfBearing(center, coord);
      const distance = turfDistance(center, coord, { units: 'kilometers' });
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
    this._makeDraggable(currentLayer);
    this._dragMarker && this._dragMarker.setLatLng(currentLayer.getCenter());
  },

  onRemove(map) {
    this._map = map;
    this._map.removeLayer(this._geoJSONLayer);
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
