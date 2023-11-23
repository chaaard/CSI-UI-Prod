export default interface ICustomerCodeUpdateDelete {
  Id: number;
  CustomerName: string;
  CustomerCode: string;
  DeleteFlag?: boolean;
  CategoryId?: number;
}
