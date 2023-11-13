import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
// import { CSSProperties } from "@mui/material/styles/createTypography";
import { CSSProperties } from 'react';
import { themeTypography, themeTypographyComponent } from './typography';

export const theme = createTheme({
  typography: {
    ...themeTypography,
  },
  components: {
    MuiTypography: {
      ...themeTypographyComponent,
    },
  },
  palette: {
    muted: {
      main: grey[500],
      light: grey[300],
      dark: grey[700],
      contrastText: grey[50],
    },
  },
});
