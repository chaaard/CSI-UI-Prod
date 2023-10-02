import {
  Box,
  CardMedia,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import snrLogo from '../Assets/snrLogo.png'
import { useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SpeedIcon from '@mui/icons-material/Speed';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MapIcon from '@mui/icons-material/Map';
import PushPinIcon from '@mui/icons-material/PushPin';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import GroupIcon from '@mui/icons-material/Group';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import WorkIcon from '@mui/icons-material/Work';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import LayersIcon from '@mui/icons-material/Layers';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import { useLocation } from 'react-router-dom';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import BuildIcon from '@mui/icons-material/Build';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

export interface INavLink {
  icon: JSX.Element;
  label: string;
  href: string;
}

const CustomScrollbarBox = styled(Box)`
    overflow-y: auto;
    height: calc(100vh - 160px);

    /* Custom Scrollbar Styles */
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #2B4B81;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  `;

const RoundedListItemButton = styled(ListItemButton)`
  border-radius: 10px; /* Adjust the radius value as needed */
  `;

interface SideNavProps {
  open: boolean;
  onClick: () => void;
  handleTitle: (value: string) => void;
}

const navLinks: INavLink[] = [
  { icon: <DashboardIcon />, label: 'Dashboard', href: '/' },
];


const SideNav = ({ open, onClick, handleTitle }: SideNavProps) => {
  const location = useLocation();

  const [maintenanceDropdownValue, setMaintenanceDropdownValue] = useState(false);
  const [transactionsDropdownValue, setTransactionsDropdownValue] = useState(false);
  const [activityLogsValue, setActivityLogsValue] = useState(false);

  const maintenanceDropdown = () => {
    setMaintenanceDropdownValue((prevValue) => !prevValue);
    console.log("maintenanceDropdownValue", maintenanceDropdownValue)
  }
  const transactionDropdown = () => {
    setTransactionsDropdownValue((prevValue) => !prevValue);
    console.log("transactionDropdownValue", transactionsDropdownValue)
  }
  const activityLogs = () => {
    setTransactionsDropdownValue((prevValue) => !prevValue);
    console.log("activityLogsValue", activityLogsValue)
  }
  const handleTitleChange = (value: string) => {
    handleTitle(value)
  }

  console.log('Current Location:', location.pathname);

  const drawerWidth = open ? 275 : 100;
  return (
    <>
      <Drawer
        anchor="left"
        open={true}
        variant='persistent'
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            transition: 'width 0.3s ease',
            backgroundColor: "#1c3766",
            overflowX: 'hidden',
            border: 'none',
            boxShadow: '4px 0px 10px rgba(0, 0, 0, 0.2)',
          },
        }}
      >

      </Drawer>
    </>
  );
};

export default SideNav;