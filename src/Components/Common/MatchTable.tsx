import { Alert, Box, CircularProgress, Fade, Paper, Skeleton, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, useMediaQuery } from "@mui/material";
import IMatch from "../../Pages/Common/Interface/IMatch";
import { useEffect, useState } from "react";
import AdjustmentTypeModal from "./AdjustmentTypeModal";
import theme from "../../Theme/Theme";

interface MatchProps {
  match: IMatch[];
  loading: boolean;
  setIsModalClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledTableCellHeader = styled(TableCell)(() => ({
  padding: "8px 17px !important",
  fontSize: "14px",
  fontWeight: '900',
  color: '#1C2C5A',
  textAlign: 'center',
}));

const StyledTableCellBody = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "12px",
  color: '#1C2C5A',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#E3F2FD', // Change this color to the desired hover color
  }
}));

const StyledTableCellBodyNoData = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "25px",
  color: '#1C2C5A',
  textAlign: 'center',
  fontWeight: '100',
}));

const StyledTableCellBody1 = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "12px",
  color: '#1C2C5A',
  textAlign: 'center',
}));

const StyledTableCellSubHeader = styled(TableCell)(() => ({
  fontSize: "12px",
  fontWeight: 'bold',
  color: '#1C2C5A',
  textAlign: 'left',
  padding: '10px !important'
}));

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

  // Define custom styles for white alerts
  const WhiteAlert = styled(Alert)(() => ({
    color: '#1C2C5A',
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: '15px',
    borderRadius: '25px',
    border:   '1px solid #B95000',
    backgroundColor:'#FFA968',
  }));

const MatchTable: React.FC<MatchProps> = ({ match, loading, setIsModalClose }) => {
    // Calculate the total amount
  const grandTotal = match.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const variance = portalItem.AnalyticsAmount || 0;
    return total + variance;
  }, 0);

   // Calculate the total amount
  const analyticsTotal = match.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const variance = portalItem.Variance || 0;
    return total + variance;
  }, 0);

   // Calculate the total amount
  const prooflistTotal = match.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const variance = portalItem.ProofListAmount || 0;
    return total + variance;
  }, 0);

  const getRoleId = window.localStorage.getItem('roleId');

  let roleId = 0;
  if(getRoleId !== null)
  {
    roleId = parseInt(getRoleId, 10);
  }

  
  const isExtraScreenSmall = useMediaQuery(theme.breakpoints.down(1367));
  const isExtraScreenSmall1440 = useMediaQuery(theme.breakpoints.down(1441));

  if (!loading) {
    return (
      <Box style={{ position: 'relative' }}>
        <CustomScrollbarBox component={Paper}
          sx={{
            height: '285px',
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
              minWidth: 700,
              tableLayout: 'fixed', // Set table layout to fixed
              "& th": {
                borderBottom: '2px solid #D9D9D9',
              },
              borderCollapse: 'separate',
              borderSpacing: '0px 4px',
              position: 'relative', // Add this line to make the container relative
              backgroundColor: '#ffffff',
            }}
            aria-label="spanning table">
            <TableHead
              sx={{
                zIndex: 3,
                position: 'sticky',
                top: '-10px',
                backgroundColor: '#ffffff',
              }}
            >
              <TableRow>
                <StyledTableCellHeader sx={{ width: '2px'}}></StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: isExtraScreenSmall ? '90px' : isExtraScreenSmall1440 ? '95px' : '175px'}}>Date</StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: isExtraScreenSmall ? '100px' : isExtraScreenSmall1440 ? '115px' :  '170px'}}>JO Number</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>Variance</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>JO Number</StyledTableCellHeader>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
            {match.length === 0 ? 
            (
              <TableRow  
                sx={{ 
                  "& td": { 
                    border: 0, 
                  }, 
                }}
              >
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBodyNoData>No data found</StyledTableCellBodyNoData>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
              </TableRow> 
            ):
            (
              match.map((row, index) => (
                <TableRow 
                  key={`${row.AnalyticsId}-${index}`}
                  // onDoubleClick={() => handleRowDoubleClick(row)}
                  sx={{ 
                    "& td": { 
                      border: 0, 
                    }, 
                    '&:hover': {
                      backgroundColor: '#ECEFF1', 
                    },
                  }}
                >
                  <StyledTableCellBody sx={{ width: '5px'}}>{index + 1}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ width: '90px', color: row.ProofListId == null ? '#C20000' : '#1C2C5A' }}>
                    {row.AnalyticsTransactionDate !== null
                      ? new Date(row.AnalyticsTransactionDate ?? '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short', // or 'long' for full month name
                          day: 'numeric',
                        })
                      : ''}
                  </StyledTableCellBody>
                  <StyledTableCellBody sx={{ width: '200px', color: row.ProofListId == null ? '#C20000' : '#1C2C5A' }}>{row.AnalyticsOrderNo}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ width: '235px', color: row.ProofListId == null ? '#C20000' : '#1C2C5A' }}>{row.AnalyticsAmount !== null ? row.AnalyticsAmount?.toFixed(2) : '0.00'}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ backgroundColor: '#FFB5B6', borderRadius: '10px', color: row.ProofListId == null ? '#C20000' : '#1C2C5A'}}>{row.Variance !== null ? row.Variance?.toFixed(2) : '0.00'}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ color: row.ProofListId == null ? '#C20000' : '#1C2C5A' }}>{row.ProofListAmount !== null ? row.ProofListAmount?.toFixed(2) : '0.00'}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ width: '200px', color: row.ProofListId == null ? '#C20000' : '#1C2C5A' }}>{row.ProofListOrderNo}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ width: '100px', color: row.ProofListId == null ? '#C20000' : '#1C2C5A' }}>
                    {row.ProofListTransactionDate !== null
                      ? new Date(row.ProofListTransactionDate ?? '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short', // or 'long' for full month name
                          day: 'numeric',
                        })
                      : ''}
                  </StyledTableCellBody>
                </TableRow>
                ))
            )}
            </TableBody> 
          </Table>
        </CustomScrollbarBox>
        <Box 
          sx={{
            paddingLeft: '20px',
            paddingRight: '20px',
          }}>
          <Table
            sx={{
              "& th": {
                borderBottom: '1px solid #D9D9D9',
              },
              position: 'sticky', zIndex: 1, bottom: 0,
            }}>
            <TableHead>
              <TableRow>
                <StyledTableCellHeader sx={{ width: '1px' }}></StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: isExtraScreenSmall ? '130px' : '160px' }}></StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: isExtraScreenSmall ? '150px' : '160px' }}></StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: isExtraScreenSmall ? '130px' :'160px' }}></StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: isExtraScreenSmall ? '140px' : '179px' }}></StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: isExtraScreenSmall ? '150px' : '179px' }}></StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: '179px' }}></StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: '179px' }}></StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody >
              <TableRow
                sx={{ 
                  "&th": { 
                    borderTop: '1px solid #D9D9D9',
                  }, 
                  "&th, td": { 
                    border: 0, 
                  }, 
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
              >
                <StyledTableCellSubHeader sx={{ width: '30px' }}>TOTAL</StyledTableCellSubHeader>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1>{grandTotal.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{analyticsTotal.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{prooflistTotal.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
              </TableRow>
            </TableBody> 
          </Table>
        </Box>
      </Box>
    );
  } else { 
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="349px"
      >
        <CircularProgress size={80} />
        <Typography variant="h6" color="textSecondary" style={{ marginTop: '16px' }}>
          Loading...
        </Typography>
      </Box>
    );
  }
};

export default MatchTable;