import { Box,  Collapse,  Drawer, Grid, List, ListItemButton, ListItemIcon, ListItemText, Typography, styled,} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { AssignmentLate as AssignmentLateIcon, ArrowDropUp as ArrowDropUpIcon, ArrowDropDown as ArrowDropDownIcon, Circle as CircleIcon, PointOfSale as PointOfSaleIcon, Settings as SettingsIcon} from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

export interface INavLink {
  icon: JSX.Element;
  label: string;
  href: string;
}

interface SideNavProps {
  width: number; // Add a width prop
}

interface UserInfo {
  Role: string | null | undefined,
  Club: string | null | undefined
}

const StyledIcon = styled('div')({
  transition: 'transform 0.3s ease',
});

const CustomScrollbarBox = styled(Box)`
    overflow-y: auto;
    height: calc(100vh - 160px);

    /* Custom Scrollbar Styles */
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #2B4B81;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  `;
  const transactionsNavLinks: INavLink[] = [
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Grab Mart', href: '/grabmart' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Grab Food', href: '/grabfood' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Food Panda', href: '/foodpanda' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Pick A Roo Merch', href: '/pickaroomerch' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Pick A Roo FS', href: '/pickaroofs' },
    // { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Agile Merchandise', href: '/agilemerch' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'MetroMart', href: '/metromart' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'GCash', href: '/gcash' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Lazada', href: '/lazada' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Shopee', href: '/shopee' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Walk-In', href: '/walkin' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Employee', href: '/employee' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Volume Shopper', href: '/volumeshopper' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Bank Promos', href: '/bankpromos' },
  ]

  const reportsNavLinks: INavLink[] = [
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Weekly Delivery Reports', href: '/weeklydeliveryreport' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Sales Summary Reports', href: '/salessummreport' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Exception Reports', href: '/exceptionreport' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Generated Invoice Reports', href: '/generatedinvoicereport' },
  ]

  const maintenanceNavLinks: INavLink[] = [
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Customer Code', href: '/customercode' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'User', href: '/user' },
  ]

