import { Box, Divider, Grid, TextField, TextFieldProps, Typography, styled } from '@mui/material';
import GrabMart from '../../Assets/GrabMart.png'
import GrabFood from '../../Assets/GrabFood.png'
import Metromart from '../../Assets/Metromart.png'
import FoodPanda from '../../Assets/FoodPanda.png'
import Lazada from '../../Assets/Lazada.png'
import Shopee from '../../Assets/Shopee.png'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import PaperComponent from '../../Components/Common/PaperComponent';
import StatusPaper from '../../Components/Common/StatusPaper';

const CustomScrollbarBox = styled(Box)`
    overflow-y: auto;
    height: calc(100vh - 100px);

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

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null | undefined>(null);
  const [currentDate, setCurrentDate] = useState<Dayjs | null | undefined>(null);
  
  const handleSubmit = () => {
    console.log("Test");
  };

  useEffect(() => {
    const defaultDate = dayjs().subtract(1, 'day');
    const currentDate = dayjs();
    setSelectedDate(defaultDate);
    setCurrentDate(currentDate);
  }, []);

  const handleChangeDate = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
  };

  const handleChangeCurrentDate = (newValue: Dayjs | null) => {
    setCurrentDate(newValue);
  };

  useEffect(() => {
    document.title = 'CSI | Dashboard';
  }, []);

  return (
  <CustomScrollbarBox>
    <Box 
      sx={{
        marginTop: '16px',
        marginLeft: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker  
          inputFormat="dddd, MMMM DD, YYYY"
          value={selectedDate}
          onChange={handleChangeDate}
          renderInput={(params : TextFieldProps) => 
            <TextField  
              size="small"
              {...params} 
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderRadius: '40px',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  color: '#1C2C5A',
                  fontFamily: 'Inter',
                  fontWeight: 'bold',
                  width: '250px'
                }
              }}
            />
          }
        />
      </LocalizationProvider>
    </Box>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '16px',
        marginLeft: '16px',
        marginRight: '16px',
        flexWrap: 'wrap',
      }}>
      
      {/* Grab Mart */}
      <PaperComponent
        color = {'#00A94A'}
        backgroundColor = {'#F3F3F3'} 
        backgroundColorView = {'#EBEBEB'}
        image={GrabMart}
        onClick={handleSubmit}
        total='0.00'
        isImage={true}
        top={0}
        left={6}
        width='22%'
      />

      {/* Grab Food */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#00B14F'} 
        backgroundColorView = {'#009E47'}
        image={GrabFood}
        onClick={handleSubmit}
        total='0.00'
        isImage={true}
        top={0}
        left={6}
        width='25%'
      />

      {/* Food Panda */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#D71465'} 
        backgroundColorView = {'#B31154'}
        image={FoodPanda}
        onClick={handleSubmit}
        total='0.00'
        isImage={true}
        top={0}
        left={0}
        width='36%'
      />

      {/* Agile FS */}
      <PaperComponent
        color = {'#1C2C5A'}
        backgroundColor = {'#ECECEC'} 
        backgroundColorView = {'#D2D1D1'}
        image={"Agile FS"}
        onClick={handleSubmit}
        total='0.00'
        isImage={false}
        top={3}
        left={10}
        width=''
      />

      {/* Agile Merchandise */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#1C2C5A'} 
        backgroundColorView = {'#17244A'}
        image={"Agile Merchandise"}
        onClick={handleSubmit}
        total='0.00'
        isImage={false}
        top={3}
        left={10}
        width='22%'
      />


      {/* Metromart */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#424140'} 
        backgroundColorView = {'#2F2E2E'}
        image={Metromart}
        onClick={handleSubmit}
        total='0.00'
        isImage={true}
        top={3}
        left={6}
        width='25%'
      />

      {/* Lazada */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#181164'} 
        backgroundColorView = {'#110C4A'}
        image={Lazada}
        onClick={handleSubmit}
        total='0.00'
        isImage={true}
        top={0}
        left={6}
        width='25%'
      />

      {/* Shopee */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#F24731'} 
        backgroundColorView = {'#D73E2B'}
        image={Shopee}
        onClick={handleSubmit}
        total='0.00'
        isImage={true}
        top={6}
        left={0}
        width='25%'
      />

      {/* Walk-In */}
      <PaperComponent
        color = {'#1C2C5A'}
        backgroundColor = {'#D9D9D9'} 
        backgroundColorView = {'#B8B8B8'}
        image={"Walk-In"}
        onClick={handleSubmit}
        total='0.00'
        isImage={false}
        top={3}
        left={10}
        width=''
      />

      {/* Employee */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#1C2C5A'} 
        backgroundColorView = {'#17244A'}
        image={"Employee"}
        onClick={handleSubmit}
        total='0.00'
        isImage={false}
        top={3}
        left={10}
        width=''
      />

      {/* Volume Shopper */}
      <PaperComponent
        color = {'#1C2C5A'}
        backgroundColor = {'#D9D9D9'} 
        backgroundColorView = {'#B8B8B8'}
        image={"Volume Shopper"}
        onClick={handleSubmit}
        total='0.00'
        isImage={false}
        top={3}
        left={10}
        width='22%'
      />

      {/* Bank Promos */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#1C2C5A'} 
        backgroundColorView = {'#17244A'}
        image={"Bank Promos"}
        onClick={handleSubmit}
        total='0.00'
        isImage={false}
        top={3}
        left={10}
        width='22%'
      />
    </Box>
    <Divider 
      sx={{ 
        marginLeft: '16px', 
        marginRight: '16px',
        border: "1px solid #BBBBBB",
      }}>
    </Divider>
    <Grid container direction="row" alignItems="center" sx={{ padding: '10px 16px 0 16px' }} >
      <Grid item xs={12} sm={12} md={12} lg={12} xl={2.5}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            inputFormat="dddd, MMMM DD, YYYY"
            value={selectedDate}
            onChange={handleChangeDate}
            renderInput={(params: TextFieldProps) => (
              <TextField
                size="small"
                {...params}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderRadius: '40px',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#1C2C5A',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    width: '250px',
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={0.4}>
        <Typography variant="h6" sx={{ color: '#1C2C5A' }}>
          To:
        </Typography>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={8}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            inputFormat="dddd, MMMM DD, YYYY"
            value={currentDate}
            onChange={handleChangeCurrentDate}
            renderInput={(params: TextFieldProps) => (
              <TextField
                size="small"
                {...params}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderRadius: '40px',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#1C2C5A',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    width: '250px',
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
    <Box 
      sx={{ 
        position: 'relative', 
        marginLeft: '16px', 
        marginRight: '16px', 
        marginTop: '10px',
        backgroundColor: '#F2F2F2',
        borderRadius: '25px',
        height: '100%',
        boxShadow: 'inset 6px 9px 8px -1px rgba(0,0,0,0.1), inset -6px 0px 8px -1px rgba(0,0,0,0.1)',
        maxHeight: '320px',
      }}
    >
      <Grid container justifyContent="center">
        <Grid item>
          <Box  
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <StatusPaper 
              title={'Pending'} 
              transactionCount={10} 
              totalAmount={'100,000'} 
              color='#404962' 
              bgColor='#FFE5A2' 
              borderColor='2px solid #E8D092' 
            />

            <StatusPaper 
              title={'Completed'} 
              transactionCount={10} 
              totalAmount={'100,000'} 
              color='#404962' 
              bgColor='#D4E5F5' 
              borderColor='2px solid #BBCBDA' 
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  </CustomScrollbarBox>
  )
}

export default Dashboard