
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomTextField = styled(TextField)(() => ({
  fontSize: '10px',
  fontWeight: '100',
}))

const StyledTextField: React.FC<TextFieldProps> = (props) => {
  return <CustomTextField {...props} />;
};

export default StyledTextField;