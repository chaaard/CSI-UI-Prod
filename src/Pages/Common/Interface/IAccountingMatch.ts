export default interface IAccountingMatch {
  AnalyticsId: number
  AnalyticsInvoiceNo: string | null
  AnalyticsPartner: string | null
  AnalyticsLocation: string | null
  AnalyticsTransactionDate?: Date  | null
  AnalyticsOrderNo?: string  | null
  AnalyticsAmount?: number | null
  ProofListId?: number
  ProofListNo: string | null
  ProofListTransactionDate?: Date  | null
  ProofListOrderNo?: string  | null
  ProofListAmount?: number  | null
  ProofListAgencyFee?: number  | null
  Status?: string  | null
  Variance?: number | null
}