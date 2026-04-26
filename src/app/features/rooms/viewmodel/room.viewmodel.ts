import { Injectable, computed, signal, inject } from '@angular/core';
import { RoomApiService } from '../service/room-api.service';
import { Room } from '../model/room.model';

@Injectable({ providedIn: 'root' })
export class RoomViewModel {
  private apiService = inject(RoomApiService);

  private roomsState = signal<Room[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  public rooms = computed(() => this.roomsState());
  public isLoading = computed(() => this.loadingState());
  public error = computed(() => this.errorState());

  public loadRooms(propertyId: number) {
    this.loadingState.set(true);
    this.errorState.set(null);
    this.apiService.getRooms(propertyId).subscribe({
      next: (data) => { this.roomsState.set(data); this.loadingState.set(false); },
      error: (err) => { this.errorState.set('Error: ' + err.message); this.loadingState.set(false); }
    });
  }

  public addRoom(room: Partial<Room>) {
    this.apiService.createRoom(room).subscribe({
      next: (r) => this.roomsState.update(s => [...s, r]),
      error: (err) => console.error('Error creando cuarto', err)
    });
  }

  public editRoom(id: number, room: Partial<Room>) {
    this.apiService.updateRoom(id, room).subscribe({
      next: (r) => this.roomsState.update(s => s.map(x => x.id === id ? r : x)),
      error: (err) => console.error('Error editando cuarto', err)
    });
  }

  public removeRoom(id: number) {
    this.apiService.deleteRoom(id).subscribe({
      next: () => this.roomsState.update(s => s.filter(x => x.id !== id)),
      error: (err) => console.error('Error eliminando cuarto', err)
    });
  }
}
