import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ModalComponent from "../../../../Components/Common/ModalComponent";
import IAnalytics from "../../../_Interface/IAnalytics";
import ILocations from "../../../_Interface/ILocations";
import IAnalyticsToDeleteProps from "../../../_Interface/IAnalyticsToDeleteProps";
import IRefreshAnalytics from "../../../_Interface/IRefreshAnalytics";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import CustomerDropdown from "../../../../Components/Common/CustomerDropdown";
import api from "../../../../Config/AxiosConfig";
import StyledButton from "../../../../Components/ReusableComponents/ButtonComponents/StyledButton";
import StyledScrollBox from "../../../../Components/ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellHeader from "../../../../Components/ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellNoData from "../../../../Components/ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellBody from "../../../../Components/ReusableComponents/TableComponents/StyledTableCellBody";
import StyledSnackBar from "../../../../Components/ReusableComponents/NotificationComponents/StyledAlert";

const UndoSubmit = () => {
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const [selected, setSelected] = useState<string[]>([] as string[]);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [selectedLocation, setSelectedLocation] = useState<number>(201);
  const [isModalOpenUndo, setIsModalOpenUndo] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "warning" | "info" | "success">("success");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 20;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Maintenance | Undo Submit Analytics";
  }, []);

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

  const handleChangeLocation = (value: any) => {
    const sanitizedValue = value !== undefined ? value : "";
    setSelectedLocation(sanitizedValue);
  };

  const handleCloseUndo = useCallback(() => {
    setIsModalOpenUndo(false);
  }, []);

  const handleUndoModalClick = () => {
    setIsModalOpenUndo(true);
  };

  useEffect(() => {
    const defaultDate = dayjs();
    setSelectedDateFrom(defaultDate);
  }, []);

  const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");

  const fetchAnalytics = useCallback(
    async (
      date: string | null | undefined,
      code: any,
      storeid: number,
      page: number,
      itemsPerPage: number
    ) => {
      try {
        const anaylticsParam: IAnalyticsToDeleteProps = {
          date: date?.toString() ? date?.toString() : "",
          memCode: code,
          storeId: storeid,
          PageNumber: page,
          PageSize: itemsPerPage,
        };
        const config: AxiosRequestConfig = {
          method: "POST",
          url: `/Analytics/GetAnalyticsToUndoSubmit`,
          data: anaylticsParam,
        };

        const response = await api(config);
        setAnalytics(response.data.Item1);
        console.log(response.data.Item1);
        setPageCount(response.data.Item2);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    []
  );

  useEffect(() => {
    if (formattedDateFrom && selected.length && selectedLocation) {
      setLoading(true);
      setAnalytics([]);
      setPageCount(0);
      fetchAnalytics(
        formattedDateFrom,
        selected,
        selectedLocation,
        page,
        itemsPerPage
      );
      setLoading(false);
    }
  }, [, formattedDateFrom, selected, selectedLocation, fetchAnalytics]);

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
          .catch(() => {});
      } catch (error) {}
    };

    fetchLocations();
  }, []);

  const handleUndoClick = async () => {
    try {
      if (!selectedDateFrom || !selected || !selectedLocation) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Please check required fields");
        setIsModalOpenUndo(false);
        return;
      }

      const formattedDate = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
      const customerCodesArray: string[] = selected.map(String);
      console.log("customerCodesArray", customerCodesArray);
      const updatedParam: IRefreshAnalytics = {
        dates: [
          formattedDate ? formattedDate : "",
          formattedDate ? formattedDate : "",
        ],
        memCode: customerCodesArray,
        userId: "",
        storeId: [selectedLocation],
      };

      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Analytics/UndoSubmitAnalytics`,
        data: updatedParam,
      };

      await api(config)
        .then(async (result) => {
          if (result.data === true) {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("success");
            setMessage("Analytics Successfully Revert");
            setIsModalOpenUndo(false);
          } else {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Error reverting analytics. Please try again!");
            setIsModalOpenUndo(false);
          }
        })
        .catch((error) => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Error reverting analytics");
        });
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error reverting analytics");
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
          height: "750px",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", marginBottom: "10px", color: "#1C2C5A" }}
        >
          Undo Submit Analytics
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
                onChange={handleChangeDateFrom}
                label="Transaction Date"
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
              label="Club"
              required
              select
              value={selectedLocation} // Default to an empty string if undefined
              onChange={(e) => handleChangeLocation(e.target.value)}
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
              {locations.map((item: ILocations) => (
                <MenuItem key={item.Id} value={item.LocationCode}>
                  {item.LocationCode + " - " + item.LocationName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3.1} sx={{ paddingTop: "15px" }}>
            <StyledButton
              sx={{
                color: "white",
                fontSize: "16px",
                backgroundColor: "#1C3766",
                width: "100%",
                borderRadius: "20px",
                fontFamily: "Inter",
                fontWeight: "900",
              }}
              onClick={handleUndoModalClick}
            >
              <UndoRoundedIcon sx={{ marginRight: "5px" }} />
              <Typography>Undo Submit</Typography>
            </StyledButton>
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: "20px" }} />
        <StyledScrollBox
          component={Paper}
          sx={{
            height: "390px",
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
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCellHeader>Customer Name</StyledTableCellHeader>
                <StyledTableCellHeader>Location Name</StyledTableCellHeader>
                <StyledTableCellHeader>Transaction Date</StyledTableCellHeader>
                <StyledTableCellHeader>Membership No</StyledTableCellHeader>
                <StyledTableCellHeader>Cashier No</StyledTableCellHeader>
                <StyledTableCellHeader>Register No</StyledTableCellHeader>
                <StyledTableCellHeader>Transaction No</StyledTableCellHeader>
                <StyledTableCellHeader>Order No</StyledTableCellHeader>
                <StyledTableCellHeader>Qty</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>SubTotal</StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow sx={{ "& td": { border: 0 } }}>
                  <StyledTableCellBody colSpan={12} align="center">
                    <CircularProgress size={80} />
                  </StyledTableCellBody>
                </TableRow>
              ) : analytics.length === 0 ? (
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
                analytics.map((item: IAnalytics) => {
                  return (
                    <TableRow hover key={item.Id}>
                      <StyledTableCellBody>
                        {item.CustomerName}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {item.LocationName}
                      </StyledTableCellBody>
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
                      <StyledTableCellBody>
                        {item.MembershipNo}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {item.CashierNo}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {item.RegisterNo}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {item.TransactionNo}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{item.OrderNo}</StyledTableCellBody>
                      <StyledTableCellBody>{item.Qty}</StyledTableCellBody>
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
                      <StyledTableCellBody>
                        {item.SubTotal != null
                          ? item.SubTotal >= 1000
                            ? item.SubTotal.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : item.SubTotal.toFixed(2)
                          : "0.00"}
                      </StyledTableCellBody>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </StyledScrollBox>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
          <Pagination
            variant="outlined"
            shape="rounded"
            count={pageCount}
            page={page}
            onChange={(event, value) => {
              setPage(value);
              if (formattedDateFrom != null) {
                fetchAnalytics(
                  formattedDateFrom,
                  selected,
                  selectedLocation,
                  value,
                  itemsPerPage
                );
              }
            }}
          />
        </Box>
      </Paper>
      <StyledSnackBar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={message}
      />
      <ModalComponent
        title="Undo Submit Analytics"
        onClose={handleCloseUndo}
        buttonName="Undo"
        open={isModalOpenUndo}
        onSave={handleUndoClick}
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
                    fontSize: "20px",
                    textAlign: "center",
                    marginRight: "-170px",
                  }}
                >
                  Are you sure you want to undo these analytics?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        }
      />
    </Box>
  );
};

export default UndoSubmit;