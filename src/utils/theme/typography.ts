import { Components } from '@mui/material';
import { TypographyOptions } from '@mui/material/styles/createTypography';

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
