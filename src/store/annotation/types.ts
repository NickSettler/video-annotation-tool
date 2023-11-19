import { Feature, MultiPoint } from 'geojson';

export type TAnnotationProperties = {
  name: string;
  color: string;
};

export type TAnnotation = Feature<MultiPoint, TAnnotationProperties> & {
  id: string;
};

export type TAnnotationState = {
  annotations: Array<Array<TAnnotation>>;
};
