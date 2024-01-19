export default interface AdjustmentAddProps {
  Id?: number | null,
  DisputeReferenceNumber?: string | null,
  DisputeAmount?: number | null,
  DateDisputeFiled?: Date | null,
  DescriptionOfDispute?: string | null,
  NewJO?: string | null,
  CustomerId?: string | null,
  AccountsPaymentDate?: Date | null,
  AccountsPaymentTransNo?: string | null,
  AccountsPaymentAmount?: number | null,
  ReasonId?: number | null,
  Descriptions? : string | null,
  DeleteFlag?: boolean | null
}
