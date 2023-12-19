import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { WorkOffOutlined as WorkOffOutlinedIcon, PersonAddDisabledOutlined as PersonAddDisabledOutlinedIcon, ReportOffOutlined as ReportOffOutlinedIcon, CancelPresentationOutlined as CancelPresentationOutlinedIcon } from '@mui/icons-material';
import ITransactionProps from "../../Pages/Common/Interface/ITransactionProps";
import { fetchTotalAmountTransactions } from "../Functions/GetTotalAmountTransactions";
import ITransactions from "../../Pages/Common/Interface/ITransaction";

interface TransactionPaperProps {
  color: string,
  bgColor: string,
  borderColor: string,
  transactionProps: ITransactionProps,
  actionId: number,
  icon: ReactNode; 
}

const TransactionsPaper: React.FC<TransactionPaperProps> = ({ color, bgColor, borderColor, transactionProps, actionId, icon }) => {
  const [transactions, setTransactions] = useState<ITransactions>();

  const updateTotal = useCallback(async (transactionParams: ITransactionProps) => {
    try {
      const result = await fetchTotalAmountTransactions(transactionParams);
      setTransactions(result);
    } catch (error) {
      // Handle error
      console.error("Error fetching transactions:", error);
    }
  }, []);

  useEffect(() => {
    const updatedTransactionParams: ITransactionProps = {
      dates: transactionProps.dates,
      memCode: transactionProps.memCode,
      storeId: transactionProps.storeId,
      statusId: transactionProps.statusId,
      actionId: actionId
    }
    updateTotal(updatedTransactionParams);
  }, [updateTotal, transactionProps]);

  return (
    <Box 

    >
      <Paper elevation={0}>
        <Paper elevation={0} 
          sx={{
            backgroundColor: bgColor,   
            border: borderColor, 
            width: '362px', 
            borderRadius: '10px' , 
            marginTop: '-5px' 
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 'fit-content',
              borderRadius: 1,
              '& svg': {
                m: 1.5,
              },
              '& hr': {
                mx: 0.5,
              },
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                paddingLeft: '8px', 
              }}
            >
              {icon}
              <Typography textAlign="center"
                sx={{
                  fontSize: '10px',
                  marginTop: '-10px',
                  color: color, 
                  fontWeight: '700',
                }}
              >
                Incorrect Job
              </Typography>
              <Typography textAlign="center"
                sx={{
                  fontSize: '10px',
                  paddingBottom: '10px',
                  color: color, 
                  fontWeight: '700',
                }}
              >
                Order
              </Typography>
            </Box>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'left', 
                paddingLeft: '8px', 
              }}
            >
              <Typography textAlign="left"
                sx={{
                  fontSize: '30px',
                  color: color, 
                  fontWeight: '700',
                }}
              >
                {
                  transactions?.Count !== null && transactions?.Count !== undefined
                    ? transactions.Count
                    : '0'
                }
              </Typography>
              <Typography textAlign="left"
                sx={{
                  fontSize: '12px',
                  fontStyle: 'italic',
                  color: color, 
                  fontWeight: '550',
                  marginTop: '-10px',
                }}
              >
                Transaction Count
              </Typography>
              <Typography textAlign="left"
                sx={{
                  fontSize: '30px',
                  color: color, 
                  fontWeight: '700',
                  marginTop: '-5px',
                }}
              >
                {
                  transactions?.Amount !== null && transactions?.Amount !== undefined
                    ? transactions.Amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : '0.00'
                }
              </Typography>
              <Typography textAlign="left"
                sx={{
                  fontSize: '12px',
                  fontStyle: 'italic',
                  color: color, 
                  fontWeight: '550',
                  marginTop: '-10px',
                }}
              >
                Total Amount
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Paper>
    </Box>
  );
};

export default TransactionsPaper;