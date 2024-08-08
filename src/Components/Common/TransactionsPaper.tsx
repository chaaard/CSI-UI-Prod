import { Box, Divider, Paper, Typography } from "@mui/material";
import React, { ReactNode, } from "react";
import ITransactions from "../../Pages/_Interface/ITransaction";

interface TransactionPaperProps {
  color: string,
  bgColor: string,
  borderColor: string,
  amountCount: ITransactions
  icon: ReactNode; 
  title1: string,
  title2: string,
}

const TransactionsPaper: React.FC<TransactionPaperProps> = ({ color, bgColor, borderColor, amountCount, icon, title1, title2 }) => {
  return (
    <Box>
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
                {title1}
              </Typography>
              <Typography textAlign="center"
                sx={{
                  fontSize: '10px',
                  color: color, 
                  paddingBottom: '10px',
                  fontWeight: '700',
                }}
              >
                {title2}
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
                  amountCount?.Count !== null && amountCount?.Count !== undefined
                    ? amountCount?.Count
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
                  amountCount?.Amount !== null && amountCount?.Amount !== undefined
                    ? amountCount?.Amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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