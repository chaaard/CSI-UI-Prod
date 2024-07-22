import { Accordion, AccordionDetails, AccordionSummary, Alert, Backdrop, Box, Button, Card, CardContent, CircularProgress, Divider, Fade, Grid, IconButton, MenuItem, Pagination, Paper, Snackbar, TextField, Typography, styled } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PortalTable from "./PortalTable";
import IFileDescriptions from "../../Pages/Common/Interface/IFileDescriptions";
import DeleteIcon from '@mui/icons-material/Delete';
import ModalComponent from "./ModalComponent";
import IPagination from '../../Pages/Common/Interface/IPagination';
import IPortal from "../../Pages/Common/Interface/IPortal";
import VisibilityIcon from '@mui/icons-material/Visibility';
import IAccountingAdjustments from "../../Pages/Common/Interface/IAccountingAdjustments";
import AccountingAdjustmentsTable from "./AccountingAdjustmentsTable";
import IAccountingProoflistAdjustments from "../../Pages/Common/Interface/IAccountingProoflistAdjustments";
import * as ExcelJS from 'exceljs';

interface IDeleteAnalytics
{
  Id: number,
  CustomerId?: string,
  UserId?: string,
  StoreId?: string,
}

const customerCodes = [
  { CustomerId: "9999011929", CustomerName: "Grab Food" },
  { CustomerId: "9999011955", CustomerName: "Grab Mart" },
  { CustomerId: "9999011931", CustomerName: "Pick A Roo Merchandise" },
  { CustomerId: "9999011935", CustomerName: "Pick A Roo FS" },
  { CustomerId: "9999011838", CustomerName: "Food Panda" },
  { CustomerId: "9999011855", CustomerName: "MetroMart" },
  { CustomerId: "9999011926", CustomerName: "GCash" },
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

const UploadProoflist = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem('club');
  const getId = window.localStorage.getItem('Id');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPortal, setLoadingPortal] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>('9999011929');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(''); 
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [fileDescriptions, setFileDesciptions] = useState<IFileDescriptions[]>([]);
  const [isFileDescriptions, setIsFileDescriptions] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [merchant, setMerchant] = useState<string>('');
  const [totalSum, setTotalSum] = useState<number>(0); 
  const [portal, setPortal] = useState<IPortal[]>([]);
  const [accountingProoflistAdj, setAccountingProoflistAdj] = useState<IAccountingProoflistAdjustments[]>([]);

  useEffect(() => {
    document.title = 'Accounting | Upload Prooflist';
  }, []);

  let Id = "";
  if(getId !== null)
  {
    Id = getId;
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Check if all selected files have the allowed file types
      const validFiles = Array.from(files).filter(file =>
        file.name.endsWith('.csv') || file.name.endsWith('.xlsx')
      );
  
      if (validFiles.length === files.length) {
        setSelectedFile(validFiles);
      } else {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Please select valid .csv or .xlsx files.');
      }
    }
  };

  let club =  0;
  if(getClub !== null)
  {
    club = parseInt(getClub, 10);
  }

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

  const fetchFileDescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const getPortal: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/FileDescriptions`,
      };

      axios(getPortal)
      .then(async (response) => {
        setFileDesciptions(response.data);
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

  const fetchUploadedProoflist = useCallback(async (params: IPagination) => {
    try {
      setLoading(true);
      const getPortal: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAccountingProoflist`,
        data: params,
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

  const fetchUploadedProoflistAdj = useCallback(async (params: IPagination) => {
    try {
      setLoading(true);
      const getPortal: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAccountingProoflistAdjustments`,
        data: params,
      };

      axios(getPortal)
      .then(async (response) => {
        setAccountingProoflistAdj(response.data);
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

  useEffect(() => {
    const FileDescriptions = async () => {
      try {
        if(isFileDescriptions)
        {
          await fetchFileDescriptions();
          setIsFileDescriptions(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
    FileDescriptions();
  })

  const handleUploadClick = () => {
    try {
      setRefreshing(true);
      if (selectedFile.length === 0) {
        // Show an error message or take appropriate action
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Please select a file before uploading.');
        setRefreshing(false);
        return;
      }

      const formData = new FormData();
      if (selectedFile) {
        selectedFile.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('customerName', selected);
        formData.append('userId', Id);
        formData.append('strClub', club.toString());

        const uploadProofList: AxiosRequestConfig = {
          method: 'POST',
          url: `${REACT_APP_API_ENDPOINT}/ProofList/UploadAccountingProofList`,
          data: formData,
        };

        axios(uploadProofList)
        .then(async (response) => {
          if (response.data.Item2 === 'Error extracting proof list.')
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Error extracting proof list. Please check the file and try again!');
            setRefreshing(false);
          }
          else if (response.data.Item2 === 'Uploaded file transaction dates do not match.')
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Uploaded file transaction dates do not match. Please check the file and try again!');
            setRefreshing(false);
          }
          else if (response.data.Item2 === 'Column not found.')
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Uploaded file Columns do not match. Please check the file and try again!');
            setRefreshing(false);
          }
          else if (response.data.Item2 === 'No files uploaded.')
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('No files uploaded. Please check the file and try again!');
            setRefreshing(false);
          }
          else
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setMessage(`proof list uploaded successfully.`);
            fetchFileDescriptions();
            setRefreshing(false);
          }
        })
        .catch((error) => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error uploading proof list');
          setSelectedFile([]);
          console.error("Error uploading proof list:", error);
          setRefreshing(false);
        })
      }
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error uploading proof list');
        setSelectedFile([]);
        console.error("Error uploading proof list:", error);
        setRefreshing(false);
    } 

    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleCloseDelete = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDeleteClick = () => {
    try {
      var deleteMerchant: IDeleteAnalytics = {
        Id: id,
        StoreId: club.toString(),
        UserId: Id,
      }

      setRefreshing(true);
      const generateInvoice: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/ProofList/DeleteAccountingAnalytics`,
        data: deleteMerchant
      };

      axios(generateInvoice)
      .then((result) => {
        if(result.data === true)
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Successfully deleted!');
          setIsModalOpen(false); 
          fetchFileDescriptions();
          setRefreshing(false);
        }
        else
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error deleting prooflist');
          setIsModalOpen(false);
          setRefreshing(false);
        }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error deleting prooflist');
        setIsModalOpen(false);
        setRefreshing(false);
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error deleting prooflist');
        setIsModalOpen(false);
        setRefreshing(false);
    } 
  };

  const handleExportClick = async () => {
    try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');


    if (merchant === 'Pick A Roo - Merch')
    {

    } else if (merchant === 'MetroMart')
    {
       // Define the header row
        worksheet.columns = [
          { header: 'Store Name', key: 'storeName' },
          { header: 'Date', key: 'date' },
          { header: 'Merchant', key: 'merchant' },
          { header: 'Order No.', key: 'orderno' },
          { header: 'Amount', key: 'amount' },
        ];

      // Add data rows
      portal.forEach((row, index) => {
        const amount = row.Amount !== undefined && row.Amount !== null ? parseFloat(row.Amount.toString()).toFixed(2) : '0.00';
        const storeName = row.StoreName ?? 0;
        const date = row.TransactionDate !== null
                              ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                                  year: 'numeric',
                                  month: 'short', 
                                  day: 'numeric',
                                })
                              : '';
        const orderno = row.OrderNo ?? 0;

        worksheet.addRow({
          storeName: storeName,
          date: date,
          merchant: merchant,
          orderno: orderno,
          amount: parseFloat(amount),
        });
      });

      // Add a total row
      const totalRowIndex = portal.length + 2; // Header + Data rows
      worksheet.addRow([
        'TOTAL',
        '',
        '',
        '',
        { formula: `SUM(E2:E${totalRowIndex - 1})` },
      ]);

      // Style the total row
      worksheet.getRow(totalRowIndex).font = { bold: true };


      const blob = await workbook.xlsx.writeBuffer();
        const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    
        // Create a link and click it to trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Export.xlsx';
        link.click();
    
        // Clean up the URL object
        URL.revokeObjectURL(blobUrl);
    } else
    {
       // Define the header row
        worksheet.columns = [
          { header: 'Store Name', key: 'storeName' },
          { header: 'Date', key: 'date' },
          { header: 'Merchant', key: 'merchant' },
          { header: 'Order No.', key: 'orderno' },
          { header: 'Amount', key: 'amount' },
          { header: 'Gross Commission', key: 'grossCommission' },
          { header: 'Net of VAT', key: 'netOfVat' },
          { header: 'Input VAT', key: 'inputVat' },
          { header: 'EWT', key: 'ewt' },
          { header: 'Net Paid', key: 'netPaid' }
        ];

      // Add data rows
      portal.forEach((row, index) => {
        const rowIndex = index + 2; // Start from row 2, after the header
        const amount = row.Amount !== undefined && row.Amount !== null ? parseFloat(row.Amount.toString()).toFixed(2) : '0.00';
        const storeName = row.StoreName ?? 0;
        const date = row.TransactionDate !== null
                              ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                                  year: 'numeric',
                                  month: 'short', 
                                  day: 'numeric',
                                })
                              : '';
        const orderno = row.OrderNo ?? 0;
        const grossCommissionFormula = merchant === 'Pick A Roo - Merch' ? `ROUND(-E${rowIndex}*0.06, 2)` :
                                        merchant === 'Pick A Roo - FS' ? `ROUND(-E${rowIndex}*0.1568, 2)` :
                                        merchant === 'Food Panda' ? `ROUND(-E${rowIndex}*0.1792, 2)` :
                                        (merchant === 'GrabMart' || merchant === 'Grab Mart') ? `ROUND(-E${rowIndex}*0.05, 2)` :
                                        (merchant === 'GrabFood' || merchant === 'Grab Food') ? `ROUND(-E${rowIndex}*0.12, 2)` : '0';

        const netOfVatFormula = `ROUND(F${rowIndex}/1.12, 2)`;
        const inputVatFormula = `ROUND(G${rowIndex}*0.12, 2)`;
        const ewtFormula = `ROUND(-G${rowIndex}*0.02, 2)`;
        const netPaidFormula = `ROUND(E${rowIndex}+G${rowIndex}+H${rowIndex}+I${rowIndex}, 2)`;

        worksheet.addRow({
          storeName: storeName,
          date: date,
          merchant: merchant,
          orderno: orderno,
          amount: parseFloat(amount),
          grossCommission: { formula: grossCommissionFormula },
          netOfVat: { formula: netOfVatFormula },
          inputVat: { formula: inputVatFormula },
          ewt: { formula: ewtFormula },
          netPaid: { formula: netPaidFormula }
        });
      });

      // Add a total row
      const totalRowIndex = portal.length + 2; // Header + Data rows
      worksheet.addRow([
        'TOTAL',
        '',
        '',
        '',
        { formula: `SUM(E2:E${totalRowIndex - 1})` },
        { formula: `SUM(F2:F${totalRowIndex - 1})` },
        { formula: `SUM(G2:G${totalRowIndex - 1})` },
        { formula: `SUM(H2:H${totalRowIndex - 1})` },
        { formula: `SUM(I2:I${totalRowIndex - 1})` },
        { formula: `SUM(J2:J${totalRowIndex - 1})` }
      ]);

      // Style the total row
      worksheet.getRow(totalRowIndex).font = { bold: true };


          const blob = await workbook.xlsx.writeBuffer();
            const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        
            // Create a link and click it to trigger the download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'Export.xlsx';
            link.click();
        
            // Clean up the URL object
            URL.revokeObjectURL(blobUrl);
    }
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error deleting prooflist');
        setIsModalOpen(false);
        setRefreshing(false);
    } 
  };

  const handleDeleteModalClick = (id: number) => {
    setIsModalOpen(true);
    setId(id);
  };

  const handleViewModalClick = (merchant: string, id: number) => {
    setIsViewModalOpen(true);
    setId(id);
    setMerchant(merchant);

    setPortal([])

    setLoadingPortal(true)
    const params: IPagination = {
      Id: id,
    };

    fetchUploadedProoflist(params);
    fetchUploadedProoflistAdj(params);
    setLoadingPortal(false)
  };

  const handleCloseView = useCallback(() => {
    setIsViewModalOpen(false);
  }, []);

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 16px 16px 16px',  }}>
      <Paper elevation={3} sx={{ padding: '16px 16px 16px 16px', width: '100%',  height: '790px', borderRadius: '15px' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#1C2C5A', }}>
          Upload Prooflist / Payment Monitoring
        </Typography>
        <Divider sx={{ marginBottom: '20px' }} />
        <Backdrop
          sx={{ color: '#ffffff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={refreshing}
        >
          <CircularProgress size="100px" sx={{ color: '#ffffff' }} />
        </Backdrop>
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', }}>
            <Grid container spacing={1}  >
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
              <Grid item >
                <Box display={'flex'}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    disabled
                    label="File"
                    value={selectedFile?.length > 0 ? selectedFile?.map(file => file.name).join(', ') : 'Selected Files'}
                    size='small'
                    helperText='*CSV, XLSX File Only'
                    required
                    InputProps={{
                    sx: {
                      borderTopLeftRadius: '40px',
                      borderBottomLeftRadius: '40px',
                      backgroundColor: '#FFFFFF',
                      height: '40px',
                      width: '295px',
                      fontSize: '14px',
                      fontFamily: 'Inter',
                      fontWeight: 'bold',
                      color: '#1C2C5A',
                    },
                  }}
                  />
                  <label htmlFor="file-input">
                  <Button
                    component="span"
                    variant="contained"
                    sx={{
                      backgroundColor: '#B6B6B6',
                      color: '#FFFFFF',
                      height: '39.5px',
                      boxShadow: 'inset 1px 6px 8px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)',
                      marginLeft: '-10px',
                      borderRadius: 0,
                      borderTopRightRadius: '40px',
                      borderBottomRightRadius: '40px',
                    }}
                  >
                    Browse
                  </Button>
                </label>
                <input
                  id="file-input"
                  type="file"
                  multiple={true}
                  accept=".csv, .xlsx"
                  style={{ display: 'none' }}
                  //onChange={handleFileChange}
                />
                </Box>
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
                  onClick={handleUploadClick}
                  // disabled={isGenerated ? true : false}
                >
                  <FileUploadIcon sx={{marginRight: '5px'}} />
                  <Typography>
                    Upload
                  </Typography>
                </BootstrapButton>
              </Grid>
            </Grid>
          </Box>
          <Divider sx={{ marginTop: '20px' }} />
          <CustomScrollbarBox component={Paper}
            sx={{
              height: '600px',
              position: 'relative',
              padding: '10px 10px 0px 10px',
              boxShadow: 'none',
              backgroundColor: '#ffffff'
            }}
          >
          {fileDescriptions.map((item) => (
          <Card key={item.Id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ width: '30%', flexShrink: 0, color: '#1C3766' }}>Filename: {item.FileName}</Typography>
                <Typography sx={{ width: '25%', flexShrink: 0, color: '#1C3766' }}>Upload Date: {item.UploadDate !== null ? new Date(item.UploadDate ?? '').toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}</Typography>
                <Typography sx={{ width: '25%', flexShrink: 0, color: '#1C3766' }}>Merchant: {item.Merchant}</Typography>
                <Typography sx={{ width: '15%', color: '#1C3766' }}>Count: {item.Count}</Typography>
                <IconButton onClick={() => handleViewModalClick(item.Merchant, item.Id)} sx={{ margin: '-10px', color: '#1C3766' }}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteModalClick(item.Id)} sx={{ margin: '-10px', color: '#1C3766' }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
          {/* {fileDesciptions.map((item) => (
            <Accordion key={item.Id} expanded={expanded === `panel${item.Id}`} onChange={handleChangeAcc(`panel${item.Id}`, item.Id)} >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{color: expanded === `panel${item.Id}` ? '#FFFFFF' : '#1C3766'}} />}
                aria-controls={`${item.Id}-content`}
                id={`${item.Id}-header`}
                sx={{ backgroundColor: expanded === `panel${item.Id}` ? '#1C3766' : 'inherit', height: '30px' }}
              >
                <Typography sx={{ width: '30%', color: expanded === `panel${item.Id}` ? '#FFFFFF' : '#1C3766', flexShrink: 0 }}>Filename: {item.FileName}</Typography>
                <Typography sx={{ width: '25%', color: expanded === `panel${item.Id}` ? '#FFFFFF' : '#1C3766', flexShrink: 0 }}>Upload Date:  {item.UploadDate !== null
                  ? new Date(item.UploadDate ?? '').toLocaleDateString('en-CA', {
                      year: 'numeric',
                      month: 'short', 
                      day: 'numeric',
                    })
                  : ''}
                </Typography>
                <Typography sx={{ width: '25%', color: expanded === `panel${item.Id}` ? '#FFFFFF' : '#1C3766', flexShrink: 0 }}>Merchant: {item.Merchant}</Typography>
                <Typography sx={{ width: '15%', color: expanded === `panel${item.Id}` ? '#FFFFFF' : '#1C3766' }}>Count: {item.Count}</Typography>
                <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteModalClick(item.Id);
                    }}
                >
                  <DeleteIcon sx={{margin: '-10px', color: expanded === `panel${item.Id}` ? '#FFFFFF' : '#1C3766'}}  />
                </IconButton>
              </AccordionSummary>
              <AccordionDetails>
                <PortalTable 
                  portal={portal}
                  loading={loadingPortal}
                  merchant={item.Merchant}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Pagination
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    count={pageCount}
                    page={page}
                    onChange={(event, value) => {
                      setPage(value);
                      const params: IPagination = {
                        Id: item.Id,
                        PageNumber: value,
                        PageSize: itemsPerPage,
                      };
                      fetchUploadedProoflist(params);
                    }}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          ))} */}
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
        title='Delete Prooflist'
        onClose={handleCloseDelete}
        buttonName='Delete'
        open={isModalOpen}
        onSave={handleDeleteClick}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={8}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '20px',
                }}>
                <Typography sx={{ fontSize: '20px', textAlign: 'center', marginRight: '-170px' }}>
                  Are you sure you want to delete this prooflist?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        } 
      />
      <ModalComponent
        title={`View Prooflist - ${merchant}`}
        onClose={handleCloseView}
        buttonName='Export'
        open={isViewModalOpen}
        onSave={handleExportClick}
        children={
          <Box>
            <PortalTable 
              portal={portal}
              loading={loadingPortal}
              merchant={merchant}
              totalSum={totalSum}
            />
            <AccountingAdjustmentsTable 
              adjustments={accountingProoflistAdj}
              loading={loadingPortal}
              merchant={merchant}
            />
          </Box>
        } 
      />
    </Box>
  )
}

export default UploadProoflist