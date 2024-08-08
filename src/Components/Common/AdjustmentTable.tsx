import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled } from "@mui/material";
import IAnalytics from "../../Pages/_Interface/IAnalytics";
import { useCallback, useEffect, useState } from "react";
import IAnalyticProps from "../../Pages/_Interface/IAnalyticsProps";
import axios, { AxiosRequestConfig } from "axios";
interface AnalyticsProps {
  dateFrom: string,
  dateTo: string,
  customerId: string,
  status: string[],
  loading?: boolean;
}

const StyledTableCellHeader = styled(TableCell)(() => ({
  padding: "8px 17px !important",
  fontSize: "14px",
  fontWeight: '900',
  color: '#1C2C5A',
  textAlign: 'center',
}));

const StyledTableCellBody = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "12px",
  color: '#1C2C5A',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#E3F2FD', // Change this color to the desired hover color
  },
  userSelect: 'none', // Disable text selection
  cursor: 'default', // Set the cursor style to default
}));

const StyledTableCellBody1 = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "12px",
  color: '#1C2C5A',
  textAlign: 'center',
}));

const StyledTableCellSubHeader = styled(TableCell)(() => ({
  fontSize: "12px",
  fontWeight: 'bold',
  color: '#1C2C5A',
  textAlign: 'left',
  padding: '10px !important'
}));

const StyledTableCellBodyNoData = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "25px",
  color: '#1C2C5A',
  textAlign: 'center',
  fontWeight: '100',
}));

const CustomScrollbarBox = styled(Box)`
    overflow-y: auto;
    height: calc(100vh - 190px);

    /* Custom Scrollbar Styles */
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #2B4B81;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  `;

const AdjustmentTable: React.FC<AnalyticsProps> = ({ dateFrom, dateTo, customerId, status }) => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [loading, setLoading] = useState<boolean>(true);
  
  const fetchGrabFoodMatch = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      setLoading(true);
      const getAnalyticsMatch: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAccountingProofListVariance`,
        data: anaylticsParam,
      };

      const response = await axios(getAnalyticsMatch);
      const result = response.data.Item1;

      // if (result != null) {
      //   setMatch(result);
      // }

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(dateFrom !== null || dateTo !== null)
        {
          const anaylticsParam: IAnalyticProps = {
            dates: [dateFrom, dateTo],
            memCode: [customerId],
            userId: '',
            storeId: [],
            status: status,
            isView: true,
          };
          await fetchGrabFoodMatch(anaylticsParam);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [fetchGrabFoodMatch, customerId, dateFrom, dateTo, status]);
  
  if (!loading) {
    return (
      <Box style={{ 
          position: 'relative',              
      }}>
        <CustomScrollbarBox component={Paper}
          sx={{
            height: '600px',
            position: 'relative',
            boxShadow: 'none',
            backgroundColor: '#ffffff'
          }}
        >
          <Table
            sx={{
              minWidth: 700,
              "& th": {
                borderBottom: '2px solid #D9D9D9',
              },
              borderCollapse: 'separate',
              borderSpacing: '0px 4px',
              position: 'relative', // Add this line to make the container relative,
              backgroundColor: '#ffffff',
            }}
            aria-label="spanning table">
            <TableHead
              sx={{
                zIndex: 3,
                position: 'sticky',
                backgroundColor: '#ffffff',
              }}
            >
              <TableRow
              >
                <StyledTableCellHeader>Code</StyledTableCellHeader>
                <StyledTableCellHeader>Store</StyledTableCellHeader>
                <StyledTableCellHeader>Date</StyledTableCellHeader>
                <StyledTableCellHeader>Order No.</StyledTableCellHeader>
                <StyledTableCellHeader>Amount</StyledTableCellHeader>
                <StyledTableCellHeader>Remarks</StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
              <TableRow  
                sx={{ 
                  "& td": { 
                    border: 0, 
                  }, 
                }}
              >
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBodyNoData>No data found</StyledTableCellBodyNoData>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
                <StyledTableCellBody1></StyledTableCellBody1>
              </TableRow> 
            </TableBody> 
          </Table>
        </CustomScrollbarBox>
      </Box>
    );
  } else {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="600px"
      >
        <CircularProgress size={80} />
        <Typography variant="h6" color="textSecondary" style={{ marginTop: '16px' }}>
          Loading...
        </Typography>
      </Box>
    );
  }
};

export default AdjustmentTable;