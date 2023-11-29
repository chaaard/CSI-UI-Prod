import { useEffect } from 'react';
import { Box, CardMedia, Typography } from '@mui/material';
import Construction from '../../../../Assets/Construction.png'

const Maintenance = () => {
  useEffect(() => {
    document.title = 'CSI | Error';
  }, []);

  return (
    <Box
      sx={{
        marginTop: '170px',
        marginLeft: '550px',
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          height: '500px',
          width: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontWeight: 'bold',
            color: '#1A2954',
            fontSize: '70px',
          }}
        >
          Coming Soon!
        </Typography>
        <CardMedia
          component="img"
          image={Construction}
          alt="Under Maintenance"
        />
        <Typography
          sx={{
            fontWeight: '900',
            color: '#1A2954',
            fontSize: '40px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          We're working hard to make this page available.
        </Typography>
      </Box>
    </Box>
  )
}

export default Maintenance
