import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Stack, styled } from '@mui/material';
import { AddressBar } from '../address-bar/AddressBar';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  setVideoLoadedAction,
  setVideoLoadingAction,
  setVideoMetadataAction,
  setVideoPlayingAction,
  videoFPSSelector,
  videoFrequencySelector,
  videoIsLoadedSelector,
  videoIsLoadingSelector,
  videoIsPlayingSelector,
  videoUrlSelector,
} from '../../store/video';
import { commonVideoOptions, computeMeta } from '../../utils/video/video-js';
import VideoJsPlayer from 'video.js';
import { VideoControls } from '../video-controls/VideoControls';
import { roundToDecimal } from '../../utils/math/round';
import { VideoTimestamp } from '../video-timestamp/VideoTimestamp';
import { VideoOverlay } from '../video-overlay/VideoOverlay';
import { useControls } from '../../hooks/video/useControls';

const VideosBox = styled(Box)({
  position: 'relative',
  aspectRatio: '16/9',

  '& > div': {
    width: 0,
    height: 0,
    '& > video': {
      position: 'absolute',
      width: '100%',
      // height: '100%',
      aspectRatio: '16/9',
      left: 0,
      top: 0,
    },
  },
});

export const VideoBlock = (): JSX.Element => {
  const url = useAppSelector(videoUrlSelector);
  const fps = useAppSelector(videoFPSSelector);
  const frequency = useAppSelector(videoFrequencySelector);
  const isLoading = useAppSelector(videoIsLoadingSelector);
  const isLoaded = useAppSelector(videoIsLoadedSelector);
  const isPlaying = useAppSelector(videoIsPlayingSelector);
  const dispatch = useAppDispatch();

  const videoPreloadRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [video, setVideo] = useState<ReturnType<typeof VideoJsPlayer> | null>(
    null,
  );
  // const [currentTime, setCurrentTime] = useState(0);

  // useEffect(
  //   () => () => {
  //     dispatch(setVideoLoadedAction(false));
  //     dispatch(setVideoLoadingAction(false));
  //     dispatch(setVideoPlayingAction(false));
  //     dispatch(setVideoMetadataAction(null));
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [],
  // );

  useEffect(() => {
    if (url && videoPreloadRef.current) {
      dispatch(setVideoLoadingAction(true));
      computeMeta(videoPreloadRef.current, {
        src: url,
        type: 'video/mp4',
      })
        .then((meta) => {
          dispatch(setVideoMetadataAction(meta));
          dispatch(setVideoLoadedAction(true));
        })
        .finally(() => {
          dispatch(setVideoLoadingAction(false));
        });
    }
  }, [dispatch, url]);

  const playerTicker = (
    _: DOMHighResTimeStamp,
    metadata: VideoFrameCallbackMetadata,
  ) => {
    if (!video) return;

    // dispatch(setVideoCurrentTimeAction(metadata.mediaTime));
    //
    // videoRef.current?.requestVideoFrameCallback(playerTicker);
  };

  const videoOnReadyCallback = useCallback(() => {
    if (!video) return;

    video.on('play', () => {
      dispatch(setVideoPlayingAction(true));
    });

    video.on('pause', () => {
      dispatch(setVideoPlayingAction(false));

      const currentTime = video.currentTime();

      if (!currentTime) return;

      video.currentTime(
        (roundToDecimal(currentTime, frequency) + frequency).toFixed(2),
      );
    });

    videoRef.current?.requestVideoFrameCallback(playerTicker);
  }, [dispatch, frequency, playerTicker, video]);

  useEffect(() => {
    if (isLoaded && videoRef.current) {
      setVideo(
        VideoJsPlayer(
          videoRef.current,
          {
            ...commonVideoOptions,
            controls: false,
            sources: [
              {
                src: url,
                type: 'video/mp4',
              },
            ],
          },
          videoOnReadyCallback,
        ),
      );
    }
  }, [isLoaded, url, videoOnReadyCallback]);

  const {
    handleFirstStep,
    handlePrevStep,
    handlePlayPause,
    handleNextStep,
    handleLastStep,
  } = useControls(video, frequency);

  return (
    <Stack spacing={2}>
      <AddressBar />
      <Box sx={{ width: '100%', position: 'relative' }}>
        {!isLoaded && <VideoOverlay isLoading={isLoading} />}
        <VideosBox>
          <video ref={videoPreloadRef} />
          {isLoaded && <video ref={videoRef} />}
        </VideosBox>
      </Box>
      <Stack direction={'row'} justifyContent={'center'}>
        <VideoTimestamp fps={fps ?? 1} currentFrame={1} />
        <VideoControls
          isPlaying={isPlaying}
          onFirstStep={handleFirstStep}
          onPrevStep={handlePrevStep}
          onPlayPause={handlePlayPause}
          onNextStep={handleNextStep}
          onLastStep={handleLastStep}
        />
      </Stack>
    </Stack>
  );
};
