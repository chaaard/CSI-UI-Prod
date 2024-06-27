import { Box, Grid, Typography, TextField, Fade, Alert, styled, Snackbar, Backdrop, CircularProgress, TextFieldProps, MenuItem } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import ModalComponent from '../../../Components/Common/ModalComponent';
import BoxHeaderButtons from '../../../Components/Common/BoxHeaderButtons';
import IAnalytics from '../../Common/Interface/IAnalytics';
import IException from '../../Common/Interface/IException';
import axios, { AxiosRequestConfig } from 'axios';
import IAnalyticProps from '../../Common/Interface/IAnalyticsProps';
import IExceptionProps from '../../Common/Interface/IExceptionProps';
import dayjs, { Dayjs } from 'dayjs';
import IRefreshAnalytics from '../../Common/Interface/IRefreshAnalytics';
import IAdjustmentAddProps from '../../Common/Interface/IAdjustmentAddProps';
import DisputeTable from '../../../Components/Common/DisputeTable';
import DisputeAnalyticsTable from '../../../Components/Common/DisputeAnalytics';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ILocations from '../../Common/Interface/ILocations';
import IAnalyticsToAddProps from '../../_SystemAdmin/Analytics/ManualAdd/Interface/IAnalyticsToAddProps';
import IPagination from '../../Common/Interface/IPagination';
import IMerchants from '../../_SystemAdmin/Merchants/Interface/IMerchants';
import ExceptionsTable from '../../../Components/Common/ExceptionsTable';
import AdjustmentTypeModal from './../../../Components/Common/AdjustmentTypeModal';

