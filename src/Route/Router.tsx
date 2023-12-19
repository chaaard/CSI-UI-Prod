import {
    createBrowserRouter,
    Route,
    createRoutesFromElements
} from 'react-router-dom';
import RootLayout from '../Layout/RootLayout';
import Dashboard from '../Pages/Dashboard/Dashboard';
import GrabMart from '../Pages/GrabMart/GrabMart';
import CustomerCode from '../Pages/CustomerCode/CustomerCode';
import GrabFood from '../Pages/GrabFood/GrabFood';
import FoodPanda from '../Pages/FoodPanda/FoodPanda';
import AgileFS from '../Pages/AgileFS/AgileFS';
import AgileMerchandise from '../Pages/AgileMerchandise/AgileMerchandise';
import MetroMart from '../Pages/MetroMart/MetroMart';
import Maintenance from '../Pages/Common/Page/Error/Maintenance';
import BankPromos from '../Pages/BankPromos/BankPromos';
import VolumeShopper from '../Pages/VolumeShopper/VolumeShopper';
import Employee from '../Pages/Employee/Employee';
import WalkIn from '../Pages/WalkIn/WalkIn';
import SalesSummary from '../Pages/Reports/SalesSummary/SalesSummary';
import Exceptions from '../Pages/Reports/Exception/Exceptions';
import PickARoo from '../Pages/PickARoo/PickARoo';

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route index element={<Dashboard />}></Route>
      <Route path='grabmart' element={<GrabMart />}></Route>
      <Route path='grabfood' element={<GrabFood />}></Route>
      <Route path='foodpanda' element={<FoodPanda />}></Route>
      <Route path='pickaroo' element={<PickARoo />}></Route>
      {/* <Route path='agilefs' element={<AgileFS />}></Route> */}
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
        <Route path='salessummreport' element={<SalesSummary />}></Route>
        <Route path='exceptionreport' element={<Exceptions />}></Route>
      {/* Maintenance */}
      <Route path='customercode' element={<CustomerCode />}></Route>
      <Route path='user' element={<Maintenance />}></Route>
    </Route>
  )
)

export default Router;