export default interface IPagination {
  Id?: number | null,
  PageNumber: number,
  PageSize: number,
  SearchQuery?: string | null,
  ColumnToSort?: string | null,
  OrderBy?: string | null, 
  CategoryId?: number | null, 
  IsVisible?: boolean | null,
  ByMerchant?: boolean | null, 
  IsAllVisible?: boolean | null, 
}
