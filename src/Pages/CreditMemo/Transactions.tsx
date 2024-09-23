import { Backdrop, Box, CircularProgress, Grid,Icon,InputBase,Paper, Table, TableCell, TableHead, TableRow, TextField, TextFieldProps, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from '@mui/icons-material/Search';
import SyncIcon from '@mui/icons-material/Sync';
import StyledScrollBox from "../../Components/ReusableComponents/ScrollBarComponents/StyledScrollBar";
import StyledTableCellHeader from "../../Components/ReusableComponents/TableComponents/StyledTableCellHeader";
import { useEffect, useState, useCallback } from "react";
import StyledButton from "../../Components/ReusableComponents/ButtonComponents/StyledButton";
import StyledTableCellNoData from "../../Components/ReusableComponents/TableComponents/StyledTableCellNoData";
import StyledTableCellBody from "../../Components/ReusableComponents/TableComponents/StyledTableCellBody";
import { IVarianceParams } from "../_Interface/IVarianceMMS";
import { AxiosRequestConfig } from "axios";
import api from "../../Config/AxiosConfig";
import dayjs, { Dayjs } from "dayjs";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { ICustomerTransaction } from "../_Interface/ICustomerTransaction";
import { ICreditMemoDto, ICreditMemoTran } from "../_Interface/ICreditMemoTran";
import StyledActionButton from "../../Components/ReusableComponents/ButtonComponents/StyledActionButton";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import StyledSnackBar from "../../Components/ReusableComponents/NotificationComponents/StyledAlert";
import ModalComponent from "../../Components/Common/ModalComponent";
import { StatusEnum } from "../../Enums/StatusEnums";
import CustomerDropdown2 from "../../Components/Common/CustomerDropdown2";
import CustomDatePicker from "../../Components/Common/CommonDatePicker";


const Transactions:React.FC = () => {
  const { REACT_APP_INVOICE } = process.env;
  const getId = window.localStorage.getItem("Id");
  const getUsername = window.localStorage.getItem("userName");
  const getClub = window.localStorage.getItem("club");
  //Hooks Start
  const [message, setMessage] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Dayjs|null>(null);
  // const [selectedTranDate, setSelectedTranDate] = useState<Dayjs|null>(null);
  // const [disableOrigTranDate, setDisablOrigTranDate] = useState<boolean>(true);
  const [variance, setVariance] = useState<ICreditMemoTran>({} as ICreditMemoTran);
  const [loading, setLoading] = useState<boolean>(false);
  const [editedJobOrderNo, setEditJobOrderNo] = useState("");
  const [editRowIdChild, setEditRowIdChild] = useState<string | null>(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState< "error" | "warning" | "info" | "success">("success");
  const [openSubmit, setOpenSubmit] = useState<boolean>(false);
  const [selectedEdit, setSelectedEdit] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>('');
  const [customer, setCustomer] = useState<string>("");
  const [setId, setIdToUpdate] = useState<number>(0);
  const [setSeq, setSeqToUpdate] = useState<number>(0); 
  const [jobOrderNo, setOrderNo] = useState<string>(""); 
  const [isSubmitDisable, setSubmitDisable] = useState<boolean>(false);
  const [isReloadDisable, setReloadDisable] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [setTranDate, setTranDateToUpdate] = useState<number>(0);
  const [setOrigTranDate, setOrigTranDateToUpdate] = useState<Dayjs | null>(null); 
  const [setRegNo, setRegNoToUpdate] = useState<string>(""); 
  const [setTranNo, setTranNoToUpdate] = useState<string>("");
  const [openRefresh, setOpenRefresh] = useState<boolean>(false);
  const [setCustomerTransaction, setCustomertransaction] = useState<ICustomerTransaction>();
  //Hooks End 

  const formattedDate = selectedDate?.format("YYMMDD");
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const custCodesIgnore = [ {customerCode: "9999011914"},{customerCode: "9999012041"},{customerCode: "9999011915"},{customerCode: "9999012040"}];

  let club = 0;
  if (getClub !== null) {
    club = parseInt(getClub, 10);
  }

  let Id = "";
  if (getId !== null) {
    Id = getId;
  }
  let username = ""
  if(getUsername != null){
    username = getUsername;
  }

  useEffect(() => {
    const defaultDate = dayjs().startOf("day").subtract(1, "day");
    setSelectedDate(defaultDate);
    setSelectedEdit("");
  }, []);

  useEffect(() => { //Initialization
    if(formattedDate){
      getCmVarianceMMS();
      variance.CMTranList?.some((x) => x.Status == StatusEnum.Exception)
    }

  },[formattedDate])

  useEffect(()=>{
    if(searchQuery){
      getCmVarianceMMS();
      variance.CMTranList?.some((x) => x.Status == StatusEnum.Exception)
    }else{
      getCmVarianceMMS();
      variance.CMTranList?.some((x) => x.Status == StatusEnum.Exception)
    }
  },[searchQuery])

  /** Services */
  const getCmVarianceMMS = async () => {
    setRefreshing(true);
    var req: IVarianceParams = {
      currentDate: formattedDate ? formattedDate:"" ,
      store: club,
      searchQuery: searchQuery
    };

    const config: AxiosRequestConfig = {
      method: "POST",
      url: `/CreditMemo/GetCMVariance`,
      data: req,
    };

    setVariance({} as ICreditMemoTran);
    await api(config)
      .then((response) => {
        if (response != null) {
          setVariance(response.data);
          let data = response.data as ICreditMemoTran;
          if(data.CMTranList?.length != 0){
            let val: any;
            if(data.CMTranList?.every((x) => x.Status == StatusEnum.Pending) && variance.Variance?.Variance == 0){
              val = false;
              setSubmitDisable(false); 
            }
            if(data.CMTranList?.every((x)=> x.Status == StatusEnum.Submitted) || data.CMTranList?.some((x)=>x.Status == StatusEnum.Exception)){
              val = true;
              setSubmitDisable(true); 
            }
            if(data.CMTranList?.every((x)=> x.Status == StatusEnum.Submitted)){
              setReloadDisable(true);
            }
          }else{
            // setSelectedTranDate(null)
            setReloadDisable(false);
            setSubmitDisable(true);
          }
        } else {
          setMessage("Error: Empty response or unexpected format.");
        }
      })
      .catch((error) => {
        setMessage("Error occurred.");
        throw error;
      }).finally(() => {
        setRefreshing(false);
      });
  };

  const retrieveUpdateCreditMemoData = async () => {
    try{
      setRefreshing(true);
      setOpenRefresh(false);
      var req: IVarianceParams = {
        currentDate: formattedDate ? formattedDate:"" ,
        store: club
      };
  
      const config: AxiosRequestConfig = {
        method: "POST",
        url: `/CreditMemo/RetrieveUpdateCreditMemoData`,
        data: req,
      };
  
      setVariance({} as ICreditMemoTran);
      await api(config)
        .then((response) => {
          if (response != null) {
            setVariance(response.data);
            setRefreshing(false);
          } else {
            setRefreshing(false);
            setMessage("Error: Empty response or unexpected format.");
          }
        })
        .catch((error) => {
          setRefreshing(false);
          setMessage("Error occurred.");
          throw error;
        });
    }
    catch(error){
      setRefreshing(false);
    }
    
  };

  const onSaveData = async () => {
    try {
      const currentDate = new Date();
      var update: ICustomerTransaction = {
        Id: setId,
        CustomerCode: customer,
        JobOrderNo: jobOrderNo,
        ModifiedDate: currentDate,
        ModifiedBy: getUsername,
        Club: club,
        Seq: setSeq,
        TransactionDate: setTranDate,
        RegisterNo: setRegNo,
        TransactionNo: setTranNo,
        TranDate: null
      };
      const config: AxiosRequestConfig = {
        method: "PUT",
        url: `/CreditMemo/UpdateCustCreditMemo`,
        data: update,
      };
      onValidate(update.CustomerCode,jobOrderNo,config,setOrigTranDate);
      getCmVarianceMMS();
    }
    catch(error){
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error saving Customer / Order No");
      setOpenSubmit(false);
      setEditRowIdChild(null);
    }
  }

  const submitBtnClicked = async () => {
      setLoading(true);
      const update: ICreditMemoDto ={
        Id: Id,
        CMTranList: variance.CMTranList?.filter(x => x.Status == StatusEnum.Pending),
        SelectedDate: selectedDate?.format("YYYY-MM-DD HH:mm:ss.SSS"),
        Club: club,
        FilePath: REACT_APP_INVOICE
      }
      const config: AxiosRequestConfig = {
        method: "PUT",
        url: `/CreditMemo/UpdateCreditMemoStatus`,
        data: update,
      }
      await api(config).then((response) =>{
        if (response) {
          setMessage("Success");
          setReloadDisable(true);
          setLoading(false);
          getCmVarianceMMS();
        }else{
          setMessage("Failed");
          setLoading(false);
          getCmVarianceMMS();
        }
      }).catch((error) => {
        setSnackbarSeverity("error");
        setMessage("Error occurred.");
        setLoading(false);
        getCmVarianceMMS();
        throw error;
      })
  }
  /** End Services */

  /** Functions */
  const getChangeDate = (newValue: Dayjs | null) =>{
    setSelectedDate(newValue);
  }
  const onEdit = (customer: string, jobOrderNo: string,id:string,custCode: string,) => {
    setEditRowIdChild(id);
    setEditJobOrderNo(jobOrderNo);
    setSelectedEdit(custCode);
    setSelectedCustomerName("");
    // setSelectedTranDate(tranDate)
    setSelectedCustomerName(customer);
    // disableRowDatePicker(custCode);
  }

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleOpenSubmit = (id: number, customer: string, jobOrderNo: string,seq:number,tranDate:number,regNo:string,tranNo:string) => {
    if (jobOrderNo === '' && customer === "") {
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Please select Customer Name and input Job Order No.");
      return;
    }
    setOpenSubmit(true);
    setIdToUpdate(id);
    setCustomer(customer);
    setOrderNo(jobOrderNo);
    setSeqToUpdate(seq);
    setTranDateToUpdate(tranDate);
    // setOrigTranDateToUpdate(origTranDate);
    setRegNoToUpdate(regNo);
    setTranNoToUpdate(tranNo);
  };
  const handleCloseSubmit = () => {
    setOpenSubmit(false);
    // setDisablOrigTranDate(false);
  }
  const handleCancelEdit = () => {
    setEditRowIdChild(null);
    // setDisablOrigTranDate(true);
  };

  const changeBgStatusColor = (status?: number) => {
    let color = "";
    switch(status){
      case 1:
        color = '#940002';
        break;
      case 2:
        color = '#2B890F';
        break;
      default:
        color = '#BC4800';
        break;
    }
    return color;
  }
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    console.log(searchQuery);
    setSearchQuery(query);
    // getCmVarianceMMS();
  };
  const disableEditBtnRow = (status?: number) =>{
    let disable = false;
    switch(status){
      case 1:
        disable = false;
        break;
      case 2:
        disable = true;
        break;
      default:
        disable = false;
    }
    return disable
  }
  const handleCloseRefresh = useCallback(() => {
    setOpenRefresh(false);
  }, []);

  // const disableRowDatePicker = (cust?: string) => {
  //   let isExist = custCodesIgnore.find(x => x.customerCode == cust)
  //   if(isExist){
  //     setDisablOrigTranDate(false);
  //   }
  //   if(cust == ""){
  //     setDisablOrigTranDate(false);
  //   }
  // }
  /** End Functions */


  /** Validation */
  const onValidate = async (customer:string,joNo: string,config:AxiosRequestConfig,origTranDate: Dayjs | null) =>{
    let joNoString = joNo
    let date = new Date()
    // let year = new Date().getFullYear();
    let currentMonth = date.getMonth();
    // let prevDay = format(subDays(new Date(), 1),"dd");
    let monthIdx = months[currentMonth];
    if(customer == ""){
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Customer Code field is empty.");  
      return;
    }
    if(joNo == ""){
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Job Order No. field is empty.");  
      return;
    }
    let res = custCodesIgnore.find(x => x.customerCode === customer)
    if(res == undefined){
      if(joNo.length > 7 || joNo.length < 7){
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Invalid Job Order No Format");  
        return;
      }
  
      if(joNoString.substring(0,3) != monthIdx){
        console.log(joNoString.substring(0,3));
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Invalid Month");
        return;
      }
    }
    //else{
      // try{
      //   const chkOrigTranDate = await api(config);
      //   if(chkOrigTranDate.data){
      //     setCustomertransaction(chkOrigTranDate.data as ICustomerTransaction);
      //   }
      //   else{
      //     setIsSnackbarOpen(true);
      //     setSnackbarSeverity("error");
      //     setMessage("Job Order No does not exists.");
      //     setOpenSubmit(false);
      //     getCmVarianceMMS();
      //   }
      // }
      // catch(error){
      //   setIsSnackbarOpen(true);
      //   setSnackbarSeverity("error");
      //   setMessage("Error occured while checking the JO No. validity.");
      //   setOpenSubmit(false);
      //   setEditRowIdChild(null);
      // }
    //}

    try{
      const result = await api(config);
      if(result.data){
        setIsSnackbarOpen(true);
        setSnackbarSeverity("success");
        setMessage("Successfully saved!");
        setOpenSubmit(false);
        setEditRowIdChild(null);
        getCmVarianceMMS();
      }
      else{
        setIsSnackbarOpen(true);
        setSnackbarSeverity("error");
        setMessage("Error saving Customer / Order No");
        setOpenSubmit(false);
        getCmVarianceMMS();
      }
    }
    catch(error){
      setIsSnackbarOpen(true);
      setSnackbarSeverity("error");
      setMessage("Error saving Customer / Order No");
      setOpenSubmit(false);
      setEditRowIdChild(null);
    }
  }
  /** End Validation */
  
  return (
    <Box sx={{ marginTop: "10px", paddingLeft: "15px", flexGrow: 1 }}>
      <Grid container>
        <Grid xs={12} sm={12} md={12} lg={5} sx={{ paddingRight: "15px", paddingTop: "10px" }}>
          <Grid container alignItems="center" sx={{ border: "1px solid #1C2C5A",borderRadius: "15px",paddingTop: "5px",paddingBottom: "5px",}}>
            <Grid item xs><Typography variant="h6" sx={{ color: "#1C2C5A", marginLeft: "6px", paddingLeft: "1px" }}>MMS</Typography></Grid>
              <Grid item xs dir="rtl"><Typography variant="h6" sx={{ color: "#1C2C5A", marginLeft: "6px", paddingRight: "15px" }}>
                { variance && variance.Variance?.MMS !== undefined && variance.Variance?.MMS !== null ? variance.Variance?.MMS.toLocaleString("en-US", 
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }): "0.00"
                }
                </Typography>
              </Grid>
          </Grid>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={2} sx={{ paddingRight: "15px", paddingTop: "10px" }}>
          <Grid container alignItems="center" sx={{ border: "1px solid #FB9E9E", borderRadius: "15px", paddingTop: "5px", paddingBottom: "5px", backgroundColor: "#FB9E9E" }}>
            <Grid item xs>
              <Typography variant="h6" align="center" sx={{ color: "#1C2C5A", marginLeft: "6px", paddingLeft: "1px"}}>
                { variance && variance.Variance?.Variance !== undefined && variance.Variance?.Variance !== null ? variance.Variance?.Variance.toLocaleString("en-US", 
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }): "0.00"
                }
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12} sm={12} md={12} lg={5} sx={{ paddingRight: "15px", paddingTop: "10px" }}>
          <Grid container alignItems="center" sx={{ border: "1px solid #1C2C5A",borderRadius: "15px",paddingTop: "5px",paddingBottom: "5px"}}>
            <Grid item xs><Typography variant="h6" sx={{ color: "#1C2C5A", marginLeft: "6px", paddingLeft: "1px" }}>CREDIT MEMO</Typography></Grid>
              <Grid item xs dir="rtl"><Typography variant="h6" sx={{ color: "#1C2C5A", marginLeft: "6px", paddingRight: "15px" }}>
                { variance && variance.Variance?.CSI !== undefined && variance.Variance?.CSI !== null ? variance.Variance?.CSI.toLocaleString("en-US", 
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }): "0.00"
                }
                </Typography>
              </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sx={{ width: "100%", marginBottom: "-3px", marginTop: "16px"}}>
        <Grid item xs={6} lg={4} md={6}>
          <Grid container spacing={1} alignItems="flex-start" direction={"row"}>
              <Grid item>
              <Paper component="form" sx={{ p: "2px 4px", height: "32px",display: "flex",alignItems: "center",width: 250,
                boxShadow:"inset 1px 1px 1px -1px rgba(0,0,0,0.3), inset 1px 0px 8px -1px rgba(0,0,0,0.3)",borderRadius: "20px",
                backgroundColor: "#F2F2F2",marginBottom: "20px"}}
              >
                <InputBase sx={{ ml: 1, flex: 1, color: "#1C3766", fontSize: 14 }} placeholder="Search" inputProps={{ 
                  "aria-label": "Search", value: searchQuery,onChange: handleSearchInputChange}}/>
                <Icon sx={{ p: "10px", color: "#1C3766" }} aria-label="search">
                  <SearchIcon />
                </Icon>
              </Paper>
            </Grid>
            <Grid item>
            <LocalizationProvider dateAdapter={AdapterDayjs}><DesktopDatePicker inputFormat="dddd, MMMM DD, YYYY" value={selectedDate} onChange={getChangeDate} 
              disableMaskedInput renderInput={(params: TextFieldProps) => (<TextField size="small" {...params} sx={{"& .MuiOutlinedInput-root": {"& fieldset": {
                borderRadius: "40px",},},"& .MuiOutlinedInput-input": { color: "#1C2C5A", fontFamily: "Inter", fontWeight: "bold", fontSize: "14px", width: "225px",},}}/>)}/>
            </LocalizationProvider>
            </Grid>
            <Grid item container spacing={0} justifyContent="flex-end" md>
            <StyledButton sx={{color:"white",backgroundColor: "#1C3766",width: "170px",borderRadius: "20px",fontFamily: "Inter",fontWeight: "900",
              height: "38px",paddingRight: "15px",borderColor: "#1C3766","& .MuiTypography-root": {fontSize: "14px"}}}
              onClick={retrieveUpdateCreditMemoData}
              disabled={isReloadDisable}
            >
              <SyncIcon sx={{ marginRight: "5px" }} /><Typography>Reload</Typography>
            </StyledButton>
            </Grid>
            <Grid item>
            <StyledButton sx={{color:"white",backgroundColor: "#1C3766",width: "170px",borderRadius: "20px",fontFamily: "Inter",fontWeight: "900",
              height: "38px",paddingRight: "15px",borderColor: "#1C3766","& .MuiTypography-root": {fontSize: "14px"}}}
              onClick={submitBtnClicked}
              disabled= {isSubmitDisable}>
              <SyncIcon sx={{ marginRight: "5px" }} /><Typography>Submit</Typography>
            </StyledButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid item></Grid> */}
      <Box sx={{ position: "relative",backgroundColor: "white",boxShadow: "0px 0px 17px -1px rgba(0,0,0,0.3)",textAlign: "center",borderRadius: "20px"}}>
        <Box style={{ position: "relative" }}>
          <StyledScrollBox component={Paper} sx={{height:"755px",position:"relative", paddingTop:"10px",borderRadius:'20px',boxShadow:"none",paddingLeft:"20px",paddingRight:"20px", backgroundColor:"#ffffff"}}>
            <Table sx={{ minWidth: 700,"& th": { borderBottom: "2px solid #D9D9D9",},borderCollapse: "separate",borderSpacing: "0px 4px",position: "relative",backgroundColor: "#ffffff"}}aria-label="spanning table">
              <TableHead sx={{zIndex: 3,position: "sticky",top: "-10px",backgroundColor: "#ffffff"}}>
                <TableRow>
                  <StyledTableCellHeader>#</StyledTableCellHeader>
                  <StyledTableCellHeader>Customer Name</StyledTableCellHeader>
                  <StyledTableCellHeader>Date</StyledTableCellHeader>
                  <StyledTableCellHeader>Membership No.</StyledTableCellHeader>
                  <StyledTableCellHeader>Cashier No.</StyledTableCellHeader>
                  <StyledTableCellHeader>Register No.</StyledTableCellHeader>
                  <StyledTableCellHeader>Transaction No.</StyledTableCellHeader>
                  <StyledTableCellHeader>Job Order No.</StyledTableCellHeader>
                  {/* <StyledTableCellHeader>Orig. Transaction Date.</StyledTableCellHeader> */}
                  <StyledTableCellHeader>Amount</StyledTableCellHeader>
                  <StyledTableCellHeader>Status</StyledTableCellHeader>
                </TableRow>
              </TableHead>
              {
                loading ? (
                  <TableRow sx={{ "& td": { border: 0 }}}>
                    <TableCell colSpan={12} align="center"><CircularProgress size={80} /></TableCell>
                  </TableRow>) : 
                variance?.CMTranList?.length === 0 ? (
                  <TableRow sx={{ "& td": {border: 0}}}>
                    <StyledTableCellNoData colSpan={13} align="center">No data found</StyledTableCellNoData>
                  </TableRow>):(
                variance?.CMTranList?.map((row,index)=> {
                  const isEditing = editRowIdChild === row.Id.toString();
                  return(
                    <TableRow key={row.Id} sx={{ "& td": { border: 0 },"&:hover": { backgroundColor: "#ECEFF1"}}}>
                      <StyledTableCellBody> {index + 1}</StyledTableCellBody>
                      <StyledTableCellBody>{ editRowIdChild === row.Id.toString() ? (
                        <CustomerDropdown2
                          setSelected={setSelectedEdit}
                          setSelectedCustomerName={setSelectedCustomerName}
                          selection="single"
                          byMerchant={true}
                          isAllVisible={false}
                          isTextSearch={true}
                          isLabel={false}
                          width="200px"
                          fontSize="12px"
                          height="35px"
                        />) : (row.CustomerName)}
                      </StyledTableCellBody>
                      <StyledTableCellBody>
                        {row.TransactionDate != null ? selectedDate?.format("MMM DD, YYYY"): ""}
                      </StyledTableCellBody>
                      <StyledTableCellBody> {row.MembershipNo}</StyledTableCellBody>
                      <StyledTableCellBody> {row.CashierNo}</StyledTableCellBody>
                      <StyledTableCellBody> {row.RegisterNo}</StyledTableCellBody>
                      <StyledTableCellBody> {row.TransactionNo}</StyledTableCellBody>
                      <StyledTableCellBody>{ editRowIdChild === row.Id.toString() ? (
                        <TextField fullWidth
                          value={editedJobOrderNo} 
                          onChange= {(e) => setEditJobOrderNo(e.target.value) } 
                          variant="outlined"
                          sx={{ "& .MuiOutlinedInput-root": { "& fieldset": { borderRadius: "40px"}},"& .MuiOutlinedInput-input": 
                            {
                              color: "#1C2C5A",
                              fontFamily: "Inter",
                              fontWeight: "bold",
                              fontSize: "14px",
                              padding: "4.5px 14px",
                              width: '200px'
                            },
                          }}
                        />) : (row.JobOrderNo)}
                      </StyledTableCellBody>
                      {/* <StyledTableCellBody>
                        {
                          editRowIdChild === row.Id.toString() ? (
                          <CustomDatePicker selectedDate={selectedTranDate} 
                            setSelected={setSelectedTranDate} disable={disableOrigTranDate}/>):
                            (row.TranDate != null ? new Date(row.TranDate.toString()).toLocaleDateString(
                              "en-CA",
                              {
                                year: "numeric",
                                month: "short", // or 'long' for full month name
                                day: "numeric",
                              }
                            ): null)
                        }
                      </StyledTableCellBody> */}
                      <StyledTableCellBody> {row.Amount}</StyledTableCellBody>
                      <StyledTableCellBody sx= {{borderRadius: "6px" ,backgroundColor: changeBgStatusColor(row.Status),color: "#FFFFFF"}}> {row.Status == 0 ? "Pending": row.Status == 1 ? "Exception":"Submitted"}</StyledTableCellBody>

                      {/** Editing */}
                      <StyledTableCellBody>
                            {isEditing ? (
                              <Box display="flex" justifyContent="center" alignItems="center">
                                <StyledActionButton onClick={() => handleOpenSubmit(row.Id, selectedEdit,editedJobOrderNo,row?.Seq,row.TransactionDate,row.RegisterNo,row.TransactionNo)} style={{ color: "#1C3766" }}>
                                  <CheckIcon />
                                </StyledActionButton>
                                <StyledActionButton
                                  onClick={handleCancelEdit} 
                                  style={{ color: "#1C3766" }}>
                                  <ClearIcon />
                                </StyledActionButton>
                              </Box>) : (
                              <StyledActionButton disabled = {disableEditBtnRow(row.Status)} onClick={() => onEdit(row.CustomerName || "",row.JobOrderNo || "",row.Id.toString(),row.CustomerCode)} >
                                <EditIcon />
                              </StyledActionButton>
                            )}
                          </StyledTableCellBody>
                    </TableRow>
                  )
                }))
              }
            </Table>
          </StyledScrollBox>
        </Box>
      </Box>
      <Backdrop sx={{color: "#ffffff",zIndex: (theme) => theme.zIndex.drawer + 1}}open={refreshing}>
        <CircularProgress size="100px" sx={{ color: "#ffffff" }} />
      </Backdrop>
      <StyledSnackBar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        message={message}
      />
      <ModalComponent         
        title="Confirmation"
        onClose={handleCloseSubmit}
        buttonName="Save"
        open={openSubmit}
        onSave={onSaveData}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ color: "#1C2C5A",fontSize: "20px",flexDirection: "column",justifyContent: "center", textAlign: "center"}}>
              <Typography variant="body1">Please confirm the following details before proceeding. Do you want to save these details?</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
                <Box sx={{ textAlign: 'left', paddingRight: '10px' }}>
                  <Typography variant="body1">
                    <strong>Customer:</strong>
                  </Typography>
                  <Typography variant="body1">
                    <strong>Order No:</strong>
                  </Typography>
                  {/* <Typography variant="body1">
                    <strong>Orig. Transaction Date</strong>
                  </Typography> */}
                </Box>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="body1">
                    {selectedCustomerName || 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    {editedJobOrderNo || 'N/A'}
                  </Typography>
                  {/* <Typography variant="body1">
                    {selectedTranDate?.format("MMM DD, YYYY") || 'N/A'}
                  </Typography> */}
                </Box>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ color: "#DA0707", fontWeight: "900", paddingTop: '20px' }}>Note: These changes will apply also to MMS</Typography>
          </Box>
        }/>
        
      <ModalComponent
        title="Reload Floating CSI"
        onClose={handleCloseRefresh}
        buttonName="Reload"
        open={openRefresh}
        onSave={retrieveUpdateCreditMemoData}
        children={
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1}>
              <Grid item xs={8} sx={{ fontFamily: "Inter", fontWeight: "900", color: "#1C2C5A", fontSize: "20px", }}>
                <Typography sx={{ fontSize: "25px", textAlign: "center", marginRight: "-170px", }}>
                  Any modifications made will be deleted!
                </Typography>
              </Grid>
            </Grid>
          </Box>
        }/>
    </Box>
  );
};

export default Transactions;
