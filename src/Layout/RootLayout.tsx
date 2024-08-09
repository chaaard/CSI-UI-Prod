import { Box } from "@mui/material";
import LoginPage from "../Pages/_Auth/Login";
import useAuth from "../Hooks/UseAuth";
import { useEffect } from "react";
import Layout from "./Layout";
import Cookies from "js-cookie";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { initializeAxiosInterceptors } from "../Config/AxiosConfig";

interface PrivateRouteProps {
  roles: number[];
}

const RootLayout: React.FC<PrivateRouteProps> = ({ roles }) => {
  let roleId = 0;
  const { isAuthenticated } = useAuth();
  const getRoleId = localStorage.getItem("roleId");
  const navigate = useNavigate();

  if (isAuthenticated) {
    const token = Cookies.get("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  useEffect(() => {}, [isAuthenticated]);

  if (getRoleId !== null) {
    roleId = parseInt(getRoleId, 10);
  }

  useEffect(() => {
    initializeAxiosInterceptors(navigate);
  }, [navigate]);

  if (!isAuthenticated) {
    return (
      <Box>
        <LoginPage />
      </Box>
    );
  } else if (!roles.includes(roleId)) {
    return (
      <Box>
        <Navigate to="/unauthorized" />
      </Box>
    );
  } else {
    return (
      <Box>
        <Layout />
      </Box>
    );
  }
};

export default RootLayout;
