import '@mui/material';
import '@mui/material/styles';
import '@mui/material/Button';
import '@mui/material/Typography';
import { CSSProperties } from 'react';

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

declare module '@mui/material' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions,@typescript-eslint/naming-convention
  interface TypographyPropsVariantOverrides {
    captionMono: true;
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions,@typescript-eslint/naming-convention
  interface TypographyClasses {
    captionMono: string;
  }
}

declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions,@typescript-eslint/naming-convention
  interface TypographyVariants {
    captionMono: CSSProperties;
  }

  // allow configuration using `createTheme`
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions,@typescript-eslint/naming-convention
  interface TypographyVariantsOptions {
    captionMono?: CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions,@typescript-eslint/naming-convention
  interface TypographyPropsVariantOverrides {
    captionMono: true;
  }
}
