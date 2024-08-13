import React from 'react';
import { IconButton, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomButton = styled(IconButton)(({ theme }) => ({
  textTransform: "none",
  fontSize: 12,
  padding: "6px 12px",
  border: "1px solid",
  lineHeight: 1.5,
  backgroundColor: "#1C3766",
  borderColor: "#1C3766",
  color: "white",
  boxShadow: "0px 7px 5px -1px rgba(0,0,0,0.5)",
  "&:hover": {
    backgroundColor: "#15294D",
    borderColor: "#15294D",
    boxShadow: "0px 7px 5px -1px rgba(0,0,0,0.5)",
  },
  borderRadius: theme.shape.borderRadius,
}));


const StyledButton: React.FC<ButtonProps> = (props) => {
  return <CustomButton {...props} />;
};

export default StyledButton;