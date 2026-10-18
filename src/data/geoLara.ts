export interface MunicipalityMeta {
  id: string;
  nombre: string;
  capital: string;
  colorBase: string;
  colorBorder: string;
  svgPath: string;
  labelPos: { x: number; y: number };
  aliases?: string[];
}

export const LARA_MUNICIPALITIES: MunicipalityMeta[] = [
  {
    id: 'URDANETA',
    nombre: 'Urdaneta',
    capital: 'Siquisique',
    colorBase: '#ECC84E',
    colorBorder: '#C6A124',
    svgPath: 'M 290 85 L 350 45 L 490 35 L 610 50 L 685 70 L 730 110 L 760 170 L 675 220 L 600 240 L 585 285 L 535 240 L 450 250 L 370 215 L 290 175 Z',
    labelPos: { x: 530, y: 140 },
    aliases: ['URDANETA', 'SIQUISIQUE']
  },
  {
    id: 'TORRES',
    nombre: 'Torres',
    capital: 'Carora',
    colorBase: '#A77651',
    colorBorder: '#7E5331',
    svgPath: 'M 290 85 L 290 175 L 370 215 L 450 250 L 535 240 L 525 320 L 475 350 L 460 480 L 400 485 L 340 595 L 305 600 L 290 540 L 235 550 L 205 635 L 145 640 L 75 540 L 80 500 L 155 520 L 175 425 L 285 410 L 155 350 L 120 280 L 195 240 L 225 155 Z',
    labelPos: { x: 310, y: 350 },
    aliases: ['TORRES', 'CARORA']
  },
  {
    id: 'CRESPO',
    nombre: 'Crespo',
    capital: 'Duaca',
    colorBase: '#3B82C4',
    colorBorder: '#235D96',
    svgPath: 'M 685 70 L 760 170 L 775 245 L 770 330 L 710 375 L 665 340 L 660 250 L 675 220 Z',
    labelPos: { x: 720, y: 240 },
    aliases: ['CRESPO', 'DUACA']
  },
  {
    id: 'IRIBARREN',
    nombre: 'Iribarren',
    capital: 'Barquisimeto',
    colorBase: '#5FA85A',
    colorBorder: '#3C7E38',
    svgPath: 'M 535 240 L 585 285 L 600 240 L 675 220 L 660 250 L 665 340 L 710 375 L 690 440 L 640 450 L 580 540 L 550 540 L 560 450 L 485 450 L 525 320 Z',
    labelPos: { x: 610, y: 380 },
    aliases: ['IRIBARREN', 'BARQUISIMETO']
  },
  {
    id: 'PALAVECINO',
    nombre: 'Palavecino',
    capital: 'Cabudare',
    colorBase: '#5C9CD2',
    colorBorder: '#3773A6',
    svgPath: 'M 710 375 L 735 480 L 665 545 L 640 450 L 690 440 Z',
    labelPos: { x: 685, y: 470 },
    aliases: ['PALAVECINO', 'CABUDARE']
  },
  {
    id: 'SIMON_PLANAS',
    nombre: 'Simón Planas',
    capital: 'Sarare',
    colorBase: '#DC4F45',
    colorBorder: '#A6332B',
    svgPath: 'M 665 545 L 735 480 L 785 530 L 815 560 L 795 650 L 775 665 L 700 660 L 665 590 Z',
    labelPos: { x: 740, y: 590 },
    aliases: ['SIMÓN PLANAS', 'SIMON PLANAS', 'SARARE', 'SIMON_PLANAS']
  },
  {
    id: 'JIMENEZ',
    nombre: 'Jiménez',
    capital: 'Quíbor',
    colorBase: '#CF3D3B',
    colorBorder: '#9E2422',
    svgPath: 'M 525 320 L 560 450 L 550 540 L 600 680 L 555 700 L 530 630 L 490 600 L 485 450 Z',
    labelPos: { x: 535, y: 530 },
    aliases: ['JIMÉNEZ', 'JIMENEZ', 'QUIBOR', 'QUÍBOR']
  },
  {
    id: 'ANDRES_ELOY_BLANCO',
    nombre: 'Andrés Eloy Blanco',
    capital: 'Sanare',
    colorBase: '#F3D352',
    colorBorder: '#C2A123',
    svgPath: 'M 550 540 L 580 540 L 640 450 L 665 545 L 665 590 L 640 680 L 580 770 L 505 770 L 530 630 L 555 700 L 600 680 Z',
    labelPos: { x: 585, y: 700 },
    aliases: ['ANDRÉS ELOY BLANCO', 'ANDRES ELOY BLANCO', 'ANDRÉS E BLANCO', 'ANDRES E BLANCO', 'SANARE', 'A E BLANCO', 'ANDRES_ELOY_BLANCO']
  },
  {
    id: 'MORAN',
    nombre: 'Morán',
    capital: 'El Tocuyo',
    colorBase: '#A67650',
    colorBorder: '#784E2F',
    svgPath: 'M 485 450 L 490 600 L 530 630 L 505 770 L 480 870 L 430 870 L 350 780 L 375 700 L 340 595 L 400 485 L 460 480 Z',
    labelPos: { x: 440, y: 670 },
    aliases: ['MORÁN', 'MORAN', 'EL TOCUYO', 'TOCUYO']
  }
];

