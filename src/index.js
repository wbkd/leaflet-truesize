import L from 'leaflet';
import turfBearing from '@turf/bearing';
import turfDistance from '@turf/distance';
import turfDestination from '@turf/destination';
import { coordAll as turfCoordAll } from '@turf/meta';

let id = 0;

L.TrueSize = L.Layer.extend({
  geoJSON: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: []
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
    dashOffset: null,
    fill: true,
    fillColor: '#FF0000',
    fillOpacity: 0.3,
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
    this._isMultiPolygon = this._geometryType === 'MultiPolygon';

    L.Util.setOptions(this, this._options);
    this._initGeoJson(geoJSON, this._options);
  },

  _initGeoJson(geoJSON, options) {
    this._geoJSONLayer = L.geoJSON(geoJSON, options);

    // for unique plugin id
    this._currentId = id++;
  },

  setCenter(center) {
    this._redraw(center.slice(0).reverse());
  },

  reset() {
    if (!this._origCenter) {
      return false;
    }

    this._redraw(this._origCenter);
  },

  onAdd(map) {
    this._map = map;
    this._geoJSONLayer.addTo(this._map);

    // our currentlayer is always the first layer of geoJson layersgroup
    // but has a dynamic key
    this._currentLayer = this._geoJSONLayer.getLayers()[0];
    const centerCoords = this._currentLayer.getCenter();
    this._origCenter = [centerCoords.lng, centerCoords.lat];

    // wrap currentlayer into draggable layer
    this._createDraggable(this._currentLayer);

    this._initialBearingDistance = this._getBearingDistance([
      centerCoords.lng,
      centerCoords.lat
    ]);

    if (this._options.markerDiv && this._options.markerDiv.length) {
      this._dragMarker = this._createMarker(centerCoords, this._options);
      this._dragMarker.addTo(this._map);
    }
  },

  _createMarker(center, options) {
    const { markerClass, markerDiv, iconAnchor } = options;
    const dragIcon = L.divIcon({
      className: markerClass,
      html: markerDiv,
      iconAnchor
    });

    return L.marker(center, { icon: dragIcon, draggable: true })
      .on('dragstart', this._onMarkerDragStart, this)
      .on('drag', this._onMarkerDrag, this);
  },

  _onMarkerDragStart(evt) {
    const { lng, lat } = evt.target._latlng;
    const center = this._currentLayer.getCenter();

    this._dragOffset = [lng - center.lng, lat - center.lat];
  },

  _onMarkerDrag(evt) {
    this._redraw([evt.latlng.lng, evt.latlng.lat]);
  },

  _createDraggable(layer) {
    const draggablePath = new L.Draggable(layer._path);
    draggablePath.enable();

    draggablePath
      .on('dragstart', this._onDragStart, this)
      .on('drag', this._onDrag, this);
  },

  _onDragStart(evt) {
    const event = evt.touches ? evt.touches[0] : evt.target;
    const pos = this._getPositionFromEvent(event);
    const coords = this._getLatLngFromPosition(pos);
    const center = this._currentLayer.getCenter();

    this._dragOffset = [coords[0] - center.lng, coords[1] - center.lat];
  },

  _onDrag(evt) {
    const event = evt.touches ? evt.touches[0] : evt.originalEvent;
    const pos = this._getPositionFromEvent(event);
    const coords = this._getLatLngFromPosition(pos);

    this._redraw([
      coords[0] - this._dragOffset[0],
      coords[1] - this._dragOffset[1]
    ]);
  },

  _getPositionFromEvent(evt) {
    if (typeof evt._startPoint !== 'undefined') {
      return evt._startPoint;
    }

    return { x: evt.clientX, y: evt.clientY };
  },

  _getLatLngFromPosition(pos) {
    const { left, top } = this._map._container.getClientRects()[0];
    const { x, y } = pos;

    const posWithOffset = L.point(x - left, y - top);
    const { lng, lat } = this._map.containerPointToLatLng(posWithOffset);
    return [lng, lat];
  },

  _getBearingDistance(center) {
    if (this._isMultiPolygon) {
      return this._currentLayer.feature.geometry.coordinates[0].map(coords =>
        coords.map(coord => this._getBearingAndDistance(center, coord))
      );
    }

    return turfCoordAll(this._currentLayer.feature).map(coord =>
      this._getBearingAndDistance(center, coord)
    );
  },

  _getBearingAndDistance(center, coord) {
    const bearing = turfBearing(center, coord);
    const distance = turfDistance(center, coord, { units: 'kilometers' });
    return { bearing, distance };
  },

  _redraw(newPos) {
    let newPoints;

    if (this._isMultiPolygon) {
      newPoints = this._initialBearingDistance.map(params => [
        params.map(param => {
          return turfDestination(newPos, param.distance, param.bearing, {
            units: 'kilometers'
          }).geometry.coordinates;
        })
      ]);
    } else {
      newPoints = this._initialBearingDistance.map(param => {
        return turfDestination(newPos, param.distance, param.bearing, {
          units: 'kilometers'
        }).geometry.coordinates;
      });
    }

    const newFeature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: this._geometryType,
        coordinates: this._getCoordsByType(newPoints, this._geometryType)
      }
    };

    this._geoJSONLayer.clearLayers();
    this._geoJSONLayer.addData(newFeature);
    // our currentlayer is always the first layer of geoJson layersgroup
    // but has a dynamic key
    this._currentLayer = this._geoJSONLayer.getLayers()[0];
    // add draggable hook again, as we using internal a new layer
    // center marker if existing
    this._createDraggable(this._currentLayer);
    this._dragMarker &&
      this._dragMarker.setLatLng(this._currentLayer.getCenter());
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
      }
      case 'Polygon': {
        return [point];
      }
      case 'MultiPolygon': {
        return point;
      }
      default: {
        return [point];
      }
    }
  }
});

L.trueSize = (geoJSON, options) => new L.TrueSize(geoJSON, options);
