import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SummarizeIcon from "@mui/icons-material/Summarize";
import IAnalyticProps from "../../_Interface/IAnalyticsProps";
import IExceptionGenerateReport from "../../_Interface/IExceptionGenerateReport";
import * as ExcelJS from "exceljs";
import { insertLogs } from "../../../Components/Functions/InsertLogs";
import CustomerDropdown from "../../../Components/Common/CustomerDropdown";
import StyledTableCellNoData from "../../../Components/ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellHeader from "../../../Components/ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellBody from "../../../Components/ReusableComponents/TableComponents/StyledTableCellBody";
import StyledButton from "../../../Components/ReusableComponents/ButtonComponents/StyledButton";
import StyledScrollBox from "../../../Components/ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledSnackBar from "../../../Components/ReusableComponents/NotificationComponents/StyledAlert";
import IExceptionsReport from "../_Interfaces/IExceptionsReport";
import api from "../../../Config/AxiosConfig";

const ExceptionsReport = () => {
  
  const [exceptions, setExceptions] = useState<IExceptionGenerateReport[]>([]);
  const [selected, setSelected] = useState<string[]>([] as string[]);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "warning" | "info" | "success">("success"); 
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>(""); 
  const [clubs, setClubs] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getRoleId = window.localStorage.getItem("roleId");
  const getClub = window.localStorage.getItem("club");
  const getId = window.localStorage.getItem("Id");
  const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const formattedDateTo = selectedDateTo?.format("YYYY-MM-DD HH:mm:ss.SSS");
  let roleId = 0;
  let club = 0;
  let Id = "";

  useEffect(() => {
    document.title = `${roleId === 2 ? 'CSI' : roleId === 1 ? 'Accounting' : 'Maintenance' } | Exception Reports`;
  }, [roleId]);

  if (getClub !== null) {
    club = parseInt(getClub, 10);
  }

  if (getRoleId !== null) {
    roleId = parseInt(getRoleId, 10);
  }

  if (getId !== null) {
    Id = getId;
  }

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

  useEffect(() => {
    if (clubs === null) {
      fetchGetClubs();
    }
  }, [clubs]);

  const fetchGetClubs = async () => {
    try {
      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Analytics/GetClubs`,
      };

      await api(config)
        .then(async (response) => {
          await setClubs(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleExportExceptions = async () => {
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

      const filename = `Exception Report - ${dateRange}_${formattedHours}${formattedMinutes}${formattedSeconds}.xlsx`;

      if (exceptions.length >= 1) {
        const header = [
          "ID",
          "Customer Name",
          "JO Number",
          "Transaction Date",
          "Amount",
          "Adjustment Type",
          "Source",
          "Status",
          "Location Name",
          "Old JO",
          "Current JO / New JO",
          "Old Customer ID",
          "New Customer ID",
          "Dispute Reference Number",
          "Dispute Amount",
          "Date Dispute Filed",
          "Description of Dispute",
          "Accounts Payment Date",
          "Accounts Payment Trans No",
          "Accounts Payment Amount",
          "Reason",
          "Descriptions",
        ];

        const formattedData = exceptions.map(
          (item: IExceptionGenerateReport) => {
            const transactionDate = item.TransactionDate
              ? new Date(item.TransactionDate)
              : null;
            const disputeFiledDate = item.DateDisputeFiled
              ? new Date(item.DateDisputeFiled)
              : null;
            const accountPaymentsDate = item.AccountsPaymentDate
              ? new Date(item.AccountsPaymentDate)
              : null;

            const formatDate = (date: Date | null) => {
              if (!date) return "-";
              return `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date
                .getDate()
                .toString()
                .padStart(2, "0")}`;
            };

            return {
              ID: item.Id ?? 0,
              "Customer Name": item.CustomerId ?? "-",
              "JO Number": item.JoNumber ?? "-",
              "Transaction Date": formatDate(transactionDate),
              Amount: item.Amount ?? 0.0,
              "Adjustment Type": item.AdjustmentType ?? "-",
              Source: item.Source ?? "-",
              Status: item.Status ?? "-",
              "Location Name": item.LocationName ?? "-",
              "Old JO": item.OldJo ?? "-",
              "Current JO / New JO": item.NewJo ?? "-",
              "Old Customer ID": item.OldCustomerId ?? "-",
              "New Customer ID": item.NewCustomerId ?? "-",
              "Dispute Reference Number": item.DisputeReferenceNumber ?? "-",
              "Dispute Amount": item.DisputeAmount ?? 0.0,
              "Date Dispute Filed": formatDate(disputeFiledDate),
              "Description of Dispute": item.DescriptionOfDispute ?? "-",
              "Accounts Payment Date": formatDate(accountPaymentsDate),
              "Accounts Payment Trans No": item.AccountsPaymentTransNo ?? "-",
              "Accounts Payment Amount": item.AccountsPaymentAmount ?? 0.0,
              Reason: item.ReasonDesc ?? "-",
              Descriptions: item.Descriptions ?? "-",
            };
          }
        );

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`Exception Report`);

        header.forEach((headerText, index) => {
          worksheet.getCell(`${String.fromCharCode(65 + index)}1`).value =
            headerText;
        });

        formattedData.forEach((rowData: IExceptionsReport, rowIndex: number) => {
          Object.keys(rowData).forEach((key, colIndex) => {
            worksheet.getCell(
              `${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`
            ).value = rowData[key];
          });
        });

        formattedData.forEach((_rowData: IExceptionsReport, rowIndex: number) => {
          Object.keys(formattedData[0]).forEach((_value, colIndex: number) => {
            const cell = worksheet.getCell(
              `${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`
            );

            if (
              ["Amount", "Dispute Amount", "Accounts Payment Amount"].includes(
                header[colIndex]
              ) &&
              cell.value !== null &&
              cell.value !== undefined
            ) {
              cell.value = parseFloat(cell.value.toString());
              cell.numFmt = "#,##0.00;(#,##0.00)";
            }
          });
        });

        header.forEach((_value, colIndex: number) => {
          const cell = worksheet.getCell(
            `${String.fromCharCode(65 + colIndex)}1`
          );
          cell.alignment = {
            horizontal: "center",
            vertical: "bottom",
          };
          cell.font = { bold: true };
          worksheet.getColumn(colIndex + 1).width = 15;
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
        setMessage("Generate Exception report successfully extracted.");

        const anaylticsParamUpdated: IAnalyticProps = {
          dates: [
            formattedDateFrom?.toString() ? formattedDateFrom?.toString() : "",
            formattedDateTo?.toString() ? formattedDateTo?.toString() : "",
          ],
          memCode: selected ?? [],
          userId: Id,
          remarks: "Successfully Generated",
          storeId: roleId === 2 ? [club] : clubs,
          action: "Exceptions Report",
          fileName: filename,
        };

        await insertLogs(anaylticsParamUpdated);
      } else {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("warning");
        setMessage("No Exception report found.");
      }
    } catch (error) {
      console.log(error);
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error extracting Exception report");
    }
  };

  const anaylticsParam: IAnalyticProps = {
    dates: [
      formattedDateFrom?.toString() ? formattedDateFrom?.toString() : "",
      formattedDateTo?.toString() ? formattedDateTo?.toString() : "",
    ],
    memCode: selected ?? [],
    userId: Id,
    storeId: roleId === 2 ? [club] : clubs,
    action: "Exceptions Report",
  };

  useEffect(() => {
    if (formattedDateFrom) {
      setLoading(true);
      fetchGetClubs();
      const fetchGenerateInvoice = async () => {
        try {
          const config: AxiosRequestConfig = {
            method: "POST",
            url: `/Analytics/ExportExceptions`,
            data: anaylticsParam,
          };

          await api(config)
            .then(async (response) => {
              setExceptions(response.data as IExceptionGenerateReport[]);
              setLoading(false);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              setLoading(false);
            });
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

      fetchGenerateInvoice();
    }
  }, [, formattedDateFrom, formattedDateTo, selected]);

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
          Exception Reports
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
              fromPage="exceptionreport"
            />
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
              onClick={handleExportExceptions}
            >
              <SummarizeIcon sx={{ marginRight: "5px" }} />
              <Typography>Generate Exception Report</Typography>
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
                <StyledTableCellHeader>Customer Name</StyledTableCellHeader>
                <StyledTableCellHeader>Order No</StyledTableCellHeader>
                <StyledTableCellHeader>Transaction Date</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>Adjustment Type</StyledTableCellHeader>
                <StyledTableCellHeader>Source</StyledTableCellHeader>
                <StyledTableCellHeader>Status</StyledTableCellHeader>
                <StyledTableCellHeader>Location</StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow sx={{ "& td": { border: 0 } }}>
                  <StyledTableCellBody colSpan={12} align="center">
                    <CircularProgress size={80} />
                  </StyledTableCellBody>
                </TableRow>
              ) : exceptions.length === 0 ? (
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
                  exceptions.map((item: IExceptionGenerateReport) => (
                    <TableRow hover key={item.Id}>
                      <StyledTableCellBody>{item.CustomerId}</StyledTableCellBody>
                      <StyledTableCellBody>{item.JoNumber}</StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>
                        {item.TransactionDate !== null &&
                        item.TransactionDate !== undefined
                          ? new Date(item.TransactionDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : ""}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {item.Amount != null
                          ? item.Amount >= 1000
                            ? item.Amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : item.Amount.toFixed(2)
                          : "0.00"}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{item.AdjustmentType}</StyledTableCellBody>
                      <StyledTableCellBody>{item.Source}</StyledTableCellBody>
                      <StyledTableCellBody>{item.Status}</StyledTableCellBody>
                      <StyledTableCellBody>{item.LocationName}</StyledTableCellBody>
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

export default ExceptionsReport;
