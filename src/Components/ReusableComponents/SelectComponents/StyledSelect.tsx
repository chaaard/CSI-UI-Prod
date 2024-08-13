import React from 'react';
import { Select, SelectProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomSelect = styled(Select)(() => ({
  fontSize: "12px",
  padding: "0px",
  color: "#1C2C5A",
  textAlign: "left",
  height: "24px",
  width: "100px",
}));

const StyledSelect: React.FC<SelectProps> = (props) => {
  return <CustomSelect {...props} />;
};

export default StyledSelect;