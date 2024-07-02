export default interface IAccountingMatch {
  MatchId?: number
  AnalyticsId?: number
  AnalyticsInvoiceNo?: string | null
  AnalyticsPartner?: string | null
  AnalyticsLocation?: string | null
  AnalyticsTransactionDate?: Date  | null
  AnalyticsOrderNo?: string  | null
  AnalyticsAmount?: number | null
  ProofListId?: number
  ProofListPartner?: string | null
  ProofListAmount?: number  | null
  ProofListOrderNo?: string  | null
  ProofListTransactionDate?: Date | null
  ProofListLocation?: string | null
  ProofListAgencyFee?: number | null
  Status?: string  | null
  Variance?: number | null
}