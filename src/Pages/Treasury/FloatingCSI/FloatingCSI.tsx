import {
  Box,
  CircularProgress,
  Grid,
  Icon,
  InputBase,
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
import StyledTableCellHeader from "../../../Components/ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellNoData from "../../../Components/ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellBody from "../../../Components/ReusableComponents/TableComponents/StyledTableCellBody";
import StyledTableCellSubHeader from "../../../Components/ReusableComponents/TableComponents/StyledTableCellSubHeader";
import IAnalytics from "../../_Interface/IAnalytics";
import StyledScrollBox from "../../../Components/ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellTotal from "../../../Components/ReusableComponents/TableComponents/StyledTableCellTotal";
import { useCallback, useEffect, useImperativeHandle, useState, forwardRef } from "react";
import HeaderButtons from "../../../Components/Common/HeaderButtons";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from '@mui/icons-material/Search';
import dayjs, { Dayjs } from "dayjs";
import CustomerDropdown from "../../../Components/Common/CustomerDropdown";
import StyledButton from "../../../Components/ReusableComponents/ButtonComponents/StyledButton";
import IAnalyticProps from "../../_Interface/IAnalyticsProps";
import { AxiosRequestConfig } from "axios";
import api from "../../../Config/AxiosConfig";
import StyledActionButton from "../../../Components/ReusableComponents/ButtonComponents/StyledActionButton";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import StyledSnackBar from "../../../Components/ReusableComponents/NotificationComponents/StyledAlert";
import ModalComponent from "../../../Components/Common/ModalComponent";

interface IUpdateFloatingCSI {
  Id: number;
  CustomerCode?: string[];
  UserId?: string;
  StoreId?: string;
  OrderNo?: string;
  refreshAnalyticsDto?: IAnalyticProps
}

const FloatingCSI: React.FC = () => {
  const getClub = window.localStorage.getItem("club");
  const getId = window.localStorage.getItem("Id");
  const [loading, setLoading] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null | undefined>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [selected, setSelected] = useState<string[]>(['All']);
  const [selectedEdit, setSelectedEdit] = useState<string[]>([]);
  const [editRowIdChild, setEditRowIdChild] = useState<string | null>(null);
  const [editedOrderNo, setEditedOrderNo] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState< "error" | "warning" | "info" | "success">("success"); 
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); 
  const [message, setMessage] = useState<string>("");
  const [openSubmit, setOpenSubmit] = useState<boolean>(false);
  const [analyticsId, setAnalyticsId] = useState<number>(0); 
  const [orderNo, setOrderNo] = useState<string>(""); 
  const [customerId, setCustomerId] = useState<string[]>([]);

  let club = 0;
  if (getClub !== null) {
    club = parseInt(getClub, 10);
  }

  let Id = "";
  if (getId !== null) {
    Id = getId;
  }
  const handleCloseSubmit = () => {
    setOpenSubmit(false);
  };

  const handleOpenSubmit = (id: number, orderNo: string, customerId: string[]) => {
    setOpenSubmit(true);
    setAnalyticsId(id);
    setOrderNo(orderNo);
    setCustomerId(customerId)
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

  const handleCancelEdit = () => {
    setEditRowIdChild(null);
  };

  const handleEdit = (orderNo: string, customerId: string[], id: string) => {
    setEditRowIdChild(id);
    setEditedOrderNo(orderNo);
    setSelectedEdit(customerId);
  };

  const fetchFloatingCsi = useCallback(async (anaylticsParam: IAnalyticProps) => {
    try {
      setLoading(true);

      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Analytics/GetFloatingAnalytics`,
        data: anaylticsParam,
      };

      await api(config)
        .then(async (response) => {
          setAnalytics(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChangeDateTo = (newValue: Dayjs | null) => {
    setSelectedDateTo(newValue);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  useEffect(() => {
    const defaultDate = dayjs();
    setSelectedDateFrom(defaultDate);
    setSelectedDateTo(defaultDate);
    setSelected(["All"]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedDateFrom !== null && selectedDateTo !== null) {
          const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
          const formattedDateTo = selectedDateTo?.format("YYYY-MM-DD HH:mm:ss.SSS");
          const anaylticsParam: IAnalyticProps = {
            dates: [
              formattedDateFrom?.toString()
                ? formattedDateFrom?.toString()
                : "",
              formattedDateTo?.toString() ? formattedDateTo?.toString() : "",],
            memCode: [""],
            userId: Id,
            storeId: [club],
            SearchQuery: searchQuery,
          };

          await fetchFloatingCsi(anaylticsParam);
        }
      } catch (error) {
        
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [
    fetchFloatingCsi,
    selectedDateFrom,
    selectedDateTo,
    club,
    searchQuery,
  ]);

  const handleSaveCustomerIdOrderNo = async () => {
    try {
      const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
      const formattedDateTo = selectedDateTo?.format("YYYY-MM-DD HH:mm:ss.SSS");

      const anaylticsParam: IAnalyticProps = {
            dates: [
              formattedDateFrom?.toString()
                ? formattedDateFrom?.toString()
                : "",
              formattedDateTo?.toString() ? formattedDateTo?.toString() : "",],
            memCode: [""],
            userId: Id,
            storeId: [club],
          };

      const update: IUpdateFloatingCSI = {
        Id: analyticsId,
        CustomerCode: customerId,
        UserId: Id.toString(),
        StoreId: club.toString(),
        OrderNo: orderNo,
        refreshAnalyticsDto: anaylticsParam,
      };
      if (orderNo.length > 0 || customerId.length > 0) {
        const config: AxiosRequestConfig = {
          method: "PUT",
          url: `/Analytics/UpdateFloatingAnalytics`,
          data: update,
        };

        try {
          const result = await api(config);
          if (result.data === true) {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("success");
            setMessage("Successfully saved!");
            setOpenSubmit(false);
            await fetchFloatingCsi(anaylticsParam);
          } else {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Error saving Customer / Order No");
            setOpenSubmit(false);
          }
        } catch (error) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Error saving Customer / Order No");
          setOpenSubmit(false);
        }
      } else {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Error saving Customer / Order No");
        setOpenSubmit(false);
      }
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error saving Customer / Order No");
      setOpenSubmit(false);
    }
  };

  return (
    <Box
      sx={{
        marginTop: "20px",
        marginLeft: "16px",
        marginRight: "16px",
        flexGrow: 1,
      }}
    >
      <Grid item sx={{ width: "100%", marginBottom: "-3px" }}>
        <Grid item xs={6} md={6} sm={12}>
          <Grid container spacing={1} alignItems="flex-start" direction={"row"}>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  inputFormat="dddd, MMMM DD, YYYY"
                  value={selectedDateFrom}
                  onChange={handleChangeDateFrom}
                  label="Transaction Date From"
                  renderInput={(params: TextFieldProps) => (
                    <TextField
                      size="small"
                      {...params}
                      sx={{
                        fontSize: '12px',
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderRadius: "40px",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#1C2C5A",
                          fontFamily: "Inter",
                          fontWeight: "bold",
                          fontSize: '12px',
                          width: "200px",
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  inputFormat="dddd, MMMM DD, YYYY"
                  value={selectedDateTo}
                  onChange={handleChangeDateTo}
                  label="Transaction Date To"
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
                          fontSize: '12px',
                          width: "200px",
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  width: 250,
                  boxShadow:
                    "inset 1px 1px 1px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)",
                  borderRadius: "20px",
                  backgroundColor: "#F2F2F2",
                  marginBottom: "20px",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1, color: "#1C3766", fontSize: 14 }}
                  placeholder="Transaction No."
                  inputProps={{
                    "aria-label": "Search",
                    value: searchQuery,
                    onChange: handleSearchInputChange,
                  }}
                />
                <Icon sx={{ p: "10px", color: "#1C3766" }} aria-label="search">
                  <SearchIcon />
                </Icon>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "white",
          boxShadow: "0px 0px 17px -1px rgba(0,0,0,0.3)",
          textAlign: "center",
          borderRadius: "20px",
        }}
      >
        <Box style={{ position: "relative", }}>
          <StyledScrollBox
            component={Paper}
            sx={{
              height: "755px",
              position: "relative",
              paddingTop: "10px",
              borderRadius: '20px',
              boxShadow: "none",
              paddingLeft: "20px",
              paddingRight: "20px",
              backgroundColor: "#ffffff",
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
                position: "relative", // Add this line to make the container relative,
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
                  <StyledTableCellHeader>Location</StyledTableCellHeader>
                  <StyledTableCellHeader>Date</StyledTableCellHeader>
                  <StyledTableCellHeader>Account No.</StyledTableCellHeader>
                  <StyledTableCellHeader>Membership No.</StyledTableCellHeader>
                  <StyledTableCellHeader>Cashier No.</StyledTableCellHeader>
                  <StyledTableCellHeader>Register No.</StyledTableCellHeader>
                  <StyledTableCellHeader>TRX No.</StyledTableCellHeader>
                  <StyledTableCellHeader>Order No.</StyledTableCellHeader>
                  <StyledTableCellHeader>Qty</StyledTableCellHeader>
                  <StyledTableCellHeader>Amount</StyledTableCellHeader>
                  <StyledTableCellHeader>Actions</StyledTableCellHeader>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  maxHeight: "calc(100% - 48px)",
                  overflowY: "auto",
                  position: "relative",
                  height: '258px'
                }}
              >
                {loading ? (
                  <TableRow sx={{ "& td": { border: 0 }}}>
                    <TableCell colSpan={12} align="center">
                      <CircularProgress size={80} />
                    </TableCell>
                  </TableRow>
                ) : analytics?.length === 0 ? (
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
                  analytics.map((row) => {
                    const isEditing = editRowIdChild === row.Id.toString();
                    return (
                    <TableRow
                      key={row.Id}
                      sx={{
                        "& td": {
                          border: 0,
                        },
                        "&:hover": {
                          backgroundColor: "#ECEFF1",
                        },
                      }}
                    >
                      <StyledTableCellBody>{row.LocationName}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.TransactionDate !== null
                          ? new Date(row.TransactionDate ?? "").toLocaleDateString(
                              "en-CA",
                              {
                                year: "numeric",
                                month: "short", // or 'long' for full month name
                                day: "numeric",
                              }
                            )
                          : ""}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {editRowIdChild === row.Id.toString() ? (
                          <CustomerDropdown
                            setSelected={setSelectedEdit}
                            selection="single"
                            byMerchant={true}
                            isAllVisible={false}
                            isTextSearch={true}
                            isLabel={false}
                            width="250px"
                            fontSize="12px"
                            height="35px"
                          />
                        ) : (
                          row.CustomerName
                        )}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{row.MembershipNo}</StyledTableCellBody>
                      <StyledTableCellBody>{row.CashierNo}</StyledTableCellBody>
                      <StyledTableCellBody>{row.RegisterNo}</StyledTableCellBody>
                      <StyledTableCellBody>{row.TransactionNo}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {editRowIdChild === row.Id.toString() ? (
                          <TextField
                            fullWidth
                            value={editedOrderNo}
                            onChange={(e) =>
                              setEditedOrderNo(e.target.value)
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
                          row.OrderNo
                        )}
                      </StyledTableCellBody>
                      <StyledTableCellBody>{row.Qty}</StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.SubTotal !== undefined ? row.SubTotal?.toFixed(2) : ""}
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
                                    handleOpenSubmit(row.Id, editedOrderNo, selectedEdit)
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
                                  handleEdit(
                                    row.OrderNo || "",
                                    [row.CustomerId || ""], 
                                    row.Id.toString()
                                  )
                                }
                              >
                                <EditIcon />
                              </StyledActionButton>
                            )}
                          </StyledTableCellBody>
                    </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </StyledScrollBox>
        </Box>
      </Box>
      <StyledSnackBar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={message}
      />
      <ModalComponent
        title="Update Floating Analytics"
        onClose={handleCloseSubmit}
        buttonName="Save"
        open={openSubmit}
        onSave={handleSaveCustomerIdOrderNo}
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
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  Please confirm the following details before proceeding:
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                  <strong>Customer Code:</strong> {selectedEdit || 'N/A'}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 1 }}>
                  <strong>Order No:</strong> { editedOrderNo || 'N/A'}
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 3 }}>
                  Do you want to save these details?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        }
      />
    </Box>
  );
};

export default FloatingCSI;