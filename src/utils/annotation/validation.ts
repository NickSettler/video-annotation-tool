import { every, isArray, isUndefined } from 'lodash';

export const checkAnnotationProperties = (annotationLike: any): boolean => {
  if (!annotationLike) return false;
  if (!annotationLike.properties) return false;
  if (isUndefined(annotationLike.properties.name)) return false;
  if (isUndefined(annotationLike.properties.frame)) return false;
  if (isUndefined(annotationLike.properties.color)) return false;
  if (isUndefined(annotationLike.properties.type)) return false;

  return true;
};

export const checkAnnotationType = (annotationLike: any): boolean => {
  if (!annotationLike) return false;
  if (isUndefined(annotationLike.type)) return false;
  return annotationLike.type === 'Feature';
};

export const checkAnnotationCoordinates = (annotationLike: any): boolean => {
  if (!annotationLike) return false;
  if (isUndefined(annotationLike.geometry)) return false;
  if (isUndefined(annotationLike.geometry.type)) return false;
  if (annotationLike.geometry.type !== 'MultiPoint') return false;
  if (isUndefined(annotationLike.geometry.coordinates)) return false;
  if (!isArray(annotationLike.geometry.coordinates)) return false;
  if (
    !every(annotationLike.geometry.coordinates, (coordinate) =>
      isArray(coordinate),
    )
  )
    return false;
  if (
    !every(
      annotationLike.geometry.coordinates,
      (coordinate) => coordinate.length === 2,
    )
  )
    return false;
  if (
    !every(
      annotationLike.geometry.coordinates,
      (coordinate) => coordinate[0] >= 0 && coordinate[1] >= 0,
    )
  )
    return false;

  return true;
};

export const checkAnnotation = (annotationLike: any): boolean => {
  if (!annotationLike) return false;
  if (!checkAnnotationType(annotationLike)) return false;
  if (!checkAnnotationProperties(annotationLike)) return false;
  if (!checkAnnotationCoordinates(annotationLike)) return false;

  return true;
};
