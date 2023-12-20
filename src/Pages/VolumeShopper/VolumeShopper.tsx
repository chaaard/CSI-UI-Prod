import { Box, Grid, Typography, TextField, Button, Divider } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import ModalComponent from '../../Components/Common/ModalComponent';
import HeaderButtons from '../../Components/Common/HeaderButtons';
import ReferenceTable from '../../Components/Common/ReferenceTable';
import dayjs, { Dayjs } from 'dayjs';

const VolumeShopper = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentDate, setCurrentDate] = useState<Dayjs | null>(null);

  const handleOpenModal = () => {
    setOpen(true);
  };


  const handleCloseModal = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    document.title = 'CSI | Volume Shopper';
  }, []);

  useEffect(() => {
    const defaultDate = dayjs().startOf('day').subtract(1, 'day');
    const currentDate = dayjs().startOf('day').subtract(1, 'day');;
    setSelectedDate(defaultDate);
    setCurrentDate(currentDate);
  }, []);

  const handleChangeDate = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
  };

  const handleChangeSearch = (newValue: string) => {
    ///
  };

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
          <HeaderButtons handleChangeSearch={handleChangeSearch} handleOpenModal={handleOpenModal} customerName='VolumeShopper' handleChangeDate={handleChangeDate} selectedDate={selectedDate}/>  
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
                      marginRight: '620px',
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
                      Volume Shopper
                    </Typography>
                    <Box
                      sx={{
                        border: '2px solid #1C2D5B',
                        backgroundColor: '#F2F2F2',
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
                <ReferenceTable />
              </Box>
            </Box>
            <Divider variant="middle" sx={{ paddingTop: '20px', borderBottomWidth: 2 }} />
          </Grid>
        </Grid>
    </Box>
  )
}

export default VolumeShopper
