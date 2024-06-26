import { Accordion, AccordionDetails, AccordionSummary, Alert, Backdrop, Box, Button, CircularProgress, Divider, Fade, Grid, IconButton, MenuItem, Pagination, Paper, Snackbar, TextField, Typography, styled } from "@mui/material";
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
  const [fileDesciptions, setFileDesciptions] = useState<IFileDescriptions[]>([]);
  const [isFileDescriptions, setIsFileDescriptions] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [page, setPage] = useState<number>(1); 
  const [itemsPerPage] = useState<number>(250); 
  const [pageCount, setPageCount] = useState<number>(0); 
  const [portal, setPortal] = useState<IPortal[]>([]);

  useEffect(() => {
    document.title = 'Accounting | Upload Prooflist';
  }, []);

  let Id = "";
  if(getId !== null)
  {
    Id = getId;
  }

  const handleChangeAcc = (panel: string, id: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setPortal([])
      setPageCount(0)
      setPage(1)
      setExpanded(isExpanded ? panel : false);
      
      if(isExpanded)
      {
        setLoadingPortal(true)
        const params: IPagination = {
          Id: id,
          PageNumber: page,
          PageSize: itemsPerPage,
        };

        fetchUploadedProoflist(params);
        setLoadingPortal(false)
      }
  };

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
        setPortal(response.data.Item1);
        setPageCount(response.data.Item2);
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
            setMessage(`${selected} proof list uploaded successfully.`);
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

  const handleDeleteModalClick = (id: number) => {
    setIsModalOpen(true);
    setId(id);
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 16px 16px 16px',  }}>
      <Paper elevation={3} sx={{ padding: '16px 16px 16px 16px', width: '100%',  height: '790px', borderRadius: '15px' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#1C2C5A', }}>
          Upload Prooflist
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
                  onChange={handleFileChange}
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
          {fileDesciptions.map((item) => (
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
          ))}
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
    </Box>
  )
}

export default UploadProoflist