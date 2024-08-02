import React from 'react';
import { TableCell, TableCellProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(() => ({
  padding: "3px 1px",
  fontSize: "11px",
  color: '#1C2C5A',
  textAlign: 'center',
  cursor: 'default',
}));

const StyledTableCellStatus: React.FC<TableCellProps> = (props) => {
  return <StyledTableCell {...props} />;
};

export default StyledTableCellStatus;
