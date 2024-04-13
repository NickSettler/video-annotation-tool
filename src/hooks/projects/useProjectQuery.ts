import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { TApiError } from '../../api/base/types';
import { map } from 'lodash';
import {
  applyTransforms,
  transformDate,
} from '../../utils/react-query/transforms';
import { TProject } from '../../api/projects/types';
import { ProjectsService } from '../../api/projects/project.service';

export const useProjects = (
  options?: Omit<
    UseQueryOptions<Array<TProject>, TApiError, Array<TProject>, Array<string>>,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TProject>, TApiError> =>
  useQuery({
    ...options,
    queryKey: ['getProjects'],
    queryFn: async (): Promise<Array<TProject>> =>
      ProjectsService.getProjects(),
    select: (d) => map(d, applyTransforms(transformDate).bind(this)),
  });
