import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ModalComponent from "./ModalComponent";
import ForFilingDisputeFields from "./ForFilingDisputeFields";
import IncorrectJOFields from "./IncorrectJOFields";
import IncorrectPartnerFields from "./IncorrectPartnerFields";
import ValidTransactionFields from "./ValidTransactionFields";
import { AxiosRequestConfig } from "axios";
import IAdjustmentAddProps from "../../Pages/_Interface/IAdjustmentAddProps";
import IException from "../../Pages/_Interface/IException";
import { Mode } from "./ExceptionsTable";
import CorrectionPrevDayFields from "./CorrectionPrevDayFields";
import AdvancePaymentFields from "./AdvancePaymentFields";
import IRefreshAnalytics from "../../Pages/_Interface/IRefreshAnalytics";
import OthersFields from "./OthersFields";
import StyledSnackBar from "../ReusableComponents/NotificationComponents/StyledAlert";
import api from "../../Config/AxiosConfig";
import StyledButton from "../ReusableComponents/ButtonComponents/StyledButton";

interface AdjustmentTypeModalProps {
  open: boolean;
  onClose: () => void;
  exception: IException;
  setIsModalClose: React.Dispatch<React.SetStateAction<boolean>>;
  mode: Mode;
  refreshAnalyticsDto?: IRefreshAnalytics;
  merchant?: string;
}

