import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from "@mui/material";
import IAnalytics from "../../Pages/Common/Interface/IAnalytics";
interface AnalyticsProps {
  analytics?: IAnalytics[];
  loading?: boolean;
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
  },
  userSelect: 'none', // Disable text selection
  cursor: 'default', // Set the cursor style to default
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

const StyledTableCellBodyNoData = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "25px",
  color: '#1C2C5A',
  textAlign: 'center',
  fontWeight: '100',
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

const SalesTransactionTable: React.FC<AnalyticsProps> = ({ analytics, loading }) => {
  // Calculate the total amount
  const grandTotal = analytics?.reduce((total, analyticsItem) => {
    // Ensure that Amount is a number and not undefined or null
    const amount = analyticsItem.SubTotal || 0;
    return total + amount;
  }, 0);

  if (!loading) {
    return (
      <Box style={{ position: 'relative' }}>
        <CustomScrollbarBox component={Paper}
          sx={{
            height: '420px',
            position: 'relative',
            paddingTop: '10px',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            borderTopLeftRadius: '0',
            borderTopRightRadius: '0',
            boxShadow: 'none',
            margin: '0px 12px 2px 12px',
            backgroundColor: '#ffffff'
          }}
        >
          <Table
            sx={{
              minWidth: 700,
              "& th": {
                borderBottom: '2px solid #D9D9D9',
              },
              borderCollapse: 'separate',
              borderSpacing: '0px 4px',
              position: 'relative', // Add this line to make the container relative,
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
              <TableRow
              >
                <StyledTableCellHeader>Location</StyledTableCellHeader>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
                <StyledTableCellHeader>Account No.</StyledTableCellHeader>
                <StyledTableCellHeader>Membership No.</StyledTableCellHeader>
                <StyledTableCellHeader>Cashier No.</StyledTableCellHeader>
                <StyledTableCellHeader>Register No.</StyledTableCellHeader>
                <StyledTableCellHeader>TRX No.</StyledTableCellHeader>
                <StyledTableCellHeader>Order No.</StyledTableCellHeader>
                <StyledTableCellHeader>Qty</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>Invoice No.</StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
            {analytics?.length === 0 ? 
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
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBodyNoData>No data found</StyledTableCellBodyNoData>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                </TableRow> 
              ) : (
                analytics?.map((row) => (
                  <TableRow 
                    key={row.Id} 
                    sx={{ 
                      "& td": { 
                        border: 0, 
                      }, 
                      '&:hover': {
                        backgroundColor: '#ECEFF1', 
                      },
                    }}
                  >
                    <StyledTableCellBody>{row.LocationName}</StyledTableCellBody>
                    <StyledTableCellBody>
                      {row.TransactionDate !== null
                        ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: 'short', // or 'long' for full month name
                            day: 'numeric',
                          })
                        : ''
                      }
                    </StyledTableCellBody>
                    <StyledTableCellBody>{row.CustomerId}</StyledTableCellBody>
                    <StyledTableCellBody>{row.MembershipNo}</StyledTableCellBody>
                    <StyledTableCellBody>{row.CashierNo}</StyledTableCellBody>
                    <StyledTableCellBody>{row.RegisterNo}</StyledTableCellBody>
                    <StyledTableCellBody>{row.TransactionNo}</StyledTableCellBody>
                    <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                    <StyledTableCellBody>{row.Qty}</StyledTableCellBody>
                    <StyledTableCellBody>{row.SubTotal !== undefined ? row.SubTotal?.toFixed(2) : ''}</StyledTableCellBody>
                    <StyledTableCellBody>{row.InvoiceNo}</StyledTableCellBody>
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
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
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
                <StyledTableCellSubHeader sx={{ width: grandTotal === 0 ? '650px' : '950px' }}>TOTAL</StyledTableCellSubHeader>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1>{grandTotal?.toFixed(2)}</StyledTableCellBody1>
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
        height="100vh"
      >
        <CircularProgress size={80} />
        <Typography variant="h6" color="textSecondary" style={{ marginTop: '16px' }}>
          Loading...
        </Typography>
      </Box>
    );
  }
};

export default SalesTransactionTable;