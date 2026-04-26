export interface Servicio {
    id: number;
    name: string;
    description?: string;
    cost: number;
    tipo: 'INCLUIDO' | 'ADICIONAL';
    propertyId?: number;
    propertyName?: string;
    roomId?: number;
}
