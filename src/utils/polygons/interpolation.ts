import { map } from 'lodash';

export const interpolatePolygons = (
  polygon1: Array<Array<number>>,
  polygon2: Array<Array<number>>,
  stepsNumber: number,
): Array<Array<Array<number>>> => {
  if (polygon1.length !== polygon2.length) {
    throw new Error('Both polygons must have the same number of points');
  }

  const pointsDifference = map(polygon1, (point, index) => [
    point[0] - polygon2[index][0],
    point[1] - polygon2[index][1],
  ]);
  const pointsSpeed = map(pointsDifference, (difference) => [
    difference[0] / stepsNumber,
    difference[1] / stepsNumber,
  ]);

  const result: Array<Array<Array<number>>> = [];

  for (let i = 1; i < stepsNumber; i++) {
    const step: Array<Array<number>> = [];

    for (let j = 0; j < polygon1.length; j++) {
      step.push([
        polygon1[j][0] - pointsSpeed[j][0] * i,
        polygon1[j][1] - pointsSpeed[j][1] * i,
      ]);
    }

    result.push(step);
  }

  return result;
};
