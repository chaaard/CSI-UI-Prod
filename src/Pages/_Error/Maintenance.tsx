import { useEffect } from 'react';
import { Box, CardMedia, Typography } from '@mui/material';
import Construction from '../../Assets/Construction.png';

const Maintenance = () => {
  useEffect(() => {
    document.title = 'CSI | Coming Soon';
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
          height: 'auto', 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto', 
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            color: '#1A2954',
            fontSize: '3vw', 
          }}
        >
          Coming Soon!
        </Typography>
        <CardMedia
          component="img"
          image={Construction}
          alt="Under Maintenance"
          sx={{
            maxWidth: '100%', 
            height: 'auto',
          }}
        />
        <Typography
          sx={{
            fontWeight: '900',
            color: '#1A2954',
            fontSize: '2.5vw',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          We're working hard to make this page available.
        </Typography>
      </Box>
    </Box>
  );
};

export default Maintenance;
