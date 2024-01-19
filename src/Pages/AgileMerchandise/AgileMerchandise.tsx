import { Box, Grid, Typography, TextField, Button, ButtonGroup, Divider, Fade, Alert, styled, Pagination, Snackbar, Backdrop, CircularProgress } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import ModalComponent from '../../Components/Common/ModalComponent';
import HeaderButtons from '../../Components/Common/HeaderButtons';
import MatchTable from '../../Components/Common/MatchTable';
import ExceptionsTable from '../../Components/Common/ExceptionsTable';
import AnalyticsTable from '../../Components/Common/AnalyticsTable';
import PortalTable from '../../Components/Common/PortalTable';
import IAnalytics from '../Common/Interface/IAnalytics';
import IPortal from '../Common/Interface/IPortal';
import IMatch from '../Common/Interface/IMatch';
import IException from '../Common/Interface/IException';
import axios, { AxiosRequestConfig } from 'axios';
import IAnalyticProps from '../Common/Interface/IAnalyticsProps';
import IExceptionProps from '../Common/Interface/IExceptionProps';
import dayjs, { Dayjs } from 'dayjs';
import IRefreshAnalytics from '../Common/Interface/IRefreshAnalytics';
import IAdjustmentAddProps from '../Common/Interface/IAdjustmentAddProps';
import IInvoice from '../Common/Interface/IInvoice';
import * as XLSX from 'xlsx';
import IExceptionReport from '../Common/Interface/IExceptionReport';

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

