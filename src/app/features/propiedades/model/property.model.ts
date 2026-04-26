export interface Property {
    id: number;
    name: string;
    address: string;
    price?: number;      // Precio del departamento completo
    roomCount: number;
    occupiedRooms: number;
    totalIncome: number;
}
