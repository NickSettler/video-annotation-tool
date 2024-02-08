import { DotNestedKeys } from '../types/path.type';
import { TAnnotation } from '../../store/annotation';
import {
  every,
  find,
  flattenDepth,
  isArray,
  isNumber,
  isObject,
  keys,
  merge,
  pickBy,
  sortBy,
} from 'lodash';
import { transformKeys } from '../object/transform';
import { v4 as uuidV4 } from 'uuid';
import { DeepPartial } from 'utility-types';
import { get } from 'get-wild';
import { checkAnnotation } from './validation';
import { red } from '@mui/material/colors';

export enum E_IMPORT_ANNOTATIONS_FILE_TYPE {
  APPLICATION_JSON = 'APPLICATION_JSON',
  FRAMES_ARRAY = 'FRAMES_ARRAY',
  POLYGONS_ARRAY = 'POLYGONS_ARRAY',
  UNKNOWN = 'UNKNOWN',
}

export const ANNOTATION_FIELDS_HUMAN_DESCRIPTION: Record<
  DotNestedKeys<TAnnotation>,
  string
> = {
  id: 'ID',
  type: 'Type (Feature)',
  bbox: 'Bounding box',
  'properties.type': 'Annotation type',
  'properties.name': 'Annotation name',
  'properties.color': 'Annotation color',
  'properties.frame': 'Frame number',
  'geometry.type': 'Geometry type (MultiPoint)',
  'geometry.bbox': 'Geometry bounding box',
  'geometry.coordinates': 'Geometry coordinates',
};

/* Rules for some annotation field in a specific import mode */
export type TAnnotationFieldImportRules = {
  /* If field is required - must be filled to proceed */
  required?: boolean;
  /* If field must be equal to some value. If not required might be equal to undefined too */
  equal?: string;
};

export const ANNOTATION_FIELDS_IMPORT_RULES: Record<
  E_IMPORT_ANNOTATIONS_FILE_TYPE,
  Record<DotNestedKeys<TAnnotation>, TAnnotationFieldImportRules>
> = {
  [E_IMPORT_ANNOTATIONS_FILE_TYPE.UNKNOWN]: {
    id: {},
    type: {},
    bbox: {},
    'properties.type': {},
    'properties.name': {},
    'properties.color': {},
    'properties.frame': {},
    'geometry.type': {},
    'geometry.bbox': {},
    'geometry.coordinates': {},
  },
  [E_IMPORT_ANNOTATIONS_FILE_TYPE.POLYGONS_ARRAY]: {
    id: {},
    type: { equal: 'Feature' },
    bbox: {},
    'properties.type': {},
    'properties.name': {},
    'properties.color': {},
    'properties.frame': { required: true },
    'geometry.type': { equal: 'MultiPoint' },
    'geometry.bbox': {},
    'geometry.coordinates': { required: true },
  },
  [E_IMPORT_ANNOTATIONS_FILE_TYPE.FRAMES_ARRAY]: {
    id: {},
    type: { equal: 'Feature' },
    bbox: {},
    'properties.type': {},
    'properties.name': {},
    'properties.color': {},
    'properties.frame': {},
    'geometry.type': { equal: 'MultiPoint' },
    'geometry.bbox': {},
    'geometry.coordinates': { required: true },
  },
  [E_IMPORT_ANNOTATIONS_FILE_TYPE.APPLICATION_JSON]: {
    id: {},
    type: { equal: 'Feature' },
    bbox: {},
    'properties.type': {},
    'properties.name': {},
    'properties.color': {},
    'properties.frame': {},
    'geometry.type': { equal: 'MultiPoint' },
    'geometry.bbox': {},
    'geometry.coordinates': { required: true },
  },
};

/**
 * Validate the import map. Throws error if something is wrong
 * @param data polygons or frames array to be imported
 * @param type import file type
 * @param mapping import file mapping to annotation fields
 * @returns true if everything is ok
 */
export const validateImportMap = <
  Type extends E_IMPORT_ANNOTATIONS_FILE_TYPE,
  D extends Record<string, any>,
