import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import PageviewIcon from "@mui/icons-material/Pageview";
import IAccountingStatusMatch from "../../Pages/_Interface/IAccountingStatusMatch";
import StyledButton from "../ReusableComponents/ButtonComponents/StyledButton";

interface PaymentReconProps {
  isDashboard: boolean;
  handleOpenPaid?: () => void;
  handleOpenUnPaid?: () => void;
  handleOpenAdjustments?: () => void;
  statusMatch?: IAccountingStatusMatch[];
}

const PaymentReconCards: React.FC<PaymentReconProps> = ({
  isDashboard,
  handleOpenPaid,
  handleOpenUnPaid,
  handleOpenAdjustments,
  statusMatch,
}) => {

  const getAmountForStatus = (status: string): number => {
    console.log("status", status)
    const match = statusMatch?.find((item) => item.Status === status);
    console.log("match", match)
    return match ? match.TotalAmount : 0;
  };

  const getCountForStatus = (status: string): number => {
    const match = statusMatch?.find((item) => item.Status === status);
    return match ? match.Count : 0;
  };

  return (
    <Box
      sx={{
        marginTop: "10px",
        display: "flex",
        gap: 0,
        width: "100%",
        border: "1px solid #CCCCCC",
        borderRadius: "20px",
        overflow: "hidden",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", gap: 0 }}>
          <Card
            sx={{
              border: "none",
              boxShadow: "none",
              margin: 0,
              padding: 0,
              borderRadius: "0",
              width: "100%",
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontSize: !isDashboard ? "15px" : "25px",
                  color: "#FFFFFF",
                  backgroundColor: "#5C9275",
                  padding: 1,
                  borderRadius: "25px",
                  textAlign: "center",
                  boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                Paid
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: !isDashboard ? "20px" : "30px",
                  color: "#7081B6",
                }}
              >
                {getCountForStatus("PAID")}
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: !isDashboard ? "20px" : "30px",
                  color: "#1C2C5A",
                }}
              >
                {getAmountForStatus("PAID").toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              border: "none",
              boxShadow: "none",
              margin: 0,
              padding: 0,
              borderRadius: "0",
              width: "100%",
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontSize: !isDashboard ? "15px" : "25px",
                  color: "#FFFFFF",
                  backgroundColor: "#CDBE6A",
                  padding: 1,
                  borderRadius: "25px",
                  textAlign: "center",
                  boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                Underpaid
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: !isDashboard ? "20px" : "30px",
                  color: "#7081B6",
                }}
              >
                {getCountForStatus("UNDERPAID")}
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: !isDashboard ? "20px" : "30px",
                  color: "#1C2C5A",
                }}
              >
                {getAmountForStatus("UNDERPAID").toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              border: "none",
              boxShadow: "none",
              margin: 0,
              padding: 0,
              borderRadius: "0",
              width: "100%",
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontSize: !isDashboard ? "15px" : "25px",
                  color: "#FFFFFF",
                  backgroundColor: "#A865B9",
                  padding: 1,
                  borderRadius: "25px",
                  textAlign: "center",
                  boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                Overpaid
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: !isDashboard ? "20px" : "30px",
                  color: "#7081B6",
                }}
              >
                {getCountForStatus("OVERPAID")}
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: !isDashboard ? "20px" : "30px",
                  color: "#1C2C5A",
                }}
              >
                {getAmountForStatus("OVERPAID").toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              border: "none",
              boxShadow: "none",
              margin: 0,
              padding: 0,
              borderRadius: "0",
              width: "100%",
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontSize: !isDashboard ? "15px" : "25px",
                  color: "#FFFFFF",
                  backgroundColor: "#6568B9",
                  padding: 1,
                  borderRadius: "25px",
                  textAlign: "center",
                  boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                Not Reported
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: !isDashboard ? "20px" : "30px",
                  color: "#7081B6",
                }}
              >
                {getCountForStatus("NOT REPORTED")}
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: !isDashboard ? "20px" : "30px",
                  color: "#1C2C5A",
                }}
              >
                {getAmountForStatus("NOT REPORTED").toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        {!isDashboard ? (
          <StyledButton
            sx={{
              color: "white",
              fontSize: "14px",
              backgroundColor: "#1C3766",
              margin: "-20px 20px 10px 20px",
              borderRadius: "20px",
              fontFamily: "Inter",
              fontWeight: "900",
              height: "30px",
              paddingRight: "15px",
              //borderColor: isGenerated ? 'inherit' : '#1C3766',
              "& .MuiTypography-root": {
                fontSize: "14px",
              },
            }}
            onClick={handleOpenPaid}
            // disabled={isGenerated ? true : false}
          >
            <PageviewIcon sx={{ marginRight: "5px" }} />
            <Typography>View</Typography>
          </StyledButton>
        ) : (
          <Box></Box>
        )}
      </Box>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "25%",
        }}
      >
        <Box sx={{ display: "flex", gap: 0 }}>
          <Card
            sx={{
              border: "none",
              boxShadow: "none",
              margin: 0,
              padding: 0,
              borderRadius: "0",
              width: "100%",
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontSize: !isDashboard ? "15px" : "25px",
                  color: "#FFFFFF",
                  backgroundColor: "#B7763B",
                  padding: 1,
                  borderRadius: "25px",
                  textAlign: "center",
                  boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                Unpaid
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: !isDashboard ? "20px" : "30px",
                  color: "#7081B6",
                }}
              >
                {getCountForStatus("UNPAID")}
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: !isDashboard ? "20px" : "30px",
                  color: "#1C2C5A",
                }}
              >
                {getAmountForStatus("UNPAID").toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        {!isDashboard ? (
          <StyledButton
            sx={{
              color: "white",
              fontSize: "14px",
              backgroundColor: "#1C3766",
              margin: "-20px 20px 10px 20px",
              borderRadius: "20px",
              fontFamily: "Inter",
              fontWeight: "900",
              height: "30px",
              paddingRight: "15px",
              //borderColor: isGenerated ? 'inherit' : '#1C3766',
              "& .MuiTypography-root": {
                fontSize: "14px",
              },
            }}
            onClick={handleOpenUnPaid}
            // disabled={isGenerated ? true : false}
          >
            <PageviewIcon sx={{ marginRight: "5px" }} />
            <Typography>View</Typography>
          </StyledButton>
        ) : (
          <Box></Box>
        )}
      </Box>
      <Divider orientation="vertical" variant="middle" flexItem />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "25%",
        }}
      >
        <Box sx={{ display: "flex", gap: 0 }}>
          <Card
            sx={{
              border: "none",
              boxShadow: "none",
              margin: 0,
              padding: 0,
              borderRadius: "0",
              width: "100%",
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  fontSize: !isDashboard ? "15px" : "25px",
                  color: "#FFFFFF",
                  backgroundColor: "#A82A2A",
                  padding: 1,
                  borderRadius: "25px",
                  textAlign: "center",
                  boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                Adjustments
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: !isDashboard ? "20px" : "30px",
                  color: "#7081B6",
                }}
              >
                {getCountForStatus("ADJUSTMENTS")}
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: !isDashboard ? "20px" : "30px",
                  color: "#1C2C5A",
                }}
              >
                {getAmountForStatus("ADJUSTMENTS").toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        {!isDashboard ? (
          <StyledButton
            sx={{
              color: "white",
              fontSize: "14px",
              backgroundColor: "#1C3766",
              margin: "-20px 20px 10px 20px",
              borderRadius: "20px",
              fontFamily: "Inter",
              fontWeight: "900",
              height: "30px",
              paddingRight: "15px",
              //borderColor: isGenerated ? 'inherit' : '#1C3766',
              "& .MuiTypography-root": {
                fontSize: "14px",
              },
            }}
            onClick={handleOpenAdjustments}
            // disabled={isGenerated ? true : false}
          >
            <PageviewIcon sx={{ marginRight: "5px" }} />
            <Typography>View</Typography>
          </StyledButton>
        ) : (
          <Box></Box>
        )}
      </Box>
    </Box>
  );
};

export default PaymentReconCards;