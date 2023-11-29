import { Box, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, TextField, InputAdornment, MenuItem, CircularProgress, Snackbar, Fade, Alert, Pagination, DialogContentText } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Search as SearchIcon,} from '@mui/icons-material/';
import axios, { AxiosRequestConfig } from 'axios';
import ICustomerCode from './Interface/ICustomerCode';
import ModalComponent from '../../Components/Common/ModalComponent';
import ICustomerCodeUpdateDelete from './Interface/ICustomerUpdateDelete';
import IPagination from '../Common/Interface/IPagination';
import ICategory from '../Common/Interface/ICategory';

const StyledTableCellHeader = styled(TableCell)(() => ({
  padding: "8px 17px !important",
  fontSize: "20px",
  fontWeight: '900',
  color: '#1C2C5A',
  textAlign: 'center',
}));

const StyledTableCellBody = styled(TableCell)(() => ({
  fontSize: "15px",
  color: '#1C2C5A',
  fontWeight: '500',
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
  const [category, setCategory] = useState<ICategory[]>([]);

  useEffect(() => {
    document.title = 'Maintenance | Customer Code';
  }, []);

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

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get<ICategory[]>(`${REACT_APP_API_ENDPOINT}/Category/GetCategoryAsync`);
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  useEffect(() => {
    fetchCustomerCodes(page, itemsPerPage, searchQuery, columnToSort, orderBy);
  }, [fetchCustomerCodes, page, itemsPerPage, searchQuery, columnToSort, orderBy]);

  // Handle changes in form fields
  const handleChangeCustomer = (field: keyof ICustomerCodeUpdateDelete, value: any) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [field]: value
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
    const allIsPopulated = !fieldValues?.CategoryId || !fieldValues.CustomerName || !fieldValues.CustomerCode;
    
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
  const handleSubmitDelete = () => {
    const deleteRequest: AxiosRequestConfig = {
      method: 'PUT',
      url: `${REACT_APP_API_ENDPOINT}/CustomerCode/DeleteCustomerCodeByIdAsync?id=${fieldValues?.Id}`,
    };

    axios(deleteRequest)
      .then(() => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setMessage('Data deleted successfully!')
        handleCloseModalDelete();
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
        <Box style={{ position: 'relative' }}>
            <Table
              sx={{
                position: 'sticky', 
                top: 0, 
                zIndex: 1,
                backgroundColor: '#FFFFFF',
                height: '50px'
              }}>
              <TableHead sx={{ backgroundColor: '#FFFFFF', paddingTop: '-30px' }}>
                <TableRow sx={{
                  minWidth: 700,
                  "& th": {
                    borderBottom: "2px solid #1C2C5A",
                    padding: '1px',
                  },
                }}
                >
                  <StyledTableCellHeader sx={{ width: '185px'}}>ID</StyledTableCellHeader>
                  <StyledTableCellHeader>Customer Name</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ width: '200px'}}>Code</StyledTableCellHeader>
                  <StyledTableCellHeader>Category</StyledTableCellHeader>
                  <StyledTableCellHeader>Action</StyledTableCellHeader>
                </TableRow>
              </TableHead>
              </Table>

            <CustomScrollbarBox
                sx={{
                  height: '650px',
                  position: 'relative',
                }}
              >
              <Table  
                sx={{
                  minWidth: 700,
                  " & td": {
                    border: 0,
                    padding: '1px',
                  },
                }}>
              <TableBody >
                {customerCodes.map((row, index) => (
                <TableRow key={index} sx={{ "& td": { border: 0 }}}>
                  <StyledTableCellBody sx={{ textAlign: 'center', width: '160px' }} >{row.Id}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'start', width: '390px' }}>{row.CustomerName}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'center', width: '150px' }}>{row.CustomerCode}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'center', width: '250px' }}>{row.Category}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'center', width: '60px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <BootstrapButton
                        onClick={() => {
                          handleEditOrDeleteClick(row.Id, true)
                        }}
                        sx={{
                          backgroundColor: "#BECEFB",
                          width: '90px',
                          height: "20px",
                          borderRadius: "15px",
                          "&:hover": {
                            backgroundColor: "#7799F8",
                          },
                        }}>
                          Edit
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
                          marginLeft: 0.5,
                          "&:hover": {
                            backgroundColor: "#FF7171", // Change to the desired hover color
                          }
                        }}>
                        Delete
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
        </Box>
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
                Category *
              </Grid>
              <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
                <Box display={'flex'}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="CategoryId"
                    type="text"
                    required
                    select
                    value={fieldValues?.CategoryId}
                    onChange={(e) => handleChangeCustomer("CategoryId", e.target.value)}
                    error={submitted && !fieldValues?.CategoryId}
                    helperText={submitted && !fieldValues?.CategoryId && "Category is required"}
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
                    {category.map((category: ICategory) => (
                      <MenuItem key={category.Id} value={category.Id}>
                        {category.CategoryName}
                      </MenuItem>
                    ))}
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
