import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Box,
  Grid,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ModalComponent from "./ModalComponent";
import { AxiosRequestConfig } from "axios";
import IAccountingMatch from "../../Pages/_Interface/IAccountingMatch";
import IAccountingAdjustments from "../../Pages/_Interface/IAccountingAdjustments";
import IAnalyticProps from "../../Pages/_Interface/IAnalyticsProps";
import AccountingRetransactInvoiceFields from "./AccountingRetransactInvoiceFields";
import AccountingMatchPaymentFields from "./AccountingMatchPaymentFields";
import IAccountingMatchPayment from "../../Pages/_Interface/IAccountingMatchPayment";
import AccountingAccountsPaymentFields from "./AccountingAccountsPaymentFields";
import AccountingViewAccountsPaymentFields from "./AccountingViewAccountsPaymentFields";
import AccountingChargeableFields from "./AccountingChargeableFields";
import AccountingViewChargeableFields from "./AccountingViewChargeableFields";
import AccountingChronology from "./AccountingChronology";
import api from "../../Config/AxiosConfig";
import StyledSnackBar from "../ReusableComponents/NotificationComponents/StyledAlert";

export enum Mode {
  VIEW = "View",
  EDIT = "Edit",
  RESOLVE = "Resolve",
}

interface AccountingAdjustmentTypeModalProps {
  open: boolean;
  onClose: () => void;
  row: IAccountingMatch;
  setIsModalClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledButton = styled(Button)(() => ({
  textTransform: "none",
  backgroundColor: "#4761AD",
  "&:hover": {
    backgroundColor: "#20346E",
    color: "white",
  },
  color: "white",
  fontWeight: "bold",
  fontSize: "15px",
  height: "40px",
  borderRadius: "10px",
  boxShadow: "1px 5px 4px -1px rgba(0,0,0,0.3)",
  marginTop: "10px",
  width: "100%",
}));

const AccountingAdjustmentTypeModal: React.FC<
  AccountingAdjustmentTypeModalProps
> = ({ open, onClose, row, setIsModalClose }) => {
  const getClub = window.localStorage.getItem("club");
  const getId = window.localStorage.getItem("Id");
  const [retransactInvoiceOpen, setRetransactInvoiceOpen] =
    useState<boolean>(false);
  const [matchPaymentOpen, setMatchPaymentOpen] = useState<boolean>(false);
  const [accountsPaymentOpen, setAccountsPaymentOpen] =
    useState<boolean>(false);
  const [viewAccountsPaymentOpen, setViewAccountsPaymentOpen] =
    useState<boolean>(false);
  const [chargeable, setChargeableOpen] = useState<boolean>(false);
  const [viewChargeableOpen, setViewChargeableOpen] = useState<boolean>(false);
  const [viewHistoryOpen, setViewHistoryOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "error" | "warning" | "info" | "success"
  >("success");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [adjustmentFields, setAdjustmentFields] =
    useState<IAccountingAdjustments>({} as IAccountingAdjustments);
  const [adjustmentId, setAjustmentId] = useState<number>();
  const [selectedRow, setSelectedRow] =
    useState<IAccountingMatchPayment | null>(null);

  let ActionId = 0;
  let StatusId = 0;
  let club = 0;
  if (getClub !== null) {
    club = parseInt(getClub, 10);
  }

  let Id = "";
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

  useEffect(() => {}, [adjustmentId]);

  const handleAdjustmentChange = useCallback(
    (field: keyof IAccountingAdjustments, value: any) => {
      setAdjustmentFields((prevValues) => ({
        ...prevValues,
        [field]: value,
      }));
    },
    []
  );

  const handleSubmit = async () => {
    if (retransactInvoiceOpen) {
      ActionId = 1;
      if (!adjustmentFields?.Remarks) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Please input required fields.");
        return;
      }
    } else if (matchPaymentOpen) {
      ActionId = 2;
      if (selectedRow === null) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Please input or select required field.");
        return;
      }
    } else if (accountsPaymentOpen) {
      ActionId = 3;
      if (
        !adjustmentFields?.AccountsPaymentRefNo ||
        !adjustmentFields?.Amount
      ) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Please input required field.");
        return;
      }
    } else {
      ActionId = 4;
      if (
        !adjustmentFields?.CashierName ||
        !adjustmentFields?.Agency ||
        !adjustmentFields?.Amount
      ) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Please input required field.");
        return;
      }
    }

    const analyticsParams: IAnalyticProps = {
      memCode: [row.ProofListPartner ?? ""],
      userId: Id,
      storeId: [club],
    };

    const paramAdjustment = {
      AccountingAdjustmentTypeId: ActionId,
      NewTransactionDate: adjustmentFields.NewTransactionDate,
      AccountPaymentReferenceNo: adjustmentFields.AccountsPaymentRefNo,
      CashierName: adjustmentFields.CashierName,
      Agency: adjustmentFields.Agency,
      Amount: adjustmentFields.Amount,
      Remarks: adjustmentFields.Remarks
        ? adjustmentFields.Remarks
        : ActionId === 2
        ? "Match Payment"
        : "",
      MatchId: adjustmentFields?.MatchId,
      ProofListMatchId: selectedRow?.MatchId,
      AccountingAnalyticsId: adjustmentFields?.AnalyticsId,
      AccountingProofListId:
        selectedRow?.ProofListId ?? adjustmentFields?.ProofListId,
      DeleteFlag: false,
      analyticsParamsDto: analyticsParams,
    };

    const config: AxiosRequestConfig = {
      method: "POST",
      url: `/Analytics/UpdateAccountingAdjustments`,
      data: paramAdjustment,
    };

    await api(config)
      .then((result) => {
        if (result.data === true) {
          handleCloseModalRetransact();
          handleCloseModalMatch();
          handleCloseModalAccounts();
          setIsModalClose(true);
          onClose();
          setIsSnackbarOpen(true);
          setSnackbarSeverity("success");
          setMessage("Adjustments updated successfully!");
        } else {
          handleCloseModalRetransact();
          handleCloseModalMatch();
          handleCloseModalAccounts();
          setIsModalClose(true);
          onClose();
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage(
            "Adjustments update failed. Kindly check the amount or variances."
          );
        }
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Error occurred. Please try again.");
        setIsModalClose(true);
        onClose();
      });
  };

  //Retransact Invoice
  const handleRetransactInvoiceClick = () => {
    setRetransactInvoiceOpen(true);
  };

  const handleCloseModalRetransact = () => {
    setRetransactInvoiceOpen(false);
  };

  //Match Payment
  const handleMatchPaymentClick = () => {
    setMatchPaymentOpen(true);
  };

  const handleCloseModalMatch = () => {
    setMatchPaymentOpen(false);
  };

  //Accounts Payment
  const handleAccountsPaymentClick = () => {
    setAccountsPaymentOpen(true);
  };

  const handleCloseModalAccounts = () => {
    setAccountsPaymentOpen(false);
  };

  //View Accounts Payment
  const handleViewAccountsPaymentClick = async () => {
    setViewAccountsPaymentOpen(true);
  };

  const handleCloseModalViewAccounts = () => {
    setViewAccountsPaymentOpen(false);
  };

  //Chargeable
  const handleChargeableClick = async () => {
    setChargeableOpen(true);
  };

  const handleCloseModalChargeable = () => {
    setChargeableOpen(false);
  };

  //View Chargeable
  const handleViewChargeableClick = async () => {
    setViewChargeableOpen(true);
  };

  const handleCloseModalViewChargeable = () => {
    setViewChargeableOpen(false);
  };

  //View History
  const handleViewHistoryClick = async () => {
    setViewHistoryOpen(true);
  };

  const handleCloseModalViewHistory = () => {
    setViewHistoryOpen(false);
  };

  return (
    <Box>
      <Dialog
        onClose={(reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            onClose();
          }
        }}
        open={open}
        classes={{ paper: "custom-dialog-paper" }}
        sx={{
          "& .MuiDialog-paper": {
            width: "500px",
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#1C3766",
            fontWeight: "bold",
            userSelect: "none",
            cursor: "default",
          }}
        >
          Adjustment Type
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              padding: "15px 25px 20px 25px",
              transition: "left 0.3s ease",
              backgroundColor: "#F2F2F2",
              borderRadius: "25px",
              boxShadow:
                "inset 6px 9px 8px -1px rgba(0,0,0,0.3), inset -6px 0px 8px -1px rgba(0,0,0,0.3)",
            }}
          >
            <Grid container columnSpacing={2} justifyContent="center">
              {row.Status === "UNPAID" ? (
                <>
                  <Grid item xs={12}>
                    <StyledButton onClick={() => handleMatchPaymentClick()}>
                      Match Payment
                    </StyledButton>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledButton onClick={() => handleChargeableClick()}>
                      Charge To Cashier
                    </StyledButton>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledButton onClick={() => handleAccountsPaymentClick()}>
                      Accounts Payment
                    </StyledButton>
                  </Grid>
                </>
              ) : row.Status === "CHARGEABLE" ? (
                <>
                  <Grid item xs={12}>
                    <StyledButton onClick={() => handleViewChargeableClick()}>
                      View Chargeable
                    </StyledButton>
                  </Grid>
                </>
              ) : row.Status === "CLAWBACK" || row.Status === "UNDERPAYMENT" ? (
                <>
                  <Grid item xs={12}>
                    <StyledButton onClick={() => handleChargeableClick()}>
                      Charge To Cashier
                    </StyledButton>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledButton onClick={() => handleAccountsPaymentClick()}>
                      Accounts Payment
                    </StyledButton>
                  </Grid>
                </>
              ) : row.Status === "RE-TRANSACT" ? (
                <>
                  <Grid item xs={12}>
                    <StyledButton onClick={() => handleAccountsPaymentClick()}>
                      Accounts Payment
                    </StyledButton>
                  </Grid>
                </>
              ) : row.Status?.includes("ADJUSTED") ? (
                <>
                  <Grid item xs={12}>
                    <StyledButton onClick={() => handleViewHistoryClick()}>
                      View History
                    </StyledButton>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledButton
                      onClick={() => handleRetransactInvoiceClick()}
                    >
                      Re-Transact
                    </StyledButton>
                  </Grid>
                </>
              ) : row.Status?.includes("WITH AP") ? (
                <>
                  <Grid item xs={12}>
                    <StyledButton
                      onClick={() => handleViewAccountsPaymentClick()}
                    >
                      View Accounts Payment
                    </StyledButton>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    <StyledButton
                      onClick={() => handleRetransactInvoiceClick()}
                    >
                      Re-Transact
                    </StyledButton>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
      <StyledSnackBar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={message}
      />
      <ModalComponent
        title="Re-Transact Invoice"
        onClose={handleCloseModalRetransact}
        buttonName="Save"
        open={retransactInvoiceOpen}
        onSave={handleSubmit}
        children={
          <AccountingRetransactInvoiceFields
            rowData={row}
            onAdjustmentValuesChange={handleAdjustmentChange}
          />
        }
      />
      <ModalComponent
        title="Match Payment"
        onClose={handleCloseModalMatch}
        buttonName="Save"
        open={matchPaymentOpen}
        onSave={handleSubmit}
        children={
          <AccountingMatchPaymentFields
            rowData={row}
            onAdjustmentValuesChange={handleAdjustmentChange}
            selectedRow={setSelectedRow}
          />
        }
      />
      <ModalComponent
        title="Accounts Payment"
        onClose={handleCloseModalAccounts}
        buttonName="Save"
        open={accountsPaymentOpen}
        onSave={handleSubmit}
        children={
          <AccountingAccountsPaymentFields
            rowData={row}
            onAdjustmentValuesChange={handleAdjustmentChange}
          />
        }
      />
      <ModalComponent
        title="View Accounts Payment"
        onClose={handleCloseModalViewAccounts}
        buttonName="Save"
        mode={Mode.VIEW}
        open={viewAccountsPaymentOpen}
        onSave={handleSubmit}
        children={<AccountingViewAccountsPaymentFields rowData={row} />}
      />
      <ModalComponent
        title="Charge To Cashier"
        onClose={handleCloseModalChargeable}
        buttonName="Save"
        open={chargeable}
        onSave={handleSubmit}
        children={
          <AccountingChargeableFields
            rowData={row}
            onAdjustmentValuesChange={handleAdjustmentChange}
          />
        }
      />
      <ModalComponent
        title="View Chargeable"
        onClose={handleCloseModalViewChargeable}
        buttonName="Save"
        open={viewChargeableOpen}
        mode={Mode.VIEW}
        onSave={handleSubmit}
        children={<AccountingViewChargeableFields rowData={row} />}
      />
      <ModalComponent
        title="View History"
        onClose={handleCloseModalViewHistory}
        buttonName="Save"
        open={viewHistoryOpen}
        mode={Mode.VIEW}
        onSave={handleSubmit}
        children={<AccountingChronology id={row.MatchId} />}
      />
    </Box>
  );
};

export default AccountingAdjustmentTypeModal;