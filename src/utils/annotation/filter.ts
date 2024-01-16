import { TAnnotation } from '../../store/annotation';
import { isArray } from 'lodash';

export type TAnnotationFilterParams = {
  type: string | null;
};

function filterAnnotations(
  annotations: Array<Array<TAnnotation>>,
  params: TAnnotationFilterParams,
): Array<Array<TAnnotation>>;
function filterAnnotations(
  annotations: Array<TAnnotation>,
  params: TAnnotationFilterParams,
): Array<TAnnotation>;
function filterAnnotations(
  annotations: Array<Array<TAnnotation>> | Array<TAnnotation>,
  params: TAnnotationFilterParams,
) {
  const { type } = params;

  if (!type) {
    return annotations;
  }

  if (annotations.every(isArray)) {
    return annotations.map((_annotations) =>
      _annotations.filter((annotation) => annotation.properties.type === type),
    );
  }

  return annotations.filter(
    (annotation) => annotation.properties.type === type,
  );
}

export { filterAnnotations };
