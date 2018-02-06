// custom destination function, cloned from https://github.com/Turfjs/turf
import { getCoord } from '@turf/invariant';
import { isObject, lengthToRadians, point } from '@turf/helpers';

//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html
/**
 * Takes a {@link Point} and calculates the location of a destination point given a distance in degrees, radians, miles, or kilometers; and bearing in degrees. This uses the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula) to account for global curvature.
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
export function destination(origin, distance, bearing, options) {
  var degrees2radians = Math.PI / 180;
  var radians2degrees = 180 / Math.PI;
  // Optional parameters
  options = options || {};
  if (!isObject(options)) throw new Error('options is invalid');
  var units = options.units;
  var properties = options.properties;
  // Optional parameters

  // Handle input
  var coordinates1 = getCoord(origin);
  var longitude1 = degrees2radians * coordinates1[0];
  var latitude1 = degrees2radians * coordinates1[1];
  var bearing_rad = degrees2radians * bearing;
  var radians = lengthToRadians(distance, units);

  // Main
  var latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians) +
      Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearing_rad));
  var longitude2 = longitude1 + Math.atan2(Math.sin(bearing_rad) * Math.sin(radians) * Math.cos(latitude1),
      Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));
  var lng = radians2degrees * longitude2;
  var lat = radians2degrees * latitude2;

  return point([lng, lat], properties);
}

export default {
  destination
}
