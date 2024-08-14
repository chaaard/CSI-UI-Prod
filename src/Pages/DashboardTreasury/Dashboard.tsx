import {
  Box,
  Grid,
  TextField,
  TextFieldProps,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  CircularProgress,
} from "@mui/material";
import GrabMart from "../../Assets/GrabMart.png";
import GrabFood from "../../Assets/GrabFood.png";
import Metromart from "../../Assets/Metromart.png";
import FoodPanda from "../../Assets/FoodPanda.png";
import Lazada from "../../Assets/Lazada.png";
import Shopee from "../../Assets/Shopee.png";
import PickARoo from "../../Assets/PickARoo.png";
import Gcash from "../../Assets/GCash.png";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import PaperComponent from "../../Components/Common/PaperComponent";
import ITransactionProps from "../_Interface/ITransactionProps";
import { useNavigate } from "react-router-dom";
import { fetchTotalAmounts } from "../../Components/Functions/GetTotalAmountPerMechant";
import { fetchTotalAmountTransactions } from "../../Components/Functions/GetTotalAmountTransactions";
import ITransactions from "../_Interface/ITransaction";
import { AxiosRequestConfig } from "axios";
import IMerchants from "../SystemAdmin/Merchants/Interface/IMerchants";
import IVarianceMMS from "../_Interface/IVarianceMMS";
import IAnalyticProps from "../_Interface/IAnalyticsProps";
import IRefreshAnalytics from "../_Interface/IRefreshAnalytics";
import CheckIcon from "@mui/icons-material/Check";
import PendingIcon from "@mui/icons-material/Pending";
import ErrorIcon from "@mui/icons-material/Error";
import StyledScrollBox from "../../Components/ReusableComponents/ScrollBarComponents/StyledScrollBar";
import api from "../../Config/AxiosConfig";
import StyledButton from "../../Components/ReusableComponents/ButtonComponents/StyledButton";
import StyledSnackBar from "../../Components/ReusableComponents/NotificationComponents/StyledAlert";
import StyledTableCellHeader from "../../Components/ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellBody from "../../Components/ReusableComponents/TableComponents/StyledTableCellBody";
import StyledTableCellNoData from "../../Components/ReusableComponents/TableComponents/StyledTableCellNoData";
import { useEffect, useState } from "react";
import ModalComponent from "../../Components/Common/ModalComponent";

