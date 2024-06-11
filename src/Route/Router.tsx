import { createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom';
import RootLayout from '../Layout/RootLayout';
import GrabMart from '../Pages/Treasury/GrabMart/GrabMart';
import GrabFood from '../Pages/Treasury/GrabFood/GrabFood';
import FoodPanda from '../Pages/Treasury/FoodPanda/FoodPanda';
import PickARooFS from '../Pages/Treasury/PickARooFS/PickARooFS';
import MetroMart from '../Pages/Treasury/MetroMart/MetroMart';
import Maintenance from '../Pages/Common/Page/Error/Maintenance';
import PickARooMerchMerch from '../Pages/Treasury/PickARooMerch/PickARooMerch';
import DashboardUsers from '../Pages/DashboardUsers/DashboardUsers';
import TabPage from '../Components/Common/Tabs';
import AcctGrabMart from '../Pages/Accounting/GrabMart/GrabMart';
import AcctFoodPanda from '../Pages/Accounting/FoodPanda/FoodPanda';
import AcctPickARooMerch from '../Pages/Accounting/PickARooMerch/PickARooMerch';
import AcctPickARooFS from '../Pages/Accounting/PickARooFS/PickARooFS';
import AcctMetroMart from '../Pages/Accounting/MetroMart/MetroMart';
import AcctGrabFood from '../Pages/Accounting/GrabFood/GrabFood';
import UploadProoflist from '../Components/Common/UploadProoflist';
import Exceptions from '../Pages/Reports/Exception/Exceptions';
import WeeklyDelivery from '../Pages/Reports/WeeklyDelivery/WeeklyDelivery';
import DashboardAccounting from '../Pages/DashboardAccounting/DashboardAccounting';
import Dashboard from './../Pages/Dashboard/Dashboard';
import GeneratedInvoice from '../Pages/Reports/GeneratedInvoice/GeneratedInvoice';
import CustomerCode from '../Pages/CustomerCode/CustomerCode';
import AccountingGenerateInvoice from '../Components/Common/AccountingGenerateInvoice';
import Shopee from '../Pages/Treasury/Shopee/Shopee';
import Lazada from '../Pages/Treasury/Lazada/Lazada';

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route path='treasury/dashboard-treasury' element={<Dashboard />}></Route>
      <Route path='accounting/dashboard-accounting' element={<DashboardAccounting />}></Route>
      <Route path='system-admin/dashboard-system-admin' element={<Maintenance />}></Route>
      <Route path='maintenance' element={<Maintenance />}></Route>
      <Route path='treasury/csi/grabmart' element={<GrabMart />}></Route>
      <Route path='treasury/csi/grabfood' element={<GrabFood />}></Route>
      <Route path='treasury/csi/foodpanda' element={<FoodPanda />}></Route>
      <Route path='treasury/csi/pickaroomerch' element={<PickARooMerchMerch />}></Route>
      <Route path='treasury/csi/pickaroofs' element={<PickARooFS />}></Route>
      <Route path='treasury/csi/metromart' element={<MetroMart />}></Route>
      <Route path='treasury/csi/gcash' element={<Maintenance />}></Route>
      <Route path='treasury/csi/lazada' element={<Maintenance />}></Route>
      <Route path='treasury/csi/shopee' element={<Maintenance />}></Route>
      {/* Reports */}
      <Route path='reports/weekly-delivery-report' element={<WeeklyDelivery  />}></Route>
      <Route path='reports/sales-summ-report' element={<Maintenance />}></Route>
      <Route path='reports/exception-report' element={<Exceptions />}></Route>
      <Route path='reports/generated-invoice-report' element={<GeneratedInvoice />}></Route>
      {/* Maintenance */}
      <Route path='system-admin/customer-code' element={<CustomerCode />}></Route>
      <Route path='system-admin/user' element={<DashboardUsers />}></Route>
      <Route path='system-admin/analytics' element={<TabPage />}></Route>
      {/* Accounting */}
      <Route path='accounting/generate-invoice' element={<AccountingGenerateInvoice />}></Route>
      <Route path='accounting/upload-prooflist' element={<UploadProoflist />}></Route>
      <Route path='accounting/payment-recon/grabmart' element={<AcctGrabMart />}></Route>
      <Route path='accounting/payment-recon/grabfood' element={<AcctGrabFood />}></Route>
      <Route path='accounting/payment-recon/foodpanda' element={<AcctFoodPanda />}></Route>
      <Route path='accounting/payment-recon/pickaroomerch' element={<AcctPickARooMerch />}></Route>
      <Route path='accounting/payment-recon/pickaroofs' element={<AcctPickARooFS />}></Route>
      <Route path='accounting/payment-recon/metromart' element={<AcctMetroMart />}></Route>
      <Route path='accounting/payment-recon/gcash' element={<Maintenance />}></Route>
      <Route path='accounting/payment-recon/lazada' element={<Maintenance />}></Route>
      <Route path='accounting/payment-recon/shopee' element={<Maintenance />}></Route>
    </Route>
  )
)

export default Router;