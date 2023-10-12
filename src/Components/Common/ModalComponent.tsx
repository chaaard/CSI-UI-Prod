import React, { ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, DialogActions, Button, Box } from '@mui/material';
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
            width: title === 'Input Actual' ? '710px' : null,
            maxWidth: title === 'Input Actual' ? '100%' : null,
          },
        }}
      >
        <DialogTitle sx={{ color: "#1C3766", fontWeight: "bold" }}>
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
              <DialogActions
                sx={{
                  marginTop: '10px'
                }}
              >
                <Button
                  onClick={onSave}
                  sx={{
                    color: "white",
                    backgroundColor: "#4761AD",
                    '&:hover': {
                      backgroundColor: "#20346E",
                      color: "white",
                    },
                    width: title === 'Input Actual' ? '600px' : '500px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    height: '40px',
                    borderRadius: '10px',
                  }}
                >
                  {buttonName}
                </Button>
              </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ModalComponent;