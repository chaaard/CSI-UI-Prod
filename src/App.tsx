import {
  RouterProvider
} from 'react-router-dom'
import Router from './Route/Router';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme/Theme';
import useAuth from "./Hooks/UseAuth";
import { AuthProvider } from './Context/AuthProvider';


const App: React.FC = () => {
  const isAuthenticated = useAuth();

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={Router} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
