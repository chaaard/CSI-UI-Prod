export default interface IAccountingAdjustmentsView {
  Id: number,
  AccountingAdjustmentTypeId: number,
  NewTransactionDate: Date,
  AccountPaymentReferenceNo: string,
  Amount: number,
  CashierName: string,
  Agency: string,
  Remarks: string,
  MatchId: number,
  AccountingAnalyticsId: number,
  AccountingProofListId: number,
  DeleteFlag: boolean
}