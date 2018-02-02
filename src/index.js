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
    color: '#FF0000',
    stroke: true,
    weight: 1,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round',
    dashArray: null,
    dashOffset:	null,
    fill:	true,
    fillColor: '#FF0000',
    fillOpacity:	0.3,
    fillRule: 'evenodd',
    className: null,
    markerDiv: null,
    markerClass: null,
    iconAnchor: []
  },

  initialize(geoJSON = this.geoJSON, options = {}) {
    // merge default and passed options
    this._options = Object.assign({}, this.options, options);
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
    this._currentLayer = this._geoJSONLayer.getLayers()[0];
    const centerCoords = this._currentLayer.getCenter();
    const center = [centerCoords.lng, centerCoords.lat];

    // wrap currentlayer into draggable layer
    this._draggableLayer = this._createDraggable(this._currentLayer);

    if (this._options.markerDiv && this._options.markerDiv.length) {
      this._dragMarker = this._createMarker(centerCoords, this._options);
      this._dragMarker.addTo(this._map);
    }
  },

  _createMarker(center, options) {
    const { markerClass, markerDiv, iconAnchor } = options;
    const dragIcon = L.divIcon({ className: markerClass, html: markerDiv, iconAnchor });
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
      .on('dragstart', (evt) => this._onDragStart(evt, this._currentLayer))
      .on('drag', (evt) => this._onDrag(evt, this._currentLayer))
  },

  _onDragStart(evt) {
    const startPos = this._getLatLngFromEvent(evt);
    this._initialBearingDistance = this._getBearingDistance(startPos);
  },

  _onDrag(evt) {
    const { lng, lat } = this._map.mouseEventToLatLng(evt.originalEvent);
    this._redraw([lng, lat]);
  },

  _getLatLngFromEvent(evt) {
    if (evt.target._latlng) {
      // marker
      const { lng, lat } = evt.target._latlng;
      return [lng, lat];
    } else {
      // layer
      const { left, top } = this._map._container.getClientRects()[0];
      const { x ,y } = evt.target._startPoint;
      const pos = L.point(x - left, y - top);
      const { lng, lat } = this._map.containerPointToLatLng(pos);
      return [lng, lat];
    }
    return [];
  },

  _getBearingDistance(center) {
    return turfCoordAll(this._currentLayer.feature).map(coord => {
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
    this._currentLayer = this._geoJSONLayer.getLayers()[0];

    // add draggable hook again, as we using internal a new layer
    // center marker if existing
    this._draggableLayer = this._createDraggable(this._currentLayer);
    this._dragMarker && this._dragMarker.setLatLng(this._currentLayer.getCenter());
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
