import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/consistent-type-definitions
  interface Palette {
    muted: Palette['primary'];
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/consistent-type-definitions
  interface PaletteOptions {
    muted?: PaletteOptions['primary'];
  }
}

// Update the Button's color options to include an ochre option
declare module '@mui/material/Button' {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/consistent-type-definitions
  interface ButtonPropsColorOverrides {
    muted: true;
  }
}

export const theme = createTheme({
  palette: {
    muted: {
      main: grey[500],
      light: grey[300],
      dark: grey[700],
      contrastText: grey[50],
    },
  },
});
