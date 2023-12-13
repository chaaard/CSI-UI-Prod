import React, { useContext, useState } from 'react';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import IUserLogin from '../Pages/Auth/Interface/IUserLogin';
import axios from 'axios';
import AuthContext from '../Context/AuthProvider';
import { useNavigate } from 'react-router-dom';

interface PaperProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  open: boolean;
  isExtraScreenSmall: boolean;
  location: string | null | undefined;
  role: string | null | undefined;
  date: string;
}

export const PopoverComponent: React.FC<PaperProps> = ({anchorEl, onClose, open, isExtraScreenSmall, location, role, date}) => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const fullName = window.localStorage.getItem('fullName');
  const userName = window.localStorage.getItem('userName');
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [login] = useState<IUserLogin>({
    Username: userName || "",
    Password: ""
  });
  
  const handleSignOut = () => 
  {
    const url = `${REACT_APP_API_ENDPOINT}/Auth/Logout`;
    axios.post(url, login)
      .then(response => {
        var result = response.data;
        if(result.Message === 'Logout Successful')
        {
          auth.signOut();
          navigate('/');
        }
      }
    ).catch(error => {
      console.error("Error saving data:", error);
    })
  };


  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom',
      }}
      onClose={onClose}
      open={open}
    >
      <Box 
        sx={{ 
          py: 1.5, 
          px: 2 
        }}>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontWeight: 'bold',
            fontSize: '18px'
          }}
        >
          Account
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontSize: '15px',
            marginRight: '10px',
            textAlign: 'left',
          }}
        >
          {fullName != null ? fullName : null}
        </Typography>
        {isExtraScreenSmall ? (
          <Box 
            sx={{
              marginRight: '10px',
              textAlign: 'left', 
            }}>
            <Typography variant="h5" 
              sx={{ 
                fontSize: '13px', 
                fontFamily: 'Inter',
                fontWeight: 'bold', 
              }}>
              {role} - {location}
            </Typography>
            <Typography variant="h4" 
              sx={{ 
                fontSize: '11px', 
                fontFamily: 'Inter',
                fontWeight: 'bold',
                marginTop: '3px',
              }}>
                {date}
            </Typography>
          </Box>
        ) : (null
        
        )}
        
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1,
          },
        }}
      >
        <MenuItem 
          onClick={handleSignOut}
          sx={{
            color: '#FFFFFF',
            backgroundColor: '#1C2C5A',
            borderRadius: '10px',
            fontFamily: 'Inter',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#15294D',
              borderColor: '#15294D',
            },
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center', // Center the content vertically
            justifyContent: 'center', // Center the content horizontally
          }}
        >Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
};