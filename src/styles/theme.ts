import { createTheme, Theme } from '@mui/material/styles';
import { PRIMARY_BLACK, PRIMARY_WHITE } from '@styles/colors';

const customTheme = (_: any) =>
  createTheme({
    palette: {
      mode: 'dark'
    },
    typography: {
      fontFamily: 'Space Mono, monospace'
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: PRIMARY_BLACK,
            color: PRIMARY_WHITE,
            boxShadow: 'none',
            borderBottom: '1px solid #232323'
          }
        }
      }
    }
  });

export default customTheme;
