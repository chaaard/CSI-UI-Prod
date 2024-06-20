import { Box, Grid, Typography, TextField, Button, ButtonGroup, Divider, Fade, Alert, styled, Pagination, Snackbar, Backdrop, CircularProgress, IconButton } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import ModalComponent from '../../../Components/Common/ModalComponent';
import HeaderButtons from '../../../Components/Common/HeaderButtons';
import MatchTable from '../../../Components/Common/MatchTable';
import ExceptionsTable from '../../../Components/Common/ExceptionsTable';
import AnalyticsTable from '../../../Components/Common/AnalyticsTable';
import PortalTable from '../../../Components/Common/PortalTable';
import IAnalytics from '../../Common/Interface/IAnalytics';
import IPortal from '../../Common/Interface/IPortal';
import IMatch from '../../Common/Interface/IMatch';
import IException from '../../Common/Interface/IException';
import axios, { AxiosRequestConfig } from 'axios';
import IAnalyticProps from '../../Common/Interface/IAnalyticsProps';
import IExceptionProps from '../../Common/Interface/IExceptionProps';
import dayjs, { Dayjs } from 'dayjs';
import IRefreshAnalytics from '../../Common/Interface/IRefreshAnalytics';
import IAdjustmentAddProps from '../../Common/Interface/IAdjustmentAddProps';
import { insertLogs } from '../../../Components/Functions/InsertLogs';
import * as XLSX from 'xlsx';
import IExceptionReport from '../../Common/Interface/IExceptionReport';
import IosShareIcon from '@mui/icons-material/IosShare';

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

const BootstrapButton = styled(IconButton)(({ theme }) => ({
  border: '1px solid',
  backgroundColor: '#1C3766',
  borderColor: '#1C3766',
  color: 'white',
  '&:hover': {
    backgroundColor: '#15294D',
    borderColor: '#15294D',
  },
  borderRadius: theme.shape.borderRadius, // Ensure the button has the default shape
}));

