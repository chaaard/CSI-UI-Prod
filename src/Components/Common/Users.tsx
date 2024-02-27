import { Alert, Autocomplete, Box,  Fade, Grid, IconButton, MenuItem, Pagination,  Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, TextFieldProps, Typography, styled, } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import IAnalytics from '../../Pages/Common/Interface/IAnalytics';
import axios, { AxiosRequestConfig } from 'axios';
import IAnalyticsToDeleteProps from '../../Pages/Common/Interface/IAnalyticsToDeleteProps';
import dayjs, { Dayjs } from 'dayjs';
import ILocations from '../../Pages/Common/Interface/ILocations';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ModalComponent from './ModalComponent';

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

const customerCodes: ICustomerCodes[] = [
  { CustomerId: ["9999011929","9999011955", "9999011931", "9999011935", "9999011838", "9999011855", "9999011926"], CustomerName: "All" },
  { CustomerId: ["9999011929"], CustomerName: "Grab Food" },
  { CustomerId: ["9999011955"], CustomerName: "Grab Mart" },
  { CustomerId: ["9999011931"], CustomerName: "Pick A Roo Merchandise" },
  { CustomerId: ["9999011935"], CustomerName: "Pick A Roo FS" },
  { CustomerId: ["9999011838"], CustomerName: "Food Panda" },
  { CustomerId: ["9999011855"], CustomerName: "MetroMart" },
  { CustomerId: ["9999011926"], CustomerName: "GCash" },
];

interface ICustomerCodes
{
  CustomerId: string[],
  CustomerName: string,
}

interface IUpdateMerchant
{
  Id: number,
  CustomerId: string,
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

const Users = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [isModalOpenLogout, setIsModalOpenLogout] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [pageCount, setPageCount] = useState<number>(0); 
  const [page, setPage] = useState<number>(1);
  const [merchant, setMerchant] = useState<string>('');
  const itemsPerPage = 20; 

  useEffect(() => {
    document.title = 'CSI | Users';
  }, []);

  
  // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleCloseLogout = useCallback(() => {
    setIsModalOpenLogout(false);
  }, []);


  const handleLogoutModalClick = (id: number) => {
    setIsModalOpenLogout(true);
      setId(id);
  };


  // const fetchUsers = useCallback(async () => {
  //   try {
  //     const getAnalytics: AxiosRequestConfig = {
  //       method: 'POST',
  //       url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAnalyticsToDelete`,
  //     };
  
  //     const response = await axios(getAnalytics);
  //     setAnalytics(response.data.Item1);
  //     console.log(response.data.Item1);
  //     setPageCount(response.data.Item2);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } 
  // }, [REACT_APP_API_ENDPOINT]);

  // useEffect(() => {
  //   if(formattedDateFrom && selected && selectedLocation && jo)
  //   {
  //     setAnalytics([]);
  //     setPageCount(0);
  //     fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, page, itemsPerPage);
  //   }
  // }, [REACT_APP_API_ENDPOINT, formattedDateFrom, selected, selectedLocation, jo, fetchAnalytics]);

  // const handleLogoutClick = () => {
  //   try {

  //     var update: IUpdateMerchant = {
  //       Id: id,
  //       CustomerId: merchant
  //     }

  //     const generateInvoice: AxiosRequestConfig = {
  //       method: 'PUT',
  //       url: `${REACT_APP_API_ENDPOINT}/Analytics/UpdateAnalytics`,
  //       data: update,
  //     };

  //     axios(generateInvoice)
  //     .then((result) => {
  //       if(result.data === true)
  //       {
  //         setIsSnackbarOpen(true);
  //         setSnackbarSeverity('success');
  //         setMessage('Successfully updated!');
  //         setIsModalOpenUpdate(false); 
  //         fetchAnalytics(formattedDateFrom, selected, selectedLocation, jo, page, itemsPerPage);
  //       }
  //       else
  //       {
  //         setIsSnackbarOpen(true);
  //         setSnackbarSeverity('error');
  //         setMessage('Error updating analytic');
  //         setIsModalOpenUpdate(false);
  //       }
  //     })
  //     .catch((error) => {
  //       setIsSnackbarOpen(true);
  //       setSnackbarSeverity('error');
  //       setMessage('Error updating analytic');
  //       setIsModalOpenUpdate(false);
  //     })
  //   } catch (error) {
  //       setIsSnackbarOpen(true);
  //       setSnackbarSeverity('error');
  //       setMessage('Error updating invoice');
  //       setIsModalOpenUpdate(false);
  //   } 
  // };

  return (
    <Box
      sx={{
        marginTop: '16px',
        marginLeft: '20px',
        marginRight: '20px',
        flexGrow: 1,
      }}
    >
      {/* <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Id</StyledTableCell>
            <StyledTableCell>Username</StyledTableCell>
            <StyledTableCell>Employee Number</StyledTableCell>
            <StyledTableCell>First Name</StyledTableCell>
            <StyledTableCell>Last Name</StyledTableCell>
            <StyledTableCell>Club</StyledTableCell>
            <StyledTableCell>Role</StyledTableCell>
            <StyledTableCell>Login Status</StyledTableCell>
            <StyledTableCell>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <StyledTableCellSmall>{row.id}</StyledTableCellSmall>
              <StyledTableCellSmall>{row.username}</StyledTableCellSmall>
              <StyledTableCellSmall>{row.employeeNumber}</StyledTableCellSmall>
              <StyledTableCellSmall>{row.firstName}</StyledTableCellSmall>
              <StyledTableCellSmall>{row.lastName}</StyledTableCellSmall>
              <StyledTableCellSmall>{row.club}</StyledTableCellSmall>
              <StyledTableCellSmall>{row.role}</StyledTableCellSmall>
              <StyledTableCellSmall>{row.loginStatus}</StyledTableCellSmall>
              
              <StyledTableCellSmall>
                {row.loginStatus === 1 && (
                  <BootstrapButton
                    onClick={() => {
                      handleLogoutModalClick(row.Id);
                    }}
                    sx={{
                      backgroundColor: "#FFB5B5",
                      width: '90px',
                      height: "20px",
                      borderRadius: "15px",
                      marginLeft: 0.5,
                      "&:hover": {
                        backgroundColor: "#FF7171",
                      },
                    }}
                  >
                    Logout
                  </BootstrapButton>
                )}
              </StyledTableCellSmall>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
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
        title='Logout User Analytics'
        onClose={handleCloseLogout}
        buttonName='Logout'
        open={isModalOpenLogout}
        onSave={handleLogoutClick}
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
                  Are you sure you want to Logout this user?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        } 
      /> */}
    </Box>
  )
}

export default Users