/**
 * Normaliza cualquier texto geográfico para comparaciones tolerantes
 * (elimina acentos, guiones bajos, mayúsculas y espacios duplicados)
 */
export function normalizeGeoText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

/**
 * Compara y valida si el municipio de un trabajador coincide con el filtro seleccionado
 * Resuelve discrepancias como SIMON_PLANAS vs 'SIMÓN PLANAS', ANDRES_ELOY_BLANCO vs 'ANDRÉS E BLANCO', JIMENEZ vs 'JIMÉNEZ'
 */
export function matchMunicipio(rawWorkerMunicipio: string | null | undefined, filterMunicipio: string | null | undefined): boolean {
  if (!filterMunicipio || filterMunicipio.trim() === '' || filterMunicipio === 'TODOS') return true;
  if (!rawWorkerMunicipio || rawWorkerMunicipio.trim() === '') return false;

  const cleanWorker = normalizeGeoText(rawWorkerMunicipio);
  const cleanFilter = normalizeGeoText(filterMunicipio);

  if (!cleanFilter) return true;
  if (cleanWorker === cleanFilter) return true;

  // Comparación contra la estructura de municipios y sus variantes/capitales
  for (const mun of LARA_MUNICIPALITIES) {
    const isTarget =
      cleanFilter === normalizeGeoText(mun.id) ||
      cleanFilter === normalizeGeoText(mun.nombre) ||
      (mun.aliases && mun.aliases.some(a => normalizeGeoText(a) === cleanFilter));

    if (isTarget) {
      if (
        cleanWorker === normalizeGeoText(mun.id) ||
        cleanWorker === normalizeGeoText(mun.nombre) ||
        (mun.aliases && mun.aliases.some(a => normalizeGeoText(a) === cleanWorker))
      ) {
        return true;
      }

      // Coincidencias específicas para nombres compuestos en el padrón
      if (mun.id === 'ANDRES_ELOY_BLANCO' && (cleanWorker.includes('ANDRES') || cleanWorker.includes('SANARE'))) {
        return true;
      }
      if (mun.id === 'SIMON_PLANAS' && (cleanWorker.includes('SIMON') || cleanWorker.includes('SARARE'))) {
        return true;
      }
      if (mun.id === 'JIMENEZ' && (cleanWorker.includes('JIMENEZ') || cleanWorker.includes('QUIBOR'))) {
        return true;
      }
      if (mun.id === 'MORAN' && (cleanWorker.includes('MORAN') || cleanWorker.includes('TOCUYO'))) {
        return true;
      }
    }
  }

  return cleanWorker.includes(cleanFilter) || cleanFilter.includes(cleanWorker);
}

export const VENEZUELA_STATES = [
  'LARA',
  'AMAZONAS',
  'ANZOÁTEGUI',
  'APURE',
  'ARAGUA',
  'BARINAS',
  'BOLÍVAR',
  'CARABOBO',
  'COJEDES',
  'DELTA AMACURO',
  'DISTRITO CAPITAL',
  'FALCÓN',
  'GUÁRICO',
  'LA GUAIRA',
  'MÉRIDA',
  'MIRANDA',
  'MONAGAS',
  'NUEVA ESPARTA',
  'PORTUGUESA',
  'SUCRE',
  'TÁCHIRA',
  'TRUJILLO',
  'YARACUY',
  'ZULIA'
];

export const MPPAPT_ENTITIES = [
  'AGROPATRIA',
  'BANCO AGRÍCOLA DE VENEZUELA (BAV)',
  'CORPORACIÓN DE DESARROLLO AGRÍCOLA C.A. (DELAGRO)',
  'CVA AZÚCAR',
  'CVA CAFÉ',
  'EMPRESA INTEGRAL DE PRODUCCIÓN AGRARIA SOCIALISTA VALLE DE QUIBOR S.A. (EIPASVQ)',
  'EMPRESA SOCIALISTA DE MECANIZADO PEDRO CAMEJO',
  'FIBRAVENSA',
  'FONDO PARA EL DESARROLLO AGRARIO SOCIALISTA (FONDAS/ORF LARA)',
  'INSTITUTO NACIONAL DE DESARROLLO RURAL (INDER)',
  'INSTITUTO NACIONAL DE INVESTIGACIONES AGRÍCOLAS (INIA)',
  'INSTITUTO NACIONAL DE SALUD AGRÍCOLA INTEGRAL (INSAI)',
  'INSTITUTO NACIONAL DE TIERRAS (INTI/ORT LARA)',
  'PORCINOS DEL ALBA',
  'UTA LARA (MPPAPT)'
];
