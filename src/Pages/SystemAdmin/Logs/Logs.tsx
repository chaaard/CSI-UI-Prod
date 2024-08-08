import { Box, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, TextField, InputAdornment, MenuItem, CircularProgress, Snackbar, Fade, Alert, Pagination, DialogContentText, Paper, Divider, Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Label, LabelImportant, Search as SearchIcon,} from '@mui/icons-material/';
import axios, { AxiosRequestConfig } from 'axios';
import ModalComponent from '../../../Components/Common/ModalComponent';
import ILocations from '../../Interface/ILocations';
import ILogs from './Interface/ILogs';
import ILogDetails from './Interface/ILogDetails';
import IPagination from '../../Interface/IPagination';

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
    Id: 0,
    CustomerId: '',
    LocationId: 201,
    TransactionDate: '',
    MembershipNo: '',
    CashierNo: '',
    RegisterNo: '',
    TransactionNo: '',
    OrderNo: '',
    Qty: 0,
    Amount: 0.00,
    SubTotal: 0.00,
    UserId: '',
    StatusId: 1,
    IsUpload: false,
    IsGenerate: false,
    IsTransfer: false,
    DeleteFlag: false,
    InvoiceNo: '',
  };

const Logs = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [dashboardLogs, setDashboardLogs] = useState<ILogs[]>([] as ILogs[]);
  const [fieldValues, setFieldValues] = useState<ILogDetails>(defaultFormValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [openView, setOpenView] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [page, setPage] = useState<number>(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState<number>(20); // Items displayed per page
  const [pageCount, setPageCount] = useState<number>(0); // Total page count
  const [columnToSort, setColumnToSort] = useState<string>(""); // Column to sort
  const [orderBy, setOrderBy] = useState<string>("asc"); // Sorting order
  const getId = window.localStorage.getItem('Id');

  useEffect(() => {
    document.title = 'Maintenance | Logs';
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

  const handleViewDetailsClick = (AnalyticsId: number) => {
    handleViewDetails(AnalyticsId)
      .then((logDetail) => {
        setFieldValues(logDetail);  // Set the field values with the fetched data
        setOpenView(true);
      })
      .catch((error) => {
        // Optional: handle any error that might occur in handleViewDetails
        console.error("Error fetching details: ", error);
      });
  };

  const handleCloseModalView = useCallback(() => {
    setOpenView(false);
    setFieldValues(defaultFormValue);
  }, []);

  const handleViewDetails = (AnalyticsId: number) => {
    const resetRequest: AxiosRequestConfig = {
      method: 'GET',
      url: `${REACT_APP_API_ENDPOINT}/Log/GetLogByIdAsync?id=${AnalyticsId}`,
    };
  
    return axios(resetRequest)
      .then((response) => {
        // Assuming the response data is in response.data
        const logDetail = response.data;
        return logDetail;  // Return the fetched data
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error occurred. Please try again.');
        throw error;  // Re-throw the error for further handling if needed
      });
  };

  // Handle changes in the search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPage(1);
  };

  const fetchLogs = useCallback(async(pageNumber: number, pageSize: number, searchQuery: string | null, columnToSort: string | null, orderBy: string | null) => {
    try {
      setLoading(true);
      const params: IPagination = {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchQuery: searchQuery,
        ColumnToSort: columnToSort,
        OrderBy: orderBy, 
      };

      const getLogs: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Log/GetLogsListAsync`,
        data: params,
      };

      axios(getLogs)
      .then(async (response) => {
        setDashboardLogs(response.data.LogList);
        setPageCount(response.data.TotalPages);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
      })
      .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    fetchLogs(page, itemsPerPage, searchQuery, columnToSort, orderBy);
  }, [fetchLogs, page, itemsPerPage, searchQuery, columnToSort, orderBy]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()]; // Get the month name
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day},${year}`;
  };

  const formattedDate = fieldValues && fieldValues.TransactionDate ? formatDate(fieldValues.TransactionDate) : '';

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
        <Paper elevation={3} sx={{ padding: '20px', maxWidth: '100%', borderRadius: '15px', height: '750px' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#1C2C5A', }}>
            Logs
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
            <Grid item xs={12} sm={8}/>
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
                    backgroundColor: '#ffffff',
                  }}
                >
                  <TableRow>
                    <StyledTableCellHeader sx={{ textAlign: 'center', minWidth: '100px' }}>Name</StyledTableCellHeader>
                    <StyledTableCellHeader sx={{ textAlign: 'center', minWidth: '100px' }}>Date</StyledTableCellHeader>
                    <StyledTableCellHeader sx={{ textAlign: 'center', minWidth: '100px' }}>Action</StyledTableCellHeader>
                    <StyledTableCellHeader sx={{ textAlign: 'center', minWidth: '100px' }}>Remarks</StyledTableCellHeader>
                    <StyledTableCellHeader sx={{ textAlign: 'center' }}>RowsCountBefore</StyledTableCellHeader>
                    <StyledTableCellHeader sx={{ textAlign: 'center' }}>RowsCountAfter</StyledTableCellHeader>
                    <StyledTableCellHeader sx={{ textAlign: 'center' }}>TotalAmount</StyledTableCellHeader>
                    <StyledTableCellHeader sx={{ textAlign: 'center', minWidth: '100px' }}>Club</StyledTableCellHeader>
                    <StyledTableCellHeader sx={{ textAlign: 'center' }}>CustomerId</StyledTableCellHeader>
                    <StyledTableCellHeader sx={{ textAlign: 'center', minWidth: '100px' }}>Filename</StyledTableCellHeader>
                    <StyledTableCellHeader sx={{ textAlign: 'center' }}>Action</StyledTableCellHeader>
                    <StyledTableCellHeader sx={{ textAlign: 'center' }}>Analytics</StyledTableCellHeader>
                    <StyledTableCellHeader sx={{ textAlign: 'center' }}>Adjustment</StyledTableCellHeader>
                  </TableRow>
                </TableHead> 
                <TableBody >
                  {dashboardLogs.map((row, index) => (
                  <TableRow key={index} sx={{ "& td": { border: 0 }}}>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.UserId}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{formatDate(row.Date)}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.Action}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.Remarks}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.RowsCountBefore}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.RowsCountAfter}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.TotalAmount}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.Club}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.CustomerId}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.Filename}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.ActionId}</StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {row.AnalyticsId && (
                          <BootstrapButton
                            onClick={() => {
                              handleViewDetailsClick(row.AnalyticsId)
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
                            }}
                          >
                            {row.AnalyticsId}
                          </BootstrapButton>
                        )}
                      </Box>
                    </StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: 'center' }}>{row.AdjustmentId}</StyledTableCellBody>
                  </TableRow>
                  ))}
                </TableBody>
            </Table>
          </CustomScrollbarBox>
        
          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0 }}>
            <Pagination
              variant="outlined"
              shape="rounded"
              count={pageCount}
              page={page}
              onChange={(event, value) => {
                setPage(value);
                fetchLogs(value, itemsPerPage, searchQuery, columnToSort, orderBy);
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
        title='Log Details'
        onClose={handleCloseModalView}
        extraButtonIsDisabled={isDisabled}
        isDisabled={true}
        open={openView}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                ID
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Location ID
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Customer ID
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="UserId"
                    disabled
                    value={fieldValues?.Id}
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
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="UserId"
                    disabled
                    value={fieldValues?.CustomerId}
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
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="UserId"
                    disabled
                    value={fieldValues?.LocationId}
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
                  />
                </Box>
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Transaction Date
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Transaction Number
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Membership Number
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="UserId"
                    disabled
                    value={formattedDate}
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
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="UserId"
                    disabled
                    value={fieldValues?.TransactionNo}
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
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="UserId"
                    disabled
                    value={fieldValues?.MembershipNo}
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
                  />
                </Box>
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Cashier Number
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Register Number
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Order Number
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="UserId"
                    disabled
                    value={fieldValues?.CashierNo}
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
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="UserId"
                    disabled
                    value={fieldValues?.RegisterNo}
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
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="UserId"
                    disabled
                    value={fieldValues?.OrderNo}
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
                  />
                </Box>
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Quantity
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Amount
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Sub Total
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="UserId"
                    disabled
                    value={fieldValues?.Qty}
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
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="UserId"
                    disabled
                    value={fieldValues?.Amount}
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
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="UserId"
                    disabled
                    value={fieldValues?.SubTotal}
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
                  />
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

export default Logs
