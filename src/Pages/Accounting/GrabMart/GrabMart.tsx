import { Box, Grid, Typography, Button, ButtonGroup, Fade, Alert, styled, TextField, TextFieldProps, Snackbar, MenuItem, Pagination } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import SalesTransactionTable from '../../../Components/Common/SalesTransactionTable';
import AccountingMatchTable from '../../../Components/Common/AccountingMatchTable';
import PaymentTable from '../../../Components/Common/PaymentTable';
import IPortal from '../../Interface/IPortal';
import IAnalyticProps from '../../Interface/IAnalyticsProps';
import axios, { AxiosRequestConfig } from 'axios';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import IAnalytics from '../../Interface/IAnalytics';
import IAccountingMatch from '../../Interface/IAccountingMatch';
import { Dayjs } from 'dayjs';

const WhiteAlert = styled(Alert)(({ severity }) => ({
  color: '#1C2C5A',
  fontFamily: 'Inter',
  fontWeight: '700',
  fontSize: '15px',
  borderRadius: '25px',
  border:  severity === 'success' ? '1px solid #4E813D' : '1px solid #9B6B6B',
  backgroundColor: severity === 'success' ? '#E7FFDF' : '#FFC0C0',
}));

const paymentStatus = [
  { Id: 1, Value: 'All', StatusName: "All" },
  { Id: 2, Value: 'Paid', StatusName: "Paid" },
  { Id: 3, Value: 'Underpayment', StatusName: "Underpayment" },
  { Id: 4, Value: 'Overpayment', StatusName: "Overpayment" },
  { Id: 5, Value: 'Not Reported', StatusName: "Not Reported" },
  { Id: 6, Value: 'Unpaid', StatusName: "Unpaid" },
  { Id: 7, Value: 'Adjustments', StatusName: "Adjustments" },
  { Id: 8, Value: 'Re-Transact', StatusName: "Re-Transact" },
  { Id: 9, Value: 'Paid | with AP', StatusName: "Paid | with AP" },
  { Id: 10, Value: 'Unpaid | with AP', StatusName: "Unpaid | with AP" },
  { Id: 11, Value: 'Underpayment | with AP', StatusName: "Underpayment | with AP" },
  { Id: 12, Value: 'Overpayment | with AP', StatusName: "Overpayment | with AP" },
  { Id: 13, Value: 'Chargeable', StatusName: "Chargeable" },
  { Id: 14, Value: 'Paid | Matched', StatusName: "Paid | Matched" },
  { Id: 15, Value: 'Overpayment | Matched', StatusName: "Overpayment | Matched" },
  { Id: 16, Value: 'Underpayment | Matched', StatusName: "Underpayment | Matched" },
  { Id: 17, Value: 'Paid | Multiple Trx', StatusName: "Paid | Multiple Trx" },
  { Id: 18, Value: 'Paid | Matched', StatusName: "Paid | Adjusted" },
  { Id: 19, Value: 'Overpayment | Matched', StatusName: "Underpayment | Adjusted" },
  { Id: 20, Value: 'Underpayment | Matched', StatusName: "Overpayment | Adjusted" },
  { Id: 21, Value: 'Paid | Multiple Trx', StatusName: "Clawback" },
];

