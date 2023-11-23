import { Box, Pagination, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from "@mui/material";

interface ExceptionsTableProps {
  handleOpenModal: () => void;
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

  function createRow(customer: string | null, jo: string | null, transactionDate: string | null, amount: number | null, adjustment: string | null, status: string | null) {
    return { customer, jo, transactionDate, amount, adjustment, status };
  }

  const rows = [
    createRow('LAZADA', '9999990009', '2023-09-19', 0.00, 'For Filing Dispute', 'Pending'),
    createRow('LAZADA', '9999990009', '2023-09-19', 0.00, 'Incorrect JO Number', 'Pending'),
    createRow('LAZADA', '9999990009', '2023-09-19', 0.00, 'Incorrect Partner/Merchant', 'Pending'),
    createRow('LAZADA', '9999990009', '2023-09-19', 0.00, 'Valid Cancelled Transaction', 'Pending'),
    
    
  ];
  interface Row {
    dateAnalytics: string;
    joNumberAnalytics: string;
    amountAnalytics: number;
    variance: number;
    amountPortal: number;
    joNumberPortal: string;
    datePortal: string;
  }

const ExceptionsTable = () => {
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
            {rows.map((row, index) => (
            <TableRow key={index} sx={{ "& td": { border: 0 }}}>
              <StyledTableCellBody>{row.customer}</StyledTableCellBody>
              <StyledTableCellBody>{row.jo}</StyledTableCellBody>
              <StyledTableCellBody>{row.transactionDate}</StyledTableCellBody>
              <StyledTableCellBody>{row.amount}</StyledTableCellBody>
              <StyledTableCellBody>{row.adjustment}</StyledTableCellBody>
              <StyledTableCellBody>{row.status}</StyledTableCellBody>
            </TableRow>
            ))}
            </TableBody>
          </Table>
      </CustomScrollbarBox>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
        <Pagination
          variant="outlined"
          shape="rounded"
          count={10}
          page={1}
          // onChange={(event, value) => {
          //   setPage(value);
          //   fetchCustomerCodes(value, itemsPerPage, searchQuery, columnToSort, orderBy);
          // }}
        />
      </Box>
    </Box>
  );
};

export default ExceptionsTable;