import { Alert, Box, CircularProgress, Fade, Paper, Skeleton, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from "@mui/material";
import IMatch from "../../Pages/Common/Interface/IMatch";
import { useState } from "react";
import AdjustmentTypeModal from "./AdjustmentTypeModal";

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
  },
  userSelect: 'none', // Disable text selection
  cursor: 'pointer', // Set the cursor style to default
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
    const variance = portalItem.Variance || 0;
    return total + variance;
  }, 0);

  const [selectedRow, setSelectedRow] = useState<IMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const getRoleId = window.localStorage.getItem('roleId');

  let roleId = 0;
  if(getRoleId !== null)
  {
    roleId = parseInt(getRoleId, 10);
  }

  // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleRowDoubleClick = (row: IMatch) => {
    if (roleId === 1) {
      return;
    }
    
    if(row.AnalyticsId !== null)
    {
      setSelectedRow(row);
      setIsModalOpen(true);
    }
    else
    {
      setIsSnackbarOpen(true);
      setSnackbarSeverity('error');
      setMessage('No analytics found');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
                <StyledTableCellHeader sx={{ width: '100px' }}>Date</StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: '235px' }}>JO Number</StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: '200px' }}>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>Variance</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: '200px' }}>JO Number</StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: '100px' }}>Date</StyledTableCellHeader>
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
                <StyledTableCellBodyNoData>No data found</StyledTableCellBodyNoData>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
              </TableRow> 
            ):
            (
              match.map((row) => (
                <TableRow 
                  key={row.AnalyticsId} 
                  onDoubleClick={() => handleRowDoubleClick(row)}
                  sx={{ 
                    "& td": { 
                      border: 0, 
                    }, 
                    '&:hover': {
                      backgroundColor: '#ECEFF1', 
                    },
                  }}
                >
                  <StyledTableCellBody sx={{ width: '100px', color: row.ProofListId == null ? '#C20000' : '#1C2C5A' }}>
                    {row.AnalyticsTransactionDate !== null
                      ? new Date(row.AnalyticsTransactionDate ?? '').toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
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
                      ? new Date(row.ProofListTransactionDate ?? '').toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
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
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
              >
                <StyledTableCellSubHeader sx={{ width: grandTotal === 0 ?  '180px' : '160px' }}>SUBTOTAL</StyledTableCellSubHeader>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1>{grandTotal.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
              </TableRow>
              <TableRow
                sx={{ 
                  "&th, td": { 
                    border: 0, 
                  }, 
                }}
              >
                <StyledTableCellSubHeader sx={{ width: grandTotal === 0 ? '180px' : '150px' }}>GRANDTOTAL</StyledTableCellSubHeader>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1>{grandTotal.toFixed(2)}</StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
              </TableRow>
            </TableBody> 
          </Table>
        </Box>
        <AdjustmentTypeModal open={isModalOpen} onClose={handleCloseModal} rowData={selectedRow} setIsModalClose={setIsModalClose} />
        <Snackbar
            open={isSnackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            TransitionComponent={Fade} 
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
          <WhiteAlert  variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {message}
          </WhiteAlert>
        </Snackbar>
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

export default MatchTable;