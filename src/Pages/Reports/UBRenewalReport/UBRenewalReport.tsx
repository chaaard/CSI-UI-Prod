import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, CircularProgress, Pagination, Grid, TextField, TextFieldProps, MenuItem, IconButton, Snackbar, Fade, Alert, Paper, Divider } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import IAnalyticProps from '../../Common/Interface/IAnalyticsProps';
import axios, { AxiosRequestConfig } from 'axios';
import IGeneratedInvoice from '../../Common/Interface/IGeneratedInvoice';
import IUBVoucherReport from '../../Common/Interface/IUBVoucherReport';
import SummarizeIcon from '@mui/icons-material/Summarize';
import * as XLSX from 'xlsx';
import { insertLogs } from '../../../Components/Functions/InsertLogs';
import CustomerDropdown from '../../../Components/Common/CustomerDropdown';
import ICustomerDropdown from '../../Common/Interface/ICustomerDropdown';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import IUBRenewalReport from '../../Common/Interface/IUBRenewalReport';

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


interface IUpdateInvoice
{
  Id: number,
  CustomerCode: string,
  UserId?: string,
  StoreId?: string,
  Remarks?: string,
}

interface IRowData {
  [key: string]: string | number;
  CLUB: string;
  'DATE REDEEMED': string;
  'PIZZA VOUCHER SERIES NO.': string;
  'TRANSACTION NUMBER': string;
  SKU: string;
  DESCRIPTION: string;
  SRP: number;
  'UNION BANK': number;
  KMC: number; 
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

const BootstrapButtonMini = styled(IconButton)(() => ({
  textTransform: 'none',
  fontSize: 12, 
  lineHeight: 1.5,
  color: '#1C2C5A',
  fontWeight: '900',
  fontFamily: 'Inter',
}));

const UnionBankRenewalReport = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem('club');
  const getId = window.localStorage.getItem('Id');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<IUBRenewalReport[]>([]);
  const [selected, setSelected] = useState<string[]>(['9999011984']);
  const [clubs, setClubs] = useState<number[]>([]);
  const getRoleId = window.localStorage.getItem('roleId');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(''); 
  const [editedRemarks, setEditedRemarks] = useState('');
  const [editRowId, setEditRowId] = useState<string | null>(null);
        
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
  
  
  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const formattedDateTo = selectedDateTo?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const anaylticsParam: IAnalyticProps = {
    dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : '', formattedDateTo?.toString() ? formattedDateTo?.toString() : ''],
    memCode: selected,
    userId: Id,
    storeId: roleId === 2 ? [club] : clubs,
    action: 'UnionBank Renewal Report'
  };

  const fetchGenerateUBRenewal = async () => {
    try {
      setLoading(true);
      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GenerateUBRenewal`,
        data: anaylticsParam,
      };

      axios(getAnalytics)
      .then(async (response) => {
        console.log("response.data",response.data);
        setGeneratedInvoice(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      })
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    } 
  };

  useEffect(() => {
    if(formattedDateFrom && selected.length >= 1)
    {
      fetchGenerateUBRenewal();
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
    setEditRowId(null); // Exit edit mode without saving
  };

  const handleChangeDateTo = (newValue: Dayjs | null) => {
    setSelectedDateTo(newValue);
    setEditRowId(null); // Exit edit mode without saving
  };

  useEffect(() => {
    document.title = 'Maintenance | UnionBank Renewal Report';
  }, []);

const generateExcel = () => {
  // Data for the Excel file
  const data = [
    ["Header1", "Header2", "Header3", "MergedHeader", "", "Header5"],
    ["", "", "", "SubHeader1", "SubHeader2", ""],
    ["Data1", "Data2", "Data3", "Data4", "Data5", "Data6"],
    ["Data7", "Data8", "Data9", "Data10", "Data11", "Data12"]
  ];

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert the data to a worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Merge cells for the headers
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Merge cells A1 and A2
    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Merge cells B1 and B2
    { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Merge cells C1 and C2
    { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } }  // Merge cells D1 and E1
  ];

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Generate a binary Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Create a Blob from the buffer
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  // Save the file
  saveAs(blob, 'example.xlsx');
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
      dates: [formattedDateFrom?.toString() || '', formattedDateTo?.toString() || ''],
      memCode: [selected.toString()],
      userId: '',
      storeId: [club],
    };

    const generateWeeklyReport: AxiosRequestConfig = {
      method: 'POST',
      url: `${REACT_APP_API_ENDPOINT}/Analytics/GenerateUBRenewal`,
      data: anaylticsParam,
    };

    const result = await axios(generateWeeklyReport);
    const report = result.data as IUBRenewalReport[];

    const dateRange = (selectedDateFrom ?? dayjs()).format('MMMM DD-') + (selectedDateTo ?? dayjs()).format('DD, YYYY');
    const customerName = "UnionBank Renewal Report";
    const sheetName = "UnionBank Renewal";
    const fileName = `${customerName} - ${club} - ${dateRange}_${formattedHours}${formattedMinutes}${formattedSeconds}`;
    const header = ['AUTO-CHARGE DATE', 'GOLD', 'AMOUNT', 'BUSINESS', 'AMOUNT', 'ADD-ON FREE', 'TOTAL AMOUNT', 'CSI NUMBER', 'TRANSACTED DATE'];
    const additionalHeaders = [customerName, dateRange];

    const formattedData = report.map((item) => {
      const transactionDate = item.AutoChargeDate ? new Date(item.AutoChargeDate) : null;

      return {
        'AUTO-CHARGE DATE': transactionDate ? `${transactionDate.getFullYear()}-${(transactionDate.getMonth() + 1).toString().padStart(2, '0')}-${transactionDate.getDate().toString().padStart(2, '0')}` : '',
        GOLD: item.Gold,
        AMOUNT: item.Amount700? item.Amount700.toFixed(2) : null,
        BUSINESS: item.Business,
        'AMOUNT ': item.Amount900? item.Amount900.toFixed(2) : null,
        'ADD-ON FREE': item.AddOnFree ? item.AddOnFree.toFixed(2) : null,
        'TOTAL AMOUNT': item.TotalAmount ? item.TotalAmount.toFixed(2) : null,
        'CSI NUMBER': item.CSINo,
        'TRANSACTED DATE' : item.TransactedDate,
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

    formattedData.forEach((rowData, rowIndex) => {
      const rowDataKeys = Object.keys(rowData) as (keyof typeof rowData)[];
      rowDataKeys.forEach((key, colIndex) => {
        worksheet.getCell(`${String.fromCharCode(65 + colIndex)}${rowIndex + 5}`).value = rowData[key];
      });
    });

    const borderHeaderStyle: Partial<ExcelJS.Border> = { style: 'medium', color: { argb: '00000000' } };
    const borderStyle: Partial<ExcelJS.Border> = { style: 'thin', color: { argb: '00000000' } };

    header.forEach((_value, colIndex) => {
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
    });

    formattedData.forEach((rowData, rowIndex) => {
      const rowDataKeys = Object.keys(rowData) as (keyof typeof rowData)[];
      rowDataKeys.forEach((key, colIndex) => {
        const cell = worksheet.getCell(`${String.fromCharCode(65 + colIndex)}${rowIndex + 5}`);
        cell.border = {
          top: borderStyle,
          left: borderStyle,
          bottom: borderStyle,
          right: borderStyle,
        };

        if (['AUTO-CHARGE DATE', 'GOLD', 'BUSINESS' , 'ADD-ON FREE','CSI NUMBER','TRANSACTED DATE'].includes(header[colIndex])) {
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
        }

        if (['AMOUNT', 'AMOUNT ', 'TOTAL AMOUNT'].includes(header[colIndex]) && cell.value !== null && cell.value !== undefined) {
          cell.value = parseFloat(cell.value.toString());
          cell.numFmt = '#,##0.00';
        }
      });
    });

    const blob = await workbook.xlsx.writeBuffer();
    const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName + '.xlsx';
    link.click();

    URL.revokeObjectURL(blobUrl);

    setIsSnackbarOpen(true);
    setSnackbarSeverity('success');
    setMessage('UB Renewal report generated successfully');

    const anaylticsParamUpdated: IAnalyticProps = {
      dates: [formattedDateFrom?.toString() || '', formattedDateTo?.toString() || ''],
      memCode: [selected.toString()],
      userId: Id,
      storeId: [club],
      action: 'UB Renewal Report',
      fileName: fileName,
    };

    await insertLogs(anaylticsParamUpdated);
  } catch (error) {
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setMessage('Error generating report');
    console.error(error);
  }
};

  const CustomTextField = styled(TextField)<TextFieldProps>(({ disabled }) => ({
    '& .MuiInputBase-root': {
      backgroundColor: '#fff', // White background
      borderRadius: '4px', // Border radius
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: disabled ? '#E5E5E5' : '#1C2C5A',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FF9900', // Orange border on hover
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FF9900', // Orange border when focused
    },
    '& .MuiOutlinedInput-input': {
      padding: '10px 12px',
      fontSize: '14px',
      fontWeight: '400',
    },
  }));

  const handleEditRemarks = (remarks: string, id: string) => {
    setEditRowId(id);
    setEditedRemarks(remarks); // Set edited remarks for editing
  };

  const handleCancelEdit = () => {
    setEditRowId(null); // Exit edit mode without saving
  };
  const CustomTableCell = ({ children, editing }: { children: React.ReactNode, editing: boolean }) => {
    return editing ? (
      <StyledTableCellSmall>
        <CustomTextField 
          variant="outlined"
          defaultValue={children}
          size="small"
          type="text"
          value={editedRemarks}
          onChange={(e) => setEditedRemarks(e.target.value)}
        />
      </StyledTableCellSmall>
    ) : (
      <StyledTableCellSmall>{children}</StyledTableCellSmall>
    );
  };

  const handleSave = async (id: number) => {
    try {
      const update: IUpdateInvoice = {
        Id: id,
        CustomerCode: selected.toString(),
        UserId: Id.toString(),
        StoreId: club.toString(),
        Remarks: editedRemarks
      };

      if(editedRemarks.length > 0){
        const generateInvoice: AxiosRequestConfig = {
          method: 'PUT',
          url: `${REACT_APP_API_ENDPOINT}/Analytics/UpdateRemarkInvoice`,
          data: update,
        };

        axios(generateInvoice)
        .then((result) => {
          if(result.data === true)
          {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setMessage('Successfully saved!');
            setEditRowId(null); // Exit edit mode without saving
            fetchGenerateUBRenewal();
          }
          else
          {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Error saving remarks');
            setEditRowId(null); // Exit edit mode without saving
          }
        })
        .catch((error) => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error saving remarks');
          setEditRowId(null); // Exit edit mode without saving
        })
      }
      else
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error saving remarks');
        setEditRowId(null); // Exit edit mode without saving
      }      
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error saving remarks');
        setEditRowId(null); // Exit edit mode without saving
    } 
  };

 
    return (


    <Box sx={{ position: 'relative' }}>

      {loading && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
          position="absolute"
          top={0}
          left={0}
          zIndex={10}
          bgcolor="rgba(0, 0, 0, 0.5)"
        >
          <CircularProgress size={80} />
          <Typography variant="h6" color="textSecondary" style={{ marginTop: '16px' }}>
            Loading...
          </Typography>
        </Box>
      )}
                  
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
            UnionBank Renewal Report
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
                onClick={handleGenerateWeeklyReport}
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
                  <StyledTableCell style={{ textAlign: 'center',  }}>Auto Charge Date</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Gold</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Amount</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Business</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Amount</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Add-on Free</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Total Amount</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>CSI Number</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Transacted Date</StyledTableCell>
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
                    generatedInvoice.map((item: IUBRenewalReport) => {
                      return (
                        <TableRow  sx={{ "& td": { border: 0 }}}>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}> {item.AutoChargeDate !== null
                            ? new Date(item.AutoChargeDate ?? '').toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short', // or 'long' for full month name
                                day: 'numeric',
                              })
                            : ''}
                          </StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}>{item.Gold}</StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'right', paddingRight: '40px' }}>
                            {item.Amount700 !== null
                              ? item.Amount700 >= 1000
                                ? item.Amount700.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : item.Amount700.toFixed(2)
                              : '0.00'}
                          </StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}>{item.Business}</StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'right', paddingRight: '40px' }}>
                            {item.Amount900 !== null
                              ? item.Amount900 >= 1000
                                ? item.Amount900.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : item.Amount900.toFixed(2)
                              : '0.00'}
                          </StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}>{item.AddOnFree}</StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'right', paddingRight: '40px' }}>
                            {item.TotalAmount !== null
                              ? item.TotalAmount >= 1000
                                ? item.TotalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : item.TotalAmount.toFixed(2)
                              : '0.00'}
                          </StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}>{item.CSINo}</StyledTableCellSmall>
                          <StyledTableCellSmall style={{ textAlign: 'center',  }}>{item.TransactedDate}</StyledTableCellSmall>
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
      </Box>
    )
}

export default UnionBankRenewalReport
