import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from "@mui/material";
import IMatch from "../../Pages/Common/Interface/IMatch";

interface MatchProps {
  match: IMatch[];
  loading: boolean;
}

interface StyledTypographyProps {
  color: string;
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
}));

const StyledTableCellSubHeader = styled(TableCell)(() => ({
  fontSize: "12px",
  fontWeight: 'bold',
  color: '#1C2C5A',
  textAlign: 'left',
  padding: '10px !important'
}));

const StyledTableCellSubBody = styled(TableCell)(() => ({
  fontSize: "12px",
  color: '#1C2C5A',
  textAlign: 'center',
  padding: "1px 14px",
  fontWeight: 'bold',
}));

const StyledTableCellTypography = styled(Typography)<StyledTypographyProps>((props) => ({
  textTransform: 'none',
  fontSize: 14,
  border: '1px solid',
  lineHeight: 1.5,
  color: '#1C2C5A',
  borderRadius: '20px',
  borderColor: props.color,
  fontWeight: '900',
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

const MatchTable: React.FC<MatchProps> = ({ match, loading }) => {
    // Calculate the total amount
  const grandTotal = match.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const variance = portalItem.Variance || 0;
    return total + variance;
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
                <StyledTableCellHeader>Date</StyledTableCellHeader>
                <StyledTableCellHeader>JO Number</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>Variance</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>JO Number</StyledTableCellHeader>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
              {match.map((row) => (
              <TableRow key={row.AnalyticsId} 
                sx={{ 
                  "& td": { 
                    border: 0, 
                  }, 
                }}
              >
                <StyledTableCellBody>
                  {row.AnalyticsTransactionDate !== null
                    ? new Date(row.AnalyticsTransactionDate ?? '').toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })
                    : ''}
                </StyledTableCellBody>
                <StyledTableCellBody>{row.AnalyticsOrderNo}</StyledTableCellBody>
                <StyledTableCellBody>{row.AnalyticsAmount !== null ? row.AnalyticsAmount?.toFixed(2) : 0.00}</StyledTableCellBody>
                <StyledTableCellBody sx={{backgroundColor: '#FFB5B6', borderRadius: '10px'}}>{row.Variance !== null ? row.Variance?.toFixed(2) : 0.00}</StyledTableCellBody>
                <StyledTableCellBody>{row.ProofListAmount !== null ? row.ProofListAmount?.toFixed(2) : 0.00}</StyledTableCellBody>
                <StyledTableCellBody>{row.ProofListOrderNo}</StyledTableCellBody>
                <StyledTableCellBody>
                  {row.ProofListTransactionDate !== null
                    ? new Date(row.ProofListTransactionDate ?? '').toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })
                    : ''}
                </StyledTableCellBody>
              </TableRow>
              ))}
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
                <StyledTableCellSubHeader sx={{ width: grandTotal === 0 ? '180px' : '160px' }}>SUBTOTAL</StyledTableCellSubHeader>
                <StyledTableCellBody></StyledTableCellBody>
                <StyledTableCellBody></StyledTableCellBody>
                <StyledTableCellSubBody>{grandTotal.toFixed(2)}</StyledTableCellSubBody>
                <StyledTableCellBody></StyledTableCellBody>
                <StyledTableCellBody></StyledTableCellBody>
                <StyledTableCellBody></StyledTableCellBody>
              </TableRow>
              <TableRow
                sx={{ 
                  "&th, td": { 
                    border: 0, 
                  }, 
                }}
              >
                <StyledTableCellSubHeader sx={{ width: grandTotal === 0 ? '180px' : '150px' }}>GRANDTOTAL</StyledTableCellSubHeader>
                <StyledTableCellBody></StyledTableCellBody>
                <StyledTableCellBody></StyledTableCellBody>
                <StyledTableCellSubBody>{grandTotal.toFixed(2)}</StyledTableCellSubBody>
                <StyledTableCellBody></StyledTableCellBody>
                <StyledTableCellBody></StyledTableCellBody>
                <StyledTableCellBody></StyledTableCellBody>
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

export default MatchTable;