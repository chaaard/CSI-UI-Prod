import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, CircularProgress, Pagination, Grid, TextField, TextFieldProps, MenuItem, IconButton, Snackbar, Fade, Alert, Paper, Divider, FormControl, InputLabel, Select, OutlinedInput, Chip } from '@mui/material';
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
import ILocations from '../../Common/Interface/ILocations';

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
  color: "#1C2C5A",
  fontFamily: "Inter",
  fontWeight: "700",
  fontSize: "15px",
  borderRadius: "25px",
  border: severity === "success" ? "1px solid #4E813D" : "1px solid #9B6B6B",
  backgroundColor: severity === "success" ? "#E7FFDF" : "#FFC0C0",
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
    background-color: #2b4b81;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const BootstrapButton = styled(IconButton)(({ theme }) => ({
  textTransform: "none",
  fontSize: 16,
  padding: "6px 12px",
  border: "1px solid",
  lineHeight: 1.5,
  backgroundColor: "#1C3766",
  borderColor: "#1C3766",
  color: "white",
  boxShadow: "0px 7px 5px -1px rgba(0,0,0,0.5)",
  "&:hover": {
    backgroundColor: "#15294D",
    borderColor: "#15294D",
    boxShadow: "0px 7px 5px -1px rgba(0,0,0,0.5)",
  },
  borderRadius: theme.shape.borderRadius, // Ensure the button has the default shape
}));

