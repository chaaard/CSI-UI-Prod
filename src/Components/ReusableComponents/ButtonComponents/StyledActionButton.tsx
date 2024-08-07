import React from 'react';
import { IconButton, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomButton = styled(IconButton)(() => ({
  textTransform: 'none',
  fontSize: 12, 
  lineHeight: 1.5,
  color: '#1C2C5A',
  fontWeight: '900',
  fontFamily: 'Inter',
}));


const StyledActionButton: React.FC<ButtonProps> = (props) => {
  return <CustomButton {...props} />;
};

export default StyledActionButton;
