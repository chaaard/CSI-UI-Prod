export default interface IAccountingMatchPayment {
  MatchId?: number | null
  AnalyticsId?: number | null
  ProofListId?: number |  null
  Status?: string| null
  TransactionDate?: Date| null
  OrderNo?: string | null
  AnalyticsAmount?: number | null
  ProofListAmount?: number | null
  Variance?: number | null
  Location?: string | null
}