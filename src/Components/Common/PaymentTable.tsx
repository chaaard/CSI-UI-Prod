import {
  Box,
  CircularProgress,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
} from "@mui/material";
import IPortal from "../../Pages/_Interface/IPortal";
import StyledScrollBox from "../ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellHeader from "../ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellNoData from "../ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellBody from "../ReusableComponents/TableComponents/StyledTableCellBody";
import StyledTableCellSubHeader from "../ReusableComponents/TableComponents/StyledTableCellSubHeader";

interface PortalProps {
  portal: IPortal[];
  loading: boolean;
  merchant?: string;
}

const PaymentTable: React.FC<PortalProps> = ({ portal, loading, merchant }) => {
  // Calculate the total amount
  const grandTotal = portal.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const amount = portalItem.Amount || 0;
    return total + amount;
  }, 0);

  return (
    <Box style={{ position: "relative" }}>
      <StyledScrollBox
        component={Paper}
        sx={{
          height: "630px",
          position: "relative",
          paddingTop: "10px",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          borderTopLeftRadius: "0",
          borderTopRightRadius: "0",
          boxShadow: "none",
          margin: "0px 12px 2px 12px",
        }}
      >
        <Table
          sx={{
            minWidth: 600,
            "& th": {
              borderBottom: "2px solid #D9D9D9",
            },
            borderCollapse: "separate",
            borderSpacing: "0px 4px",
            position: "relative", // Add this line to make the container relative
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
            {merchant === "GrabMart" || merchant === "Grab Mart" ? (
              <TableRow>
                <StyledTableCellHeader>Store Name</StyledTableCellHeader>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
                <StyledTableCellHeader>Status</StyledTableCellHeader>
                <StyledTableCellHeader>Order No</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
              </TableRow>
            ) : merchant === "MetroMart" ? (
              <TableRow>
                <StyledTableCellHeader>Order No</StyledTableCellHeader>
                <StyledTableCellHeader>Status</StyledTableCellHeader>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
                <StyledTableCellHeader>
                  Non membership fee
                </StyledTableCellHeader>
                <StyledTableCellHeader>Purchased amount</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
              </TableRow>
            ) : merchant === "GrabFood" || merchant === "Grab Food" ? (
              <TableRow>
                <StyledTableCellHeader>Store Name</StyledTableCellHeader>
                <StyledTableCellHeader>Date Created</StyledTableCellHeader>
                <StyledTableCellHeader>Status</StyledTableCellHeader>
                <StyledTableCellHeader>Order No</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
              </TableRow>
            ) : merchant === "FoodPanda" || merchant === "Food Panda" ? (
              <TableRow>
                <StyledTableCellHeader>Store Name</StyledTableCellHeader>
                <StyledTableCellHeader>Order No</StyledTableCellHeader>
                <StyledTableCellHeader>Status</StyledTableCellHeader>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
              </TableRow>
            ) : merchant === "PickARooFS" ||
              merchant === "PickARooMerch" ||
              merchant === "Pick A Roo - FS" ||
              merchant === "Pick A Roo - Merch" ? (
              <TableRow>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
                <StyledTableCellHeader>Order No</StyledTableCellHeader>
                <StyledTableCellHeader></StyledTableCellHeader>
                <StyledTableCellHeader>Status</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
              </TableRow>
            ) : (
              <TableRow></TableRow>
            )}
          </TableHead>
          <TableBody
            sx={{
              maxHeight: "calc(100% - 48px)",
              overflowY: "auto",
              position: "relative",
              height: '520px'
            }}
          >
            {loading ? (
              <TableRow sx={{ "& td": { border: 0 } }}>
                <StyledTableCellBody colSpan={12} align="center">
                  <CircularProgress size={80} />
                </StyledTableCellBody>
              </TableRow>
            ) : portal.length === 0 ? (
              <TableRow
                sx={{
                  "& td": {
                    border: 0,
                  },
                }}
              >
                <StyledTableCellNoData colSpan={12} align="center">
                  No data found
                </StyledTableCellNoData>
              </TableRow>
            ) : (
              portal.map(
                (row) =>
                  merchant &&
                  (merchant === "GrabMart" || merchant === "Grab Mart" ? (
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
                      <StyledTableCellBody>{row.StoreName}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.TransactionDate !== null
                          ? new Date(
                              row.TransactionDate ?? ""
                            ).toLocaleDateString("en-CA", {
                              year: "numeric",
                              month: "short", // or 'long' for full month name
                              day: "numeric",
                            })
                          : ""}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{row.Status}</StyledTableCellBody>
                      <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.Amount !== null ? row.Amount?.toFixed(2) : 0.0}
                      </StyledTableCellBody>
                    </TableRow>
                  ) : merchant === "GrabFood" || merchant === "Grab Food" ? (
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
                      <StyledTableCellBody>{row.StoreName}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.TransactionDate !== null
                          ? new Date(
                              row.TransactionDate ?? ""
                            ).toLocaleDateString("en-CA", {
                              year: "numeric",
                              month: "short", // or 'long' for full month name
                              day: "numeric",
                            })
                          : ""}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{row.Status}</StyledTableCellBody>
                      <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.Amount !== null ? row.Amount?.toFixed(2) : 0.0}
                      </StyledTableCellBody>
                    </TableRow>
                  ) : merchant === "FoodPanda" || merchant === "Food Panda" ? (
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
                      <StyledTableCellBody>{row.StoreName}</StyledTableCellBody>
                      <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                      <StyledTableCellBody>{row.Status}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.TransactionDate !== null
                          ? new Date(
                              row.TransactionDate ?? ""
                            ).toLocaleDateString("en-CA", {
                              year: "numeric",
                              month: "short", // or 'long' for full month name
                              day: "numeric",
                            })
                          : ""}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.Amount !== null ? row.Amount?.toFixed(2) : 0.0}
                      </StyledTableCellBody>
                    </TableRow>
                  ) : merchant === "PickARooFS" ||
                    merchant === "PickARooMerch" ||
                    merchant === "Pick A Roo - FS" ||
                    merchant === "Pick A Roo - Merch" ? (
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
                      <StyledTableCellBody>
                        {row.TransactionDate !== null
                          ? new Date(
                              row.TransactionDate ?? ""
                            ).toLocaleDateString("en-CA", {
                              year: "numeric",
                              month: "short", // or 'long' for full month name
                              day: "numeric",
                            })
                          : ""}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                      <StyledTableCellBody></StyledTableCellBody>
                      <StyledTableCellBody>{row.Status}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.Amount !== null ? row.Amount?.toFixed(2) : 0.0}
                      </StyledTableCellBody>
                    </TableRow>
                  ) : merchant === "MetroMart" ? (
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
                      <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                      <StyledTableCellBody>{row.Status}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.TransactionDate !== null
                          ? new Date(
                              row.TransactionDate ?? ""
                            ).toLocaleDateString("en-CA", {
                              year: "numeric",
                              month: "short", // or 'long' for full month name
                              day: "numeric",
                            })
                          : ""}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.NonMembershipFee !== null
                          ? row.NonMembershipFee?.toFixed(2)
                          : 0.0}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.PurchasedAmount !== null
                          ? row.PurchasedAmount?.toFixed(2)
                          : 0.0}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.Amount !== null ? row.Amount?.toFixed(2) : 0.0}
                      </StyledTableCellBody>
                    </TableRow>
                  ) : (
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
                    ></TableRow>
                  ))
              )
            )}
          </TableBody>
          <TableBody 
            sx={{
              zIndex: 3,
              position: "sticky",
              bottom: "0",
              backgroundColor: "#ffffff",
          }}>
            <TableRow
              sx={{
                "& td": {
                  border: 0,
                },
              }}
            >
              <StyledTableCellSubHeader>
                TOTAL
              </StyledTableCellSubHeader>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody>{grandTotal.toFixed(2)}</StyledTableCellBody>
            </TableRow>
          </TableBody>
        </Table>
      </StyledScrollBox>
    </Box>
  );
};

export default PaymentTable;