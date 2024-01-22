import { set } from 'lodash';

/**
 * Swaps keys and values in an object.
 * @param object object to swap keys and values
 * @returns object with swapped keys and values
 */
export const swapKeys = <SK extends PropertyKey, DK extends PropertyKey>(
  object: Record<SK, DK>,
): Record<DK, SK> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result: Record<DK, SK> = {};

  for (const key in object) {
    const dk = object[key];

    if (dk === null) {
      continue;
    }

    result[dk] = key;
  }

  return result;
};

/**
 * Transforms object keys according to the map.
 * @param object object to transform
 * @param map map of object keys to new keys
 * @returns transformed object
 */
export const transformKeys = <DK extends PropertyKey>(
  object: Record<PropertyKey, any>,
  map: Partial<Record<DK, PropertyKey>>,
): Partial<Record<DK, any>> => {
  const result: ReturnType<typeof transformKeys> = {};

  for (const key in map) {
    const value = map[key];

    if (!value) {
      continue;
    }

    set(result, key, object[value]);
  }

  return result;
};
