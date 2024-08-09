import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import IAdjustmentAddProps from "../../Pages/_Interface/IAdjustmentAddProps";
import { AxiosRequestConfig } from "axios";
import IException from "../../Pages/_Interface/IException";
import { Mode } from "./ExceptionsTable";
import IMerchants from "../../Pages/SystemAdmin/Merchants/Interface/IMerchants";
import api from "../../Config/AxiosConfig";

interface IncorrectPartnerProps {
  rowData: IException | null;
  onAdjustmentValuesChange: (
    field: keyof IAdjustmentAddProps,
    value: any
  ) => void;
  mode: Mode;
}

const IncorrectPartnerFields: React.FC<IncorrectPartnerProps> = ({
  rowData,
  onAdjustmentValuesChange,
  mode,
}) => {
  const [customerCodes, setCustomerCodes] = useState<IMerchants[]>([]);
  const [exceptions, setExceptions] = useState<IAdjustmentAddProps>();
  const [selectedNew, setSelectedNew] = useState<string>("");

  const fetchCustomerCodes = useCallback(async () => {
    try {
      const config: AxiosRequestConfig = {
        method: "GET",
        url: `/CustomerCode/GetCustomerDdCodesAsync`,
        data: "",
      };

      await api(config)
        .then(async (response) => {
          setCustomerCodes(response.data);
        })
        .catch((error) => {
          console.error("Error fetching item:", error);
        });
    } catch (error) {
      console.error("Error fetching customer codes:", error);
    }
  }, []);

  useEffect(() => {
    fetchCustomerCodes();
  }, [fetchCustomerCodes]);

  const handleChange = (field: keyof IAdjustmentAddProps, value: any) => {
    if (typeof onAdjustmentValuesChange === "function") {
      const sanitizedValue = value !== undefined ? value : "";

      if (field === "CustomerId") {
        setSelectedNew(sanitizedValue);
      }

      setExceptions((prevValues) => ({
        ...prevValues,
        [field]: sanitizedValue,
      }));

      onAdjustmentValuesChange(field, sanitizedValue);
    }
  };

  useEffect(() => {
    setExceptions({
      Id: rowData?.Id,
      DisputeReferenceNumber: rowData?.DisputeReferenceNumber,
      DisputeAmount: rowData?.DisputeAmount,
      DateDisputeFiled: rowData?.DateDisputeFiled,
      DescriptionOfDispute: rowData?.DescriptionOfDispute,
      NewJO: rowData?.JoNumber,
      CustomerId: rowData?.CustomerId,
      AccountsPaymentDate: rowData?.AccountsPaymentDate,
      AccountsPaymentTransNo: rowData?.AccountsPaymentTransNo,
      AccountsPaymentAmount: rowData?.AccountsPaymentAmount,
      ReasonId: rowData?.ReasonId,
      Descriptions: rowData?.Descriptions,
    });

    if (rowData?.CustomerId !== undefined && rowData?.CustomerId !== null) {
      setSelectedNew(rowData?.CustomerId as string);
    }

    onAdjustmentValuesChange("Id", null);
    onAdjustmentValuesChange("DisputeReferenceNumber", null);
    onAdjustmentValuesChange("DisputeAmount", null);
    onAdjustmentValuesChange("DateDisputeFiled", null);
    onAdjustmentValuesChange("DescriptionOfDispute", null);
    onAdjustmentValuesChange("NewJO", rowData?.JoNumber);
    onAdjustmentValuesChange("AccountsPaymentDate", null);
    onAdjustmentValuesChange("AccountsPaymentTransNo", null);
    onAdjustmentValuesChange("AccountsPaymentAmount", null);
    onAdjustmentValuesChange("ReasonId", null);
    onAdjustmentValuesChange("DeleteFlag", false);
  }, [onAdjustmentValuesChange]);

  useEffect(() => {
  }, [selectedNew]);

  if (mode === Mode.RESOLVE) {
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
            Move this transaction to:
          </Grid>
          <Grid item xs={11.5} sx={{ marginLeft: "10px", marginTop: "10px" }}>
            <Box display={"flex"}>
              <Autocomplete
                fullWidth
                options={customerCodes}
                getOptionLabel={(option) => option.CustomerName}
                onChange={(event, value) => {
                  handleChange("CustomerId", value?.CustomerCode || "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Partner" variant="outlined" />
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  } else if (mode === Mode.VIEW) {
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
            Previous Merchant:
          </Grid>
          <Grid item xs={11.5} sx={{ marginLeft: "10px", marginTop: "10px" }}>
            <Box display={"flex"}>
              <Autocomplete
                fullWidth
                options={customerCodes}
                getOptionLabel={(option) => option.CustomerName}
                disabled={true}
                value={
                  customerCodes.find(
                    (option) => option.CustomerCode === rowData?.OldCustomerId
                  ) || null
                }
                onChange={(event, value) => {
                  handleChange("CustomerId", value?.CustomerCode || "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Partner" variant="outlined" />
                )}
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
            Current Merchant:
          </Grid>
          <Grid item xs={11.5} sx={{ marginLeft: "10px", marginTop: "10px" }}>
            <Box display={"flex"}>
              <Autocomplete
                fullWidth
                options={customerCodes}
                getOptionLabel={(option) => option.CustomerName}
                disabled={true}
                value={
                  customerCodes.find(
                    (option) => option.CustomerName === rowData?.CustomerId
                  ) || null
                }
                onChange={(event, value) => {
                  handleChange("CustomerId", value?.CustomerCode || "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Partner" variant="outlined" />
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  } else {
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
            Previous Merchant:
          </Grid>
          <Grid item xs={11.5} sx={{ marginLeft: "10px", marginTop: "10px" }}>
            <Box display={"flex"}>
              <Autocomplete
                fullWidth
                options={customerCodes}
                getOptionLabel={(option) => option.CustomerName}
                disabled={true}
                value={
                  customerCodes.find(
                    (option) => option.CustomerCode === rowData?.OldCustomerId
                  ) || null
                }
                onChange={(event, value) => {
                  handleChange("CustomerId", value?.CustomerCode || "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Partner" variant="outlined" />
                )}
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
            Current Merchant:
          </Grid>
          <Grid item xs={11.5} sx={{ marginLeft: "10px", marginTop: "10px" }}>
            <Box display={"flex"}>
              <Autocomplete
                fullWidth
                options={customerCodes}
                getOptionLabel={(option) => option.CustomerName}
                disabled={false}
                value={customerCodes.find(
                  (option) => option.CustomerName === selectedNew
                )}
                onChange={(event, value) => {
                  handleChange("CustomerId", value?.CustomerCode || "");
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Partner" variant="outlined" />
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
};

export default IncorrectPartnerFields;