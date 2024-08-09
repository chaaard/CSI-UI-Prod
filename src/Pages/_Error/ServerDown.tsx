import { useEffect } from 'react';
import { Box, CardMedia, Typography } from '@mui/material';
import ServerDownLogo from '../../Assets/ServerDown.png';

const ServerDown = () => {
  useEffect(() => {
    document.title = 'CSI | Server Down';
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
          500
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
          * Server Down *
        </Typography>
        <CardMedia
          component="img"
          image={ServerDownLogo}
          alt="Server Down"
          sx={{
            maxWidth: '100%', 
            height: 'auto',
            margin: 0,
            padding: 10,
            gap: 0,
            lineHeight: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export default ServerDown;