export enum Mode {
  VIEW = 'View',
  EDIT = 'Edit',
  RESOLVE = 'Resolve'
}
const customerCodes: ICustomerCodes[] = [
  {CustomerId: "9999012042", CustomerName: "002303883010 TOBISTRO FOOD INC"},
{CustomerId: "9999011915", CustomerName: "009999999904 LAZADA E-SERVICES PHILS., INC."},
{CustomerId: "9999011914", CustomerName: "009999999905 SHOPEE PHILIPPINES, INC."},
{CustomerId: "9999011735", CustomerName: "1521 HOTEL"},
{CustomerId: "9999011620", CustomerName: "5660 TRADING"},
{CustomerId: "9999011546", CustomerName: "901000000001 BPI CREDIT CARD"},
{CustomerId: "9999011547", CustomerName: "901000000002 BPI EXPRESS"},
{CustomerId: "9999011549123123", CustomerName: "901000000004 AMERICAN EXPRESS3123"},
{CustomerId: "9999011552", CustomerName: "901000000007 BANCNET"},
{CustomerId: "9999011553", CustomerName: "901000000008 MEGALINK"},
{CustomerId: "9999011559", CustomerName: "901000000012 PUREGOLD PRICE CLUB"},
{CustomerId: "9999011774", CustomerName: "ACACIA HOTEL"},
{CustomerId: "9999012014", CustomerName: "AEMPC"},
{CustomerId: "9999012009", CustomerName: "AIRPORT HOUSE OF WINE& LIQUORS"},
{CustomerId: "9999011957", CustomerName: "AIRSWIFT TRANSPORT, INC."},
{CustomerId: "9999011797", CustomerName: "ALI COMMERCIAL CENTER, INC."},
{CustomerId: "9999011854", CustomerName: "ALTURAS SUPERMARKET CORP."},
{CustomerId: "9999011661", CustomerName: "ANCHORLAND HOLDINGS"},
{CustomerId: "9999011789", CustomerName: "ANFLO RESORT DEVT. CORP."},
{CustomerId: "9999012043", CustomerName: "ANGELES BEACH CLUB RESORT CORP"},
{CustomerId: "9999012047", CustomerName: "ANTARA CORPORATION"},
{CustomerId: "9999011996", CustomerName: "APPLEONE MACTAN INC. (SHERATON)"},
{CustomerId: "9999012017", CustomerName: "ARMY NAVY BURGER INC."},
{CustomerId: "9999012020", CustomerName: "ATENEO DE DAVAO UNIVERSITY"},
{CustomerId: "9999011773", CustomerName: "AYAGOLD RETAILERS INC."},
{CustomerId: "9999011857", CustomerName: "BAI GLOBAL PROPERTIES GROUP"},
{CustomerId: "9999011949", CustomerName: "BELL-KENZ PHARMA INC."},
{CustomerId: "9999011989", CustomerName: "BREDCO"},
{CustomerId: "9999011678", CustomerName: "CACTUS REALTY"},
{CustomerId: "9999011581", CustomerName: "Cafe Enzo"},
{CustomerId: "9999011649", CustomerName: "CAYLABNE RESORT"},
{CustomerId: "9999011650", CustomerName: "CENTRAL BLOC HOTEL VENTURES"},
{CustomerId: "9999011903", CustomerName: "CITY OF DREAMS MANILA"},
{CustomerId: "9999011950", CustomerName: "CLUB UNITED PHILS. CORP."},
{CustomerId: "9999011900", CustomerName: "CO FERDINAND VINCENT"},
{CustomerId: "9999011574", CustomerName: "Communicon Concepts Inc."},
{CustomerId: "9999012013", CustomerName: "CONTEMPORAIN FOODS INC."},
{CustomerId: "9999011944", CustomerName: "COSCO CAPITAL INC."},
{CustomerId: "9999011641", CustomerName: "CROMA MEDIC INC."},
{CustomerId: "9999011850", CustomerName: "DACAR CORP."},
{CustomerId: "9999011971", CustomerName: "DARK WING, INC."},
{CustomerId: "9999011634", CustomerName: "DUTY FREE PHILS(FTAO)"},
{CustomerId: "9999011990", CustomerName: "E WALLET"},
{CustomerId: "9999011972", CustomerName: "EAZ TRADING INC."},
{CustomerId: "9999011799", CustomerName: "EGC"},
{CustomerId: "9999012030", CustomerName: "EVANGELISTA MEDICAL CENTER"},
{CustomerId: "9999012028", CustomerName: "EXPEDITORS PHILIPPINES INC."},
{CustomerId: "9999011740", CustomerName: "FASHION RACK DESIGNER OUTLET"},
{CustomerId: "9999011967", CustomerName: "FEDERATED DISTRIBUTORS, INC."},
{CustomerId: "9999011640", CustomerName: "FIRST GLOBAL BYO"},
{CustomerId: "9999011959", CustomerName: "FOOD PANDA PHILS. (PANDAMART)"},
{CustomerId: "9999011601", CustomerName: "FOODA SAVERS MART"},
{CustomerId: "9999011647", CustomerName: "FRESH XMAS TREE"},
{CustomerId: "9999011702", CustomerName: "FUTURE TRADE INT'L INC."},
{CustomerId: "9999011707", CustomerName: "GEOROS CONSTRUCTION DEV."},
{CustomerId: "9999011644", CustomerName: "GIFT CERTIFICATE"},
{CustomerId: "9999011956", CustomerName: "GIFTAWAY, INC."},
{CustomerId: "9999011611", CustomerName: "GLENN DEFENSE MARINE"},
{CustomerId: "9999012039", CustomerName: "GO CHERRYFIC FOODS - CENTRIO"},
{CustomerId: "9999011889", CustomerName: "GO CHERRYFIC FOODS CORP. - ABREEZA"},
{CustomerId: "9999011828", CustomerName: "GO CHERRYFIC FOODS CORP. - GMALL"},
{CustomerId: "9999011925", CustomerName: "GO CHERRYFIC FOODS CORP. - LIMKETKAI"},
{CustomerId: "9999011856", CustomerName: "GO CHERRYFIC FOODS INC.-SM ECOLAND"},
{CustomerId: "9999012011", CustomerName: "HABITO, MANUEL CELESTINO III"},
{CustomerId: "9999011655", CustomerName: "HAPPY LIVING PHILS INC."},
{CustomerId: "9999011642", CustomerName: "HARVEY'S"},
{CustomerId: "9999011617", CustomerName: "HH ASTRO SALES CORPORATION"},
{CustomerId: "9999011750", CustomerName: "HIGH HAVEN"},
{CustomerId: "9999011907", CustomerName: "HIPPOCAMPUS MALAPASCUA RESORT CORP."},
{CustomerId: "9999011656", CustomerName: "INBOUND PACIFIC, INC."},
{CustomerId: "9999011698", CustomerName: "J SYSON & SONS CO. INC."},
{CustomerId: "9999011542", CustomerName: "KAREILA MANAGEMENT CORP."},
{CustomerId: "9999012012", CustomerName: "KCC MALL"},
{CustomerId: "9999012031", CustomerName: "KENKO FOOD MFG AND TRD CORP."},
{CustomerId: "9999011626", CustomerName: "KROMOPEAK INNOVATIONS INC."},
{CustomerId: "9999012040", CustomerName: "LAZADA - BAUMANN"},
{CustomerId: "9999011604", CustomerName: "LEE SUPER PLAZA"},
{CustomerId: "9999011697", CustomerName: "LG ELECTRONICS PHILS. INC."},
{CustomerId: "9999012018", CustomerName: "LG SHELL FUEL MANAGEMENT CORP."},
{CustomerId: "9999012003", CustomerName: "LILIA PINEDA"},
{CustomerId: "9999011823", CustomerName: "LIMKETKAI HOTEL & RESORT CORP."},
{CustomerId: "9999011841", CustomerName: "LUK FOO INT'L  CUISINE INC."},
{CustomerId: "9999011747", CustomerName: "LUSITANO INC"},
{CustomerId: "9999011918", CustomerName: "MACTAN TRAVEL RETAIL GROUP INC."},
{CustomerId: "9999011978", CustomerName: "MARIKINA VALLEY MEDICAL CENTER"},
{CustomerId: "9999011700", CustomerName: "MAXIM PLUS HOLDING LIMITED"},
{CustomerId: "9999011751", CustomerName: "MEGASERV MULTI PURPOSE COOP"},
{CustomerId: "9999011919", CustomerName: "MELCO RESORT (CITY OF DREAMS)"},
{CustomerId: "9999012006", CustomerName: "MICROASIA SATS FOOD INDUSTRY"},
{CustomerId: "9999011632", CustomerName: "MULTIRICH FOODS CORP."},
{CustomerId: "9999012045", CustomerName: "NARRA WELLNESS RESORT INC."},
{CustomerId: "9999011776", CustomerName: "NATHANIELS FOOD CORP."},
{CustomerId: "9999011894", CustomerName: "NORTGATE HOTEL VENTURES (SEDA HOTEL CDO)"},
{CustomerId: "9999011951", CustomerName: "ODILLON ALINGASA"},
{CustomerId: "9999011639", CustomerName: "OISHIITEI"},
{CustomerId: "9999011596", CustomerName: "OMNI ORIENT"},
{CustomerId: "9999011886", CustomerName: "ONE INCENTIVE SYSTEMS ADVOCATE"},
{CustomerId: "9999011910", CustomerName: "ONE OUTSOURCE DIRECT CORP."},
{CustomerId: "9999011710", CustomerName: "P&G Distributing (Phils.) Inc."},
{CustomerId: "9999011637", CustomerName: "PACIFIC PAINT(BOYSEN)PHILS,INC"},
{CustomerId: "9999011749", CustomerName: "PAGCOR"},
{CustomerId: "9999011983", CustomerName: "PAN DE MANILA CO. INC."},
{CustomerId: "9999011826", CustomerName: "PANAY VENTURES, INC."},
{CustomerId: "9999012015", CustomerName: "PAOLYN HOUSEBOAT CORON ISLAND"},
{CustomerId: "9999012010", CustomerName: "PAPA JS WICHES N WINGS FS."},
{CustomerId: "9999011696", CustomerName: "PERNOD RICARD PHIL INC."},
{CustomerId: "9999011792", CustomerName: "PG LAWSON COMPANY, INC."},
{CustomerId: "9999011829", CustomerName: "PHIL. SPAN ASIA CARRIER CORP."},
{CustomerId: "9999012008", CustomerName: "PHILIPPPINE AIRLINES, INC."},
{CustomerId: "9999011671", CustomerName: "PHILTOWN PROPERTIES"},
{CustomerId: "9999011579", CustomerName: "Photolab"},
{CustomerId: "9999012029", CustomerName: "PIDOKS VENTURES CORP."},
{CustomerId: "9999012024", CustomerName: "PILGRIM CAFE"},
{CustomerId: "9999011659", CustomerName: "PLATINUM FIREWORKS"},
{CustomerId: "9999011633", CustomerName: "PLATINUM MASSAGE SERVICES"},
{CustomerId: "9999011646", CustomerName: "PLAZA FAIR - DUMAGUETE"},
{CustomerId: "9999011600", CustomerName: "PLAZA FAIR CDO"},
{CustomerId: "9999011657", CustomerName: "POLAR MINES REALTY, INC."},
{CustomerId: "9999011953", CustomerName: "PPCI - WAREHOUSE 1"},
{CustomerId: "9999011595", CustomerName: "PREMIER AUTOTEC(KIA)"},
{CustomerId: "9999011877", CustomerName: "PRESTIGE HOTELS AND RESORTS INC."},
{CustomerId: "9999011663", CustomerName: "PRICE SOLUTION PHILS., INC."},
{CustomerId: "9999011753", CustomerName: "PRIME POWER MANPOWER SERVICES"},
{CustomerId: "9999011578", CustomerName: "Prince Jaipur"},
{CustomerId: "9999011638", CustomerName: "PUERTO DEL SOL"},
{CustomerId: "9999011672", CustomerName: "PUREGOLD DUTYFREE INC."},
{CustomerId: "9999011853", CustomerName: "REAL CONCEPTS MARKETING INC."},
{CustomerId: "9999011800", CustomerName: "REGENT DISTRIBUTOR PHILS., INC."},
{CustomerId: "9999011621", CustomerName: "REPUBLIC BISCUIT CORPORATION"},
{CustomerId: "9999011852", CustomerName: "RIZAL PARK HOTEL"},
{CustomerId: "9999012044", CustomerName: "ROBBY MATTA ASIA INC."},
{CustomerId: "9999011860", CustomerName: "S&R PIZZA INC."},
{CustomerId: "9999012019", CustomerName: "SAN ANTONIO MKTG. ENT. INC."},
{CustomerId: "9999012046", CustomerName: "SCANDINAVIAN DIVERS INC."},
{CustomerId: "9999011827", CustomerName: "SENTERA HOTEL VENTURES INC."},
{CustomerId: "9999011582", CustomerName: "Serendra"},
{CustomerId: "9999012032", CustomerName: "SGL MANILA PHILIPPINES"},
{CustomerId: "9999011933", CustomerName: "SHAKEYS PIZZA ASIA VENTURES INC."},
{CustomerId: "9999012041", CustomerName: "SHOPEE - BAUMANN"},
{CustomerId: "9999011945", CustomerName: "SMR CHOCOLATES STORE"},
{CustomerId: "9999011988", CustomerName: "SOLAIRE RESORT & CASINO"},
{CustomerId: "9999011794", CustomerName: "SOUTHCREST HOTEL VENTURES INC."},
{CustomerId: "9999011999", CustomerName: "SOUTHLAND COMMERCIAL COMPLEX INC."},
{CustomerId: "9999011688", CustomerName: "SPORTMART RETAIL INC."},
{CustomerId: "9999011662", CustomerName: "STAR CINEMA"},
{CustomerId: "9999011631", CustomerName: "SUNCREST FOOD INCORPORATED"},
{CustomerId: "9999011563", CustomerName: "Tatum Garment"},
{CustomerId: "9999011986", CustomerName: "TAZAMIA CORPORATION"},
{CustomerId: "9999011898", CustomerName: "TELEPHILIPPINES INC."},
{CustomerId: "9999011676", CustomerName: "TGI FRIDAY'S"},
{CustomerId: "9999011677", CustomerName: "THE BISTRO GROUP"},
{CustomerId: "9999012021", CustomerName: "THE MOJICANS RESTAURANT"},
{CustomerId: "9999012022", CustomerName: "THE REAL AMERICAN DOUGHNUT CO."},
{CustomerId: "9999012023", CustomerName: "THREE SIXTY PHARMACY"},
{CustomerId: "9999012027", CustomerName: "TIA TITA'S BULALO"},
{CustomerId: "9999011673", CustomerName: "TIARA COMMERCIAL & IND. CORP."},
{CustomerId: "9999011887", CustomerName: "TIGER RESORT LEISURE & ENTERTAINMENT INC. (OKADA MANILA)"},
{CustomerId: "9999011580", CustomerName: "Time Spectrum"},
{CustomerId: "9999011599", CustomerName: "TITANIA WINE CELLAR, INC."},
{CustomerId: "9999011968", CustomerName: "TOYOTA MOTOR PHILS. INC."},
{CustomerId: "9999012000", CustomerName: "TRAVEL FREE SHOP"},
{CustomerId: "9999011960", CustomerName: "TRAVELLERS INTL. HOTEL GROUP"},
{CustomerId: "9999012025", CustomerName: "TSURU INC."},
{CustomerId: "9999011714", CustomerName: "Tyremart Inc."},
{CustomerId: "9999011851", CustomerName: "UC1 CORPORATION"},
{CustomerId: "9999011904", CustomerName: "UNIOIL PETROLEUM PHILS., INC."},
{CustomerId: "9999011667", CustomerName: "UNION HOME APPLIANCES, INC."},
{CustomerId: "9999011571", CustomerName: "UNITED ASIA PRODUCTION FILM"},
{CustomerId: "9999012002", CustomerName: "UNIVERSAL HOTELS & RESORTS, INC."},
{CustomerId: "9999012026", CustomerName: "VIA MARE CORPORATION"},
{CustomerId: "9999011675", CustomerName: "VIEWPOINT TRADING LIMITED"},
{CustomerId: "9999011795", CustomerName: "VIOLAGO OSCAR"},
{CustomerId: "9999011565", CustomerName: "Visottica Optical Center"},
{CustomerId: "9999011593", CustomerName: "W LAND HOLDINGS"},
{CustomerId: "9999012001", CustomerName: "WALTERMART SUPERMARKET INC."},
{CustomerId: "9999011796", CustomerName: "WATCH TOWER BIBLE TRACT SOCIETY OF THE PHILS."},
{CustomerId: "9999011627", CustomerName: "WEST OZ INT'L TRADING INC"},
{CustomerId: "9999011665", CustomerName: "WILLIAMS & HUMBERT PHILS.,INC."},
{CustomerId: "9999012005", CustomerName: "ZKFX CULTURE CORPORATION"},
];
interface ICustomerCodes
{
  CustomerId: string,
  CustomerName: string,
}

