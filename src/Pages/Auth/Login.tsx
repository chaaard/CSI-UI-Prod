import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Alert, Box, Button, Divider, Fade, Grid, IconButton, InputAdornment, Snackbar, TextField, Typography, styled } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios, { AxiosRequestConfig } from 'axios';
import  useAuth   from '../../Hooks/UseAuth';
import { Form, useNavigate } from 'react-router-dom';
import IUserLogin from './Interface/IUserLogin';
import ModalComponent from '../../Components/Common/ModalComponent';
import IFirstLogin from '../Common/Interface/IFirstLogin';

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

interface UserInfo {
  Role: string | null | undefined,
  Club: string | null | undefined
}

const LoginPage = () => {

const navigate = useNavigate();
const auth = useAuth();
const { REACT_APP_API_ENDPOINT } = process.env;
const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success');
const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
const [errorMessage, setErrorMessage] = useState<string>('');
const [successMessage, setSuccessMessage] = useState<string>('');
const [submitted, setSubmitted] = useState<boolean>(false);
const [submittedPassword, setSubmittedPassword] = useState<boolean>(false);
const [showPassword, setShowPassword] = useState<boolean>(false);
const [login, setLogin] = useState<IUserLogin>({
  Username: "",
  Password: ""
});
const [password, setPassword] = useState<string>('');
const [confirmPassword, setConfirmPassword] = useState<string>('');
const [submittedButton, setSubmittedButton] = useState<boolean>(false);

const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
const userName = window.localStorage.getItem('userName');
const [openSubmit, setOpenSubmit] = useState<boolean>(false);
const [message, setMessage] = useState<string>(''); // Error message
const [isDisabled, setIsDisabled] = useState(true);
const [borderColor, setBorderColor] = useState('');

useEffect(() => {
  document.title = 'CSI | Login';
}, []);

// Handle First Login Users. , borderColor: borderColor
useEffect(() => {
  if (openSubmit === true) {
    if ( password === confirmPassword && password !== login.Password && confirmPassword !== login.Password && password !== null && confirmPassword !== null) {
      setIsDisabled(false);
      setBorderColor('black');
    }
    else if(password === login.Password && confirmPassword === login.Password){
      setIsDisabled(true);
      setIsSnackbarOpen(true);
      setSnackbarSeverity('error');
      setErrorMessage('Please use different password!');
      setBorderColor('red');
    }
    else {
        setIsDisabled(true);
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setErrorMessage('Password do not match!');
        setBorderColor('red');
    }
  }
}, [password, confirmPassword]);

// Handle closing the snackbar
const handleCloseSubmit = () => {
  setOpenSubmit(false);
};

const handleSubmitClick = () => {
  setSubmittedPassword(true);
  try {
    const updatedParam: IFirstLogin = {
      Username: login.Username,
      Password: confirmPassword
    }

    const submitChangePassword: AxiosRequestConfig = {
      method: 'POST',
      url: `${REACT_APP_API_ENDPOINT}/Auth/ChangePassword`,
      data: updatedParam,
    };

    axios(submitChangePassword)
    .then(async (response) => {
      var result = response.data;
      if(result.Message === 'Successful') 
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setSuccessMessage('Password change successfully');
        setOpenSubmit(false);
        setSubmittedPassword(true);
      }
      else
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setErrorMessage('Error password change. Please try again!');
        setOpenSubmit(false);
        setSubmittedPassword(true);
      }
    })
    .catch((error) => {
      setIsSnackbarOpen(true);
      setSnackbarSeverity('error');
      setErrorMessage('Error password change');
    })
  } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity('error');
      setErrorMessage('Error password change');
  } 
};

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
        if(result.IsFirstLogin === true)
        {
          setOpenSubmit(true)
        }
        else
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setSuccessMessage('Login successfully!')
          setSubmitted(true);
          setTimeout(() => {
            setIsSnackbarOpen(false); 
              result.RoleId === 1 ? 
              navigate('accounting/dashboard-accounting') :  
              result.RoleId === 2 ? 
              navigate('treasury/dashboard-treasury') : 
              result.RoleId === 4 ? 
              navigate('system-admin/dashboard-system-admin') : 
              navigate('maintenance')
            window.location.reload()
          }, 1000,);
        }
      }
      else if(result.Message === 'Login attempt limit reached!')
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setErrorMessage('Login attempt limit reached!')
          setLogin({
            Username: "",
            Password: ""
          })
        }
      
      else if(result.Message === 'User not found.')
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setErrorMessage('User not found.')
        setLogin({
          Username: "",
          Password: ""
        })
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
    setSubmitted(false);
    setLogin({
      Username: "",
      Password: ""
    })
  } 
  else if (error.response.data === 'Login attempt limit reached!') {
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setErrorMessage(`${error.response.data}`);
    setSubmitted(false);
    setLogin({
      Username: "",
      Password: ""
    })
  }
  else {
    console.error('Login failed:', error);
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setErrorMessage('Incorrect username/password.');
    setSubmitted(false);
    setLogin({
      Username: "",
      Password: ""
    })
  }
  });
}


// .catch(error => {
//   console.error('Login failed:', error);
//     setIsSnackbarOpen(true);
//     setSnackbarSeverity('error');
//     setErrorMessage(`${error.response.data}`);
//     setSubmitted(false);
//     setLogin({
//       Username: "",
//       Password: ""
//     })
//   });

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

const handleChangePasswordModal = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name: inputName, value } = event.target;
  setPassword(value);
};

const handleConfirmChangePasswordModal = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name: inputName, value } = event.target;
  setConfirmPassword(value);
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
    <ModalComponent
        title='User New Password'
        onClose={handleCloseSubmit}
        buttonName='Submit'
        isDisabled={isDisabled}
        open={openSubmit}
        onSave={handleSubmitClick}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={8}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '20px',
                }}
              >
                <Typography sx={{ fontSize: '25px', textAlign: 'center', marginRight: '-170px' }}>
                  <Form>
                    <Box sx={{ paddingTop: '3%', width: '100%' }}>
                      <TextField 
                        InputProps={{sx: { borderRadius: 7, },
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
                        label='New Password'
                        id='NewPassword'
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleChangePasswordModal}
                        required
                        value={password}
                        error={submittedPassword && password === ""}
                        helperText={submittedPassword && password === "" && "Password is required"}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            handleLoginSubmit();
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ paddingTop: '3%', width: '100%' }}>
                      <TextField 
                        InputProps={{sx: { borderRadius: 7, },
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
                        label='Confirm New Password'
                        id='ConfirmNewPassword'
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleConfirmChangePasswordModal}
                        required
                        value={confirmPassword}
                        error={submittedPassword && confirmPassword === ""}
                        helperText={submittedPassword && confirmPassword === "" && "Password is required"}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            handleSubmitClick();
                          }
                        }}
                      />
                    </Box>
                  </Form>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        } 
      />
  </Box>
  );
}

export default LoginPage;