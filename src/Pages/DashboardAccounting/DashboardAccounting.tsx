import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, CircularProgress, Pagination, Grid, TextField, TextFieldProps, MenuItem, IconButton, Snackbar, Fade, Alert, Paper, Divider } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import IAccntGenerateInvoice from '../../Pages/Common/Interface/IAccntGenerateInvoice';
import {ReceiptLong as ReceiptLongIcon} from '@mui/icons-material/';
import CheckIcon from '@mui/icons-material/Check';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import IDashboardAccounting from '../Common/Interface/IDashboardAccounting';
import IRefreshAnalytics from '../Common/Interface/IRefreshAnalytics';


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

interface ICustomerCodes
{
  CustomerId: string,
  CustomerName: string,
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

const customerCodes = [
  { CustomerId: "9999011929", CustomerName: "Grab Food" },
  { CustomerId: "9999011955", CustomerName: "Grab Mart" },
  { CustomerId: "9999011931", CustomerName: "Pick A Roo Merchandise" },
  { CustomerId: "9999011935", CustomerName: "Pick A Roo FS" },
  { CustomerId: "9999011838", CustomerName: "Food Panda" },
  { CustomerId: "9999011855", CustomerName: "MetroMart" },
];

const DashboardAccounting = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<IDashboardAccounting[]>([]);

const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
  const analyticsParam: IRefreshAnalytics = {
    dates: [formattedDateFrom ? formattedDateFrom : '', formattedDateFrom ? formattedDateFrom : ''],
    memCode: [],
    userId: '',
    storeId: [0], 
  }

  const updatedParam = {
    Path: '',
    BatFilePath: '',
    analyticsParamsDto: analyticsParam, 
  }

