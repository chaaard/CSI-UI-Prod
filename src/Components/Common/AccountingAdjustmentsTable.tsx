import { Box, CircularProgress, Paper, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from "@mui/material";
import IPortal from "../../Pages/Common/Interface/IPortal";
import IAccountingProoflist from "../../Pages/Common/Interface/IAccountingProoflist";
import IAccountingAdjustments from "../../Pages/Common/Interface/IAccountingAdjustments";
import IAccountingProoflistAdjustments from "../../Pages/Common/Interface/IAccountingProoflistAdjustments";

interface PortalProps {
  adjustments: IAccountingProoflistAdjustments[];
  loading: boolean;
  merchant?: string;
}

const StyledTableCellHeader = styled(TableCell)(() => ({
  padding: "8px 17px !important",
  fontSize: "14px",
  fontWeight: '900',
  color: '#1C2C5A',
  textAlign: 'center',
  width: '100px'
}));

const StyledTableCellBody = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "12px",
  color: '#1C2C5A',
  textAlign: 'left',
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

const AccountingAdjustmentsTable: React.FC<PortalProps> = ({ adjustments, loading, merchant }) => {

  // Calculate the total amount
  const grandTotal = adjustments.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const amount = portalItem.Amount || 0;
    return total + amount;
  }, 0);

  if (!loading) {
    return (
      <Box style={{ position: 'relative' }}>
        <CustomScrollbarBox component={Paper}
          sx={{
            height: '200px',
            position: 'relative',
            paddingTop: '10px',
            borderRadius: '20px',
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
                {
                merchant === 'GrabMart' || merchant === 'Grab Mart' || merchant === 'GrabFood' || merchant === 'Grab Food' ?
                (
                  <TableRow>
                    <StyledTableCellHeader>Store Name</StyledTableCellHeader>
                    <StyledTableCellHeader>Date</StyledTableCellHeader>
                    <StyledTableCellHeader>Customer </StyledTableCellHeader>
                    <StyledTableCellHeader>Order Number</StyledTableCellHeader>
                    <StyledTableCellHeader>Amount</StyledTableCellHeader>
                    <StyledTableCellHeader>Descriptions</StyledTableCellHeader>
                  </TableRow>
                )
                :
                merchant === 'PickARooFS' || merchant === 'PickARooMerch' || merchant === 'Pick A Roo - FS' || merchant === 'Pick A Roo - Merch' ?
                (
                  <TableRow>
                    <StyledTableCellHeader>Store Name</StyledTableCellHeader>
                    <StyledTableCellHeader>Date</StyledTableCellHeader>
                    <StyledTableCellHeader>Customer </StyledTableCellHeader>
                    <StyledTableCellHeader>Order Number</StyledTableCellHeader>
                    <StyledTableCellHeader>Amount</StyledTableCellHeader>
                  </TableRow>
                )
                :
                merchant === 'FoodPanda' || merchant === 'Food Panda' ?
                (
                  <TableRow>
                    <StyledTableCellHeader>Store Name</StyledTableCellHeader>
                    <StyledTableCellHeader>Date</StyledTableCellHeader>
                    <StyledTableCellHeader>Customer </StyledTableCellHeader>
                    <StyledTableCellHeader>Order Number</StyledTableCellHeader>
                    <StyledTableCellHeader>Amount</StyledTableCellHeader>
                  </TableRow>
                )
                :
                merchant === 'MetroMart' ?
                (
                  <TableRow>
                    <StyledTableCellHeader>Store Name</StyledTableCellHeader>
                    <StyledTableCellHeader>Date</StyledTableCellHeader>
                    <StyledTableCellHeader>Customer </StyledTableCellHeader>
                    <StyledTableCellHeader>Order Number</StyledTableCellHeader>
                    <StyledTableCellHeader>Amount</StyledTableCellHeader>
                  </TableRow>
                )
                :
                (
                  <TableRow></TableRow>
                )
                }
            </TableHead>
            <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
              {adjustments.length === 0 ? 
              (
                merchant === 'MetroMart' ?
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
                  <StyledTableCellBodyNoData>No data found</StyledTableCellBodyNoData>
                  <StyledTableCellBody1></StyledTableCellBody1>
                  <StyledTableCellBody1></StyledTableCellBody1>
                </TableRow> 
                ) : merchant === 'GrabMart' || merchant === 'Grab Mart' || merchant === 'GrabFood' || merchant === 'Grab Food'  ?
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
                  <StyledTableCellBodyNoData>No data found</StyledTableCellBodyNoData>
                  <StyledTableCellBody1></StyledTableCellBody1>
                  <StyledTableCellBody1></StyledTableCellBody1>
                </TableRow> 
                ) : merchant === 'FoodPanda' || merchant === 'Food Panda' ?
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
                  <StyledTableCellBodyNoData>No data found</StyledTableCellBodyNoData>
                  <StyledTableCellBody1></StyledTableCellBody1>
                  <StyledTableCellBody1></StyledTableCellBody1>
                </TableRow> 
                ) : merchant === 'PickARooFS' || merchant === 'PickARooMerch' || merchant === 'Pick A Roo - FS' || merchant === 'Pick A Roo - Merch' ?
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
                  <StyledTableCellBodyNoData>No data found</StyledTableCellBodyNoData>
                  <StyledTableCellBody1></StyledTableCellBody1>
                  <StyledTableCellBody1></StyledTableCellBody1>
                </TableRow> 
                ) :
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
                  <StyledTableCellBodyNoData>No data found</StyledTableCellBodyNoData>
                  <StyledTableCellBody1></StyledTableCellBody1>
                  <StyledTableCellBody1></StyledTableCellBody1>
                  <StyledTableCellBody1></StyledTableCellBody1>
                </TableRow> 
                )
              ) : (
                
                adjustments.map((row) => (
                  merchant && (
                    merchant === 'GrabMart' || merchant === 'Grab Mart' || merchant === 'GrabFood' || merchant === 'Grab Food' ? (
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
                      <StyledTableCellBody>{row.StoreName}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.TransactionDate !== null
                          ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                              year: 'numeric',
                              month: 'short', // or 'long' for full month name
                              day: 'numeric',
                            })
                          : ''}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{row.CustomerId}</StyledTableCellBody>
                      <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                      <StyledTableCellBody>{row.Amount !== null ? row.Amount?.toFixed(2) : 0.00}</StyledTableCellBody>
                      <StyledTableCellBody>{row.Descriptions}</StyledTableCellBody>
                      </TableRow>
                    ) : merchant === 'FoodPanda' || merchant === 'Food Panda' ?
                    (
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
                        <StyledTableCellBody>{row.StoreName}</StyledTableCellBody>
                        <StyledTableCellBody>
                          {row.TransactionDate !== null
                            ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                                year: 'numeric',
                                month: 'short', // or 'long' for full month name
                                day: 'numeric',
                              })
                            : ''}
                        </StyledTableCellBody>
                        <StyledTableCellBody>{row.CustomerId}</StyledTableCellBody>
                        <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                        <StyledTableCellBody>{row.Amount !== null ? row.Amount?.toFixed(2) : 0.00}</StyledTableCellBody>
                      </TableRow>
                    ) : merchant === 'PickARooFS' || merchant === 'PickARooMerch' || merchant === 'Pick A Roo - FS' || merchant === 'Pick A Roo - Merch' ?
                    (
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
                        <StyledTableCellBody>{row.StoreName}</StyledTableCellBody>
                        <StyledTableCellBody>
                          {row.TransactionDate !== null
                            ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                                year: 'numeric',
                                month: 'short', // or 'long' for full month name
                                day: 'numeric',
                              })
                            : ''}
                        </StyledTableCellBody>
                        <StyledTableCellBody>{row.CustomerId}</StyledTableCellBody>
                        <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                        <StyledTableCellBody>{row.Amount !== null ? row.Amount?.toFixed(2) : 0.00}</StyledTableCellBody>
                      </TableRow>
                    ) : merchant === 'MetroMart' ?
                    (
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
                        <StyledTableCellBody>{row.StoreName}</StyledTableCellBody>
                        <StyledTableCellBody>
                          {row.TransactionDate !== null
                            ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                                year: 'numeric',
                                month: 'short', // or 'long' for full month name
                                day: 'numeric',
                              })
                            : ''}
                        </StyledTableCellBody>
                        <StyledTableCellBody>{row.CustomerId}</StyledTableCellBody>
                        <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                        <StyledTableCellBody>{row.Amount !== null ? row.Amount?.toFixed(2) : 0.00}</StyledTableCellBody>
                      </TableRow>
                    )
                    :
                    (
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
                      </TableRow>
                    )
                ))
              )
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
                  "&th, td": { 
                    border: 0, 
                  }, 
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
              >
                
                <StyledTableCellSubHeader sx={{ width: grandTotal === 0 ? '820px' : '1010px' }}>TOTAL</StyledTableCellSubHeader>
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

export default AccountingAdjustmentsTable;