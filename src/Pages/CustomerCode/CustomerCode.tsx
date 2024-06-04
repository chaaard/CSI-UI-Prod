import { Box, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, TextField, InputAdornment, MenuItem, CircularProgress, Snackbar, Fade, Alert, Pagination, DialogContentText, Paper, Divider } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Search as SearchIcon,} from '@mui/icons-material/';
import axios, { AxiosRequestConfig } from 'axios';
import ICustomerCode from './Interface/ICustomerCode';
import ModalComponent from '../../Components/Common/ModalComponent';
import ICustomerCodeUpdateDelete from './Interface/ICustomerUpdateDelete';
import IPagination from '../Common/Interface/IPagination';
import ICategory from '../Common/Interface/ICategory';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IAnalyticProps from '../Common/Interface/IAnalyticsProps';
import { insertLogs } from '../../Components/Functions/InsertLogs';

const StyledTableCellHeader = styled(TableCell)(() => ({
  fontSize: "15px",
  fontWeight: '900',
  color: '#1C2C5A',
  textAlign: 'center'
}));

const StyledTableCellBody = styled(TableCell)(() => ({
  fontSize: "12px",
  padding: "1px",
  color: '#1C2C5A',
  textAlign: 'center'
})); 

const BootstrapButton = styled(IconButton)(() => ({
  textTransform: 'none',
  fontSize: 12, 
  lineHeight: 1.5,
  color: '#1C2C5A',
  fontWeight: '900',
  fontFamily: 'Inter',
}));

