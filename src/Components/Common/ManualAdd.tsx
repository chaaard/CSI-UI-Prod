import { Alert, Autocomplete, Box,  Checkbox,  Divider,  Fade, FormControl, FormLabel, Grid, IconButton, MenuItem, Pagination,  Paper,  Radio,  RadioGroup,  Snackbar, Switch, Table, TableBody, TableCell, TableHead, TableRow, TextField, TextFieldProps, Typography, styled, } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import IAnalyticsToDeleteProps from '../../Pages/Common/Interface/IAnalyticsToDeleteProps';
import dayjs, { Dayjs } from 'dayjs';
import ILocations from '../../Pages/Common/Interface/ILocations';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded';
import IAnalyticsToAddProps from '../../Pages/Common/Interface/Analytics/IAnalyticsToAddProps';
import FormControlLabel from '@mui/material/FormControlLabel';

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
  borderRadius: theme.shape.borderRadius, // Ensure the button has the default shape
}));

const customerCodes: ICustomerCodes[] = [
  { CustomerId: ["9999011929"], CustomerName: "Grab Food" },
  { CustomerId: ["9999011955"], CustomerName: "Grab Mart" },
  { CustomerId: ["9999011931"], CustomerName: "Pick A Roo Merchandise" },
  { CustomerId: ["9999011935"], CustomerName: "Pick A Roo FS" },
  { CustomerId: ["9999011838"], CustomerName: "Food Panda" },
  { CustomerId: ["9999011855"], CustomerName: "MetroMart" },
  { CustomerId: ["9999011926"], CustomerName: "GCash" },
];

interface ICustomerCodes
{
  CustomerId: string[],
  CustomerName: string,
}

