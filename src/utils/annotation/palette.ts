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

const palette = [red, orange, yellow, green, cyan, blue, purple, pink] as const;
const shades: Array<keyof Color> = [300, 400, 500, 600, 700];

export const getPolygonColor = (count: number) => {
  const shade = count > palette.length ? secondaryShade : primaryShade;

  return palette[count % palette.length][shade];
};

export const getRandomColor = () => {
  const colorIndex = Math.floor(Math.random() * palette.length);
  const shadeIndex = Math.floor(Math.random() * shades.length);

  return palette[colorIndex][shades[shadeIndex]];
};
