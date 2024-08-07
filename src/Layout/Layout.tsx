import { Box } from "@mui/material";
import Header from "../Components/Header";
import SideNav from "../Components/SideNav";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const sideNavWidth = 250;

  return (
    <Box style={{ display: "flex" }}>
      <SideNav width={sideNavWidth} />
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Header sideNavWidth={sideNavWidth} />
        <Box
          sx={{
            position: "absolute",
            top: "70px",
            left: "250px",
            right: "10px",
            bottom: "10px",
            overflowX: "hidden",
            overflowY: "auto",
            marginTop: "10px",
            padding: "0 5px",
            transition: "left 0.3s ease",
            backgroundColor: "#FFFFFF",
            borderRadius: "25px",
            boxShadow:
              "inset 6px 9px 8px -1px rgba(0,0,0,0.1), inset -6px 0px 8px -1px rgba(0,0,0,0.1)",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
