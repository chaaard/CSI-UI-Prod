import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PortalTable from "./PortalTable";
import IFileDescriptions from "../../Pages/_Interface/IFileDescriptions";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalComponent from "./ModalComponent";
import IPagination from "../../Pages/_Interface/IPagination";
import IPortal from "../../Pages/_Interface/IPortal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccountingAdjustmentsTable from "./AccountingAdjustmentsTable";
import IAccountingProoflistAdjustments from "../../Pages/_Interface/IAccountingProoflistAdjustments";
import * as ExcelJS from "exceljs";
import api from "../../Config/AxiosConfig";
import StyledButton from "../ReusableComponents/ButtonComponents/StyledButton";
import StyledScrollBox from "../ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledSnackBar from "../ReusableComponents/NotificationComponents/StyledAlert";

interface IDeleteAnalytics {
  Id: number;
  CustomerId?: string;
  UserId?: string;
  StoreId?: string;
}

const customerCodes = [
  { CustomerId: "9999011929", CustomerName: "Grab Food" },
  { CustomerId: "9999011955", CustomerName: "Grab Mart" },
  { CustomerId: "9999011931", CustomerName: "Pick A Roo Merchandise" },
  { CustomerId: "9999011935", CustomerName: "Pick A Roo FS" },
  { CustomerId: "9999011838", CustomerName: "Food Panda" },
  { CustomerId: "9999011855", CustomerName: "MetroMart" },
];

interface ICustomerCodes {
  CustomerId: string;
  CustomerName: string;
}

