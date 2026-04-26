import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html'
})
export class TopbarComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';

  private router = inject(Router);
  public ui = inject(UiService);

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
