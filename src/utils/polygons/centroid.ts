export const getPolygonCentroid = (polygon: Array<Array<number>>) => {
  const n = polygon.length;

  let cx = 0; // x-coordinate of centroid
  let cy = 0; // y-coordinate of centroid
  let area = 0; // signed area of the polygon

  for (let i = 0; i < n; i++) {
    const x1 = polygon[i][0];
    const y1 = polygon[i][1];
    const x2 = polygon[(i + 1) % n][0];
    const y2 = polygon[(i + 1) % n][1];

    const commonFactor = x1 * y2 - x2 * y1; // common factor in the Shoelace formula
    area += commonFactor;
    cx += (x1 + x2) * commonFactor;
    cy += (y1 + y2) * commonFactor;
  }

  area *= 0.5;
  cx /= 6 * area;
  cy /= 6 * area;

  return [cx, cy];
};
