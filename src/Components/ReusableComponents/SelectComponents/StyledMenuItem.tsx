import React from 'react';
import { MenuItem, MenuItemProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomMenuItem = styled(MenuItem)(() => ({
  fontSize: "12px",
  color: "#1C2C5A",
}));


const StyledMenuItem: React.FC<MenuItemProps> = (props) => {
  return <CustomMenuItem {...props} />;
};

export default StyledMenuItem;