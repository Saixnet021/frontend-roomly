import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { TopbarComponent } from '../../shared/components/topbar/topbar';
import { InquilinoViewModel } from '../../features/inquilinos/viewmodel/inquilino.viewmodel';
import { PropertyViewModel } from '../../features/propiedades/viewmodel/property.viewmodel';
import { RoomApiService } from '../../features/rooms/service/room-api.service';
import { Inquilino } from '../../features/inquilinos/model/inquilino.model';
import { Room } from '../../features/rooms/model/room.model';

@Component({
  selector: 'app-inquilinos',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, CommonModule, FormsModule],
  templateUrl: './inquilinos.html'
})
export class InquilinosComponent implements OnInit {
  
  public inquilinoVM = inject(InquilinoViewModel);
  public propertyVM = inject(PropertyViewModel);
  private roomApi = inject(RoomApiService);

  showModal = false;
  editingId: number | null = null;

  // Tipo de asignación: 'departamento' = propiedad completa | 'cuarto' = cuarto individual
  assignmentType: 'departamento' | 'cuarto' = 'departamento';

  // Cuartos disponibles que se cargan al elegir una propiedad en modo 'cuarto'
  availableRooms: Room[] = [];
  loadingRooms = false;

  currentInquilino: Partial<Inquilino> = {
    name: '', document: '', email: '', phone: '', status: 'ACTIVO',
    propertyId: undefined, roomId: undefined, password: ''
  };

  ngOnInit() {
    this.inquilinoVM.loadInquilinos();
    this.propertyVM.loadProperties();
  }

  openModal(inquilino?: Inquilino) {
    this.availableRooms = [];

    if (inquilino) {
      this.editingId = inquilino.id;
      // Detectar el tipo de asignación según lo que tenga el inquilino
      this.assignmentType = inquilino.roomId ? 'cuarto' : 'departamento';
      this.currentInquilino = {
        name: inquilino.name,
        document: inquilino.document,
        email: inquilino.email,
        phone: inquilino.phone,
        status: inquilino.status,
        propertyId: inquilino.propertyId,
        roomId: inquilino.roomId
      };
      // Si tenía un cuarto asignado, cargar los cuartos de esa propiedad
      if (inquilino.roomId && inquilino.propertyId) {
        this.loadRoomsForProperty(inquilino.propertyId);
      }
    } else {
      this.editingId = null;
      this.assignmentType = 'departamento';
      this.currentInquilino = {
        name: '', document: '', email: '', phone: '', status: 'ACTIVO',
        propertyId: undefined, roomId: undefined, password: ''
      };
    }
    this.showModal = true;
  }

  onAssignmentTypeChange() {
    // Limpiar selecciones al cambiar el tipo
    this.currentInquilino.propertyId = undefined;
    this.currentInquilino.roomId = undefined;
    this.availableRooms = [];
  }

  onPropertyChange(propertyId: number | undefined) {
    this.currentInquilino.roomId = undefined;
    this.availableRooms = [];
    if (propertyId && this.assignmentType === 'cuarto') {
      this.loadRoomsForProperty(Number(propertyId));
    }
  }

  private loadRoomsForProperty(propertyId: number) {
    this.loadingRooms = true;
    this.roomApi.getRooms(propertyId).subscribe({
      next: (rooms) => {
        // Solo mostrar cuartos disponibles (o el cuarto actual si está editando)
        this.availableRooms = rooms.filter(
          r => r.status === 'Disponible' || r.id === this.currentInquilino.roomId
        );
        this.loadingRooms = false;
      },
      error: () => { this.loadingRooms = false; }
    });
  }

  closeModal() {
    this.showModal = false;
    this.availableRooms = [];
  }

  saveInquilino() {
    if (!this.currentInquilino.name || !this.currentInquilino.document) return;

    const payload: Partial<Inquilino> = { ...this.currentInquilino };

    // Asegurar coherencia: en modo departamento no se manda roomId, en modo cuarto no se manda propertyId suelto
    if (this.assignmentType === 'departamento') {
      payload.roomId = undefined;
    } else {
      // En modo cuarto: la propiedad se extrae del cuarto en el backend, pero la mandamos igual para referencia
      // El propertyId queda para saber en cuál edificio están
    }

    if (this.editingId) {
      this.inquilinoVM.editInquilino(this.editingId, payload);
    } else {
      this.inquilinoVM.addInquilino(payload);
    }
    this.closeModal();
  }

  deleteInquilino(id: number) {
    this.inquilinoVM.removeInquilino(id);
  }
}
