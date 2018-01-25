import L from 'leaflet';
import turfCenter from '@turf/center';
import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfDestination from '@turf/destination';

let id = 0;

L.TrueSize = L.Layer.extend({
  geoJSON: [],
  options: {
    style: {
      color: '#FF6666',
      weight: 1,
      opacity: 1,
      dashArray: "5, 10"
    }
  },

  initialize(geoJSON, options) {
    L.Util.setOptions(this, options);

    this._options = options;

    this.initGeoJson(geoJSON);
  },

  initGeoJson(geoJSON) {
    this._geoJSONLayer = L.geoJSON(geoJSON, this._options);
    this._currentId = id++;
  },

  onAdd(map) {
    this._map = map;
    this._geoJSONLayer.addTo(this._map);
    this._makeDraggable(this._geoJSONLayer._layers);


    this.update(this._map);
  },

  _onDrag(evt, layer) {
    const newPoint = L.point(evt.originalEvent.clientX, evt.originalEvent.clientY);
    const latlng = this._map.layerPointToLatLng(newPoint);
    const newCenter = [latlng.lng, latlng.lat];

    const prevBearingDistance = this._getBearingDistance(layer);

    this._redraw(layer, newCenter, prevBearingDistance);
  },

  _getBearingDistance(layer) {
    const center = turfCenter(layer.feature).geometry.coordinates;

    return layer.feature.geometry.coordinates[0].map(coord => {
      const bearing = turfBearing(center, coord);
      const distance = turfDistance(center, coord);
      return { bearing, distance };
    });
  },

  _redraw(layer, newCenter, bearingDistance) {
    const newPoints = bearingDistance.map(params => {
      return turfDestination(newCenter, params.distance, params.bearing).geometry.coordinates;
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

  _makeDraggable(layersObj) {
    const currentLayer = layersObj[Object.keys(layersObj)[0]];
    const draggable = new L.Draggable(currentLayer._path);
    draggable
      .on('drag', evt => this._onDrag(evt, currentLayer))
      .enable();
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
    // this._map = map;
    // this._currentPath.parentNode.removeChild(this._currentPath);
    // this._map.removeLayer(this._currentMarker);
  }
});

L.trueSize = (geoJSON, options) => new L.TrueSize(geoJSON, options);
