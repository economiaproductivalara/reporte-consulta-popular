import { EmployeeRecord } from '../types';

export const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  // Iribarren
  {
    id: '14234567',
    nacionalidad: 'V',
    cedula: '14234567',
    apellidosNombres: 'COLMENÁREZ MENDOZA JOSÉ GREGORIO',
    telefono: '0414-5238910',
    institucion: 'MPPAPT SEDE CENTRAL LARA',
    estado: 'LARA',
    municipio: 'IRIBARREN',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 08:35:12',
    esForaneo: false
  },
  {
    id: '18456123',
    nacionalidad: 'V',
    cedula: '18456123',
    apellidosNombres: 'PÉREZ GUÉDEZ MARÍA ALEJANDRA',
    telefono: '0424-5123490',
    institucion: 'INTI (INSTITUTO NACIONAL DE TIERRAS)',
    estado: 'LARA',
    municipio: 'IRIBARREN',
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: false
  },
  {
    id: '12987456',
    nacionalidad: 'V',
    cedula: '12987456',
    apellidosNombres: 'RODRÍGUEZ SILVA PEDRO RAMÓN',
    telefono: '0412-5551234',
    institucion: 'INSAI (INSTITUTO NACIONAL DE SALUD AGRÍCOLA INTEGRAL)',
    estado: 'LARA',
    municipio: 'IRIBARREN',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 09:12:44',
    esForaneo: false
  },
  {
    id: '20345678',
    nacionalidad: 'V',
    cedula: '20345678',
    apellidosNombres: 'GARCÍA MONTERO DANIELA CAROLINA',
    telefono: '0416-6543210',
    institucion: 'CIARA (FUNDACIÓN DE CAPACITACIÓN E INNOVACIÓN PARA APOYAR LA REVOLUCIÓN AGRARIA)',
    estado: 'LARA',
    municipio: '', // Testing missing municipality!
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: false
  },
  {
    id: '24567890',
    nacionalidad: 'V',
    cedula: '24567890',
    apellidosNombres: 'ALVARADO BRAVO CARLOS ENRIQUE',
    telefono: '0424-5987123',
    institucion: 'INDER (INSTITUTO NACIONAL DE DESARROLLO RURAL)',
    estado: 'LARA',
    municipio: 'IRIBARREN',
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: false
  },

  // Palavecino
  {
    id: '16789123',
    nacionalidad: 'V',
    cedula: '16789123',
    apellidosNombres: 'SUÁREZ HERNÁNDEZ ANA MERCEDES',
    telefono: '0414-5896321',
    institucion: 'BANCO AGRÍCOLA DE VENEZUELA (BAV)',
    estado: 'LARA',
    municipio: 'PALAVECINO',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 08:15:20',
    esForaneo: false
  },
  {
    id: '22345987',
    nacionalidad: 'V',
    cedula: '22345987',
    apellidosNombres: 'TORRES MORALES LUIS ALBERTO',
    telefono: '0412-7894561',
    institucion: 'FONDAS (FONDO PARA EL DESARROLLO AGRARIO SOCIALISTA)',
    estado: 'LARA',
    municipio: 'PALAVECINO',
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: false
  },

  // Torres (Carora)
  {
    id: '15456789',
    nacionalidad: 'V',
    cedula: '15456789',
    apellidosNombres: 'CHIRINOS VÁSQUEZ HÉCTOR MANUEL',
    telefono: '0414-5369874',
    institucion: 'INTI (INSTITUTO NACIONAL DE TIERRAS)',
    estado: 'LARA',
    municipio: 'TORRES',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 09:40:18',
    esForaneo: false
  },
  {
    id: '19874561',
    nacionalidad: 'V',
    cedula: '19874561',
    apellidosNombres: 'RAMÍREZ OVIEDO GLADYS BEATRIZ',
    telefono: '0424-5412389',
    institucion: 'AGROPATRIA',
    estado: 'LARA',
    municipio: 'TORRES',
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: false
  },
  {
    id: '25678123',
    nacionalidad: 'V',
    cedula: '25678123',
    apellidosNombres: 'YÉPEZ CASTILLO RAFAEL ANTONIO',
    telefono: '0416-3698521',
    institucion: 'INSAI (INSTITUTO NACIONAL DE SALUD AGRÍCOLA INTEGRAL)',
    estado: '', // Testing missing estado & municipio!
    municipio: '',
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: false
  },

  // Morán (El Tocuyo)
  {
    id: '13876543',
    nacionalidad: 'V',
    cedula: '13876543',
    apellidosNombres: 'GÓMEZ CAMACARO YOLANDA DEL CARMEN',
    telefono: '0412-3214569',
    institucion: 'CIARA (FUNDACIÓN DE CAPACITACIÓN E INNOVACIÓN PARA APOYAR LA REVOLUCIÓN AGRARIA)',
    estado: 'LARA',
    municipio: 'MORÁN',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 10:05:33',
    esForaneo: false
  },
  {
    id: '21987654',
    nacionalidad: 'V',
    cedula: '21987654',
    apellidosNombres: 'MEDINA ROJAS JESÚS EDUARDO',
    telefono: '0414-5741236',
    institucion: 'INDER (INSTITUTO NACIONAL DE DESARROLLO RURAL)',
    estado: 'LARA',
    municipio: 'MORÁN',
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: false
  },

  // Jiménez (Quíbor)
  {
    id: '17654321',
    nacionalidad: 'V',
    cedula: '17654321',
    apellidosNombres: 'LEAL MOGICA FRANCISCO JAVIER',
    telefono: '0424-5874123',
    institucion: 'INSAI (INSTITUTO NACIONAL DE SALUD AGRÍCOLA INTEGRAL)',
    estado: 'LARA',
    municipio: 'JIMÉNEZ',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 09:55:00',
    esForaneo: false
  },
  {
    id: '23987123',
    nacionalidad: 'V',
    cedula: '23987123',
    apellidosNombres: 'FLORES PAREDES KARINA LISBETH',
    telefono: '0416-8521479',
    institucion: 'BANCO AGRÍCOLA DE VENEZUELA (BAV)',
    estado: 'LARA',
    municipio: 'JIMÉNEZ',
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: false
  },

  // Crespo (Duaca)
  {
    id: '15987321',
    nacionalidad: 'V',
    cedula: '15987321',
    apellidosNombres: 'CASTRO COLMENARES WILMER JOSÉ',
    telefono: '0414-5698741',
    institucion: 'CORPOLARA (GERENCIA AGRÍCOLA)',
    estado: 'LARA',
    municipio: 'CRESPO',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 10:18:15',
    esForaneo: false
  },
  {
    id: '24123987',
    nacionalidad: 'V',
    cedula: '24123987',
    apellidosNombres: 'NAVARRO PIÑA GABRIELA COROMOTO',
    telefono: '0412-9632587',
    institucion: 'MPPAPT SEDE CENTRAL LARA',
    estado: 'LARA',
    municipio: 'CRESPO',
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: false
  },

  // Andrés Eloy Blanco (Sanare)
  {
    id: '18321654',
    nacionalidad: 'V',
    cedula: '18321654',
    apellidosNombres: 'MENDOZA LUCENA JORGE LUIS',
    telefono: '0424-5369741',
    institucion: 'INTI (INSTITUTO NACIONAL DE TIERRAS)',
    estado: 'LARA',
    municipio: 'ANDRÉS ELOY BLANCO',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 08:50:22',
    esForaneo: false
  },
  {
    id: '26321987',
    nacionalidad: 'V',
    cedula: '26321987',
    apellidosNombres: 'ALVAREZ QUINTERO PATRICIA ELENA',
    telefono: '0416-7412589',
    institucion: 'CIARA (FUNDACIÓN DE CAPACITACIÓN E INNOVACIÓN PARA APOYAR LA REVOLUCIÓN AGRARIA)',
    estado: 'LARA',
    municipio: 'ANDRÉS ELOY BLANCO',
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: false
  },

  // Simón Planas (Sarare)
  {
    id: '16321456',
    nacionalidad: 'V',
    cedula: '16321456',
    apellidosNombres: 'OROPESA BRICEÑO MIGUEL ÁNGEL',
    telefono: '0414-5214789',
    institucion: 'FONDAS (FONDO PARA EL DESARROLLO AGRARIO SOCIALISTA)',
    estado: 'LARA',
    municipio: 'SIMÓN PLANAS',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 09:25:40',
    esForaneo: false
  },
  {
    id: '22147852',
    nacionalidad: 'V',
    cedula: '22147852',
    apellidosNombres: 'RANGEL VARGAS CARMEN ROSA',
    telefono: '0412-8523697',
    institucion: 'PESCALBA',
    estado: 'LARA',
    municipio: 'SIMÓN PLANAS',
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: false
  },

  // Urdaneta (Siquisique)
  {
    id: '14987654',
    nacionalidad: 'V',
    cedula: '14987654',
    apellidosNombres: 'HERRERA BASTIDAS RAMÓN ERNESTO',
    telefono: '0424-5147896',
    institucion: 'INDER (INSTITUTO NACIONAL DE DESARROLLO RURAL)',
    estado: 'LARA',
    municipio: 'URDANETA',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 10:30:19',
    esForaneo: false
  },
  {
    id: '25874123',
    nacionalidad: 'V',
    cedula: '25874123',
    apellidosNombres: 'PIÑA SUCRE DIANA MARCELA',
    telefono: '0416-9631478',
    institucion: 'MPPAPT SEDE CENTRAL LARA',
    estado: 'LARA',
    municipio: 'URDANETA',
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: false
  },

  // CASOS DE PARTICIPACIÓN FORÁNEA (Adscritos a Lara pero votando en otro estado)
  {
    id: '11223344',
    nacionalidad: 'V',
    cedula: '11223344',
    apellidosNombres: 'ZAMBRANO CHACÓN GUSTAVO ADOLFO',
    telefono: '0414-2345678',
    institucion: 'MPPAPT SEDE CENTRAL LARA',
    estado: 'DISTRITO CAPITAL',
    municipio: 'LIBERTADOR',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 08:45:00',
    esForaneo: true,
    observaciones: 'COMISIÓN DE SERVICIO EN CARACAS'
  },
  {
    id: '19753124',
    nacionalidad: 'V',
    cedula: '19753124',
    apellidosNombres: 'GUZMÁN MORALES YORMAN DAVID',
    telefono: '0424-3456789',
    institucion: 'INTI (INSTITUTO NACIONAL DE TIERRAS)',
    estado: 'YARACUY',
    municipio: 'SAN FELIPE',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 09:10:15',
    esForaneo: true,
    observaciones: 'RESIDENCIA TEMPORAL YARACUY'
  },
  {
    id: '21345698',
    nacionalidad: 'V',
    cedula: '21345698',
    apellidosNombres: 'PACHECO DUARTE NAYIBE CECILIA',
    telefono: '0412-4567891',
    institucion: 'INSAI (INSTITUTO NACIONAL DE SALUD AGRÍCOLA INTEGRAL)',
    estado: 'PORTUGUESA',
    municipio: 'ARAURE',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 09:48:30',
    esForaneo: true,
    observaciones: 'INSPECCIÓN EN FRONTERA AGRÍCOLA'
  },
  {
    id: '17456982',
    nacionalidad: 'V',
    cedula: '17456982',
    apellidosNombres: 'BENÍTEZ SALAZAR RÓMULO JOSÉ',
    telefono: '0416-5678912',
    institucion: 'AGROPATRIA',
    estado: 'FALCÓN',
    municipio: 'CORO',
    participo: 'NO',
    fechaHoraReporte: null,
    esForaneo: true,
    observaciones: 'ASIGNADO A OPERACIONES EN CORO'
  },
  {
    id: '82145698',
    nacionalidad: 'E',
    cedula: '82145698',
    apellidosNombres: 'DA SILVA SANTOS JOAO PAULO',
    telefono: '0414-9874563',
    institucion: 'CIARA (FUNDACIÓN DE CAPACITACIÓN E INNOVACIÓN PARA APOYAR LA REVOLUCIÓN AGRARIA)',
    estado: 'LARA',
    municipio: 'IRIBARREN',
    participo: 'SÍ',
    fechaHoraReporte: '2026-10-18 10:45:00',
    esForaneo: false
  }
];
