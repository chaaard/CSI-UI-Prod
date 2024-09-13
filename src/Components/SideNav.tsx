import {
  Box,
  Collapse,
  Drawer,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import {
  ListAlt as ListAltIcon,
  ShoppingCartOutlined as ShoppingCartIcon,
  FileUpload as FileUploadIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  GroupRounded as GroupRoundedIcon,
  FormatListBulletedRounded as FormatListBulletedRoundedIcon,
  StorefrontRounded as StorefrontRoundedIcon,
  DateRangeRounded as DateRangeRoundedIcon,
  CreateNewFolderRounded as CreateNewFolderRoundedIcon,
  FolderDelete as FolderDeleteIcon,
  AssignmentLate as AssignmentLateIcon,
  ArrowDropUp as ArrowDropUpIcon,
  ArrowDropDown as ArrowDropDownIcon,
  PointOfSale as PointOfSaleIcon,
  Settings as SettingsIcon,
  Report as ReportIcon,
  Receipt as ReceiptIcon,
  Payments as PaymentsIcon,
  Balance as BalanceIcon,
  Autorenew as AutoRenewIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  CurrencyExchange as CurrencyExchangeIcon,
  DirectionsWalk as DirectionsWalkIcon,
  Badge as BadgeIcon,
  HomeWork as HomeWorkIcon,
  EventRepeat as EventRepeatIcon,
  PublishedWithChanges as PublishedWithChangesIcon,
  Task as TaskIcon,
  ContactPage as ContactPageIcon,
  Summarize as SummarizeIcon,
  Analytics as AnalyticsIcon,
  ClearAll as ClearAllIcon,
  CreditCard as CreditCardIcon,
} from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import GrabMartIcon from "../Assets/GrabMartSideNav.png";
import GrabFoodIcon from "../Assets/GrabFoodSideNav.png";
import MetromartIcon from "../Assets/MetroMartSideNav.png";
import FoodPandaIcon from "../Assets/FoodPandaSideNav.png";
import LazadaIcon from "../Assets/LazadaSideNav.png";
import ShopeeIcon from "../Assets/ShopeeSideNav.png";
import PickARooIcon from "../Assets/PickARooSideNav.png";
import GCashIcon from "../Assets/GCashNav.png";
import StyledScrollBox from "./ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledIcon from "./ReusableComponents/IconComponents/StyledIcon";
import api from "../Config/AxiosConfig";

export interface INavLink {
  icon: JSX.Element;
  label: string;
  href: string;
}

interface SideNavProps {
  width: number; // Add a width prop
}

interface UserInfo {
  Role: string | null | undefined;
  Club: string | null | undefined;
}

const transactionsNavLinks: INavLink[] = [
  {
    icon: (
      <img
        src={GrabMartIcon}
        alt="Grab Mart"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Grab Mart",
    href: "/treasury/csi/grabmart",
  },
  {
    icon: (
      <img
        src={GrabFoodIcon}
        alt="Grab Food"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Grab Food",
    href: "/treasury/csi/grabfood",
  },
  {
    icon: (
      <img
        src={FoodPandaIcon}
        alt="Food Panda"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Food Panda",
    href: "/treasury/csi/foodpanda",
  },
  {
    icon: (
      <img
        src={FoodPandaIcon}
        alt="Panda Merchant"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Panda Merchant",
    href: "/treasury/csi/PandaMerchant",
  },
  {
    icon: (
      <img
        src={PickARooIcon}
        alt="Pick A Roo Merch"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Pick A Roo Merch",
    href: "/treasury/csi/pickaroomerch",
  },
  {
    icon: (
      <img
        src={PickARooIcon}
        alt="Pick A Roo FS"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Pick A Roo FS",
    href: "/treasury/csi/pickaroofs",
  },
  {
    icon: (
      <img
        src={MetromartIcon}
        alt="Metro Mart"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "MetroMart",
    href: "/treasury/csi/metromart",
  },
  {
    icon: (
      <img
        src={LazadaIcon}
        alt="Lazada"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Lazada",
    href: "/treasury/csi/lazada",
  },
  {
    icon: (
      <img
        src={ShopeeIcon}
        alt="Shopee"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Shopee",
    href: "/treasury/csi/shopee",
  },
  {
    icon: (
      <img
        src={GCashIcon}
        alt="GCash"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "GCash",
    href: "/treasury/csi/gcash",
  },
  {
    icon: <ConfirmationNumberIcon sx={{ fontSize: "30px" }} />,
    label: "UB Pizza Voucher",
    href: "/treasury/csi/ubpizzavoucher",
  },
  {
    icon: <CurrencyExchangeIcon sx={{ fontSize: "27px" }} />,
    label: "UB Rebate Issuance",
    href: "/treasury/csi/ubrebateissuance",
  },
  {
    icon: <PublishedWithChangesIcon sx={{ fontSize: "30px" }} />,
    label: "UB PV Issuance",
    href: "/treasury/csi/ubpvissuance",
  },
  {
    icon: <AutoRenewIcon sx={{ fontSize: "32px" }} />,
    label: "UB Renewal",
    href: "/treasury/csi/ubrenewal",
  },
  {
    icon: <DirectionsWalkIcon sx={{ fontSize: "32px" }} />,
    label: "Walk-In",
    href: "/treasury/csi/walkin",
  },
  {
    icon: <BadgeIcon sx={{ fontSize: "30px" }} />,
    label: "Employee",
    href: "/treasury/csi/employee",
  },
  {
    icon: <HomeWorkIcon sx={{ fontSize: "30px" }} />,
    label: "Others",
    href: "/treasury/csi/others",
  },

  // { icon: <img src={VolumeShopperIcon} alt="Others" style={{ width: '30px', height: '30px' }} />, label: 'Others', href: '/treasury/csi/volumeshopper' },
  // { icon: <img src={BankPromosIcon} alt="BankPromos" style={{ width: '30px', height: '30px' }} />, label: 'Bank Promos', href: '/treasury/csi/bankpromos' },
];

const reportsNavLinks: INavLink[] = [
  {
    icon: <DateRangeRoundedIcon sx={{ fontSize: "30px" }} />,
    label: "Weekly Delivery Reports",
    href: "/reports/weekly-delivery-report",
  },
  // { icon: <CircleIcon sx={{ fontSize: '15px'}} />, label: 'Sales Summary Reports', href: '/reports/sales-summ-report' },
  {
    icon: <ReportIcon sx={{ fontSize: "30px" }} />,
    label: "Exception Reports",
    href: "/reports/exception-report",
  },
  {
    icon: <ReceiptIcon sx={{ fontSize: "30px" }} />,
    label: "Generated Invoice Reports",
    href: "/reports/generated-invoice-report",
  },
  {
    icon: <SummarizeIcon sx={{ fontSize: "30px" }} />,
    label: "UnionBank Invoice Reports",
    href: "/reports/unionbank-invoice-report",
  },
  {
    icon: <ContactPageIcon sx={{ fontSize: "30px" }} />,
    label: "Walk-In Invoice Reports",
    href: "/reports/walkin-invoice-report",
  },
  {
    icon: <TaskIcon sx={{ fontSize: "30px" }} />,
    label: "UnionBank PV Issuance Reports",
    href: "/reports/unionbank-voucher-report",
  },
  {
    icon: <EventRepeatIcon sx={{ fontSize: "30px" }} />,
    label: "UnionBank Renewal Reports",
    href: "/reports/unionbank-renewal-report",
  },
  {
    icon: <PaymentsIcon sx={{ fontSize: "30px" }} />,
    label: "Payment Recon Reports",
    href: "/reports/payment-recon-report",
  },
  {
    icon: <BalanceIcon sx={{ fontSize: "30px" }} />,
    label: "Balances Details Reports",
    href: "/reports/balances-details-report",
  },
];

const maintenanceNavLinks: INavLink[] = [
  {
    icon: <ShoppingCartIcon sx={{ fontSize: "30px" }} />,
    label: "Merchant",
    href: "/system-admin/customer-code",
  },
  {
    icon: <StorefrontRoundedIcon sx={{ fontSize: "30px" }} />,
    label: "Club",
    href: "/system-admin/club",
  },
  {
    icon: <GroupRoundedIcon sx={{ fontSize: "30px" }} />,
    label: "User",
    href: "/system-admin/user",
  },
  {
    icon: <ListAltIcon sx={{ fontSize: "30px" }} />,
    label: "Logs",
    href: "/system-admin/logs",
  },
  {
    icon: <FormatListBulletedRoundedIcon sx={{ fontSize: "30px" }} />,
    label: "Analytics",
    href: "/system-admin/analytics",
  },
];

const accountingNavLinks: INavLink[] = [
  {
    icon: <AssessmentIcon sx={{ fontSize: "30px" }} />,
    label: "Generate Invoice",
    href: "/accounting/generate-invoice",
  },
  {
    icon: <FileUploadIcon sx={{ fontSize: "30px" }} />,
    label: "Upload Prooflist",
    href: "/accounting/upload-prooflist",
  },
];

const paymentReconNavLinks: INavLink[] = [
  {
    icon: (
      <img
        src={GrabMartIcon}
        alt="Grab Mart"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Grab Mart",
    href: "/accounting/payment-recon/grabmart",
  },
  {
    icon: (
      <img
        src={GrabFoodIcon}
        alt="Grab Food"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Grab Food",
    href: "/accounting/payment-recon/grabfood",
  },
  {
    icon: (
      <img
        src={FoodPandaIcon}
        alt="Food Panda"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Food Panda",
    href: "/accounting/payment-recon/foodpanda",
  },
  {
    icon: (
      <img
        src={FoodPandaIcon}
        alt="Panda Merchant"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Panda Merchant",
    href: "/accounting/payment-recon/PandaMerchant",
  },
  {
    icon: (
      <img
        src={PickARooIcon}
        alt="Pick A Roo Merch"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Pick A Roo Merch",
    href: "/accounting/payment-recon/pickaroomerch",
  },
  {
    icon: (
      <img
        src={PickARooIcon}
        alt="Pick A Roo FS"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Pick A Roo FS",
    href: "/accounting/payment-recon/pickaroofs",
  },
  {
    icon: (
      <img
        src={MetromartIcon}
        alt="Metro Mart"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "MetroMart",
    href: "/accounting/payment-recon/metromart",
  },
  {
    icon: (
      <img
        src={LazadaIcon}
        alt="Lazada"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Lazada",
    href: "/accounting/payment-recon/lazada",
  },
  {
    icon: (
      <img
        src={ShopeeIcon}
        alt="Shopee"
        style={{ width: "30px", height: "30px" }}
      />
    ),
    label: "Shopee",
    href: "/accounting/payment-recon/shopee",
  },
];

const SideNav: React.FC<SideNavProps> = ({ width }) => {
  const location = useLocation();
  const getRoleId = window.localStorage.getItem("roleId");
  const [transactionsDropdownValue, setTransactionsDropdownValue] = useState(false);
  const [reportsDropdownValue, setReportsDropdownValue] = useState(false);
  const [maintenanceDropdownValue, setMaintenanceDropdownValue] = useState(false);
  const [paymentReconDropdownValue, setPaymentReconDropdownValue] = useState(false);
  const [floatingCsiValue, setFloatingCsiValue] = useState(false);
  const [creditMemoValue, setCreditMemoValue] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
  
  const userName = window.localStorage.getItem("userName");
  const getClub = window.localStorage.getItem("club");
  const treasuryReportsToShow = [
    "Weekly Delivery Reports",
    "Generated Invoice Reports",
    "Exception Reports",
    "UnionBank Invoice Reports",
    "Walk-In Invoice Reports",
    "UnionBank PV Issuance Reports",
    "UnionBank Renewal Reports",
  ];
  const accountingReportsToShow = [
    "Weekly Delivery Reports",
    "Generated Invoice Reports",
    "Exception Reports",
    "Payment Recon Reports",
    "Balances Details Reports",
    "UnionBank Invoice Reports",
    "Walk-In Invoice Reports",
    "UnionBank PV Issuance Reports",
    "UnionBank Renewal Reports",
  ];

  let roleId = 0;
  if (getRoleId !== null) {
    roleId = parseInt(getRoleId, 10);
  }

  let club = 0;
  if (getClub !== null) {
    club = parseInt(getClub, 10);
  }

  const handleTransactionChange = () => {
    setTransactionsDropdownValue((prevValue) => !prevValue);
    setReportsDropdownValue(false);
    setMaintenanceDropdownValue(false);
    setPaymentReconDropdownValue(false);
    setFloatingCsiValue(false);
    setCreditMemoValue(false);
  };

  const handleReportChange = () => {
    setReportsDropdownValue((prevValue) => !prevValue);
    setTransactionsDropdownValue(false);
    setMaintenanceDropdownValue(false);
    setPaymentReconDropdownValue(false);
    setFloatingCsiValue(false);
    setCreditMemoValue(false);
  };

  const handleMaintenanceChange = () => {
    setMaintenanceDropdownValue((prevValue) => !prevValue);
    setTransactionsDropdownValue(false);
    setReportsDropdownValue(false);
    setPaymentReconDropdownValue(false);
    setFloatingCsiValue(false);
    setCreditMemoValue(false);
  };

  const handlePaymentReconChange = () => {
    setPaymentReconDropdownValue((prevValue) => !prevValue);
    setReportsDropdownValue(false);
  };

  const handleFloatingCsiChange = () => {
    setFloatingCsiValue((prevValue) => !prevValue);
    setTransactionsDropdownValue(false);
    setReportsDropdownValue(false);
    setMaintenanceDropdownValue(false);
    setPaymentReconDropdownValue(false);
    setCreditMemoValue(false);
  };

  const handleCreditMemoChange = () => {
    setCreditMemoValue((prevValue) => !prevValue);
    setTransactionsDropdownValue(false);
    setReportsDropdownValue(false);
    setMaintenanceDropdownValue(false);
    setPaymentReconDropdownValue(false);
    setFloatingCsiValue(false);
  };

  const fetchUserInfo = useCallback(async () => {
    try {
      const formData = new FormData();
      if (userName !== null) {
        formData.append("username", userName);
      }
      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Auth/GetUserInfo`,
        data: formData,
      };

      await api(config)
        .then(async (response) => {
          setUserInfo(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, [, userName]);

  useEffect(() => {
    if (userName !== null) {
      fetchUserInfo();
    }
  }, [fetchUserInfo, userName]);

  const filteredTreasuryReportsNavLinks = reportsNavLinks.filter((link) =>
    treasuryReportsToShow.includes(link.label)
  );

  const filteredAccountingReportsNavLinks = reportsNavLinks.filter((link) =>
    accountingReportsToShow.includes(link.label)
  );


  const filteredTransactionsNavLinks =
    club === 217
      ? transactionsNavLinks
      : transactionsNavLinks.filter(
          (link) => link.label !== "Lazada" && link.label !== "Shopee"
        );

  return (
    <>
      <Drawer
        anchor="left"
        open
        variant="persistent"
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: `${width}px`,
            backgroundColor: "#F2F2F2",
            overflowX: "hidden",
            border: "none",
            //boxShadow: '6px 9px 8px -1px rgba(0,0,0,0.3)', // Adjust the horizontal offset here
          },
        }}
      >
        <Grid
          container
          spacing={8}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Box
              sx={{
                textAlign: "center",
                color: "#1C2C5A",
                marginTop: "10px",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontSize: "70px",
                  fontFamily: "Arial",
                  fontStyle: "italic",
                  fontWeight: "bold",
                }}
              >
                S&R
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  marginTop: "-19px",
                  fontSize: "15px",
                  fontFamily: "Arial",
                }}
              >
                Membership Shopping
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  marginTop: "20px",
                  fontSize: "30px",
                  fontFamily: "Inter",
                  fontWeight: "900",
                  paddingLeft: "5px",
                  paddingRight: "-2px",
                }}
              >
                CSI SYSTEM
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <StyledScrollBox
          sx={{
            overflowY: "auto",
            height: "calc(100vh - 160px)",
            scrollbarWidth: "thin",
          }}
        >
          <List>
            {roleId === 1 || roleId === 2 || roleId === 3 ? (
              <Box>
                {userInfo.Role === "Treasury" ? (
                  <Box>
                    <ListItemButton
                      component={NavLink}
                      to={"treasury/dashboard-treasury"}
                      className="link"
                      onClick={() => {
                        handleTransactionChange();
                      }}
                      sx={{
                        marginLeft: "20px",
                        marginRight: "20px",
                        marginTop: "25px",
                        backgroundColor: transactionsDropdownValue
                          ? "#1C2C5A"
                          : "#F2F2F2",
                        borderRadius: "25px",
                        boxShadow: transactionsDropdownValue
                          ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                          : "",
                        "&:hover": {
                          backgroundColor: transactionsDropdownValue
                            ? "#15294D"
                            : "#C5C5C5",
                          borderColor: transactionsDropdownValue
                            ? "#15294D"
                            : "#9E9E9E",
                          boxShadow: transactionsDropdownValue
                            ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                            : "",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: transactionsDropdownValue
                            ? "#FFFFFF"
                            : "#1C2C5A",
                        }}
                      >
                        <AnalyticsIcon sx={{ fontSize: "30px" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={"CSI"}
                        disableTypography
                        sx={{
                          color: transactionsDropdownValue
                            ? "#FFFFFF"
                            : "#1C2C5A",
                          paddingLeft: "8px",
                          marginLeft: "-25px",
                          fontFamily: "Inter",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      />
                      <StyledIcon
                        style={{
                          transform: `rotate(${
                            transactionsDropdownValue ? 360 : 0
                          }deg)`,
                        }}
                      >
                        {transactionsDropdownValue ? (
                          <ArrowDropDownIcon
                            sx={{
                              color: transactionsDropdownValue
                                ? "#FFFFFF"
                                : "#1C2C5A",
                              fontSize: "30px",
                            }}
                          />
                        ) : (
                          <ArrowDropUpIcon
                            sx={{
                              color: transactionsDropdownValue
                                ? "#FFFFFF"
                                : "#1C2C5A",
                              fontSize: "30px",
                            }}
                          />
                        )}
                      </StyledIcon>
                    </ListItemButton>
                    <Collapse
                      in={transactionsDropdownValue}
                      timeout="auto"
                      unmountOnExit
                    >
                      {filteredTransactionsNavLinks.map(
                        (transactionsNavLinks, index) => (
                          <ListItemButton
                            key={`transactionsNavLink-${index}`}
                            component={NavLink}
                            to={transactionsNavLinks.href}
                            style={{
                              backgroundColor:
                                location.pathname === transactionsNavLinks.href
                                  ? "#D9D9D9"
                                  : "inherit",
                              marginTop: "5px",
                            }}
                            className="link"
                            sx={{
                              marginLeft: "20px",
                              marginRight: "20px",
                              borderRadius: "25px",
                              height: "35px",
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color:
                                  location.pathname ===
                                  transactionsNavLinks.href
                                    ? "#1C2C5A"
                                    : "#1C2C5A",
                                marginLeft: "5px",
                              }}
                            >
                              {transactionsNavLinks.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={transactionsNavLinks.label}
                              disableTypography
                              sx={{
                                color:
                                  location.pathname ===
                                  transactionsNavLinks.href
                                    ? "#1C2C5A"
                                    : "#1C2C5A",
                                paddingLeft: "8px",
                                marginLeft: "-30px",
                                fontFamily: "Inter !important",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            />
                          </ListItemButton>
                        )
                      )}
                    </Collapse>
                    <ListItemButton
                      component={NavLink}
                      to={"treasury/csi/floatcsi"}
                      className="link"
                      onClick={() => {
                        handleFloatingCsiChange();
                      }}
                      sx={{
                        marginLeft: "20px",
                        marginRight: "20px",
                        marginTop: "15px",
                        backgroundColor: floatingCsiValue
                          ? "#1C2C5A"
                          : "#F2F2F2",
                        borderRadius: "25px",
                        boxShadow: floatingCsiValue
                          ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                          : "",
                        "&:hover": {
                          backgroundColor: floatingCsiValue
                            ? "#15294D"
                            : "#C5C5C5",
                          borderColor: floatingCsiValue
                            ? "#15294D"
                            : "#9E9E9E",
                          boxShadow: floatingCsiValue
                            ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                            : "",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: floatingCsiValue
                            ? "#FFFFFF"
                            : "#1C2C5A",
                        }}
                      >
                        <ClearAllIcon sx={{ fontSize: "30px" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={"Floating CSI"}
                        disableTypography
                        sx={{
                          color: floatingCsiValue
                            ? "#FFFFFF"
                            : "#1C2C5A",
                          paddingLeft: "8px",
                          marginLeft: "-25px",
                          fontFamily: "Inter",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      />
                    </ListItemButton>
                    <ListItemButton
                      component={NavLink}
                      to={"maintenance"}
                      className="link"
                      onClick={() => {
                        handleCreditMemoChange();
                      }}
                      sx={{
                        marginLeft: "20px",
                        marginRight: "20px",
                        marginTop: "15px",
                        backgroundColor: creditMemoValue
                          ? "#1C2C5A"
                          : "#F2F2F2",
                        borderRadius: "25px",
                        boxShadow: creditMemoValue
                          ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                          : "",
                        "&:hover": {
                          backgroundColor: creditMemoValue
                            ? "#15294D"
                            : "#C5C5C5",
                          borderColor: creditMemoValue
                            ? "#15294D"
                            : "#9E9E9E",
                          boxShadow: creditMemoValue
                            ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                            : "",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: creditMemoValue
                            ? "#FFFFFF"
                            : "#1C2C5A",
                        }}
                      >
                        <CreditCardIcon sx={{ fontSize: "30px" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={"Credit Memo"}
                        disableTypography
                        sx={{
                          color: creditMemoValue
                            ? "#FFFFFF"
                            : "#1C2C5A",
                          paddingLeft: "8px",
                          marginLeft: "-25px",
                          fontFamily: "Inter",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      />
                    </ListItemButton>
                    <ListItemButton
                      onClick={() => {
                        handleReportChange();
                      }}
                      sx={{
                        marginLeft: "20px",
                        marginRight: "20px",
                        marginTop: "15px",
                        backgroundColor: reportsDropdownValue
                          ? "#1C2C5A"
                          : "#F2F2F2",
                        borderRadius: "25px",
                        boxShadow: reportsDropdownValue
                          ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                          : "",
                        "&:hover": {
                          backgroundColor: reportsDropdownValue
                            ? "#15294D"
                            : "#C5C5C5",
                          borderColor: reportsDropdownValue
                            ? "#15294D"
                            : "#9E9E9E",
                          boxShadow: reportsDropdownValue
                            ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                            : "",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: reportsDropdownValue ? "#FFFFFF" : "#1C2C5A",
                        }}
                      >
                        <AssignmentLateIcon sx={{ fontSize: "33px" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={"Reports"}
                        disableTypography
                        sx={{
                          color: reportsDropdownValue ? "#FFFFFF" : "#1C2C5A",
                          paddingLeft: "8px",
                          marginLeft: "-25px",
                          fontFamily: "Inter",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      />
                      <StyledIcon
                        style={{
                          transform: `rotate(${
                            reportsDropdownValue ? 360 : 0
                          }deg)`,
                        }}
                      >
                        {reportsDropdownValue ? (
                          <ArrowDropDownIcon
                            sx={{
                              color: reportsDropdownValue
                                ? "#FFFFFF"
                                : "#1C2C5A",
                              fontSize: "30px",
                            }}
                          />
                        ) : (
                          <ArrowDropUpIcon
                            sx={{
                              color: reportsDropdownValue
                                ? "#FFFFFF"
                                : "#1C2C5A",
                              fontSize: "30px",
                            }}
                          />
                        )}
                      </StyledIcon>
                    </ListItemButton>
                    <Collapse
                      in={reportsDropdownValue}
                      timeout="auto"
                      unmountOnExit
                    >
                      {filteredTreasuryReportsNavLinks.map((reportsNavLinks, index) => (
                        <ListItemButton
                          key={`transactionsNavLink-${index}`}
                          component={NavLink}
                          to={reportsNavLinks.href}
                          style={{
                            backgroundColor:
                              location.pathname === reportsNavLinks.href
                                ? "#D9D9D9"
                                : "inherit",
                            marginTop: "5px",
                          }}
                          className="link"
                          sx={{
                            marginLeft: "20px",
                            marginRight: "20px",
                            borderRadius: "25px",
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color:
                                location.pathname === reportsNavLinks.href
                                  ? "#1C2C5A"
                                  : "#1C2C5A",
                              marginLeft: "5px",
                            }}
                          >
                            {reportsNavLinks.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={reportsNavLinks.label}
                            disableTypography
                            sx={{
                              color:
                                location.pathname === reportsNavLinks.href
                                  ? "#1C2C5A"
                                  : "#1C2C5A",
                              paddingLeft: "8px",
                              marginLeft: "-30px",
                              fontFamily: "Inter !important",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </Collapse>
                  </Box>
                ) : userInfo.Role === "Accounting" ? (
                  <Box>
                    <ListItemButton
                      component={NavLink}
                      to={"accounting/dashboard-accounting"}
                      className="link"
                      onClick={() => {
                        handleTransactionChange();
                      }}
                      sx={{
                        marginLeft: "20px",
                        marginRight: "20px",
                        marginTop: "25px",
                        backgroundColor: transactionsDropdownValue
                          ? "#1C2C5A"
                          : "#F2F2F2",
                        borderRadius: "25px",
                        boxShadow: transactionsDropdownValue
                          ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                          : "",
                        "&:hover": {
                          backgroundColor: transactionsDropdownValue
                            ? "#15294D"
                            : "#C5C5C5",
                          borderColor: transactionsDropdownValue
                            ? "#15294D"
                            : "#9E9E9E",
                          boxShadow: transactionsDropdownValue
                            ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                            : "",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: transactionsDropdownValue
                            ? "#FFFFFF"
                            : "#1C2C5A",
                        }}
                      >
                        <PointOfSaleIcon sx={{ fontSize: "30px" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={"Accounting"}
                        disableTypography
                        sx={{
                          color: transactionsDropdownValue
                            ? "#FFFFFF"
                            : "#1C2C5A",
                          paddingLeft: "8px",
                          marginLeft: "-25px",
                          fontFamily: "Inter",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      />
                      <StyledIcon
                        style={{
                          transform: `rotate(${
                            transactionsDropdownValue ? 360 : 0
                          }deg)`,
                        }}
                      >
                        {transactionsDropdownValue ? (
                          <ArrowDropDownIcon
                            sx={{
                              color: transactionsDropdownValue
                                ? "#FFFFFF"
                                : "#1C2C5A",
                              fontSize: "30px",
                            }}
                          />
                        ) : (
                          <ArrowDropUpIcon
                            sx={{
                              color: transactionsDropdownValue
                                ? "#FFFFFF"
                                : "#1C2C5A",
                              fontSize: "30px",
                            }}
                          />
                        )}
                      </StyledIcon>
                    </ListItemButton>
                    <Collapse
                      in={transactionsDropdownValue}
                      timeout="auto"
                      unmountOnExit
                    >
                      {accountingNavLinks.map((reportsNavLinks, index) => (
                        <ListItemButton
                          key={`transactionsNavLink-${index}`}
                          component={NavLink}
                          to={reportsNavLinks.href}
                          style={{
                            backgroundColor:
                              location.pathname === reportsNavLinks.href
                                ? "#D9D9D9"
                                : "inherit",
                            marginTop: "5px",
                          }}
                          className="link"
                          sx={{
                            marginLeft: "20px",
                            marginRight: "20px",
                            borderRadius: "25px",
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color:
                                location.pathname === reportsNavLinks.href
                                  ? "#1C2C5A"
                                  : "#1C2C5A",
                              marginLeft: "5px",
                            }}
                          >
                            {reportsNavLinks.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={reportsNavLinks.label}
                            disableTypography
                            sx={{
                              color:
                                location.pathname === reportsNavLinks.href
                                  ? "#1C2C5A"
                                  : "#1C2C5A",
                              paddingLeft: "8px",
                              marginLeft: "-30px",
                              fontFamily: "Inter !important",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          />
                        </ListItemButton>
                      ))}
                      {/* Nested Collapse for Payment Recon */}
                      <ListItemButton
                        style={{
                          marginTop: "5px",
                        }}
                        onClick={() => {
                          handlePaymentReconChange();
                        }}
                        sx={{
                          marginLeft: "25px",
                          marginRight: "20px",
                          borderRadius: "25px",
                          backgroundColor: paymentReconDropdownValue
                            ? "#D9D9D9"
                            : "inherit",
                          boxShadow: paymentReconDropdownValue
                            ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                            : "",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: "#1C2C5A",
                          }}
                        >
                          <PaymentIcon sx={{ width: "30px", height: "30px" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={"Payment Recon"}
                          disableTypography
                          sx={{
                            color: "#1C2C5A",
                            paddingLeft: "8px",
                            marginLeft: "-30px",
                            fontFamily: "Inter !important",
                            fontWeight: "bold",
                            fontSize: "14px",
                          }}
                        />
                        <StyledIcon
                          style={{
                            transform: `rotate(${
                              paymentReconDropdownValue ? 360 : 0
                            }deg)`,
                          }}
                        >
                          {paymentReconDropdownValue ? (
                            <ArrowDropDownIcon
                              sx={{ color: "#1C2C5A", fontSize: "30px" }}
                            />
                          ) : (
                            <ArrowDropUpIcon
                              sx={{ color: "#1C2C5A", fontSize: "30px" }}
                            />
                          )}
                        </StyledIcon>
                      </ListItemButton>
                      <Collapse
                        in={paymentReconDropdownValue}
                        timeout="auto"
                        unmountOnExit
                      >
                        {paymentReconNavLinks.map((reportsNavLinks, index) => (
                          <ListItemButton
                            key={`transactionsNavLink-${index}`}
                            component={NavLink}
                            to={reportsNavLinks.href}
                            style={{
                              backgroundColor:
                                location.pathname === reportsNavLinks.href
                                  ? "#D9D9D9"
                                  : "inherit",
                              marginTop: "3px",
                            }}
                            className="link"
                            sx={{
                              marginLeft: "25px",
                              marginRight: "20px",
                              borderRadius: "25px",
                              height: "38px",
                              width: "200px",
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color:
                                  location.pathname === reportsNavLinks.href
                                    ? "#1C2C5A"
                                    : "#1C2C5A",
                                marginLeft: "5px",
                              }}
                            >
                              {reportsNavLinks.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={reportsNavLinks.label}
                              disableTypography
                              sx={{
                                color:
                                  location.pathname === reportsNavLinks.href
                                    ? "#1C2C5A"
                                    : "#1C2C5A",
                                paddingLeft: "8px",
                                marginLeft: "-30px",
                                fontFamily: "Inter !important",
                                fontWeight: "bold",
                                fontSize: "13px",
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </Collapse>
                    </Collapse>
                    <ListItemButton
                      onClick={() => {
                        handleReportChange();
                      }}
                      sx={{
                        marginLeft: "20px",
                        marginRight: "20px",
                        marginTop: "15px",
                        backgroundColor: reportsDropdownValue
                          ? "#1C2C5A"
                          : "#F2F2F2",
                        borderRadius: "25px",
                        boxShadow: reportsDropdownValue
                          ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                          : "",
                        "&:hover": {
                          backgroundColor: reportsDropdownValue
                            ? "#15294D"
                            : "#C5C5C5",
                          borderColor: reportsDropdownValue
                            ? "#15294D"
                            : "#9E9E9E",
                          boxShadow: reportsDropdownValue
                            ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                            : "",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: reportsDropdownValue ? "#FFFFFF" : "#1C2C5A",
                        }}
                      >
                        <AssignmentLateIcon sx={{ fontSize: "33px" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={"Reports"}
                        disableTypography
                        sx={{
                          color: reportsDropdownValue ? "#FFFFFF" : "#1C2C5A",
                          paddingLeft: "8px",
                          marginLeft: "-25px",
                          fontFamily: "Inter",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      />
                      <StyledIcon
                        style={{
                          transform: `rotate(${
                            reportsDropdownValue ? 360 : 0
                          }deg)`,
                        }}
                      >
                        {reportsDropdownValue ? (
                          <ArrowDropDownIcon
                            sx={{
                              color: reportsDropdownValue
                                ? "#FFFFFF"
                                : "#1C2C5A",
                              fontSize: "30px",
                            }}
                          />
                        ) : (
                          <ArrowDropUpIcon
                            sx={{
                              color: reportsDropdownValue
                                ? "#FFFFFF"
                                : "#1C2C5A",
                              fontSize: "30px",
                            }}
                          />
                        )}
                      </StyledIcon>
                    </ListItemButton>
                    <Collapse
                      in={reportsDropdownValue}
                      timeout="auto"
                      unmountOnExit
                    >
                      {filteredAccountingReportsNavLinks.map((reportsNavLinks, index) => (
                        <ListItemButton
                          key={`transactionsNavLink-${index}`}
                          component={NavLink}
                          to={reportsNavLinks.href}
                          style={{
                            backgroundColor:
                              location.pathname === reportsNavLinks.href
                                ? "#D9D9D9"
                                : "inherit",
                            marginTop: "5px",
                          }}
                          className="link"
                          sx={{
                            marginLeft: "20px",
                            marginRight: "20px",
                            borderRadius: "25px",
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color:
                                location.pathname === reportsNavLinks.href
                                  ? "#1C2C5A"
                                  : "#1C2C5A",
                              marginLeft: "5px",
                            }}
                          >
                            {reportsNavLinks.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={reportsNavLinks.label}
                            disableTypography
                            sx={{
                              color:
                                location.pathname === reportsNavLinks.href
                                  ? "#1C2C5A"
                                  : "#1C2C5A",
                              paddingLeft: "8px",
                              marginLeft: "-30px",
                              fontFamily: "Inter !important",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </Collapse>
                  </Box>
                ) : (
                  ""
                )}
              </Box>
            ) : (
              <Box>
                <ListItemButton
                  onClick={() => {
                    handleMaintenanceChange();
                  }}
                  sx={{
                    marginLeft: "20px",
                    marginRight: "20px",
                    marginTop: "15px",
                    backgroundColor: maintenanceDropdownValue
                      ? "#1C2C5A"
                      : "#F2F2F2",
                    borderRadius: "25px",
                    boxShadow: maintenanceDropdownValue
                      ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                      : "",
                    "&:hover": {
                      backgroundColor: maintenanceDropdownValue
                        ? "#15294D"
                        : "#C5C5C5",
                      borderColor: maintenanceDropdownValue
                        ? "#15294D"
                        : "#9E9E9E",
                      boxShadow: maintenanceDropdownValue
                        ? "0px 7px 5px -1px rgba(0,0,0,0.5)"
                        : "",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: maintenanceDropdownValue ? "#FFFFFF" : "#1C2C5A",
                    }}
                  >
                    <SettingsIcon sx={{ fontSize: "33px" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={"Maintenance"}
                    disableTypography
                    sx={{
                      color: maintenanceDropdownValue ? "#FFFFFF" : "#1C2C5A",
                      paddingLeft: "8px",
                      marginLeft: "-25px",
                      fontFamily: "Inter",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  />
                  <StyledIcon
                    style={{
                      transform: `rotate(${
                        maintenanceDropdownValue ? 360 : 0
                      }deg)`,
                    }}
                  >
                    {maintenanceDropdownValue ? (
                      <ArrowDropDownIcon
                        sx={{
                          color: maintenanceDropdownValue
                            ? "#FFFFFF"
                            : "#1C2C5A",
                          fontSize: "30px",
                        }}
                      />
                    ) : (
                      <ArrowDropUpIcon
                        sx={{
                          color: maintenanceDropdownValue
                            ? "#FFFFFF"
                            : "#1C2C5A",
                          fontSize: "30px",
                        }}
                      />
                    )}
                  </StyledIcon>
                </ListItemButton>
                <Collapse
                  in={maintenanceDropdownValue}
                  timeout="auto"
                  unmountOnExit
                >
                  {maintenanceNavLinks.map((maintenanceNavLinks, index) => (
                    <ListItemButton
                      key={`transactionsNavLink-${index}`}
                      component={NavLink}
                      to={maintenanceNavLinks.href}
                      style={{
                        backgroundColor:
                          location.pathname === maintenanceNavLinks.href
                            ? "#D9D9D9"
                            : "inherit",
                        marginTop: "5px",
                      }}
                      className="link"
                      sx={{
                        marginLeft: "20px",
                        marginRight: "20px",
                        borderRadius: "25px",
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color:
                            location.pathname === maintenanceNavLinks.href
                              ? "#1C2C5A"
                              : "#1C2C5A",
                          marginLeft: "5px",
                        }}
                      >
                        {maintenanceNavLinks.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={maintenanceNavLinks.label}
                        disableTypography
                        sx={{
                          color:
                            location.pathname === maintenanceNavLinks.href
                              ? "#1C2C5A"
                              : "#1C2C5A",
                          paddingLeft: "8px",
                          marginLeft: "-30px",
                          fontFamily: "Inter !important",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      />
                    </ListItemButton>
                  ))}
                </Collapse>
              </Box>
            )}
          </List>
        </StyledScrollBox>
      </Drawer>
    </>
  );
};

export default SideNav;