>(
  data: Type extends E_IMPORT_ANNOTATIONS_FILE_TYPE.POLYGONS_ARRAY
    ? Array<D>
    : Array<Array<D>>,
  type: Type,
  mapping: Partial<Record<DotNestedKeys<TAnnotation>, keyof D>>,
): boolean => {
  if (type === E_IMPORT_ANNOTATIONS_FILE_TYPE.UNKNOWN) {
    throw new Error('Unknown import file type');
  }

  if (!data) {
    throw new Error('Data is empty');
  }

  if (
    type === E_IMPORT_ANNOTATIONS_FILE_TYPE.APPLICATION_JSON &&
    !(data as Array<Array<D>>).every((frame) =>
      frame.every((annotation) => checkAnnotation(annotation)),
    )
  ) {
    throw new Error('Invalid JSON file');
  } else if (type === E_IMPORT_ANNOTATIONS_FILE_TYPE.APPLICATION_JSON) {
    return true;
  }

  if (!mapping) {
    throw new Error('Mapping is empty');
  }

  if (Object.keys(mapping).length === 0) {
    throw new Error('Mapping is empty');
  }

  const frameKey = mapping['properties.frame'];
  const coordinatesKey = mapping['geometry.coordinates'];

  if (!coordinatesKey) {
    throw new Error('Coordinates key is empty');
  }

  if (type === E_IMPORT_ANNOTATIONS_FILE_TYPE.POLYGONS_ARRAY && !frameKey) {
    throw new Error('Polygons array mapping must contain properties.frame');
  }

  if (
    type === E_IMPORT_ANNOTATIONS_FILE_TYPE.FRAMES_ARRAY &&
    !(
      Array.isArray(data) &&
      data.every(Array.isArray) &&
      data.every((array) => array.every(isObject))
    )
  ) {
    throw new Error('Frames array must be a 2D array [frame][polygon]');
  }

  if (
    type === E_IMPORT_ANNOTATIONS_FILE_TYPE.POLYGONS_ARRAY &&
    !(Array.isArray(data) && every(data, isObject))
  ) {
    throw new Error('Polygons array must be a 1D array [polygon]');
  }

  if (
    flattenDepth(data, 2).some(
      (item) =>
        !get(item, coordinatesKey) ||
        !isArray(get(item, coordinatesKey)) ||
        get(item, coordinatesKey).length < 2,
    )
  ) {
    throw new Error('Some frames array items have invalid polygon coordinates');
  }

  if (
    type === E_IMPORT_ANNOTATIONS_FILE_TYPE.POLYGONS_ARRAY &&
    frameKey &&
    flattenDepth(data, 2).some(
      (item) => !get(item, frameKey) || !isNumber(get(item, frameKey)),
    )
  ) {
    throw new Error('Some polygons array items have invalid frame number');
  }

  /* Check if all required fields are filled */
  const rules = ANNOTATION_FIELDS_IMPORT_RULES[type];

  const requiredFields = keys(pickBy(rules, (rule) => rule.required)) as Array<
    DotNestedKeys<TAnnotation>
  >;

  if (
    flattenDepth(data, 2).some((item) =>
      requiredFields.some((field) => {
        const path = mapping[field];
        return path && !get(item, path);
      }),
    )
  ) {
    throw new Error('Some required fields are empty');
  }

  /* Check if some fields are equal to the required value */
  const equalFields = keys(pickBy(rules, (rule) => rule.equal)) as Array<
    DotNestedKeys<TAnnotation>
  >;

  if (
    flattenDepth(data, 2).some((item) =>
      equalFields.some((field) => {
        const path = mapping[field];
        return (
          path && get(item, path) && get(item, path) !== rules[field].equal
        );
      }),
    )
  ) {
    throw new Error('Some fields are not equal to required value');
  }

  return true;
};

const processTransformedAnnotation = (
  partialData: Partial<TAnnotation>,
  uuid = uuidV4(),
): TAnnotation => {
  const data: DeepPartial<TAnnotation> = {
    type: 'Feature',
    properties: {
      name: uuid,
      color: red[400],
      type: null,
    },
    id: uuid,
    geometry: {
      type: 'MultiPoint',
    },
  };

  const result = merge(data, partialData) as TAnnotation;

  result.properties.frame = isNumber(result.properties.frame)
    ? result.properties.frame - 1
    : 0;

  return result;
};

export const convertImportData = <
  Type extends E_IMPORT_ANNOTATIONS_FILE_TYPE,
  D extends Record<PropertyKey, any>,
>(
  data: Type extends E_IMPORT_ANNOTATIONS_FILE_TYPE.POLYGONS_ARRAY
    ? Array<D>
    : Array<Array<D>>,
  type: Type,
  mapping: Partial<Record<DotNestedKeys<TAnnotation>, keyof D>>,
): Array<Array<TAnnotation>> => {
  let result: Array<Array<TAnnotation>> = [];

  if (type === E_IMPORT_ANNOTATIONS_FILE_TYPE.APPLICATION_JSON) {
    return data as unknown as Array<Array<TAnnotation>>;
  }

  if (type === E_IMPORT_ANNOTATIONS_FILE_TYPE.FRAMES_ARRAY) {
    result = (data as Array<Array<D>>).reduce(
      (framesAcc: Array<Array<TAnnotation>>, frameData) => [
        ...framesAcc,
        frameData.reduce((polygonAcc: Array<TAnnotation>, item: D) => {
          let newItem = processTransformedAnnotation(
            transformKeys<DotNestedKeys<TAnnotation>>(item, mapping),
          );

          const existingAnnotationType = find(flattenDepth(framesAcc, 1), [
            'properties.type',
            newItem.properties.type,
          ]);

          if (existingAnnotationType) {
            newItem = {
              ...newItem,
              id: existingAnnotationType.id,
              properties: {
                ...newItem.properties,
                name: existingAnnotationType.properties.name,
                color: existingAnnotationType.properties.color,
              },
            };
          }

          return [...polygonAcc, newItem];
        }, []),
      ],
      [],
    );
  }

  if (type === E_IMPORT_ANNOTATIONS_FILE_TYPE.POLYGONS_ARRAY) {
    const transformedData: Array<TAnnotation> = (data as Array<D>).reduce(
      (acc: Array<TAnnotation>, item: D) => {
        let newItem = processTransformedAnnotation(
          transformKeys<DotNestedKeys<TAnnotation>>(item, mapping),
        );

        const existingAnnotationType = find(acc, [
          'properties.type',
          newItem.properties.type,
        ]);

        if (existingAnnotationType) {
          newItem = {
            ...newItem,
            id: existingAnnotationType.id,
            properties: {
              ...newItem.properties,
              name: existingAnnotationType.properties.name,
              color: existingAnnotationType.properties.color,
            },
          };
        }

        return [...acc, newItem];
      },
      [],
    );

    const sortedData = sortBy(transformedData, (item) => item.properties.frame);
    result = sortedData.reduce((acc: Array<Array<TAnnotation>>, item) => {
      (acc[item.properties.frame] = acc[item.properties.frame] || []).push(
        item,
      );

      return acc;
    }, []);
  }

  console.log(result);

  return result;
};
