export default interface UsersUpdateInsert {
  Id?: string
  Username?: string
  EmployeeNumber?: string
  FirstName?: string
  MiddleName?: string
  LastName?: string
  Salt?: string
  Hash?: string
  Club?: number
  RoleId?: number
  IsLogin?: boolean
  IsFirstLogin?: boolean
  Status?: boolean
  Attempt?: number
}