const SideNav: React.FC<SideNavProps> = ({ width }) => {
  const location = useLocation();
  const getRoleId = window.localStorage.getItem('roleId');
  const [transactionsDropdownValue, setTransactionsDropdownValue] = useState(false);
  const [reportsDropdownValue, setReportsDropdownValue] = useState(false);
  const [maintenanceDropdownValue, setMaintenanceDropdownValue] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  const { REACT_APP_API_ENDPOINT } = process.env;
  const userName = window.localStorage.getItem('userName');
  const reportsToShow = ['Weekly Delivery Reports', 'Sales Summary Reports', 'Generated Invoice Reports'];
  
  let roleId = 0;
  if(getRoleId !== null)
  {
    roleId = parseInt(getRoleId, 10);
  }

  const handleTransactionChange = () => {
    setTransactionsDropdownValue((prevValue) => !prevValue);
  }

  const handleReportChange = () => {
    setReportsDropdownValue((prevValue) => !prevValue);
  }

  const handleMaintenanceChange = () => {
    setMaintenanceDropdownValue((prevValue) => !prevValue);
  }

  const iconStyle = {
    color: transactionsDropdownValue ? '#FFFFFF' : '#1C2C5A',
    fontSize: '30px',
    transition: 'transform 0.3s ease', // Adjust the duration and easing function as needed
    transform: transactionsDropdownValue ? 'rotate(0deg)' : 'rotate(180deg)', // Adjust the rotation as needed
  };

  const fetchUserInfo = useCallback(async() => {
    try {
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

  const filteredReportsNavLinks = reportsNavLinks.filter((link) =>
  reportsToShow.includes(link.label)
);
  return (
    <>
      <Drawer
        anchor="left"
        open
        variant='persistent'
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: `${width}px`,
            backgroundColor: "#F2F2F2",
            overflowX: 'hidden',
            border: 'none',
            //boxShadow: '6px 9px 8px -1px rgba(0,0,0,0.3)', // Adjust the horizontal offset here
          },
        }}
      >
        <Grid container spacing={8} direction="row" justifyContent="center" alignItems="center">
          <Grid item>
            <Box 
              sx={{ 
                textAlign: 'center', 
                color: '#1C2C5A',
                marginTop: '10px'
              }}>
              <Typography variant="h5" 
                sx={{ 
                  fontSize: '70px', 
                  fontFamily: 'Arial', 
                  fontStyle: 'italic', 
                  fontWeight: 'bold' 
                }}>
                S&R
              </Typography>
              <Typography variant="h1" 
                sx={{ 
                  marginTop: '-19px',
                  fontSize: '15px', 
                  fontFamily: 'Arial',
                }}>
                Membership Shopping
              </Typography>
              <Typography variant="h1" 
                sx={{ 
                  marginTop: '20px',
                  fontSize: '30px', 
                  fontFamily: 'Inter',
                  fontWeight: '900', 
                  paddingLeft: '5px',
                  paddingRight: '-2px',
                }}>
                CSI SYSTEM
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <CustomScrollbarBox 
          sx={{ 
            overflowY: 'auto', 
            height: 'calc(100vh - 160px)', 
            scrollbarWidth: 'thin'
          }}>
          <List>
            {roleId === 1 || roleId === 2 || roleId === 3 ? 
            (
              <Box>
                {
                  userInfo.Role === 'Treasury'?
                  <Box>
                    <ListItemButton component={NavLink} to={'/'} className="link" onClick={() => { handleTransactionChange() }} 
                      sx={{ 
                        marginLeft: "20px", 
                        marginRight: "20px", 
                        marginTop: '25px',
                        backgroundColor: transactionsDropdownValue ? '#1C2C5A' : '#F2F2F2', 
                        borderRadius: '25px',
                        boxShadow: transactionsDropdownValue ? '0px 7px 5px -1px rgba(0,0,0,0.5)' : '',
                        '&:hover': {
                          backgroundColor: transactionsDropdownValue ? '#15294D' : '#C5C5C5', 
                          borderColor: transactionsDropdownValue ? '#15294D' : '#9E9E9E', 
                          boxShadow: transactionsDropdownValue ? '0px 7px 5px -1px rgba(0,0,0,0.5)' : '',
                        },
                      }}>
                      <ListItemIcon 
                        sx={{ 
                          color: transactionsDropdownValue ? '#FFFFFF' : '#1C2C5A' 
                        }}>
                        <PointOfSaleIcon sx={{ fontSize: '30px' }} />
                      </ListItemIcon>
                      <ListItemText primary={'CSI'} 
                        disableTypography 
                        sx={{ 
                          color: transactionsDropdownValue ? '#FFFFFF' : '#1C2C5A', 
                          paddingLeft: '8px', 
                          marginLeft: '-25px',
                          fontFamily: 'Inter',
                          fontWeight: 'bold',
                          fontSize: '18px',
                        }}
                      />

                        <StyledIcon style={{ transform: `rotate(${transactionsDropdownValue ? 360 : 0}deg)` }}>
                          {transactionsDropdownValue ? 
                            <ArrowDropDownIcon sx={{ color: transactionsDropdownValue ? '#FFFFFF' : '#1C2C5A' , fontSize: '30px' }} /> :  
                            <ArrowDropUpIcon sx={{ color: transactionsDropdownValue ? '#FFFFFF' : '#1C2C5A', fontSize: '30px' }} />
                          }
                        </StyledIcon>
                    </ListItemButton>
                    <Collapse in={transactionsDropdownValue} timeout="auto" unmountOnExit>
                      {transactionsNavLinks.map((transactionsNavLinks, index) => (
                        <ListItemButton 
                          key={`transactionsNavLink-${index}`}
                          component={NavLink} 
                          to={transactionsNavLinks.href} 
                          style={{
                            backgroundColor: location.pathname === transactionsNavLinks.href ? '#D9D9D9' : 'inherit',
                            marginTop: '5px',
                          }}
                          className="link" 
                          sx={{ 
                            marginLeft: "20px", 
                            marginRight: "20px", 
                            borderRadius: "25px", 
                            height: '35px',
                          }}
                          >
                          <ListItemIcon 
                            sx={{ 
                              color: location.pathname === transactionsNavLinks.href ? '#1C2C5A' : '#1C2C5A',
                              marginLeft: '5px',
                            }}>
                            {transactionsNavLinks.icon}
                          </ListItemIcon>
                          <ListItemText primary={transactionsNavLinks.label} 
                            disableTypography 
                            sx={{ 
                              color: location.pathname === transactionsNavLinks.href ? '#1C2C5A' : '#1C2C5A',
                              paddingLeft: '8px', 
                              marginLeft: '-30px',
                              fontFamily: 'Inter !important',
                              fontWeight: 'bold',
                              fontSize: '15px'
                            }}/>
                        </ListItemButton>
                      ))}
                    </Collapse>
                
                    <ListItemButton onClick={() => { handleReportChange() }} 
                      sx={{ 
                        marginLeft: "20px", 
                        marginRight: "20px", 
                        marginTop: '15px',
                        backgroundColor: reportsDropdownValue ? '#1C2C5A' : '#F2F2F2', 
                        borderRadius: '25px',
                        boxShadow: reportsDropdownValue ? '0px 7px 5px -1px rgba(0,0,0,0.5)' : '',
                        '&:hover': {
                          backgroundColor: reportsDropdownValue ? '#15294D' : '#C5C5C5', 
                          borderColor: reportsDropdownValue ? '#15294D' : '#9E9E9E', 
                          boxShadow: reportsDropdownValue ? '0px 7px 5px -1px rgba(0,0,0,0.5)' : '',
                        },
                      }}>
                      <ListItemIcon 
                        sx={{ 
                          color: reportsDropdownValue ? '#FFFFFF' : '#1C2C5A' 
                        }}>
                        <AssignmentLateIcon sx={{ fontSize: '33px' }} />
                      </ListItemIcon>
                      <ListItemText primary={'Reports'} 
                        disableTypography 
                        sx={{ 
                          color: reportsDropdownValue ? '#FFFFFF' : '#1C2C5A' , 
                          paddingLeft: '8px', 
                          marginLeft: '-25px',
                          fontFamily: 'Inter',
                          fontWeight: 'bold',
                          fontSize: '18px',
                        }}
                      />
                      <StyledIcon style={{ transform: `rotate(${reportsDropdownValue ? 360 : 0}deg)` }}>
                        {reportsDropdownValue ? 
                          <ArrowDropDownIcon sx={{ color: reportsDropdownValue ? '#FFFFFF' : '#1C2C5A' , fontSize: '30px' }} /> :  
                          <ArrowDropUpIcon sx={{ color: reportsDropdownValue ? '#FFFFFF' : '#1C2C5A', fontSize: '30px' }} />
                        }
                      </StyledIcon>
                    </ListItemButton>
                    <Collapse in={reportsDropdownValue} timeout="auto" unmountOnExit>
                      {reportsNavLinks.map((reportsNavLinks, index) => (
                        <ListItemButton 
                          key={`transactionsNavLink-${index}`}
                          component={NavLink} 
                          to={reportsNavLinks.href} 
                          style={{
                            backgroundColor: location.pathname === reportsNavLinks.href ? '#D9D9D9' : 'inherit',
                            marginTop: '5px',
                          }}
                          className="link" 
                          sx={{ 
                            marginLeft: "20px", 
                            marginRight: "20px", 
                            borderRadius: "25px", 
                          }}
                          >
                          <ListItemIcon 
                            sx={{ 
                              color: location.pathname === reportsNavLinks.href ? '#1C2C5A' : '#1C2C5A',
                              marginLeft: '5px',
                            }}>
                            {reportsNavLinks.icon}
                          </ListItemIcon>
                          <ListItemText primary={reportsNavLinks.label} 
                            disableTypography 
                            sx={{ 
                              color: location.pathname === reportsNavLinks.href ? '#1C2C5A' : '#1C2C5A',
                              paddingLeft: '8px', 
                              marginLeft: '-30px',
                              fontFamily: 'Inter !important',
                              fontWeight: 'bold',
                              fontSize: '15px'
                            }}/>
                        </ListItemButton>
                      ))}
                    </Collapse>
                  </Box>
                  :
                  userInfo.Role === 'Accounting'?
                  <Box>
                    <ListItemButton onClick={() => { handleReportChange() }} 
                      sx={{ 
                        marginLeft: "20px", 
                        marginRight: "20px", 
                        marginTop: '15px',
                        backgroundColor: reportsDropdownValue ? '#1C2C5A' : '#F2F2F2', 
                        borderRadius: '25px',
                        boxShadow: reportsDropdownValue ? '0px 7px 5px -1px rgba(0,0,0,0.5)' : '',
                        '&:hover': {
                          backgroundColor: reportsDropdownValue ? '#15294D' : '#C5C5C5', 
                          borderColor: reportsDropdownValue ? '#15294D' : '#9E9E9E', 
                          boxShadow: reportsDropdownValue ? '0px 7px 5px -1px rgba(0,0,0,0.5)' : '',
                        },
                      }}>
                      <ListItemIcon 
                        sx={{ 
                          color: reportsDropdownValue ? '#FFFFFF' : '#1C2C5A' 
                        }}>
                        <AssignmentLateIcon sx={{ fontSize: '33px' }} />
                      </ListItemIcon>
                      <ListItemText primary={'Reports'} 
                        disableTypography 
                        sx={{ 
                          color: reportsDropdownValue ? '#FFFFFF' : '#1C2C5A' , 
                          paddingLeft: '8px', 
                          marginLeft: '-25px',
                          fontFamily: 'Inter',
                          fontWeight: 'bold',
                          fontSize: '18px',
                        }}
                      />
                      <StyledIcon style={{ transform: `rotate(${reportsDropdownValue ? 360 : 0}deg)` }}>
                        {reportsDropdownValue ? 
                          <ArrowDropDownIcon sx={{ color: reportsDropdownValue ? '#FFFFFF' : '#1C2C5A' , fontSize: '30px' }} /> :  
                          <ArrowDropUpIcon sx={{ color: reportsDropdownValue ? '#FFFFFF' : '#1C2C5A', fontSize: '30px' }} />
                        }
                      </StyledIcon>
                    </ListItemButton>
                    <Collapse in={reportsDropdownValue} timeout="auto" unmountOnExit>
                    {filteredReportsNavLinks.map((reportNavLink, index) => (
                      <ListItemButton
                        key={`transactionsNavLink-${index}`}
                        component={NavLink}
                        to={reportNavLink.href}
                        style={{
                          backgroundColor: location.pathname === reportNavLink.href ? '#D9D9D9' : 'inherit',
                          marginTop: '5px',
                        }}
                        className="link"
                        sx={{
                          marginLeft: '20px',
                          marginRight: '20px',
                          borderRadius: '25px',
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: location.pathname === reportNavLink.href ? '#1C2C5A' : '#1C2C5A',
                            marginLeft: '5px',
                          }}
                        >
                          {reportNavLink.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={reportNavLink.label}
                          disableTypography
                          sx={{
                            color: location.pathname === reportNavLink.href ? '#1C2C5A' : '#1C2C5A',
                            paddingLeft: '8px',
                            marginLeft: '-30px',
                            fontFamily: 'Inter !important',
                            fontWeight: 'bold',
                            fontSize: '15px',
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </Collapse>
                  </Box>
                  : ''
                }
              </Box>
            ) : (
              <Box>
                <ListItemButton onClick={() => { handleMaintenanceChange() }} 
                  sx={{ 
                    marginLeft: "20px", 
                    marginRight: "20px", 
                    marginTop: '15px',
                    backgroundColor: maintenanceDropdownValue ? '#1C2C5A' : '#F2F2F2', 
                    borderRadius: '25px',
                    boxShadow: maintenanceDropdownValue ? '0px 7px 5px -1px rgba(0,0,0,0.5)' : '',
                    '&:hover': {
                      backgroundColor: maintenanceDropdownValue ? '#15294D' : '#C5C5C5', 
                      borderColor: maintenanceDropdownValue ? '#15294D' : '#9E9E9E', 
                      boxShadow: maintenanceDropdownValue ? '0px 7px 5px -1px rgba(0,0,0,0.5)' : '',
                    },
                  }}>
                  <ListItemIcon 
                    sx={{ 
                      color: maintenanceDropdownValue ? '#FFFFFF' : '#1C2C5A' , 
                    }}>
                    <SettingsIcon sx={{ fontSize: '33px' }} />
                  </ListItemIcon>
                  <ListItemText primary={'Maintenance'} 
                    disableTypography 
                    sx={{ 
                      color: maintenanceDropdownValue ? '#FFFFFF' : '#1C2C5A' , 
                      paddingLeft: '8px', 
                      marginLeft: '-25px',
                      fontFamily: 'Inter',
                      fontWeight: 'bold',
                      fontSize: '18px',
                    }}
                  />
                  <StyledIcon style={{ transform: `rotate(${maintenanceDropdownValue ? 360 : 0}deg)` }}>
                    {maintenanceDropdownValue ? 
                      <ArrowDropDownIcon sx={{ color: maintenanceDropdownValue ? '#FFFFFF' : '#1C2C5A' , fontSize: '30px' }} /> :  
                      <ArrowDropUpIcon sx={{ color: maintenanceDropdownValue ? '#FFFFFF' : '#1C2C5A', fontSize: '30px' }} />
                    }
                  </StyledIcon>
                </ListItemButton>
                <Collapse in={maintenanceDropdownValue} timeout="auto" unmountOnExit>
                  {maintenanceNavLinks.map((maintenanceNavLinks, index) => (
                    <ListItemButton 
                      key={`transactionsNavLink-${index}`}
                      component={NavLink} 
                      to={maintenanceNavLinks.href} 
                      style={{
                        backgroundColor: location.pathname === maintenanceNavLinks.href ? '#D9D9D9' : 'inherit',
                        marginTop: '5px',
                      }}
                      className="link" 
                      sx={{ 
                        marginLeft: "20px", 
                        marginRight: "20px", 
                        borderRadius: "25px", 
                      }}
                      >
                      <ListItemIcon 
                        sx={{ 
                          color: location.pathname === maintenanceNavLinks.href ? '#1C2C5A' : '#1C2C5A',
                          marginLeft: '5px',
                        }}>
                        {maintenanceNavLinks.icon}
                      </ListItemIcon>
                      <ListItemText primary={maintenanceNavLinks.label} 
                        disableTypography 
                        sx={{ 
                          color: location.pathname === maintenanceNavLinks.href ? '#1C2C5A' : '#1C2C5A',
                          paddingLeft: '8px', 
                          marginLeft: '-30px',
                          fontFamily: 'Inter !important',
                          fontWeight: 'bold',
                          fontSize: '15px'
                        }}/>
                    </ListItemButton>
                  ))}
                </Collapse>
              </Box>
            )}
          </List>
        </CustomScrollbarBox>
      </Drawer>
    </>
  );
};

export default SideNav;