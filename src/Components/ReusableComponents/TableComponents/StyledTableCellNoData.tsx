import React from 'react';
import { TableCell, TableCellProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomTableCell = styled(TableCell)(() => ({
  padding: "1px 14px",
  fontSize: "15px",
  color: '#1C2C5A',
  textAlign: 'center',
  fontWeight: '100',
}));

const StyledTableCellNoData: React.FC<TableCellProps> = (props) => {
  return <CustomTableCell {...props} />;
};

export default StyledTableCellNoData;
