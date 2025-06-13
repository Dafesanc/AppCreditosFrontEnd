import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HeaderComponent } from '../shared/components/header/header.component';
import { FooterComponent } from '../shared/components/footer/footer.component';
import { CreditsApplicationService } from '../services/creditsApplication/credits-application.service';
import { AuthService } from '../services/auth/auth.service';
import { CreditsApplications, CreateCreditsApplication, ApplicationStatus } from '../../Models/CreditsApplications';
import { UserLoged } from '../../Models/UserLoged';
import { ViewApplicationComponent } from './view-application/view-application.component';

@Component({
  selector: 'app-credits-application',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, ReactiveFormsModule, ViewApplicationComponent],
  templateUrl: './credits-application.component.html',
  styleUrl: './credits-application.component.css'
})
export class CreditsApplicationComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private creditsService = inject(CreditsApplicationService);
  private authService = inject(AuthService);

  // Estados del componente
  applications: CreditsApplications[] = [];
  filteredApplications: CreditsApplications[] = [];
  loading = true;
  error = '';
  currentUser: UserLoged | null = null;
  isAnalyst = false;
  isApplicant = false;

  // Estados específicos para Solicitantes
  showCreateForm = false;
  createForm!: FormGroup;
  submitting = false;

  // Estados específicos para Analistas
  showViewModal = false;
  selectedApplication: CreditsApplications | null = null;
  statusFilter = new FormControl('');

  ngOnInit(): void {
    this.initializeForm();
    this.loadCurrentUser();
    this.setupStatusFilter();
  }

  initializeForm(): void {
    this.createForm = this.formBuilder.group({
      requestedAmount: ['', [Validators.required, Validators.min(1000), Validators.max(1000000)]],
      termInMonths: ['', [Validators.required, Validators.min(6), Validators.max(60)]],
      monthlyIncome: ['', [Validators.required, Validators.min(1)]],
      workExperienceYears: ['', [Validators.required, Validators.min(0), Validators.max(50)]]
    });
  }
  setupStatusFilter(): void {
    this.statusFilter.valueChanges.subscribe(status => {
      this.filterApplications(status || '');
    });
  }

  loadCurrentUser(): void {
    this.authService.getLogedUserInfo().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isAnalyst = user.role === 'Analyst';
        this.isApplicant = user.role === 'Applicant';
        this.loadApplications();
      },
      error: (err) => {
        console.error('Error al obtener usuario actual:', err);
        this.loading = false;
      }
    });
  }

  loadApplications(): void {
    this.loading = true;

    const loadMethod = this.isAnalyst
      ? this.creditsService.getCreditsApplications()
      : this.creditsService.getMyCreditsApplications();

    loadMethod.subscribe({
      next: (applications) => {
        this.applications = applications;
        this.filteredApplications = [...applications];
        this.loading = false;
      },
      error: (error) => {
        this.error = this.isAnalyst
          ? 'Error al cargar las solicitudes de crédito'
          : 'Error al cargar tus solicitudes de crédito';
        this.loading = false;
        console.error('Error loading applications:', error);
      }
    });
  }

  filterApplications(status: string): void {
    if (!status || status === '') {
      this.filteredApplications = [...this.applications];
    } else {
      this.filteredApplications = this.applications.filter(app => app.status === parseInt(status));
    }
  }

  // Métodos para Solicitantes
  onSubmit(): void {
    if (this.createForm.valid) {
      this.submitting = true;
      const newApplication: CreateCreditsApplication = this.createForm.value;

      this.creditsService.createCreditsApplication(newApplication).subscribe({
        next: (createdApplication) => {
          this.applications.unshift(createdApplication);
          this.filteredApplications = [...this.applications];
          this.createForm.reset();
          this.showCreateForm = false;
          this.submitting = false;
        },
        error: (error) => {
          this.error = 'Error al crear la solicitud de crédito';
          this.submitting = false;
          console.error('Error creating application:', error);
        }
      });
    } else {
      this.createForm.markAllAsTouched();
    }
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.createForm.reset();
      this.error = '';
    }
  }

  // Métodos para Analistas
  viewApplication(application: CreditsApplications): void {
    this.selectedApplication = application;
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedApplication = null;
  }

  onApplicationUpdated(updatedApplication: CreditsApplications): void {
    const index = this.applications.findIndex(app => app.id === updatedApplication.id);
    if (index !== -1) {
      this.applications[index] = updatedApplication;
      this.filterApplications(this.statusFilter.value || '');
    }
    this.closeViewModal();
  }

  // Métodos comunes
  getStatusName(status: number): string {
    switch(status) {
      case ApplicationStatus.Pending: return 'Pendiente';
      case ApplicationStatus.Approved: return 'Aprobado';
      case ApplicationStatus.Rejected: return 'Rechazado';
      default: return 'Desconocido';
    }
  }

  getStatusClass(status: number): string {
    switch(status) {
      case ApplicationStatus.Pending: return 'bg-[rgb(237,200,101)] bg-opacity-20 text-gray-800';
      case ApplicationStatus.Approved: return 'bg-green-500 bg-opacity-20 text-gray-800';
      case ApplicationStatus.Rejected: return 'bg-red-500 bg-opacity-20 text-gray-800';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  }
}
