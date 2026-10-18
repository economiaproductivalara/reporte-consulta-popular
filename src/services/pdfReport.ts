import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EmployeeRecord } from '../types';

interface GeneratePendingPdfOptions {
  employees: EmployeeRecord[];
  filterContext?: {
    institucion?: string;
    municipio?: string;
  };
}

export const generatePendingReportPdf = ({
  employees,
  filterContext,
}: GeneratePendingPdfOptions): void => {
  // Filtrar estrictamente a quienes FALTAN por reportar su participación (NO han participado)
  const pendingEmployees = employees.filter((emp) => emp.participo !== 'SÍ');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const now = new Date();
  const dateStr = now.toLocaleDateString('es-VE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('es-VE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const totalAll = employees.length;
  const totalVoted = employees.filter((e) => e.participo === 'SÍ').length;
  const totalPending = pendingEmployees.length;
  const pctVoted = totalAll > 0 ? ((totalVoted / totalAll) * 100).toFixed(1) : '0';
  const pctPending = totalAll > 0 ? ((totalPending / totalAll) * 100).toFixed(1) : '0';

  // 1. Barra Tricolor Superior (Amarillo, Azul, Rojo)
  doc.setFillColor(245, 197, 0); // #F5C500
  doc.rect(14, 10, 60, 2.5, 'F');
  doc.setFillColor(36, 75, 197); // #244BC5
  doc.rect(74, 10, 60, 2.5, 'F');
  doc.setFillColor(222, 39, 25); // #DE2719
  doc.rect(134, 10, 62, 2.5, 'F');

  // 2. Encabezado Oficial Institucional
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('REPÚBLICA BOLIVARIANA DE VENEZUELA', 14, 18);
  doc.text('MINISTERIO DEL PODER POPULAR PARA LA AGRICULTURA PRODUCTIVA Y TIERRAS', 14, 22.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text('COORDINACIÓN ESTADAL LARA • SISTEMA DE SEGUIMIENTO Y MOVILIZACIÓN', 14, 27);

  // 3. Título del Reporte
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(36, 75, 197); // #244BC5
  doc.text('REPORTE OFICIAL: TRABAJADORES PENDIENTES POR PARTICIPAR', 14, 34);

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('2da Consulta Popular Nacional • Domingo 18 de Octubre de 2026', 14, 39);

  // 4. Caja de Resumen Ejecutivo y Telemetría
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(14, 43, 182, 22, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('FECHA Y HORA DE CORTE:', 18, 49);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${dateStr} - ${timeStr}`, 60, 49);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('FILTRO APLICADO:', 18, 54);
  doc.setFont('helvetica', 'normal');
  const filterDesc = [
    filterContext?.institucion ? `Ente: ${filterContext.institucion}` : null,
    filterContext?.municipio ? `Municipio: ${filterContext.municipio}` : null,
  ].filter(Boolean).join(' | ') || 'Padrón General Completo (15 Entes)';
  doc.setTextColor(15, 23, 42);
  doc.text(filterDesc.substring(0, 70), 50, 54);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL PADRÓN:', 18, 59.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(36, 75, 197);
  doc.text(`${totalAll}`, 44, 59.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('YA PARTICIPARON:', 68, 59.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.text(`${totalVoted} (${pctVoted}%)`, 100, 59.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL PENDIENTES:', 136, 59.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38); // red-600
  doc.text(`${totalPending} (${pctPending}%)`, 169, 59.5);

  // 5. Tabla de Trabajadores Pendientes
  const tableRows = pendingEmployees.map((emp, index) => {
    const isForeign = (emp.estado && emp.estado.toUpperCase() !== 'LARA') || emp.esForaneo;
    const locationStr = isForeign
      ? `FORÁNEO (${emp.estado})`
      : (emp.municipio || 'LARA');

    return [
      (index + 1).toString(),
      `${emp.nacionalidad}-${emp.cedula}`,
      emp.apellidosNombres.toUpperCase(),
      emp.institucion.toUpperCase(),
      locationStr.toUpperCase(),
      emp.telefono || 'SIN REGISTRO',
    ];
  });

  autoTable(doc, {
    startY: 68,
    head: [['N°', 'CÉDULA', 'APELLIDOS Y NOMBRES', 'INSTITUCIÓN', 'MUNICIPIO / UBICACIÓN', 'TELÉFONO']],
    body: tableRows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [36, 75, 197], // #244BC5
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 24, fontStyle: 'bold', halign: 'center' },
      2: { cellWidth: 54 },
      3: { cellWidth: 46 },
      4: { cellWidth: 26, halign: 'center' },
      5: { cellWidth: 22, halign: 'center' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    margin: { top: 18, left: 14, right: 14, bottom: 18 },
    didDrawPage: (data) => {
      // Pie de página oficial con numeración
      const pageNumber = doc.getNumberOfPages();
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(
        'Documento oficial de control y movilización electoral • MPPAPT Lara • 2da Consulta Popular Nacional 2026',
        14,
        290
      );
      doc.text(
        `Página ${data.pageNumber} de ${pageNumber}`,
        196,
        290,
        { align: 'right' }
      );
    },
  });

  // 6. Descargar PDF con timestamp
  const fileDate = now.toISOString().replace(/[:.]/g, '-').substring(0, 19);
  doc.save(`reporte_pendientes_mppapt_lara_${fileDate}.pdf`);
};
