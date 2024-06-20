export default interface IUsers {
  Id: string
  Username: string
  EmployeeNumber: string
  FirstName: string
  MiddleName: string
  LastName: string
  Salt: string
  Hash: string
  Club: number
  Location: string
  RoleId: number
  RoleName: string
  IsLogin: boolean
  IsFirstLogin: boolean
  Status: boolean
  Attempt: number
}