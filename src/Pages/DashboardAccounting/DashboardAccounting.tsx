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
  MenuItem,
  Paper,
  Divider,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import CheckIcon from "@mui/icons-material/Check";
import PendingIcon from "@mui/icons-material/Pending";
import ErrorIcon from "@mui/icons-material/Error";
import IDashboardAccounting from "../_Interface/IDashboardAccounting";
import IRefreshAnalytics from "../_Interface/IRefreshAnalytics";
import IAccountingStatus from "../_Interface/IAccountingStatus";
import PaymentReconCards from "../../Components/Common/PaymentReconCards";
import IAccountingStatusMatch from "../_Interface/IAccountingStatusMatch";
import IAnalyticProps from "../_Interface/IAnalyticsProps";
import api from "../../Config/AxiosConfig";
import StyledScrollBox from "../../Components/ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellHeader from "../../Components/ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellBody from "../../Components/ReusableComponents/TableComponents/StyledTableCellBody";

const accountingStatus: IAccountingStatus[] = [
  { Id: 1, StatusId: [1, 2, 3, 4, 5, 6], StatusName: "All" },
  { Id: 2, StatusId: [1], StatusName: "Paid" },
  { Id: 3, StatusId: [2], StatusName: "Underpaid" },
  { Id: 4, StatusId: [3], StatusName: "Overpaid" },
  { Id: 5, StatusId: [4], StatusName: "Not Reported" },
  { Id: 6, StatusId: [5], StatusName: "Unpaid" },
  { Id: 7, StatusId: [6], StatusName: "Adjustments" },
];

