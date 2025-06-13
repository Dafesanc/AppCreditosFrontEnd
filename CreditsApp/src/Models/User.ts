export interface User {
  id: string,
  firstName: string,
  email: string,
  lastName: string,
  password: string,
  identificationNumber: string,
  identificationType: string,
  role: number,
  createdAt:  string,
  birthDate: string
}
export interface UserUpdate {
  firstName?: string,
  lastName?: string,
  email?: string,
  identificationNumber?: string,
  role?: number,
  birthDate?: string
}
