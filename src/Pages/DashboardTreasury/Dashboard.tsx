import { Box, Divider, Grid, TextField, TextFieldProps, Typography, styled, Card, Paper } from '@mui/material';
import GrabMart from '../../Assets/GrabMart.png'
import GrabFood from '../../Assets/GrabFood.png'
import Metromart from '../../Assets/Metromart.png'
import FoodPanda from '../../Assets/FoodPanda.png'
import Lazada from '../../Assets/Lazada.png'
import Shopee from '../../Assets/Shopee.png'
import PickARoo from '../../Assets/PickARoo.png';
import Gcash from '../../Assets/GCash.png';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import PaperComponent from '../../Components/Common/PaperComponent';
import StatusPaper from '../../Components/Common/StatusPaper';
import ITransactionProps from '../Common/Interface/ITransactionProps';
import { useNavigate } from 'react-router-dom';
import { fetchTotalAmounts } from "../../Components/Functions/GetTotalAmountPerMechant";
import { fetchTotalAmountTransactions } from '../../Components/Functions/GetTotalAmountTransactions';
import ITransactions from '../Common/Interface/ITransaction';

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
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null>(null);
  const getClub = window.localStorage.getItem('club');
  const [totalAmounts, setTotalAmounts] = useState<{ [key: string]: number } | null>(null);
  const [totalAmountCount, setTotalAmountCount] = useState<{ [key: string]: ITransactions } | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'CSI | Dashboard';
  }, []);

  let club = 0;
  if(getClub !== null)
  {
    club = parseInt(getClub, 10);
  }

  const handleSubmit = (data: string) => {
    navigate(`/treasury/csi${data}`);
  };

  useEffect(() => {
    const defaultDate = dayjs().startOf('day').subtract(1, 'day');
    const dateFrom = dayjs().startOf('day').subtract(1, 'day');
    const dateTo = dayjs().startOf('day');
    setSelectedDate(defaultDate);
    setSelectedDateFrom(dateFrom);
    setSelectedDateTo(dateTo);
  }, []);

  const handleChangeDate = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
  };

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChangeDateTo = (newValue: Dayjs | null) => {
    setSelectedDateTo(newValue);
  };

  // Combine all memCodes into a single array
  const memCodes = [
    '9999011955', '9999011929', '9999011838', '9999011931', '9999011935',
    '9999011855', '90999011855', '900999011855', '9999011915', '9999011914',
    '9999011926', '9999011572', '9999011554'
  ];

