import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import IAnalytics from "../../Pages/_Interface/IAnalytics";
import { useState, forwardRef, useImperativeHandle } from "react";
import IException from "../../Pages/_Interface/IException";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import StyledScrollBox from "../ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellBody from "../ReusableComponents/TableComponents/StyledTableCellBody";
import StyledActionButton from "../ReusableComponents/ButtonComponents/StyledActionButton";
import StyledTableCellHeader from "../ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellNoData from "../ReusableComponents/TableComponents/StyledTableCellNoData";

interface DisputeAnalyticsProps {
  filteredAnalytics: IAnalytics[];
  loading: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRowId: React.Dispatch<React.SetStateAction<IException>>;
  merchant?: string;
  onSaveRow?: (id: number, remarks: string) => void;
  setEditRowId?: string;
}

export interface ChildHandle {
  handleCancelEdit: () => void;
}

const DisputeAnalyticsTable = forwardRef<ChildHandle, DisputeAnalyticsProps>(
  (
    {
      filteredAnalytics,
      loading,
      setModalOpen,
      setSelectedRowId,
      merchant,
      onSaveRow,
      setEditRowId,
    },
    ref
  ) => {
    const [editRowIdChild, setEditRowIdChild] = useState<string | null>(null);
    const [editedRemarks, setEditedRemarks] = useState("");

    useImperativeHandle(ref, () => ({
      handleCancelEdit() {
        console.log("handleCancelEdit triggered");
        setEditRowIdChild(null);
      },
    }));

    const handleOpen = (row: IAnalytics) => {
      const updatedException: IException = {
        Id: row.Id,
        CustomerId: row.CustomerId,
        JoNumber: row.OrderNo,
        TransactionDate: row.TransactionDate,
        Amount: row.Amount,
        Source: "Analytics",
        AdjustmentId: 0,
        LocationName: row.LocationName ?? "",
        AnalyticsId: row.Id,
        ProofListId: null,
        OldJo: "",
        NewJo: null,
        OldCustomerId: "",
        NewCustomerId: null,
        DisputeReferenceNumber: "",
        DisputeAmount: 0,
        DateDisputeFiled: new Date(),
        DescriptionOfDispute: "",
        AccountsPaymentDate: new Date(),
        AccountsPaymentTransNo: "",
        AccountsPaymentAmount: 0,
        Descriptions: "",
        ReasonId: 0,
      };
      setSelectedRowId(updatedException);
      setModalOpen(true);
    };
    // Calculate the total amount
    const grandTotal = filteredAnalytics.reduce((total, analyticsItem) => {
      // Ensure that Amount is a number and not undefined or null
      const amount = analyticsItem.SubTotal || 0;
      return total + amount;
    }, 0);

    const handleCancelEdit = () => {
      setEditRowIdChild(null);
    };

    const handleEditRemarks = (remarks: string, id: string) => {
      setEditRowIdChild(id);
      setEditedRemarks(remarks);
    };

    const handleSaveCustomer = (id: number, remarks: string) => {
      if (onSaveRow) {
        onSaveRow(id, remarks);
      }
    };

    return (
      <Box style={{ position: "relative" }}>
        <StyledScrollBox
          component={Paper}
          sx={{
            height: "319px",
            position: "relative",
            paddingTop: "5px",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
            borderRadius: "20px",
            paddingLeft: "20px",
            backgroundColor: "#F2F2F2",
            paddingRight: "20px",
            boxShadow:
              "inset 1px 1px 1px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)",
            marginLeft: "20px",
            marginRight: "20px",
            marginBottom: "20px",
          }}
        >
          <Table
            sx={{
              minWidth: 700,
              "& th": {
                borderBottom: "2px solid #1C3766",
              },
              borderCollapse: "separate",
              borderSpacing: "0px 4px",
              position: "relative", // Add this line to make the container relative,
            }}
            aria-label="spanning table"
          >
            <TableHead
              sx={{
                zIndex: 3,
                position: "sticky",
                top: "-10px",
                backgroundColor: "#F2F2F2",
              }}
            >
              <TableRow>
                {merchant === "WalkIn" ? (
                  <>
                    <StyledTableCellHeader>Customer Name</StyledTableCellHeader>
                    <StyledTableCellHeader>Location Name</StyledTableCellHeader>
                    <StyledTableCellHeader>
                      Transaction Date
                    </StyledTableCellHeader>
                    <StyledTableCellHeader>
                      Membership No.
                    </StyledTableCellHeader>
                    <StyledTableCellHeader>Cashier No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Register No.</StyledTableCellHeader>
                    <StyledTableCellHeader>
                      Transaction No.
                    </StyledTableCellHeader>
                    <StyledTableCellHeader>Order No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Subtotal</StyledTableCellHeader>
                    <StyledTableCellHeader>Customer</StyledTableCellHeader>
                    <StyledTableCellHeader>Action</StyledTableCellHeader>
                  </>
                ) : (
                  <>
                    <StyledTableCellHeader>Customer Name</StyledTableCellHeader>
                    <StyledTableCellHeader>Location Name</StyledTableCellHeader>
                    <StyledTableCellHeader>
                      Transaction Date
                    </StyledTableCellHeader>
                    <StyledTableCellHeader>
                      Membership No.
                    </StyledTableCellHeader>
                    <StyledTableCellHeader>Cashier No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Register No.</StyledTableCellHeader>
                    <StyledTableCellHeader>
                      Transaction No.
                    </StyledTableCellHeader>
                    <StyledTableCellHeader>Order No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Subtotal</StyledTableCellHeader>
                  </>
                )}
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
              ) : filteredAnalytics?.length === 0 ? (
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
                filteredAnalytics.map((row) => {
                  const isEditing = editRowIdChild === row.Id.toString();
                  return (
                    <TableRow
                      key={row.Id}
                      onDoubleClick={() => handleOpen(row)}
                      sx={{
                        "& td": {
                          border: 0,
                        },
                        "&:hover": {
                          backgroundColor: "#ECEFF1",
                        },
                      }}
                    >
                      {merchant === "WalkIn" ? (
                        <>
                          <StyledTableCellBody>
                            {row.CustomerName}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {row.LocationName}
                          </StyledTableCellBody>
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
                            {row.MembershipNo}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {row.CashierNo}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {row.RegisterNo}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {row.TransactionNo}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {row.OrderNo}
                          </StyledTableCellBody>
                          <StyledTableCellBody sx={{ textAlign: "right" }}>
                            {row.SubTotal !== undefined && row.SubTotal !== null
                              ? row.SubTotal.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : ""}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {editRowIdChild === row.Id.toString() ? (
                              <TextField
                                fullWidth
                                value={editedRemarks}
                                onChange={(e) =>
                                  setEditedRemarks(e.target.value)
                                }
                                variant="outlined"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderRadius: "40px",
                                    },
                                  },
                                  "& .MuiOutlinedInput-input": {
                                    color: "#1C2C5A",
                                    fontFamily: "Inter",
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    padding: "4.5px 14px",
                                  },
                                }}
                              />
                            ) : (
                              row.Remarks
                            )}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {isEditing ? (
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <StyledActionButton
                                  onClick={() =>
                                    handleSaveCustomer(row.Id, editedRemarks)
                                  }
                                  style={{ color: "#1C3766" }}
                                >
                                  <CheckIcon />
                                </StyledActionButton>
                                <StyledActionButton
                                  onClick={handleCancelEdit}
                                  style={{ color: "#1C3766" }}
                                >
                                  <ClearIcon />
                                </StyledActionButton>
                              </Box>
                            ) : (
                              <StyledActionButton
                                onClick={() =>
                                  handleEditRemarks(
                                    row.Remarks || "",
                                    row.Id.toString()
                                  )
                                }
                              >
                                <EditIcon />
                              </StyledActionButton>
                            )}
                          </StyledTableCellBody>
                        </>
                      ) : (
                        <>
                          <StyledTableCellBody>
                            {row.CustomerName}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {row.LocationName}
                          </StyledTableCellBody>
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
                            {row.MembershipNo}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {row.CashierNo}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {row.RegisterNo}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {row.TransactionNo}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {row.OrderNo}
                          </StyledTableCellBody>
                          <StyledTableCellBody sx={{ textAlign: "right" }}>
                            {row.SubTotal !== undefined && row.SubTotal !== null
                              ? row.SubTotal.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : ""}
                          </StyledTableCellBody>
                        </>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </StyledScrollBox>
        <StyledScrollBox
          component={Paper}
          sx={{
            height: "30px",
            position: "relative",
            paddingTop: "5px",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
            borderRadius: "20px",
            paddingLeft: "20px",
            backgroundColor: "#F2F2F2",
            paddingRight: "20px",
            boxShadow:
              "inset 1px 1px 1px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)",
            marginLeft: "20px",
            marginRight: "20px",
            marginBottom: "20px",
          }}
        >
          <Grid container>
            <Grid item xs>
              <Typography
                textAlign="left"
                sx={{
                  fontFamily: "Inter",
                  fontWeight: "900",
                  color: "#1C3766",
                  fontSize: 14,
                }}
              >
                Grand Total
              </Typography>
            </Grid>
            <Grid item xs dir="rtl">
              <Typography
                textAlign="right"
                sx={{
                  fontFamily: "Inter",
                  fontWeight: "900",
                  color: "#1C3766",
                  fontSize: 14,
                }}
              >
                {grandTotal !== undefined && grandTotal !== null
                  ? grandTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : ""}
              </Typography>
            </Grid>
          </Grid>
        </StyledScrollBox>
        <Box
          sx={{
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        ></Box>
      </Box>
    );
  }
);

export default DisputeAnalyticsTable;