import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditsApplications, ApplicationStatus } from '../../../Models/CreditsApplications';
import { CreditsApplicationService } from '../../services/creditsApplication/credits-application.service';

@Component({
  selector: 'app-view-application',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-application.component.html',
  styleUrl: './view-application.component.css'
})
export class ViewApplicationComponent {
  @Input() application!: CreditsApplications;
  @Output() close = new EventEmitter<void>();
  @Output() applicationUpdated = new EventEmitter<CreditsApplications>();

  private creditsService = inject(CreditsApplicationService);

  loading = false;
  error = '';

  onClose(): void {
    this.close.emit();
  }

  approveApplication(): void {
    if (confirm('¿Estás seguro de que deseas APROBAR esta solicitud de crédito?')) {
      this.updateStatus(ApplicationStatus.Approved);
    }
  }

  rejectApplication(): void {
    if (confirm('¿Estás seguro de que deseas RECHAZAR esta solicitud de crédito?')) {
      this.updateStatus(ApplicationStatus.Rejected);
    }
  }

  private updateStatus(status: ApplicationStatus): void {
    this.loading = true;
    this.error = '';

    this.creditsService.updateCreditsApplicationStatus(this.application.id, status).subscribe({
      next: (updatedApplication) => {
        this.applicationUpdated.emit(updatedApplication);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al actualizar el estado de la solicitud';
        this.loading = false;
        console.error('Error updating application status:', error);
      }
    });
  }

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
      case ApplicationStatus.Pending: return 'bg-yellow-500 bg-opacity-20 text-gray-800';
      case ApplicationStatus.Approved: return 'bg-green-500 bg-opacity-20 text-gray-800';
      case ApplicationStatus.Rejected: return 'bg-red-500 bg-opacity-20 text-gray-800';
      default: return 'bg-gray-500 bg-opacity-20 text-gray-400';
    }
  }

  getSuggestedStatusName(status: number): string {
    return this.getStatusName(status);
  }

  canUpdateStatus(): boolean {
    return this.application.status === ApplicationStatus.Pending;
  }
}
