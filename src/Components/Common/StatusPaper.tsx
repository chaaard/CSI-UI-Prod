import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { WorkOffOutlined as WorkOffOutlinedIcon, PersonAddDisabledOutlined as PersonAddDisabledOutlinedIcon, ReportOffOutlined as ReportOffOutlinedIcon, CancelPresentationOutlined as CancelPresentationOutlinedIcon } from '@mui/icons-material';
import ITransactionProps from "../../Pages/Common/Interface/ITransactionProps";
import { fetchTotalAmountTransactions } from "../Functions/GetTotalAmountTransactions";
import TransactionsPaper from "./TransactionsPaper";

interface StatusPaperProps {
  title: string,
  color: string,
  bgColor: string,
  borderColor: string,
  transactionProps: ITransactionProps,
}

const StatusPaper: React.FC<StatusPaperProps> = ({ title, color, bgColor, borderColor, transactionProps }) => {
  return (
    <Box 
      sx={{
        '& > :not(style)': {
          marginLeft: '10px',
          marginRight: '10px',
          marginTop: '10px',
          width: 760,
          height: 300,
          borderRadius: 5,
        },
      }}
    >
      <Paper elevation={0}>
        <Grid container alignItems="center" justifyContent="center">
          <Box 
            sx={{ 
            height: '25px',
            width: '100%', 
            backgroundColor: bgColor, 
            borderRadius: '10px', 
            marginBottom: '10px',
            marginTop: '10px',
            marginLeft: '10px',
            marginRight: '10px',
            textAlign: 'center', 
            border: borderColor,  
            }}
          > 
            <Typography 
              sx={{ 
                fontSize: '15px', 
                color: color, 
                fontWeight: '900',
              }}
            >
            { title } 
            </Typography>
          </Box>
        </Grid>
        <Grid container alignItems="center" justifyContent="center" spacing={1}>
          <Grid item>
            <TransactionsPaper 
              color={color}
              bgColor={bgColor}
              borderColor={borderColor}
              transactionProps={transactionProps}
              actionId={1}
              icon={<WorkOffOutlinedIcon sx={{ width: '60px', height: '60px', color: '#404862', paddingLeft: '7px' }} />}
            />
          </Grid>
          <Grid item>
            <TransactionsPaper 
              color={color}
              bgColor={bgColor}
              borderColor={borderColor}
              transactionProps={transactionProps}
              actionId={2}
              icon={<PersonAddDisabledOutlinedIcon sx={{ width: '60px', height: '60px', color: '#404862', paddingLeft: '7px' }} />}
            />
          </Grid>
          <Grid item>
            <TransactionsPaper 
              color={color}
              bgColor={bgColor}
              borderColor={borderColor}
              transactionProps={transactionProps}
              actionId={3}
              icon={<ReportOffOutlinedIcon sx={{ width: '60px', height: '60px', color: '#404862', paddingLeft: '7px' }} />}
            />
          </Grid>
          <Grid item>
            <TransactionsPaper 
              color={color}
              bgColor={bgColor}
              borderColor={borderColor}
              transactionProps={transactionProps}
              actionId={4}
              icon={<CancelPresentationOutlinedIcon sx={{ width: '60px', height: '60px', color: '#404862', paddingLeft: '7px' }} />}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default StatusPaper;