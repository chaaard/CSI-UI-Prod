import { Box, CardMedia, IconButton, Paper, Typography } from "@mui/material";

interface PaperProps {
  color: string;
  backgroundColor: string;
  backgroundColorView: string;
  image: string;
  onClick: () => void;
  total: string;
  isImage: boolean;
  top: number;
  left: number;
  width: string;
}

const PaperComponent: React.FC<PaperProps> = ({ color, backgroundColor, backgroundColorView, image, onClick, total, isImage, top, left, width }) => {
return (
  <Box  
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginBottom: '-5px',
      '& > :not(style)': {
        width: 250,
        height: 160,
    },
    }}
  >
    <Paper
      sx={{ 
        width: '18%',
        marginBottom: '15px',
        color: color, 
        backgroundColor: backgroundColor, 
        position: 'relative', 
        borderRadius: '20px', 
        overflow: 'hidden', 
        boxShadow: 'inset 0px 10px 10px -5px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
      }}>
      {isImage ? 
        <CardMedia
        component="img"
        image={image}
        alt="Grab Mart"
        sx={{
            position: 'absolute',
            top: top,
            left: left,
            width: width,
        }}
        /> :
        <Typography
          sx={{
            position: 'absolute',
            top: top,
            left: left,
            width: width !== '' ? width : null,
            color: color,
            fontFamily: 'Inter',
            fontWeight: 'bold',
            fontSize: '16px',
          }}>
          {image}
        </Typography>
      }
      <Box 
        sx={{ 
          paddingRight: '12px', 
          paddingTop: '55px', 
          width: '60%', 
          textAlign: 'right' 
        }}>
        <Typography
          sx={{ 
            color: color,
            fontFamily: 'Inter',
            fontWeight: 'bold',
            fontSize: '25px',
            marginBottom: '-10px'
          }}>
          {total}
        </Typography>
        <Typography 
          sx={{ 
            color: color,
            fontFamily: 'Inter',
            fontSize: '18px',
          }}>
          Total
        </Typography>
      </Box>
      <Paper
        sx={{
          width: '100%',
          textAlign: 'center',
          color: color,
          backgroundColor: backgroundColorView,
          position: 'absolute',
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '40px',
          boxShadow: 'inset 0px 10px 10px -5px rgba(0,0,0,0.4)',
        }}
      >
        <IconButton 
          sx={{
            color: color,
            
          }} 
          onClick={onClick}>
          <Typography 
            sx={{
              fontFamily: 'Inter',
              fontWeight: 'bold',
              fontSize: '15px',
            }}> 
            View
          </Typography>
        </IconButton>
      </Paper>
    </Paper>
  </Box>
);
};

export default PaperComponent;