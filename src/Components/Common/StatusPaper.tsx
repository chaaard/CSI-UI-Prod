import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { WorkOffOutlined as WorkOffOutlinedIcon, PersonAddDisabledOutlined as PersonAddDisabledOutlinedIcon, ReportOffOutlined as ReportOffOutlinedIcon, CancelPresentationOutlined as CancelPresentationOutlinedIcon } from '@mui/icons-material';

interface StatusPaperProps {
  title: string,
  transactionCount: number,
  totalAmount: string,
  color: string,
  bgColor: string,
  borderColor: string,
}

const StatusPaper: React.FC<StatusPaperProps> = ({ title, transactionCount, totalAmount, color, bgColor, borderColor }) => {

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
                  <WorkOffOutlinedIcon 
                    sx={{ 
                      width: '60px', 
                      height: '60px', 
                      color: color, 
                      paddingLeft: '7px'
                    }} 
                  />
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
                    { transactionCount }
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
                    { totalAmount }
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
            </Grid>
            <Grid item>
              <Paper elevation={0} 
                sx={{
                  backgroundColor: bgColor,  
                  border: borderColor, 
                  width: '362px', 
                  borderRadius: '10px', 
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
                  <PersonAddDisabledOutlinedIcon 
                    sx={{ 
                      width: '60px', 
                      height: '60px', 
                      color: color, 
                    }} 
                  />
                  <Typography textAlign="center"
                    sx={{
                      fontSize: '10px',
                      marginTop: '-10px',
                      color: color, 
                      fontWeight: '700',
                    }}
                  >
                    Incorrect Customer
                  </Typography>
                  <Typography textAlign="center"
                    sx={{
                      fontSize: '10px',
                      paddingBottom: '10px',
                      color: color, 
                      fontWeight: '700',
                    }}
                  >
                    Number
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
                  { transactionCount }
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
                  { totalAmount }
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
            </Grid>
            <Grid item>
              <Paper elevation={0} 
                sx={{
                  backgroundColor: bgColor,  
                  border: borderColor, 
                  width: '362px', 
                  borderRadius: '10px', 
                  marginTop: '-2px' 
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
                  <ReportOffOutlinedIcon 
                    sx={{ 
                      width: '60px', 
                      height: '60px', 
                      color: color,  
                      paddingLeft: '7px'
                    }} 
                  />
                  <Typography textAlign="center"
                    sx={{
                      fontSize: '10px',
                      marginTop: '-10px',
                      color: color, 
                      fontWeight: '700',
                    }}
                  >
                    For Filing of
                  </Typography>
                  <Typography textAlign="center"
                    sx={{
                      fontSize: '10px',
                      paddingBottom: '10px',
                      color: color, 
                      fontWeight: '700',
                    }}
                  >
                    Dispute
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
                  { transactionCount }
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
                    { totalAmount }
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
            </Grid>
            <Grid item>
              <Paper elevation={0} 
                sx={{
                  backgroundColor: bgColor,  
                  border: borderColor, 
                  width: '362px', 
                  borderRadius: '10px', 
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
                  <CancelPresentationOutlinedIcon 
                    sx={{ 
                      width: '60px', 
                      height: '60px', 
                      color: color,  
                      paddingLeft: '7px'
                    }} 
                  />
                  <Typography textAlign="center"
                    sx={{
                      fontSize: '10px',
                      marginTop: '-10px',
                      color: color, 
                      fontWeight: '700',
                    }}
                  >
                    Valid Cancelled
                  </Typography>
                  <Typography textAlign="center"
                    sx={{
                      fontSize: '10px',
                      paddingBottom: '10px',
                      color: color, 
                      fontWeight: '700',
                    }}
                  >
                    Transactions
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
                    { transactionCount }
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
                    { totalAmount }
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
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default StatusPaper;