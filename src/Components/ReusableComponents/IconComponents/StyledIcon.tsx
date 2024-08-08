import React from 'react';
import { styled } from '@mui/material/styles';

const StyledIcon = styled("div")({
  transition: "transform 0.3s ease",
});

const StyledIconComponent: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return <StyledIcon {...props} />;
};

export default StyledIconComponent;