const MetroMart = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem('club');
  const getId = window.localStorage.getItem('Id');
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
  const [success, setSuccess] = useState<boolean>(false);
  const [isModalClose, setIsModalClose] = useState<boolean>(false);
  const [successRefresh, setSuccessRefresh] = useState<boolean>(false);
  const [openRefresh, setOpenRefresh] = useState<boolean>(false);
  const [openSubmit, setOpenSubmit] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [adjustmentFields, setAdjustmentFields] = useState<IAdjustmentAddProps>({} as IAdjustmentAddProps);
  const [isSave, setIsSave] = useState<boolean>(false);
  const [isFetchException, setIsFetchException] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(true);
  const [refreshAnalyticsDto, setRefreshAnalyticsDto] = useState<IRefreshAnalytics>();

  useEffect(() => {
    document.title = 'CSI | MetroMart';
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

  const handleButtonClick = (buttonName : string) => {
    setActiveButton(buttonName);
    // Add any additional logic you need on button click
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
        const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
        const analyticsParam: IAnalyticProps = {
          dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
          memCode: ['9999011855'],
          userId: Id,
          storeId: [club],
        };

        selectedFile.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('customerName', 'MetroMart');
        formData.append('strClub', club.toString());
        formData.append('selectedDate', selectedDate.toString());
        formData.append('analyticsParamsDto', JSON.stringify(analyticsParam));
        
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
            setMessage('MetroMart proof list already uploaded');
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
          else if (response.data.Item2 === 'No analytics found.')
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('No analytics found. Please reload the analytics and try again!');
          }
          else
          {
            setSelectedFile([]);
            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setMessage('MetroMart proof list uploaded successfully.');

            const exceptionParam: IExceptionProps = {
              PageNumber: page,
              PageSize: itemsPerPage,
              SearchQuery: searchQuery,
              ColumnToSort: columnToSort,
              OrderBy: orderBy, 
              dates: [formattedDate],
              memCode: ['9999011855'],
              userId: Id,
              storeId: [club],
            };

            await fetchMetroMartMatch(analyticsParam);
            await fetchMetroMartException(exceptionParam);
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
  };

  useEffect(() => {
  }, [match]);

  const handleCloseModal = useCallback(() => {
    setOpen(false);
    setSelectedFile([]);
  }, []);

  const fetchMetroMart = useCallback(async(anaylticsParam: IAnalyticProps) => {
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

  const fetchMetroMartPortal = useCallback(async(portalParams: IAnalyticProps) => {
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

  const fetchMetroMartMatch = useCallback(async(anaylticsParam: IAnalyticProps) => {
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

  const fetchMetroMartException = useCallback(async(exceptionParam: IExceptionProps) => {
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
            memCode: ['9999011855'],
            userId: Id,
            storeId: [club],
          };
      
          const exceptionParam: IExceptionProps = {
            PageNumber: page,
            PageSize: itemsPerPage,
            SearchQuery: searchQuery,
            ColumnToSort: columnToSort,
            OrderBy: orderBy, 
            dates: [formattedDate],
            memCode: ['9999011855'],
            userId: Id,
            storeId: [club],
          };
      
          await fetchMetroMart(anaylticsParam);
          await fetchMetroMartPortal(anaylticsParam);
          await fetchMetroMartMatch(anaylticsParam);
          await fetchMetroMartException(exceptionParam);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [fetchMetroMart, fetchMetroMartPortal, fetchMetroMartMatch, fetchMetroMartException, page, itemsPerPage, searchQuery, columnToSort, orderBy, selectedDate, club]);

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
          SourceId: (filteredMatch.AnalyticsId !== null ? 1 : filteredMatch.ProofListId !== null ? 2 : 0),
          AdjustmentAddDto: adjustmentFields,
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
            memCode: ['9999011855'],
            userId: Id,
            storeId: [club],
          };
  
          await fetchMetroMartPortal(anaylticsParam);
          // await fetchMetroMartMatch(anaylticsParam);
  
          const filteredMatches = match.filter(match =>
              match.ProofListId === null ||
              match.AnalyticsId === null ||
              (match.Variance !== null && match.Variance !== undefined && (match.Variance <= -1 || match.Variance >= 1))
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
  }, [fetchMetroMartPortal, fetchMetroMartMatch, selectedDate, success, club, match]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(isModalClose)
        {
          const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
            memCode: ['9999011855'],
            userId: Id,
            storeId: [club],
          };
      
          const exceptionParam: IExceptionProps = {
            PageNumber: page,
            PageSize: itemsPerPage,
            SearchQuery: searchQuery,
            ColumnToSort: columnToSort,
            OrderBy: orderBy, 
            dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
            memCode: ['9999011855'],
            userId: Id,
            storeId: [club],
          };

          await fetchMetroMartMatch(anaylticsParam);
          await fetchMetroMartException(exceptionParam);
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
            memCode: ['9999011855'],
            userId: Id,
            storeId: [club],
          };

          await fetchMetroMartException(exceptionParam);
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
            memCode: ['9999011855'],
            userId: Id,
            storeId: [club],
          };
          await fetchMetroMartMatch(anaylticsParam);
          await fetchMetroMart(anaylticsParam);
          setSuccessRefresh(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [fetchMetroMartException, fetchMetroMart, fetchMetroMartMatch, selectedDate, successRefresh]);

  const handleRefreshClick = () => {
    try {
      setRefreshing(true);
      setOpenRefresh(false);
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: ['9999011855'],
        userId: Id,
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
              memCode: ['9999011855'],
              userId: Id,
              storeId: [club],
            };

            await fetchMetroMartException(exceptionParam);
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

  useEffect(() => {
    const defaultDate = dayjs().startOf('day').subtract(1, 'day');
    setSelectedDate(defaultDate);
  }, []);

  const handleChangeDate = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
  };

  const handleSubmitClick = () => {
    try {
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: ['9999011855'],
        userId: Id,
        storeId: [club], 
      }

      const submitAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/SubmitAnalytics`,
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
              memCode: ['9999011855'],
              userId: Id,
              storeId: [club], 
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
      memCode: ['9999011855'],
      userId: Id,
      storeId: [club], 
    })
  }, [club, selectedDate, Id])

    const handleExportExceptions = async () => {
    try {
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: ['9999011855'],
        userId: Id,
        storeId: [club], 
      }

      const exceptionReport: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Adjustment/ExportExceptions`,
        data: updatedParam,
      };

      await axios(exceptionReport)
      .then(async (result) => {
          var exceptions = result.data as IExceptionReport[];
          if(exceptions.length >= 1)
          {
            const worksheet = XLSX.utils.json_to_sheet(exceptions);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'exceptions_report');
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const fileName = `exceptions_${new Date().toISOString()}.xlsx`;
        
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

            
            const anaylticsParamUpdated: IAnalyticProps = {
              dates: [formattedDate?.toString() ? formattedDate?.toString() : '', formattedDate?.toString() ? formattedDate?.toString() : ''],
              memCode: ['9999011855'],
              userId: Id,
              remarks: "Successfully Generated",
              storeId: [club],
              action: 'Exceptions',
              fileName: fileName
            };

            await insertLogs(anaylticsParamUpdated);
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
          <HeaderButtons isSubmitted={isSubmitted} isGenerated={isGenerated} handleOpenSubmit={handleOpenSubmit} handleOpenModal={handleOpenModal} handleOpenRefresh={handleOpenRefresh} customerName='MetroMart' handleChangeDate={handleChangeDate} selectedDate={selectedDate} />  
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
                        fontSize: 14,
                      }}
                    >
                      MetroMart
                    </Typography>
                    <Box
                      sx={{
                        border: '2px solid #424140',
                        backgroundColor: '#424140',
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
                          merchant='MetroMart'
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
                isSubmitted={isSubmitted} 
                setIsModalClose={setIsModalClose}
                refreshAnalyticsDto={refreshAnalyticsDto}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <BootstrapButton
                  sx={{
                    color: "white",
                    backgroundColor: "#1C3766",
                    borderRadius: "20px",
                    fontFamily: 'Inter',
                    fontWeight: '900',
                    height: '35px',
                    borderColor: isSubmitted ? 'inherit' : '#1C3766',
                    '& .MuiTypography-root': {
                      fontSize: '14px',
                    }
                  }}
                  onClick={handleExportExceptions}
                >
                  <IosShareIcon sx={{marginRight: '5px'}} />
                  <Typography>
                    Export Exceptions
                  </Typography>
                </BootstrapButton>
                
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
                      memCode: ['9999011855'],
                      userId: Id,
                      storeId: [club],
                    };
                    fetchMetroMartException(exceptionParam);
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
                      value={'MetroMart'}
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
    </Box>
  )
}

export default MetroMart