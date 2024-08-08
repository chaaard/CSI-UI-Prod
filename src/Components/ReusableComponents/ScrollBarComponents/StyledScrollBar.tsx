import React from "react";
import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomScrollBarBox = styled(Box)`
  overflow-y: auto;
  height: calc(100vh - 190px);

  /* Custom Scrollbar Styles */
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #2b4b81;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const StyledScrollBox: React.FC<BoxProps> = (props) => {
  return <CustomScrollBarBox {...props} />;
};

export default StyledScrollBox;
