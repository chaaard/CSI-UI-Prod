import { Box, Divider, Grid, TextField, TextFieldProps, Typography, styled, Card, Paper, Snackbar, Alert, Fade } from '@mui/material';
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
import axios, { AxiosRequestConfig } from 'axios';
import IVarianceMMS from '../Common/Interface/IVarianceMMS';
import IAnalyticProps from '../Common/Interface/IAnalyticsProps';

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
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [variance, setVariance] = useState<IVarianceMMS>([] as IVarianceMMS);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null>(null);
  const getClub = window.localStorage.getItem('club');
  //const [totalAmounts, setTotalAmounts] = useState<{ [key: string]: number } | null>(null);
  const [totalAmounts, setTotalAmounts] = useState<{ [key: string]: number[] } | null>(null);

  const [totalAmountCount, setTotalAmountCount] = useState<{ [key: string]: ITransactions } | null>(null);
  const navigate = useNavigate();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [message, setMessage] = useState<string>(''); // Error message
  
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
    handleGetVarianceMMS();
    setSelectedDate(newValue);
  };

  // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
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
    '9999011926', '9999011572', '9999011554','9999011542','9999011546','9999011547',
    '9999011549123123','9999011552','9999011553','9999011559','9999011563','9999011565',
    '9999011571','9999011574','9999011578','9999011579','9999011580','9999011581',
    '9999011582','9999011593','9999011595','9999011596','9999011599','9999011600',
    '9999011601','9999011604','9999011611','9999011617','9999011620','9999011621',
    '9999011626','9999011627','9999011631','9999011632','9999011633','9999011634',
    '9999011637','9999011638','9999011639','9999011640','9999011641','9999011642',
    '9999011644','9999011646','9999011647','9999011649','9999011650','9999011655',
    '9999011656','9999011657','9999011659','9999011661','9999011662','9999011663',
    '9999011665','9999011667','9999011671','9999011672','9999011673','9999011675',
    '9999011676','9999011677','9999011678','9999011688','9999011696','9999011697',
    '9999011698','9999011700','9999011702','9999011707','9999011710','9999011714',
    '9999011735','9999011740','9999011747','9999011749','9999011750','9999011751',
    '9999011753','9999011773','9999011774','9999011776','9999011789','9999011792',
    '9999011794','9999011795','9999011796','9999011797','9999011799','9999011800',
    '9999011823','9999011826','9999011827','9999011828','9999011829','9999011841',
    '9999011850','9999011851','9999011852','9999011853','9999011854','9999011856',
    '9999011857','9999011860','9999011877','9999011886','9999011887','9999011889',
    '9999011894','9999011898','9999011900','9999011903','9999011904','9999011907',
    '9999011910','9999011918','9999011919','9999011925',
    '9999011933','9999011944','9999011945','9999011949','9999011950','9999011951',
    '9999011953','9999011956','9999011957','9999011959','9999011960','9999011967',
    '9999011968','9999011971','9999011972','9999011978','9999011983','9999011986',
    '9999011988','9999011989','9999011990','9999011996','9999011999','9999012000',
    '9999012001','9999012002','9999012003','9999012005','9999012006','9999012008',
    '9999012009','9999012010','9999012011','9999012012','9999012013','9999012014',
    '9999012015','9999012017','9999012018','9999012019','9999012020','9999012021',
    '9999012022','9999012023','9999012024','9999012025','9999012026','9999012027',
    '9999012028','9999012029','9999012030','9999012031','9999012032','9999012039',
    '9999012040','9999012041','9999012042','9999012043','9999012044','9999012045',
    '9999012046','9999012047','9999011548','9999011724','9999011785','9999011793',
    '9999011936','9999011984'
  ];

// Construct analyticsProps with combined memCodes
  const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const dateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const dateTo = selectedDateTo?.format('YYYY-MM-DD HH:mm:ss.SSS');

  useEffect(() => {
    if (formattedDate)
    {
      handleGetVarianceMMS();
    }
  }, [formattedDate]); 

// Define custom styles for white alerts
const WhiteAlert = styled(Alert)(({ severity }) => ({
  color: '#1C2C5A',
  fontFamily: 'Inter',
  fontWeight: '700',
  fontSize: '15px',
  borderRadius: '25px',
  border:  severity === 'success' ? '1px solid #4E813D' : '1px solid #9B6B6B',
  backgroundColor: severity === 'success' ? '#E7FFDF' : '#FFC0C0',
}));