const Dashboard = () => {
  const [variance, setVariance] = useState<IVarianceMMS>([] as IVarianceMMS);
  const [varianceSubmit, setVarianceSubmit] = useState<IVarianceMMS[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Dayjs | null>(null);
  const getClub = window.localStorage.getItem("club");
  //const [totalAmounts, setTotalAmounts] = useState<{ [key: string]: number } | null>(null);
  const [totalAmounts, setTotalAmounts] = useState<{
    [key: string]: number[];
  } | null>(null);

  const [totalAmountCount, setTotalAmountCount] = useState<{
    [key: string]: ITransactions;
  } | null>(null);
  const [openSubmit, setOpenSubmit] = useState<boolean>(false);
  const [customerCodes, setCustomerCodes] = useState<IMerchants[]>([]);
  const navigate = useNavigate();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [isSnackbarExceptionOpen, setIsSnackbarExceptionOpen] =
    useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "error" | "warning" | "info" | "success"
  >("success");
  const [snackbarExceptionSeverity, setSnackbarExceptionSeverity] = useState<
    "error" | "warning" | "info" | "success"
  >("success");
  const [message, setMessage] = useState<string>("");
  const [messageException, setExceptionMessage] = useState<string>("");

  const [selectedRows, setSelectedRows] = useState<IVarianceMMS[]>([]);
  const getId = window.localStorage.getItem("Id");
  const [loading, setLoading] = useState<boolean>(false);
  const [enableSubmitAll, setEnableSubmitAll] = useState<boolean>(true);

  const csiTotal = varianceSubmit.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const variance = portalItem.CSI || 0;
    return total + variance;
  }, 0);

  useEffect(() => {
    document.title = "CSI | Dashboard";
  }, []);

  let club = 0;
  if (getClub !== null) {
    club = parseInt(getClub, 10);
  }

  let Id = "";
  if (getId !== null) {
    Id = getId;
  }
  const handleSubmit = (data: string) => {
    navigate(`/treasury/csi${data}`);
  };

  useEffect(() => {
    const defaultDate = dayjs().startOf("day").subtract(1, "day");
    const dateFrom = dayjs().startOf("day").subtract(1, "day");
    const dateTo = dayjs().startOf("day");
    setSelectedDate(defaultDate);
    setSelectedDateFrom(dateFrom);
    setSelectedDateTo(dateTo);
  }, []);

  const handleChangeDate = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
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
  const handleSnackbarExceptionClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarExceptionOpen(false);
  };

  const handleCloseSubmit = () => {
    setOpenSubmit(false);
    setVarianceSubmit([]);
    setSelectedRows([]);
  };

  // Construct analyticsProps with combined memCodes
  const formattedDate = selectedDate?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const dateFrom = selectedDateFrom?.format("YYYY-MM-DD HH:mm:ss.SSS");
  const dateTo = selectedDateTo?.format("YYYY-MM-DD HH:mm:ss.SSS");

  useEffect(() => {
    if (formattedDate) {
      setVariance([] as IVarianceMMS);
      handleGetVarianceMMS();
    }
  }, [formattedDate]);

  const handleGetVarianceMMS = async () => {
    var updatedParams: IAnalyticProps = {
      dates: [formattedDate ? formattedDate : ""],
      storeId: [club],
      memCode: [],
    };

    const config: AxiosRequestConfig = {
      method: "POST",
      url: `/Analytics/GetVarianceMMS`,
      data: updatedParams,
    };

    setVariance([] as IVarianceMMS);
    await api(config)
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setVariance(response.data[0]);
        } else {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Error: Empty response or unexpected format.");
        }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Error occurred.");
        throw error;
      });
  };

  const handleGetVarianceSubmit = async () => {
    setLoading(true);
    var updatedParams: IAnalyticProps = {
      dates: [formattedDate ? formattedDate : ""],
      storeId: [club],
      memCode: [],
    };

    const config: AxiosRequestConfig = {
      method: "POST",
      url: `/Analytics/GetVarianceMMSPerMerchant`,
      data: updatedParams,
    };

    await api(config)
      .then((response) => {
        if (response.data.length > 0) {
          setVarianceSubmit(response.data);
          setLoading(false);
        } else {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Error: Empty response or unexpected format.");
          setLoading(false);
        }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Error occurred.");
        setLoading(false);
        throw error;
      });
  };

  useEffect(() => {
    if(varianceSubmit.length > 0){
      let isDisabled = false;
      varianceSubmit.forEach((item) => {
        console.log("item.Status",item.Status)
        if(item.Status === 3)
        {
          isDisabled = true;
        }
      });
      setEnableSubmitAll(isDisabled); 
    }
    else
    {
      setEnableSubmitAll(true); 
    }
  }, [varianceSubmit]);

  useEffect(() => {
      console.log("enableSubmitAll",enableSubmitAll);
  }, [enableSubmitAll]);

  useEffect(() => {
    async function getTotalAmounts() {
      try {
        const analyticsProps = {
          dates: [formattedDate ? formattedDate : ""],
          memCode: [],
          userId: "",
          storeId: [club],
        };

        const amounts = await fetchTotalAmounts(analyticsProps);
        // Transform the fetched amounts to the expected format
        const transformedAmounts = Object.keys(amounts).reduce((acc, key) => {
          acc[key] = [amounts[key]];
          return acc;
        }, {} as { [key: string]: number[] });

        setTotalAmounts(transformedAmounts); // Update the state with the fetched totalAmounts
      } catch (error) {
        console.error("Error fetching total amounts:", error);
        // Handle errors here
      }
    }

    getTotalAmounts();
  }, [formattedDate]); // Run once on component mount

  useEffect(() => {
    async function getTotalAmounts() {
      try {
        if (dateFrom && dateTo) {
          const analyticsProps: ITransactionProps = {
            dates: [dateFrom ? dateFrom : "", dateTo ? dateTo : ""],
            memCode: [],
            storeId: [club],
            statusId: [3, 5],
            actionId: [1, 2, 3, 4],
          };
          const amounts = await fetchTotalAmountTransactions(analyticsProps);
          setTotalAmountCount(amounts);
        }
      } catch (error) {
        console.error("Error fetching total amounts:", error);
        // Handle errors here
      }
    }

    if (dateFrom && dateTo) {
      getTotalAmounts();
    }
  }, [dateFrom, dateTo]);

  const handleOpenSubmit = () => {
    setOpenSubmit(true);
    //fetchCustomerCodes(0,1,'','','',false,0,false);
    handleGetVarianceSubmit();
  };

  const isSelected = (id: number) =>
    selectedRows.some((row) => row.CategoryId === id);

  const handleSubmitAll = async () => {
    setLoading(true);

    if ((variance.MMS ?? 0) > 0 && (variance.CSI ?? 0) > 0) {
      if (variance.MMS !== variance.CSI) {
        console.log("variance.MMS", variance.MMS);
        console.log("variance.CSI", variance.CSI);
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Error: MMS and CSI not match");
        setLoading(false);
        return;
      }
      if (varianceSubmit.length > 0) {
        try {
          let customerCodesString: string = "";
          varianceSubmit.forEach((item) => {
            if (item.Status === 0 && (item.CSI ?? 0) > 0) {
              if (customerCodesString.length > 0) {
                customerCodesString =
                  customerCodesString + "," + item.CustomerCodes?.toString() ||
                  "";
              } else {
                customerCodesString = item.CustomerCodes?.toString() || "";
              }
            }
          });

          const customerCodesArray = customerCodesString
            .split(",") // Split the string by commas
            .filter((code) => code.trim() !== "");
          const newSelectedRows = varianceSubmit.filter(
            (row) => row.CSI !== 0 && row.Status === 0
          );
          const customerDetailsArray = newSelectedRows.map(
            (row) => `${row.CustomerCodes || ""} (${row.CategoryName || ""})`
          );

          const formattedDate = selectedDate?.format("YYYY-MM-DD HH:mm:ss.SSS");
          const updatedParam: IRefreshAnalytics = {
            dates: [
              formattedDate ? formattedDate : "",
              formattedDate ? formattedDate : "",
            ],
            memCode: customerCodesArray,
            userId: Id,
            storeId: [club],
            merchantDetails: customerDetailsArray,
          };
          if (customerCodesArray.length === 0) {
            setIsSnackbarExceptionOpen(true);
            setSnackbarSeverity("error");
            setMessage("Error: No Merchant for submission");
            setOpenSubmit(false);
            return;
          }
          const config: AxiosRequestConfig = {
            method: "POST",
            url: `/Analytics/SubmitAllAnalytics`,
            data: updatedParam,
          };

          await api(config)
            .then(async (result) => {
              if (result.data.IsPending === true) {
                setIsSnackbarOpen(true);
                setSnackbarSeverity("success");
                setMessage("Analytics Successfully Submitted");
                setOpenSubmit(false);
                setVarianceSubmit([]);
                setSelectedRows([]);
                setLoading(false);
              } else {
                setIsSnackbarOpen(true);
                setSnackbarSeverity("error");
                if (result.data.MerchantNames.toString().length > 0) {
                  setMessage(
                    'Error submitting analytics. The merchant "' +
                      result.data.MerchantNames.toString() +
                      '" has pending exception.'
                  );
                } else {
                  setMessage("Error submitting analytics. Please try again!");
                }
                setOpenSubmit(false);
                setVarianceSubmit([]);
                setSelectedRows([]);
                setLoading(false);
              }
            })
            .catch((error) => {
              setIsSnackbarOpen(true);
              setSnackbarSeverity("error");
              setMessage("Error submitting analytics");
              setLoading(false);
            });
        } catch (error) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Error submitting analytics");
          setLoading(false);
        }
      } else {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Error: No data retrieved");
        setLoading(false);
        return;
      }
    } else {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error: Please wait MMS and CSI is still loading");
      setLoading(false);
      return;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          marginTop: "16px",
          marginLeft: "16px",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="dddd, MMMM DD, YYYY"
                value={selectedDate}
                onChange={handleChangeDate}
                disableMaskedInput
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
                        fontSize: "14px",
                        width: "225px",
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
              onClick={handleOpenSubmit}
            >
              <Typography>Submit All</Typography>
            </StyledButton>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          paddingLeft: "15px",
          marginTop: "10px",
        }}
      >
        <Grid container>
          <Grid
            xs={12}
            sm={12}
            md={12}
            lg={5}
            sx={{ paddingRight: "15px", paddingTop: "10px" }}
          >
            <Grid
              container
              alignItems="center"
              sx={{
                border: "1px solid #1C2C5A",
                borderRadius: "15px",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
            >
              <Grid item xs>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1C2C5A",
                    marginLeft: "6px",
                    paddingLeft: "1px",
                  }}
                >
                  MMS
                </Typography>
              </Grid>
              <Grid item xs dir="rtl">
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1C2C5A",
                    marginLeft: "6px",
                    paddingRight: "15px",
                  }}
                >
                  {variance &&
                  variance.MMS !== undefined &&
                  variance.MMS !== null
                    ? variance.MMS.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            xs={12}
            sm={12}
            md={12}
            lg={2}
            sx={{ paddingRight: "15px", paddingTop: "10px" }}
          >
            <Grid
              container
              alignItems="center"
              sx={{
                border: "1px solid #FB9E9E",
                borderRadius: "15px",
                paddingTop: "5px",
                paddingBottom: "5px",
                backgroundColor: "#FB9E9E",
              }}
            >
              <Grid item xs>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    color: "#1C2C5A",
                    marginLeft: "6px",
                    paddingLeft: "1px",
                  }}
                >
                  {variance &&
                  variance.Variance !== undefined &&
                  variance.Variance !== null
                    ? variance.Variance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            xs={12}
            sm={12}
            md={12}
            lg={5}
            sx={{ paddingRight: "15px", paddingTop: "10px" }}
          >
            <Grid
              container
              alignItems="center"
              sx={{
                border: "1px solid #1C2C5A",
                borderRadius: "15px",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
            >
              <Grid item xs>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1C2C5A",
                    marginLeft: "6px",
                    paddingLeft: "1px",
                  }}
                >
                  CSI
                </Typography>
              </Grid>
              <Grid item xs dir="rtl">
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1C2C5A",
                    marginLeft: "6px",
                    paddingRight: "15px",
                  }}
                >
                  {variance &&
                  variance.CSI !== undefined &&
                  variance.CSI !== null
                    ? variance.CSI.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "16px",
          marginLeft: "16px",
          flexWrap: "wrap",
          gap: "9px",
        }}
      >
        <Grid container spacing={1}>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* Grab Mart */}
            <PaperComponent
              color={"#00A94A"}
              backgroundColor={"#F3F3F3"}
              backgroundColorView={"#EBEBEB"}
              image={GrabMart}
              onClick={() => handleSubmit("/grabmart")}
              isImage={true}
              top={0}
              left={6}
              width="22%"
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011955"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              } // Pass the total amount for the specific memCode, defaulting to 0 if totalAmounts is null
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* Grab Food */}
            <PaperComponent
              color={"#FFFFFF"}
              backgroundColor={"#00B14F"}
              backgroundColorView={"#009E47"}
              image={GrabFood}
              onClick={() => handleSubmit("/grabfood")}
              isImage={true}
              top={0}
              left={6}
              width="25%"
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011929"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* Food Panda */}
            <PaperComponent
              color={"#FFFFFF"}
              backgroundColor={"#D71465"}
              backgroundColorView={"#B31154"}
              image={FoodPanda}
              onClick={() => handleSubmit("/foodpanda")}
              isImage={true}
              top={0}
              left={0}
              width="36%"
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011838"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* Pick A Roo Merch */}
            <PaperComponent
              color={"#FFFFFF"}
              backgroundColor={"#1CE1CF"}
              backgroundColorView={"#0BC7B7"}
              image={PickARoo}
              onClick={() => handleSubmit("/pickaroomerch")}
              isImage={true}
              top={2}
              left={2}
              width="22%"
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011931"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* Pick A Roo FS */}
            <PaperComponent
              color={"#1CE1CF"}
              backgroundColor={"#FFFFFF"}
              backgroundColorView={"#ACACAC"}
              image={PickARoo}
              onClick={() => handleSubmit("/pickaroofs")}
              isImage={true}
              top={2}
              left={2}
              width="22%"
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011935"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* Metromart */}
            <PaperComponent
              color={"#FFFFFF"}
              backgroundColor={"#424140"}
              backgroundColorView={"#2F2E2E"}
              image={Metromart}
              onClick={() => handleSubmit("/metromart")}
              isImage={true}
              top={3}
              left={6}
              width="25%"
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011855"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
          {club === 217 ? (
            <>
              <Grid xs={12} sm={6} md={4} lg={3}>
                {/* Lazada */}
                <PaperComponent
                  color={"#FFFFFF"}
                  backgroundColor={"#181164"}
                  backgroundColorView={"#110C4A"}
                  image={Lazada}
                  onClick={() => handleSubmit("/lazada")}
                  isImage={true}
                  top={0}
                  left={6}
                  width="25%"
                  paperWidth={380}
                  total={
                    totalAmounts
                      ? ["9999011915"].reduce(
                          (sum, key) =>
                            sum +
                            (totalAmounts[key]?.reduce((a, b) => a + b, 0) ??
                              0),
                          0
                        )
                      : 0
                  }
                />
              </Grid>
              <Grid xs={12} sm={6} md={4} lg={3}>
                {/* Shopee */}
                <PaperComponent
                  color={"#FFFFFF"}
                  backgroundColor={"#F24731"}
                  backgroundColorView={"#D73E2B"}
                  image={Shopee}
                  onClick={() => handleSubmit("/shopee")}
                  isImage={true}
                  top={6}
                  left={0}
                  width="25%"
                  paperWidth={380}
                  total={
                    totalAmounts
                      ? ["9999011914"].reduce(
                          (sum, key) =>
                            sum +
                            (totalAmounts[key]?.reduce((a, b) => a + b, 0) ??
                              0),
                          0
                        )
                      : 0
                  }
                />
              </Grid>
            </>
          ) : (
            <></>
          )}
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* GCash */}
            <PaperComponent
              color={"#FFFFFF"}
              backgroundColor={"#007DFE"}
              backgroundColorView={"#0056AC"}
              image={Gcash}
              onClick={() => handleSubmit("/gcash")}
              isImage={true}
              top={6}
              left={0}
              width="25%"
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011926"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* Walk-In */}
            <PaperComponent
              color={"#1C2C5A"}
              backgroundColor={"#D9D9D9"}
              backgroundColorView={"#B8B8B8"}
              image={"Walk-In"}
              onClick={() => handleSubmit("/walkin")}
              isImage={false}
              top={3}
              left={10}
              width=""
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011572"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* Employee */}
            <PaperComponent
              color={"#FFFFFF"}
              backgroundColor={"#1C2C5A"}
              backgroundColorView={"#17244A"}
              image={"Employee"}
              onClick={() => handleSubmit("/employee")}
              isImage={false}
              top={3}
              left={10}
              width=""
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011554"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* Others */}
            <PaperComponent
              color={"#1C2C5A"}
              backgroundColor={"#D9D9D9"}
              backgroundColorView={"#B8B8B8"}
              image={"Others"}
              onClick={() => handleSubmit("/others")}
              isImage={false}
              top={3}
              left={10}
              width="22%"
              paperWidth={380}
              total={
                totalAmounts
                  ? [
                      "9999011542",
                      "9999011546",
                      "9999011547",
                      "9999011548",
                      "9999011549123123",
                      "9999011552",
                      "9999011553",
                      "9999011559",
                      "9999011563",
                      "9999011565",
                      "9999011571",
                      "9999011574",
                      "9999011578",
                      "9999011579",
                      "9999011580",
                      "9999011581",
                      "9999011582",
                      "9999011593",
                      "9999011595",
                      "9999011596",
                      "9999011599",
                      "9999011600",
                      "9999011601",
                      "9999011604",
                      "9999011611",
                      "9999011617",
                      "9999011620",
                      "9999011621",
                      "9999011626",
                      "9999011627",
                      "9999011631",
                      "9999011632",
                      "9999011633",
                      "9999011634",
                      "9999011637",
                      "9999011638",
                      "9999011639",
                      "9999011640",
                      "9999011641",
                      "9999011642",
                      "9999011644",
                      "9999011646",
                      "9999011647",
                      "9999011649",
                      "9999011650",
                      "9999011655",
                      "9999011656",
                      "9999011657",
                      "9999011659",
                      "9999011661",
                      "9999011662",
                      "9999011663",
                      "9999011665",
                      "9999011667",
                      "9999011671",
                      "9999011672",
                      "9999011673",
                      "9999011675",
                      "9999011676",
                      "9999011677",
                      "9999011678",
                      "9999011688",
                      "9999011696",
                      "9999011697",
                      "9999011698",
                      "9999011700",
                      "9999011702",
                      "9999011707",
                      "9999011710",
                      "9999011714",
                      "9999011724",
                      "9999011735",
                      "9999011740",
                      "9999011747",
                      "9999011749",
                      "9999011750",
                      "9999011751",
                      "9999011753",
                      "9999011773",
                      "9999011774",
                      "9999011776",
                      "9999011785",
                      "9999011789",
                      "9999011792",
                      "9999011793",
                      "9999011794",
                      "9999011795",
                      "9999011796",
                      "9999011797",
                      "9999011799",
                      "9999011800",
                      "9999011823",
                      "9999011826",
                      "9999011827",
                      "9999011828",
                      "9999011829",
                      "9999011841",
                      "9999011850",
                      "9999011851",
                      "9999011852",
                      "9999011853",
                      "9999011854",
                      "9999011856",
                      "9999011857",
                      "9999011860",
                      "9999011877",
                      "9999011886",
                      "9999011887",
                      "9999011889",
                      "9999011894",
                      "9999011898",
                      "9999011900",
                      "9999011903",
                      "9999011904",
                      "9999011907",
                      "9999011910",
                      "9999011918",
                      "9999011919",
                      "9999011925",
                      "9999011933",
                      "9999011936",
                      "9999011944",
                      "9999011945",
                      "9999011949",
                      "9999011950",
                      "9999011951",
                      "9999011953",
                      "9999011956",
                      "9999011957",
                      "9999011959",
                      "9999011960",
                      "9999011967",
                      "9999011968",
                      "9999011971",
                      "9999011972",
                      "9999011978",
                      "9999011983",
                      "9999011986",
                      "9999011988",
                      "9999011989",
                      "9999011990",
                      "9999011996",
                      "9999011999",
                      "9999012000",
                      "9999012001",
                      "9999012002",
                      "9999012003",
                      "9999012005",
                      "9999012006",
                      "9999012008",
                      "9999012009",
                      "9999012010",
                      "9999012011",
                      "9999012012",
                      "9999012013",
                      "9999012014",
                      "9999012015",
                      "9999012017",
                      "9999012018",
                      "9999012019",
                      "9999012020",
                      "9999012021",
                      "9999012022",
                      "9999012023",
                      "9999012024",
                      "9999012025",
                      "9999012026",
                      "9999012027",
                      "9999012028",
                      "9999012029",
                      "9999012030",
                      "9999012031",
                      "9999012032",
                      "9999012039",
                      "9999012040",
                      "9999012041",
                      "9999012042",
                      "9999012043",
                      "9999012044",
                      "9999012045",
                      "9999012046",
                      "9999012047",
                    ].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* UB Pizza Voucher */}
            <PaperComponent
              color={"#1C2C5A"}
              backgroundColor={"#D9D9D9"}
              backgroundColorView={"#B8B8B8"}
              image={"UB Pizza Voucher"}
              onClick={() => handleSubmit("/ubpizzavoucher")}
              isImage={false}
              top={3}
              left={10}
              width="22%"
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011984-1"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* UB Rebate Issuance */}
            <PaperComponent
              color={"#1C2C5A"}
              backgroundColor={"#D9D9D9"}
              backgroundColorView={"#B8B8B8"}
              image={"UB Rebate Issuance"}
              onClick={() => handleSubmit("/ubrebateissuance")}
              isImage={false}
              top={3}
              left={10}
              width="22%"
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011984-2"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* UB PV Issuance */}
            <PaperComponent
              color={"#1C2C5A"}
              backgroundColor={"#D9D9D9"}
              backgroundColorView={"#B8B8B8"}
              image={"UB PV Issuance"}
              onClick={() => handleSubmit("/ubpvissuance")}
              isImage={false}
              top={3}
              left={10}
              width="22%"
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011984-3"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={3}>
            {/* UB Renewal*/}
            <PaperComponent
              color={"#1C2C5A"}
              backgroundColor={"#D9D9D9"}
              backgroundColorView={"#B8B8B8"}
              image={"UB Renewal"}
              onClick={() => handleSubmit("/ubrenewal")}
              isImage={false}
              top={3}
              left={10}
              width="22%"
              paperWidth={380}
              total={
                totalAmounts
                  ? ["9999011984-4"].reduce(
                      (sum, key) =>
                        sum +
                        (totalAmounts[key]?.reduce((a, b) => a + b, 0) ?? 0),
                      0
                    )
                  : 0
              }
            />
          </Grid>
        </Grid>
      </Box>
      {/* Snackbar for displaying messages */}
      <StyledSnackBar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={message}
      />
      <StyledSnackBar
        open={isSnackbarExceptionOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarExceptionClose}
        severity={snackbarExceptionSeverity}
        message={messageException}
      />
      <Box>
        <ModalComponent
          isDisabled={enableSubmitAll}
          isCancelDisabled={loading}
          title="Submit Analytics"
          onClose={handleCloseSubmit}
          buttonName="Submit"
          open={openSubmit}
          widthPercent="45%"
          onSave={handleSubmitAll}
          children={
            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  height="53vh"
                >
                  <CircularProgress size={80} />
                  <Typography
                    variant="h6"
                    color="textSecondary"
                    style={{ marginTop: "16px" }}
                  >
                    Loading...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      fontFamily: "Inter",
                      fontWeight: "900",
                      color: "#1C2C5A",
                      fontSize: "20px",
                    }}
                  >
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
                        borderRadius: "20px",
                        paddingLeft: "20px",
                        backgroundColor: "#F2F2F2",
                        paddingRight: "20px",
                        boxShadow:
                          "inset 1px 1px 1px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)",
                        marginLeft: "20px",
                        marginRight: "20px",
                        marginBottom: "20px",
                      }}
                    >
                      <Box>
                        <Table
                          sx={{
                            minWidth: 100,
                            "& th": {
                              borderBottom: "2px solid #1C3766",
                            },
                            borderCollapse: "separate",
                            borderSpacing: "0px 4px",
                            position: "relative",
                          }}
                          aria-label="spanning table"
                        >
                          <TableHead
                            sx={{
                              zIndex: 3,
                              position: "sticky",
                              top: "-9px",
                              backgroundColor: "#F2F2F2",
                            }}
                          >
                            <TableRow>
                              <StyledTableCellHeader>
                                Merchant
                              </StyledTableCellHeader>
                              <StyledTableCellHeader>CSI</StyledTableCellHeader>
                              <StyledTableCellHeader sx={{ width: "160px" }}>
                                Status
                              </StyledTableCellHeader>
                            </TableRow>
                          </TableHead>
                          <TableBody
                            sx={{
                              maxHeight: "calc(100% - 48px)",
                              overflowY: "auto",
                              position: "relative",
                            }}
                          >
                            {varianceSubmit.length === 0 ? (
                              <TableRow
                                sx={{
                                  "& td": {
                                    border: 0,
                                  },
                                }}
                              >
                                <StyledTableCellNoData
                                  colSpan={12}
                                  align="center"
                                >
                                  No data found
                                </StyledTableCellNoData>
                              </TableRow>
                            ) : (
                              varianceSubmit.map((row) => {
                                const isItemSelected =
                                  row.CategoryId !== undefined
                                    ? isSelected(row.CategoryId)
                                    : false;
                                return (
                                  <TableRow
                                    key={row.CategoryId}
                                    sx={{
                                      "& td": { border: 0 },
                                      "&:hover": {
                                        backgroundColor: "#ECEFF1",
                                      },
                                    }}
                                    selected={isItemSelected}
                                  >
                                    <StyledTableCellBody>
                                      {row.CategoryName}
                                    </StyledTableCellBody>

                                    <StyledTableCellBody>
                                      {row.CSI?.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </StyledTableCellBody>
                                    <StyledTableCellBody
                                      style={{
                                        width: "50px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                        backgroundColor:
                                          row.CSI === 0
                                            ? "#FFB5B5"
                                            : row.Status || 0 > 0
                                            ? "#E3FBE3"
                                            : "#FFCF97",
                                        color:
                                          row.Status || 0 > 0
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
                                        {row.CSI === 0 ? (
                                          <ErrorIcon
                                            style={{
                                              color: "#A85A5A",
                                              fontSize: "15px",
                                              marginRight: "5px",
                                              verticalAlign: "middle",
                                            }}
                                          />
                                        ) : row.Status || 0 > 0 ? (
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
                                        {row.CSI === 0
                                          ? "No Analytics"
                                          : row.Status || 0 > 0
                                          ? "Submitted"
                                          : "Pending"}
                                      </span>
                                    </StyledTableCellBody>
                                  </TableRow>
                                );
                              })
                            )}
                          </TableBody>
                        </Table>

                        <Table
                          sx={{
                            minWidth: 100,
                            "& th": {
                              borderBottom: "2px solid #1C3766",
                            },
                            borderCollapse: "separate",
                            borderSpacing: "0px 4px",
                            position: "relative",
                          }}
                          aria-label="spanning table"
                        >
                          <TableHead
                            sx={{
                              zIndex: 3,
                              position: "sticky",
                              top: "-10px",
                              backgroundColor: "#F2F2F2",
                            }}
                          >
                            <TableRow>
                              <StyledTableCellHeader></StyledTableCellHeader>
                              <StyledTableCellHeader></StyledTableCellHeader>
                              <StyledTableCellHeader></StyledTableCellHeader>
                            </TableRow>
                          </TableHead>
                          <TableBody
                            sx={{
                              maxHeight: "calc(100% - 48px)",
                              overflowY: "auto",
                              position: "relative",
                            }}
                          >
                            <TableRow
                              sx={{
                                "& td": { border: 0 },
                                "&:hover": {
                                  backgroundColor: "#ECEFF1",
                                },
                              }}
                            >
                              {varianceSubmit.length === 0 ? (
                                <></>
                              ) : (
                                <>
                                  <StyledTableCellBody sx={{ width: "230px" }}>
                                    TOTAL
                                  </StyledTableCellBody>

                                  <StyledTableCellBody>
                                    {csiTotal.toLocaleString("en-US", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </StyledTableCellBody>
                                  <StyledTableCellHeader
                                    sx={{ width: "60px" }}
                                  ></StyledTableCellHeader>
                                </>
                              )}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </StyledScrollBox>
                  </Grid>
                </Grid>
              )}
            </Box>
          }
        />
      </Box>
    </Box>
  );
};

export default Dashboard;