const CustomScrollbarBox = styled(Box)`
    overflow-y: auto;
    height: calc(100vh - 160px);

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

const CustomerCode = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [customerCodes, setCustomerCodes] = useState<ICustomerCode[]>([]);
  const [fieldValues, setFieldValues] = useState<ICustomerCodeUpdateDelete>();
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false); // Form submission status
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [page, setPage] = useState<number>(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState<number>(20); // Items displayed per page
  const [pageCount, setPageCount] = useState<number>(0); // Total page count
  const [columnToSort, setColumnToSort] = useState<string>(""); // Column to sort
  const [orderBy, setOrderBy] = useState<string>("asc"); // Sorting order
  const getId = window.localStorage.getItem('Id');

  useEffect(() => {
    document.title = 'Maintenance | Customer Code';
  }, []);

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

  // Handle changes in the search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPage(1);
  };

  const handleCloseModalEdit = useCallback(() => {
    setOpenEdit(false);
    setSubmitted(false);
  }, []);

  const handleCloseModalDelete = useCallback(() => {
    setOpenDelete(false);
    setSubmitted(false);
  }, []);

  const fetchCustomerCodes = useCallback(async(pageNumber: number, pageSize: number, searchQuery: string | null, columnToSort: string | null, orderBy: string | null) => {
    try {
      setLoading(true);
      const params: IPagination = {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchQuery: searchQuery,
        ColumnToSort: columnToSort,
        OrderBy: orderBy, 
      };

      const getCustomerCodes: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/CustomerCode/GetCustomerCodesAsync`,
        data: params,
      };

      axios(getCustomerCodes)
      .then(async (response) => {
        setCustomerCodes(response.data.CustomerCodesList);
        setPageCount(response.data.TotalPages);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
      })
      .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error fetching customer codes:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    fetchCustomerCodes(page, itemsPerPage, searchQuery, columnToSort, orderBy);
  }, [fetchCustomerCodes, page, itemsPerPage, searchQuery, columnToSort, orderBy]);

  // Handle changes in form fields
  const handleChangeCustomer = (field: keyof ICustomerCodeUpdateDelete, value: any) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [field]: value,
      UserId: Id
    }) as ICustomerCodeUpdateDelete | undefined);
  };

  const handleEditOrDeleteClick = (id: number, isEdit: boolean) => {
    const customerCodeToUpdate = customerCodes.find(code => code.Id === id);
    if (customerCodeToUpdate) {
      setFieldValues(customerCodeToUpdate);
      isEdit ? setOpenEdit(true) : setOpenDelete(true);
    } else {
      console.error(`Customer code with id ${id} not found.`);
    }
  };

  const handleSubmitEdit = async() => {
    setSubmitted(true);
    const allIsPopulated = !fieldValues?.CustomerNo || !fieldValues.CustomerName || !fieldValues.CustomerCode;
    
    if (allIsPopulated) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity('error');
      setMessage('Please input required field.');
      return;
    }
    
    const updateRequest: AxiosRequestConfig = {
      method: 'PUT',
      url: `${REACT_APP_API_ENDPOINT}/CustomerCode/UpdateCustomerCodeByIdAsync`,
      data: fieldValues,
    };

    axios(updateRequest)
      .then(() => {
        setSubmitted(false);
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setMessage('Customer successfully updated!')
        fetchCustomerCodes(page, itemsPerPage, searchQuery, columnToSort, orderBy);
        handleCloseModalEdit();
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error occurred. Please try again.');
      });
  }

  // Handle form submission for deleting a zone type
  const handleSubmitDelete = async () => {
    const deleteRequest: AxiosRequestConfig = {
      method: 'PUT',
      url: `${REACT_APP_API_ENDPOINT}/CustomerCode/DeleteCustomerCodeByIdAsync?id=${fieldValues?.Id}`,
    };

    await axios(deleteRequest)
      .then(async () => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setMessage('Data deleted successfully!')
        handleCloseModalDelete();
  
        const anaylticsParamUpdated: IAnalyticProps = {
          userId: Id,
          action: 'Delete Merchant',
          remarks: `Id: ${fieldValues?.Id} : Successfully Deleted`
        };

        await insertLogs(anaylticsParamUpdated);

        fetchCustomerCodes(1, itemsPerPage, "", "", "");
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error occurred. Please try again.');
      });
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
          Clubs
        </Typography>
        <Divider sx={{ marginBottom: '20px' }} />
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <TextField
              placeholder='Search'
              size='small'
              fullWidth
              InputProps={{
                sx: {
                  borderRadius: '20px', 
                  backgroundColor: '#EEEEEE',
                  color: '#1C2C5A',
                  "& fieldset": { border: 'none' },
                  boxShadow: 'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus 
            />
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: '20px' }} />
          <CustomScrollbarBox component={Paper}
            sx={{
              height: '600px',
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
                  <StyledTableCellHeader sx={{ width: '185px'}}>ID</StyledTableCellHeader>
                  <StyledTableCellHeader>Customer Name</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ width: '200px'}}>Code</StyledTableCellHeader>
                  <StyledTableCellHeader>Customer No</StyledTableCellHeader>
                  <StyledTableCellHeader>Action</StyledTableCellHeader>
                </TableRow>
              </TableHead>
              <TableBody >
                {customerCodes.map((row, index) => (
                <TableRow key={index} sx={{ "& td": { border: 0 }}}>
                  <StyledTableCellBody sx={{ textAlign: 'center', width: '160px' }} >{row.Id}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'start', width: '320px' }}>{row.CustomerName}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'center', width: '170px' }}>{row.CustomerCode}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'center', width: '250px' }}>{row.CustomerNo}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'center', width: '60px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <BootstrapButton
                        onClick={() => {
                          handleEditOrDeleteClick(row.Id, true)
                        }}
                        sx={{
                          backgroundColor: "#FCBA70",
                          width: '90px',
                          height: "20px",
                          borderRadius: "15px",
                          color:"#634422",
                          marginLeft: 0.5,
                          "&:hover": {
                            backgroundColor: "#FF9419",
                            color: '#FFFFFF',
                          },
                        }}>
                        <EditIcon  sx={{fontSize: '15px', marginRight: '2px'}}/>Edit
                      </BootstrapButton>
                      <BootstrapButton
                        onClick={() => {
                          handleEditOrDeleteClick(row.Id, false)
                        }}
                        sx={{
                          backgroundColor: "#FFB5B5",
                          width: '90px',
                          height: "20px",
                          borderRadius: "15px",
                          color: "#644848",
                          marginLeft: 0.5,
                          "&:hover": {
                            backgroundColor: "#FF7171",
                            color: '#FFFFFF',
                          },
                        }}>
                        <DeleteIcon  sx={{fontSize: '15px', marginRight: '2px'}}/>Delete
                      </BootstrapButton>
                    </Box>
                  </StyledTableCellBody>
                </TableRow>
  
                ))}
              </TableBody>
            </Table>
          </CustomScrollbarBox>
          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Pagination
              variant="outlined"
              shape="rounded"
              count={pageCount}
              page={page}
              onChange={(event, value) => {
                setPage(value);
                fetchCustomerCodes(value, itemsPerPage, searchQuery, columnToSort, orderBy);
              }}
            />
          </Box>
      </Paper>
        {/* Snackbar for displaying messages */}
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
        title='Edit Customer'
        onClose={handleCloseModalEdit}
        buttonName='Save'
        open={openEdit}
        onSave={handleSubmitEdit}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={8}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '20px'
                }}>
                Customer Name *
              </Grid>
              <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
                <Box display={'flex'}>
                  <TextField 
                    size='small' 
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    value={fieldValues?.CustomerName}
                    onChange={(e) => handleChangeCustomer("CustomerName", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.CustomerName}
                    helperText={submitted && !fieldValues?.CustomerName && "Customer Name is required"}
                    InputProps={{
                      sx: {
                        borderRadius: '13px', 
                        backgroundColor: '#EEEEEE',
                        color: '#1C2C5A',
                        "& fieldset": { border: 'none' },
                        boxShadow: 'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                  </TextField>
                </Box>
              </Grid>
              <Grid item xs={8}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '20px'
                }}>
                Customer Code *
              </Grid>
              <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
                <Box display={'flex'}>
                  <TextField 
                    type="text"
                    size='small' 
                    fullWidth
                    variant="outlined"
                    required
                    value={fieldValues?.CustomerCode}
                    onChange={(e) => handleChangeCustomer("CustomerCode", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.CustomerCode}
                    helperText={submitted && !fieldValues?.CustomerCode && "Customer Code is required"}
                    InputProps={{
                      sx: {
                        borderRadius: '13px', 
                        backgroundColor: '#EEEEEE',
                        color: '#1C2C5A',
                        "& fieldset": { border: 'none' },
                        boxShadow: 'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                  </TextField>
                </Box>
              </Grid>
              <Grid item xs={8}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '20px'
                }}>
                Customer No *
              </Grid>
              <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
                <Box display={'flex'}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="CustomerNo"
                    type="text"
                    required
                    value={fieldValues?.CustomerNo}
                    onChange={(e) => handleChangeCustomer("CustomerNo", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.CustomerNo}
                    helperText={submitted && !fieldValues?.CustomerNo && "Category is required"}
                    InputProps={{
                      sx: {
                        borderRadius: '13px', 
                        backgroundColor: '#EEEEEE',
                        color: '#1C2C5A',
                        "& fieldset": { border: 'none' },
                        boxShadow: 'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                  </TextField>
                </Box>
              </Grid>
            </Grid>
          </Box>
        } 
      />
      <ModalComponent
        title='Warning!'
        onClose={handleCloseModalDelete}
        buttonName='Yes'
        open={openDelete}
        onSave={handleSubmitDelete}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <DialogContentText
              sx={{ color: "#1C2C5A", textAlign: 'center', fontSize: '20px', fontWeight: '900' }}
            >
              This action cannot be undone,
              <br />
              Continue Delete?
            </DialogContentText>
          </Box>
        } 
      />
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

export default CustomerCode
