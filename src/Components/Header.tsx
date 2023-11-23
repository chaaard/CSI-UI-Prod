import { AppBar, Grid, Avatar, Box, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';
import { format } from 'date-fns';
import { PopoverComponent } from './Popover';
import dayjs, { Dayjs } from 'dayjs';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  sideNavWidth: number;
}

const Header: React.FC<HeaderProps> = ({ sideNavWidth }) => {
  const anchorRef = useRef(null);
  const theme = useTheme();
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'EEEE, MMMM dd, yyyy');
  const [openPopover, setOpenPopover] = useState<boolean>(false);
  const fullName = window.localStorage.getItem('fullName');

  const isExtraScreenSmall = useMediaQuery(theme.breakpoints.down(550));
  const location = useLocation();

  const handleClosePopover = useCallback(() => {
    setOpenPopover(false);
  }, []);

  const handleOpenPopover = () => {
    setOpenPopover(true);
  };

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
                        Treasury - BGC
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
                      {fullName
                        ? `${fullName.split(' ')[0][0]}${fullName.split(' ')[1][0]}`
                        : ''}
                    </Avatar>
                  </Grid>
                </IconButton>
                <PopoverComponent
                  anchorEl={anchorRef.current}
                  open={openPopover}
                  onClose={handleClosePopover}
                  isExtraScreenSmall={isExtraScreenSmall}
                  role={"Treasury"}
                  location={"BGC"}
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
                      Treasury - BGC
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
                    {fullName
                      ? `${fullName.split(' ')[0][0]}${fullName.split(' ')[1][0]}`
                      : ''}
                  </Avatar>
                </Grid>
              </IconButton>
              <PopoverComponent
                anchorEl={anchorRef.current}
                open={openPopover}
                onClose={handleClosePopover}
                isExtraScreenSmall={isExtraScreenSmall}
                role={"Treasury"}
                location={"BGC"}
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