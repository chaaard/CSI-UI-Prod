import {
  RouterProvider
} from 'react-router-dom'
import Router from './Route/Router';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Theme/Theme';
import { AuthProvider } from './Context/AuthProvider';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={Router} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
