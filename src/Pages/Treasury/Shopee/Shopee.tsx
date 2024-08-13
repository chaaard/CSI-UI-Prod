import { Box, Grid, Typography, TextField, Button, ButtonGroup, Divider, Fade, Alert, styled, Pagination, Snackbar, Backdrop, CircularProgress, CardContent, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import ModalComponent from '../../../Components/Common/ModalComponent';
import HeaderButtons from '../../../Components/Common/HeaderButtons';
import MatchTable from '../../../Components/Common/MatchTable';
import ExceptionsTable from '../../../Components/Common/ExceptionsTable';
import AnalyticsTable from '../../../Components/Common/AnalyticsTable';
import PortalTable from '../../../Components/Common/PortalTable';
import IAnalytics from '../../_Interface/IAnalytics';
import IPortal from '../../_Interface/IPortal';
import IMatch from '../../_Interface/IMatch';
import IException from '../../_Interface/IException';
import { AxiosRequestConfig } from 'axios';
import IAnalyticProps from '../../_Interface/IAnalyticsProps';
import IExceptionProps from '../../_Interface/IExceptionProps';
import dayjs, { Dayjs } from 'dayjs';
import IRefreshAnalytics from '../../_Interface/IRefreshAnalytics';
import IAdjustmentAddProps from '../../_Interface/IAdjustmentAddProps';
import Card from '@mui/material/Card';

const Shopee = () => {
  
  const getClub = window.localStorage.getItem('club');
  const getId = window.localStorage.getItem('Id');

  useEffect(() => {
    document.title = 'CSI | Shopee';
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

  return (
    <Box
      sx={{
        marginTop: '16px',
        marginLeft: '16px',
        flexGrow: 1
      }}
    >
      <Grid container spacing={1} alignItems="flex-start" direction={'row'}>
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
                    Shopee
                  </Typography>
                  <Box
                    sx={{
                      border: '2px solid #EE4E2E',
                      backgroundColor: '#F3F3F3',
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
                backgroundColor: '#FFFFFF', 
                boxShadow: '-7px 0px 8px -4px rgba(0,0,0,0.1),7px 0px 8px -4px rgba(0,0,0,0.1),0px 7px 8px -4px rgba(0,0,0,0.1)', 
                textAlign: 'center',
                borderBottomLeftRadius: '20px',
                borderBottomRightRadius: '20px',
                height: '700px',
                padding: 2,
                display: 'flex', 
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', gap: 0 , }}>
                <Card sx={{ border: 'none', boxShadow: 'none', margin: 0, padding: 0, borderRadius: '0', width: '40%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FEE5FF', borderRadius: '20px' }}>
                      <Typography sx={{ fontSize: '15px', color: '#1C2C5A', padding: 1, borderRadius: '25px', textAlign: 'left'}}>
                        Seller Center
                      </Typography>
                      <Button variant="contained" color="primary" sx={{ fontSize:'12px', marginRight: '10px',width: '10px', height: '25px', borderRadius: '20px' }}>
                        Upload
                      </Button>
                    </Box>
                    <Box sx={{ border: '1px solid #1C2C5A', borderRadius: '20px', margin: '10px 0px 0px 0px',  height: '570px',}}>
                      <Table >
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ textAlign: 'center' }}>Transaction Date</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Order No</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow sx={{ "& td": { border: 0 }}}>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  </CardContent>
                </Card>
                <Card sx={{ border: 'none', boxShadow: 'none', margin: 0, padding: 0, borderRadius: '0', width: '20%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFEBDC', borderRadius: '20px' }}>
                      <Typography sx={{ fontSize: '15px', color: '#1C2C5A', padding: 1, borderRadius: '25px', textAlign: 'left'}}>
                        OMS
                      </Typography>
                      <Button variant="contained" color="primary" sx={{ fontSize:'12px', marginRight: '10px',width: '10px', height: '25px', borderRadius: '20px' }}>
                        Refresh
                      </Button>
                    </Box>
                    <Box sx={{ border: '1px solid #1C2C5A', borderRadius: '20px', margin: '10px 0px 0px 0px',  height: '570px' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ textAlign: 'center' }}>Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow sx={{ "& td": { border: 0 }}}>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  </CardContent>
                </Card>
                <Card sx={{ border: 'none', boxShadow: 'none', margin: 0, padding: 0, borderRadius: '0', width: '20%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#D9E1FE', borderRadius: '20px' }}>
                      <Typography sx={{ fontSize: '15px', color: '#1C2C5A', padding: 1, borderRadius: '25px', textAlign: 'left'}}>
                        POS
                      </Typography>
                      <Button variant="contained" color="primary" sx={{ fontSize:'12px', marginRight: '10px',width: '10px', height: '25px', borderRadius: '20px' }}>
                        Refresh
                      </Button>
                    </Box>
                    <Box sx={{ border: '1px solid #1C2C5A', borderRadius: '20px', margin: '10px 0px 0px 0px',  height: '570px' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ textAlign: 'center' }}>Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow sx={{ "& td": { border: 0 }}}>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  </CardContent>
                </Card>
                <Card sx={{ border: 'none', boxShadow: 'none', margin: 0, padding: 0, borderRadius: '0', width: '20%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFA1A1', borderRadius: '20px' }}>
                      <Typography sx={{ fontSize: '15px', color: '#1C2C5A', padding: 1, borderRadius: '25px', textAlign: 'left'}}>
                        Variance
                      </Typography>
                      <Button variant="contained" color="primary" sx={{ fontSize:'12px', marginRight: '10px',width: '10px', height: '25px', borderRadius: '20px' }}>
                        Refresh
                      </Button>
                    </Box>
                    <Box sx={{ border: '1px solid #1C2C5A', borderRadius: '20px', margin: '10px 0px 0px 0px',  height: '570px' }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ textAlign: 'center' }}>Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow sx={{ "& td": { border: 0 }}}>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
              <Card sx={{ border: 0, boxShadow: 'none', marginTop: -3, borderRadius: '0', width: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #1C2C5A', }}>
                    <Typography sx={{ fontSize: '15px', color: '#1C2C5A', padding: 1, borderRadius: '25px', textAlign: 'left'}}>
                      Grand Total
                    </Typography>
                    <Typography sx={{ fontSize: '15px', color: '#1C2C5A', padding: 1, borderRadius: '25px', textAlign: 'left', marginRight: '10px'}}>
                      0.00
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Shopee
