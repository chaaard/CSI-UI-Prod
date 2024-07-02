import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, DialogActions, Button, Box, Grid, Typography, TextField, styled, TextFieldProps, MenuItem, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IAnalytics from '../../Pages/Common/Interface/IAnalytics';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import IMatch from '../../Pages/Common/Interface/IMatch';
import IAdjustmentAddProps from '../../Pages/Common/Interface/IAdjustmentAddProps';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import IReasons from '../../Pages/Common/Interface/IReasons';
import axios, { AxiosRequestConfig } from 'axios';
import IException from '../../Pages/Common/Interface/IException';
import { Mode } from './ExceptionsTable';
import IAccountingAdjustments from '../../Pages/Common/Interface/IAccountingAdjustments';
import IAccountingMatch from '../../Pages/Common/Interface/IAccountingMatch';
import ILocations from '../../Pages/Common/Interface/ILocations';
import AccountingMatchPaymentTable from './AccountingMatchPaymentTable';
import IAccountingMatchPayment from '../../Pages/Common/Interface/IAccountingMatchPayment';
import IAnalyticProps from '../../Pages/Common/Interface/IAnalyticsProps';

interface CancelInvoiceProps {
  rowData?: IAccountingMatch | null;
  onAdjustmentValuesChange: (field: keyof IAccountingAdjustments, value: any) => void;
  mode?: Mode;
  selectedRow: React.Dispatch<React.SetStateAction<IAccountingMatchPayment | null>>;
}

interface TextFieldCompProps {
  tName: string
  isMultiline: boolean
  maxRows: number
  isDisabled: boolean
  value?: string | number | null | undefined;
  onChange: (field: keyof IAccountingAdjustments, value: any) => void;
}

