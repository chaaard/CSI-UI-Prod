import { Box, Grid, Typography, Button, ButtonGroup, Fade, Alert, styled, TextField, TextFieldProps } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import PaymentReconCards from '../../../Components/Common/PaymentReconCards';
import SalesTransactionTable from '../../../Components/Common/SalesTransactionTable';
import AccountingMatchTable from '../../../Components/Common/AccountingMatchTable';
import PaymentTable from '../../../Components/Common/PaymentTable';
import PaidTable from '../../../Components/Common/PaidTable';
import TableModalComponent from '../../../Components/Common/TableModalComponent';
import UnpaidTable from '../../../Components/Common/UnpaidTable';
import AdjustmentTable from '../../../Components/Common/AdjustmentTable';
import IPortal from '../../Common/Interface/IPortal';
import IAnalyticProps from '../../Common/Interface/IAnalyticsProps';
import axios, { AxiosRequestConfig } from 'axios';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import IAnalytics from '../../Common/Interface/IAnalytics';
import IAccountingMatch from '../../Common/Interface/IAccountingMatch';
import IAccountingStatusMatch from '../../Common/Interface/IAccountingStatusMatch';

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

const AcctMetroMart = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [activeButton, setActiveButton] = useState('Match');
  const [openPaid, setOpenPaid] = useState<boolean>(false);
  const [openUnPaid, setOpenUnPaid] = useState<boolean>(false);
  const [openAdjustments, setOpenAdjustments] = useState<boolean>(false);
  const [portal, setPortal] = useState<IPortal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const [match, setMatch] = useState<IAccountingMatch[]>([]);
  const [status, setStatus] = useState<IAccountingStatusMatch[]>([]);

  useEffect(() => {
    document.title = 'Accounting | MetroMart';
  }, []);

  useEffect(() => {
    setLoading(false)
  }, []);

  const handleButtonClick = (buttonName : string) => {
    setActiveButton(buttonName);
  };

  const handleOpenPaid = () => {
    setOpenPaid(true);
  };

  const handleClosePaid = () => {
    setOpenPaid(false);
  };

  const handlePaidClick = () => {
  };

  const handleOpenUnPaid = () => {
    setOpenUnPaid(true);
  };

  const handleCloseUnPaid = () => {
    setOpenUnPaid(false);
  };

  const handleUnPaidClick = () => {
  };

  const handleOpenAdjustments = () => {
    setOpenAdjustments(true);
  };

  const handleCloseAdjustments = () => {
    setOpenAdjustments(false);
  };

  const handleAdjustmentsClick = () => {
  };

  const fetchMetroMartPortal = useCallback(async(portalParams: IAnalyticProps) => {
    try {
      setLoading(true);

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
      .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error fetching portal:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);

   const fetchMetroMartMatch = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      setLoading(true);
      const getAnalyticsMatch: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAccountingProofListVariance`,
        data: anaylticsParam,
      };

      const response = await axios(getAnalyticsMatch);
      const result = response.data.Item1;
      const result1 = response.data.Item2;

      if (result != null) {
        setMatch(result);
        setStatus(result1)
      }

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);

  const fetchMetroMart = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      setLoading(true);

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
        if(selectedDateFrom !== null || selectedDateTo !== null)
        {
          const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const formattedDateTo = selectedDateTo?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
            memCode: ['9999011855'],
            userId: '',
            storeId: [],
          };
          await fetchMetroMart(anaylticsParam);
          await fetchMetroMartPortal(anaylticsParam);
          await fetchMetroMartMatch(anaylticsParam);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [fetchMetroMart, fetchMetroMartPortal, fetchMetroMartMatch, selectedDateFrom, selectedDateTo]);

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChangeDateTo = (newValue: Dayjs | null) => {
    setSelectedDateTo(newValue);
  };

  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const formattedDateTo = selectedDateTo?.format('YYYY-MM-DD HH:mm:ss.SSS');

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
                MetroMart
              </Typography>
              <Box
                sx={{
                  border: '2px solid #424140',
                  backgroundColor: '#424140',
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
            </Box>
            <PaymentReconCards 
              isDashboard={false}
              handleOpenPaid={handleOpenPaid}
              handleOpenUnPaid={handleOpenUnPaid}
              handleOpenAdjustments={handleOpenAdjustments}
              statusMatch={status}
            />
            <Box 
              sx={{ 
                backgroundColor: 'white', 
                boxShadow: 'inset 1px 2px 8px -1px rgba(0,0,0,0.3), inset 1px -1px 8px -1px rgba(0,0,0,0.3)',
                textAlign: 'center',
                margin: '10px 0px 0px 0px',
                borderRadius: '20px',
                height:'520px'
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
                  <Fade  in={true}  timeout={500}>
                    <Box>
                      <AccountingMatchTable 
                        match={match}
                        loading={loading}
                      />
                    </Box>
                  </Fade>
                )}
                {activeButton === 'Payment' && (
                  <Fade  in={true} timeout={500}>
                    <Box>
                      <PaymentTable 
                        portal={portal}
                        loading={loading}
                        merchant='MetroMart'
                      />
                    </Box>
                  </Fade>
                )}
              </div>
            </Box>
        </Grid>
      </Grid>
      <TableModalComponent
        title='Paid'
        onClose={handleClosePaid}
        buttonName='Generate B01'
        open={openPaid}
        onSave={handlePaidClick}
        children={
          <Box>
            <PaidTable 
              dateFrom={formattedDateFrom?.toString() ? formattedDateFrom?.toString() : ''}
              dateTo={formattedDateTo?.toString() ? formattedDateTo?.toString() : ''}
              customerId='9999011855'
              status={['Paid', 'Underpaid', 'Overpaid', 'Not Reported']}
            />
          </Box>
        } 
      />
      <TableModalComponent
        title='Unpaid'
        onClose={handleCloseUnPaid}
        buttonName='Export'
        open={openUnPaid}
        onSave={handleUnPaidClick}
        children={
          <Box>
            <UnpaidTable 
              dateFrom={formattedDateFrom?.toString() ? formattedDateFrom?.toString() : ''}
              dateTo={formattedDateTo?.toString() ? formattedDateTo?.toString() : ''}
              customerId='9999011838'
              status={['Unpaid']}
            />
          </Box>
        } 
      />
      <TableModalComponent
        title='Adjustments'
        onClose={handleCloseAdjustments}
        buttonName='Export'
        open={openAdjustments}
        onSave={handleAdjustmentsClick}
        children={
          <Box>
            <AdjustmentTable 
              dateFrom={formattedDateFrom?.toString() ? formattedDateFrom?.toString() : ''}
              dateTo={formattedDateTo?.toString() ? formattedDateTo?.toString() : ''}
              customerId='9999011838'
              status={['Adjustments']}
            />
          </Box>
        } 
      />
    </Box>
  )
}

export default AcctMetroMart
