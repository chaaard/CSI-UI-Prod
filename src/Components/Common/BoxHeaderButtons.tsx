import {
  Grid,
  TextField,
  TextFieldProps,
  Typography,
  Paper,
  InputBase,
  Icon,
} from "@mui/material";
import {
  Sync as SyncIcon,
  AddCircleOutline as AddCircleIcon,
} from "@mui/icons-material/";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import IAnalytics from "../../Pages/_Interface/IAnalytics";
import { useState, useEffect } from "react";
import StyledButton from "../ReusableComponents/ButtonComponents/StyledButton";

interface HeaderButtonProps {
  handleOpenModal: () => void;
  customerName: string;
  handleOpenRefresh?: () => void;
  selectedDate: Dayjs | null;
  handleChangeDate: (newValue: Dayjs | null) => void;
  handleChangeSearch: (searchValue: string) => void;
  handleOpenSubmit?: () => void;
  handleOpenGenInvoice?: () => void;
  handleExportExceptions?: () => void;
  isSubmitted: boolean;
  isGenerated: boolean;
  analytics: IAnalytics[];
  setFilteredAnalytics: React.Dispatch<React.SetStateAction<IAnalytics[]>>;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>; // Add setIsTyping property
}

const HeaderButtons: React.FC<HeaderButtonProps> = ({
  setIsTyping,
  handleOpenModal,
  customerName,
  handleOpenRefresh,
  selectedDate,
  handleChangeDate,
  handleChangeSearch,
  handleOpenSubmit,
  handleOpenGenInvoice,
  handleExportExceptions,
  isSubmitted,
  isGenerated,
  analytics,
  setFilteredAnalytics,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);
    setIsTyping(query.trim() !== "");
    // Filter analytics based on search query
    const filteredData = analytics.filter((item) =>
      Object.values(item).some(
        (value) => value && value.toString().toLowerCase().includes(query)
      )
    );
    setFilteredAnalytics(filteredData);
  };

  useEffect(() => {
    // When search query is empty, reset filtered analytics to original analytics
    if (!searchQuery.trim()) {
      setFilteredAnalytics(analytics);
    }
  }, [searchQuery, analytics, setFilteredAnalytics]);

  return (
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
              onClick={handleOpenModal}
              disabled={isSubmitted ? true : false}
            >
              <AddCircleIcon sx={{ marginRight: "5px" }} />
              <Typography>Add</Typography>
            </StyledButton>
          </Grid>
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
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HeaderButtons;