import { Box,  Collapse,  Drawer, Grid, List, ListItemButton, ListItemIcon, ListItemText, Typography, styled,} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { CallMerge as CallMergeIcon, ArrowDropUp as ArrowDropUpIcon, ArrowDropDown as ArrowDropDownIcon, Circle as CircleIcon} from '@mui/icons-material';
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

const SideNav: React.FC<SideNavProps> = ({ width }) => {
  const [transactionsDropdownValue, setTransactionsDropdownValue] = useState(false);

  const handleTransactionChange = () => {
    setTransactionsDropdownValue((prevValue) => !prevValue);
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
                  fontSize: '15px', 
                  fontFamily: 'Inter',
                  fontWeight: 'bold', 
                  paddingLeft: '5px',
                  paddingRight: '-2px',
                }}>
                32nd St. 5th Ave. Fort Bonifacio Global City, Taguig
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
            <ListItemButton onClick={() => { handleTransactionChange() }} 
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
                <CallMergeIcon sx={{ fontSize: '33px' }} />
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
                }}/>
              {
                  transactionsDropdownValue ? 
                  <ArrowDropDownIcon sx={{ color: 'white', fontSize: '30px' }} /> :  
                  <ArrowDropUpIcon sx={{ color: 'white', fontSize: '30px' }} /> 
              }
            </ListItemButton>
            <Collapse in={transactionsDropdownValue} timeout="auto" unmountOnExit>
              {transactionsNavLinks.map((transactionsNavLinksNavLink, index) => (
                <ListItemButton 
                  key={`transactionsNavLink-${index}`}
                  component={NavLink} 
                  to={transactionsNavLinksNavLink.href} 
                  style={{
                    backgroundColor: 'inherit',
                    color: '#1C2C5A',
                  }}
                  className="link" 
                    sx={{ 
                      marginLeft: "20px", 
                      marginRight: "20px", 
                      borderRadius: "10px" 
                    }}>
                  <ListItemIcon 
                    sx={{ 
                      color: '#1C2C5A',
                      marginLeft: '10px',
                    }}>
                    {transactionsNavLinksNavLink.icon}
                  </ListItemIcon>
                  <ListItemText primary={transactionsNavLinksNavLink.label} 
                    disableTypography 
                    sx={{ 
                      color: '#1C2C5A',
                      paddingLeft: '8px', 
                      marginLeft: '-35px',
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