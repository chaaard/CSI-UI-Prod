export interface IBaseModel {
    Id: number;
    Amount?: number;
    Status?: number;
    ModifiedDate?: Date;
    ModifiedBy?: string | null;
    Seq: number;
    Club?: number;
}