import React, { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  Button,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Mode } from "./ExceptionsTable";

// Define props interface
interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSave?: () => void;
  buttonName: string;
  open: boolean;
  mode?: Mode;
}

// TableModalComponent functional component
const TableModalComponent: React.FC<ModalProps> = ({
  open,
  title,
  children,
  onClose,
  onSave,
  buttonName,
  mode,
}) => {
  const [isView, setIsView] = useState<boolean>(false);

  useEffect(() => {
    if (mode) {
      setIsView(mode === Mode.VIEW);
    }
  }, [mode]);

  return (
    <Box>
      <Dialog
        onClose={(reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            onClose();
          }
        }}
        open={open}
        classes={{ paper: "custom-dialog-paper" }}
        sx={{
          "& .MuiDialog-paper": {
            width: "80%",
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#1C3766",
            backgroundColor: "#FFFFFF",
            fontWeight: "bold",
            userSelect: "none",
            cursor: "default",
          }}
        >
          {title}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider
          sx={{ backgroundColor: "#FFFFFF" }}
          orientation="horizontal"
          variant="middle"
          flexItem
        />
        <DialogContent sx={{ backgroundColor: "#FFFFFF" }}>
          <Box
            sx={{
              transition: "left 0.3s ease",
            }}
          >
            {children}
            <DialogActions sx={{ justifyContent: "center" }}>
              <Grid container rowSpacing={1} justifyContent="center">
                <Grid item xs={6}>
                  {!isView && (
                    <Button
                      fullWidth
                      onClick={onSave}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#1C3766",
                        "&:hover": {
                          backgroundColor: "#15294D",
                          borderColor: "#15294D",
                          color: "white",
                        },
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "15px",
                        height: "25px",
                        borderRadius: "15px",
                        boxShadow: "1px 5px 4px -1px rgba(0,0,0,0.3)",
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

export default TableModalComponent;