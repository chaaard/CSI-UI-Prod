export default interface IAccntGenerateInvoice {
  Id: number,
  CustomerId: string,
  Date: Date,
  Location: string,
  LocationId?: number,
  SubmitStatus: number,
  IsGenerated?: boolean,
}
