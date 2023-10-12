import { Box, TextField, TextFieldProps, styled } from '@mui/material';
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
  const handleSubmit = () => {
    console.log("Test");
  };

  useEffect(() => {
    const defaultDate = dayjs().subtract(1, 'day');
    setSelectedDate(defaultDate);
  }, []);

  const handleChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
  };

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
          onChange={handleChange}
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
                  color: '#404962',
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
        '& > :not(style)': {
          width: 250,
          height: 200,
        },
      }}>
      
      {/* Grab Mart */}
      <PaperComponent
        color = {'#00A94A'}
        backgroundColor = {'#F3F3F3'} 
        backgroundColorView = {'#EBEBEB'}
        image={GrabMart}
        onClick={handleSubmit}
        variance='-'
        system='0.00'
        actual='0.00'
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
        variance='-'
        system='0.00'
        actual='0.00'
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
        variance='-'
        system='0.00'
        actual='0.00'
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
        variance='-'
        system='0.00'
        actual='0.00'
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
        variance='-'
        system='0.00'
        actual='0.00'
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
        variance='-'
        system='0.00'
        actual='0.00'
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
        variance='-'
        system='0.00'
        actual='0.00'
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
        variance='-'
        system='0.00'
        actual='0.00'
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
        variance='-'
        system='0.00'
        actual='0.00'
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
        variance='-'
        system='0.00'
        actual='0.00'
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
        variance='-'
        system='0.00'
        actual='0.00'
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
        variance='-'
        system='0.00'
        actual='0.00'
        isImage={false}
        top={3}
        left={10}
        width='22%'
      />
    </Box>
  </CustomScrollbarBox>
  )
}

export default Dashboard