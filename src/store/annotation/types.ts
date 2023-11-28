import { Feature, MultiPoint } from 'geojson';

export type TAnnotationProperties = {
  name: string;
  frame: number;
  color: string;
  type: string | null;
};

export type TAnnotation = Feature<MultiPoint, TAnnotationProperties> & {
  id: string;
};

export type TAnnotationType = {
  type: string;
  color: string;
};

export type TAnnotationSelection = {
  id: string;
  frame: number;
};

export type TAnnotationState = {
  annotations: Array<Array<TAnnotation>>;
  types: Array<TAnnotationType>;
  selection: Array<TAnnotationSelection>;
};
