export default interface IAccountingMatchPayment {
  MatchId?: number | null
  AnalyticsId?: number | null
  ProofListId?: number |  null
  Status?: string| null
  TransactionDate?: Date| null
  OrderNo?: string | null
  Amount?: number | null
  Location?: string | null
}