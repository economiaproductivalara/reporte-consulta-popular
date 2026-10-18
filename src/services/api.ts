import { EmployeeRecord, DashboardKpis, ApiResponse } from '../types';
import { INITIAL_EMPLOYEES } from '../data/initialEmployees';

const LOCAL_STORAGE_KEY = 'mppapt_employees_v1';
const GAS_URL_STORAGE_KEY = 'mppapt_gas_url_v1';

export const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbzbj6xUv22gFp6ncmArKrqlfCyum-Y9S7NpYS_GKvSpFP8vBxSRA9b9VeMkAgmnm_vL/exec';

class ApiService {
  private gasUrl: string = DEFAULT_GAS_URL;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem(GAS_URL_STORAGE_KEY);
      this.gasUrl = savedUrl || import.meta.env.VITE_APPS_SCRIPT_URL || DEFAULT_GAS_URL;
      this.initializeLocalStorage();
    }
  }

  public getGasUrl(): string {
    return this.gasUrl;
  }

  public setGasUrl(url: string): void {
    this.gasUrl = url.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem(GAS_URL_STORAGE_KEY, this.gasUrl);
    }
  }

  private initializeLocalStorage(): void {
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
      }
    } catch (e) {
      console.warn('Error accessing localStorage:', e);
    }
  }

  private getLocalEmployees(): EmployeeRecord[] {
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (existing) {
        return JSON.parse(existing);
      }
    } catch (e) {
      console.warn('Error reading employees from localStorage:', e);
    }
    return INITIAL_EMPLOYEES;
  }

  private saveLocalEmployees(list: EmployeeRecord[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Error writing employees to localStorage:', e);
    }
  }

  /**
   * Búsqueda reactiva por Cédula (estrictamente numérico, sanitizado)
   */
  public async searchEmployee(rawCedula: string): Promise<ApiResponse<EmployeeRecord>> {
    const cleanCedula = rawCedula.replace(/\D/g, '').trim();
    if (!cleanCedula) {
      return { success: false, error: 'Debe ingresar un número de cédula válido' };
    }

    // Si hay URL de Google Apps Script configurada, intentamos consultar el Web App
    if (this.gasUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const url = `${this.gasUrl}?action=search&cedula=${encodeURIComponent(cleanCedula)}`;
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          const res = await response.json();
          if (res.success && res.found && res.employee) {
            // Sincronizar en cache local
            this.syncEmployeeToLocal(res.employee);
            return { success: true, data: res.employee };
          } else if (res.success && !res.found) {
            return { success: false, message: 'Cédula no encontrada en el padrón de MPPAPT Lara' };
          }
        }
      } catch (err) {
        console.warn('Fallo consulta a Google Apps Script, recurriendo a base de datos local:', err);
      }
    }

    // Consulta en base de datos local
    const employees = this.getLocalEmployees();
    const found = employees.find(e => e.cedula === cleanCedula);

    if (found) {
      return { success: true, data: found };
    }

    return {
      success: false,
      message: `No se encontró ningún trabajador registrado con la C.I. V/E-${cleanCedula} en el padrón del MPPAPT Lara.`
    };
  }

  /**
   * Registro de PARTICIPACIÓN EFECTIVA
   * Regla: Sanitización y transformación estricta a MAYÚSCULAS
   */
  public async registerParticipation(params: {
    cedula: string;
    estado?: string;
    municipio?: string;
    telefono?: string;
  }): Promise<ApiResponse<EmployeeRecord>> {
    const cleanCedula = params.cedula.replace(/\D/g, '').trim();
    const cleanEstado = (params.estado || 'LARA').trim().toUpperCase();
    const cleanMunicipio = (params.municipio || '').trim().toUpperCase();
    const cleanTelefono = (params.telefono || '').trim().toUpperCase();

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const esForaneo = cleanEstado !== '' && cleanEstado !== 'LARA';

    // Intento de actualización en Google Apps Script
    if (this.gasUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        // Usamos GET con parámetros para máxima compatibilidad con Apps Script Web App
        const queryParams = new URLSearchParams({
          action: 'participate',
          cedula: cleanCedula,
          estado: cleanEstado,
          municipio: cleanMunicipio,
          telefono: cleanTelefono
        });

        const url = `${this.gasUrl}?${queryParams.toString()}`;
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          const res = await response.json();
          if (res.success && res.employee) {
            this.syncEmployeeToLocal(res.employee);
            return {
              success: true,
              data: res.employee,
              message: '¡Participación Efectiva confirmada y sincronizada con el sistema oficial!'
            };
          }
        }
      } catch (err) {
        console.warn('Error al enviar reporte a GAS, registrando localmente:', err);
      }
    }

    // Actualización local
    const employees = this.getLocalEmployees();
    const index = employees.findIndex(e => e.cedula === cleanCedula);

    if (index === -1) {
      return {
        success: false,
        error: `No se encontró el trabajador con C.I. ${cleanCedula} en la base de datos.`
      };
    }

    const current = employees[index];
    const updated: EmployeeRecord = {
      ...current,
      estado: cleanEstado || current.estado,
      municipio: cleanMunicipio || current.municipio,
      telefono: cleanTelefono || current.telefono,
      participo: 'SÍ',
      fechaHoraReporte: timestamp,
      esForaneo: esForaneo
    };

    employees[index] = updated;
    this.saveLocalEmployees(employees);

    return {
      success: true,
      data: updated,
      message: '¡Participación Efectiva registrada exitosamente en el sistema!'
    };
  }

  private syncEmployeeToLocal(employee: EmployeeRecord) {
    const list = this.getLocalEmployees();
    const idx = list.findIndex(e => e.cedula === employee.cedula);
    if (idx >= 0) {
      list[idx] = employee;
    } else {
      list.push(employee);
    }
    this.saveLocalEmployees(list);
  }

  /**
   * Obtiene todos los empleados para filtros y tabla
   */
  public async getAllEmployees(): Promise<EmployeeRecord[]> {
    if (this.gasUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${this.gasUrl}?action=list`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.employees)) {
            this.saveLocalEmployees(data.employees);
            return data.employees;
          }
        }
      } catch (err) {
        console.warn('Fallo obtención remota, usando cache local:', err);
      }
    }
    return this.getLocalEmployees();
  }

  /**
   * Cálculo de KPIs y métricas clave
   */
  public calculateKpis(employees: EmployeeRecord[]): DashboardKpis {
    const totalPadron = employees.length;
    let totalParticiparon = 0;
    let totalForaneos = 0;
    const porInstitucion: Record<string, { total: number; participaron: number; porcentaje: number }> = {};
    const porMunicipio: Record<string, { total: number; participaron: number; porcentaje: number }> = {};

    employees.forEach(emp => {
      const isYes = emp.participo === 'SÍ';
      const isForeign = (emp.estado && emp.estado.toUpperCase() !== 'LARA') || emp.esForaneo === true;

      if (isYes) {
        totalParticiparon++;
        if (isForeign) {
          totalForaneos++;
        }
      }

      // Agrupación por institución
      const inst = emp.institucion || 'NO DEFINIDO';
      if (!porInstitucion[inst]) {
        porInstitucion[inst] = { total: 0, participaron: 0, porcentaje: 0 };
      }
      porInstitucion[inst].total++;
      if (isYes) {
        porInstitucion[inst].participaron++;
      }

      // Agrupación por municipio (dentro de Lara)
      if (!isForeign) {
        const mun = emp.municipio || 'POR ASIGNAR';
        if (!porMunicipio[mun]) {
          porMunicipio[mun] = { total: 0, participaron: 0, porcentaje: 0 };
        }
        porMunicipio[mun].total++;
        if (isYes) {
          porMunicipio[mun].participaron++;
        }
      }
    });

    const porcentajeTotal = totalPadron > 0 ? Number(((totalParticiparon / totalPadron) * 100).toFixed(1)) : 0;
    const porcentajeForaneos = totalParticiparon > 0 ? Number(((totalForaneos / totalParticiparon) * 100).toFixed(1)) : 0;

    // Calcular porcentajes por grupo
    Object.keys(porInstitucion).forEach(key => {
      const item = porInstitucion[key];
      item.porcentaje = item.total > 0 ? Number(((item.participaron / item.total) * 100).toFixed(1)) : 0;
    });

    Object.keys(porMunicipio).forEach(key => {
      const item = porMunicipio[key];
      item.porcentaje = item.total > 0 ? Number(((item.participaron / item.total) * 100).toFixed(1)) : 0;
    });

    return {
      totalPadron,
      totalParticiparon,
      porcentajeTotal,
      totalForaneos,
      porcentajeForaneos,
      porInstitucion,
      porMunicipio
    };
  }

  /**
   * Resetear a datos iniciales de demostración
   */
  public resetData(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_EMPLOYEES));
    }
  }

  /**
   * Exportar padrón a CSV
   */
  public exportToCsv(employees: EmployeeRecord[]): void {
    const headers = ['NACIONALIDAD', 'CEDULA', 'APELLIDOS_Y_NOMBRES', 'TELEFONO', 'INSTITUCION', 'ESTADO', 'MUNICIPIO', 'PARTICIPO', 'FECHA_REPORTE', 'ES_FORANEO'];
    const rows = employees.map(e => [
      e.nacionalidad,
      e.cedula,
      `"${e.apellidosNombres.replace(/"/g, '""')}"`,
      e.telefono,
      `"${e.institucion.replace(/"/g, '""')}"`,
      `"${e.estado.replace(/"/g, '""')}"`,
      `"${e.municipio.replace(/"/g, '""')}"`,
      e.participo,
      e.fechaHoraReporte || '',
      e.esForaneo ? 'SÍ' : 'NO'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_participacion_mppapt_lara_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const apiService = new ApiService();
