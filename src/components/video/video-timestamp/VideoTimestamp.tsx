import { JSX, useMemo, MouseEvent } from 'react';
import { Stack, styled, Typography } from '@mui/material';
import { getSMPTETimeCode } from '../../../utils/video/smpte';
import { useAppSelector } from '../../../store/store';
import {
  videoCurrentFrameSelector,
  videoDurationSelector,
  videoFPSSelector,
  videoIsLoadedSelector,
  videoTotalFramesSelector,
} from '../../../store/video';
import { E_VIDEO_TIMESTAMP_MODE } from '../../../utils/settings';
import { useUserSettings } from '../../../hooks/settings/useUserSettings';

const VideoTimestampText = styled(Typography)({
  lineHeight: '100%',
});

export const VideoTimestamp = (): JSX.Element => {
  const isLoaded = useAppSelector(videoIsLoadedSelector);
  const fps = useAppSelector(videoFPSSelector);
  const videoDuration = useAppSelector(videoDurationSelector);

  const currentFrame = useAppSelector(videoCurrentFrameSelector);
  const totalFrames = useAppSelector(videoTotalFramesSelector);

  const { timestampMode, setTimestampMode } = useUserSettings();

  const maxDigits = useMemo(() => {
    return totalFrames.toString().length;
  }, [totalFrames]);

  const currentSMPTETimestamp = useMemo(() => {
    if (!fps) return '00:00:00:00';

    return getSMPTETimeCode(currentFrame, fps);
  }, [fps, currentFrame]);

  const endSMPTETimestamp = useMemo(() => {
    if (!fps || !videoDuration) return '00:00:00:00';

    return getSMPTETimeCode(videoDuration * fps, fps);
  }, [fps, videoDuration]);

  const currentFrameTimestamp = useMemo(
    () => currentFrame.toString().padStart(maxDigits, '0'),
    [currentFrame, maxDigits],
  );

  const frameTimestamp = useMemo(
    () => totalFrames.toString().padStart(maxDigits, '0'),
    [maxDigits, totalFrames],
  );

  const handleRightClick = (e: MouseEvent) => {
    e.preventDefault();

    const newMode =
      timestampMode === E_VIDEO_TIMESTAMP_MODE.FRAME
        ? E_VIDEO_TIMESTAMP_MODE.SMPTE
        : E_VIDEO_TIMESTAMP_MODE.FRAME;

    setTimestampMode(newMode);
  };

  return (
    <Stack
      direction={'row'}
      onContextMenu={handleRightClick}
      sx={{ height: '100%' }}
      alignItems={'center'}
      color={isLoaded ? 'text.primary' : 'divider'}
    >
      <VideoTimestampText variant={'captionMono'}>
        {timestampMode === E_VIDEO_TIMESTAMP_MODE.SMPTE ? (
          <>{currentSMPTETimestamp}</>
        ) : (
          <>{currentFrameTimestamp}</>
        )}
      </VideoTimestampText>
      <VideoTimestampText variant={'captionMono'}>
        &nbsp;/&nbsp;
      </VideoTimestampText>
      <VideoTimestampText variant={'captionMono'}>
        {timestampMode === E_VIDEO_TIMESTAMP_MODE.SMPTE ? (
          <>{endSMPTETimestamp}</>
        ) : (
          <>{frameTimestamp}</>
        )}
      </VideoTimestampText>
    </Stack>
  );
};
