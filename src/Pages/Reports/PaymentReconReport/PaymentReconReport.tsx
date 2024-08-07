import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SummarizeIcon from "@mui/icons-material/Summarize";
import IAnalyticProps from "../../Common/Interface/IAnalyticsProps";
import * as ExcelJS from "exceljs";
import { insertLogs } from "../../../Components/Functions/InsertLogs";
import CustomerDropdown from "../../../Components/Common/CustomerDropdown";
import IAccountingMatch from "../../Common/Interface/IAccountingMatch";
import StyledTableCellHeader from "../../../Components/ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellNoData from "../../../Components/ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellBody from "../../../Components/ReusableComponents/TableComponents/StyledTableCellBody";
import StyledTableCellStatus from "../../../Components/ReusableComponents/TableComponents/StyledTableCellStatus";
import StyledSnackBar from "../../../Components/ReusableComponents/NotificationComponents/StyledAlert";
import StyledScrollBox from './../../../Components/ReusableComponents/ScrollBarComponents/StyledScrollBar';
import StyledButton from "../../../Components/ReusableComponents/ButtonComponents/StyledButton";

const paymentStatus = [
  { Id: 1, Value: "All", StatusName: "All" },
  { Id: 2, Value: "Paid", StatusName: "Paid" },
  { Id: 3, Value: "Underpayment", StatusName: "Underpayment" },
  { Id: 4, Value: "Overpayment", StatusName: "Overpayment" },
  { Id: 5, Value: "Not Reported", StatusName: "Not Reported" },
  { Id: 6, Value: "Unpaid", StatusName: "Unpaid" },
  { Id: 7, Value: "Adjustments", StatusName: "Adjustments" },
  { Id: 8, Value: "Re-Transact", StatusName: "Re-Transact" },
  { Id: 9, Value: "Paid | with AP", StatusName: "Paid | with AP" },
  { Id: 10, Value: "Unpaid | with AP", StatusName: "Unpaid | with AP" },
  {
    Id: 11,
    Value: "Underpayment | with AP",
    StatusName: "Underpayment | with AP",
  },
  {
    Id: 12,
    Value: "Overpayment | with AP",
    StatusName: "Overpayment | with AP",
  },
  { Id: 13, Value: "Chargeable", StatusName: "Chargeable" },
  { Id: 14, Value: "Paid | Matched", StatusName: "Paid | Matched" },
  {
    Id: 15,
    Value: "Overpayment | Matched",
    StatusName: "Overpayment | Matched",
  },
  {
    Id: 16,
    Value: "Underpayment | Matched",
    StatusName: "Underpayment | Matched",
  },
  { Id: 17, Value: "Paid | Multiple Trx", StatusName: "Paid | Multiple Trx" },
  { Id: 18, Value: "Paid | Matched", StatusName: "Paid | Adjusted" },
  {
    Id: 19,
    Value: "Overpayment | Matched",
    StatusName: "Underpayment | Adjusted",
  },
  {
    Id: 20,
    Value: "Underpayment | Matched",
    StatusName: "Overpayment | Adjusted",
  },
  { Id: 21, Value: "Paid | Multiple Trx", StatusName: "Clawback" },
];

