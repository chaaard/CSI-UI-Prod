import { useEffect } from 'react';
import { Box, CardMedia, Typography } from '@mui/material';
import UnauthorizedLogo from '../../Assets/Unauthorized.png';

const Unauthorized = () => {
  useEffect(() => {
    document.title = 'CSI | Unauthorized';
  }, []);

  return (
   <Box
      sx={{
        marginTop: '5%', 
        marginLeft: '2%', 
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: '500px', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
          padding: 0,
          gap: 0,
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            color: '#1A2954',
            fontSize: '3vw',
            margin: 0,
            padding: 0,
            gap: 0,
            lineHeight: 1,
          }}
        >
          ERROR
        </Typography>
        <Typography
          sx={{
            fontWeight: 'bold',
            color: '#1A2954',
            fontSize: '8vw',
            margin: 0,
            padding: 0,
            gap: 0,
            lineHeight: 1,
          }}
        >
          403
        </Typography>
        <Typography
          sx={{
            fontWeight: 'bold',
            color: '#1A2954',
            fontSize: '1.5vw',
            margin: 0,
            padding: 0,
            gap: 0,
            lineHeight: 1 ,
          }}
        >
          * Access Denied *
        </Typography>
        <CardMedia
          component="img"
          image={UnauthorizedLogo}
          alt="Access Denied"
          sx={{
            maxWidth: '100%', 
            height: 'auto',
            margin: 0,
            padding: 5,
            gap: 0,
            lineHeight: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export default Unauthorized;
