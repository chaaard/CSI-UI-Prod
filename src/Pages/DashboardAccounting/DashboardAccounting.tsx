import { Box, Divider, Grid, TextField, TextFieldProps, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';

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
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '16px',
        marginLeft: '16px',
        marginRight: '16px',
        flexWrap: 'wrap',
      }}
    >
    </Box>
  </CustomScrollbarBox>
  )
}

export default DashboardAccounting