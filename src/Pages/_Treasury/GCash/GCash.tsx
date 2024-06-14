import { Box, Grid, Typography, TextField, Button, ButtonGroup, Divider, Fade, Alert, styled, Pagination, Snackbar, Backdrop, CircularProgress, TextFieldProps,MenuItem } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import ModalComponent from '../../../Components/Common/ModalComponent';
import BoxHeaderButtons from '../../../Components/Common/BoxHeaderButtons';
import IAnalytics from '../../Common/Interface/IAnalytics';
import IPortal from '../../Common/Interface/IPortal';
import IMatch from '../../Common/Interface/IMatch';
import IException from '../../Common/Interface/IException';
import axios, { AxiosRequestConfig } from 'axios';
import IAnalyticProps from '../../Common/Interface/IAnalyticsProps';
import IExceptionProps from '../../Common/Interface/IExceptionProps';
import dayjs, { Dayjs } from 'dayjs';
import IRefreshAnalytics from '../../Common/Interface/IRefreshAnalytics';
import IAdjustmentAddProps from '../../Common/Interface/IAdjustmentAddProps';
import DisputeTable from '../../../Components/Common/DisputeTable';
import DisputeAnalyticsTable from '../../../Components/Common/DisputeAnalytics';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ILocations from '../../Common/Interface/ILocations';
import IAnalyticsToAddProps from '../../_SystemAdmin/Analytics/ManualAdd/Interface/IAnalyticsToAddProps';

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

