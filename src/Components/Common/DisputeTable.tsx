import {
  Box,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import IException from "../../Pages/_Interface/IException";
import { useCallback, useState } from "react";
import AdjustmentTypeModal from "./AdjustmentTypeModal";
import ModalComponent from "./ModalComponent";
import ForFilingDisputeFields from "./ForFilingDisputeFields";
import IncorrectJOFields from "./IncorrectJOFields";
import IncorrectPartnerFields from "./IncorrectPartnerFields";
import ValidTransactionFields from "./ValidTransactionFields";
import IAdjustmentAddProps from "../../Pages/_Interface/IAdjustmentAddProps";
import { AxiosRequestConfig } from "axios";
import CorrectionPrevDayFields from "./CorrectionPrevDayFields";
import AdvancePaymentFields from "./AdvancePaymentFields";
import IRefreshAnalytics from "../../Pages/_Interface/IRefreshAnalytics";
import OthersFields from "./OthersFields";
import CheckIcon from "@mui/icons-material/Check";
import PendingIcon from "@mui/icons-material/Pending";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import StyledScrollBox from "../ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledSnackBar from "../ReusableComponents/NotificationComponents/StyledAlert";
import StyledButton from "../ReusableComponents/ButtonComponents/StyledButton";
import StyledTableCellHeader from "../ReusableComponents/TableComponents/StyledTableCellHeader";
import api from "../../Config/AxiosConfig";
import StyledTableCellNoData from "../ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellBody from "../ReusableComponents/TableComponents/StyledTableCellBody";

export enum Mode {
  VIEW = "View",
  EDIT = "Edit",
  RESOLVE = "Resolve",
}
interface DisputeProps {
  exceptions: IException[];
  isSubmitted: boolean;
  setIsModalClose: React.Dispatch<React.SetStateAction<boolean>>;
  refreshAnalyticsDto?: IRefreshAnalytics;
}

const DisputeTable: React.FC<DisputeProps> = ({
  exceptions,
  isSubmitted,
  setIsModalClose,
  refreshAnalyticsDto,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [exception, setException] = useState<IException>({} as IException);
  const [isModalOpenDispute, setIsModalOpenDispute] = useState<boolean>(false);
  const [isModalOpenJO, setIsModalOpenJO] = useState<boolean>(false);
  const [isModalOpenPartner, setIsModalOpenPartner] = useState<boolean>(false);
  const [isModalOpenCancelled, setIsModalOpenCancelled] =
    useState<boolean>(false);
  const [adjustmentFields, setAdjustmentFields] = useState<IAdjustmentAddProps>(
    {
      Id: null,
      DisputeReferenceNumber: null,
      DisputeAmount: null,
      DateDisputeFiled: null,
      DescriptionOfDispute: null,
      NewJO: null,
      CustomerId: null,
      AccountsPaymentDate: null,
      AccountsPaymentTransNo: null,
      AccountsPaymentAmount: null,
      ReasonId: null,
      Descriptions: null,
      DeleteFlag: null,
    }
  );
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
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<Mode>(Mode.RESOLVE);

  let ActionId = 0;
  let StatusId = 0;

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleEditResolveClick = (
    row: IException,
    mode: Mode,
    adjustmentType: string | null | undefined
  ) => {
    if (mode === Mode.RESOLVE) {
      setModalMode(Mode.RESOLVE);
      setIsModalOpen(true);
      setException(row);
    } else {
      setModalMode(Mode.EDIT);
      if (adjustmentType === "For Filing Dispute") {
        setIsModalOpenDispute(true);
        setException(row);
      } else if (adjustmentType === "Incorrect JO Number") {
        setIsModalOpenJO(true);
        setException(row);
      } else if (adjustmentType === "Incorrect Partner/Merchant") {
        setIsModalOpenPartner(true);
        setException(row);
      } else if (adjustmentType === "Valid Cancelled Transaction") {
        setIsModalOpenCancelled(true);
        setException(row);
      } else if (adjustmentType === "Correction from Previous Day") {
        setIsModalOpenCorrection(true);
        setException(row);
      } else if (adjustmentType === "Advance Payment") {
        setIsModalOpenAdvPayment(true);
        setException(row);
      } else {
        setIsModalOpenOthers(true);
        setException(row);
      }
    }
  };

  const handleViewClick = (
    row: IException,
    adjustmentType: string | null | undefined,
    mode: Mode
  ) => {
    setModalMode(mode);
    if (adjustmentType === "For Filing Dispute") {
      setIsModalOpenDispute(true);
      setException(row);
    } else if (adjustmentType === "Incorrect JO Number") {
      setIsModalOpenJO(true);
      setException(row);
    } else if (adjustmentType === "Incorrect Partner/Merchant") {
      setIsModalOpenPartner(true);
      setException(row);
    } else if (adjustmentType === "Valid Cancelled Transaction") {
      setIsModalOpenCancelled(true);
      setException(row);
    } else if (adjustmentType === "Correction from Previous Day") {
      setIsModalOpenCorrection(true);
      setException(row);
    } else if (adjustmentType === "Advance Payment") {
      setIsModalOpenAdvPayment(true);
      setException(row);
    } else {
      setIsModalOpenOthers(true);
      setException(row);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseModalDispute = () => {
    setIsModalOpenDispute(false);
  };

  const handleCloseModalJO = () => {
    setIsModalOpenJO(false);
  };

  const handleCloseModalPartner = () => {
    setIsModalOpenPartner(false);
  };

  const handleCloseModalCancelled = () => {
    setIsModalOpenCancelled(false);
  };

  const handleCloseModalCorrection = () => {
    setIsModalOpenCorrection(false);
  };

  const handleCloseModalAdvPayment = () => {
    setIsModalOpenAdvPayment(false);
  };

  const handleCloseModalOthers = () => {
    setIsModalOpenOthers(false);
  };

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
    setSubmitted(true);

    if (isModalOpenDispute) {
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
      console.log(StatusId);
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
      isModalOpenDispute ||
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
          setSubmitted(false);
          setIsSnackbarOpen(true);
          setSnackbarSeverity("success");
          setMessage("Adjustments updated successfully!");
          handleCloseModal();
          handleCloseModalDispute();
          handleCloseModalJO();
          handleCloseModalPartner();
          handleCloseModalCancelled();
          handleCloseModalCorrection();
          handleCloseModalAdvPayment();
          handleCloseModalOthers();
          setIsModalClose(true);
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
          setSubmitted(false);
          setIsSnackbarOpen(true);
          setSnackbarSeverity("success");
          setMessage("Adjustments updated successfully!");
          handleCloseModal();
          handleCloseModalDispute();
          handleCloseModalJO();
          handleCloseModalPartner();
          handleCloseModalCancelled();
          handleCloseModalCorrection();
          handleCloseModalAdvPayment();
          handleCloseModalOthers();
          setIsModalClose(true);
        })
        .catch((error) => {
          console.error("Error updating data:", error);
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Error occurred. Please try again.");
        });
    }
  };

  return (
    <Box style={{ position: "relative" }}>
      <StyledScrollBox
        component={Paper}
        sx={{
          height: "255px",
          position: "relative",
          paddingTop: "10px",
          borderRadius: "20px",
          boxShadow:
            "inset 1px 6px 8px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)",
          backgroundColor: "#F2F2F2",
          paddingLeft: "20px",
          paddingRight: "20px",
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        <Table
          sx={{
            minWidth: 700,
            tableLayout: "fixed", // Set table layout to fixed
            "& th": {
              //  borderBottom: '2px solid #D9D9D9',
            },
            borderCollapse: "separate",
            borderSpacing: "0px 4px",
          }}
          aria-label="spanning table"
        >
          <TableHead>
            <TableRow
              sx={{
                "& th": { border: 0 },
              }}
            >
              <StyledTableCellHeader>Location</StyledTableCellHeader>
              <StyledTableCellHeader>Transaction Date</StyledTableCellHeader>
              <StyledTableCellHeader>JO No.</StyledTableCellHeader>
              <StyledTableCellHeader>Delivery Partner</StyledTableCellHeader>
              <StyledTableCellHeader>Amount</StyledTableCellHeader>
              <StyledTableCellHeader>Dispute Amount</StyledTableCellHeader>
              <StyledTableCellHeader>Date Dispute Filed</StyledTableCellHeader>
              <StyledTableCellHeader>
                Description of Dispute
              </StyledTableCellHeader>
              <StyledTableCellHeader>
                Account Payment Trans No.
              </StyledTableCellHeader>
              <StyledTableCellHeader>Type</StyledTableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              maxHeight: "calc(100% - 48px)",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {exceptions?.length === 0 ? (
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
            ) : (exceptions.map((row) => (
              <TableRow key={row.Id} sx={{ "& td": { border: 0 } }}>
                <StyledTableCellBody>{row.CustomerId}</StyledTableCellBody>
                <StyledTableCellBody>{row.JoNumber}</StyledTableCellBody>
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
                  {row.Amount !== null ? row.Amount?.toFixed(2) : "0.00"}
                </StyledTableCellBody>
                <StyledTableCellBody>{row.AdjustmentType}</StyledTableCellBody>
                <StyledTableCellBody>{row.Source}</StyledTableCellBody>
                <StyledTableCellBody
                  sx={{
                    borderRadius: "10px",
                    backgroundColor:
                      row.Source !== "Portal"
                        ? row.Status === "Completed"
                          ? "#E3FBE3"
                          : "#FCE4E4"
                        : "inherit",
                    color:
                      row.Source !== "Portal"
                        ? row.Status === "Completed"
                          ? "#3F743F"
                          : "#A85A5A"
                        : "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {row.Source !== "Portal" ? (
                    row.Status === "Completed" ? (
                      <CheckIcon
                        style={{
                          color: "#3F743F",
                          fontSize: "15px",
                          marginRight: "5px",
                        }}
                      />
                    ) : (
                      <PendingIcon
                        style={{
                          color: "#A85A5A",
                          fontSize: "15px",
                          marginRight: "5px",
                        }}
                      />
                    )
                  ) : (
                    ""
                  )}

                  {row.Source !== "Portal" ? row.Status : ""}
                </StyledTableCellBody>
                <StyledTableCellBody
                  sx={{
                    textAlign: "center",
                    width: "60px",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {row.Source !== "Portal" && (
                      <>
                        {row.Status !== "Pending" && (
                          <StyledButton
                            onClick={() => {
                              handleViewClick(
                                row,
                                row.AdjustmentType,
                                Mode.VIEW
                              );
                            }}
                            sx={{
                              backgroundColor: "#50E8FF",
                              width: "90px",
                              height: "20px",
                              color: "#13434B",
                              borderRadius: "15px",
                              "&:hover": {
                                backgroundColor: "#02A2B9",
                                color: "#FFFFFF",
                              },
                            }}
                          >
                            <VisibilityIcon
                              sx={{ fontSize: "15px", marginRight: "2px" }}
                            />{" "}
                            View
                          </StyledButton>
                        )}
                        <StyledButton
                          onClick={() => {
                            handleEditResolveClick(
                              row,
                              row.Status !== "Pending"
                                ? Mode.EDIT
                                : Mode.RESOLVE,
                              row.AdjustmentType
                            );
                          }}
                          sx={{
                            backgroundColor:
                              row.Status === "Pending" ? "#FFB5B5" : "#FCBA70",
                            width: "90px",
                            height: "20px",
                            borderRadius: "15px",
                            color:
                              row.Status === "Pending" ? "#644848" : "#634422",
                            marginLeft: 0.5,
                            "&:hover": {
                              backgroundColor:
                                row.Status === "Pending"
                                  ? "#FF7171"
                                  : "#FF9419",
                              color: "#FFFFFF",
                            },
                          }}
                        >
                          {row.Status !== "Pending" ? (
                            <EditIcon
                              sx={{ fontSize: "15px", marginRight: "2px" }}
                            />
                          ) : (
                            <AutoFixHighIcon
                              sx={{ fontSize: "15px", marginRight: "2px" }}
                            />
                          )}{" "}
                          {row.Status !== "Pending" ? "Edit" : "Resolve"}
                        </StyledButton>
                      </>
                    )}
                  </Box>
                </StyledTableCellBody>
              </TableRow>
            )))}
          </TableBody>
        </Table>
        <StyledSnackBar
          open={isSnackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          message={message}
        />
      </StyledScrollBox>
      <AdjustmentTypeModal
        open={isModalOpen}
        onClose={handleCloseModal}
        exception={exception}
        setIsModalClose={setIsModalClose}
        mode={modalMode}
        refreshAnalyticsDto={refreshAnalyticsDto}
      />
      <ModalComponent
        title="For Filing Dispute"
        onClose={handleCloseModalDispute}
        buttonName={modalMode === Mode.RESOLVE ? "Save" : "Update"}
        open={isModalOpenDispute}
        onSave={handleSubmit}
        mode={modalMode}
        children={
          <ForFilingDisputeFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={modalMode}
          />
        }
      />
      <ModalComponent
        title="Incorrect JO Number"
        onClose={handleCloseModalJO}
        buttonName={modalMode === Mode.RESOLVE ? "Save" : "Update"}
        open={isModalOpenJO}
        onSave={handleSubmit}
        mode={modalMode}
        children={
          <IncorrectJOFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={modalMode}
          />
        }
      />
      <ModalComponent
        title="Incorrect Partner/Merchant"
        onClose={handleCloseModalPartner}
        buttonName={modalMode === Mode.RESOLVE ? "Save" : "Update"}
        open={isModalOpenPartner}
        onSave={handleSubmit}
        mode={modalMode}
        children={
          <IncorrectPartnerFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={modalMode}
          />
        }
      />
      <ModalComponent
        title="Valid Cancelled Transaction"
        onClose={handleCloseModalCancelled}
        buttonName={modalMode === Mode.RESOLVE ? "Save" : "Update"}
        open={isModalOpenCancelled}
        onSave={handleSubmit}
        mode={modalMode}
        children={
          <ValidTransactionFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={modalMode}
          />
        }
      />
      <ModalComponent
        title="Correction from Previous Day"
        onClose={handleCloseModalCorrection}
        buttonName={modalMode === Mode.RESOLVE ? "Save" : "Update"}
        open={isModalOpenCorrection}
        onSave={handleSubmit}
        mode={modalMode}
        children={
          <CorrectionPrevDayFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={modalMode}
          />
        }
      />
      <ModalComponent
        title="Advance Payment"
        onClose={handleCloseModalAdvPayment}
        buttonName={modalMode === Mode.RESOLVE ? "Save" : "Update"}
        open={isModalOpenAdvPayment}
        onSave={handleSubmit}
        mode={modalMode}
        children={
          <AdvancePaymentFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={modalMode}
          />
        }
      />
      <ModalComponent
        title="Others"
        onClose={handleCloseModalOthers}
        buttonName="Save"
        open={isModalOpenOthers}
        onSave={handleSubmit}
        mode={modalMode}
        children={
          <OthersFields
            rowData={exception}
            onAdjustmentValuesChange={handleAdjustmentChange}
            mode={modalMode}
          />
        }
      />
    </Box>
  );
};

export default DisputeTable;