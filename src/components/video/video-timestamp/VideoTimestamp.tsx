import { JSX, useMemo, MouseEvent } from 'react';
import { Stack, styled, Typography } from '@mui/material';
import { getSMPTETimeCode } from '../../../utils/video/smpte';
import { useAppSelector } from '../../../store/store';
import {
  videoCurrentFrameSelector,
  videoDurationSelector,
  videoFPSSelector,
  videoTotalFramesSelector,
} from '../../../store/video';
import { useLocalStorage } from 'usehooks-ts';
import { E_LOCAL_STORAGE_KEYS } from '../../../utils/local-storage';
import {
  E_VIDEO_TIMESTAMP_MODE,
  defaultUserSettings,
} from '../../../utils/settings';

const VideoTimestampText = styled(Typography)({
  lineHeight: '70%',
});

export const VideoTimestamp = (): JSX.Element => {
  const fps = useAppSelector(videoFPSSelector);
  const videoDuration = useAppSelector(videoDurationSelector);

  const currentFrame = useAppSelector(videoCurrentFrameSelector);
  const totalFrames = useAppSelector(videoTotalFramesSelector);

  const [userSettings, setUserSettings] = useLocalStorage(
    E_LOCAL_STORAGE_KEYS.SETTINGS,
    defaultUserSettings,
  );

  const currentTimeStampMode = useMemo(
    () => userSettings.timestampMode,
    [userSettings],
  );

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
      currentTimeStampMode === E_VIDEO_TIMESTAMP_MODE.FRAME
        ? E_VIDEO_TIMESTAMP_MODE.SMPTE
        : E_VIDEO_TIMESTAMP_MODE.FRAME;

    setUserSettings((prev) => ({
      ...prev,
      timestampMode: newMode,
    }));
  };

  return (
    <Stack direction={'row'} onContextMenu={handleRightClick}>
      <VideoTimestampText variant={'captionMono'}>
        {currentTimeStampMode === E_VIDEO_TIMESTAMP_MODE.SMPTE ? (
          <>{currentSMPTETimestamp}</>
        ) : (
          <>{currentFrameTimestamp}</>
        )}
      </VideoTimestampText>
      <VideoTimestampText variant={'captionMono'}>
        &nbsp;/&nbsp;
      </VideoTimestampText>
      <VideoTimestampText variant={'captionMono'}>
        {currentTimeStampMode === E_VIDEO_TIMESTAMP_MODE.SMPTE ? (
          <>{endSMPTETimestamp}</>
        ) : (
          <>{frameTimestamp}</>
        )}
      </VideoTimestampText>
    </Stack>
  );
};
