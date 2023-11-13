export type TOrientation = 'landscape' | 'portrait';

export const useVideoOrientation = (
  width: number | null,
  height: number | null,
): TOrientation => {
  if (!width || !height) return 'landscape';

  return width <= height ? 'portrait' : 'landscape';
};
