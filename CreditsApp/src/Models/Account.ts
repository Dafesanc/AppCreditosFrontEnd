export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  maskedAccountNumber?: string;
  accountTypeName: 'Savings' | 'Current';
  accountType:number;
  balance: number;
  isApprovedName: string;
  isApproved:number;
  createdAt: string;
  userFullName: string;
  userEmail: string;
}


export interface approveAccount
{
  isApproved:number;
  balance:number

}

export interface CreateAccount
{
  userId:string;
  accountType:number;
  accountNumber:string;
}
