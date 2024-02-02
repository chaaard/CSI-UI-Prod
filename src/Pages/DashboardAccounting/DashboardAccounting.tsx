import { Box, Divider, Grid, TextField, TextFieldProps, Typography, styled } from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import PaperComponent from '../../Components/Common/PaperComponent';
import StatusPaper from '../../Components/Common/StatusPaper';
import IAnalyticProps from '../Common/Interface/IAnalyticsProps';
import ITransactionProps from '../Common/Interface/ITransactionProps';
import { useNavigate } from 'react-router-dom';
const CustomScrollbarBox = styled(Box)`
    overflow-y: auto;
    height: calc(100vh - 100px);

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

const DashboardAccounting = () => {
  useEffect(() => {
    document.title = 'CSI | Dashboard Accounting';
  }, []);

  return (
    <CustomScrollbarBox>
    <Box 
      sx={{
        marginTop: '16px',
        marginLeft: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <h1>Dashboard Accounting</h1>
      </LocalizationProvider>
    </Box>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '16px',
        marginLeft: '16px',
        marginRight: '16px',
        flexWrap: 'wrap',
      }}>
    </Box>
    <Divider 
      sx={{ 
        marginLeft: '16px', 
        marginRight: '16px',
        border: "1px solid #BBBBBB",
      }}>
    </Divider>
  </CustomScrollbarBox>
  )
}

export default DashboardAccounting