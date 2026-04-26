import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  private router = inject(Router);

  tenant = localStorage.getItem('tenant') || '';
  companyName = localStorage.getItem('companyName') || 'Mi Empresa';
  role = localStorage.getItem('role') || 'PROPIETARIO';

  isActive(segment: string): boolean {
    return this.router.url.includes(`/${segment}`);
  }
}
