import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, styled } from "@mui/material";

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

  function createRow(refnumber: string, date: string, customercode: string, customername: string, amount: number) {
    return { refnumber, date, customercode, customername, amount};
  }
  const rows = [
    createRow('9999990009', '2023-09-19', '309', 'Richard', 100.00),
    createRow('9999990009', '2023-09-19', '309', 'Richard', 100.00),
    createRow('9999990009', '2023-09-19', '309', 'Richard', 100.00),
    createRow('9999990009', '2023-09-19', '309', 'Richard', 100.00),
    createRow('9999990009', '2023-09-19', '309', 'Richard', 100.00),
    createRow('9999990009', '2023-09-19', '309', 'Richard', 100.00),
  ];

const ReferenceTable = () => {
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
          }}
          aria-label="spanning table">
          <TableHead>
            <TableRow>
              <StyledTableCellHeader>Reference Number</StyledTableCellHeader>
              <StyledTableCellHeader>Date</StyledTableCellHeader>
              <StyledTableCellHeader>Customer Code</StyledTableCellHeader>
              <StyledTableCellHeader>Customer Name</StyledTableCellHeader>
              <StyledTableCellHeader>Amount</StyledTableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
            {rows.map((row, index) => (
            <TableRow key={index} 
              sx={{ 
                "& td": { 
                  border: 0, 
                }, 
              }}
            >
              <StyledTableCellBody>{row.refnumber}</StyledTableCellBody>
              <StyledTableCellBody>{row.date}</StyledTableCellBody>
              <StyledTableCellBody>{row.customercode}</StyledTableCellBody>
              <StyledTableCellBody>{row.customername}</StyledTableCellBody>
              <StyledTableCellBody>{row.amount}</StyledTableCellBody>
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
              <StyledTableCellSubHeader sx={{ width: '860px' }}>SUBTOTAL</StyledTableCellSubHeader>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellSubBody>0.00</StyledTableCellSubBody>
            </TableRow>
            <TableRow
              sx={{ 
                "&th, td": { 
                  border: 0, 
                }, 
              }}
            >
              <StyledTableCellSubHeader sx={{ width: '180px' }}>GRANDTOTAL</StyledTableCellSubHeader>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellSubBody>0.00</StyledTableCellSubBody>
            </TableRow>
          </TableBody> 
        </Table>
      </Box>
    </Box>
  );
};

export default ReferenceTable;