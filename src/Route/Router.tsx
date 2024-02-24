import { createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom';
import RootLayout from '../Layout/RootLayout';
import Dashboard from '../Pages/Dashboard/Dashboard';
import GrabMart from '../Pages/GrabMart/GrabMart';
import CustomerCode from '../Pages/CustomerCode/CustomerCode';
import GrabFood from '../Pages/GrabFood/GrabFood';
import FoodPanda from '../Pages/FoodPanda/FoodPanda';
import PickARooFS from '../Pages/PickARooFS/PickARooFS';
import MetroMart from '../Pages/MetroMart/MetroMart';
import Maintenance from '../Pages/Common/Page/Error/Maintenance';
import PickARooMerchMerch from '../Pages/PickARooMerch/PickARooMerch';
import WeeklyDelivery from '../Pages/Reports/WeeklyDelivery/WeeklyDelivery';
import GeneratedInvoice from '../Pages/Reports/GeneratedInvoice/GeneratedInvoice';
import Analytics from '../Pages/Analytics/Analytics';
import TabPage from '../Components/Common/Tabs';

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route path='/' element={<Dashboard />}></Route>
      <Route path='dashboardaccounting' element={<Maintenance />}></Route>
      <Route path='dashboardsystemadmin' element={<Maintenance />}></Route>
      <Route path='maintenance' element={<Maintenance />}></Route>
      <Route path='grabmart' element={<GrabMart />}></Route>
      <Route path='grabfood' element={<GrabFood />}></Route>
      <Route path='foodpanda' element={<FoodPanda />}></Route>
      <Route path='pickaroomerch' element={<PickARooMerchMerch />}></Route>
      <Route path='pickaroofs' element={<PickARooFS />}></Route>
      {/* <Route path='agilemerch' element={<AgileMerchandise />}></Route> */}
      <Route path='metromart' element={<MetroMart />}></Route>
      <Route path='gcash' element={<Maintenance />}></Route>
      <Route path='lazada' element={<Maintenance />}></Route>
      <Route path='shopee' element={<Maintenance />}></Route>
      <Route path='walkin' element={<Maintenance />}></Route>
      <Route path='employee' element={<Maintenance />}></Route>
      <Route path='volumeshopper' element={<Maintenance />}></Route>
      <Route path='bankpromos' element={<Maintenance />}></Route>
      {/* Reports */}
      <Route path='weeklydeliveryreport' element={<WeeklyDelivery  />}></Route>
      <Route path='salessummreport' element={<Maintenance />}></Route>
      <Route path='exceptionreport' element={<Maintenance />}></Route>
      <Route path='generatedinvoicereport' element={<GeneratedInvoice />}></Route>
      {/* Maintenance */}
      <Route path='customercode' element={<CustomerCode />}></Route>
      <Route path='user' element={<Maintenance />}></Route>
      <Route path='analytics' element={<TabPage />}></Route>
    </Route>
  )
)

export default Router;