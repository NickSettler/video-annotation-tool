import { Components } from '@mui/material/styles/components';
import { ChipComponentOverride } from './Chip';
import { BaseTheme } from '../mui';

export const overrideComponents = <T extends BaseTheme>(
  theme: T,
): Components<T> => ({
  ...theme.components,
  MuiChip: ChipComponentOverride(theme),
});
