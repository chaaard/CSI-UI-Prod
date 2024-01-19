export default interface IExceptionReport {
  Id: number
  CustomerId?: string  | null
  JoNumber?: string  | null
  TransactionDate?: Date 
  Amount?: number  | null
  AdjustmentType?: string  | null
  Source?: string  | null
  Status?: string  | null
  AdjustmentId: number
  LocationName: string | null
}
