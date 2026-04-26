import { Injectable, signal, inject } from '@angular/core';
import { DashboardApiService } from '../service/dashboard-api.service';
import { DashboardStats } from '../model/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardViewModel {
  private apiService = inject(DashboardApiService);

  stats = signal<DashboardStats | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  loadStats() {
    this.loading.set(true);
    this.apiService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }
}
