import { Box } from "@mui/material";
import LoginPage from "../Pages/_Auth/Login";
import useAuth from "../Hooks/UseAuth";
import { useEffect } from "react";
import Layout from "./Layout";
import Cookies from "js-cookie";
import axios from "axios";

const RootLayout = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    const token = Cookies.get("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  useEffect(() => {}, [isAuthenticated]);

  return (
    <>
      {!isAuthenticated ? (
        <Box>
          <LoginPage />
        </Box>
      ) : (
        <Box>
          <Layout />
        </Box>
      )}
    </>
  );
};

export default RootLayout;
