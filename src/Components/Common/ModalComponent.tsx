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
import WarningIcon from '@mui/icons-material/Warning';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onSave?: () => void;
  onExtra?: () => void;
  buttonName?: string;
  isDisabled?: boolean;
  isCancelDisabled?: boolean;
  extraButton?: string;
  extraButtonIsDisabled?: boolean;
  open: boolean;
  mode?: Mode;
  widthPercent?: string;
}

const ModalComponent: React.FC<ModalProps> = ({
  open,
  title,
  children,
  onClose,
  onSave,
  onExtra,
  buttonName,
  extraButton,
  extraButtonIsDisabled,
  mode,
  isDisabled,
  widthPercent,
  isCancelDisabled,
}) => {
  const [isView, setIsView] = useState<boolean>(false);
  const [isExpandSize, setExpandSize] = useState<number>(6); // button size state
  const [isVisible, setVisible] = useState<string>(""); // button display state
  const [isExtraVisible, setExtraVisible] = useState<string>(""); // button display state

  useEffect(() => {
    if (mode) {
      setIsView(mode === Mode.VIEW);
    }
  }, [mode]);

  useEffect(() => {
    if (
      extraButton === "" ||
      extraButton === undefined ||
      extraButton === null
    ) {
      if (
        buttonName === "" ||
        buttonName === undefined ||
        buttonName === null
      ) {
        setExpandSize(12); //Cancel Button Only
        setVisible("none");
        setExtraVisible("none");
      } else {
        setExpandSize(6); //No Extra Button
        setVisible("block");
        setExtraVisible("none");
      }
    } else {
      setExpandSize(4); //Default
      setVisible("block");
    }
  }, [extraButton, buttonName]);
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
            width:
              title === "Input Actual"
                ? "710px"
                : title === "Load Analytics"
                ? "800px"
                : title.includes("View Prooflist")
                ? "70%"
                : title === "Add Partner Transaction"
                ? "1900px"
                : title === "Submit Analytics"
                ? "1800px"
                : title.includes("View History")
                ? "70%"
                : "800px",
            maxWidth:
              title === "Input Actual"
                ? "100%"
                : title === "Load Analytics"
                ? "100%"
                : title.includes("View Prooflist")
                ? "100%"
                : title === "Add Partner Transaction"
                ? widthPercent
                : title === "Submit Analytics"
                ? widthPercent
                : title.includes("View History")
                ? "70%"
                : "800px",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#1C3766",
            fontWeight: "bold",
            userSelect: "none",
            cursor: "default",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            paddingRight: "40px", 
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {title.toLowerCase() === "confirmation" ? (
              <WarningIcon sx={{ marginRight: "8px" }} />
            ) : null}
            {title}
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ position: "relative" }} />
        <DialogContent>
          <Box>
            {children}
            <Divider sx={{ marginTop: "10px" }} />
            <DialogActions sx={{ mt: 1, mb: 0 }}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 1 }}
              >
                <Grid
                  item
                  xs={mode === Mode.VIEW ? 12 : isExpandSize}
                  container
                  justifyContent="flex-end"
                >
                  <Button
                    disabled={isCancelDisabled}
                    onClick={onClose}
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#4761AD",
                      "&:hover": {
                        backgroundColor: "#20346E",
                        color: "#FFFFFF",
                      },
                      color: "#FFFFFF",
                      fontSize: "15px",
                      height: "40px",
                      borderRadius: "15px",
                      boxShadow: "1px 5px 4px -1px rgba(0,0,0,0.3)",
                      ...(isDisabled && {
                        backgroundColor: "#B0B0B0",
                        color: "#FFFFFF",
                        boxShadow: "none",
                      }),
                      width:
                        title === "Input Actual"
                          ? "600px"
                          : title === "Load Analytics"
                          ? "750px"
                          : "100%",
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={isExpandSize}
                  sx={{
                    display: isExtraVisible,
                  }}
                >
                  {!isView && (
                    <Button
                      disabled={extraButtonIsDisabled}
                      fullWidth
                      onClick={onExtra}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#4761AD",
                        "&:hover": {
                          backgroundColor: "#20346E",
                          color: "#FFFFFF",
                        },
                        color: "#FFFFFF",
                        fontSize: "15px",
                        height: "40px",
                        borderRadius: "15px",
                        boxShadow: "1px 5px 4px -1px rgba(0,0,0,0.3)",
                        ...(extraButtonIsDisabled && {
                          backgroundColor: "#B0B0B0",
                          color: "#FFFFFF",
                          boxShadow: "none",
                        }),
                      }}
                    >
                      {extraButton}
                    </Button>
                  )}
                </Grid>
                <Grid
                  item
                  xs={isExpandSize}
                  sx={{
                    display: isVisible,
                  }}
                >
                  {!isView && (
                    <Button
                      disabled={isDisabled}
                      fullWidth
                      onClick={onSave}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#4761AD",
                        "&:hover": {
                          backgroundColor: "#20346E",
                          color: "#FFFFFF",
                        },
                        color: "#FFFFFF",
                        fontSize: "15px",
                        height: "40px",
                        borderRadius: "15px",
                        boxShadow: "1px 5px 4px -1px rgba(0,0,0,0.3)",
                        ...(isDisabled && {
                          backgroundColor: "#B0B0B0",
                          color: "#FFFFFF",
                          boxShadow: "none",
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
