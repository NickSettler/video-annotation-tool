import { useCallback } from 'react';
import { roundToDecimal } from '../../utils/math/round';
import VideoJsPlayer from 'video.js';

export type TUseControls = {
  handleFirstStep(): void;
  handlePrevStep(): void;
  handlePlayPause(): void;
  handleNextStep(): void;
  handleLastStep(): void;
  handleFrameJump(frame: number): void;
};

export const useControls = (
  video: ReturnType<typeof VideoJsPlayer> | null,
  frequency: number,
): TUseControls => {
  const handleFirstStep = useCallback(() => {
    if (!video) return;

    video.currentTime(0);
  }, [video]);

  const handlePrevStep = useCallback(() => {
    if (!video) return;

    const currentTime = video.currentTime();

    if (currentTime === undefined) return;

    video.currentTime(
      (roundToDecimal(currentTime, frequency) - frequency).toFixed(2),
    );
  }, [frequency, video]);

  const handlePlayPause = useCallback(() => {
    if (!video) return;

    video.paused() ? video.play() : video.pause();
  }, [video]);

  const handleNextStep = useCallback(() => {
    if (!video) return;

    const currentTime = video.currentTime();

    if (currentTime === undefined) return;

    video.currentTime(
      (roundToDecimal(currentTime, frequency) + frequency).toFixed(2),
    );
  }, [frequency, video]);

  const handleLastStep = useCallback(() => {
    if (!video) return;

    video.currentTime(video.duration());
  }, [video]);

  const handleFrameJump = useCallback(
    (frame: number) => {
      if (!video) return;

      video.currentTime(frame / (1 / frequency));
    },
    [video, frequency],
  );

  return {
    handleFirstStep,
    handlePrevStep,
    handlePlayPause,
    handleNextStep,
    handleLastStep,
    handleFrameJump,
  };
};
