export default interface IExceptionGenerateReport {
  Id: number
  CustomerId?: string  | null
  JoNumber?: string  | null
  TransactionDate?: Date 
  Amount?: number  | null
  AdjustmentType?: string  | null
  Source?: string  | null
  Status?: string  | null
  LocationName: string | null
  OldJo: string
  NewJo?: string  | null
  OldCustomerId: string
  NewCustomerId?: string  | null
  DisputeReferenceNumber: string
  DisputeAmount: number
  DateDisputeFiled: Date
  DescriptionOfDispute: string
  AccountsPaymentDate: Date
  AccountsPaymentTransNo: string
  AccountsPaymentAmount: number
  ReasonDesc: string
  Descriptions: string
}
