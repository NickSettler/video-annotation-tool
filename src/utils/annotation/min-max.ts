/**
 * Finds the minimum and maximum values in an array of numbers.
 *
 * @param {Array<number>} points - The array of numbers.
 * @returns {Array<number>} An array containing the minimum and maximum values.
 */
export const minMax = (points: Array<number>): Array<number> => {
  return points.reduce<Array<number>>((acc, val) => {
    acc[0] = acc[0] === undefined || val < acc[0] ? val : acc[0];
    acc[1] = acc[1] === undefined || val > acc[1] ? val : acc[1];
    return acc;
  }, []);
};
