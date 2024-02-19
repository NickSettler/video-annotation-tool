import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { TVideo } from '../../api/video/types';
import {
  TVideoCreateMutationVariables,
  VideoService,
} from '../../api/video/video.service';
import { TApiError } from '../../api/base/types';
import { toast } from 'react-hot-toast';
import { AxiosProgressEvent } from 'axios';

export type TUseVideoMutationsParams = {
  refetch(): Promise<unknown>;
  onCreateProgress?(event: AxiosProgressEvent): void;
};

export type TUseVideoMutations = {
  createMutation: UseMutationResult<
    TVideo,
    TApiError,
    TVideoCreateMutationVariables
  >;
};

export const useVideoMutations = ({
  refetch,
  onCreateProgress,
}: TUseVideoMutationsParams): TUseVideoMutations => {
  const createMutation = useMutation<
    TVideo,
    TApiError,
    TVideoCreateMutationVariables
  >({
    mutationFn: async ({ data: createData }: TVideoCreateMutationVariables) =>
      VideoService.createVideo(createData, {
        onUploadProgress: onCreateProgress,
      }),
    onSuccess: async () => {
      await refetch();

      toast.success('Successfully created video');
    },
    onError: async () => {
      await refetch();

      toast.error('Failed to create video');
    },
  });

  return {
    createMutation,
  };
};
