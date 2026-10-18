export type Nacionalidad = 'V' | 'E';

export type ParticipacionStatus = 'SÍ' | 'NO';

export interface EmployeeRecord {
  id: string; // usually cedula
  nacionalidad: Nacionalidad;
  cedula: string;
  apellidosNombres: string;
  telefono: string;
  institucion: string;
  estado: string;
  municipio: string;
  participo: ParticipacionStatus;
  fechaHoraReporte?: string | null;
  esForaneo?: boolean;
  observaciones?: string;
}

export interface MunicipalityData {
  id: string;
  nombre: string;
  capital: string;
  color: string;
  totalPadrón: number;
  participaron: number;
  porcentaje: number;
  coordenadas?: { x: number; y: number };
}

export interface DashboardKpis {
  totalPadron: number;
  totalParticiparon: number;
  porcentajeTotal: number;
  totalForaneos: number;
  porcentajeForaneos: number;
  porInstitucion: Record<string, { total: number; participaron: number; porcentaje: number }>;
  porMunicipio: Record<string, { total: number; participaron: number; porcentaje: number }>;
}

export interface FilterState {
  institucion: string;
  municipio: string;
  estado: string;
  estatus: 'TODOS' | 'SÍ' | 'NO';
  busqueda: string;
  soloForaneos: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
