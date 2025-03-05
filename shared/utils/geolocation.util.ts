/**
 * Calculates the distance between two geographic coordinates using the Haversine formula.
 * @param lat1 Latitude of the first point in degrees
 * @param lon1 Longitude of the first point in degrees
 * @param lat2 Latitude of the second point in degrees
 * @param lon2 Longitude of the second point in degrees
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

/**
 * Converts degrees to radians
 * @param deg Angle in degrees
 * @returns Angle in radians
 */
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Validates if the given coordinates are valid geographic coordinates
 * @param latitude Latitude in degrees
 * @param longitude Longitude in degrees
 * @returns Boolean indicating if the coordinates are valid
 */
export function isValidCoordinates(
  latitude: number,
  longitude: number,
): boolean {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * Formats coordinates as a string
 * @param latitude Latitude in degrees
 * @param longitude Longitude in degrees
 * @returns Formatted string representation of coordinates
 */
export function formatCoordinates(
  latitude: number,
  longitude: number,
): string {
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(6)}° ${latDir}, ${Math.abs(
    longitude,
  ).toFixed(6)}° ${lonDir}`;
}
