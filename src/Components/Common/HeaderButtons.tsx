import {
  Box,
  Grid,
  Icon,
  InputBase,
  Paper,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import {
  Sync as SyncIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material/";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import IAnalytics from "../../Pages/_Interface/IAnalytics";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import IMatch from "../../Pages/_Interface/IMatch";
import IPortal from "../../Pages/_Interface/IPortal";
import StyledButton from "../ReusableComponents/ButtonComponents/StyledButton";

interface HeaderButtonProps {
  handleOpenModal: () => void;
  customerName: string;
  handleOpenRefresh?: () => void;
  selectedDate: Dayjs | null;
  handleChangeDate: (newValue: Dayjs | null) => void;
  handleOpenSubmit?: () => void;
  handleOpenGenInvoice?: () => void;
  isSubmitted: boolean;
  isGenerated: boolean;
  analytics: IAnalytics[];
  setFilteredAnalytics: React.Dispatch<React.SetStateAction<IAnalytics[]>>;
  match: IMatch[];
  setFilteredMatch: React.Dispatch<React.SetStateAction<IMatch[]>>;
  portal: IPortal[];
  setFilteredPortal: React.Dispatch<React.SetStateAction<IPortal[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>; // Add setIsTyping property
  activeButton: string;
}

const HeaderButtons: React.FC<HeaderButtonProps> = ({
  setIsTyping,
  handleOpenModal,
  customerName,
  handleOpenRefresh,
  selectedDate,
  handleChangeDate,
  handleOpenSubmit,
  handleOpenGenInvoice,
  isSubmitted,
  isGenerated,
  analytics,
  setFilteredAnalytics,
  match,
  setFilteredMatch,
  portal,
  setFilteredPortal,
  activeButton,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setIsTyping(query.trim() !== "");
    if (activeButton === "Analytics") {
      // Filter analytics based on search query
      const filteredData = analytics.filter((item) =>
        Object.values(item).some(
          (value) => value && value.toString().toLowerCase().includes(query)
        )
      );
      setFilteredAnalytics(filteredData);
    } else if (activeButton === "Match") {
      // Filter analytics based on search query
      const filteredData = match.filter((item) =>
        Object.values(item).some(
          (value) => value && value.toString().toLowerCase().includes(query)
        )
      );
      setFilteredMatch(filteredData);
    } else if (activeButton === "Portal") {
      // Filter analytics based on search query
      const filteredData = portal.filter((item) =>
        Object.values(item).some(
          (value) => value && value.toString().toLowerCase().includes(query)
        )
      );
      setFilteredPortal(filteredData);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAnalytics(analytics);
      setFilteredMatch(match);
      setFilteredPortal(portal);
    }
  }, [
    searchQuery,
    analytics,
    setFilteredAnalytics,
    match,
    setFilteredMatch,
    portal,
    setFilteredPortal,
  ]);

  return (
    <Box>
      <Grid
        container
        spacing={1}
        alignItems="flex-start"
        direction={{ xs: "column", sm: "row" }}
        sx={{ paddingRight: "20px" }}
      >
        <Grid item xs={6} md={6} sm={12}>
          <Grid container spacing={1} alignItems="flex-start" direction={"row"}>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  inputFormat="dddd, MMMM DD, YYYY"
                  value={selectedDate}
                  disableMaskedInput
                  onChange={handleChangeDate}
                  renderInput={(params: TextFieldProps) => (
                    <TextField
                      size="small"
                      {...params}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderRadius: "40px",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          color: "#1C2C5A",
                          fontFamily: "Inter",
                          fontWeight: "bold",
                          fontSize: "14px",
                          width: "225px",
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  height: "33px",
                  display: "flex",
                  alignItems: "center",
                  width: 280,
                  boxShadow:
                    "inset 1px 1px 1px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)",
                  borderRadius: "20px",
                  backgroundColor: "#F2F2F2",
                  marginBottom: "20px",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1, color: "#1C3766", fontSize: 14 }}
                  placeholder="Search"
                  inputProps={{
                    "aria-label": "Search",
                    value: searchQuery,
                    onChange: handleSearchInputChange,
                  }}
                />
                <Icon sx={{ p: "10px", color: "#1C3766" }} aria-label="search">
                  <SearchIcon />
                </Icon>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} md={6} sm={12} sx={{ width: "100%" }}>
          <Grid
            container
            spacing={1}
            direction={"row"}
            justifyContent={"flex-end"}
          >
            <Grid item>
              <StyledButton
                sx={{
                  color: "white",
                  backgroundColor: "#1C3766",
                  width: "170px",
                  borderRadius: "20px",
                  fontFamily: "Inter",
                  fontWeight: "900",
                  height: "38px",
                  paddingRight: "15px",
                  borderColor: isSubmitted ? "inherit" : "#1C3766",
                  "& .MuiTypography-root": {
                    fontSize: "14px",
                  },
                }}
                onClick={handleOpenRefresh}
                disabled={isSubmitted ? true : false}
              >
                <SyncIcon sx={{ marginRight: "5px" }} />
                <Typography>Reload</Typography>
              </StyledButton>
            </Grid>
            <Grid item>
              {customerName === "GrabFood" ||
              customerName === "GrabMart" ||
              customerName === "FoodPanda" ||
              customerName === "PickARooFS" ||
              customerName === "PickARooMerch" ||
              customerName === "MetroMart" ||
              customerName === "PickARoo" ? (
                <Grid item>
                  <StyledButton
                    sx={{
                      color: "white",
                      backgroundColor: "#1C3766",
                      width: "170px",
                      borderRadius: "20px",
                      fontFamily: "Inter",
                      fontWeight: "900",
                      height: "38px",
                      paddingRight: "15px",
                      borderColor: isSubmitted ? "inherit" : "#1C3766",
                      "& .MuiTypography-root": {
                        fontSize: "14px",
                      },
                    }}
                    onClick={handleOpenModal}
                    disabled={isSubmitted ? true : false}
                  >
                    <CloudUploadIcon sx={{ marginRight: "5px" }} />
                    <Typography>Upload Prooflist</Typography>
                  </StyledButton>
                </Grid>
              ) : (
                <Box></Box>
              )}
            </Grid>
            {/* <Grid item>
                  <StyledButton
                    sx={{
                      color: "white",
                      fontSize: "14px",
                      backgroundColor: "#1C3766",
                      width: "170px",
                      borderRadius: "20px",
                      fontFamily: 'Inter',
                      fontWeight: '900',
                      height: '38px',
                      paddingRight: '15px',
                      borderColor: isSubmitted ? 'inherit' : '#1C3766',
                      boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
                      '& .MuiTypography-root': {
                        fontSize: '14px',
                      }
                    }}
                    onClick={handleOpenSubmit}
                    disabled={isSubmitted ? true : false}
                  >
                    <ForwardToInboxOutlinedIcon sx={{marginRight: '5px'}} />
                    <Typography>
                      {isSubmitted ? "Submitted" : "Submit"}
                    </Typography>
                  </StyledButton>
                </Grid> */}
          </Grid>
        </Grid>
      </Grid>
      {/* 
      <Grid container spacing={1} alignItems="flex-start" direction={'row'} >
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker  
              inputFormat="dddd, MMMM DD, YYYY"
              value={selectedDate}
              disableMaskedInput
              onChange={handleChangeDate}
              renderInput={(params : TextFieldProps) => 
                <TextField  
                  size="small"
                  {...params} 
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderRadius: '40px',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#1C2C5A',
                      fontFamily: 'Inter',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      width: '225px'
                    }
                  }}
                />
              }
            />
          </LocalizationProvider>
        </Grid>
        <Grid item >
          <Paper
            component="form"
            sx={{ p: '2px 4px',height:'33px' , display: 'flex', alignItems: 'center', width: 280, boxShadow: 'inset 1px 1px 1px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)', borderRadius: '20px', backgroundColor: '#F2F2F2',  marginBottom: '20px'}}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, color: '#1C3766', fontSize: 14 }}
              placeholder="Search"
              //inputProps={{ 'aria-label': 'Search', value: searchQuery, onChange: handleSearchInputChange }}
            />
            <Icon sx={{ p: '10px', color: '#1C3766' }} aria-label="search"><SearchIcon /></Icon>
            
          </Paper>
        </Grid> 
        <Grid item >
          <StyledButton
            sx={{
              color: "white",
              backgroundColor: "#1C3766",
              width: "100%",
              borderRadius: "20px",
              fontFamily: 'Inter',
              fontWeight: '900',
              height: '38px',
              paddingRight: '15px',
              borderColor: isSubmitted ? 'inherit' : '#1C3766',
              '& .MuiTypography-root': {
                fontSize: '14px',
              }
            }}
            onClick={handleOpenRefresh}
            disabled={isSubmitted ? true : false}
          >
            <SyncIcon sx={{marginRight: '5px'}} />
            <Typography>
              Reload
            </Typography>
          </StyledButton>
        </Grid>
        {customerName === 'GrabFood' || customerName === 'GrabMart' || customerName === 'FoodPanda' || customerName === 'PickARooFS' || customerName === 'PickARooMerch' || customerName === 'MetroMart' || customerName === 'PickARoo' ? (
          <Grid item>
            <StyledButton
              sx={{
                color: "white",
                backgroundColor: "#1C3766",
                width: "100%",
                borderRadius: "20px",
                fontFamily: 'Inter',
                fontWeight: '900',
                height: '38px',
                paddingRight: '15px',
                borderColor: isSubmitted ? 'inherit' : '#1C3766',
                '& .MuiTypography-root': {
                  fontSize: '14px',
                }
              }}
              onClick={handleOpenModal}
              disabled={isSubmitted ? true : false}
            >
            <CloudUploadIcon sx={{marginRight: '5px'}} />
            <Typography>
              Upload Prooflist
            </Typography>
          </StyledButton>
        </Grid>
        <Grid item xs={6} md={6} sm={12} sx={{ width: '100%' }}>
          <Grid container spacing={1} direction={'row'}  justifyContent={'flex-end'}> 
            <Grid item>
              <StyledButton
                sx={{
                  color: "white",
                  backgroundColor: "#1C3766",
                  width: "100%",
                  borderRadius: "20px",
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  height: '38px',
                  paddingRight: '15px',
                  borderColor: isSubmitted ? 'inherit' : '#1C3766',
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                  }
                }}
                onClick={handleOpenRefresh}
                disabled={isSubmitted ? true : false}
              >
                <SyncIcon sx={{marginRight: '5px'}} />
                <Typography>
                  Reload
                </Typography>
              </StyledButton>
            </Grid>
            <Grid item>
              {customerName === 'GrabFood' || customerName === 'GrabMart' || customerName === 'FoodPanda' || customerName === 'PickARooFS' || customerName === 'PickARooMerch' || customerName === 'MetroMart' || customerName === 'PickARoo' ? (
                <Grid item>
                  <StyledButton
                    sx={{
                      color: "white",
                      backgroundColor: "#1C3766",
                      width: "100%",
                      borderRadius: "20px",
                      fontFamily: 'Inter',
                      fontWeight: '900',
                      height: '38px',
                      paddingRight: '15px',
                      borderColor: isSubmitted ? 'inherit' : '#1C3766',
                      '& .MuiTypography-root': {
                        fontSize: '14px',
                      }
                    }}
                    onClick={handleOpenModal}
                    disabled={isSubmitted ? true : false}
                  >
                  <CloudUploadIcon sx={{marginRight: '5px'}} />
                  <Typography>
                    Upload Prooflist
                  </Typography>
                </StyledButton>
              </Grid>

              ) : (
                <Box></Box>
              )}
            </Grid>
            <Grid item>
              <StyledButton
                sx={{
                  color: "white",
                  fontSize: "14px",
                  backgroundColor: "#1C3766",
                  width: "100%",
                  borderRadius: "20px",
                  fontFamily: 'Inter',
                  fontWeight: '900',
                  height: '38px',
                  paddingRight: '15px',
                  borderColor: isSubmitted ? 'inherit' : '#1C3766',
                  boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                  }
                }}
                onClick={handleOpenSubmit}
                disabled={isSubmitted ? true : false}
              >
                <ForwardToInboxOutlinedIcon sx={{marginRight: '5px'}} />
                <Typography>
                  Submit
                </Typography>
              </StyledButton>
            </Grid>
          </Grid> 
        </Grid>
      </Grid> */}
    </Box>
  );
};

export default HeaderButtons;