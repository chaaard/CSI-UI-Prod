import {
  RouterProvider
} from 'react-router-dom'
import Router from './Route/Router';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme/Theme';
import { AuthProvider } from './Context/AuthProvider';
// import SessionTimeout from './Components/SessionTimeout';
import './App.css'; 
import { useEffect } from 'react';

const App: React.FC = () => {

  useEffect(() => {
    document.title = 'CSI';
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        {/* <ErrorBoundary> */}
          <RouterProvider router={Router} />
        {/* </ErrorBoundary> */}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
