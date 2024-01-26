import { Box, Typography, styled, CircularProgress, Pagination, Grid, TextField, TextFieldProps, MenuItem, IconButton, Snackbar, Fade, Alert } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import SummarizeIcon from '@mui/icons-material/Summarize';
import IAnalyticProps from '../../Common/Interface/IAnalyticsProps';
import axios, { AxiosRequestConfig } from 'axios';
import IWeeklyReport from '../../Common/Interface/IWeeklyReport';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';

interface RowData {
  [key: string]: string | number;
  LOCATION: string;
  DATE: string;
  'MEMBERSHIP NUMBER': string;
  'REGISTER NO.': string;
  'TRX NO.': string;
  'ORDER NO.': string;
  'QTY PURCHASED': number;
  SUBTOTAL: number; // Assuming it's a string, adjust as needed
  'ORIGINAL AMT.': number; // Assuming it's a string, adjust as needed
  'ACCOUNTS PAYMENT': string;
  'AP TRX': string;
  'TOTAL BILLED': number;
}

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

interface ICustomerCodes
{
  CustomerId: string,
  CustomerName: string,
}

const WeeklyDelivery = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem('club');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [selected, setSelected] = useState<string>('9999011929');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message

  useEffect(() => {
    document.title = 'Maintenance | Weekly Delivery Report';
  }, []);

  let club = 0;
  if(getClub !== null)
  {
    club = parseInt(getClub, 10);
  }

  useEffect(() => {
    const defaultDate = dayjs();
    const currentDate = dayjs();
    setSelectedDateFrom(defaultDate);
    setSelectedDateTo(currentDate);
    setLoading(false)
  }, []);

  const handleChange = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelected(sanitizedValue);
  };

  // Handle closing the snackbar
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

  const handleGenerateWeeklyReport = async () => {
    try {
      const currentDate: Date = new Date();

      const hours: number = currentDate.getHours();
      const minutes: number = currentDate.getMinutes();
      const seconds: number = currentDate.getSeconds();
      
      const formattedHours: string = hours < 10 ? "0" + hours : hours.toString();
      const formattedMinutes: string = minutes < 10 ? "0" + minutes : minutes.toString();
      const formattedSeconds: string = seconds < 10 ? "0" + seconds : seconds.toString();
            
      const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const formattedDateTo = selectedDateTo?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const anaylticsParam: IAnalyticProps = {
        dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
        memCode: [selected],
        userId: '',
        storeId: [club],
      };

      const generateWeeklyReport: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GenerateWeeklyReport`,
        data: anaylticsParam,
      };

      axios(generateWeeklyReport)
      .then(async (result) => {
        var weeklyReport = result.data;
        var customer = customerCodes.find(item => item.CustomerId === selected);
        var dateRange = (selectedDateFrom ?? dayjs()).format('MMMM DD-') + (selectedDateTo ?? dayjs()).format('DD, YYYY');
        var fileName = `Weekly Report - ${dateRange}_${formattedHours}${formattedMinutes}${formattedSeconds}`;
        var customerName = "";
        if(customer?.CustomerName.includes('Grab'))
        {
          customerName = "Grab Store Transactions"
        }
        const header = ['LOCATION', 'DATE', 'MEMBERSHIP NUMBER', 'REGISTER NO.', 'TRX NO.', 'ORDER NO.', 'QTY PURCHASED', 'SUBTOTAL', 'ORIGINAL AMT.', 'ACCOUNTS PAYMENT', 'AP TRX', 'TOTAL BILLED'];
        const subHeader = ['', 'DATE', 'SA AMOUNT', 'No of trx', 'Per invoice Entry', 'VARIANCE', 'REMARKS'];
        const additionalHeaders = [customerName, dateRange];

        // Format the data before adding it to the worksheet
        const formattedData = weeklyReport.map((item: any) => {
          const transactionDate = item.TransactionDate ? new Date(item.TransactionDate) : null;
        
          return {
            LOCATION: item.LocationName,
            DATE: transactionDate ? `${transactionDate.getFullYear()}-${(transactionDate.getMonth() + 1).toString().padStart(2, '0')}-${transactionDate.getDate().toString().padStart(2, '0')}` : '',
            'MEMBERSHIP NUMBER': item.MembershipNo,
            'REGISTER NO.': item.RegisterNo,
            'TRX NO.': item.TransactionNo,
            'ORDER NO.': item.OrderNo,
            'QTY PURCHASED': item.Qty,
            SUBTOTAL: item.SubTotal.toFixed(2), // Format as decimal with two decimal places
            'ORIGINAL AMT.': item.OriginalAmout.toFixed(2), // Format as decimal with two decimal places
            'ACCOUNTS PAYMENT': item.AccountsPayment,
            'AP TRX': item.APTRX,
            'TOTAL BILLED': item.TotalBilled
          };
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('WeeklyReport');

        worksheet.getCell('A1').value = additionalHeaders[0];
        worksheet.getCell('A1').font = { bold: true }; 
        worksheet.getCell('A2').value = additionalHeaders[1];

        header.forEach((headerText, index) => {
          worksheet.getCell(`${String.fromCharCode(65 + index)}4`).value = headerText;
        });

        formattedData.forEach((rowData: RowData, rowIndex: number) => {
          Object.keys(rowData).forEach((key, colIndex) => {
            worksheet.getCell(`${String.fromCharCode(65 + colIndex)}${rowIndex + 5}`).value = rowData[key];
          });
        });

        const borderHeaderStyle: Partial<ExcelJS.Border> = { style: 'medium', color: { argb: '00000000' } }; 
        const borderStyle: Partial<ExcelJS.Border> = { style: 'thin', color: { argb: '00000000' } }; 
        header.forEach((_value, colIndex: number) => {
          const cell = worksheet.getCell(`${String.fromCharCode(65 + colIndex)}4`);
          cell.alignment = {
            horizontal: 'center',
            vertical: 'bottom',
          };
          cell.border = {
            top: borderHeaderStyle,
            left: borderHeaderStyle,
            bottom: borderHeaderStyle,
            right: borderHeaderStyle,
          };
          cell.font = { bold: true }; 
          worksheet.getColumn(colIndex + 1).width = 15;

          if (header[colIndex] === 'LOCATION' || header[colIndex] === 'QTY PURCHASED') {
            worksheet.getColumn(colIndex + 1).width = 20;
          }

          if (header[colIndex] === 'MEMBERSHIP NUMBER') {
            worksheet.getColumn(colIndex + 1).width = 25;
          }

          if (header[colIndex] === 'ACCOUNTS PAYMENT') {
            cell.alignment = { 
              wrapText: true,
              horizontal: 'center',
              vertical: 'bottom',
            };
            worksheet.getColumn(colIndex + 1).width = 15;
          }// Optional: Make the text bold
        });

        formattedData.forEach((_rowData: RowData, rowIndex: number) => {
          Object.keys(formattedData[0]).forEach((_value, colIndex: number) => {
            const cell = worksheet.getCell(`${String.fromCharCode(65 + colIndex)}${rowIndex + 5}`);
            cell.border = {
              top: borderStyle,
              left: borderStyle,
              bottom: borderStyle,
              right: borderStyle,
            };

            if (['LOCATION', 'DATE', 'MEMBERSHIP NUMBER'].includes(header[colIndex])) {
              cell.alignment = {
                horizontal: 'center',
                vertical: 'middle',
              };
            }

            if (['REGISTER NO.', 'TRX NO.', 'QTY PURCHASED'].includes(header[colIndex])) {
              cell.alignment = {
                horizontal: 'right',
                vertical: 'middle',
              };
            }

            if (['ORIGINAL AMT.', 'SUBTOTAL'].includes(header[colIndex]) && cell.value !== null && cell.value !== undefined) {
              cell.value = parseFloat(cell.value.toString()); // Convert to number
              cell.numFmt = '#,##0.00'; // Optional: Format as currency with two decimal places
            }

            if (header[colIndex] === 'TOTAL BILLED') {
              const subtotalCellRef = `${String.fromCharCode(73)}${rowIndex + 5}`; // Assuming 'I' is the column for 'SUBTOTAL'
              cell.value = { formula: `SUM(${subtotalCellRef})` }; 
              cell.font = { bold: true }; 
              cell.numFmt = '#,##0.00';
            }
          });
        });

        const lastRow = formattedData.length + 5;
        const countaFormula = `COUNTA(E5:E${lastRow - 1})`;
        const sumFormulaI = `SUM(I5:I${lastRow - 1})`;

        worksheet.getCell(`C${lastRow}`).value = 'TOTAL SALES';
        worksheet.getCell(`E${lastRow}`).value = { formula: countaFormula };
        worksheet.getCell(`I${lastRow}`).value = { formula: sumFormulaI };
        worksheet.getCell(`L${lastRow}`).value = { formula: `SUM(L5:L${lastRow - 1})` };

        // Apply borders and formatting to the last row
        ['C', 'E', 'I', 'L'].forEach((column) => {
          const cell = worksheet.getCell(`${column}${lastRow}`);
          cell.font = { bold: true };
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
        });

        ['I', 'L'].forEach((column) => {
          const cell = worksheet.getCell(`${column}${lastRow}`);
          cell.font = { bold: true };
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
          cell.numFmt = '#,##0.00';
        });

        const recapSummaryRow = lastRow + 2; // Assuming the last row is calculated in the previous code

        // Insert 'RECAP SUMMARY' title
        worksheet.getCell(`A${recapSummaryRow}`).value = 'RECAP SUMMARY';
        worksheet.getCell(`A${recapSummaryRow}`).font = { bold: true };

        subHeader.forEach((headerText, index) => {
          worksheet.getCell(`${String.fromCharCode(65 + index)}${recapSummaryRow + 1}`).value = headerText;
        });

        header.forEach((_value, colIndex: number) => {
          const cell = worksheet.getCell(`${String.fromCharCode(65 + colIndex)}${recapSummaryRow + 1}`);
          cell.alignment = {
            horizontal: 'center',
            vertical: 'bottom',
          };
          cell.font = { bold: true }; 
        });

        // Add the additional headers to the worksheet
        const blob = await workbook.xlsx.writeBuffer();
        const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    
        // Create a link and click it to trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName + '.xlsx';
        link.click();
    
        // Clean up the URL object
        URL.revokeObjectURL(blobUrl);

        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setMessage('Weekly report generated successfully');
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error generating report');
        console.log(error)
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error generating report');
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
                        width: '250px',
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
                        width: '250px',
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
                  width: '315px',
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
          <Grid item xs={3.3} sx={{ paddingTop: '15px' }}>
            <BootstrapButton
              sx={{
                color: "white",
                fontSize: "16px",
                backgroundColor: "#1C3766",
                width: "100%",
                borderRadius: "20px",
                fontFamily: 'Inter',
                fontWeight: '900',
              }}
              onClick={handleGenerateWeeklyReport}
            >
            <SummarizeIcon sx={{marginRight: '5px'}} />
              <Typography>
                Generate Weekly Report
              </Typography>
            </BootstrapButton>
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

export default WeeklyDelivery
