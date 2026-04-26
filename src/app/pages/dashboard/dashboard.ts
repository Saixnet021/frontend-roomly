import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { TopbarComponent } from '../../shared/components/topbar/topbar';
import { DashboardViewModel } from '../../features/dashboard/viewmodel/dashboard.viewmodel';
import { PropertyViewModel } from '../../features/propiedades/viewmodel/property.viewmodel';
import { InquilinoApiService } from '../../features/inquilinos/service/inquilino-api.service';
import { Inquilino } from '../../features/inquilinos/model/inquilino.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, CommonModule, RouterLink],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  public dashVM = inject(DashboardViewModel);
  public propertyVM = inject(PropertyViewModel);
  private inqApi = inject(InquilinoApiService);

  tenant = localStorage.getItem('tenant') || '';
  companyName = localStorage.getItem('companyName') || 'Tu empresa';
  role = localStorage.getItem('role') || 'PROPIETARIO';
  userName = localStorage.getItem('userName') || '';

  // Signal para asegurar reactividad en el template
  myInfo = signal<Inquilino | null>(null);

  ngOnInit() {
    const currentRole = (this.role || '').toUpperCase();
    
    if (currentRole === 'PROPIETARIO') {
      this.dashVM.loadStats();
      this.propertyVM.loadProperties();
    } else {
      this.inqApi.getMyInfo().subscribe({
        next: (info) => {
          this.myInfo.set(info);
        },
        error: (err) => {
          console.error('Error loading my info:', err);
        }
      });
    }
  }
}
