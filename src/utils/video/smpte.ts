export const getSMPTETimeCode = (frameNumber: number, frameRate: number) => {
  const hours = Math.floor(frameNumber / (3600 * frameRate))
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((frameNumber / (60 * frameRate)) % 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((frameNumber / frameRate) % 60)
    .toString()
    .padStart(2, '0');
  const frames = Math.floor(frameNumber % frameRate)
    .toString()
    .padStart(2, '0');

  return `${hours}:${minutes}:${seconds}:${frames}`;
};
