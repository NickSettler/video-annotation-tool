import { TypographyOptions } from '@mui/material/styles/createTypography';
import { Components } from '@mui/material/styles/components';

export const themeTypography: TypographyOptions = {
  captionMono: {
    fontFamily: 'JetBrains Mono',
    fontSize: '0.9rem',
  },
};

export const themeTypographyComponent: Components['MuiTypography'] = {
  defaultProps: {
    variantMapping: {
      captionMono: 'code',
    },
  },
};
