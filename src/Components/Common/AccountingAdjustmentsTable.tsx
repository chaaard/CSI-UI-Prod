import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import IAccountingProoflistAdjustments from "../../Pages/_Interface/IAccountingProoflistAdjustments";
import { useEffect, useState } from "react";
import StyledScrollBox from "../ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellHeader from "../ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellNoData from "../ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellBody from "../ReusableComponents/TableComponents/StyledTableCellBody";
import StyledTableCellSubHeader from "../ReusableComponents/TableComponents/StyledTableCellSubHeader";

interface PortalProps {
  adjustments: IAccountingProoflistAdjustments[];
  loading: boolean;
  merchant?: string;
  totalSum?: number;
}

const AccountingAdjustmentsTable: React.FC<PortalProps> = ({
  adjustments,
  loading,
  merchant,
  totalSum,
}) => {
  const [grandTotalSum, setGrandTotalSum] = useState<number>(0);
  // Calculate the total amount
  const grandTotal = adjustments.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const amount = portalItem.Amount || 0;
    return total + amount;
  }, 0);

  useEffect(() => {
    if (totalSum !== undefined) {
      if (merchant === "FoodPanda" || merchant === "Food Panda") {
        if (grandTotal < 0) {
          setGrandTotalSum(totalSum + grandTotal);
        } else {
          setGrandTotalSum(totalSum - grandTotal);
        }
      } else {
        setGrandTotalSum(totalSum + grandTotal);
      }
    }
  }, [grandTotal, merchant, totalSum]);

  return (
    <Box style={{ position: "relative" }}>
      <StyledScrollBox
        component={Paper}
        sx={{
          height: "200px",
          position: "relative",
          paddingTop: "10px",
          borderRadius: "20px",
          boxShadow: "none",
          paddingLeft: "20px",
          paddingRight: "20px",
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
            {merchant === "GrabMart" ||
            merchant === "Grab Mart" ||
            merchant === "GrabFood" ||
            merchant === "Grab Food" ? (
              <TableRow>
                <StyledTableCellHeader>Store Name</StyledTableCellHeader>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
                <StyledTableCellHeader>Customer </StyledTableCellHeader>
                <StyledTableCellHeader>Order Number</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>Descriptions</StyledTableCellHeader>
              </TableRow>
            ) : (
              <TableRow>
                <StyledTableCellHeader>Store Name</StyledTableCellHeader>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
                <StyledTableCellHeader>Customer </StyledTableCellHeader>
                <StyledTableCellHeader>Order Number</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
              </TableRow>
            )}
          </TableHead>
          <TableBody
            sx={{
              maxHeight: "calc(100% - 48px)",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {loading ? (
              <TableRow sx={{ "& td": { border: 0 } }}>
                <StyledTableCellBody colSpan={12} align="center">
                  <CircularProgress size={80} />
                </StyledTableCellBody>
              </TableRow>
            ) : adjustments.length === 0 ? (
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
              adjustments.map(
                (row) =>
                  merchant &&
                  (merchant === "GrabMart" ||
                  merchant === "Grab Mart" ||
                  merchant === "GrabFood" ||
                  merchant === "Grab Food" ? (
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
                      <StyledTableCellBody>
                        {row.CustomerId}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.Amount !== null ? row.Amount?.toFixed(2) : 0.0}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.Descriptions}
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
                      <StyledTableCellBody>
                        {row.CustomerId}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.Amount !== null ? row.Amount?.toFixed(2) : 0.0}
                      </StyledTableCellBody>
                    </TableRow>
                  ))
              )
            )}
          </TableBody>
        </Table>
      </StyledScrollBox>
      <Box
        sx={{
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <Table
          sx={{
            "& th": {
              borderBottom: "1px solid #D9D9D9",
            },
            position: "sticky",
            zIndex: 1,
            bottom: 0,
          }}
        >
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
          <TableBody>
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
              <StyledTableCellSubHeader
                sx={{ width: grandTotal === 0 ? "820px" : "1010px" }}
              >
                TOTAL
              </StyledTableCellSubHeader>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody>{grandTotal.toFixed(2)}</StyledTableCellBody>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <Box
        sx={{
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <Table
          sx={{
            "& th": {
              borderBottom: "1px solid #D9D9D9",
            },
            position: "sticky",
            zIndex: 1,
            bottom: 0,
          }}
        >
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
          <TableBody>
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
              <StyledTableCellSubHeader
                sx={{ width: grandTotalSum === 0 ? "820px" : "1010px" }}
              >
                GRAND TOTAL
              </StyledTableCellSubHeader>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody>
                {grandTotalSum.toFixed(2)}
              </StyledTableCellBody>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default AccountingAdjustmentsTable;