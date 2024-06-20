import { Alert, Autocomplete, Box,  Divider,  Fade, Grid, IconButton, MenuItem, Pagination,  Paper,  Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, TextFieldProps, Typography, styled, } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ModalComponent from '../../../../Components/Common/ModalComponent';
import IAnalytics from '../../../Common/Interface/IAnalytics';
import ILocations from '../../../Common/Interface/ILocations';
import IAnalyticsToDeleteProps from '../../../Common/Interface/IAnalyticsToDeleteProps';
import IRefreshAnalytics from '../../../Common/Interface/IRefreshAnalytics';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "15px",
  fontWeight: '900',
  color: '#1C2C5A',
  textAlign: 'center'
}));

const StyledTableCellSmall = styled(TableCell)(({ theme }) => ({
  fontSize: "12px",
  padding: "1px",
  color: '#1C2C5A',
  textAlign: 'center'
}));

const CustomScrollbarBox = styled(Box)`
    overflow-y: auto;
    height: calc(100vh - 190px);

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

const customerCodes = [
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
  fontSize: '15px',
  borderRadius: '25px',
  border:  severity === 'success' ? '1px solid #4E813D' : '1px solid #9B6B6B',
  backgroundColor: severity === 'success' ? '#E7FFDF' : '#FFC0C0',
}));

const UndoSubmit = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const [selected, setSelected] = useState<string>('9999011929');
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [selectedLocation, setSelectedLocation] = useState<number>(201);
  const [isModalOpenUndo, setIsModalOpenUndo] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [pageCount, setPageCount] = useState<number>(0); 
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 20; 

  useEffect(() => {
    document.title = 'Maintenance | Undo Submit Analytics';
  }, []);

  const handleChange = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelected(sanitizedValue);
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

  const handleChangeLocation = (value: any) => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelectedLocation(sanitizedValue);
  };

  const handleCloseUndo = useCallback(() => {
    setIsModalOpenUndo(false);
  }, []);

  const handleUndoModalClick = () => {
    setIsModalOpenUndo(true);
  };

  useEffect(() => {
    const defaultDate = dayjs();
    setSelectedDateFrom(defaultDate);
  }, []);

  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');

  const fetchAnalytics = useCallback(async (date: string | null | undefined, code: string, storeid: number, page: number, itemsPerPage: number  ) => {
    try {
      const anaylticsParam: IAnalyticsToDeleteProps = {
        date: date?.toString() ? date?.toString() : '',
        memCode: code,
        storeId: storeid,
        PageNumber: page,
        PageSize: itemsPerPage
      };
      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAnalyticsToUndoSubmit`,
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
    if(formattedDateFrom && selected && selectedLocation)
    {
      setAnalytics([]);
      setPageCount(0);
      fetchAnalytics(formattedDateFrom, selected, selectedLocation, page, itemsPerPage);
    }
  }, [REACT_APP_API_ENDPOINT, formattedDateFrom, selected, selectedLocation, fetchAnalytics]);

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

  const handleUndoClick = () => {
    try {

      if(!selectedDateFrom || !selected || !selectedLocation)
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Please check required fields');
        setIsModalOpenUndo(false);
        return 
      }

      const formattedDate = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: [selected],
        userId: '',
        storeId: [selectedLocation], 
      }

      const submitAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/UndoSubmitAnalytics`,
        data: updatedParam,
      };

      axios(submitAnalytics)
      .then(async (result) => {
          if(result.data === true) 
          {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setMessage('Analytics Successfully Revert');
            setIsModalOpenUndo(false);
          }
          else
          {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Error reverting analytics. Please try again!');
            setIsModalOpenUndo(false);
          }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error reverting analytics');
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error reverting analytics');
    } 
  }

  return (
    <Box
      sx={{
        marginTop: '16px',
        marginLeft: '20px',
        marginRight: '20px',
        flexGrow: 1,
      }}
    >
      <Paper elevation={3} sx={{ padding: '20px', maxWidth: '100%', borderRadius: '15px', height: '750px' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#1C2C5A', }}>
          Undo Submit Analytics
        </Typography>
        <Divider sx={{ marginBottom: '20px' }} />
        <Grid container direction="row" alignItems="center" sx={{ padding: '8px 16px 0 -9px' }} >
          <Grid item xs={11.1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="dddd, MMMM DD, YYYY"
                value={selectedDateFrom}
                onChange={handleChangeDateFrom}
                label="Transaction Date"
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
                        width: '340px',
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
            <TextField
              variant="outlined"
              size="small"
              type="text"
              required
              label="Merchant"
              select
              value={selected}
              onChange={(e) => handleChange(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '40px',
                  backgroundColor: '#FFFFFF',
                  height: '40px',
                  width: '400px',
                  fontSize: '15px',
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
          <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
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
                  width: '400px',
                  fontSize: '15px',
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
          <Grid item xs={3.1} sx={{ paddingTop: '15px' }}>
            <BootstrapButton
              sx={{
                color: "white",
                fontSize: "16px",
                backgroundColor: "#1C3766",
                width: "100%",
                borderRadius: "20px",
                fontFamily: 'Inter',
                fontWeight: '900',
              }}
              onClick={handleUndoModalClick}
            >
              <UndoRoundedIcon sx={{marginRight: '5px'}} />
              <Typography>
                Undo Submit
              </Typography>
            </BootstrapButton>
          </Grid>
        </Grid>
      <Divider sx={{ marginTop: '20px' }} />
      <CustomScrollbarBox component={Paper}
        sx={{
          height: '390px',
          position: 'relative',
          paddingTop: '10px',
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px',
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
          boxShadow: 'none',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Customer Name</StyledTableCell>
              <StyledTableCell>Location Name</StyledTableCell>
              <StyledTableCell>Transaction Date</StyledTableCell>
              <StyledTableCell>Membership No</StyledTableCell>
              <StyledTableCell>Cashier No</StyledTableCell>
              <StyledTableCell>Register No</StyledTableCell>
              <StyledTableCell>Transaction No</StyledTableCell>
              <StyledTableCell>Order No</StyledTableCell>
              <StyledTableCell>Qty</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
              <StyledTableCell>SubTotal</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              analytics.length === 0
                ?
                <TableRow hover>
                  <TableCell align="center" colSpan={15} sx={{ color: '#1C2C5A' }}>No Data</TableCell>
                </TableRow>
                :
                analytics.map((item: IAnalytics) => {
                  return (
                    <TableRow hover key={item.Id}>
                      <StyledTableCellSmall>{item.CustomerName}</StyledTableCellSmall>
                      <StyledTableCellSmall>{item.LocationName}</StyledTableCellSmall>
                      <StyledTableCellSmall style={{ textAlign: 'center',  }}> 
                        {
                          item.TransactionDate !== null
                          ? new Date(item.TransactionDate ?? '').toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short', // or 'long' for full month name
                              day: 'numeric',
                            })
                          : ''
                        }
                      </StyledTableCellSmall>
                      <StyledTableCellSmall>{item.MembershipNo}</StyledTableCellSmall>
                      <StyledTableCellSmall>{item.CashierNo}</StyledTableCellSmall>
                      <StyledTableCellSmall>{item.RegisterNo}</StyledTableCellSmall>
                      <StyledTableCellSmall>{item.TransactionNo}</StyledTableCellSmall>
                      <StyledTableCellSmall>{item.OrderNo}</StyledTableCellSmall>
                      <StyledTableCellSmall>{item.Qty}</StyledTableCellSmall>
                      <StyledTableCellSmall>
                        {
                          item.Amount != null
                          ? (item.Amount >= 1000
                            ? item.Amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : item.Amount.toFixed(2))
                          : '0.00'
                        }
                      </StyledTableCellSmall>
                      <StyledTableCellSmall>
                      {
                          item.SubTotal != null
                          ? (item.SubTotal >= 1000
                            ? item.SubTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : item.SubTotal.toFixed(2))
                          : '0.00'
                        }
                      </StyledTableCellSmall>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </CustomScrollbarBox>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
        <Pagination
          variant="outlined"
          shape="rounded"
          count={pageCount}
          page={page}
          onChange={(event, value) => {
            setPage(value);
            if(formattedDateFrom != null)
            {
              fetchAnalytics(formattedDateFrom, selected, selectedLocation, value, itemsPerPage);
            }
          }}
        />
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
      <ModalComponent
        title='Undo Submit Analytics'
        onClose={handleCloseUndo}
        buttonName='Undo'
        open={isModalOpenUndo}
        onSave={handleUndoClick}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={8}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '20px',
                }}>
                <Typography sx={{ fontSize: '20px', textAlign: 'center', marginRight: '-170px' }}>
                  Are you sure you want to undo these analytics?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        } 
      />
    </Box>
  )
}

export default UndoSubmit