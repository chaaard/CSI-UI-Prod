import React, { useEffect, useState } from 'react';
import { Box, Grid, TextField } from '@mui/material';
import IAnalytics from '../../Pages/_Interface/IAnalytics';
import IMatch from '../../Pages/_Interface/IMatch';
import IAdjustmentAddProps from '../../Pages/_Interface/IAdjustmentAddProps';
import IException from '../../Pages/_Interface/IException';
import { Mode } from './ExceptionsTable';

interface IncorrectJOProps {
  rowData: IException | null;
  onAdjustmentValuesChange: (field: keyof IAdjustmentAddProps, value: any) => void;
  mode: Mode;
}

interface TextFieldProps {
  tName: string
  isMultiline: boolean
  maxRows: number
  isDisabled: boolean
  value?: string | number | null | undefined;
  onChange: (field: keyof IAdjustmentAddProps, value: any) => void;
}

const TextFieldComponent: React.FC<TextFieldProps> = ({tName, isMultiline, maxRows, isDisabled, value, onChange}) => {
  return (
    <TextField
      size='small'
      type="text"
      name={tName}
      fullWidth
      variant="outlined"
      required
      value={value}
      onChange={(e) => onChange(tName as keyof IAdjustmentAddProps, e.target.value.trim() === ''? '' : e.target.value)}
      disabled={isDisabled}
      multiline={isMultiline}
      rows={maxRows}
      InputProps={{
        sx: {
          borderRadius: '10px',
          backgroundColor: isDisabled ? '#EEEEEE' : '#FFFFFF',
          height: !isMultiline ? '35px' : '80px',
          fontSize: '13px',
          color: '#1C2C5A',
          "& fieldset": { border: 'none' },
          boxShadow: 'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
        },
      }}
      sx={{
        "& .MuiInputBase-input.Mui-disabled": {
          WebkitTextFillColor: "#1C2C5A",
        },
      }}
    />
  );
};

const IncorrectJOFields: React.FC<IncorrectJOProps> = ({ rowData, onAdjustmentValuesChange, mode }) => {
  const [exceptions,  setExceptions] = useState<IAdjustmentAddProps>();
  const handleChange = (field: keyof IAdjustmentAddProps, value: any)  => {
    if (typeof onAdjustmentValuesChange === 'function') {
      const sanitizedValue = value !== undefined ? value : '';
      setExceptions((prevValues) => ({
        ...prevValues,
        [field]: sanitizedValue
      }))

      onAdjustmentValuesChange(field, sanitizedValue);
    }
  };

  useEffect(() => {

    console.log("rowData", rowData);
    setExceptions({
      Id: rowData?.Id,
      DisputeReferenceNumber: rowData?.DisputeReferenceNumber,
      DisputeAmount: rowData?.DisputeAmount,
      DateDisputeFiled: rowData?.DateDisputeFiled,
      DescriptionOfDispute: rowData?.DescriptionOfDispute,
      NewJO: rowData?.JoNumber,
      CustomerId: rowData?.CustomerId,
      AccountsPaymentDate: rowData?.AccountsPaymentDate,
      AccountsPaymentTransNo: rowData?.AccountsPaymentTransNo,
      AccountsPaymentAmount: rowData?.AccountsPaymentAmount,
      ReasonId: rowData?.ReasonId,
      Descriptions: rowData?.Descriptions
    })

    onAdjustmentValuesChange('Id', null)
    onAdjustmentValuesChange('DisputeReferenceNumber', null)
    onAdjustmentValuesChange('DisputeAmount', null)
    onAdjustmentValuesChange('DateDisputeFiled', null)
    onAdjustmentValuesChange('DescriptionOfDispute', null)
    onAdjustmentValuesChange('CustomerId', null)
    onAdjustmentValuesChange('AccountsPaymentDate', null)
    onAdjustmentValuesChange('AccountsPaymentTransNo', null)
    onAdjustmentValuesChange('AccountsPaymentAmount', null)
    onAdjustmentValuesChange('ReasonId', null)
    onAdjustmentValuesChange('DeleteFlag', false)
  }, [onAdjustmentValuesChange]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={8}
          sx={{
            fontFamily: 'Inter',
            fontWeight: '900',
            color: '#1C2C5A',
            fontSize: '15px'
          }}>
          Partner
        </Grid>
        <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
          <Box display={'flex'}>
            <TextFieldComponent 
              tName='AnalyticsPartner'
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={rowData?.CustomerId}
            />
          </Box>
        </Grid>
        <Grid item xs={8}
          sx={{
            fontFamily: 'Inter',
            fontWeight: '900',
            color: '#1C2C5A',
            fontSize: '15px'
          }}>
          Location
        </Grid>
        <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
          <Box display={'flex'}>
            <TextFieldComponent 
              tName='AnalyticsLocation'
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={rowData?.LocationName}
            />
          </Box>
        </Grid>

        <Grid item xs={8}
          sx={{
            fontFamily: 'Inter',
            fontWeight: '900',
            color: '#1C2C5A',
            fontSize: '15px'
          }}>
          Transaction Date
        </Grid>
        <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
          <Box display={'flex'}>
            <TextFieldComponent 
              tName='AnalyticsTransactionDate'
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={rowData?.TransactionDate !== null
                ? new Date(rowData?.TransactionDate ?? '').toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                : ''
              }
            />
          </Box>
        </Grid>
        <Grid item xs={8}
          sx={{
            fontFamily: 'Inter',
            fontWeight: '900',
            color: '#1C2C5A',
            fontSize: '15px'
          }}>
        {mode === Mode.VIEW ? 'Old JO' : 'JO No.'  }
        </Grid>
        <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
          <Box display={'flex'}>
            <TextFieldComponent 
              tName='AnalyticsOrderNo'
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={mode === Mode.VIEW || mode === Mode.EDIT ? rowData?.OldJo : rowData?.JoNumber}
            />
          </Box>
        </Grid>

        <Grid item xs={8}
          sx={{
            fontFamily: 'Inter',
            fontWeight: '900',
            color: '#1C2C5A',
            fontSize: '15px'
          }}>
          New JO
        </Grid>
        <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
          <Box display={'flex'}>
            <TextFieldComponent 
              tName='NewJO'
              isMultiline={false}
              maxRows={0}
              isDisabled={mode === Mode.VIEW ? true : false}
              onChange={(field, value) => handleChange(field, value)}
              value={mode === Mode.EDIT || mode === Mode.VIEW ? exceptions?.NewJO : null}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IncorrectJOFields;