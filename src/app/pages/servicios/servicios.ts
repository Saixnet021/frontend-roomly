import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { TopbarComponent } from '../../shared/components/topbar/topbar';
import { ServicioViewModel } from '../../features/servicios/viewmodel/servicio.viewmodel';
import { PropertyViewModel } from '../../features/propiedades/viewmodel/property.viewmodel';
import { Servicio } from '../../features/servicios/model/servicio.model';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, CommonModule, FormsModule],
  templateUrl: './servicios.html'
})
export class ServiciosComponent implements OnInit {
  public servicioVM = inject(ServicioViewModel);
  public propertyVM = inject(PropertyViewModel);

  showModal = false;
  editingId: number | null = null;

  current: Partial<Servicio> = {
    name: '', description: '', cost: 0, tipo: 'INCLUIDO', propertyId: undefined
  };

  ngOnInit() {
    this.servicioVM.loadServicios();
    this.propertyVM.loadProperties();
  }

  openModal(s?: Servicio) {
    if (s) {
      this.editingId = s.id;
      this.current = { name: s.name, description: s.description, cost: s.cost, tipo: s.tipo, propertyId: s.propertyId };
    } else {
      this.editingId = null;
      this.current = { name: '', description: '', cost: 0, tipo: 'INCLUIDO', propertyId: undefined };
    }
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  save() {
    if (!this.current.name) return;
    if (this.editingId) {
      this.servicioVM.editServicio(this.editingId, this.current);
    } else {
      this.servicioVM.addServicio(this.current);
    }
    this.closeModal();
  }

  delete(id: number) {
    if (confirm('¿Eliminar este servicio?')) this.servicioVM.removeServicio(id);
  }

  tipoClass(tipo: string) {
    return tipo === 'INCLUIDO'
      ? 'bg-green-100 text-green-700'
      : 'bg-orange-100 text-orange-700';
  }
}
