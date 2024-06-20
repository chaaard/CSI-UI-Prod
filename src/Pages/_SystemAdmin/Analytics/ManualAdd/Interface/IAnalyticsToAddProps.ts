import IAnalyticProps from "../../../../Common/Interface/IAnalyticsProps";

export default interface IAnalyticsToAddProps {
    CustomerId: string,
    LocationId: number,
    TransactionDate: string,
    MembershipNo: string,
    CashierNo: string,
    RegisterNo: string,
    TransactionNo: string,
    OrderNo: string,
    Qty: number,
    Amount: number,
    Subtotal: number,
    UserId: string,
    AnalyticsParamsDto?: IAnalyticProps
}