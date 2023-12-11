import { Box, CircularProgress, Pagination, Paper, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from "@mui/material";
import IException from "../../Pages/Common/Interface/IException";

interface ExceptionProps {
  exception: IException[];
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
        <Skeleton variant="rounded" height={70} />
      </Box>
    );
  };

const ExceptionsTable: React.FC<ExceptionProps> = ({ exception, loading }) => {
  if (!loading) {
    return (
      <Box style={{ position: 'relative' }}>
        <CustomScrollbarBox component={Paper}
          sx={{
            height: '180px',
            position: 'relative',
            paddingTop: '10px',
            borderRadius: '20px',
            boxShadow: 'inset 1px 6px 8px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)',
            backgroundColor: '#F2F2F2',
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
  
            }}
            aria-label="spanning table">
            <TableHead >
              <TableRow
                sx={{
                  "& th": { border: 0 },
                }}>
                <StyledTableCellHeader>Customer</StyledTableCellHeader>
                <StyledTableCellHeader>JO</StyledTableCellHeader>
                <StyledTableCellHeader>Transaction Date</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>Adjustment</StyledTableCellHeader>
                <StyledTableCellHeader>Status</StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
              {exception.length === 0 ? 
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
                exception.map((row) => (
                  <TableRow key={row.Id} sx={{ "& td": { border: 0 }}}>
                    <StyledTableCellBody>{row.CustomerId}</StyledTableCellBody>
                    <StyledTableCellBody>{row.JoNumber}</StyledTableCellBody>
                    <StyledTableCellBody>
                      {row.TransactionDate !== null
                        ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })
                        : ''}
                    </StyledTableCellBody>
                    <StyledTableCellBody>{row.Amount !== null ? row.Amount?.toFixed(2) : '0.00'}</StyledTableCellBody>
                    <StyledTableCellBody>{row.AdjustmentType}</StyledTableCellBody>
                    <StyledTableCellBody>{row.Status}</StyledTableCellBody>
                  </TableRow>
                ))
              )}
              </TableBody>
            </Table>
        </CustomScrollbarBox>
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

export default ExceptionsTable;