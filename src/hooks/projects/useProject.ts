import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { TApiError } from '../../api/base/types';
import {
  applyTransforms,
  transformDate,
} from '../../utils/react-query/transforms';
import { E_PROJECT_ENTITY_KEYS, TProject } from '../../api/projects/types';
import { ProjectsService } from '../../api/projects/project.service';

export const useProject = (
  id: TProject[E_PROJECT_ENTITY_KEYS.ID],
  options?: Omit<
    UseQueryOptions<TProject, TApiError, TProject, Array<string>>,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<TProject, TApiError> =>
  useQuery({
    ...options,
    queryKey: [`get-project-${id}`],
    queryFn: async (): Promise<TProject> => ProjectsService.getProject(id),
    select: (d) => applyTransforms(transformDate)(d),
  });
