import React from 'react';
import { TableCell, TableCellProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomTableCell = styled(TableCell)(() => ({
  fontSize: "12px",
  fontWeight: 'bold',
  color: '#1C2C5A',
  textAlign: 'left',
  padding: '10px !important'
}));

const StyledTableCellSubHeader: React.FC<TableCellProps> = (props) => {
  return <CustomTableCell {...props} />;
};

export default StyledTableCellSubHeader;
