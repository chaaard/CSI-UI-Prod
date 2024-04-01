import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, CircularProgress, Pagination, Grid, TextField, TextFieldProps, MenuItem, IconButton, Snackbar, Fade, Alert, Paper, Divider } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import IAccntGenerateInvoice from '../../Pages/Common/Interface/IAccntGenerateInvoice';
import {ReceiptLong as ReceiptLongIcon} from '@mui/icons-material/';
import CheckIcon from '@mui/icons-material/Check';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';


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
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<IAccntGenerateInvoice[]>([]);
  const [selected, setSelected] = useState<string>('9999011929');

  const handleChange = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelected(sanitizedValue);
  };

  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const anaylticsParam = {
    memCode: selected,
    date: formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '',
  };

  useEffect(() => {
    if(formattedDateFrom)
    {
      setLoading(true)
      setGeneratedInvoice([]);
      const fetchGenerateInvoice = async () => {
        try {
          const getAnalytics: AxiosRequestConfig = {
            method: 'POST',
            url: `${REACT_APP_API_ENDPOINT}/Analytics/AccountingGenerateInvoice`,
            data: anaylticsParam,
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
            Generate Invoice
          </Typography>
          <Divider sx={{ marginBottom: '20px' }} />
          <Grid container spacing={1} alignItems="flex-start" direction={'row'}>
            <Grid item>
              <TextField
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
              </TextField>
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
                  width: "295px",
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
                // onClick={handleOpenGenInvoice}
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
                height: '650px',
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
                        backgroundColor: item.SubmitStatus === 0 ? '#FFB5B5' : item.SubmitStatus === 3 ? '#E3FBE3' : '#FFCF97',
                        color: item.SubmitStatus === 0 ? '#A85A5A' : item.SubmitStatus === 3 ? '#3F743F' : '#634422',
                      }}
                    >
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', }}>
                        {item.SubmitStatus === 0 ? (
                          <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : item.SubmitStatus === 3 ? (
                          <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : (
                          <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        )}
                        {item.SubmitStatus === 0 ? 'No Analytics' : item.SubmitStatus === 3 ? 'Submitted' : 'Pending'}
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

export default AccountingGenerateInvoice
