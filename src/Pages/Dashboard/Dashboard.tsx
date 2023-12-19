import { Box, Divider, Grid, TextField, TextFieldProps, Typography, styled } from '@mui/material';
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
import IAnalyticProps from '../Common/Interface/IAnalyticsProps';
import ITransactionProps from '../Common/Interface/ITransactionProps';

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
  
  useEffect(() => {
    document.title = 'CSI | Dashboard';
  }, []);

  let club = 0;
  if(getClub !== null)
  {
    club = parseInt(getClub, 10);
  }

  const handleSubmit = () => {
    console.log("Test");
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

  const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const analyticsPropsForGrabMart: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    memCode: ['9999011955'],
    userId: '',
    storeId: [club],
  };

  const analyticsPropsForGrabFood: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    memCode: ['9999011929'],
    userId: '',
    storeId: [club],
  };

  const analyticsPropsForFoodPanda: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    memCode: ['9999011838'],
    userId: '',
    storeId: [club],
  };

  const analyticsPropsForPickARoo: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    memCode: ['9999011931'],
    userId: '',
    storeId: [club],
  };

  const analyticsPropsForMetroMart: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    memCode: ['9999011855', '90999011855', '900999011855'],
    userId: '',
    storeId: [club],
  };

  const analyticsPropsForLazada: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    memCode: ['9999011915'],
    userId: '',
    storeId: [club],
  };

  const analyticsPropsForShopee: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    memCode: ['9999011914'],
    userId: '',
    storeId: [club],
  };

  const analyticsPropsForGCash: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    memCode: ['9999011926'],
    userId: '',
    storeId: [club],
  };

  const analyticsPropsForWalkIn: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    memCode: ['9999011572'],
    userId: '',
    storeId: [club],
  };

  const analyticsPropsForEmployee: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    memCode: ['9999011554'],
    userId: '',
    storeId: [club],
  };

  const analyticsPropsForVolumeShopper: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    memCode: ['9999011537', '9999011542', '9999011546', '9999011547', '9999011549', '9999011550',
              '9999011553', '9999011559', '9999011563', '9999011565', '9999011571', '9999011574',
              '9999011578', '9999011579', '9999011580', '9999011581', '9999011582', '9999011593',
              '9999011595', '9999011596', '9999011599', '9999011600', '9999011601', '9999011604',
              '9999011611', '9999011617', '9999011620', '9999011621', '9999011626', '9999011627',
              '9999011632', '9999011633', '9999011634', '9999011637', '9999011638', '9999011639',
              '9999011640', '9999011641', '9999011642', '9999011644', '9999011646', '9999011647',
              '9999011649', '9999011650', '9999011655', '9999011656', '9999011657', '9999011661',
              '9999011662', '9999011663', '9999011665', '9999011667', '9999011671', '9999011673',
              '9999011675', '9999011676', '9999011677', '9999011678', '9999011688', '9999011696',
              '9999011697', '9999011698', '9999011700', '9999011702', '9999011707', '9999011710',
              '9999011714', '9999011735', '9999011740', '9999011747', '9999011749', '9999011750',
              '9999011751', '9999011753', '9999011773', '9999011774', '9999011776', '9999011789',
              '9999011792', '9999011794', '9999011795', '9999011796', '9999011797', '9999011799',
              '9999011800', '9999011823', '9999011826', '9999011827', '9999011828', '9999011829',
              '9999011841', '9999011850', '9999011851', '9999011852', '9999011853',
              '9999011854', '9999011856', '9999011857', '9999011860', '9999011877', '9999011886',
              '9999011887', '9999011889', '9999011894', '9999011898', '9999011900', '9999011903',
              '9999011904', '9999011907', '9999011918', '9999011919', '9999011925',
              '9999011933', '9999011944', '9999011945', '9999011949', '9999011950',
              '9999011951', '9999011953', '9999011956', '9999011957', '9999011960', '9999011967',
              '9999011968', '9999011971', '9999011972', '9999011978', '9999011986', '9999011988',
              '9999011989', '9999011990', '9999011996', '9999011999', '9999012000', '9999012001',
              '9999012002', '9999012003', '9999012005', '9999012006', '9999012008', '9999012009',
              '9999012010', '9999012011', '9999012012', '9999012013', '9999012014', '9999012017',
              '9999012018', '9999012019', '9999012020', '9999012021', '9999012022', '9999012023',
              '9999012024', '9999012025', '9999012026', '9999012027', '9999012028', '9999012029',
              '9999012030', '9999012031', '9999012032', '9999012039', '9999012040', '9999012041',
              '9999012042', '9999012043', '9999012044', '9999012045', '9999012046', '9999012047'],
    userId: '',
    storeId: [club],
  };

  const analyticsPropsForBankPromos: IAnalyticProps = {
    dates: [formattedDate ? formattedDate : ''],
    memCode: ['9999011724', '9999011548', '9999011785', '9999011793', '9999011936', '9999011984', '9999011552'],
    userId: '',
    storeId: [club],
  };

  const dateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const dateTo = selectedDateTo?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const transactionPropsPending: ITransactionProps = {
    dates: [dateFrom ? dateFrom : '', dateTo ? dateTo : ''],
    memCode: ['9999011929','9999011554','9999011572','9999011914','9999011915','9999011855', '90999011855',
              '9999011553', '9999011559', '9999011563', '9999011565', '9999011571', '9999011574',
              '9999011578', '9999011579', '9999011580', '9999011581', '9999011582', '9999011593',
              '9999011595', '9999011596', '9999011599', '9999011600', '9999011601', '9999011604',
              '9999011611', '9999011617', '9999011620', '9999011621', '9999011626', '9999011627',
              '9999011632', '9999011633', '9999011634', '9999011637', '9999011638', '9999011639',
              '9999011640', '9999011641', '9999011642', '9999011644', '9999011646', '9999011647',
              '9999011649', '9999011650', '9999011655', '9999011656', '9999011657', '9999011661',
              '9999011662', '9999011663', '9999011665', '9999011667', '9999011671', '9999011673',
              '9999011675', '9999011676', '9999011677', '9999011678', '9999011688', '9999011696',
              '9999011697', '9999011698', '9999011700', '9999011702', '9999011707', '9999011710',
              '9999011714', '9999011735', '9999011740', '9999011747', '9999011749', '9999011750',
              '9999011751', '9999011753', '9999011773', '9999011774', '9999011776', '9999011789',
              '9999011792', '9999011794', '9999011795', '9999011796', '9999011797', '9999011799',
              '9999011800', '9999011823', '9999011826', '9999011827', '9999011828', '9999011829',
              '9999011838', '9999011841', '9999011850', '9999011851', '9999011852', '9999011853',
              '9999011854', '9999011856', '9999011857', '9999011860', '9999011877', '9999011886',
              '9999011887', '9999011889', '9999011894', '9999011898', '9999011900', '9999011903',
              '9999011904', '9999011907', '9999011918', '9999011919', '9999011925', '9999011552',
              '9999011933', '9999011944', '9999011945', '9999011949', '9999011950',
              '9999011951', '9999011953', '9999011956', '9999011957', '9999011960', '9999011967',
              '9999011968', '9999011971', '9999011972', '9999011978', '9999011986', '9999011988',
              '9999011989', '9999011990', '9999011996', '9999011999', '9999012000', '9999012001',
              '9999012002', '9999012003', '9999012005', '9999012006', '9999012008', '9999012009',
              '9999012010', '9999012011', '9999012012', '9999012013', '9999012014', '9999012017',
              '9999012018', '9999012019', '9999012020', '9999012021', '9999012022', '9999012023',
              '9999012024', '9999012025', '9999012026', '9999012027', '9999012028', '9999012029',
              '9999012030', '9999012031', '9999012032', '9999012039', '9999012040', '9999012041',
              '9999012042', '9999012043', '9999012044', '9999012045', '9999012046', '9999012047',
              '9999011724', '9999011548', '9999011785', '9999011793', '9999011936', '9999011984',
              '900999011855','9999011931','9999011910','9999011955','9999011537', '9999011542', '9999011546', '9999011547', '9999011549', '9999011550',],
    storeId: [club],
    statusId: 5,
  };

 
  const transactionPropsCompleted: ITransactionProps = {
    dates: [dateFrom ? dateFrom : '', dateTo ? dateTo : ''],
    memCode: ['9999011929','9999011554','9999011572','9999011914','9999011915','9999011855', '90999011855',
              '9999011553', '9999011559', '9999011563', '9999011565', '9999011571', '9999011574',
              '9999011578', '9999011579', '9999011580', '9999011581', '9999011582', '9999011593',
              '9999011595', '9999011596', '9999011599', '9999011600', '9999011601', '9999011604',
              '9999011611', '9999011617', '9999011620', '9999011621', '9999011626', '9999011627',
              '9999011632', '9999011633', '9999011634', '9999011637', '9999011638', '9999011639',
              '9999011640', '9999011641', '9999011642', '9999011644', '9999011646', '9999011647',
              '9999011649', '9999011650', '9999011655', '9999011656', '9999011657', '9999011661',
              '9999011662', '9999011663', '9999011665', '9999011667', '9999011671', '9999011673',
              '9999011675', '9999011676', '9999011677', '9999011678', '9999011688', '9999011696',
              '9999011697', '9999011698', '9999011700', '9999011702', '9999011707', '9999011710',
              '9999011714', '9999011735', '9999011740', '9999011747', '9999011749', '9999011750',
              '9999011751', '9999011753', '9999011773', '9999011774', '9999011776', '9999011789',
              '9999011792', '9999011794', '9999011795', '9999011796', '9999011797', '9999011799',
              '9999011800', '9999011823', '9999011826', '9999011827', '9999011828', '9999011829',
              '9999011838', '9999011841', '9999011850', '9999011851', '9999011852', '9999011853',
              '9999011854', '9999011856', '9999011857', '9999011860', '9999011877', '9999011886',
              '9999011887', '9999011889', '9999011894', '9999011898', '9999011900', '9999011903',
              '9999011904', '9999011907', '9999011918', '9999011919', '9999011925', '9999011552',
              '9999011933', '9999011944', '9999011945', '9999011949', '9999011950',
              '9999011951', '9999011953', '9999011956', '9999011957', '9999011960', '9999011967',
              '9999011968', '9999011971', '9999011972', '9999011978', '9999011986', '9999011988',
              '9999011989', '9999011990', '9999011996', '9999011999', '9999012000', '9999012001',
              '9999012002', '9999012003', '9999012005', '9999012006', '9999012008', '9999012009',
              '9999012010', '9999012011', '9999012012', '9999012013', '9999012014', '9999012017',
              '9999012018', '9999012019', '9999012020', '9999012021', '9999012022', '9999012023',
              '9999012024', '9999012025', '9999012026', '9999012027', '9999012028', '9999012029',
              '9999012030', '9999012031', '9999012032', '9999012039', '9999012040', '9999012041',
              '9999012042', '9999012043', '9999012044', '9999012045', '9999012046', '9999012047',
              '9999011724', '9999011548', '9999011785', '9999011793', '9999011936', '9999011984',
              '900999011855','9999011931','9999011910','9999011955','9999011537', '9999011542', '9999011546', '9999011547', '9999011549', '9999011550',],
    storeId: [club],
    statusId: 3,
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
                  width: '300px'
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
        isImage={true}
        top={0}
        left={6}
        width='22%'
        paperWidth={250}
        analyticsProps={analyticsPropsForGrabMart}
      />

      {/* Grab Food */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#00B14F'} 
        backgroundColorView = {'#009E47'}
        image={GrabFood}
        onClick={handleSubmit}
        isImage={true}
        top={0}
        left={6}
        width='25%'
        paperWidth={250}
        analyticsProps={analyticsPropsForGrabFood}
      />

      {/* Food Panda */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#D71465'} 
        backgroundColorView = {'#B31154'}
        image={FoodPanda}
        onClick={handleSubmit}
        isImage={true}
        top={0}
        left={0}
        width='36%'
        paperWidth={250}
        analyticsProps={analyticsPropsForFoodPanda}
      />

      {/* Pick A Roo */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#1CE1CF'} 
        backgroundColorView = {'#0BC7B7'}
        image={PickARoo}
        onClick={handleSubmit}
        isImage={true}
        top={2}
        left={2}
        width='22%'
        paperWidth={250}
        analyticsProps={analyticsPropsForPickARoo}
      />

      {/* Agile FS */}
      {/* <PaperComponent
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
      /> */}

      {/* Agile Merchandise */}
      {/* <PaperComponent
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
      /> */}


      {/* Metromart */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#424140'} 
        backgroundColorView = {'#2F2E2E'}
        image={Metromart}
        onClick={handleSubmit}
        isImage={true}
        top={3}
        left={6}
        width='25%'
        paperWidth={250}
        analyticsProps={analyticsPropsForMetroMart}
      />

      {/* Lazada */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#181164'} 
        backgroundColorView = {'#110C4A'}
        image={Lazada}
        onClick={handleSubmit}
        isImage={true}
        top={0}
        left={6}
        width='25%'
        paperWidth={250}
        analyticsProps={analyticsPropsForLazada}
      />

      {/* Shopee */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#F24731'} 
        backgroundColorView = {'#D73E2B'}
        image={Shopee}
        onClick={handleSubmit}
        isImage={true}
        top={6}
        left={0}
        width='25%'
        paperWidth={250}
        analyticsProps={analyticsPropsForShopee}
      />

      {/* GCash */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#007DFE'} 
        backgroundColorView = {'#0056AC'}
        image={Gcash}
        onClick={handleSubmit}
        isImage={true}
        top={6}
        left={0}
        width='25%'
        paperWidth={250}
        analyticsProps={analyticsPropsForGCash}
      />

      {/* Walk-In */}
      <PaperComponent
        color = {'#1C2C5A'}
        backgroundColor = {'#D9D9D9'} 
        backgroundColorView = {'#B8B8B8'}
        image={"Walk-In"}
        onClick={handleSubmit}
        isImage={false}
        top={3}
        left={10}
        width=''
        paperWidth={250}
        analyticsProps={analyticsPropsForWalkIn}
      />

      {/* Employee */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#1C2C5A'} 
        backgroundColorView = {'#17244A'}
        image={"Employee"}
        onClick={handleSubmit}
        isImage={false}
        top={3}
        left={10}
        width=''
        paperWidth={250}
        analyticsProps={analyticsPropsForEmployee}
      />

      {/* Volume Shopper */}
      <PaperComponent
        color = {'#1C2C5A'}
        backgroundColor = {'#D9D9D9'} 
        backgroundColorView = {'#B8B8B8'}
        image={"Volume Shopper"}
        onClick={handleSubmit}
        isImage={false}
        top={3}
        left={10}
        width='22%'
        paperWidth={250}
        analyticsProps={analyticsPropsForVolumeShopper}
      />

      {/* Bank Promos */}
      <PaperComponent
        color = {'#FFFFFF'}
        backgroundColor = {'#1C2C5A'} 
        backgroundColorView = {'#17244A'}
        image={"Bank Promos"}
        onClick={handleSubmit}
        isImage={false}
        top={3}
        left={10}
        width='22%'
        paperWidth={250}
        analyticsProps={analyticsPropsForBankPromos}
      />
    </Box>
    <Divider 
      sx={{ 
        marginLeft: '16px', 
        marginRight: '16px',
        border: "1px solid #BBBBBB",
      }}>
    </Divider>
    <Grid container direction="row" alignItems="center" sx={{  display: 'flex', padding: '10px 16px 0 16px' }} >
      <Grid item>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            inputFormat="dddd, MMMM DD, YYYY"
            value={selectedDateFrom}
            onChange={handleChangeDateFrom}
            disableMaskedInput
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
                    width: '300px',
                  },
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={0.4}>
        <Typography variant="h6" sx={{ color: '#1C2C5A', marginLeft: '6px' }}>
          To:
        </Typography>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={8}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            inputFormat="dddd, MMMM DD, YYYY"
            value={selectedDateTo}
            onChange={handleChangeDateTo}
            disableMaskedInput
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
                    width: '300px',
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
              color='#404962' 
              bgColor='#FFE5A2' 
              borderColor='2px solid #E8D092' 
              transactionProps={transactionPropsPending}
            />

            <StatusPaper 
              title={'Completed'} 
              color='#404962' 
              bgColor='#D4E5F5' 
              borderColor='2px solid #BBCBDA' 
              transactionProps={transactionPropsCompleted}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  </CustomScrollbarBox>
  )
}

export default Dashboard