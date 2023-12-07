export default interface IExceptionProps {
  PageNumber: number,
  PageSize: number,
  SearchQuery: string | null,
  ColumnToSort: string | null,
  OrderBy: string | null, 
  dates: string[];
  memCode: string[];
  userId?: string;
  storeId: number[];
}