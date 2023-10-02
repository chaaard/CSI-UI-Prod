import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Alert, Box, Divider, Fade, Grid, IconButton, InputAdornment, Snackbar, TextField, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import  useAuth   from '../../Hooks/UseAuth';
import { useNavigate } from 'react-router-dom';
import IUserLogin from './Interface/IUserLogin';

const WhiteAlert = styled(Alert)(({ theme }) => ({
  color: theme.palette.common.white,
}));

const BootstrapButton = styled(IconButton)(({ theme }) => ({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16, 
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: '#1C3766',
  borderColor: '#1C3766',
  color: 'white',
  '&:hover': {
    backgroundColor: '#15294D',
    borderColor: '#15294D',
  },
  borderRadius: theme.shape.borderRadius, // Ensure the button has the default shape
}));

const LoginPage = () => {

const navigate = useNavigate();
const auth = useAuth();
const { REACT_APP_API_ENDPOINT } = process.env;
const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success');
const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
const [errorMessage, setErrorMessage] = useState<string>('');
const [successMessage, setSuccessMessage] = useState<string>('');
const [submitted, setSubmitted] = useState<boolean>(false);
const [showPassword, setShowPassword] = useState<boolean>(false);
const [login, setLogin] = useState<IUserLogin>({
  Username: "",
  Password: ""
});

useEffect(() => {
  document.title = 'CSI | Login';
}, []);

const handleClickShowPassword = () => setShowPassword((show) => !show);

const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
};

const handleLoginSubmit = () => {
  setSubmitted(true);
  if (!login.Username || !login.Password ) {
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setErrorMessage('Please input required fields.');
    return;
  }

  const url = `${REACT_APP_API_ENDPOINT}/Auth/Login`;
  axios.post(url, login)
    .then(response => {
      var result = response.data;
      if(result.Message !== 'User is already logged in.')
      {
        auth.signIn(result); 
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setSuccessMessage('Login successfully!')
        setSubmitted(true);
        
        setTimeout(() => {
          setIsSnackbarOpen(false); 
          navigate('/');
          window.location.reload()
        }, 1000);
      }
      else
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setErrorMessage('User is already logged in.')
      }
    }
).catch(error => {
  if (error.response && error.response.status === 401) {
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setErrorMessage('Invalid credentials. Please try again.');
  } else {
    console.error('Login failed:', error);
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setErrorMessage('Error occurred. Please try again.');
  }
  });
}

const handleLoginADSubmit = () => {
  const url = `${REACT_APP_API_ENDPOINT}/Auth/LoginAD`;
  axios.post(url)
    .then(response => {
      var result = response.data;
      if(result.Message !== 'User is already logged in.')
      {
        auth.signIn(result); 
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setSuccessMessage('Login successfully!')
        
        setTimeout(() => {
          setIsSnackbarOpen(false); 
          navigate('/');
          window.location.reload()
        }, 1000);
      }
      else
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setErrorMessage('User is already logged in.')
      }
    }
).catch(error => {
  if (error.response && error.response.status === 401) {
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setErrorMessage('Invalid credentials. Please try again.');
  } else {
    console.error('Login failed:', error);
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setErrorMessage('Error occurred. Please try again.');
  }
  });
}

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name: inputName, value } = event.target;
  const updatedFormData = {
    ...login,
    [inputName]: value,
  };

  setLogin(updatedFormData);
};

const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
  if (reason === 'clickaway') {
    return;
  }

  setIsSnackbarOpen(false);
};

return (
  <Box 
    sx={{ 
      backgroundColor: '#F2F2F2',
      flexGrow: 1, 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
    <Grid container spacing={8} direction="row" justifyContent="center" alignItems="center">
      <Grid item>
        <Box 
          sx={{ 
            textAlign: 'center', 
            color: '#1C2C5A',
            marginBottom: '40px',
          }}>
          <Typography variant="h1" 
            sx={{ 
              fontSize: '240px', 
              fontFamily: 'Arial', 
              fontStyle: 'italic', 
              fontWeight: 'bold' 
            }}>
            S&R
          </Typography>
          <Typography variant="h4" 
            sx={{ 
              marginTop: '-35px',
              fontSize: '50px', 
              fontFamily: 'Arial'
            }}>
            Membership Shopping
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Card 
          sx={{ 
            padding: '20px', 
            borderRadius: 7, 
            mb: 4,
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.20) inset',
          }}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              fontSize: '40px', 
              fontWeight: 'bold', 
              color: '#1C3766', 
              mb: 2 
            }}>
              CSI System
          </Box>
          <Box>
            <CardContent 
              sx={{ 
                padding: '16px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
              }}>
              <Box 
                sx={{ 
                  paddingTop: '8px', 
                  width: '100%' 
                }}>
                <TextField 
                  InputProps={{sx: { borderRadius: 7 }}}
                  fullWidth
                  sx={{ PaddingLeft: '100px'}}
                  label='Username'
                  name='Username'
                  onChange={handleChange}
                  value={login.Username}
                  required
                  error={submitted && login.Username === ""}
                  helperText={submitted && login.Username === "" && "Username is required"}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleLoginSubmit();
                    }
                  }}
                />
              </Box>
              <Box sx={{ paddingTop: '3%', width: '100%' }}>
                <TextField 
                  InputProps={{sx: { borderRadius: 7 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                    )
                  }}
                  fullWidth
                  label='Password'
                  name='Password'
                  type={showPassword ? 'text' : 'password'}
                  value={login.Password}
                  onChange={handleChange}
                  required
                  error={submitted && login.Password === ""}
                  helperText={submitted && login.Password === "" && "Password is required"}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleLoginSubmit();
                    }
                  }}
                />
              </Box>
              <Box sx={{ paddingTop: '4%', flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                <BootstrapButton 
                  sx={{
                    color: "white",
                    fontSize: "16px",   
                    backgroundColor: "#1C3766",
                    width: "370px",  
                    borderRadius: "10px", 
                  }}
                  onClick={handleLoginSubmit}
                >
                  <Typography>
                    Login 
                  </Typography>
                </BootstrapButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', marginTop: '20px' }}>
                <Divider sx={{ width: '80px' }} />
                  <Typography variant="body2" sx={{ color: '#1C3766', marginX: '10px' }}>
                    OR
                  </Typography>
                <Divider sx={{ width: '80px' }} />
              </Box>
              <Box sx={{ paddingTop: '4%', flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                <BootstrapButton 
                  sx={{
                    color: "white",
                    fontSize: "16px",
                    backgroundColor: "#1C3766",
                    width: "370px",
                    borderRadius: "10px",
                  }}
                  onClick={handleLoginADSubmit}
                >
                  <Typography>
                    SSO Login 
                  </Typography>
                </BootstrapButton>
              </Box>
            </CardContent>
          </Box>
        </Card>     
      </Grid>
    </Grid>
    <Snackbar
      open={isSnackbarOpen}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
      TransitionComponent={Fade} 
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <WhiteAlert variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarSeverity === 'success' ? successMessage : errorMessage}
      </WhiteAlert>
    </Snackbar>
  </Box>
  );
}

export default LoginPage;