import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import IAccountingMatch from "../../Pages/_Interface/IAccountingMatch";
import IAnalyticProps from "../../Pages/_Interface/IAnalyticsProps";
import { useCallback, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import api from "../../Config/AxiosConfig";
import StyledScrollBox from "../ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellHeader from "../ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellBody from "../ReusableComponents/TableComponents/StyledTableCellBody";
import StyledTableCellNoData from "../ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellStatus from "../ReusableComponents/TableComponents/StyledTableCellStatus";
interface AnalyticsProps {
  dateFrom: string;
  dateTo: string;
  customerId: string;
  status: string[];
  loading?: boolean;
  setGenerateB01?: (newValue: IAccountingMatch[]) => void;
}

const PaidTable: React.FC<AnalyticsProps> = ({
  dateFrom,
  dateTo,
  customerId,
  status,
  setGenerateB01,
}) => {
  const [match, setMatch] = useState<IAccountingMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFetch, setIsFetch] = useState<boolean>(false);

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
        const result = response.data.Item1;

        if (result != null) {
          setMatch(result);
          if (setGenerateB01) {
            setGenerateB01(result);
          }
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
        if (dateFrom !== null || dateTo !== null) {
          if (!isFetch) {
            const anaylticsParam: IAnalyticProps = {
              dates: [dateFrom, dateTo],
              memCode: [customerId],
              userId: "",
              storeId: [],
              status: status,
              isView: true,
            };
            await fetchGrabFoodMatch(anaylticsParam);
          }
          setIsFetch(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fetchGrabFoodMatch, customerId, status]);

  return (
    <Box
      style={{
        position: "relative",
      }}
    >
      <StyledScrollBox
        component={Paper}
        sx={{
          height: "600px",
          position: "relative",
          boxShadow: "none",
          backgroundColor: "#ffffff",
        }}
      >
        <Table
          sx={{
            minWidth: 700,
            "& th": {
              borderBottom: "2px solid #D9D9D9",
            },
            borderCollapse: "separate",
            borderSpacing: "0px 4px",
            position: "relative", // Add this line to make the container relative,
            backgroundColor: "#ffffff",
          }}
          aria-label="spanning table"
        >
          <TableHead
            sx={{
              zIndex: 3,
              position: "sticky",
              top: "-2px",
              backgroundColor: "#ffffff",
            }}
          >
            <TableRow>
              <StyledTableCellHeader>Invoice No.</StyledTableCellHeader>
              <StyledTableCellHeader>Date</StyledTableCellHeader>
              <StyledTableCellHeader>JO Number</StyledTableCellHeader>
              <StyledTableCellHeader>Gross Payment</StyledTableCellHeader>
              <StyledTableCellHeader>Variance</StyledTableCellHeader>
              <StyledTableCellHeader>Remarks</StyledTableCellHeader>
              <StyledTableCellHeader>Agency Fee</StyledTableCellHeader>
              <StyledTableCellHeader>Delivery Expense</StyledTableCellHeader>
              <StyledTableCellHeader>Input VAT</StyledTableCellHeader>
              <StyledTableCellHeader>Withholding Tax</StyledTableCellHeader>
              <StyledTableCellHeader>Net Paid</StyledTableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              maxHeight: "calc(100% - 48px)",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {loading ? (
              <TableRow sx={{ "& td": { border: 0 } }}>
                <StyledTableCellBody colSpan={12} align="center">
                  <CircularProgress size={80} />
                </StyledTableCellBody>
              </TableRow>
            ) : match?.length === 0 ? (
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
            ) : (
              match?.map((row, index) => (
                <TableRow
                  key={`${row.AnalyticsId}-${index}`}
                  // onDoubleClick={() => handleRowDoubleClick(row)}
                  sx={{
                    "& td": {
                      border: 0,
                    },
                    "&:hover": {
                      backgroundColor: "#ECEFF1",
                    },
                  }}
                >
                  <StyledTableCellBody>
                    {row.AnalyticsInvoiceNo ?? "-"}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.AnalyticsTransactionDate !== null
                      ? new Date(
                          row.AnalyticsTransactionDate ?? ""
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short", // or 'long' for full month name
                          day: "numeric",
                        })
                      : new Date(
                          row.ProofListTransactionDate ?? ""
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short", // or 'long' for full month name
                          day: "numeric",
                        })}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.AnalyticsOrderNo ?? row.ProofListOrderNo}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.ProofListAmount}
                  </StyledTableCellBody>
                  <StyledTableCellBody>{row.Variance}</StyledTableCellBody>
                  <StyledTableCellStatus
                    sx={{
                      color: row.Status != null ? "#FFFFFF" : "#1C2C5A",
                      backgroundColor:
                        row.Status === "PAID"
                          ? "#5C9275"
                          : row.Status === "UNDERPAID"
                          ? "#CDBE6A"
                          : row.Status === "OVERPAID"
                          ? "#A865B9"
                          : row.Status === "NOT REPORTED"
                          ? "#6568B9"
                          : row.Status === "UNPAID"
                          ? "#B7763B"
                          : row.Status === "ADJUSTMENTS"
                          ? "#A82A2A"
                          : "inherit",
                      boxShadow: "inset 0px 0px 10px rgba(0, 0, 0, 0.3)",
                      borderRadius: "10px",
                    }}
                  >
                    {row.Status}
                  </StyledTableCellStatus>
                  <StyledTableCellBody>
                    {row.ProofListAgencyFee !== null
                      ? row.ProofListAgencyFee?.toFixed(2)
                      : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.ProofListAgencyFee !== undefined &&
                    row.ProofListAgencyFee !== null
                      ? (+row.ProofListAgencyFee / 1.12).toFixed(2)
                      : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.ProofListAgencyFee !== undefined &&
                    row.ProofListAgencyFee !== null
                      ? ((+row.ProofListAgencyFee / 1.12) * 0.12).toFixed(2)
                      : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.ProofListAgencyFee !== undefined &&
                    row.ProofListAgencyFee !== null
                      ? (-row.ProofListAgencyFee * 0.02).toFixed(2)
                      : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellBody>
                    {row.ProofListAgencyFee !== undefined &&
                    row.ProofListAgencyFee !== null &&
                    row.ProofListAmount !== undefined &&
                    row.ProofListAmount !== null
                      ? (
                          row.ProofListAmount +
                          +row.ProofListAgencyFee / 1.12 +
                          (+row.ProofListAgencyFee / 1.12) * 0.12 +
                          (-row.ProofListAgencyFee / 1.12) * 0.02
                        ).toFixed(2)
                      : "0.00"}
                  </StyledTableCellBody>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </StyledScrollBox>
    </Box>
  );
};

export default PaidTable;
