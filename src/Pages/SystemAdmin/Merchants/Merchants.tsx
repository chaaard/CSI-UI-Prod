import {
  Autocomplete,
  Box,
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Pagination,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material/";
import { AxiosRequestConfig } from "axios";
import ICustomerCode from "./Interface/IMerchants";
import ModalComponent from "../../../Components/Common/ModalComponent";
import ICustomerCodeUpdateDelete from "./Interface/IMerchantsUpdateDelete";
import IPagination from "../../_Interface/IPagination";
import AddIcon from "@mui/icons-material/Add";
import ICategory from "../../_Interface/ICategory";
import IMerchant from "../../_Interface/IMerchant";
import api from "../../../Config/AxiosConfig";
import StyledTextField from "../../../Components/ReusableComponents/TextFieldComponents/StyledTextField";
import StyledTableCellHeader from "../../../Components/ReusableComponents/TableComponents/StyledTableCellHeader";
import StyledTableCellBody from "../../../Components/ReusableComponents/TableComponents/StyledTableCellBody";
import StyledSnackBar from "../../../Components/ReusableComponents/NotificationComponents/StyledAlert";
import StyledScrollBox from "../../../Components/ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledSelect from "../../../Components/ReusableComponents/SelectComponents/StyledSelect";
import StyledMenuItem from "../../../Components/ReusableComponents/SelectComponents/StyledMenuItem";
import StyledTableCellNoData from "../../../Components/ReusableComponents/TableComponents/StyledTableCellNoData";

const defaultFormValue = {
  CustomerName: "",
  CustomerCode: "",
  DeleteFlag: false,
  CustomerNo: "",
  CategoryId: 0,
  UserId: "",
};

const Merchants = () => {
  const [customerCodes, setCustomerCodes] = useState<ICustomerCode[]>([]);
  const [fieldValues, setFieldValues] =
    useState<ICustomerCodeUpdateDelete>(defaultFormValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "error" | "warning" | "info" | "success"
  >("success");
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [openInsert, setOpenInsert] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [pageCount, setPageCount] = useState<number>(0);
  const [columnToSort, setColumnToSort] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("asc");
  const getId = window.localStorage.getItem("Id");
  const [category, setCategory] = useState<ICategory[]>([] as ICategory[]);
  const [merchant, setMerchant] = useState<IMerchant[]>([] as IMerchant[]);
  const [id, setId] = useState<number>(0);

  useEffect(() => {
    document.title = "Maintenance | Merchants";
  }, []);

  let Id = "";
  if (getId !== null) {
    Id = getId;
  }

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
    setMerchant([]);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setPage(1);
  };

  const handleCloseModalInsert = useCallback(() => {
    setOpenInsert(false);
    setSubmitted(false);
    setFieldValues(defaultFormValue);
  }, []);

  const handleSubmitInsert = async () => {
    setSubmitted(true);
    const allIsPopulated =
      !fieldValues?.CustomerNo ||
      !fieldValues.CustomerName ||
      !fieldValues.CustomerCode ||
      !fieldValues.CategoryId;
    fieldValues.UserId = Id;
    if (allIsPopulated) {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Please input required field.");
      return;
    }

    const config: AxiosRequestConfig = {
      method: "POST",
      url: `/CustomerCode/InsertCustomerCodeAsync`,
      data: fieldValues,
    };

    await api(config)
      .then(() => {
        setSubmitted(false);
        setIsSnackbarOpen(true);
        setSnackbarSeverity("success");
        setMessage("Customer insert successfully!");
        fetchCustomerCodes(
          page,
          itemsPerPage,
          searchQuery,
          columnToSort,
          orderBy
        );
        handleCloseModalInsert();
        setSearchQuery("");
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        if (error.response && error.response.status === 404) {
          setMessage("Customer already exist on database");
        } else {
          setMessage("Error occurred. Please try again.");
        }
      });
  };

  const fetchCustomerCodes = useCallback(
    async (
      pageNumber: number,
      pageSize: number,
      searchQuery: string | null,
      columnToSort: string | null,
      orderBy: string | null
    ) => {
      try {
        setLoading(true);
        const params: IPagination = {
          PageNumber: pageNumber,
          PageSize: pageSize,
          SearchQuery: searchQuery,
          ColumnToSort: columnToSort,
          OrderBy: orderBy,
        };

        const config: AxiosRequestConfig = {
          method: "POST",
          url: `/CustomerCode/GetCustomerCodesAsync`,
          data: params,
        };

        try {
          const response = await api(config);
          var result = response.data;
          setCustomerCodes(result.CustomerCodesList);
          setPageCount(result.TotalPages);
        } catch (error) {
          console.error("Error fetching customer codes:", error);
        }
      } catch (error) {
        console.error("Error fetching customer codes:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCustomerCodes(page, itemsPerPage, searchQuery, columnToSort, orderBy);
  }, [
    fetchCustomerCodes,
    page,
    itemsPerPage,
    searchQuery,
    columnToSort,
    orderBy,
  ]);

  const handleEditOrInsertClick = async (row?: ICustomerCode) => {
    if (row === undefined) {
      fetchMerchant();
      setOpenInsert(true);
    } else {
      handleSubmitEdit(row);
    }
  };

  const handleSubmitEdit = async (rowField: ICustomerCodeUpdateDelete) => {
    setSubmitted(true);
    rowField.DeleteFlag = !rowField?.DeleteFlag;
    const config: AxiosRequestConfig = {
      method: "PUT",
      url: `/CustomerCode/UpdateCustomerCodeByIdAsync`,
      data: rowField,
    };

    await api(config)
      .then(() => {
        setSubmitted(false);
        setIsSnackbarOpen(true);
        setSnackbarSeverity("success");
        setMessage("Customer successfully updated!");
        fetchCustomerCodes(
          page,
          itemsPerPage,
          searchQuery,
          columnToSort,
          orderBy
        );
        setSearchQuery("");
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Error occurred. Please try again.");
      });
  };

  useEffect(() => {
    const insertData = async () => {
      const customerToUpdate = await customerCodes.find(
        (customer) => customer.Id === id
      );
      if (customerToUpdate !== undefined) {
        setFieldValues(customerToUpdate);
      }
    };
    insertData();
  }, [setFieldValues, id, customerCodes]);

  const handleChangeCustomerUpdate = (
    field: keyof ICustomerCodeUpdateDelete,
    value: any
  ) => {
    const selectedMerchant = merchant.find(
      (item) => item.MerchantName === value || item.MerchantCode === value
    );

    if (selectedMerchant) {
      setFieldValues((prevState) => ({
        ...prevState,
        CustomerCode: `${selectedMerchant.MerchantCode}`,
        CustomerName: selectedMerchant.MerchantName,
        CustomerNo: selectedMerchant.MerchantNo,
      }));
    }

    setFieldValues(
      (prevValues) =>
        ({
          ...prevValues,
          [field]: value,
        } as ICustomerCodeUpdateDelete)
    );
  };

  const handleChangeCustomerInsert = (
    field: keyof ICustomerCodeUpdateDelete,
    value: any
  ) => {
    const selectedMerchant = merchant.find(
      (item) => item.MerchantName === value || item.MerchantCode === value
    );

    if (selectedMerchant) {
      setFieldValues((prevState) => ({
        ...prevState,
        CustomerCode: `${selectedMerchant.MerchantCode}`,
        CustomerName: selectedMerchant.MerchantName,
        CustomerNo: selectedMerchant.MerchantNo,
      }));
    }

    setFieldValues(
      (prevValues) =>
        ({
          ...prevValues,
          [field]: value,
        } as ICustomerCodeUpdateDelete)
    );
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const config: AxiosRequestConfig = {
          method: "POST",
          url: `/Category/GetCategory`,
        };

        await api(config)
          .then(async (result) => {
            var categories = result.data as ICategory[];
            setCategory(categories);
          })
          .catch(() => {});
      } catch (error) {}
    };

    fetchCategory();
  }, []);

  const fetchMerchant = async () => {
    try {
      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/Merchant/GetMerchant`,
      };

      await api(config)
        .then(async (result) => {
          var merchants = result.data as IMerchant[];
          setMerchant(merchants);
        })
        .catch(() => {});
    } catch (error) {}
  };

  return (
    <Box
      sx={{
        marginTop: "16px",
        marginLeft: "20px",
        marginRight: "20px",
        flexGrow: 1,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "20px",
          maxWidth: "100%",
          borderRadius: "15px",
          height: "780px",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", marginBottom: "10px", color: "#1C2C5A" }}
        >
          Merchants
        </Typography>
        <Divider sx={{ marginBottom: "20px" }} />
        <Grid
          container
          spacing={1}
          sx={{ height: "60px", paddingRight: "35px" }}
        >
          <Grid item xs={12} sm={4}>
            <TextField
              placeholder="Search"
              size="small"
              fullWidth
              InputProps={{
                sx: {
                  borderRadius: "20px",
                  backgroundColor: "#EEEEEE",
                  color: "#1C2C5A",
                  "& fieldset": { border: "none" },
                  boxShadow:
                    "inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)",
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6.5} />
          <Grid item xs={12} sm={1.2}>
            <Button
              fullWidth
              onClick={() => {
                handleEditOrInsertClick(undefined);
              }}
              sx={{
                textTransform: "none",
                backgroundColor: "#4761AD",
                "&:hover": {
                  backgroundColor: "#20346E",
                  color: "#FFFFFF",
                },
                minWidth: "130px",
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: "12px",
                height: "40px",
                borderRadius: "15px",
                boxShadow: "1px 5px 4px -1px rgba(0,0,0,0.3)",
              }}
            >
              <AddIcon />
              Add Merchant
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <StyledScrollBox
          component={Paper}
          sx={{
            height: "600px",
            position: "relative",
            paddingTop: "10px",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            borderTopLeftRadius: "0",
            borderTopRightRadius: "0",
            boxShadow: "none",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Table
            sx={{
              backgroundColor: "#ffffff",
            }}
            aria-label="spanning table"
          >
            <TableHead
              sx={{
                zIndex: 3,
                position: "sticky",
                top: "-10px",
                backgroundColor: "#ffffff",
              }}
            >
              <TableRow>
                <StyledTableCellHeader sx={{ textAlign: "center" }}>
                  Code
                </StyledTableCellHeader>
                <StyledTableCellHeader sx={{ textAlign: "center" }}>
                  Merchant
                </StyledTableCellHeader>
                <StyledTableCellHeader sx={{ textAlign: "center" }}>
                  Customer Number
                </StyledTableCellHeader>
                <StyledTableCellHeader sx={{ textAlign: "center" }}>
                  Category
                </StyledTableCellHeader>
                <StyledTableCellHeader sx={{ textAlign: "center" }}>
                  Status
                </StyledTableCellHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow sx={{ "& td": { border: 0 } }}>
                  <StyledTableCellBody colSpan={12} align="center">
                    <CircularProgress size={80} />
                  </StyledTableCellBody>
                </TableRow>
              ) : customerCodes.length === 0 ? (
                <TableRow
                  sx={{
                    "& td": {
                      border: 0,
                    },
                  }}
                >
                  <StyledTableCellNoData colSpan={12} align="center">
                    No data found
                  </StyledTableCellNoData>
                </TableRow>
              ) : (
                customerCodes.map((row, index) => (
                  <TableRow key={index} sx={{ "& td": { border: 0 } }}>
                    <StyledTableCellBody sx={{ textAlign: "center" }}>
                      {row.CustomerCode}
                    </StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: "center" }}>
                      {row.CustomerName}
                    </StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: "center" }}>
                      {row.CustomerNo}
                    </StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: "center" }}>
                      {row.CategoryName}
                    </StyledTableCellBody>
                    <StyledTableCellBody sx={{ textAlign: "center" }}>
                      <StyledSelect
                        value={row.DeleteFlag ? 1 : 0} // Set the initial value based on DeleteFlag
                        onChange={() => handleEditOrInsertClick(row)}
                      >
                        <StyledMenuItem value={0}>Active</StyledMenuItem>
                        <StyledMenuItem value={1}>Inactive</StyledMenuItem>
                      </StyledSelect>
                    </StyledTableCellBody>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledScrollBox>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Pagination
            variant="outlined"
            shape="rounded"
            count={pageCount}
            page={page}
            onChange={(event, value) => {
              setPage(value);
              fetchCustomerCodes(
                value,
                itemsPerPage,
                searchQuery,
                columnToSort,
                orderBy
              );
            }}
          />
        </Box>
      </Paper>
      <StyledSnackBar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={message}
      />
      <ModalComponent
        title="Add Merchant"
        onClose={handleCloseModalInsert}
        buttonName="Save"
        open={openInsert}
        onSave={handleSubmitInsert}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid
                item
                xs={12}
                sx={{
                  fontFamily: "Inter",
                  fontWeight: "900",
                  color: "#1C2C5A",
                  fontSize: "12px",
                }}
              >
                Merchant Code *
              </Grid>
              <Grid item xs={12}>
                <Box display={"flex"}>
                  <Autocomplete
                    fullWidth
                    options={merchant}
                    getOptionLabel={(option) => `${option?.MerchantCode}`}
                    onChange={(event, value) =>
                      handleChangeCustomerUpdate(
                        "CustomerCode",
                        value?.MerchantCode
                      )
                    }
                    value={
                      merchant.find(
                        (item) =>
                          `${item.MerchantCode}` === fieldValues.CustomerCode
                      ) || null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        type="text"
                        variant="outlined"
                        sx={{
                          fontSize: "12px",
                          fontWeight: "100",
                          borderRadius: "13px",
                          backgroundColor: "#EEEEEE",
                          color: "#1C2C5A !important",
                          "& fieldset": { border: "none" },
                          boxShadow:
                            "inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)",
                          "& .MuiInputBase-root": {
                            fontSize: "12px",
                            color: "#1C2C5A",
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{
                          fontSize: "12px",
                          color: "#1C2C5A",
                          padding: "8px",
                        }}
                      >
                        {option.MerchantCode}
                      </Box>
                    )}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  fontFamily: "Inter",
                  fontWeight: "900",
                  color: "#1C2C5A",
                  fontSize: "12px",
                }}
              >
                Merchant Name *
              </Grid>
              <Grid item xs={12}>
                <Box display={"flex"}>
                  <Autocomplete
                    fullWidth
                    options={merchant}
                    getOptionLabel={(option) => option?.MerchantName}
                    onChange={(event, value) =>
                      handleChangeCustomerUpdate(
                        "CustomerName",
                        value?.MerchantName
                      )
                    }
                    value={
                      merchant.find(
                        (item) => item.MerchantName === fieldValues.CustomerName
                      ) || null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        type="text"
                        variant="outlined"
                        sx={{
                          fontSize: "12px",
                          fontWeight: "100",
                          borderRadius: "13px",
                          backgroundColor: "#EEEEEE",
                          color: "#1C2C5A !important",
                          "& fieldset": { border: "none" },
                          paddingTop: "1px",
                          boxShadow:
                            "inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)",
                          "& .MuiInputBase-root": {
                            fontSize: "12px",
                            color: "#1C2C5A",
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{
                          fontSize: "12px",
                          color: "#1C2C5A",
                          padding: "8px",
                        }}
                      >
                        {option.MerchantName}
                      </Box>
                    )}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  fontFamily: "Inter",
                  fontWeight: "900",
                  color: "#1C2C5A",
                  fontSize: "12px",
                }}
              >
                Merchant No. *
              </Grid>
              <Grid item xs={12}>
                <Box display={"flex"}>
                  <StyledTextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    required
                    value={fieldValues.CustomerNo}
                    error={submitted && !fieldValues.CustomerNo}
                    helperText={
                      submitted &&
                      !fieldValues?.CustomerNo &&
                      "Merchant No is required"
                    }
                    InputProps={{
                      sx: {
                        fontSize: "12px",
                        borderRadius: "13px",
                        backgroundColor: "#D8D8D8",
                        color: "#1C2C5A",
                        "& fieldset": { border: "none" },
                        boxShadow:
                          "inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)",
                      },
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  fontFamily: "Inter",
                  fontWeight: "900",
                  color: "#1C2C5A",
                  fontSize: "12px",
                }}
              >
                Category *
              </Grid>
              <Grid item xs={12}>
                <Box display={"flex"}>
                  <StyledTextField
                    size="small"
                    type="text"
                    fullWidth
                    variant="outlined"
                    required
                    select
                    value={fieldValues?.CategoryId}
                    onChange={(e) =>
                      handleChangeCustomerInsert(
                        "CategoryId",
                        e.target.value === "" ? "" : e.target.value
                      )
                    }
                    helperText={
                      submitted &&
                      !fieldValues?.CategoryId &&
                      "Category is required"
                    }
                    error={submitted && !fieldValues?.CategoryId}
                    InputProps={{
                      sx: {
                        fontSize: "12px",
                        borderRadius: "13px",
                        backgroundColor: "#EEEEEE",
                        color: "#1C2C5A",
                        "& fieldset": { border: "none" },
                        boxShadow:
                          "inset 1px 1px 1px -3px rgba(0,0,0,0.1), inset 1px 1px 8px 0px rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    {category.map((item: ICategory) => (
                      <MenuItem
                        sx={{ color: "#1C2C5A", fontSize: "12px" }}
                        key={item.Id}
                        value={item.Id}
                      >
                        {item.CategoryName}
                      </MenuItem>
                    ))}
                  </StyledTextField>
                </Box>
              </Grid>
            </Grid>
          </Box>
        }
      />
    </Box>
  );
};

export default Merchants;