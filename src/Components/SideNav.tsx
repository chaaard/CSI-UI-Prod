import { Box,  Collapse,  Drawer, Grid, List, ListItemButton, ListItemIcon, ListItemText, Typography, styled,} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { AssignmentLate as AssignmentLateIcon, ArrowDropUp as ArrowDropUpIcon, ArrowDropDown as ArrowDropDownIcon, Circle as CircleIcon, PointOfSale as PointOfSaleIcon, Settings as SettingsIcon} from '@mui/icons-material';
import { useState } from 'react';
export interface INavLink {
  icon: JSX.Element;
  label: string;
  href: string;
}

interface SideNavProps {
  width: number; // Add a width prop
}

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
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Agile FS', href: '/agilefs' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Agile Merchandise', href: '/agilemerch' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Metromart', href: '/metromart' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Lazada', href: '/lazada' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Shopee', href: '/shopee' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Walk-In', href: '/walkin' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Employee', href: '/employee' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Volume Shopper', href: '/volumeshopper' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Bank Promos', href: '/bankpromos' },
  ]

  const reportsNavLinks: INavLink[] = [
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Sales Summary Reports', href: '/salessummreport' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Exception Reports', href: '/exceptionreport' },
  ]

  const maintenanceNavLinks: INavLink[] = [
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Customer Code', href: '/customercode' },
    { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'User', href: '/user' },
  ]

