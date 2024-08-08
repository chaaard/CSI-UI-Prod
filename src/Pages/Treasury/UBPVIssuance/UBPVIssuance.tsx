import { Box, Grid, Typography, TextField, Fade, Alert, styled, Snackbar, Backdrop, CircularProgress, TextFieldProps, Divider, Paper, Table, TableHead, TableRow, Checkbox, TableBody, TableCell, IconButton, Pagination } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import ModalComponent from '../../../Components/Common/ModalComponent';
import BoxHeaderButtons from '../../../Components/Common/BoxHeaderButtons';
import IAnalytics from '../../_Interface/IAnalytics';
import IException from '../../_Interface/IException';
import axios, { AxiosRequestConfig } from 'axios';
import IAnalyticProps from '../../_Interface/IAnalyticsProps';
import IExceptionProps from '../../_Interface/IExceptionProps';
import dayjs, { Dayjs } from 'dayjs';
import IRefreshAnalytics from '../../_Interface/IRefreshAnalytics';
import IAdjustmentAddProps from '../../_Interface/IAdjustmentAddProps';
import DisputeTable from '../../../Components/Common/DisputeTable';
import DisputeAnalyticsTable, { ChildHandle } from '../../../Components/Common/DisputeAnalytics';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ILocations from '../../_Interface/ILocations';
import IAnalyticsToAddProps from '../../SystemAdmin/Analytics/ManualAdd/Interface/IAnalyticsToAddProps';
import ExceptionsTable from '../../../Components/Common/ExceptionsTable';
import AdjustmentTypeModal from '../../../Components/Common/AdjustmentTypeModal';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';


export enum Mode {
  VIEW = 'View',
  EDIT = 'Edit',
  RESOLVE = 'Resolve'
}

interface IUpdateInvoice
{
  Id: number,
  CustomerCode: string,
  UserId?: string,
  StoreId?: string,
  Remarks?: string,
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
  
const StyledTableCellHeader = styled(TableCell)(() => ({
  padding: "8px 17px !important",
  fontSize: "14px",
  fontWeight: '900',
  color: '#1C2C5A',
  textAlign: 'center',
}));

const StyledTableCellBody = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "12px",
  color: '#1C2C5A',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#E3F2FD', // Change this color to the desired hover color
  },
  userSelect: 'none', // Disable text selection
  cursor: 'default', // Set the cursor style to default
}));

const StyledTableCellBody1 = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "12px",
  color: '#1C2C5A',
  textAlign: 'center',
}));
const StyledTableCellBodyNoData = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "25px",
  color: '#1C2C5A',
  textAlign: 'center',
  fontWeight: '100',
}));

const StyledTableCellSmall = styled(TableCell)(({ theme }) => ({
  fontSize: "12px",
  padding: "1px",
  color: '#1C2C5A',
  textAlign: 'center'
}));
const BootstrapButtonMini = styled(IconButton)(() => ({
  textTransform: 'none',
  fontSize: 12, 
  lineHeight: 1.5,
  color: '#1C2C5A',
  fontWeight: '900',
  fontFamily: 'Inter',
}));

