import { Components } from '@mui/material/styles/components';
import { BaseTheme } from '../mui';
import { alpha } from '@mui/material';

export const ChipComponentOverride = <T extends BaseTheme>(
  theme: T,
): Components<T>['MuiChip'] => ({
  variants: [
    {
      props: { variant: 'soft', color: 'primary' },
      style: {
        border: `1px solid ${theme.palette.primary.light}`,
        backgroundColor: alpha(theme.palette.primary.light, 0.36),
        color: theme.palette.primary.dark,

        '& > .MuiChip-deleteIcon': {
          color: theme.palette.primary.main,

          '&:hover': {
            color: theme.palette.primary.dark,
          },
        },
      },
    },
  ],
});
