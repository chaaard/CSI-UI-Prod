export default interface IException {
  Id: number
  CustomerId?: string  | null
  JoNumber?: string  | null
  TransactionDate?: Date 
  Amount?: number  | null
  AdjustmentType?: string  | null
  Status?: string  | null
}
