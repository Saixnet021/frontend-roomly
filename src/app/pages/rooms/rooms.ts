import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { TopbarComponent } from '../../shared/components/topbar/topbar';
import { RoomViewModel } from '../../features/rooms/viewmodel/room.viewmodel';
import { Room } from '../../features/rooms/model/room.model';
import { ServicioApiService } from '../../features/servicios/service/servicio-api.service';
import { Servicio } from '../../features/servicios/model/servicio.model';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, CommonModule, FormsModule],
  templateUrl: './rooms.html'
})
export class RoomsComponent implements OnInit {
  public roomVM = inject(RoomViewModel);
  private route = inject(ActivatedRoute);
  private servicioApi = inject(ServicioApiService);

  propertyId!: number;
  tenant: string = localStorage.getItem('tenant') || '';

  // Mapa: roomId → servicios
  serviciosPorCuarto = signal<Map<number, Servicio[]>>(new Map());

  // Modal State Room
  showModal = false;
  editingId: number | null = null;
  currentRoom: Partial<Room> = { roomNumber: '', price: 0, status: 'Disponible' };

  // Modal State Servicio
  showServiceModal = false;
  currentService: Partial<Servicio> = { name: '', tipo: 'INCLUIDO', cost: 0, roomId: undefined, propertyId: undefined };

  ngOnInit() {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
    this.roomVM.loadRooms(this.propertyId);
    this.refreshServices();
  }

  refreshServices() {
    this.servicioApi.getServicios(this.propertyId).subscribe({
      next: (all) => {
        const map = new Map<number, Servicio[]>();
        for (const s of all) {
          if (s.roomId != null) {
            if (!map.has(s.roomId)) map.set(s.roomId, []);
            map.get(s.roomId)!.push(s);
          }
        }
        this.serviciosPorCuarto.set(map);
      }
    });
  }

  getServicios(roomId: number): Servicio[] {
    return this.serviciosPorCuarto().get(roomId) ?? [];
  }

  openModal(room?: Room) {
    if (room) {
      this.editingId = room.id;
      this.currentRoom = { roomNumber: room.roomNumber, price: room.price, status: room.status };
    } else {
      this.editingId = null;
      this.currentRoom = { roomNumber: '', price: 0, status: 'Disponible' };
    }
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  // Gestión de Servicios
  openServiceModal(roomId: number) {
    this.currentService = { name: '', tipo: 'INCLUIDO', cost: 0, roomId: roomId, propertyId: this.propertyId };
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

  saveRoom() {
    if (!this.currentRoom.roomNumber) return;
    const payload = { ...this.currentRoom, propertyId: this.propertyId };
    if (this.editingId) {
      this.roomVM.editRoom(this.editingId, payload);
    } else {
      this.roomVM.addRoom(payload);
    }
    this.closeModal();
  }

  deleteRoom(id: number) {
    this.roomVM.removeRoom(id);
  }

  statusColor(status: string): string {
    if (status === 'Disponible') return 'bg-green-100 text-green-700';
    if (status === 'Ocupado') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  }

  countByStatus(status: string): number {
    return this.roomVM.rooms().filter(r => r.status === status).length;
  }
}
