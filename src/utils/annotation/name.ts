import { TAnnotation } from '../../store/annotation';

export const NEW_POLYGON_NAME = 'new-polygon';

export const getPolygonName = (annotation?: TAnnotation) => {
  if (!annotation) return NEW_POLYGON_NAME;

  return `polygon-${annotation.id}`;
};
