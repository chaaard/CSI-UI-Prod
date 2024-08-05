export default interface IRefreshAnalytics {
  dates: string[];
  memCode: string[];
  userId: string;
  storeId: number[];
  transactionNo?: string;
  regNo?: string;
  selectedItem?: string;
  remarks?: string;
  merchantDetails?: string[];
}