const GCash = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem('club');
  const [open, setOpen] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState('Analytics');
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const [exception, setException] = useState<IException[]>([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [page, setPage] = useState<number>(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState<number>(6); // Items displayed per page
  const [pageCount, setPageCount] = useState<number>(0); // Total page count
  const [columnToSort, setColumnToSort] = useState<string>(""); // Column to sort
  const [orderBy, setOrderBy] = useState<string>("asc"); // Sorting order
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentDate, setCurrentDate] = useState<Dayjs | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isModalClose, setIsModalClose] = useState<boolean>(false);
  const [successRefresh, setSuccessRefresh] = useState<boolean>(false);
  const [openRefresh, setOpenRefresh] = useState<boolean>(false);
  const [openSubmit, setOpenSubmit] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [adjustmentFields, setAdjustmentFields] = useState<IAdjustmentAddProps>({} as IAdjustmentAddProps);
  const [isSave, setIsSave] = useState<boolean>(false);
  const [isFetchException, setIsFetchException] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(true);
  const [refreshAnalyticsDto, setRefreshAnalyticsDto] = useState<IRefreshAnalytics>();
  // State to store filtered analytics data
  const [filteredAnalytics, setFilteredAnalytics] = useState<IAnalytics[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [stateAnalytics, setStateAnalytics] = useState<IAnalyticsToAddProps>({} as IAnalyticsToAddProps);
  const getId = window.localStorage.getItem('Id');
  


  //GCash Customer Code
  const customerCode = ['9999011926'];
  useEffect(() => {
    document.title = 'CSI | GCash';
  }, []);

  let club = 0;
  if(getClub !== null)
  {
    club = parseInt(getClub, 10);
  }

  let Id = "";
  if(getId !== null)
  {
    Id = getId;
  }

  const formattedDateFrom = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');


  // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleOpenRefresh = () => {
    setOpenRefresh(true);
  };

  const handleCloseRefresh = useCallback(() => {
    setOpenRefresh(false);
  }, []);

  const handleOpenSubmit = () => {
    setOpenSubmit(true);
  };

  const handleCloseSubmit = () => {
    setOpenSubmit(false);
  };

  const handleButtonClick = (buttonName : string) => {
    setActiveButton(buttonName);
    // Add any additional logic you need on button click
  };


  const handleSave = async () => { 

    var analyticsProp: IAnalyticProps = {
        action: "Manual Add GCash",
        remarks: "Successfully Added",
    }
    var updatedParams: IAnalyticsToAddProps = {
      CustomerId: stateAnalytics.CustomerId,
      LocationId: stateAnalytics.LocationId,
      TransactionDate: stateAnalytics.TransactionDate,
      MembershipNo: stateAnalytics.MembershipNo,
      CashierNo: stateAnalytics.CashierNo,
      RegisterNo: stateAnalytics.RegisterNo,
      TransactionNo: stateAnalytics.TransactionNo,
      OrderNo: stateAnalytics.OrderNo,
      Qty: stateAnalytics.Qty,
      Amount: stateAnalytics.Amount,
      Subtotal: stateAnalytics.Subtotal,
      UserId: stateAnalytics.UserId,
      AnalyticsParamsDto: analyticsProp 
    };

    const analyticsAdd: AxiosRequestConfig = {
      method: 'POST',
      url: `${REACT_APP_API_ENDPOINT}/Analytics/CreateAnalytics`,
      data: updatedParams,
    };

    try {
      const response = await axios(analyticsAdd);
      console.log(response.data);
      handleCloseModal();
      setIsSnackbarOpen(true);
      setSnackbarSeverity('success');
      setMessage('Successfully saved the transaction.');
      //reset textbox
      setStateAnalytics({} as IAnalyticsToAddProps);
      // refersh table
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const anaylticsParam: IAnalyticProps = {
        dates: [formattedDate ?? ''],
        memCode: customerCode,
        userId: '',
        storeId: [club],
      };      
  
      await fetchGCash(anaylticsParam);
    } catch (error) {
      console.error('Error saving data', error);
      // Handle error (e.g., show an error message)
      handleCloseModal();
      setIsSnackbarOpen(true);
      setSnackbarSeverity('error');
      setMessage('Error in saving the transaction.');
      setStateAnalytics({} as IAnalyticsToAddProps);
    }
  };



  const handleCloseModal = useCallback(() => {
    setOpen(false);
  }, []);

  const fetchGCash = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      setLoading(true);

      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAnalytics`,
        data: anaylticsParam,
      };

      axios(getAnalytics)
      .then(async (response) => {
        setAnalytics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        if(selectedDate !== null)
        {
          const formattedDate = selectedDate.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDate],
            memCode: customerCode,
            userId: '',
            storeId: [club],
          };      
      
          await fetchGCash(anaylticsParam);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [fetchGCash, page, itemsPerPage, searchQuery, columnToSort, orderBy, selectedDate, club]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if(successRefresh)
        {
          const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
            memCode: customerCode,
            userId: '',
            storeId: [club],
          };

          await fetchGCash(anaylticsParam);
          setSuccessRefresh(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [fetchGCash, selectedDate, successRefresh]);

  const handleRefreshClick = () => {
    try {
      setRefreshing(true);
      setOpenRefresh(false);
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: customerCode,
        userId: '',
        storeId: [club], 
      }

      const refreshAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/RefreshAnalytics`,
        data: updatedParam,
      };

      axios(refreshAnalytics)
      .then(async () => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Success');
          setSuccessRefresh(true);
          setSubmitted(true);
            const exceptionParam: IExceptionProps = {
              PageNumber: page,
              PageSize: itemsPerPage,
              SearchQuery: searchQuery,
              ColumnToSort: columnToSort,
              OrderBy: orderBy, 
              dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
              memCode: customerCode,
              userId: '',
              storeId: [club],
            };

      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error refreshing analytics');
        console.error("Error refreshing analytics:", error);
      })
      .finally(() => {
        setRefreshing(false); 
        setOpenRefresh(false);
        setSuccess(false);
      });
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error refreshing analytics');
        console.error("Error refreshing analytics:", error);
        setRefreshing(false);
        setOpenRefresh(false);
        setSuccess(false);
    } 
  };

  useEffect(() => {
    const defaultDate = dayjs().startOf('day').subtract(1, 'day');
    const currentDate = dayjs().startOf('day').subtract(1, 'day');;
    setSelectedDate(defaultDate);
    setCurrentDate(currentDate);
  }, []);

  const handleChangeDate = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
  };

  const handleChangeSearch = (newValue: string) => {
    ///
  };

  const handleSubmitClick = () => {
    try {
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: customerCode,
        userId: '',
        storeId: [club], 
      }

      const submitAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/SubmitAnalyticsWOProoflist`,
        data: updatedParam,
      };

      axios(submitAnalytics)
      .then(async (result) => {
          if(result.data === true) 
          {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setMessage('Analytics Successfully Submitted');
            setOpenSubmit(false);
            setSubmitted(true);
          }
          else
          {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Error submitting analytics. Please try again!');
            setOpenSubmit(false);
            setSubmitted(true);
          }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error submitting analytics');
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error submitting analytics');
    } 
  };

  useEffect(() => {
    const IsSubmittedGenerated = async () => {
      try {
          if(selectedDate)
          {
            const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
            const updatedParam: IRefreshAnalytics = {
              dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
              memCode: customerCode,
              userId: '',
              storeId: [club], 
            }
        
            const submitgenerate: AxiosRequestConfig = {
              method: 'POST',
              url: `${REACT_APP_API_ENDPOINT}/Analytics/IsSubmittedGenerated`,
              data: updatedParam,
            };
  
            await axios(submitgenerate)
            .then((result => {
              setIsSubmitted(result.data.IsSubmitted);
              setIsGenerated(result.data.IsGenerated);
              setSubmitted(false);
            }))
          }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };

    IsSubmittedGenerated();
  }, [REACT_APP_API_ENDPOINT, selectedDate, successRefresh, submitted]);

  useEffect(() => {
    const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
    setRefreshAnalyticsDto({
      dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
      memCode: customerCode,
      userId: '',
      storeId: [club], 
    })
  }, [club, selectedDate])

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

  const matchedLocation = locations.find(location => location.LocationCode === club);
  const clubCodeName = matchedLocation?.LocationCode + ' - ' + matchedLocation?.LocationName;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      setStateAnalytics({
      ...stateAnalytics,
      [name]: value,
      UserId: Id,
      TransactionDate: formattedDateFrom ?? '',
      CustomerId: customerCode[0],
      LocationId: club
    });
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
        <Grid item sx={{ width: '100%' }}>
          <BoxHeaderButtons isSubmitted={isSubmitted} isGenerated={isGenerated} handleOpenSubmit={handleOpenSubmit} handleChangeSearch={handleChangeSearch} handleOpenModal={handleOpenModal} handleOpenRefresh={handleOpenRefresh} customerName='MetroMart' handleChangeDate={handleChangeDate} selectedDate={selectedDate} analytics={analytics} setFilteredAnalytics={setFilteredAnalytics} setIsTyping={setIsTyping}/>  
        </Grid>
        <Grid item xs={12}
          sx={{
              paddingTop: '10px',
              paddingRight: '20px',
              transition: 'left 0.3s ease',
          }}>
            <Box sx={{
              boxShadow: 'inset 6px 9px 8px -1px rgba(0,0,0,0.3), inset -6px 0px 8px -1px rgba(0,0,0,0.3)',
              backgroundColor: '#F2F2F2',
              paddingTop: '10px',
              borderRadius: '20px',
            }}>
              <Grid container spacing={2} sx={{paddingTop: '4px'}}>
                <Grid item>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingBottom: '10px',
                      backgroundColor: 'white',
                      marginLeft: '15px',
                      paddingLeft: '-1px',
                      marginRight: '-140px',
                      borderTopRightRadius: '20px',
                      borderTopLeftRadius: '20px',
                      paddingTop: '5px',
                      justifyContent: 'center', 
                      alignItems: 'center',
                      boxShadow: '1px 9px 8px -1px rgba(0,0,0,0.3), 1px 0px 8px -1px rgba(0,0,0,0.3)',
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
                      GCash
                    </Typography>
                    
                    <Box
                      sx={{
                        border: '2px solid #1C3766',
                        backgroundColor: '#1C3766',
                        height: '3px',
                        width: '40px',
                        borderRadius: '25px',
                      }}
                    >
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box 
                sx={{ 
                  position: 'relative', 
                  backgroundColor: 'white', 
                  boxShadow: '-7px 0px 8px -4px rgba(0,0,0,0.1),7px 0px 8px -4px rgba(0,0,0,0.1),0px 7px 8px -4px rgba(0,0,0,0.1)', 
                  textAlign: 'center',
                  borderBottomLeftRadius: '20px',
                  borderBottomRightRadius: '20px',
                  paddingTop:'20px',
                  paddingBottom:'20px',
                  marginBottom: '20px'
                }}
                >
                <div className="fade">
                  {activeButton === 'Analytics' && (
                    <Fade  in={true} timeout={500}>
                      <Box>
                        <DisputeAnalyticsTable 
                          filteredAnalytics={isTyping ? filteredAnalytics : analytics}
                          loading={loading}
                        />
                      </Box>
                    </Fade>
                  )}
                </div>
                 <DisputeTable 
                exceptions={exception} 
                isSubmitted={isSubmitted} 
                setIsModalClose={setIsModalClose}
                refreshAnalyticsDto={refreshAnalyticsDto}
              />
              </Box>
            </Box>
            <Backdrop
              sx={{ color: '#ffffff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={refreshing}
            >
              <CircularProgress size="100px" sx={{ color: '#ffffff' }} />
            </Backdrop>
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
      </Grid>
        <ModalComponent
          title='Add Partner Transaction'
          onClose={handleCloseModal}
          buttonName='Save'
          open={open}
          onSave={handleSave}
          children={
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} sx={{marginBottom: 3, paddingRight: '2px'}}>
                <Grid item xs={12} sx={{marginLeft: '10px', marginTop: 1}}>                  
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Customer Name"
                    value='GCASH'
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },readOnly: true
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Location Name"
                    value={clubCodeName}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },readOnly: true
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      inputFormat="dddd, MMMM DD, YYYY"
                      label="Transaction Date" 
                      value={selectedDate}
                      onChange={handleChangeDate}
                      renderInput={(params: TextFieldProps) => (
                        <TextField
                          fullWidth
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
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Membership No"
                    required
                    name='MembershipNo'
                    value={stateAnalytics.MembershipNo}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Cashier No"
                    required
                    name='CashierNo'
                    value={stateAnalytics.CashierNo}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Register No"
                    required
                    name='RegisterNo'
                    value={stateAnalytics.RegisterNo}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Transaction No"
                    required
                    name='TransactionNo'
                    value={stateAnalytics.TransactionNo}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Order No"
                    required
                    name='OrderNo'
                    value={stateAnalytics.OrderNo}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3.5} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="number"
                    label="Qty"
                    required
                    name='Qty'
                    value={stateAnalytics.Qty}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4} sx={{marginLeft: '6px', paddingLeft: '5px!important'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="number"
                    label="Amount"
                    required
                    name='Amount'
                    value={stateAnalytics.Amount}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4} sx={{marginLeft: '6px', paddingLeft: '5px!important'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="number"
                    label="SubTotal"
                    required
                    name='Subtotal'
                    value={stateAnalytics.Subtotal}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          } 
        />
        <ModalComponent
          title='Refresh Analytics'
          onClose={handleCloseRefresh}
          buttonName='Refresh'
          open={openRefresh}
          onSave={handleRefreshClick}
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
                  <Typography sx={{ fontSize: '25px', textAlign: 'center', marginRight: '-170px' }}>
                    Any modifications made will be deleted!
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          } 
        />
        <ModalComponent
          title='Submit Analytics'
          onClose={handleCloseSubmit}
          buttonName='Submit'
          open={openSubmit}
          onSave={handleSubmitClick}
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
                  <Typography sx={{ fontSize: '25px', textAlign: 'center', marginRight: '-170px' }}>
                    Are you sure you want to submit?
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          } 
        />
    </Box>
  )
}

export default GCash
