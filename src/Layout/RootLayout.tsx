import { Box } from '@mui/material'
import LoginPage from '../Pages/Auth/Login'
import useAuth from '../Hooks/UseAuth'
import { useEffect } from 'react'
import Layout from './Layout'

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
                <Layout />
            </Box>
        )}
    </>
  );
}

export default RootLayout;
