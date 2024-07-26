import { Box, InputLabel, MenuItem, TextField, Select, FormControl, OutlinedInput, Chip, Autocomplete } from '@mui/material'
import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import IPagination from '../../Pages/Common/Interface/IPagination';
import ICustomerDropdown from '../../Pages/Common/Interface/ICustomerDropdown';
import IMerchants from '../../Pages/_SystemAdmin/Merchants/Interface/IMerchants';



interface CustomerDropdownProps {
  selected?: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  selection: string;
  setSelectedCustomerName?: React.Dispatch<React.SetStateAction<string>>;
  byMerchant: boolean;
  isAllVisible: boolean;
  isTextSearch: boolean;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CustomerDropdown = ({ selected, setSelected, selection, byMerchant, setSelectedCustomerName, isAllVisible, isTextSearch }: CustomerDropdownProps) => {
 
  const { REACT_APP_API_ENDPOINT } = process.env;
  const [customerCodes, setCustomerCodes] = useState<IMerchants[]>([]);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 20; 
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [columnToSort, setColumnToSort] = useState<string>(""); // Column to sort
  const [orderBy, setOrderBy] = useState<string>("asc"); // Sorting order
  const [categoryId, setCategoryId] = useState<number>(0);
  const [selectedCustomerCodesDd, setSelectedCustomerCodes] = useState<any[]>([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState<number[]>([]);

 
  const handleChange = (value: any)  => {
    const sanitizedValue = value !== undefined ? value : '';
    setSelected(sanitizedValue);
    //console.log("sanitizedValue",sanitizedValue);
    console.log("sanitizedValues",sanitizedValue);
    if(byMerchant === false){
      const customer = customerCodes.find((loc) => loc.CustomerCodes === sanitizedValue); 
      if (setSelectedCustomerName) {
        setSelectedCustomerName(customer?.CategoryName ?? '');
        console.log("customer",customer?.CategoryName);
      }
    }
    else{
      const customer = customerCodes.find((loc) => loc.CustomerCode === sanitizedValue); 
      if (setSelectedCustomerName) {
        setSelectedCustomerName(customer?.CustomerName ?? '');
        console.log("customer",customer?.CustomerName);
      }
    }
  };
  
// const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
//   const value = event.target.value as ICustomerDropdown[];
//   setSelected(value);
 
// };

  const fetchCustomerCodes = useCallback(async(pageNumber: number, pageSize: number, searchQuery: string | null, columnToSort: string | null, orderBy: string | null, byMerchant : boolean, categoryId : number, isAllVisible : boolean) => {
    try {
      const params: IPagination = {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchQuery: searchQuery,
        ColumnToSort: columnToSort,
        OrderBy: orderBy, 
        CategoryId: categoryId,
        IsVisible: true, 
        ByMerchant: byMerchant,
        IsAllVisible: isAllVisible,
      };
      const getCustomerCodes: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/CustomerCode/GetCustomerCodesByCategory`,
        data: params,
      };

      axios(getCustomerCodes)
      .then(async (response) => {
        console.log("response.data",response.data);
        setCustomerCodes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
      })
    } catch (error) {
      console.error("Error fetching customer codes:", error);
    } 
  }, [REACT_APP_API_ENDPOINT]);


  const handleCustomerCodeClick = (customerCode: string[], categoryId: number) => {

    
    const updatedCodes = [...selectedCustomerCodesDd];

    customerCode.forEach(code => {
      const index = updatedCodes.indexOf(code);
      if (index !== -1) {
        // If the code exists in selectedCustomerCodesDd, remove it
        updatedCodes.splice(index, 1);
      } else {
        // If the code does not exist in selectedCustomerCodesDd, add it
        updatedCodes.push(code);
      }
    });
    const value: any = updatedCodes;
    setSelectedCustomerCodes(value);

    setSelectedCategoryID((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        //console.log("prevSelected", prevSelected);
        // If the location is already selected, remove it
        return prevSelected.filter((code) => code !== categoryId);
      } else {
        //console.log("prevSelected", prevSelected);
        // If the location is not selected, add it
        return [...prevSelected, categoryId];
      }
    });
    // const selectedCustomers: ICustomerDropdown[] = selectedCustomerCodesDd.map(code => ({
    //   code: code, // Assuming 'code' is a property in ICustomerDropdown
    //   // Add any other necessary properties here
    // }));
    setSelected(updatedCodes);
    console.log("selectedCustomerCodesDd",selectedCustomerCodesDd);
    // setSelectedCustomerCodes((prevSelected) => {
    //   if (prevSelected.includes(customerCode)) {
    //     // If the location is already selected, remove it
    //     return prevSelected.filter((code) => code !== customerCode);
    //   } else {
    //     // If the location is not selected, add it
    //     return [...prevSelected, customerCode];
    //   }
    // });
  };


  // const handleCustomerCodeClick = (event: React.ChangeEvent<{ value: unknown }>) => {
  //   const { options } = event.target as HTMLSelectElement;
  //   const selectedItems = Array.from(options)
  //     .filter((option) => option.selected)
  //     .map((option) => option.value);

  //   const selectedCustomerCodes = customerCodes.filter((code) => selectedItems.includes(code.CustomerCode));
  //   console.log("selectedCustomerCodes",selectedCustomerCodes);
    
  //   setSelected(selectedCustomerCodes);
  // };

  // const handleCustomerCodeClick = (customerCodes: string[]) => {
  //   console.log("customerCodes",customerCodes);
  //   //const selectedCustomerCodesDd = customerCodes.filter((code) => value.includes(code.CustomerCode));
  //   //setSelected(selectedCustomerCodesDd);
  // };

  useEffect(() => {
    setSelectedCustomerCodes(selectedCustomerCodesDd)
  }, [selectedCustomerCodesDd, selectedCustomerCodesDd])

  useEffect(() => {
    fetchCustomerCodes(page, itemsPerPage, searchQuery, columnToSort, orderBy, byMerchant, categoryId, isAllVisible);
    
      // const customerCodes = selected.map(c => c.CustomerCode).join(',');
      
  }, [fetchCustomerCodes, page, itemsPerPage, searchQuery, columnToSort, orderBy, byMerchant, categoryId, isAllVisible]);
  

  return (
    <Box>
      {selection === 'single' ? (
          isTextSearch ? (
              <Autocomplete
                size="small"
                options={customerCodes}
                getOptionLabel={(option) => option.CustomerName}
                onChange={(event, value) => {
                  handleChange(value?.CustomerCode || '');
                }}
                sx={{
                  '& .MuiInputBase-root' : {                    
                    borderRadius: '40px',
                    backgroundColor: '#FFFFFF',
                    height: '40px',
                    width: '400px',
                    fontSize: '15px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },
                  '& .MuiFormLabel-root' : {                    
                    fontSize: '15px',
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    color: '#1C2C5A',
                  },}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Merchant"
                    variant="outlined"
                  />
                )}
              />
          ) : (
            <TextField
              variant="outlined"
              size="small"
              type="text"
              required
              label="Merchant"
              select
              value={selected}
              onChange={(e) => handleChange(e.target.value)}
              //onChange={handleChange}
              InputProps={{
                sx: {
                  borderRadius: '40px',
                  backgroundColor: '#FFFFFF',
                  height: '40px',
                  width: '400px',
                  fontSize: '15px',
                  fontFamily: 'Inter',
                  fontWeight: 'bold',
                  color: '#1C2C5A',
                },
              }}
            >
            {byMerchant === false ? 
            (
              customerCodes.map((row, index) => (
              <MenuItem key={index} value={row.CustomerCodes}>
                {row.CategoryName}
              </MenuItem>
              ))
              ) : (
              customerCodes.map((row, index) => (
                <MenuItem key={index} value={row.CustomerCode}>
                  {row.CustomerName}
                </MenuItem>
              ))
            ) 
            }
            </TextField>
          )

          
        ) : (
          <Box></Box>
        )}

        {selection === 'multiple' ? (
          <FormControl sx={{ width: 300 }}>
            <InputLabel size="small">Merchants</InputLabel>
            <Select
              size="small"
                multiple
                value={selectedCategoryID}
                input={<OutlinedInput id="select-multiple-chip" label="Merchants" />}
                renderValue={(selected) => {
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((code) => {
                        const customer = customerCodes.find((loc) => loc.CategoryId === code);               
                          return (
                            <Chip key={code} label={customer ? customer.CategoryName : code} sx={{ fontSize: '13px' }} />
                          );
                      })}
                    </Box>
                  );
                }}
                MenuProps={MenuProps}
                style={{
                  width: '400px',
                  borderRadius: '40px',
                  color: '#1C3766',
                  fontSize: '14px'
                }}
              >
                {customerCodes.map((item: IMerchants) => (
                  <MenuItem
                    key={item.CategoryId}
                    value={item.CategoryId}
                    onClick={() => handleCustomerCodeClick(item.CustomerCodes, item.CategoryId)}
                    selected={selectedCategoryID.includes(item.CategoryId)}
                  >
                    {item.CategoryName}
                  </MenuItem>
                ))}
              </Select> 
          </FormControl>
          
        ) : (
          <Box></Box>
        )}
    </Box>
  )
}

export default CustomerDropdown
