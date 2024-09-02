import {
  Backdrop,
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
import SyncIcon from '@mui/icons-material/Sync';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import StyledSnackBar from "../../../Components/ReusableComponents/NotificationComponents/StyledAlert";
import ModalComponent from "../../../Components/Common/ModalComponent";
import { red } from "@mui/material/colors";
import IRefreshAnalytics from "../../_Interface/IRefreshAnalytics";

interface IUpdateFloatingCSI {
  Id: number;
  CustomerCode?: string[];
  UserId?: string;
  StoreId?: string;
  OrderNo?: string;
  refreshAnalyticsDto?: IAnalyticProps
}

const memCode = [
  "9999011537", "9999011542", "9999011546", "9999011547", "9999011548",
  "9999011549", "9999011550", "9999011552", "9999011553", "9999011554",
  "9999011559", "9999011563", "9999011565", "9999011571", "9999011572",
  "9999011574", "9999011578", "9999011579", "9999011580", "9999011581",
  "9999011582", "9999011593", "9999011595", "9999011596", "9999011599",
  "9999011600", "9999011601", "9999011604", "9999011611", "9999011617",
  "9999011620", "9999011621", "9999011626", "9999011627", "9999011631",
  "9999011632", "9999011633", "9999011634", "9999011637", "9999011638",
  "9999011639", "9999011640", "9999011641", "9999011642", "9999011644",
  "9999011646", "9999011647", "9999011649", "9999011976", "9999011655",
  "9999011656", "9999011657", "9999011659", "9999011661", "9999011662",
  "9999011663", "9999011665", "9999011667", "9999011671", "9999011672",
  "9999011673", "9999011675", "9999011676", "9999011973", "9999011678",
  "9999011688", "9999011696", "9999011697", "9999011698", "9999011700",
  "9999011702", "9999011707", "9999011710", "9999011714", "9999011724",
  "9999011974", "9999011740", "9999011747", "9999011749", "9999011750",
  "9999011751", "9999011753", "9999011773", "9999011774", "9999011776",
  "9999011785", "9999011789", "9999011792", "9999011793", "9999011794",
  "9999011795", "9999011796", "9999011797", "9999011799", "9999011800",
  "9999011823", "9999011826", "9999011827", "9999011828", "9999011829",
  "9999011838", "9999011841", "9999011850", "9999011851", "9999011852",
  "9999011853", "9999011854", "9999011855", "9999011856", "9999011857",
  "9999011860", "9999011877", "9999011886", "9999011887", "9999011889",
  "9999011894", "9999011898", "9999011900", "9999011903", "9999011904",
  "9999011907", "9999011910", "9999011914", "9999011915", "9999011918",
  "9999011919", "9999011925", "9999011926", "9999011929", "9999011931",
  "9999011933", "9999011935", "9999011936", "9999011944", "9999011945",
  "9999011949", "9999011950", "9999011951", "9999011953", "9999011955",
  "9999011956", "9999011957", "9999011959", "9999011960", "9999011967",
  "9999011968", "9999011971", "9999011972", "9999011978", "9999011983",
  "9999011984", "9999011986", "9999011988", "9999011989", "9999011990",
  "9999011996", "9999011999", "9999012000", "9999012001", "9999012002",
  "9999012003", "9999012005", "9999012006", "9999012008", "9999012009",
  "9999012010", "9999012011", "9999012012", "9999012013", "9999012014",
  "9999012015", "9999012017", "9999012018", "9999012019", "9999012020",
  "9999012021", "9999011977", "9999011975", "9999012024", "9999012025",
  "9999012026", "9999012027", "9999012028", "9999012029", "9999012030",
  "9999012031", "9999012032", "9999012039", "9999012040", "9999012041",
  "9999012042", "9999012043", "9999012044", "9999012045", "9999012046",
  "9999012047", "9999012082", "9999011966", "9999012079", "9999012097",
  "9999012099", "9999012056", "9999012092", "9999012094", "9999011946"
];

const FloatingCSI: React.FC = () => {
  const getClub = window.localStorage.getItem("club");
  const getId = window.localStorage.getItem("Id");
  const [loading, setLoading] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [selected, setSelected] = useState<string[]>(['All']);
  const [selectedEdit, setSelectedEdit] = useState<string[]>([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>('');
  const [editRowIdChild, setEditRowIdChild] = useState<string | null>(null);
  const [editedOrderNo, setEditedOrderNo] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState< "error" | "warning" | "info" | "success">("success"); 
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); 
  const [message, setMessage] = useState<string>("");
  const [openSubmit, setOpenSubmit] = useState<boolean>(false);
  const [analyticsId, setAnalyticsId] = useState<number>(0); 
  const [orderNo, setOrderNo] = useState<string>(""); 
  const [customerId, setCustomerId] = useState<string[]>([]);
  const [openRefresh, setOpenRefresh] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

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
    setEditRowIdChild(null);
  };

  const handleOpenSubmit = (id: number, orderNo: string, customerId: string[]) => {
    if (orderNo === '' && customerId[0].length === 0) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Please select customer and input order no.");
      return;
    }

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
      setEditRowIdChild(null);
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

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  useEffect(() => {
    const defaultDate = dayjs();
    setSelectedDateFrom(defaultDate);
    setSelected(["All"]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedDateFrom !== null) {
          const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
          const anaylticsParam: IAnalyticProps = {
            dates: [
              formattedDateFrom?.toString()
                ? formattedDateFrom?.toString()
                : "",],
            memCode: memCode,
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
    club,
    searchQuery,
  ]);

  const handleSaveCustomerIdOrderNo = async () => {
    try {
      const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");

      const anaylticsParam: IAnalyticProps = {
            dates: [
              formattedDateFrom?.toString()
                ? formattedDateFrom?.toString()
                : "",],
            memCode: [""],
            userId: Id,
            storeId: [club],
          };

      const update: IUpdateFloatingCSI = {
        Id: analyticsId,
        CustomerCode: customerId.length > 0 ? customerId : undefined,
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
            setEditRowIdChild(null);
            await fetchFloatingCsi(anaylticsParam);
          } else {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Error saving Customer / Order No");
            setOpenSubmit(false);
            setEditRowIdChild(null);
          }
        } catch (error) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Error saving Customer / Order No");
          setOpenSubmit(false);
          setEditRowIdChild(null);
        }
      } else {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Error saving Customer / Order No");
        setOpenSubmit(false);
        setEditRowIdChild(null);
      }
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error saving Customer / Order No");
      setOpenSubmit(false);
      setEditRowIdChild(null);
    }
  };

    const handleRefreshClick = async () => {
    try {
      setRefreshing(true);
      setOpenRefresh(false);
      const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
      const updatedParam: IRefreshAnalytics = {
        dates: [
          formattedDateFrom ? formattedDateFrom : "",
          formattedDateFrom ? formattedDateFrom : "",
        ],
        memCode: memCode,
        userId: Id,
        storeId: [club],
      };

      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Analytics/RefreshFloatingCSI`,
        data: updatedParam,
      };

      await api(config)
        .then(async () => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("success");
          setMessage("Success");
          setRefreshing(false);
          setEditRowIdChild(null);
          const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
          const anaylticsParam: IAnalyticProps = {
            dates: [
              formattedDateFrom?.toString()
                ? formattedDateFrom?.toString()
                : "",],
            memCode: [""],
            userId: Id,
            storeId: [club],
            SearchQuery: searchQuery,
          };
          await fetchFloatingCsi(anaylticsParam)

        })
        .catch((error) => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Error reload floating CSI analytics");
          setRefreshing(false);
          console.error("Error reload floating CSI analytics:", error);
        })
        .finally(() => {
          setRefreshing(false);
          setOpenRefresh(false);
        });
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error reload floating CSI analytics");
      setRefreshing(false);
      setOpenRefresh(false);
    }
  };

  const handleCloseRefresh = useCallback(() => {
    setOpenRefresh(false);
  }, []);

  const handleOpenRefresh = () => {
    setOpenRefresh(true);
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
                  label="Transaction Date"
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
            <Grid item>
              <StyledButton
                sx={{
                  color: "white",
                  backgroundColor: "#1C3766",
                  width: "170px",
                  borderRadius: "20px",
                  fontFamily: "Inter",
                  fontWeight: "900",
                  height: "38px",
                  paddingRight: "15px",
                  borderColor: "#1C3766",
                  "& .MuiTypography-root": {
                    fontSize: "14px",
                  },
                }}
                onClick={handleOpenRefresh}
                disabled={ false}
              >
                <SyncIcon sx={{ marginRight: "5px" }} />
                <Typography>Reload</Typography>
              </StyledButton>
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
                  <StyledTableCellHeader>#</StyledTableCellHeader>
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
                  analytics.map((row, index) => {
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
                      <StyledTableCellBody> {index + 1}</StyledTableCellBody>
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
                            setSelectedCustomerName={setSelectedCustomerName}
                            selection="single"
                            byMerchant={true}
                            isAllVisible={false}
                            isTextSearch={true}
                            isLabel={false}
                            width="200px"
                            fontSize="12px"
                            height="35px"
                          />
                        ) : (
                          row.CustomerName ?? row.CustomerId
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
                                width: '200px'
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
      <Backdrop
        sx={{
          color: "#ffffff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={refreshing}
      >
        <CircularProgress size="100px" sx={{ color: "#ffffff" }} />
      </Backdrop>
      <StyledSnackBar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={message}
      />
      <ModalComponent
        title="Confirmation"
        onClose={handleCloseSubmit}
        buttonName="Save"
        open={openSubmit}
        onSave={handleSaveCustomerIdOrderNo}
        children={
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              color: "#1C2C5A",
              fontSize: "20px",
              flexDirection: "column",
              justifyContent: "center", 
              textAlign: "center", 
            }}
          >
            <Typography variant="body1">
              Please confirm the following details before proceeding. Do you want to save these details?
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
              <Box sx={{ textAlign: 'left', paddingRight: '10px' }}>
                <Typography variant="body1">
                  <strong>Customer Code:</strong>
                </Typography>
                <Typography variant="body1">
                  <strong>Customer Name:</strong>
                </Typography>
                <Typography variant="body1">
                  <strong>Order No:</strong>
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body1">
                  {selectedEdit.length > 1 ? selectedEdit : 'N/A'}
                </Typography>
                <Typography variant="body1">
                  {selectedEdit.length > 1 ? selectedCustomerName : 'N/A'}
                </Typography>
                <Typography variant="body1">
                  {editedOrderNo || 'N/A'}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" sx={{ color: "#DA0707", fontWeight: "900", paddingTop: '20px' }}>
              Note: These changes will apply also to MMS
            </Typography>
          </Box>
        </Box>

        }
      />

      <ModalComponent
        title="Reload Floating CSI"
        onClose={handleCloseRefresh}
        buttonName="Reload"
        open={openRefresh}
        onSave={handleRefreshClick}
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
                  Any modifications made will be deleted!
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