import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  CircularProgress,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import IAnalyticProps from "../../_Interface/IAnalyticsProps";
import { AxiosRequestConfig } from "axios";
import IUBVoucherReport from "../../_Interface/IUBVoucherReport";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { insertLogs } from "../../../Components/Functions/InsertLogs";
import * as ExcelJS from "exceljs";
import ILocations from "../../_Interface/ILocations";
import StyledSnackBar from "../../../Components/ReusableComponents/NotificationComponents/StyledAlert";
import StyledScrollBox from '../../../Components/ReusableComponents/ScrollBarComponents/StyledScrollBar';
import StyledButton from '../../../Components/ReusableComponents/ButtonComponents/StyledButton';
import StyledTableCellHeader from "../../../Components/ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellBody from "../../../Components/ReusableComponents/TableComponents/StyledTableCellBody";
import StyledTableCellNoData from "../../../Components/ReusableComponents/TableComponents/StyledTableCellNoData";
import api from "../../../Config/AxiosConfig";

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

const UnionBankVoucherReport = () => {
  
  const getClub = window.localStorage.getItem("club");
  const getId = window.localStorage.getItem("Id");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<IUBVoucherReport[]>([]);
  const [selected, setSelected] = useState<string[]>(["9999011984"]);
  const getRoleId = window.localStorage.getItem("roleId");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "warning" | "info" | "success">("success"); 
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [selectedLocationCodes, setSelectedLocationCodes] = useState<number[]>([]);
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const formattedDateTo = selectedDateTo?.format("YYYY-MM-DD HH:mm:ss.SSS");
  let roleId = 0;
  let club = 0;
  let Id = "";

  useEffect(() => {
    document.title = `${roleId === 2 ? "CSI" : roleId === 1 ? "Accounting" : "Maintenance"} | UnionBank Voucher Reports`;
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
    action: "UnionBank Voucher Report",
  };

  const fetchGenerateUBVoucher = async () => {
    try {
      setLoading(true);
      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Analytics/GenerateUBVoucher`,
        data: anaylticsParam,
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

  useEffect(() => {
    if (formattedDateFrom && selected.length >= 1) {
      fetchGenerateUBVoucher();
    }
  }, [
    ,
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
    setEditRowId(null); 
  };

  const handleChangeDateTo = (newValue: Dayjs | null) => {
    setSelectedDateTo(newValue);
    setEditRowId(null); 
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

      const filename = `UB Voucher Report - ${dateRange}_${formattedHours}${formattedMinutes}${formattedSeconds}.xlsx`;

      if (generatedInvoice.length >= 1) {
        const customerName = "UnionBank Voucher Report";
        const sheetName = "UnionBank Voucher";
        const header = [
          "CLUB",
          "DATE REDEEMED",
          "PIZZA VOUCHER SERIES NO.",
          "TRANSACTION NUMBER",
          "SKU",
          "DESCRIPTION",
          "SRP",
          "UNION BANK",
          "KMC",
        ];
        const additionalHeaders = [customerName, dateRange];

        const formattedData = generatedInvoice.map((item) => {
          const transactionDate = item.TransactionDate
            ? new Date(item.TransactionDate)
            : null;

          return {
            CLUB: item.LocationId,
            "DATE REDEEMED": transactionDate
              ? `${transactionDate.getFullYear()}-${(
                  transactionDate.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}-${transactionDate
                  .getDate()
                  .toString()
                  .padStart(2, "0")}`
              : "",
            "PIZZA VOUCHER SERIES NO.": item.OrderNo,
            "TRANSACTION NUMBER": item.TransactionNo,
            SKU: item.SKU,
            DESCRIPTION: item.Description,
            SRP: item.SRP ? item.SRP.toFixed(2) : null,
            "UNION BANK": item.UnionBank ? item.UnionBank.toFixed(2) : null,
            KMC: item.KMC ? item.KMC.toFixed(2) : null,
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
              ["CLUB", "DATE REDEEMED", "PIZZA VOUCHER SERIES NO."].includes(
                header[colIndex]
              )
            ) {
              cell.alignment = {
                horizontal: "center",
                vertical: "middle",
              };
            }

            if (
              ["SRP", "UNION BANK", "KMC"].includes(header[colIndex]) &&
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
        link.download = filename
        link.click();

        URL.revokeObjectURL(blobUrl);

        setIsSnackbarOpen(true);
        setSnackbarSeverity("success");
        setMessage("UB Voucher report generated successfully");

        const anaylticsParamUpdated: IAnalyticProps = {
          dates: [
            formattedDateFrom?.toString() || "",
            formattedDateTo?.toString() || "",
          ],
          memCode: [selected.toString()],
          userId: Id,
          storeId: [club],
          action: "UB Voucher Report",
          fileName: filename,
        };

        await insertLogs(anaylticsParamUpdated);
      } else {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("warning");
        setMessage("No UB Voucher Report found.");
      }
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
        const config: AxiosRequestConfig = {
          method: "POST",
          url: `/Analytics/GetLocations`,
        };

        await api(config)
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
  }, []);
  const totalSRP = generatedInvoice.reduce(
    (sum, item) => sum + (item.SRP || 0),
    0
  );
  const totalUnionBank = generatedInvoice.reduce(
    (sum, item) => sum + (item.UnionBank || 0),
    0
  );
  const totalKMC = generatedInvoice.reduce(
    (sum, item) => sum + (item.KMC || 0),
    0
  );

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
            UnionBank PV Issuance Reports
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
                <Typography>Export UnionBank Voucher Report</Typography>
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
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Club</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Date Redeemed</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Pizza Voucher Series No.</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Transaction Number</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>SKU</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>Description</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>SRP</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>UnionBank</StyledTableCellHeader>
                  <StyledTableCellHeader style={{ textAlign: "center" }}>KMC</StyledTableCellHeader>
                  {/* <StyledTableCell style={{ textAlign: 'center' }}>Action</StyledTableCell> */}
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
                  generatedInvoice.map((item, index) => (
                    <TableRow key={index} sx={{ "& td": { border: 0 } }}>
                      <StyledTableCellBody style={{ textAlign: "center" }}>{item.LocationId}</StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>
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
                      <StyledTableCellBody style={{ textAlign: "center" }}>{item.OrderNo}</StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>{item.TransactionNo}</StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>{item.SKU}</StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "center" }}>{item.Description}</StyledTableCellBody>
                      <StyledTableCellBody style={{ textAlign: "right", paddingRight: "40px" }}>
                        {item.SRP !== null
                          ? item.SRP >= 1000
                            ? item.SRP.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : item.SRP.toFixed(2)
                          : "0.00"}
                      </StyledTableCellBody>
                      <StyledTableCellBody
                        style={{ textAlign: "right", paddingRight: "40px" }}
                      >
                        {item.UnionBank !== null
                          ? item.UnionBank >= 1000
                            ? item.UnionBank.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : item.UnionBank.toFixed(2)
                          : "0.00"}
                      </StyledTableCellBody>
                      <StyledTableCellBody
                        style={{ textAlign: "right", paddingRight: "40px" }}
                      >
                        {item.KMC !== null
                          ? item.KMC >= 1000
                            ? item.KMC.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : item.KMC.toFixed(2)
                          : "0.00"}
                      </StyledTableCellBody>
                    </TableRow>
                  ))
                )}
                {generatedInvoice.length > 0 && (
                  <TableRow
                    sx={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}
                  >
                    <StyledTableCellBody
                      colSpan={6}
                      style={{ textAlign: "right" }}
                    >
                      Total
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{ textAlign: "right", paddingRight: "40px" }}
                    >
                      {totalSRP >= 1000
                        ? totalSRP.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : totalSRP.toFixed(2)}
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{ textAlign: "right", paddingRight: "40px" }}
                    >
                      {totalUnionBank >= 1000
                        ? totalUnionBank.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : totalUnionBank.toFixed(2)}
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{ textAlign: "right", paddingRight: "40px" }}
                    >
                      {totalKMC >= 1000
                        ? totalKMC.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : totalKMC.toFixed(2)}
                    </StyledTableCellBody>
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

export default UnionBankVoucherReport;
