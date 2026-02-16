export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  activo: boolean;
  fechaCreacion: string;
}
