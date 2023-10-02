import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Toolbar, Typography, useTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { useCallback, useState } from 'react';
import SideNav from './SideNav';
import React, { useContext } from 'react';
import AuthContext from '../Context/AuthProvider';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import IUserLogin from '../Pages/Auth/Interface/IUserLogin';


const Header: React.FC = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const userName = window.localStorage.getItem('userName');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState('Dashboard');
  const auth = useContext(AuthContext);
  const [login] = useState<IUserLogin>({
    Username: userName || "",
    Password: ""
  });
  const theme = useTheme();
  const navigate = useNavigate();
  const handleSideNavToggle = () => {
    setOpen(!open);
    console.log(open);
  }
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTitle = useCallback((value : string) => {
    setTitle(value);
  }, []);

  const handleSignOut = () => 
  {
    const url = `${REACT_APP_API_ENDPOINT}/Auth/Logout`;
    axios.post(url, login)
      .then(response => {
        var result = response.data;
        if(result.Message === 'Logout Successful')
        {
          setAnchorEl(null);
          auth.signOut();
          navigate('/');
        }
      }
    ).catch(error => {
      console.error("Error saving data:", error);
    })
  };

  const customWidth = open ? '1658px' : '1818px';
  const customLeft = open ? '277px' : '102px';

  const fullName = window.localStorage.getItem('fullName');

  return (
    <Box>
      <AppBar  
        sx={{
          backgroundColor: '#FFFFFF',
          color: theme.palette.primary.main,
          width: customWidth,
          left: customLeft,
          position: 'fixed',
          zIndex: theme.zIndex.drawer + 1,
          transition: 'left 0.3s ease',
        }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleSideNavToggle}
            sx={{ mr: 2 }}  
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "black", fontWeight: "bold" }}>
            {title}
          </Typography>
            <Box display={'flex'} alignItems={'center'} >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
              <Avatar
                sx={{
                  backgroundColor: '#1C3766',
                  textTransform: 'uppercase',
                  color: 'white'
                }}
              >
                {fullName
                  ? `${fullName.split(' ')[0][0]}${fullName.split(' ')[1][0]}` // Get the first letters
                  : ''}
              </Avatar>
              </IconButton>
              <Typography sx={{ fontWeight: 'bold' }}>{fullName}</Typography>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem> */}
                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
              </Menu>
            </Box>
        </Toolbar>
      </AppBar>
      <SideNav onClick={handleSideNavToggle} open={open} handleTitle={handleTitle}  />
      <Box 
        sx={{  
        position: 'absolute',
        top: '70px',
        left: open ? '272px' : '100px',
        right: 0,
        bottom: 0,
        overflowX: 'hidden', 
        overflowY: 'auto',   
        padding: '0 5px',    
        transition: 'left 0.3s ease',
      }}>
          <Outlet />   
      </Box>
    </Box>
  );
};

export default Header;