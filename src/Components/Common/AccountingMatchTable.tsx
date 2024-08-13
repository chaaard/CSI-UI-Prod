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
import IAccountingMatch from "../../Pages/_Interface/IAccountingMatch";
import EditIcon from "@mui/icons-material/Edit";
import AccountingAdjustmentTypeModal from "./AccountingAdjustmentTypeModal";
import { useState } from "react";
import StyledTableCellHeader from "../ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledScrollBox from "../ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellNoData from "../ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellBody from "../ReusableComponents/TableComponents/StyledTableCellBody";
import StyledTableCellStatus from "../ReusableComponents/TableComponents/StyledTableCellStatus";
import StyledButton from "../ReusableComponents/ButtonComponents/StyledButton";
interface AnalyticsProps {
  match?: IAccountingMatch[];
  loading?: boolean;
  setIsModalClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccountingMatchTable: React.FC<AnalyticsProps> = ({
  match,
  loading,
  setIsModalClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [accountingMatch, setAccountingMatch] = useState<IAccountingMatch>(
    {} as IAccountingMatch
  );

  const grandTotal = match?.reduce((total, portalItem) => {
    const variance = portalItem.AnalyticsAmount || 0;
    return total + variance;
  }, 0);

  const analyticsTotal = match?.reduce((total, portalItem) => {
    const variance = portalItem.Variance || 0;
    return total + variance;
  }, 0);

  const prooflistTotal = match?.reduce((total, portalItem) => {
    const variance = portalItem.ProofListAmount || 0;
    return total + variance;
  }, 0);

  const getRoleId = window.localStorage.getItem("roleId");

  let roleId = 0;
  if (getRoleId !== null) {
    roleId = parseInt(getRoleId, 10);
  }

  const handleUpdateModalClick = (row: IAccountingMatch) => {
    setIsModalOpen(true);
    setAccountingMatch(row);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box style={{ position: "relative" }}>
      <StyledScrollBox
        component={Paper}
        sx={{
          height: "595px",
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
            minWidth: 700,
            tableLayout: "fixed", // Set table layout to fixed
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
            <TableRow>
              <StyledTableCellHeader
                sx={{ width: "2px" }}
              ></StyledTableCellHeader>
              <StyledTableCellHeader sx={{ width: "90px" }}>
                Invoice No.
              </StyledTableCellHeader>
              <StyledTableCellHeader>Location</StyledTableCellHeader>
              <StyledTableCellHeader>Date</StyledTableCellHeader>
              <StyledTableCellHeader>JO Number</StyledTableCellHeader>
              <StyledTableCellHeader>Amount</StyledTableCellHeader>
              <StyledTableCellHeader>Variance</StyledTableCellHeader>
              <StyledTableCellHeader>Amount</StyledTableCellHeader>
              <StyledTableCellHeader>JO Number</StyledTableCellHeader>
              <StyledTableCellHeader>Date</StyledTableCellHeader>
              <StyledTableCellHeader>Location</StyledTableCellHeader>
              <StyledTableCellHeader>Status</StyledTableCellHeader>
              <StyledTableCellHeader>Action</StyledTableCellHeader>
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
            ) : match?.length === 0 ? (
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
              match?.map((row, index) => (
                <TableRow
                  key={`${row.MatchId}-${index}`}
                  // onDoubleClick={() => handleRowDoubleClick(row)}
                  sx={{
                    "& td": {
                      border: 0,
                    },
                    "&:hover": {
                      backgroundColor: "#ECEFF1",
                    },
                  }}
                >
                  <StyledTableCellBody sx={{ width: "5px" }}>
                    {index + 1}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.AnalyticsInvoiceNo}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.AnalyticsLocation}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.AnalyticsTransactionDate !== null
                      ? new Date(
                          row.AnalyticsTransactionDate ?? ""
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short", // or 'long' for full month name
                          day: "numeric",
                        })
                      : ""}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.AnalyticsOrderNo}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.AnalyticsAmount !== null
                      ? row.AnalyticsAmount?.toFixed(2)
                      : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellBody
                    sx={{
                      backgroundColor: "#FFB5B6",
                      borderRadius: "10px",
                      color: row.ProofListId == null ? "#C20000" : "#1C2C5A",
                    }}
                  >
                    {row.Variance !== null ? row.Variance?.toFixed(2) : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.ProofListAmount !== null
                      ? row.ProofListAmount?.toFixed(2)
                      : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.ProofListOrderNo}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.ProofListTransactionDate !== null
                      ? new Date(
                          row.ProofListTransactionDate ?? ""
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short", // or 'long' for full month name
                          day: "numeric",
                        })
                      : ""}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.ProofListLocation}
                  </StyledTableCellBody>
                  <StyledTableCellStatus
                    sx={{
                      color: row.Status != null ? "#FFFFFF" : "#1C2C5A",
                      borderRadius: "10px",
                      backgroundColor:
                        row.Status === "PAID"
                          ? "#5C9275"
                          : row.Status === "UNDERPAYMENT"
                          ? "#CDBE6A"
                          : row.Status === "OVERPAYMENT"
                          ? "#A865B9"
                          : row.Status === "NOT REPORTED"
                          ? "#6568B9"
                          : row.Status === "UNPAID"
                          ? "#B7763B"
                          : row.Status === "RE-TRANSACT"
                          ? "#3BAFB7"
                          : row.Status === "ADJUSTMENTS"
                          ? "#A82A2A"
                          : row.Status === "CHARGEABLE"
                          ? "#FDA623"
                          : "inherit",
                    }}
                  >
                    {row.Status?.includes("|")
                      ? row.Status.split("|").map((status, idx) => (
                          <span
                            key={idx}
                            style={{
                              borderRadius: "8px",
                              color: row.Status != null ? "#FFFFFF" : "#1C2C5A",
                              display: "block",
                              backgroundColor: status.includes("UNDERPAYMENT")
                                ? "#CDBE6A"
                                : status.includes("OVERPAYMENT")
                                ? "#A865B9"
                                : status.includes("PAID")
                                ? "#5C9275"
                                : "#006120",
                            }}
                          >
                            {status.trim()}
                          </span>
                        ))
                      : row.Status}
                  </StyledTableCellStatus>
                  {row.Status !== "NOT REPORTED" && (
                    <StyledTableCellBody align="center">
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <StyledButton
                          onClick={() => {
                            handleUpdateModalClick(row);
                          }}
                          sx={{
                            backgroundColor: "#FCBA70",
                            width: "90px",
                            height: "20px",
                            borderRadius: "15px",
                            color: "#634422",
                            marginLeft: 0.5,
                            "&:hover": {
                              backgroundColor: "#FF9419",
                              color: "#FFFFFF",
                            },
                          }}
                        >
                          <EditIcon
                            sx={{ fontSize: "15px", marginRight: "2px" }}
                          />{" "}
                          Update
                        </StyledButton>
                      </Box>
                    </StyledTableCellBody>
                  )}
                </TableRow>
              ))
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
              <StyledTableCellHeader
                sx={{ width: "90px" }}
              ></StyledTableCellHeader>
              <StyledTableCellHeader></StyledTableCellHeader>
              <StyledTableCellHeader></StyledTableCellHeader>
              <StyledTableCellHeader></StyledTableCellHeader>
              <StyledTableCellHeader></StyledTableCellHeader>
              <StyledTableCellHeader></StyledTableCellHeader>
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
              <StyledTableCellHeader sx={{ width: "90px" }}>TOTAL</StyledTableCellHeader>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody>{grandTotal?.toFixed(2)}</StyledTableCellBody>
              <StyledTableCellBody>{analyticsTotal?.toFixed(2)}</StyledTableCellBody>
              <StyledTableCellBody>{prooflistTotal?.toFixed(2)}</StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
              <StyledTableCellBody></StyledTableCellBody>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <AccountingAdjustmentTypeModal
        open={isModalOpen}
        onClose={handleCloseModal}
        row={accountingMatch}
        setIsModalClose={setIsModalClose}
      />
    </Box>
  );
};

export default AccountingMatchTable;