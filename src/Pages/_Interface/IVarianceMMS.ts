export default interface IVarianceMMS {
    CategoryId?: number;
    CustomerCodes?: string;
    CategoryName?: string;
    MMS?: number;
    Variance?: number;
    CSI?: number;
    Status?: number;
  }
  
export interface IVarianceParams {
  id?: string;
  currentDate?: string | null;
  store: number;
  tranType?: string;
  searchQuery?: string | null;
  username?: string;
}