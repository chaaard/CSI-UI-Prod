import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, CircularProgress, Pagination, Grid, TextField, TextFieldProps, MenuItem, IconButton, Snackbar, Fade, Alert, Paper, Divider } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import IAnalyticProps from '../../Common/Interface/IAnalyticsProps';
import axios, { AxiosRequestConfig } from 'axios';
import IGeneratedInvoice from '../../Common/Interface/IGeneratedInvoice';
import SummarizeIcon from '@mui/icons-material/Summarize';
import * as XLSX from 'xlsx';
import { insertLogs } from '../../../Components/Functions/InsertLogs';
import CustomerDropdown from '../../../Components/Common/CustomerDropdown';
import ICustomerDropdown from '../../Common/Interface/ICustomerDropdown';

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

const WhiteAlert = styled(Alert)(({ severity }) => ({
  color: '#1C2C5A',
  fontFamily: 'Inter',
  fontWeight: '700',
  fontSize: '15px',
  borderRadius: '25px',
  border:  severity === 'success' ? '1px solid #4E813D' : '1px solid #9B6B6B',
  backgroundColor: severity === 'success' ? '#E7FFDF' : '#FFC0C0',
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

const GeneratedInvoice = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem('club');
  const getId = window.localStorage.getItem('Id');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<IGeneratedInvoice[]>([]);
  //const [selected, setSelected] = useState<string>('9999011929');
  const [selected, setSelected] = useState<string[]>([] as string[]);
  const [clubs, setClubs] = useState<number[]>([]);
  const getRoleId = window.localStorage.getItem('roleId');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(''); 
        
  const handleChange = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelected(sanitizedValue);
  };

  let roleId = 0;
  if(getRoleId !== null)
  {
    roleId = parseInt(getRoleId, 10);
  }

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



   // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };
  
  const fetchGetClubs = async () => {
    try {
      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetClubs`,
      };

      axios(getAnalytics)
      .then(async (response) => {
        await setClubs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
    } catch (error) {
      console.error("Error fetching data:", error);
    } 
  }
  
  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const formattedDateTo = selectedDateTo?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const anaylticsParam: IAnalyticProps = {
    dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
    memCode: selected,
    userId: Id,
    storeId: roleId === 2 ? [club] : clubs,
    action: 'Generate Invoice Report'
  };

  useEffect(() => {
    if(formattedDateFrom && selected.length >= 1)
    {
      fetchGetClubs();
      const fetchGenerateInvoice = async () => {
        try {
          const getAnalytics: AxiosRequestConfig = {
            method: 'POST',
            url: `${REACT_APP_API_ENDPOINT}/Analytics/GetGeneratedInvoice`,
            data: anaylticsParam,
          };
    
          axios(getAnalytics)
          .then(async (response) => {
            setGeneratedInvoice(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          })
        } catch (error) {
          console.error("Error fetching data:", error);
        } 
      };

      fetchGenerateInvoice();
    }
  }, [REACT_APP_API_ENDPOINT, formattedDateFrom, formattedDateTo, selected]);

  useEffect(() => {
    const defaultDate = dayjs();
    const currentDate = dayjs();
    setSelectedDateFrom(defaultDate);
    setSelectedDateTo(currentDate);
    setLoading(false)
  }, []);

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChangeDateTo = (newValue: Dayjs | null) => {
    setSelectedDateTo(newValue);
  };

  useEffect(() => {
    document.title = 'Maintenance | Generated Invoice Report';
  }, []);

  const handleExportExceptions = async () => {
    try {
      if(generatedInvoice.length >= 1)
      {
        const worksheet = XLSX.utils.json_to_sheet(generatedInvoice);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'exceptions_report');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = `exported_data_${new Date().toISOString()}.xlsx`;
    
        // Create a download link and trigger a click event to start the download
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(dataBlob);
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setMessage('Generated invoice report successfully extracted.');

        const anaylticsParamUpdated: IAnalyticProps = {
          dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
          memCode: selected,
          userId: Id,
          storeId: roleId === 2 ? [club] : clubs,
          action: 'Generate Invoice Report',
          fileName: fileName
        };

        await insertLogs(anaylticsParamUpdated);
      }
      else
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('warning');
        setMessage('No generated invoice report found.');
      }
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error extracting generated invoice report');
    } 
  };

  if (!loading) { 
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
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#1C2C5A', }}>
            Generated Invoice Report
          </Typography>
          <Divider sx={{ marginBottom: '20px' }} />
          <Grid container direction="row" alignItems="center" sx={{ padding: '8px 16px 0 -9px' }} >
            <Grid item xs={11.1}>
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
            </Grid>
            <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
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
            </Grid>
            <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
            
              <CustomerDropdown setSelected={setSelected}  selection='single' byMerchant={false} isAllVisible={false}/>  
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
                    width: '400px',
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
            <Grid item xs={4} sx={{ paddingTop: '15px' }}>
              <BootstrapButton
                sx={{
                  color: "white",
                  fontSize: "16px",
                  backgroundColor: "#1C3766",
                  width: "77%",
                  borderRadius: "20px",
                  fontFamily: 'Inter',
                  fontWeight: '900',
                }}
                onClick={handleExportExceptions}
              >
              <SummarizeIcon sx={{marginRight: '5px'}} />
                <Typography>
                  Export Report
                </Typography>
              </BootstrapButton>
            </Grid>
          </Grid>     
          <Divider sx={{ marginTop: '20px' }} />
            <CustomScrollbarBox component={Paper}
              sx={{
                height: '470px',
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
                  <StyledTableCell style={{ textAlign: 'center',  }}>Customer No.</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Customer Name</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Invoice No.</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Invoice Date</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Transaction Date</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Location</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Reference No.</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Invoice Amount</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>FileName</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  generatedInvoice.length === 0
                    ?
                    <TableRow hover>
                      <TableCell align="center" colSpan={15} sx={{ color: '#1C2C5A' }}>No Data</TableCell>
                    </TableRow>
                    :
                    generatedInvoice.map((item: IGeneratedInvoice) => {
                      return (
                        <TableRow key={item.Id} sx={{ "& td": { border: 0 }}}>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}>{item.CustomerNo}</StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}>{item.CustomerName}</StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}>{item.InvoiceNo}</StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}> {item.InvoiceDate !== null
                            ? new Date(item.InvoiceDate ?? '').toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short', // or 'long' for full month name
                                day: 'numeric',
                              })
                            : ''}
                          </StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}> {item.TransactionDate !== null
                            ? new Date(item.TransactionDate ?? '').toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short', // or 'long' for full month name
                                day: 'numeric',
                              })
                            : ''}
                          </StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}>{item.Location}</StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}>{item.ReferenceNo}</StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'right', paddingRight: '40px' }}>
                            {item.InvoiceAmount !== null
                              ? item.InvoiceAmount >= 1000
                                ? item.InvoiceAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : item.InvoiceAmount.toFixed(2)
                              : '0.00'}
                          </StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}>{item.FileName}</StyledTableCellSmall>
                        </TableRow>
                      );
                    })
                }
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
      </Box>
    )
  } else {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress size={80} />
        <Typography variant="h6" color="textSecondary" style={{ marginTop: '16px' }}>
          Loading...
        </Typography>
      </Box>
    );
  }
}

export default GeneratedInvoice
