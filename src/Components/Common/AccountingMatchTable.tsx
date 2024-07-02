import { Box, CircularProgress, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from "@mui/material";
import IAnalytics from "../../Pages/Common/Interface/IAnalytics";
import IAccountingMatch from "../../Pages/Common/Interface/IAccountingMatch";
import EditIcon from '@mui/icons-material/Edit';
import AccountingAdjustmentTypeModal from "./AccountingAdjustmentTypeModal";
import { useState } from "react";
import IRefreshAnalytics from "../../Pages/Common/Interface/IRefreshAnalytics";
import IAnalyticProps from "../../Pages/Common/Interface/IAnalyticsProps";
interface AnalyticsProps {
  match?: IAccountingMatch[];
  loading?: boolean;
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
  },
  userSelect: 'none', // Disable text selection
  cursor: 'default', // Set the cursor style to default
}));

const StyledTableCellBodyStatus = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "12px",
  color: '#1C2C5A',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#98ACBB', // Change this color to the desired hover color
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

const BootstrapButton = styled(IconButton)(() => ({
  textTransform: 'none',
  fontSize: 12, 
  lineHeight: 1.5,
  color: '#1C2C5A',
  fontWeight: '900',
  fontFamily: 'Inter',
}));

const AccountingMatchTable: React.FC<AnalyticsProps> = ({ match, loading, setIsModalClose }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [accountingMatch, setAccountingMatch] = useState<IAccountingMatch>({} as IAccountingMatch);

  const grandTotal = match?.reduce((total, portalItem) => {
    const variance = portalItem.AnalyticsAmount || 0;
    return total + variance;
  }, 0);

  const analyticsTotal = match?.reduce((total, portalItem) => {
    const variance = portalItem.Variance || 0;
    return total + variance;
  }, 0);

  const prooflistTotal = match?.reduce((total, portalItem) => {
    const variance = portalItem.ProofListAmount || 0;
    return total + variance;
  }, 0);

  const getRoleId = window.localStorage.getItem('roleId');

  let roleId = 0;
  if(getRoleId !== null)
  {
    roleId = parseInt(getRoleId, 10);
  }

  const handleUpdateModalClick = (row: IAccountingMatch) => {
    setIsModalOpen(true);
    setAccountingMatch(row);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!loading) {
    return (
      <Box style={{ position: 'relative' }}>
        <CustomScrollbarBox component={Paper}
          sx={{
            height: '595px',
            position: 'relative',
            paddingTop: '10px',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            borderTopLeftRadius: '0',
            borderTopRightRadius: '0',
            boxShadow: 'none',
            margin: '0px 12px 2px 12px'
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
                <StyledTableCellHeader>Invoice No.</StyledTableCellHeader>
                <StyledTableCellHeader>Location</StyledTableCellHeader>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
                <StyledTableCellHeader>JO Number</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>Variance</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>JO Number</StyledTableCellHeader>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
                <StyledTableCellHeader>Location</StyledTableCellHeader>
                <StyledTableCellHeader>Status</StyledTableCellHeader>
                <StyledTableCellHeader>Action</StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
            {match?.length === 0 ? 
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
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBodyNoData>No data found</StyledTableCellBodyNoData>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
              </TableRow> 
            ):
            (
              match?.map((row, index) => (
                <TableRow 
                  key={`${row.MatchId}-${index}`}
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
                  <StyledTableCellBody >{row.AnalyticsInvoiceNo}</StyledTableCellBody>
                  <StyledTableCellBody >{row.AnalyticsLocation}</StyledTableCellBody>
                  <StyledTableCellBody >
                    {row.AnalyticsTransactionDate !== null
                      ? new Date(row.AnalyticsTransactionDate ?? '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short', // or 'long' for full month name
                          day: 'numeric',
                        })
                      : ''}
                  </StyledTableCellBody>
                  <StyledTableCellBody >{row.AnalyticsOrderNo}</StyledTableCellBody>
                  <StyledTableCellBody>{row.AnalyticsAmount !== null ? row.AnalyticsAmount?.toFixed(2) : '0.00'}</StyledTableCellBody>
                  <StyledTableCellBody sx={{ backgroundColor: '#FFB5B6', borderRadius: '10px', color: row.ProofListId == null ? '#C20000' : '#1C2C5A'}}>{row.Variance !== null ? row.Variance?.toFixed(2) : '0.00'}</StyledTableCellBody>
                  <StyledTableCellBody >{row.ProofListAmount !== null ? row.ProofListAmount?.toFixed(2) : '0.00'}</StyledTableCellBody>
                  <StyledTableCellBody >{row.ProofListOrderNo}</StyledTableCellBody>
                  <StyledTableCellBody >
                    {row.ProofListTransactionDate !== null
                      ? new Date(row.ProofListTransactionDate ?? '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short', // or 'long' for full month name
                          day: 'numeric',
                        })
                      : ''}
                  </StyledTableCellBody>
                  <StyledTableCellBody >{row.AnalyticsLocation}</StyledTableCellBody>
                  <StyledTableCellBodyStatus 
                    sx={{ 
                      color: row.Status != null ? '#FFFFFF' : '#1C2C5A',  
                      backgroundColor: 
                        row.Status === 'PAID' ? '#5C9275'  :  
                        row.Status === 'UNDERPAID' ? '#CDBE6A' : 
                        row.Status === 'OVERPAID' ? '#A865B9' : 
                        row.Status === 'NOT REPORTED' ? '#6568B9' : 
                        row.Status === 'UNPAID' ? '#B7763B' : 
                        row.Status === 'RE-TRANSACT' ? '#3BAFB7' : 
                        row.Status === 'ADJUSTMENTS' ? '#A82A2A' : 
                        row.Status === 'PAID W/AP' ? '#0FFA5D' :
                        row.Status === 'UNDERPAID W/AP' ? '#91C500' :
                        row.Status === 'OVERPAID W/AP' ? '#7241E4' :
                        row.Status === 'UNPAID W/AP' ? '#B4D440' :'inherit',
                      boxShadow: 'inset 0px 0px 10px rgba(0, 0, 0, 0.3)',
                      borderRadius: '10px',
                    }}>{row.Status}
                  </StyledTableCellBodyStatus>
                  {row.Status !== 'NOT REPORTED' && (
                    <StyledTableCellBody align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <BootstrapButton
                          onClick={() => {
                            handleUpdateModalClick(row);
                          }}
                          sx={{
                            backgroundColor: "#FCBA70",
                            width: '90px',
                            height: "20px",
                            borderRadius: "15px",
                            color:"#634422",
                            marginLeft: 0.5,
                            "&:hover": {
                              backgroundColor: "#FF9419",
                              color: '#FFFFFF',
                            },
                          }}
                        >
                          <EditIcon sx={{ fontSize: '15px', marginRight: '2px' }} /> Update
                        </BootstrapButton>
                      </Box>
                    </StyledTableCellBody>
                  )}
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
                <StyledTableCellSubHeader sx={{ width: '30px' }}>TOTAL</StyledTableCellSubHeader>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellBody1>{grandTotal?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{analyticsTotal?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1>{prooflistTotal?.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
              </TableRow>
            </TableBody> 
          </Table>
        </Box>
        <AccountingAdjustmentTypeModal open={isModalOpen} onClose={handleCloseModal} row={accountingMatch} setIsModalClose={setIsModalClose} />
      </Box>
    );
  } else { 
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="661px"
      >
        <CircularProgress size={80} />
        <Typography variant="h6" color="textSecondary" style={{ marginTop: '16px' }}>
          Loading...
        </Typography>
      </Box>
    );
  }
};

export default AccountingMatchTable;