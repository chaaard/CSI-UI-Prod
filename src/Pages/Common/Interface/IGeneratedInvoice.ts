export default interface IGeneratedInvoice {
  Id: number
  Club: number
  CustomerId: string
  CustomerNo: string
  CustomerName: string
  InvoiceNo: string
  InvoiceDate: Date
  TransactionDate: Date
  Location: string
  ReferenceNo: string
  InvoiceAmount: number
}