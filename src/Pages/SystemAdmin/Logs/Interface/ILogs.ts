export default interface ILogs {
  UserId: string
  Date: string
  Action: string
  Remarks: string
  RowsCountBefore: number
  RowsCountAfter: number
  TotalAmount: string
  Club: string
  CustomerId: string
  Filename: string
  ActionId: number
  AnalyticsId: number
  AdjustmentId: number
}