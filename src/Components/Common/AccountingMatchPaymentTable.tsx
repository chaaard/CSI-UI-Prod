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
import IAccountingMatchPayment from "../../Pages/_Interface/IAccountingMatchPayment";
import { useState } from "react";
import StyledTableCellStatus from "../ReusableComponents/TableComponents/StyledTableCellStatus";
import StyledTableCellBody from "../ReusableComponents/TableComponents/StyledTableCellBody";
import StyledTableCellHeader from "../ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledScrollBox from "../ReusableComponents/ScrollBarComponents/StyledScrollBar";

interface AnalyticsProps {
  matchPayment?: IAccountingMatchPayment[];
  loading?: boolean;
  selectedRow: React.Dispatch<
    React.SetStateAction<IAccountingMatchPayment | null>
  >;
}

const AccountingMatchPaymentTable: React.FC<AnalyticsProps> = ({
  matchPayment,
  loading,
  selectedRow,
}) => {
  const [selectedMatchRow, setSelectedMatchRow] =
    useState<IAccountingMatchPayment | null>(null);

  const handleRowClick = (row: IAccountingMatchPayment) => {
    setSelectedMatchRow((prevSelectedRow) =>
      prevSelectedRow === row ? null : row
    );
    selectedRow((prevSelectedRow) => (prevSelectedRow === row ? null : row));
  };

  const getRoleId = window.localStorage.getItem("roleId");

  let roleId = 0;
  if (getRoleId !== null) {
    roleId = parseInt(getRoleId, 10);
  }

  return (
    <Box style={{ position: "relative" }}>
      <StyledScrollBox
        component={Paper}
        sx={{
          height: "100px",
          position: "relative",
          paddingTop: "10px",
          borderRadius: "20px",
          boxShadow: "none",
          width: "100%",
        }}
      >
        <Table
          sx={{
            minWidth: 300,
            tableLayout: "fixed", // Set table layout to fixed
            "& th": {
              borderBottom: "2px solid #D9D9D9",
            },
            borderCollapse: "separate",
            borderSpacing: "0px 2px",
            position: "relative", // Add this line to make the container relative
            backgroundColor: "#ffffff",
          }}
          aria-label="spanning table"
        >
          <TableHead
            sx={{
              zIndex: 3,
              position: "sticky",
              backgroundColor: "#ffffff",
            }}
          >
            <TableRow>
              <StyledTableCellHeader>Transaction Date</StyledTableCellHeader>
              <StyledTableCellHeader>Order No</StyledTableCellHeader>
              <StyledTableCellHeader>Location</StyledTableCellHeader>
              <StyledTableCellHeader>Analytics Amount</StyledTableCellHeader>
              <StyledTableCellHeader>Variance</StyledTableCellHeader>
              <StyledTableCellHeader>Payment Amount</StyledTableCellHeader>
              <StyledTableCellHeader>Status</StyledTableCellHeader>
            </TableRow>
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
                <TableCell colSpan={12} align="center">
                  <CircularProgress size={80} />
                </TableCell>
              </TableRow>
            ) : matchPayment?.length === 0 ? (
              <TableRow sx={{ "& td": { border: 0 } }}>
                <StyledTableCellBody colSpan={12} align="center">
                  No data found
                </StyledTableCellBody>
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
                    backgroundColor:
                      selectedMatchRow === row ? "#E0F7FA" : "transparent",
                    "&:hover": {
                      backgroundColor: "#ECEFF1",
                    },
                  }}
                >
                  <StyledTableCellBody>
                    {row.TransactionDate !== null
                      ? new Date(row.TransactionDate ?? "").toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short", // or 'long' for full month name
                            day: "numeric",
                          }
                        )
                      : ""}
                  </StyledTableCellBody>
                  <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                  <StyledTableCellBody>{row.Location}</StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.AnalyticsAmount !== null
                      ? row.AnalyticsAmount?.toFixed(2)
                      : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.Variance !== null ? row.Variance?.toFixed(2) : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.ProofListAmount !== null
                      ? row.ProofListAmount?.toFixed(2)
                      : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellStatus
                    sx={{
                      color: row.Status != null ? "#FFFFFF" : "#1C2C5A",
                      backgroundColor:
                        row.Status === "Overpayment"
                          ? "#A865B9"
                          : row.Status === "Not Reported"
                          ? "#6568B9"
                          : "inherit",
                      borderRadius: "10px",
                    }}
                  >
                    {row.Status}
                  </StyledTableCellStatus>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledScrollBox>
    </Box>
  );
};

export default AccountingMatchPaymentTable;