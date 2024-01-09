export default interface IInvoice {
  HDR_TRX_NUMBER: string
  HDR_TRX_DATE: Date
  HDR_PAYMENT_TYPE: string
  HDR_BRANCH_CODE: string
  HDR_CUSTOMER_NUMBER: string
  HDR_CUSTOMER_SITE: string
  HDR_PAYMENT_TERM: string
  HDR_BUSINESS_LINE: string
  HDR_BATCH_SOURCE_NAME: string
  HDR_GL_DATE: Date
  HDR_SOURCE_REFERENCE: string
  DTL_LINE_DESC: string
  DTL_QUANTITY: number
  DTL_AMOUNT: number
  DTL_VAT_CODE: string
  DTL_CURRENCY: string
  INVOICE_APPLIED: string
  FILENAME: string
}