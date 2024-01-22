import { fromPairs, isArray, isObject, isString, map, toPairs } from 'lodash';

const iso8601Regex =
  /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

export type TResponseTransformFunction<
  Value extends Record<PropertyKey, any> = Record<PropertyKey, any>,
> = (object: Value) => Value;

export type TResponseFilterFunction<
  Value extends Record<PropertyKey, any> = Record<PropertyKey, any>,
> = (object: Array<Value>) => Array<Value>;

export const transformDate = <Value extends Record<PropertyKey, any>>(
  object: Value,
): Value => {
  if (isArray(object)) return object as Value;

  const pairedObject = toPairs(object);

  const updatedObject = map(pairedObject, ([key, value]) => {
    if (isString(value) && iso8601Regex.test(value)) {
      return [key, new Date(value)];
    }

    if (isArray(value)) {
      return [key, value.map(transformDate)];
    }

    if (isObject(value)) {
      return [key, transformDate(value)];
    }

    return [key, value];
  });

  return fromPairs(updatedObject) as Value;
};

export const applyTransforms =
  <Value extends Record<PropertyKey, string>>(
    ...transforms: Array<TResponseTransformFunction<Value>>
  ): TResponseTransformFunction<Value> =>
  (object: Value) =>
    transforms.reduce((acc, transform) => transform(acc), object);

export const applyFilters =
  <Value extends Record<PropertyKey, any>>(
    ...transforms: Array<(value: Value) => boolean>
  ): TResponseFilterFunction<Value> =>
  (object: Array<Value>) =>
    transforms.reduce((acc, filterFunc) => acc.filter(filterFunc), object);
