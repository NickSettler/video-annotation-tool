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
  refetch?(): Promise<unknown>;
  onCreateProgress?(event: AxiosProgressEvent): void;
};

export type TUseVideoMutations = {
  createMutation: UseMutationResult<
    TVideo,
    TApiError,
    TVideoCreateMutationVariables
  >;
  deleteMutation: UseMutationResult<void, TApiError, string>;
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
      if (refetch) await refetch();

      toast.success('Successfully created video');
    },
    onError: async () => {
      if (refetch) await refetch();

      toast.error('Failed to create video');
    },
  });

  const deleteMutation = useMutation<void, TApiError, string>({
    mutationFn: async (videoID: string) => VideoService.deleteVideo(videoID),
    onSuccess: async () => {
      if (refetch) await refetch();

      toast.success('Successfully deleted video');
    },
    onError: async () => {
      if (refetch) await refetch();

      toast.error('Failed to delete video');
    },
  });

  return {
    createMutation,
    deleteMutation,
  };
};
