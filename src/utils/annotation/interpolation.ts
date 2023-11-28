import { TAnnotation } from '../../store/annotation';
import { map, reduce, some } from 'lodash';

/**
 * Check if some group of same frames can be interpolated.
 * It can be interpolated if there is at least one frame between each of them.
 * @param annotations Array of annotations
 */
export const isGroupInterpolatable = (
  annotations: Array<TAnnotation>,
): boolean => {
  const frames = map(annotations, (annotation) => annotation.properties.frame);

  const spaces = reduce(
    frames,
    (acc, frame, index, array) => {
      if (index === 0) return acc;

      const prevFrame = array[index - 1];
      const diff = frame - prevFrame;

      return [...acc, diff];
    },
    [] as Array<number>,
  );

  return some(spaces, (space) => space > 1);
};
