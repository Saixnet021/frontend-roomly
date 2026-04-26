import { Injectable, signal, computed } from '@angular/core';
import { Property } from '../model/property.model';
import { PropertyApiService } from '../service/property-api.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyViewModel {
  
  // State represented as a signal
  private propertiesState = signal<Property[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Read-only signals for the view
  public properties = this.propertiesState.asReadonly();
  public isLoading = this.loadingState.asReadonly();
  public error = this.errorState.asReadonly();

  // Derived state (computed signals) if needed
  public totalProperties = computed(() => this.properties().length);
  public totalIncome = computed(() => this.properties().reduce((sum, p) => sum + p.totalIncome, 0));

  // Tenant from localStorage for navigation
  public tenant: string = localStorage.getItem('tenant') || '';

  constructor(private apiService: PropertyApiService) {}

  public loadProperties() {
    this.loadingState.set(true);
    this.errorState.set(null);
    
    this.apiService.getProperties().subscribe({
      next: (data) => {
        // Debug: log loaded properties to inspect totalIncome values
        try {
          console.log('[DEBUG] Properties loaded:', data);
        } catch (e) {
          // ignore
        }
        this.propertiesState.set(data);
        this.loadingState.set(false);
      },
      error: (err) => {
        this.errorState.set('Error cargando propiedades: ' + err.message);
        this.loadingState.set(false);
      }
    });
  }

  public addProperty(property: Partial<Property>) {
    this.apiService.createProperty(property).subscribe({
      next: (newProp) => {
        // Mutate signal state
        this.propertiesState.update(props => [...props, newProp]);
      },
      error: (err) => console.error('Error creando', err)
    });
  }

  public editProperty(id: number, property: Partial<Property>) {
    this.apiService.updateProperty(id, property).subscribe({
      next: (updatedProp) => {
        this.propertiesState.update(props => props.map(p => p.id === id ? updatedProp : p));
      },
      error: (err) => console.error('Error editando', err)
    });
  }

  public removeProperty(id: number) {
    // Pessimistic or Optimistic update? Let's do pessimistic: wait for success.
    this.apiService.deleteProperty(id).subscribe({
      next: () => {
        this.propertiesState.update(props => props.filter(p => p.id !== id));
      },
      error: (err) => console.error('Error eliminando', err)
    });
  }
}
