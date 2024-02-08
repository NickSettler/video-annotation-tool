import { ChipComponentOverride } from './Chip';
import { BaseTheme } from '../mui';
import { Components } from '@mui/material';

export const overrideComponents = <T extends BaseTheme>(
  theme: T,
): Components<T> => ({
  ...theme.components,
  MuiChip: ChipComponentOverride(theme),
});
