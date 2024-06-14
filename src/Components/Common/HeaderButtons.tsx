import { Box, Grid, IconButton, TextField, TextFieldProps, Typography, styled } from "@mui/material";
import {Sync as SyncIcon, CloudUpload as CloudUploadIcon, ForwardToInboxOutlined as ForwardToInboxOutlinedIcon} from '@mui/icons-material/';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Dayjs } from "dayjs";

const BootstrapButton = styled(IconButton)(({ theme }) => ({
  border: '1px solid',
  backgroundColor: '#1C3766',
  borderColor: '#1C3766',
  color: 'white',
  boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
  '&:hover': {
    backgroundColor: '#15294D',
    borderColor: '#15294D',
    boxShadow: '0px 7px 5px -1px rgba(0,0,0,0.5)',
  },
  borderRadius: theme.shape.borderRadius, // Ensure the button has the default shape
}));

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
}

const HeaderButtons: React.FC<HeaderButtonProps> = ({ handleOpenModal, customerName, handleOpenRefresh, selectedDate, handleChangeDate, handleOpenSubmit, handleOpenGenInvoice, isSubmitted, isGenerated }) => {
  return (
    <Box>
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
          <BootstrapButton
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
          </BootstrapButton>
        </Grid>
        {customerName === 'GrabFood' || customerName === 'GrabMart' || customerName === 'FoodPanda' || customerName === 'PickARooFS' || customerName === 'PickARooMerch' || customerName === 'MetroMart' || customerName === 'PickARoo' ? (
          <Grid item>
            <BootstrapButton
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
          </BootstrapButton>
        </Grid>

        ) : (
          <Box></Box>
        )}
        <Grid item >
          <BootstrapButton
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
          </BootstrapButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeaderButtons;