import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import IAnalyticProps from "../../Pages/_Interface/IAnalyticsProps";
import { AxiosRequestConfig } from "axios";
import api from "../../Config/AxiosConfig";
import StyledScrollBox from "../ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellHeader from "../ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellNoData from "../ReusableComponents/TableComponents/StyledTableCellNoData";
interface AnalyticsProps {
  dateFrom: string;
  dateTo: string;
  customerId: string;
  status: string[];
  loading?: boolean;
}

const AdjustmentTable: React.FC<AnalyticsProps> = ({
  dateFrom,
  dateTo,
  customerId,
  status,
}) => {
  const [loading, setLoading] = useState<boolean>(true);

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

        // if (result != null) {
        //   setMatch(result);
        // }
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [fetchGrabFoodMatch, customerId, dateFrom, dateTo, status]);

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
              backgroundColor: "#ffffff",
            }}
          >
            <TableRow>
              <StyledTableCellHeader>Code</StyledTableCellHeader>
              <StyledTableCellHeader>Store</StyledTableCellHeader>
              <StyledTableCellHeader>Date</StyledTableCellHeader>
              <StyledTableCellHeader>Order No.</StyledTableCellHeader>
              <StyledTableCellHeader>Amount</StyledTableCellHeader>
              <StyledTableCellHeader>Remarks</StyledTableCellHeader>
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
                "& td": {
                  border: 0,
                },
              }}
            >
              <StyledTableCellNoData colSpan={13} align="center">
                No data found
              </StyledTableCellNoData>
            </TableRow>
          </TableBody>
        </Table>
      </StyledScrollBox>
    </Box>
  );
};

export default AdjustmentTable;