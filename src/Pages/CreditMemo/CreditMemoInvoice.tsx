import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Grid,
  TextField,
  TextFieldProps,
  Paper,
  Divider,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import SummarizeIcon from "@mui/icons-material/Summarize";
import * as XLSX from "xlsx";
import CustomerDropdown from "../../Components/Common/CustomerDropdown";
import { insertLogs } from "../../Components/Functions/InsertLogs";
import StyledButton from "../../Components/ReusableComponents/ButtonComponents/StyledButton";
import StyledSnackBar from "../../Components/ReusableComponents/NotificationComponents/StyledAlert";
import StyledScrollBox from "../../Components/ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellBody from "../../Components/ReusableComponents/TableComponents/StyledTableCellBody";
import StyledTableCellHeader from "../../Components/ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellNoData from "../../Components/ReusableComponents/TableComponents/StyledTableCellNoData";
import api from "../../Config/AxiosConfig";
import IAnalyticProps from "../_Interface/IAnalyticsProps";
import IGeneratedInvoice from "../_Interface/IGeneratedInvoice";
import { ICreditMemoInvoiceDto } from "../_Interface/ICreditMemoTran";

const GenerateCreditMemoInvoice = () => {
  const getClub = window.localStorage.getItem("club");
  const getId = window.localStorage.getItem("Id");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<
    Dayjs | null | undefined
  >(null);
  const [selectedDateTo, setSelectedDateTo] = useState<
    Dayjs | null | undefined
  >(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<IGeneratedInvoice[]>(
    []
  );
  const [selected, setSelected] = useState<string[]>([] as string[]);
  const [clubs, setClubs] = useState<number[]>([]);
  const getRoleId = window.localStorage.getItem("roleId");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "error" | "warning" | "info" | "success"
  >("success");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const formattedDateTo = selectedDateTo?.format("YYYY-MM-DD HH:mm:ss.SSS");
  let roleId = 0;
  let club = 0;
  let Id = "";

  useEffect(() => { document.title = `${ roleId === 2 ? "CSI" : roleId === 1 ? "Accounting" : "Maintenance" } | Generated Credit Memo Invoice Reports`; },[roleId]);

  if (getRoleId !== null) {
    roleId = parseInt(getRoleId, 10);
  }
  if (getClub !== null) {
    club = parseInt(getClub, 10);
  }
  if (getId !== null) {
    Id = getId;
  }

  const handleSnackbarClose = (event: React.SyntheticEvent | Event,reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const fetchGetClubs = async () => {
    try {
      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Analytics/GetClubs`,
      };
      await api(config).then(async (response) => {
        await setClubs(response.data);
      }).catch((error) => {
          console.error("Error fetching data:", error);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (formattedDateFrom && selected.length >= 1) {
        if(clubs.length === 0)
          {
              await fetchGetClubs();
          }
          const requestParams: ICreditMemoInvoiceDto = {
            Dates: [
              formattedDateFrom?.toString() ? formattedDateFrom?.toString() : "",
              formattedDateTo?.toString() ? formattedDateTo?.toString() : "",
            ],
            MerchantCode: selected,
            UserId: Id,
            StoreId: roleId === 2 ? [club] : clubs,
            Action: "Generate Credit Memo Invoice Report",
          }
          if (clubs.length >= 1) {
            const fetchGenerateInvoice = async () => {
              try {
                setLoading(true);
                const config: AxiosRequestConfig = {
                  method: "POST",
                  url: `/CreditMemo/GetCreditMemoInvoice`,
                  data: requestParams,
                };

                await api(config)
                  .then(async (response) => {
                    setGeneratedInvoice(response.data);
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
            await fetchGenerateInvoice();
          }
      }
    };

    fetchData();
  }, [clubs, formattedDateFrom, formattedDateTo, selected]);

  useEffect(() => {
    const defaultDate = dayjs();
    const currentDate = dayjs();
    setSelectedDateFrom(defaultDate);
    setSelectedDateTo(currentDate);
    setLoading(false);
  }, []);

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChangeDateTo = (newValue: Dayjs | null) => {
    setSelectedDateTo(newValue);
  };

  const handleExportExceptions = async () => {
    try {
      if (loading) {
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

      const filename = `Generated Credit Memo Invoice Report - ${dateRange}_${formattedHours}${formattedMinutes}${formattedSeconds}.xlsx`;

      if (generatedInvoice.length >= 1) {
        const worksheet = XLSX.utils.json_to_sheet(generatedInvoice);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "exceptions_report");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const dataBlob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Create a download link and trigger a click event to start the download
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(dataBlob);
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        setIsSnackbarOpen(true);
        setSnackbarSeverity("success");
        setMessage("Generated Invoice report successfully extracted.");

        const anaylticsParamUpdated: IAnalyticProps = {
          dates: [
            formattedDateFrom?.toString() ? formattedDateFrom?.toString() : "",
            formattedDateTo?.toString() ? formattedDateTo?.toString() : "",
          ],
          memCode: selected,
          userId: Id,
          storeId: roleId === 2 ? [club] : clubs,
          action: "Generate Credit Memo Invoice Report",
          fileName: filename,
        };

        await insertLogs(anaylticsParamUpdated);
      } else {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("warning");
        setMessage("No Generated Invoice report found.");
      }
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error extracting Generated Invoice report");
    }
  };

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
          Generated Credit Memo Invoice Reports
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
              <DesktopDatePicker inputFormat="dddd, MMMM DD, YYYY" value={selectedDateTo} label="To" onChange={handleChangeDateTo} renderInput={(params: TextFieldProps) => (
                  <TextField size="small" {...params} sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderRadius: "40px",},},"& .MuiOutlinedInput-input": {
                        color: "#1C2C5A",fontFamily: "Inter",fontWeight: "bold",width: "340px",fontSize: "14px",},}}/>)}/>
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
              onClick={handleExportExceptions}>
              <SummarizeIcon sx={{ marginRight: "5px" }} />
              <Typography>Generate Credit Memo Invoice Report</Typography>
            </StyledButton>
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: "20px" }} />
        <StyledScrollBox
          component={Paper}
          sx={{
            height: "470px",
            position: "relative",
            paddingTop: "10px",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
            boxShadow: "none",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}>
          <Table sx={{ backgroundColor: "#ffffff",}} aria-label="spanning table">
            <TableHead sx={{ zIndex: 3, position: "sticky", top: "-10px", backgroundColor: "#ffffff",}}>
              <TableRow sx={{ minWidth: 700 }}>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Customer No.</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Customer Name</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>CM Invoice No.</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Invoice Date</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Transaction Date</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Location</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Reference No.</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Invoice Amount</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>FileName</StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow sx={{ "& td": { border: 0 } }}>
                  <StyledTableCellBody colSpan={12} align="center">
                    <CircularProgress size={80} />
                  </StyledTableCellBody>
                </TableRow>
              ) : generatedInvoice.length === 0 ? (
                <TableRow sx={{"& td": {border: 0,},}}>
                  <StyledTableCellNoData colSpan={12} align="center">
                    No data found
                  </StyledTableCellNoData>
                </TableRow>
              ) : (
                generatedInvoice.map((item: IGeneratedInvoice) => {
                  return (
                    <TableRow key={item.Id} sx={{ "& td": { border: 0 } }}>
                      <StyledTableCellBody style={{ textAlign: "center" }}>
                        {item.CustomerNo}
                      </StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>
                        {item.CustomerName}
                      </StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>
                        {item.InvoiceNo}
                      </StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>
                        {" "}
                        {item.InvoiceDate !== null ? new Date(item.InvoiceDate ?? "").toLocaleDateString("en-US", {year: "numeric",month: "short",day: "numeric",}): ""}
                      </StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>
                        {" "}
                        {item.TransactionDate !== null ? new Date( item.TransactionDate ?? "").toLocaleDateString("en-US", {year: "numeric",month: "short",day: "numeric"}) : ""}
                      </StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>
                        {item.Location}
                      </StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>
                        {item.ReferenceNo}
                      </StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "right", paddingRight: "40px" }}>
                        {item.InvoiceAmount !== null ? item.InvoiceAmount >= 1000 ? item.InvoiceAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2, })
                          : item.InvoiceAmount.toFixed(2)
                          : "0.00"
                        }
                      </StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}> {item.FileName} </StyledTableCellBody>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </StyledScrollBox>
      </Paper>
      <StyledSnackBar open={isSnackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} severity={snackbarSeverity} message={message}/>
    </Box>
  );
};

export default GenerateCreditMemoInvoice;
