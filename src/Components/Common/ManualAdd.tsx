import { Alert, Autocomplete, Box,  Divider,  Fade, Grid, IconButton, MenuItem, Pagination,  Paper,  Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, TextFieldProps, Typography, styled, } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import IAnalytics from '../../Pages/Common/Interface/IAnalytics';
import axios, { AxiosRequestConfig } from 'axios';
import IAnalyticsToDeleteProps from '../../Pages/Common/Interface/IAnalyticsToDeleteProps';
import dayjs, { Dayjs } from 'dayjs';
import ILocations from '../../Pages/Common/Interface/ILocations';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LibraryAddRoundedIcon from '@mui/icons-material/LibraryAddRounded';

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

const customerCodesForDp = [
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
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const [selected, setSelected] = useState<string>('9999011929');
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [jo, setJo] = useState<string>('');
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
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
  const [merchant, setMerchant] = useState<string>('');
  const itemsPerPage = 20; 

  useEffect(() => {
    document.title = 'CSI | Analytics';
  }, []);

  const handleChange = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelected(sanitizedValue);
  };

  const handleChangeMerchant = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setMerchant(sanitizedValue);
  };

  // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleChangeJo = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setJo(sanitizedValue);
  };

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChangeLocation = (value: any) => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelectedLocation(sanitizedValue);
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
      setAnalytics(response.data.Item1);
      console.log(response.data.Item1);
      setPageCount(response.data.Item2);
    } catch (error) {
      console.error("Error fetching data:", error);
    } 
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    if(formattedDateFrom && selected && selectedLocation && jo)
    {
      setAnalytics([]);
      setPageCount(0);
      fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, page, itemsPerPage);
    }
  }, [REACT_APP_API_ENDPOINT, formattedDateFrom, selected, selectedLocation, jo, fetchAnalytics]);

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
          fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, page, itemsPerPage);
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
          fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, page, itemsPerPage);
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
        CustomerId: merchant
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
          fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, page, itemsPerPage);
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

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
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
              value={selected}// Default to an empty string if undefined
              onChange={(e) => handleChange(e.target.value)}
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
              value={jo}
              onChange={(e) => handleChangeJo(e.target.value)}
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
              value={jo}
              onChange={(e) => handleChangeJo(e.target.value)}
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
              value={jo}
              onChange={(e) => handleChangeJo(e.target.value)}
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
              value={jo}
              onChange={(e) => handleChangeJo(e.target.value)}
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
              value={jo}
              onChange={(e) => handleChangeJo(e.target.value)}
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
              value={jo}
              onChange={(e) => handleChangeJo(e.target.value)}
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
              value={jo}
              onChange={(e) => handleChangeJo(e.target.value)}
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
              value={jo}
              onChange={(e) => handleChangeJo(e.target.value)}
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
          {/* <Grid item xs={12}>
            <BootstrapButton
              sx={{
                color: "white",
                fontSize: "15px",
                backgroundColor: "#1C3766",
                width: "30%",
                borderRadius: "20px",
                fontFamily: 'Inter',
                fontWeight: '900',
              }}
              //onClick={handleManualReloadClick}
            >
              <LibraryAddRoundedIcon sx={{marginRight: '5px'}} />
              <Typography>
                Save
              </Typography>
            </BootstrapButton>
          </Grid> */}
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
    </Box>
  )
}

export default ManualAdd