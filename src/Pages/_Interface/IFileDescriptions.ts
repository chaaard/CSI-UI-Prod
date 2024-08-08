import IAccountingProoflist from "./IAccountingProoflist";

export default interface IFileDescriptions {
  Id: number,
  FileName: string,
  UploadDate: Date,
  Merchant: string,
  Count: number,
  AccountingProoflistDtos: IAccountingProoflist[]
}
