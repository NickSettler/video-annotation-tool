import earcut from 'earcut';
import { chunk, flatten, map } from 'lodash';

export const polygonTriangulation = (points: Array<Array<number>>) => {
  const flatPoints = flatten(points);

  const triangles = earcut(flatPoints);

  return map(chunk(triangles, 3), (triangle) =>
    map(triangle, (index) => points[index]),
  );
};
