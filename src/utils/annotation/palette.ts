import { Color } from '@mui/material';
import {
  blue,
  cyan,
  green,
  orange,
  pink,
  purple,
  red,
  yellow,
} from '@mui/material/colors';

const primaryShade: keyof Color = 400;
const secondaryShade: keyof Color = 700;

const palette = [red, orange, yellow, green, cyan, blue, purple, pink];

export const getPolygonColor = (count: number) => {
  const shade = count > palette.length ? secondaryShade : primaryShade;

  return palette[count % palette.length][shade];
};
