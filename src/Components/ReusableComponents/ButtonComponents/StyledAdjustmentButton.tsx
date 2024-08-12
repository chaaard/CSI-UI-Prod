import React from 'react';
import { IconButton, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomButton = styled(IconButton)(() => ({
  textTransform: 'none',
  backgroundColor: "#4761AD",
  '&:hover': {
    backgroundColor: "#20346E",
    color: "white",
  },
  color: "white",
  fontWeight: 'bold',
  fontSize: '15px',
  height: '40px',
  borderRadius: '10px',
  boxShadow: '1px 5px 4px -1px rgba(0,0,0,0.3)',
  marginTop: '10px',
  width: '100%'
}));

const StyledAdjustmentButton: React.FC<ButtonProps> = (props) => {
  return <CustomButton {...props} />;
};

export default StyledAdjustmentButton;