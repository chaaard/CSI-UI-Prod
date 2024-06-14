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
        marginTop: '5%', // Adjusted margin for responsiveness
        marginLeft: '2%', // Adjusted margin for responsiveness
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: '500px', // Set a maximum width for responsiveness
          height: 'auto', // Automatically adjust height to maintain aspect ratio
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto', // Center the box horizontally
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            color: '#1A2954',
            fontSize: '3vw', // Responsive font size based on viewport width
          }}
        >
          Coming Soon!
        </Typography>
        <CardMedia
          component="img"
          image={Construction}
          alt="Under Maintenance"
          sx={{
            maxWidth: '100%', // Ensure the image doesn't exceed its container
            height: 'auto', // Automatically adjust height to maintain aspect ratio
          }}
        />
        <Typography
          sx={{
            fontWeight: '900',
            color: '#1A2954',
            fontSize: '2.5vw', // Responsive font size based on viewport width
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
