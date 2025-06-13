export interface CreditsApplications {
  id: number;
  requestedAmount: number;
  termInMonths: number;
  monthlyIncome: number;
  workExperienceYears: number;
  status: number;
  suggestedStatus: number;
  createdAt: string;
  updatedAt: string;
  applicantName: string;
}

// Interfaz para crear una nueva solicitud de crédito
export interface CreateCreditsApplication {
  requestedAmount: number;
  termInMonths: number;
  monthlyIncome: number;
  workExperienceYears: number;
}

// Interfaz para actualizar una solicitud de crédito
export interface UpdateCreditsApplication {
  requestedAmount?: number;
  termInMonths?: number;
  monthlyIncome?: number;
  workExperienceYears?: number;
  status?: number;
  suggestedStatus?: number;
}

// Enum para los estados de la solicitud (Coincide con el backend C#)
export enum ApplicationStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3
}
