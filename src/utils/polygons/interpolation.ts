export const findClosestPoint = (
  targetPoint: Array<number>,
  points: Array<Array<number>>,
): Array<number> => {
  let minDistance = Number.MAX_VALUE;
  let closestPoint: Array<number> = [];

  for (const point of points) {
    const distance = Math.sqrt(
      Math.pow(targetPoint[0] - point[0], 2) +
        Math.pow(targetPoint[1] - point[1], 2),
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = point.slice();
    }
  }

  return closestPoint;
};

export const interpolatePolygons = (
  polygon1: Array<Array<number>>,
  polygon2: Array<Array<number>>,
  stepsNumber: number,
): Array<Array<Array<number>>> => {
  if (polygon1.length !== polygon2.length) {
    throw new Error('Both polygons must have the same number of points');
  }

  const result: Array<Array<Array<number>>> = [];

  for (let i = 0; i < stepsNumber; i++) {
    const step: Array<Array<number>> = [];

    for (const polygon1Point of polygon1) {
      const closestPoint = findClosestPoint(polygon1Point, polygon2);

      // Linear interpolation between the points of polygon1 and the closest point in polygon2
      const interpolatedX =
        polygon1Point[0] +
        (closestPoint[0] - polygon1Point[0]) * (i / (stepsNumber - 1));
      const interpolatedY =
        polygon1Point[1] +
        (closestPoint[1] - polygon1Point[1]) * (i / (stepsNumber - 1));

      step.push([interpolatedX, interpolatedY]);
    }

    result.push(step);
  }

  return result;
};
