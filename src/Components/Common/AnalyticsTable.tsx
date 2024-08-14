import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import IAnalytics from "../../Pages/_Interface/IAnalytics";
import StyledScrollBox from "../ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellHeader from "../ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellSubHeader from "../ReusableComponents/TableComponents/StyledTableCellSubHeader";
import StyledTableCellBody from "../ReusableComponents/TableComponents/StyledTableCellBody";
import StyledTableCellNoData from "../ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellTotal from "../ReusableComponents/TableComponents/StyledTableCellTotal";
interface AnalyticsProps {
  analytics: IAnalytics[];
  loading: boolean;
}

const AnalyticsTable: React.FC<AnalyticsProps> = ({ analytics, loading }) => {
  // Calculate the total amount
  const grandTotal = analytics.reduce((total, analyticsItem) => {
    // Ensure that Amount is a number and not undefined or null
    const amount = analyticsItem.SubTotal || 0;
    return total + amount;
  }, 0);

  return (
    <Box style={{ position: "relative" }}>
      <StyledScrollBox
        component={Paper}
        sx={{
          height: "365px",
          position: "relative",
          paddingTop: "10px",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          borderTopLeftRadius: "0",
          borderTopRightRadius: "0",
          boxShadow: "none",
          paddingLeft: "20px",
          paddingRight: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        <Table
          sx={{
            minWidth: 700,
            "& th": {
              borderBottom: "2px solid #D9D9D9",
            },
            borderCollapse: "separate",
            borderSpacing: "0px 4px",
            position: "relative", // Add this line to make the container relative,
            backgroundColor: "#ffffff",
          }}
          aria-label="spanning table"
        >
          <TableHead
            sx={{
              zIndex: 3,
              position: "sticky",
              top: "-10px",
              backgroundColor: "#ffffff",
            }}
          >
            <TableRow>
              <StyledTableCellHeader>Location</StyledTableCellHeader>
              <StyledTableCellHeader>Date</StyledTableCellHeader>
              <StyledTableCellHeader>Account No.</StyledTableCellHeader>
              <StyledTableCellHeader>Membership No.</StyledTableCellHeader>
              <StyledTableCellHeader>Cashier No.</StyledTableCellHeader>
              <StyledTableCellHeader>Register No.</StyledTableCellHeader>
              <StyledTableCellHeader>TRX No.</StyledTableCellHeader>
              <StyledTableCellHeader>Order No.</StyledTableCellHeader>
              <StyledTableCellHeader>Qty</StyledTableCellHeader>
              <StyledTableCellHeader>Amount</StyledTableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              maxHeight: "calc(100% - 48px)",
              overflowY: "auto",
              position: "relative",
              height: '258px'
            }}
          >
            {loading ? (
              <TableRow sx={{ "& td": { border: 0 }}}>
                <TableCell colSpan={12} align="center">
                  <CircularProgress size={80} />
                </TableCell>
              </TableRow>
            ) : analytics?.length === 0 ? (
              <TableRow
                sx={{
                  "& td": {
                    border: 0,
                  },
                }}
              >
                <StyledTableCellNoData colSpan={13} align="center">
                  No data found
                </StyledTableCellNoData>
              </TableRow>
            ) : (
              analytics.map((row) => (
                <TableRow
                  key={row.Id}
                  sx={{
                    "& td": {
                      border: 0,
                    },
                    "&:hover": {
                      backgroundColor: "#ECEFF1",
                    },
                  }}
                >
                  <StyledTableCellBody>{row.LocationName}</StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.TransactionDate !== null
                      ? new Date(row.TransactionDate ?? "").toLocaleDateString(
                          "en-CA",
                          {
                            year: "numeric",
                            month: "short", // or 'long' for full month name
                            day: "numeric",
                          }
                        )
                      : ""}
                  </StyledTableCellBody>
                  <StyledTableCellBody>{row.CustomerId}</StyledTableCellBody>
                  <StyledTableCellBody>{row.MembershipNo}</StyledTableCellBody>
                  <StyledTableCellBody>{row.CashierNo}</StyledTableCellBody>
                  <StyledTableCellBody>{row.RegisterNo}</StyledTableCellBody>
                  <StyledTableCellBody>{row.TransactionNo}</StyledTableCellBody>
                  <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                  <StyledTableCellBody>{row.Qty}</StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.SubTotal !== undefined ? row.SubTotal?.toFixed(2) : ""}
                  </StyledTableCellBody>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableBody
            sx={{
              zIndex: 3,
              position: "sticky",
              bottom: "0",
              backgroundColor: "#ffffff",
            }}
          >
            <TableRow
              sx={{
                "&th": {
                  borderTop: "1px solid #D9D9D9",
                },
                "&th, td": {
                  border: 0,
                },
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              <StyledTableCellSubHeader>TOTAL</StyledTableCellSubHeader>
              <StyledTableCellTotal></StyledTableCellTotal>
              <StyledTableCellTotal></StyledTableCellTotal>
              <StyledTableCellTotal></StyledTableCellTotal>
              <StyledTableCellTotal></StyledTableCellTotal>
              <StyledTableCellTotal></StyledTableCellTotal>
              <StyledTableCellTotal></StyledTableCellTotal>
              <StyledTableCellTotal></StyledTableCellTotal>
              <StyledTableCellTotal></StyledTableCellTotal>
              <StyledTableCellTotal>{grandTotal.toFixed(2)}</StyledTableCellTotal>
            </TableRow>
          </TableBody>
        </Table>
      </StyledScrollBox>
    </Box>
  );
};

export default AnalyticsTable;