const UnionBankVoucherReport = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem("club");
  const getId = window.localStorage.getItem("Id");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<IUBVoucherReport[]>([]);
  const [selected, setSelected] = useState<string[]>(["9999011984"]);
  const [clubs, setClubs] = useState<number[]>([]);
  const getRoleId = window.localStorage.getItem("roleId");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "warning" | "info" | "success">("success"); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [selectedLocationCodes, setSelectedLocationCodes] = useState<number[]>([]);
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
        
  const handleChange = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelected(sanitizedValue);   
  };

  let roleId = 0;
  if (getRoleId !== null) {
    roleId = parseInt(getRoleId, 10);
  }

  let club = 0;
  if (getClub !== null) {
    club = parseInt(getClub, 10);
  }

  let Id = "";
  if (getId !== null) {
    Id = getId;
  }

  // Handle closing the snackbar
  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const formattedDateTo = selectedDateTo?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const anaylticsParam: IAnalyticProps = {
    dates: [
      formattedDateFrom?.toString() ? formattedDateFrom?.toString() : "",
      formattedDateTo?.toString() ? formattedDateTo?.toString() : "",
    ],
    memCode: selected,
    userId: Id,
    storeId: roleId === 2 ? [club] : selectedLocationCodes,
    action: 'UnionBank Voucher Report'
  };

  const fetchGenerateUBVoucher = async () => {
    try {
      setLoading(true);
      const getAnalytics: AxiosRequestConfig = {
        method: "POST",
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GenerateUBVoucher`,
        data: anaylticsParam,
      };

      axios(getAnalytics)
      .then(async (response) => {
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
    if (formattedDateFrom && selected.length >= 1) {
      fetchGenerateUBVoucher();
    }
  }, [REACT_APP_API_ENDPOINT, formattedDateFrom, formattedDateTo, selected, selectedLocationCodes]);

  useEffect(() => {
    const defaultDate = dayjs();
    const currentDate = dayjs();
    setSelectedDateFrom(defaultDate);
    setSelectedDateTo(currentDate);
    setLoading(false);
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
    document.title = "Maintenance | UnionBank Voucher Report";
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
      storeId: roleId === 2 ? [club] : selectedLocationCodes,
    };

    const generateWeeklyReport: AxiosRequestConfig = {
      method: 'POST',
      url: `${REACT_APP_API_ENDPOINT}/Analytics/GenerateUBVoucher`,
      data: anaylticsParam,
    };

    const result = await axios(generateWeeklyReport);
    const report = result.data as IUBVoucherReport[];

    const dateRange = (selectedDateFrom ?? dayjs()).format('MMMM DD-') + (selectedDateTo ?? dayjs()).format('DD, YYYY');
    const customerName = "UnionBank Voucher Report";
    const sheetName = "UnionBank Voucher";
    const fileName = `${customerName} - ${club} - ${dateRange}_${formattedHours}${formattedMinutes}${formattedSeconds}`;
    const header = ['CLUB', 'DATE REDEEMED', 'PIZZA VOUCHER SERIES NO.', 'TRANSACTION NUMBER', 'SKU', 'DESCRIPTION', 'SRP', 'UNION BANK', 'KMC'];
    const additionalHeaders = [customerName, dateRange];

    const formattedData = report.map((item) => {
      const transactionDate = item.TransactionDate ? new Date(item.TransactionDate) : null;

      return {
        CLUB: item.LocationId,
        'DATE REDEEMED': transactionDate ? `${transactionDate.getFullYear()}-${(transactionDate.getMonth() + 1).toString().padStart(2, '0')}-${transactionDate.getDate().toString().padStart(2, '0')}` : '',
        'PIZZA VOUCHER SERIES NO.': item.OrderNo,
        'TRANSACTION NUMBER': item.TransactionNo,
        SKU: item.SKU,
        DESCRIPTION: item.Description,
        SRP: item.SRP ? item.SRP.toFixed(2) : null,
        'UNION BANK': item.UnionBank ? item.UnionBank.toFixed(2) : null,
        KMC: item.KMC ? item.KMC.toFixed(2) : null,
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

        if (['CLUB', 'DATE REDEEMED', 'PIZZA VOUCHER SERIES NO.'].includes(header[colIndex])) {
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
          };
        }

        if (['SRP', 'UNION BANK', 'KMC'].includes(header[colIndex]) && cell.value !== null && cell.value !== undefined) {
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
    setMessage('UB Voucher report generated successfully');

    const anaylticsParamUpdated: IAnalyticProps = {
      dates: [formattedDateFrom?.toString() || '', formattedDateTo?.toString() || ''],
      memCode: [selected.toString()],
      userId: Id,
      storeId: [club],
      action: 'UB Voucher Report',
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

  const handleCancelEdit = () => {
    setEditRowId(null); // Exit edit mode without saving
  };
  
  const handleSave = async (id: number) => {
    try {
      const currentDate: Date = new Date();
      const hours: number = currentDate.getHours();
      const minutes: number = currentDate.getMinutes();
      const seconds: number = currentDate.getSeconds();

      const formattedHours: string =
        hours < 10 ? "0" + hours : hours.toString();
      const formattedMinutes: string =
        minutes < 10 ? "0" + minutes : minutes.toString();
      const formattedSeconds: string =
        seconds < 10 ? "0" + seconds : seconds.toString();

      const formattedDateFrom = selectedDateFrom?.format(
        "YYYY-MM-DD HH:mm:ss.SSS"
      );
      const formattedDateTo = selectedDateTo?.format("YYYY-MM-DD HH:mm:ss.SSS");

      const anaylticsParam: IAnalyticProps = {
        dates: [
          formattedDateFrom?.toString() || "",
          formattedDateTo?.toString() || "",
        ],
        memCode: [selected.toString()],
        userId: "",
        storeId: [club],
      };

      const generateWeeklyReport: AxiosRequestConfig = {
        method: "POST",
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GenerateUBVoucher`,
        data: anaylticsParam,
      };

      const result = await axios(generateWeeklyReport);
      const report = result.data as IUBVoucherReport[];

      const dateRange =
        (selectedDateFrom ?? dayjs()).format("MMMM DD-") +
        (selectedDateTo ?? dayjs()).format("DD, YYYY");
      const customerName = "UnionBank Voucher Report";
      const sheetName = "UnionBank Voucher";
      const fileName = `${customerName} - ${club} - ${dateRange}_${formattedHours}${formattedMinutes}${formattedSeconds}`;
      const header = [
        "CLUB",
        "DATE REDEEMED",
        "PIZZA VOUCHER SERIES NO.",
        "TRANSACTION NUMBER",
        "SKU",
        "DESCRIPTION",
        "SRP",
        "UNION BANK",
        "KMC",
      ];
      const additionalHeaders = [customerName, dateRange];

      const formattedData = report.map((item) => {
        const transactionDate = item.TransactionDate
          ? new Date(item.TransactionDate)
          : null;

        return {
          CLUB: item.LocationId,
          "DATE REDEEMED": transactionDate
            ? `${transactionDate.getFullYear()}-${(
                transactionDate.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}-${transactionDate
                .getDate()
                .toString()
                .padStart(2, "0")}`
            : "",
          "PIZZA VOUCHER SERIES NO.": item.OrderNo,
          "TRANSACTION NUMBER": item.TransactionNo,
          SKU: item.SKU,
          DESCRIPTION: item.Description,
          SRP: item.SRP ? item.SRP.toFixed(2) : null,
          "UNION BANK": item.UnionBank ? item.UnionBank.toFixed(2) : null,
          KMC: item.KMC ? item.KMC.toFixed(2) : null,
        };
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`${sheetName} - ${club}`);

      worksheet.getCell("A1").value = additionalHeaders[0];
      worksheet.getCell("A1").font = { bold: true };
      worksheet.getCell("A2").value = additionalHeaders[1];

      header.forEach((headerText, index) => {
        worksheet.getCell(`${String.fromCharCode(65 + index)}4`).value =
          headerText;
      });

      formattedData.forEach((rowData, rowIndex) => {
        const rowDataKeys = Object.keys(rowData) as (keyof typeof rowData)[];
        rowDataKeys.forEach((key, colIndex) => {
          worksheet.getCell(
            `${String.fromCharCode(65 + colIndex)}${rowIndex + 5}`
          ).value = rowData[key];
        });
      });

      const borderHeaderStyle: Partial<ExcelJS.Border> = {
        style: "medium",
        color: { argb: "00000000" },
      };
      const borderStyle: Partial<ExcelJS.Border> = {
        style: "thin",
        color: { argb: "00000000" },
      };

      header.forEach((_value, colIndex) => {
        const cell = worksheet.getCell(
          `${String.fromCharCode(65 + colIndex)}4`
        );
        cell.alignment = {
          horizontal: "center",
          vertical: "bottom",
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
          const cell = worksheet.getCell(
            `${String.fromCharCode(65 + colIndex)}${rowIndex + 5}`
          );
          cell.border = {
            top: borderStyle,
            left: borderStyle,
            bottom: borderStyle,
            right: borderStyle,
          };

          if (
            ["CLUB", "DATE REDEEMED", "PIZZA VOUCHER SERIES NO."].includes(
              header[colIndex]
            )
          ) {
            cell.alignment = {
              horizontal: "center",
              vertical: "middle",
            };
          }

          if (
            ["SRP", "UNION BANK", "KMC"].includes(header[colIndex]) &&
            cell.value !== null &&
            cell.value !== undefined
          ) {
            cell.value = parseFloat(cell.value.toString());
            cell.numFmt = "#,##0.00";
          }
        });
      });

      const blob = await workbook.xlsx.writeBuffer();
      const blobUrl = URL.createObjectURL(
        new Blob([blob], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName + ".xlsx";
      link.click();

      URL.revokeObjectURL(blobUrl);

      setIsSnackbarOpen(true);
      setSnackbarSeverity("success");
      setMessage("UB Voucher report generated successfully");

      const anaylticsParamUpdated: IAnalyticProps = {
        dates: [
          formattedDateFrom?.toString() || "",
          formattedDateTo?.toString() || "",
        ],
        memCode: [selected.toString()],
        userId: Id,
        storeId: [club],
        action: "UB Voucher Report",
        fileName: fileName,
      };

      await insertLogs(anaylticsParamUpdated);
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error generating report");
      console.error(error);
    }
  };

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
  const totalSRP = generatedInvoice.reduce((sum, item) => sum + (item.SRP || 0), 0);
  const totalUnionBank = generatedInvoice.reduce((sum, item) => sum + (item.UnionBank || 0), 0);
  const totalKMC = generatedInvoice.reduce((sum, item) => sum + (item.KMC || 0), 0);

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
          <Typography
            variant="h6"
            color="textSecondary"
            style={{ marginTop: "16px" }}
          >
            Loading...
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          marginTop: "16px",
          marginLeft: "20px",
          marginRight: "20px",
          flexGrow: 1,
        }}
      >
        <Paper elevation={3} sx={{ padding: '20px', maxWidth: '100%', borderRadius: '15px', height: '780px' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#1C2C5A' }}>
            UnionBank PV Issuance Report
          </Typography>
          <Divider sx={{ marginBottom: '20px' }} />
          <Grid container direction="row" alignItems="center" sx={{ padding: '8px 16px 0 -9px' }}>
            <Grid item xs={11.1}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  inputFormat="dddd, MMMM DD, YYYY"
                  value={selectedDateFrom}
                  label="From"
                  onChange={handleChangeDateFrom}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderRadius: "40px",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#1C2C5A",
                          fontFamily: "Inter",
                          fontWeight: "bold",
                          width: "340px",
                          fontSize: "14px",
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={11.1} sx={{ paddingTop: "15px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  inputFormat="dddd, MMMM DD, YYYY"
                  value={selectedDateTo}
                  label="To"
                  onChange={handleChangeDateTo}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderRadius: "40px",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#1C2C5A",
                          fontFamily: "Inter",
                          fontWeight: "bold",
                          width: "340px",
                          fontSize: "14px",
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            {roleId.toString() === '1' && (
            <>
              <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
                <FormControl sx={{ width: 300 }}>
                  <InputLabel>Clubs</InputLabel>
                  <Select
                    multiple
                    value={selectedLocationCodes}
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
                  fontSize: "16px",
                  backgroundColor: "#1C3766",
                  width: "77%",
                  borderRadius: "20px",
                  fontFamily: "Inter",
                  fontWeight: "900",
                }}
                onClick={handleGenerateWeeklyReport}
              >
                <SummarizeIcon sx={{ marginRight: '5px' }} />
                <Typography>
                  Export Report
                </Typography>
              </BootstrapButton>
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: '20px' }} />
          <CustomScrollbarBox
            component={Paper}
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
              aria-label="spanning table"
            >
              <TableHead
                sx={{
                  zIndex: 3,
                  position: 'sticky',
                  top: '-10px',
                  backgroundColor: '#ffffff',
                }}
              >
                <TableRow sx={{ minWidth: 700 }}>
                  <StyledTableCell style={{ textAlign: 'center' }}>Club</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center' }}>Date Redeemed</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center' }}>Pizza Voucher Series No.</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center' }}>Transaction Number</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center' }}>SKU</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center' }}>Description</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center' }}>SRP</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center' }}>UnionBank</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center' }}>KMC</StyledTableCell>
                  {/* <StyledTableCell style={{ textAlign: 'center' }}>Action</StyledTableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {generatedInvoice.length === 0 ? (
                  <TableRow hover>
                    <TableCell align="center" colSpan={15} sx={{ color: '#1C2C5A' }}>
                      No Data
                    </TableCell>
                  </TableRow>
                ) : (
                  generatedInvoice.map((item, index) => (
                    <TableRow key={index} sx={{ "& td": { border: 0 } }}>
                      <StyledTableCellSmall style={{ textAlign: 'center' }}>{item.LocationId}</StyledTableCellSmall>
                      <StyledTableCellSmall style={{ textAlign: 'center' }}>
                        {item.TransactionDate !== null
                          ? new Date(item.TransactionDate ?? '').toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short', // or 'long' for full month name
                              day: 'numeric',
                            })
                          : ''}
                      </StyledTableCellSmall>
                      <StyledTableCellSmall style={{ textAlign: 'center' }}>{item.OrderNo}</StyledTableCellSmall>
                      <StyledTableCellSmall style={{ textAlign: 'center' }}>{item.TransactionNo}</StyledTableCellSmall>
                      <StyledTableCellSmall style={{ textAlign: 'center' }}>{item.SKU}</StyledTableCellSmall>
                      <StyledTableCellSmall style={{ textAlign: 'center' }}>{item.Description}</StyledTableCellSmall>
                      <StyledTableCellSmall style={{ textAlign: 'right', paddingRight: '40px' }}>
                        {item.SRP !== null
                          ? item.SRP >= 1000
                            ? item.SRP.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : item.SRP.toFixed(2)
                          : '0.00'}
                      </StyledTableCellSmall>
                      <StyledTableCellSmall style={{ textAlign: 'right', paddingRight: '40px' }}>
                        {item.UnionBank !== null
                          ? item.UnionBank >= 1000
                            ? item.UnionBank.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : item.UnionBank.toFixed(2)
                          : '0.00'}
                      </StyledTableCellSmall>
                      <StyledTableCellSmall style={{ textAlign: 'right', paddingRight: '40px' }}>
                        {item.KMC !== null
                          ? item.KMC >= 1000
                            ? item.KMC.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : item.KMC.toFixed(2)
                          : '0.00'}
                      </StyledTableCellSmall>
                    </TableRow>
                  ))
                )}
                {generatedInvoice.length > 0 && (
                  <TableRow sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
                    <StyledTableCellSmall colSpan={6} style={{ textAlign: 'right'}}>
                      Total
                    </StyledTableCellSmall>
                    <StyledTableCellSmall style={{ textAlign: 'right', paddingRight: '40px'}}>
                      {totalSRP >= 1000
                        ? totalSRP.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : totalSRP.toFixed(2)}
                    </StyledTableCellSmall>
                    <StyledTableCellSmall style={{ textAlign: 'right', paddingRight: '40px' }}>
                      {totalUnionBank >= 1000
                        ? totalUnionBank.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : totalUnionBank.toFixed(2)}
                    </StyledTableCellSmall>
                    <StyledTableCellSmall style={{ textAlign: 'right', paddingRight: '40px'}}>
                      {totalKMC >= 1000
                        ? totalKMC.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : totalKMC.toFixed(2)}
                    </StyledTableCellSmall>
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
            vertical: "top",
            horizontal: "right",
          }}
        >
          <WhiteAlert variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {message}
          </WhiteAlert>
        </Snackbar>
      </Box>
    </Box>
    )
}

export default UnionBankVoucherReport;