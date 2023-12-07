export default interface IMatch {
  AnalyticsId: number
  AnalyticsPartner: string | null
  AnalyticsLocation: string | null
  AnalyticsTransactionDate?: Date  | null
  AnalyticsOrderNo?: string  | null
  AnalyticsAmount?: number | null
  ProofListId?: number
  ProofListTransactionDate?: Date  | null
  ProofListOrderNo?: string  | null
  ProofListAmount?: number  | null
  Variance?: number | null
}