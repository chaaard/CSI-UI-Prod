import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from "@mui/material";
import IAccountingMatchPayment from "../../Pages/Common/Interface/IAccountingMatchPayment";
import { useState } from "react";

interface AnalyticsProps {
  matchPayment?: IAccountingMatchPayment[];
  loading?: boolean;
  selectedRow: React.Dispatch<React.SetStateAction<IAccountingMatchPayment | null>>;
}

const StyledTableCellHeader = styled(TableCell)(() => ({
  padding: "2px 17px !important",
  fontSize: "12px",
  fontWeight: '900',
  color: '#1C2C5A',
  textAlign: 'center',
}));

const StyledTableCellBody = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "10px",
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
  fontSize: "10px",
  color: '#1C2C5A',
  textAlign: 'center',
}));

const StyledTableCellBodyNoData = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "12px",
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

const AccountingMatchPaymentTable: React.FC<AnalyticsProps> = ({ matchPayment, loading, selectedRow }) => {
  const [selectedMatchRow, setSelectedMatchRow] = useState<IAccountingMatchPayment | null>(null);

  const handleRowClick = (row: IAccountingMatchPayment) => {
    setSelectedMatchRow(prevSelectedRow => (prevSelectedRow === row ? null : row));
    selectedRow(prevSelectedRow => (prevSelectedRow === row ? null : row))
  };

  const getRoleId = window.localStorage.getItem('roleId');

  let roleId = 0;
  if (getRoleId !== null) {
    roleId = parseInt(getRoleId, 10);
  }

  if (!loading) {
    return (
      <Box style={{ position: 'relative' }}>
        <CustomScrollbarBox component={Paper}
          sx={{
            height: '100px',
            position: 'relative',
            paddingTop: '10px',
            borderRadius: '20px',
            boxShadow: 'none',
            width: '100%'
          }}
        >
          <Table
            sx={{
              minWidth: 300,
              tableLayout: 'fixed', // Set table layout to fixed
              "& th": {
                borderBottom: '2px solid #D9D9D9',
              },
              borderCollapse: 'separate',
              position: 'relative', // Add this line to make the container relative
              backgroundColor: '#ffffff',
            }}
            aria-label="spanning table">
            <TableHead
              sx={{
                zIndex: 3,
                position: 'sticky',
                backgroundColor: '#ffffff',
              }}
            >
              <TableRow>
                <StyledTableCellHeader>Status</StyledTableCellHeader>
                <StyledTableCellHeader>Transaction Date</StyledTableCellHeader>
                <StyledTableCellHeader>Order No</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>Location</StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
              {matchPayment?.length === 0 ? (
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
              ) : (
                matchPayment?.map((row, index) => (
                  <TableRow
                    key={`${row.MatchId}-${index}`}
                    onClick={() => handleRowClick(row)}
                    sx={{
                      "& td": {
                        border: 0,
                      },
                      backgroundColor: selectedMatchRow === row ? '#E0F7FA' : 'transparent', 
                      '&:hover': {
                        backgroundColor: '#ECEFF1',
                      },
                    }}
                  >
                    <StyledTableCellBody>{row.Status}</StyledTableCellBody>
                    <StyledTableCellBody>
                      {row.TransactionDate !== null
                        ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short', // or 'long' for full month name
                          day: 'numeric',
                        })
                        : ''}
                    </StyledTableCellBody>
                    <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                    <StyledTableCellBody>{row.Amount !== null ? row.Amount?.toFixed(2) : '0.00'}</StyledTableCellBody>
                    <StyledTableCellBody>{row.Location}</StyledTableCellBody>
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

export default AccountingMatchPaymentTable;
