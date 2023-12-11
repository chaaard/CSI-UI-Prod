import { Box, CircularProgress, Paper, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from "@mui/material";
import IPortal from "../../Pages/Common/Interface/IPortal";

interface PortalProps {
  portal: IPortal[];
  loading: boolean;
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
  fontSize: "12px",
  color: '#1C2C5A',
  textAlign: 'center',
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

const SkeletonComponent = () => {
  return (
    <Box>
      <Skeleton variant="text" animation="wave" />
      <Skeleton variant="text" animation="wave" />
      <Skeleton variant="text" animation="wave" />
      <Skeleton variant="rounded" height={170} />
    </Box>
  );
};

const PortalTable: React.FC<PortalProps> = ({ portal, loading }) => {

  // Calculate the total amount
  const grandTotal = portal.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const amount = portalItem.Amount || 0;
    return total + amount;
  }, 0);

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
                <StyledTableCellHeader>JO Number</StyledTableCellHeader>
                <StyledTableCellHeader>Status</StyledTableCellHeader>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
                <StyledTableCellHeader>Non-Membership Fee</StyledTableCellHeader>
                <StyledTableCellHeader>Purchased Amount</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
              {portal.length === 0 ? 
              (
                <TableRow  
                sx={{ 
                  "& td": { 
                    border: 0, 
                  }, 
                }}
                >
                  <StyledTableCellBodyNoData>
                    <SkeletonComponent />
                  </StyledTableCellBodyNoData>

                  <StyledTableCellBodyNoData>
                    <SkeletonComponent />
                  </StyledTableCellBodyNoData>

                  <StyledTableCellBodyNoData>
                    <SkeletonComponent />
                  </StyledTableCellBodyNoData>

                  <StyledTableCellBodyNoData>
                    <SkeletonComponent />
                  </StyledTableCellBodyNoData>

                  <StyledTableCellBodyNoData>
                    <SkeletonComponent />
                  </StyledTableCellBodyNoData>

                  <StyledTableCellBodyNoData>
                    <SkeletonComponent />
                  </StyledTableCellBodyNoData>
                </TableRow> 
              ) : (
                portal.map((row) => (
                  <TableRow key={row.Id} 
                    sx={{ 
                      "& td": { 
                        border: 0, 
                      }, 
                      '&:hover': {
                        backgroundColor: '#ECEFF1', 
                      },
                    }}
                  >
                    <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                    <StyledTableCellBody>{row.Status}</StyledTableCellBody>
                    <StyledTableCellBody>
                      {row.TransactionDate !== null
                        ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })
                        : ''}
                    </StyledTableCellBody>
                    <StyledTableCellBody>{row.NonMembershipFee !== null ? row.NonMembershipFee?.toFixed(2) : 0.00}</StyledTableCellBody>
                    <StyledTableCellBody>{row.PurchasedAmount !== null ? row.PurchasedAmount?.toFixed(2) : 0.00}</StyledTableCellBody>
                    <StyledTableCellBody>{row.Amount !== null ? row.Amount?.toFixed(2) : 0.00}</StyledTableCellBody>
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
              </TableRow>
            </TableHead>
            <TableBody >
              <TableRow
                sx={{ 
                  "&th": { 
                    borderTop: '1px solid #D9D9D9',
                  }, 
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
              >
                
                <StyledTableCellSubHeader sx={{ width: grandTotal === 0 ? '820px' : '1010px' }}>SUBTOTAL</StyledTableCellSubHeader>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1>{grandTotal.toFixed(2)}</StyledTableCellBody1>
              </TableRow>
              <TableRow
                sx={{ 
                  "&th, td": { 
                    border: 0, 
                  }, 
                }}
              >
                <StyledTableCellSubHeader sx={{ width: '180px' }}>GRANDTOTAL</StyledTableCellSubHeader>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1>{grandTotal.toFixed(2)}</StyledTableCellBody1>
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

export default PortalTable;