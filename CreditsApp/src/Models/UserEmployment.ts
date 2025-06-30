export interface userEmployment {
  id:string;
  userId:string;
  userFullName:string;
  employerId:string;
  employerName:string;
  position?:string;
  startDate?:string;
  endDate?:string;
  monthlyIncome:number;
  isCurrent:boolean;
  createdAt:string;
}
