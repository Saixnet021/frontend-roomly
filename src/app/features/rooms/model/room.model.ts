export interface Room {
    id: number;
    roomNumber: string;
    price: number;
    status: string; // 'Disponible' | 'Ocupado' | 'Mantenimiento'
    propertyId: number;
}
