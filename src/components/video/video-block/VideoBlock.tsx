import { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Stack, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  setVideoCurrentTimeAction,
  setVideoDurationAction,
  setVideoFPSAction,
  setVideoLoadedAction,
  setVideoLoadingAction,
  setVideoPlayingAction,
  setVideoSizeAction,
  setVideoViewportSizeAction,
  videoAspectRatioSelector,
  videoCurrentTimeSelector,
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
import { roundToDecimal } from '../../../utils/math/round';
import { VideoOverlay } from '../video-overlay/VideoOverlay';
import { useControls } from '../../../hooks/video/useControls';
import {
  TOrientation,
  useVideoOrientation,
} from '../../../hooks/video/useVideoOrientation';
import { throttle } from 'lodash';
import { Canvas } from '../../annotation/canvas/Canvas';
import { VideoToolbar } from '../video-toolbar/VideoToolbar';
import { initAnnotationsAction } from '../../../store/annotation';

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

  const videoWidth = useAppSelector(videoWidthSelector);
  const videoHeight = useAppSelector(videoHeightSelector);
  const videoAspectRatio = useAppSelector(videoAspectRatioSelector);

  const storeCurrentTime = useAppSelector(videoCurrentTimeSelector);
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
        .then(({ fps: _fps, ...size }) => {
          dispatch(setVideoFPSAction(_fps));
          dispatch(setVideoSizeAction(size));
          dispatch(setVideoLoadedAction(true));
        })
        .finally(() => {
          dispatch(setVideoLoadingAction(false));
        });
    }
  }, [dispatch, url]);

  useEffect(() => {
    if (!video || isPlaying) return;

    if (video.currentTime() !== storeCurrentTime)
      video.currentTime(storeCurrentTime);
  }, [isPlaying, storeCurrentTime, video]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const loadMetaDataCallback = useCallback(() => {
    const duration = videoRef.current?.duration;

    if (duration) {
      dispatch(setVideoDurationAction(duration));
      dispatch(initAnnotationsAction({ count: duration * (1 / frequency) }));
    }
  }, [dispatch, frequency]);

  const videoOnReadyCallback = useCallback(() => {
    if (!videoRef.current || !video) return;

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

    videoRef.current?.addEventListener('loadedmetadata', loadMetaDataCallback);

    videoRef.current?.requestVideoFrameCallback(playerTicker);
  }, [dispatch, frequency, playerTicker, video, loadMetaDataCallback]);

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
    const _videoRef = videoRef.current;

    window.addEventListener('resize', documentResizeHandler);

    return () => {
      window.removeEventListener('resize', documentResizeHandler);

      if (_videoRef) {
        _videoRef.removeEventListener('loadedmetadata', loadMetaDataCallback);
      }

      if (video) {
        video.dispose();
      }

      dispatch(setVideoLoadedAction(false));
      dispatch(setVideoPlayingAction(false));
      dispatch(setVideoLoadingAction(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    handleFrameJump,
  } = useControls(video, frequency);

  return (
    <Stack spacing={2} sx={{ p: 3 }}>
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
      <VideoToolbar
        isPlaying={isPlaying}
        onFirstStep={handleFirstStep}
        onPrevStep={handlePrevStep}
        onPlayPause={handlePlayPause}
        onNextStep={handleNextStep}
        onLastStep={handleLastStep}
        onFrameJump={handleFrameJump}
      />
    </Stack>
  );
};
