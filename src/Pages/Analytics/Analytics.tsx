import { Alert, Autocomplete, Box, Chip, Fade, Grid, IconButton, MenuItem, OutlinedInput, Pagination, Select, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, TextFieldProps, Typography, styled, tableCellClasses } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import IAnalytics from '../Common/Interface/IAnalytics';
import axios, { AxiosRequestConfig } from 'axios';
import IAnalyticsToDeleteProps from '../Common/Interface/IAnalyticsToDeleteProps';
import dayjs, { Dayjs } from 'dayjs';
import ILocations from '../Common/Interface/ILocations';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { NumberLiteralType } from 'typescript';
import ModalComponent from '../../Components/Common/ModalComponent';
import { useAsyncError } from 'react-router-dom';
import CustomerCode from '../CustomerCode/CustomerCode';

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

const BootstrapButton = styled(IconButton)(() => ({
  textTransform: 'none',
  fontSize: 12, 
  lineHeight: 1.5,
  color: '#1C2C5A',
  fontWeight: '900',
  fontFamily: 'Inter',
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
  fontSize: '15px',
  borderRadius: '25px',
  border:  severity === 'success' ? '1px solid #4E813D' : '1px solid #9B6B6B',
  backgroundColor: severity === 'success' ? '#E7FFDF' : '#FFC0C0',
}));

const Analytics = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string>('9999011929');
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [jo, setJo] = useState<string>('');
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [selectedLocation, setSelectedLocation] = useState<number>(201);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');

  const fetchAnalytics = useCallback(async (date: string, code: string, storeid: number, jo: string, page: number, itemsPerPage: number ) => {
    try {
      const anaylticsParam: IAnalyticsToDeleteProps = {
        date: date?.toString() ? date?.toString() : '',
        memCode: code,
        storeId: storeid,
        jo: jo,
        PageNumber: page,
        PageSize: itemsPerPage
      };
  
      setLoading(true);
      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAnalyticsToDelete`,
        data: anaylticsParam,
      };
  
      const response = await axios(getAnalytics);
      setAnalytics(response.data.Item1);
      setPageCount(response.data.Item2);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    if(formattedDateFrom && selected && selectedLocation && jo)
    {
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
          if(formattedDateFrom != null)
          {
            fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, page, itemsPerPage);
          }
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
          if(formattedDateFrom != null)
          {
            fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, page, itemsPerPage);
          }
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
    <Box
      sx={{
        marginTop: '16px',
        marginLeft: '20px',
        marginRight: '20px',
        flexGrow: 1,
      }}
    >
      <Grid container direction="row" alignItems="center" sx={{ padding: '8px 16px 0 -9px' }} >
        <Grid item xs={0.9}>
          <Typography sx={{ color: '#1C2C5A' }}>
           *From:
          </Typography>
        </Grid>
        <Grid item xs={11.1}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              inputFormat="dddd, MMMM DD, YYYY"
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
                      width: '340px',
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={0.9} sx={{ paddingTop: '15px' }}>
          <Typography sx={{ color: '#1C2C5A' }}>
            *Merchant:
          </Typography>
        </Grid>
        <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
          <TextField
            variant="outlined"
            size="small"
            type="text"
            required
            select
            value={selected}// Default to an empty string if undefined
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
            {customerCodes.map((item: ICustomerCodes) => (
              <MenuItem key={item.CustomerId} value={item.CustomerId}>
                {item.CustomerName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={0.9} sx={{ paddingTop: '15px' }}>
          <Typography sx={{ color: '#1C2C5A' }}>
            *Club:
          </Typography>
        </Grid>
        <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
          <TextField
            variant="outlined"
            size="small"
            type="text"
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
        <Grid item xs={0.9} sx={{ paddingTop: '15px' }}>
          <Typography sx={{ color: '#1C2C5A' }}>
            *JO No:
          </Typography>
        </Grid>
        <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
          <TextField
            variant="outlined"
            size="small"
            type="text"
            required
            value={jo}
            onChange={(e) => handleChangeJo(e.target.value)}
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
          </TextField>
        </Grid>
      </Grid>
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
            <StyledTableCell align="center">Actions</StyledTableCell>
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
                    <StyledTableCellSmall align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <BootstrapButton
                          onClick={() => {
                            handleUpdateModalClick(item.Id);
                          }}
                          sx={{
                            backgroundColor: "#FCBA70",
                            width: '90px',
                            height: "20px",
                            borderRadius: "15px",
                            marginLeft: 0.5,
                            "&:hover": {
                              backgroundColor: "#FF9419",
                            },
                          }}
                        >
                          Update
                        </BootstrapButton>
                        <BootstrapButton
                          onClick={() => {
                            handleDeleteModalClick(item.Id);
                          }}
                          sx={{
                            backgroundColor: "#FFB5B5",
                            width: '90px',
                            height: "20px",
                            borderRadius: "15px",
                            marginLeft: 0.5,
                            "&:hover": {
                              backgroundColor: "#FF7171",
                            },
                          }}
                        >
                          Delete
                        </BootstrapButton>
                      </Box>
                    </StyledTableCellSmall>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Pagination
          variant="outlined"
          shape="rounded"
          count={pageCount}
          page={page}
          onChange={(event, value) => {
            setPage(value);
            if(formattedDateFrom != null)
            {
              fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, value, itemsPerPage);
            }
          }}
        />
      </Box>
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
        title='Delete Analytics'
        onClose={handleCloseDelete}
        buttonName='Delete'
        open={isModalOpen}
        onSave={handleDeleteClick}
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
                  Are you sure you want to delete this analytics?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        } 
      />
      <ModalComponent
        title='Update Analytics'
        onClose={handleCloseUpdate}
        buttonName='Update'
        open={isModalOpenUpdate}
        onSave={handleUpdateClick}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={8}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '15px'
                }}>
                Move this transaction to:
              </Grid>
              <Grid item xs={11.5} sx={{marginLeft: '10px', marginTop: '10px'}}>
                <Box display={'flex'}>
                  <Autocomplete
                    fullWidth
                    options={customerCodes}
                    getOptionLabel={(option) => option.CustomerName}
                    onChange={(event, value) => {
                      handleChangeMerchant(value?.CustomerId);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Partner"
                        variant="outlined"
                      />
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        } 
      />
    </Box>
  )
}

export default Analytics