import React, { useCallback, useEffect, useState } from "react";
import { Box, Grid, TextField } from "@mui/material";
import { Mode } from "./ExceptionsTable";
import IAccountingAdjustments from "../../Pages/_Interface/IAccountingAdjustments";
import IAccountingMatch from "../../Pages/_Interface/IAccountingMatch";
import IAccountingAdjustmentsView from "../../Pages/_Interface/IAccountingAdjustmentsView";
import { AxiosRequestConfig } from "axios";
import api from "../../Config/AxiosConfig";

interface CancelInvoiceProps {
  rowData?: IAccountingMatch | null;
  mode?: Mode;
}

interface TextFieldCompProps {
  tName: string;
  isMultiline: boolean;
  maxRows: number;
  isDisabled: boolean;
  value?: string | number | null | undefined;
  onChange: (field: keyof IAccountingAdjustments, value: any) => void;
}

const TextFieldComponent: React.FC<TextFieldCompProps> = ({
  tName,
  isMultiline,
  maxRows,
  isDisabled,
  value,
  onChange,
}) => {
  return (
    <TextField
      size="small"
      type="text"
      name={tName}
      fullWidth
      variant="outlined"
      required
      value={value}
      onChange={(e) =>
        onChange(
          tName as keyof IAccountingAdjustments,
          e.target.value.trim() === "" ? "" : e.target.value
        )
      }
      disabled={isDisabled}
      multiline={isMultiline}
      rows={maxRows}
      InputProps={{
        sx: {
          borderRadius: "10px",
          backgroundColor: isDisabled ? "#EEEEEE" : "#FFFFFF",
          height: !isMultiline ? "35px" : "80px",
          fontSize: "13px",
          color: "#1C2C5A",
          "& fieldset": { border: "none" },
          boxShadow:
            "inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)",
        },
      }}
      sx={{
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "#1C2C5A",
        },
      }}
    />
  );
};

const AccountingViewChargeableFields: React.FC<CancelInvoiceProps> = ({
  rowData,
  mode,
}) => {
  const [accountingAdjustments, setAccountingAdjustments] =
    useState<IAccountingAdjustments>();
  const [adjustments, setAdjustments] = useState<IAccountingAdjustmentsView>(
    {} as IAccountingAdjustmentsView
  );

  const fetchAdjustments = useCallback(async () => {
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url: `/Analytics/GetAccountingAdjustments?Id=${rowData?.MatchId}`,
      };

      await api(config)
        .then(async (response) => {
          setAdjustments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  }, []);

  useEffect(() => {
    if (adjustments) {
      fetchAdjustments();
    }
  }, []);

  const handleChange = (field: keyof IAccountingAdjustments, value: any) => {
    const sanitizedValue = value !== undefined ? value : "";
    setAccountingAdjustments((prevValues) => ({
      ...prevValues,
      [field]: sanitizedValue,
    }));
  };

  useEffect(() => {
    setAccountingAdjustments({
      MatchId: adjustments?.MatchId,
      AnalyticsId: adjustments?.AccountingAnalyticsId,
      ProofListId: adjustments?.AccountingProofListId,
      Amount: adjustments?.Amount,
      Remarks: adjustments?.Remarks,
      AccountsPaymentRefNo: adjustments?.AccountPaymentReferenceNo,
    });
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid
          item
          xs={8}
          sx={{
            fontFamily: "Inter",
            fontWeight: "900",
            color: "#1C2C5A",
            fontSize: "15px",
          }}
        >
          Adjustment
        </Grid>
        <Grid item xs={11.5} sx={{ marginLeft: "10px" }}>
          <Box display={"flex"}>
            <TextFieldComponent
              tName="AdjustmentId"
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={"CHARGE TO CASHIER"}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            fontFamily: "Inter",
            fontWeight: "900",
            color: "#1C2C5A",
            fontSize: "15px",
          }}
        >
          Transaction Date
        </Grid>
        <Grid item xs={11.5} sx={{ marginLeft: "10px" }}>
          <Box display={"flex"}>
            <TextFieldComponent
              tName="AnalyticsTransactionDate"
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={
                rowData?.AnalyticsTransactionDate !== null
                  ? new Date(
                      rowData?.AnalyticsTransactionDate ?? ""
                    ).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : ""
              }
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            fontFamily: "Inter",
            fontWeight: "900",
            color: "#1C2C5A",
            fontSize: "15px",
          }}
        >
          JO No.
        </Grid>
        <Grid item xs={11.5} sx={{ marginLeft: "10px" }}>
          <Box display={"flex"}>
            <TextFieldComponent
              tName="AnalyticsOrderNo"
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={rowData?.AnalyticsOrderNo}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            fontFamily: "Inter",
            fontWeight: "900",
            color: "#1C2C5A",
            fontSize: "15px",
          }}
        >
          Location
        </Grid>
        <Grid item xs={11.5} sx={{ marginLeft: "10px" }}>
          <Box display={"flex"}>
            <TextFieldComponent
              tName="AnalyticsLocation"
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={rowData?.AnalyticsLocation}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            fontFamily: "Inter",
            fontWeight: "900",
            color: "#1C2C5A",
            fontSize: "15px",
          }}
        >
          Amount
        </Grid>
        <Grid item xs={11.5} sx={{ marginLeft: "10px" }}>
          <Box display={"flex"}>
            <TextFieldComponent
              tName="AnalyticsAmount"
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={rowData?.AnalyticsAmount}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            fontFamily: "Inter",
            fontWeight: "900",
            color: "#1C2C5A",
            fontSize: "15px",
          }}
        >
          Cashier Name
        </Grid>
        <Grid item xs={11.5} sx={{ marginLeft: "10px" }}>
          <Box display={"flex"}>
            <TextFieldComponent
              tName="CashierName"
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={adjustments?.CashierName}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            fontFamily: "Inter",
            fontWeight: "900",
            color: "#1C2C5A",
            fontSize: "15px",
          }}
        >
          Agency
        </Grid>
        <Grid item xs={11.5} sx={{ marginLeft: "10px" }}>
          <Box display={"flex"}>
            <TextFieldComponent
              tName="Agency"
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={adjustments?.Agency}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            fontFamily: "Inter",
            fontWeight: "900",
            color: "#1C2C5A",
            fontSize: "15px",
          }}
        >
          Amount
        </Grid>
        <Grid item xs={11.5} sx={{ marginLeft: "10px" }}>
          <Box display={"flex"}>
            <TextFieldComponent
              tName="Amount"
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={adjustments?.Amount}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            fontFamily: "Inter",
            fontWeight: "900",
            color: "#1C2C5A",
            fontSize: "15px",
          }}
        >
          Remarks
        </Grid>
        <Grid item xs={11.5} sx={{ marginLeft: "10px" }}>
          <Box display={"flex"}>
            <TextFieldComponent
              tName="Remarks"
              isMultiline={true}
              maxRows={4}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={adjustments?.Remarks}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountingViewChargeableFields;