  useEffect(() => {
    if(formattedDateFrom)
    {
      setLoading(true)
      setGeneratedInvoice([]);
      const fetchGenerateInvoice = async () => {
        try {
          const getAnalytics: AxiosRequestConfig = {
            method: 'POST',
            url: `${REACT_APP_API_ENDPOINT}/Analytics/DashboardAccounting`,
            data: updatedParam,
          };
    
          axios(getAnalytics)
          .then(async (response) => {
            setGeneratedInvoice([]);
            setGeneratedInvoice(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          })
          .finally(() => {
            setLoading(false)
          })
        } catch (error) {
          console.error("Error fetching data:", error);
        } 
      };

      fetchGenerateInvoice();
    }
  }, [REACT_APP_API_ENDPOINT, formattedDateFrom]);

  useEffect(() => {
    const defaultDate = dayjs().startOf('day').subtract(1, 'day');
    setSelectedDateFrom(defaultDate);
    setLoading(false)
  }, []);

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  useEffect(() => {
    document.title = 'Accounting | Submitted CSI';
  }, []);

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
            Submitted CSI
          </Typography>
          <Divider sx={{ marginBottom: '20px' }} />
          <Grid container spacing={1} alignItems="flex-start" direction={'row'}>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  inputFormat="dddd, MMMM DD, YYYY"
                  value={selectedDateFrom}
                  label="Date"
                  onChange={handleChangeDateFrom}
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
                          width: '230px',
                          fontSize: '14px',
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>     
          <Divider sx={{ marginTop: '20px' }} />
            <CustomScrollbarBox component={Paper}
              sx={{
                height: '400px',
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
              borderCollapse: 'separate',
              borderSpacing: '6px 6px',
            }}
            aria-label="spanning table">
            <TableHead
              sx={{
                height: '10px',
                zIndex: 3,
                position: 'sticky',
                top: '-10px',
                backgroundColor: '#ffffff',
              }}
            >
                <TableRow sx={{ minWidth: 700 }}>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Club</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Grab Mart</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Grab Food</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Pick A Roo Merch</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Pick A Roo FS</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>Food Panda</StyledTableCell>
                  <StyledTableCell style={{ textAlign: 'center',  }}>MetroMart</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading ? (
                  generatedInvoice.map((item: IDashboardAccounting) => (
                  <TableRow key={item.LocationCode} sx={{ "& td": { border: 0 }}}>
                    <StyledTableCellSmall >{item.LocationName}</StyledTableCellSmall>
                    <StyledTableCellSmall 
                      style={{ 
                        width: '200px',
                        borderRadius: '10px',
                        textAlign: 'center', 
                        backgroundColor: item.GrabMart === null ? '#FFB5B5' : item.GrabMart === 3 ?  '#E3FBE3' : '#FFCF97',
                        color: item.GrabMart === null ? '#A85A5A' : item.GrabMart === 3 ? '#3F743F' : '#634422',
                      }}
                    >
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', }}>
                        {item.GrabMart === null ? (
                          <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                          ) : item.GrabMart === 3 ? (  
                            <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : (
                          <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        )}
                        {item.GrabMart === null ? 'No Analytics' : item.GrabMart === 3 ? 'Submitted' : 'Pending'}
                      </span>
                    </StyledTableCellSmall>
                    <StyledTableCellSmall 
                      style={{ 
                        width: '200px',
                        borderRadius: '10px',
                        textAlign: 'center', 
                        backgroundColor: item.GrabFood === null ? '#FFB5B5' : item.GrabFood === 3 ?  '#E3FBE3' : '#FFCF97',
                        color: item.GrabFood === null ? '#A85A5A' : item.GrabFood === 3 ? '#3F743F' : '#634422',
                      }}
                    >
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', }}>
                        {item.GrabFood === null ? (
                          <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                          ) : item.GrabFood === 3 ? (  
                            <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : (
                          <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        )}
                        {item.GrabFood === null ? 'No Analytics' : item.GrabFood === 3 ? 'Submitted' : 'Pending'}
                      </span>
                    </StyledTableCellSmall>
                    <StyledTableCellSmall 
                      style={{ 
                        width: '200px',
                        borderRadius: '10px',
                        textAlign: 'center', 
                        backgroundColor: item.PickARooMerch === null ? '#FFB5B5' : item.PickARooMerch === 3 ?  '#E3FBE3' : '#FFCF97',
                        color: item.PickARooMerch === null ? '#A85A5A' : item.PickARooMerch === 3 ? '#3F743F' : '#634422',
                      }}
                    >
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', }}>
                        {item.PickARooMerch === null ? (
                          <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                          ) : item.PickARooMerch === 3 ? (  
                            <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : (
                          <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        )}
                        {item.PickARooMerch === null ? 'No Analytics' : item.PickARooMerch === 3 ? 'Submitted' : 'Pending'}
                      </span>
                    </StyledTableCellSmall>
                    <StyledTableCellSmall 
                      style={{ 
                        width: '200px',
                        borderRadius: '10px',
                        textAlign: 'center', 
                        backgroundColor: item.PickARooFS === null ? '#FFB5B5' : item.PickARooFS === 3 ?  '#E3FBE3' : '#FFCF97',
                        color: item.PickARooFS === null ? '#A85A5A' : item.PickARooFS === 3 ? '#3F743F' : '#634422',
                      }}
                    >
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', }}>
                        {item.PickARooFS === null ? (
                          <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                          ) : item.PickARooFS === 3 ? (  
                            <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : (
                          <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        )}
                        {item.PickARooFS === null ? 'No Analytics' : item.PickARooFS === 3 ? 'Submitted' : 'Pending'}
                      </span>
                    </StyledTableCellSmall>
                    <StyledTableCellSmall 
                      style={{ 
                        width: '200px',
                        borderRadius: '10px',
                        textAlign: 'center', 
                        backgroundColor: item.FoodPanda === null ? '#FFB5B5' : item.FoodPanda === 3 ?  '#E3FBE3' : '#FFCF97',
                        color: item.FoodPanda === null ? '#A85A5A' : item.FoodPanda === 3 ? '#3F743F' : '#634422',
                      }}
                    >
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', }}>
                        {item.FoodPanda === null ? (
                          <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                          ) : item.FoodPanda === 3 ? (  
                            <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : (
                          <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        )}
                        {item.FoodPanda === null ? 'No Analytics' : item.FoodPanda === 3 ? 'Submitted' : 'Pending'}
                      </span>
                    </StyledTableCellSmall>
                    <StyledTableCellSmall 
                      style={{ 
                        width: '200px',
                        borderRadius: '10px',
                        textAlign: 'center', 
                        backgroundColor: item.MetroMart === null ? '#FFB5B5' : item.MetroMart === 3 ?  '#E3FBE3' : '#FFCF97',
                        color: item.MetroMart === null? '#A85A5A' : item.MetroMart === 3 ? '#3F743F' : '#634422',
                      }}
                    >
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', }}>
                        {item.MetroMart === null ? (
                          <ErrorIcon style={{ color: '#A85A5A', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                          ) : item.MetroMart === 3 ? (  
                            <CheckIcon style={{ color: '#3F743F', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        ) : (
                          <PendingIcon style={{ color: '#634422', fontSize: '15px', marginRight: '5px', verticalAlign: 'middle' }} />
                        )}
                        {item.MetroMart === null ? 'No Analytics' : item.MetroMart === 3 ? 'Submitted' : 'Pending'}
                      </span>
                    </StyledTableCellSmall>
                  </TableRow>
                ))
                ) : (
                  <TableRow
                  sx={{ 
                    "& td": { 
                      border: 0, 
                    }, 
                    '&:hover': {
                      backgroundColor: '#ffffff', 
                    },
                  }}>
                  <StyledTableCellSmall style={{ textAlign: 'center', width: '400px'  }}></StyledTableCellSmall>
                  <StyledTableCellSmall style={{ textAlign: 'center', width: '200px'  }}></StyledTableCellSmall>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      height="349px"
                      sx={{ backgroundColor: '#ffffff' }}
                    >
                      <CircularProgress size={80} />
                      <Typography variant="h6" color="textSecondary" sx={{ marginTop: '16px' }}>
                        Loading...
                      </Typography>
                    </Box>
                  <StyledTableCellSmall style={{ textAlign: 'center', width: '200px'  }}></StyledTableCellSmall>
                  <StyledTableCellSmall style={{ textAlign: 'center', width: '400px'  }}></StyledTableCellSmall>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </CustomScrollbarBox>
        </Paper>
        {/* <Snackbar
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
        </Snackbar> */}
      </Box>
    )
}

export default DashboardAccounting
