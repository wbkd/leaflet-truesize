(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('leaflet')) :
	typeof define === 'function' && define.amd ? define(['leaflet'], factory) :
	(global = global || self, factory(global.L));
}(this, (function (L) { 'use strict';

	L = L && L.hasOwnProperty('default') ? L['default'] : L;

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var helpers = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * @module helpers
	 */
	/**
	 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
	 *
	 * @memberof helpers
	 * @type {number}
	 */
	exports.earthRadius = 6371008.8;
	/**
	 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
	 *
	 * @memberof helpers
	 * @type {Object}
	 */
	exports.factors = {
	    centimeters: exports.earthRadius * 100,
	    centimetres: exports.earthRadius * 100,
	    degrees: exports.earthRadius / 111325,
	    feet: exports.earthRadius * 3.28084,
	    inches: exports.earthRadius * 39.370,
	    kilometers: exports.earthRadius / 1000,
	    kilometres: exports.earthRadius / 1000,
	    meters: exports.earthRadius,
	    metres: exports.earthRadius,
	    miles: exports.earthRadius / 1609.344,
	    millimeters: exports.earthRadius * 1000,
	    millimetres: exports.earthRadius * 1000,
	    nauticalmiles: exports.earthRadius / 1852,
	    radians: 1,
	    yards: exports.earthRadius / 1.0936,
	};
	/**
	 * Units of measurement factors based on 1 meter.
	 *
	 * @memberof helpers
	 * @type {Object}
	 */
	exports.unitsFactors = {
	    centimeters: 100,
	    centimetres: 100,
	    degrees: 1 / 111325,
	    feet: 3.28084,
	    inches: 39.370,
	    kilometers: 1 / 1000,
	    kilometres: 1 / 1000,
	    meters: 1,
	    metres: 1,
	    miles: 1 / 1609.344,
	    millimeters: 1000,
	    millimetres: 1000,
	    nauticalmiles: 1 / 1852,
	    radians: 1 / exports.earthRadius,
	    yards: 1 / 1.0936,
	};
	/**
	 * Area of measurement factors based on 1 square meter.
	 *
	 * @memberof helpers
	 * @type {Object}
	 */
	exports.areaFactors = {
	    acres: 0.000247105,
	    centimeters: 10000,
	    centimetres: 10000,
	    feet: 10.763910417,
	    inches: 1550.003100006,
	    kilometers: 0.000001,
	    kilometres: 0.000001,
	    meters: 1,
	    metres: 1,
	    miles: 3.86e-7,
	    millimeters: 1000000,
	    millimetres: 1000000,
	    yards: 1.195990046,
	};
	/**
	 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
	 *
	 * @name feature
	 * @param {Geometry} geometry input geometry
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature} a GeoJSON Feature
	 * @example
	 * var geometry = {
	 *   "type": "Point",
	 *   "coordinates": [110, 50]
	 * };
	 *
	 * var feature = turf.feature(geometry);
	 *
	 * //=feature
	 */
	function feature(geom, properties, options) {
	    if (options === void 0) { options = {}; }
	    var feat = { type: "Feature" };
	    if (options.id === 0 || options.id) {
	        feat.id = options.id;
	    }
	    if (options.bbox) {
	        feat.bbox = options.bbox;
	    }
	    feat.properties = properties || {};
	    feat.geometry = geom;
	    return feat;
	}
	exports.feature = feature;
	/**
	 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
	 * For GeometryCollection type use `helpers.geometryCollection`
	 *
	 * @name geometry
	 * @param {string} type Geometry Type
	 * @param {Array<any>} coordinates Coordinates
	 * @param {Object} [options={}] Optional Parameters
	 * @returns {Geometry} a GeoJSON Geometry
	 * @example
	 * var type = "Point";
	 * var coordinates = [110, 50];
	 * var geometry = turf.geometry(type, coordinates);
	 * // => geometry
	 */
	function geometry(type, coordinates, options) {
	    switch (type) {
	        case "Point": return point(coordinates).geometry;
	        case "LineString": return lineString(coordinates).geometry;
	        case "Polygon": return polygon(coordinates).geometry;
	        case "MultiPoint": return multiPoint(coordinates).geometry;
	        case "MultiLineString": return multiLineString(coordinates).geometry;
	        case "MultiPolygon": return multiPolygon(coordinates).geometry;
	        default: throw new Error(type + " is invalid");
	    }
	}
	exports.geometry = geometry;
	/**
	 * Creates a {@link Point} {@link Feature} from a Position.
	 *
	 * @name point
	 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<Point>} a Point feature
	 * @example
	 * var point = turf.point([-75.343, 39.984]);
	 *
	 * //=point
	 */
	function point(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "Point",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.point = point;
	/**
	 * Creates a {@link Point} {@link FeatureCollection} from an Array of Point coordinates.
	 *
	 * @name points
	 * @param {Array<Array<number>>} coordinates an array of Points
	 * @param {Object} [properties={}] Translate these properties to each Feature
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
	 * associated with the FeatureCollection
	 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
	 * @returns {FeatureCollection<Point>} Point Feature
	 * @example
	 * var points = turf.points([
	 *   [-75, 39],
	 *   [-80, 45],
	 *   [-78, 50]
	 * ]);
	 *
	 * //=points
	 */
	function points(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    return featureCollection(coordinates.map(function (coords) {
	        return point(coords, properties);
	    }), options);
	}
	exports.points = points;
	/**
	 * Creates a {@link Polygon} {@link Feature} from an Array of LinearRings.
	 *
	 * @name polygon
	 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<Polygon>} Polygon Feature
	 * @example
	 * var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
	 *
	 * //=polygon
	 */
	function polygon(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
	        var ring = coordinates_1[_i];
	        if (ring.length < 4) {
	            throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
	        }
	        for (var j = 0; j < ring[ring.length - 1].length; j++) {
	            // Check if first point of Polygon contains two numbers
	            if (ring[ring.length - 1][j] !== ring[0][j]) {
	                throw new Error("First and last Position are not equivalent.");
	            }
	        }
	    }
	    var geom = {
	        type: "Polygon",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.polygon = polygon;
	/**
	 * Creates a {@link Polygon} {@link FeatureCollection} from an Array of Polygon coordinates.
	 *
	 * @name polygons
	 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygon coordinates
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
	 * @returns {FeatureCollection<Polygon>} Polygon FeatureCollection
	 * @example
	 * var polygons = turf.polygons([
	 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
	 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
	 * ]);
	 *
	 * //=polygons
	 */
	function polygons(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    return featureCollection(coordinates.map(function (coords) {
	        return polygon(coords, properties);
	    }), options);
	}
	exports.polygons = polygons;
	/**
	 * Creates a {@link LineString} {@link Feature} from an Array of Positions.
	 *
	 * @name lineString
	 * @param {Array<Array<number>>} coordinates an array of Positions
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<LineString>} LineString Feature
	 * @example
	 * var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
	 * var linestring2 = turf.lineString([[-14, 43], [-13, 40], [-15, 45], [-10, 49]], {name: 'line 2'});
	 *
	 * //=linestring1
	 * //=linestring2
	 */
	function lineString(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    if (coordinates.length < 2) {
	        throw new Error("coordinates must be an array of two or more positions");
	    }
	    var geom = {
	        type: "LineString",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.lineString = lineString;
	/**
	 * Creates a {@link LineString} {@link FeatureCollection} from an Array of LineString coordinates.
	 *
	 * @name lineStrings
	 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
	 * associated with the FeatureCollection
	 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
	 * @returns {FeatureCollection<LineString>} LineString FeatureCollection
	 * @example
	 * var linestrings = turf.lineStrings([
	 *   [[-24, 63], [-23, 60], [-25, 65], [-20, 69]],
	 *   [[-14, 43], [-13, 40], [-15, 45], [-10, 49]]
	 * ]);
	 *
	 * //=linestrings
	 */
	function lineStrings(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    return featureCollection(coordinates.map(function (coords) {
	        return lineString(coords, properties);
	    }), options);
	}
	exports.lineStrings = lineStrings;
	/**
	 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
	 *
	 * @name featureCollection
	 * @param {Feature[]} features input features
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {FeatureCollection} FeatureCollection of Features
	 * @example
	 * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
	 * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
	 * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
	 *
	 * var collection = turf.featureCollection([
	 *   locationA,
	 *   locationB,
	 *   locationC
	 * ]);
	 *
	 * //=collection
	 */
	function featureCollection(features, options) {
	    if (options === void 0) { options = {}; }
	    var fc = { type: "FeatureCollection" };
	    if (options.id) {
	        fc.id = options.id;
	    }
	    if (options.bbox) {
	        fc.bbox = options.bbox;
	    }
	    fc.features = features;
	    return fc;
	}
	exports.featureCollection = featureCollection;
	/**
	 * Creates a {@link Feature<MultiLineString>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiLineString
	 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<MultiLineString>} a MultiLineString feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
	 *
	 * //=multiLine
	 */
	function multiLineString(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "MultiLineString",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.multiLineString = multiLineString;
	/**
	 * Creates a {@link Feature<MultiPoint>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiPoint
	 * @param {Array<Array<number>>} coordinates an array of Positions
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<MultiPoint>} a MultiPoint feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
	 *
	 * //=multiPt
	 */
	function multiPoint(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "MultiPoint",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.multiPoint = multiPoint;
	/**
	 * Creates a {@link Feature<MultiPolygon>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiPolygon
	 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<MultiPolygon>} a multipolygon feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
	 *
	 * //=multiPoly
	 *
	 */
	function multiPolygon(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "MultiPolygon",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.multiPolygon = multiPolygon;
	/**
	 * Creates a {@link Feature<GeometryCollection>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name geometryCollection
	 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
	 * @example
	 * var pt = turf.geometry("Point", [100, 0]);
	 * var line = turf.geometry("LineString", [[101, 0], [102, 1]]);
	 * var collection = turf.geometryCollection([pt, line]);
	 *
	 * // => collection
	 */
	function geometryCollection(geometries, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "GeometryCollection",
	        geometries: geometries,
	    };
	    return feature(geom, properties, options);
	}
	exports.geometryCollection = geometryCollection;
	/**
	 * Round number to precision
	 *
	 * @param {number} num Number
	 * @param {number} [precision=0] Precision
	 * @returns {number} rounded number
	 * @example
	 * turf.round(120.4321)
	 * //=120
	 *
	 * turf.round(120.4321, 2)
	 * //=120.43
	 */
	function round(num, precision) {
	    if (precision === void 0) { precision = 0; }
	    if (precision && !(precision >= 0)) {
	        throw new Error("precision must be a positive number");
	    }
	    var multiplier = Math.pow(10, precision || 0);
	    return Math.round(num * multiplier) / multiplier;
	}
	exports.round = round;
	/**
	 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @name radiansToLength
	 * @param {number} radians in radians across the sphere
	 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
	 * meters, kilometres, kilometers.
	 * @returns {number} distance
	 */
	function radiansToLength(radians, units) {
	    if (units === void 0) { units = "kilometers"; }
	    var factor = exports.factors[units];
	    if (!factor) {
	        throw new Error(units + " units is invalid");
	    }
	    return radians * factor;
	}
	exports.radiansToLength = radiansToLength;
	/**
	 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @name lengthToRadians
	 * @param {number} distance in real units
	 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
	 * meters, kilometres, kilometers.
	 * @returns {number} radians
	 */
	function lengthToRadians(distance, units) {
	    if (units === void 0) { units = "kilometers"; }
	    var factor = exports.factors[units];
	    if (!factor) {
	        throw new Error(units + " units is invalid");
	    }
	    return distance / factor;
	}
	exports.lengthToRadians = lengthToRadians;
	/**
	 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
	 *
	 * @name lengthToDegrees
	 * @param {number} distance in real units
	 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
	 * meters, kilometres, kilometers.
	 * @returns {number} degrees
	 */
	function lengthToDegrees(distance, units) {
	    return radiansToDegrees(lengthToRadians(distance, units));
	}
	exports.lengthToDegrees = lengthToDegrees;
	/**
	 * Converts any bearing angle from the north line direction (positive clockwise)
	 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
	 *
	 * @name bearingToAzimuth
	 * @param {number} bearing angle, between -180 and +180 degrees
	 * @returns {number} angle between 0 and 360 degrees
	 */
	function bearingToAzimuth(bearing) {
	    var angle = bearing % 360;
	    if (angle < 0) {
	        angle += 360;
	    }
	    return angle;
	}
	exports.bearingToAzimuth = bearingToAzimuth;
	/**
	 * Converts an angle in radians to degrees
	 *
	 * @name radiansToDegrees
	 * @param {number} radians angle in radians
	 * @returns {number} degrees between 0 and 360 degrees
	 */
	function radiansToDegrees(radians) {
	    var degrees = radians % (2 * Math.PI);
	    return degrees * 180 / Math.PI;
	}
	exports.radiansToDegrees = radiansToDegrees;
	/**
	 * Converts an angle in degrees to radians
	 *
	 * @name degreesToRadians
	 * @param {number} degrees angle between 0 and 360 degrees
	 * @returns {number} angle in radians
	 */
	function degreesToRadians(degrees) {
	    var radians = degrees % 360;
	    return radians * Math.PI / 180;
	}
	exports.degreesToRadians = degreesToRadians;
	/**
	 * Converts a length to the requested unit.
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @param {number} length to be converted
	 * @param {Units} [originalUnit="kilometers"] of the length
	 * @param {Units} [finalUnit="kilometers"] returned unit
	 * @returns {number} the converted length
	 */
	function convertLength(length, originalUnit, finalUnit) {
	    if (originalUnit === void 0) { originalUnit = "kilometers"; }
	    if (finalUnit === void 0) { finalUnit = "kilometers"; }
	    if (!(length >= 0)) {
	        throw new Error("length must be a positive number");
	    }
	    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
	}
	exports.convertLength = convertLength;
	/**
	 * Converts a area to the requested unit.
	 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeters, acres, miles, yards, feet, inches
	 * @param {number} area to be converted
	 * @param {Units} [originalUnit="meters"] of the distance
	 * @param {Units} [finalUnit="kilometers"] returned unit
	 * @returns {number} the converted distance
	 */
	function convertArea(area, originalUnit, finalUnit) {
	    if (originalUnit === void 0) { originalUnit = "meters"; }
	    if (finalUnit === void 0) { finalUnit = "kilometers"; }
	    if (!(area >= 0)) {
	        throw new Error("area must be a positive number");
	    }
	    var startFactor = exports.areaFactors[originalUnit];
	    if (!startFactor) {
	        throw new Error("invalid original units");
	    }
	    var finalFactor = exports.areaFactors[finalUnit];
	    if (!finalFactor) {
	        throw new Error("invalid final units");
	    }
	    return (area / startFactor) * finalFactor;
	}
	exports.convertArea = convertArea;
	/**
	 * isNumber
	 *
	 * @param {*} num Number to validate
	 * @returns {boolean} true/false
	 * @example
	 * turf.isNumber(123)
	 * //=true
	 * turf.isNumber('foo')
	 * //=false
	 */
	function isNumber(num) {
	    return !isNaN(num) && num !== null && !Array.isArray(num) && !/^\s*$/.test(num);
	}
	exports.isNumber = isNumber;
	/**
	 * isObject
	 *
	 * @param {*} input variable to validate
	 * @returns {boolean} true/false
	 * @example
	 * turf.isObject({elevation: 10})
	 * //=true
	 * turf.isObject('foo')
	 * //=false
	 */
	function isObject(input) {
	    return (!!input) && (input.constructor === Object);
	}
	exports.isObject = isObject;
	/**
	 * Validate BBox
	 *
	 * @private
	 * @param {Array<number>} bbox BBox to validate
	 * @returns {void}
	 * @throws Error if BBox is not valid
	 * @example
	 * validateBBox([-180, -40, 110, 50])
	 * //=OK
	 * validateBBox([-180, -40])
	 * //=Error
	 * validateBBox('Foo')
	 * //=Error
	 * validateBBox(5)
	 * //=Error
	 * validateBBox(null)
	 * //=Error
	 * validateBBox(undefined)
	 * //=Error
	 */
	function validateBBox(bbox) {
	    if (!bbox) {
	        throw new Error("bbox is required");
	    }
	    if (!Array.isArray(bbox)) {
	        throw new Error("bbox must be an Array");
	    }
	    if (bbox.length !== 4 && bbox.length !== 6) {
	        throw new Error("bbox must be an Array of 4 or 6 numbers");
	    }
	    bbox.forEach(function (num) {
	        if (!isNumber(num)) {
	            throw new Error("bbox must only contain numbers");
	        }
	    });
	}
	exports.validateBBox = validateBBox;
	/**
	 * Validate Id
	 *
	 * @private
	 * @param {string|number} id Id to validate
	 * @returns {void}
	 * @throws Error if Id is not valid
	 * @example
	 * validateId([-180, -40, 110, 50])
	 * //=Error
	 * validateId([-180, -40])
	 * //=Error
	 * validateId('Foo')
	 * //=OK
	 * validateId(5)
	 * //=OK
	 * validateId(null)
	 * //=Error
	 * validateId(undefined)
	 * //=Error
	 */
	function validateId(id) {
	    if (!id) {
	        throw new Error("id is required");
	    }
	    if (["string", "number"].indexOf(typeof id) === -1) {
	        throw new Error("id must be a number or a string");
	    }
	}
	exports.validateId = validateId;
	// Deprecated methods
	function radians2degrees() {
	    throw new Error("method has been renamed to `radiansToDegrees`");
	}
	exports.radians2degrees = radians2degrees;
	function degrees2radians() {
	    throw new Error("method has been renamed to `degreesToRadians`");
	}
	exports.degrees2radians = degrees2radians;
	function distanceToDegrees() {
	    throw new Error("method has been renamed to `lengthToDegrees`");
	}
	exports.distanceToDegrees = distanceToDegrees;
	function distanceToRadians() {
	    throw new Error("method has been renamed to `lengthToRadians`");
	}
	exports.distanceToRadians = distanceToRadians;
	function radiansToDistance() {
	    throw new Error("method has been renamed to `radiansToLength`");
	}
	exports.radiansToDistance = radiansToDistance;
	function bearingToAngle() {
	    throw new Error("method has been renamed to `bearingToAzimuth`");
	}
	exports.bearingToAngle = bearingToAngle;
	function convertDistance() {
	    throw new Error("method has been renamed to `convertLength`");
	}
	exports.convertDistance = convertDistance;
	});

	unwrapExports(helpers);
	var helpers_1 = helpers.earthRadius;
	var helpers_2 = helpers.factors;
	var helpers_3 = helpers.unitsFactors;
	var helpers_4 = helpers.areaFactors;
	var helpers_5 = helpers.feature;
	var helpers_6 = helpers.geometry;
	var helpers_7 = helpers.point;
	var helpers_8 = helpers.points;
	var helpers_9 = helpers.polygon;
	var helpers_10 = helpers.polygons;
	var helpers_11 = helpers.lineString;
	var helpers_12 = helpers.lineStrings;
	var helpers_13 = helpers.featureCollection;
	var helpers_14 = helpers.multiLineString;
	var helpers_15 = helpers.multiPoint;
	var helpers_16 = helpers.multiPolygon;
	var helpers_17 = helpers.geometryCollection;
	var helpers_18 = helpers.round;
	var helpers_19 = helpers.radiansToLength;
	var helpers_20 = helpers.lengthToRadians;
	var helpers_21 = helpers.lengthToDegrees;
	var helpers_22 = helpers.bearingToAzimuth;
	var helpers_23 = helpers.radiansToDegrees;
	var helpers_24 = helpers.degreesToRadians;
	var helpers_25 = helpers.convertLength;
	var helpers_26 = helpers.convertArea;
	var helpers_27 = helpers.isNumber;
	var helpers_28 = helpers.isObject;
	var helpers_29 = helpers.validateBBox;
	var helpers_30 = helpers.validateId;
	var helpers_31 = helpers.radians2degrees;
	var helpers_32 = helpers.degrees2radians;
	var helpers_33 = helpers.distanceToDegrees;
	var helpers_34 = helpers.distanceToRadians;
	var helpers_35 = helpers.radiansToDistance;
	var helpers_36 = helpers.bearingToAngle;
	var helpers_37 = helpers.convertDistance;

	/**
	 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
	 */

	/**
	 * isNumber
	 *
	 * @param {*} num Number to validate
	 * @returns {boolean} true/false
	 * @example
	 * turf.isNumber(123)
	 * //=true
	 * turf.isNumber('foo')
	 * //=false
	 */
	function isNumber(num) {
	    return !isNaN(num) && num !== null && !Array.isArray(num);
	}

	/**
	 * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
	 *
	 * @name getCoord
	 * @param {Array<number>|Geometry<Point>|Feature<Point>} coord GeoJSON Point or an Array of numbers
	 * @returns {Array<number>} coordinates
	 * @example
	 * var pt = turf.point([10, 10]);
	 *
	 * var coord = turf.getCoord(pt);
	 * //= [10, 10]
	 */
	function getCoord(coord) {
	    if (!coord) throw new Error('coord is required');
	    if (coord.type === 'Feature' && coord.geometry !== null && coord.geometry.type === 'Point') return coord.geometry.coordinates;
	    if (coord.type === 'Point') return coord.coordinates;
	    if (Array.isArray(coord) && coord.length >= 2 && coord[0].length === undefined && coord[1].length === undefined) return coord;

	    throw new Error('coord must be GeoJSON Point or an Array of numbers');
	}

	/**
	 * Unwrap coordinates from a Feature, Geometry Object or an Array
	 *
	 * @name getCoords
	 * @param {Array<any>|Geometry|Feature} coords Feature, Geometry Object or an Array
	 * @returns {Array<any>} coordinates
	 * @example
	 * var poly = turf.polygon([[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]);
	 *
	 * var coords = turf.getCoords(poly);
	 * //= [[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]
	 */
	function getCoords(coords) {
	    if (!coords) throw new Error('coords is required');

	    // Feature
	    if (coords.type === 'Feature' && coords.geometry !== null) return coords.geometry.coordinates;

	    // Geometry
	    if (coords.coordinates) return coords.coordinates;

	    // Array of numbers
	    if (Array.isArray(coords)) return coords;

	    throw new Error('coords must be GeoJSON Feature, Geometry Object or an Array');
	}

	/**
	 * Checks if coordinates contains a number
	 *
	 * @name containsNumber
	 * @param {Array<any>} coordinates GeoJSON Coordinates
	 * @returns {boolean} true if Array contains a number
	 */
	function containsNumber(coordinates) {
	    if (coordinates.length > 1 && isNumber(coordinates[0]) && isNumber(coordinates[1])) {
	        return true;
	    }

	    if (Array.isArray(coordinates[0]) && coordinates[0].length) {
	        return containsNumber(coordinates[0]);
	    }
	    throw new Error('coordinates must only contain numbers');
	}

	/**
	 * Enforce expectations about types of GeoJSON objects for Turf.
	 *
	 * @name geojsonType
	 * @param {GeoJSON} value any GeoJSON object
	 * @param {string} type expected GeoJSON type
	 * @param {string} name name of calling function
	 * @throws {Error} if value is not the expected type.
	 */
	function geojsonType(value, type, name) {
	    if (!type || !name) throw new Error('type and name required');

	    if (!value || value.type !== type) {
	        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + value.type);
	    }
	}

	/**
	 * Enforce expectations about types of {@link Feature} inputs for Turf.
	 * Internally this uses {@link geojsonType} to judge geometry types.
	 *
	 * @name featureOf
	 * @param {Feature} feature a feature with an expected geometry type
	 * @param {string} type expected GeoJSON type
	 * @param {string} name name of calling function
	 * @throws {Error} error if value is not the expected type.
	 */
	function featureOf(feature, type, name) {
	    if (!feature) throw new Error('No feature passed');
	    if (!name) throw new Error('.featureOf() requires a name');
	    if (!feature || feature.type !== 'Feature' || !feature.geometry) {
	        throw new Error('Invalid input to ' + name + ', Feature with geometry required');
	    }
	    if (!feature.geometry || feature.geometry.type !== type) {
	        throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
	    }
	}

	/**
	 * Enforce expectations about types of {@link FeatureCollection} inputs for Turf.
	 * Internally this uses {@link geojsonType} to judge geometry types.
	 *
	 * @name collectionOf
	 * @param {FeatureCollection} featureCollection a FeatureCollection for which features will be judged
	 * @param {string} type expected GeoJSON type
	 * @param {string} name name of calling function
	 * @throws {Error} if value is not the expected type.
	 */
	function collectionOf(featureCollection, type, name) {
	    if (!featureCollection) throw new Error('No featureCollection passed');
	    if (!name) throw new Error('.collectionOf() requires a name');
	    if (!featureCollection || featureCollection.type !== 'FeatureCollection') {
	        throw new Error('Invalid input to ' + name + ', FeatureCollection required');
	    }
	    for (var i = 0; i < featureCollection.features.length; i++) {
	        var feature = featureCollection.features[i];
	        if (!feature || feature.type !== 'Feature' || !feature.geometry) {
	            throw new Error('Invalid input to ' + name + ', Feature with geometry required');
	        }
	        if (!feature.geometry || feature.geometry.type !== type) {
	            throw new Error('Invalid input to ' + name + ': must be a ' + type + ', given ' + feature.geometry.type);
	        }
	    }
	}

	/**
	 * Get Geometry from Feature or Geometry Object
	 *
	 * @param {Feature|Geometry} geojson GeoJSON Feature or Geometry Object
	 * @returns {Geometry|null} GeoJSON Geometry Object
	 * @throws {Error} if geojson is not a Feature or Geometry Object
	 * @example
	 * var point = {
	 *   "type": "Feature",
	 *   "properties": {},
	 *   "geometry": {
	 *     "type": "Point",
	 *     "coordinates": [110, 40]
	 *   }
	 * }
	 * var geom = turf.getGeom(point)
	 * //={"type": "Point", "coordinates": [110, 40]}
	 */
	function getGeom(geojson) {
	    if (!geojson) throw new Error('geojson is required');
	    if (geojson.geometry !== undefined) return geojson.geometry;
	    if (geojson.coordinates || geojson.geometries) return geojson;
	    throw new Error('geojson must be a valid Feature or Geometry Object');
	}

	/**
	 * Get Geometry Type from Feature or Geometry Object
	 *
	 * @throws {Error} **DEPRECATED** in v5.0.0 in favor of getType
	 */
	function getGeomType() {
	    throw new Error('invariant.getGeomType has been deprecated in v5.0 in favor of invariant.getType');
	}

	/**
	 * Get GeoJSON object's type, Geometry type is prioritize.
	 *
	 * @param {GeoJSON} geojson GeoJSON object
	 * @param {string} [name="geojson"] name of the variable to display in error message
	 * @returns {string} GeoJSON type
	 * @example
	 * var point = {
	 *   "type": "Feature",
	 *   "properties": {},
	 *   "geometry": {
	 *     "type": "Point",
	 *     "coordinates": [110, 40]
	 *   }
	 * }
	 * var geom = turf.getType(point)
	 * //="Point"
	 */
	function getType(geojson, name) {
	    if (!geojson) throw new Error((name || 'geojson') + ' is required');
	    // GeoJSON Feature & GeometryCollection
	    if (geojson.geometry && geojson.geometry.type) return geojson.geometry.type;
	    // GeoJSON Geometry & FeatureCollection
	    if (geojson.type) return geojson.type;
	    throw new Error((name || 'geojson') + ' is invalid');
	}

	var invariant = /*#__PURE__*/Object.freeze({
		__proto__: null,
		getCoord: getCoord,
		getCoords: getCoords,
		containsNumber: containsNumber,
		geojsonType: geojsonType,
		featureOf: featureOf,
		collectionOf: collectionOf,
		getGeom: getGeom,
		getGeomType: getGeomType,
		getType: getType
	});

	var invariant_1 = getCjsExportFromNamespace(invariant);

	var bearing_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	// http://en.wikipedia.org/wiki/Haversine_formula
	// http://www.movable-type.co.uk/scripts/latlong.html
	/**
	 * Takes two {@link Point|points} and finds the geographic bearing between them,
	 * i.e. the angle measured in degrees from the north line (0 degrees)
	 *
	 * @name bearing
	 * @param {Coord} start starting Point
	 * @param {Coord} end ending Point
	 * @param {Object} [options={}] Optional parameters
	 * @param {boolean} [options.final=false] calculates the final bearing if true
	 * @returns {number} bearing in decimal degrees, between -180 and 180 degrees (positive clockwise)
	 * @example
	 * var point1 = turf.point([-75.343, 39.984]);
	 * var point2 = turf.point([-75.534, 39.123]);
	 *
	 * var bearing = turf.bearing(point1, point2);
	 *
	 * //addToMap
	 * var addToMap = [point1, point2]
	 * point1.properties['marker-color'] = '#f00'
	 * point2.properties['marker-color'] = '#0f0'
	 * point1.properties.bearing = bearing
	 */
	function bearing(start, end, options) {
	    if (options === void 0) { options = {}; }
	    // Reverse calculation
	    if (options.final === true) {
	        return calculateFinalBearing(start, end);
	    }
	    var coordinates1 = invariant_1.getCoord(start);
	    var coordinates2 = invariant_1.getCoord(end);
	    var lon1 = helpers.degreesToRadians(coordinates1[0]);
	    var lon2 = helpers.degreesToRadians(coordinates2[0]);
	    var lat1 = helpers.degreesToRadians(coordinates1[1]);
	    var lat2 = helpers.degreesToRadians(coordinates2[1]);
	    var a = Math.sin(lon2 - lon1) * Math.cos(lat2);
	    var b = Math.cos(lat1) * Math.sin(lat2) -
	        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
	    return helpers.radiansToDegrees(Math.atan2(a, b));
	}
	/**
	 * Calculates Final Bearing
	 *
	 * @private
	 * @param {Coord} start starting Point
	 * @param {Coord} end ending Point
	 * @returns {number} bearing
	 */
	function calculateFinalBearing(start, end) {
	    // Swap start & end
	    var bear = bearing(end, start);
	    bear = (bear + 180) % 360;
	    return bear;
	}
	exports.default = bearing;
	});

	var turfBearing = unwrapExports(bearing_1);

	var distance_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	//http://en.wikipedia.org/wiki/Haversine_formula
	//http://www.movable-type.co.uk/scripts/latlong.html
	/**
	 * Calculates the distance between two {@link Point|points} in degrees, radians, miles, or kilometers.
	 * This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
	 *
	 * @name distance
	 * @param {Coord} from origin point
	 * @param {Coord} to destination point
	 * @param {Object} [options={}] Optional parameters
	 * @param {string} [options.units='kilometers'] can be degrees, radians, miles, or kilometers
	 * @returns {number} distance between the two points
	 * @example
	 * var from = turf.point([-75.343, 39.984]);
	 * var to = turf.point([-75.534, 39.123]);
	 * var options = {units: 'miles'};
	 *
	 * var distance = turf.distance(from, to, options);
	 *
	 * //addToMap
	 * var addToMap = [from, to];
	 * from.properties.distance = distance;
	 * to.properties.distance = distance;
	 */
	function distance(from, to, options) {
	    if (options === void 0) { options = {}; }
	    var coordinates1 = invariant_1.getCoord(from);
	    var coordinates2 = invariant_1.getCoord(to);
	    var dLat = helpers.degreesToRadians((coordinates2[1] - coordinates1[1]));
	    var dLon = helpers.degreesToRadians((coordinates2[0] - coordinates1[0]));
	    var lat1 = helpers.degreesToRadians(coordinates1[1]);
	    var lat2 = helpers.degreesToRadians(coordinates2[1]);
	    var a = Math.pow(Math.sin(dLat / 2), 2) +
	        Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
	    return helpers.radiansToLength(2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)), options.units);
	}
	exports.default = distance;
	});

	var turfDistance = unwrapExports(distance_1);

	var helpers$1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * @module helpers
	 */
	/**
	 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
	 *
	 * @memberof helpers
	 * @type {number}
	 */
	exports.earthRadius = 6371008.8;
	/**
	 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
	 *
	 * @memberof helpers
	 * @type {Object}
	 */
	exports.factors = {
	    centimeters: exports.earthRadius * 100,
	    centimetres: exports.earthRadius * 100,
	    degrees: exports.earthRadius / 111325,
	    feet: exports.earthRadius * 3.28084,
	    inches: exports.earthRadius * 39.370,
	    kilometers: exports.earthRadius / 1000,
	    kilometres: exports.earthRadius / 1000,
	    meters: exports.earthRadius,
	    metres: exports.earthRadius,
	    miles: exports.earthRadius / 1609.344,
	    millimeters: exports.earthRadius * 1000,
	    millimetres: exports.earthRadius * 1000,
	    nauticalmiles: exports.earthRadius / 1852,
	    radians: 1,
	    yards: exports.earthRadius / 1.0936,
	};
	/**
	 * Units of measurement factors based on 1 meter.
	 *
	 * @memberof helpers
	 * @type {Object}
	 */
	exports.unitsFactors = {
	    centimeters: 100,
	    centimetres: 100,
	    degrees: 1 / 111325,
	    feet: 3.28084,
	    inches: 39.370,
	    kilometers: 1 / 1000,
	    kilometres: 1 / 1000,
	    meters: 1,
	    metres: 1,
	    miles: 1 / 1609.344,
	    millimeters: 1000,
	    millimetres: 1000,
	    nauticalmiles: 1 / 1852,
	    radians: 1 / exports.earthRadius,
	    yards: 1 / 1.0936,
	};
	/**
	 * Area of measurement factors based on 1 square meter.
	 *
	 * @memberof helpers
	 * @type {Object}
	 */
	exports.areaFactors = {
	    acres: 0.000247105,
	    centimeters: 10000,
	    centimetres: 10000,
	    feet: 10.763910417,
	    inches: 1550.003100006,
	    kilometers: 0.000001,
	    kilometres: 0.000001,
	    meters: 1,
	    metres: 1,
	    miles: 3.86e-7,
	    millimeters: 1000000,
	    millimetres: 1000000,
	    yards: 1.195990046,
	};
	/**
	 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
	 *
	 * @name feature
	 * @param {Geometry} geometry input geometry
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature} a GeoJSON Feature
	 * @example
	 * var geometry = {
	 *   "type": "Point",
	 *   "coordinates": [110, 50]
	 * };
	 *
	 * var feature = turf.feature(geometry);
	 *
	 * //=feature
	 */
	function feature(geom, properties, options) {
	    if (options === void 0) { options = {}; }
	    var feat = { type: "Feature" };
	    if (options.id === 0 || options.id) {
	        feat.id = options.id;
	    }
	    if (options.bbox) {
	        feat.bbox = options.bbox;
	    }
	    feat.properties = properties || {};
	    feat.geometry = geom;
	    return feat;
	}
	exports.feature = feature;
	/**
	 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
	 * For GeometryCollection type use `helpers.geometryCollection`
	 *
	 * @name geometry
	 * @param {string} type Geometry Type
	 * @param {Array<any>} coordinates Coordinates
	 * @param {Object} [options={}] Optional Parameters
	 * @returns {Geometry} a GeoJSON Geometry
	 * @example
	 * var type = "Point";
	 * var coordinates = [110, 50];
	 * var geometry = turf.geometry(type, coordinates);
	 * // => geometry
	 */
	function geometry(type, coordinates, options) {
	    switch (type) {
	        case "Point": return point(coordinates).geometry;
	        case "LineString": return lineString(coordinates).geometry;
	        case "Polygon": return polygon(coordinates).geometry;
	        case "MultiPoint": return multiPoint(coordinates).geometry;
	        case "MultiLineString": return multiLineString(coordinates).geometry;
	        case "MultiPolygon": return multiPolygon(coordinates).geometry;
	        default: throw new Error(type + " is invalid");
	    }
	}
	exports.geometry = geometry;
	/**
	 * Creates a {@link Point} {@link Feature} from a Position.
	 *
	 * @name point
	 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<Point>} a Point feature
	 * @example
	 * var point = turf.point([-75.343, 39.984]);
	 *
	 * //=point
	 */
	function point(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "Point",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.point = point;
	/**
	 * Creates a {@link Point} {@link FeatureCollection} from an Array of Point coordinates.
	 *
	 * @name points
	 * @param {Array<Array<number>>} coordinates an array of Points
	 * @param {Object} [properties={}] Translate these properties to each Feature
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
	 * associated with the FeatureCollection
	 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
	 * @returns {FeatureCollection<Point>} Point Feature
	 * @example
	 * var points = turf.points([
	 *   [-75, 39],
	 *   [-80, 45],
	 *   [-78, 50]
	 * ]);
	 *
	 * //=points
	 */
	function points(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    return featureCollection(coordinates.map(function (coords) {
	        return point(coords, properties);
	    }), options);
	}
	exports.points = points;
	/**
	 * Creates a {@link Polygon} {@link Feature} from an Array of LinearRings.
	 *
	 * @name polygon
	 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<Polygon>} Polygon Feature
	 * @example
	 * var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
	 *
	 * //=polygon
	 */
	function polygon(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
	        var ring = coordinates_1[_i];
	        if (ring.length < 4) {
	            throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
	        }
	        for (var j = 0; j < ring[ring.length - 1].length; j++) {
	            // Check if first point of Polygon contains two numbers
	            if (ring[ring.length - 1][j] !== ring[0][j]) {
	                throw new Error("First and last Position are not equivalent.");
	            }
	        }
	    }
	    var geom = {
	        type: "Polygon",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.polygon = polygon;
	/**
	 * Creates a {@link Polygon} {@link FeatureCollection} from an Array of Polygon coordinates.
	 *
	 * @name polygons
	 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygon coordinates
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
	 * @returns {FeatureCollection<Polygon>} Polygon FeatureCollection
	 * @example
	 * var polygons = turf.polygons([
	 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
	 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
	 * ]);
	 *
	 * //=polygons
	 */
	function polygons(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    return featureCollection(coordinates.map(function (coords) {
	        return polygon(coords, properties);
	    }), options);
	}
	exports.polygons = polygons;
	/**
	 * Creates a {@link LineString} {@link Feature} from an Array of Positions.
	 *
	 * @name lineString
	 * @param {Array<Array<number>>} coordinates an array of Positions
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<LineString>} LineString Feature
	 * @example
	 * var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
	 * var linestring2 = turf.lineString([[-14, 43], [-13, 40], [-15, 45], [-10, 49]], {name: 'line 2'});
	 *
	 * //=linestring1
	 * //=linestring2
	 */
	function lineString(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    if (coordinates.length < 2) {
	        throw new Error("coordinates must be an array of two or more positions");
	    }
	    var geom = {
	        type: "LineString",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.lineString = lineString;
	/**
	 * Creates a {@link LineString} {@link FeatureCollection} from an Array of LineString coordinates.
	 *
	 * @name lineStrings
	 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
	 * associated with the FeatureCollection
	 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
	 * @returns {FeatureCollection<LineString>} LineString FeatureCollection
	 * @example
	 * var linestrings = turf.lineStrings([
	 *   [[-24, 63], [-23, 60], [-25, 65], [-20, 69]],
	 *   [[-14, 43], [-13, 40], [-15, 45], [-10, 49]]
	 * ]);
	 *
	 * //=linestrings
	 */
	function lineStrings(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    return featureCollection(coordinates.map(function (coords) {
	        return lineString(coords, properties);
	    }), options);
	}
	exports.lineStrings = lineStrings;
	/**
	 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
	 *
	 * @name featureCollection
	 * @param {Feature[]} features input features
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {FeatureCollection} FeatureCollection of Features
	 * @example
	 * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
	 * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
	 * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
	 *
	 * var collection = turf.featureCollection([
	 *   locationA,
	 *   locationB,
	 *   locationC
	 * ]);
	 *
	 * //=collection
	 */
	function featureCollection(features, options) {
	    if (options === void 0) { options = {}; }
	    var fc = { type: "FeatureCollection" };
	    if (options.id) {
	        fc.id = options.id;
	    }
	    if (options.bbox) {
	        fc.bbox = options.bbox;
	    }
	    fc.features = features;
	    return fc;
	}
	exports.featureCollection = featureCollection;
	/**
	 * Creates a {@link Feature<MultiLineString>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiLineString
	 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<MultiLineString>} a MultiLineString feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
	 *
	 * //=multiLine
	 */
	function multiLineString(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "MultiLineString",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.multiLineString = multiLineString;
	/**
	 * Creates a {@link Feature<MultiPoint>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiPoint
	 * @param {Array<Array<number>>} coordinates an array of Positions
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<MultiPoint>} a MultiPoint feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
	 *
	 * //=multiPt
	 */
	function multiPoint(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "MultiPoint",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.multiPoint = multiPoint;
	/**
	 * Creates a {@link Feature<MultiPolygon>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiPolygon
	 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<MultiPolygon>} a multipolygon feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
	 *
	 * //=multiPoly
	 *
	 */
	function multiPolygon(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "MultiPolygon",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.multiPolygon = multiPolygon;
	/**
	 * Creates a {@link Feature<GeometryCollection>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name geometryCollection
	 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
	 * @example
	 * var pt = turf.geometry("Point", [100, 0]);
	 * var line = turf.geometry("LineString", [[101, 0], [102, 1]]);
	 * var collection = turf.geometryCollection([pt, line]);
	 *
	 * // => collection
	 */
	function geometryCollection(geometries, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "GeometryCollection",
	        geometries: geometries,
	    };
	    return feature(geom, properties, options);
	}
	exports.geometryCollection = geometryCollection;
	/**
	 * Round number to precision
	 *
	 * @param {number} num Number
	 * @param {number} [precision=0] Precision
	 * @returns {number} rounded number
	 * @example
	 * turf.round(120.4321)
	 * //=120
	 *
	 * turf.round(120.4321, 2)
	 * //=120.43
	 */
	function round(num, precision) {
	    if (precision === void 0) { precision = 0; }
	    if (precision && !(precision >= 0)) {
	        throw new Error("precision must be a positive number");
	    }
	    var multiplier = Math.pow(10, precision || 0);
	    return Math.round(num * multiplier) / multiplier;
	}
	exports.round = round;
	/**
	 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @name radiansToLength
	 * @param {number} radians in radians across the sphere
	 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
	 * meters, kilometres, kilometers.
	 * @returns {number} distance
	 */
	function radiansToLength(radians, units) {
	    if (units === void 0) { units = "kilometers"; }
	    var factor = exports.factors[units];
	    if (!factor) {
	        throw new Error(units + " units is invalid");
	    }
	    return radians * factor;
	}
	exports.radiansToLength = radiansToLength;
	/**
	 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @name lengthToRadians
	 * @param {number} distance in real units
	 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
	 * meters, kilometres, kilometers.
	 * @returns {number} radians
	 */
	function lengthToRadians(distance, units) {
	    if (units === void 0) { units = "kilometers"; }
	    var factor = exports.factors[units];
	    if (!factor) {
	        throw new Error(units + " units is invalid");
	    }
	    return distance / factor;
	}
	exports.lengthToRadians = lengthToRadians;
	/**
	 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
	 *
	 * @name lengthToDegrees
	 * @param {number} distance in real units
	 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
	 * meters, kilometres, kilometers.
	 * @returns {number} degrees
	 */
	function lengthToDegrees(distance, units) {
	    return radiansToDegrees(lengthToRadians(distance, units));
	}
	exports.lengthToDegrees = lengthToDegrees;
	/**
	 * Converts any bearing angle from the north line direction (positive clockwise)
	 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
	 *
	 * @name bearingToAzimuth
	 * @param {number} bearing angle, between -180 and +180 degrees
	 * @returns {number} angle between 0 and 360 degrees
	 */
	function bearingToAzimuth(bearing) {
	    var angle = bearing % 360;
	    if (angle < 0) {
	        angle += 360;
	    }
	    return angle;
	}
	exports.bearingToAzimuth = bearingToAzimuth;
	/**
	 * Converts an angle in radians to degrees
	 *
	 * @name radiansToDegrees
	 * @param {number} radians angle in radians
	 * @returns {number} degrees between 0 and 360 degrees
	 */
	function radiansToDegrees(radians) {
	    var degrees = radians % (2 * Math.PI);
	    return degrees * 180 / Math.PI;
	}
	exports.radiansToDegrees = radiansToDegrees;
	/**
	 * Converts an angle in degrees to radians
	 *
	 * @name degreesToRadians
	 * @param {number} degrees angle between 0 and 360 degrees
	 * @returns {number} angle in radians
	 */
	function degreesToRadians(degrees) {
	    var radians = degrees % 360;
	    return radians * Math.PI / 180;
	}
	exports.degreesToRadians = degreesToRadians;
	/**
	 * Converts a length to the requested unit.
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @param {number} length to be converted
	 * @param {Units} [originalUnit="kilometers"] of the length
	 * @param {Units} [finalUnit="kilometers"] returned unit
	 * @returns {number} the converted length
	 */
	function convertLength(length, originalUnit, finalUnit) {
	    if (originalUnit === void 0) { originalUnit = "kilometers"; }
	    if (finalUnit === void 0) { finalUnit = "kilometers"; }
	    if (!(length >= 0)) {
	        throw new Error("length must be a positive number");
	    }
	    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
	}
	exports.convertLength = convertLength;
	/**
	 * Converts a area to the requested unit.
	 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeters, acres, miles, yards, feet, inches
	 * @param {number} area to be converted
	 * @param {Units} [originalUnit="meters"] of the distance
	 * @param {Units} [finalUnit="kilometers"] returned unit
	 * @returns {number} the converted distance
	 */
	function convertArea(area, originalUnit, finalUnit) {
	    if (originalUnit === void 0) { originalUnit = "meters"; }
	    if (finalUnit === void 0) { finalUnit = "kilometers"; }
	    if (!(area >= 0)) {
	        throw new Error("area must be a positive number");
	    }
	    var startFactor = exports.areaFactors[originalUnit];
	    if (!startFactor) {
	        throw new Error("invalid original units");
	    }
	    var finalFactor = exports.areaFactors[finalUnit];
	    if (!finalFactor) {
	        throw new Error("invalid final units");
	    }
	    return (area / startFactor) * finalFactor;
	}
	exports.convertArea = convertArea;
	/**
	 * isNumber
	 *
	 * @param {*} num Number to validate
	 * @returns {boolean} true/false
	 * @example
	 * turf.isNumber(123)
	 * //=true
	 * turf.isNumber('foo')
	 * //=false
	 */
	function isNumber(num) {
	    return !isNaN(num) && num !== null && !Array.isArray(num) && !/^\s*$/.test(num);
	}
	exports.isNumber = isNumber;
	/**
	 * isObject
	 *
	 * @param {*} input variable to validate
	 * @returns {boolean} true/false
	 * @example
	 * turf.isObject({elevation: 10})
	 * //=true
	 * turf.isObject('foo')
	 * //=false
	 */
	function isObject(input) {
	    return (!!input) && (input.constructor === Object);
	}
	exports.isObject = isObject;
	/**
	 * Validate BBox
	 *
	 * @private
	 * @param {Array<number>} bbox BBox to validate
	 * @returns {void}
	 * @throws Error if BBox is not valid
	 * @example
	 * validateBBox([-180, -40, 110, 50])
	 * //=OK
	 * validateBBox([-180, -40])
	 * //=Error
	 * validateBBox('Foo')
	 * //=Error
	 * validateBBox(5)
	 * //=Error
	 * validateBBox(null)
	 * //=Error
	 * validateBBox(undefined)
	 * //=Error
	 */
	function validateBBox(bbox) {
	    if (!bbox) {
	        throw new Error("bbox is required");
	    }
	    if (!Array.isArray(bbox)) {
	        throw new Error("bbox must be an Array");
	    }
	    if (bbox.length !== 4 && bbox.length !== 6) {
	        throw new Error("bbox must be an Array of 4 or 6 numbers");
	    }
	    bbox.forEach(function (num) {
	        if (!isNumber(num)) {
	            throw new Error("bbox must only contain numbers");
	        }
	    });
	}
	exports.validateBBox = validateBBox;
	/**
	 * Validate Id
	 *
	 * @private
	 * @param {string|number} id Id to validate
	 * @returns {void}
	 * @throws Error if Id is not valid
	 * @example
	 * validateId([-180, -40, 110, 50])
	 * //=Error
	 * validateId([-180, -40])
	 * //=Error
	 * validateId('Foo')
	 * //=OK
	 * validateId(5)
	 * //=OK
	 * validateId(null)
	 * //=Error
	 * validateId(undefined)
	 * //=Error
	 */
	function validateId(id) {
	    if (!id) {
	        throw new Error("id is required");
	    }
	    if (["string", "number"].indexOf(typeof id) === -1) {
	        throw new Error("id must be a number or a string");
	    }
	}
	exports.validateId = validateId;
	// Deprecated methods
	function radians2degrees() {
	    throw new Error("method has been renamed to `radiansToDegrees`");
	}
	exports.radians2degrees = radians2degrees;
	function degrees2radians() {
	    throw new Error("method has been renamed to `degreesToRadians`");
	}
	exports.degrees2radians = degrees2radians;
	function distanceToDegrees() {
	    throw new Error("method has been renamed to `lengthToDegrees`");
	}
	exports.distanceToDegrees = distanceToDegrees;
	function distanceToRadians() {
	    throw new Error("method has been renamed to `lengthToRadians`");
	}
	exports.distanceToRadians = distanceToRadians;
	function radiansToDistance() {
	    throw new Error("method has been renamed to `radiansToLength`");
	}
	exports.radiansToDistance = radiansToDistance;
	function bearingToAngle() {
	    throw new Error("method has been renamed to `bearingToAzimuth`");
	}
	exports.bearingToAngle = bearingToAngle;
	function convertDistance() {
	    throw new Error("method has been renamed to `convertLength`");
	}
	exports.convertDistance = convertDistance;
	});

	unwrapExports(helpers$1);
	var helpers_1$1 = helpers$1.earthRadius;
	var helpers_2$1 = helpers$1.factors;
	var helpers_3$1 = helpers$1.unitsFactors;
	var helpers_4$1 = helpers$1.areaFactors;
	var helpers_5$1 = helpers$1.feature;
	var helpers_6$1 = helpers$1.geometry;
	var helpers_7$1 = helpers$1.point;
	var helpers_8$1 = helpers$1.points;
	var helpers_9$1 = helpers$1.polygon;
	var helpers_10$1 = helpers$1.polygons;
	var helpers_11$1 = helpers$1.lineString;
	var helpers_12$1 = helpers$1.lineStrings;
	var helpers_13$1 = helpers$1.featureCollection;
	var helpers_14$1 = helpers$1.multiLineString;
	var helpers_15$1 = helpers$1.multiPoint;
	var helpers_16$1 = helpers$1.multiPolygon;
	var helpers_17$1 = helpers$1.geometryCollection;
	var helpers_18$1 = helpers$1.round;
	var helpers_19$1 = helpers$1.radiansToLength;
	var helpers_20$1 = helpers$1.lengthToRadians;
	var helpers_21$1 = helpers$1.lengthToDegrees;
	var helpers_22$1 = helpers$1.bearingToAzimuth;
	var helpers_23$1 = helpers$1.radiansToDegrees;
	var helpers_24$1 = helpers$1.degreesToRadians;
	var helpers_25$1 = helpers$1.convertLength;
	var helpers_26$1 = helpers$1.convertArea;
	var helpers_27$1 = helpers$1.isNumber;
	var helpers_28$1 = helpers$1.isObject;
	var helpers_29$1 = helpers$1.validateBBox;
	var helpers_30$1 = helpers$1.validateId;
	var helpers_31$1 = helpers$1.radians2degrees;
	var helpers_32$1 = helpers$1.degrees2radians;
	var helpers_33$1 = helpers$1.distanceToDegrees;
	var helpers_34$1 = helpers$1.distanceToRadians;
	var helpers_35$1 = helpers$1.radiansToDistance;
	var helpers_36$1 = helpers$1.bearingToAngle;
	var helpers_37$1 = helpers$1.convertDistance;

	var destination_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	// http://en.wikipedia.org/wiki/Haversine_formula
	// http://www.movable-type.co.uk/scripts/latlong.html


	/**
	 * Takes a {@link Point} and calculates the location of a destination point given a distance in
	 * degrees, radians, miles, or kilometers; and bearing in degrees.
	 * This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
	 *
	 * @name destination
	 * @param {Coord} origin starting point
	 * @param {number} distance distance from the origin point
	 * @param {number} bearing ranging from -180 to 180
	 * @param {Object} [options={}] Optional parameters
	 * @param {string} [options.units='kilometers'] miles, kilometers, degrees, or radians
	 * @param {Object} [options.properties={}] Translate properties to Point
	 * @returns {Feature<Point>} destination point
	 * @example
	 * var point = turf.point([-75.343, 39.984]);
	 * var distance = 50;
	 * var bearing = 90;
	 * var options = {units: 'miles'};
	 *
	 * var destination = turf.destination(point, distance, bearing, options);
	 *
	 * //addToMap
	 * var addToMap = [point, destination]
	 * destination.properties['marker-color'] = '#f00';
	 * point.properties['marker-color'] = '#0f0';
	 */
	function destination(origin, distance, bearing, options) {
	    if (options === void 0) { options = {}; }
	    // Handle input
	    var coordinates1 = invariant_1.getCoord(origin);
	    var longitude1 = helpers$1.degreesToRadians(coordinates1[0]);
	    var latitude1 = helpers$1.degreesToRadians(coordinates1[1]);
	    var bearingRad = helpers$1.degreesToRadians(bearing);
	    var radians = helpers$1.lengthToRadians(distance, options.units);
	    // Main
	    var latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians) +
	        Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearingRad));
	    var longitude2 = longitude1 + Math.atan2(Math.sin(bearingRad) * Math.sin(radians) * Math.cos(latitude1), Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));
	    var lng = helpers$1.radiansToDegrees(longitude2);
	    var lat = helpers$1.radiansToDegrees(latitude2);
	    return helpers$1.point([lng, lat], options.properties);
	}
	exports.default = destination;
	});

	var turfDestination = unwrapExports(destination_1);

	var meta = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });



	/**
	 * Callback for coordEach
	 *
	 * @callback coordEachCallback
	 * @param {Array<number>} currentCoord The current coordinate being processed.
	 * @param {number} coordIndex The current index of the coordinate being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 * @param {number} geometryIndex The current index of the Geometry being processed.
	 */

	/**
	 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
	 *
	 * @name coordEach
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentCoord, coordIndex, featureIndex, multiFeatureIndex)
	 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
	 * @returns {void}
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {"foo": "bar"}),
	 *   turf.point([36, 53], {"hello": "world"})
	 * ]);
	 *
	 * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
	 *   //=currentCoord
	 *   //=coordIndex
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 * });
	 */
	function coordEach(geojson, callback, excludeWrapCoord) {
	    // Handles null Geometry -- Skips this GeoJSON
	    if (geojson === null) return;
	    var j, k, l, geometry, stopG, coords,
	        geometryMaybeCollection,
	        wrapShrink = 0,
	        coordIndex = 0,
	        isGeometryCollection,
	        type = geojson.type,
	        isFeatureCollection = type === 'FeatureCollection',
	        isFeature = type === 'Feature',
	        stop = isFeatureCollection ? geojson.features.length : 1;

	    // This logic may look a little weird. The reason why it is that way
	    // is because it's trying to be fast. GeoJSON supports multiple kinds
	    // of objects at its root: FeatureCollection, Features, Geometries.
	    // This function has the responsibility of handling all of them, and that
	    // means that some of the `for` loops you see below actually just don't apply
	    // to certain inputs. For instance, if you give this just a
	    // Point geometry, then both loops are short-circuited and all we do
	    // is gradually rename the input until it's called 'geometry'.
	    //
	    // This also aims to allocate as few resources as possible: just a
	    // few numbers and booleans, rather than any temporary arrays as would
	    // be required with the normalization approach.
	    for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
	        geometryMaybeCollection = (isFeatureCollection ? geojson.features[featureIndex].geometry :
	            (isFeature ? geojson.geometry : geojson));
	        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
	        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

	        for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
	            var multiFeatureIndex = 0;
	            var geometryIndex = 0;
	            geometry = isGeometryCollection ?
	                geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection;

	            // Handles null Geometry -- Skips this geometry
	            if (geometry === null) continue;
	            coords = geometry.coordinates;
	            var geomType = geometry.type;

	            wrapShrink = (excludeWrapCoord && (geomType === 'Polygon' || geomType === 'MultiPolygon')) ? 1 : 0;

	            switch (geomType) {
	            case null:
	                break;
	            case 'Point':
	                if (callback(coords, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	                coordIndex++;
	                multiFeatureIndex++;
	                break;
	            case 'LineString':
	            case 'MultiPoint':
	                for (j = 0; j < coords.length; j++) {
	                    if (callback(coords[j], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	                    coordIndex++;
	                    if (geomType === 'MultiPoint') multiFeatureIndex++;
	                }
	                if (geomType === 'LineString') multiFeatureIndex++;
	                break;
	            case 'Polygon':
	            case 'MultiLineString':
	                for (j = 0; j < coords.length; j++) {
	                    for (k = 0; k < coords[j].length - wrapShrink; k++) {
	                        if (callback(coords[j][k], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	                        coordIndex++;
	                    }
	                    if (geomType === 'MultiLineString') multiFeatureIndex++;
	                    if (geomType === 'Polygon') geometryIndex++;
	                }
	                if (geomType === 'Polygon') multiFeatureIndex++;
	                break;
	            case 'MultiPolygon':
	                for (j = 0; j < coords.length; j++) {
	                    geometryIndex = 0;
	                    for (k = 0; k < coords[j].length; k++) {
	                        for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
	                            if (callback(coords[j][k][l], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	                            coordIndex++;
	                        }
	                        geometryIndex++;
	                    }
	                    multiFeatureIndex++;
	                }
	                break;
	            case 'GeometryCollection':
	                for (j = 0; j < geometry.geometries.length; j++)
	                    if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false) return false;
	                break;
	            default:
	                throw new Error('Unknown Geometry Type');
	            }
	        }
	    }
	}

	/**
	 * Callback for coordReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback coordReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Array<number>} currentCoord The current coordinate being processed.
	 * @param {number} coordIndex The current index of the coordinate being processed.
	 * Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 * @param {number} geometryIndex The current index of the Geometry being processed.
	 */

	/**
	 * Reduce coordinates in any GeoJSON object, similar to Array.reduce()
	 *
	 * @name coordReduce
	 * @param {FeatureCollection|Geometry|Feature} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentCoord, coordIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {"foo": "bar"}),
	 *   turf.point([36, 53], {"hello": "world"})
	 * ]);
	 *
	 * turf.coordReduce(features, function (previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
	 *   //=previousValue
	 *   //=currentCoord
	 *   //=coordIndex
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 *   return currentCoord;
	 * });
	 */
	function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
	    var previousValue = initialValue;
	    coordEach(geojson, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
	        if (coordIndex === 0 && initialValue === undefined) previousValue = currentCoord;
	        else previousValue = callback(previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex);
	    }, excludeWrapCoord);
	    return previousValue;
	}

	/**
	 * Callback for propEach
	 *
	 * @callback propEachCallback
	 * @param {Object} currentProperties The current Properties being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 */

	/**
	 * Iterate over properties in any GeoJSON object, similar to Array.forEach()
	 *
	 * @name propEach
	 * @param {FeatureCollection|Feature} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentProperties, featureIndex)
	 * @returns {void}
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.propEach(features, function (currentProperties, featureIndex) {
	 *   //=currentProperties
	 *   //=featureIndex
	 * });
	 */
	function propEach(geojson, callback) {
	    var i;
	    switch (geojson.type) {
	    case 'FeatureCollection':
	        for (i = 0; i < geojson.features.length; i++) {
	            if (callback(geojson.features[i].properties, i) === false) break;
	        }
	        break;
	    case 'Feature':
	        callback(geojson.properties, 0);
	        break;
	    }
	}


	/**
	 * Callback for propReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback propReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {*} currentProperties The current Properties being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 */

	/**
	 * Reduce properties in any GeoJSON object into a single value,
	 * similar to how Array.reduce works. However, in this case we lazily run
	 * the reduction, so an array of all properties is unnecessary.
	 *
	 * @name propReduce
	 * @param {FeatureCollection|Feature} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentProperties, featureIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.propReduce(features, function (previousValue, currentProperties, featureIndex) {
	 *   //=previousValue
	 *   //=currentProperties
	 *   //=featureIndex
	 *   return currentProperties
	 * });
	 */
	function propReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    propEach(geojson, function (currentProperties, featureIndex) {
	        if (featureIndex === 0 && initialValue === undefined) previousValue = currentProperties;
	        else previousValue = callback(previousValue, currentProperties, featureIndex);
	    });
	    return previousValue;
	}

	/**
	 * Callback for featureEach
	 *
	 * @callback featureEachCallback
	 * @param {Feature<any>} currentFeature The current Feature being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 */

	/**
	 * Iterate over features in any GeoJSON object, similar to
	 * Array.forEach.
	 *
	 * @name featureEach
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentFeature, featureIndex)
	 * @returns {void}
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {foo: 'bar'}),
	 *   turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.featureEach(features, function (currentFeature, featureIndex) {
	 *   //=currentFeature
	 *   //=featureIndex
	 * });
	 */
	function featureEach(geojson, callback) {
	    if (geojson.type === 'Feature') {
	        callback(geojson, 0);
	    } else if (geojson.type === 'FeatureCollection') {
	        for (var i = 0; i < geojson.features.length; i++) {
	            if (callback(geojson.features[i], i) === false) break;
	        }
	    }
	}

	/**
	 * Callback for featureReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback featureReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Feature} currentFeature The current Feature being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 */

	/**
	 * Reduce features in any GeoJSON object, similar to Array.reduce().
	 *
	 * @name featureReduce
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {"foo": "bar"}),
	 *   turf.point([36, 53], {"hello": "world"})
	 * ]);
	 *
	 * turf.featureReduce(features, function (previousValue, currentFeature, featureIndex) {
	 *   //=previousValue
	 *   //=currentFeature
	 *   //=featureIndex
	 *   return currentFeature
	 * });
	 */
	function featureReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    featureEach(geojson, function (currentFeature, featureIndex) {
	        if (featureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
	        else previousValue = callback(previousValue, currentFeature, featureIndex);
	    });
	    return previousValue;
	}

	/**
	 * Get all coordinates from any GeoJSON object.
	 *
	 * @name coordAll
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @returns {Array<Array<number>>} coordinate position array
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {foo: 'bar'}),
	 *   turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * var coords = turf.coordAll(features);
	 * //= [[26, 37], [36, 53]]
	 */
	function coordAll(geojson) {
	    var coords = [];
	    coordEach(geojson, function (coord) {
	        coords.push(coord);
	    });
	    return coords;
	}

	/**
	 * Callback for geomEach
	 *
	 * @callback geomEachCallback
	 * @param {Geometry} currentGeometry The current Geometry being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {Object} featureProperties The current Feature Properties being processed.
	 * @param {Array<number>} featureBBox The current Feature BBox being processed.
	 * @param {number|string} featureId The current Feature Id being processed.
	 */

	/**
	 * Iterate over each geometry in any GeoJSON object, similar to Array.forEach()
	 *
	 * @name geomEach
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
	 * @returns {void}
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.geomEach(features, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
	 *   //=currentGeometry
	 *   //=featureIndex
	 *   //=featureProperties
	 *   //=featureBBox
	 *   //=featureId
	 * });
	 */
	function geomEach(geojson, callback) {
	    var i, j, g, geometry, stopG,
	        geometryMaybeCollection,
	        isGeometryCollection,
	        featureProperties,
	        featureBBox,
	        featureId,
	        featureIndex = 0,
	        isFeatureCollection = geojson.type === 'FeatureCollection',
	        isFeature = geojson.type === 'Feature',
	        stop = isFeatureCollection ? geojson.features.length : 1;

	    // This logic may look a little weird. The reason why it is that way
	    // is because it's trying to be fast. GeoJSON supports multiple kinds
	    // of objects at its root: FeatureCollection, Features, Geometries.
	    // This function has the responsibility of handling all of them, and that
	    // means that some of the `for` loops you see below actually just don't apply
	    // to certain inputs. For instance, if you give this just a
	    // Point geometry, then both loops are short-circuited and all we do
	    // is gradually rename the input until it's called 'geometry'.
	    //
	    // This also aims to allocate as few resources as possible: just a
	    // few numbers and booleans, rather than any temporary arrays as would
	    // be required with the normalization approach.
	    for (i = 0; i < stop; i++) {

	        geometryMaybeCollection = (isFeatureCollection ? geojson.features[i].geometry :
	            (isFeature ? geojson.geometry : geojson));
	        featureProperties = (isFeatureCollection ? geojson.features[i].properties :
	            (isFeature ? geojson.properties : {}));
	        featureBBox = (isFeatureCollection ? geojson.features[i].bbox :
	            (isFeature ? geojson.bbox : undefined));
	        featureId = (isFeatureCollection ? geojson.features[i].id :
	            (isFeature ? geojson.id : undefined));
	        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
	        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

	        for (g = 0; g < stopG; g++) {
	            geometry = isGeometryCollection ?
	                geometryMaybeCollection.geometries[g] : geometryMaybeCollection;

	            // Handle null Geometry
	            if (geometry === null) {
	                if (callback(null, featureIndex, featureProperties, featureBBox, featureId) === false) return false;
	                continue;
	            }
	            switch (geometry.type) {
	            case 'Point':
	            case 'LineString':
	            case 'MultiPoint':
	            case 'Polygon':
	            case 'MultiLineString':
	            case 'MultiPolygon': {
	                if (callback(geometry, featureIndex, featureProperties, featureBBox, featureId) === false) return false;
	                break;
	            }
	            case 'GeometryCollection': {
	                for (j = 0; j < geometry.geometries.length; j++) {
	                    if (callback(geometry.geometries[j], featureIndex, featureProperties, featureBBox, featureId) === false) return false;
	                }
	                break;
	            }
	            default:
	                throw new Error('Unknown Geometry Type');
	            }
	        }
	        // Only increase `featureIndex` per each feature
	        featureIndex++;
	    }
	}

	/**
	 * Callback for geomReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback geomReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Geometry} currentGeometry The current Geometry being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {Object} featureProperties The current Feature Properties being processed.
	 * @param {Array<number>} featureBBox The current Feature BBox being processed.
	 * @param {number|string} featureId The current Feature Id being processed.
	 */

	/**
	 * Reduce geometry in any GeoJSON object, similar to Array.reduce().
	 *
	 * @name geomReduce
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.geomReduce(features, function (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
	 *   //=previousValue
	 *   //=currentGeometry
	 *   //=featureIndex
	 *   //=featureProperties
	 *   //=featureBBox
	 *   //=featureId
	 *   return currentGeometry
	 * });
	 */
	function geomReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    geomEach(geojson, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
	        if (featureIndex === 0 && initialValue === undefined) previousValue = currentGeometry;
	        else previousValue = callback(previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId);
	    });
	    return previousValue;
	}

	/**
	 * Callback for flattenEach
	 *
	 * @callback flattenEachCallback
	 * @param {Feature} currentFeature The current flattened feature being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 */

	/**
	 * Iterate over flattened features in any GeoJSON object, similar to
	 * Array.forEach.
	 *
	 * @name flattenEach
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentFeature, featureIndex, multiFeatureIndex)
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
	 * ]);
	 *
	 * turf.flattenEach(features, function (currentFeature, featureIndex, multiFeatureIndex) {
	 *   //=currentFeature
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 * });
	 */
	function flattenEach(geojson, callback) {
	    geomEach(geojson, function (geometry, featureIndex, properties, bbox, id) {
	        // Callback for single geometry
	        var type = (geometry === null) ? null : geometry.type;
	        switch (type) {
	        case null:
	        case 'Point':
	        case 'LineString':
	        case 'Polygon':
	            if (callback(helpers.feature(geometry, properties, {bbox: bbox, id: id}), featureIndex, 0) === false) return false;
	            return;
	        }

	        var geomType;

	        // Callback for multi-geometry
	        switch (type) {
	        case 'MultiPoint':
	            geomType = 'Point';
	            break;
	        case 'MultiLineString':
	            geomType = 'LineString';
	            break;
	        case 'MultiPolygon':
	            geomType = 'Polygon';
	            break;
	        }

	        for (var multiFeatureIndex = 0; multiFeatureIndex < geometry.coordinates.length; multiFeatureIndex++) {
	            var coordinate = geometry.coordinates[multiFeatureIndex];
	            var geom = {
	                type: geomType,
	                coordinates: coordinate
	            };
	            if (callback(helpers.feature(geom, properties), featureIndex, multiFeatureIndex) === false) return false;
	        }
	    });
	}

	/**
	 * Callback for flattenReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback flattenReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Feature} currentFeature The current Feature being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 */

	/**
	 * Reduce flattened features in any GeoJSON object, similar to Array.reduce().
	 *
	 * @name flattenReduce
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex, multiFeatureIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
	 * ]);
	 *
	 * turf.flattenReduce(features, function (previousValue, currentFeature, featureIndex, multiFeatureIndex) {
	 *   //=previousValue
	 *   //=currentFeature
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   return currentFeature
	 * });
	 */
	function flattenReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    flattenEach(geojson, function (currentFeature, featureIndex, multiFeatureIndex) {
	        if (featureIndex === 0 && multiFeatureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
	        else previousValue = callback(previousValue, currentFeature, featureIndex, multiFeatureIndex);
	    });
	    return previousValue;
	}

	/**
	 * Callback for segmentEach
	 *
	 * @callback segmentEachCallback
	 * @param {Feature<LineString>} currentSegment The current Segment being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 * @param {number} geometryIndex The current index of the Geometry being processed.
	 * @param {number} segmentIndex The current index of the Segment being processed.
	 * @returns {void}
	 */

	/**
	 * Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
	 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
	 *
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
	 * @param {Function} callback a method that takes (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex)
	 * @returns {void}
	 * @example
	 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
	 *
	 * // Iterate over GeoJSON by 2-vertex segments
	 * turf.segmentEach(polygon, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
	 *   //=currentSegment
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 *   //=segmentIndex
	 * });
	 *
	 * // Calculate the total number of segments
	 * var total = 0;
	 * turf.segmentEach(polygon, function () {
	 *     total++;
	 * });
	 */
	function segmentEach(geojson, callback) {
	    flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
	        var segmentIndex = 0;

	        // Exclude null Geometries
	        if (!feature.geometry) return;
	        // (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
	        var type = feature.geometry.type;
	        if (type === 'Point' || type === 'MultiPoint') return;

	        // Generate 2-vertex line segments
	        var previousCoords;
	        var previousFeatureIndex = 0;
	        var previousMultiIndex = 0;
	        var prevGeomIndex = 0;
	        if (coordEach(feature, function (currentCoord, coordIndex, featureIndexCoord, multiPartIndexCoord, geometryIndex) {
	            // Simulating a meta.coordReduce() since `reduce` operations cannot be stopped by returning `false`
	            if (previousCoords === undefined || featureIndex > previousFeatureIndex || multiPartIndexCoord > previousMultiIndex || geometryIndex > prevGeomIndex) {
	                previousCoords = currentCoord;
	                previousFeatureIndex = featureIndex;
	                previousMultiIndex = multiPartIndexCoord;
	                prevGeomIndex = geometryIndex;
	                segmentIndex = 0;
	                return;
	            }
	            var currentSegment = helpers.lineString([previousCoords, currentCoord], feature.properties);
	            if (callback(currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) === false) return false;
	            segmentIndex++;
	            previousCoords = currentCoord;
	        }) === false) return false;
	    });
	}

	/**
	 * Callback for segmentReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback segmentReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Feature<LineString>} currentSegment The current Segment being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 * @param {number} geometryIndex The current index of the Geometry being processed.
	 * @param {number} segmentIndex The current index of the Segment being processed.
	 */

	/**
	 * Reduce 2-vertex line segment in any GeoJSON object, similar to Array.reduce()
	 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
	 *
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
	 * @param {Function} callback a method that takes (previousValue, currentSegment, currentIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {void}
	 * @example
	 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
	 *
	 * // Iterate over GeoJSON by 2-vertex segments
	 * turf.segmentReduce(polygon, function (previousSegment, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
	 *   //= previousSegment
	 *   //= currentSegment
	 *   //= featureIndex
	 *   //= multiFeatureIndex
	 *   //= geometryIndex
	 *   //= segmentInex
	 *   return currentSegment
	 * });
	 *
	 * // Calculate the total number of segments
	 * var initialValue = 0
	 * var total = turf.segmentReduce(polygon, function (previousValue) {
	 *     previousValue++;
	 *     return previousValue;
	 * }, initialValue);
	 */
	function segmentReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    var started = false;
	    segmentEach(geojson, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
	        if (started === false && initialValue === undefined) previousValue = currentSegment;
	        else previousValue = callback(previousValue, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex);
	        started = true;
	    });
	    return previousValue;
	}

	/**
	 * Callback for lineEach
	 *
	 * @callback lineEachCallback
	 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed
	 * @param {number} featureIndex The current index of the Feature being processed
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
	 * @param {number} geometryIndex The current index of the Geometry being processed
	 */

	/**
	 * Iterate over line or ring coordinates in LineString, Polygon, MultiLineString, MultiPolygon Features or Geometries,
	 * similar to Array.forEach.
	 *
	 * @name lineEach
	 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
	 * @param {Function} callback a method that takes (currentLine, featureIndex, multiFeatureIndex, geometryIndex)
	 * @example
	 * var multiLine = turf.multiLineString([
	 *   [[26, 37], [35, 45]],
	 *   [[36, 53], [38, 50], [41, 55]]
	 * ]);
	 *
	 * turf.lineEach(multiLine, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
	 *   //=currentLine
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 * });
	 */
	function lineEach(geojson, callback) {
	    // validation
	    if (!geojson) throw new Error('geojson is required');

	    flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
	        if (feature.geometry === null) return;
	        var type = feature.geometry.type;
	        var coords = feature.geometry.coordinates;
	        switch (type) {
	        case 'LineString':
	            if (callback(feature, featureIndex, multiFeatureIndex, 0, 0) === false) return false;
	            break;
	        case 'Polygon':
	            for (var geometryIndex = 0; geometryIndex < coords.length; geometryIndex++) {
	                if (callback(helpers.lineString(coords[geometryIndex], feature.properties), featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	            }
	            break;
	        }
	    });
	}

	/**
	 * Callback for lineReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback lineReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed.
	 * @param {number} featureIndex The current index of the Feature being processed
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
	 * @param {number} geometryIndex The current index of the Geometry being processed
	 */

	/**
	 * Reduce features in any GeoJSON object, similar to Array.reduce().
	 *
	 * @name lineReduce
	 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
	 * @param {Function} callback a method that takes (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var multiPoly = turf.multiPolygon([
	 *   turf.polygon([[[12,48],[2,41],[24,38],[12,48]], [[9,44],[13,41],[13,45],[9,44]]]),
	 *   turf.polygon([[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]])
	 * ]);
	 *
	 * turf.lineReduce(multiPoly, function (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
	 *   //=previousValue
	 *   //=currentLine
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 *   return currentLine
	 * });
	 */
	function lineReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    lineEach(geojson, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
	        if (featureIndex === 0 && initialValue === undefined) previousValue = currentLine;
	        else previousValue = callback(previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex);
	    });
	    return previousValue;
	}

	/**
	 * Finds a particular 2-vertex LineString Segment from a GeoJSON using `@turf/meta` indexes.
	 *
	 * Negative indexes are permitted.
	 * Point & MultiPoint will always return null.
	 *
	 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
	 * @param {Object} [options={}] Optional parameters
	 * @param {number} [options.featureIndex=0] Feature Index
	 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
	 * @param {number} [options.geometryIndex=0] Geometry Index
	 * @param {number} [options.segmentIndex=0] Segment Index
	 * @param {Object} [options.properties={}] Translate Properties to output LineString
	 * @param {BBox} [options.bbox={}] Translate BBox to output LineString
	 * @param {number|string} [options.id={}] Translate Id to output LineString
	 * @returns {Feature<LineString>} 2-vertex GeoJSON Feature LineString
	 * @example
	 * var multiLine = turf.multiLineString([
	 *     [[10, 10], [50, 30], [30, 40]],
	 *     [[-10, -10], [-50, -30], [-30, -40]]
	 * ]);
	 *
	 * // First Segment (defaults are 0)
	 * turf.findSegment(multiLine);
	 * // => Feature<LineString<[[10, 10], [50, 30]]>>
	 *
	 * // First Segment of 2nd Multi Feature
	 * turf.findSegment(multiLine, {multiFeatureIndex: 1});
	 * // => Feature<LineString<[[-10, -10], [-50, -30]]>>
	 *
	 * // Last Segment of Last Multi Feature
	 * turf.findSegment(multiLine, {multiFeatureIndex: -1, segmentIndex: -1});
	 * // => Feature<LineString<[[-50, -30], [-30, -40]]>>
	 */
	function findSegment(geojson, options) {
	    // Optional Parameters
	    options = options || {};
	    if (!helpers.isObject(options)) throw new Error('options is invalid');
	    var featureIndex = options.featureIndex || 0;
	    var multiFeatureIndex = options.multiFeatureIndex || 0;
	    var geometryIndex = options.geometryIndex || 0;
	    var segmentIndex = options.segmentIndex || 0;

	    // Find FeatureIndex
	    var properties = options.properties;
	    var geometry;

	    switch (geojson.type) {
	    case 'FeatureCollection':
	        if (featureIndex < 0) featureIndex = geojson.features.length + featureIndex;
	        properties = properties || geojson.features[featureIndex].properties;
	        geometry = geojson.features[featureIndex].geometry;
	        break;
	    case 'Feature':
	        properties = properties || geojson.properties;
	        geometry = geojson.geometry;
	        break;
	    case 'Point':
	    case 'MultiPoint':
	        return null;
	    case 'LineString':
	    case 'Polygon':
	    case 'MultiLineString':
	    case 'MultiPolygon':
	        geometry = geojson;
	        break;
	    default:
	        throw new Error('geojson is invalid');
	    }

	    // Find SegmentIndex
	    if (geometry === null) return null;
	    var coords = geometry.coordinates;
	    switch (geometry.type) {
	    case 'Point':
	    case 'MultiPoint':
	        return null;
	    case 'LineString':
	        if (segmentIndex < 0) segmentIndex = coords.length + segmentIndex - 1;
	        return helpers.lineString([coords[segmentIndex], coords[segmentIndex + 1]], properties, options);
	    case 'Polygon':
	        if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
	        if (segmentIndex < 0) segmentIndex = coords[geometryIndex].length + segmentIndex - 1;
	        return helpers.lineString([coords[geometryIndex][segmentIndex], coords[geometryIndex][segmentIndex + 1]], properties, options);
	    case 'MultiLineString':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        if (segmentIndex < 0) segmentIndex = coords[multiFeatureIndex].length + segmentIndex - 1;
	        return helpers.lineString([coords[multiFeatureIndex][segmentIndex], coords[multiFeatureIndex][segmentIndex + 1]], properties, options);
	    case 'MultiPolygon':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        if (geometryIndex < 0) geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
	        if (segmentIndex < 0) segmentIndex = coords[multiFeatureIndex][geometryIndex].length - segmentIndex - 1;
	        return helpers.lineString([coords[multiFeatureIndex][geometryIndex][segmentIndex], coords[multiFeatureIndex][geometryIndex][segmentIndex + 1]], properties, options);
	    }
	    throw new Error('geojson is invalid');
	}

	/**
	 * Finds a particular Point from a GeoJSON using `@turf/meta` indexes.
	 *
	 * Negative indexes are permitted.
	 *
	 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
	 * @param {Object} [options={}] Optional parameters
	 * @param {number} [options.featureIndex=0] Feature Index
	 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
	 * @param {number} [options.geometryIndex=0] Geometry Index
	 * @param {number} [options.coordIndex=0] Coord Index
	 * @param {Object} [options.properties={}] Translate Properties to output Point
	 * @param {BBox} [options.bbox={}] Translate BBox to output Point
	 * @param {number|string} [options.id={}] Translate Id to output Point
	 * @returns {Feature<Point>} 2-vertex GeoJSON Feature Point
	 * @example
	 * var multiLine = turf.multiLineString([
	 *     [[10, 10], [50, 30], [30, 40]],
	 *     [[-10, -10], [-50, -30], [-30, -40]]
	 * ]);
	 *
	 * // First Segment (defaults are 0)
	 * turf.findPoint(multiLine);
	 * // => Feature<Point<[10, 10]>>
	 *
	 * // First Segment of the 2nd Multi-Feature
	 * turf.findPoint(multiLine, {multiFeatureIndex: 1});
	 * // => Feature<Point<[-10, -10]>>
	 *
	 * // Last Segment of last Multi-Feature
	 * turf.findPoint(multiLine, {multiFeatureIndex: -1, coordIndex: -1});
	 * // => Feature<Point<[-30, -40]>>
	 */
	function findPoint(geojson, options) {
	    // Optional Parameters
	    options = options || {};
	    if (!helpers.isObject(options)) throw new Error('options is invalid');
	    var featureIndex = options.featureIndex || 0;
	    var multiFeatureIndex = options.multiFeatureIndex || 0;
	    var geometryIndex = options.geometryIndex || 0;
	    var coordIndex = options.coordIndex || 0;

	    // Find FeatureIndex
	    var properties = options.properties;
	    var geometry;

	    switch (geojson.type) {
	    case 'FeatureCollection':
	        if (featureIndex < 0) featureIndex = geojson.features.length + featureIndex;
	        properties = properties || geojson.features[featureIndex].properties;
	        geometry = geojson.features[featureIndex].geometry;
	        break;
	    case 'Feature':
	        properties = properties || geojson.properties;
	        geometry = geojson.geometry;
	        break;
	    case 'Point':
	    case 'MultiPoint':
	        return null;
	    case 'LineString':
	    case 'Polygon':
	    case 'MultiLineString':
	    case 'MultiPolygon':
	        geometry = geojson;
	        break;
	    default:
	        throw new Error('geojson is invalid');
	    }

	    // Find Coord Index
	    if (geometry === null) return null;
	    var coords = geometry.coordinates;
	    switch (geometry.type) {
	    case 'Point':
	        return helpers.point(coords, properties, options);
	    case 'MultiPoint':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        return helpers.point(coords[multiFeatureIndex], properties, options);
	    case 'LineString':
	        if (coordIndex < 0) coordIndex = coords.length + coordIndex;
	        return helpers.point(coords[coordIndex], properties, options);
	    case 'Polygon':
	        if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
	        if (coordIndex < 0) coordIndex = coords[geometryIndex].length + coordIndex;
	        return helpers.point(coords[geometryIndex][coordIndex], properties, options);
	    case 'MultiLineString':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        if (coordIndex < 0) coordIndex = coords[multiFeatureIndex].length + coordIndex;
	        return helpers.point(coords[multiFeatureIndex][coordIndex], properties, options);
	    case 'MultiPolygon':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        if (geometryIndex < 0) geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
	        if (coordIndex < 0) coordIndex = coords[multiFeatureIndex][geometryIndex].length - coordIndex;
	        return helpers.point(coords[multiFeatureIndex][geometryIndex][coordIndex], properties, options);
	    }
	    throw new Error('geojson is invalid');
	}

	exports.coordEach = coordEach;
	exports.coordReduce = coordReduce;
	exports.propEach = propEach;
	exports.propReduce = propReduce;
	exports.featureEach = featureEach;
	exports.featureReduce = featureReduce;
	exports.coordAll = coordAll;
	exports.geomEach = geomEach;
	exports.geomReduce = geomReduce;
	exports.flattenEach = flattenEach;
	exports.flattenReduce = flattenReduce;
	exports.segmentEach = segmentEach;
	exports.segmentReduce = segmentReduce;
	exports.lineEach = lineEach;
	exports.lineReduce = lineReduce;
	exports.findSegment = findSegment;
	exports.findPoint = findPoint;
	});

	unwrapExports(meta);
	var meta_1 = meta.coordEach;
	var meta_2 = meta.coordReduce;
	var meta_3 = meta.propEach;
	var meta_4 = meta.propReduce;
	var meta_5 = meta.featureEach;
	var meta_6 = meta.featureReduce;
	var meta_7 = meta.coordAll;
	var meta_8 = meta.geomEach;
	var meta_9 = meta.geomReduce;
	var meta_10 = meta.flattenEach;
	var meta_11 = meta.flattenReduce;
	var meta_12 = meta.segmentEach;
	var meta_13 = meta.segmentReduce;
	var meta_14 = meta.lineEach;
	var meta_15 = meta.lineReduce;
	var meta_16 = meta.findSegment;
	var meta_17 = meta.findPoint;

	var id = 0;
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
	  initialize: function initialize() {
	    var geoJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.geoJSON;
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	    // merge default and passed options
	    this._options = Object.assign({}, this.options, options);
	    this._geometryType = geoJSON.geometry.type;
	    L.Util.setOptions(this, this._options);

	    this._initGeoJson(geoJSON, this._options);
	  },
	  _initGeoJson: function _initGeoJson(geoJSON, options) {
	    this._geoJSONLayer = L.geoJSON(geoJSON, options); // for unique plugin id

	    this._currentId = id++;
	  },
	  setCenter: function setCenter(center) {
	    this._redraw(center.slice(0).reverse());
	  },
	  reset: function reset() {
	    if (!this._origCenter) {
	      return false;
	    }

	    this._redraw(this._origCenter);
	  },
	  onAdd: function onAdd(map) {
	    this._map = map;

	    this._geoJSONLayer.addTo(this._map); // our currentlayer is always the first layer of geoJson layersgroup
	    // but has a dynamic key


	    this._currentLayer = this._geoJSONLayer.getLayers()[0];

	    var centerCoords = this._currentLayer.getCenter();

	    this._origCenter = [centerCoords.lng, centerCoords.lat]; // wrap currentlayer into draggable layer

	    this._createDraggable(this._currentLayer);

	    this._initialBearingDistance = this._getBearingDistance([centerCoords.lng, centerCoords.lat]);

	    if (this._options.markerDiv && this._options.markerDiv.length) {
	      this._dragMarker = this._createMarker(centerCoords, this._options);

	      this._dragMarker.addTo(this._map);
	    }
	  },
	  _createMarker: function _createMarker(center, options) {
	    var markerClass = options.markerClass,
	        markerDiv = options.markerDiv,
	        iconAnchor = options.iconAnchor;
	    var dragIcon = L.divIcon({
	      className: markerClass,
	      html: markerDiv,
	      iconAnchor: iconAnchor
	    });
	    return L.marker(center, {
	      icon: dragIcon,
	      draggable: true
	    }).on('dragstart', this._onMarkerDragStart, this).on('drag', this._onMarkerDrag, this);
	  },
	  _onMarkerDragStart: function _onMarkerDragStart(evt) {
	    var _evt$target$_latlng = evt.target._latlng,
	        lng = _evt$target$_latlng.lng,
	        lat = _evt$target$_latlng.lat;

	    var center = this._currentLayer.getCenter();

	    this._dragOffset = [lng - center.lng, lat - center.lat];
	  },
	  _onMarkerDrag: function _onMarkerDrag(evt) {
	    this._redraw([evt.latlng.lng, evt.latlng.lat]);
	  },
	  _createDraggable: function _createDraggable(layer) {
	    var draggablePath = new L.Draggable(layer._path);
	    draggablePath.enable();
	    draggablePath.on('dragstart', this._onDragStart, this).on('drag', this._onDrag, this);
	  },
	  _onDragStart: function _onDragStart(evt) {
	    var event = evt.touches ? evt.touches[0] : evt.target;

	    var pos = this._getPositionFromEvent(event);

	    var coords = this._getLatLngFromPosition(pos);

	    var center = this._currentLayer.getCenter();

	    this._dragOffset = [coords[0] - center.lng, coords[1] - center.lat];
	  },
	  _onDrag: function _onDrag(evt) {
	    var event = evt.touches ? evt.touches[0] : evt.originalEvent;

	    var pos = this._getPositionFromEvent(event);

	    var coords = this._getLatLngFromPosition(pos);

	    this._redraw([coords[0] - this._dragOffset[0], coords[1] - this._dragOffset[1]]);
	  },
	  _getPositionFromEvent: function _getPositionFromEvent(evt) {
	    if (typeof evt._startPoint !== 'undefined') {
	      return evt._startPoint;
	    }

	    return {
	      x: evt.clientX,
	      y: evt.clientY
	    };
	  },
	  _getLatLngFromPosition: function _getLatLngFromPosition(pos) {
	    var _this$_map$_container = this._map._container.getClientRects()[0],
	        left = _this$_map$_container.left,
	        top = _this$_map$_container.top;

	    var x = pos.x,
	        y = pos.y;
	    var posWithOffset = L.point(x - left, y - top);

	    var _this$_map$containerP = this._map.containerPointToLatLng(posWithOffset),
	        lng = _this$_map$containerP.lng,
	        lat = _this$_map$containerP.lat;

	    return [lng, lat];
	  },
	  _getBearingDistance: function _getBearingDistance(center) {
	    var _this = this;

	    if (this._isMultiPolygon()) {
	      return this._currentLayer.feature.geometry.coordinates.map(function (coords) {
	        return coords[0].map(function (coord) {
	          return _this._getBearingAndDistance(center, coord);
	        });
	      });
	    }

	    return meta_7(this._currentLayer.feature).map(function (coord) {
	      return _this._getBearingAndDistance(center, coord);
	    });
	  },
	  _getBearingAndDistance: function _getBearingAndDistance(center, coord) {
	    var bearing = turfBearing(center, coord);
	    var distance = turfDistance(center, coord, {
	      units: 'kilometers'
	    });
	    return {
	      bearing: bearing,
	      distance: distance
	    };
	  },
	  _redraw: function _redraw(newPos) {
	    var newPoints;

	    if (this._isMultiPolygon()) {
	      newPoints = this._initialBearingDistance.map(function (params) {
	        return [params.map(function (param) {
	          return turfDestination(newPos, param.distance, param.bearing, {
	            units: 'kilometers'
	          }).geometry.coordinates;
	        })];
	      });
	    } else {
	      newPoints = this._initialBearingDistance.map(function (param) {
	        return turfDestination(newPos, param.distance, param.bearing, {
	          units: 'kilometers'
	        }).geometry.coordinates;
	      });
	    }

	    var newFeature = {
	      type: 'Feature',
	      properties: {},
	      geometry: {
	        type: this._geometryType,
	        coordinates: this._getCoordsByType(newPoints, this._geometryType)
	      }
	    };

	    this._geoJSONLayer.clearLayers();

	    this._geoJSONLayer.addData(newFeature); // our currentlayer is always the first layer of geoJson layersgroup
	    // but has a dynamic key


	    this._currentLayer = this._geoJSONLayer.getLayers()[0]; // add draggable hook again, as we using internal a new layer
	    // center marker if existing

	    this._createDraggable(this._currentLayer);

	    this._dragMarker && this._dragMarker.setLatLng(this._currentLayer.getCenter());
	  },
	  onRemove: function onRemove(map) {
	    this._map = map;

	    this._map.removeLayer(this._geoJSONLayer);

	    if (this._dragMarker) {
	      this._map.removeLayer(this._dragMarker);
	    }

	    return this;
	  },
	  _getCoordsByType: function _getCoordsByType(point, type) {
	    switch (type) {
	      case 'LineString':
	        {
	          return point;
	        }

	      case 'Polygon':
	        {
	          return [point];
	        }

	      case 'MultiPolygon':
	        {
	          return point;
	        }

	      default:
	        {
	          return [point];
	        }
	    }
	  },
	  _isMultiPolygon: function _isMultiPolygon() {
	    return this._geometryType === 'MultiPolygon';
	  }
	});

	L.trueSize = function (geoJSON, options) {
	  return new L.TrueSize(geoJSON, options);
	};

})));
//# sourceMappingURL=Leaflet.TrueSize.umd.js.map