const AdjustmentTypeModal: React.FC<AdjustmentTypeModalProps> = ({
  open,
  onClose,
  exception,
  setIsModalClose,
  mode,
  refreshAnalyticsDto,
  merchant,
}) => {
  const getClub = window.localStorage.getItem("club");
  const getId = window.localStorage.getItem("Id");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenJO, setIsModalOpenJO] = useState<boolean>(false);
  const [isModalOpenPartner, setIsModalOpenPartner] = useState<boolean>(false);
  const [isModalOpenCancelled, setIsModalOpenCancelled] =
    useState<boolean>(false);
  const [isModalOpenCorrection, setIsModalOpenCorrection] =
    useState<boolean>(false);
  const [isModalOpenAdvPayment, setIsModalOpenAdvPayment] =
    useState<boolean>(false);
  const [isModalOpenOthers, setIsModalOpenOthers] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "error" | "warning" | "info" | "success"
  >("success");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [adjustmentFields, setAdjustmentFields] = useState<IAdjustmentAddProps>(
    {} as IAdjustmentAddProps
  );
  const [adjustmentId, setAjustmentId] = useState<number>();

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
    (field: keyof IAdjustmentAddProps, value: any) => {
      setAdjustmentFields((prevValues) => ({
        ...prevValues,
        [field]: value,
      }));
    },
    []
  );

  const handleSubmit = async () => {
    if (merchant !== undefined) {
      if (
        merchant === "VolumeShopper" ||
        merchant === "GCash" ||
        merchant === "WalkIn" ||
        merchant === "Employee" ||
        merchant === "BankPromos"
      ) {
        if (isModalOpen) {
          ActionId = 1;
          StatusId =
            adjustmentFields.DisputeReferenceNumber === undefined ||
            adjustmentFields.DisputeReferenceNumber === null ||
            adjustmentFields.DisputeReferenceNumber === ""
              ? 6
              : 3;
          if (
            !adjustmentFields.DisputeAmount ||
            !adjustmentFields.DateDisputeFiled
          ) {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Please input required fields.");
            return;
          }
        } else if (isModalOpenJO) {
          ActionId = 2;
          StatusId = 3;
          if (!adjustmentFields?.NewJO) {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Please input required field.");
            return;
          }
        } else if (isModalOpenPartner) {
          ActionId = 3;
          StatusId = 3;
          if (!adjustmentFields?.CustomerId) {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Please input required field.");
            return;
          }
        } else if (isModalOpenCancelled) {
          ActionId = 4;
          StatusId =
            adjustmentFields.AccountsPaymentTransNo === undefined ||
            adjustmentFields.AccountsPaymentTransNo === null ||
            adjustmentFields.AccountsPaymentTransNo === ""
              ? 6
              : 3;
          if (
            !adjustmentFields?.AccountsPaymentAmount ||
            !adjustmentFields?.AccountsPaymentDate ||
            !adjustmentFields?.ReasonId
          ) {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Please input required field.");
            return;
          }
        } else if (isModalOpenCorrection) {
          ActionId = 5;
          StatusId = 3;
          if (!adjustmentFields?.Descriptions) {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Please input required field.");
            return;
          }
        } else if (isModalOpenAdvPayment) {
          ActionId = 6;
          StatusId = 3;
          if (!adjustmentFields?.Descriptions) {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Please input required field.");
            return;
          }
        } else {
          ActionId = 7;
          StatusId = 3;
          if (!adjustmentFields?.Descriptions) {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Please input required field.");
            return;
          }
        }

        const paramAdjustment = {
          Id: exception.Id,
          AnalyticsId: exception.AnalyticsId,
          ProoflistId: exception.ProofListId,
          ActionId: ActionId,
          StatusId: StatusId,
          AdjustmentId: 0,
          DeleteFlag: false,
          AdjustmentAddDto: adjustmentFields,
          RefreshAnalyticsDto: refreshAnalyticsDto,
        };
        if (
          isModalOpen ||
          isModalOpenCancelled ||
          isModalOpenCorrection ||
          isModalOpenAdvPayment ||
          isModalOpenOthers ||
          isModalOpenJO ||
          isModalOpenPartner
        ) {
          const config: AxiosRequestConfig = {
            method: "POST", // Use PUT for updating, POST for adding
            url: `/Analytics/SaveException`,
            data: paramAdjustment,
          };
          await api(config)
            .then(async (response) => {
              paramAdjustment.AdjustmentId = response.data;
              console.log("paramAdjustment", paramAdjustment);
              if (isModalOpenJO || isModalOpenPartner) {
                console.error(
                  "paramAdjustment isModalOpenJO:",
                  paramAdjustment
                );
                const config: AxiosRequestConfig = {
                  method: "PUT", // Use PUT for updating, POST for adding
                  url: isModalOpenJO
                    ? `/Adjustment/UpdateJO`
                    : isModalOpenPartner
                    ? `/Adjustment/UpdatePartner`
                    : "",
                  data: paramAdjustment,
                };

                await await api(config)
                  .then(() => {})
                  .catch((error) => {
                    console.error("Error saving data:", error);
                    setIsSnackbarOpen(true);
                    setSnackbarSeverity("error");
                    setMessage("Error occurred. Please try again.");
                  });
              }
              setIsSnackbarOpen(true);
              setSnackbarSeverity("success");
              setMessage("Data saved successfully!");
              handleCloseModal();
              handleCloseModalJO();
              handleCloseModalPartner();
              handleCloseModalCancelled();
              handleCloseModalCorrection();
              handleCloseModalAdvPayment();
              handleCloseModalOthers();
              setIsModalClose(true);
              onClose();
            })
            .catch((error) => {
              console.error("Error saving data:", error);
              setIsSnackbarOpen(true);
              setSnackbarSeverity("error");
              setMessage("Error occurred. Please try again.");
            });
        }
      }
    } else {
      if (isModalOpen) {
        ActionId = 1;
        StatusId =
          adjustmentFields.DisputeReferenceNumber === undefined ||
          adjustmentFields.DisputeReferenceNumber === null ||
          adjustmentFields.DisputeReferenceNumber === ""
            ? 6
            : 3;
        if (
          !adjustmentFields.DisputeAmount ||
          !adjustmentFields.DateDisputeFiled
        ) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Please input required fields.");
          return;
        }
      } else if (isModalOpenJO) {
        ActionId = 2;
        StatusId = 3;
        if (!adjustmentFields?.NewJO) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Please input required field.");
          return;
        }
      } else if (isModalOpenPartner) {
        ActionId = 3;
        StatusId = 3;
        if (!adjustmentFields?.CustomerId) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Please input required field.");
          return;
        }
      } else if (isModalOpenCancelled) {
        ActionId = 4;
        StatusId =
          adjustmentFields.AccountsPaymentTransNo === undefined ||
          adjustmentFields.AccountsPaymentTransNo === null ||
          adjustmentFields.AccountsPaymentTransNo === ""
            ? 6
            : 3;
        if (
          !adjustmentFields?.AccountsPaymentAmount ||
          !adjustmentFields?.AccountsPaymentDate ||
          !adjustmentFields?.ReasonId
        ) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Please input required field.");
          return;
        }
      } else if (isModalOpenCorrection) {
        ActionId = 5;
        StatusId = 3;
        if (!adjustmentFields?.Descriptions) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Please input required field.");
          return;
        }
      } else if (isModalOpenAdvPayment) {
        ActionId = 6;
        StatusId = 3;
        if (!adjustmentFields?.Descriptions) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Please input required field.");
          return;
        }
      } else {
        ActionId = 7;
        StatusId = 3;
        if (!adjustmentFields?.Descriptions) {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Please input required field.");
          return;
        }
      }

      const paramAdjustment = {
        Id: exception.Id,
        AnalyticsId: exception.AnalyticsId,
        ProoflistId: exception.ProofListId,
        ActionId: ActionId,
        StatusId: StatusId,
        AdjustmentId: exception.AdjustmentId,
        DeleteFlag: false,
        AdjustmentAddDto: adjustmentFields,
        RefreshAnalyticsDto: refreshAnalyticsDto,
      };
      if (
        isModalOpen ||
        isModalOpenCancelled ||
        isModalOpenCorrection ||
        isModalOpenAdvPayment ||
        isModalOpenOthers
      ) {
        const config: AxiosRequestConfig = {
          method: "PUT", // Use PUT for updating, POST for adding
          url: `/Adjustment/UpdateAnalyticsProofList`,
          data: paramAdjustment,
        };

        await api(config)
          .then(() => {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("success");
            setMessage("Data saved successfully!");
            handleCloseModal();
            handleCloseModalJO();
            handleCloseModalPartner();
            handleCloseModalCancelled();
            handleCloseModalCorrection();
            handleCloseModalAdvPayment();
            handleCloseModalOthers();
            setIsModalClose(true);
            onClose();
          })
          .catch((error) => {
            console.error("Error saving data:", error);
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Error occurred. Please try again.");
          });
      }
      if (isModalOpenJO || isModalOpenPartner) {
        const config: AxiosRequestConfig = {
          method: "PUT", // Use PUT for updating, POST for adding
          url: isModalOpenJO
            ? `/Adjustment/UpdateJO`
            : isModalOpenPartner
            ? `/Adjustment/UpdatePartner`
            : "",
          data: paramAdjustment,
        };

        await api(config)
          .then(() => {
            setSnackbarSeverity("success");
            setMessage("Data saved successfully!");
            handleCloseModal();
            handleCloseModalJO();
            handleCloseModalPartner();
            handleCloseModalCancelled();
            handleCloseModalCorrection();
            handleCloseModalAdvPayment();
            handleCloseModalOthers();
            setIsModalClose(true);
            onClose();
          })
          .catch((error) => {
            console.error("Error saving data:", error);
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Error occurred. Please try again.");
          });
      }
    }
  };

  //Filing Dispute
  const handleFilingDisputeClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAdjustmentFields({} as IAdjustmentAddProps);
  };

  //Incorrect JO Number
  const handleJOClick = () => {
    setIsModalOpenJO(true);
  };

  const handleCloseModalJO = () => {
    setIsModalOpenJO(false);
    setAdjustmentFields({} as IAdjustmentAddProps);
  };

  //Incorrect Partner/Merchant
  const handlePartnerClick = () => {
    setIsModalOpenPartner(true);
  };

  const handleCloseModalPartner = () => {
    setIsModalOpenPartner(false);
    setAdjustmentFields({} as IAdjustmentAddProps);
  };

  //Valid Cancelled Transaction
  const handleCancelledClick = () => {
    setIsModalOpenCancelled(true);
  };

  const handleCloseModalCancelled = () => {
    setIsModalOpenCancelled(false);
    setAdjustmentFields({} as IAdjustmentAddProps);
  };

  //Correction from Previous Day
  const handleCorrectionClick = () => {
    setIsModalOpenCorrection(true);
  };

  const handleCloseModalCorrection = () => {
    setIsModalOpenCorrection(false);
    setAdjustmentFields({} as IAdjustmentAddProps);
  };

  //Advance Payment
  const handleAdvPaymentClick = () => {
    setIsModalOpenAdvPayment(true);
  };

  const handleCloseModalAdvPayment = () => {
    setIsModalOpenAdvPayment(false);
    setAdjustmentFields({} as IAdjustmentAddProps);
  };

  //Others
  const handleOthersClick = () => {
    setIsModalOpenOthers(true);
  };

  const handleCloseModalOthers = () => {
    setIsModalOpenOthers(false);
    setAdjustmentFields({} as IAdjustmentAddProps);
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
              <Grid item xs={12}>
                <StyledButton onClick={() => handleFilingDisputeClick()}>
                  For Filing Dispute
                </StyledButton>
              </Grid>
              {exception.Source !== "Portal" && (
                <>
                  <Grid item xs={12}>
                    <StyledButton onClick={() => handleJOClick()}>
                      Incorrect JO Number
                    </StyledButton>
                  </Grid>
                  <Grid item xs={12}>
                    <StyledButton onClick={() => handlePartnerClick()}>
                      Incorrect Partner/Merchant
                    </StyledButton>
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <StyledButton onClick={() => handleCancelledClick()}>
                  Valid Cancelled Transactions
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <StyledButton onClick={() => handleCorrectionClick()}>
                  Correction from Previous Day
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <StyledButton onClick={() => handleAdvPaymentClick()}>
                  Advance Payment
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <StyledButton onClick={() => handleOthersClick()}>
                  Others
                </StyledButton>
              </Grid>
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
        title="For Filing Dispute"
        onClose={handleCloseModal}
        buttonName="Save"
        open={isModalOpen}
        onSave={handleSubmit}
        mode={mode}
        children={
          <ForFilingDisputeFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={mode}
          />
        }
      />
      <ModalComponent
        title="Incorrect JO Number"
        onClose={handleCloseModalJO}
        buttonName="Save"
        open={isModalOpenJO}
        onSave={handleSubmit}
        mode={mode}
        children={
          <IncorrectJOFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={mode}
          />
        }
      />
      <ModalComponent
        title="Incorrect Partner/Merchant"
        onClose={handleCloseModalPartner}
        buttonName="Save"
        open={isModalOpenPartner}
        onSave={handleSubmit}
        children={
          <IncorrectPartnerFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={mode}
          />
        }
      />
      <ModalComponent
        title="Valid Cancelled Transaction"
        onClose={handleCloseModalCancelled}
        buttonName="Save"
        open={isModalOpenCancelled}
        onSave={handleSubmit}
        mode={mode}
        children={
          <ValidTransactionFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={mode}
          />
        }
      />
      <ModalComponent
        title="Correction from Previous Day"
        onClose={handleCloseModalCorrection}
        buttonName="Save"
        open={isModalOpenCorrection}
        onSave={handleSubmit}
        mode={mode}
        children={
          <CorrectionPrevDayFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={mode}
          />
        }
      />
      <ModalComponent
        title="Advance Payment"
        onClose={handleCloseModalAdvPayment}
        buttonName="Save"
        open={isModalOpenAdvPayment}
        onSave={handleSubmit}
        mode={mode}
        children={
          <AdvancePaymentFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={mode}
          />
        }
      />
      <ModalComponent
        title="Others"
        onClose={handleCloseModalOthers}
        buttonName="Save"
        open={isModalOpenOthers}
        onSave={handleSubmit}
        mode={mode}
        children={
          <OthersFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={mode}
          />
        }
      />
    </Box>
  );
};

export default AdjustmentTypeModal;