// Define custom styles for white alerts
const WhiteAlert = styled(Alert)(({ severity }) => ({
  color: '#1C2C5A',
  fontFamily: 'Inter',
  fontWeight: '700',
  fontSize: '15px',
  borderRadius: '25px',
  border:  severity === 'success' ? '1px solid #4E813D' : '1px solid #9B6B6B',
  backgroundColor: severity === 'success' ? '#E7FFDF' : '#FFC0C0',
}));

const VolumeShopper = () => {
  const { REACT_APP_API_ENDPOINT } = process.env;
  const getClub = window.localStorage.getItem('club');
  const [open, setOpen] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState('Analytics');
  const [locations, setLocations] = useState<ILocations[]>([] as ILocations[]);
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<IAnalytics[]>([]);
  const [exception, setException] = useState<IException>();
  const [exceptions, setExceptions] = useState<IException[]>([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success'); // Snackbar severity
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false); // Snackbar open state
  const [message, setMessage] = useState<string>(''); // Error message
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
  const [page, setPage] = useState<number>(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState<number>(6); // Items displayed per page
  const [pageCount, setPageCount] = useState<number>(0); // Total page count
  const [columnToSort, setColumnToSort] = useState<string>(""); // Column to sort
  const [orderBy, setOrderBy] = useState<string>("asc"); // Sorting order
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentDate, setCurrentDate] = useState<Dayjs | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isModalClose, setIsModalClose] = useState<boolean>(false);
  const [successRefresh, setSuccessRefresh] = useState<boolean>(false);
  const [openRefresh, setOpenRefresh] = useState<boolean>(false);
  const [openSubmit, setOpenSubmit] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [adjustmentFields, setAdjustmentFields] = useState<IAdjustmentAddProps>({} as IAdjustmentAddProps);
  const [isSave, setIsSave] = useState<boolean>(false);
  const [isFetchException, setIsFetchException] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(true);
  const [refreshAnalyticsDto, setRefreshAnalyticsDto] = useState<IRefreshAnalytics>();
  // State to store filtered analytics data
  const [filteredAnalytics, setFilteredAnalytics] = useState<IAnalytics[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [stateAnalytics, setStateAnalytics] = useState<IAnalyticsToAddProps>({} as IAnalyticsToAddProps);
  const getId = window.localStorage.getItem('Id');
  const [customerCodesByMerch, setCustomerCodesByMerch] = useState<IMerchants[]>([]);
  const itemsPerPageByMerch = 20; 
  const [selectedRowId, setSelectedRowId] = useState<IException>({} as IException);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [customerCodesCateg, setCustomerCodesCateg] = useState<string[]>([]);
  const [isModalCloseException, setIsModalCloseException] = useState<boolean>(false);
  
  //VolumeShopper Customer Code
  const customerCode = ['9999012042','9999011915','9999011914','9999011735','9999011620','9999011537','9999011546','9999011547','9999011549123123','9999011552','9999011553','9999011559','9999011774','9999012014','9999012009','9999011957','9999011797','9999011854','9999011661','9999011789','9999012043','9999012047','9999011996','9999012017','9999012020','9999011773','9999011857','9999011949','9999011989','9999011678','9999011581','9999011649','9999011650','9999011903','9999011950','9999011900','9999011574','9999012013','9999011944','9999011641','9999011850','9999011971','9999011634','9999011990','9999011972','9999011799','9999012030','9999012028','9999011740','9999011967','9999011640','9999011959','9999011601','9999011647','9999011702','9999011707','9999011644','9999011956','9999011611','9999012039','9999011889','9999011828','9999011925','9999011856','9999012011','9999011655','9999011642','9999011617','9999011750','9999011907','9999011656','9999011698','9999011542','9999012012','9999012031','9999011626','9999012040','9999011604','9999011697','9999012018','9999012003','9999011823','9999011841','9999011747','9999011918','9999011978','9999011700','9999011751','9999011919','9999012006','9999011632','9999012045','9999011776','9999011894','9999011951','9999011639','9999011596','9999011886','9999011910','9999011710','9999011637','9999011749','9999011983','9999011826','9999012015','9999012010','9999011696','9999011792','9999011829','9999012008','9999011671','9999011579','9999012029','9999012024','9999011659','9999011633','9999011646','9999011600','9999011657','9999011953','9999011595','9999011877','9999011663','9999011753','9999011578','9999011638','9999011672','9999011853','9999011800','9999011621','9999011852','9999012044','9999011860','9999012019','9999012046','9999011827','9999011582','9999012032','9999011933','9999012041','9999011945','9999011988','9999011794','9999011999','9999011688','9999011662','9999011631','9999011563','9999011986','9999011898','9999011150','9999011676','9999011677','9999012021','9999012022','9999012023','9999012027','9999011673','9999011887','9999011580','9999011599','9999011968','9999012000','9999011960','9999012025','9999011714','9999011851','9999011904','9999011667','9999011571','9999012002','9999012026','9999011675','9999011795','9999011565','9999011593','9999012001','9999011796','9999011627','9999011665','9999012005'];
  useEffect(() => {
    document.title = 'CSI | Volume Shopper';
  }, []);

  let club = 0;
  if(getClub !== null)
  {
    club = parseInt(getClub, 10);
  }

  let Id = "";
  if(getId !== null)
  {
    Id = getId;
  }

  const formattedDateFrom = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');


  // Handle closing the snackbar
  const handleSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsSnackbarOpen(false);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleOpenRefresh = () => {
    setOpenRefresh(true);
  };

  const handleCloseRefresh = useCallback(() => {
    setOpenRefresh(false);
  }, []);
  const handleCloseException = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleOpenSubmit = () => {
    setOpenSubmit(true);
  };

  const handleCloseSubmit = () => {
    setOpenSubmit(false);
  };

  


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
        setCustomerCodesByMerch(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching item:", error);
      })
        


      } catch (error) {
      } 
  }, [REACT_APP_API_ENDPOINT]);
  
  useEffect(() => {
        console.log("setCustomerCodesByMerch",customerCodesByMerch);  
        
      const customerCodesByCateg = customerCodesByMerch.map(customer => customer.CategoryId === 11);
      console.log("customerCodesByCateg",customerCodesByCateg);

      
  },[customerCodesByMerch]);


  const fetchVolumeShopperException = useCallback(async(exceptionParam: IExceptionProps) => {
    try {
      setLoading(true);

      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Adjustment/GetAdjustmentsAsync`,
        data: exceptionParam,
      };

      const response = await axios(getAnalytics);
      const exceptions = response.data.ExceptionList;
      console.log("exceptionssadasdasd",exceptions);
      const pages = response.data.TotalPages

        setExceptions(exceptions);
        setPageCount(pages);

    } catch (error) {
      console.error("Error fetching adjustment:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);




  useEffect(() => {
    const fetchData = async () => {
      try {
      
          const formattedDate = formattedDateFrom ?? '';
          const exceptionParam: IExceptionProps = {
            PageNumber: page,
            PageSize: itemsPerPage,
            SearchQuery: searchQuery,
            ColumnToSort: columnToSort,
            OrderBy: orderBy, 
            dates: [formattedDate],
            memCode: customerCode,
            userId: Id,
            storeId: [club],
          };

          await fetchCustomerCodes(page, itemsPerPageByMerch, searchQuery, columnToSort, orderBy, true, 11, false);
          await fetchVolumeShopperException(exceptionParam);
        
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [fetchCustomerCodes, fetchVolumeShopperException, page, itemsPerPage, searchQuery, columnToSort, orderBy, selectedDate, club]);


const formatDate = (dateString:any) => {
  // Create a new Date object
  const date = new Date(dateString);

  // Extract the components of the date using local time methods
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Construct the ISO 8601 date string without milliseconds
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
  const handleSave = async () => { 

    var analyticsProp: IAnalyticProps = {
        action: "Manual Add Volume Shopper",
        remarks: "Successfully Added",
    }
    var updatedParams: IAnalyticsToAddProps = {
      CustomerId: stateAnalytics.CustomerId,
      LocationId: stateAnalytics.LocationId,
      TransactionDate: stateAnalytics.TransactionDate,
      MembershipNo: stateAnalytics.MembershipNo,
      CashierNo: stateAnalytics.CashierNo,
      RegisterNo: stateAnalytics.RegisterNo,
      TransactionNo: stateAnalytics.TransactionNo,
      OrderNo: stateAnalytics.OrderNo,
      Qty: stateAnalytics.Qty,
      Amount: stateAnalytics.Amount,
      Subtotal: stateAnalytics.Subtotal,
      UserId: stateAnalytics.UserId,
      AnalyticsParamsDto: analyticsProp 
    };
    let isMatched = false; 
    analytics.forEach((item) => {
      if(formatDate(stateAnalytics.TransactionDate) === item.TransactionDate?.toString() && item.MembershipNo === stateAnalytics.MembershipNo && item.CashierNo === stateAnalytics.CashierNo && item.RegisterNo === stateAnalytics.RegisterNo && item.TransactionNo === stateAnalytics.TransactionNo && item.OrderNo === stateAnalytics.OrderNo && item.Qty?.toString() === stateAnalytics.Qty.toString() && item.Amount?.toString() === stateAnalytics.Amount.toString() && item.SubTotal?.toString() === stateAnalytics.Subtotal.toString())
      {
        isMatched = true;        
      }
    });

  if(isMatched){
    setIsSnackbarOpen(true);
    setSnackbarSeverity('error');
    setMessage('Duplicate transaction entry.');
  }
  else
  {
    const analyticsAdd: AxiosRequestConfig = {
      method: 'POST',
      url: `${REACT_APP_API_ENDPOINT}/Analytics/CreateAnalytics`,
      data: updatedParams,
    };

    try {
      const response = await axios(analyticsAdd);
      console.log(response.data);
      handleCloseModal();
      setIsSnackbarOpen(true);
      setSnackbarSeverity('success');
      setMessage('Successfully saved the transaction.');
      //reset textbox
      setStateAnalytics({} as IAnalyticsToAddProps);
      // refersh table
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const anaylticsParam: IAnalyticProps = {
        dates: [formattedDate ?? ''],
        memCode: customerCode,
        userId: Id,
        storeId: [club],
      };      
  
      await fetchVolumeShopper(anaylticsParam);
    } catch (error) {
      console.error('Error saving data', error);
      // Handle error (e.g., show an error message)
      handleCloseModal();
      setIsSnackbarOpen(true);
      setSnackbarSeverity('error');
      setMessage('Error in saving the transaction.');
      setStateAnalytics({} as IAnalyticsToAddProps);
    }
  }
  };

  const handleCloseModal = useCallback(() => {
    setOpen(false);
  }, []);

  const fetchVolumeShopper = useCallback(async(anaylticsParam: IAnalyticProps) => {
    try {
      setLoading(true);

      const getAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/GetAnalytics`,
        data: anaylticsParam,
      };
        console.log("anaylticsParam get analytics",anaylticsParam);

      axios(getAnalytics)
      .then(async (response) => {
        setAnalytics(response.data);
        console.log("response.data get analytics",response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [REACT_APP_API_ENDPOINT]);

  
  useEffect(() => {
    console.log("isModalCloseException",isModalCloseException);
  }, [isModalCloseException]);

 useEffect(() => {
  if(modalOpen){
    console.log("selectedRowId",selectedRowId);
  }
  

  if (isModalClose || modalOpen || isModalCloseException) {
    const fetchData = async () => {
      try {
        const formattedDate = formattedDateFrom ?? '';
        const exceptionParam: IExceptionProps = {
          PageNumber: page,
          PageSize: itemsPerPage,
          SearchQuery: searchQuery,
          ColumnToSort: columnToSort,
          OrderBy: orderBy,
          dates: [formattedDate],
          memCode: customerCode,
          userId: Id,
          storeId: [club],
        };
        const anaylticsParam: IAnalyticProps = {
          dates: [formattedDate ?? ''],
          memCode: customerCode,
          userId: Id,
          storeId: [club],
        };      

        await fetchVolumeShopper(anaylticsParam);
        await fetchCustomerCodes(page, itemsPerPageByMerch, searchQuery, columnToSort, orderBy, true, 11, false);
        await fetchVolumeShopperException(exceptionParam);
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    setIsModalCloseException(false);
  }
}, [fetchVolumeShopper,fetchCustomerCodes,fetchVolumeShopperException,isModalClose,modalOpen,isModalCloseException]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(selectedDate !== null)
        {
          const formattedDate = selectedDate.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDate],
            memCode: customerCode,
            userId: Id,
            storeId: [club],
          };      
      
          await fetchVolumeShopper(anaylticsParam);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [fetchVolumeShopper, page, itemsPerPage, searchQuery, columnToSort, orderBy, selectedDate, club]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(successRefresh)
        {
          const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
          const anaylticsParam: IAnalyticProps = {
            dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
            memCode: customerCode,
            userId: Id,
            storeId: [club],
          };

          await fetchVolumeShopper(anaylticsParam);
          setSuccessRefresh(false);
        }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [fetchVolumeShopper, selectedDate, successRefresh]);

  const handleRefreshClick = () => {
    try {
      setRefreshing(true);
      setOpenRefresh(false);
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: customerCode,
        userId: Id,
        storeId: [club], 
      }

      const refreshAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/RefreshAnalytics`,
        data: updatedParam,
      };

      axios(refreshAnalytics)
      .then(async () => {
          setIsSnackbarOpen(true);
          setSnackbarSeverity('success');
          setMessage('Success');
          setSuccessRefresh(true);
          setSubmitted(true);
            const exceptionParam: IExceptionProps = {
              PageNumber: page,
              PageSize: itemsPerPage,
              SearchQuery: searchQuery,
              ColumnToSort: columnToSort,
              OrderBy: orderBy, 
              dates: [formattedDate?.toString() ? formattedDate?.toString() : ''],
              memCode: customerCode,
              userId: Id,
              storeId: [club],
            };
          await fetchVolumeShopperException(exceptionParam);
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error refreshing analytics');
        console.error("Error refreshing analytics:", error);
      })
      .finally(() => {
        setRefreshing(false); 
        setOpenRefresh(false);
        setSuccess(false);
      });
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error refreshing analytics');
        console.error("Error refreshing analytics:", error);
        setRefreshing(false);
        setOpenRefresh(false);
        setSuccess(false);
    } 
  };

  useEffect(() => {
    const defaultDate = dayjs().startOf('day').subtract(1, 'day');
    const currentDate = dayjs().startOf('day').subtract(1, 'day');;
    setSelectedDate(defaultDate);
    setCurrentDate(currentDate);
  }, []);

  const handleChangeDate = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
  };

  const handleChangeSearch = (newValue: string) => {
    ///
  };

  const handleSubmitClick = () => {
    try {
      const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
      const updatedParam: IRefreshAnalytics = {
        dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
        memCode: customerCode,
        userId: Id,
        storeId: [club], 
      }

      const submitAnalytics: AxiosRequestConfig = {
        method: 'POST',
        url: `${REACT_APP_API_ENDPOINT}/Analytics/SubmitAnalyticsWOProoflist`,
        data: updatedParam,
      };

      axios(submitAnalytics)
      .then(async (result) => {
          if(result.data === true) 
          {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('success');
            setMessage('Analytics Successfully Submitted');
            setOpenSubmit(false);
            setSubmitted(true);
          }
          else
          {
            setIsSnackbarOpen(true);
            setSnackbarSeverity('error');
            setMessage('Error submitting analytics. Please try again!');
            setOpenSubmit(false);
            setSubmitted(true);
          }
      })
      .catch((error) => {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error submitting analytics');
      })
    } catch (error) {
        setIsSnackbarOpen(true);
        setSnackbarSeverity('error');
        setMessage('Error submitting analytics');
    } 
  };

  useEffect(() => {
    const IsSubmittedGenerated = async () => {
      try {
          if(selectedDate)
          {
            const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
            const updatedParam: IRefreshAnalytics = {
              dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
              memCode: customerCode,
              userId: Id,
              storeId: [club], 
            }
        
            const submitgenerate: AxiosRequestConfig = {
              method: 'POST',
              url: `${REACT_APP_API_ENDPOINT}/Analytics/IsSubmittedGenerated`,
              data: updatedParam,
            };
  
            await axios(submitgenerate)
            .then((result => {
              setIsSubmitted(result.data.IsSubmitted);
              setIsGenerated(result.data.IsGenerated);
              setSubmitted(false);
            }))
          }
      } catch (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      }
    };

    IsSubmittedGenerated();
  }, [REACT_APP_API_ENDPOINT, selectedDate, successRefresh, submitted]);

  useEffect(() => {
    const formattedDate = selectedDate?.format('YYYY-MM-DD HH:mm:ss.SSS');
    setRefreshAnalyticsDto({
      dates: [formattedDate ? formattedDate : '', formattedDate ? formattedDate : ''],
      memCode: customerCode,
      userId: Id,
      storeId: [club], 
    })
  }, [club, selectedDate])

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

  const matchedLocation = locations.find(location => location.LocationCode === club);
  const clubCodeName = matchedLocation?.LocationCode + ' - ' + matchedLocation?.LocationName;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      setStateAnalytics({
      ...stateAnalytics,
      [name]: value,
      UserId: Id,
      TransactionDate: formattedDateFrom ?? '',
      LocationId: club
    });
    
  };



  
  return (
    <Box
      sx={{
        marginTop: '16px',
        marginLeft: '16px',
        flexGrow: 1,
      }}
    >
      <Grid container spacing={1} alignItems="flex-start" direction={'row'}>
        <Grid item sx={{ width: '100%', marginBottom: '-17px' }}>
          <BoxHeaderButtons isSubmitted={isSubmitted} isGenerated={isGenerated} handleOpenSubmit={handleOpenSubmit} handleChangeSearch={handleChangeSearch} handleOpenModal={handleOpenModal} handleOpenRefresh={handleOpenRefresh} customerName='MetroMart' handleChangeDate={handleChangeDate} selectedDate={selectedDate} analytics={analytics} setFilteredAnalytics={setFilteredAnalytics} setIsTyping={setIsTyping}/>  
        </Grid>
        <Grid item xs={12}
          sx={{
              paddingTop: '10px',
              paddingRight: '20px',
              transition: 'left 0.3s ease',
          }}>
            <Box sx={{
              boxShadow: 'inset 6px 9px 8px -1px rgba(0,0,0,0.3), inset -6px 0px 8px -1px rgba(0,0,0,0.3)',
              backgroundColor: '#F2F2F2',
              paddingTop: '10px',
              borderRadius: '20px',
            }}>
              <Grid container spacing={2} sx={{paddingTop: '4px'}}>
                <Grid item>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingBottom: '10px',
                      backgroundColor: 'white',
                      marginLeft: '15px',
                      paddingLeft: '-1px',
                      marginRight: '-140px',
                      borderTopRightRadius: '20px',
                      borderTopLeftRadius: '20px',
                      paddingTop: '5px',
                      justifyContent: 'center', 
                      alignItems: 'center',
                      boxShadow: '1px 9px 8px -1px rgba(0,0,0,0.3), 1px 0px 8px -1px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontWeight: '900',
                        color: '#1C3766',
                        fontSize: 14,
                      }}
                    >
                      Volume Shopper
                    </Typography>
                    
                    <Box
                      sx={{
                        border: '2px solid #1C3766',
                        backgroundColor: '#1C3766',
                        height: '3px',
                        width: '40px',
                        borderRadius: '25px',
                      }}
                    >
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box 
                sx={{ 
                  position: 'relative', 
                  backgroundColor: 'white', 
                  boxShadow: '-7px 0px 8px -4px rgba(0,0,0,0.1),7px 0px 8px -4px rgba(0,0,0,0.1),0px 7px 8px -4px rgba(0,0,0,0.1)', 
                  textAlign: 'center',
                  borderBottomLeftRadius: '20px',
                  borderBottomRightRadius: '20px',
                  paddingTop:'20px',
                  paddingBottom:'20px',
                  marginBottom: '20px'
                }}
                >
                <div className="fade">
                  {activeButton === 'Analytics' && (
                    <Fade  in={true} timeout={500}>
                      <Box>
                        <DisputeAnalyticsTable 
                          filteredAnalytics={isTyping ? filteredAnalytics : analytics}
                          loading={loading}
                          setModalOpen={setModalOpen}
                          setSelectedRowId={setSelectedRowId}
                        />
                      </Box>
                    </Fade>
                  )}
                </div>
                <Box sx={{mx:'20px'}}>
                  <ExceptionsTable 
                    exceptions={exceptions} 
                    isSubmitted={isSubmitted} 
                    setIsModalClose={setIsModalCloseException}
                    refreshAnalyticsDto={refreshAnalyticsDto}
                    merchant={'VolumeShopper'}
                  />
                </Box>
              </Box>
            </Box>
            <Backdrop
              sx={{ color: '#ffffff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={refreshing}
            >
              <CircularProgress size="100px" sx={{ color: '#ffffff' }} />
            </Backdrop>
          </Grid>
          <Snackbar
            open={isSnackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            TransitionComponent={Fade} 
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <WhiteAlert  variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {message}
            </WhiteAlert>
          </Snackbar>
      </Grid>
        <ModalComponent
          title='Add Partner Transaction'
          onClose={handleCloseModal}
          buttonName='Save'
          open={open}
          onSave={handleSave}
          children={
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} sx={{marginBottom: 3, paddingRight: '2px'}}>
                <Grid item xs={12} sx={{marginLeft: '10px', marginTop: 1}}>      
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Customer Name"
                    name="CustomerId"
                    required
                    select
                    value={stateAnalytics.CustomerId}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                    {customerCodes.map((item: ICustomerCodes, index: number) => (
                      <MenuItem key={`${item.CustomerId}-${index}`} value={item.CustomerId}>
                        {item.CustomerName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Location Name"
                    value={clubCodeName}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },readOnly: true
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      inputFormat="dddd, MMMM DD, YYYY"
                      label="Transaction Date" 
                      value={selectedDate}
                      onChange={handleChangeDate}
                      renderInput={(params: TextFieldProps) => (
                        <TextField
                          fullWidth
                          size="small"
                          {...params}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderRadius: '40px',
                              },
                            },
                            '& .MuiOutlinedInput-input': {
                              color: '#1C2C5A',
                              fontFamily: 'Inter',
                              fontWeight: 'bold',
                              fontSize: '14px',
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Membership No"
                    required
                    name='MembershipNo'
                    value={stateAnalytics.MembershipNo}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Cashier No"
                    required
                    name='CashierNo'
                    value={stateAnalytics.CashierNo}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Register No"
                    required
                    name='RegisterNo'
                    value={stateAnalytics.RegisterNo}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Transaction No"
                    required
                    name='TransactionNo'
                    value={stateAnalytics.TransactionNo}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="text"
                    label="Order No"
                    required
                    name='OrderNo'
                    value={stateAnalytics.OrderNo}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3.5} sx={{marginLeft: '10px'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="number"
                    label="Qty"
                    required
                    name='Qty'
                    value={stateAnalytics.Qty}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4} sx={{marginLeft: '6px', paddingLeft: '5px!important'}}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    type="number"
                    label="Amount"
                    required
                    name='Amount'
                    value={stateAnalytics.Amount}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4} sx={{marginLeft: '6px', paddingLeft: '5px!important'}}>
                  <TextField


                    fullWidth
                    variant="outlined"
                    size="small"
                    type="number"
                    label="SubTotal"
                    required
                    name='Subtotal'
                    value={stateAnalytics.Subtotal}
                    onChange={handleChange}
                    InputProps={{
                      sx: {
                        borderRadius: '40px',
                        height: '40px',
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        color: '#1C2C5A',
                      },
                    }}
                  >
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          } 
        />
        <ModalComponent
          title='Refresh Analytics'
          onClose={handleCloseRefresh}
          buttonName='Refresh'
          open={openRefresh}
          onSave={handleRefreshClick}
          children={
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={8}
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: '900',
                    color: '#1C2C5A',
                    fontSize: '20px',
                  }}>
                  <Typography sx={{ fontSize: '25px', textAlign: 'center', marginRight: '-170px' }}>
                    Any modifications made will be deleted!
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          } 
        />
        <ModalComponent
          title='Submit Analytics'
          onClose={handleCloseSubmit}
          buttonName='Submit'
          open={openSubmit}
          onSave={handleSubmitClick}
          children={
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={8}
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: '900',
                    color: '#1C2C5A',
                    fontSize: '20px',
                  }}>
                  <Typography sx={{ fontSize: '25px', textAlign: 'center', marginRight: '-170px' }}>
                    Are you sure you want to submit?
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          } 
        />
        <AdjustmentTypeModal open={modalOpen} onClose={handleCloseException} exception={selectedRowId} setIsModalClose={setIsModalClose} mode={Mode.RESOLVE} refreshAnalyticsDto={refreshAnalyticsDto} merchant={'VolumeShopper'}/>
    </Box>
  )
}

export default VolumeShopper
