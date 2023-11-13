import { Feature, MultiPoint } from 'geojson';
import { NonUndefined } from 'utility-types';

export type TFrameAnnotation = Feature<MultiPoint> & {
  id: NonUndefined<Feature['id']>;
};

export type TAnnotationState = {
  annotations: Array<Array<TFrameAnnotation>>;
};
