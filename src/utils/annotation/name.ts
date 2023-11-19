import { TAnnotation } from '../../store/annotation';

export const NEW_POLYGON_NAME = 'new-polygon';

export const getPolygonName = (annotation?: TAnnotation) => {
  if (!annotation) return NEW_POLYGON_NAME;

  return `polygon-${annotation.id}`;
};

export const extractPolygonID = (name: string) => {
  return name.split('-')[1];
};

const uuidV4Regex =
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/;
const groupNameRegex = new RegExp(`^polygon-${uuidV4Regex.source}$`);
const pointNameRegex = new RegExp(`^${groupNameRegex.source}-point-\d+$`);

export const isGroupName = (name: string) => groupNameRegex.test(name);

export const isPointName = (name: string) => pointNameRegex.test(name);
