/**
 * Get the aspect ratio of a video
 * @param width video width
 * @param height video height
 * @example getAspectRatio(1920, 1080) => '16:9'
 * @example getAspectRatio(1280, 720) => '16:9'
 * @example getAspectRatio(640, 480) => '4:3'
 * @example getAspectRatio(320, 240) => '4:3'
 */
export const getAspectRatio = (
  width: number | null,
  height: number | null,
): string => {
  if (!width || !height) return '0:0';

  const gcd = (a: number, b: number): number => {
    if (b === 0) {
      return a;
    }

    return gcd(b, a % b);
  };

  const divisor = gcd(width, height);

  return `${width / divisor}:${height / divisor}`;
};
