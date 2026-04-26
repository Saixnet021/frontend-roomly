import { Injectable, signal, inject } from '@angular/core';
import { Servicio } from '../model/servicio.model';
import { ServicioApiService } from '../service/servicio-api.service';

@Injectable({ providedIn: 'root' })
export class ServicioViewModel {
  private api = inject(ServicioApiService);

  private _servicios = signal<Servicio[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  public servicios = this._servicios.asReadonly();
  public isLoading = this._loading.asReadonly();
  public error = this._error.asReadonly();

  countByTipo(tipo: string) {
    return this._servicios().filter(s => s.tipo === tipo).length;
  }

  totalCostAdicional() {
    return this._servicios()
      .filter(s => s.tipo === 'ADICIONAL')
      .reduce((acc, s) => acc + (s.cost ?? 0), 0);
  }

  loadServicios(propertyId?: number) {
    this._loading.set(true);
    this.api.getServicios(propertyId).subscribe({
      next: data => { this._servicios.set(data); this._loading.set(false); },
      error: err => { this._error.set(err.message); this._loading.set(false); }
    });
  }

  addServicio(s: Partial<Servicio>) {
    this.api.createServicio(s).subscribe({
      next: saved => this._servicios.update(list => [...list, saved]),
      error: err => console.error(err)
    });
  }

  editServicio(id: number, s: Partial<Servicio>) {
    this.api.updateServicio(id, s).subscribe({
      next: updated => this._servicios.update(list => list.map(x => x.id === id ? updated : x)),
      error: err => console.error(err)
    });
  }

  removeServicio(id: number) {
    this.api.deleteServicio(id).subscribe({
      next: () => this._servicios.update(list => list.filter(x => x.id !== id)),
      error: err => console.error(err)
    });
  }
}
