import { Box, CircularProgress, Paper, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from "@mui/material";
import IPortal from "../../Pages/Common/Interface/IPortal";
import { useEffect, useState } from "react";

interface PortalProps {
  portal: IPortal[];
  loading: boolean;
  merchant?: string;
  totalSum?: number
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
  cursor: 'default', // Set the cursor style to default
}));

const StyledTableCellBody1 = styled(TableCell)(() => ({
  padding: "1px 17px",
  fontSize: "12px",
  color: '#1C2C5A',
  textAlign: 'left',
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

const PortalTable: React.FC<PortalProps> = ({ portal, loading, merchant, totalSum }) => {

  // Calculate the total amount
  const grandTotal = portal.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const amount = portalItem.Amount || 0;
    return total + amount;
  }, 0);

  const [totals, setTotals] = useState({
    grandTotal: 0,
    grossCommission: 0,
    netOfVat: 0,
    inputVat: 0,
    ewt: 0,
    netPaid: 0
  });

  useEffect(() => {
    let grandTotal = 0;
    let grossCommission = 0;
    let netOfVat = 0;
    let inputVat = 0;
    let ewt = 0;
    let netPaid = 0;

    portal.forEach(row => {
      const amount = row.Amount ?? 0;
      const grossCommissionValue = merchant === 'Pick A Roo - Merch' ? -(amount * 0.06) : 
                                    merchant === 'Pick A Roo - FS' ? -(amount * 0.1568) : 
                                    merchant === 'Food Panda' ? -(amount * 0.1792) : 
                                    merchant === 'GrabMart' || merchant === 'Grab Mart' ? -(amount * 0.05) :
                                    merchant === 'GrabFood' || merchant === 'Grab Food' ? -(amount * 0.12) : 0;
      const netOfVatValue = grossCommissionValue / 1.12;
      const inputVatValue = netOfVatValue * 0.12;
      const ewtValue = -netOfVatValue * 0.02;
      const netPaidValue = amount + netOfVatValue + inputVatValue + ewtValue;

      grandTotal += amount;
      grossCommission += grossCommissionValue;
      netOfVat += netOfVatValue;
      inputVat += inputVatValue;
      ewt += ewtValue;
      netPaid += netPaidValue;
    });

     console.log(grandTotal)
    setTotals({
      grandTotal,
      grossCommission,
      netOfVat,
      inputVat,
      ewt,
      netPaid
    });

   
  }, [portal]);

  if (!loading) {
    return (
      <Box style={{ position: 'relative' }}>
        <CustomScrollbarBox component={Paper}
          sx={{
            height: '315px',
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
                  merchant === 'Pick A Roo - Merch' ?
                (
                  <TableRow>
                    <StyledTableCellHeader>Store Name</StyledTableCellHeader>
                    <StyledTableCellHeader>Date</StyledTableCellHeader>
                    <StyledTableCellHeader>Customer </StyledTableCellHeader>
                    <StyledTableCellHeader>Order Number</StyledTableCellHeader>
                    <StyledTableCellHeader>Non Membership Fee</StyledTableCellHeader>
                    <StyledTableCellHeader>Purchased Amount</StyledTableCellHeader>
                    <StyledTableCellHeader>Amount</StyledTableCellHeader>
                    <StyledTableCellHeader>Gross Commission</StyledTableCellHeader>
                    <StyledTableCellHeader>Net Of VAT</StyledTableCellHeader>
                    <StyledTableCellHeader>12% Input VAT</StyledTableCellHeader>
                    <StyledTableCellHeader>EWT</StyledTableCellHeader>
                    <StyledTableCellHeader>Net Paid</StyledTableCellHeader>
                  </TableRow>
                )
                : merchant === 'MetroMart' ?
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
                  <TableRow>
                    <StyledTableCellHeader>Store Name</StyledTableCellHeader>
                    <StyledTableCellHeader>Date</StyledTableCellHeader>
                    <StyledTableCellHeader>Customer </StyledTableCellHeader>
                    <StyledTableCellHeader>Order Number</StyledTableCellHeader>
                    <StyledTableCellHeader>Amount</StyledTableCellHeader>
                    <StyledTableCellHeader>Gross Commission</StyledTableCellHeader>
                    <StyledTableCellHeader>Net Of VAT</StyledTableCellHeader>
                    <StyledTableCellHeader>12% Input VAT</StyledTableCellHeader>
                    <StyledTableCellHeader>EWT</StyledTableCellHeader>
                    <StyledTableCellHeader>Net Paid</StyledTableCellHeader>
                  </TableRow>
                )
                }
            </TableHead>
          <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
            {portal.length === 0 ? 
            (
              merchant === 'Pick A Roo - Merch'  ?
              (
                <TableRow sx={{ "& td": { border: 0 } }}>
                  <StyledTableCellBody1></StyledTableCellBody1>
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
              ) : merchant !== 'MetroMart' ?
              (
                <TableRow sx={{ "& td": { border: 0 } }}>
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
              )
              :
              (
                <TableRow sx={{ "& td": { border: 0 } }}>
                  <StyledTableCellBody1></StyledTableCellBody1>
                  <StyledTableCellBody1></StyledTableCellBody1>
                  <StyledTableCellBodyNoData>No data found</StyledTableCellBodyNoData>
                  <StyledTableCellBody1></StyledTableCellBody1>
                  <StyledTableCellBody1></StyledTableCellBody1>
                </TableRow>
              )
            ) : (
              portal.map((row) => {
                if (!merchant) return null;

                  const amount = row.Amount ?? 0;
                  const GrossCommission = merchant === 'Pick A Roo - Merch' ? -(amount * 0.06).toFixed(2) : 
                    merchant === 'Pick A Roo - FS' ? -(amount * 0.1568).toFixed(2) : 
                    merchant === 'Food Panda' ? -(amount * 0.1792).toFixed(2) : 
                    merchant === 'GrabMart' || merchant === 'Grab Mart' ? -(amount * 0.05).toFixed(2) :
                    merchant === 'GrabFood' || merchant === 'Grab Food' ? -(amount * 0.12).toFixed(2) : 0 ;
                  const NetOfVat = (GrossCommission / 1.12).toFixed(2);
                  const InputVat = (parseFloat(NetOfVat) * 0.12).toFixed(2);
                  const EWT = -(parseFloat(NetOfVat) * 0.02).toFixed(2);
                  const NetPaid = (
                    parseFloat(row.Amount?.toString() ?? '0') +
                    parseFloat(NetOfVat) +
                    parseFloat(InputVat) +
                    EWT
                  ).toFixed(2);

                if (merchant === 'Pick A Roo - Merch' ) {
                  return (
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
                      <StyledTableCellBody>{row.NonMembershipFee?.toFixed(2) ?? '0.00'}</StyledTableCellBody>
                      <StyledTableCellBody>{row.PurchasedAmount?.toFixed(2) ?? '0.00'}</StyledTableCellBody>
                      <StyledTableCellBody>{row.Amount?.toFixed(2) ?? '0.00'}</StyledTableCellBody>
                      <StyledTableCellBody>{GrossCommission}</StyledTableCellBody>
                      <StyledTableCellBody>{NetOfVat}</StyledTableCellBody>
                      <StyledTableCellBody>{InputVat}</StyledTableCellBody>
                      <StyledTableCellBody>{EWT}</StyledTableCellBody>
                      <StyledTableCellBody>{NetPaid}</StyledTableCellBody>
                    </TableRow>
                  );
                } else if(merchant === 'MetroMart')
                {
                  return (
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
                      <StyledTableCellBody>{row.Amount?.toFixed(2) ?? '0.00'}</StyledTableCellBody>
                    </TableRow>
                  );
                } else  {
                  return (
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
                      <StyledTableCellBody>{row.Amount?.toFixed(2) ?? '0.00'}</StyledTableCellBody>
                      <StyledTableCellBody>{GrossCommission}</StyledTableCellBody>
                      <StyledTableCellBody>{NetOfVat}</StyledTableCellBody>
                      <StyledTableCellBody>{InputVat}</StyledTableCellBody>
                      <StyledTableCellBody>{EWT}</StyledTableCellBody>
                      <StyledTableCellBody>{NetPaid}</StyledTableCellBody>
                    </TableRow>
                  );
                } 
              })
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
              {
                  merchant === 'Pick A Roo - Merch' ?
                (
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
                
                <StyledTableCellSubHeader sx={{ width: grandTotal === 0 ? '820px' : '700px' }}>TOTAL</StyledTableCellSubHeader>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1>{grandTotal?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{totals.grossCommission?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{totals.netOfVat?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{totals.inputVat?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{totals.ewt?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{totals.netPaid?.toFixed(2)}</StyledTableCellBody1>
              </TableRow>
                ) : merchant === 'MetroMart' ?
                (
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
                
                <StyledTableCellSubHeader sx={{ width: grandTotal === 0 ? '820px' : '700px' }}>TOTAL</StyledTableCellSubHeader>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1>{grandTotal?.toFixed(2)}</StyledTableCellBody1>
              </TableRow>
                )
                :
                (
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
                
                <StyledTableCellSubHeader sx={{ width: grandTotal === 0 ? '820px' : '700px' }}>TOTAL</StyledTableCellSubHeader>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1>{grandTotal?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{totals.grossCommission?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{totals.netOfVat?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{totals.inputVat?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{totals.ewt?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{totals.netPaid?.toFixed(2)}</StyledTableCellBody1>
              </TableRow>
                )
              }
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