const BootstrapButton = styled(IconButton)(({ theme }) => ({
  border: '1px solid',
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

const UBPVIssuance = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem('club');
  const [open, setOpen] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState('Analytics');
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const [analyticsItem, setAnalyticsItem] = useState<IAnalytics[]>([]);
  const [exception, setException] = useState<IException[]>([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [page, setPage] = useState<number>(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState<number>(6); // Items displayed per page
  const [pageCount, setPageCount] = useState<number>(0); // Total page count
  const [columnToSort, setColumnToSort] = useState<string>(""); // Column to sort
  const [orderBy, setOrderBy] = useState<string>("asc"); // Sorting order
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentDate, setCurrentDate] = useState<Dayjs | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isModalClose, setIsModalClose] = useState<boolean>(false);
  const [successRefresh, setSuccessRefresh] = useState<boolean>(false);
  const [openRefresh, setOpenRefresh] = useState<boolean>(false);
  const [openSubmit, setOpenSubmit] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(true);
  const [refreshAnalyticsDto, setRefreshAnalyticsDto] = useState<IRefreshAnalytics>();
  // State to store filtered analytics data
  const [filteredAnalytics, setFilteredAnalytics] = useState<IAnalytics[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [stateAnalytics, setStateAnalytics] = useState<IAnalyticsToAddProps>({} as IAnalyticsToAddProps);
  const getId = window.localStorage.getItem('Id');
  const [selectedRowId, setSelectedRowId] = useState<IException>({} as IException);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [exceptions, setExceptions] = useState<IException[]>([]);
  const [isModalCloseException, setIsModalCloseException] = useState<boolean>(false);
  const [isFieldDisabled, setIsFieldDisabled] = useState<boolean>(true);
  const [btnSaveLabel, setbtnSaveLabel] = useState<string>('Search');
  const [selectedRows, setSelectedRows] = useState<IAnalytics[]>([]);
  const [isManualVisible, setIsManualVisible] = useState<boolean>(false);
  const [isFieldVisible, setIsFieldVisible] = useState<boolean>(false);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editedRemarks, setEditedRemarks] = useState('');
  const [selected, setSelected] = useState<string[]>(['9999011984']);
  
  //WalkIn Customer Code
  const customerCode = ['9999011984'];
  useEffect(() => {
    document.title = 'CSI | UB Rebate Issuance';
  }, []);

  let club = 0;
  if(getClub !== null)
  {
    club = parseInt(getClub, 10);
  }

  let Id = "";
  if(getId !== null)
  {
    Id = getId;
  }

  const formattedDateFrom = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');

  useEffect(() => {
    const defaultDate = dayjs().startOf('day').subtract(1, 'day');
    const currentDate = dayjs().startOf('day').subtract(1, 'day');;
    setSelectedDate(defaultDate);
    setCurrentDate(currentDate);
  }, []);
  

  // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleOpenRefresh = () => {
    setOpenRefresh(true);
  };

  const handleCloseRefresh = useCallback(() => {
    setOpenRefresh(false);
  }, []);

  const handleOpenSubmit = () => {
    setOpenSubmit(true);
  };

  const handleCloseSubmit = () => {
    setOpenSubmit(false);
  };

const formatDate = (dateString:any) => {
  // Create a new Date object
  const date = new Date(dateString);

  // Extract the components of the date using local time methods
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Construct the ISO 8601 date string without milliseconds
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

};
const childRef = useRef<ChildHandle>(null);

const handleSaveCustomer = async (id: number, remarks: string) => {
    try {
      const update: IUpdateInvoice = {
        Id: id,
        CustomerCode: selected.toString(),
        UserId: Id.toString(),
        StoreId: club.toString(),
        Remarks: remarks
      };
      if(remarks.length > 0){
        const generateInvoice: AxiosRequestConfig = {
          method: 'PUT',
          url: `${REACT_APP_API_ENDPOINT}/Analytics/CreateUpdateAnalyticsRemarks`,
          data: update,
        };

         try {
          const result = await axios(generateInvoice);
          
          if (result.data === true) {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setMessage('Successfully saved!');
            console.log("childRef",childRef.current);
            if (childRef.current) {
              childRef.current.handleCancelEdit();
            }
            setEditRowId(null); // Exit edit mode without saving
            const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
            const analyticsParam: IAnalyticProps = {
              dates: [formattedDate ?? ''],
              memCode: customerCode,
              userId: Id,
              storeId: [club],
              remarks: "ubrebateissuancepv",
            };

            await fetchUBPVIssuance(analyticsParam);
          } else {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Error saving remarks');
            setEditRowId(null); // Exit edit mode without saving
            if (childRef.current) {
              childRef.current.handleCancelEdit();
            }
          }
        } catch (error) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error saving remarks');
          setEditRowId(null); // Exit edit mode without saving
            if (childRef.current) {
              childRef.current.handleCancelEdit();
            }
        }
      }
      else
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error saving remarks');
        setEditRowId(null); // Exit edit mode without saving
        if (childRef.current) {
          childRef.current.handleCancelEdit();
        }
      }      
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error saving remarks');
        setEditRowId(null); // Exit edit mode without saving
        if (childRef.current) {
          childRef.current.handleCancelEdit();
        }
    } 
  };

  const handleSave = async () => { 

    var analyticsProp: IAnalyticProps = {
        action: "Manual Add UB Rebate Issuance",
        remarks: "Successfully Added",
    }
    var updatedParams: IAnalyticsToAddProps = {
      CustomerId: stateAnalytics.CustomerId,
      LocationId: stateAnalytics.LocationId,
      TransactionDate: stateAnalytics.TransactionDate,
      MembershipNo: stateAnalytics.MembershipNo,
      CashierNo: stateAnalytics.CashierNo,
      RegisterNo: stateAnalytics.RegisterNo,
      TransactionNo: stateAnalytics.TransactionNo,
      OrderNo: stateAnalytics.OrderNo,
      Qty: stateAnalytics.Qty,
      Amount: stateAnalytics.Amount,
      Subtotal: stateAnalytics.Subtotal,
      UserId: stateAnalytics.UserId,
      AnalyticsParamsDto: analyticsProp 
    };

    if(isManualVisible && btnSaveLabel === "Save Manual Input")
    {
      let isMatched = false; 
      analytics.forEach((item) => {
        if(formatDate(stateAnalytics.TransactionDate) === item.TransactionDate?.toString() && item.TransactionNo === stateAnalytics.TransactionNo && item.OrderNo === stateAnalytics.OrderNo)
        {
          isMatched = true;        
        }
      });

      if(isMatched){
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Duplicate transaction entry.');
      }
      else
      { 
        if (
          !stateAnalytics.TransactionNo ||
          !stateAnalytics.MembershipNo ||
          !stateAnalytics.CashierNo ||
          !stateAnalytics.RegisterNo ||
          !stateAnalytics.OrderNo ||
          stateAnalytics.Qty === undefined ||
          stateAnalytics.Amount === undefined ||
          stateAnalytics.Subtotal === undefined ||
          stateAnalytics.Qty.toString() === "0" ||
          stateAnalytics.Amount.toString() === "0" ||
          stateAnalytics.Subtotal.toString() === "0"
        ) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Please fill in all required fields.');
          setLoadingAdd(false);
          return;
        }

        console.log("updatedParams",updatedParams)
        const analyticsAdd: AxiosRequestConfig = {
            method: 'POST',
            url: `${REACT_APP_API_ENDPOINT}/Analytics/CreateAnalytics`,
            data: updatedParams,
          };

          try {
            const response = await axios(analyticsAdd);
            console.log(response.data);
            handleCloseModal();
            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setMessage('Successfully saved the transaction.');
            //reset textbox
            setStateAnalytics({} as IAnalyticsToAddProps);
            // refersh table
            const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
            const analyticsParam: IAnalyticProps = {
              dates: [formattedDate ?? ''],
              memCode: customerCode,
              userId: Id,
              storeId: [club],
              remarks: "ubrebateissuancepv",
            };      
        
            await fetchUBPVIssuance(analyticsParam);
          } catch (error) {
            console.error('Error saving data', error);
            // Handle error (e.g., show an error message)
            handleCloseModal();
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Error in saving the transaction.');
            setStateAnalytics({} as IAnalyticsToAddProps);
          }
        }
    }
    else
    {
      console.log("selectedRows",selectedRows.length);
      if(selectedRows.length > 0)
      {
        selectedRows.map(async (row) => {
          console.log(row);
          let isMatched = false; 
          analytics.forEach((item) => {
            if(formatDate(row.TransactionDate) === item.TransactionDate?.toString() && item.TransactionNo === row.TransactionNo && item.OrderNo === row.OrderNo)
            {
              isMatched = true;        
            }
          });

          if(isMatched){
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Duplicate transaction entry.');
          }
          else
          { 
            if (
              !row.TransactionNo ||
              !row.MembershipNo ||
              !row.CashierNo ||
              !row.RegisterNo ||
              !row.OrderNo ||
              row.Qty === undefined ||
              row.Amount === undefined ||
              row.SubTotal === undefined 
            ) {
              setIsSnackbarOpen(true);
              setSnackbarSeverity('error');
              setMessage('Please fill in all required fields.');
              setLoadingAdd(false);
              return;
            }

            console.log("updatedParams",updatedParams)
            const analyticsAdd: AxiosRequestConfig = {
                method: 'POST',
                url: `${REACT_APP_API_ENDPOINT}/Analytics/CreateAnalytics`,
                data: updatedParams,
              };

              try {
                const response = await axios(analyticsAdd);
                console.log(response.data);
                handleCloseModal();
                setIsSnackbarOpen(true);
                setSnackbarSeverity('success');
                setMessage('Successfully saved the transaction.');
                //reset textbox
                setStateAnalytics({} as IAnalyticsToAddProps);
                // refersh table
                const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
                const analyticsParam: IAnalyticProps = {
                  dates: [formattedDate ?? ''],
                  memCode: customerCode,
                  userId: Id,
                  storeId: [club],
                  remarks: "ubrebateissuancepv",
                };      
            
                await fetchUBPVIssuance(analyticsParam);
              } catch (error) {
                console.error('Error saving data', error);
                // Handle error (e.g., show an error message)
                handleCloseModal();
                setIsSnackbarOpen(true);
                setSnackbarSeverity('error');
                setMessage('Error in saving the transaction.');
                setStateAnalytics({} as IAnalyticsToAddProps);
              }
            }
        });
      }
      
    }


  
  
    
  };

  const handleCloseModal = useCallback(() => {
    setOpen(false);
    //reset textbox
    setStateAnalytics({} as IAnalyticsToAddProps);
    setbtnSaveLabel("Search");
    setIsFieldDisabled(true);
    setIsFieldVisible(false);
    setIsManualVisible(false);
    setSelectedRows([]);
  }, []);

  const fetchUBPVIssuance = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      setLoading(true);

      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAnalyticsUB`,
        data: anaylticsParam,
      };
      console.log("anaylticsParam",anaylticsParam);
      axios(getAnalytics)
      .then(async (response) => {
        setAnalytics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(selectedDate !== null)
        {
          const formattedDate = selectedDate.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDate],
            memCode: customerCode,
            userId: Id,
            storeId: [club],
            remarks: "ubrebateissuancepv",
          };      
      
          await fetchUBPVIssuance(anaylticsParam);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [fetchUBPVIssuance, page, itemsPerPage, searchQuery, columnToSort, orderBy, selectedDate, club]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(successRefresh)
        {
          const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
            memCode: customerCode,
            userId: Id,
            storeId: [club],
            remarks: "ubrebateissuancepv",
          };

          await fetchUBPVIssuance(anaylticsParam);
          setSuccessRefresh(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [fetchUBPVIssuance, selectedDate, successRefresh]);

  const handleRefreshClick = () => {
    try {
      setRefreshing(true);
      setOpenRefresh(false);
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: customerCode,
        userId: Id,
        storeId: [club], 
        remarks: "ubrebateissuancepv",
      }

      const refreshAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/RefreshAnalytics`,
        data: updatedParam,
      };

      axios(refreshAnalytics)
      .then(async () => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Success');
          setSuccessRefresh(true);
          setSubmitted(true);
            const exceptionParam: IExceptionProps = {
              PageNumber: page,
              PageSize: itemsPerPage,
              SearchQuery: searchQuery,
              ColumnToSort: columnToSort,
              OrderBy: orderBy, 
              dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
              memCode: customerCode,
              userId: Id,
              storeId: [club],
              remarks: "ubrebateissuancepv",
            };
          await fetchUBPVIssuanceException(exceptionParam);
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error refreshing analytics');
        console.error("Error refreshing analytics:", error);
      })
      .finally(() => {
        setRefreshing(false); 
        setOpenRefresh(false);
        setSuccess(false);
      });
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error refreshing analytics');
        console.error("Error refreshing analytics:", error);
        setRefreshing(false);
        setOpenRefresh(false);
        setSuccess(false);
    } 
  };


  const handleChangeDate = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
  };

  

  const handleChangeSearch = (newValue: string) => {
    ///
  };

  const handleSubmitClick = () => {
    try {
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: customerCode,
        userId: Id,
        storeId: [club], 
        remarks: "ubrebateissuancepv",
      }

      const submitAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/SubmitAnalyticsWOProoflist`,
        data: updatedParam,
      };

      axios(submitAnalytics)
      .then(async (result) => {
          if(result.data === true) 
          {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setMessage('Analytics Successfully Submitted');
            setOpenSubmit(false);
            setSubmitted(true);
          }
          else
          {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Error submitting analytics. Please try again!');
            setOpenSubmit(false);
            setSubmitted(true);
          }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error submitting analytics');
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error submitting analytics');
    } 
  };

  useEffect(() => {
    const IsSubmittedGenerated = async () => {
      try {
          if(selectedDate)
          {
            const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
            const updatedParam: IRefreshAnalytics = {
              dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
              memCode: customerCode,
              userId: Id,
              storeId: [club], 
              remarks: "ubrebateissuancepv",
            }
        
            const submitgenerate: AxiosRequestConfig = {
              method: 'POST',
              url: `${REACT_APP_API_ENDPOINT}/Analytics/IsSubmittedGenerated`,
              data: updatedParam,
            };
  
            await axios(submitgenerate)
            .then((result => {
              setIsSubmitted(result.data.IsSubmitted);
              setIsGenerated(result.data.IsGenerated);
              setSubmitted(false);
            }))
          }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };

    IsSubmittedGenerated();
  }, [REACT_APP_API_ENDPOINT, selectedDate, successRefresh, submitted]);

  useEffect(() => {
    const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
    setRefreshAnalyticsDto({
      dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
      memCode: customerCode,
      userId: Id,
      storeId: [club], 
    })
  }, [club, selectedDate])

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

  const matchedLocation = locations.find(location => location.LocationCode === club);
  const clubCodeName = matchedLocation?.LocationCode + ' - ' + matchedLocation?.LocationName;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      setStateAnalytics({
      ...stateAnalytics,
      [name]: value,
      UserId: Id,
      TransactionDate: formattedDateFrom ?? '',
      CustomerId: customerCode[0],
      LocationId: club
    });
    if(name === "TransactionNo" || name === "RegisterNo")
    {
      setbtnSaveLabel("Search");
      setIsFieldVisible(false);
      setIsManualVisible(false);
      setSelectedRows([]);
    }
  };


  useEffect(() => {
    //console.log("isModalCloseException",isModalCloseException);
  }, [isModalCloseException]);

  const handleCloseException = useCallback(() => {
    setModalOpen(false);
  }, []);

const fetchUBPVIssuanceException = useCallback(async(exceptionParam: IExceptionProps) => {
    try {
      if(exceptionParam.dates[0].length > 0){
        setLoading(true);

        const getAnalytics: AxiosRequestConfig = {
          method: 'POST',
          url: `${REACT_APP_API_ENDPOINT}/Adjustment/GetAdjustmentsAsyncUB`,
          data: exceptionParam,
        };

        // const response = await axios(getAnalytics);
        // const exceptions = response.data.ExceptionList;
        // const pages = response.data.TotalPages

        await axios(getAnalytics)
        .then(async (result) => {
              setExceptions(result.data.ExceptionList);
              setPageCount(result.data.TotalPages);
        })
        .catch((error) => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error fetching adjustment. Please try again!');
        })
      }
      

    } catch (error) {
      console.error("Error fetching adjustment:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
      
          const formattedDate = formattedDateFrom ?? '';
          const exceptionParam: IExceptionProps = {
            PageNumber: page,
            PageSize: itemsPerPage,
            SearchQuery: searchQuery,
            ColumnToSort: columnToSort,
            OrderBy: orderBy, 
            dates: [formattedDate],
            memCode: customerCode,
            userId: Id,
            storeId: [club],
            remarks: "ubrebateissuancepv",
          };

          await fetchUBPVIssuanceException(exceptionParam);
        
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [fetchUBPVIssuanceException, page, itemsPerPage, searchQuery, columnToSort, orderBy, selectedDate, club]);

 useEffect(() => {
  if(isModalClose || modalOpen){
    console.log("test",true);
  }
  

  if (isModalClose || modalOpen || isModalCloseException) {
    const fetchData = async () => {
      try {
        const formattedDate = formattedDateFrom ?? '';
        const exceptionParam: IExceptionProps = {
          PageNumber: page,
          PageSize: itemsPerPage,
          SearchQuery: searchQuery,
          ColumnToSort: columnToSort,
          OrderBy: orderBy,
          dates: [formattedDate],
          memCode: customerCode,
          userId: Id,
          storeId: [club],
          remarks: "ubrebateissuancepv",
        };
        const anaylticsParam: IAnalyticProps = {
          dates: [formattedDate ?? ''],
          memCode: customerCode,
          userId: Id,
          storeId: [club],
            remarks: "ubrebateissuancepv",          
        };      
        await fetchUBPVIssuance(anaylticsParam);
        await fetchUBPVIssuanceException(exceptionParam);
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    setIsModalCloseException(false);
  }
}, [fetchUBPVIssuanceException,fetchUBPVIssuance,isModalClose,modalOpen,isModalCloseException]);

//Jerome end



//Jerome start
  // const handleKeyDown = (event:any) => {
  //   if (event.key === 'Enter') {
  //     handleSubmit();
  //   }
  // };
  const handleButtonAction = () => {
    if(btnSaveLabel === "Search")
    {
      handleSubmit();
    }
    else
    {
      handleSave();
    }

  };
  const handleSubmit = () => {
    try {
      console.error("Enter!1" , stateAnalytics.RegisterNo);
      console.error("Enters!");
      setLoadingAdd(true);
      if(stateAnalytics.TransactionNo === undefined || stateAnalytics.TransactionNo.toString() === ""){
        
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Please input a transaction no.');
          setLoadingAdd(false); 
        
      }
      if((stateAnalytics.TransactionNo === undefined && stateAnalytics.RegisterNo === undefined) || (stateAnalytics.TransactionNo.toString() === "" && stateAnalytics.RegisterNo.toString() === "")){
        
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Please input a transaction no. and register no.');
          setLoadingAdd(false); 
        
      }
      else if(stateAnalytics.TransactionNo === undefined || stateAnalytics.TransactionNo.toString() === "" ){
        
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Please input a transaction no.');
          setLoadingAdd(false); 
        
      }
      else if(stateAnalytics.RegisterNo === undefined || stateAnalytics.RegisterNo.toString() === ""){
        
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Please input a register no.');
          setLoadingAdd(false); 
        
      }
      else
      {

          const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const updatedParam: IRefreshAnalytics = {
            dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
            memCode: customerCode,
            userId: Id,
            storeId: [club], 
            transactionNo: stateAnalytics.TransactionNo,
            regNo: stateAnalytics.RegisterNo,
          }

          const refreshAnalytics: AxiosRequestConfig = {
            method: 'POST',
            url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAnalyticsByItem`,
            data: updatedParam,
          };
          
          axios(refreshAnalytics)
          .then(async (response) => {
              setLoadingAdd(false); 
              setAnalyticsItem(response.data);
              console.log("response.data Analytics items", response.data);
              if (response.data && response.data.length > 0) {
                setIsFieldVisible(true);
                setbtnSaveLabel("Save");
                setIsManualVisible(false);
              } else {
                setIsSnackbarOpen(true);
                setSnackbarSeverity('error');
                setMessage('No data found.');
                setbtnSaveLabel("Save Manual Input");
                setIsFieldVisible(true);
                setIsManualVisible(true);
              }
              setIsFieldDisabled(false);
          })
          .catch((error) => {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Error retrieving analytics');
            console.error("Error retrieving analytics:", error);
            setLoadingAdd(false); 
          })
          .finally(() => {
            setLoadingAdd(false); 
          });
      }
      
    } catch (error) {
        setLoadingAdd(false); 
    } 
  };


 useEffect(() => {

    if(analyticsItem[0]?.MembershipNo !== "" && analyticsItem[0]?.CashierNo !== "" && analyticsItem[0]?.OrderNo !== "" && analyticsItem[0]?.Qty?.toString() !== "" && analyticsItem[0]?.Amount?.toString() !== "" && analyticsItem[0]?.SubTotal?.toString() !== "")
    {
      setStateAnalytics({
        ...stateAnalytics,
        MembershipNo: analyticsItem?.[0]?.MembershipNo ?? '',
        CashierNo: analyticsItem?.[0]?.CashierNo ?? '',
        OrderNo: analyticsItem?.[0]?.OrderNo ?? '',
        Qty: analyticsItem?.[0]?.Qty ?? 0,
        Amount: analyticsItem?.[0]?.Amount ?? 0,
        Subtotal: analyticsItem?.[0]?.SubTotal ?? 0,
        UserId: Id,
        TransactionDate: formattedDateFrom ?? '',
        CustomerId: customerCode[0],
        LocationId: club
      });
    }

  }, [analyticsItem]);

