import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, CircularProgress, Pagination, Grid, TextField, TextFieldProps, MenuItem, IconButton, Snackbar, Fade, Alert, Paper, Divider, Card, CardContent } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import IAccntGenerateInvoice from '../_Interface/IAccntGenerateInvoice';
import {ReceiptLong as ReceiptLongIcon} from '@mui/icons-material/';
import CheckIcon from '@mui/icons-material/Check';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import IDashboardAccounting from '../_Interface/IDashboardAccounting';
import IRefreshAnalytics from '../_Interface/IRefreshAnalytics';
import IAccountingStatus from '../_Interface/IAccountingStatus';
import PaymentReconCards from '../../Components/Common/PaymentReconCards';
import IAccountingStatusMatch from '../_Interface/IAccountingStatusMatch';
import IAnalyticProps from '../_Interface/IAnalyticsProps';

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

interface ICustomerCodes
{
  CustomerId: string,
  CustomerName: string,
}

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

const accountingStatus: IAccountingStatus[] = [
  { Id: 1, StatusId: [1, 2, 3, 4, 5, 6], StatusName: "All" },
  { Id: 2, StatusId: [1], StatusName: "Paid" },
  { Id: 3, StatusId: [2], StatusName: "Underpaid" },
  { Id: 4, StatusId: [3], StatusName: "Overpaid" },
  { Id: 5, StatusId: [4], StatusName: "Not Reported" },
  { Id: 6, StatusId: [5], StatusName: "Unpaid" },
  { Id: 7, StatusId: [6], StatusName: "Adjustments" },
];

