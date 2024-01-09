import React, { useCallback, useEffect, useState } from 'react';
import { Autocomplete, Box, FormControl, Grid, MenuItem, Select, TextField } from '@mui/material';
import IAnalytics from '../../Pages/Common/Interface/IAnalytics';
import IMatch from '../../Pages/Common/Interface/IMatch';
import { parseWithOptions } from 'date-fns/esm/fp';
import IAdjustmentAddProps from '../../Pages/Common/Interface/IAdjustmentAddProps';
import ICustomerCode from '../../Pages/CustomerCode/Interface/ICustomerCode';
import axios, { AxiosRequestConfig } from 'axios';
import IException from '../../Pages/Common/Interface/IException';
import { Mode } from './ExceptionsTable';

interface IncorrectPartnerProps {
  rowData: IException | null;
  onAdjustmentValuesChange: (field: keyof IAdjustmentAddProps, value: any) => void;
  mode: Mode;
}

const IncorrectPartnerFields: React.FC<IncorrectPartnerProps> = ({ rowData, onAdjustmentValuesChange, mode }) => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [customerCodes, setCustomerCodes] = useState<ICustomerCode[]>([]);

  const fetchCustomerCodes = useCallback(async() => {
    try {
      const getCustomerCodes: AxiosRequestConfig = {
        method: 'GET',
        url: `${REACT_APP_API_ENDPOINT}/CustomerCode/GetCustomerDdCodesAsync`,
        data: '',
      };

      axios(getCustomerCodes)
      .then(async (response) => {
        setCustomerCodes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
      })
    } catch (error) {
      console.error("Error fetching customer codes:", error);
    }
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    fetchCustomerCodes();
  }, [fetchCustomerCodes]);

  useEffect(() => {
    onAdjustmentValuesChange('Id', null)
    onAdjustmentValuesChange('DisputeReferenceNumber', null)
    onAdjustmentValuesChange('DisputeAmount', null)
    onAdjustmentValuesChange('DateDisputeFiled', null)
    onAdjustmentValuesChange('DescriptionOfDispute', null)
    onAdjustmentValuesChange('NewJO', null)
    onAdjustmentValuesChange('AccountsPaymentDate', null)
    onAdjustmentValuesChange('AccountsPaymentTransNo', null)
    onAdjustmentValuesChange('AccountsPaymentAmount', null)
    onAdjustmentValuesChange('ReasonId', null)
    onAdjustmentValuesChange('DeleteFlag', false)
  }, [onAdjustmentValuesChange]);

  if(mode === Mode.RESOLVE)
  {
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
            Move this transaction to:
          </Grid>
          <Grid item xs={11.5} sx={{marginLeft: '10px', marginTop: '10px'}}>
            <Box display={'flex'}>
              <Autocomplete
                fullWidth
                options={customerCodes}
                getOptionLabel={(option) => option.CustomerName}
                onChange={(event, value) => {
                  onAdjustmentValuesChange('CustomerId', value?.CustomerCode || '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Partner"
                    variant="outlined"
                  />
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
  else
  {
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
            Previous Merchant:
          </Grid>
          <Grid item xs={11.5} sx={{marginLeft: '10px', marginTop: '10px'}}>
            <Box display={'flex'}>
              <Autocomplete
                fullWidth
                options={customerCodes}
                getOptionLabel={(option) => option.CustomerName}
                onChange={(event, value) => {
                  onAdjustmentValuesChange('CustomerId', value?.CustomerCode || '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Partner"
                    variant="outlined"
                  />
                )}
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
            Current Merchant:
          </Grid>
          <Grid item xs={11.5} sx={{marginLeft: '10px', marginTop: '10px'}}>
            <Box display={'flex'}>
              <Autocomplete
                fullWidth
                options={customerCodes}
                getOptionLabel={(option) => option.CustomerName}
                onChange={(event, value) => {
                  onAdjustmentValuesChange('CustomerId', value?.CustomerCode || '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Partner"
                    variant="outlined"
                  />
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
};

export default IncorrectPartnerFields;