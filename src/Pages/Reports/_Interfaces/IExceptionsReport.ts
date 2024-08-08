export default interface IExceptionsReport {
  [key: string]: string | number;
  ID: number;
  "Customer Name": string;
  "JO Number": string;
  "Transaction Date": string;
  Amount: number;
  "Adjustment Type": string;
  Source: string;
  Status: string;
  "Location Name": string;
  "Old JO": string;
  "Current JO / New JO": string;
  "Old Customer ID": string;
  "New Customer ID": string;
  "Dispute Reference Number": string;
  "Dispute Amount": number;
  "Date Dispute Filed": string;
  "Description of Dispute": string;
  "Accounts Payment Date": string;
  "Accounts Payment Trans No": string;
  "Accounts Payment Amount": number;
  Reason: string;
  Descriptions: string;
}