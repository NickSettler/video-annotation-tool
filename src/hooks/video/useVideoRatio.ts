import { useAppSelector } from '../../store/store';
import {
  videoHeightRatioSelector,
  videoWidthRatioSelector,
} from '../../store/video';

export type TUseVideoRatio = {
  widthRatio: number;
  heightRatio: number;
  maxRatio: number;
};

export const useVideoRatio = (): TUseVideoRatio => {
  const widthRatio = useAppSelector(videoWidthRatioSelector);
  const heightRatio = useAppSelector(videoHeightRatioSelector);

  const maxRatio = Math.max(widthRatio, heightRatio);

  return {
    widthRatio,
    heightRatio,
    maxRatio,
  };
};
