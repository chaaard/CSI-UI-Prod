import { Alert, Autocomplete, Box,  Divider,  Fade, Grid, IconButton, MenuItem, Pagination,  Paper,  Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, TextFieldProps, Typography, styled, } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import IAnalytics from '../../../_Interface/IAnalytics';
import axios, { AxiosRequestConfig } from 'axios';
import IAnalyticsToDeleteProps from '../../../_Interface/IAnalyticsToDeleteProps';
import dayjs, { Dayjs } from 'dayjs';
import ILocations from '../../../_Interface/ILocations';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ModalComponent from '../../../../Components/Common/ModalComponent';
import AnalyticsTable from '../../../../Components/Common/AnalyticsTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import ICustomerDropdown from '../../../_Interface/ICustomerDropdown';
import IMerchants from '../../Merchants/Interface/IMerchants';
import IPagination from '../../../_Interface/IPagination';
import CustomerDropdown from '../../../../Components/Common/CustomerDropdown';
import IAdjustmentAddProps from '../../../_Interface/IAdjustmentAddProps';
import IRefreshAnalytics from '../../../_Interface/IRefreshAnalytics';

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

const BootstrapButton = styled(IconButton)(() => ({
  textTransform: 'none',
  fontSize: 12, 
  lineHeight: 1.5,
  color: '#1C2C5A',
  fontWeight: '900',
  fontFamily: 'Inter',
}));


interface IUpdateMerchant
{
  Id: number,
  CustomerId: string,
  UserId?: string,
  StoreId?: string,
}

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

