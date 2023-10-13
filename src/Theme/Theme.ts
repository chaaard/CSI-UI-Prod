import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#FFFFFF',
      main: '#1C3766',
    },
    secondary: {
      main: '#4caf50',
    },
    text : {
        primary: '#000000',
    },
    background: {
      default: "#222222",
    }
  },
  typography: {
    fontFamily: "Inter",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f0f0f0',
            color: '#1C3766' // Change this to your desired hover background color
          },
        },
      },
    },
  },
});

export default theme;	