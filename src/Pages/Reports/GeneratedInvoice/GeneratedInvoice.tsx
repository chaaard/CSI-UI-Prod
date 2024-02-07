import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, CircularProgress, Pagination, Grid, TextField, TextFieldProps, MenuItem } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import IAnalyticProps from '../../Common/Interface/IAnalyticsProps';
import axios, { AxiosRequestConfig } from 'axios';
import IGeneratedInvoice from '../../Common/Interface/IGeneratedInvoice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: '900',
  color: '#1C2C5A',
}));

const StyledTableCellSmall = styled(TableCell)(({ theme }) => ({
  fontSize: "12px",
  padding: "1px",
  color: '#1C2C5A',
}));

interface ICustomerCodes
{
  CustomerId: string,
  CustomerName: string,
}

const customerCodes = [
  { CustomerId: "9999011929", CustomerName: "Grab Food" },
  { CustomerId: "9999011955", CustomerName: "Grab Mart" },
  { CustomerId: "9999011931", CustomerName: "Pick A Roo Merchandise" },
  { CustomerId: "9999011935", CustomerName: "Pick A Roo FS" },
  { CustomerId: "9999011838", CustomerName: "Food Panda" },
  { CustomerId: "9999011855", CustomerName: "MetroMart" },
];

const GeneratedInvoice = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem('club');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<IGeneratedInvoice[]>([]);
  const [selected, setSelected] = useState<string>('9999011929');
  const [clubs, setClubs] = useState<number[]>([]);

  const handleChange = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelected(sanitizedValue);
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
    memCode: [selected],
    userId: '',
    storeId: clubs,
  };

  useEffect(() => {
    if(formattedDateFrom)
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
        <Grid container direction="row" alignItems="center" sx={{ padding: '8px 16px 0 -9px' }} >
          <Grid item xs={0.9}>
            <Typography variant="h6" sx={{ color: '#1C2C5A' }}>
              From:
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
            <Typography variant="h6" sx={{ color: '#1C2C5A' }}>
              To:
            </Typography>
          </Grid>
          <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="dddd, MMMM DD, YYYY"
                value={selectedDateTo}
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
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={0.9} sx={{ paddingTop: '15px' }}>
            <Typography variant="h6" sx={{ color: '#1C2C5A' }}>
              Merchant:
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
        </Grid>     
        
        <Box sx={{ position: 'relative', paddingTop: '10px' }}>
          <Table
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backgroundColor: '#FFFFFF',
              height: '50px',
            }}
          >
            <TableHead
            
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
              </TableRow>
            </TableHead>
            <TableBody>
              {generatedInvoice.map((item: IGeneratedInvoice) => (
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
              </TableRow>

              ))}
            </TableBody>
          </Table>
        </Box>
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
