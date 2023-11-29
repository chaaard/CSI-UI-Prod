import { Box, Grid, Typography, TextField, Button, ButtonGroup, Divider, Fade } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import ModalComponent from '../../Components/Common/ModalComponent';
import HeaderButtons from '../../Components/Common/HeaderButtons';
import MatchTable from '../../Components/Common/MatchTable';
import ExceptionsTable from '../../Components/Common/ExceptionsTable';
import AnalyticsTable from '../../Components/Common/AnalyticsTable';
import PortalTable from '../../Components/Common/PortalTable';

const GrabFood = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState('Match');

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleButtonClick = (buttonName : string) => {
    setActiveButton(buttonName);
    // Add any additional logic you need on button click
  };

  const handleCloseModal = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    document.title = 'CSI | GrabFood';
  }, []);

  return (
    <Box
      sx={{
        marginTop: '16px',
        marginLeft: '16px',
        flexGrow: 1,
      }}
    >
      <Grid container spacing={1} alignItems="flex-start" direction={'row'}>
        <Grid item>
          <HeaderButtons handleOpenModal={handleOpenModal} />  
        </Grid>
        <Grid item xs={12}
          sx={{
              paddingTop: '10px',
              paddingRight: '20px',
              transition: 'left 0.3s ease',
          }}>
            <Box sx={{
              boxShadow: 'inset 6px 9px 8px -1px rgba(0,0,0,0.3), inset -6px 0px 8px -1px rgba(0,0,0,0.3)',
              backgroundColor: '#F2F2F2',
              paddingTop: '10px',
              borderRadius: '20px',
            }}>
              <Grid container spacing={1} sx={{paddingTop: '4px'}}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingBottom: '10px',
                      backgroundColor: 'white',
                      marginLeft: '15px',
                      paddingLeft: '-1px',
                      marginRight: '650px',
                      borderTopRightRadius: '20px',
                      borderTopLeftRadius: '20px',
                      paddingTop: '5px',
                      justifyContent: 'center', 
                      alignItems: 'center',
                      boxShadow: '1px 9px 8px -1px rgba(0,0,0,0.3), 1px 0px 8px -1px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontWeight: '900',
                        color: '#1C3766',
                        fontSize: 17,
                      }}
                    >
                      GrabFood
                    </Typography>
                    <Box
                      sx={{
                        border: '2px solid #00B14F',
                        backgroundColor: '#00B14F',
                        height: '3px',
                        width: '40px',
                        borderRadius: '25px',
                      }}
                    >
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box 
                sx={{ 
                  position: 'relative', 
                  backgroundColor: 'white', 
                  boxShadow: '-7px 0px 8px -4px rgba(0,0,0,0.1),7px 0px 8px -4px rgba(0,0,0,0.1),0px 7px 8px -4px rgba(0,0,0,0.1)', 
                  textAlign: 'center',
                  borderBottomLeftRadius: '20px',
                  borderBottomRightRadius: '20px',
                }}
                >
                <ButtonGroup sx={{ height: '20px', display: 'flex', justifyContent: 'center', paddingTop: '10px'  }}>
                  <Button 
                    sx={{ 
                      fontWeight: '900 !important', 
                      fontSize: '12px', 
                      width: '250px', 
                      borderRadius: '10px', 
                      textTransform: 'none',  
                      border: '2px solid #1C2D5B' ,
                      color: activeButton === 'Analytics' ? '#fff' : '#1C2D5B',
                      backgroundColor: activeButton === 'Analytics' ? '#1C2D5B' : 'transparent',
                    }}
                    onClick={() => handleButtonClick('Analytics')}
                  >Analytics
                  </Button>
                  <Button 
                    sx={{ 
                      fontWeight: '900 !important', 
                      fontSize: '12px', 
                      width: '250px', 
                      textTransform: 'none',  
                      border: '2px solid #1C2D5B',
                      color: activeButton === 'Match' ? '#fff' : '#1C2D5B',
                      backgroundColor: activeButton === 'Match' ? '#1C2D5B' : 'transparent',
                    }}
                    onClick={() => handleButtonClick('Match')}
                  >Match
                  </Button>
                  <Button 
                    sx={{ 
                      fontWeight: '900 !important', 
                      fontSize: '12px', 
                      width: '250px' , 
                      borderRadius: '10px', 
                      textTransform: 'none',  
                      border: '2px solid #1C2D5B', 
                      color: activeButton === 'Portal' ? '#fff' : '#1C2D5B',
                      backgroundColor: activeButton === 'Portal' ? '#1C2D5B' : 'transparent',
                    }}
                    onClick={() => handleButtonClick('Portal')}
                  >Portal
                  </Button>
                </ButtonGroup>
                <div className="fade">
                  {activeButton === 'Analytics' && (
                    <Fade  in={true} timeout={500}>
                      <Box>
                        {/* <AnalyticsTable /> */}
                      </Box>
                    </Fade>
                  )}
                  {activeButton === 'Match' && (
                    <Fade  in={true}  timeout={500}>
                      <Box>
                        {/* <MatchTable /> */}
                      </Box>
                    </Fade>
                  )}
                  {activeButton === 'Portal' && (
                    <Fade  in={true} timeout={500}>
                      <Box>
                        {/* <PortalTable /> */}
                      </Box>
                    </Fade>
                  )}
                </div>
              </Box>
            </Box>
            <Divider variant="middle" sx={{ paddingTop: '20px', borderBottomWidth: 2 }} />
            <Box
              sx={{ paddingTop: '20px' }}>
              <ExceptionsTable />
            </Box>
          </Grid>
        </Grid>
      <ModalComponent
        title='Upload Prooflist'
        onClose={handleCloseModal}
        buttonName='Upload'
        open={open}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={8}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '20px'
                }}>
                Partner
              </Grid>
              <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
                <Box display={'flex'}>
                  <TextField 
                    size='small' 
                    fullWidth
                    value={"GrabFood"}
                    disabled
                  >
                  </TextField>
                </Box>
              </Grid>
              <Grid item xs={8}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '20px'
                }}>
                File
              </Grid>
              <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
                <Box display={'flex'}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled
                    value="Selected File"
                    size='small'
                    helperText='*CSV, TXT, XLS, XLSX File Only'
                  />
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#B6B6B6',
                      color: '#FFFFFF',
                      height: '39.5px',
                      boxShadow: 'inset 1px 6px 8px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)',
                      marginLeft: '-10px',
                      borderRadius: 0,
                      borderTopRightRadius: '8px',
                      borderBottomRightRadius: '8px',
                    }}
                  >
                    Browse
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        } 
      />
    </Box>
  )
}

export default GrabFood
