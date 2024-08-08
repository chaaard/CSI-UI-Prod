import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  styled,
  CircularProgress,
  Grid,
  TextField,
  TextFieldProps,
  MenuItem,
  IconButton,
  Snackbar,
  Fade,
  Alert,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import IAnalyticProps from "../../_Interface/IAnalyticsProps";
import axios, { AxiosRequestConfig } from "axios";
import IGeneratedInvoice from "../../_Interface/IGeneratedInvoice";
import SummarizeIcon from "@mui/icons-material/Summarize";
import * as XLSX from "xlsx";
import { insertLogs } from "../../../Components/Functions/InsertLogs";
import ILocations from "../../_Interface/ILocations";
import StyledTableCellHeader from "../../../Components/ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellNoData from "../../../Components/ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellBody from "../../../Components/ReusableComponents/TableComponents/StyledTableCellBody";
import StyledButton from "../../../Components/ReusableComponents/ButtonComponents/StyledButton";
import StyledScrollBox from "../../../Components/ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledSnackBar from "../../../Components/ReusableComponents/NotificationComponents/StyledAlert";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const WalkInInvoice = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem("club");
  const getId = window.localStorage.getItem("Id");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<IGeneratedInvoice[]>([]);
  const [selected, setSelected] = useState<string[]>(["9999011572"]);
  const [clubs, setClubs] = useState<number[]>([]);
  const getRoleId = window.localStorage.getItem("roleId");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "warning" | "info" | "success">("success"); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [editedRemarks, setEditedRemarks] = useState("");
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [selectedLocationCodes, setSelectedLocationCodes] = useState<number[]>([]);
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const formattedDateTo = selectedDateTo?.format("YYYY-MM-DD HH:mm:ss.SSS");
  let roleId = 0;
  let club = 0;
  let Id = "";

  useEffect(() => {
    document.title = `${roleId === 2 ? 'CSI' : roleId === 1 ? 'Accounting' : 'Maintenance' } | Walk-In Invoice Reports`;
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

  const handleMenuItemClick = (locationCode: number) => {
    setSelectedLocationCodes((prevSelected) => {
      if (prevSelected.includes(locationCode)) {
        // If the location is already selected, remove it
        return prevSelected.filter((code) => code !== locationCode);
      } else {
        // If the location is not selected, add it
        return [...prevSelected, locationCode];
      }
    });
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations: AxiosRequestConfig = {
          method: "POST",
          url: `${REACT_APP_API_ENDPOINT}/Analytics/GetLocations`,
        };

        axios(locations)
          .then(async (result) => {
            var locations = result.data as ILocations[];
            setLocations(locations);
          })
          .catch(() => {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Error fetching locations");
          });
      } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Error generating report");
      }
    };

    fetchLocations();
  }, [REACT_APP_API_ENDPOINT]);

  // Handle closing the snackbar
  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const anaylticsParam: IAnalyticProps = {
    dates: [
      formattedDateFrom?.toString() ? formattedDateFrom?.toString() : "",
      formattedDateTo?.toString() ? formattedDateTo?.toString() : "",
    ],
    memCode: selected,
    userId: Id,
    storeId: roleId === 2 ? [club] : selectedLocationCodes,
    action: "Walk-In Invoice Report",
  };

  const fetchGenerateInvoice = async () => {
    try {
      setLoading(true);
      const getAnalytics: AxiosRequestConfig = {
        method: "POST",
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetGeneratedInvoice`,
        data: anaylticsParam,
      };

      axios(getAnalytics)
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

  useEffect(() => {
    if (formattedDateFrom && selected.length >= 1) {
      fetchGenerateInvoice();
    }
  }, [
    REACT_APP_API_ENDPOINT,
    formattedDateFrom,
    formattedDateTo,
    selected,
    selectedLocationCodes,
  ]);

  useEffect(() => {
    const defaultDate = dayjs();
    const currentDate = dayjs();
    setSelectedDateFrom(defaultDate);
    setSelectedDateTo(currentDate);
    setLoading(false);
  }, []);

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
    setEditRowId(null); // Exit edit mode without saving
  };

  const handleChangeDateTo = (newValue: Dayjs | null) => {
    setSelectedDateTo(newValue);
    setEditRowId(null); // Exit edit mode without saving
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

      const filename = `Walk-In Invoice Report - ${dateRange}_${formattedHours}${formattedMinutes}${formattedSeconds}.xlsx`;

      if (generatedInvoice.length >= 1) {
        // Remove Id and FileName fields from each object in generatedInvoice
        const sanitizedData = generatedInvoice.map(
          ({ Id, FileName, ...rest }) => rest
        );
        const worksheet = XLSX.utils.json_to_sheet(sanitizedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Walk-In Invoice");
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
        setMessage("Walk-In invoice report successfully extracted.");

        const anaylticsParamUpdated: IAnalyticProps = {
          dates: [
            formattedDateFrom?.toString() ? formattedDateFrom?.toString() : "",
            formattedDateTo?.toString() ? formattedDateTo?.toString() : "",
          ],
          memCode: selected,
          userId: Id,
          storeId: roleId === 2 ? [club] : clubs,
          action: "Walk-In Invoice Report",
          fileName: filename,
        };

        await insertLogs(anaylticsParamUpdated);
      } else {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("warning");
        setMessage("No Walk-In Invoice report found.");
      }
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error extracting Walk-In Invoice report");
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
          Walk-In Invoice Reports
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
          {roleId.toString() === "1" && (
            <>
              <Grid item xs={11.1} sx={{ paddingTop: "15px" }}>
                <FormControl sx={{ width: 300 }}>
                  <InputLabel>Clubs</InputLabel>
                  <Select
                    multiple
                    value={selectedLocationCodes}
                    input={
                      <OutlinedInput
                        id="select-multiple-chip"
                        label="Clubs"
                      />
                    }
                    renderValue={(selected) => (
                      <Box
                        sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                      >
                        {selected.map((code) => {
                          const location = locations.find(
                            (loc) => loc.LocationCode === code
                          );
                          return (
                            <Chip
                              key={code}
                              label={location ? location.LocationName : code}
                              sx={{ fontSize: "13px" }}
                            />
                          );
                        })}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                    style={{
                      width: "400px",
                      borderRadius: "40px",
                      color: "#1C3766",
                      fontSize: "14px",
                    }}
                  >
                    {locations.map((location) => (
                      <MenuItem
                        key={location.Id}
                        value={location.LocationCode}
                        onClick={() =>
                          handleMenuItemClick(location.LocationCode)
                        }
                        selected={selectedLocationCodes.includes(
                          location.LocationCode
                        )}
                      >
                        {location.LocationName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
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
              <Typography>Generate Walk-In Invoice Report</Typography>
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
              <TableRow sx={{ minWidth: 700 }}>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Customer No.</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Customer Name</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Invoice No.</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Invoice Date</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Transaction Date</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Location</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Reference No.</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Invoice Amount</StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>Customer</StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody>
            { loading ? (
                <TableRow sx={{ "& td": { border: 0 } }}>
                  <StyledTableCellBody colSpan={12} align="center">
                    <CircularProgress size={80} />
                  </StyledTableCellBody>
                </TableRow>
              ) : generatedInvoice.length === 0 ? (
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
                generatedInvoice.map((item: IGeneratedInvoice) => {
                  return (
                    <TableRow key={item.Id} sx={{ "& td": { border: 0 } }}>
                      <StyledTableCellBody style={{ textAlign: "center" }}>{item.CustomerNo}</StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>{item.CustomerName}</StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>{item.InvoiceNo}</StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>
                        {" "}
                        {item.InvoiceDate !== null
                          ? new Date(
                              item.InvoiceDate ?? ""
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short", // or 'long' for full month name
                              day: "numeric",
                            })
                          : ""}
                      </StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>
                        {" "}
                        {item.TransactionDate !== null
                          ? new Date(
                              item.TransactionDate ?? ""
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short", // or 'long' for full month name
                              day: "numeric",
                            })
                          : ""}
                      </StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>{item.Location}</StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>{item.ReferenceNo}</StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "right", paddingRight: "40px" }}>
                        {item.InvoiceAmount !== null
                          ? item.InvoiceAmount >= 1000
                            ? item.InvoiceAmount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : item.InvoiceAmount.toFixed(2)
                          : "0.00"}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {editRowId === item.Id.toString() ? (
                          <TextField
                            fullWidth
                            value={editedRemarks}
                            onChange={(e) => setEditedRemarks(e.target.value)}
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
                          item.Remarks
                        )}
                      </StyledTableCellBody>
                    </TableRow>
                  );
                })
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

export default WalkInInvoice;
