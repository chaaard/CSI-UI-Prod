export default interface IAccountingBalancesDetails {
  MatchId?: number
  OracleInvNo?: string | null
  InvoiceDate?: Date  | null
  OrderNumber?: string | null
  TrxNo?: string | null
  RegNo?: string | null
  LocationCode?: number | null
  OutletName?: string | null
  GROSSPERSNR?: number | null
  GROSSPERMERCHANT?: number  | null
  ACCOUNTSPAYMENT?: number  | null
  CHARGEABLE?: number  | null
  Status?: string  | null
}