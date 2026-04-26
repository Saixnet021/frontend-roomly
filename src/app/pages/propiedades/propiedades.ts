import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { TopbarComponent } from '../../shared/components/topbar/topbar';
import { PropertyViewModel } from '../../features/propiedades/viewmodel/property.viewmodel';
import { Property } from '../../features/propiedades/model/property.model';
import { ServicioApiService } from '../../features/servicios/service/servicio-api.service';
import { Servicio } from '../../features/servicios/model/servicio.model';

@Component({
  selector: 'app-propiedades',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, CommonModule, FormsModule, RouterLink],
  templateUrl: './propiedades.html'
})
export class PropiedadesComponent implements OnInit {
  
  public propertyVM = inject(PropertyViewModel);
  private servicioApi = inject(ServicioApiService);

  // Mapa: propertyId → servicios
  serviciosPorPropiedad = signal<Map<number, Servicio[]>>(new Map());

  // Modal State Propiedad
  showModal = false;
  editingId: number | null = null;
  currentProp: Partial<Property> = { name: '', address: '', price: undefined };

  // Modal State Servicio
  showServiceModal = false;
  currentService: Partial<Servicio> = { name: '', tipo: 'INCLUIDO', cost: 0, propertyId: undefined };

  ngOnInit() {
    this.propertyVM.loadProperties();
    this.refreshServices();
  }

  refreshServices() {
    this.servicioApi.getServicios().subscribe({
      next: (all) => {
        const map = new Map<number, Servicio[]>();
        for (const s of all) {
          if (s.propertyId != null) {
            if (!map.has(s.propertyId)) map.set(s.propertyId, []);
            map.get(s.propertyId)!.push(s);
          }
        }
        this.serviciosPorPropiedad.set(map);
      }
    });
  }

  getServicios(propId: number): Servicio[] {
    return this.serviciosPorPropiedad().get(propId) ?? [];
  }

  openModal(prop?: Property) {
    if (prop) {
      this.editingId = prop.id;
      this.currentProp = { name: prop.name, address: prop.address, price: prop.price };
    } else {
      this.editingId = null;
      this.currentProp = { name: '', address: '', price: undefined };
    }
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  // Gestión de Servicios desde aquí
  openServiceModal(propId: number) {
    this.currentService = { name: '', tipo: 'INCLUIDO', cost: 0, propertyId: propId };
    this.showServiceModal = true;
  }

  closeServiceModal() { this.showServiceModal = false; }

  saveService() {
    if (!this.currentService.name) return;
    this.servicioApi.createServicio(this.currentService).subscribe({
      next: () => {
        this.refreshServices();
        this.closeServiceModal();
      }
    });
  }

  saveProperty() {
    if (this.currentProp.name && this.currentProp.address) {
      if (this.editingId) {
        this.propertyVM.editProperty(this.editingId, this.currentProp);
      } else {
        this.propertyVM.addProperty(this.currentProp);
      }
      this.closeModal();
    }
  }

  deleteProperty(id: number) {
    this.propertyVM.removeProperty(id);
  }
}
