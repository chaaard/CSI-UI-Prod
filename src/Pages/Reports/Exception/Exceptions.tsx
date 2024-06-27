import { Alert,  Box,  CircularProgress,  Divider,  Fade, Grid, IconButton, MenuItem,  Paper,  Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, TextFieldProps, Typography, styled, } from '@mui/material';
import { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SummarizeIcon from '@mui/icons-material/Summarize';
import IAnalyticProps from '../../Common/Interface/IAnalyticsProps';
import IExceptionGenerateReport from '../../Common/Interface/IExceptionGenerateReport';
import * as ExcelJS from 'exceljs';
import { insertLogs } from '../../../Components/Functions/InsertLogs';
import CustomerDropdown from '../../../Components/Common/CustomerDropdown';
import ICustomerDropdown from '../../Common/Interface/ICustomerDropdown';

interface IRowData {
  [key: string]: string | number;
  'ID': number;
  'Customer Name': string;
  'JO Number': string;
  'Transaction Date': string;
  'Amount': number;
  'Adjustment Type': string;
  'Source': string;
  'Status': string;
  'Location Name': string,
  'Old JO': string; 
  'Current JO / New JO': string,
  'Old Customer ID': string; 
  'New Customer ID': string; 
  'Dispute Reference Number': string,
  'Dispute Amount': number; 
  'Date Dispute Filed': string,
  'Description of Dispute': string; 
  'Accounts Payment Date': string,
  'Accounts Payment Trans No': string; 
  'Accounts Payment Amount': number,
  'Reason': string; 
  'Descriptions': string; 
}

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

const customerCodes: ICustomerCodes[] = [
  { CustomerId: ["9999011929","9999011955", "9999011931", "9999011935", "9999011838", "9999011855", "9999011926"], CustomerName: "All" },
  { CustomerId: ["9999011929"], CustomerName: "Grab Food" },
  { CustomerId: ["9999011955"], CustomerName: "Grab Mart" },
  { CustomerId: ["9999011931"], CustomerName: "Pick A Roo Merchandise" },
  { CustomerId: ["9999011935"], CustomerName: "Pick A Roo FS" },
  { CustomerId: ["9999011838"], CustomerName: "Food Panda" },
  { CustomerId: ["9999011855"], CustomerName: "MetroMart" },
  { CustomerId: ["9999011926"], CustomerName: "GCash" },
];

interface ICustomerCodes
{
  CustomerId: string[],
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

const Exceptions = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [exceptions, setExceptions] = useState<IExceptionGenerateReport[]>([]);
  //const [selected, setSelected] = useState<string[]>(["9999011929","9999011955", "9999011931", "9999011935", "9999011838", "9999011855", "9999011926"]);
  const [selected, setSelected] = useState<string[]>([] as string[]);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [clubs, setClubs] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getRoleId = window.localStorage.getItem('roleId');
  const getClub = window.localStorage.getItem('club');
  const getId = window.localStorage.getItem('Id');
  
  useEffect(() => {
    document.title = 'CSI | Exception Reports';
  }, []);

  let club =  0;
  if(getClub !== null)
  {
    club = parseInt(getClub, 10);
  }

  let roleId = 0;
  if(getRoleId !== null)
  {
    roleId = parseInt(getRoleId, 10);
  }

  let Id = "";
  if(getId !== null)
  {
    Id = getId;
  }


  const handleChange = (value: any)  => {
    setSelected([])
    const sanitizedValue = value !== undefined ? value : '';
    setSelected(sanitizedValue);
  };

  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };
  
  const handleChangeDateTo = (newValue: Dayjs | null) => {
    setSelectedDateTo(newValue);
  };

  useEffect(() => {
    const defaultDate = dayjs();
    setSelectedDateFrom(defaultDate);
    setSelectedDateTo(defaultDate);
  }, []);

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

  const handleExportExceptions = async () => {

    try {
      if(exceptions.length >= 1)
      {
        const header = [
          'ID',
          'Customer Name',
          'JO Number',
          'Transaction Date',
          'Amount',
          'Adjustment Type',
          'Source',
          'Status',
          'Location Name',
          'Old JO',
          'Current JO / New JO',
          'Old Customer ID',
          'New Customer ID',
          'Dispute Reference Number',
          'Dispute Amount',
          'Date Dispute Filed',
          'Description of Dispute',
          'Accounts Payment Date',
          'Accounts Payment Trans No',
          'Accounts Payment Amount',
          'Reason',
          'Descriptions',
        ];

        // Format the data before adding it to the worksheet
        const formattedData = exceptions.map((item: IExceptionGenerateReport) => {
          const transactionDate = item.TransactionDate ? new Date(item.TransactionDate) :  null;
          const disputeFiledDate = item.DateDisputeFiled ? new Date(item.DateDisputeFiled) : null;
          const accountPaymentsDate = item.AccountsPaymentDate ? new Date(item.AccountsPaymentDate) : null;
          
          const formatDate = (date: Date | null) => {
            if (!date) return '-';
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          };
          
          return {
            ID: item.Id ?? 0,
            'Customer Name': item.CustomerId ?? '-',
            'JO Number': item.JoNumber ?? '-',
            'Transaction Date': formatDate(transactionDate),
            Amount: item.Amount ?? 0.00,
            'Adjustment Type': item.AdjustmentType ?? '-',
            Source: item.Source ?? '-',
            Status: item.Status ?? '-',
            'Location Name': item.LocationName ?? '-',
            'Old JO': item.OldJo ?? '-',
            'Current JO / New JO': item.NewJo ?? '-',
            'Old Customer ID': item.OldCustomerId ?? '-',
            'New Customer ID':item.NewCustomerId ?? '-',
            'Dispute Reference Number': item.DisputeReferenceNumber ?? '-',
            'Dispute Amount': item.DisputeAmount ?? 0.00,
            'Date Dispute Filed': formatDate(disputeFiledDate),
            'Description of Dispute': item.DescriptionOfDispute ?? '-',
            'Accounts Payment Date': formatDate(accountPaymentsDate),
            'Accounts Payment Trans No': item.AccountsPaymentTransNo ?? '-',
            'Accounts Payment Amount': item.AccountsPaymentAmount ?? 0.00 ,
            Reason: item.ReasonDesc ?? '-',
            Descriptions: item.Descriptions ?? '-',
          };
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Exception Report`);

        header.forEach((headerText, index) => {
          worksheet.getCell(`${String.fromCharCode(65 + index)}1`).value = headerText;
        });

        formattedData.forEach((rowData: IRowData, rowIndex: number) => {
          Object.keys(rowData).forEach((key, colIndex) => {
            worksheet.getCell(`${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`).value = rowData[key];
          });
        });

        formattedData.forEach((_rowData: IRowData, rowIndex: number) => {
          Object.keys(formattedData[0]).forEach((_value, colIndex: number) => {
            const cell = worksheet.getCell(`${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`);

            if (['Amount', 'Dispute Amount', 'Accounts Payment Amount'].includes(header[colIndex]) && cell.value !== null && cell.value !== undefined) {
              cell.value = parseFloat(cell.value.toString());
              cell.numFmt = '#,##0.00;(#,##0.00)';
            }
          });
        });

        header.forEach((_value, colIndex: number) => {
            const cell = worksheet.getCell(`${String.fromCharCode(65 + colIndex)}1`);
            cell.alignment = {
              horizontal: 'center',
              vertical: 'bottom',
            };
            cell.font = { bold: true }; 
            worksheet.getColumn(colIndex + 1).width = 15;
          });

        const blob = await workbook.xlsx.writeBuffer();
        const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}_${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}${currentDate.getSeconds().toString().padStart(2, '0')}`;
        const filename = `exception_report_${formattedDate}.xlsx`;
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.click();
    
        // Clean up the URL object
        URL.revokeObjectURL(blobUrl);

        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setMessage('Generate exception report successfully extracted.');

        const anaylticsParamUpdated: IAnalyticProps = {
          dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
          memCode:  selected ?? [],
          userId: Id,
          remarks: "Successfully Generated",
          storeId: roleId === 2 ? [club] : clubs,
          action: 'Exceptions Report',
          fileName: filename
        };

        await insertLogs(anaylticsParamUpdated);
      }
      else
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('warning');
        setMessage('No exception report found.');
      }
    } catch (error) {
        console.log(error)
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error extracting exception report');
    } 
  };

  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const formattedDateTo = selectedDateTo?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const anaylticsParam: IAnalyticProps = {
    dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
    memCode: selected ?? [],
    userId: Id,
    storeId: roleId === 2 ? [club] : clubs,
    action: 'Exceptions Report'
  };

  useEffect(() => {
    if(formattedDateFrom)
    {
      fetchGetClubs();
      const fetchGenerateInvoice = async () => {
        try {
          const getAnalytics: AxiosRequestConfig = {
            method: 'POST',
            url: `${REACT_APP_API_ENDPOINT}/Analytics/ExportExceptions`,
            data: anaylticsParam,
          };
    
          axios(getAnalytics)
          .then(async (response) => {
            setExceptions(response.data as IExceptionGenerateReport[]);
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
            Exception Reports
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
              height: '450px',
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
                <TableRow>
                  <StyledTableCell>Customer Name</StyledTableCell>
                  <StyledTableCell>Order No</StyledTableCell>
                  <StyledTableCell>Transaction Date</StyledTableCell>
                  <StyledTableCell>Amount</StyledTableCell>
                  <StyledTableCell>Adjustment Type</StyledTableCell>
                  <StyledTableCell>Source</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Location</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  exceptions.length === 0
                    ?
                    <TableRow hover>
                      <TableCell align="center" colSpan={15} sx={{ color: '#1C2C5A' }}>No Data</TableCell>
                    </TableRow>
                    :
                    exceptions.map((item: IExceptionGenerateReport) => {
                      return (
                        <TableRow hover key={item.Id}>
                          <StyledTableCellSmall>{item.CustomerId}</StyledTableCellSmall>
                          <StyledTableCellSmall>{item.JoNumber}</StyledTableCellSmall>
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
                          <StyledTableCellSmall>
                            {
                              item.Amount != null
                              ? (item.Amount >= 1000
                                ? item.Amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : item.Amount.toFixed(2))
                              : '0.00'
                            }
                          </StyledTableCellSmall>
                          <StyledTableCellSmall>{item.AdjustmentType}</StyledTableCellSmall>
                          <StyledTableCellSmall>{item.Source}</StyledTableCellSmall>
                          <StyledTableCellSmall>{item.Status}</StyledTableCellSmall>
                          <StyledTableCellSmall>{item.LocationName}</StyledTableCellSmall>
                        </TableRow>
                      );
                    })}
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

export default Exceptions