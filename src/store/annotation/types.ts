import { Feature, MultiPoint } from 'geojson';
import { NonUndefined } from 'utility-types';

export type TAnnotationProperties = {
  name: string;
  color: string;
};

export type TAnnotation = Feature<MultiPoint, TAnnotationProperties> & {
  id: NonUndefined<Feature['id']>;
};

export type TAnnotationState = {
  annotations: Array<Array<TAnnotation> | undefined>;
};
