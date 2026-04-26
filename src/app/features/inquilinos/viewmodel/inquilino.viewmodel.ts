import { Injectable, computed, signal, inject } from '@angular/core';
import { InquilinoApiService } from '../service/inquilino-api.service';
import { Inquilino } from '../model/inquilino.model';

@Injectable({
  providedIn: 'root'
})
export class InquilinoViewModel {
  private apiService = inject(InquilinoApiService);

  private inquilinosState = signal<Inquilino[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Computed views for the UI
  public inquilinos = computed(() => this.inquilinosState());
  public isLoading = computed(() => this.loadingState());
  public error = computed(() => this.errorState());

  public loadInquilinos() {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.apiService.getInquilinos().subscribe({
      next: (data) => {
        this.inquilinosState.set(data);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set('Error cargando inquilinos: ' + err.message);
        this.loadingState.set(false);
      }
    });
  }

  public addInquilino(inquilino: Partial<Inquilino>) {
    this.apiService.createInquilino(inquilino).subscribe({
      next: (newInd) => this.inquilinosState.update(state => [...state, newInd]),
      error: (err) => console.error('Error al agregar Inquilino', err)
    });
  }

  public editInquilino(id: number, inquilino: Partial<Inquilino>) {
    this.apiService.updateInquilino(id, inquilino).subscribe({
      next: (updatedInd) => this.inquilinosState.update(state => state.map(i => i.id === id ? updatedInd : i)),
      error: (err) => console.error('Error al editar Inquilino', err)
    });
  }

  public removeInquilino(id: number) {
    this.apiService.deleteInquilino(id).subscribe({
      next: () => this.inquilinosState.update(state => state.filter(i => i.id !== id)),
      error: (err) => console.error('Error al eliminar Inquilino', err)
    });
  }
}
