import { createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom';
import RootLayout from '../Layout/RootLayout';
import GrabMart from '../Pages/_Treasury/GrabMart/GrabMart';
import CustomerCode from '../Pages/_SystemAdmin/Merchants/Merchants';
import Club from '../Pages/_SystemAdmin/Stores/Stores';
import GrabFood from '../Pages/_Treasury/GrabFood/GrabFood';
import FoodPanda from '../Pages/_Treasury/FoodPanda/FoodPanda';
import PickARooFS from '../Pages/_Treasury/PickARooFS/PickARooFS';
import MetroMart from '../Pages/_Treasury/MetroMart/MetroMart';
import Maintenance from '../Pages/_Error/Maintenance';
import PickARooMerchMerch from '../Pages/_Treasury/PickARooMerch/PickARooMerch';
import TabPage from '../Pages/_SystemAdmin/Analytics/AnalyticsTabPages';
import AcctGrabMart from '../Pages/_Accounting/GrabMart/GrabMart';
import AcctFoodPanda from '../Pages/_Accounting/FoodPanda/FoodPanda';
import AcctPickARooMerch from '../Pages/_Accounting/PickARooMerch/PickARooMerch';
import AcctPickARooFS from '../Pages/_Accounting/PickARooFS/PickARooFS';
import AcctMetroMart from '../Pages/_Accounting/MetroMart/MetroMart';
import AcctGrabFood from '../Pages/_Accounting/GrabFood/GrabFood';
import UploadProoflist from '../Components/Common/UploadProoflist';
import ExceptionsReport from '../Pages/Reports/ExceptionReport/ExceptionsReport';
import WeeklyDeliveryReport from '../Pages/Reports/WeeklyDeliveryReport/WeeklyDeliveryReport';
import DashboardAccounting from '../Pages/DashboardAccounting/DashboardAccounting';
import Dashboard from '../Pages/DashboardTreasury/Dashboard';
import GeneratedInvoiceReport from '../Pages/Reports/GeneratedInvoiceReport/GeneratedInvoiceReport';
import AccountingGenerateInvoice from '../Components/Common/AccountingGenerateInvoice';
import Shopee from '../Pages/_Treasury/Shopee/Shopee';
import Lazada from '../Pages/_Treasury/Lazada/Lazada';
import Users from '../Pages/_SystemAdmin/Users/Users';
import WalkIn from '../Pages/_Treasury/WalkIn/WalkIn';
import Employee from '../Pages/_Treasury/Employee/Employee';
import VolumeShopper from '../Pages/_Treasury/VolumeShopper/VolumeShopper';
import BankPromos from '../Pages/_Treasury/BankPromos/BankPromos';
import GCash from '../Pages/_Treasury/GCash/GCash';
import Logs from '../Pages/_SystemAdmin/Logs/Logs';
import Others from '../Pages/_Treasury/Others/Others';
import UnionBankInvoiceReport from '../Pages/Reports/UnionBankInvoiceReport/UnionBankInvoiceReport';
import WalkInInvoiceReport from '../Pages/Reports/WalkInInvoiceReport/WalkInInvoiceReport';
import UBPizzaVoucher from '../Pages/_Treasury/UBPizzaVoucher/UBPizzaVoucher';
import UBRebateIssuance from '../Pages/_Treasury/UBRebateIssuance/UBRebateIssuance';
import UBPVIssuance from '../Pages/_Treasury/UBPVIssuance/UBPVIssuance';
import UBRenewal from '../Pages/_Treasury/UBRenewal/UBRenewal';
import UnionBankVoucherReport from '../Pages/Reports/UBVoucherReport/UBVoucherReport';
import UnionBankRenewalReport from '../Pages/Reports/UBRenewalReport/UBRenewalReport';
import PaymentReconReport from '../Pages/Reports/PaymentReconReport/PaymentReconReport';
import BalancesDetailsReport from '../Pages/Reports/BalancesDetailsReport/BalancesDetailsReport';

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
      <Route path='treasury/csi/lazada' element={<Maintenance />}></Route>
      <Route path='treasury/csi/shopee' element={<Maintenance />}></Route>
      <Route path='treasury/csi/walkin' element = {< WalkIn />}> </Route>
      <Route path='treasury/csi/employee' element = {< Employee />}> </Route>
      <Route path='treasury/csi/volumeshopper' element = {< VolumeShopper />}> </Route>
      <Route path='treasury/csi/bankpromos' element = {< BankPromos />}> </Route>
      <Route path='treasury/csi/gcash' element = {< GCash />}> </Route>
      <Route path='treasury/csi/others' element = {< Others />}> </Route>
      <Route path='treasury/csi/ubpizzavoucher' element = {< UBPizzaVoucher />}> </Route>
      <Route path='treasury/csi/ubrebateissuance' element = {< UBRebateIssuance />}> </Route>
      <Route path='treasury/csi/ubpvissuance' element = {< UBPVIssuance />}> </Route>
      <Route path='treasury/csi/ubrenewal' element = {< UBRenewal />}> </Route>
      {/* Reports */}
      <Route path='reports/weekly-delivery-report' element={<WeeklyDeliveryReport  />}></Route>
      <Route path='reports/sales-summ-report' element={<Maintenance />}></Route>
      <Route path='reports/exception-report' element={<ExceptionsReport />}></Route>
      <Route path='reports/generated-invoice-report' element={<GeneratedInvoiceReport />}></Route>
      <Route path='reports/unionbank-invoice-report' element={<UnionBankInvoiceReport />}></Route>
      <Route path='reports/walkin-invoice-report' element={<WalkInInvoiceReport />}></Route>
      <Route path='reports/unionbank-voucher-report' element={<UnionBankVoucherReport />}></Route>
      <Route path='reports/unionbank-renewal-report' element={<UnionBankRenewalReport />}></Route>
      <Route path='reports/payment-recon-report' element={<PaymentReconReport />}></Route>
      <Route path='reports/balances-details-report' element={<BalancesDetailsReport />}></Route>
      {/* Maintenance */}
      <Route path='system-admin/customer-code' element={<CustomerCode />}></Route>
      <Route path='system-admin/user' element={<Users />}></Route>
      <Route path='system-admin/club' element={<Club />}></Route>
      <Route path='system-admin/logs' element={<Logs />}></Route>
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