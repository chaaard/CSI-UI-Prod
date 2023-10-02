import { Box } from '@mui/material'
import Header from '../Components/Header'
import LoginPage from '../Pages/Auth/Login'
import useAuth from '../Hooks/UseAuth'
import { useEffect } from 'react'

const RootLayout = () => {
    const { isAuthenticated } = useAuth();
        
  useEffect(() => {
  }, [isAuthenticated]);


  return (
    <>
        {!isAuthenticated ? (
            <Box>
                <LoginPage />
            </Box>
            ) : (
            <Box>
                <Header />
            </Box>
        )}
    </>
  );
}

export default RootLayout;
