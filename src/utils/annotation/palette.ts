import {
  cyan,
  orange,
  purple,
  yellow,
  blue,
  green,
  pink,
  red,
} from '@mui/material/colors';
import { Color } from '@mui/material';

const primaryShade: keyof Color = 400;
const secondaryShade: keyof Color = 700;

const palette = [red, orange, yellow, green, cyan, blue, purple, pink];

export const getPolygonColor = (count: number) => {
  const shade = count > palette.length ? secondaryShade : primaryShade;

  return palette[count % palette.length][shade];
};
