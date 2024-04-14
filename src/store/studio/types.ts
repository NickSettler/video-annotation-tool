import { TProject } from '../../api/projects/types';

export type TStudioState = {
  project: TProject | null;
  annotationsSaveInProgress: boolean;
};