const AgileMerchandise = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem('club');
  const [open, setOpen] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState('Match');
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const [portal, setPortal] = useState<IPortal[]>([]);
  const [match, setMatch] = useState<IMatch[]>([]);
  const [exception, setException] = useState<IException[]>([]);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
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
  const [openGenInvoice, setOpenGenInvoice] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [adjustmentFields, setAdjustmentFields] = useState<IAdjustmentAddProps>({} as IAdjustmentAddProps);
  const [isSave, setIsSave] = useState<boolean>(false);
  const [isFetchException, setIsFetchException] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(true);
  const [refreshAnalyticsDto, setRefreshAnalyticsDto] = useState<IRefreshAnalytics>();

  useEffect(() => {
    document.title = 'CSI | AgileMerchandise';
  }, []);

  let club = 0;
  if(getClub !== null)
  {
    club = parseInt(getClub, 10);
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

  const handleOpenGenInvoice = () => {
    setOpenGenInvoice(true);
  };

  const handleCloseGenInvoice = useCallback(() => {
    setOpenGenInvoice(false);
  }, []);

  const handleButtonClick = (buttonName : string) => {
    setActiveButton(buttonName);
    // Add any additional logic you need on button click
  };

  const formatDate = (value: Date) => {
    let date = new Date(value);
    const day = date.toLocaleString('default', { day: '2-digit' });
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.toLocaleString('default', { year: 'numeric' });
    return day + '-' + month + '-' + year;
  }

  const handleGenInvoiceClick = () => {
    try {
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: ['9999011931'],
        userId: '',
        storeId: [club], 
      }

      const generateInvoice: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GenerateInvoiceAnalytics`,
        data: updatedParam,
      };

      axios(generateInvoice)
      .then((result) => {
          var analytics = result.data.InvoiceList as IInvoice[];
          var isPending = result.data.IsPending;
          if(!isPending)
          {
            const content = analytics.map((item) => {
              const formattedTRXDate = formatDate(item.HDR_TRX_DATE);
              const formattedGLDate = formatDate(item.HDR_GL_DATE);
        
              const formattedItem = {
                ...item,
                HDR_TRX_DATE: formattedTRXDate,
                HDR_GL_DATE: formattedGLDate,
              };
        
              // Join other fields
              return Object.values(formattedItem).join('|') + '|';
            })
            .join('\n');
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
        
            const a = document.createElement('a');
            a.href = url;
            analytics.map(invoices => a.download = invoices.FILENAME)
            document.body.appendChild(a);
            a.click();
        
            // Cleanup
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setMessage('Invoice Generated Successfully');
            setOpenGenInvoice(false);
          }
          else
          {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('warning');
            setMessage('Please submit the analytics first and try again.');
          }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error generating invoice');
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error generating invoice');
    } 
  };

  const handleUploadClick = () => {
    try {
      if (selectedFile === null) {
        // Show an error message or take appropriate action
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Please select a file before uploading.');
        return;
      }

      const formData = new FormData();
      if (selectedFile && selectedDate) {
        selectedFile.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('customerName', 'AgileMerchandise');
        formData.append('strClub', club.toString());
        formData.append('selectedDate', selectedDate.toString());

        const uploadProofList: AxiosRequestConfig = {
          method: 'POST',
          url: `${REACT_APP_API_ENDPOINT}/ProofList/UploadProofList`,
          data: formData,
        };

        axios(uploadProofList)
        .then(async (response) => {
          if(response.data.Item2 === 'Proof list already uploaded!')
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('AgileMerchandise proof list already uploaded');
          }
          else if (response.data.Item2 === 'Error extracting proof list.')
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Error extracting proof list. Please check the file and try again!');
          }
          else if (response.data.Item2 === 'Uploaded file transaction dates do not match.')
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Uploaded file transaction dates do not match. Please check the file and try again!');
          }
          else if (response.data.Item2 === 'Column not found.')
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Uploaded file Columns do not match. Please check the file and try again!');
          }
          else if (response.data.Item2 === 'Uploaded file merchant do not match.')
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Uploaded file merchant do not match. Please check the file and try again!');
          }
          else if (response.data.Item2 === 'No files uploaded.')
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('No files uploaded. Please check the file and try again!');
          }
          else
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setMessage('AgileMerchandise proof list uploaded successfully.');

            const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
            const anaylticsParam: IAnalyticProps = {
              dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
              memCode: ['9999011931'],
              userId: '',
              storeId: [club],
            };

            const exceptionParam: IExceptionProps = {
              PageNumber: page,
              PageSize: itemsPerPage,
              SearchQuery: searchQuery,
              ColumnToSort: columnToSort,
              OrderBy: orderBy, 
              dates: [formattedDate],
              memCode: ['9999011931'],
              userId: '',
              storeId: [club],
            };

            await fetchAgileMerchandiseMatch(anaylticsParam);
            await fetchAgileMerchandiseException(exceptionParam);
            setSuccess(true);
            setOpen(false);
          }
        })
        .catch((error) => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error uploading proof list');
          setSelectedFile([]);
          console.error("Error uploading proof list:", error);
        })
      }
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error uploading proof list');
        setSelectedFile([]);
        console.error("Error uploading proof list:", error);
    } 

    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
    const anaylticsParam: IAnalyticProps = {
      dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
      memCode: ['9999011931'],
      userId: '',
      storeId: [club],
    };
    UpdateUploadStatus(anaylticsParam);
  };

  useEffect(() => {
  }, [match]);

  const handleCloseModal = useCallback(() => {
    setOpen(false);
    setSelectedFile([]);
  }, []);

  const fetchAgileMerchandise = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      setLoading(true);

      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAnalytics`,
        data: anaylticsParam,
      };

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

  const fetchAgileMerchandisePortal = useCallback(async(portalParams: IAnalyticProps) => {
    try {
      setLoading(true);

      const getPortal: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/ProofList/GetPortal`,
        data: portalParams,
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

  const fetchAgileMerchandiseMatch = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      setLoading(true);
      const getAnalyticsMatch: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAnalyticsProofListVariance`,
        data: anaylticsParam,
      };

      const response = await axios(getAnalyticsMatch);
      const result = response.data;

      if (result != null) {
        setMatch(result);
      }

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);

  const fetchAgileMerchandiseException = useCallback(async(exceptionParam: IExceptionProps) => {
    try {
      setLoading(true);

      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Adjustment/GetAdjustmentsAsync`,
        data: exceptionParam,
      };

      const response = await axios(getAnalytics);
      const exception = response.data.ExceptionList;
      const pages = response.data.TotalPages

      if (exception != null) {
        setException(exception);
        setPageCount(pages);
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
        if(selectedDate !== null)
        {
          const formattedDate = selectedDate.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDate],
            memCode: ['9999011931'],
            userId: '',
            storeId: [club],
          };
      
          const exceptionParam: IExceptionProps = {
            PageNumber: page,
            PageSize: itemsPerPage,
            SearchQuery: searchQuery,
            ColumnToSort: columnToSort,
            OrderBy: orderBy, 
            dates: [formattedDate],
            memCode: ['9999011931'],
            userId: '',
            storeId: [club],
          };
      
          await fetchAgileMerchandise(anaylticsParam);
          await fetchAgileMerchandisePortal(anaylticsParam);
          await fetchAgileMerchandiseMatch(anaylticsParam);
          await fetchAgileMerchandiseException(exceptionParam);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [fetchAgileMerchandise, fetchAgileMerchandisePortal, fetchAgileMerchandiseMatch, fetchAgileMerchandiseException, page, itemsPerPage, searchQuery, columnToSort, orderBy, selectedDate, club]);

  const postException = useCallback(async(portalParams: IMatch[]) => {
    try {
      if(!isSave)
      {
        const adjustmentParamsArray = portalParams.map(filteredMatch => ({
          Id: 0,
          AnalyticsId: filteredMatch.AnalyticsId,
          ProoflistId: filteredMatch.ProofListId,
          ActionId: null,
          StatusId: 5,
          AdjustmentId: 0,
          DeleteFlag: false,
          AdjustmentAddDto: adjustmentFields
        }));
  
        adjustmentParamsArray.forEach(paramAdjustment => {
          const saveRequest: AxiosRequestConfig = {
            method: 'POST',
            url: `${REACT_APP_API_ENDPOINT}/Adjustment/CreateAnalyticsProofList`,
            data: paramAdjustment,
          };
        
          axios(saveRequest)
            .catch((error) => {
              console.error("Error saving data:", error);
              setIsSnackbarOpen(true);
              setSnackbarSeverity('error');
              setMessage('Error occurred. Please try again.');
            })
            .finally(() => {
              setIsSave(true); 
            });
        });
      }
    } catch (error) {

    } 
  }, [REACT_APP_API_ENDPOINT, adjustmentFields]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (success) {
          const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
            memCode: ['9999011931'],
            userId: '',
            storeId: [club],
          };
  
          await fetchAgileMerchandisePortal(anaylticsParam);
          // await fetchAgileMerchandiseMatch(anaylticsParam);
  
          const filteredMatches = match.filter(match =>
            match.ProofListId === null ||
            match.AnalyticsId === null ||
            (match.Variance ?? 0) <= -2 || (match.Variance ?? 0) >= 2
          );

          await postException(filteredMatches);
          setIsFetchException(true);
          setSuccess(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [fetchAgileMerchandisePortal, fetchAgileMerchandiseMatch, selectedDate, success, club, match]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(isModalClose)
        {
          const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
            memCode: ['9999011931'],
            userId: '',
            storeId: [club],
          };
      
          const exceptionParam: IExceptionProps = {
            PageNumber: page,
            PageSize: itemsPerPage,
            SearchQuery: searchQuery,
            ColumnToSort: columnToSort,
            OrderBy: orderBy, 
            dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
            memCode: ['9999011931'],
            userId: '',
            storeId: [club],
          };

          await fetchAgileMerchandiseMatch(anaylticsParam);
          await fetchAgileMerchandiseException(exceptionParam);
          setIsModalClose(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(isFetchException)
        {
          const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const exceptionParam: IExceptionProps = {
            PageNumber: page,
            PageSize: itemsPerPage,
            SearchQuery: searchQuery,
            ColumnToSort: columnToSort,
            OrderBy: orderBy, 
            dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
            memCode: ['9999011931'],
            userId: '',
            storeId: [club],
          };

          await fetchAgileMerchandiseException(exceptionParam);
          setIsFetchException(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(successRefresh)
        {
          const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
            memCode: ['9999011931'],
            userId: '',
            storeId: [club],
          };
          await fetchAgileMerchandiseMatch(anaylticsParam);
          await fetchAgileMerchandise(anaylticsParam);
          setSuccessRefresh(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [fetchAgileMerchandiseException, fetchAgileMerchandise, fetchAgileMerchandiseMatch, selectedDate, successRefresh]);

  const handleRefreshClick = () => {
    try {
      setRefreshing(true);
      setOpenRefresh(false);
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: ['9999011931'],
        userId: '',
        storeId: [club], 
      }

      const refreshAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/RefreshAnalytics`,
        data: updatedParam,
      };

      axios(refreshAnalytics)
      .then(async () => {
          setSelectedFile([]);
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
              memCode: ['9999011931'],
              userId: '',
              storeId: [club],
            };

            await fetchAgileMerchandiseException(exceptionParam);
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error refreshing analytics');
        setSelectedFile([]);
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
        setSelectedFile([]);
        console.error("Error refreshing analytics:", error);
        setRefreshing(false);
        setOpenRefresh(false);
        setSuccess(false);
    } 
  };

  const UpdateUploadStatus = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      setLoading(true);
      const updateStatus: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/UpdateUploadStatus`,
        data: anaylticsParam,
      };
      await axios(updateStatus);

    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    const defaultDate = dayjs().startOf('day').subtract(1, 'day');
    const currentDate = dayjs().startOf('day').subtract(1, 'day');;
    setSelectedDate(defaultDate);
    setCurrentDate(currentDate);
  }, []);

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
        memCode: ['9999011931'],
        userId: '',
        storeId: [club], 
      }

      const submitAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/SubmitAnalytics`,
        data: updatedParam,
      };

      axios(submitAnalytics)
      .then(async (result) => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Analytics Successfully Submitted');
          setOpenSubmit(false);
          setSubmitted(true);
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

  const handleExportExceptions = () => {
    try {
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: ['9999011931'],
        userId: '',
        storeId: [club], 
      }

      const exceptionReport: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Adjustment/ExportExceptions`,
        data: updatedParam,
      };

      axios(exceptionReport)
      .then((result) => {
          var exceptions = result.data as IExceptionReport[];
          if(exceptions.length >= 1)
          {
            const worksheet = XLSX.utils.json_to_sheet(exceptions);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'exceptions_report');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const fileName = `exported_data_${new Date().toISOString()}.xlsx`;
        
            // Create a download link and trigger a click event to start the download
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(dataBlob);
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setMessage('Exceptions report successfully extracted.');
          }
          else
          {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('warning');
            setMessage('No exceptions found.');
          }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error extracting exceptions report');
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error extracting exceptions report');
    } 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
          const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const updatedParam: IRefreshAnalytics = {
            dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
            memCode: ['9999011931'],
            userId: '',
            storeId: [club], 
          }
      
          const submit: AxiosRequestConfig = {
            method: 'POST',
            url: `${REACT_APP_API_ENDPOINT}/Analytics/IsSubmitted`,
            data: updatedParam,
          };

          await axios(submit)
          .then((result => {
            setIsSubmitted(result.data);
            setSubmitted(false);
          }))
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedDate, successRefresh, submitted]);

  useEffect(() => {
    const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
    setRefreshAnalyticsDto({
      dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
      memCode: ['9999011931'],
      userId: '',
      storeId: [club], 
    })
  }, [club, selectedDate])

  return (
    <Box
      sx={{
        marginTop: '16px',
        marginLeft: '16px',
        flexGrow: 1,
      }}
    >
      <Grid container spacing={1} alignItems="flex-start" direction={'row'}>
        <Grid item>
          <HeaderButtons isSubmitted={isSubmitted} handleOpenSubmit={handleOpenSubmit} handleChangeSearch={handleChangeSearch} handleOpenModal={handleOpenModal} handleOpenRefresh={handleOpenRefresh} customerName='AgileMerchandise' handleChangeDate={handleChangeDate} selectedDate={selectedDate} handleOpenGenInvoice={handleOpenGenInvoice} handleExportExceptions={handleExportExceptions} />  
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
              <Grid container spacing={1} sx={{paddingTop: '4px'}}>
                <Grid item>
                  <Box
                    sx={{
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
                        fontSize: 17,
                      }}
                    >
                      AgileMerchandise
                    </Typography>
                    <Box
                      sx={{
                        border: '2px solid #00B14F',
                        backgroundColor: '#00B14F',
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
                }}
                >
                <ButtonGroup sx={{ height: '20px', display: 'flex', justifyContent: 'center', paddingTop: '10px'  }}>
                  <Button 
                    sx={{ 
                      fontWeight: '900 !important', 
                      fontSize: '12px', 
                      width: '250px', 
                      borderRadius: '10px', 
                      textTransform: 'none',  
                      border: '2px solid #1C2D5B' ,
                      color: activeButton === 'Analytics' ? '#fff' : '#1C2D5B',
                      backgroundColor: activeButton === 'Analytics' ? '#1C2D5B' : 'transparent',
                    }}
                    onClick={() => handleButtonClick('Analytics')}
                  >Analytics
                  </Button>
                  <Button 
                    sx={{ 
                      fontWeight: '900 !important', 
                      fontSize: '12px', 
                      width: '250px', 
                      textTransform: 'none',  
                      border: '2px solid #1C2D5B',
                      color: activeButton === 'Match' ? '#fff' : '#1C2D5B',
                      backgroundColor: activeButton === 'Match' ? '#1C2D5B' : 'transparent',
                    }}
                    onClick={() => handleButtonClick('Match')}
                  >Match
                  </Button>
                  <Button 
                    sx={{ 
                      fontWeight: '900 !important', 
                      fontSize: '12px', 
                      width: '250px' , 
                      borderRadius: '10px', 
                      textTransform: 'none',  
                      border: '2px solid #1C2D5B', 
                      color: activeButton === 'Portal' ? '#fff' : '#1C2D5B',
                      backgroundColor: activeButton === 'Portal' ? '#1C2D5B' : 'transparent',
                    }}
                    onClick={() => handleButtonClick('Portal')}
                  >Portal
                  </Button>
                </ButtonGroup>
                <div className="fade">
                  {activeButton === 'Analytics' && (
                    <Fade  in={true} timeout={500}>
                      <Box>
                        <AnalyticsTable 
                          analytics={analytics}
                          loading={loading}
                        />
                      </Box>
                    </Fade>
                  )}
                  {activeButton === 'Match' && (
                    <Fade  in={true}  timeout={500}>
                      <Box>
                        <MatchTable 
                          match={match}
                          loading={loading}
                          setIsModalClose={setIsModalClose}
                        />
                      </Box>
                    </Fade>
                  )}
                  {activeButton === 'Portal' && (
                    <Fade  in={true} timeout={500}>
                      <Box>
                        <PortalTable 
                          portal={portal}
                          loading={loading}
                          merchant='AgileMerchandise'
                        />
                      </Box>
                    </Fade>
                  )}
                </div>
              </Box>
            </Box>
            <Backdrop
              sx={{ color: '#ffffff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={refreshing}
            >
              <CircularProgress size="100px" sx={{ color: '#ffffff' }} />
            </Backdrop>
            <Divider variant="middle" sx={{ paddingTop: '20px', borderBottomWidth: 2 }} />
            <Box
              sx={{ paddingTop: '20px' }}>
              <ExceptionsTable 
                exceptions={exception} 
                loading={loading} 
                setIsModalClose={setIsModalClose}
                refreshAnalyticsDto={refreshAnalyticsDto}
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
                    const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
                    const exceptionParam: IExceptionProps = {
                      PageNumber: value,
                      PageSize: itemsPerPage,
                      SearchQuery: searchQuery,
                      ColumnToSort: columnToSort,
                      OrderBy: orderBy, 
                      dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
                      memCode: ['9999011931'],
                      userId: '',
                      storeId: [club],
                    };
                    fetchAgileMerchandiseException(exceptionParam);
                  }}
                />
              </Box>
            </Box>
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
          title='Upload Prooflist'
          onClose={handleCloseModal}
          buttonName='Upload'
          open={open}
          onSave={handleUploadClick}
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
                  Partner
                </Grid>
                <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
                  <Box display={'flex'}>
                    <TextField 
                      size='small' 
                      fullWidth 
                      value={'AgileMerchandise'}
                      disabled
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
                  File *
                </Grid>
                <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
                  <Box display={'flex'}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      disabled
                      value={selectedFile?.length > 0 ? selectedFile?.map(file => file.name).join(', ') : 'Selected Files'}
                      size='small'
                      helperText='*CSV, XLSX File Only'
                      required
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
                        borderTopRightRadius: '8px',
                        borderBottomRightRadius: '8px',
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
              </Grid>
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
        <ModalComponent
          title='Generate Invoice'
          onClose={handleCloseGenInvoice}
          buttonName='Generate'
          open={openGenInvoice}
          onSave={handleGenInvoiceClick}
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
                    Are you sure you want to generate invoice?
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          } 
        />
    </Box>
  )
}

export default AgileMerchandise
