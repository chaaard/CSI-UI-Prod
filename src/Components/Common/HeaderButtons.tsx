import { Box, Grid, IconButton, Typography, styled } from "@mui/material";
import {Sync as SyncIcon, CloudUpload as CloudUploadIcon, ReceiptLong as ReceiptLongIcon, ForwardToInboxOutlined as ForwardToInboxOutlinedIcon} from '@mui/icons-material/';


const BootstrapButton = styled(IconButton)(({ theme }) => ({
  textTransform: 'none',
  fontSize: 16,
  padding: '6px 12px',
  border: '1px solid',
  lineHeight: 1.5,
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
}

const HeaderButtons: React.FC<HeaderButtonProps> = ({ handleOpenModal }) => {
  return (
    <Box>
      <Grid container spacing={1} alignItems="flex-start" direction={'row'}>
        <Grid item >
          <BootstrapButton
            sx={{
              color: "white",
              fontSize: "16px",
              backgroundColor: "#1C3766",
              width: "100%",
              borderRadius: "20px",
              fontFamily: 'Inter',
              fontWeight: '900',
            }}
          >
            <SyncIcon sx={{marginRight: '5px'}} />
            <Typography>
              Refresh
            </Typography>
          </BootstrapButton>
        </Grid>
        <Grid item>
          <BootstrapButton
            sx={{
              color: "white",
              fontSize: "16px",
              backgroundColor: "#1C3766",
              width: "100%",
              borderRadius: "20px",
              fontFamily: 'Inter',
              fontWeight: '900',
            }}
            onClick={handleOpenModal}
          >
            <CloudUploadIcon sx={{marginRight: '5px'}} />
            <Typography>
              Upload Prooflist
            </Typography>
          </BootstrapButton>
        </Grid>
        <Grid item >
          <BootstrapButton
            sx={{
              color: "white",
              fontSize: "16px",
              backgroundColor: "#1C3766",
              width: "100%",
              borderRadius: "20px",
              fontFamily: 'Inter',
              fontWeight: '900',
            }}
            //onClick={handleOpenInvoiceModal}
          >
            <ForwardToInboxOutlinedIcon sx={{marginRight: '5px'}} />
            <Typography>
              Submit
            </Typography>
          </BootstrapButton>
        </Grid>
        <Grid item >
          <BootstrapButton
            sx={{
              color: "white",
              fontSize: "16px",
              backgroundColor: "#1C3766",
              width: "100%",
              borderRadius: "20px",
              fontFamily: 'Inter',
              fontWeight: '900',
            }}
            //onClick={handleOpenInvoiceModal}
          >
            <ReceiptLongIcon sx={{marginRight: '5px'}} />
            <Typography>
              Generate Invoice
            </Typography>
          </BootstrapButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeaderButtons;