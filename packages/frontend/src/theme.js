import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00205B',
      light: '#0047AB',
      dark: '#001840',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00205B',
      light: '#F5F5F5',
      dark: '#424242',
    },
    text: {
      primary: '#424242',
      secondary: '#9E9E9E',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          minHeight: 44,
          minWidth: 44,
        },
        contained: {
          backgroundColor: '#00205B',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#0047AB',
          },
          '&:active': {
            backgroundColor: '#001840',
          },
          '&:disabled': {
            backgroundColor: '#9E9E9E',
            opacity: 0.6,
          },
        },
        outlined: {
          borderColor: '#00205B',
          color: '#00205B',
          '&:hover': {
            backgroundColor: 'rgba(0, 71, 171, 0.08)',
            borderColor: '#00205B',
          },
          '&:active': {
            backgroundColor: 'rgba(0, 24, 64, 0.12)',
          },
        },
        text: {
          color: '#00205B',
          '&:hover': {
            backgroundColor: 'rgba(0, 71, 171, 0.08)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          minWidth: 44,
          '&:focus-visible': {
            outline: '2px solid #0047AB',
            outlineOffset: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#0047AB',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00205B',
            },
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#00205B',
          minHeight: 44,
          minWidth: 44,
          '&.Mui-checked': {
            color: '#00205B',
          },
        },
      },
    },
  },
});

export default theme;
