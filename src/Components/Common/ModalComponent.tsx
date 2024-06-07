import React, { ReactNode, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, DialogActions, Button, Box, Grid, Typography, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Mode } from './ExceptionsTable';
import { Refresh } from '@mui/icons-material';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSave?: () => void;
  onExtra?: () => void;
  buttonName?: string;
  extraButton?: string;
  extraButtonIsDisabled?: boolean;
  open: boolean;
  mode?: Mode;
  isDisabled?: boolean;
}

const ModalComponent: React.FC<ModalProps> = ({ open, title, children, onClose, onSave, onExtra, buttonName, extraButton, extraButtonIsDisabled, mode, isDisabled}) => {
  const [isView, setIsView] = useState<boolean>(false);
  const [isExpandSize, setExpandSize] = useState<number>(6); // button size state
  const [isVisible, setVisible] = useState<string>(''); // button display state

  useEffect(() => {
    if (mode) {
      setIsView(mode === Mode.VIEW);
    }
  }, [mode]);

  useEffect (() => {
    if (extraButton === '' || extraButton === undefined || extraButton === null) {
      setExpandSize(6);
      setVisible('none');
    } 
    else {
      setExpandSize(4);
      setVisible('block');
    }
  }, [extraButton]);

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
          <Divider sx={{ marginTop: '1px' }} />
        </DialogTitle>
        <DialogContent>
          <Box>
            {children}
            <Divider sx={{ marginTop: '10px' }} />
            <DialogActions sx={{ mt: 1, mb: 0 }}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                <Grid item xs={mode === Mode.VIEW ? 12 : isExpandSize} container justifyContent="flex-end">
                  <Button
                    onClick={onClose}
                    sx={{
                      textTransform: 'none',
                      backgroundColor: "#4761AD",
                      '&:hover': {
                        backgroundColor: "#20346E",
                        color: "#FFFFFF",
                      },
                      color: "#FFFFFF",
                      fontSize: '15px', 
                      height: '40px',
                      borderRadius: '15px',
                      boxShadow: '1px 5px 4px -1px rgba(0,0,0,0.3)',
                      // Add styles for the disabled state
                      ...(isDisabled && {
                        backgroundColor: "#B0B0B0", // Example disabled background color
                        color: "#FFFFFF", // Example disabled text color
                        boxShadow: 'none',
                      }),
                      width: title === 'Input Actual' ? '600px' : title === 'Load Analytics' ? '750px' : '500px',
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={isExpandSize} sx={{
                    display: isVisible,
                  }}>
                  {!isView && (
                    <Button
                      disabled = {extraButtonIsDisabled}
                      fullWidth
                      onClick={onExtra}
                      sx={{
                        textTransform: 'none',
                        backgroundColor: "#4761AD",
                        '&:hover': {
                          backgroundColor: "#20346E",
                          color: "#FFFFFF",
                        },
                        color: "#FFFFFF",
                        fontSize: '15px', 
                        height: '40px',
                        borderRadius: '15px',
                        boxShadow: '1px 5px 4px -1px rgba(0,0,0,0.3)',
                        // Add styles for the disabled state
                        ...(extraButtonIsDisabled && {
                          backgroundColor: "#B0B0B0", // Example disabled background color
                          color: "#FFFFFF", // Example disabled text color
                          boxShadow: 'none',
                        }),
                      }}
                    >
                      {extraButton}
                    </Button>
                  )}
                </Grid>
                <Grid item xs={isExpandSize}>
                  {!isView && (
                    <Button
                      disabled = {isDisabled}
                      fullWidth
                      onClick={onSave}
                      sx={{
                        textTransform: 'none',
                        backgroundColor: "#4761AD",
                        '&:hover': {
                          backgroundColor: "#20346E",
                          color: "#FFFFFF",
                        },
                        color: "#FFFFFF",
                        fontSize: '15px', 
                        height: '40px',
                        borderRadius: '15px',
                        boxShadow: '1px 5px 4px -1px rgba(0,0,0,0.3)',
                        // Add styles for the disabled state
                        ...(isDisabled && {
                          backgroundColor: "#B0B0B0", // Example disabled background color
                          color: "#FFFFFF", // Example disabled text color
                          boxShadow: 'none',
                        }),
                      }}
                    >
                      {buttonName}
                    </Button>
                  )}
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