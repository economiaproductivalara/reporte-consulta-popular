/**
 * =========================================================================
 * SISTEMA DE SEGUIMIENTO Y REPORTE DE PARTICIPACIÓN - MPPAPT LARA
 * 2da Consulta Popular Nacional - 18 de Octubre de 2026
 *
 * Backend RESTful API para Google Apps Script Web App
 * Hoja de Cálculo: ID: 1NjErQyP-4q6uY495uG82PF73j7Q2rAviXYmFsodi-WY
 * Pestaña de Personal y Metas: "Personal MPPAPT Lara"
 * Pestaña de Control de Reportes: "Control de Reportes"
 * =========================================================================
 */

const SPREADSHEET_ID = '1NjErQyP-4q6uY495uG82PF73j7Q2rAviXYmFsodi-WY';
const SHEET_PERSONAL = 'Personal MPPAPT Lara';
const SHEET_REPORTES = 'Control de Reportes';

/**
 * Endpoint GET principal
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = (params.action || 'stats').toLowerCase();

    let responseData;

    switch (action) {
      case 'ping':
        responseData = {
          success: true,
          message: 'API MPPAPT Lara Operativa',
          timestamp: new Date().toISOString(),
          spreadsheetId: SPREADSHEET_ID,
          sheetPersonal: SHEET_PERSONAL,
          sheetReportes: SHEET_REPORTES
        };
        break;

      case 'search':
        responseData = searchEmployeeByCedula(params.cedula);
        break;

      case 'stats':
        responseData = getConsolidatedStats();
        break;

      case 'list':
        responseData = getAllEmployeesList();
        break;

      case 'participate':
        responseData = recordParticipation({
          cedula: params.cedula,
          estado: params.estado,
          municipio: params.municipio,
          telefono: params.telefono
        });
        break;

      default:
        responseData = { success: false, error: 'Acción GET no reconocida: ' + action };
    }

    return createJsonResponse(responseData);
  } catch (err) {
    return createJsonResponse({
      success: false,
      error: 'Error interno en Google Apps Script: ' + err.toString()
    });
  }
}

/**
 * Endpoint POST principal
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Espera hasta 30 segundos en alta concurrencia

    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = (payload.action || 'participate').toLowerCase();
    let responseData;

    if (action === 'participate') {
      responseData = recordParticipation(payload);
    } else {
      responseData = { success: false, error: 'Acción POST no reconocida' };
    }

    return createJsonResponse(responseData);
  } catch (err) {
    return createJsonResponse({
      success: false,
      error: 'Error al procesar solicitud POST: ' + err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Helper: Obtener o crear hoja "Personal MPPAPT Lara"
 */
function getPersonalSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_PERSONAL);
  if (!sheet) {
    // Si no tiene el nombre exacto, intentar buscar una hoja alternativa o crearla
    const sheets = ss.getSheets();
    for (let s of sheets) {
      const name = s.getName().toLowerCase();
      if (name.includes('personal') || name.includes('mppapt') || name.includes('padron')) {
        sheet = s;
        break;
      }
    }
    if (!sheet) {
      sheet = sheets[0]; // Usar la primera hoja existente
    }
  }
  return sheet;
}

/**
 * Helper: Obtener o crear automáticamente la hoja "Control de Reportes"
 */
function getReportesSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_REPORTES);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_REPORTES);
    const headers = [
      'FECHA Y HORA REPORTE',
      'NACIONALIDAD',
      'CÉDULA',
      'APELLIDOS Y NOMBRES',
      'INSTITUCIÓN',
      'ESTADO',
      'MUNICIPIO',
      'TELÉFONO',
      'ES_FORÁNEO',
      'ESTATUS'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#244BC5')
      .setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Mapeo inteligente dinámico de encabezados de "Personal MPPAPT Lara"
 */
function detectColumnIndexes(headersRow) {
  const map = {
    cedula: -1,
    nacionalidad: -1,
    nombre: -1,
    telefono: -1,
    institucion: -1,
    estado: -1,
    municipio: -1,
    participo: -1
  };

  for (let c = 0; c < headersRow.length; c++) {
    const colName = String(headersRow[c] || '').toUpperCase().trim();
    if (colName === '') continue;

    if (map.cedula === -1 && (colName.includes('CEDULA') || colName.includes('CÉDULA') || colName === 'CI' || colName.includes('IDENTIDAD'))) {
      map.cedula = c;
    } else if (map.nacionalidad === -1 && (colName.includes('NACIONALIDAD') || colName === 'NAC' || colName === 'ORIGEN')) {
      map.nacionalidad = c;
    } else if (map.nombre === -1 && (colName.includes('NOMBRE') || colName.includes('APELLIDO') || colName.includes('TRABAJADOR'))) {
      map.nombre = c;
    } else if (map.telefono === -1 && (colName.includes('TELEFONO') || colName.includes('TELÉFONO') || colName.includes('CELULAR') || colName.includes('MOVIL'))) {
      map.telefono = c;
    } else if (map.institucion === -1 && (colName.includes('INSTITUCION') || colName.includes('INSTITUCIÓN') || colName.includes('ENTE') || colName.includes('ORGANISMO') || colName.includes('ADSCRIP'))) {
      map.institucion = c;
    } else if (map.estado === -1 && (colName.includes('ESTADO') || colName === 'EDO')) {
      map.estado = c;
    } else if (map.municipio === -1 && (colName.includes('MUNICIPIO') || colName === 'MUN')) {
      map.municipio = c;
    } else if (map.participo === -1 && (colName.includes('PARTICIP') || colName.includes('VOTO') || colName.includes('REPORTE'))) {
      map.participo = c;
    }
  }

  // Fallbacks si la hoja no tiene encabezados nombrados estándar
  if (map.cedula === -1) map.cedula = 1; // Col B
  if (map.nombre === -1) map.nombre = 2; // Col C
  if (map.institucion === -1) map.institucion = 4; // Col E
  if (map.estado === -1) map.estado = 5; // Col F
  if (map.municipio === -1) map.municipio = 6; // Col G

  return map;
}

/**
 * Obtener conjunto de cédulas que ya reportaron en "Control de Reportes"
 */
function getReportedCedulasMap(reportesSheet) {
  const data = reportesSheet.getDataRange().getValues();
  const map = {}; // cedula -> { timestamp, estado, municipio, telefono }

  if (data.length <= 1) return map;

  // En Control de Reportes: Col A=Fecha, B=Nac, C=Cédula, D=Nombre, E=Inst, F=Estado, G=Mun, H=Telf, I=Foraneo, J=Estatus
  for (let r = 1; r < data.length; r++) {
    const row = data[r];
    const cedula = String(row[2] || '').replace(/\D/g, '').trim();
    if (cedula) {
      map[cedula] = {
        fechaHora: row[0] ? String(row[0]) : '',
        nacionalidad: String(row[1] || 'V').toUpperCase(),
        estado: String(row[5] || '').toUpperCase(),
        municipio: String(row[6] || '').toUpperCase(),
        telefono: String(row[7] || '').toUpperCase(),
        esForaneo: String(row[8] || '').toUpperCase() === 'SÍ'
      };
    }
  }
  return map;
}

/**
 * Búsqueda de trabajador por Cédula
 */
function searchEmployeeByCedula(rawCedula) {
  if (!rawCedula) {
    return { success: false, error: 'Debe ingresar un número de cédula válido' };
  }

  const cleanCedula = String(rawCedula).replace(/\D/g, '').trim();
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const personalSheet = getPersonalSheet(ss);
  const reportesSheet = getReportesSheet(ss);

  const personalData = personalSheet.getDataRange().getValues();
  if (personalData.length <= 1) {
    return { success: false, found: false, message: 'La hoja Personal MPPAPT Lara está vacía' };
  }

  const colMap = detectColumnIndexes(personalData[0]);
  const reportedMap = getReportedCedulasMap(reportesSheet);

  for (let i = 1; i < personalData.length; i++) {
    const row = personalData[i];
    const rowCedula = String(row[colMap.cedula] || '').replace(/\D/g, '').trim();

    if (rowCedula === cleanCedula) {
      const alreadyReported = reportedMap[cleanCedula];

      const nac = colMap.nacionalidad !== -1 && row[colMap.nacionalidad] 
        ? String(row[colMap.nacionalidad]).trim().toUpperCase() 
        : 'V';
      const nombre = colMap.nombre !== -1 && row[colMap.nombre] 
        ? String(row[colMap.nombre]).trim().toUpperCase() 
        : '';
      const telf = colMap.telefono !== -1 && row[colMap.telefono] 
        ? String(row[colMap.telefono]).trim().toUpperCase() 
        : (alreadyReported ? alreadyReported.telefono : '');
      const inst = colMap.institucion !== -1 && row[colMap.institucion] 
        ? String(row[colMap.institucion]).trim().toUpperCase() 
        : 'MPPAPT LARA';
      
      const estado = alreadyReported 
        ? alreadyReported.estado 
        : (colMap.estado !== -1 && row[colMap.estado] ? String(row[colMap.estado]).trim().toUpperCase() : '');
      
      const municipio = alreadyReported 
        ? alreadyReported.municipio 
        : (colMap.municipio !== -1 && row[colMap.municipio] ? String(row[colMap.municipio]).trim().toUpperCase() : '');

      const isForeign = estado !== '' && estado !== 'LARA';

      return {
        success: true,
        found: true,
        employee: {
          id: cleanCedula,
          nacionalidad: nac || 'V',
          cedula: cleanCedula,
          apellidosNombres: nombre,
          telefono: telf,
          institucion: inst,
          estado: estado,
          municipio: municipio,
          participo: alreadyReported ? 'SÍ' : 'NO',
          fechaHoraReporte: alreadyReported ? alreadyReported.fechaHora : null,
          esForaneo: isForeign
        }
      };
    }
  }

  return {
    success: true,
    found: false,
    message: 'Cédula no encontrada en el padrón de Personal MPPAPT Lara'
  };
}

/**
 * Registro de PARTICIPACIÓN EFECTIVA
 * Inserta en la pestaña "Control de Reportes" y actualiza la fila correspondiente
 */
function recordParticipation(payload) {
  if (!payload || !payload.cedula) {
    return { success: false, error: 'Parámetro cédula es requerido' };
  }

  const cleanCedula = String(payload.cedula).replace(/\D/g, '').trim();
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const personalSheet = getPersonalSheet(ss);
  const reportesSheet = getReportesSheet(ss);

  const personalData = personalSheet.getDataRange().getValues();
  const colMap = detectColumnIndexes(personalData[0]);

  let targetRowIndex = -1;
  let targetRow = null;

  for (let i = 1; i < personalData.length; i++) {
    const rowCedula = String(personalData[i][colMap.cedula] || '').replace(/\D/g, '').trim();
    if (rowCedula === cleanCedula) {
      targetRowIndex = i + 1; // 1-indexed para Sheets
      targetRow = personalData[i];
      break;
    }
  }

  if (targetRowIndex === -1) {
    return {
      success: false,
      found: false,
      error: 'No se encontró el trabajador con C.I. ' + cleanCedula + ' en Personal MPPAPT Lara.'
    };
  }

  // Sanitización estricta a MAYÚSCULAS
  const nac = (colMap.nacionalidad !== -1 && targetRow[colMap.nacionalidad] ? String(targetRow[colMap.nacionalidad]) : 'V').trim().toUpperCase();
  const nombre = (colMap.nombre !== -1 && targetRow[colMap.nombre] ? String(targetRow[colMap.nombre]) : '').trim().toUpperCase();
  const inst = (colMap.institucion !== -1 && targetRow[colMap.institucion] ? String(targetRow[colMap.institucion]) : 'MPPAPT LARA').trim().toUpperCase();
  
  const estadoConfirmado = (payload.estado || (colMap.estado !== -1 ? targetRow[colMap.estado] : 'LARA') || 'LARA').toString().trim().toUpperCase();
  const municipioConfirmado = (payload.municipio || (colMap.municipio !== -1 ? targetRow[colMap.municipio] : '') || '').toString().trim().toUpperCase();
  const telefonoConfirmado = (payload.telefono || (colMap.telefono !== -1 ? targetRow[colMap.telefono] : '') || '').toString().trim().toUpperCase();

  const esForaneo = estadoConfirmado !== 'LARA';
  const timestamp = Utilities.formatDate(new Date(), 'America/Caracas', 'yyyy-MM-dd HH:mm:ss');

  // 1. Asentar registro en la pestaña dedicada "Control de Reportes"
  reportesSheet.appendRow([
    timestamp,
    nac,
    cleanCedula,
    nombre,
    inst,
    estadoConfirmado,
    municipioConfirmado,
    telefonoConfirmado,
    esForaneo ? 'SÍ' : 'NO',
    'PARTICIPACIÓN EFECTIVA'
  ]);

  // 2. Si en "Personal MPPAPT Lara" faltaba estado o municipio o teléfono, completarlos
  if (colMap.estado !== -1 && (!targetRow[colMap.estado] || String(targetRow[colMap.estado]).trim() === '')) {
    personalSheet.getRange(targetRowIndex, colMap.estado + 1).setValue(estadoConfirmado);
  }
  if (colMap.municipio !== -1 && (!targetRow[colMap.municipio] || String(targetRow[colMap.municipio]).trim() === '')) {
    personalSheet.getRange(targetRowIndex, colMap.municipio + 1).setValue(municipioConfirmado);
  }
  if (payload.telefono && colMap.telefono !== -1) {
    personalSheet.getRange(targetRowIndex, colMap.telefono + 1).setValue(telefonoConfirmado);
  }
  if (colMap.participo !== -1) {
    personalSheet.getRange(targetRowIndex, colMap.participo + 1).setValue('SÍ');
  }

  const updatedRecord = {
    id: cleanCedula,
    nacionalidad: nac,
    cedula: cleanCedula,
    apellidosNombres: nombre,
    telefono: telefonoConfirmado,
    institucion: inst,
    estado: estadoConfirmado,
    municipio: municipioConfirmado,
    participo: 'SÍ',
    fechaHoraReporte: timestamp,
    esForaneo: esForaneo
  };

  return {
    success: true,
    message: 'Participación registrada con éxito en Control de Reportes.',
    employee: updatedRecord
  };
}

/**
 * Obtener estadísticas consolidadas: Metas de Personal vs Reportes Efectivos
 */
function getConsolidatedStats() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const personalSheet = getPersonalSheet(ss);
  const reportesSheet = getReportesSheet(ss);

  const personalData = personalSheet.getDataRange().getValues();
  if (personalData.length <= 1) {
    return {
      success: true,
      stats: {
        totalPadron: 0,
        totalParticiparon: 0,
        porcentajeTotal: 0,
        totalForaneos: 0,
        porcentajeForaneos: 0,
        porInstitucion: {},
        porMunicipio: {}
      }
    };
  }

  const colMap = detectColumnIndexes(personalData[0]);
  const reportedMap = getReportedCedulasMap(reportesSheet);

  let totalPadron = 0;
  let totalParticiparon = Object.keys(reportedMap).length;
  let totalForaneos = 0;

  const porInstitucion = {};
  const porMunicipio = {};

  for (let i = 1; i < personalData.length; i++) {
    const row = personalData[i];
    const cedula = String(row[colMap.cedula] || '').replace(/\D/g, '').trim();
    if (!cedula) continue;

    totalPadron++;

    const inst = colMap.institucion !== -1 && row[colMap.institucion] 
      ? String(row[colMap.institucion]).trim().toUpperCase() 
      : 'MPPAPT LARA';

    const estado = colMap.estado !== -1 && row[colMap.estado] 
      ? String(row[colMap.estado]).trim().toUpperCase() 
      : 'LARA';

    const municipio = colMap.municipio !== -1 && row[colMap.municipio] 
      ? String(row[colMap.municipio]).trim().toUpperCase() 
      : 'POR ASIGNAR';

    const report = reportedMap[cedula];
    const yaParticipo = Boolean(report);

    // Por Institución
    if (!porInstitucion[inst]) {
      porInstitucion[inst] = { total: 0, participaron: 0, porcentaje: 0 };
    }
    porInstitucion[inst].total++;
    if (yaParticipo) {
      porInstitucion[inst].participaron++;
    }

    // Por Municipio (considerando municipio del reporte si existe o del padrón)
    const activeEstado = report ? report.estado : estado;
    const activeMunicipio = report ? report.municipio : municipio;
    const esForaneo = activeEstado !== '' && activeEstado !== 'LARA';

    if (yaParticipo && esForaneo) {
      totalForaneos++;
    }

    if (!esForaneo) {
      const munKey = activeMunicipio || 'POR ASIGNAR';
      if (!porMunicipio[munKey]) {
        porMunicipio[munKey] = { total: 0, participaron: 0, porcentaje: 0 };
      }
      porMunicipio[munKey].total++;
      if (yaParticipo) {
        porMunicipio[munKey].participaron++;
      }
    }
  }

  const porcentajeTotal = totalPadron > 0 ? Number(((totalParticiparon / totalPadron) * 100).toFixed(1)) : 0;
  const porcentajeForaneos = totalParticiparon > 0 ? Number(((totalForaneos / totalParticiparon) * 100).toFixed(1)) : 0;

  Object.keys(porInstitucion).forEach(k => {
    const item = porInstitucion[k];
    item.porcentaje = item.total > 0 ? Number(((item.participaron / item.total) * 100).toFixed(1)) : 0;
  });

  Object.keys(porMunicipio).forEach(k => {
    const item = porMunicipio[k];
    item.porcentaje = item.total > 0 ? Number(((item.participaron / item.total) * 100).toFixed(1)) : 0;
  });

  return {
    success: true,
    stats: {
      totalPadron,
      totalParticiparon,
      porcentajeTotal,
      totalForaneos,
      porcentajeForaneos,
      porInstitucion,
      porMunicipio
    }
  };
}