const PaymentReconReport = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [selected, setSelected] = useState<string[]>([] as string[]);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "warning" | "info" | "success">("success"); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(""); 
  const [clubs, setClubs] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getRoleId = window.localStorage.getItem("roleId");
  const getClub = window.localStorage.getItem("club");
  const getId = window.localStorage.getItem("Id");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [match, setMatch] = useState<IAccountingMatch[]>([]);
  const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const formattedDateTo = selectedDateTo?.format("YYYY-MM-DD HH:mm:ss.SSS");
  let club = 0;
  let roleId = 0;
  let Id = "";

  useEffect(() => {
    document.title = "Accounting | Payment Recon Reports";
  }, []);

  if (getClub !== null) {
    club = parseInt(getClub, 10);
  }

  if (getRoleId !== null) {
    roleId = parseInt(getRoleId, 10);
  }

  if (getId !== null) {
    Id = getId;
  }

  const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setSelectedStatus(value);
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChangeDateTo = (newValue: Dayjs | null) => {
    setSelectedDateTo(newValue);
  };

  useEffect(() => {
    const defaultDate = dayjs();
    setSelectedDateFrom(defaultDate);
    setSelectedDateTo(defaultDate);
  }, []);

  const handleExportPaymentRecon = async () => {
    try {
      if(loading)
      {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Please wait.");
        return;
      }

      const currentDate = new Date();
      const hours: number = currentDate.getHours();
      const minutes: number = currentDate.getMinutes();
      const seconds: number = currentDate.getSeconds();

      var dateRange =
          (selectedDateFrom ?? dayjs()).format("MMM DD - ") +
          (selectedDateTo ?? dayjs()).format("MMM DD, YYYY");

      const formattedHours: string =
        hours < 10 ? "0" + hours : hours.toString();
      const formattedMinutes: string =
        minutes < 10 ? "0" + minutes : minutes.toString();
      const formattedSeconds: string =
        seconds < 10 ? "0" + seconds : seconds.toString();

      const filename = `Payment Recon Report - ${dateRange}_${formattedHours}${formattedMinutes}${formattedSeconds}.xlsx`;

      if (match.length >= 1) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Payment Recon Report`);
        worksheet.columns = [
          { header: "Invoice No.", key: "invoiceNo" },
          { header: "Analytics Location", key: "aLocation" },
          { header: "Analytics Date", key: "aDate" },
          { header: "Analytics JO Number", key: "aJoNumber" },
          { header: "Analytics Amount", key: "aAmount" },
          { header: "Variance", key: "variance" },
          { header: "ProofList Amount", key: "pAmount" },
          { header: "ProofList JO Number", key: "pJoNumber" },
          { header: "ProofList Date", key: "pDate" },
          { header: "ProofList Location", key: "pLocation" },
          { header: "Status", key: "status" },
        ];

        match.forEach((row) => {
          const analyticsDate =
            row.AnalyticsTransactionDate !== null
              ? new Date(row.AnalyticsTransactionDate ?? "").toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              : "";

          const portalDate =
            row.ProofListTransactionDate !== null
              ? new Date(row.ProofListTransactionDate ?? "").toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              : "";

          worksheet.addRow({
            invoiceNo: row.AnalyticsInvoiceNo,
            aLocation: row.AnalyticsLocation,
            aDate: analyticsDate,
            aJoNumber: row.AnalyticsOrderNo,
            aAmount: row.AnalyticsAmount,
            variance: row.Variance,
            pAmount: row.ProofListAmount,
            pJoNumber: row.ProofListOrderNo,
            pDate: portalDate,
            pLocation: row.ProofListLocation,
            status: row.Status,
          });
        });

        const totalRowIndex = match.length + 2;
        worksheet.addRow([
          "TOTAL",
          "",
          "",
          "",
          { formula: `ROUND(SUM(E2:E${totalRowIndex - 1}),2)` },
          { formula: `ROUND(SUM(F2:F${totalRowIndex - 1}),2)` },
          { formula: `ROUND(SUM(G2:G${totalRowIndex - 1}),2)` },
        ]);

        worksheet.getRow(totalRowIndex).font = { bold: true };

        const columnMaxLengths: number[] = new Array(
          worksheet.columns.length
        ).fill(0);

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          row.eachCell({ includeEmpty: true }, (cell) => {
            if (typeof cell.col === "number") {
              const colIndex = cell.col - 1;
              // Ensure cell.text is a string for length calculation
              const cellText = cell.text ? cell.text.toString() : "";
              const cellLength = cellText.length;
              if (cellLength > columnMaxLengths[colIndex]) {
                columnMaxLengths[colIndex] = cellLength;
              }
            }
          });
        });

        worksheet.columns.forEach((column, index) => {
          column.width = columnMaxLengths[index] + 2; // Add padding to the width
        });

        const blob = await workbook.xlsx.writeBuffer();
        const blobUrl = URL.createObjectURL(
          new Blob([blob], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(blobUrl);

        setIsSnackbarOpen(true);
        setSnackbarSeverity("success");
        setMessage("Generate payment recon report successfully extracted.");

        const anaylticsParamUpdated: IAnalyticProps = {
          dates: [
            formattedDateFrom?.toString() ? formattedDateFrom?.toString() : "",
            formattedDateTo?.toString() ? formattedDateTo?.toString() : "",
          ],
          memCode: selected ?? [],
          userId: Id,
          remarks: "Successfully Generated",
          storeId: roleId === 2 ? [club] : clubs,
          action: "Payment Recon Report",
          fileName: filename,
        };

        await insertLogs(anaylticsParamUpdated);
      } else {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("warning");
        setMessage("No Payment Recon report found.");
      }
    } catch (error) {
      console.log(error);
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error extracting Payment Recon report");
    }
  };

  const fetchGrabMartMatch = useCallback(
    async (anaylticsParam: IAnalyticProps) => {
      try {
        const getAnalyticsMatch: AxiosRequestConfig = {
          method: "POST",
          url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAccountingProofListVariance`,
          data: anaylticsParam,
        };
        const response = await axios(getAnalyticsMatch);
        const result = response.data;
        if (result != null) {
          setMatch(result.Item1);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    },
    [REACT_APP_API_ENDPOINT]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          selectedDateFrom !== null &&
          selectedDateTo !== null &&
          selected.length >= 1
        ) {
          setLoading(true);
          const formattedDateFrom = selectedDateFrom?.format(
            "YYYY-MM-DD HH:mm:ss.SSS"
          );
          const formattedDateTo = selectedDateTo?.format(
            "YYYY-MM-DD HH:mm:ss.SSS"
          );
          const anaylticsParam: IAnalyticProps = {
            dates: [
              formattedDateFrom?.toString()
                ? formattedDateFrom?.toString()
                : "",
              formattedDateTo?.toString() ? formattedDateTo?.toString() : "",
            ],
            memCode: selected,
            userId: "",
            status: [selectedStatus],
            storeId: [],
          };
          await fetchGrabMartMatch(anaylticsParam);
          setLoading(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [
    fetchGrabMartMatch,
    selectedDateFrom,
    selectedDateTo,
    selected,
    selectedStatus,
  ]);

  return (
    <Box
      sx={{
        marginTop: "16px",
        marginLeft: "20px",
        marginRight: "20px",
        flexGrow: 1,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "20px",
          maxWidth: "100%",
          borderRadius: "15px",
          height: "780px",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", marginBottom: "10px", color: "#1C2C5A" }}
        >
          Payment Recon Reports
        </Typography>
        <Divider sx={{ marginBottom: "20px" }} />
        <Grid
          container
          direction="row"
          alignItems="center"
          sx={{ padding: "8px 16px 0 -9px" }}
        >
          <Grid item xs={11.1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="dddd, MMMM DD, YYYY"
                value={selectedDateFrom}
                label="From"
                onChange={handleChangeDateFrom}
                renderInput={(params: TextFieldProps) => (
                  <TextField
                    size="small"
                    {...params}
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
                        width: "340px",
                        fontSize: "14px",
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={11.1} sx={{ paddingTop: "15px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="dddd, MMMM DD, YYYY"
                value={selectedDateTo}
                label="To"
                onChange={handleChangeDateTo}
                renderInput={(params: TextFieldProps) => (
                  <TextField
                    size="small"
                    {...params}
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
                        width: "340px",
                        fontSize: "14px",
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={11.1} sx={{ paddingTop: "15px" }}>
            <CustomerDropdown
              setSelected={setSelected}
              selection="single"
              byMerchant={false}
              isAllVisible={false}
              isTextSearch={false}
            />
          </Grid>
          <Grid item xs={11.1} sx={{ paddingTop: "15px" }}>
            <TextField
              variant="outlined"
              size="small"
              type="text"
              label="Status"
              select
              value={selectedStatus}
              onChange={handleInputChange}
              InputProps={{
                sx: {
                  borderRadius: "40px",
                  backgroundColor: "#FFFFFF",
                  height: "40px",
                  width: "400px",
                  fontSize: "15px",
                  fontFamily: "Inter",
                  fontWeight: "bold",
                  color: "#1C2C5A",
                },
              }}
            >
              {paymentStatus.map((item) => (
                <MenuItem key={item.Id} value={item.StatusName}>
                  {item.StatusName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={4} sx={{ paddingTop: "15px" }}>
            <StyledButton
              sx={{
                color: "white",
                fontSize: "16px",
                backgroundColor: "#1C3766",
                width: "77%",
                borderRadius: "20px",
                fontFamily: "Inter",
                fontWeight: "900",
              }}
              onClick={handleExportPaymentRecon}
            >
              <SummarizeIcon sx={{ marginRight: "5px" }} />
              <Typography>Generate Payment Recon Report</Typography>
            </StyledButton>
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: "20px" }} />
        <StyledScrollBox
          component={Paper}
          sx={{
            height: "450px",
            position: "relative",
            paddingTop: "10px",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
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
              <TableRow>
                <StyledTableCellHeader
                  sx={{ width: "2px" }}
                ></StyledTableCellHeader>
                <StyledTableCellHeader sx={{ width: "90px" }}>Invoice No.</StyledTableCellHeader>
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
                  <StyledTableCellNoData colSpan={12} align="center">
                    No data found
                  </StyledTableCellNoData>
                </TableRow>
              ) : (
                match?.map((row, index) => (
                  <TableRow
                    key={`${row.MatchId}-${index}`}
                    sx={{
                      "& td": {
                        border: 0,
                      },
                      "&:hover": {
                        backgroundColor: "#ECEFF1",
                      },
                    }}
                  >
                    <StyledTableCellBody sx={{ width: "5px" }}>{index + 1}</StyledTableCellBody>
                    <StyledTableCellBody>{row.AnalyticsInvoiceNo}</StyledTableCellBody>
                    <StyledTableCellBody>{row.AnalyticsLocation}</StyledTableCellBody>
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
                    <StyledTableCellBody>{row.AnalyticsOrderNo}</StyledTableCellBody>
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
                      {row.Variance !== null
                        ? row.Variance?.toFixed(2)
                        : "0.00"}
                    </StyledTableCellBody>
                    <StyledTableCellBody>
                      {row.ProofListAmount !== null
                        ? row.ProofListAmount?.toFixed(2)
                        : "0.00"}
                    </StyledTableCellBody>
                    <StyledTableCellBody>{row.ProofListOrderNo}
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
                    <StyledTableCellBody>{row.ProofListLocation}
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
                                color:
                                  row.Status != null ? "#FFFFFF" : "#1C2C5A",
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledScrollBox>
      </Paper>
      <StyledSnackBar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={message}
      />
    </Box>
  );
};

export default PaymentReconReport;
