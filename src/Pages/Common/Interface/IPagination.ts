export default interface IPagination {
  PageNumber: number,
  PageSize: number,
  SearchQuery: string | null,
  ColumnToSort: string | null,
  OrderBy: string | null, 
}
