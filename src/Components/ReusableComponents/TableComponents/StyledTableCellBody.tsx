import React from 'react';
import { TableCell, TableCellProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomTableCell = styled(TableCell)(() => ({
  padding: "1px 5px",
  fontSize: "11px",
  color: '#1C2C5A',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#E3F2FD',
  },
  cursor: 'default',
}));

const StyledTableCellBody: React.FC<TableCellProps> = (props) => {
  return <CustomTableCell {...props} />;
};

export default StyledTableCellBody;
