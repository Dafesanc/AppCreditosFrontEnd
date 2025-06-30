import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../shared/components/header/header.component";
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AccountsService } from '../../services/accounts/accounts.service';
import { Account, CreateAccount } from '../../../Models/Account';
import { UserLoged } from '../../../Models/UserLoged';
interface BankAccount {
  id: string;
  type: 'ahorro' | 'corriente';
  accountNumber: string;
  balance: number;
  isActive: boolean;
}

interface CreditCard {
  id: string;
  type: 'credito' | 'debito';
  cardNumber: string;
  expiryDate: string;
  isActive: boolean;
  limit?: number;
  balance?: number;
}

interface Investment {
  id: string;
  type: string;
  amount: number;
  expectedReturn: number;
  term: number; // en meses
}

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})
export class MyProductsComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private accountService = inject(AccountsService); // Placeholder for account service
  loading = true;
  error = '';
  unauthorizedAccess = false;
  bankAccount: Account[] = [];
  currentUser: UserLoged | null = null;
  //reqAccount!: CreateAccount;
  loadMyAccounts():void {
    this.accountService.getMyAccounts().subscribe({
      next: (accounts) => {
        // Validar que accounts sea un array antes de asignarlo
        if (Array.isArray(accounts)) {
          this.bankAccount = accounts;
          this.bankAccount.forEach(account => {
            // Validar que accountNumber existe y tiene al menos 5 caracteres
            if (account.accountNumber && account.accountNumber.length >= 5) {
              account.maskedAccountNumber = 'XXXXX' + account.accountNumber.slice(-5);
            } else if (account.accountNumber) {
              // Si tiene menos de 5 caracteres, usar el número completo con X's
              account.maskedAccountNumber = 'XXXXX' + account.accountNumber;
            } else {
              // Si no tiene accountNumber, asignar un valor por defecto
              account.maskedAccountNumber = 'XXXXX-XXXX';
            }
          });
          console.log('Cuentas bancarias cargadas:', this.bankAccount);
        } else {
          // Si no es un array, inicializar como array vacío
          console.warn('La respuesta del servicio no es un array:', accounts);
          this.bankAccount = [];
        }
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.unauthorizedAccess = true;
        } else {
          this.error = 'Error al cargar la lista de usuarios';
          console.error('Error de respuestas del servidor:', this.error);
        }
        this.loading = false;
        console.error('Error al cargar cuentas bancarias:', err);

      }
    });
  }

  createAccount(reqAccount:CreateAccount){
    reqAccount.accountNumber = this.generateRandomAccountNumber();
    this.authService.getLogedUserInfo().subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('Usuario actual:', user);
        if (user.userId !== null) {
          // Asignar el userId al reqAccount antes de enviarlo
          reqAccount.userId = user.userId;
          console.log('Solicitud de creación de cuenta:', reqAccount);
          this.accountService.createAccounts(reqAccount).subscribe({
            next: (response) => {
              console.log('Cuenta creada exitosamente:', response);
              this.loadMyAccounts(); // Recargar cuentas después de crear una nueva
              this.closeAccountModal();
            },
            error: (err) => {
              console.error('Error al crear cuenta:', err);
              this.error = 'Error al crear la cuenta. Por favor, inténtalo de nuevo más tarde.';
            }
          });
        } else {
          this.unauthorizedAccess = true;
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener usuario actual:', err);
        this.error = 'Error al verificar permisos';
        this.loading = false;
      }
    });
  }

  creditCards: CreditCard[] = [
    {
      id: '1',
      type: 'credito',
      cardNumber: '**** **** **** 3456',
      expiryDate: '12/26',
      isActive: true,
      limit: 2000,
      balance: 450.30
    },
    {
      id: '2',
      type: 'debito',
      cardNumber: '**** **** **** 7890',
      expiryDate: '09/27',
      isActive: true,
      balance: 628.70
    }
  ];

  investments: Investment[] = [
    {
      id: '1',
      type: 'Póliza de Inversión',
      amount: 5000,
      expectedReturn: 8.5,
      term: 12
    }
  ];

  // Modal states
  showAccountModal = false;
  showInvestmentModal = false;
  showCardDetailsModal = false;
  showInvestmentSimulator = false;
  selectedCard: CreditCard | null = null;

  // Tipo de cuenta seleccionado en el formulario
  selectedAccountType: number = 1; // Valor por defecto: Cuenta de Ahorros

  // Investment simulator
  simulatorData = {
    amount: 1000,
    term: 12,
    interestRate: 8.5
  };

  simulationResult = {
    monthlyReturn: 0,
    totalReturn: 0,
    finalAmount: 0
  };

  ngOnInit(): void {
    // Inicialización del componente
    this.loadMyAccounts();
  }

  // Método para generar número aleatorio de 10 dígitos que comience con 2, 3 o 4
  generateRandomAccountNumber(): string {
    // Array con los primeros dígitos permitidos
    const firstDigits = [2, 3, 4];

    // Seleccionar aleatoriamente el primer dígito
    const firstDigit = firstDigits[Math.floor(Math.random() * firstDigits.length)];

    // Generar los 9 dígitos restantes
    let remainingDigits = '';
    for (let i = 0; i < 9; i++) {
      remainingDigits += Math.floor(Math.random() * 10).toString();
    }

    // Combinar el primer dígito con los restantes
    return firstDigit.toString() + remainingDigits;
  }

  // Métodos para abrir/cerrar modales
  openAccountModal(): void {
    this.showAccountModal = true;
  }

  closeAccountModal(): void {
    this.showAccountModal = false;
    // Resetear la selección al cerrar el modal
    this.selectedAccountType = 1;
  }

  openInvestmentModal(): void {
    this.showInvestmentModal = true;
  }

  closeInvestmentModal(): void {
    this.showInvestmentModal = false;
  }

  openInvestmentSimulator(): void {
    this.showInvestmentSimulator = true;
  }

  closeInvestmentSimulator(): void {
    this.showInvestmentSimulator = false;
  }

  openCardDetails(card: CreditCard): void {
    this.selectedCard = card;
    this.showCardDetailsModal = true;
  }

  closeCardDetailsModal(): void {
    this.showCardDetailsModal = false;
    this.selectedCard = null;
  }

  // Simulador de inversión
  calculateInvestment(): void {
    const monthlyRate = this.simulatorData.interestRate / 100 / 12;
    const totalMonths = this.simulatorData.term;

    // Cálculo de interés compuesto
    this.simulationResult.finalAmount = this.simulatorData.amount * Math.pow(1 + monthlyRate, totalMonths);
    this.simulationResult.totalReturn = this.simulationResult.finalAmount - this.simulatorData.amount;
    this.simulationResult.monthlyReturn = this.simulationResult.totalReturn / totalMonths;
  }

  // Métodos para solicitudes
  requestNewAccount(): void {
    console.log('Solicitar nueva cuenta');

    // Crear el objeto CreateAccount con los datos del formulario
    const newAccount: CreateAccount = {
      userId: '', // Se asignará en el método createAccount
      accountNumber: '', // Se generará automáticamente
      accountType: this.selectedAccountType // Usar el tipo seleccionado del radio button
    };

    console.log('Datos de la nueva cuenta:', newAccount);

    // Llamar al método createAccount
    this.createAccount(newAccount);
  }

  requestInvestment(): void {
    console.log('Solicitar nueva inversión/póliza');
    // Aquí se implementaría la lógica para solicitar una inversión
    this.closeInvestmentModal();
  }

  getAccountTypeIcon(type: string): string {
    return type === 'Ahorro' ? '🐷' : '🏦';
  }

  getCardTypeIcon(type: string): string {
    return type === 'credito' ? '💳' : '💰';
  }
}
