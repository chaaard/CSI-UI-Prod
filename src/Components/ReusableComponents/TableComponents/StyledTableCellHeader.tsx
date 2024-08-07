import React from 'react';
import { TableCell, TableCellProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomTableCell = styled(TableCell)(() => ({
  padding: "8px 17px !important",
  fontSize: "14px",
  fontWeight: '900',
  color: '#1C2C5A',
  textAlign: 'center',
}));

const StyledTableCellHeader: React.FC<TableCellProps> = (props) => {
  return <CustomTableCell {...props} />;
};

export default StyledTableCellHeader;
