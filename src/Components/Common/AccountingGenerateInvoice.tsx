import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, CircularProgress, Pagination, Grid, TextField, TextFieldProps, MenuItem, IconButton, Snackbar, Fade, Alert, Paper, Divider, Backdrop } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import IAccntGenerateInvoice from '../../Pages/_Interface/IAccntGenerateInvoice';
import {ReceiptLong as ReceiptLongIcon, Sync as SyncIcon} from '@mui/icons-material/';
import CheckIcon from '@mui/icons-material/Check';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import IRefreshAnalytics from '../../Pages/_Interface/IRefreshAnalytics';
import ModalComponent from './ModalComponent';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CustomerDropdown from './CustomerDropdown';

const WhiteAlert = styled(Alert)(({ severity }) => ({
  color: '#1C2C5A',
  fontFamily: 'Inter',
  fontWeight: '700',
  fontSize: '15px',
  borderRadius: '25px',
  border:  severity === 'success' ? '1px solid #4E813D' : '1px solid #9B6B6B',
  backgroundColor: severity === 'success' ? '#E7FFDF' : '#FFC0C0',
}));

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

const customerCodes = [
  { CustomerId: "9999011929", CustomerName: "Grab Food" },
  { CustomerId: "9999011955", CustomerName: "Grab Mart" },
  { CustomerId: "9999011931", CustomerName: "Pick A Roo Merchandise" },
  { CustomerId: "9999011935", CustomerName: "Pick A Roo FS" },
  { CustomerId: "9999011838", CustomerName: "Food Panda" },
  { CustomerId: "9999011855", CustomerName: "MetroMart" },
];

