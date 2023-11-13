import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Stack, styled } from '@mui/material';
import { AddressBar } from '../../address-bar/AddressBar';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  setVideoCurrentTimeAction,
  setVideoLoadedAction,
  setVideoLoadingAction,
  setVideoMetadataAction,
  setVideoPlayingAction,
  setVideoViewportSizeAction,
  videoAspectRatioSelector,
  videoFPSSelector,
  videoFrequencySelector,
  videoHeightSelector,
  videoIsLoadedSelector,
  videoIsLoadingSelector,
  videoIsPlayingSelector,
  videoUrlSelector,
  videoWidthSelector,
} from '../../../store/video';
import { commonVideoOptions, computeMeta } from '../../../utils/video/video-js';
import VideoJsPlayer from 'video.js';
import { VideoControls } from '../video-controls/VideoControls';
import { roundToDecimal } from '../../../utils/math/round';
import { VideoTimestamp } from '../video-timestamp/VideoTimestamp';
import { VideoOverlay } from '../video-overlay/VideoOverlay';
import { useControls } from '../../../hooks/video/useControls';
import {
  TOrientation,
  useVideoOrientation,
} from '../../../hooks/video/useVideoOrientation';
import { throttle } from 'lodash';
import { Canvas } from '../../annotation/canvas/Canvas';

const VideosBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'orientation' && prop !== 'aspect',
})<{ orientation?: TOrientation; aspect?: string }>(
  ({ orientation, aspect }) => ({
    position: 'relative',
    aspectRatio: '16/9',

    '& > div': {
      width: '100%',
      height: '100%',
      paddingTop: '0 !important',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '& > video': {
        position: 'absolute',
        ...(orientation === 'portrait' && {
          height: '100%',
        }),
        ...(orientation === 'landscape' && {
          width: '100%',
        }),
        aspectRatio: aspect,
      },
    },
  }),
);

export const CanvasBox = styled(Box)({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
});

export const VideoBlock = (): JSX.Element => {
  const url = useAppSelector(videoUrlSelector);
  const fps = useAppSelector(videoFPSSelector);
  const videoWidth = useAppSelector(videoWidthSelector);
  const videoHeight = useAppSelector(videoHeightSelector);
  const videoAspectRatio = useAppSelector(videoAspectRatioSelector);
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

  const orientation = useVideoOrientation(videoWidth, videoHeight);

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

    dispatch(setVideoCurrentTimeAction(metadata.mediaTime));

    if (videoRef.current) {
      videoRef.current.requestVideoFrameCallback(playerTicker);
    }
  };

  const videoOnReadyCallback = useCallback(() => {
    if (!videoRef.current) return;

    dispatch(
      setVideoViewportSizeAction({
        width: videoRef.current.clientWidth,
        height: videoRef.current.clientHeight,
      }),
    );

    video?.on('play', () => {
      dispatch(setVideoPlayingAction(true));
    });

    video?.on('pause', () => {
      dispatch(setVideoPlayingAction(false));

      const _currentTime = video.currentTime();

      if (!_currentTime) return;

      video.currentTime(
        (roundToDecimal(_currentTime, frequency) + frequency).toFixed(2),
      );
    });

    videoRef.current?.requestVideoFrameCallback(playerTicker);
  }, [dispatch, frequency, playerTicker, video]);

  useEffect(() => {
    if (video) videoOnReadyCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video]);

  const dispatchVideoViewportSize = throttle(() => {
    if (!videoRef.current) return;

    dispatch(
      setVideoViewportSizeAction({
        width: videoRef.current.clientWidth,
        height: videoRef.current.clientHeight,
      }),
    );
  }, 100);

  const documentResizeHandler = () => {
    dispatchVideoViewportSize();
  };

  useEffect(() => {
    window.addEventListener('resize', documentResizeHandler);

    return () => {
      window.removeEventListener('resize', documentResizeHandler);
    };
  }, []);

  useEffect(() => {
    if (!video && isLoaded && videoRef.current) {
      setVideo(
        VideoJsPlayer(videoRef.current, {
          ...commonVideoOptions,
          controls: false,
          sources: [
            {
              src: url,
              type: 'video/mp4',
            },
          ],
        }),
      );
    }
  }, [video, isLoaded, url, videoOnReadyCallback]);

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
        <VideosBox
          orientation={orientation}
          aspect={videoAspectRatio ?? '16/9'}
        >
          <video ref={videoPreloadRef} />
          {isLoaded && <video ref={videoRef} />}
        </VideosBox>
        {isLoaded && (
          <CanvasBox>
            <Canvas />
          </CanvasBox>
        )}
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
