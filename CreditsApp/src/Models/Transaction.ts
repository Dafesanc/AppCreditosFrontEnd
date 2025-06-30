export interface Transaction {
  id: string;
  fromAccountId?: string;
  fromAccountNumber?: string;
  toAccountId: string;
  toAccountNumber: string;
  amount:number;
  description: string;
  transactionType: number;
  transactionTypeName: string;
  status: number;
  statusName: string;
  createdAt: Date;
  processedAt?: Date;
  cardId?: string;
  creditApplicationId?: number;

}
