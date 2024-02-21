export type TVideoMeta = {
  fps: number;
  width: number;
  height: number;
};

export type TVideoState = {
  url: string | null;
  fps: TVideoMeta['fps'] | null;
  videoWidth: TVideoMeta['width'] | null;
  videoHeight: TVideoMeta['height'] | null;
  videoDuration: number | null;
  viewportWidth: number | null;
  viewportHeight: number | null;
  zoom: number;
  translateX: number;
  translateY: number;
  currentTime: number;
  isPlaying: boolean;
  isLoading: boolean;
  isLoaded: boolean;
};
