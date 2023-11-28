import { TAnnotation, TAnnotationSelection } from '../../store/annotation';
import { filter, groupBy, keys, some } from 'lodash';

export const isAnnotationSelectionGroupable = (
  annotations: Array<TAnnotation>,
  selection: Array<TAnnotationSelection>,
): boolean => {
  const filteredAnnotations = filter(annotations, (annotation) =>
    some(selection, (selected) => selected.id === annotation.id),
  );
  const groupedById = groupBy(filteredAnnotations, 'id');

  if (some(groupedById, (group) => group.length > 1)) return false;

  const groupedByFrame = groupBy(selection, 'frame');

  if (some(groupedByFrame, (frame) => frame.length > 1)) return false;

  const frames = keys(groupedByFrame);

  if (frames.length !== 2) return false;

  const [firstFrame, secondFrame] = frames;

  return Math.abs(parseInt(secondFrame) - parseInt(firstFrame)) >= 1;
};
