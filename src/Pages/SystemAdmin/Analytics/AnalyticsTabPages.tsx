import * as React from "react";
import { Box, Button, ButtonGroup, Fade } from "@mui/material";
import ManualReload from "./ManualReload/ManualReload";
import ManualTransfer from "./ManualTransferDelete/ManualTransfer";
import UndoSubmit from "./ManualUndoSubmit/UndoSubmit";
import ManualAdd from "./ManualAdd/ManualAdd";

export default function AnalyticsTabPages() {
  const [activeButton, setActiveButton] = React.useState("TransferJo");
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  React.useEffect(() => {
    document.title = "Maintenance | Analytics";
  }, []);

  return (
    <Box sx={{}}>
      <ButtonGroup
        sx={{
          height: "20px",
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
        }}
      >
        <Button
          sx={{
            fontWeight: "900 !important",
            fontSize: "12px",
            width: "250px",
            borderRadius: "10px",
            textTransform: "none",
            border: "2px solid #1C2D5B",
            color: activeButton === "TransferJo" ? "#fff" : "#1C2D5B",
            backgroundColor:
              activeButton === "TransferJo" ? "#1C2D5B" : "transparent",
          }}
          onClick={() => handleButtonClick("TransferJo")}
        >
          Manual Transfer JO
        </Button>
        <Button
          sx={{
            fontWeight: "900 !important",
            fontSize: "12px",
            width: "250px",
            textTransform: "none",
            border: "2px solid #1C2D5B",
            color: activeButton === "Reload" ? "#fff" : "#1C2D5B",
            backgroundColor:
              activeButton === "Reload" ? "#1C2D5B" : "transparent",
          }}
          onClick={() => handleButtonClick("Reload")}
        >
          Manual Reload
        </Button>
        <Button
          sx={{
            fontWeight: "900 !important",
            fontSize: "12px",
            width: "250px",
            borderRadius: "10px",
            textTransform: "none",
            border: "2px solid #1C2D5B",
            color: activeButton === "UndoSubmit" ? "#fff" : "#1C2D5B",
            backgroundColor:
              activeButton === "UndoSubmit" ? "#1C2D5B" : "transparent",
          }}
          onClick={() => handleButtonClick("UndoSubmit")}
        >
          Undo Submit
        </Button>
        <Button
          sx={{
            fontWeight: "900 !important",
            fontSize: "12px",
            width: "250px",
            borderRadius: "10px",
            textTransform: "none",
            border: "2px solid #1C2D5B",
            color: activeButton === "ManualAdd" ? "#fff" : "#1C2D5B",
            backgroundColor:
              activeButton === "ManualAdd" ? "#1C2D5B" : "transparent",
          }}
          onClick={() => handleButtonClick("ManualAdd")}
        >
          Manual Add
        </Button>
      </ButtonGroup>
      <div className="fade">
        {activeButton === "TransferJo" && (
          <Fade in={true} timeout={500}>
            <Box>
              <ManualTransfer />
            </Box>
          </Fade>
        )}
        {activeButton === "Reload" && (
          <Fade in={true} timeout={500}>
            <Box>
              <ManualReload />
            </Box>
          </Fade>
        )}
        {activeButton === "UndoSubmit" && (
          <Fade in={true} timeout={500}>
            <Box>
              <UndoSubmit />
            </Box>
          </Fade>
        )}
        {activeButton === "ManualAdd" && (
          <Fade in={true} timeout={500}>
            <Box>
              <ManualAdd />
            </Box>
          </Fade>
        )}
      </div>
    </Box>
  );
}
