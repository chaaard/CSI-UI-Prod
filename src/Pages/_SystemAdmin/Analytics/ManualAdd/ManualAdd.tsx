import { Alert, Box, Divider,  Fade, Grid, IconButton, MenuItem,  Paper,  Snackbar, TextField, TextFieldProps, Typography, styled, } from '@mui/material';
import {  useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import ILocations from '../../../Common/Interface/ILocations';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded';
import IAnalyticsToAddProps from './Interface/IAnalyticsToAddProps';
import ICustomerDropdown from '../../../Common/Interface/ICustomerDropdown';
import CustomerDropdown from '../../../../Components/Common/CustomerDropdown';

const BootstrapButton = styled(IconButton)(({ theme }) => ({
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
  backgroundColor: '#1C3766',
  borderColor: '#1C3766',
  color: 'white',
  boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
  '&:hover': {
    backgroundColor: '#15294D',
    borderColor: '#15294D',
    boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
  },
  borderRadius: theme.shape.borderRadius, 
}));

const customerCodes: ICustomerCodes[] = [
  { CustomerId: "9999011929", CustomerName: "Grab Food" },
  { CustomerId: "9999011955", CustomerName: "Grab Mart" },
  { CustomerId: "9999011931", CustomerName: "Pick A Roo Merchandise" },
  { CustomerId: "9999011935", CustomerName: "Pick A Roo FS" },
  { CustomerId: "9999011838", CustomerName: "Food Panda" },
  { CustomerId: "9999011855", CustomerName: "MetroMart" },
  { CustomerId: "9999011926", CustomerName: "GCash" },
];

interface ICustomerCodes
{
  CustomerId: string,
  CustomerName: string,
}

// Define custom styles for white alerts
const WhiteAlert = styled(Alert)(({ severity }) => ({
  color: '#1C2C5A',
  fontFamily: 'Inter',
  fontWeight: '700',
  fontSize: '14px',
  borderRadius: '25px',
  border:  severity === 'success' ? '1px solid #4E813D' : '1px solid #9B6B6B',
  backgroundColor: severity === 'success' ? '#E7FFDF' : '#FFC0C0',
}));

const ManualAdd = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [stateAnalytics, setStateAnalytics] = useState<IAnalyticsToAddProps>({
    CustomerId: '9999011929',
    LocationId: 201,
    TransactionDate:  dayjs().toString(),
    MembershipNo: '',
    CashierNo: '',
    RegisterNo: '',
    TransactionNo: '',
    OrderNo: '',
    Qty: 0,
    Amount: 0,
    Subtotal: 0,
    UserId: '',
    AnalyticsParamsDto: {
      dates: [],
      memCode: [],
      userId: '',
      storeId: [],
      status: [],
      isView: false,
      action: '',
      fileName: '',
      remarks: '',
    }
  });
  const getId = window.localStorage.getItem('Id');
  const getClub = window.localStorage.getItem('club');
  const [selected, setSelected] = useState<string[]>([] as string[]);

  useEffect(() => {
    document.title = 'Maintenance | Manual Add Analytics';
  }, []);

  let club =  0;
  if(getClub !== null)
  {
    club = parseInt(getClub, 10);
  }

  let Id = "";
  if(getId !== null)
  {
    Id = getId;
  }

  useEffect(() => {
    setStateAnalytics({
      ...stateAnalytics,
      CustomerId: selected.toString(),
    });
  }, [selected]);

  
  useEffect(() => {
    const defaultDate = dayjs();
    setSelectedDateFrom(defaultDate);
  }, []);

  // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      setStateAnalytics({
      ...stateAnalytics,
      [name]: value,
      UserId: Id,
      TransactionDate: formattedDateFrom ?? '',
      AnalyticsParamsDto: {
        userId: Id,
        action: 'Manual Add Analytics',
        storeId: [club],
      },
    });
  };
  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDateFrom(date);
    setStateAnalytics({
      ...stateAnalytics,
      TransactionDate: formattedDateFrom ?? '',
    });
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations: AxiosRequestConfig = {
          method: 'POST',
          url: `${REACT_APP_API_ENDPOINT}/Analytics/GetLocations`
        };
    
        axios(locations)
          .then(async (result) => {
            var locations = result.data as ILocations[]
            setLocations(locations)
          })
          .catch(() => {
          })
      } catch (error) {
      } 
    };
  
    fetchLocations();
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    const defaultDate = dayjs();
    setSelectedDateFrom(defaultDate);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const analyticsAdd: AxiosRequestConfig = {
      method: 'POST',
      url: `${REACT_APP_API_ENDPOINT}/Analytics/CreateAnalytics`,
      data: stateAnalytics,
    };

    try {
      await axios(analyticsAdd)
      .then((result) => {
        if(result.data === 'Successfully Created')
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Successfully Added!'); 
          setStateAnalytics({
            CustomerId: '9999011929',
            LocationId: 201,
            TransactionDate:  dayjs().toString(),
            MembershipNo: '',
            CashierNo: '',
            RegisterNo: '',
            TransactionNo: '',
            OrderNo: '',
            Qty: 0,
            Amount: 0,
            Subtotal: 0,
            UserId: '',
            AnalyticsParamsDto: {
              dates: [],
              memCode: [],
              userId: '',
              storeId: [],
              status: [],
              isView: false,
              action: '',
              fileName: '',
              remarks: '',
            }
          })
        }
        else
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error adding analytic');
          setStateAnalytics({
            CustomerId: '9999011929',
            LocationId: 201,
            TransactionDate: dayjs().toString(),
            MembershipNo: '',
            CashierNo: '',
            RegisterNo: '',
            TransactionNo: '',
            OrderNo: '',
            Qty: 0,
            Amount: 0,
            Subtotal: 0,
            UserId: '',
            AnalyticsParamsDto: {
              dates: [],
              memCode: [],
              userId: '',
              storeId: [],
              status: [],
              isView: false,
              action: '',
              fileName: '',
              remarks: '',
            }
          })
        }
      })
    } catch (error) {
      console.error('Error saving data', error);
      setIsSnackbarOpen(true);
      setSnackbarSeverity('error');
      setMessage('Error adding analytic');
      setStateAnalytics({
        CustomerId: '9999011929',
        LocationId: 201,
        TransactionDate: dayjs().toString(),
        MembershipNo: '',
        CashierNo: '',
        RegisterNo: '',
        TransactionNo: '',
        OrderNo: '',
        Qty: 0,
        Amount: 0,
        Subtotal: 0,
        UserId: '',
        AnalyticsParamsDto: {
          dates: [],
          memCode: [],
          userId: '',
          storeId: [],
          status: [],
          isView: false,
          action: '',
          fileName: '',
          remarks: '',
        }
      })
    }
  };

  return (
    <Box
      sx={{
        marginTop: '16px',
        marginLeft: '20px',
        marginRight: '20px',
        flexGrow: 1,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Paper elevation={3} sx={{ padding: '20px', maxWidth: '100%', borderRadius: '15px', height: '750px' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#1C2C5A', }}>
            Add Analytics
          </Typography>
          <Divider sx={{ marginBottom: '20px' }} />
          <Grid container spacing={2} >
            <Grid item xs={12} md={3.2}>
              <CustomerDropdown setSelected={setSelected}  selection='single' byMerchant={true} isAllVisible={false}/>
              {/* <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Merchant"
                name="CustomerId"
                required
                select
                value={stateAnalytics.CustomerId}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '400px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              >
                {customerCodes.map((item: ICustomerCodes, index: number) => (
                  <MenuItem key={`${item.CustomerId}-${index}`} value={item.CustomerId}>
                    {item.CustomerName}
                  </MenuItem>
                ))}
              </TextField> */}
            </Grid>
            <Grid item xs={12} md={3.2}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Club"
                name="LocationId"
                required
                select
                value={stateAnalytics.LocationId}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '400px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              >
                {locations.map((item: ILocations) => (
                  <MenuItem key={item.Id} value={item.LocationCode}>
                    {item.LocationCode + ' - ' + item.LocationName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3.2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  inputFormat="dddd, MMMM DD, YYYY"
                  label="Transaction Date"
                  value={selectedDateFrom}
                  onChange={handleDateChange}
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
                          width: '335px',
                          fontSize: '14px',
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3.2}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Membership No"
                name="MembershipNo"
                required
                value={stateAnalytics.MembershipNo}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '400px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3.2}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Cashier No"
                name="CashierNo"
                required
                value={stateAnalytics.CashierNo}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '400px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3.2}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Register No"
                name="RegisterNo"
                required
                value={stateAnalytics.RegisterNo}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '400px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3.2}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Transaction No"
                name="TransactionNo"
                required
                value={stateAnalytics.TransactionNo}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '400px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3.2}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Order No"
                name="OrderNo"
                required
                value={stateAnalytics.OrderNo}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '400px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3.2}>
              <TextField
                variant="outlined"
                size="small"
                type="number"
                label="Qty"
                name="Qty"
                required
                value={stateAnalytics.Qty}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '400px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3.2}>
              <TextField
                variant="outlined"
                size="small"
                type="number"
                label="Amount"
                name="Amount"
                required
                value={stateAnalytics.Amount}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '400px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                variant="outlined"
                size="small"
                type="number"
                label="Subtotal"
                name="Subtotal"
                required
                value={stateAnalytics.Subtotal}
                onChange={handleChange}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '400px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3.1} sx={{ paddingTop: '15px' }}>
              <BootstrapButton type="submit"
                sx={{
                  color: "white",
                  fontSize: "15px",
                  backgroundColor: "#1C3766",
                  width: "90%",
                  borderRadius: "20px",
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  marginRight: '-10px'
                }}
              >
                <LibraryAddRoundedIcon sx={{ marginRight: '5px' }} />
                <Typography>Save</Typography>
              </BootstrapButton>
            </Grid>
          </Grid>
        </Paper>
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

      </form>
    </Box>
  )
}

export default ManualAdd