/**
 * Listado completo de trabajadores cruzando Personal con Control de Reportes
 */
function getAllEmployeesList() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const personalSheet = getPersonalSheet(ss);
  const reportesSheet = getReportesSheet(ss);

  const personalData = personalSheet.getDataRange().getValues();
  if (personalData.length <= 1) {
    return { success: true, count: 0, employees: [] };
  }

  const colMap = detectColumnIndexes(personalData[0]);
  const reportedMap = getReportedCedulasMap(reportesSheet);
  const employees = [];

  for (let i = 1; i < personalData.length; i++) {
    const row = personalData[i];
    const cedula = String(row[colMap.cedula] || '').replace(/\D/g, '').trim();
    if (!cedula) continue;

    const report = reportedMap[cedula];

    const nac = colMap.nacionalidad !== -1 && row[colMap.nacionalidad] 
      ? String(row[colMap.nacionalidad]).trim().toUpperCase() 
      : 'V';
    const nombre = colMap.nombre !== -1 && row[colMap.nombre] 
      ? String(row[colMap.nombre]).trim().toUpperCase() 
      : '';
    const telf = report ? report.telefono : (colMap.telefono !== -1 && row[colMap.telefono] ? String(row[colMap.telefono]).trim().toUpperCase() : '');
    const inst = colMap.institucion !== -1 && row[colMap.institucion] 
      ? String(row[colMap.institucion]).trim().toUpperCase() 
      : 'MPPAPT LARA';
    const estado = report ? report.estado : (colMap.estado !== -1 && row[colMap.estado] ? String(row[colMap.estado]).trim().toUpperCase() : 'LARA');
    const mun = report ? report.municipio : (colMap.municipio !== -1 && row[colMap.municipio] ? String(row[colMap.municipio]).trim().toUpperCase() : '');

    const esForaneo = estado !== '' && estado !== 'LARA';

    employees.push({
      id: cedula,
      nacionalidad: nac,
      cedula: cedula,
      apellidosNombres: nombre,
      telefono: telf,
      institucion: inst,
      estado: estado,
      municipio: mun,
      participo: report ? 'SÍ' : 'NO',
      fechaHoraReporte: report ? report.fechaHora : null,
      esForaneo: esForaneo
    });
  }

  return {
    success: true,
    count: employees.length,
    employees: employees
  };
}

/**
 * Respuesta JSON con cabeceras CORS
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
