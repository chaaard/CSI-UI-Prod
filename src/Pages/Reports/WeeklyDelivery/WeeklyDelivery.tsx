import { Box, Typography, styled, CircularProgress, Pagination, Grid, TextField, TextFieldProps, MenuItem, IconButton, Snackbar, Fade, Alert, Autocomplete, Chip, Select, OutlinedInput, SelectChangeEvent, Paper, Divider, FormControl, InputLabel } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { ChangeEventHandler, useEffect, useState } from 'react';
import SummarizeIcon from '@mui/icons-material/Summarize';
import IAnalyticProps from '../../Common/Interface/IAnalyticsProps';
import axios, { AxiosRequestConfig } from 'axios';
import IWeeklyReport from '../../Common/Interface/IWeeklyReport';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import IRecapSummary from '../../Common/Interface/IRecapSummary';
import ILocations from '../../Common/Interface/ILocations';
import { error } from 'console';
import { insertLogs } from '../../../Components/Functions/InsertLogs';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface IRowData {
  [key: string]: string | number;
  LOCATION: string;
  DATE: string;
  'MEMBERSHIP NUMBER': string;
  'REGISTER NO.': string;
  'TRX NO.': string;
  'ORDER NO.': string;
  'QTY PURCHASED': number;
  AMOUNT: number,
  SUBTOTAL: number; 
  MEMBER: number,
  'NON MEMBER': number; 
  'ORIGINAL AMT.': number; 
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
  const getId = window.localStorage.getItem('Id');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [selected, setSelected] = useState<string>('9999011929');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(''); 
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [selectedLocationCodes, setSelectedLocationCodes] = useState<number[]>([]);
  const roleId = window.localStorage.getItem('roleId');

  const handleMenuItemClick = (locationCode: number) => {
    setSelectedLocationCodes((prevSelected) => {
      if (prevSelected.includes(locationCode)) {
        // If the location is already selected, remove it
        return prevSelected.filter((code) => code !== locationCode);
      } else {
        // If the location is not selected, add it
        return [...prevSelected, locationCode];
      }
    });
  };

  useEffect(() => {
    document.title = 'Maintenance | Weekly Delivery Report';
  }, []);

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
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Error fetching locations');
          })
      } catch (error) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error generating report');
      } 
    };
  
    fetchLocations();
  }, [REACT_APP_API_ENDPOINT]);


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
        var weeklyReport = result.data.WeeklyReport as IWeeklyReport;
        var recapSummary = result.data.RecapSummary as IRecapSummary;
        var customer = customerCodes.find(item => item.CustomerId === selected);
        var dateRange = (selectedDateFrom ?? dayjs()).format('MMMM DD-') + (selectedDateTo ?? dayjs()).format('DD, YYYY');
        var customerName = "";
        var sheetName = "";
        if(customer?.CustomerName.includes('Grab Food'))
        {
          customerName = "GrabFood Store Transactions"
          sheetName = "Grab Food"
        }
        else if(customer?.CustomerName.includes('Grab Mart'))
        {
          customerName = "GrabMart Store Transactions"
          sheetName = "Grab Mart"
        }
        else if(customer?.CustomerName.includes('Pick A Roo Merchandise'))
        {
          customerName = "Pick A Roo Merch Store Transactions"
          sheetName = "Pick A Roo Merch"
        }
        else if(customer?.CustomerName.includes('Pick A Roo FS'))
        {
          customerName = "Pick A Roo FS Store Transactions"
          sheetName = "Pick A Roo FS"
        }
        else if(customer?.CustomerName.includes('Food Panda'))
        {
          customerName = "Food Panda Store Transactions"
          sheetName = "Food Panda"
        }
        else
        {
          customerName = "MetroMart Store Transactions"
          sheetName = "MetroMart"
        }

        var fileName = `${customerName} - ${club} - ${dateRange}_${formattedHours}${formattedMinutes}${formattedSeconds}`;
        const header = ['LOCATION', 'DATE', 'MEMBERSHIP NUMBER', 'REGISTER NO.', 'TRX NO.', 'ORDER NO.', 'QTY PURCHASED', 'AMOUNT', 'SUBTOTAL', 'MEMBER', 'NON MEMBER', 'ORIGINAL AMT.', 'ACCOUNTS PAYMENT', 'AP TRX', 'TOTAL BILLED'];
        const subHeader = ['Day Of Week', 'DATE', 'SA AMOUNT', 'No of trx', 'Per invoice Entry', 'VARIANCE', 'REMARKS'];
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
            AMOUNT:  item.Amount ? item.Amount.toFixed(2) : null, 
            SUBTOTAL:  item.SubTotal ? item.SubTotal.toFixed(2) : null,  
            MEMBER: item.Member ? item.Member.toFixed(2) : null,
            'NON MEMBER': item.NonMember ? item.NonMember.toFixed(2) : null, 
            'ORIGINAL AMT.': item.OriginalAmout ? item.OriginalAmout.toFixed(2) : null, 
            'ACCOUNTS PAYMENT': item.AccountsPayment,
            'AP TRX': item.APTRX,
            'TOTAL BILLED': item.TotalBilled
          };
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${sheetName} - ${club}`);

        worksheet.getCell('A1').value = additionalHeaders[0];
        worksheet.getCell('A1').font = { bold: true }; 
        worksheet.getCell('A2').value = additionalHeaders[1];

        header.forEach((headerText, index) => {
          worksheet.getCell(`${String.fromCharCode(65 + index)}4`).value = headerText;
        });

        formattedData.forEach((rowData: IRowData, rowIndex: number) => {
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

          if (header[colIndex] === 'TRX NO.') {
            worksheet.getColumn(colIndex + 1).width = 25;
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

        formattedData.forEach((_rowData: IRowData, rowIndex: number) => {
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

            if (['ORIGINAL AMT.', 'SUBTOTAL', 'MEMBER', 'NON MEMBER', 'AMOUNT'].includes(header[colIndex]) && cell.value !== null && cell.value !== undefined) {
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

        //TOTAL SALES
        const lastRow = formattedData.length + 5;
        const countaFormula = `COUNTA(E5:E${lastRow - 1})`;
        const sumFormulaI = `SUM(I5:I${lastRow - 1})`;

        worksheet.getCell(`C${lastRow}`).value = 'TOTAL SALES';
        worksheet.getCell(`E${lastRow}`).value = { formula: countaFormula };
        worksheet.getCell(`I${lastRow}`).value = { formula: sumFormulaI };
        worksheet.getCell(`L${lastRow}`).value = { formula: `SUM(L5:L${lastRow - 1})` };
        worksheet.getCell(`J${lastRow}`).value = { formula: `SUM(J5:J${lastRow - 1})` };
        worksheet.getCell(`K${lastRow}`).value = { formula: `SUM(K5:K${lastRow - 1})` };
        worksheet.getCell(`M${lastRow}`).value = { formula: `SUM(M5:M${lastRow - 1})` };
        worksheet.getCell(`O${lastRow}`).value = { formula: `SUM(O5:O${lastRow - 1})` };
        worksheet.getCell(`H${lastRow}`).value = { formula: `SUM(H5:H${lastRow - 1})` };

        // Apply borders and formatting to the last row
        ['C', 'E', 'I', 'L', 'J', 'K', 'M', 'O', 'H'].forEach((column) => {
          const cell = worksheet.getCell(`${column}${lastRow}`);
          cell.font = { bold: true, color: { argb: 'FF0000' } };
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
          
        });

        ['I', 'L', 'J', 'K', 'M', 'O', 'H'].forEach((column) => {
          const cell = worksheet.getCell(`${column}${lastRow}`);
          cell.font = { bold: true, color: { argb: 'FF0000' } };
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
          cell.numFmt = '#,##0.00';
        });

        //RECAP SUMMARY
        const recapSummaryRow = lastRow + 2; // Assuming the last row is calculated in the previous code

        // Insert 'RECAP SUMMARY' title
        worksheet.getCell(`A${recapSummaryRow}`).value = 'RECAP SUMMARY';
        worksheet.getCell(`A${recapSummaryRow}`).font = { bold: true, name: 'Calibri Light' };
        worksheet.getCell(`A${recapSummaryRow}`).alignment = {  wrapText: true,  horizontal: 'center',  vertical: 'middle' };

        // Define the range of cells to merge
          const mergeRange = `A${recapSummaryRow}:G${recapSummaryRow}`;

          // Merge the cells
          worksheet.mergeCells(mergeRange);

          // Apply borders to the merged cells
          const borderStyleRecap: Partial<ExcelJS.Border> = { style: 'medium', color: { argb: '00000000' } };
          ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((column) => {
            const cell = worksheet.getCell(`${column}${recapSummaryRow}`);
            cell.border = {
              top: borderStyleRecap,
              left: borderStyleRecap,
              bottom: borderStyleRecap,
              right: borderStyleRecap,
            };
          });

        subHeader.forEach((headerText, index) => {
          const subheaderCell = worksheet.getCell(`${String.fromCharCode(65 + index)}${recapSummaryRow + 1}`);
          subheaderCell.value = headerText;
          subheaderCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Align to center middle
          // Set font to Calibri Light for subheader
          subheaderCell.font = {  bold: true, name: 'Calibri Light' };

          subheaderCell.border = {
            top: borderStyle,
            left: borderStyle,
            bottom: borderStyle,
            right: borderStyle,
          };
        });

        // Format the data before adding it to the worksheet
        const recapSummaryData = recapSummary.map((item: IRecapSummary) => {
          const transactionDate = item.DATE ? dayjs(item.DATE) : null;
        
          return {
            'Day Of Week': item.DAYOFWEEK,
            DATE: transactionDate ? transactionDate.format('M/D/YYYY') : null, // Adding 1 day
            'SA AMOUNT': item.SAAMOUNT?.toFixed(2),
            'No of trx': item.NOOFTRX,
            'Per invoice Entry': item.PERIINVOICEENTRY?.toFixed(2),
            'VARIANCE': item.VARIANCE?.toFixed(2),
            'REMARKS': item.REMARKS,
          };
        });

        // Insert Recap Summary data
        recapSummaryData.forEach((rowData: IRecapSummary, rowIndex: number) => {
          Object.keys(rowData).forEach((key, colIndex) => {
            const cell = worksheet.getCell(`${String.fromCharCode(65 + colIndex)}${recapSummaryRow + 2 + rowIndex}`);
            cell.value = rowData[key];

            if (['SA AMOUNT', 'Per invoice Entry', 'VARIANCE'].includes(key) && cell.value !== null && cell.value !== undefined) {
              cell.value = parseFloat(cell.value.toString()); // Convert to number
              cell.numFmt = '#,##0.00'; // Optional: Format as currency with two decimal places
            }

            if (['Day Of Week', 'DATE'].includes(key) && cell.value !== null && cell.value !== undefined) {
              cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Align to center middle
            }

            if (key === 'VARIANCE') {
              const saAmountCellRef = `E${recapSummaryRow + 2 + rowIndex}`;
              const perInvoiceEntryCellRef = `C${recapSummaryRow + 2 + rowIndex}`;
              cell.value = { formula:`=${saAmountCellRef}-${perInvoiceEntryCellRef}`};
            }

              cell.border = {
                top: borderStyle,
                left: borderStyle,
                bottom: borderStyle,
                right: borderStyle,
              };
          });
        });

        const summaryFirstRow = lastRow + 4;
        const summaryLastRow = recapSummaryRow + recapSummaryData.length + 1;
        worksheet.getCell(`C${summaryLastRow + 1}`).value = { formula: `SUM(C${summaryFirstRow}:C${summaryLastRow})` };
        worksheet.getCell(`E${summaryLastRow + 1}`).value = { formula: `SUM(E${summaryFirstRow}:E${summaryLastRow})` };
        worksheet.getCell(`C${summaryLastRow + 2}`).value = { formula: `C${summaryLastRow + 1}-I${lastRow}` };
        worksheet.getCell(`D${summaryLastRow + 2}`).value = { formula: `SUM(D${summaryFirstRow}:D${summaryLastRow})` };

        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((column) => {
          const cell = worksheet.getCell(`${column}${summaryLastRow + 1}`);
          cell.border = {
            top: borderStyleRecap,
            left: borderStyleRecap,
            bottom: borderStyleRecap,
            right: borderStyleRecap,
          };

          if(column === 'C')
          {
            cell.font = { bold: true };
            if (cell.value === 0 || cell.value === '0.00') {
              cell.value = null; // Set zero values to null for proper formatting
              cell.numFmt = '0;-0;;@'; // Custom format to display zero values as "-"
            }
            else
            {
              cell.numFmt = '#,##0.00';
            }
          }
          if(column === 'E')
          {
            if (cell.value === 0 || cell.value === '0.00') {
              cell.value = null; // Set zero values to null for proper formatting
              cell.numFmt = '0;-0;;@'; // Custom format to display zero values as "-"
            }
            else
            {
              cell.numFmt = '#,##0.00';
            }
          }
        });

        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((column) => {
          const cell = worksheet.getCell(`${column}${summaryLastRow + 2}`);
          cell.border = {
            top: borderStyleRecap,
            left: borderStyleRecap,
            bottom: borderStyleRecap,
            right: borderStyleRecap,
          };
        });

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

        const anaylticsParamUpdated: IAnalyticProps = {
          dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
          memCode: [selected],
          userId: Id,
          storeId: [club],
          action: 'Weekly Delivery Report',
          fileName: fileName
        };

        await insertLogs(anaylticsParamUpdated);
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

  const handleGenerateWeeklyReportAccounting = async () => {
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

      for (const locationCode of selectedLocationCodes) {
        const anaylticsParam: IAnalyticProps = {
          dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
          memCode: [selected],
          userId: '',
          storeId: [locationCode],
        };
  
        const generateWeeklyReport: AxiosRequestConfig = {
          method: 'POST',
          url: `${REACT_APP_API_ENDPOINT}/Analytics/GenerateWeeklyReport`,
          data: anaylticsParam,
        };
  
        axios(generateWeeklyReport)
        .then(async (result) => {
          var weeklyReport = result.data.WeeklyReport as IWeeklyReport;
          var recapSummary = result.data.RecapSummary as IRecapSummary;
          var customer = customerCodes.find(item => item.CustomerId === selected);
          var dateRange = (selectedDateFrom ?? dayjs()).format('MMMM DD-') + (selectedDateTo ?? dayjs()).format('DD, YYYY');
          var customerName = "";
          var sheetName = "";
          if(customer?.CustomerName.includes('Grab Food'))
          {
            customerName = "GrabFood Store Transactions"
            sheetName = "Grab Food"
          }
          else if(customer?.CustomerName.includes('Grab Mart'))
          {
            customerName = "GrabMart Store Transactions"
            sheetName = "Grab Mart"
          }
          else if(customer?.CustomerName.includes('Pick A Roo Merchandise'))
          {
            customerName = "Pick A Roo Merch Store Transactions"
            sheetName = "Pick A Roo Merch"
          }
          else if(customer?.CustomerName.includes('Pick A Roo FS'))
          {
            customerName = "Pick A Roo FS Store Transactions"
            sheetName = "Pick A Roo FS"
          }
          else if(customer?.CustomerName.includes('Food Panda'))
          {
            customerName = "Food Panda Store Transactions"
            sheetName = "Food Panda"
          }
          else
          {
            customerName = "MetroMart Store Transactions"
            sheetName = "MetroMart"
          }
  
          var fileName = `${customerName} - ${locationCode} - ${dateRange}_${formattedHours}${formattedMinutes}${formattedSeconds}`;
          const header = ['LOCATION', 'DATE', 'MEMBERSHIP NUMBER', 'REGISTER NO.', 'TRX NO.', 'ORDER NO.', 'QTY PURCHASED', 'AMOUNT', 'SUBTOTAL', 'MEMBER', 'NON MEMBER', 'ORIGINAL AMT.', 'ACCOUNTS PAYMENT', 'AP TRX', 'TOTAL BILLED'];
          const subHeader = ['Day Of Week', 'DATE', 'SA AMOUNT', 'No of trx', 'Per invoice Entry', 'VARIANCE', 'REMARKS'];
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
              AMOUNT:  item.Amount ? item.Amount.toFixed(2) : null, 
              SUBTOTAL:  item.SubTotal ? item.SubTotal.toFixed(2) : null,  
              MEMBER: item.Member ? item.Member.toFixed(2) : null,
              'NON MEMBER': item.NonMember ? item.NonMember.toFixed(2) : null, 
              'ORIGINAL AMT.': item.OriginalAmout ? item.OriginalAmout.toFixed(2) : null, 
              'ACCOUNTS PAYMENT': item.AccountsPayment,
              'AP TRX': item.APTRX,
              'TOTAL BILLED': item.TotalBilled
            };
          });
  
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet(`${sheetName} - ${locationCode}`);
  
          worksheet.getCell('A1').value = additionalHeaders[0];
          worksheet.getCell('A1').font = { bold: true }; 
          worksheet.getCell('A2').value = additionalHeaders[1];
  
          header.forEach((headerText, index) => {
            worksheet.getCell(`${String.fromCharCode(65 + index)}4`).value = headerText;
          });
  
          formattedData.forEach((rowData: IRowData, rowIndex: number) => {
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
  
            if (header[colIndex] === 'TRX NO.') {
              worksheet.getColumn(colIndex + 1).width = 25;
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
  
          formattedData.forEach((_rowData: IRowData, rowIndex: number) => {
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
  
              if (['ORIGINAL AMT.', 'SUBTOTAL', 'MEMBER', 'NON MEMBER', 'AMOUNT'].includes(header[colIndex]) && cell.value !== null && cell.value !== undefined) {
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
  
          //TOTAL SALES
          const lastRow = formattedData.length + 5;
          const countaFormula = `COUNTA(E5:E${lastRow - 1})`;
          const sumFormulaI = `SUM(I5:I${lastRow - 1})`;
  
          worksheet.getCell(`C${lastRow}`).value = 'TOTAL SALES';
          worksheet.getCell(`E${lastRow}`).value = { formula: countaFormula };
          worksheet.getCell(`I${lastRow}`).value = { formula: sumFormulaI };
          worksheet.getCell(`L${lastRow}`).value = { formula: `SUM(L5:L${lastRow - 1})` };
          worksheet.getCell(`J${lastRow}`).value = { formula: `SUM(J5:J${lastRow - 1})` };
          worksheet.getCell(`K${lastRow}`).value = { formula: `SUM(K5:K${lastRow - 1})` };
          worksheet.getCell(`M${lastRow}`).value = { formula: `SUM(M5:M${lastRow - 1})` };
          worksheet.getCell(`O${lastRow}`).value = { formula: `SUM(O5:O${lastRow - 1})` };
          worksheet.getCell(`H${lastRow}`).value = { formula: `SUM(H5:H${lastRow - 1})` };
  
          // Apply borders and formatting to the last row
          ['C', 'E', 'I', 'L', 'J', 'K', 'M', 'O', 'H'].forEach((column) => {
            const cell = worksheet.getCell(`${column}${lastRow}`);
            cell.font = { bold: true, color: { argb: 'FF0000' } };
            cell.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            };
            
          });
  
          ['I', 'L', 'J', 'K', 'M', 'O', 'H'].forEach((column) => {
            const cell = worksheet.getCell(`${column}${lastRow}`);
            cell.font = { bold: true, color: { argb: 'FF0000' } };
            cell.alignment = {
              horizontal: 'center',
              vertical: 'middle',
            };
            cell.numFmt = '#,##0.00';
          });
  
          //RECAP SUMMARY
          const recapSummaryRow = lastRow + 2; // Assuming the last row is calculated in the previous code
  
          // Insert 'RECAP SUMMARY' title
          worksheet.getCell(`A${recapSummaryRow}`).value = 'RECAP SUMMARY';
          worksheet.getCell(`A${recapSummaryRow}`).font = { bold: true, name: 'Calibri Light' };
          worksheet.getCell(`A${recapSummaryRow}`).alignment = {  wrapText: true,  horizontal: 'center',  vertical: 'middle' };
  
          // Define the range of cells to merge
          const mergeRange = `A${recapSummaryRow}:G${recapSummaryRow}`;

          // Merge the cells
          worksheet.mergeCells(mergeRange);

          // Apply borders to the merged cells
          const borderStyleRecap: Partial<ExcelJS.Border> = { style: 'medium', color: { argb: '00000000' } };
          ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((column) => {
            const cell = worksheet.getCell(`${column}${recapSummaryRow}`);
            cell.border = {
              top: borderStyleRecap,
              left: borderStyleRecap,
              bottom: borderStyleRecap,
              right: borderStyleRecap,
            };
          });
  
          subHeader.forEach((headerText, index) => {
            const subheaderCell = worksheet.getCell(`${String.fromCharCode(65 + index)}${recapSummaryRow + 1}`);
            subheaderCell.value = headerText;
            subheaderCell.alignment = { horizontal: 'center', vertical: 'middle' }; // Align to center middle
            // Set font to Calibri Light for subheader
            subheaderCell.font = {  bold: true, name: 'Calibri Light' };
  
            subheaderCell.border = {
              top: borderStyle,
              left: borderStyle,
              bottom: borderStyle,
              right: borderStyle,
            };
          });
  
          // Format the data before adding it to the worksheet
          const recapSummaryData = recapSummary.map((item: IRecapSummary) => {
            const transactionDate = item.DATE ? dayjs(item.DATE) : null;
          
            return {
              'Day Of Week': item.DAYOFWEEK,
              DATE: transactionDate ? transactionDate.format('M/D/YYYY') : null, // Adding 1 day
              'SA AMOUNT': item.SAAMOUNT?.toFixed(2),
              'No of trx': item.NOOFTRX,
              'Per invoice Entry': item.PERIINVOICEENTRY?.toFixed(2),
              'VARIANCE': item.VARIANCE?.toFixed(2),
              'REMARKS': item.REMARKS,
            };
          });
  
          // Insert Recap Summary data
          recapSummaryData.forEach((rowData: IRecapSummary, rowIndex: number) => {
            Object.keys(rowData).forEach((key, colIndex) => {
              const cell = worksheet.getCell(`${String.fromCharCode(65 + colIndex)}${recapSummaryRow + 2 + rowIndex}`);
              cell.value = rowData[key];
  
              if (['SA AMOUNT', 'Per invoice Entry', 'VARIANCE'].includes(key) && cell.value !== null && cell.value !== undefined) {
                cell.value = parseFloat(cell.value.toString()); // Convert to number
                cell.numFmt = '#,##0.00'; // Optional: Format as currency with two decimal places
              }
  
              if (['Day Of Week', 'DATE'].includes(key) && cell.value !== null && cell.value !== undefined) {
                cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Align to center middle
              }
  
              if (key === 'VARIANCE') {
                const saAmountCellRef = `E${recapSummaryRow + 2 + rowIndex}`;
                const perInvoiceEntryCellRef = `C${recapSummaryRow + 2 + rowIndex}`;
                cell.value = { formula:`=${saAmountCellRef}-${perInvoiceEntryCellRef}`};
              }
  
                cell.border = {
                  top: borderStyle,
                  left: borderStyle,
                  bottom: borderStyle,
                  right: borderStyle,
                };
            });
          });
  
          const summaryFirstRow = lastRow + 4;
          const summaryLastRow = recapSummaryRow + recapSummaryData.length + 1;
          worksheet.getCell(`C${summaryLastRow + 1}`).value = { formula: `SUM(C${summaryFirstRow}:C${summaryLastRow})` };
          worksheet.getCell(`E${summaryLastRow + 1}`).value = { formula: `SUM(E${summaryFirstRow}:E${summaryLastRow})` };
          worksheet.getCell(`C${summaryLastRow + 2}`).value = { formula: `C${summaryLastRow + 1}-I${lastRow}` };
          worksheet.getCell(`D${summaryLastRow + 2}`).value = { formula: `SUM(D${summaryFirstRow}:D${summaryLastRow})` };
  
          ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((column) => {
            const cell = worksheet.getCell(`${column}${summaryLastRow + 1}`);
            cell.border = {
              top: borderStyleRecap,
              left: borderStyleRecap,
              bottom: borderStyleRecap,
              right: borderStyleRecap,
            };
  
            if(column === 'C')
            {
              cell.font = { bold: true };
              if (cell.value === 0 || cell.value === '0.00') {
                cell.value = null; // Set zero values to null for proper formatting
                cell.numFmt = '0;-0;;@'; // Custom format to display zero values as "-"
              }
              else
              {
                cell.numFmt = '#,##0.00';
              }
            }
            if(column === 'E')
            {
              if (cell.value === 0 || cell.value === '0.00') {
                cell.value = null; // Set zero values to null for proper formatting
                cell.numFmt = '0;-0;;@'; // Custom format to display zero values as "-"
              }
              else
              {
                cell.numFmt = '#,##0.00';
              }
            }
          });
  
          ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((column) => {
            const cell = worksheet.getCell(`${column}${summaryLastRow + 2}`);
            cell.border = {
              top: borderStyleRecap,
              left: borderStyleRecap,
              bottom: borderStyleRecap,
              right: borderStyleRecap,
            };
          });
  
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

          const anaylticsParamUpdated: IAnalyticProps = {
            dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
            memCode: [selected],
            userId: Id,
            storeId: [club],
            action: 'Accounting Weekly Delivery Report',
            fileName: fileName
          };

          await insertLogs(anaylticsParamUpdated);

        })
        .catch((error) => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error generating report');
          console.log(error)
        })
      }
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
        <Paper elevation={3} sx={{ padding: '20px', maxWidth: '100%', borderRadius: '15px', height: '780px' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#1C2C5A', }}>
            Weekly Delivery Report
          </Typography>
          <Divider sx={{ marginBottom: '20px' }} />
          <Grid container direction="row" alignItems="center" sx={{ padding: '8px 16px 0 -9px' }} >
          <Grid item xs={11.1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="dddd, MMMM DD, YYYY"
                value={selectedDateFrom}
                label="From*"
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
                        fontSize: '14px',
                        width: '335px',
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
                label="To*"
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
                        fontSize: '14px',
                        width: '335px',
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
          
            {/* <TextField
              variant="outlined"
              size="small"
              type="text"
              required
              label="Merchant"
              select
              value={selected}// Default to an empty string if undefined
              onChange={(e) => handleChange(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '40px',
                  backgroundColor: '#FFFFFF',
                  height: '40px',
                  fontSize: '14px',
                  width: '400px',
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

          {roleId === '1' && (
            <>
              <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
                <FormControl sx={{ width: 300 }}>
                  <InputLabel>Clubs</InputLabel>
                  <Select
                    multiple
                    value={selectedLocationCodes}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Clubs" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((code) => {
                          const location = locations.find((loc) => loc.LocationCode === code);
                          return <Chip key={code} label={location ? location.LocationName : code} sx={{ fontSize: '13px' }}/>;
                        })}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                    style={{
                      width: '400px',
                      borderRadius: '40px',
                      color: '#1C3766',
                      fontSize: '14px'
                    }}
                  >
                  {locations.map((location) => (
                      <MenuItem
                        key={location.Id}
                        value={location.LocationCode}
                        onClick={() => handleMenuItemClick(location.LocationCode)}
                        selected={selectedLocationCodes.includes(location.LocationCode)}
                      >
                        {location.LocationName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
            )}
            <Grid item xs={4} sx={{ paddingTop: '15px' }}>
              <BootstrapButton
                sx={{
                  color: "white",
                  fontSize: "15px",
                  backgroundColor: "#1C3766",
                  width: "76%",
                  borderRadius: "20px",
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  marginRight: '-10px'
                }}
                onClick={roleId === '2' ? handleGenerateWeeklyReport : handleGenerateWeeklyReportAccounting}
              >
                <SummarizeIcon sx={{marginRight: '5px'}} />
                <Typography>
                  Generate Weekly Report
                </Typography>
              </BootstrapButton>
            </Grid>
          </Grid>
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

export default WeeklyDelivery
