export class LoginResponse {
  token?: string; // JWT token for authentication
  email: string = ""; // User's email address
  role!: number; // User's role (e.g., admin, user)
  identificationType: string = "CI"; // Type of identification (e.g., passport, ID card)
  fullName: string = ""; // User's full name
}
// usa misma respuesta para el response de register
