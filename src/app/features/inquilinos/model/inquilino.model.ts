export interface Inquilino {
    id: number;
    name: string;
    document: string;
    email: string;
    phone: string;
    status: string;
    propertyId?: number;
    propertyName?: string;
    roomId?: number;
    roomNumber?: string;
    password?: string; // Solo para creación
}
