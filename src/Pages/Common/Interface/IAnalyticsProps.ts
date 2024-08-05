export default interface IAnalyticProps {
  PageNumber?: number,
  PageSize?: number,
  SearchQuery?: string | null,
  ColumnToSort?: string | null,
  OrderBy?: string | null, 
  dates?: string[];
  memCode?: string[];
  userId?: string;
  storeId?: number[];
  status?: string[];
  orderNo?: string;
  isView?: boolean;
  action?: string;
  fileName?: string;
  remarks?: string;
  Ids?:string;
}