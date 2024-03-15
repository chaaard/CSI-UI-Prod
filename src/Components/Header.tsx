import { AppBar, Grid, Avatar, Box, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';
import { format } from 'date-fns';
import { PopoverComponent } from './Popover';
import dayjs, { Dayjs } from 'dayjs';
import { useLocation } from 'react-router-dom';
import axios, { AxiosRequestConfig } from 'axios';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

interface HeaderProps {
  sideNavWidth: number;
}
interface UserInfo {
  Role: string | null | undefined,
  Club: string | null | undefined
}

const Header: React.FC<HeaderProps> = ({ sideNavWidth }) => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const anchorRef = useRef(null);
  const theme = useTheme();
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'EEEE, MMMM dd, yyyy');
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const fullName = window.localStorage.getItem('fullName');
  const userName = window.localStorage.getItem('userName');
  const isExtraScreenSmall = useMediaQuery(theme.breakpoints.down(550));
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(false);
  }, []);

  const handleOpenPopover = () => {
    setOpenPopover(true);
  };

  const fetchUserInfo = useCallback(async() => {
    try {
      if(userName)
      {
        const formData = new FormData();
        if (userName !== null) {
          formData.append('username', userName);
        }
        const getUserInfo: AxiosRequestConfig = {
          method: 'POST',
          url: `${REACT_APP_API_ENDPOINT}/Auth/GetUserInfo`,
          data: formData,
        };
  
        axios(getUserInfo)
        .then(async (response) => {
          setUserInfo(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, [REACT_APP_API_ENDPOINT, userName]);

  useEffect(() => {
    if(userName !== null)
    {
      fetchUserInfo();
    }
  }, [fetchUserInfo, userName]);

  const name = userInfo.Role === 'Accounting' || userInfo.Role === 'System Admin' ? (userInfo.Role ? userInfo.Role : '') : (userInfo.Role ? userInfo.Role : '') + " - " + (userInfo.Club ? userInfo.Club : '')

  return (
    <Box>
      <AppBar  
        sx={{
          backgroundColor: '#F2F2F2',
          zIndex: theme => theme.zIndex.drawer + 1,
          marginLeft: `${sideNavWidth}px `,
          width: `calc(100% - ${sideNavWidth}px)`, 
          boxShadow: 'none',
        }}>
        {location.pathname === '/' ? (
          <Box>
            <Toolbar>
              <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'flex-end'}
                flexGrow={1} 
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                  disableRipple 
                >
                  <Grid container alignItems="center">
                  {!isExtraScreenSmall && (
                    <Box
                      sx={{
                        marginRight: '10px',
                        textAlign: 'right',
                        color: '#1C2C5A',
                      }}
                    >
                      <Typography variant="h5" 
                        sx={{ 
                          fontSize: '15px', 
                          fontFamily: 'Inter',
                          fontWeight: '900', 
                        }}>
                        {name}
                      </Typography>
                      <Typography variant="h4" 
                      sx={{ 
                        fontSize: '11px', 
                        fontStyle: 'italic',
                        fontFamily: 'Inter',
                        fontWeight: '900', 
                        }}>
                        {formattedDate}
                      </Typography>
                    </Box>
                    )}
                    <Avatar
                      onClick={handleOpenPopover}
                      ref={anchorRef}
                      sx={{
                        backgroundColor: '#1C3766',
                        textTransform: 'uppercase',
                        color: 'white',
                        marginLeft: '10px',
                        boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
                      }}
                    >
                      <PersonRoundedIcon />
                    </Avatar>
                  </Grid>
                </IconButton>
                <PopoverComponent
                  anchorEl={anchorRef.current}
                  open={openPopover}
                  onClose={handleClosePopover}
                  isExtraScreenSmall={isExtraScreenSmall}
                  role={userInfo?.Role}
                  location={userInfo?.Club}
                  date={formattedDate}
                />
              </Box>
            </Toolbar>
          </Box>
        ) : (
          <Toolbar>
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'flex-end'}
              flexGrow={1} 
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                disableRipple 
              >
                <Grid container alignItems="center">
                {!isExtraScreenSmall && (
                  <Box
                    sx={{
                      marginRight: '10px',
                      textAlign: 'right',
                      color: '#1C2C5A',
                    }}
                  >
                    <Typography variant="h5" 
                      sx={{ 
                        fontSize: '15px', 
                        fontFamily: 'Inter',
                        fontWeight: '900', 
                      }}>
                      {name}
                    </Typography>
                    <Typography variant="h4" 
                    sx={{ 
                      fontSize: '11px', 
                      fontStyle: 'italic',
                      fontFamily: 'Inter',
                      fontWeight: '900', 
                      }}>
                      {formattedDate}
                    </Typography>
                  </Box>
                  )}
                  <Avatar
                    onClick={handleOpenPopover}
                    ref={anchorRef}
                    sx={{
                      backgroundColor: '#1C3766',
                      textTransform: 'uppercase',
                      color: 'white',
                      marginLeft: '10px',
                      boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
                    }}
                  >
                    <PersonRoundedIcon />
                  </Avatar>
                </Grid>
              </IconButton>
              <PopoverComponent
                anchorEl={anchorRef.current}
                open={openPopover}
                onClose={handleClosePopover}
                isExtraScreenSmall={isExtraScreenSmall}
                role={userInfo?.Role}
                location={userInfo?.Club}
                date={formattedDate}
              />
            </Box>
          </Toolbar>
        )}
      </AppBar>
    </Box>
  );
};

export default Header;