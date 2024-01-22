import { Feature, MultiPoint } from 'geojson';
import { E_IMPORT_ANNOTATIONS_FILE_TYPE } from '../../utils/annotation/import';
import { DotNestedKeys } from '../../utils/types/path.type';

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
  // General
  annotations: Array<Array<TAnnotation>>;
  types: Array<TAnnotationType>;
  // Selection
  selection: Array<TAnnotationSelection>;
  // Filters
  typeFilter: string | null;
  startFrameFilter: number | null;
  endFrameFilter: number | null;
  // Import data
  importJSON:
    | Array<Array<Record<string, any>>>
    | Array<Record<string, any>>
    | null;
  importFileMetadata: {
    name: string;
    size: number;
    type: string;
  } | null;
  importFileType: E_IMPORT_ANNOTATIONS_FILE_TYPE | null;
  importFileMap: Partial<Record<DotNestedKeys<TAnnotation>, string>>;
};
