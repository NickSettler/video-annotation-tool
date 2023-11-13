import { TypographyOptions } from '@mui/material/styles/createTypography';
import { Components } from '@mui/material/styles/components';
import { CSSProperties } from 'react';

export const themeTypography: TypographyOptions = {
  captionMono: {
    fontFamily: 'JetBrains Mono',
    fontSize: '1rem',
    fontVariant: 'all-small-caps',
  },
};

export const themeTypographyComponent: Components['MuiTypography'] = {
  defaultProps: {
    variantMapping: {
      captionMono: 'code',
    },
  },
};
