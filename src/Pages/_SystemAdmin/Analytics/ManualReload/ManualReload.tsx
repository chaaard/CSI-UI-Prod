import { Alert, Backdrop, Box, Chip, CircularProgress, Divider, Fade, FormControl, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Select, Snackbar, TextField, TextFieldProps, Typography, styled } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import ILocations from "../../../Common/Interface/ILocations";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios, { AxiosRequestConfig } from "axios";
import IRefreshAnalytics from "../../../Common/Interface/IRefreshAnalytics";
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import CustomerDropdown from "../../../../Components/Common/CustomerDropdown";
import ICustomerDropdown from "../../../Common/Interface/ICustomerDropdown";

const customerCodes = [
  { CustomerId: "9999011929", CustomerName: "Grab Food" },
  { CustomerId: "9999011955", CustomerName: "Grab Mart" },
  { CustomerId: "9999011931", CustomerName: "Pick A Roo Merchandise" },
  { CustomerId: "9999011935", CustomerName: "Pick A Roo FS" },
  { CustomerId: "9999011838", CustomerName: "Food Panda" },
  { CustomerId: "9999011855", CustomerName: "MetroMart" },
  { CustomerId: "9999011926", CustomerName: "GCash" },
];

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

interface ICustomerCodes
{
  CustomerId: string,
  CustomerName: string,
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const ManualReload = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem('club');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  //const [selected, setSelected] = useState<string>('9999011929');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(''); 
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [selectedLocationCodes, setSelectedLocationCodes] = useState<number[]>([]);
  const [selectedCustomerCodes, setSelectedCustomerCodes] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const getId = window.localStorage.getItem('Id');
  const [selected, setSelected] = useState<ICustomerDropdown[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<string[]>([] as string[]);
  const [finalSelected, setFinalSelected] = useState<string[]>([]);
  
  useEffect(() => {
    document.title = 'Maintenance | Manual Reload Analytics';
  }, []);

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  let club =  0;
  if(getClub !== null)
  {
    club = parseInt(getClub, 10);
  }

  let Id = "";
  if(getId !== null)
  {
    Id = getId;
  }

  useEffect(() => {
    const defaultDate = dayjs();
    const currentDate = dayjs();
    setSelectedDateFrom(defaultDate);
    setLoading(false)
  });

  useEffect(() => {
    console.log("selectedMerchant",selectedMerchant);
  }, [selectedMerchant]);

  const handleChange = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelected(sanitizedValue);
  };

  // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleMenuItemClick = (locationCode: number) => {
    setSelectedLocationCodes((prevSelected) => {
      if (prevSelected.includes(locationCode)) {
        // If the location is already selected, remove it
        return prevSelected.filter((code) => code !== locationCode);
      } else {
        // If the location is not selected, add it
        return [...prevSelected, locationCode];
      }
    });
  };

  const handleCustomerCodeClick = (customerCode: string) => {
    setSelectedCustomerCodes((prevSelected) => {
      if (prevSelected.includes(customerCode)) {
        // If the location is already selected, remove it
        return prevSelected.filter((code) => code !== customerCode);
      } else {
        // If the location is not selected, add it
        return [...prevSelected, customerCode];
      }
      console.log("test", prevSelected);
    });
  };

  const handleManualReloadClick = async () => {
    try {


      setRefreshing(true);
      const formattedDate = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const joinedLocationCodes = selectedLocationCodes.map(value => `${value}`).join(', ');
      //const joinedCustomerCodes = selectedCustomerCodes.map(value => `${value}`).join(', ');

      const locationCodesArray: number[] = joinedLocationCodes.split(',').map(Number);
      
      const customerCodesArray: string[] = selectedMerchant.map(String);
      console.log("customerCodesArray",customerCodesArray);
      //const customerCodesArray: string[] = selected.map(String);

      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: customerCodesArray,
        userId: Id,
        storeId: locationCodesArray, 
      }

      const refreshAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/ManualReload`,
        data: updatedParam,
      };

      axios(refreshAnalytics)
      .then(async () => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Success');
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error refreshing analytics');
        console.error("Error refreshing analytics:", error);
      })
      .finally(() => {
        setRefreshing(false); 
      });
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error refreshing analytics');
        console.error("Error refreshing analytics:", error);
        setRefreshing(false);
    } 
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
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Error fetching locations');
          })
      } catch (error) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error generating report');
      } 
    };
  
    fetchLocations();
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
          Reload Analytics
        </Typography>
        <Divider sx={{ marginBottom: '20px' }} />
        <Backdrop
          sx={{ color: '#ffffff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={refreshing}
          >
          <CircularProgress size="100px" sx={{ color: '#ffffff' }} />
        </Backdrop>
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
                        width: '335px',
                        fontSize: '14px'
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
          {/* <FormControl sx={{ width: 300 }}> */}
          
              <CustomerDropdown setSelected={setSelectedMerchant}  selection='multiple' byMerchant={false} isAllVisible={false}/>
              {/* <InputLabel>Merchants</InputLabel>
              <Select
                multiple
                value={selectedCustomerCodes}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Merchants" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((code) => {
                      const customer = customerCodes.find((loc) => loc.CustomerId === code);
                      return <Chip key={code} label={customer ? customer.CustomerName : code} sx={{ fontSize: '13px' }}/>;
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
                style={{
                  width: '400px',
                  borderRadius: '40px',
                  color: '#1C3766',
                  fontSize: '14px'
                }}
              >
                {customerCodes.map((item: ICustomerCodes) => (
                  <MenuItem
                    key={item.CustomerId}
                    value={item.CustomerId}
                    onClick={() => handleCustomerCodeClick(item.CustomerId)}
                    selected={selectedCustomerCodes.includes(item.CustomerId)}
                  >
                    {item.CustomerName}
                  </MenuItem>
                ))}
              </Select> */}
          {/* </FormControl> */}
          </Grid>
          <Grid item xs={11.1} sx={{ paddingTop: '15px' }}>
            <FormControl sx={{ width: 300 }}>
              <InputLabel size="small">Clubs</InputLabel>
              <Select
              size="small"
                multiple
                value={selectedLocationCodes}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Clubs" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((code) => {
                      const location = locations.find((loc) => loc.LocationCode === code);
                      return <Chip key={code} label={location ? location.LocationName : code} sx={{ fontSize: '13px' }}/>;
                    })}
                  </Box>
                )}
                MenuProps={MenuProps}
                style={{
                  width: '400px',
                  borderRadius: '40px',
                  color: '#1C3766',
                  fontSize: '14px'
                }}
              >
              {locations.map((location) => (
                  <MenuItem
                    key={location.Id}
                    value={location.LocationCode}
                    onClick={() => handleMenuItemClick(location.LocationCode)}
                    selected={selectedLocationCodes.includes(location.LocationCode)}
                  >
                    {`${location.LocationCode} - ${location.LocationName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3.1} sx={{ paddingTop: '15px' }}>
            <BootstrapButton
              sx={{
                color: "white",
                fontSize: "15px",
                backgroundColor: "#1C3766",
                width: "100%",
                borderRadius: "20px",
                fontFamily: 'Inter',
                fontWeight: '900',
                marginRight: '-10px'
              }}
              onClick={handleManualReloadClick}
            >
              <CachedRoundedIcon sx={{marginRight: '5px'}} />
              <Typography>
                Reload
              </Typography>
            </BootstrapButton>
          </Grid>
        </Grid>
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
    </Box>
  )
}

export default ManualReload