export interface UserLoged {
  userId: string; // Unique identifier for the user
  firstName: string; // First name of the user
  lastName: string; // Last name of the user
  role: number; // Role of the user (e.g., admin, user)
  email: string; // Email address of the user
  isAuthenticated: boolean; // Indicates if the user is authenticated

}
