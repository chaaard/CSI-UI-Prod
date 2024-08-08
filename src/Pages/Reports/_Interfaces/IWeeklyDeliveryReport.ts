export default interface IExceptionsReport {
  [key: string]: string | number;
  LOCATION: string;
  DATE: string;
  "MEMBERSHIP NUMBER": string;
  "REGISTER NO.": string;
  "TRX NO.": string;
  "ORDER NO.": string;
  "QTY PURCHASED": number;
  AMOUNT: number;
  SUBTOTAL: number;
  MEMBER: number;
  "NON MEMBER": number;
  "ORIGINAL AMT.": number;
  "ACCOUNTS PAYMENT": string;
  "AP TRX": string;
  "TOTAL BILLED": number;
}