const TextFieldComponent: React.FC<TextFieldCompProps> = ({tName, isMultiline, maxRows, isDisabled, value, onChange}) => {
  return (
    <TextField
      size='small'
      type="text"
      name={tName}
      fullWidth
      variant="outlined"
      required
      value={value}
      onChange={(e) => onChange(tName as keyof IAccountingAdjustments, e.target.value.trim() === ''? '' : e.target.value)}
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

const AccountingMatchPaymentFields: React.FC<CancelInvoiceProps> = ({ rowData, onAdjustmentValuesChange, mode, selectedRow }) => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [currentDate, setCurrentDate] = useState<Dayjs | undefined>();
  const [reasons, setReasons] = useState<IReasons[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [accountingAdjustments,  setAccountingAdjustments] = useState<IAccountingAdjustments>();
  const [selectedDateFrom, setSelectedDateFrom] = useState<Dayjs | null | undefined>(null);
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [selectedLocation, setSelectedLocation] = useState<number>(201);
  const [matchPayment, setMatchPayment] = useState<IAccountingMatchPayment[]>([])
  const [jo, setJo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (field: keyof IAccountingAdjustments, value: any)  => {
    if (typeof onAdjustmentValuesChange === 'function') {
      const sanitizedValue = value !== undefined ? value : '';
      setAccountingAdjustments((prevValues) => ({
        ...prevValues,
        [field]: sanitizedValue
      }))

      onAdjustmentValuesChange(field, sanitizedValue);
    }
  };

  const handleChangeDateFrom = (newValue: Dayjs | null) => {
    setSelectedDateFrom(newValue);
  };

  const handleChangeLocation = (value: any) => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelectedLocation(sanitizedValue);
  };

  const fetchMetroMartMatchPayment = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      const getAnalyticsMatch: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAccountingPaymentProofList`,
        data: anaylticsParam,
      };
      const response = await axios(getAnalyticsMatch);
      const result = response.data;
      if (result != null) {
        setMatchPayment(result);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } 
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(selectedDateFrom !== null && jo !== '' && selectedLocation !== null)
        {
          setLoading(true);
          const formattedDateFrom = selectedDateFrom?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDateFrom?.toString() ? formattedDateFrom?.toString() : ''],
            memCode: ['9999011855'],
            userId: '',
            orderNo: jo,
            storeId: [selectedLocation],
          };
          await fetchMetroMartMatchPayment(anaylticsParam);
          setLoading(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [fetchMetroMartMatchPayment, selectedDateFrom, jo, selectedLocation]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations: AxiosRequestConfig = {
          method: 'POST',
          url: `${REACT_APP_API_ENDPOINT}/Analytics/GetLocations`
        };
    
        axios(locations)
          .then(async (result) => {
            var locations = result.data as ILocations[]
            setLocations(locations)
          })
          .catch(() => {
          })
      } catch (error) {
      } 
    };
  
    fetchLocations();
  }, [REACT_APP_API_ENDPOINT]);

  useEffect(() => {
    setAccountingAdjustments({
      MatchId: rowData?.MatchId,
      AnalyticsId: rowData?.AnalyticsId,
      ProofListId: rowData?.ProofListId,
    })

    const currentDate = dayjs();
    setCurrentDate(currentDate);
    onAdjustmentValuesChange('AdjustmentId', null)
    onAdjustmentValuesChange('NewTransactionDate', null)
    onAdjustmentValuesChange('AccountsPaymentRefNo', null)
    onAdjustmentValuesChange('Amount', null)
    onAdjustmentValuesChange('Remarks', null)
    onAdjustmentValuesChange('MatchId', rowData?.MatchId)
    onAdjustmentValuesChange('AnalyticsId', rowData?.AnalyticsId)
    onAdjustmentValuesChange('ProofListId', rowData?.ProofListId)
  }, [onAdjustmentValuesChange]);

  useEffect(() => {
    const defaultDate = dayjs().startOf('day');
    setSelectedDateFrom(defaultDate);
  }, []);

  const handleChangeJo = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setJo(sanitizedValue);
  };

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
          Adjustment
        </Grid>
        <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
          <Box display={'flex'}>
            <TextFieldComponent 
              tName='AdjustmentId'
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={'MATCH PAYMENT'}
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
              value={rowData?.AnalyticsTransactionDate !== null
                ? new Date(rowData?.AnalyticsTransactionDate ?? '').toLocaleDateString('en-CA', {
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
          JO No.
        </Grid>
        <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
          <Box display={'flex'}>
            <TextFieldComponent 
              tName='AnalyticsOrderNo'
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={rowData?.AnalyticsOrderNo}
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
              value={rowData?.AnalyticsLocation}
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
          Amount
        </Grid>
        <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
          <Box display={'flex'}>
            <TextFieldComponent 
              tName='AnalyticsAmount'
              isMultiline={false}
              maxRows={0}
              isDisabled={true}
              onChange={(field, value) => handleChange(field, value)}
              value={rowData?.AnalyticsAmount}
            />
          </Box>
          <Divider sx={{ marginBottom: '5px', marginTop: '15px' }} />
        </Grid>
        <Grid item xs={8}
          sx={{
            fontFamily: 'Inter',
            fontWeight: '900',
            color: '#1C2C5A',
            fontSize: '15px'
          }}>
          Payment JO
        </Grid>
        <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
          <Box display={'flex'}>
            <TextFieldComponent 
              tName='jo'
              isMultiline={false}
              maxRows={0}
              isDisabled={false}
              onChange={(field, value) => handleChangeJo(value)}
              value={jo}
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="dddd, MMMM DD, YYYY"
                value={selectedDateFrom}
                onChange={handleChangeDateFrom}
                renderInput={(params: TextFieldProps) => (
                  <TextField
                    size="small"
                    {...params}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          border: 'none',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#1C2C5A',
                        fontFamily: 'Inter',
                        backgroundColor: '#FFFFFF',
                        fontWeight: 'bold',
                        width: '500px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        boxShadow: 'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
        <Grid item xs={8}
          sx={{
            fontFamily: 'Inter',
            fontWeight: '900',
            color: '#1C2C5A',
            fontSize: '15px'
          }}>
          Clubs
        </Grid>
        <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
          <TextField
              variant="outlined"
              size="small"
              type="text"
              required
              select
              value={selectedLocation}
              onChange={(e) => handleChangeLocation(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  height: '40px',
                  width: '510px',
                  fontSize: '13px',
                  fontFamily: 'Inter',
                  fontWeight: 'bold',
                  color: '#1C2C5A', 
                  "& fieldset": { border: 'none' },
                  boxShadow: 'inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)',
                },
              }}
            >
              {locations.map((item: ILocations) => (
                <MenuItem key={item.Id} value={item.LocationCode}>
                  {item.LocationCode + ' - ' + item.LocationName}
                </MenuItem>
              ))}
          </TextField>
          <Divider sx={{ marginBottom: '5px', marginTop: '15px' }} />
        </Grid>
        <Grid item xs={11.5} sx={{marginLeft: '10px'}}>
          <AccountingMatchPaymentTable matchPayment={matchPayment} loading={loading} selectedRow={selectedRow} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountingMatchPaymentFields;