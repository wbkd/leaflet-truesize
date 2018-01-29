import L from 'leaflet';
import turfCenter from '@turf/center';
import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfDestination from '@turf/destination';

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
    style: {
      color: '#886699',
      weight: 1,
      opacity: 1,
      dashArray: "5, 10"
    }
  },

  initialize(geoJSON = this.geoJSON, options) {
    const optionsStyle = options ? options.style : {};
    const style = Object.assign(this.options.style, optionsStyle);
    const _options = {};
    _options.style = style;
    L.Util.setOptions(this, _options);

    this._initGeoJson(geoJSON, _options);
  },

  _initGeoJson(geoJSON, options) {
    this._geoJSONLayer = L.geoJSON(geoJSON, options);
    // for unique plugin id
    this._currentId = id++;
  },

  onAdd(map) {
    this._map = map;
    this._geoJSONLayer.addTo(this._map);
    this._makeDraggable(this._geoJSONLayer._layers);
  },

  _makeDraggable(layersObj) {
    // use the first object(with dynmaic key) in the layersObj
    // because we initialize for every feature its own leaflet-geoJSON layer
    const currentLayer = layersObj[Object.keys(layersObj)[0]];

    const draggable = new L.Draggable(currentLayer._path);
    draggable
      .on('drag', evt => this._onDrag(evt, currentLayer))
      .enable();
  },

  _onDrag(evt, layer) {
    const newPoint = L.point(evt.originalEvent.clientX, evt.originalEvent.clientY);
    const latlng = this._map.layerPointToLatLng(newPoint);
    const newCenter = [latlng.lng, latlng.lat];

    const prevBearingDistance = this._getBearingDistance(layer);
    this._redraw(layer, newCenter, prevBearingDistance);
  },

  _getBearingDistance(layer) {
    // use turfcenter function instead of layer getcenter, because
    // layer will be added to map later
    const center = turfCenter(layer.feature).geometry.coordinates;
    return layer.feature.geometry.coordinates[0].map(coord => {
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
        "type": "Polygon",
        "coordinates": [newPoints]
      }
    }

    this._geoJSONLayer.clearLayers();
    this._geoJSONLayer.addData(newFeature);
    this._makeDraggable(this._geoJSONLayer._layers);
  },

  getEvents() {
    return {
      zoom: this.update,
      viewreset: this.update
    }
  },

  update(map) {
    return this;
  },

  onRemove(map) {
    this._map = map;
    this._map.removeLayer(this._geoJSONLayer);
  },
});

L.trueSize = (geoJSON, options) => new L.TrueSize(geoJSON, options);