const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedRows = analyticsItem.map((row) => row);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([]);
    }
  };

  const handleCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>, row: IAnalytics) => {
    const selectedIndex = selectedRows.findIndex(selectedRow => selectedRow.Id === row.Id);
    let newSelectedRows: IAnalytics[] = [];

    if (selectedIndex === -1) {
      newSelectedRows = newSelectedRows.concat(selectedRows, row);
    } else if (selectedIndex === 0) {
      newSelectedRows = newSelectedRows.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedRows = newSelectedRows.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelectedRows);
  };

  const isSelected = (id: number) => selectedRows.some(row => row.Id === id);
//Jerome End



  const handleCancelEdit = () => {
    setEditRowId(null); // Exit edit mode without saving
  };

  const handleEditRemarks = (remarks: string, id: string) => {
    setEditRowId(id);
    setEditedRemarks(remarks); // Set edited remarks for editing
  };




  return (
    <Box
      sx={{
        marginTop: '16px',
        marginLeft: '16px',
        flexGrow: 1,
      }}
    >
      <Grid container spacing={1} alignItems="flex-start" direction={'row'}>
        <Grid item sx={{ width: '100%', marginBottom: '-17px' }}>
          <BoxHeaderButtons isSubmitted={isSubmitted} isGenerated={isGenerated} handleOpenSubmit={handleOpenSubmit} handleChangeSearch={handleChangeSearch} handleOpenModal={handleOpenModal} handleOpenRefresh={handleOpenRefresh} customerName='MetroMart' handleChangeDate={handleChangeDate} selectedDate={selectedDate} analytics={analytics} setFilteredAnalytics={setFilteredAnalytics} setIsTyping={setIsTyping}/>  
        </Grid>
        <Grid item xs={12}
          sx={{
              paddingTop: '10px',
              paddingRight: '20px',
              transition: 'left 0.3s ease',
          }}>
            <Box sx={{
              boxShadow: 'inset 6px 9px 8px -1px rgba(0,0,0,0.3), inset -6px 0px 8px -1px rgba(0,0,0,0.3)',
              backgroundColor: '#F2F2F2',
              paddingTop: '10px',
              borderRadius: '20px',
            }}>
              <Grid container spacing={2} sx={{paddingTop: '4px'}}>
                <Grid item>
                  <Box
                    sx={{
                      width:'150px',
                      display: 'flex',
                      flexDirection: 'column',
                      paddingBottom: '10px',
                      backgroundColor: 'white',
                      marginLeft: '15px',
                      paddingLeft: '-1px',
                      marginRight: '-140px',
                      borderTopRightRadius: '20px',
                      borderTopLeftRadius: '20px',
                      paddingTop: '5px',
                      justifyContent: 'center', 
                      alignItems: 'center',
                      boxShadow: '1px 9px 8px -1px rgba(0,0,0,0.3), 1px 0px 8px -1px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontWeight: '900',
                        color: '#1C3766',
                        fontSize: 14,
                      }}
                    >
                      UB PV Issuance
                    </Typography>
                    
                    <Box
                      sx={{
                        border: '2px solid #1C3766',
                        backgroundColor: '#1C3766',
                        height: '3px',
                        width: '40px',
                        borderRadius: '25px',
                      }}
                    >
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box 
                sx={{ 
                  position: 'relative', 
                  backgroundColor: 'white', 
                  boxShadow: '-7px 0px 8px -4px rgba(0,0,0,0.1),7px 0px 8px -4px rgba(0,0,0,0.1),0px 7px 8px -4px rgba(0,0,0,0.1)', 
                  textAlign: 'center',
                  borderBottomLeftRadius: '20px',
                  borderBottomRightRadius: '20px',
                  paddingTop:'20px',
                  paddingBottom:'20px',
                  marginBottom: '20px'
                }}
                >
                <div className="fade">
                  {activeButton === 'Analytics' && (
                    <Fade  in={true} timeout={500}>
                      <Box>
                        <DisputeAnalyticsTable 
                          ref={childRef}
                          filteredAnalytics={isTyping ? filteredAnalytics : analytics}
                          loading={loading}
                          setModalOpen={setModalOpen}
                          setSelectedRowId={setSelectedRowId}
                        />
                      </Box>
                    </Fade>
                  )}
                </div>
                <Box sx={{mx:'20px'}}>
                  <ExceptionsTable 
                    exceptions={exceptions} 
                    isSubmitted={isSubmitted} 
                    setIsModalClose={setIsModalCloseException}
                    refreshAnalyticsDto={refreshAnalyticsDto}
                    merchant={'BankPromos'}
                  />
                </Box>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Pagination
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    count={pageCount}
                    page={page}
                    onChange={(event, value) => {
                      setPage(value);
                      const formattedDate = formattedDateFrom ?? '';
                      const exceptionParam: IExceptionProps = {
                        PageNumber: page,
                        PageSize: itemsPerPage,
                        SearchQuery: searchQuery,
                        ColumnToSort: columnToSort,
                        OrderBy: orderBy,
                        dates: [formattedDate],
                        memCode: customerCode,
                        userId: Id,
                        storeId: [club],
                        remarks: "ubrebateissuancepv",
                      };
                      fetchUBPVIssuanceException(exceptionParam);
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Backdrop
              sx={{ color: '#ffffff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={refreshing}
            >
              <CircularProgress size="100px" sx={{ color: '#ffffff' }} />
            </Backdrop>
          </Grid>
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
      </Grid>
        <ModalComponent
          title='Add Partner Transaction'
          onClose={handleCloseModal}
          buttonName={btnSaveLabel}
          widthPercent='55%'
          open={open}
          onSave={handleButtonAction}
          children={
            <Box sx={{ flexGrow: 1, position: 'relative'  }}>
              {loadingAdd ? (
                <Box height="580px">
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="660px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex={10}
                    bgcolor="#EDECEC"
                  >
                    <CircularProgress size={80} />
                  </Box>
                </Box>
              ) : (
              <>
                <Grid container spacing={2} sx={{marginBottom: 3, paddingRight: '2px'}}>
                    <Grid item xs={12} sx={{marginLeft: '10px', marginTop: 1}}>
                      <Typography sx={{ fontSize: '15px', textAlign: 'left',
                        color: '#1C3766'  }}>
                        *Instruction: Input Transaction and Register No. to search.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{marginLeft: '10px'}}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="text"
                        label="Transaction No"
                        required
                        name='TransactionNo'
                        value={stateAnalytics.TransactionNo}
                        onChange={handleChange}
                        //onKeyDown={handleKeyDown}
                        InputProps={{
                          sx: {
                            borderRadius: '40px',
                            height: '40px',
                            fontSize: '14px',
                            fontFamily: 'Inter',
                            fontWeight: 'bold',
                            color: '#1C2C5A',
                          },
                        }}
                      >
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sx={{marginLeft: '10px'}}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="text"
                        label="Register No"
                        required
                        name='RegisterNo'
                        value={stateAnalytics.RegisterNo}
                        onChange={handleChange}
                        InputProps={{
                          sx: {
                            borderRadius: '40px',
                            height: '40px',
                            fontSize: '14px',
                            fontFamily: 'Inter',
                            fontWeight: 'bold',
                            color: '#1C2C5A',
                          },
                        }}
                      >
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sx={{marginLeft: '10px'}}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        type="text"
                        label="Location Name"
                        value={clubCodeName}
                        InputProps={{
                          sx: {
                            borderRadius: '40px',
                            height: '40px',
                            fontSize: '14px',
                            fontFamily: 'Inter',
                            fontWeight: 'bold',
                            color: '#1C2C5A',
                          },readOnly: true
                        }}
                      >
                      </TextField>
                    </Grid>
                    {/* <Grid item xs={12} sx={{marginLeft: '10px'}}>   
                      <BootstrapButton
                            sx={{
                              color: "white",
                              backgroundColor: "#4761AD",
                              width: "100%",
                              borderRadius: "15px",
                              fontFamily: 'Inter',
                              fontWeight: '500',
                              height: '40px',
                              paddingRight: '15px',
                              borderColor: '#4761AD',
                              '& .MuiTypography-root': {
                                fontSize: '15px',
                              }
                            }}
                            onClick={handleSubmit}
                          >
                          <SearchIcon />
                        </BootstrapButton>
                    </Grid> */}
                    <Grid item xs={12} sx={{marginLeft: '10px'}}>   
                      <Divider />  
                    </Grid>
                </Grid>
                {isFieldVisible ? (
                  <>
                  {isManualVisible ? (
                    <Grid container spacing={2} sx={{marginBottom: 3, paddingRight: '2px'}}>
                      <Grid item xs={12} sx={{marginLeft: '10px'}}>                  
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          type="text"
                          label="Customer Name"
                          value='UNION BANK OF THE PHILIPPINES'
                          disabled={isFieldDisabled}
                          InputProps={{
                            sx: {
                              borderRadius: '40px',
                              height: '40px',
                              fontSize: '14px',
                              fontFamily: 'Inter',
                              fontWeight: 'bold',
                              color: '#1C2C5A',
                            },
                          }}
                        >
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sx={{marginLeft: '10px'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DesktopDatePicker
                            inputFormat="dddd, MMMM DD, YYYY"
                            label="Transaction Date" 
                            value={selectedDate}
                            onChange={handleChangeDate}
                          disabled={isFieldDisabled}
                            renderInput={(params: TextFieldProps) => (
                              <TextField
                                fullWidth
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
                                    fontSize: '14px',
                                  },
                                }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} sx={{marginLeft: '10px'}}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          type="text"
                          label="Membership No"
                          required
                          name='MembershipNo'
                          value={stateAnalytics.MembershipNo}
                          onChange={handleChange}
                          disabled={isFieldDisabled}
                          InputProps={{
                            sx: {
                              borderRadius: '40px',
                              height: '40px',
                              fontSize: '14px',
                              fontFamily: 'Inter',
                              fontWeight: 'bold',
                              color: '#1C2C5A',
                            },
                          }}
                        >
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sx={{marginLeft: '10px'}}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          type="text"
                          label="Cashier No"
                          required
                          name='CashierNo'
                          value={stateAnalytics.CashierNo}
                          onChange={handleChange}
                          disabled={isFieldDisabled}
                          InputProps={{
                            sx: {
                              borderRadius: '40px',
                              height: '40px',
                              fontSize: '14px',
                              fontFamily: 'Inter',
                              fontWeight: 'bold',
                              color: '#1C2C5A',
                            },
                          }}
                        >
                        </TextField>
                      </Grid>
                      <Grid item xs={12} sx={{marginLeft: '10px'}}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          type="text"
                          label="Order No"
                          required
                          name='OrderNo'
                          value={stateAnalytics.OrderNo}
                          onChange={handleChange}
                          disabled={isFieldDisabled}
                          InputProps={{
                            sx: {
                              borderRadius: '40px',
                              height: '40px',
                              fontSize: '14px',
                              fontFamily: 'Inter',
                              fontWeight: 'bold',
                              color: '#1C2C5A',
                            },
                          }}
                        >
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={3.5} sx={{marginLeft: '10px'}}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          type="number"
                          label="Qty"
                          required
                          name="Qty"
                          value={stateAnalytics.Qty}
                          onChange={handleChange}
                          disabled={isFieldDisabled}
                          InputProps={{
                            sx: {
                              borderRadius: '40px',
                              height: '40px',
                              fontSize: '14px',
                              fontFamily: 'Inter',
                              fontWeight: 'bold',
                              color: '#1C2C5A',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} lg={4.3} xl={4.3} sx={{marginLeft: {xs: '10px', md: '0px'}}}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          type="number"
                          label="Amount"
                          required
                          name="Amount"
                          value={stateAnalytics.Amount}
                          onChange={handleChange}
                          disabled={isFieldDisabled}
                          InputProps={{
                            sx: {
                              borderRadius: '40px',
                              height: '40px',
                              fontSize: '14px',
                              fontFamily: 'Inter',
                              fontWeight: 'bold',
                              color: '#1C2C5A',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4} lg={4} xl={4} sx={{marginLeft: {xs: '10px', md: '0px'}}}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          type="number"
                          label="SubTotal"
                          required
                          name="Subtotal"
                          value={stateAnalytics.Subtotal}
                          onChange={handleChange}
                          disabled={isFieldDisabled}
                          InputProps={{
                            sx: {
                              borderRadius: '40px',
                              height: '40px',
                              fontSize: '14px',
                              fontFamily: 'Inter',
                              fontWeight: 'bold',
                              color: '#1C2C5A',
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                      ) : (
                    <Grid container spacing={2} sx={{marginBottom: 3, paddingRight: '2px'}}>
                      <Grid item xs={12} md={12} sx={{marginLeft: '6px', paddingLeft: '5px!important'}}>
                      <CustomScrollbarBox component={Paper}
                        sx={{
                          height: '345px',
                          position: 'relative',
                          paddingTop: '10px',
                          borderBottomLeftRadius: '20px',
                          borderBottomRightRadius: '20px',
                          borderTopLeftRadius: '0',
                          borderTopRightRadius: '0',
                          borderRadius: '20px',
                          paddingLeft: '20px',
                          backgroundColor: '#F2F2F2',
                          paddingRight: '20px',
                          boxShadow: 'inset 1px 1px 1px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)',
                          marginLeft: '20px',
                          marginRight: '20px',
                          marginBottom: '20px'
                        }}
                      >
                        <Table
                          sx={{
                            minWidth: 700,
                            "& th": {
                              borderBottom: '2px solid #1C3766',
                            },
                            borderCollapse: 'separate',
                            borderSpacing: '0px 4px',
                            position: 'relative',
                          }}
                          aria-label="spanning table"
                        >
                          <TableHead
                            sx={{
                              zIndex: 3,
                              position: 'sticky',
                              top: '-10px',
                              backgroundColor: '#F2F2F2',
                            }}
                          >
                            <TableRow>
                              <StyledTableCellHeader padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  indeterminate={selectedRows.length > 0 && selectedRows.length < analyticsItem.length}
                                  checked={analyticsItem.length > 0 && selectedRows.length === analyticsItem.length}
                                  onChange={handleSelectAllClick}
                                  inputProps={{ 'aria-label': 'select all' }}
                                />
                              </StyledTableCellHeader>
                              <StyledTableCellHeader>Customer Name</StyledTableCellHeader>
                              <StyledTableCellHeader>Transaction Date</StyledTableCellHeader>
                              <StyledTableCellHeader>Membership No.</StyledTableCellHeader>
                              <StyledTableCellHeader>Cashier No.</StyledTableCellHeader>
                              <StyledTableCellHeader>Order No.</StyledTableCellHeader>
                              <StyledTableCellHeader>Subtotal</StyledTableCellHeader>
                            </TableRow>
                          </TableHead>
                          <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
                            {analyticsItem.length === 0 ? (
                              <TableRow sx={{ "& td": { border: 0 } }}>
                                <StyledTableCellBody1></StyledTableCellBody1>
                                <StyledTableCellBody1></StyledTableCellBody1>
                                <StyledTableCellBodyNoData>No data found</StyledTableCellBodyNoData>
                                <StyledTableCellBody1></StyledTableCellBody1>
                                <StyledTableCellBody1></StyledTableCellBody1>
                                <StyledTableCellBody1></StyledTableCellBody1>
                              </TableRow>
                            ) : (
                              analyticsItem.map((row) => {
                                const isItemSelected = isSelected(row.Id);
                                const isEditing = editRowId === row.Id.toString();
                                return (
                                  <TableRow
                                    key={row.Id}
                                    sx={{
                                      "& td": { border: 0 },
                                      '&:hover': {
                                        backgroundColor: '#ECEFF1',
                                      },
                                    }}
                                  >
                                    <StyledTableCellBody padding="checkbox">
                                      <Checkbox
                                        color="primary"
                                        checked={isItemSelected}
                                        onChange={(event) => handleCheckboxClick(event, row)}
                                        inputProps={{ 'aria-label': `select row ${row.Id}` }}
                                      />
                                    </StyledTableCellBody>
                                    <StyledTableCellBody>{row.CustomerName}</StyledTableCellBody>
                                    <StyledTableCellBody>
                                      {row.TransactionDate !== null
                                        ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                          })
                                        : ''}
                                    </StyledTableCellBody>
                                    <StyledTableCellBody>{row.MembershipNo}</StyledTableCellBody>
                                    <StyledTableCellBody>{row.CashierNo}</StyledTableCellBody>
                                    <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                                    <StyledTableCellBody sx={{ textAlign: 'right' }}>
                                      {row.SubTotal !== undefined && row.SubTotal !== null
                                        ? row.SubTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : ''}
                                    </StyledTableCellBody>
                                  </TableRow>
                                );
                              })
                            )}
                          </TableBody>
                        </Table>
                      </CustomScrollbarBox>
                      </Grid>
                    </Grid>
                  )}
                  </>
                ) : (
                  <></>
                )}
                
              </>
              )}
            </Box>
          } 
        />
        <ModalComponent
          title='Refresh Analytics'
          onClose={handleCloseRefresh}
          buttonName='Refresh'
          open={openRefresh}
          onSave={handleRefreshClick}
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
                  <Typography sx={{ fontSize: '25px', textAlign: 'center', marginRight: '-170px' }}>
                    Any modifications made will be deleted!
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          } 
        />
        <ModalComponent
          title='Submit Analytics'
          onClose={handleCloseSubmit}
          buttonName='Submit'
          open={openSubmit}
          onSave={handleSubmitClick}
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
                  <Typography sx={{ fontSize: '25px', textAlign: 'center', marginRight: '-170px' }}>
                    Are you sure you want to submit?
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          } 
        />
        <AdjustmentTypeModal open={modalOpen} onClose={handleCloseException} exception={selectedRowId} setIsModalClose={setIsModalClose} mode={Mode.RESOLVE} refreshAnalyticsDto={refreshAnalyticsDto} merchant={'BankPromos'}/>
    </Box>
  )
}

export default UBPVIssuance