interface IUpdateMerchant
{
  Id: number,
  CustomerId: string,
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
  const [selectedProoflist, setSelectedProoflist] = useState<string>(); 
  const [selectedLocation, setSelectedLocation] = useState<number>(201);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenRevert, setIsModalOpenRevert] = useState<boolean>(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [pageCount, setPageCount] = useState<number>(0); 
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 20; 
  
  
  //** Form Input */
  const [prooflistChecked, setProoflistChecked] = useState(''); 
  const [stateAnalytics, setStateAnalytics] = useState<IAnalyticsToAddProps>({
    merchant: '9999011929',
    club: 0,
    transactionDate: Date(),
    membershipNo: '',
    cashierNo: '',
    registerNo: '',
    transactionNo: '',
    orderNo: '',
    qty: 0,
    amount: 0,
    subTotal: 0,
    isUpload: false,
    deleteFlag: false,
  });



  useEffect(() => {
    document.title = 'CSI | Analytics';

    stateAnalytics.merchant = 'qwwqe';
  

  }, []);

  // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleChangeMembership = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setStateAnalytics(prevState => ({
      ...prevState,
      membershipNo: sanitizedValue
    }));

  };

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChangeLocation = (value: any) => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelectedLocation(sanitizedValue);
  };

   
   const handleProoflistChange = (event: any) => {
    setProoflistChecked(event.target.value); // Update state with the selected value
  };

  const handleCloseDelete = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCloseUpdate = useCallback(() => {
    setIsModalOpenUpdate(false);
  }, []);

  const handleCloseRevert = useCallback(() => {
    setIsModalOpenRevert(false);
  }, []);

  useEffect(() => {
    const defaultDate = dayjs();
    setSelectedDateFrom(defaultDate);
  }, []);

  const handleDeleteModalClick = (id: number) => {
      setIsModalOpen(true);
      setId(id);
  };

  const handleUpdateModalClick = (id: number) => {
    setIsModalOpenUpdate(true);
    setId(id);
  };

  const handleRevertModalClick = (id: number) => {
    setIsModalOpenRevert(true);
    setId(id);
  };


  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');


  //** Crud Analytics */
  const createAnalytics = useCallback(async (analyticsToAddProps: IAnalyticsToAddProps ) => {
    try {
      const data: IAnalyticsToAddProps = analyticsToAddProps;
      const analyticsAdd: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/CreateAnalytics`,
        data: data,
      };
  
      // await axios(analyticsAdd);
      const response = await axios(analyticsAdd);

      // setAnalytics(response.data.Item1);
      console.log(response.data);
      // setPageCount(response.data.Item2);

    } catch (error) {
      console.error("Error inserting data:", error);
    } 
  }, [REACT_APP_API_ENDPOINT]);

  const fetchAnalytics = useCallback(async (date: string | null | undefined, code: string, storeid: number, jo: string, page: number, itemsPerPage: number ) => {
    try {
      const anaylticsParam: IAnalyticsToDeleteProps = {
        date: date?.toString() ? date?.toString() : '',
        memCode: code,
        storeId: storeid,
        jo: jo,
        PageNumber: page,
        PageSize: itemsPerPage
      };
      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAnalyticsToDelete`,
        data: anaylticsParam,
      };
  
      const response = await axios(getAnalytics);
      // setAnalytics(response.data.Item1);
      console.log(response.data.Item1);
      setPageCount(response.data.Item2);
    } catch (error) {
      console.error("Error fetching data:", error);
    } 
  }, [REACT_APP_API_ENDPOINT]);


  useEffect(() => {
    if(formattedDateFrom && stateAnalytics.merchant && selectedLocation && stateAnalytics.membershipNo)
    {
      // setAnalytics([]);
      setPageCount(0);
      fetchAnalytics(formattedDateFrom, stateAnalytics.merchant, selectedLocation, stateAnalytics.membershipNo, page, itemsPerPage);
    }
  }, [REACT_APP_API_ENDPOINT, formattedDateFrom, stateAnalytics.merchant, selectedLocation, stateAnalytics.membershipNo, fetchAnalytics]);

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

  const handleDeleteClick = () => {
    try {
      const generateInvoice: AxiosRequestConfig = {
        method: 'PUT',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/DeleteAnalytics?id=${id}`,
      };

      axios(generateInvoice)
      .then((result) => {
        if(result.data === true)
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Successfully deleted!');
          setIsModalOpen(false); 
          fetchAnalytics(formattedDateFrom, stateAnalytics.merchant, selectedLocation, stateAnalytics.membershipNo, page, itemsPerPage);
        }
        else
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error deleting analytic');
          setIsModalOpen(false);
        }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error deleting analytic');
        setIsModalOpen(false);
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error deleting invoice');
        setIsModalOpen(false);
    } 
  };

  const handleRevertClick = () => {
    try {
      const generateInvoice: AxiosRequestConfig = {
        method: 'PUT',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/RevertAnalytics?id=${id}`,
      };

      axios(generateInvoice)
      .then((result) => {
        if(result.data === true)
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Successfully reverted!');
          setIsModalOpenRevert(false); 
          fetchAnalytics(formattedDateFrom, stateAnalytics.merchant, selectedLocation, stateAnalytics.membershipNo, page, itemsPerPage);
        }
        else
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error reverting analytic');
          setIsModalOpenRevert(false);
        }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error reverting analytic');
        setIsModalOpenRevert(false);
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error reverting invoice');
        setIsModalOpenRevert(false);
    } 
  };

  const handleUpdateClick = () => {
    try {

      var update: IUpdateMerchant = {
        Id: id,
        CustomerId: stateAnalytics.merchant
      }

      const generateInvoice: AxiosRequestConfig = {
        method: 'PUT',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/UpdateAnalytics`,
        data: update,
      };

      axios(generateInvoice)
      .then((result) => {
        if(result.data === true)
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Successfully updated!');
          setIsModalOpenUpdate(false); 
          fetchAnalytics(formattedDateFrom, stateAnalytics.merchant, selectedLocation, stateAnalytics.membershipNo, page, itemsPerPage);
        }
        else
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error updating analytic');
          setIsModalOpenUpdate(false);
        }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error updating analytic');
        setIsModalOpenUpdate(false);
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error updating invoice');
        setIsModalOpenUpdate(false);
    } 
  };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const merchantObject = stateAnalytics.merchant[0]; // Accessing the first (and only) element of the array ['9999011929'] bad request when using array.
      const merchantString = merchantObject.replace(/'/g, ''); // Removing single quotes 9999011929
      console.log(merchantString);
  
      const analyticsToAddProps: IAnalyticsToAddProps = {
        merchant: merchantString,
        club: selectedLocation,
        transactionDate: selectedDateFrom!.toString(),
        membershipNo: stateAnalytics.membershipNo,
        cashierNo: stateAnalytics.cashierNo,
        registerNo: stateAnalytics.registerNo,
        transactionNo:  stateAnalytics.transactionNo,
        orderNo: stateAnalytics.orderNo,
        qty: stateAnalytics.qty,
        amount: stateAnalytics.amount,
        subTotal: stateAnalytics.subTotal,
        isUpload: prooflistChecked === "Yes" ?? false,
        deleteFlag: false
      };
  
      // Call createAnalytics with the form data
      await createAnalytics(analyticsToAddProps);
      setStateAnalytics(prevState => ({
        ...prevState,
        merchant: '',
        transactionNo: '',
        membershipNo: '',
        cashierNo: '',
        registerNo: '',
        orderNo: '',
        qty: 0,
        amount: 0,
        subTotal: 0,
      }));

      setProoflistChecked('');

      setSnackbarSeverity('success');
      setMessage('Analytics data added successfully!');
      setIsSnackbarOpen(true);

    };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
      <form onSubmit={handleSubmit}>
        <Paper elevation={3} sx={{ padding: '20px', maxWidth: '1200px', borderRadius: '15px' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#1C2C5A', }}>
            Add Analytics
          </Typography>
          <Divider sx={{ marginBottom: '20px' }} />
          <Grid container spacing={2} >
            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Merchant"
                required
                select
                value={stateAnalytics.merchant}// Default to an empty string if undefined
                onChange={(e) =>  setStateAnalytics(prevState => ({
                  ...prevState,
                  merchant: e.target.value
                }))}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '360px',
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
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Club"
                required
                select
                value={selectedLocation}// Default to an empty string if undefined
                onChange={(e) => handleChangeLocation(e.target.value)}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '360px',
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
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  inputFormat="dddd, MMMM DD, YYYY"
                  label="Transaction Date" 
                  value={selectedDateFrom}
                  onChange={handleChangeDateFrom}
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
                          width: '295px',
                          fontSize: '14px',
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Membership No"
                required
                value={stateAnalytics.membershipNo}
                onChange={(e) => handleChangeMembership(e.target.value)}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '360px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              >
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Cashier No"
                required
                value={stateAnalytics.cashierNo}
                onChange={(e) =>  setStateAnalytics(prevState => ({
                  ...prevState,
                  cashierNo: e.target.value
                }))}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '360px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              >
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Register No"
                required
                value={stateAnalytics.registerNo}
                onChange={(e) =>  setStateAnalytics(prevState => ({
                  ...prevState,
                  registerNo: e.target.value
                }))}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '360px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              >
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Transaction No"
                required
                value={stateAnalytics.transactionNo}
                onChange={(e) =>  setStateAnalytics(prevState => ({
                  ...prevState,
                  transactionNo: e.target.value
                }))}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '360px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              >
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Order No"
                required
                value={stateAnalytics.orderNo}
                onChange={(e) =>  setStateAnalytics(prevState => ({
                  ...prevState,
                  orderNo: e.target.value
                }))}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '360px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              >
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Qty"
                required
                value={stateAnalytics.qty}
                onChange={(e) =>  setStateAnalytics(prevState => ({
                  ...prevState,
                  qty: Number(e.target.value)
                }))}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '360px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              >
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Amount"
                required
                value={stateAnalytics.amount}
                onChange={(e) =>  setStateAnalytics(prevState => ({
                  ...prevState,
                  amount: Number(e.target.value)
                }))}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '360px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              >
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="SubTotal"
                required
                value={stateAnalytics.subTotal}
                onChange={(e) =>  setStateAnalytics(prevState => ({
                  ...prevState,
                  subTotal: Number(e.target.value)
                }))}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '360px',
                    fontSize: '14px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              >
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
      
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">Uploaded Prooflist *</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={prooflistChecked} // Set the selected value to control the radio group
                  onChange={handleProoflistChange} // Handle change event
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>

            </Grid>
          </Grid>
          <Divider sx={{ margin: '20px 0' }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <BootstrapButton type="submit"
              sx={{
                color: "white",
                fontSize: "15px",
                backgroundColor: "#1C3766",
                width: "12%",
                borderRadius: "20px",
                fontFamily: 'Inter',
                fontWeight: '900',
                marginRight: '-10px'
              }}
            >
              <LibraryAddRoundedIcon sx={{ marginRight: '5px' }} />
              <Typography>Save</Typography>
            </BootstrapButton>
          </Box>
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