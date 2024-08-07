import React from 'react';
import { Snackbar, Fade, SnackbarProps, SnackbarCloseReason } from '@mui/material';
import { Alert, AlertProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAlert = styled(Alert)(({ severity }) => ({
  color: "#1C2C5A",
  fontFamily: "Inter",
  fontWeight: "700",
  fontSize: "15px",
  borderRadius: "25px",
  border: severity === "success" ? "1px solid #4E813D" : "1px solid #9B6B6B",
  backgroundColor: severity === "success" ? "#E7FFDF" : "#FFC0C0",
}));

interface SnackbarWithAlertProps extends Omit<SnackbarProps, 'onClose'> {
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
  onClose?: (event: React.SyntheticEvent<any> | Event, reason?: SnackbarCloseReason) => void;
}

const StyledSnackBar: React.FC<SnackbarWithAlertProps> = ({
  severity,
  message,
  onClose,
  open,
  ...snackbarProps
}) => {
  const handleClose = (event: React.SyntheticEvent<any> | Event, reason?: SnackbarCloseReason) => {
    if (onClose) {
      onClose(event, reason);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <Snackbar
      {...snackbarProps}
      open={open}
      onClose={handleClose}
      TransitionComponent={Fade}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <StyledAlert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </StyledAlert>
    </Snackbar>
  );
};

export default StyledSnackBar;
