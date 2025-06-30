import { Card } from "./Card";

export interface CardApplication {
  id: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  accountId: string;
  accountNumber: string;
  cardType: number; // 1 for Credit Card, 2 for Debit Card
  cardTypeName: string; // 'credito' | 'debito'
  statusName: string; // 'Pendiente' | 'Aprobada' | 'Rechazada'
  status: number; // 0 for Pending, 1 for Approved, 2 for Rejected
  requestedAt: string; // ISO date format
  updatedAt: string; // ISO date format
  approvedById:string| null; // ID of the user who approved the application, if applicable
  approvedByName: string | null; // Name of the user who approved the application, if applicable
  creditApplicationId:string; // ID of the associated credit application, if applicable;
  hasCard: boolean; // Indicates if the user already has a card
  card:Card | null; // Card details if the application is approved and a card has been issued
}
