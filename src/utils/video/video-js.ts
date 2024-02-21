import VideoJsPlayer from 'video.js';
import { TVideoMeta } from '../../store/video';

export const commonVideoOptions = {
  preload: 'auto',
  fluid: true,
  muted: true,
  aspectRatio: '16:9',
  fill: true,
  enableSmoothSeeking: true,
};

export const computeMeta = async (
  selector: HTMLVideoElement,
  source: {
    src: string;
    type?: string | undefined;
  },
): Promise<TVideoMeta> => {
  return new Promise<TVideoMeta>((resolve) => {
    const player = VideoJsPlayer(selector, {
      ...commonVideoOptions,
      controls: true,
      autoplay: true,
      sources: [source],
      children: ['MediaLoader'],
    });

    const frameCount = 50;

    let lastMediaTime: number,
      lastFrameNum: number,
      frameNotSeeked = true;
    const fpsRounder: Array<number> = [];
    let width: number, height: number;

    const seekedHandler = () => {
      fpsRounder.pop();
      frameNotSeeked = false;
    };

    const ticker = (
      _: DOMHighResTimeStamp,
      metadata: VideoFrameCallbackMetadata,
    ) => {
      const mediaTimeDiff = Math.abs(metadata.mediaTime - lastMediaTime);
      const frameNumDiff = Math.abs(metadata.presentedFrames - lastFrameNum);
      const diff = mediaTimeDiff / frameNumDiff;

      if (!width) width = selector.videoWidth;
      if (!height) height = selector.videoHeight;

      if (
        diff &&
        diff < 1 &&
        frameNotSeeked &&
        fpsRounder.length < frameCount &&
        selector.playbackRate === 1 &&
        document.hasFocus()
      ) {
        fpsRounder.push(diff);
      }

      frameNotSeeked = true;
      lastMediaTime = metadata.mediaTime;
      lastFrameNum = metadata.presentedFrames;

      if (fpsRounder.length < frameCount) {
        selector.requestVideoFrameCallback(ticker);
      } else {
        player.dispose();
        selector.removeEventListener('seeked', seekedHandler);

        const diffsAvg =
          fpsRounder.reduce((a, b) => a + b, 0) / fpsRounder.length;

        resolve({
          fps: Math.round(1 / diffsAvg),
          width,
          height,
        });
      }
    };
    selector.requestVideoFrameCallback(ticker);

    selector.addEventListener('seeked', seekedHandler);
  });
};
