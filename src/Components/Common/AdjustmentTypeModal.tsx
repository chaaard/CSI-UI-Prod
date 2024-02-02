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
import IException from '../../Pages/Common/Interface/IException';
import { Mode } from './ExceptionsTable';
import CorrectionPrevDayFields from './CorrectionPrevDayFields';
import AdvancePaymentFields from './AdvancePaymentFields';
import IRefreshAnalytics from '../../Pages/Common/Interface/IRefreshAnalytics';
import OthersFields from './OthersFields';

interface AdjustmentTypeModalProps {
  open: boolean;
  onClose: () => void;
  exception: IException;
  setIsModalClose: React.Dispatch<React.SetStateAction<boolean>>;
  mode: Mode;
  refreshAnalyticsDto?: IRefreshAnalytics;
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

const AdjustmentTypeModal: React.FC<AdjustmentTypeModalProps> = ({ open, onClose, exception, setIsModalClose, mode, refreshAnalyticsDto }) => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenJO, setIsModalOpenJO] = useState<boolean>(false);
  const [isModalOpenPartner, setIsModalOpenPartner] = useState<boolean>(false);
  const [isModalOpenCancelled, setIsModalOpenCancelled] = useState<boolean>(false);
  const [isModalOpenCorrection, setIsModalOpenCorrection] = useState<boolean>(false);
  const [isModalOpenAdvPayment, setIsModalOpenAdvPayment] = useState<boolean>(false);
  const [isModalOpenOthers, setIsModalOpenOthers] = useState<boolean>(false);
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
      StatusId = adjustmentFields.DisputeReferenceNumber === undefined || adjustmentFields.DisputeReferenceNumber === null || adjustmentFields.DisputeReferenceNumber === '' ? 6 : 3;
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
    else if (isModalOpenCancelled)
    {
      ActionId = 4;
      StatusId = adjustmentFields.AccountsPaymentTransNo === undefined || adjustmentFields.AccountsPaymentTransNo === null || adjustmentFields.AccountsPaymentTransNo === '' ? 6 : 3;
      if (!adjustmentFields?.AccountsPaymentAmount || !adjustmentFields?.AccountsPaymentDate || !adjustmentFields?.ReasonId) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Please input required field.');
        return;
      }
    }
    else if (isModalOpenCorrection)
    {
      ActionId = 5;
      StatusId = 3
      if (!adjustmentFields?.Descriptions) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Please input required field.');
        return;
      }
    }
    else if (isModalOpenAdvPayment)
    {
      ActionId = 6;
      StatusId = 3
      if (!adjustmentFields?.Descriptions) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Please input required field.');
        return;
      }
    }
    else
    {
      ActionId = 7;
      StatusId = 3
      if (!adjustmentFields?.Descriptions) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Please input required field.');
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
      RefreshAnalyticsDto: refreshAnalyticsDto
    }

    if(isModalOpen || isModalOpenCancelled || isModalOpenCorrection || isModalOpenAdvPayment || isModalOpenOthers)
    {
      const saveRequest: AxiosRequestConfig = {
        method: 'PUT', // Use PUT for updating, POST for adding
        url: `${REACT_APP_API_ENDPOINT}/Adjustment/UpdateAnalyticsProofList`,
        data: paramAdjustment,
      };
  
      axios(saveRequest)
        .then(() => {
          setSubmitted(false);
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Data saved successfully!')
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
          setSnackbarSeverity('error');
          setMessage('Error occurred. Please try again.');
        });
    }
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
          setSnackbarSeverity('success');
          setMessage('Data saved successfully!')
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
          setSnackbarSeverity('error');
          setMessage('Error occurred. Please try again.');
        });
    }
  }

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
              {(exception.Source !== "Portal") && (
                <>
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
                </>
              )}
              <Grid item xs={12}>
                <StyledButton
                  onClick={() => handleCancelledClick()}
                >
                  Valid Cancelled Transactions
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  onClick={() => handleCorrectionClick()}
                >
                  Correction from Previous Day
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  onClick={() => handleAdvPaymentClick()}
                >
                  Advance Payment
                </StyledButton>
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  onClick={() => handleOthersClick()}
                >
                  Others
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
        mode={mode}
        children={  
          <ForFilingDisputeFields rowData={exception} onAdjustmentValuesChange={handleAdjustmentChange} mode={mode} />
        } 
      />
      <ModalComponent
        title='Incorrect JO Number'
        onClose={handleCloseModalJO}
        buttonName='Save'
        open={isModalOpenJO}
        onSave={handleSubmit}
        mode={mode}
        children={
          <IncorrectJOFields rowData={exception} onAdjustmentValuesChange={handleAdjustmentChange} mode={mode} />
        } 
      />
      <ModalComponent
        title='Incorrect Partner/Merchant'
        onClose={handleCloseModalPartner}
        buttonName='Save'
        open={isModalOpenPartner}
        onSave={handleSubmit}
        children={
          <IncorrectPartnerFields rowData={exception} onAdjustmentValuesChange={handleAdjustmentChange} mode={mode} />
        } 
      />
      <ModalComponent
        title='Valid Cancelled Transaction'
        onClose={handleCloseModalCancelled}
        buttonName='Save'
        open={isModalOpenCancelled}
        onSave={handleSubmit}
        mode={mode}
        children={
          <ValidTransactionFields rowData={exception} onAdjustmentValuesChange={handleAdjustmentChange} mode={mode} />
        } 
      />
      <ModalComponent
        title='Correction from Previous Day'
        onClose={handleCloseModalCorrection}
        buttonName='Save'
        open={isModalOpenCorrection}
        onSave={handleSubmit}
        mode={mode}
        children={
          <CorrectionPrevDayFields rowData={exception} onAdjustmentValuesChange={handleAdjustmentChange} mode={mode} />
        } 
      />
      <ModalComponent
        title='Advance Payment'
        onClose={handleCloseModalAdvPayment}
        buttonName='Save'
        open={isModalOpenAdvPayment}
        onSave={handleSubmit}
        mode={mode}
        children={
          <AdvancePaymentFields rowData={exception} onAdjustmentValuesChange={handleAdjustmentChange} mode={mode} />
        } 
      />
      <ModalComponent
        title='Others'
        onClose={handleCloseModalOthers}
        buttonName='Save'
        open={isModalOpenOthers}
        onSave={handleSubmit}
        mode={mode}
        children={
          <OthersFields rowData={exception} onAdjustmentValuesChange={handleAdjustmentChange} mode={mode} />
        } 
      />
    </Box>
  );
};

export default AdjustmentTypeModal;