// Construct analyticsProps with combined memCodes
  const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const dateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const dateTo = selectedDateTo?.format('YYYY-MM-DD HH:mm:ss.SSS');

  useEffect(() => {
    async function getTotalAmounts() {
      try {
        const analyticsProps = {
          dates: [formattedDate ? formattedDate : ''],
          memCode: memCodes,
          userId: '',
          storeId: [club],
        };
        const amounts = await fetchTotalAmounts(analyticsProps);
        setTotalAmounts(amounts); // Update the state with the fetched totalAmounts
      } catch (error) {
        console.error("Error fetching total amounts:", error);
        // Handle errors here
      }
    }

    getTotalAmounts();
  }, [formattedDate]); // Run once on component mount

  useEffect(() => {
    async function getTotalAmounts() {
      try {
        if (dateFrom && dateTo)
        {
          const analyticsProps: ITransactionProps = {
            dates: [dateFrom ? dateFrom : '', dateTo ? dateTo : ''],
            memCode: memCodes,
            storeId: [club],
            statusId: [3, 5],
            actionId: [1, 2, 3, 4]
          };
          const amounts = await fetchTotalAmountTransactions(analyticsProps);
          setTotalAmountCount(amounts)
        }
      } catch (error) {
        console.error("Error fetching total amounts:", error);
        // Handle errors here
      }
    }

    if (dateFrom && dateTo)
    {
      getTotalAmounts();
    }
  }, [dateFrom, dateTo]); 

  

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
          disableMaskedInput
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
                  fontSize: '14px',
                  width: '225px'
                }
              }}
            />
          }
        />
      </LocalizationProvider>
    </Box>
    



    <Box sx={{ 
      flexGrow: 1, 
      paddingLeft: '15px' ,
      marginTop: '10px'
    }}>
      <Grid container>
        <Grid xs={12} sm={12} md={12} lg={5} sx={{paddingRight: '15px', paddingTop: '10px'}}>
          <Grid container alignItems="center"  sx={{
            border: '1px solid #1C2C5A',
            borderRadius: '15px',
            paddingTop: '5px',
            paddingBottom: '5px'
          }}>
            <Grid item xs >
              <Typography variant="h6" sx={{ color: '#1C2C5A', marginLeft: '6px',paddingLeft: '1px' }}>
                MMS
              </Typography>
            </Grid>
            <Grid item xs dir="rtl">
              <Typography variant="h6" sx={{ color: '#1C2C5A', marginLeft: '6px' , paddingRight: '15px'}}>
                0.00
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={2} sx={{paddingRight: '15px', paddingTop: '10px'}}>
          <Grid container alignItems="center" sx={{
            border: '1px solid #FB9E9E',
            borderRadius: '15px',
            paddingTop: '5px',
            paddingBottom: '5px',
            backgroundColor:'#FB9E9E'
          }}>
            <Grid item xs>
              <Typography variant="h6" align="center" sx={{ color: '#1C2C5A', marginLeft: '6px',paddingLeft: '1px' }}>
                0.00
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={5} sx={{paddingRight: '15px', paddingTop: '10px'}}>
          <Grid container alignItems="center" sx={{
            border: '1px solid #1C2C5A',
            borderRadius: '15px',
            paddingTop: '5px',
            paddingBottom: '5px'
          }}>
            <Grid item xs>
              <Typography variant="h6" sx={{ color: '#1C2C5A', marginLeft: '6px',paddingLeft: '1px' }}>
                CSI
              </Typography>
            </Grid>
            <Grid item xs dir="rtl">
              <Typography variant="h6" sx={{ color: '#1C2C5A', marginLeft: '6px' , paddingRight: '15px'}}>
                0.00
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
        color={'#00A94A'}
        backgroundColor={'#F3F3F3'}
        backgroundColorView={'#EBEBEB'}
        image={GrabMart}
        onClick={() => handleSubmit('/grabmart')}
        isImage={true}
        top={0}
        left={6}
        width="22%"
        paperWidth={380}
        total={totalAmounts?.['9999011955'] ?? 0} // Pass the total amount for the specific memCode, defaulting to 0 if totalAmounts is null
      />

      {/* Grab Food */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#00B14F'} 
        backgroundColorView = {'#009E47'}
        image={GrabFood}
        onClick={() => handleSubmit('/grabfood')}
        isImage={true}
        top={0}
        left={6}
        width='25%'
        paperWidth={380}
        total={totalAmounts?.['9999011929'] ?? 0}
      />

      {/* Food Panda */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#D71465'} 
        backgroundColorView = {'#B31154'}
        image={FoodPanda}
        onClick={() => handleSubmit('/foodpanda')}
        isImage={true}
        top={0}
        left={0}
        width='36%'
        paperWidth={380}
        total={totalAmounts?.['9999011838'] ?? 0}
      />

      {/* Pick A Roo Merch */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#1CE1CF'} 
        backgroundColorView = {'#0BC7B7'}
        image={PickARoo}
        onClick={() => handleSubmit('/pickaroomerch')}
        isImage={true}
        top={2}
        left={2}
        width='22%'
        paperWidth={380}
        total={totalAmounts?.['9999011931'] ?? 0}
      />

      {/* Pick A Roo FS */}
      <PaperComponent
        color = {'#1CE1CF'}
        backgroundColor = {'#FFFFFF'} 
        backgroundColorView = {'#ACACAC'}
        image={PickARoo}
        onClick={() => handleSubmit('/pickaroofs')}
        isImage={true}
        top={2}
        left={2}
        width='22%'
        paperWidth={380}
        total={totalAmounts?.['9999011935'] ?? 0}
      />

      {/* Metromart */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#424140'} 
        backgroundColorView = {'#2F2E2E'}
        image={Metromart}
        onClick={() => handleSubmit('/metromart')}
        isImage={true}
        top={3}
        left={6}
        width='25%'
        paperWidth={380}
        total={totalAmounts?.['9999011855'] ?? 0}
      />

      {/* Lazada */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#181164'} 
        backgroundColorView = {'#110C4A'}
        image={Lazada}
        onClick={() => handleSubmit('/lazada')}
        isImage={true}
        top={0}
        left={6}
        width='25%'
        paperWidth={380}
        total={totalAmounts?.['9999011915'] ?? 0}
      />

      {/* Shopee */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#F24731'} 
        backgroundColorView = {'#D73E2B'}
        image={Shopee}
        onClick={() => handleSubmit('/shopee')}
        isImage={true}
        top={6}
        left={0}
        width='25%'
        paperWidth={380}
        total={totalAmounts?.['9999011914'] ?? 0}
      />

      {/* GCash */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#007DFE'} 
        backgroundColorView = {'#0056AC'}
        image={Gcash}
        onClick={() => handleSubmit('/gcash')}
        isImage={true}
        top={6}
        left={0}
        width='25%'
        paperWidth={380}
        total={totalAmounts?.['9999011926'] ?? 0}
      />

      {/* Walk-In */}
      <PaperComponent
        color = {'#1C2C5A'}
        backgroundColor = {'#D9D9D9'} 
        backgroundColorView = {'#B8B8B8'}
        image={"Walk-In"}
        onClick={() => handleSubmit('/walkin')}
        isImage={false}
        top={3}
        left={10}
        width=''
        paperWidth={380}
        total={totalAmounts?.['9999011572'] ?? 0}
      />

      {/* Employee */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#1C2C5A'} 
        backgroundColorView = {'#17244A'}
        image={"Employee"}
        onClick={() => handleSubmit('/employee')}
        isImage={false}
        top={3}
        left={10}
        width=''
        paperWidth={380}
        total={totalAmounts?.['9999011554'] ?? 0}
      />

      {/* Volume Shopper */}
      <PaperComponent
        color = {'#1C2C5A'}
        backgroundColor = {'#D9D9D9'} 
        backgroundColorView = {'#B8B8B8'}
        image={"Volume Shopper"}
        onClick={() => handleSubmit('/volumeshopper')}
        isImage={false}
        top={3}
        left={10}
        width='22%'
        paperWidth={380}
        total={totalAmounts?.['9999011554'] ?? 0}
      />

      {/* Bank Promos */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#1C2C5A'} 
        backgroundColorView = {'#17244A'}
        image={"Bank Promos"}
        onClick={() => handleSubmit('/bankpromos')}
        isImage={false}
        top={3}
        left={10}
        width='22%'
        paperWidth={380}
        total={totalAmounts?.['9999011554'] ?? 0}
      />
    </Box>
    
  </CustomScrollbarBox>
  )
}

export default Dashboard