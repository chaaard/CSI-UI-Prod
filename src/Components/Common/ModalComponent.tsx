import React, { ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, DialogActions, Button, Box, Grid, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSave?: () => void;
  buttonName: string;
  open: boolean;
}

const ModalComponent: React.FC<ModalProps> = ({ open, title, children, onClose, onSave, buttonName}) => {
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
            width: title === 'Input Actual' ? '710px' : title === 'Load Analytics' ? '800px' : null,
            maxWidth: title === 'Input Actual' ? '100%'  : title === 'Load Analytics' ? '100%' : null,
          },
        }}
      >
        <DialogTitle sx={{ color: "#1C3766", fontWeight: "bold", userSelect: 'none', cursor: 'default', }}>
          {title}
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
              {children}
            <DialogActions sx={{ mt: 1, mb: 0 }}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                <Grid item xs={6} container justifyContent="flex-end">
                  <Button
                    onClick={onClose}
                    sx={{
                      color: "#4761AD",
                      backgroundColor: '#F2F2F2',
                      '&:hover': {
                        backgroundColor: "#A0A0A0",
                        color: "white",
                      },
                      textTransform: 'none',
                      width: title === 'Input Actual' ? '600px' : title === 'Load Analytics' ? '750px' : '500px',
                      fontWeight: 'bold',
                      fontSize: '20px',
                      height: '40px',
                      borderRadius: '15px',
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={onSave}
                    sx={{
                      textTransform: 'none',
                      backgroundColor: "#4761AD",
                      '&:hover': {
                        backgroundColor: "#20346E",
                        color: "white",
                      },
                      color: "white",
                      fontWeight: 'bold',
                      fontSize: '20px',
                      height: '40px',
                      borderRadius: '15px',
                      boxShadow: '1px 5px 4px -1px rgba(0,0,0,0.3)',
                    }}
                  >
                    {buttonName}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ModalComponent;