const AccountingGenerateInvoice = () => {
  const { REACT_APP_API_ENDPOINT, REACT_APP_INVOICE } = process.env;
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<IAccntGenerateInvoice[]>([]);
  //const [selected, setSelected] = useState<string>('9999011929');
  const [selected, setSelected] = useState<string[]>([] as string[]);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [openGenInvoice, setOpenGenInvoice] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const handleChange = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelected(sanitizedValue);
  };

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const filePath = REACT_APP_INVOICE;
  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const customerCodesArray: string[] = selected.map(String);
  const analyticsParam: IRefreshAnalytics = {
    dates: [formattedDateFrom ? formattedDateFrom : '', formattedDateFrom ? formattedDateFrom : ''],
    memCode: customerCodesArray,
    userId: '',
    storeId: [0], 
    selectedItem: selectedItem,
  }

  const updatedParam = {
    Path: filePath,
    analyticsParamsDto: analyticsParam, 
  }

  const fetchGenerateInvoice1 = async () => {
    try {
      console.log("selectedItem",selectedItem);
      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/AccountingGenerateInvoice`,
        data: updatedParam,
      };

      axios(getAnalytics)
      .then(async (response) => {
        setGeneratedInvoice([]);
        setGeneratedInvoice(response.data);
        console.log("generate invoice",response.data);
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
  }

  useEffect(() => {
    if(formattedDateFrom)
    {
      setLoading(true)
      setGeneratedInvoice([]);
      const fetchGenerateInvoice = async () => {
        fetchGenerateInvoice1();
      };

      fetchGenerateInvoice();
    }
  }, [REACT_APP_API_ENDPOINT, formattedDateFrom, selected]);

  useEffect(() => {
    const defaultDate = dayjs().startOf('day').subtract(1, 'day');
    setSelectedDateFrom(defaultDate);
    setLoading(false)
  }, []);

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  useEffect(() => {
    document.title = 'Accounting | Generate Invoice';
  }, []);

  const handleRefreshClick = () => {
    setLoading(true)
    fetchGenerateInvoice1();
  };

    const checkFolderPath = async (path: string) => {
    try {
      const response = await axios.get(`${REACT_APP_API_ENDPOINT}/Analytics/CheckFolderPath?path=${encodeURIComponent(path)}`);
      return response.data;
    } catch (error) {
        throw new Error('Error checking folder existence.');
    }
  };

  const handleOpenGenInvoice = () => {
    setOpenGenInvoice(true);
  };

  const handleCloseGenInvoice = useCallback(() => {
    setOpenGenInvoice(false);
  }, []);

  const handleGenInvoiceClick = async () => {
    try {
      setRefreshing(true)
      setOpenGenInvoice(false);
      if (REACT_APP_INVOICE !== undefined && REACT_APP_INVOICE !== null) {
        const filePath = REACT_APP_INVOICE;
        const folderExists = await checkFolderPath(filePath);
        if (!folderExists) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('The folder path does not exist or is invalid.');
          setOpenGenInvoice(false);
          setRefreshing(false);
          return;
        }
        const generateInvoice: AxiosRequestConfig = {
          method: 'POST',
          url: `${REACT_APP_API_ENDPOINT}/Analytics/GenerateA0File`,
          data: updatedParam,
        };
  
        axios(generateInvoice)
        .then((result) => {
            var message = result.data.Message;
            var content = result.data.Content;
            var fileName = result.data.FileName;
            if(message === 'Invoice Generated Successfully')
            {
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
          
              const a = document.createElement('a');
              a.href = url;
              a.download = fileName
              document.body.appendChild(a);
              a.click();
          
              // Cleanup
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              setIsSnackbarOpen(true);
              fetchGenerateInvoice1();
              setSnackbarSeverity('success');
              setMessage('Invoice Generated Successfully');
              setOpenGenInvoice(false);
              setRefreshing(false);
            }
            else
            {
              setIsSnackbarOpen(true);
              setSnackbarSeverity('error');
              setMessage('Error generating invoice. Please check and try again.');
              setOpenGenInvoice(false);
              setRefreshing(false);
            }
        })
        .catch((error) => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error generating invoice');
          setOpenGenInvoice(false);
          setRefreshing(false);
        })
      }

    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error generating invoice');
        setOpenGenInvoice(false);
        setRefreshing(false);
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
      <Backdrop
        sx={{ color: '#ffffff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={refreshing}
      >
        <CircularProgress size="100px" sx={{ color: '#ffffff' }} />
      </Backdrop>
      <Paper elevation={3} sx={{ padding: '20px', maxWidth: '100%', borderRadius: '15px', height: '780px' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#1C2C5A', }}>
          Generate Invoice
        </Typography>
        <Divider sx={{ marginBottom: '20px' }} />
        <Grid container spacing={1} alignItems="flex-start" direction={'row'}>
          <Grid item>
            <CustomerDropdown setSelected={setSelected}  selection='single' setSelectedCustomerName={setSelectedItem} byMerchant={false} isAllVisible={false} isTextSearch={false} fromPage={"generateinvoice"}/>
            {/* <TextField
              variant="outlined"
              size="small"
              type="text"
              required
              select
              label="Merchant"
              value={selected}// Default to an empty string if undefined
              onChange={(e) => handleChange(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '40px',
                  backgroundColor: '#FFFFFF',
                  height: '40px',
                  width: '295px',
                  fontSize: '14px',
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
            </TextField> */}
          </Grid>
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
          <Grid item>
            <BootstrapButton
              sx={{
                color: "white",
                fontSize: "14px",
                backgroundColor: "#1C3766",
                width: "150px",
                borderRadius: "20px",
                fontFamily: 'Inter',
                fontWeight: '900',
                height: '38px',
                paddingRight: '15px',
                //borderColor: isGenerated ? 'inherit' : '#1C3766',
                '& .MuiTypography-root': {
                  fontSize: '14px',
                }
              }}
              onClick={handleRefreshClick}
              // disabled={isGenerated ? true : false}
            >
              <SyncIcon sx={{marginRight: '5px'}} />
              <Typography>
                Refresh
              </Typography>
            </BootstrapButton>
          </Grid>
          <Grid item>
            <BootstrapButton
              sx={{
                color: "white",
                fontSize: "14px",
                backgroundColor: "#1C3766",
                width: "250px",
                borderRadius: "20px",
                fontFamily: 'Inter',
                fontWeight: '900',
                height: '38px',
                paddingRight: '15px',
                //borderColor: isGenerated ? 'inherit' : '#1C3766',
                '& .MuiTypography-root': {
                  fontSize: '14px',
                }
              }}
              onClick={handleOpenGenInvoice}
              // disabled={isGenerated ? true : false}
            >
              <ReceiptLongIcon sx={{marginRight: '5px'}} />
              <Typography>
                Generate Invoice
              </Typography>
            </BootstrapButton>
          </Grid>
        </Grid>     
        <Divider sx={{ marginTop: '20px' }} />
          <CustomScrollbarBox component={Paper}
            sx={{
              height: '660px',
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
            borderSpacing: '0px 4px',
          }}
          aria-label="spanning table">
          <TableHead
            sx={{
              zIndex: 3,
              position: 'sticky',
              top: '-10px',
              backgroundColor: '#ffffff',
            }}
          >
              <TableRow sx={{ minWidth: 700 }}>
                <StyledTableCell style={{ textAlign: 'center',  }}></StyledTableCell>
                <StyledTableCell style={{ textAlign: 'center',  }}>Location / Club</StyledTableCell>
                <StyledTableCell style={{ textAlign: 'center',  }}>Date</StyledTableCell>
                <StyledTableCell style={{ textAlign: 'center',  }}>Status</StyledTableCell>
                <StyledTableCell style={{ textAlign: 'center',  }}></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading ? (
                generatedInvoice.map((item: IAccntGenerateInvoice) => (
                <TableRow key={item.Id} sx={{ "& td": { border: 0 }}}>
                  <StyledTableCellSmall style={{ width: '400px' }}></StyledTableCellSmall>
                  <StyledTableCellSmall style={{ textAlign: 'left', width: '200px' }}>{item.Location}</StyledTableCellSmall>
                  <StyledTableCellSmall style={{ textAlign: 'center', width: '200px'  }}> {item.Date !== null
                    ? new Date(item.Date ?? '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short', // or 'long' for full month name
                        day: 'numeric',
                      })
                    : ''}
                  </StyledTableCellSmall>
                  <StyledTableCellSmall 
                    style={{ 
                      width: '200px',
                      borderRadius: '10px',
                      textAlign: 'center', 
                      backgroundColor: item.SubmitStatus === 0 ? '#FFB5B5' : item.SubmitStatus === 3 ? item.IsGenerated === true ? '#BEFCBE' : '#E3FBE3' : '#FFCF97',
                      color: item.SubmitStatus === 0 ? '#A85A5A' : item.SubmitStatus === 3 ? item.IsGenerated === true ? '#375037' : '#3F743F' : '#634422',
                    }}
                  >
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', }}>
                      {item.SubmitStatus === 0 ? (
                        <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      ) : item.SubmitStatus === 3 ? (
                        item.IsGenerated === true ? (
                          <DoneAllIcon style={{ color: '#284628', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : (
                          <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        )
                      ) : (
                        <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                      )}
                      {item.SubmitStatus === 0 ? 'No Analytics' : item.SubmitStatus === 3 ? item.IsGenerated === true ? 'Generated' : 'Submitted' : 'Pending'}
                    </span>
                  </StyledTableCellSmall>
                  <StyledTableCellSmall style={{ width: '400px' }}></StyledTableCellSmall>
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
        title='Generate Invoice'
        onClose={handleCloseGenInvoice}
        buttonName='Generate'
        open={openGenInvoice}
        onSave={handleGenInvoiceClick}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={8}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '20px'
                }}>
                <Typography sx={{ fontSize: '25px', textAlign: 'center', marginRight: '-170px' }}>
                  Are you sure you want to generate invoice?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        } 
      />
    </Box>
  )
}

export default AccountingGenerateInvoice