const AcctGrabMart = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [activeButton, setActiveButton] = useState('Match');
  const [portal, setPortal] = useState<IPortal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const [match, setMatch] = useState<IAccountingMatch[]>([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(''); 
  const [selected, setSelected] = useState<string>('All');
  const [jo, setJo] = useState<string>('');
  const [isModalClose, setIsModalClose] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);
  const [pageCount, setPageCount] = useState<number>(0);
  const [columnToSort, setColumnToSort] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("asc");

  useEffect(() => {
    document.title = 'Accounting | Grab Mart';
  }, []);

  useEffect(() => {
    setLoading(false)
  }, []);

  const handleButtonClick = (buttonName : string) => {
    setActiveButton(buttonName);
  };

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const fetchGrabMartPortal = useCallback(async(portalParams: IAnalyticProps) => {
    try {
      const getPortal: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/ProofList/GetAccountingPortal`,
        data: portalParams,
      };

      axios(getPortal)
      .then(async (response) => {
        setPortal(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
    } catch (error) {
      console.error("Error fetching portal:", error);
    }
  }, [REACT_APP_API_ENDPOINT]);

  const fetchGrabMartMatch = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      const getAnalyticsMatch: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAccountingProofListVariance`,
        data: anaylticsParam,
      };
      const response = await axios(getAnalyticsMatch);
      const result = response.data;
      if (result != null) {
        setMatch(result.Item1);
        setPageCount(result.Item2);
      }
    } catch (error) {
      setMatch([])
      console.error("Error fetching analytics:", error);
    } 
  }, [REACT_APP_API_ENDPOINT]);

  const fetchGrabMart = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAccountingAnalyitcs`,
        data: anaylticsParam,
      };

      axios(getAnalytics)
      .then(async (response) => {
        setAnalytics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(selectedDateFrom !== null && selectedDateTo !== null && selected.length >= 1)
        {
          setLoading(true);
          setMatch([])
          const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const formattedDateTo = selectedDateTo?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            PageNumber: 1,
            PageSize: itemsPerPage,
            SearchQuery: searchQuery,
            ColumnToSort: columnToSort,
            OrderBy: orderBy, 
            dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
            memCode: ['9999011955'],
            userId: '',
            orderNo: jo,
            status: [selected],
            storeId: [],
          };
          await fetchGrabMart(anaylticsParam);
          await fetchGrabMartPortal(anaylticsParam);
          await fetchGrabMartMatch(anaylticsParam);
          setLoading(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [fetchGrabMart, fetchGrabMartPortal, fetchGrabMartMatch, selectedDateFrom, selectedDateTo, selected, jo]);

  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const formattedDateTo = selectedDateTo?.format('YYYY-MM-DD HH:mm:ss.SSS');

  useEffect(() => {
    const fetchDataUpdate = async () => {
      try {
        if(isModalClose)
        {
          setLoading(true);
          const anaylticsParam: IAnalyticProps = {
            PageNumber: page,
            PageSize: itemsPerPage,
            SearchQuery: searchQuery,
            ColumnToSort: columnToSort,
            OrderBy: orderBy, 
            dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
            memCode: ['9999011955'],
            userId: '',
            orderNo: jo,
            status: [selected],
            storeId: [],
          };
          await fetchGrabMart(anaylticsParam);
          await fetchGrabMartPortal(anaylticsParam);
          await fetchGrabMartMatch(anaylticsParam);
          setLoading(false);
          setIsModalClose(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
    fetchDataUpdate();
  })

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChangeDateTo = (newValue: Dayjs | null) => {
    setSelectedDateTo(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setSelected(value);
  };

  const handleChangeJo = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setJo(sanitizedValue);
  };

  return (
    <Box
      sx={{
        marginTop: '16px',
        marginLeft: '16px',
        flexGrow: 1,
      }}
    >
      <Grid container spacing={1} alignItems="flex-start" direction={'row'}>
        <Grid item xs={12}
          sx={{
              paddingTop: '10px',
              paddingRight: '20px',
              transition: 'left 0.3s ease',
          }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: '10px',
                backgroundColor: '#E8E8E8',
                paddingTop: '5px',
                justifyContent: 'left', 
                alignItems: 'center',
                borderRadius: '20px',
                width: '100px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C3766',
                  fontSize: 14,
                }}
              >
                Grab Mart
              </Typography>
              <Box
                sx={{
                  border: '2px solid #00A94A',
                  backgroundColor: '#F3F3F3',
                  height: '3px',
                  width: '40px',
                  borderRadius: '25px',
                }}
              >
              </Box>
            </Box>
            <Box sx={{ paddingTop: '10px', display: 'flex', gap: '10px'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  inputFormat="dddd, MMMM DD, YYYY"
                  value={selectedDateFrom}
                  label="From"
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
                          fontSize: '14px',
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  inputFormat="dddd, MMMM DD, YYYY"
                  value={selectedDateTo}
                  label="To"
                  onChange={handleChangeDateTo}
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
                          fontSize: '14px',
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Status"
                select
                value={selected}
                onChange={handleInputChange}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '150px',
                    fontSize: '15px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              >
                {paymentStatus.map((item) => (
                  <MenuItem key={item.Id} value={item.StatusName}>
                    {item.StatusName}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                label="Order No"
                value={jo}
                onChange={(e) => handleChangeJo(e.target.value)}
                InputProps={{
                  sx: {
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '200px',
                    fontSize: '15px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                }}
              >
              </TextField>
            </Box>
            <Box 
              sx={{ 
                backgroundColor: 'white', 
                boxShadow: 'inset 1px 2px 8px -1px rgba(0,0,0,0.3), inset 1px -1px 8px -1px rgba(0,0,0,0.3)',
                textAlign: 'center',
                margin: '10px 0px 0px 0px',
                borderRadius: '20px',
                height:'689px'
              }}
              >
              <ButtonGroup sx={{ height: '20px', display: 'flex', justifyContent: 'center', paddingTop: '10px'  }}>
                <Button 
                  sx={{ 
                    fontWeight: '900 !important', 
                    fontSize: '12px', 
                    width: '250px', 
                    borderRadius: '10px', 
                    textTransform: 'none',  
                    border: '2px solid #1C2D5B' ,
                    color: activeButton === 'Sales Transaction' ? '#fff' : '#1C2D5B',
                    backgroundColor: activeButton === 'Sales Transaction' ? '#1C2D5B' : 'transparent',
                  }}
                  onClick={() => handleButtonClick('Sales Transaction')}
                >Sales Transaction
                </Button>
                <Button 
                  sx={{ 
                    fontWeight: '900 !important', 
                    fontSize: '12px', 
                    width: '250px', 
                    textTransform: 'none',  
                    border: '2px solid #1C2D5B',
                    color: activeButton === 'Match' ? '#fff' : '#1C2D5B',
                    backgroundColor: activeButton === 'Match' ? '#1C2D5B' : 'transparent',
                  }}
                  onClick={() => handleButtonClick('Match')}
                >Match
                </Button>
                <Button 
                  sx={{ 
                    fontWeight: '900 !important', 
                    fontSize: '12px', 
                    width: '250px' , 
                    borderRadius: '10px', 
                    textTransform: 'none',  
                    border: '2px solid #1C2D5B', 
                    color: activeButton === 'Payment' ? '#fff' : '#1C2D5B',
                    backgroundColor: activeButton === 'Payment' ? '#1C2D5B' : 'transparent',
                  }}
                  onClick={() => handleButtonClick('Payment')}
                >Payment
                </Button>
              </ButtonGroup>
              <div className="fade">
                {activeButton === 'Sales Transaction' && (
                  <Fade  in={true} timeout={500}>
                    <Box>
                      <SalesTransactionTable 
                        analytics={analytics}
                        loading={loading}
                      />
                    </Box>
                  </Fade>
                )}
                {activeButton === 'Match' && (
                  <Box>
                      <Fade  in={true}  timeout={500}>
                    <Box>
                      <AccountingMatchTable 
                        match={match}
                        loading={loading}
                        setIsModalClose={setIsModalClose}
                      />
                    </Box>
                  </Fade>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignContent: 'end', mt: 1 }}>
                      <Pagination
                          variant="outlined"
                          shape="rounded"
                          color="primary"
                          count={pageCount}
                          page={page}
                          onChange={async (event, value) => {
                            setPage(value)
                            const anaylticsParam: IAnalyticProps = {
                              PageNumber: value,
                              PageSize: itemsPerPage,
                              SearchQuery: searchQuery,
                              ColumnToSort: columnToSort,
                              OrderBy: orderBy, 
                              dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
                              memCode: ['9999011955'],
                              userId: '',
                              orderNo: jo,
                              status: [selected],
                              storeId: [],
                            };
                              await fetchGrabMart(anaylticsParam);
                              await fetchGrabMartPortal(anaylticsParam);
                              await fetchGrabMartMatch(anaylticsParam);
                          }}
                        />
                    </Box>
                  </Box>
                )}
                {activeButton === 'Payment' && (
                  <Fade  in={true} timeout={500}>
                    <Box>
                      <PaymentTable 
                        portal={portal}
                        loading={loading}
                        merchant='GrabMart'
                      />
                    </Box>
                  </Fade>
                )}
              </div>
            </Box>
        </Grid>
      </Grid>
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
    </Box>
  )
}

export default AcctGrabMart