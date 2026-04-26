import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  private router = inject(Router);
  public ui = inject(UiService);

  tenant = localStorage.getItem('tenant') || '';
  companyName = localStorage.getItem('companyName') || 'Mi Empresa';
  role = localStorage.getItem('role') || 'PROPIETARIO';

  isActive(segment: string): boolean {
    return this.router.url.includes(`/${segment}`);
  }
}
