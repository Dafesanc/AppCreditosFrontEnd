export interface Card {
  id: string;
  cardApplicationId: string;
  cardNumber: string;
  maskedcardNumber: string;
  cardType: string; // 'credito' | 'debito'
  expiryDate: string; // Formato 'MM/AA'
  issuedDate: string; // Fecha de emisión
  status:number;
  statusName: string; // 'Activo' | 'Inactivo'
  cvc: string; // Código de seguridad
}
