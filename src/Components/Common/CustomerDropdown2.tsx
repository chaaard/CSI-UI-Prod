import { Autocomplete, Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import IMerchants from "../../Pages/SystemAdmin/Merchants/Interface/IMerchants";
import { useCallback, useEffect, useState } from "react";
import IPagination from "../../Pages/_Interface/IPagination";
import { AxiosRequestConfig } from "axios";
import api from "../../Config/AxiosConfig";

export interface CustomerDropdownProps2{
    selected?: string;
    setSelected: React.Dispatch<React.SetStateAction<string>>;
    selection: string;
    setSelectedCustomerName?: React.Dispatch<React.SetStateAction<string>>;
    byMerchant: boolean;
    isAllVisible: boolean;
    isTextSearch: boolean;
    fromPage?: string;
    width?: string;
    fontSize?: string;
    height?: string;
    isLabel?: boolean;
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
const CustomerDropdown2 = ({
    selected,
    setSelected,
    selection,
    byMerchant,
    setSelectedCustomerName,
    isAllVisible,
    isTextSearch,
    fromPage,
    width,
    fontSize,
    height,
    isLabel = true
}:CustomerDropdownProps2) => {
    const [customerCodes, setCustomerCodes] = useState<IMerchants[]>([]);
    const [page, setPage] = useState<number>(1);
    const itemsPerPage = 20;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [columnToSort, setColumnToSort] = useState<string>("");
    const [orderBy, setOrderBy] = useState<string>("asc");
    const [categoryId, setCategoryId] = useState<number>(0);
    const [selectedCategoryID, setSelectedCategoryID] = useState<number[]>([]);
    const [selectedCustomerCodesDd, setSelectedCustomerCodes] = useState<any>()
    var prevSelected: number[];
    var newValue: number[];

    const onChangeValue = (value:any) =>{
        const sanitizedValue = value !== undefined ? value : "";
        setSelected(sanitizedValue);
        if (byMerchant === false) {
          const customer = customerCodes.find(
            (loc) => loc.CustomerCodes === sanitizedValue
          );
          if (setSelectedCustomerName) {
            setSelectedCustomerName(customer?.CategoryName ?? "");
          }
        } else {
          const customer = customerCodes.find(
            (loc) => loc.CustomerCode === sanitizedValue
          );
          if (setSelectedCustomerName) {
            setSelectedCustomerName(customer?.CustomerName ?? "");
          }
        }
    }

    const getCustomers = useCallback(async ( pageNumber: number, pageSize: number,byMerchant: boolean,categoryId: number,isAllVisible: boolean, 
        searchQuery?: string, columnToSort?: string,orderBy?: string) => {
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
                FromPage: fromPage,
            };
            const config: AxiosRequestConfig = {
              method: "POST",
              url: `/CustomerCode/GetCustomerCodesByCategory`,
              data: params,
            };
            await api(config).then(async (response) => { setCustomerCodes(response.data);}).catch((error) => {console.error("Error fetching item:", error);});
          } 
          catch (error) {
            console.error("Error fetching customer codes:", error);
          }
        },[]
    );
    useEffect(() => {
        getCustomers(
            page,
            itemsPerPage,
            byMerchant,
            categoryId,
            isAllVisible,
            searchQuery,
            columnToSort,
            orderBy
        );
    },[
        getCustomers,
        page,
        itemsPerPage,
        searchQuery,
        columnToSort,
        orderBy,
        byMerchant,
        categoryId,
        isAllVisible
    ]);

    const onClicked = (customerCode: string,categoryId: number) => {
        const sanitizedValue = customerCode !== undefined ? customerCode : "";
        const updatedCodes = selectedCustomerCodesDd;
        const value: any = updatedCodes;
        setSelected(sanitizedValue);
        setSelectedCustomerCodes(value);
        if (prevSelected[0] == categoryId) {
            setSelectedCategoryID(prevSelected)
        }else{
            newValue.push(categoryId)
            setSelectedCategoryID(newValue)
        }
    }

    return(
        <Box>
            {
                selection === "single" ? (
                    isTextSearch ? (
                        <Autocomplete
                            size="small"
                            options={customerCodes}
                            getOptionLabel={(option) => option.CustomerName}
                            onChange={(event, value) => {
                                onChangeValue(value?.CustomerCode || "");
                              }}
                            sx={{
                                "& .MuiInputBase-root": {
                                  borderRadius: "40px",
                                  backgroundColor: "#FFFFFF",
                                  height: "40px",
                                  width: "400px",
                                  fontSize: "15px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  color: "#1C2C5A",
                                },
                                "& .MuiFormLabel-root": {
                                  fontSize: "15px",
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  color: "#1C2C5A",
                                },
                              }}
                              renderInput={(params) => (
                                <TextField {...params} label= {!isLabel ? "" : "Merchant"} variant="outlined" />
                              )}/>
                    ):
                    (
                        <TextField 
                            variant="outlined"
                            size="small"
                            type="text"
                            required
                            label= {!isLabel ? "" : "Merchant"}
                            select
                            value={selected}
                            //onChange={(e) => handleChange(e.target.value)}/>
                            InputProps={{
                                sx: {
                                  borderRadius: "40px",
                                  backgroundColor: "#FFFFFF",
                                  height: height === "" || height === undefined ? "40px" : height,
                                  width: width === "" || width === undefined ? "400px" : width,
                                  fontSize: fontSize === "" || fontSize === undefined ? "15px" : fontSize,
                                  fontFamily: "Inter",
                                  fontWeight: "bold",
                                  color: "#1C2C5A",
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  fontSize:  selected !== undefined || selected !== "" ? "14px" : "12px",
                                },
                              }}
                        >
                            {   
                                byMerchant === false ? customerCodes.map((row, index) => (<MenuItem key={index} value={row.CustomerCodes}>{row.CategoryName}</MenuItem>)): 
                                customerCodes.map((row, index) => (<MenuItem key={index} value={row.CustomerCode}>{row.CustomerName}</MenuItem>))
                            }
                        </TextField>   
                    )
                ):(<Box></Box>)
            }
            {
                selection === "multiple" ? (
                    <FormControl sx={{ width: 300 }}>
                        <InputLabel size="small">Merchants</InputLabel>
                        <Select size="small" multiple value={selectedCategoryID} 
                            input={ <OutlinedInput id="select-multiple-chip" label="Merchants" />}
                            renderValue={(selected) => {
                                return (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {
                                            selected.map((code) => { const customer = customerCodes.find( (loc) => loc.CategoryId === code);
                                                return (
                                                    <Chip key={code} label={customer ? customer.CategoryName : code} sx={{ fontSize: "13px" }}/>
                                                );
                                            })
                                        }
                                    </Box>
                                );}}
                            MenuProps={MenuProps}
                            style={{ width: "400px", borderRadius: "40px", color: "#1C3766", fontSize: "14px" }}>
                            {
                                customerCodes.map((item: IMerchants) => (
                                <MenuItem key={item.CategoryId} value={item.CategoryId}
                                    onClick={() => onClicked(item.CustomerCode, item.CategoryId) } selected={selectedCategoryID[0] == item.CategoryId}>
                                    {item.CategoryName}
                                </MenuItem>))
                            }
                        </Select>
                    </FormControl>
                ) : (<Box></Box>)}
        </Box>
    );
}
export default CustomerDropdown2;