const DashboardAccounting = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<IDashboardAccounting[]>([]);
  const [selected, setSelected] = useState<string>('All');
  const [status, setStatus] = useState<IAccountingStatusMatch[]>([]);

  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const analyticsParam: IRefreshAnalytics = {
    dates: [formattedDateFrom ? formattedDateFrom : '', formattedDateFrom ? formattedDateFrom : ''],
    memCode: [],
    userId: '',
    storeId: [0], 
  }

  const updatedParam = {
    Path: '',
    BatFilePath: '',
    analyticsParamsDto: analyticsParam, 
  }

  useEffect(() => {
    if(formattedDateFrom)
    {
      setLoading(true)
      setGeneratedInvoice([]);
      const fetchGenerateInvoice = async () => {
        try {
          const getAnalytics: AxiosRequestConfig = {
            method: 'POST',
            url: `${REACT_APP_API_ENDPOINT}/Analytics/DashboardAccounting`,
            data: updatedParam,
          };
    
          axios(getAnalytics)
          .then(async (response) => {
            setGeneratedInvoice([]);
            setGeneratedInvoice(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          })
          .finally(() => {
            setLoading(false)
          })
        } catch (error) {
          console.error("Error fetching data:", error);
        } 
      };

      fetchGenerateInvoice();
    }
  }, [REACT_APP_API_ENDPOINT, formattedDateFrom]);

  useEffect(() => {
    const defaultDate = dayjs().startOf('day').subtract(1, 'day');
    setSelectedDateFrom(defaultDate);
    setLoading(false)
  }, []);

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChange = (value: string)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelected(sanitizedValue);
  };

  useEffect(() => {
    document.title = 'Accounting | Dashboard';
  }, []);

  const fetchGrabFoodMatch = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      setLoading(true);
      const getAnalyticsMatch: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAccountingProofListVariance`,
        data: anaylticsParam,
      };

      const response = await axios(getAnalyticsMatch);
      const result1 = response.data.Item2;

      if (result1 != null) {
        setStatus(result1)
      }

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(selectedDateFrom !== null)
        {
          const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateFrom?.toString() ? formattedDateFrom?.toString() : ''],
            memCode: ['9999011929', '9999011955', '9999011855', '9999011935', '9999011931', '9999011838'],
            userId: '',
            storeId: [],
            status: [selected],
            isView: false,
          };
          await fetchGrabFoodMatch(anaylticsParam);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [fetchGrabFoodMatch, selectedDateFrom, selected]);

  return (
    <Box
    sx={{
      marginTop: '16px',
      marginLeft: '20px',
      marginRight: '20px',
      flexGrow: 1,
    }}
    >
      <Paper elevation={3} sx={{ padding: '20px', maxWidth: '100%', borderRadius: '15px', height: '780px' }}>
        <Typography gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '18px', color: '#1C2C5A', }}>
          Submitted CSI
        </Typography>
        <Divider sx={{ marginBottom: '10px' }} />
        <Grid container spacing={1} alignItems="flex-start" direction={'row'}>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="dddd, MMMM DD, YYYY"
                value={selectedDateFrom}
                label="Date"
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
                        width: '230px',
                        fontSize: '14px',
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: '10px' }} />
          <CustomScrollbarBox component={Paper}
            sx={{
              height: '370px',
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
          
          <Table
            sx={{
              backgroundColor: '#ffffff',
              borderCollapse: 'separate',
              borderSpacing: '6px 6px',
            }}
            aria-label="spanning table">
            <TableHead
            sx={{
              height: '10px',
              zIndex: 3,
              position: 'sticky',
              top: '-10px',
              backgroundColor: '#ffffff',
            }}
          >
              <TableRow sx={{ minWidth: 700 }}>
                <StyledTableCell style={{ textAlign: 'center',  }}>Club</StyledTableCell>
                <StyledTableCell style={{ textAlign: 'center',  }}>Grab Mart</StyledTableCell>
                <StyledTableCell style={{ textAlign: 'center',  }}>Grab Food</StyledTableCell>
                <StyledTableCell style={{ textAlign: 'center',  }}>Pick A Roo Merch</StyledTableCell>
                <StyledTableCell style={{ textAlign: 'center',  }}>Pick A Roo FS</StyledTableCell>
                <StyledTableCell style={{ textAlign: 'center',  }}>Food Panda</StyledTableCell>
                <StyledTableCell style={{ textAlign: 'center',  }}>MetroMart</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? (
                generatedInvoice.map((item: IDashboardAccounting) => (
                <TableRow key={item.LocationCode} sx={{ "& td": { border: 0 }}}>
                  <StyledTableCellSmall >{item.LocationName}</StyledTableCellSmall>
                  <StyledTableCellSmall 
                    style={{ 
                      width: '200px',
                      borderRadius: '10px',
                      textAlign: 'center', 
                      backgroundColor: item.GrabMart === null ? '#FFB5B5' : item.GrabMart === 3 ?  '#E3FBE3' : '#FFCF97',
                      color: item.GrabMart === null ? '#A85A5A' : item.GrabMart === 3 ? '#3F743F' : '#634422',
                    }}
                  >
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', }}>
                      {item.GrabMart === null ? (
                        <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : item.GrabMart === 3 ? (  
                          <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      ) : (
                        <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      )}
                      {item.GrabMart === null ? 'No Analytics' : item.GrabMart === 3 ? 'Submitted' : 'Pending'}
                    </span>
                  </StyledTableCellSmall>
                  <StyledTableCellSmall 
                    style={{ 
                      width: '200px',
                      borderRadius: '10px',
                      textAlign: 'center', 
                      backgroundColor: item.GrabFood === null ? '#FFB5B5' : item.GrabFood === 3 ?  '#E3FBE3' : '#FFCF97',
                      color: item.GrabFood === null ? '#A85A5A' : item.GrabFood === 3 ? '#3F743F' : '#634422',
                    }}
                  >
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', }}>
                      {item.GrabFood === null ? (
                        <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : item.GrabFood === 3 ? (  
                          <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      ) : (
                        <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      )}
                      {item.GrabFood === null ? 'No Analytics' : item.GrabFood === 3 ? 'Submitted' : 'Pending'}
                    </span>
                  </StyledTableCellSmall>
                  <StyledTableCellSmall 
                    style={{ 
                      width: '200px',
                      borderRadius: '10px',
                      textAlign: 'center', 
                      backgroundColor: item.PickARooMerch === null ? '#FFB5B5' : item.PickARooMerch === 3 ?  '#E3FBE3' : '#FFCF97',
                      color: item.PickARooMerch === null ? '#A85A5A' : item.PickARooMerch === 3 ? '#3F743F' : '#634422',
                    }}
                  >
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', }}>
                      {item.PickARooMerch === null ? (
                        <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : item.PickARooMerch === 3 ? (  
                          <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      ) : (
                        <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      )}
                      {item.PickARooMerch === null ? 'No Analytics' : item.PickARooMerch === 3 ? 'Submitted' : 'Pending'}
                    </span>
                  </StyledTableCellSmall>
                  <StyledTableCellSmall 
                    style={{ 
                      width: '200px',
                      borderRadius: '10px',
                      textAlign: 'center', 
                      backgroundColor: item.PickARooFS === null ? '#FFB5B5' : item.PickARooFS === 3 ?  '#E3FBE3' : '#FFCF97',
                      color: item.PickARooFS === null ? '#A85A5A' : item.PickARooFS === 3 ? '#3F743F' : '#634422',
                    }}
                  >
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', }}>
                      {item.PickARooFS === null ? (
                        <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : item.PickARooFS === 3 ? (  
                          <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      ) : (
                        <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      )}
                      {item.PickARooFS === null ? 'No Analytics' : item.PickARooFS === 3 ? 'Submitted' : 'Pending'}
                    </span>
                  </StyledTableCellSmall>
                  <StyledTableCellSmall 
                    style={{ 
                      width: '200px',
                      borderRadius: '10px',
                      textAlign: 'center', 
                      backgroundColor: item.FoodPanda === null ? '#FFB5B5' : item.FoodPanda === 3 ?  '#E3FBE3' : '#FFCF97',
                      color: item.FoodPanda === null ? '#A85A5A' : item.FoodPanda === 3 ? '#3F743F' : '#634422',
                    }}
                  >
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', }}>
                      {item.FoodPanda === null ? (
                        <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : item.FoodPanda === 3 ? (  
                          <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      ) : (
                        <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      )}
                      {item.FoodPanda === null ? 'No Analytics' : item.FoodPanda === 3 ? 'Submitted' : 'Pending'}
                    </span>
                  </StyledTableCellSmall>
                  <StyledTableCellSmall 
                    style={{ 
                      width: '200px',
                      borderRadius: '10px',
                      textAlign: 'center', 
                      backgroundColor: item.MetroMart === null ? '#FFB5B5' : item.MetroMart === 3 ?  '#E3FBE3' : '#FFCF97',
                      color: item.MetroMart === null? '#A85A5A' : item.MetroMart === 3 ? '#3F743F' : '#634422',
                    }}
                  >
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', }}>
                      {item.MetroMart === null ? (
                        <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : item.MetroMart === 3 ? (  
                          <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      ) : (
                        <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      )}
                      {item.MetroMart === null ? 'No Analytics' : item.MetroMart === 3 ? 'Submitted' : 'Pending'}
                    </span>
                  </StyledTableCellSmall>
                </TableRow>
              ))
              ) : (
                <TableRow
                sx={{ 
                  "& td": { 
                    border: 0, 
                  }, 
                  '&:hover': {
                    backgroundColor: '#ffffff', 
                  },
                }}>
                <StyledTableCellSmall style={{ textAlign: 'center', width: '400px'  }}></StyledTableCellSmall>
                <StyledTableCellSmall style={{ textAlign: 'center', width: '200px'  }}></StyledTableCellSmall>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="349px"
                    sx={{ backgroundColor: '#ffffff' }}
                  >
                    <CircularProgress size={80} />
                    <Typography variant="h6" color="textSecondary" sx={{ marginTop: '16px' }}>
                      Loading...
                    </Typography>
                  </Box>
                <StyledTableCellSmall style={{ textAlign: 'center', width: '200px'  }}></StyledTableCellSmall>
                <StyledTableCellSmall style={{ textAlign: 'center', width: '400px'  }}></StyledTableCellSmall>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CustomScrollbarBox>
        <Divider sx={{ marginBottom: '10px', paddingTop: '2px' }} />
          <Typography gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '18px', color: '#1C2C5A', }}>
            Payment Recon
          </Typography>
        <Divider sx={{ marginBottom: '10px' }} />
        <TextField
          variant="outlined"
          size="small"
          type="text"
          required
          label="Status"
          select
          value={selected}
          onChange={(e) => handleChange(e.target.value)}
          InputProps={{
            sx: {
              borderRadius: '40px',
              backgroundColor: '#FFFFFF',
              height: '40px',
              width: '145px',
              fontSize: '15px',
              fontFamily: 'Inter',
              fontWeight: 'bold',
              color: '#1C2C5A',
            },
          }}
        >
          {accountingStatus.map((item: IAccountingStatus) => (
            <MenuItem key={item.Id} value={item.StatusName}>
              {item.StatusName}
            </MenuItem>
          ))}
        </TextField>

        <PaymentReconCards 
          isDashboard={true}
          statusMatch={status}
        />
      </Paper>
      {/* <Snackbar
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
      </Snackbar> */}
    </Box>
  )
}

export default DashboardAccounting