const SideNav: React.FC<SideNavProps> = ({ width }) => {
  const location = useLocation();
  const [transactionsDropdownValue, setTransactionsDropdownValue] = useState(false);
  const [reportsDropdownValue, setReportsDropdownValue] = useState(false);
  const [maintenanceDropdownValue, setMaintenanceDropdownValue] = useState(false);

  const handleTransactionChange = () => {
    setTransactionsDropdownValue((prevValue) => !prevValue);
  }

  const handleReportChange = () => {
    setReportsDropdownValue((prevValue) => !prevValue);
  }

  const handleMaintenanceChange = () => {
    setMaintenanceDropdownValue((prevValue) => !prevValue);
  }

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
            <ListItemButton component={NavLink} to={'/'} className="link" onClick={() => { handleTransactionChange() }} 
              sx={{ 
                marginLeft: "20px", 
                marginRight: "20px", 
                marginTop: '25px',
                backgroundColor: '#1C2C5A',
                borderRadius: '20px',
                boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
                '&:hover': {
                  backgroundColor: '#15294D',
                  borderColor: '#15294D',
                  boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
                },
              }}>
              <ListItemIcon 
                sx={{ 
                  color: 'white' 
                }}>
                <PointOfSaleIcon sx={{ fontSize: '33px' }} />
              </ListItemIcon>
              <ListItemText primary={'CSI'} 
                disableTypography 
                sx={{ 
                  color: 'white', 
                  paddingLeft: '8px', 
                  marginLeft: '-25px',
                  fontFamily: 'Inter',
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              />
              {
                  transactionsDropdownValue ? 
                  <ArrowDropDownIcon sx={{ color: 'white', fontSize: '30px' }} /> :  
                  <ArrowDropUpIcon sx={{ color: 'white', fontSize: '30px' }} /> 
              }
            </ListItemButton>
            <Collapse in={transactionsDropdownValue} timeout="auto" unmountOnExit>
              {transactionsNavLinks.map((transactionsNavLinks, index) => (
                <ListItemButton 
                  key={`transactionsNavLink-${index}`}
                  component={NavLink} 
                  to={transactionsNavLinks.href} 
                  style={{
                    backgroundColor: location.pathname === transactionsNavLinks.href ? '#0B183D' : 'inherit',
                    marginTop: '5px',
                  }}
                  className="link" 
                  sx={{ 
                    marginLeft: "30px", 
                    marginRight: "30px", 
                    borderRadius: "10px", 
                  }}
                  >
                  <ListItemIcon 
                    sx={{ 
                      color: location.pathname === transactionsNavLinks.href ? 'white' : '#1C2C5A',
                      marginLeft: '5px',
                    }}>
                    {transactionsNavLinks.icon}
                  </ListItemIcon>
                  <ListItemText primary={transactionsNavLinks.label} 
                    disableTypography 
                    sx={{ 
                      color: location.pathname === transactionsNavLinks.href ? 'white' : '#1C2C5A',
                      paddingLeft: '8px', 
                      marginLeft: '-30px',
                      fontFamily: 'Inter !important',
                      fontWeight: 'bold',
                    }}/>
                </ListItemButton>
              ))}
            </Collapse>

            <ListItemButton onClick={() => { handleReportChange() }} 
              sx={{ 
                marginLeft: "20px", 
                marginRight: "20px", 
                marginTop: '15px',
                backgroundColor: '#1C2C5A',
                borderRadius: '20px',
                boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
                '&:hover': {
                  backgroundColor: '#15294D',
                  borderColor: '#15294D',
                  boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
                },
              }}>
              <ListItemIcon 
                sx={{ 
                  color: 'white' 
                }}>
                <AssignmentLateIcon sx={{ fontSize: '33px' }} />
              </ListItemIcon>
              <ListItemText primary={'Reports'} 
                disableTypography 
                sx={{ 
                  color: 'white', 
                  paddingLeft: '8px', 
                  marginLeft: '-25px',
                  fontFamily: 'Inter',
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              />
              {
                reportsDropdownValue ? 
                <ArrowDropDownIcon sx={{ color: 'white', fontSize: '30px' }} /> :  
                <ArrowDropUpIcon sx={{ color: 'white', fontSize: '30px' }} /> 
              }
            </ListItemButton>
            <Collapse in={reportsDropdownValue} timeout="auto" unmountOnExit>
              {reportsNavLinks.map((reportsNavLinks, index) => (
                <ListItemButton 
                  key={`transactionsNavLink-${index}`}
                  component={NavLink} 
                  to={reportsNavLinks.href} 
                  style={{
                    backgroundColor: location.pathname === reportsNavLinks.href ? '#0B183D' : 'inherit',
                    marginTop: '5px',
                  }}
                  className="link" 
                  sx={{ 
                    marginLeft: "30px", 
                    marginRight: "30px", 
                    borderRadius: "10px", 
                  }}
                  >
                  <ListItemIcon 
                    sx={{ 
                      color: location.pathname === reportsNavLinks.href ? 'white' : '#1C2C5A',
                      marginLeft: '5px',
                    }}>
                    {reportsNavLinks.icon}
                  </ListItemIcon>
                  <ListItemText primary={reportsNavLinks.label} 
                    disableTypography 
                    sx={{ 
                      color: location.pathname === reportsNavLinks.href ? 'white' : '#1C2C5A',
                      paddingLeft: '8px', 
                      marginLeft: '-30px',
                      fontFamily: 'Inter !important',
                      fontWeight: 'bold',
                    }}/>
                </ListItemButton>
              ))}
            </Collapse>


            <ListItemButton onClick={() => { handleMaintenanceChange() }} 
              sx={{ 
                marginLeft: "20px", 
                marginRight: "20px", 
                marginTop: '15px',
                backgroundColor: '#1C2C5A',
                borderRadius: '20px',
                boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
                '&:hover': {
                  backgroundColor: '#15294D',
                  borderColor: '#15294D',
                  boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
                },
              }}>
              <ListItemIcon 
                sx={{ 
                  color: 'white' 
                }}>
                <SettingsIcon sx={{ fontSize: '33px' }} />
              </ListItemIcon>
              <ListItemText primary={'Maintenance'} 
                disableTypography 
                sx={{ 
                  color: 'white', 
                  paddingLeft: '8px', 
                  marginLeft: '-25px',
                  fontFamily: 'Inter',
                  fontWeight: 'bold',
                  fontSize: '18px',
                }}
              />
              {
                maintenanceDropdownValue ? 
                <ArrowDropDownIcon sx={{ color: 'white', fontSize: '30px' }} /> :  
                <ArrowDropUpIcon sx={{ color: 'white', fontSize: '30px' }} /> 
              }
            </ListItemButton>
            <Collapse in={maintenanceDropdownValue} timeout="auto" unmountOnExit>
              {maintenanceNavLinks.map((maintenanceNavLinks, index) => (
                <ListItemButton 
                  key={`transactionsNavLink-${index}`}
                  component={NavLink} 
                  to={maintenanceNavLinks.href} 
                  style={{
                    backgroundColor: location.pathname === maintenanceNavLinks.href ? '#0B183D' : 'inherit',
                    marginTop: '5px',
                  }}
                  className="link" 
                  sx={{ 
                    marginLeft: "30px", 
                    marginRight: "30px", 
                    borderRadius: "10px", 
                  }}
                  >
                  <ListItemIcon 
                    sx={{ 
                      color: location.pathname === maintenanceNavLinks.href ? 'white' : '#1C2C5A',
                      marginLeft: '5px',
                    }}>
                    {maintenanceNavLinks.icon}
                  </ListItemIcon>
                  <ListItemText primary={maintenanceNavLinks.label} 
                    disableTypography 
                    sx={{ 
                      color: location.pathname === maintenanceNavLinks.href ? 'white' : '#1C2C5A',
                      paddingLeft: '8px', 
                      marginLeft: '-30px',
                      fontFamily: 'Inter !important',
                      fontWeight: 'bold',
                    }}/>
                </ListItemButton>
              ))}
            </Collapse>
          </List>
        </CustomScrollbarBox>
      </Drawer>
    </>
  );
};

export default SideNav;