const ManualTransfer = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const getId = window.localStorage.getItem('Id');
  const getClub = window.localStorage.getItem('club');
  //const [selectedItem, setSelectedItem] = useState<string>('9999011929');
  const [selected, setSelected] = useState<string[]>([] as string[]);
  
  //const [selectedCustomerCode, setSelectedCustomerCode] = useState<string[]>();
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [jo, setJo] = useState<string>('');
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [selectedLocation, setSelectedLocation] = useState<number>(201);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenRevert, setIsModalOpenRevert] = useState<boolean>(false);
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState<boolean>(false);
  const [isModalOpenExcept, setIsModalOpenExcept] = useState<boolean>(false);
  const [adjustmentFields, setAdjustmentFields] = useState<IAdjustmentAddProps>({} as IAdjustmentAddProps);
  const [refreshAnalyticsDto, setRefreshAnalyticsDto] = useState<IRefreshAnalytics>();
  const [id, setId] = useState<number>(0);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [pageCount, setPageCount] = useState<number>(0); 
  const [page, setPage] = useState<number>(1);
  const [merchant, setMerchant] = useState<string>('');
  const itemsPerPage = 20; 
  const [customerCodes, setCustomerCodes] = useState<IMerchants[]>([]);
  const [customerCodesItem, setCustomerCodesItem] = useState<IMerchants[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [columnToSort, setColumnToSort] = useState<string>(""); // Column to sort
  const [orderBy, setOrderBy] = useState<string>("asc"); // Sorting order
  const [categoryId, setCategoryId] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [byMerchant, setByMerchant] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Maintenance | Manual Transfer JO Analytics';
  }, []);

  let Id = "";
  if(getId !== null)
  {
    Id = getId;
  }

  let club = 0;
  if(getClub !== null)
  {
    club = parseInt(getClub, 10);
  }

  const handleChangeMerchant = (value: any, categoryId: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    const categoryIdValue = categoryId !== undefined ? categoryId : '';
    if(sanitizedValue.split(',').length > 1)
    {
      setMerchant('');
      setCategoryId(categoryIdValue);
      setCustomerCodesItem([]);
      setHidden(false);      
      setTimeout(() => {
        setHidden(true);
      }, 10);
      fetchCustomerCodesItem(page, itemsPerPage, searchQuery, columnToSort, orderBy, true, categoryIdValue);
    }
    else
    {
      setHidden(false);
      setMerchant(sanitizedValue);
    }
  };
  
  const handleChangeMerchantItem = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setMerchant(sanitizedValue); 
  };

  // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleChangeJo = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setJo(sanitizedValue);
  };

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChangeLocation = (value: any) => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelectedLocation(sanitizedValue);
  };

  const handleCloseDelete = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCloseUpdate = useCallback(() => {
    setIsModalOpenUpdate(false);
    setHidden(false);
  }, []);

  const handleCloseRevert = useCallback(() => {
    setIsModalOpenRevert(false);
  }, []);

  useEffect(() => {
    const defaultDate = dayjs();
    setSelectedDateFrom(defaultDate);
  }, []);

  const handleDeleteModalClick = (id: number) => {
      setIsModalOpen(true);
      setId(id);
  };

  const handleUpdateModalClick = (id: number) => {
    setIsModalOpenUpdate(true);
    setId(id);

    fetchCustomerCodes(page, itemsPerPage, searchQuery, columnToSort, orderBy, byMerchant, categoryId);
  };

  const handleRevertModalClick = (id: number) => {
    setIsModalOpenRevert(true);
    setId(id);
  };

  const handleExceptionModalClick = (id: number) => {
    setIsModalOpenExcept(true);
    setId(id);
  };

  const handleCloseExcept = useCallback(() => {
    setIsModalOpenExcept(false);
  }, []);

  useEffect(() => {
    const formattedDate = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
    setRefreshAnalyticsDto({
      dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
      memCode: ['9999011855'],
      userId: Id,
      storeId: [club], 
    })
  }, [club, selectedDateFrom, Id])

  const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');

  const fetchAnalytics = useCallback(async (date: string | null | undefined, code: any, storeid: number, jo: string, page: number, itemsPerPage: number ) => {
    try {
      console.log("fetchAnalytics",code);
      const anaylticsParam: IAnalyticsToDeleteProps = {
        date: date?.toString() ? date?.toString() : '',
        memCode: code,
        storeId: storeid,
        jo: jo,
        PageNumber: page,
        PageSize: itemsPerPage
      };
      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAnalyticsToDelete`,
        data: anaylticsParam,
      };
  
      const response = await axios(getAnalytics);
      setAnalytics(response.data.Item1);
      setPageCount(response.data.Item2);
    } catch (error) {
      console.error("Error fetching data:", error);
    } 
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
      //console.log("update",selected);
    if(formattedDateFrom && selected.length > 0 && selectedLocation && jo)
    {
      setAnalytics([]);
      setPageCount(0);
      fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, page, itemsPerPage);
    }
  }, [REACT_APP_API_ENDPOINT, formattedDateFrom, selected, selectedLocation, jo, fetchAnalytics]);

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

  const handleDeleteClick = () => {
    try {
      var deleteMerchant: IUpdateMerchant = {
        Id: id,
        CustomerId: merchant,
        UserId: Id,
      }
      const generateInvoice: AxiosRequestConfig = {
        method: 'PUT',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/DeleteAnalytics`,
        data: deleteMerchant,
      };

      axios(generateInvoice)
      .then((result) => {
        if(result.data === true)
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Successfully deleted!'); 
          setIsModalOpen(false); 
          fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, page, itemsPerPage);
        }
        else
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error deleting analytic');
          setIsModalOpen(false);
        }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error deleting analytic');
        setIsModalOpen(false);
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error deleting invoice');
        setIsModalOpen(false);
    } 
  };

  const handleRevertClick = () => {
    try {
      var revert: IUpdateMerchant = {
        Id: id,
        CustomerId: merchant,
        UserId: Id,
      }

      const generateInvoice: AxiosRequestConfig = {
        method: 'PUT',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/RevertAnalytics`,
        data: revert,
      };

      axios(generateInvoice)
      .then((result) => {
        if(result.data === true)
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Successfully reverted!');
          setIsModalOpenRevert(false); 
          fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, page, itemsPerPage);
        }
        else
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error reverting analytic');
          setIsModalOpenRevert(false);
        }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error reverting analytic');
        setIsModalOpenRevert(false);
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error reverting invoice');
        setIsModalOpenRevert(false);
    } 
  };

  const handleUpdateClick = () => {
    try {

      var update: IUpdateMerchant = {
        Id: id,
        CustomerId: merchant,
        UserId: Id,
      }
      const generateInvoice: AxiosRequestConfig = {
        method: 'PUT',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/UpdateAnalytics`,
        data: update,
      };
      console.log("merchantValue",merchant);
      axios(generateInvoice)
      .then((result) => {
        if(result.data === true)
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Successfully updated!');
          setIsModalOpenUpdate(false); 
          fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, page, itemsPerPage);
        }
        else
        {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error updating analytic');
          setIsModalOpenUpdate(false);
        }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error updating analytic');
        setIsModalOpenUpdate(false);
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error updating invoice');
        setIsModalOpenUpdate(false);
    } 
  };

  const handleSaveClick = () => {
    handleExceptClick()
      .then(() => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setMessage('Analytics moved to exceptions successfully.');
        setIsModalOpenExcept(false);
      })
      .catch((error) => {
        console.error("Error moving to exception:", error);
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error moving to exception. Please try again.');
        setIsModalOpenExcept(false);
        throw error;
      });
  };
  
  const handleExceptClick = async () => {
    const paramValues = ({
      Id: 0, 
      AnalyticsId: id,
      ProoflistId: 0,
      ActionId: null,
      StatusId: 5,
      AdjustmentId: 0,
      DeleteFlag: false,
      SourceId: 1,
      AdjustmentAddDto: adjustmentFields,
      RefreshAnalyticsDto: refreshAnalyticsDto,
    });

    const saveRequest = {
      method: 'POST',
      url: `${REACT_APP_API_ENDPOINT}/Adjustment/CreateAnalyticsProofList`,
      data: paramValues,
    };
    const response = await axios(saveRequest);
    console.log('Response from API:', response.data); // Assuming you want to log the response
  }

  const fetchCustomerCodes = useCallback(async(pageNumber: number, pageSize: number, searchQuery: string | null, columnToSort: string | null, orderBy: string | null, byMerchant : boolean, categoryId : number) => {
    try {
      const params: IPagination = {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchQuery: searchQuery,
        ColumnToSort: columnToSort,
        OrderBy: orderBy, 
        CategoryId: categoryId,
        IsVisible: true, 
        ByMerchant: byMerchant,
      };
      const getCustomerCodes: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/CustomerCode/GetCustomerCodesByCategory`,
        data: params,
      };

      axios(getCustomerCodes)
      .then(async (response) => {
        setCustomerCodes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
      })
    } catch (error) {
      console.error("Error fetching customer codes:", error);
    } 
  }, [REACT_APP_API_ENDPOINT]);

  // useEffect(() => {
  //   fetchCustomerCodes(page, itemsPerPage, searchQuery, columnToSort, orderBy, byMerchant, categoryId);
  // }, [fetchCustomerCodes, page, itemsPerPage, searchQuery, columnToSort, orderBy, byMerchant, categoryId]);

  
  const fetchCustomerCodesItem = useCallback(async(pageNumber: number, pageSize: number, searchQuery: string | null, columnToSort: string | null, orderBy: string | null, byMerchant : boolean, categoryId : number) => {
    try {
      setCustomerCodesItem([]);
      const params: IPagination = {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchQuery: searchQuery,
        ColumnToSort: columnToSort,
        OrderBy: orderBy, 
        CategoryId: categoryId,
        IsVisible: true, 
        ByMerchant: byMerchant,
      };
      const getCustomerCodesItem: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/CustomerCode/GetCustomerCodesByCategory`,
        data: params,
      };

      axios(getCustomerCodesItem)
      .then(async (response) => {
        setCustomerCodesItem(response.data);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
      })
      
    } catch (error) {
      console.error("Error fetching customer codes:", error);
    } 
  }, [REACT_APP_API_ENDPOINT]);



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
          Transfer/Delete Analytics
        </Typography>
        <Divider sx={{ marginBottom: '20px' }} />
        <Grid container direction="row" alignItems="center" sx={{ padding: '8px 16px 0 -9px' }} >
          <Grid item xs={11.1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="dddd, MMMM DD, YYYY"
                value={selectedDateFrom}
                onChange={handleChangeDateFrom}
                label="Transaction Date"
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
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
            <CustomerDropdown setSelected={setSelected}  selection='single' byMerchant={false} isAllVisible={true}  isTextSearch={false}/>
          </Grid>
          <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
            <TextField
              variant="outlined"
              size="small"
              type="text"
              label="Club"
              required
              select
              value={selectedLocation}// Default to an empty string if undefined
              onChange={(e) => handleChangeLocation(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '40px',
                  backgroundColor: '#FFFFFF',
                  height: '40px',
                  width: '400px',
                  fontSize: '15px',
                  fontFamily: 'Inter',
                  fontWeight: 'bold',
                  color: '#1C2C5A', 
                },
              }}
            >
              {locations.map((item: ILocations) => (
                <MenuItem key={item.Id} value={item.LocationCode}>
                  {item.LocationCode + ' - ' + item.LocationName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
            <TextField
              variant="outlined"
              size="small"
              type="text"
              label="Order No"
              required
              value={jo}
              onChange={(e) => handleChangeJo(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '40px',
                  backgroundColor: '#FFFFFF',
                  height: '40px',
                  width: '400px',
                  fontSize: '15px',
                  fontFamily: 'Inter',
                  fontWeight: 'bold',
                  color: '#1C2C5A',
                },
              }}
            >
            </TextField>
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: '20px' }} />
        <CustomScrollbarBox component={Paper}
          sx={{
            height: '390px',
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
                <StyledTableCell>Customer Name</StyledTableCell>
                <StyledTableCell>Location Name</StyledTableCell>
                <StyledTableCell>Transaction Date</StyledTableCell>
                <StyledTableCell>Membership No</StyledTableCell>
                <StyledTableCell>Cashier No</StyledTableCell>
                <StyledTableCell>Register No</StyledTableCell>
                <StyledTableCell>Transaction No</StyledTableCell>
                <StyledTableCell>Order No</StyledTableCell>
                <StyledTableCell>Qty</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>SubTotal</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                analytics.length === 0
                  ?
                  <TableRow hover>
                    <TableCell align="center" colSpan={15} sx={{ color: '#1C2C5A' }}>No Data</TableCell>
                  </TableRow>
                  :
                  analytics.map((item: IAnalytics) => {
                    return (
                      <TableRow hover key={item.Id}>
                        <StyledTableCellSmall>{item.CustomerName}</StyledTableCellSmall>
                        <StyledTableCellSmall>{item.LocationName}</StyledTableCellSmall>
                        <StyledTableCellSmall style={{ textAlign: 'center',  }}> 
                          {
                            item.TransactionDate !== null
                            ? new Date(item.TransactionDate ?? '').toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short', // or 'long' for full month name
                                day: 'numeric',
                              })
                            : ''
                          }
                        </StyledTableCellSmall>
                        <StyledTableCellSmall>{item.MembershipNo}</StyledTableCellSmall>
                        <StyledTableCellSmall>{item.CashierNo}</StyledTableCellSmall>
                        <StyledTableCellSmall>{item.RegisterNo}</StyledTableCellSmall>
                        <StyledTableCellSmall>{item.TransactionNo}</StyledTableCellSmall>
                        <StyledTableCellSmall>{item.OrderNo}</StyledTableCellSmall>
                        <StyledTableCellSmall>{item.Qty}</StyledTableCellSmall>
                        <StyledTableCellSmall>
                          {
                            item.Amount != null
                            ? (item.Amount >= 1000
                              ? item.Amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              : item.Amount.toFixed(2))
                            : '0.00'
                          }
                        </StyledTableCellSmall>
                        <StyledTableCellSmall>
                        {
                            item.SubTotal != null
                            ? (item.SubTotal >= 1000
                              ? item.SubTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              : item.SubTotal.toFixed(2))
                            : '0.00'
                          }
                        </StyledTableCellSmall>
                        <StyledTableCellSmall align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <BootstrapButton
                              onClick={() => {
                                handleUpdateModalClick(item.Id);
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
                              }}
                            >
                              <EditIcon  sx={{fontSize: '15px', marginRight: '2px'}}/> Edit
                            </BootstrapButton>
                            <BootstrapButton
                              onClick={() => {
                                item.DeleteFlag ? handleRevertModalClick(item.Id) : handleDeleteModalClick(item.Id);
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
                              }}
                            >
                            {item.DeleteFlag ? <HistoryIcon  sx={{fontSize: '15px', marginRight: '2px'}}/> : <DeleteIcon  sx={{fontSize: '15px', marginRight: '2px'}}/> } {item.DeleteFlag ? 'Revert' : 'Delete'}
                            </BootstrapButton>
                            <BootstrapButton
                              onClick={() => {
                                handleExceptionModalClick(item.Id);
                              }}
                              sx={{
                                backgroundColor: "#FF6F6F",
                                width: '90px',
                                height: "20px",
                                borderRadius: "15px",
                                color: "#644848",
                                marginLeft: 0.5,
                                "&:hover": {
                                  backgroundColor: "#FF3838",
                                  color: '#FFFFFF',
                                },
                              }}
                            >
                              <MoveDownIcon sx={{fontSize: '15px', marginRight: '2px'}}/> Exception
                            </BootstrapButton>
                          </Box>
                        </StyledTableCellSmall>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </CustomScrollbarBox>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Pagination
            variant="outlined"
            shape="rounded"
            count={pageCount}
            page={page}
            onChange={(event, value) => {
              setPage(value);
              if(formattedDateFrom != null)
              {
                fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, value, itemsPerPage);
              }
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
        title='Delete Analytics'
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
                  Are you sure you want to delete this analytics?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        } 
      />
      <ModalComponent
        title='Revert Analytics'
        onClose={handleCloseRevert}
        buttonName='Revert'
        open={isModalOpenRevert}
        onSave={handleRevertClick}
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
                  Are you sure you want to revert this analytics?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        } 
      />
      <ModalComponent
        title='Edit Analytics'
        onClose={handleCloseUpdate}
        buttonName='Update'
        open={isModalOpenUpdate}
        onSave={handleUpdateClick}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={8}
                sx={{
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  color: '#1C2C5A',
                  fontSize: '15px',
                }}>
                Move this transaction to:
              </Grid>
              <Grid item xs={11.5} sx={{marginLeft: '10px', marginTop: '10px'}}>
                <Box display={'flex'}>
                  <Autocomplete
                    fullWidth
                    options={customerCodes}
                    getOptionLabel={(option) => option?.CategoryName}
                    onChange={(event, value) => {
                      handleChangeMerchant(value?.CustomerCodes.toString(),value?.CategoryId);
                    }}     
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        type="text"
                        label="Partner"
                        variant="outlined"                          
                        sx={{
                            '& .MuiInputBase-root': {
                              borderRadius: '40px',
                              height: '40px',
                              fontSize: '15px',
                              fontFamily: 'Inter',
                              fontWeight: 'bold',
                              color: '#1C2C5A',
                            },
                            '& .MuiFormLabel-root': {
                              marginBottom:'20px',
                            },
                          }}
                      />
                    )}
                  />
                </Box>
              </Grid>
              {hidden ? (
              <Grid item xs={11.5} sx={{marginLeft: '10px', marginTop: '10px'}}>
                <Box display={'flex'}>
                  <Autocomplete
                    fullWidth
                    options={customerCodesItem}
                    getOptionLabel={(option) => option.CustomerName}
                    onChange={(event, value) => {
                      handleChangeMerchantItem(value?.CustomerCode);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        type="text"
                        label="Partner Items"
                        variant="outlined"
                        sx={{
                            '& .MuiInputBase-root': {
                              borderRadius: '40px',
                              height: '40px',
                              fontSize: '15px',
                              fontFamily: 'Inter',
                              fontWeight: 'bold',
                              color: '#1C2C5A',
                            },
                          }}
                      />
                    )}
                  />
                </Box>
              </Grid>
              ) : (
                <Box></Box>
              )}
            </Grid>
          </Box>
        } 
      />
      <ModalComponent
        title='Move to Exception'
        onClose={handleCloseExcept}
        buttonName='Move'
        open={isModalOpenExcept}
        onSave={handleSaveClick}
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
                  Are you sure you want to move this analytics to exceptions?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        } 
      />
    </Box>
  )
}

export default ManualTransfer