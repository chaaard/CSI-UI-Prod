import { createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom';
import RootLayout from '../Layout/RootLayout';
import GrabMart from '../Pages/Treasury/GrabMart/GrabMart';
import CustomerCode from '../Pages/SystemAdmin/Merchants/Merchants';
import Club from '../Pages/SystemAdmin/Stores/Stores';
import GrabFood from '../Pages/Treasury/GrabFood/GrabFood';
import FoodPanda from '../Pages/Treasury/FoodPanda/FoodPanda';
import PandaMerchant from '../Pages/Treasury/PandaMerchant/PandaMerchant';
import PickARooFS from '../Pages/Treasury/PickARooFS/PickARooFS';
import MetroMart from '../Pages/Treasury/MetroMart/MetroMart';
import Maintenance from '../Pages/_Error/Maintenance';
import PickARooMerchMerch from '../Pages/Treasury/PickARooMerch/PickARooMerch';
import TabPage from '../Pages/SystemAdmin/Analytics/AnalyticsTabPages';
import AcctGrabMart from '../Pages/Accounting/GrabMart/GrabMart';
import AcctFoodPanda from '../Pages/Accounting/FoodPanda/FoodPanda';
import AcctPickARooMerch from '../Pages/Accounting/PickARooMerch/PickARooMerch';
import AcctPickARooFS from '../Pages/Accounting/PickARooFS/PickARooFS';
import AcctMetroMart from '../Pages/Accounting/MetroMart/MetroMart';
import AcctGrabFood from '../Pages/Accounting/GrabFood/GrabFood';
import UploadProoflist from '../Components/Common/UploadProoflist';
import ExceptionsReport from '../Pages/Reports/ExceptionReport/ExceptionsReport';
import WeeklyDeliveryReport from '../Pages/Reports/WeeklyDeliveryReport/WeeklyDeliveryReport';
import DashboardAccounting from '../Pages/DashboardAccounting/DashboardAccounting';
import Dashboard from '../Pages/DashboardTreasury/Dashboard';
import GeneratedInvoiceReport from '../Pages/Reports/GeneratedInvoiceReport/GeneratedInvoiceReport';
import AccountingGenerateInvoice from '../Components/Common/AccountingGenerateInvoice';
import Shopee from '../Pages/Treasury/Shopee/Shopee';
import Lazada from '../Pages/Treasury/Lazada/Lazada';
import Users from '../Pages/SystemAdmin/Users/Users';
import WalkIn from '../Pages/Treasury/WalkIn/WalkIn';
import Employee from '../Pages/Treasury/Employee/Employee';
import VolumeShopper from '../Pages/Treasury/VolumeShopper/VolumeShopper';
import BankPromos from '../Pages/Treasury/BankPromos/BankPromos';
import GCash from '../Pages/Treasury/GCash/GCash';
import Logs from '../Pages/SystemAdmin/Logs/Logs';
import Others from '../Pages/Treasury/Others/Others';
import WalkInInvoiceReport from '../Pages/Reports/WalkInInvoiceReport/WalkInInvoiceReport';
import UBPizzaVoucher from '../Pages/Treasury/UBPizzaVoucher/UBPizzaVoucher';
import UBRebateIssuance from '../Pages/Treasury/UBRebateIssuance/UBRebateIssuance';
import UBPVIssuance from '../Pages/Treasury/UBPVIssuance/UBPVIssuance';
import UBRenewal from '../Pages/Treasury/UBRenewal/UBRenewal';
import UnionBankVoucherReport from '../Pages/Reports/UBVoucherReport/UBVoucherReport';
import UnionBankRenewalReport from '../Pages/Reports/UBRenewalReport/UBRenewalReport';
import PaymentReconReport from '../Pages/Reports/PaymentReconReport/PaymentReconReport';
import BalancesDetailsReport from '../Pages/Reports/BalancesDetailsReport/BalancesDetailsReport';
import UnionBankInvoiceReport from '../Pages/Reports/UnionBankInvoiceReport/UnionBankInvoiceReport';// Assuming you have a Login component
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from '../Pages/_Error/Unauthorized';
import ServerDown from '../Pages/_Error/ServerDown';
import FloatingCSI from '../Pages/Treasury/FloatingCSI/FloatingCSI';
import AcctPandaMerchant from '../Pages/Accounting/PandaMerchant/PandaMerchant';
import CreditMemoInvoice from '../Pages/CreditMemo/CreditMemoInvoice';
import Transactions from '../Pages/CreditMemo/Transactions';

const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout roles={[1,2,4]} />}>
      <Route element={<ProtectedRoute roles={[2]} />}>
        <Route path='treasury/dashboard-treasury' element={<Dashboard />} />
        <Route path='treasury/csi/grabmart' element={<GrabMart />} />
        <Route path='treasury/csi/grabfood' element={<GrabFood />} />
        <Route path='treasury/csi/foodpanda' element={<FoodPanda />} />
        <Route path='treasury/csi/pandamerchant' element={<Maintenance />} />
        <Route path='treasury/csi/pickaroomerch' element={<PickARooMerchMerch />} />
        <Route path='treasury/csi/pickaroofs' element={<PickARooFS />} />
        <Route path='treasury/csi/metromart' element={<MetroMart />} />
        <Route path='treasury/csi/lazada' element={<Maintenance />} />
        <Route path='treasury/csi/shopee' element={<Maintenance />} />
        <Route path='treasury/csi/walkin' element={<WalkIn />} />
        <Route path='treasury/csi/employee' element={<Employee />} />
        <Route path='treasury/csi/volumeshopper' element={<VolumeShopper />} />
        <Route path='treasury/csi/bankpromos' element={<BankPromos />} />
        <Route path='treasury/csi/gcash' element={<GCash />} />
        <Route path='treasury/csi/others' element={<Others />} />
        <Route path='treasury/csi/ubpizzavoucher' element={<UBPizzaVoucher />} />
        <Route path='treasury/csi/ubrebateissuance' element={<UBRebateIssuance />} />
        <Route path='treasury/csi/ubpvissuance' element={<UBPVIssuance />} />
        <Route path='treasury/csi/ubrenewal' element={<UBRenewal />} />
        <Route path='treasury/csi/floatcsi' element={<FloatingCSI />} />
        <Route path='treasury/csi/transactions' element={<Transactions />} />
      </Route>

      <Route element={<ProtectedRoute roles={[2]} />}>
        <Route path='accounting/dashboard-accounting' element={<DashboardAccounting />} />
        <Route path='accounting/generate-invoice' element={<AccountingGenerateInvoice />} />
        <Route path='accounting/upload-prooflist' element={<UploadProoflist />} />
        <Route path='accounting/payment-recon/grabmart' element={<AcctGrabMart />} />
        <Route path='accounting/payment-recon/grabfood' element={<AcctGrabFood />} />
        <Route path='accounting/payment-recon/foodpanda' element={<AcctFoodPanda />} />
        <Route path='accounting/payment-recon/pandamerchant' element={<Maintenance />} />
        <Route path='accounting/payment-recon/pickaroomerch' element={<AcctPickARooMerch />} />
        <Route path='accounting/payment-recon/pickaroofs' element={<AcctPickARooFS />} />
        <Route path='accounting/payment-recon/metromart' element={<AcctMetroMart />} />
        <Route path='accounting/payment-recon/gcash' element={<Maintenance />} />
        <Route path='accounting/payment-recon/lazada' element={<Maintenance />} />
        <Route path='accounting/payment-recon/shopee' element={<Maintenance />} />
        <Route path='accounting/payment-recon/others' element={<Maintenance />} />
        <Route path='reports/payment-recon-report' element={<PaymentReconReport />} />
        <Route path='reports/balances-details-report' element={<BalancesDetailsReport />} />
      </Route>

      <Route element={<ProtectedRoute roles={[4]} />}>
        <Route path='system-admin/dashboard-system-admin' element={<Maintenance />} />
        <Route path='system-admin/customer-code' element={<CustomerCode />} />
        <Route path='system-admin/user' element={<Users />} />
        <Route path='system-admin/club' element={<Club />} />
        <Route path='system-admin/logs' element={<Logs />} />
        <Route path='system-admin/analytics' element={<TabPage />} />
      </Route>
      
      <Route element={<ProtectedRoute roles={[1,2,4]} />}>
        <Route path='maintenance' element={<Maintenance />} />
        <Route path='unauthorized' element={<Unauthorized />} />
        <Route path='serverdown' element={<ServerDown />} />
        <Route path='reports/weekly-delivery-report' element={<WeeklyDeliveryReport />} />
        <Route path='reports/exception-report' element={<ExceptionsReport />} />
        <Route path='reports/generated-invoice-report' element={<GeneratedInvoiceReport />} />
        <Route path='reports/unionbank-invoice-report' element={<UnionBankInvoiceReport />} />
        <Route path='reports/walkin-invoice-report' element={<WalkInInvoiceReport />} />
        <Route path='reports/unionbank-voucher-report' element={<UnionBankVoucherReport />} />
        <Route path='reports/unionbank-renewal-report' element={<UnionBankRenewalReport />} />
        <Route path='reports/creditmemo-invoice-report' element={<CreditMemoInvoice />} />
      </Route>
    </Route>
  )
);

export default Router;
