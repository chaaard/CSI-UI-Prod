import { Box, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, styled, Grid, IconButton, InputBase, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import IAnalytics from "../../Pages/Common/Interface/IAnalytics";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import IException from "../../Pages/Common/Interface/IException";
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import axios, { AxiosRequestConfig } from "axios";
import IAnalyticProps from "../../Pages/Common/Interface/IAnalyticsProps";

interface DisputeAnalyticsProps {
  filteredAnalytics: IAnalytics[];
  loading: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>; 
  setSelectedRowId: React.Dispatch<React.SetStateAction<IException>>;   
  merchant?: string;  
  onSaveRow?: (id: number, remarks: string) => void;
  setEditRowId?: string; 
}

export interface ChildHandle {
  handleCancelEdit: () => void;
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

const BootstrapButtonMini = styled(IconButton)(() => ({
  textTransform: 'none',
  fontSize: 12, 
  lineHeight: 1.5,
  color: '#1C2C5A',
  fontWeight: '900',
  fontFamily: 'Inter',
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

const DisputeAnalyticsTable = forwardRef<ChildHandle, DisputeAnalyticsProps>(({ filteredAnalytics, loading, setModalOpen, setSelectedRowId, merchant, onSaveRow, setEditRowId},ref) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [editRowIdChild, setEditRowIdChild] = useState<string | null>(null);
  const [editedRemarks, setEditedRemarks] = useState('');
  const { REACT_APP_API_ENDPOINT } = process.env;
  
  useImperativeHandle(ref, () => ({
    handleCancelEdit() {
      console.log("handleCancelEdit triggered");
      setEditRowIdChild(null); // Exit edit mode without saving
    }
  }));
  
  const handleOpen = (row:IAnalytics) => {
    const updatedException: IException = {
        Id: row.Id,
        CustomerId: row.CustomerId,
        JoNumber: row.OrderNo,
        TransactionDate: row.TransactionDate, 
        Amount: row.Amount,
        Source: 'Analytics',
        AdjustmentId: 0,
        LocationName: row.LocationName ?? '',
        AnalyticsId: row.Id,
        ProofListId: null,
        OldJo: '',
        NewJo: null,
        OldCustomerId: '',
        NewCustomerId: null,
        DisputeReferenceNumber: '',
        DisputeAmount: 0,
        DateDisputeFiled: new Date(),
        DescriptionOfDispute: '',
        AccountsPaymentDate: new Date(),
        AccountsPaymentTransNo: '',
        AccountsPaymentAmount: 0,
        Descriptions: '',
        ReasonId: 0
    }
    setSelectedRowId(updatedException);
    setModalOpen(true);
  };
  // Calculate the total amount
  const grandTotal = filteredAnalytics.reduce((total, analyticsItem) => {
    // Ensure that Amount is a number and not undefined or null
    const amount = analyticsItem.SubTotal || 0;
    return total + amount;
  }, 0);



  const handleCancelEdit = () => {
    setEditRowIdChild(null); // Exit edit mode without saving
  };

  const handleEditRemarks = (remarks: string, id: string) => {
    setEditRowIdChild(id);
    setEditedRemarks(remarks); // Set edited remarks for editing
  };

  const handleSaveCustomer = (id: number, remarks: string) => {
    if (onSaveRow) {
      onSaveRow(id,remarks);
    }
  };

  if (!loading) {
    return (
      <Box style={{ position: 'relative' }}>
        
        <CustomScrollbarBox component={Paper}
          sx={{
            height: '345px',
            position: 'relative',
            paddingTop: '10px',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            borderTopLeftRadius: '0',
            borderTopRightRadius: '0',
            borderRadius: '20px',
            paddingLeft: '20px',
            backgroundColor: '#F2F2F2',
            paddingRight: '20px',
            boxShadow: 'inset 1px 1px 1px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)',
            marginLeft: '20px',
            marginRight: '20px',
            marginBottom: '20px'
          }}
        >
          <Table
            sx={{
              minWidth: 700,
              "& th": {
                borderBottom: '2px solid #1C3766',
              },
              borderCollapse: 'separate',
              borderSpacing: '0px 4px',
              position: 'relative', // Add this line to make the container relative,
            }}
            aria-label="spanning table">
            <TableHead
              sx={{
                zIndex: 3,
                position: 'sticky',
                top: '-10px',
                backgroundColor: '#F2F2F2',
              }}
            >
              <TableRow
              >
                {merchant == 'WalkIn' ? (
                  <>
                    <StyledTableCellHeader>Customer Name</StyledTableCellHeader>
                    <StyledTableCellHeader>Location Name</StyledTableCellHeader>
                    <StyledTableCellHeader>Transaction Date</StyledTableCellHeader>
                    <StyledTableCellHeader>Membership No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Cashier No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Register No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Transaction No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Order No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Subtotal</StyledTableCellHeader>
                    <StyledTableCellHeader>Customer</StyledTableCellHeader>
                    <StyledTableCellHeader>Action</StyledTableCellHeader>
                  </>
                ) : (
                  <>
                    <StyledTableCellHeader>Customer Name</StyledTableCellHeader>
                    <StyledTableCellHeader>Location Name</StyledTableCellHeader>
                    <StyledTableCellHeader>Transaction Date</StyledTableCellHeader>
                    <StyledTableCellHeader>Membership No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Cashier No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Register No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Transaction No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Order No.</StyledTableCellHeader>
                    <StyledTableCellHeader>Subtotal</StyledTableCellHeader>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody sx={{ maxHeight: 'calc(100% - 48px)', overflowY: 'auto', position: 'relative' }}>
            {filteredAnalytics.length === 0 ? 
              (
                <TableRow  
                  sx={{ 
                    "& td": { 
                      border: 0, 
                    }, 
                  }}
                >
                <TableCell align="center" colSpan={15} sx={{ color: '#1C2C5A' }}>No Data</TableCell>
                </TableRow> 
              ) : (
                filteredAnalytics.map((row) => {
                  const isEditing = editRowIdChild === row.Id.toString();
                  return (
                    <TableRow 
                      key={row.Id} 
                      onDoubleClick={() => handleOpen(row)}
                      sx={{ 
                        "& td": { 
                          border: 0, 
                        }, 
                        '&:hover': {
                          backgroundColor: '#ECEFF1', 
                        },
                      }}
                    >
                    {merchant === 'WalkIn' ? (
                      <>
                        <StyledTableCellBody>{row.CustomerName}</StyledTableCellBody>
                        <StyledTableCellBody>{row.LocationName}</StyledTableCellBody>
                        <StyledTableCellBody>
                          {row.TransactionDate !== null
                            ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                                year: 'numeric',
                                month: 'short', // or 'long' for full month name
                                day: 'numeric',
                              })
                            : ''
                          }
                        </StyledTableCellBody>
                        <StyledTableCellBody>{row.MembershipNo}</StyledTableCellBody>
                        <StyledTableCellBody>{row.CashierNo}</StyledTableCellBody>
                        <StyledTableCellBody>{row.RegisterNo}</StyledTableCellBody>
                        <StyledTableCellBody>{row.TransactionNo}</StyledTableCellBody>
                        <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                        <StyledTableCellBody sx={{textAlign:'right'}}>{row.SubTotal !== undefined && row.SubTotal !== null ? row.SubTotal.toLocaleString(undefined, { minimumFractionDigits: 2,maximumFractionDigits: 2 }) : ''}</StyledTableCellBody> 
                        <StyledTableCellBody>
                          {editRowIdChild === row.Id.toString() ? (
                            <TextField
                              fullWidth
                              value={editedRemarks}
                              onChange={(e) => setEditedRemarks(e.target.value)}
                              variant="outlined"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': {
                                    borderRadius: '40px',
                                  },
                                },
                                '& .MuiOutlinedInput-input': {
                                  color: '#1C2C5A',
                                  fontFamily: 'Inter',
                                  fontWeight: 'bold',
                                  fontSize: '14px',
                                  padding: '4.5px 14px',
                                },
                              }}
                            />
                          ) : (
                            row.Remarks
                          )}
                        </StyledTableCellBody>
                        <StyledTableCellBody>
                          {isEditing ? (
                                <Box display="flex" justifyContent="center" alignItems="center">
                                  <BootstrapButtonMini onClick={() => handleSaveCustomer(row.Id, editedRemarks)} style={{ color: '#1C3766' }}>
                                    <CheckIcon />
                                  </BootstrapButtonMini>
                                  <BootstrapButtonMini onClick={handleCancelEdit} style={{ color: '#1C3766' }}>
                                    <ClearIcon />
                                  </BootstrapButtonMini>
                                </Box>
                          ) : (
                            <BootstrapButtonMini onClick={() => handleEditRemarks(row.Remarks || '', row.Id.toString())}>
                                  <EditIcon />
                                </BootstrapButtonMini>
                          )}
                        </StyledTableCellBody>
                      </>
                    ) : (
                      <>
                        <StyledTableCellBody>{row.CustomerName}</StyledTableCellBody>
                        <StyledTableCellBody>{row.LocationName}</StyledTableCellBody>
                        <StyledTableCellBody>
                          {row.TransactionDate !== null
                            ? new Date(row.TransactionDate ?? '').toLocaleDateString('en-CA', {
                                year: 'numeric',
                                month: 'short', // or 'long' for full month name
                                day: 'numeric',
                              })
                            : ''
                          }
                        </StyledTableCellBody>
                        <StyledTableCellBody>{row.MembershipNo}</StyledTableCellBody>
                        <StyledTableCellBody>{row.CashierNo}</StyledTableCellBody>
                        <StyledTableCellBody>{row.RegisterNo}</StyledTableCellBody>
                        <StyledTableCellBody>{row.TransactionNo}</StyledTableCellBody>
                        <StyledTableCellBody>{row.OrderNo}</StyledTableCellBody>
                        <StyledTableCellBody sx={{textAlign:'right'}}>{row.SubTotal !== undefined && row.SubTotal !== null ? row.SubTotal.toLocaleString(undefined, { minimumFractionDigits: 2,maximumFractionDigits: 2 }) : ''}</StyledTableCellBody> 
                      </>
                    ) }
                    </TableRow>
                  );
                  
                  })
              )}
            </TableBody> 
          </Table>
        </CustomScrollbarBox>
        <CustomScrollbarBox component={Paper}
          sx={{
            height: '30px',
            position: 'relative',
            paddingTop: '10px',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px',
            borderTopLeftRadius: '0',
            borderTopRightRadius: '0',
            borderRadius: '20px',
            paddingLeft: '20px',
            backgroundColor: '#F2F2F2',
            paddingRight: '20px',
            boxShadow: 'inset 1px 1px 1px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)',
            marginLeft: '20px',
            marginRight: '20px',
            marginBottom: '20px'
          }}
        >
          <Grid container>
            <Grid item xs>
              <Typography textAlign="left" sx={{
                        fontFamily: 'Inter',
                        fontWeight: '900',
                        color: '#1C3766',
                        fontSize: 14,
                      }}>
                Grand Total
              </Typography>
            </Grid>
            <Grid item xs dir="rtl">
              <Typography textAlign="right" sx={{
                        fontFamily: 'Inter',
                        fontWeight: '900',
                        color: '#1C3766',
                        fontSize: 14,
                      }}>
                {grandTotal !== undefined && grandTotal !== null ? grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2,maximumFractionDigits: 2 }) : ''}
              </Typography>
            </Grid>
          </Grid>
        </CustomScrollbarBox>
        <Box 
          sx={{
            paddingLeft: '20px',
            paddingRight: '20px',
          }}>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="435px"
      >
        <CircularProgress size={80} />
        <Typography variant="h6" color="textSecondary" style={{ marginTop: '16px' }}>
          Loading...
        </Typography>
      </Box>
    );
  }
});

export default DisputeAnalyticsTable;