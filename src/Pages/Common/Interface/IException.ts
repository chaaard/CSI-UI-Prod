export default interface IException {
  Id: number
  CustomerId?: string  | null
  JoNumber?: string  | null
  TransactionDate?: Date 
  Amount?: number  | null
  AdjustmentType?: string  | null
  Status?: string  | null
  AdjustmentId: number
  LocationName: string | null
  AnalyticsId: number | null
  ProofListId: number |  null
  OldJo: string
  OldCustomerId: string
  DisputeReferenceNumber: string
  DisputeAmount: number
  DateDisputeFiled: Date
  DescriptionOfDispute: string
  AccountsPaymentDate: Date
  AccountsPaymentTransNo: string
  AccountsPaymentAmount: number
  ReasonId: number
}
