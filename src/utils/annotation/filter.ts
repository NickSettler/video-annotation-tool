import { TAnnotation } from '../../store/annotation';
import { isArray, isNull } from 'lodash';

export type TAnnotationFilterParams = {
  type: string | null;
  from: number | null;
  to: number | null;
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
  const { type, from, to } = params;

  if (isNull(type) && isNull(from) && isNull(to)) {
    return annotations;
  }

  const filterFn = (annotation: TAnnotation) =>
    (!isNull(type) ? annotation.properties.type === type : true) &&
    (!isNull(from) ? annotation.properties.frame >= from : true) &&
    (!isNull(to) ? annotation.properties.frame <= to : true);

  if (annotations.every(isArray)) {
    return annotations.map((_annotations) =>
      _annotations.filter((annotation) => filterFn(annotation)),
    );
  }

  return annotations.filter((annotation) => filterFn(annotation));
}

export { filterAnnotations };
