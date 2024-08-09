import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  styled,
  CircularProgress,
  Grid,
  TextField,
  TextFieldProps,
  IconButton,
  Alert,
  Paper,
  Divider,
  Backdrop,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import IAccntGenerateInvoice from "../../Pages/_Interface/IAccntGenerateInvoice";
import {
  ReceiptLong as ReceiptLongIcon,
  Sync as SyncIcon,
} from "@mui/icons-material/";
import CheckIcon from "@mui/icons-material/Check";
import PendingIcon from "@mui/icons-material/Pending";
import ErrorIcon from "@mui/icons-material/Error";
import IRefreshAnalytics from "../../Pages/_Interface/IRefreshAnalytics";
import ModalComponent from "./ModalComponent";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CustomerDropdown from "./CustomerDropdown";
import api from "../../Config/AxiosConfig";
import StyledScrollBox from "../ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellHeader from "../ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellBody from "../ReusableComponents/TableComponents/StyledTableCellBody";
import StyledSnackBar from "../ReusableComponents/NotificationComponents/StyledAlert";
import StyledButton from "../ReusableComponents/ButtonComponents/StyledButton";

const AccountingGenerateInvoice = () => {
  const { REACT_APP_INVOICE } = process.env;
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<
    Dayjs | null | undefined
  >(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<
    IAccntGenerateInvoice[]
  >([]);
  //const [selected, setSelected] = useState<string>('9999011929');
  const [selected, setSelected] = useState<string[]>([] as string[]);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "error" | "warning" | "info" | "success"
  >("success");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [openGenInvoice, setOpenGenInvoice] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>("");

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const filePath = REACT_APP_INVOICE;
  const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const customerCodesArray: string[] = selected.map(String);
  const analyticsParam: IRefreshAnalytics = {
    dates: [
      formattedDateFrom ? formattedDateFrom : "",
      formattedDateFrom ? formattedDateFrom : "",
    ],
    memCode: customerCodesArray,
    userId: "",
    storeId: [0],
    selectedItem: selectedItem,
  };

  const updatedParam = {
    Path: filePath,
    analyticsParamsDto: analyticsParam,
  };

  const fetchGenerateInvoice1 = async () => {
    try {
      console.log("selectedItem", selectedItem);
      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Analytics/AccountingGenerateInvoice`,
        data: updatedParam,
      };

      await api(config)
        .then(async (response) => {
          setGeneratedInvoice([]);
          setGeneratedInvoice(response.data);
          console.log("generate invoice", response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (formattedDateFrom) {
      setLoading(true);
      setGeneratedInvoice([]);
      const fetchGenerateInvoice = async () => {
        fetchGenerateInvoice1();
      };

      fetchGenerateInvoice();
    }
  }, [, formattedDateFrom, selected]);

  useEffect(() => {
    const defaultDate = dayjs().startOf("day").subtract(1, "day");
    setSelectedDateFrom(defaultDate);
    setLoading(false);
  }, []);

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  useEffect(() => {
    document.title = "Accounting | Generate Invoice";
  }, []);

  const handleRefreshClick = async () => {
    setLoading(true);
    fetchGenerateInvoice1();
  };

  const checkFolderPath = async (path: string) => {
    try {
      const response = await api.get(
        `/Analytics/CheckFolderPath?path=${encodeURIComponent(path)}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Error checking folder existence.");
    }
  };

  const handleOpenGenInvoice = () => {
    setOpenGenInvoice(true);
  };

  const handleCloseGenInvoice = useCallback(() => {
    setOpenGenInvoice(false);
  }, []);

  const handleGenInvoiceClick = async () => {
    try {
      setRefreshing(true);
      setOpenGenInvoice(false);
      if (REACT_APP_INVOICE !== undefined && REACT_APP_INVOICE !== null) {
        const filePath = REACT_APP_INVOICE;
        const folderExists = await checkFolderPath(filePath);
        if (!folderExists) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("The folder path does not exist or is invalid.");
          setOpenGenInvoice(false);
          setRefreshing(false);
          return;
        }
        const config: AxiosRequestConfig = {
          method: "POST",
          url: `/Analytics/GenerateA0File`,
          data: updatedParam,
        };

        await api(config)
          .then((result) => {
            var message = result.data.Message;
            var content = result.data.Content;
            var fileName = result.data.FileName;
            if (message === "Invoice Generated Successfully") {
              const blob = new Blob([content], { type: "text/plain" });
              const url = URL.createObjectURL(blob);

              const a = document.createElement("a");
              a.href = url;
              a.download = fileName;
              document.body.appendChild(a);
              a.click();

              // Cleanup
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              setIsSnackbarOpen(true);
              fetchGenerateInvoice1();
              setSnackbarSeverity("success");
              setMessage("Invoice Generated Successfully");
              setOpenGenInvoice(false);
              setRefreshing(false);
            } else {
              setIsSnackbarOpen(true);
              setSnackbarSeverity("error");
              setMessage(
                "Error generating invoice. Please check and try again."
              );
              setOpenGenInvoice(false);
              setRefreshing(false);
            }
          })
          .catch((error) => {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Error generating invoice");
            setOpenGenInvoice(false);
            setRefreshing(false);
          });
      }
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error generating invoice");
      setOpenGenInvoice(false);
      setRefreshing(false);
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
      <Backdrop
        sx={{ color: "#ffffff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={refreshing}
      >
        <CircularProgress size="100px" sx={{ color: "#ffffff" }} />
      </Backdrop>
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
          Generate Invoice
        </Typography>
        <Divider sx={{ marginBottom: "20px" }} />
        <Grid container spacing={1} alignItems="flex-start" direction={"row"}>
          <Grid item>
            <CustomerDropdown
              setSelected={setSelected}
              selection="single"
              setSelectedCustomerName={setSelectedItem}
              byMerchant={false}
              isAllVisible={false}
              isTextSearch={false}
              fromPage={"generateinvoice"}
            />
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="dddd, MMMM DD, YYYY"
                value={selectedDateFrom}
                label="Date"
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
                        width: "230px",
                        fontSize: "14px",
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <StyledButton
              sx={{
                color: "white",
                fontSize: "14px",
                backgroundColor: "#1C3766",
                width: "150px",
                borderRadius: "20px",
                fontFamily: "Inter",
                fontWeight: "900",
                height: "38px",
                paddingRight: "15px",
                //borderColor: isGenerated ? 'inherit' : '#1C3766',
                "& .MuiTypography-root": {
                  fontSize: "14px",
                },
              }}
              onClick={handleRefreshClick}
              // disabled={isGenerated ? true : false}
            >
              <SyncIcon sx={{ marginRight: "5px" }} />
              <Typography>Refresh</Typography>
            </StyledButton>
          </Grid>
          <Grid item>
            <StyledButton
              sx={{
                color: "white",
                fontSize: "14px",
                backgroundColor: "#1C3766",
                width: "250px",
                borderRadius: "20px",
                fontFamily: "Inter",
                fontWeight: "900",
                height: "38px",
                paddingRight: "15px",
                //borderColor: isGenerated ? 'inherit' : '#1C3766',
                "& .MuiTypography-root": {
                  fontSize: "14px",
                },
              }}
              onClick={handleOpenGenInvoice}
              // disabled={isGenerated ? true : false}
            >
              <ReceiptLongIcon sx={{ marginRight: "5px" }} />
              <Typography>Generate Invoice</Typography>
            </StyledButton>
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: "20px" }} />
        <StyledScrollBox
          component={Paper}
          sx={{
            height: "660px",
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
              borderCollapse: "separate",
              borderSpacing: "0px 4px",
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
              <TableRow sx={{ minWidth: 700 }}>
                <StyledTableCellHeader
                  style={{ textAlign: "center" }}
                ></StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>
                  Location / Club
                </StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>
                  Date
                </StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>
                  Status
                </StyledTableCellHeader>
                <StyledTableCellHeader
                  style={{ textAlign: "center" }}
                ></StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow sx={{ "& td": { border: 0 } }}>
                  <TableCell colSpan={12} align="center">
                    <CircularProgress size={80} />
                  </TableCell>
                </TableRow>
              ) : generatedInvoice.length === 0 ? (
                <TableRow sx={{ "& td": { border: 0 } }}>
                  <StyledTableCellBody colSpan={12} align="center">
                    No data found
                  </StyledTableCellBody>
                </TableRow>
              ) : (
                generatedInvoice.map((item: IAccntGenerateInvoice) => (
                  <TableRow key={item.Id} sx={{ "& td": { border: 0 } }}>
                    <StyledTableCellBody
                      style={{ width: "400px" }}
                    ></StyledTableCellBody>
                    <StyledTableCellBody
                      style={{ textAlign: "left", width: "200px" }}
                    >
                      {item.Location}
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{ textAlign: "center", width: "200px" }}
                    >
                      {" "}
                      {item.Date !== null
                        ? new Date(item.Date ?? "").toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short", // or 'long' for full month name
                              day: "numeric",
                            }
                          )
                        : ""}
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{
                        width: "200px",
                        borderRadius: "10px",
                        textAlign: "center",
                        backgroundColor:
                          item.SubmitStatus === 0
                            ? "#FFB5B5"
                            : item.SubmitStatus === 3
                            ? item.IsGenerated === true
                              ? "#BEFCBE"
                              : "#E3FBE3"
                            : "#FFCF97",
                        color:
                          item.SubmitStatus === 0
                            ? "#A85A5A"
                            : item.SubmitStatus === 3
                            ? item.IsGenerated === true
                              ? "#375037"
                              : "#3F743F"
                            : "#634422",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.SubmitStatus === 0 ? (
                          <ErrorIcon
                            style={{
                              color: "#A85A5A",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
                        ) : item.SubmitStatus === 3 ? (
                          item.IsGenerated === true ? (
                            <DoneAllIcon
                              style={{
                                color: "#284628",
                                fontSize: "15px",
                                marginRight: "5px",
                                verticalAlign: "middle",
                              }}
                            />
                          ) : (
                            <CheckIcon
                              style={{
                                color: "#3F743F",
                                fontSize: "15px",
                                marginRight: "5px",
                                verticalAlign: "middle",
                              }}
                            />
                          )
                        ) : (
                          <PendingIcon
                            style={{
                              color: "#634422",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
                        )}
                        {item.SubmitStatus === 0
                          ? "No Analytics"
                          : item.SubmitStatus === 3
                          ? item.IsGenerated === true
                            ? "Generated"
                            : "Submitted"
                          : "Pending"}
                      </span>
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{ width: "400px" }}
                    ></StyledTableCellBody>
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
      <ModalComponent
        title="Generate Invoice"
        onClose={handleCloseGenInvoice}
        buttonName="Generate"
        open={openGenInvoice}
        onSave={handleGenInvoiceClick}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid
                item
                xs={8}
                sx={{
                  fontFamily: "Inter",
                  fontWeight: "900",
                  color: "#1C2C5A",
                  fontSize: "20px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "25px",
                    textAlign: "center",
                    marginRight: "-170px",
                  }}
                >
                  Are you sure you want to generate invoice?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        }
      />
    </Box>
  );
};

export default AccountingGenerateInvoice;