const DashboardAccounting = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<
    Dayjs | null | undefined
  >(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<
    IDashboardAccounting[]
  >([]);
  const [selected, setSelected] = useState<string>("All");
  const [status, setStatus] = useState<IAccountingStatusMatch[]>([]);

  const formattedDateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const analyticsParam: IRefreshAnalytics = {
    dates: [
      formattedDateFrom ? formattedDateFrom : "",
      formattedDateFrom ? formattedDateFrom : "",
    ],
    memCode: [],
    userId: "",
    storeId: [0],
  };

  const updatedParam = {
    Path: "",
    BatFilePath: "",
    analyticsParamsDto: analyticsParam,
  };

  useEffect(() => {
    if (formattedDateFrom) {
      setLoading(true);
      setGeneratedInvoice([]);
      const fetchGenerateInvoice = async () => {
        try {
          const config: AxiosRequestConfig = {
            method: "POST",
            url: `/Analytics/DashboardAccounting`,
            data: updatedParam,
          };

          await api(config)
            .then(async (response) => {
              setGeneratedInvoice([]);
              setGeneratedInvoice(response.data);
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

      fetchGenerateInvoice();
    }
  }, [, formattedDateFrom]);

  useEffect(() => {
    const defaultDate = dayjs().startOf("day").subtract(1, "day");
    setSelectedDateFrom(defaultDate);
    setLoading(false);
  }, []);

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChange = (value: string) => {
    const sanitizedValue = value !== undefined ? value : "";
    setSelected(sanitizedValue);
  };

  useEffect(() => {
    document.title = "Accounting | Dashboard";
  }, []);

  const fetchGrabFoodMatch = useCallback(
    async (anaylticsParam: IAnalyticProps) => {
      try {
        setLoading(true);
        const config: AxiosRequestConfig = {
          method: "POST",
          url: `/Analytics/GetAccountingProofListVariance`,
          data: anaylticsParam,
        };

        const response = await api(config);
        const result1 = response.data.Item2;

        if (result1 != null) {
          setStatus(result1);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedDateFrom !== null) {
          const formattedDateFrom = selectedDateFrom?.format(
            "YYYY-MM-DD HH:mm:ss.SSS"
          );
          const anaylticsParam: IAnalyticProps = {
            dates: [
              formattedDateFrom?.toString()
                ? formattedDateFrom?.toString()
                : "",
              formattedDateFrom?.toString()
                ? formattedDateFrom?.toString()
                : "",
            ],
            memCode: [
              "9999011929",
              "9999011955",
              "9999011855",
              "9999011935",
              "9999011931",
              "9999011838",
            ],
            userId: "",
            storeId: [],
            status: [selected],
            isView: false,
          };
          await fetchGrabFoodMatch(anaylticsParam);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fetchGrabFoodMatch, selectedDateFrom, selected]);

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
          gutterBottom
          sx={{
            fontWeight: "bold",
            marginBottom: "10px",
            fontSize: "18px",
            color: "#1C2C5A",
          }}
        >
          Submitted CSI
        </Typography>
        <Divider sx={{ marginBottom: "10px" }} />
        <Grid container spacing={1} alignItems="flex-start" direction={"row"}>
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
        </Grid>
        <Divider sx={{ marginTop: "10px" }} />
        <StyledScrollBox
          component={Paper}
          sx={{
            height: "370px",
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
              borderSpacing: "6px 6px",
            }}
            aria-label="spanning table"
          >
            <TableHead
              sx={{
                height: "10px",
                zIndex: 3,
                position: "sticky",
                top: "-10px",
                backgroundColor: "#ffffff",
              }}
            >
              <TableRow sx={{ minWidth: 700 }}>
                <StyledTableCellHeader style={{ textAlign: "center" }}>
                  Club
                </StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>
                  Grab Mart
                </StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>
                  Grab Food
                </StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>
                  Pick A Roo Merch
                </StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>
                  Pick A Roo FS
                </StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>
                  Food Panda
                </StyledTableCellHeader>
                <StyledTableCellHeader style={{ textAlign: "center" }}>
                  MetroMart
                </StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow sx={{ "& td": { border: 0 } }}>
                  <StyledTableCellBody colSpan={12} align="center">
                    <CircularProgress size={80} />
                  </StyledTableCellBody>
                </TableRow>
              ) : generatedInvoice.map((item: IDashboardAccounting) => (
                  <TableRow
                    key={item.LocationCode}
                    sx={{ "& td": { border: 0 } }}
                  >
                    <StyledTableCellBody>
                      {item.LocationName}
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{
                        width: "200px",
                        borderRadius: "10px",
                        textAlign: "center",
                        backgroundColor:
                          item.GrabMart === null
                            ? "#FFB5B5"
                            : item.GrabMart === 3
                            ? "#E3FBE3"
                            : "#FFCF97",
                        color:
                          item.GrabMart === null
                            ? "#A85A5A"
                            : item.GrabMart === 3
                            ? "#3F743F"
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
                        {item.GrabMart === null ? (
                          <ErrorIcon
                            style={{
                              color: "#A85A5A",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
                        ) : item.GrabMart === 3 ? (
                          <CheckIcon
                            style={{
                              color: "#3F743F",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
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
                        {item.GrabMart === null
                          ? "No Analytics"
                          : item.GrabMart === 3
                          ? "Submitted"
                          : "Pending"}
                      </span>
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{
                        width: "200px",
                        borderRadius: "10px",
                        textAlign: "center",
                        backgroundColor:
                          item.GrabFood === null
                            ? "#FFB5B5"
                            : item.GrabFood === 3
                            ? "#E3FBE3"
                            : "#FFCF97",
                        color:
                          item.GrabFood === null
                            ? "#A85A5A"
                            : item.GrabFood === 3
                            ? "#3F743F"
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
                        {item.GrabFood === null ? (
                          <ErrorIcon
                            style={{
                              color: "#A85A5A",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
                        ) : item.GrabFood === 3 ? (
                          <CheckIcon
                            style={{
                              color: "#3F743F",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
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
                        {item.GrabFood === null
                          ? "No Analytics"
                          : item.GrabFood === 3
                          ? "Submitted"
                          : "Pending"}
                      </span>
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{
                        width: "200px",
                        borderRadius: "10px",
                        textAlign: "center",
                        backgroundColor:
                          item.PickARooMerch === null
                            ? "#FFB5B5"
                            : item.PickARooMerch === 3
                            ? "#E3FBE3"
                            : "#FFCF97",
                        color:
                          item.PickARooMerch === null
                            ? "#A85A5A"
                            : item.PickARooMerch === 3
                            ? "#3F743F"
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
                        {item.PickARooMerch === null ? (
                          <ErrorIcon
                            style={{
                              color: "#A85A5A",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
                        ) : item.PickARooMerch === 3 ? (
                          <CheckIcon
                            style={{
                              color: "#3F743F",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
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
                        {item.PickARooMerch === null
                          ? "No Analytics"
                          : item.PickARooMerch === 3
                          ? "Submitted"
                          : "Pending"}
                      </span>
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{
                        width: "200px",
                        borderRadius: "10px",
                        textAlign: "center",
                        backgroundColor:
                          item.PickARooFS === null
                            ? "#FFB5B5"
                            : item.PickARooFS === 3
                            ? "#E3FBE3"
                            : "#FFCF97",
                        color:
                          item.PickARooFS === null
                            ? "#A85A5A"
                            : item.PickARooFS === 3
                            ? "#3F743F"
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
                        {item.PickARooFS === null ? (
                          <ErrorIcon
                            style={{
                              color: "#A85A5A",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
                        ) : item.PickARooFS === 3 ? (
                          <CheckIcon
                            style={{
                              color: "#3F743F",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
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
                        {item.PickARooFS === null
                          ? "No Analytics"
                          : item.PickARooFS === 3
                          ? "Submitted"
                          : "Pending"}
                      </span>
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{
                        width: "200px",
                        borderRadius: "10px",
                        textAlign: "center",
                        backgroundColor:
                          item.FoodPanda === null
                            ? "#FFB5B5"
                            : item.FoodPanda === 3
                            ? "#E3FBE3"
                            : "#FFCF97",
                        color:
                          item.FoodPanda === null
                            ? "#A85A5A"
                            : item.FoodPanda === 3
                            ? "#3F743F"
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
                        {item.FoodPanda === null ? (
                          <ErrorIcon
                            style={{
                              color: "#A85A5A",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
                        ) : item.FoodPanda === 3 ? (
                          <CheckIcon
                            style={{
                              color: "#3F743F",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
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
                        {item.FoodPanda === null
                          ? "No Analytics"
                          : item.FoodPanda === 3
                          ? "Submitted"
                          : "Pending"}
                      </span>
                    </StyledTableCellBody>
                    <StyledTableCellBody
                      style={{
                        width: "200px",
                        borderRadius: "10px",
                        textAlign: "center",
                        backgroundColor:
                          item.MetroMart === null
                            ? "#FFB5B5"
                            : item.MetroMart === 3
                            ? "#E3FBE3"
                            : "#FFCF97",
                        color:
                          item.MetroMart === null
                            ? "#A85A5A"
                            : item.MetroMart === 3
                            ? "#3F743F"
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
                        {item.MetroMart === null ? (
                          <ErrorIcon
                            style={{
                              color: "#A85A5A",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
                        ) : item.MetroMart === 3 ? (
                          <CheckIcon
                            style={{
                              color: "#3F743F",
                              fontSize: "15px",
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
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
                        {item.MetroMart === null
                          ? "No Analytics"
                          : item.MetroMart === 3
                          ? "Submitted"
                          : "Pending"}
                      </span>
                    </StyledTableCellBody>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </StyledScrollBox>
        <Divider sx={{ marginBottom: "10px", paddingTop: "2px" }} />
        <Typography
          gutterBottom
          sx={{
            fontWeight: "bold",
            marginBottom: "10px",
            fontSize: "18px",
            color: "#1C2C5A",
          }}
        >
          Payment Recon
        </Typography>
        <Divider sx={{ marginBottom: "10px" }} />
        <TextField
          variant="outlined"
          size="small"
          type="text"
          required
          label="Status"
          select
          value={selected}
          onChange={(e) => handleChange(e.target.value)}
          InputProps={{
            sx: {
              borderRadius: "40px",
              backgroundColor: "#FFFFFF",
              height: "40px",
              width: "145px",
              fontSize: "15px",
              fontFamily: "Inter",
              fontWeight: "bold",
              color: "#1C2C5A",
            },
          }}
        >
          {accountingStatus.map((item: IAccountingStatus) => (
            <MenuItem key={item.Id} value={item.StatusName}>
              {item.StatusName}
            </MenuItem>
          ))}
        </TextField>

      {/* <PaymentReconCards isDashboard={true} statusMatch={status} /> */}
      </Paper>
    </Box>
  );
};

export default DashboardAccounting;