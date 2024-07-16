import { Autocomplete, Box, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, TextField, InputAdornment, MenuItem, CircularProgress, Snackbar, Fade, Alert, Pagination, DialogContentText, Paper, Divider, Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Search as SearchIcon, TableRowsRounded,} from '@mui/icons-material/';
import axios, { AxiosRequestConfig } from 'axios';
import ICustomerCode from './Interface/IMerchants';
import ModalComponent from '../../../Components/Common/ModalComponent';
import ICustomerCodeUpdateDelete from './Interface/IMerchantsUpdateDelete';                                                       
import IPagination from '../../Common/Interface/IPagination';
import AddIcon from '@mui/icons-material/Add';
import ICategory from '../../Common/Interface/ICategory';
import IMerchant from '../../Common/Interface/IMerchant';

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

const StyledTextField = styled(TextField)(() => ({
  fontSize: '10px',
  fontWeight: '100',
}))

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

  // Create a mapping object
  const defaultFormValue = {
    CustomerName: "",
    CustomerCode: "",
    DeleteFlag: false,
    CustomerNo: "",
    CategoryId: 0,
    UserId: "",
  };

const Merchants = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [customerCodes, setCustomerCodes] = useState<ICustomerCode[]>([]);
  const [fieldValues, setFieldValues] = useState<ICustomerCodeUpdateDelete>(defaultFormValue);
  const [customerCodeToUpdate, setCustomerCodeToUpdate] = useState<ICustomerCodeUpdateDelete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openInsert, setOpenInsert] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false); // Form submission status
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [page, setPage] = useState<number>(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState<number>(20); // Items displayed per page
  const [pageCount, setPageCount] = useState<number>(0); // Total page count
  const [columnToSort, setColumnToSort] = useState<string>(""); // Column to sort
  const [orderBy, setOrderBy] = useState<string>("asc"); 
  const getId = window.localStorage.getItem('Id');
  const [category, setCategory] = useState<ICategory[]>([] as ICategory[]);
  const [merchant, setMerchant] = useState<IMerchant[]>([] as IMerchant[]);

  useEffect(() => {
    document.title = 'Maintenance | Merchants';
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
    setFieldValues(defaultFormValue);
  }, []);

  const handleCloseModalInsert = useCallback(() => {
    setOpenInsert(false);
    setSubmitted(false);
    setFieldValues(defaultFormValue);
  }, []);

  const handleSubmitInsert = async() => {
    setSubmitted(true);
    const allIsPopulated = !fieldValues.CustomerCode || !fieldValues.CustomerName || !fieldValues.CustomerNo;
    fieldValues.UserId = Id;
    if (allIsPopulated) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity('error');
      setMessage('Please input required field.');
      return;
    }
    
    const insertRequest: AxiosRequestConfig = {
      method: 'POST',
      url: `${REACT_APP_API_ENDPOINT}/CustomerCode/InsertCustomerCodeAsync`,
      data: fieldValues,
    };

    axios(insertRequest)
      .then(() => {
        setSubmitted(false);
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setMessage('Customer insert successfully!')
        fetchCustomerCodes(page, itemsPerPage, searchQuery, columnToSort, orderBy);
        handleCloseModalInsert();
        setSearchQuery('');
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        if (error.response && error.response.status === 404) {
          setMessage('Customer already exist on database');
        } else {
          setMessage('Error occurred. Please try again.');
        }
      });
  }

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
  const handleSubmitEdit = async() => {
    setSubmitted(true);
    const allIsPopulated = !fieldValues?.CustomerNo || !fieldValues.CustomerName || !fieldValues.CustomerCode;
    fieldValues.UserId = Id;
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
        setSearchQuery('');
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error occurred. Please try again.');
      });
  }

  const handleEditOrInsertClick = (ID?: number) => {
    const customerToUpdate = customerCodes.find(customer => customer.Id === ID);
    if (customerToUpdate) 
    {
        setFieldValues(customerToUpdate);
        setOpenEdit(true);
    }
    else 
    {
        setOpenInsert(true);
    }
  };

  const handleChangeCustomerUpdate = (field: keyof ICustomerCodeUpdateDelete, value: any) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [field]: value
    }) as ICustomerCodeUpdateDelete);
  
    const selectedMerchant = merchant.find(
      (item) => item.MerchantName === value || item.MerchantNo === value
    );
  
    if (selectedMerchant) {
      setFieldValues((prevState) => ({
        ...prevState,
        CustomerName: selectedMerchant.MerchantName,
        CustomerNo: selectedMerchant.MerchantNo,
        CustomerCode: `${selectedMerchant.MerchantCode}`,
      }));
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const category: AxiosRequestConfig = {
          method: 'POST',
          url: `${REACT_APP_API_ENDPOINT}/Category/GetCategory`
        };
    
        axios(category)
          .then(async (result) => {
            var categories = result.data as ICategory[]
            setCategory(categories)
          })
          .catch(() => {
          })
      } catch (error) {
      } 
    };
  
    fetchCategory();
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const merchant: AxiosRequestConfig = {
          method: 'POST',
          url: `${REACT_APP_API_ENDPOINT}/Merchant/GetMerchant`
        };
    
        axios(merchant)
          .then(async (result) => {
            var merchants = result.data as IMerchant[]
            setMerchant(merchants)
          })
          .catch(() => {
          })
      } catch (error) {
      } 
    };
  
    fetchMerchant();
  }, [REACT_APP_API_ENDPOINT]);

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
            Merchants
          </Typography>
          <Divider sx={{ marginBottom: '20px' }} />
          <Grid container spacing={1} sx={{ height: '60px' }}>
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
            <Grid item xs={12} sm={6.5}/>
            <Grid item xs={12} sm={1.2}>
                <Button
                  fullWidth
                  onClick={() => {
                    handleEditOrInsertClick(undefined)
                  }}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: "#4761AD",
                    '&:hover': {
                      backgroundColor: "#20346E",
                      color: "#FFFFFF",
                    },
                    color: "#FFFFFF",
                    fontWeight: 'bold',
                    fontSize: '12px',
                    height: '40px',
                    borderRadius: '15px',
                    boxShadow: '1px 5px 4px -1px rgba(0,0,0,0.3)',
                  }}
                >
                  <AddIcon/>Add Merchant
                </Button>
            </Grid>
          </Grid>
          <Divider />
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
                  <StyledTableCellHeader sx={{ textAlign: 'center' }}>Code</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ textAlign: 'center' }}>Merchant</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ textAlign: 'center' }}>Customer Number</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ textAlign: 'center' }}>Category</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ textAlign: 'center' }}>Status</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ textAlign: 'center' }}>Action</StyledTableCellHeader>
                </TableRow>
              </TableHead>
              <TableBody >
                {customerCodes.map((row, index) => (
                  <TableRow key={index} sx={{ "& td": { border: 0 }}}>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.CustomerCode}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.CustomerName}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.CustomerNo}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.CategoryName}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.DeleteFlag ? 'Inactive' : 'Active'}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <BootstrapButton
                            onClick={() => {
                              handleEditOrInsertClick(row.Id)
                            }}
                            sx={{
                              backgroundColor: "#4761AD",
                              width: '90px',
                              height: "20px",
                              borderRadius: "15px",
                              color: "#FFFFFF",
                              marginLeft: 0.5,
                              "&:hover": {
                                backgroundColor: "#20346E",
                                color: "#FFFFFF",
                              },
                            }}>View
                          </BootstrapButton>
                      </Box>
                    </StyledTableCellBody>
                  </TableRow>
                ))}
                </TableBody>
            </Table>
          </CustomScrollbarBox>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
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
          title='Merchant Details'
          onClose={handleCloseModalEdit}
          buttonName='Save Changes'
          open={openEdit}
          onSave={handleSubmitEdit}
          children={
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={12}
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: '900',
                    color: '#1C2C5A',
                    fontSize: '12px'
                  }}>
                  Merchant Name *
                </Grid>
                <Grid item xs={12}>
                  <Box display={'flex'}>
                    <Autocomplete
                      fullWidth
                      options={merchant}
                      getOptionLabel={(option) => option?.MerchantName}
                      onChange={(event, value) =>
                        handleChangeCustomerUpdate("CustomerName", value?.MerchantName)
                      }
                      value={merchant.find((item) => item.MerchantName === fieldValues.CustomerName) || null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          type="text"
                          variant="outlined"
                          sx={{
                            fontSize: '12px',
                            fontWeight: '100',
                            borderRadius: '13px',
                            backgroundColor: '#EEEEEE',
                            color: '#1C2C5A !important',
                            "& fieldset": { border: 'none' },
                            paddingTop: '1px',
                            boxShadow: 'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                            '& .MuiInputBase-root': {
                              fontSize: '12px',
                              color: '#1C2C5A',
                            },
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} sx={{ fontSize: '12px', color: '#1C2C5A', padding: '8px' }}>
                          {option.MerchantName}
                        </Box>
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: '900',
                    color: '#1C2C5A',
                    fontSize: '12px'
                  }}>
                  Merchant No. *
                </Grid>
                <Grid item xs={12}>
                  <Box display={'flex'}>
                    <Autocomplete
                      fullWidth
                      options={merchant}
                      getOptionLabel={(option) => option?.MerchantNo}
                      onChange={(event, value) =>
                        handleChangeCustomerUpdate("CustomerNo", value?.MerchantNo)
                      }
                      value={merchant.find((item) => item.MerchantNo === fieldValues.CustomerNo) || null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          type="text"
                          variant="outlined"
                          sx={{
                            fontSize: '12px',
                            fontWeight: '100',
                            borderRadius: '13px',
                            backgroundColor: '#EEEEEE',
                            color: '#1C2C5A !important',
                            "& fieldset": { border: 'none' },
                            boxShadow:
                              'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                            '& .MuiInputBase-root': {
                              fontSize: '12px',
                              color: '#1C2C5A',
                            },
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} sx={{ fontSize: '12px', color: '#1C2C5A', padding: '8px' }}>
                          {option.MerchantName}
                        </Box>
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: '900',
                    color: '#1C2C5A',
                    fontSize: '12px'
                  }}>
                  Merchant Code *
                </Grid>
                <Grid item xs={12}>
                  <Box display={'flex'}>
                  <StyledTextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      type="text"
                      required
                      value={fieldValues.CustomerCode}
                      error={submitted && !fieldValues.CustomerCode}
                      helperText={submitted && !fieldValues?.CustomerCode && "Merchant Code is required"}
                      InputProps={{
                        sx: {
                          fontSize: '12px',
                          borderRadius: '13px',
                          backgroundColor: '#D8D8D8',
                          color: '#1C2C5A',
                          "& fieldset": { border: 'none' },
                          boxShadow: 'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                        },
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: '900',
                    color: '#1C2C5A',
                    fontSize: '12px'
                  }}>
                Category. *
                </Grid>
                <Grid item xs={12}>
                  <Box display={'flex'}>
                    <StyledTextField 
                      size='small' 
                      type="text"
                      fullWidth
                      variant="outlined"
                      required
                      select
                      value={fieldValues?.CategoryId}
                      onChange={(e) => handleChangeCustomerUpdate("CategoryId", e.target.value === ''? '' : e.target.value)}
                      error={submitted && !fieldValues?.CategoryId}
                      helperText={submitted && !fieldValues?.CategoryId && "Category is required"}
                      InputProps={{
                        sx: {
                          fontSize: '12px', 
                          borderRadius: '13px', 
                          backgroundColor: '#EEEEEE',
                          color: '#1C2C5A',
                          "& fieldset": { border: 'none' },
                          boxShadow: 'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                        },
                      }}
                    >
                      {category.map((item: ICategory) => (
                        <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={item.Id} value={item.Id}>
                          {item.CategoryName}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          } 
        />
      <ModalComponent
        title='Add Merchant'
        onClose={handleCloseModalInsert}
        buttonName='Save'
        open={openInsert}
        onSave={handleSubmitInsert}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sx={{ fontFamily: 'Inter', fontWeight: '900', color: '#1C2C5A', fontSize: '12px' }}>
                Merchant Name *
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'}>
                  <Autocomplete
                    fullWidth
                    options={merchant}
                    getOptionLabel={(option) => option?.MerchantName}
                    onChange={(event, value) =>
                      handleChangeCustomerUpdate("CustomerName", value?.MerchantName)
                    }
                    value={merchant.find((item) => item.MerchantName === fieldValues.CustomerName) || null}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        type="text"
                        variant="outlined"
                        sx={{
                          fontSize: '12px',
                          fontWeight: '100',
                          borderRadius: '13px',
                          backgroundColor: '#EEEEEE',
                          color: '#1C2C5A !important',
                          "& fieldset": { border: 'none' },
                          boxShadow:
                            'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                          '& .MuiInputBase-root': {
                            fontSize: '12px',
                            color: '#1C2C5A',
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props} sx={{ fontSize: '12px', color: '#1C2C5A', padding: '8px' }}>
                        {option.MerchantName}
                      </Box>
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Merchant No. *
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'}>
                  <Autocomplete
                      fullWidth
                      options={merchant}
                      getOptionLabel={(option) => option?.MerchantNo}
                      onChange={(event, value) =>
                        handleChangeCustomerUpdate("CustomerNo", value?.MerchantNo)
                      }
                      value={merchant.find((item) => item.MerchantNo === fieldValues.CustomerNo) || null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          type="text"
                          variant="outlined"
                          sx={{
                            fontSize: '12px',
                            fontWeight: '100',
                            borderRadius: '13px',
                            backgroundColor: '#EEEEEE',
                            color: '#1C2C5A !important',
                            "& fieldset": { border: 'none' },
                            boxShadow:
                              'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                            '& .MuiInputBase-root': {
                              fontSize: '12px',
                              color: '#1C2C5A',
                            },
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props} sx={{ fontSize: '12px', color: '#1C2C5A', padding: '8px' }}>
                          {option.MerchantName}
                        </Box>
                      )}
                    />
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ fontFamily: 'Inter', fontWeight: '900', color: '#1C2C5A', fontSize: '12px' }}>
                Merchant Code *
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'}>
                  <TextField
                    size='small'
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    disabled
                    value={fieldValues.CustomerCode}
                    onChange={(e) => handleChangeCustomerUpdate("CustomerCode", e.target.value)}
                    helperText={submitted && !fieldValues?.CustomerCode && "Customer Code is required"}
                    error={submitted && !fieldValues.CustomerCode}
                    InputProps={{
                      sx: {
                        fontSize: '12px',
                        borderRadius: '13px',
                        backgroundColor: '#D8D8D8',
                        color: '#1C2C5A',
                        "& fieldset": { border: 'none' },
                        boxShadow: 'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Category. *
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'}>
                  <StyledTextField 
                    size='small' 
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    select
                    value={fieldValues?.CategoryId}
                    onChange={(e) => handleChangeCustomerUpdate("CategoryId", e.target.value === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.CategoryId}
                    InputProps={{
                      sx: {
                        fontSize: '12px', 
                        borderRadius: '13px', 
                        backgroundColor: '#EEEEEE',
                        color: '#1C2C5A',
                        "& fieldset": { border: 'none' },
                        boxShadow: 'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                    {category.map((item: ICategory) => (
                      <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={item.Id} value={item.Id}>
                        {item.CategoryName}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Box>
              </Grid>
            </Grid>
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

export default Merchants