const handleGetVarianceMMS = () => {

  var updatedParams: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    storeId: [club],
    memCode: memCodes,
  }

  const getVariance: AxiosRequestConfig = {
    method: 'POST',
    url: `${REACT_APP_API_ENDPOINT}/Analytics/GetVarianceMMS`,
    data: updatedParams,
  };

  axios(getVariance)
  .then((response) => {
    if (Array.isArray(response.data) && response.data.length > 0) {
      setVariance(response.data[0]);
    } else {
      setIsSnackbarOpen(true);
      setSnackbarSeverity('error');
      setMessage('Error: Empty response or unexpected format.');
    }
  })
  .catch((error) => {
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setMessage('Error occurred.');
    throw error;
  });
};

  useEffect(() => {
    async function getTotalAmounts() {
      try {
        const analyticsProps = {
          dates: [formattedDate ? formattedDate : ''],
          memCode: memCodes,
          userId: '',
          storeId: [club],
        };

        console.log("analyticsProps",analyticsProps);
        const amounts = await fetchTotalAmounts(analyticsProps);
         // Transform the fetched amounts to the expected format
        const transformedAmounts = Object.keys(amounts).reduce((acc, key) => {
          acc[key] = [amounts[key]];
          return acc;
        }, {} as { [key: string]: number[] });

        console.log("amounts",amounts);
        console.log("transformedAmounts",transformedAmounts);
        setTotalAmounts(transformedAmounts); // Update the state with the fetched totalAmounts
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
                {variance && variance.MMS !== undefined && variance.MMS !== null ? variance.MMS.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
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
                {variance && variance.Variance !== undefined && variance.Variance !== null ? variance.Variance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
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
                {variance && variance.CSI !== undefined && variance.CSI !== null ? variance.CSI.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        marginTop: '16px',
        marginLeft: '16px',
        flexWrap: 'wrap',
        gap: '9px', 
      }}>
      <Grid container spacing={1}>
        <Grid xs={12} sm={6} md={4} lg={3}>
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
            total={totalAmounts ? ['9999011955'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0) : 0} // Pass the total amount for the specific memCode, defaulting to 0 if totalAmounts is null
          />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={3}>
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
            total={totalAmounts ? ['9999011929'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0) : 0}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={3}>
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
            total={totalAmounts ? ['9999011838'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0) : 0}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={3}>
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
            total={totalAmounts ? ['9999011931'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0) : 0}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={3}>
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
            total={totalAmounts ? ['9999011935'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0) : 0}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4} lg={3}>
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
            total={totalAmounts ? ['9999011855'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0) : 0}
          />
        </Grid>
      {club === 217 ? 
      ( 
        <>
          <Grid xs={12} sm={6} md={4} lg={3}>
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
              total={totalAmounts ? ['9999011915'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0) : 0}
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
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
              total={totalAmounts ? ['9999011914'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0) : 0}
            />
          </Grid>
        </>
      ) : 
      (
        <></>
      )
      } 
      <Grid xs={12} sm={6} md={4} lg={3}>
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
          total={totalAmounts ? ['9999011926'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0) : 0}
        />
      </Grid>
      <Grid xs={12} sm={6} md={4} lg={3}>
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
          total={totalAmounts ? ['9999011572'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0) : 0}
        />
      </Grid>
      <Grid xs={12} sm={6} md={4} lg={3}>
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
          total={totalAmounts ? ['9999011554'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0) : 0}
        />
      </Grid>
      <Grid xs={12} sm={6} md={4} lg={3}>
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
          total={totalAmounts ? ['9999011542','9999011546','9999011547','9999011549123123','9999011552','9999011553','9999011559','9999011563','9999011565','9999011571','9999011574','9999011578','9999011579','9999011580','9999011581','9999011582','9999011593','9999011595','9999011596','9999011599','9999011600','9999011601','9999011604','9999011611','9999011617','9999011620','9999011621','9999011626','9999011627','9999011631','9999011632','9999011633','9999011634','9999011637','9999011638','9999011639','9999011640','9999011641','9999011642','9999011644','9999011646','9999011647','9999011649','9999011650','9999011655','9999011656','9999011657','9999011659','9999011661','9999011662','9999011663','9999011665','9999011667','9999011671','9999011672','9999011673','9999011675','9999011676','9999011677','9999011678','9999011688','9999011696','9999011697','9999011698','9999011700','9999011702','9999011707','9999011710','9999011714','9999011735','9999011740','9999011747','9999011749','9999011750','9999011751','9999011753','9999011773','9999011774','9999011776','9999011789','9999011792','9999011794','9999011795','9999011796','9999011797','9999011799','9999011800','9999011823','9999011826','9999011827','9999011828','9999011829','9999011841','9999011850','9999011851','9999011852','9999011853','9999011854','9999011856','9999011857','9999011860','9999011877','9999011886','9999011887','9999011889','9999011894','9999011898','9999011900','9999011903','9999011904','9999011907','9999011910','9999011914','9999011915','9999011918','9999011919','9999011925','9999011933','9999011944','9999011945','9999011949','9999011950','9999011951','9999011953','9999011956','9999011957','9999011959','9999011960','9999011967','9999011968','9999011971','9999011972','9999011978','9999011983','9999011986','9999011988','9999011989','9999011990','9999011996','9999011999','9999012000','9999012001','9999012002','9999012003','9999012005','9999012006','9999012008','9999012009','9999012010','9999012011','9999012012','9999012013','9999012014','9999012015','9999012017','9999012018','9999012019','9999012020','9999012021','9999012022','9999012023','9999012024','9999012025','9999012026','9999012027','9999012028','9999012029','9999012030','9999012031','9999012032','9999012039','9999012040','9999012041','9999012042','9999012043','9999012044','9999012045','9999012046','9999012047'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0 ) : 0 }
        />
      </Grid>
      <Grid xs={12} sm={6} md={4} lg={3}>
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
          total={totalAmounts ? ['9999011548','9999011724','9999011785','9999011793','9999011936','9999011984'].reduce((sum, key) => sum + (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0), 0) : 0}
        />
        </Grid>
      </Grid>
    </Box>
    {/* Snackbar for displaying messages */}
    <Snackbar
      open={isSnackbarOpen}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
      TransitionComponent={Fade} 
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <WhiteAlert  variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {message}
      </WhiteAlert>
    </Snackbar>
  </CustomScrollbarBox>
  )
}

export default Dashboard