const UploadProoflist = () => {
  const getClub = window.localStorage.getItem("club");
  const getId = window.localStorage.getItem("Id");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPortal, setLoadingPortal] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("9999011929");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "error" | "warning" | "info" | "success"
  >("success");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [fileDescriptions, setFileDesciptions] = useState<IFileDescriptions[]>(
    []
  );
  const [isFileDescriptions, setIsFileDescriptions] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [merchant, setMerchant] = useState<string>("");
  const [totalSum, setTotalSum] = useState<number>(0);
  const [portal, setPortal] = useState<IPortal[]>([]);
  const [accountingProoflistAdj, setAccountingProoflistAdj] = useState<
    IAccountingProoflistAdjustments[]
  >([]);

  useEffect(() => {
    document.title = "Accounting | Upload Prooflist";
  }, []);

  let Id = "";
  if (getId !== null) {
    Id = getId;
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Check if all selected files have the allowed file types
      const validFiles = Array.from(files).filter(
        (file) => file.name.endsWith(".csv") || file.name.endsWith(".xlsx")
      );

      if (validFiles.length === files.length) {
        setSelectedFile(validFiles);
      } else {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Please select valid .csv or .xlsx files.");
      }
    }
  };

  let club = 0;
  if (getClub !== null) {
    club = parseInt(getClub, 10);
  }

  const handleChange = (value: any) => {
    const sanitizedValue = value !== undefined ? value : "";
    setSelected(sanitizedValue);
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

  const fetchFileDescriptions = useCallback(async () => {
    try {
      setLoading(true);
      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Analytics/FileDescriptions`,
      };

      await api(config)
        .then(async (response) => {
          setFileDesciptions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error fetching portal:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUploadedProoflist = useCallback(async (params: IPagination) => {
    try {
      setLoading(true);
      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Analytics/GetAccountingProoflist`,
        data: params,
      };

      await api(config)
        .then(async (response) => {
          setPortal(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error fetching portal:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUploadedProoflistAdj = useCallback(async (params: IPagination) => {
    try {
      setLoading(true);
      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Analytics/GetAccountingProoflistAdjustments`,
        data: params,
      };

      await api(config)
        .then(async (response) => {
          setAccountingProoflistAdj(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error fetching portal:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const FileDescriptions = async () => {
      try {
        if (isFileDescriptions) {
          await fetchFileDescriptions();
          setIsFileDescriptions(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    FileDescriptions();
  });

  const handleUploadClick = async () => {
    try {
      setRefreshing(true);
      if (selectedFile.length === 0) {
        // Show an error message or take appropriate action
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Please select a file before uploading.");
        setRefreshing(false);
        return;
      }

      const formData = new FormData();
      if (selectedFile) {
        selectedFile.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("customerName", selected);
        formData.append("userId", Id);
        formData.append("strClub", club.toString());

        const config: AxiosRequestConfig = {
          method: "POST",
          url: `/ProofList/UploadAccountingProofList`,
          data: formData,
        };

        await api(config)
          .then(async (response) => {
            if (response.data.Item2 === "Error extracting proof list.") {
              setSelectedFile([]);
              setIsSnackbarOpen(true);
              setSnackbarSeverity("error");
              setMessage(
                "Error extracting proof list. Please check the file and try again!"
              );
              setRefreshing(false);
            } else if (
              response.data.Item2 ===
              "Uploaded file transaction dates do not match."
            ) {
              setSelectedFile([]);
              setIsSnackbarOpen(true);
              setSnackbarSeverity("error");
              setMessage(
                "Uploaded file transaction dates do not match. Please check the file and try again!"
              );
              setRefreshing(false);
            } else if (response.data.Item2 === "Column not found.") {
              setSelectedFile([]);
              setIsSnackbarOpen(true);
              setSnackbarSeverity("error");
              setMessage(
                "Uploaded file Columns do not match. Please check the file and try again!"
              );
              setRefreshing(false);
            } else if (response.data.Item2 === "No files uploaded.") {
              setSelectedFile([]);
              setIsSnackbarOpen(true);
              setSnackbarSeverity("error");
              setMessage(
                "No files uploaded. Please check the file and try again!"
              );
              setRefreshing(false);
            } else {
              setSelectedFile([]);
              setIsSnackbarOpen(true);
              setSnackbarSeverity("success");
              setMessage(`proof list uploaded successfully.`);
              fetchFileDescriptions();
              setRefreshing(false);
            }
          })
          .catch((error) => {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Error uploading proof list");
            setSelectedFile([]);
            console.error("Error uploading proof list:", error);
            setRefreshing(false);
          });
      }
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error uploading proof list");
      setSelectedFile([]);
      console.error("Error uploading proof list:", error);
      setRefreshing(false);
    }

    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleCloseDelete = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDeleteClick = async () => {
    try {
      var deleteMerchant: IDeleteAnalytics = {
        Id: id,
        StoreId: club.toString(),
        UserId: Id,
      };

      setRefreshing(true);
      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/ProofList/DeleteAccountingAnalytics`,
        data: deleteMerchant,
      };
      setIsModalOpen(false);
      await api(config)
        .then((result) => {
          if (result.data === true) {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("success");
            setMessage("Successfully deleted!");
            setIsModalOpen(false);
            fetchFileDescriptions();
            setRefreshing(false);
          } else {
            setIsSnackbarOpen(true);
            setSnackbarSeverity("error");
            setMessage("Error deleting prooflist");
            setIsModalOpen(false);
            setRefreshing(false);
          }
        })
        .catch((error) => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Error deleting prooflist");
          setIsModalOpen(false);
          setRefreshing(false);
        });
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error deleting prooflist");
      setIsModalOpen(false);
      setRefreshing(false);
    }
  };

  const handleExportClick = async () => {
    try {
      const currentDate: Date = new Date();
      const hours: number = currentDate.getHours();
      const minutes: number = currentDate.getMinutes();
      const seconds: number = currentDate.getSeconds();
      const formattedDate: string = currentDate.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const formattedHours: string =
        hours < 10 ? "0" + hours : hours.toString();
      const formattedMinutes: string =
        minutes < 10 ? "0" + minutes : minutes.toString();
      const formattedSeconds: string =
        seconds < 10 ? "0" + seconds : seconds.toString();
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Data");

      const fileName = `Export - ${merchant} - ${formattedDate}_${formattedHours}${formattedMinutes}${formattedSeconds}.xlsx`;

      if (merchant === "Pick A Roo - Merch") {
        worksheet.columns = [
          { header: "Store Name", key: "storeName" },
          { header: "Date", key: "date" },
          { header: "Merchant", key: "merchant" },
          { header: "Order No.", key: "orderno" },
          { header: "Non Membership Fee", key: "nonMemberShipFee" },
          { header: "Purchased Amount", key: "purchasedAmount" },
          { header: "Amount", key: "portalAmount" },
          { header: "Gross Commission", key: "grossCommission" },
          { header: "Net of VAT", key: "netOfVat" },
          { header: "Input VAT", key: "inputVat" },
          { header: "EWT", key: "ewt" },
          { header: "Net Paid", key: "netPaid" },
        ];

        // Add portal data rows
        portal.forEach((row, index) => {
          const rowIndex = index + 2;
          const nonMembershipFee =
            row.NonMembershipFee !== undefined && row.NonMembershipFee !== null
              ? parseFloat(row.NonMembershipFee.toString()).toFixed(2)
              : "0.00";
          const purchasedAmount =
            row.PurchasedAmount !== undefined && row.PurchasedAmount !== null
              ? parseFloat(row.PurchasedAmount.toString()).toFixed(2)
              : "0.00";
          const portalAmount =
            row.Amount !== undefined && row.Amount !== null
              ? parseFloat(row.Amount.toString()).toFixed(2)
              : "0.00";
          const storeName = row.StoreName ?? 0;
          const date =
            row.TransactionDate !== null
              ? new Date(row.TransactionDate ?? "").toLocaleDateString(
                  "en-CA",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              : "";
          const orderno = row.OrderNo ?? 0;
          const grossCommissionFormula =
            merchant === "Pick A Roo - Merch"
              ? `ROUND(-G${rowIndex}*0.06, 2)`
              : "0";
          const netOfVatFormula = `ROUND(H${rowIndex}/1.12, 2)`;
          const inputVatFormula = `ROUND(I${rowIndex}*0.12, 2)`;
          const ewtFormula = `ROUND(-I${rowIndex}*0.02, 2)`;
          const netPaidFormula = `ROUND(G${rowIndex}+H${rowIndex}+I${rowIndex}+J${rowIndex}, 2)`;

          worksheet.addRow({
            storeName: storeName,
            date: date,
            merchant: merchant,
            orderno: orderno,
            nonMemberShipFee: nonMembershipFee,
            purchasedAmount: purchasedAmount,
            portalAmount: parseFloat(portalAmount),
            grossCommission: { formula: grossCommissionFormula },
            netOfVat: { formula: netOfVatFormula },
            inputVat: { formula: inputVatFormula },
            ewt: { formula: ewtFormula },
            netPaid: { formula: netPaidFormula },
          });
        });

        // Add a total row for portal data
        const totalRowIndex = portal.length + 2;
        worksheet.addRow([
          "TOTAL",
          "",
          "",
          "",
          "",
          "",
          { formula: `ROUND(SUM(G2:G${totalRowIndex - 1}),2)` },
          { formula: `ROUND(SUM(H2:H${totalRowIndex - 1}),2)` },
          { formula: `ROUND(SUM(I2:I${totalRowIndex - 1}),2)` },
          { formula: `ROUND(SUM(J2:J${totalRowIndex - 1}),2)` },
          { formula: `ROUND(SUM(K2:K${totalRowIndex - 1}),2)` },
          { formula: `ROUND(SUM(L2:L${totalRowIndex - 1}),2)` },
        ]);

        worksheet.getRow(totalRowIndex).font = { bold: true };
        worksheet.addRow([""]);
        worksheet.addRow(["Adjustments"]);
        worksheet.addRow([
          "Store Name",
          "Date",
          "Merchant",
          "Order No.",
          "Adjustment Amount",
        ]);
        worksheet.columns = [
          { header: "Store Name", key: "adjStoreName" },
          { header: "Date", key: "adjDate" },
          { header: "Merchant", key: "adjMerchant" },
          { header: "Order No.", key: "adjOrderNo" },
          { header: "Non Membership Fee", key: "adjAmount" },
        ];

        accountingProoflistAdj.forEach((row) => {
          const adjAmount =
            row.Amount !== undefined && row.Amount !== null
              ? parseFloat(row.Amount.toString()).toFixed(2)
              : "0.00";
          const adjStoreName = row.StoreName ?? "No Location";
          const adjDate =
            row.TransactionDate !== null
              ? new Date(row.TransactionDate ?? "").toLocaleDateString(
                  "en-CA",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              : "";
          const adjOrderno = row.OrderNo ?? "";
          const adjMerchant = row.CustomerId ?? merchant;

          worksheet.addRow({
            adjStoreName: adjStoreName,
            adjDate: adjDate,
            adjMerchant: adjMerchant,
            adjOrderNo: adjOrderno,
            adjAmount: parseFloat(adjAmount),
          });
        });

        // Add totals for adjustments
        const adjustmentsStartRow = portal.length + 6; // Start after portal data and header
        const adjustmentRow = portal.length + 4;
        worksheet.getRow(adjustmentRow).font = { bold: true };
        const adjustmentsTotalRowIndex =
          adjustmentsStartRow + accountingProoflistAdj.length;
        worksheet.addRow([
          "TOTAL ADJUSTMENTS",
          "",
          "",
          "",
          {
            formula: `ROUND(SUM(E${adjustmentsStartRow}:E${
              adjustmentsTotalRowIndex - 1
            }), 2)`,
          },
        ]);

        worksheet.getRow(adjustmentsTotalRowIndex).font = { bold: true };

        worksheet.addRow([
          "TOTAL NET PAID + ADJUSTMENTS",
          "",
          "",
          "",
          {
            formula: `ROUND(SUM(L${totalRowIndex}) + SUM(E${adjustmentsTotalRowIndex}), 2)`,
          },
        ]);

        worksheet.getRow(adjustmentsTotalRowIndex + 1).font = { bold: true };

        // Auto-size columns
        const columnMaxLengths: number[] = new Array(
          worksheet.columns.length
        ).fill(0);

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          row.eachCell({ includeEmpty: true }, (cell) => {
            if (typeof cell.col === "number") {
              const colIndex = cell.col - 1;
              // Ensure cell.text is a string for length calculation
              const cellText = cell.text ? cell.text.toString() : "";
              const cellLength = cellText.length;
              if (cellLength > columnMaxLengths[colIndex]) {
                columnMaxLengths[colIndex] = cellLength;
              }
            }
          });
        });

        worksheet.columns.forEach((column, index) => {
          column.width = columnMaxLengths[index] + 2; // Add padding to the width
        });

        const blob = await workbook.xlsx.writeBuffer();
        const blobUrl = URL.createObjectURL(
          new Blob([blob], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );

        // Create a link and click it to trigger the download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        link.click();

        // Clean up the URL object
        URL.revokeObjectURL(blobUrl);
      } else if (merchant === "MetroMart") {
        // Define the header row for MetroMart data
        worksheet.columns = [
          { header: "Store Name", key: "storeName" },
          { header: "Date", key: "date" },
          { header: "Merchant", key: "merchant" },
          { header: "Order No.", key: "orderno" },
          { header: "Amount", key: "amount" },
        ];

        // Add data rows for MetroMart
        portal.forEach((row, index) => {
          const amount =
            row.Amount !== undefined && row.Amount !== null
              ? parseFloat(row.Amount.toString()).toFixed(2)
              : "0.00";
          const storeName = row.StoreName ?? 0;
          const date =
            row.TransactionDate !== null
              ? new Date(row.TransactionDate ?? "").toLocaleDateString(
                  "en-CA",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              : "";
          const orderno = row.OrderNo ?? 0;

          worksheet.addRow({
            storeName: storeName,
            date: date,
            merchant: merchant,
            orderno: orderno,
            amount: parseFloat(amount),
          });
        });

        // Add a total row for MetroMart data
        const totalRowIndex = portal.length + 2;
        worksheet.addRow([
          "TOTAL",
          "",
          "",
          "",
          { formula: `SUM(E2:E${totalRowIndex - 1})` },
        ]);

        // Style the total row
        worksheet.getRow(totalRowIndex).font = { bold: true };

        // Auto-size columns
        const columnMaxLengths: number[] = new Array(
          worksheet.columns.length
        ).fill(0);

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          row.eachCell({ includeEmpty: true }, (cell) => {
            if (typeof cell.col === "number") {
              const colIndex = cell.col - 1;
              // Ensure cell.text is a string for length calculation
              const cellText = cell.text ? cell.text.toString() : "";
              const cellLength = cellText.length;
              if (cellLength > columnMaxLengths[colIndex]) {
                columnMaxLengths[colIndex] = cellLength;
              }
            }
          });
        });

        worksheet.columns.forEach((column, index) => {
          column.width = columnMaxLengths[index] + 2; // Add padding to the width
        });

        const blob = await workbook.xlsx.writeBuffer();
        const blobUrl = URL.createObjectURL(
          new Blob([blob], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );

        // Create a link and click it to trigger the download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        link.click();

        // Clean up the URL object
        URL.revokeObjectURL(blobUrl);
      } else {
        // Define the header row
        worksheet.columns = [
          { header: "Store Name", key: "storeName" },
          { header: "Date", key: "date" },
          { header: "Merchant", key: "merchant" },
          { header: "Order No.", key: "orderno" },
          { header: "Amount", key: "amount" },
          { header: "Gross Commission", key: "grossCommission" },
          { header: "Net of VAT", key: "netOfVat" },
          { header: "Input VAT", key: "inputVat" },
          { header: "EWT", key: "ewt" },
          { header: "Net Paid", key: "netPaid" },
        ];

        // Add data rows
        portal.forEach((row, index) => {
          const rowIndex = index + 2; // Start from row 2, after the header
          const amount =
            row.Amount !== undefined && row.Amount !== null
              ? parseFloat(row.Amount.toString()).toFixed(2)
              : "0.00";
          const storeName = row.StoreName ?? 0;
          const date =
            row.TransactionDate !== null
              ? new Date(row.TransactionDate ?? "").toLocaleDateString(
                  "en-CA",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )
              : "";
          const orderno = row.OrderNo ?? 0;
          const grossCommissionFormula =
            merchant === "Pick A Roo - FS"
              ? `ROUND(-E${rowIndex}*0.1568, 2)`
              : merchant === "Food Panda"
              ? `ROUND(-E${rowIndex}*0.1792, 2)`
              : merchant === "GrabMart" || merchant === "Grab Mart"
              ? `ROUND(-E${rowIndex}*0.05, 2)`
              : merchant === "GrabFood" || merchant === "Grab Food"
              ? `ROUND(-E${rowIndex}*0.12, 2)`
              : "0";

          const netOfVatFormula = `ROUND(F${rowIndex}/1.12, 2)`;
          const inputVatFormula = `ROUND(G${rowIndex}*0.12, 2)`;
          const ewtFormula = `ROUND(-G${rowIndex}*0.02, 2)`;
          const netPaidFormula = `ROUND(E${rowIndex}+G${rowIndex}+H${rowIndex}+I${rowIndex}, 2)`;

          worksheet.addRow({
            storeName: storeName,
            date: date,
            merchant: merchant,
            orderno: orderno,
            amount: parseFloat(amount),
            grossCommission: { formula: grossCommissionFormula },
            netOfVat: { formula: netOfVatFormula },
            inputVat: { formula: inputVatFormula },
            ewt: { formula: ewtFormula },
            netPaid: { formula: netPaidFormula },
          });
        });

        // Add a total row
        const totalRowIndex = portal.length + 2; // Header + Data rows
        worksheet.addRow([
          "TOTAL",
          "",
          "",
          "",
          { formula: `ROUND(SUM(E2:E${totalRowIndex - 1}),2)` },
          { formula: `ROUND(SUM(F2:F${totalRowIndex - 1}),2)` },
          { formula: `ROUND(SUM(G2:G${totalRowIndex - 1}),2)` },
          { formula: `ROUND(SUM(H2:H${totalRowIndex - 1}),2)` },
          { formula: `ROUND(SUM(I2:I${totalRowIndex - 1}),2)` },
          { formula: `ROUND(SUM(J2:J${totalRowIndex - 1}),2)` },
        ]);

        worksheet.getRow(totalRowIndex).font = { bold: true };

        worksheet.addRow([""]);
        worksheet.addRow(["Adjustments"]);
        if (merchant === "Grab Mart" || merchant === "Grab Food") {
          worksheet.addRow([
            "Store Name",
            "Date",
            "Merchant",
            "Order No.",
            "Descriptions",
            "Adjustment Amount",
          ]);
          worksheet.columns = [
            { header: "Store Name", key: "adjStoreName" },
            { header: "Date", key: "adjDate" },
            { header: "Merchant", key: "adjMerchant" },
            { header: "Order No.", key: "adjOrderNo" },
            { header: "Amount", key: "adjDesc" },
            { header: "Gross Commission", key: "adjAmount" },
          ];

          accountingProoflistAdj.forEach((row) => {
            const adjAmount =
              row.Amount !== undefined && row.Amount !== null
                ? parseFloat(row.Amount.toString()).toFixed(2)
                : "0.00";
            const adjStoreName = row.StoreName ?? "No Location";
            const adjDate =
              row.TransactionDate !== null
                ? new Date(row.TransactionDate ?? "").toLocaleDateString(
                    "en-CA",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )
                : "";
            const adjOrderno = row.OrderNo ?? "";
            const adjMerchant = row.CustomerId ?? merchant;
            const adjDesc = row.Descriptions ?? "";

            worksheet.addRow({
              adjStoreName: adjStoreName,
              adjDate: adjDate,
              adjMerchant: adjMerchant,
              adjOrderNo: adjOrderno,
              adjDesc: adjDesc,
              adjAmount: parseFloat(adjAmount),
            });
          });

          const adjustmentsStartRow = portal.length + 6;
          const adjustmentRow = portal.length + 4;
          worksheet.getRow(adjustmentRow).font = { bold: true };
          const adjustmentsTotalRowIndex =
            adjustmentsStartRow + accountingProoflistAdj.length;
          if (accountingProoflistAdj.length === 0) {
            worksheet.addRow(["TOTAL ADJUSTMENTS", "", "", "", "", 0]);
          } else {
            worksheet.addRow([
              "TOTAL ADJUSTMENTS",
              "",
              "",
              "",
              "",
              {
                formula: `ROUND(SUM(F${adjustmentsStartRow}:F${
                  adjustmentsTotalRowIndex - 1
                }), 2)`,
              },
            ]);
          }

          worksheet.getRow(adjustmentsTotalRowIndex).font = { bold: true };

          worksheet.addRow([
            "TOTAL NET PAID + ADJUSTMENTS",
            "",
            "",
            "",
            "",
            {
              formula: `ROUND(SUM(J${totalRowIndex}) + SUM(F${adjustmentsTotalRowIndex}), 2)`,
            },
          ]);

          worksheet.getRow(adjustmentsTotalRowIndex + 1).font = { bold: true };
        } else {
          worksheet.addRow([
            "Store Name",
            "Date",
            "Merchant",
            "Order No.",
            "Adjustment Amount",
          ]);
          worksheet.columns = [
            { header: "Store Name", key: "adjStoreName" },
            { header: "Date", key: "adjDate" },
            { header: "Merchant", key: "adjMerchant" },
            { header: "Order No.", key: "adjOrderNo" },
            { header: "Amount", key: "adjAmount" },
          ];

          accountingProoflistAdj.forEach((row) => {
            const adjAmount =
              row.Amount !== undefined && row.Amount !== null
                ? parseFloat(row.Amount.toString()).toFixed(2)
                : "0.00";
            const adjStoreName = row.StoreName ?? "No Location";
            const adjDate =
              row.TransactionDate !== null
                ? new Date(row.TransactionDate ?? "").toLocaleDateString(
                    "en-CA",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )
                : "";
            const adjOrderno = row.OrderNo ?? "";
            const adjMerchant = row.CustomerId ?? merchant;

            worksheet.addRow({
              adjStoreName: adjStoreName,
              adjDate: adjDate,
              adjMerchant: adjMerchant,
              adjOrderNo: adjOrderno,
              adjAmount: parseFloat(adjAmount),
            });
          });

          const adjustmentsStartRow = portal.length + 6;
          const adjustmentRow = portal.length + 4;
          worksheet.getRow(adjustmentRow).font = { bold: true };
          const adjustmentsTotalRowIndex =
            adjustmentsStartRow + accountingProoflistAdj.length;
          if (accountingProoflistAdj.length === 0) {
            worksheet.addRow(["TOTAL ADJUSTMENTS", "", "", "", 0]);
          } else {
            worksheet.addRow([
              "TOTAL ADJUSTMENTS",
              "",
              "",
              "",
              {
                formula: `ROUND(SUM(E${adjustmentsStartRow}:E${
                  adjustmentsTotalRowIndex - 1
                }), 2)`,
              },
            ]);
          }
          worksheet.getRow(adjustmentsTotalRowIndex).font = { bold: true };

          worksheet.addRow([
            "TOTAL NET PAID + ADJUSTMENTS",
            "",
            "",
            "",
            {
              formula: `ROUND(SUM(J${totalRowIndex}) + SUM(E${adjustmentsTotalRowIndex}), 2)`,
            },
          ]);

          worksheet.getRow(adjustmentsTotalRowIndex + 1).font = { bold: true };
        }

        const columnMaxLengths: number[] = new Array(
          worksheet.columns.length
        ).fill(0);

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          row.eachCell({ includeEmpty: true }, (cell) => {
            if (typeof cell.col === "number") {
              const colIndex = cell.col - 1;
              // Ensure cell.text is a string for length calculation
              const cellText = cell.text ? cell.text.toString() : "";
              const cellLength = cellText.length;
              if (cellLength > columnMaxLengths[colIndex]) {
                columnMaxLengths[colIndex] = cellLength;
              }
            }
          });
        });

        worksheet.columns.forEach((column, index) => {
          column.width = columnMaxLengths[index] + 2; // Add padding to the width
        });

        const blob = await workbook.xlsx.writeBuffer();
        const blobUrl = URL.createObjectURL(
          new Blob([blob], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );

        // Create a link and click it to trigger the download
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        link.click();

        // Clean up the URL object
        URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error exporting prooflist");
      setIsModalOpen(false);
      setRefreshing(false);
    }
  };

  const handleDeleteModalClick = (id: number) => {
    setIsModalOpen(true);
    setId(id);
  };

  const handleViewModalClick = (merchant: string, id: number) => {
    setIsViewModalOpen(true);
    setId(id);
    setMerchant(merchant);

    setPortal([]);

    setLoadingPortal(true);
    const params: IPagination = {
      Id: id,
    };

    fetchUploadedProoflist(params);
    fetchUploadedProoflistAdj(params);
    setLoadingPortal(false);
  };

  const handleCloseView = useCallback(() => {
    setIsViewModalOpen(false);
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px 16px 16px 16px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "16px 16px 16px 16px",
          width: "100%",
          height: "790px",
          borderRadius: "15px",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", marginBottom: "10px", color: "#1C2C5A" }}
        >
          Upload Prooflist / Payment Monitoring
        </Typography>
        <Divider sx={{ marginBottom: "20px" }} />
        <Backdrop
          sx={{ color: "#ffffff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={refreshing}
        >
          <CircularProgress size="100px" sx={{ color: "#ffffff" }} />
        </Backdrop>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Grid container spacing={1}>
            <Grid item>
              <TextField
                variant="outlined"
                size="small"
                type="text"
                required
                select
                label="Merchant"
                value={selected} // Default to an empty string if undefined
                onChange={(e) => handleChange(e.target.value)}
                InputProps={{
                  sx: {
                    borderRadius: "40px",
                    backgroundColor: "#FFFFFF",
                    height: "40px",
                    width: "295px",
                    fontSize: "14px",
                    fontFamily: "Inter",
                    fontWeight: "bold",
                    color: "#1C2C5A",
                  },
                }}
              >
                {customerCodes.map((item: ICustomerCodes) => (
                  <MenuItem key={item.CustomerId} value={item.CustomerId}>
                    {item.CustomerName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item>
              <Box display={"flex"}>
                <TextField
                  variant="outlined"
                  fullWidth
                  disabled
                  label="File"
                  value={
                    selectedFile?.length > 0
                      ? selectedFile?.map((file) => file.name).join(", ")
                      : "Selected Files"
                  }
                  size="small"
                  helperText="*CSV, XLSX File Only"
                  required
                  InputProps={{
                    sx: {
                      borderTopLeftRadius: "40px",
                      borderBottomLeftRadius: "40px",
                      backgroundColor: "#FFFFFF",
                      height: "40px",
                      width: "295px",
                      fontSize: "14px",
                      fontFamily: "Inter",
                      fontWeight: "bold",
                      color: "#1C2C5A",
                    },
                  }}
                />
                <label htmlFor="file-input">
                  <Button
                    component="span"
                    variant="contained"
                    sx={{
                      backgroundColor: "#B6B6B6",
                      color: "#FFFFFF",
                      height: "39.5px",
                      boxShadow:
                        "inset 1px 6px 8px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)",
                      marginLeft: "-10px",
                      borderRadius: 0,
                      borderTopRightRadius: "40px",
                      borderBottomRightRadius: "40px",
                    }}
                  >
                    Browse
                  </Button>
                </label>
                <input
                  id="file-input"
                  type="file"
                  multiple={false}
                  accept=".csv, .xlsx"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </Box>
            </Grid>
            <Grid item>
              <StyledButton
                sx={{
                  color: "white",
                  fontSize: "14px",
                  backgroundColor: "#1C3766",
                  width: "150px",
                  borderRadius: "20px",
                  fontFamily: "Inter",
                  fontWeight: "900",
                  height: "38px",
                  paddingRight: "15px",
                  //borderColor: isGenerated ? 'inherit' : '#1C3766',
                  "& .MuiTypography-root": {
                    fontSize: "14px",
                  },
                }}
                onClick={handleUploadClick}
                // disabled={isGenerated ? true : false}
              >
                <FileUploadIcon sx={{ marginRight: "5px" }} />
                <Typography>Upload</Typography>
              </StyledButton>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ marginTop: "20px" }} />
        <StyledScrollBox
          component={Paper}
          sx={{
            height: "600px",
            position: "relative",
            padding: "10px 10px 0px 10px",
            boxShadow: "none",
            backgroundColor: "#ffffff",
          }}
        >
          {fileDescriptions.map((item) => (
            <Card key={item.Id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ width: "30%", flexShrink: 0, color: "#1C3766" }}
                  >
                    Filename: {item.FileName}
                  </Typography>
                  <Typography
                    sx={{ width: "25%", flexShrink: 0, color: "#1C3766" }}
                  >
                    Upload Date:{" "}
                    {item.UploadDate !== null
                      ? new Date(item.UploadDate ?? "").toLocaleDateString(
                          "en-CA",
                          { year: "numeric", month: "short", day: "numeric" }
                        )
                      : ""}
                  </Typography>
                  <Typography
                    sx={{ width: "25%", flexShrink: 0, color: "#1C3766" }}
                  >
                    Merchant: {item.Merchant}
                  </Typography>
                  <Typography sx={{ width: "15%", color: "#1C3766" }}>
                    Count: {item.Count}
                  </Typography>
                  <IconButton
                    onClick={() => handleViewModalClick(item.Merchant, item.Id)}
                    sx={{ margin: "-10px", color: "#1C3766" }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteModalClick(item.Id)}
                    sx={{ margin: "-10px", color: "#1C3766" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </StyledScrollBox>
      </Paper>
      <StyledSnackBar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={message}
      />
      <ModalComponent
        title="Delete Prooflist"
        onClose={handleCloseDelete}
        buttonName="Delete"
        open={isModalOpen}
        onSave={handleDeleteClick}
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
                    fontSize: "20px",
                    textAlign: "center",
                    marginRight: "-170px",
                  }}
                >
                  Are you sure you want to delete this prooflist?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        }
      />
      <ModalComponent
        title={`View Prooflist - ${merchant}`}
        onClose={handleCloseView}
        buttonName="Export"
        open={isViewModalOpen}
        onSave={handleExportClick}
        children={
          <Box>
            <PortalTable
              portal={portal}
              loading={loadingPortal}
              merchant={merchant}
              setTotalSum={setTotalSum}
            />
            <AccountingAdjustmentsTable
              adjustments={accountingProoflistAdj}
              loading={loadingPortal}
              merchant={merchant}
              totalSum={totalSum}
            />
          </Box>
        }
      />
    </Box>
  );
};

export default UploadProoflist;