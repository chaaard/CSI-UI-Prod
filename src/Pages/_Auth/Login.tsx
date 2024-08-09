import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AxiosRequestConfig, AxiosError } from "axios";
import useAuth from "../../Hooks/UseAuth";
import { Form, useNavigate } from "react-router-dom";
import IUserLogin from "./Interface/IUserLogin";
import ModalComponent from "../../Components/Common/ModalComponent";
import IFirstLogin from "../_Interface/IFirstLogin";
import StyledButton from "../../Components/ReusableComponents/ButtonComponents/StyledButton";
import StyledSnackBar from "../../Components/ReusableComponents/NotificationComponents/StyledAlert";
import api from "../../Config/AxiosConfig";

const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "warning" | "info" | "success">("success");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submittedPassword, setSubmittedPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [login, setLogin] = useState<IUserLogin>({
    Username: "",
    Password: "",
  });
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [openSubmit, setOpenSubmit] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    document.title = "CSI | Login";
  }, []);

  useEffect(() => {
    if (openSubmit === true) {
      if (
        password === confirmPassword &&
        password !== login.Password &&
        confirmPassword !== login.Password &&
        password !== null &&
        confirmPassword !== null
      ) {
        setIsDisabled(false);
      } else if (
        password === login.Password &&
        confirmPassword === login.Password
      ) {
        setIsDisabled(true);
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Please use different password!");
      } else {
        setIsDisabled(true);
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Password do not match!");
      }
    }
  }, [confirmPassword]);

 
  const handleCloseSubmit = () => {
    setOpenSubmit(false);
  };

  const handleSubmitClick = async () => {
    setSubmittedPassword(true);
    try {
      const updatedParam: IFirstLogin = {
        Username: login.Username,
        Password: confirmPassword,
      };

      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Auth/ChangePassword`,
        data: updatedParam,
      };

      try {
        const response = await api(config); // Use the custom Axios instance
        var result = response.data;
        if (result.Message === "Successful") {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("success");
          setMessage("Password changed successfully");
          setOpenSubmit(false);
          setSubmittedPassword(true);
          setTimeout(() => {
            setIsSnackbarOpen(false);
            result.RoleId === 1
              ? navigate("accounting/dashboard-accounting")
              : result.RoleId === 2
              ? navigate("treasury/dashboard-treasury")
              : result.RoleId === 4
              ? navigate("system-admin/dashboard-system-admin")
              : navigate("maintenance");
            window.location.reload();
          }, 1000);
        } else {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("error");
          setMessage("Error changing password. Please try again!");
          setOpenSubmit(false);
          setSubmittedPassword(true);
        }
      } catch (error) {
        console.error(error);
        // Handle specific error scenarios here if needed
      }
    } catch (error) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error password change");
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLoginSubmit = async () => {
    setSubmitted(true);
    if (!login.Username || !login.Password) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Please input required fields.");
      return;
    }

    const url = `/Auth/Login`;

    try {
      const response = await api.post(url, login); // Use the custom Axios instance
      const result = response.data;

      if (result.Message !== "User is already logged in.") {
        auth.signIn(result);
        if (result.IsFirstLogin) {
          setOpenSubmit(true);
        } else {
          setIsSnackbarOpen(true);
          setSnackbarSeverity("success");
          setMessage("Login successfully!");
          setSubmitted(true);
          setTimeout(() => {
            setIsSnackbarOpen(false);
            switch (result.RoleId) {
              case 1:
                navigate("accounting/dashboard-accounting");
                break;
              case 2:
                navigate("treasury/dashboard-treasury");
                break;
              case 4:
                navigate("system-admin/dashboard-system-admin");
                break;
              default:
                navigate("maintenance");
                break;
            }
            window.location.reload();
          }, 1000);
        }
      } else if (result.Message === "Login attempt limit reached!") {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Login attempt limit reached!");
        setLogin({
          Username: "",
          Password: "",
        });
      } else if (result.Message === "User not found.") {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("User not found.");
        setLogin({
          Username: "",
          Password: "",
        });
      } else {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("User is already logged in.");
      }
    } catch (error) {
      // Type narrowing for the error
      if (error instanceof AxiosError) {
        console.error("Login failed:", error);
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");

        if (error.response) {
          switch (error.response.status) {
            case 401:
              setMessage("Invalid credentials. Please try again.");
              break;
            default:
              if (
                error.response.data === "Login attempt limit reached!" ||
                error.response.data === "Username is Inactive!"
              ) {
                setMessage(`${error.response.data}`);
              } else {
                setMessage("Incorrect username/password.");
              }
              break;
          }
        } else {
          setMessage("Server is currently unavailable. Please try again later.");
        }
      } else {
        // Handle non-Axios errors (e.g., network issues)
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("An unexpected error occurred. Please try again.");
      }

      setSubmitted(false);
      setLogin({
        Username: "",
        Password: "",
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = event.target;
    const updatedFormData = {
      ...login,
      [inputName]: value,
    };

    setLogin(updatedFormData);
  };

  const handleChangePasswordModal = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name: inputName, value } = event.target;
    setPassword(value);
  };

  const handleConfirmChangePasswordModal = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name: inputName, value } = event.target;
    setConfirmPassword(value);
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F2F2F2",
        flexGrow: 1,
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        container
        spacing={8}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item>
          <Box
            sx={{
              textAlign: "center",
              color: "#1C2C5A",
              marginBottom: "40px",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: "240px",
                fontFamily: "Arial",
                fontStyle: "italic",
                fontWeight: "bold",
              }}
            >
              S&R
            </Typography>
            <Typography
              variant="h4"
              sx={{
                marginTop: "-35px",
                fontSize: "50px",
                fontFamily: "Arial",
              }}
            >
              Membership Shopping
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Card
            sx={{
              padding: "20px",
              borderRadius: 7,
              mb: 4,
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.20) inset",
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                fontSize: "40px",
                fontWeight: "bold",
                color: "#1C3766",
                mb: 2,
              }}
            >
              CSI System
            </Box>
            <Box>
              <CardContent
                sx={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    paddingTop: "8px",
                    width: "100%",
                  }}
                >
                  <TextField
                    InputProps={{ sx: { borderRadius: 7 } }}
                    fullWidth
                    sx={{ PaddingLeft: "100px" }}
                    label="Username"
                    name="Username"
                    onChange={handleChange}
                    value={login.Username}
                    required
                    error={submitted && login.Username === ""}
                    helperText={
                      submitted &&
                      login.Username === "" &&
                      "Username is required"
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleLoginSubmit();
                      }
                    }}
                  />
                </Box>
                <Box sx={{ paddingTop: "3%", width: "100%" }}>
                  <TextField
                    InputProps={{
                      sx: { borderRadius: 7 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                    label="Password"
                    name="Password"
                    type={showPassword ? "text" : "password"}
                    value={login.Password}
                    onChange={handleChange}
                    required
                    error={submitted && login.Password === ""}
                    helperText={
                      submitted &&
                      login.Password === "" &&
                      "Password is required"
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleLoginSubmit();
                      }
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    paddingTop: "4%",
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <StyledButton
                    sx={{
                      color: "white",
                      fontSize: "16px",
                      backgroundColor: "#1C3766",
                      width: "370px",
                      borderRadius: "10px",
                    }}
                    onClick={handleLoginSubmit}
                  >
                    <Typography>Login</Typography>
                  </StyledButton>
                </Box>
              </CardContent>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <StyledSnackBar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={message}
      />
      <ModalComponent
        title="User New Password"
        onClose={handleCloseSubmit}
        buttonName="Submit"
        isDisabled={isDisabled}
        open={openSubmit}
        onSave={handleSubmitClick}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid
                item
                xs={8}
                sx={{
                  fontFamily: "Inter",
                  fontWeight: "900",
                  color: "#1C2C5A",
                  fontSize: "20px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "25px",
                    textAlign: "center",
                    marginRight: "-170px",
                  }}
                >
                  <Form>
                    <Box sx={{ paddingTop: "3%", width: "100%" }}>
                      <TextField
                        InputProps={{
                          sx: { borderRadius: 7 },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                        label="New Password"
                        id="NewPassword"
                        type={showPassword ? "text" : "password"}
                        onChange={handleChangePasswordModal}
                        required
                        value={password}
                        error={submittedPassword && password === ""}
                        helperText={
                          submittedPassword &&
                          password === "" &&
                          "Password is required"
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleLoginSubmit();
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ paddingTop: "3%", width: "100%" }}>
                      <TextField
                        InputProps={{
                          sx: { borderRadius: 7 },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                        label="Confirm New Password"
                        id="ConfirmNewPassword"
                        type={showPassword ? "text" : "password"}
                        onChange={handleConfirmChangePasswordModal}
                        required
                        value={confirmPassword}
                        error={submittedPassword && confirmPassword === ""}
                        helperText={
                          submittedPassword &&
                          confirmPassword === "" &&
                          "Password is required"
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleSubmitClick();
                          }
                        }}
                      />
                    </Box>
                  </Form>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        }
      />
    </Box>
  );
};

export default LoginPage;