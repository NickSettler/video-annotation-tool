import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { TVideo } from '../../api/video/types';
import { TApiError } from '../../api/base/types';
import { VideoService } from '../../api/video/video.service';
import { map } from 'lodash';
import {
  applyTransforms,
  transformDate,
} from '../../utils/react-query/transforms';

export const useVideos = (
  options?: Omit<
    UseQueryOptions<Array<TVideo>, TApiError, Array<TVideo>, Array<string>>,
    'initialData' | 'queryFn' | 'queryKey'
  > & { initialData?(): undefined },
): UseQueryResult<Array<TVideo>, TApiError> =>
  useQuery({
    ...options,
    queryKey: ['getVideos'],
    queryFn: async (): Promise<Array<TVideo>> => VideoService.getVideos(),
    select: (d) => map(d, applyTransforms(transformDate).bind(this)),
  });
