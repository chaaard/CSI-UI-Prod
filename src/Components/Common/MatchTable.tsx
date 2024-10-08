import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import IMatch from "../../Pages/_Interface/IMatch";
import theme from "../../Theme/Theme";
import StyledScrollBox from "../ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellHeader from "../ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellNoData from "../ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellBody from "../ReusableComponents/TableComponents/StyledTableCellBody";
import StyledTableCellSubHeader from "../ReusableComponents/TableComponents/StyledTableCellSubHeader";
import StyledTableCellTotal from "../ReusableComponents/TableComponents/StyledTableCellTotal";

interface MatchProps {
  match: IMatch[];
  loading: boolean;
  setIsModalClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const MatchTable: React.FC<MatchProps> = ({
  match,
  loading,
  setIsModalClose,
}) => {
  // Calculate the total amount
  const grandTotal = match.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const variance = portalItem.AnalyticsAmount || 0;
    return total + variance;
  }, 0);

  // Calculate the total amount
  const analyticsTotal = match.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const variance = portalItem.Variance || 0;
    return total + variance;
  }, 0);

  // Calculate the total amount
  const prooflistTotal = match.reduce((total, portalItem) => {
    // Ensure that Amount is a number and not undefined or null
    const variance = portalItem.ProofListAmount || 0;
    return total + variance;
  }, 0);

  const getRoleId = window.localStorage.getItem("roleId");

  let roleId = 0;
  if (getRoleId !== null) {
    roleId = parseInt(getRoleId, 10);
  }
  return (
    <Box style={{ position: "relative" }}>
      <StyledScrollBox
        component={Paper}
        sx={{
          height: "365px",
          position: "relative",
          paddingTop: "10px",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          borderTopLeftRadius: "0",
          borderTopRightRadius: "0",
          boxShadow: "none",
          paddingLeft: "20px",
          paddingRight: "20px",
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
            position: "relative", // Add this line to make the container relative
            backgroundColor: "#ffffff",
          }}
          aria-label="spanning table"
        >
          <TableHead
            sx={{
              zIndex: 3,
              position: "sticky",
              top: "-10px",
              backgroundColor: "#ffffff",
            }}
          >
            <TableRow>
              <StyledTableCellHeader sx={{ width: "2px" }}>#</StyledTableCellHeader>
              <StyledTableCellHeader>Date</StyledTableCellHeader>
              <StyledTableCellHeader>JO Number</StyledTableCellHeader>
              <StyledTableCellHeader>Amount</StyledTableCellHeader>
              <StyledTableCellHeader>Variance</StyledTableCellHeader>
              <StyledTableCellHeader>Amount</StyledTableCellHeader>
              <StyledTableCellHeader>JO Number</StyledTableCellHeader>
              <StyledTableCellHeader>Date</StyledTableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              maxHeight: "calc(100% - 48px)",
              overflowY: "auto",
              position: "relative",
              height: '258px'
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
              match.map((row, index) => (
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
                  <StyledTableCellBody sx={{ width: "5px" }}>
                    {index + 1}
                  </StyledTableCellBody>
                  <StyledTableCellBody
                    sx={{
                      width: "90px",
                      color: row.ProofListId == null ? "#C20000" : "#1C2C5A",
                    }}
                  >
                    {row.AnalyticsTransactionDate !== null
                      ? new Date(
                          row.AnalyticsTransactionDate ?? ""
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short", // or 'long' for full month name
                          day: "numeric",
                        })
                      : ""}
                  </StyledTableCellBody>
                  <StyledTableCellBody
                    sx={{
                      width: "200px",
                      color: row.ProofListId == null ? "#C20000" : "#1C2C5A",
                    }}
                  >
                    {row.AnalyticsOrderNo}
                  </StyledTableCellBody>
                  <StyledTableCellBody
                    sx={{
                      width: "235px",
                      color: row.ProofListId == null ? "#C20000" : "#1C2C5A",
                    }}
                  >
                    {row.AnalyticsAmount !== null
                      ? row.AnalyticsAmount?.toFixed(2)
                      : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellBody
                    sx={{
                      backgroundColor: "#FFB5B6",
                      borderRadius: "10px",
                      color: row.ProofListId == null ? "#C20000" : "#1C2C5A",
                    }}
                  >
                    {row.Variance !== null ? row.Variance?.toFixed(2) : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellBody
                    sx={{
                      color: row.ProofListId == null ? "#C20000" : "#1C2C5A",
                    }}
                  >
                    {row.ProofListAmount !== null
                      ? row.ProofListAmount?.toFixed(2)
                      : "0.00"}
                  </StyledTableCellBody>
                  <StyledTableCellBody
                    sx={{
                      width: "200px",
                      color: row.ProofListId == null ? "#C20000" : "#1C2C5A",
                    }}
                  >
                    {row.ProofListOrderNo}
                  </StyledTableCellBody>
                  <StyledTableCellBody
                    sx={{
                      width: "100px",
                      color: row.ProofListId == null ? "#C20000" : "#1C2C5A",
                    }}
                  >
                    {row.ProofListTransactionDate !== null
                      ? new Date(
                          row.ProofListTransactionDate ?? ""
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short", // or 'long' for full month name
                          day: "numeric",
                        })
                      : ""}
                  </StyledTableCellBody>
                </TableRow>
                
              ))
            )}
          </TableBody>
          <TableBody
            sx={{
              zIndex: 3,
              position: "sticky",
              bottom: "0",
              backgroundColor: "#ffffff",
            }}>
            <TableRow
              sx={{
                "& td": {
                  border: 0,
                },
              }}
            >
              <StyledTableCellSubHeader >TOTAL</StyledTableCellSubHeader>
              <StyledTableCellTotal></StyledTableCellTotal>
              <StyledTableCellTotal></StyledTableCellTotal>
              <StyledTableCellTotal>{grandTotal.toFixed(2)}</StyledTableCellTotal>
              <StyledTableCellTotal>{analyticsTotal.toFixed(2)}</StyledTableCellTotal>
              <StyledTableCellTotal>{prooflistTotal.toFixed(2)}</StyledTableCellTotal>
              <StyledTableCellTotal></StyledTableCellTotal>
              <StyledTableCellTotal></StyledTableCellTotal>
            </TableRow>
          </TableBody>
        </Table>
      </StyledScrollBox>
    </Box>
  );
};

export default MatchTable;
