import { themeTypography, themeTypographyComponent } from './typography';
import { overrideComponents } from './components';
import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
theme.components = overrideComponents(theme);

export { theme };
