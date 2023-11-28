import { Feature, MultiPoint } from 'geojson';

export type TAnnotationProperties = {
  name: string;
  frame: number;
  color: string;
};

export type TAnnotation = Feature<MultiPoint, TAnnotationProperties> & {
  id: string;
};

export type TAnnotationSelection = {
  id: string;
  frame: number;
};

export type TAnnotationState = {
  annotations: Array<Array<TAnnotation>>;
  selection: Array<TAnnotationSelection>;
};
