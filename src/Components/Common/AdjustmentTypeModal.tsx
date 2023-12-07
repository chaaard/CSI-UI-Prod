import React, { ReactNode, useCallback, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, DialogActions, Button, Box, Grid, Typography, styled, Snackbar, Alert, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ModalComponent from './ModalComponent';
import ForFilingDisputeFields from './ForFilingDisputeFields';
import IncorrectJOFields from './IncorrectJOFields';
import IncorrectPartnerFields from './IncorrectPartnerFields';
import ValidTransactionFields from './ValidTransactionFields';
import IMatch from '../../Pages/Common/Interface/IMatch';
import axios, { AxiosRequestConfig } from 'axios';
import IAdjustmentAddProps from '../../Pages/Common/Interface/IAdjustmentAddProps';
import { sl, tr } from 'date-fns/locale';

interface AdjustmentTypeModalProps {
  open: boolean;
  onClose: () => void;
  rowData: IMatch | null;
  setIsModalClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledButton = styled(Button)(() => ({
  textTransform: 'none',
  backgroundColor: "#4761AD",
  '&:hover': {
    backgroundColor: "#20346E",
    color: "white",
  },
  color: "white",
  fontWeight: 'bold',
  fontSize: '15px',
  height: '40px',
  borderRadius: '10px',
  boxShadow: '1px 5px 4px -1px rgba(0,0,0,0.3)',
  marginTop: '10px',
  width: '100%'
}));

// Define custom styles for white alerts
const WhiteAlert = styled(Alert)(({ severity }) => ({
  color: '#1C2C5A',
  fontFamily: 'Inter',
  fontWeight: '700',
  fontSize: '15px',
  borderRadius: '25px',
  border:  severity === 'success' ? '1px solid #4E813D' : '1px solid #9B6B6B',
  backgroundColor: severity === 'success' ? '#E7FFDF' : '#FFC0C0',
}));

const AdjustmentTypeModal: React.FC<AdjustmentTypeModalProps> = ({ open, onClose, rowData, setIsModalClose}) => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenJO, setIsModalOpenJO] = useState<boolean>(false);
  const [isModalOpenPartner, setIsModalOpenPartner] = useState<boolean>(false);
  const [isModalOpenCancelled, setIsModalOpenCancelled] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [submitted, setSubmitted] = useState<boolean>(false); // Form submission status
  const [adjustmentFields, setAdjustmentFields] = useState<IAdjustmentAddProps>({} as IAdjustmentAddProps);

  let ActionId = 0;
  let StatusId = 0;

  // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAdjustmentFields({} as IAdjustmentAddProps);
  };

  const handleAdjustmentChange = useCallback((field: keyof IAdjustmentAddProps, value: any) => {
    setAdjustmentFields(prevValues => ({
      ...prevValues,
      [field]: value,
    }));
  }, []);

  const handleSubmit = async() => {
    setSubmitted(true);

    if(isModalOpen)
    {
      ActionId = 1;
      StatusId = !adjustmentFields.DisputeReferenceNumber ? 5 : 6;
      if (!adjustmentFields.DisputeAmount || !adjustmentFields.DateDisputeFiled) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Please input required fields.');
        return;
      }
    }
    else if(isModalOpenJO)
    {
      ActionId = 2;
      StatusId = 3
      if (!adjustmentFields?.NewJO) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Please input required field.');
        return;
      }
    }
    else if(isModalOpenPartner)
    {
      ActionId = 3;
      StatusId = 3
      if (!adjustmentFields?.CustomerId) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Please input required field.');
        return;
      }
    }
    else
    {
      ActionId = 4;
      StatusId = 3
      if (!adjustmentFields?.AccountsPaymentAmount || !adjustmentFields?.AccountsPaymentDate || !adjustmentFields?.AccountsPaymentTransNo || !adjustmentFields?.ReasonId) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Please input required field.');
        return;
      }
    }

    const paramAdjustment = {
      Id: 0,
      AnalyticsId: rowData?.AnalyticsId,
      ProoflistId: rowData?.ProofListId,
      ActionId: ActionId,
      StatusId: StatusId,
      AdjustmentId: 0,
      DeleteFlag: false,
      AdjustmentAddDto: adjustmentFields
    }

    const saveRequest: AxiosRequestConfig = {
      method: 'POST', // Use PUT for updating, POST for adding
      url: `${REACT_APP_API_ENDPOINT}/Adjustment/CreateAnalyticsProofList`,
      data: paramAdjustment,
    };

    axios(saveRequest)
      .then(() => {
        setSubmitted(false);
        setIsSnackbarOpen(true);
        setSnackbarSeverity('success');
        setMessage('Data updated successfully!')
        handleCloseModal();
        handleCloseModalJO();
        handleCloseModalPartner();
        handleCloseModalCancelled();
        setIsModalClose(true);
        onClose();
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error occurred. Please try again.');
      });


    if(isModalOpenJO || isModalOpenPartner)
    {
      const updateRequest: AxiosRequestConfig = {
        method: 'PUT', // Use PUT for updating, POST for adding
        url: isModalOpenJO ? `${REACT_APP_API_ENDPOINT}/Adjustment/UpdateJO` : isModalOpenPartner ? `${REACT_APP_API_ENDPOINT}/Adjustment/UpdatePartner` : '',
        data: paramAdjustment,
      };
  
      axios(updateRequest)
        .then(() => {
          setSubmitted(false);
          handleCloseModal();
          handleCloseModalJO();
          handleCloseModalPartner();
          handleCloseModalCancelled();
          onClose();
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          setIsSnackbarOpen(true);
          setSnackbarSeverity('error');
          setMessage('Error occurred. Please try again.');
        });
    }
  }

  //Filing Dispute
  const handleFilingDisputeClick = () => {
    setIsModalOpen(true);
  };

  //Incorrect JO Number
  const handleJOClick = () => {
    setIsModalOpenJO(true);
  };

  const handleCloseModalJO = () => {
    setIsModalOpenJO(false);
  };

  //Incorrect Partner/Merchant
  const handlePartnerClick = () => {
    setIsModalOpenPartner(true);
  };

  const handleCloseModalPartner = () => {
    setIsModalOpenPartner(false);
  };

  //Valid Cancelled Transaction
  const handleCancelledClick = () => {
    setIsModalOpenCancelled(true);
  };

  const handleCloseModalCancelled = () => {
    setIsModalOpenCancelled(false);
  };


  return (
    <Box>
      <Dialog
        onClose={(reason) => {
          if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            onClose();
          }
        }}
        open={open}
        classes={{ paper: 'custom-dialog-paper' }}
        sx={{
          '& .MuiDialog-paper': {
            width: '500px',
            maxWidth: '100%',
          },
        }}  
      >
        <DialogTitle sx={{ color: "#1C3766", fontWeight: "bold", userSelect: 'none', cursor: 'default', }}>
            Adjustment Type
          <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box 
            sx={{  
              padding: '15px 25px 20px 25px',   
              transition: 'left 0.3s ease',
              backgroundColor: '#F2F2F2',
              borderRadius: '25px',
              boxShadow: 'inset 6px 9px 8px -1px rgba(0,0,0,0.3), inset -6px 0px 8px -1px rgba(0,0,0,0.3)',
            }}>
            <Grid container columnSpacing={2} justifyContent='center'>
              <Grid item xs={12} >
                <StyledButton
                  onClick={() => handleFilingDisputeClick()}
                >
                  For Filing Dispute
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  onClick={() => handleJOClick()}
                >
                  Incorrect JO Number
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  onClick={() => handlePartnerClick()}
                >
                  Incorrect Partner/Merchant
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  onClick={() => handleCancelledClick()}
                >
                  Valid Cancelled Transactions
                </StyledButton>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        TransitionComponent={Fade} 
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <WhiteAlert  variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {message}
        </WhiteAlert>
      </Snackbar>
      <ModalComponent
        title='For Filing Dispute'
        onClose={handleCloseModal}
        buttonName='Save'
        open={isModalOpen}
        onSave={handleSubmit}
        children={  
          <ForFilingDisputeFields rowData={rowData} onAdjustmentValuesChange={handleAdjustmentChange} />
        } 
      />
      <ModalComponent
        title='Incorrect JO Number'
        onClose={handleCloseModalJO}
        buttonName='Save'
        open={isModalOpenJO}
        onSave={handleSubmit}
        children={
          <IncorrectJOFields rowData={rowData} onAdjustmentValuesChange={handleAdjustmentChange}/>
        } 
      />
      <ModalComponent
        title='Incorrect Partner/Merchant'
        onClose={handleCloseModalPartner}
        buttonName='Save'
        open={isModalOpenPartner}
        onSave={handleSubmit}
        children={
          <IncorrectPartnerFields rowData={rowData} onAdjustmentValuesChange={handleAdjustmentChange}/>
        } 
      />
      <ModalComponent
        title='Valid Cancelled Transaction'
        onClose={handleCloseModalCancelled}
        buttonName='Save'
        open={isModalOpenCancelled}
        onSave={handleSubmit}
        children={
          <ValidTransactionFields rowData={rowData} onAdjustmentValuesChange={handleAdjustmentChange}/>
        } 
      />
    </Box>
  );
};

export default AdjustmentTypeModal;