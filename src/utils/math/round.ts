/**
 * Round a number to a specific decimal
 * @param value value to round
 * @param decimal decimal to round to
 * @example roundToDecimal(1.2, 0.25) => 1.25
 * @example roundToDecimal(1.2, 0.5) => 1.5
 * @example roundToDecimal(1.2, 0.75) => 1.5
 */
export const roundToDecimal = (value: number, decimal: number): number => {
  return Math.round(value / decimal) * decimal;
};
