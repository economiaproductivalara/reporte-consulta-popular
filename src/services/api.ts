import { EmployeeRecord, DashboardKpis, ApiResponse } from '../types';
import { INITIAL_EMPLOYEES } from '../data/initialEmployees';
import { LARA_MUNICIPALITIES, matchMunicipio } from '../data/geoLara';

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
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const url = `${this.gasUrl}?action=search&cedula=${encodeURIComponent(cleanCedula)}&_t=${Date.now()}`;
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
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        // Usamos GET con parámetros para máxima compatibilidad con Apps Script Web App
        const queryParams = new URLSearchParams({
          action: 'participate',
          cedula: cleanCedula,
          estado: cleanEstado,
          municipio: cleanMunicipio,
          telefono: cleanTelefono,
          _t: Date.now().toString()
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
   * Obtiene estadísticas y métricas oficiales en tiempo real directamente de Google Sheets
   * (Muy rápido y siempre devuelve el total exacto del Padrón Meta aunque cambie la hoja)
   */
  public async getLiveStats(): Promise<DashboardKpis | null> {
    if (this.gasUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const url = `${this.gasUrl}?action=stats&_t=${Date.now()}`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.stats) {
            return {
              totalPadron: Number(data.stats.totalPadron) || 0,
              totalParticiparon: Number(data.stats.totalParticiparon) || 0,
              porcentajeTotal: Number(data.stats.porcentajeTotal) || 0,
              totalForaneos: Number(data.stats.totalForaneos) || 0,
              porcentajeForaneos: Number(data.stats.porcentajeForaneos) || 0,
              porInstitucion: data.stats.porInstitucion || {},
              porMunicipio: data.stats.porMunicipio || {}
            };
          }
        }
      } catch (err) {
        console.warn('Error al obtener estadísticas en vivo de Google Sheets:', err);
      }
    }
    return null;
  }

  /**
   * Obtiene todos los empleados para filtros y tabla con timeout extendido y cache-busting
   */
  public async getAllEmployees(): Promise<EmployeeRecord[]> {
    if (this.gasUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        const url = `${this.gasUrl}?action=list&_t=${Date.now()}`;
        const res = await fetch(url, { signal: controller.signal });
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
   * Cálculo de KPIs y métricas clave 100% dinámicas
   * Combina el padrón de la base de datos remota con el listado nominal local
   */
  public calculateKpis(employees: EmployeeRecord[], remoteStats?: DashboardKpis | null): DashboardKpis {
    // Si tenemos estadísticas remotas autoritativas en vivo de Google Sheets, priorizar su Padrón Meta
    const effectivePadron = Math.max(employees.length, remoteStats?.totalPadron || 0);

    let localParticiparon = 0;
    let localForaneos = 0;
    const porInstitucion: Record<string, { total: number; participaron: number; porcentaje: number }> = {};
    const porMunicipio: Record<string, { total: number; participaron: number; porcentaje: number }> = {};

    employees.forEach(emp => {
      const isYes = emp.participo === 'SÍ';
      const isForeign = (emp.estado && emp.estado.toUpperCase() !== 'LARA') || emp.esForaneo === true;

      if (isYes) {
        localParticiparon++;
        if (isForeign) {
          localForaneos++;
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

      // Agrupación por municipio (dentro de Lara con mapeo canónico exacto)
      if (!isForeign) {
        let munKey = emp.municipio ? emp.municipio.trim().toUpperCase() : 'POR ASIGNAR';
        const matched = LARA_MUNICIPALITIES.find(m => matchMunicipio(emp.municipio, m.id));
        if (matched) {
          munKey = matched.id;
        }

        if (!porMunicipio[munKey]) {
          porMunicipio[munKey] = { total: 0, participaron: 0, porcentaje: 0 };
        }
        porMunicipio[munKey].total++;
        if (isYes) {
          porMunicipio[munKey].participaron++;
        }
      }
    });

    const totalParticiparon = Math.max(localParticiparon, remoteStats?.totalParticiparon || 0);
    const totalForaneos = Math.max(localForaneos, remoteStats?.totalForaneos || 0);
    const totalPadron = effectivePadron > 0 ? effectivePadron : (totalParticiparon || 0);

    const porcentajeTotal = totalPadron > 0 ? Number(((totalParticiparon / totalPadron) * 100).toFixed(1)) : 0;
    const porcentajeForaneos = totalParticiparon > 0 ? Number(((totalForaneos / totalParticiparon) * 100).toFixed(1)) : 0;

    // Si remoteStats tiene instituciones más completas, utilizarlas como respaldo
    const finalPorInstitucion = Object.keys(porInstitucion).length > 0 ? porInstitucion : (remoteStats?.porInstitucion || {});
    const finalPorMunicipio = Object.keys(porMunicipio).length > 0 ? porMunicipio : (remoteStats?.porMunicipio || {});

    // Calcular porcentajes por grupo
    Object.keys(finalPorInstitucion).forEach(key => {
      const item = finalPorInstitucion[key];
      item.porcentaje = item.total > 0 ? Number(((item.participaron / item.total) * 100).toFixed(1)) : 0;
    });

    Object.keys(finalPorMunicipio).forEach(key => {
      const item = finalPorMunicipio[key];
      item.porcentaje = item.total > 0 ? Number(((item.participaron / item.total) * 100).toFixed(1)) : 0;
    });

    return {
      totalPadron,
      totalParticiparon,
      porcentajeTotal,
      totalForaneos,
      porcentajeForaneos,
      porInstitucion: finalPorInstitucion,
      porMunicipio: finalPorMunicipio
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
