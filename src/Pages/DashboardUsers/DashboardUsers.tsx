import { Box, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, TextField, InputAdornment, MenuItem, CircularProgress, Snackbar, Fade, Alert, Pagination, DialogContentText, Paper, Divider, Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Search as SearchIcon,} from '@mui/icons-material/';
import axios, { AxiosRequestConfig } from 'axios';
import IDashboardUsers from './Interface/IDashboardUsers';
import ModalComponent from '../../Components/Common/ModalComponent';
import UsersUpdateInsert from './Interface/IUsersUpdateInsert';
import IPagination from '../Common/Interface/IPagination';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ILocations from '../../Pages/Common/Interface/ILocations';

const StyledTableCellHeader = styled(TableCell)(() => ({
  fontSize: "20px",
  fontWeight: '100',
  padding: "10px",
  color: '#1C2C5A',
}));

const StyledTableCellBody = styled(TableCell)(() => ({
  fontSize: "12px",
  fontWeight: '900',
  padding: "1px",
  color: '#1C2C5A',
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
    Username: "",
    EmployeeNumber: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Salt: "",
    Hash: "",
    Club: 201,
    RoleId: 1,
    IsLogin: false,
    IsFirstLogin: true,
    Status: true,
    Attempt: 0
  };

const DashboardUsers = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [dashboardUsers, setDashboardUsers] = useState<IDashboardUsers[]>([] as IDashboardUsers[]);
  const [fieldValues, setFieldValues] = useState<UsersUpdateInsert>(defaultFormValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openInsert, setOpenInsert] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false); // Form submission status
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [page, setPage] = useState<number>(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState<number>(20); // Items displayed per page
  const [pageCount, setPageCount] = useState<number>(0); // Total page count
  const [columnToSort, setColumnToSort] = useState<string>(""); // Column to sort
  const [orderBy, setOrderBy] = useState<string>("asc"); // Sorting order
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [selectedLocation, setSelectedLocation] = useState<number>(201);

  useEffect(() => {
    document.title = 'Maintenance | Users';
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
    setFieldValues(defaultFormValue);
  }, []);

  const handleCloseModalInsert = useCallback(() => {
    setOpenInsert(false);
    setSubmitted(false);
    setFieldValues(defaultFormValue);
  }, []);

  const fetchUsers = useCallback(async(pageNumber: number, pageSize: number, searchQuery: string | null, columnToSort: string | null, orderBy: string | null) => {
    try {
      setLoading(true);
      const params: IPagination = {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchQuery: searchQuery,
        ColumnToSort: columnToSort,
        OrderBy: orderBy, 
      };

      const getUsers: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Users/GetUsersListAsync`,
        data: params,
      };

      axios(getUsers)
      .then(async (response) => {
        setDashboardUsers(response.data.CustomerCodesList);
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
    fetchUsers(page, itemsPerPage, searchQuery, columnToSort, orderBy);
  }, [fetchUsers, page, itemsPerPage, searchQuery, columnToSort, orderBy]);

  // Handle changes in form fields
  const handleChangeUserUpdate = (field: keyof UsersUpdateInsert, value: any) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [field]: value
    }) as UsersUpdateInsert);
  };

  const handleChangeUserInsert = (field: keyof UsersUpdateInsert, value: any) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [field]: value
    }) as UsersUpdateInsert);
  };

  //Handle the Display of Create/Update Modals
  const handleEditOrInsertClick = (EmployeeNumber: string) => {
    const usersToUpdate = dashboardUsers.find(users => users.EmployeeNumber === EmployeeNumber);
    if(usersToUpdate?.Status === false) {
      setIsDisabled(true);
    }
    else{
      setIsDisabled(false);
    }
    if(usersToUpdate !== undefined)
    {
      setFieldValues(usersToUpdate);
      setOpenEdit(true);
    }
    else
    {
      setOpenInsert(true);
    }
  };

  const handleSubmitInsert = async() => {
    setSubmitted(true);
    const allIsPopulated = !fieldValues.Username || !fieldValues.FirstName || !fieldValues.LastName;
    
    if (allIsPopulated) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity('error');
      setMessage('Please input required field.');
      return;
    }
    
    const insertRequest: AxiosRequestConfig = {
      method: 'POST',
      url: `${REACT_APP_API_ENDPOINT}/Users/InsertUserAsync`,
      data: fieldValues,
    };

    axios(insertRequest)
      .then(() => {
        setSubmitted(false);
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setMessage('User insert successfully!')
        fetchUsers(page, itemsPerPage, searchQuery, columnToSort, orderBy);
        handleCloseModalInsert();
        setSearchQuery('');
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        if (error.response && error.response.status === 404) {
          setMessage('Username already exist on database');
        } else {
          setMessage('Error occurred. Please try again.');
        }
      });
  }

  const handleSubmitEdit = async() => {
    setSubmitted(true);
    const allIsPopulated = !fieldValues.Username || !fieldValues.FirstName || !fieldValues.LastName;
    
    if (allIsPopulated) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity('error');
      setMessage('Please input required field.');
      return;
    }
    
    const updateRequest: AxiosRequestConfig = {
      method: 'PUT',
      url: `${REACT_APP_API_ENDPOINT}/Users/UpdateUserByIdAsync`,
      data: fieldValues,
    };

    axios(updateRequest)
      .then(() => {
        setSubmitted(false);
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setMessage('User update successfully!')
        fetchUsers(page, itemsPerPage, searchQuery, columnToSort, orderBy);
        handleCloseModalEdit();
        setSearchQuery('');
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error occurred. Please try again.');
      });
  }

  // Handle form submission for reset a zone type
  const handleSubmitReset = () => {
    const resetRequest: AxiosRequestConfig = {
      method: 'PUT',
      url: `${REACT_APP_API_ENDPOINT}/Users/ResetUserPasswordByIdAsync?id=${fieldValues?.EmployeeNumber}`,
    };

    axios(resetRequest)
      .then(() => {
        setSubmitted(false);
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setMessage('User reset successfully!')
        handleCloseModalEdit();
        fetchUsers(1, itemsPerPage, "", "", "");
        setSearchQuery('');
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error occurred. Please try again.');
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
          })
      } catch (error) {
      } 
    };
  
    fetchLocations();
  }, [REACT_APP_API_ENDPOINT]);

  if (!loading) {
    return (
      <Box
        sx={{
          marginTop: '16px',
          marginLeft: '20px',
          marginRight: '20px',
          flexGrow: 1,
          position: 'relative' 
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#1C2C5A', }}>
          Users
        </Typography>
        <Grid container spacing={1} sx={{ height: '60px' }}>
          <Grid item xs={12} sm={4}>
            <StyledTextField
              placeholder='Search'
              size='small'
              fullWidth
              InputProps={{
                sx: {
                  fontSize: '12px',
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
            />
          </Grid>
          <Grid item xs={12} sm={6.7}/>
          <Grid item xs={12} sm={1}>
            <Button
              fullWidth
              onClick={() => {
                handleEditOrInsertClick('')
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
              <AddIcon/>Add User
            </Button>
          </Grid>
        </Grid>
        <Paper elevation={3} sx={{ backgroundcolor: '#B0B0B0', padding: '10px', maxWidth: '100%', borderRadius: '15px', height: '690px', display: 'flex', flexDirection: 'column' }}>
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
                <TableRow sx={{ borderBottom: "solid  #20346E" }}>
                  <StyledTableCellHeader sx={{ textAlign: 'left' }} onClick={() => setColumnToSort('FirstName')}>First Name</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ textAlign: 'left' }} onClick={() => setColumnToSort('LastName')}>Last Name</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ textAlign: 'left' }} onClick={() => setColumnToSort('Username')}>Username</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ textAlign: 'left' }} onClick={() => setColumnToSort('Location')}>Club</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ textAlign: 'left' }} onClick={() => setColumnToSort('RoleName')}>Role</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ textAlign: 'left' }} onClick={() => setColumnToSort('Status')}>Status</StyledTableCellHeader>
                  <StyledTableCellHeader sx={{ textAlign: 'center' }}>Action</StyledTableCellHeader>
                </TableRow>
              </TableHead> 
              <TableBody >
                {dashboardUsers.map((row, index) => (
                <TableRow key={index} sx={{ "& td": { border: 0 }}}>
                  <StyledTableCellBody sx={{ textAlign: 'left' }}>{row.FirstName}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'left' }}>{row.LastName}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'left' }}>{row.Username}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'left' }}>{row.Location}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'left' }}>{row.RoleName}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'left' }}>{row.Status ? 'Active' : 'Inactive'}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <BootstrapButton
                        onClick={() => {
                          handleEditOrInsertClick(row.EmployeeNumber)
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
            <Box sx={{ flex: '1 0 auto' }}>
              {/* Content that grows to fill the space */}
            </Box>
            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Pagination
                variant="outlined"
                shape="rounded"
                count={pageCount}
                page={page}
                onChange={(event, value) => {
                  setPage(value);
                  fetchUsers(value, itemsPerPage, searchQuery, columnToSort, orderBy);
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
        title='User Details'
        onClose={handleCloseModalEdit}
        buttonName='Save Changes'
        extraButton='Reset Password'
        extraButtonIsDisabled={isDisabled}
        open={openEdit}
        onSave={handleSubmitEdit}
        onExtra={handleSubmitReset}
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
                First Name *
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Middle Name
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Last Name *
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="FirstName"
                    type="text"
                    required
                    value={fieldValues?.FirstName}
                    onChange={(e) => handleChangeUserUpdate("FirstName", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.FirstName}
                    helperText={submitted && !fieldValues?.FirstName && "FirstName is required"}
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
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField 
                    type="text"
                    size='small' 
                    fullWidth
                    variant="outlined"
                    required
                    value={fieldValues?.MiddleName}
                    onChange={(e) => handleChangeUserUpdate("MiddleName", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.MiddleName}
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
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="LastName"
                    type="text"
                    required
                    value={fieldValues?.LastName}
                    onChange={(e) => handleChangeUserUpdate("LastName", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.LastName}
                    helperText={submitted && !fieldValues?.LastName && "LastName is required"}
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
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={6}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Username *
              </Grid>
              <Grid item xs={6}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Club *
              </Grid>
              <Grid item xs={6}>
                <Box display={'flex'}>
                  <StyledTextField 
                    size='small' 
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    value={fieldValues?.Username}
                    onChange={(e) => handleChangeUserUpdate("Username", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.Username}
                    helperText={submitted && !fieldValues?.Username && "Username is required"}
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
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display={'flex'}>
                  <StyledTextField 
                    size='small' 
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    select
                    value={fieldValues?.Club}
                    onChange={(e) => handleChangeUserUpdate("Club", typeof e.target.value === 'string' && e.target.value.trim() === '' ? '' : e.target.value)}
                    error={submitted && !fieldValues?.Club}
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
                    {locations.map((item: ILocations) => (
                      <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={item.LocationCode} value={item.LocationCode}>
                        {item.LocationCode + ' - ' + item.LocationName}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={6}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Role
              </Grid>
              <Grid item xs={6}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Status
              </Grid>
              <Grid item xs={6}>
                <Box display={'flex'}>
                  <StyledTextField 
                    size='small' 
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    select
                    value={fieldValues?.RoleId}
                    onChange={(e) => handleChangeUserUpdate("RoleId", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.RoleId}
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
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'1'} value={'1'}>Accounting</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'2'} value={'2'}>Treasury</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'3'} value={'3'}>Ecommerce</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'4'} value={'4'}>System Admin</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'5'} value={'5'}>Food Service</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'6'} value={'6'}>Operation</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'7'} value={'7'}>Audit</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'8'} value={'8'}>Fulfilment</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'9'} value={'9'}>Treasury Manager</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'10'} value={'10'}>Ecommerce Manager</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'11'} value={'11'}>Food Service Manager</MenuItem>
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display={'flex'}>
                  <StyledTextField 
                    size='small' 
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    select
                    value={fieldValues?.Status}
                    onChange={(e) => handleChangeUserUpdate("Status", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.Status}
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
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'true'} value={'true'}>Active</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'false'} value={'false'}>Inactive</MenuItem>
                  </StyledTextField>
                </Box>
              </Grid>
            </Grid>
          </Box>
        } 
      />
      <ModalComponent
        title='Add User'
        onClose={handleCloseModalInsert}
        buttonName='Save'
        open={openInsert}
        onSave={handleSubmitInsert}
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
                First Name *
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Middle Name
              </Grid>
              <Grid item xs={4}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Last Name *
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="FirstName"
                    type="text"
                    required
                    value={fieldValues?.FirstName}
                    onChange={(e) => handleChangeUserInsert("FirstName", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.FirstName}
                    helperText={submitted && !fieldValues?.FirstName && "FirstName is required"}
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
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField 
                    type="text"
                    size='small' 
                    fullWidth
                    variant="outlined"
                    required
                    value={fieldValues?.MiddleName}
                    onChange={(e) => handleChangeUserInsert("MiddleName", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.MiddleName}
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
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box display={'flex'}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    name="LastName"
                    type="text"
                    required
                    value={fieldValues?.LastName}
                    onChange={(e) => handleChangeUserInsert("LastName", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.LastName}
                    helperText={submitted && !fieldValues?.LastName && "LastName is required"}
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
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={6}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Username *
              </Grid>
              <Grid item xs={6}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Club *
              </Grid>
              <Grid item xs={6}>
                <Box display={'flex'}>
                  <StyledTextField 
                    size='small' 
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    value={fieldValues?.Username}
                    onChange={(e) => handleChangeUserInsert("Username", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.Username}
                    helperText={submitted && !fieldValues?.Username && "Username is required"}
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
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display={'flex'}>
                  <StyledTextField 
                    size='small' 
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    select
                    value={fieldValues?.Club}
                    onChange={(e) => handleChangeUserInsert("Club", typeof e.target.value === 'string' && e.target.value.trim() === '' ? '' : e.target.value)}
                    error={submitted && !fieldValues?.Club}
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
                    {locations.map((item: ILocations) => (
                      <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={item.LocationCode} value={item.LocationCode}>
                        {item.LocationCode + ' - ' + item.LocationName}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={6}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Role
              </Grid>
              <Grid item xs={6}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '12px'
                }}>
                Status
              </Grid>
              <Grid item xs={6}>
                <Box display={'flex'}>
                  <StyledTextField 
                    size='small' 
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    select
                    value={fieldValues?.RoleId}
                    onChange={(e) => handleChangeUserInsert("RoleId", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.RoleId}
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
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'1'} value={'1'}>Accounting</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'2'} value={'2'}>Treasury</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'3'} value={'3'}>Ecommerce</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'4'} value={'4'}>System Admin</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'5'} value={'5'}>Food Service</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'6'} value={'6'}>Operation</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'7'} value={'7'}>Audit</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'8'} value={'8'}>Fulfilment</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'9'} value={'9'}>Treasury Manager</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'10'} value={'10'}>Ecommerce Manager</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'11'} value={'11'}>Food Service Manager</MenuItem>
                  </StyledTextField>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box display={'flex'}>
                  <StyledTextField 
                    size='small' 
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    select
                    value={fieldValues?.Status}
                    onChange={(e) => handleChangeUserInsert("Status", e.target.value.trim() === ''? '' : e.target.value)}
                    error={submitted && !fieldValues?.Status}
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
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'true'} value={'true'}>Active</MenuItem>
                    <MenuItem sx={{ color: '#1C2C5A', fontSize: '12px', }} key={'false'} value={'false'}>Inactive</MenuItem>
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

export default DashboardUsers
