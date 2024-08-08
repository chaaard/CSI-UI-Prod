import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, styled } from "@mui/material";
import axios, { AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";
import IAccountingChronology from "../../Pages/Interface/IAccountingChronology";

interface AccountingChronologyProps {
  id: number | undefined;
}

const StyledTableCellHeader = styled(TableCell)(() => ({
  padding: "8px 16px !important",
  fontSize: "14px",
  fontWeight: '900',
  color: '#1C2C5A',
  width: '55px',
  textAlign: 'left',
}));

const StyledTableCellBodyNoData = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "20px",
  color: '#1C2C5A',
  fontWeight: '100',
}));

const StyledTableCellBody = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "12px",
  color: '#1C2C5A',
  textAlign: 'left',
  '&:hover': {
    backgroundColor: '#E3F2FD', // Change this color to the desired hover color
  },
  cursor: 'default', // Set the cursor style to default
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

const AccountingChronology: React.FC<AccountingChronologyProps> = ({ id }) => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [history, setHistory] = useState<IAccountingChronology[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHistory = useCallback(async(id: number | undefined) => {
    try {
      const getPortal: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetHistoryPaymentRecon?id=${id}`,
      };

      axios(getPortal)
      .then(async (response) => {
        setHistory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
    } catch (error) {
      console.error("Error fetching portal:", error);
    }
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(id !== null)
        {
          setLoading(true);
          await fetchHistory(id);
          setLoading(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [fetchHistory, id]);

  return (
    <Box style={{ position: 'relative' }}>
      <CustomScrollbarBox component={Paper}
        sx={{
          height: '315px',
          position: 'relative',
          paddingTop: '10px',
          borderRadius: '20px',
          boxShadow: 'none',
          paddingLeft: '20px',
          paddingRight: '20px',
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
            position: 'relative', // Add this line to make the container relative
            backgroundColor: '#ffffff',
          }}
          aria-label="spanning table">
          <TableHead
            sx={{
              zIndex: 3,
              position: 'sticky',
              top: '-10px',
              backgroundColor: '#ffffff',
            }}
          >
            <TableRow>
              <StyledTableCellHeader>Store Name</StyledTableCellHeader>
              <StyledTableCellHeader>Date</StyledTableCellHeader>
              <StyledTableCellHeader>Customer </StyledTableCellHeader>
              <StyledTableCellHeader>Order Number</StyledTableCellHeader>
              <StyledTableCellHeader>Non Membership Fee</StyledTableCellHeader>
              <StyledTableCellHeader>Purchased Amount</StyledTableCellHeader>
              <StyledTableCellHeader>Amount</StyledTableCellHeader>
              <StyledTableCellHeader>File Name</StyledTableCellHeader>
            </TableRow>
          </TableHead>
          <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
            { loading ? (
              <TableRow sx={{ "& td": { border: 0 } }}>
                <TableCell colSpan={12} align="center">
                  <CircularProgress size={80}  />
                </TableCell>
              </TableRow>
            ) : history.length === 0 ? (
                <TableRow sx={{ "& td": { border: 0 } }}>
                  <StyledTableCellBodyNoData colSpan={12} align="center">
                    No data found
                  </StyledTableCellBodyNoData>
                </TableRow>
            ) : (
              history.map((row) => {
                return (
                  <TableRow
                    key={row.Id}
                    sx={{
                      "& td": {
                        border: 0,
                      },
                      '&:hover': {
                        backgroundColor: '#ECEFF1',
                      },
                    }}
                  >
                    <StyledTableCellBody>{row.StoreName}</StyledTableCellBody>
                    <StyledTableCellBody>
                      {row.TransactionDate !== null
                        ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: 'short', // or 'long' for full month name
                            day: 'numeric',
                          })
                        : ''}
                    </StyledTableCellBody>
                    <StyledTableCellBody>{row.CustomerId}</StyledTableCellBody>
                    <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                    <StyledTableCellBody>{row.NonMembershipFee?.toFixed(2) ?? '0.00'}</StyledTableCellBody>
                    <StyledTableCellBody>{row.PurchasedAmount?.toFixed(2) ?? '0.00'}</StyledTableCellBody>
                    <StyledTableCellBody>{row.Amount?.toFixed(2) ?? '0.00'}</StyledTableCellBody>
                    <StyledTableCellBody>{row.FileName}</StyledTableCellBody>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CustomScrollbarBox>
    </Box>
  );
};

export default AccountingChronology;