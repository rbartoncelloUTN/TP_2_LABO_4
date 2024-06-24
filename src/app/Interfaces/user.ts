export interface User {
  dni: number;
  perfilImagen2: null | string;
  especialidad?: string;
  edad: number;
  apellido: string;
  mail: string;
  perfilImagen1?: string;
  password: string;
  nombre: string;
  enabled?: boolean;
  verificated?: boolean;
  obraSocial?: string;
  rol: Roles;
}

export enum Roles {
  PATIENT = 'Paciente',
  ADMIN = 'Administrador',
  DOCTOR = 'Especialista',
}
