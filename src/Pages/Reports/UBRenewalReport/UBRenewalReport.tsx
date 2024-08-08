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
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
} from "@mui/material";
import {
  DesktopDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import IAnalyticProps from "../../_Interface/IAnalyticsProps";
import axios, { AxiosRequestConfig } from "axios";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { insertLogs } from "../../../Components/Functions/InsertLogs";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import * as ExcelJS from "exceljs";
import IUBRenewalReport from "../../_Interface/IUBRenewalReport";
import ILocations from "../../_Interface/ILocations";
import StyledButton from "../../../Components/ReusableComponents/ButtonComponents/StyledButton";
import StyledScrollBox from "../../../Components/ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellHeader from "../../../Components/ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellBody from "../../../Components/ReusableComponents/TableComponents/StyledTableCellBody";
import StyledSnackBar from "../../../Components/ReusableComponents/NotificationComponents/StyledAlert";
import StyledTableCellNoData from "../../../Components/ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledActionButton from "../../../Components/ReusableComponents/ButtonComponents/StyledActionButton";

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

const UnionBankRenewalReport = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem("club");
  const getId = window.localStorage.getItem("Id");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<IUBRenewalReport[]>([]);
  const [selected, setSelected] = useState<string[]>(["9999011984"]);
  const getRoleId = window.localStorage.getItem("roleId");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "warning" | "info" | "success">("success"); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [editedRemarks, setEditedRemarks] = useState("");
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [selectedLocationCodes, setSelectedLocationCodes] = useState<number[]>([]);
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [editRowIdChild, setEditRowIdChild] = useState<string | null>(null);
  const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const formattedDateTo = selectedDateTo?.format("YYYY-MM-DD HH:mm:ss.SSS");
  let roleId = 0;
  let club = 0;
  let Id = "";

  useEffect(() => {
    document.title = `${roleId === 2 ? "CSI" : roleId === 1 ? "Accounting" : "Maintenance"} | UnionBank Renewal Reports`;
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

  const anaylticsParam: IAnalyticProps = {
    dates: [
      formattedDateFrom?.toString() ? formattedDateFrom?.toString() : "",
      formattedDateTo?.toString() ? formattedDateTo?.toString() : "",
    ],
    memCode: selected,
    userId: Id,
    storeId: roleId === 2 ? [club] : selectedLocationCodes,
    action: "UnionBank Renewal Report",
  };

  const fetchGenerateUBRenewal = async () => {
    try {
      setLoading(true);
      const getAnalytics: AxiosRequestConfig = {
        method: "POST",
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GenerateUBRenewal`,
        data: anaylticsParam,
      };

      axios(getAnalytics)
        .then(async (response) => {
          console.log("response.data", response.data);
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
      fetchGenerateUBRenewal();
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
    setEditRowIdChild(null); // Exit edit mode without saving
    setSelectedDate(null);
  };

  const handleChangeDateTo = (newValue: Dayjs | null) => {
    setSelectedDateTo(newValue);
    setEditRowId(null); // Exit edit mode without saving
    setEditRowIdChild(null); // Exit edit mode without saving
    setSelectedDate(null);
  };

  useEffect(() => {
    if (editRowIdChild !== null) {
      const row = generatedInvoice.find(
        (row) => row.Ids.toString() === editRowIdChild
      );
      if (row) {
        setSelectedDate(row.AutoChargeDate ? dayjs(row.AutoChargeDate) : null);
      }
    }
  }, [editRowIdChild, generatedInvoice]);

  const handleChangeDate = (newValue: Dayjs | null) => {
    console.log("newValue", newValue);
    setSelectedDate(newValue);
  };

  const handleGenerateWeeklyReport = async () => {
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

      const filename = `UnionBank Renewal Report - ${dateRange}_${formattedHours}${formattedMinutes}${formattedSeconds}.xlsx`;

      if (generatedInvoice.length >= 1) {
        const customerName = "UnionBank Renewal Report";
        const sheetName = "UnionBank Renewal";
        const header = [
          "AUTO-CHARGE DATE",
          "GOLD",
          "AMOUNT",
          "BUSINESS",
          "AMOUNT",
          "ADD-ON FREE",
          "TOTAL AMOUNT",
          "CSI NUMBER",
          "TRANSACTED DATE",
        ];
        const additionalHeaders = [customerName, dateRange];

        const formattedData = generatedInvoice.map((item) => {
          const transactionDate = item.TransactedDate
            ? new Date(item.TransactedDate)
            : null;
          const autoChargeDate = item.AutoChargeDate
            ? new Date(item.AutoChargeDate)
            : null;

          return {
            "AUTO-CHARGE DATE": autoChargeDate
              ? `${autoChargeDate.getFullYear()}-${(autoChargeDate.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}-${autoChargeDate
                  .getDate()
                  .toString()
                  .padStart(2, "0")}`
              : "",
            GOLD: item.Gold,
            AMOUNT: item.Amount700 ? item.Amount700.toFixed(2) : null,
            BUSINESS: item.Business,
            "AMOUNT ": item.Amount900 ? item.Amount900.toFixed(2) : null,
            "ADD-ON FREE": item.AddOnFree ? item.AddOnFree.toFixed(2) : null,
            "TOTAL AMOUNT": item.TotalAmount ? item.TotalAmount.toFixed(2) : null,
            "CSI NUMBER": item.CSINo,
            "TRANSACTED DATE": transactionDate
              ? `${transactionDate.getFullYear()}-${(
                  transactionDate.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}-${transactionDate
                  .getDate()
                  .toString()
                  .padStart(2, "0")}`
              : "",
          };
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(`${sheetName} - ${club}`);

        worksheet.getCell("A1").value = additionalHeaders[0];
        worksheet.getCell("A1").font = { bold: true };
        worksheet.getCell("A2").value = additionalHeaders[1];

        header.forEach((headerText, index) => {
          worksheet.getCell(`${String.fromCharCode(65 + index)}4`).value =
            headerText;
        });

        formattedData.forEach((rowData, rowIndex) => {
          const rowDataKeys = Object.keys(rowData) as (keyof typeof rowData)[];
          rowDataKeys.forEach((key, colIndex) => {
            worksheet.getCell(
              `${String.fromCharCode(65 + colIndex)}${rowIndex + 5}`
            ).value = rowData[key];
          });
        });

        const borderHeaderStyle: Partial<ExcelJS.Border> = {
          style: "medium",
          color: { argb: "00000000" },
        };
        const borderStyle: Partial<ExcelJS.Border> = {
          style: "thin",
          color: { argb: "00000000" },
        };

        header.forEach((_value, colIndex) => {
          const cell = worksheet.getCell(
            `${String.fromCharCode(65 + colIndex)}4`
          );
          cell.alignment = {
            horizontal: "center",
            vertical: "bottom",
          };
          cell.border = {
            top: borderHeaderStyle,
            left: borderHeaderStyle,
            bottom: borderHeaderStyle,
            right: borderHeaderStyle,
          };
          cell.font = { bold: true };
          worksheet.getColumn(colIndex + 1).width = 15;
        });

        formattedData.forEach((rowData, rowIndex) => {
          const rowDataKeys = Object.keys(rowData) as (keyof typeof rowData)[];
          rowDataKeys.forEach((key, colIndex) => {
            const cell = worksheet.getCell(
              `${String.fromCharCode(65 + colIndex)}${rowIndex + 5}`
            );
            cell.border = {
              top: borderStyle,
              left: borderStyle,
              bottom: borderStyle,
              right: borderStyle,
            };

            if (
              [
                "AUTO-CHARGE DATE",
                "GOLD",
                "BUSINESS",
                "ADD-ON FREE",
                "CSI NUMBER",
                "TRANSACTED DATE",
              ].includes(header[colIndex])
            ) {
              cell.alignment = {
                horizontal: "center",
                vertical: "middle",
              };
            }

            if (
              ["AMOUNT", "AMOUNT ", "TOTAL AMOUNT"].includes(header[colIndex]) &&
              cell.value !== null &&
              cell.value !== undefined
            ) {
              cell.value = parseFloat(cell.value.toString());
              cell.numFmt = "#,##0.00";
            }
          });
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
        setMessage("UB Renewal report generated successfully");

        const anaylticsParamUpdated: IAnalyticProps = {
          dates: [
            formattedDateFrom?.toString() || "",
            formattedDateTo?.toString() || "",
          ],
          memCode: [selected.toString()],
          userId: Id,
          storeId: [club],
          action: "UB Renewal Report",
          fileName: filename,
        };

        await insertLogs(anaylticsParamUpdated);
      } else {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("warning");
        setMessage("No UB Renewal Report found.");
      }
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error generating report");
      console.error(error);
    }
  };

  const CustomTextField = styled(TextField)<TextFieldProps>(({ disabled }) => ({
    "& .MuiInputBase-root": {
      backgroundColor: "#fff", // White background
      borderRadius: "4px", // Border radius
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: disabled ? "#E5E5E5" : "#1C2C5A",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FF9900", // Orange border on hover
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#FF9900", // Orange border when focused
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px 12px",
      fontSize: "14px",
      fontWeight: "400",
    },
  }));

  const handleSave = async (id: string) => {
    try {
      const formattedDate = selectedDate?.format("YYYY-MM-DD HH:mm:ss.SSS");
      const anaylticsParamUpdated: IAnalyticProps = {
        dates: [formattedDate?.toString() || ""],
        userId: Id,
        storeId: [club],
        Ids: id,
      };

      console.log("anaylticsParamUpdated", anaylticsParamUpdated);
      if (formattedDate) {
        const generateInvoice: AxiosRequestConfig = {
          method: "PUT",
          url: `${REACT_APP_API_ENDPOINT}/Analytics/UpdateAutoChargeDateAnalytics`,
          data: anaylticsParamUpdated,
        };
        try {
          const result = await axios(generateInvoice);

          if (result.data === true) {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("success");
            setMessage("Successfully saved!");
            handleCancelEdit();
            setEditRowId(null);
            fetchGenerateUBRenewal();
          } else {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Error saving remarks");
            setEditRowId(null); // Exit edit mode without saving
            handleCancelEdit();
          }
        } catch (error) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Error saving remarks");
          setEditRowId(null); // Exit edit mode without saving
          handleCancelEdit();
        }
      }
      console.log("id", id);
      console.log("formattedDate", formattedDate);
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error generating report");
      console.error(error);
    }
  };

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

  const totalAmount700 = generatedInvoice.reduce(
    (sum, item) => sum + (item.Amount700 || 0),
    0
  );
  const totalAmount900 = generatedInvoice.reduce(
    (sum, item) => sum + (item.Amount900 || 0),
    0
  );
  const totalTotalAmount = generatedInvoice.reduce(
    (sum, item) => sum + (item.TotalAmount || 0),
    0
  );

  const handleCancelEdit = () => {
    setEditRowIdChild(null); // Exit edit mode without saving
    setSelectedDate(null);
  };

  const handleEditRemarks = (remarks: string, id: string) => {
    setEditRowIdChild(id);
    setEditedRemarks(remarks); // Set edited remarks for editing
  };

  return (
    <Box sx={{ position: "relative" }}>
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
            UnionBank Renewal Report
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
                  renderInput={(params) => (
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
                  renderInput={(params) => (
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
                onClick={handleGenerateWeeklyReport}
              >
                <SummarizeIcon sx={{ marginRight: "5px" }} />
                <Typography>Export UnionBank Renewal Report</Typography>
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
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Auto Charge Date</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Gold </StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Amount</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Business</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Amount</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Add-on Free</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Total Amount</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>CSI Number</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Transacted Date</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Action</StyledTableCellHeader>
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
                  generatedInvoice.map((row) => {
                    const isEditing = editRowIdChild === row.Ids.toString();
                    return (
                      <TableRow key={row.Ids} sx={{ "& td": { border: 0 } }}>
                        <>
                          <StyledTableCellBody>
                            {editRowIdChild === row.Ids.toString() ? (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DesktopDatePicker
                                  inputFormat="MMM DD, YYYY"
                                  value={selectedDate}
                                  onChange={handleChangeDate}
                                  renderInput={(params) => (
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
                                          fontSize: "14px",
                                        },
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            ) : (
                              <>
                                {row.AutoChargeDate !== null
                                  ? new Date(
                                      row.AutoChargeDate ?? ""
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : ""}
                              </>
                            )}
                          </StyledTableCellBody>
                          <StyledTableCellBody style={{ textAlign: "center" }}>{row.Gold}</StyledTableCellBody>
                          <StyledTableCellBody
                            style={{ textAlign: "right", paddingRight: "40px" }}
                          >
                            {row.Amount700 !== null
                              ? row.Amount700 >= 1000
                                ? row.Amount700.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : row.Amount700.toFixed(2)
                              : "0.00"}
                          </StyledTableCellBody>
                          <StyledTableCellBody style={{ textAlign: "center" }}>{row.Business}</StyledTableCellBody>
                          <StyledTableCellBody style={{ textAlign: "right", paddingRight: "40px" }}>
                            {row.Amount900 !== null
                              ? row.Amount900 >= 1000
                                ? row.Amount900.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : row.Amount900.toFixed(2)
                              : "0.00"}
                          </StyledTableCellBody>
                          <StyledTableCellBody style={{ textAlign: "center" }}>{row.AddOnFree}</StyledTableCellBody>
                          <StyledTableCellBody style={{ textAlign: "right", paddingRight: "40px" }}>
                            {row.TotalAmount !== null
                              ? row.TotalAmount >= 1000
                                ? row.TotalAmount.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : row.TotalAmount.toFixed(2)
                              : "0.00"}
                          </StyledTableCellBody>
                          <StyledTableCellBody style={{ textAlign: "center" }}>{row.CSINo}</StyledTableCellBody>
                          <StyledTableCellBody style={{ textAlign: "center" }}>
                            {row.TransactedDate !== null
                              ? new Date(
                                  row.TransactedDate ?? ""
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : ""}
                          </StyledTableCellBody>
                          <StyledTableCellBody>
                            {isEditing ? (
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                              >
                                <StyledActionButton
                                  onClick={() => handleSave(row.Ids)}
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
                                    row.AutoChargeDate || "",
                                    row.Ids.toString()
                                  )
                                }
                              >
                                <EditIcon />
                              </StyledActionButton>
                            )}
                          </StyledTableCellBody>
                        </>
                      </TableRow>
                    );
                  })
                )}
                {generatedInvoice.length > 0 && (
                  <TableRow
                    sx={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}
                  >
                    <StyledTableCellBody
                      colSpan={2}
                      style={{ textAlign: "center" }}
                    >
                      Total
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{ textAlign: "right", paddingRight: "40px" }}
                    >
                      {totalAmount700 >= 1000
                        ? totalAmount700.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : totalAmount700.toFixed(2)}
                    </StyledTableCellBody>
                    <StyledTableCellBody></StyledTableCellBody>
                    <StyledTableCellBody
                      style={{ textAlign: "right", paddingRight: "40px" }}
                    >
                      {totalAmount900 >= 1000
                        ? totalAmount900.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : totalAmount900.toFixed(2)}
                    </StyledTableCellBody>
                    <StyledTableCellBody colSpan={1}></StyledTableCellBody>
                    <StyledTableCellBody
                      style={{ textAlign: "right", paddingRight: "40px" }}
                    >
                      {totalTotalAmount >= 1000
                        ? totalTotalAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : totalTotalAmount.toFixed(2)}
                    </StyledTableCellBody>
                    <StyledTableCellBody colSpan={2}></StyledTableCellBody>
                  </TableRow>
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
    </Box>
  );
};

export default UnionBankRenewalReport;
