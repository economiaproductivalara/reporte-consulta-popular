export interface MunicipalityMeta {
  id: string;
  nombre: string;
  capital: string;
  colorBase: string;
  colorBorder: string;
  svgPath: string;
  labelPos: { x: number; y: number };
}

export const LARA_MUNICIPALITIES: MunicipalityMeta[] = [
  {
    id: 'URDANETA',
    nombre: 'Urdaneta',
    capital: 'Siquisique',
    colorBase: '#ECC84E', // Yellow
    colorBorder: '#C6A124',
    // Realistic polygon approximation based on political map top center/north
    svgPath: 'M 290 85 L 350 45 L 490 35 L 610 50 L 685 70 L 730 110 L 760 170 L 675 220 L 600 240 L 585 285 L 535 240 L 450 250 L 370 215 L 290 175 Z',
    labelPos: { x: 530, y: 140 }
  },
  {
    id: 'TORRES',
    nombre: 'Torres',
    capital: 'Carora',
    colorBase: '#A77651', // Brown ochre
    colorBorder: '#7E5331',
    // Big western municipality
    svgPath: 'M 290 85 L 290 175 L 370 215 L 450 250 L 535 240 L 525 320 L 475 350 L 460 480 L 400 485 L 340 595 L 305 600 L 290 540 L 235 550 L 205 635 L 145 640 L 75 540 L 80 500 L 155 520 L 175 425 L 285 410 L 155 350 L 120 280 L 195 240 L 225 155 Z',
    labelPos: { x: 310, y: 350 }
  },
  {
    id: 'CRESPO',
    nombre: 'Crespo',
    capital: 'Duaca',
    colorBase: '#3B82C4', // Blue
    colorBorder: '#235D96',
    // Northeast municipality
    svgPath: 'M 685 70 L 760 170 L 775 245 L 770 330 L 710 375 L 665 340 L 660 250 L 675 220 Z',
    labelPos: { x: 720, y: 240 }
  },
  {
    id: 'IRIBARREN',
    nombre: 'Iribarren',
    capital: 'Barquisimeto',
    colorBase: '#5FA85A', // Green
    colorBorder: '#3C7E38',
    // Central urban municipality
    svgPath: 'M 535 240 L 585 285 L 600 240 L 675 220 L 660 250 L 665 340 L 710 375 L 690 440 L 640 450 L 580 540 L 550 540 L 560 450 L 485 450 L 525 320 Z',
    labelPos: { x: 610, y: 380 }
  },
  {
    id: 'PALAVECINO',
    nombre: 'Palavecino',
    capital: 'Cabudare',
    colorBase: '#5C9CD2', // Light Blue
    colorBorder: '#3773A6',
    // East of Iribarren
    svgPath: 'M 710 375 L 735 480 L 665 545 L 640 450 L 690 440 Z',
    labelPos: { x: 685, y: 470 }
  },
  {
    id: 'SIMON_PLANAS',
    nombre: 'Simón Planas',
    capital: 'Sarare',
    colorBase: '#DC4F45', // Reddish coral
    colorBorder: '#A6332B',
    // Southeast arm
    svgPath: 'M 665 545 L 735 480 L 785 530 L 815 560 L 795 650 L 775 665 L 700 660 L 665 590 Z',
    labelPos: { x: 740, y: 590 }
  },
  {
    id: 'JIMENEZ',
    nombre: 'Jiménez',
    capital: 'Quíbor',
    colorBase: '#CF3D3B', // Red
    colorBorder: '#9E2422',
    // South central
    svgPath: 'M 525 320 L 560 450 L 550 540 L 600 680 L 555 700 L 530 630 L 490 600 L 485 450 Z',
    labelPos: { x: 535, y: 530 }
  },
  {
    id: 'ANDRES_ELOY_BLANCO',
    nombre: 'Andrés Eloy Blanco',
    capital: 'Sanare',
    colorBase: '#F3D352', // Yellow
    colorBorder: '#C2A123',
    // South of Jiménez
    svgPath: 'M 550 540 L 580 540 L 640 450 L 665 545 L 665 590 L 640 680 L 580 770 L 505 770 L 530 630 L 555 700 L 600 680 Z',
    labelPos: { x: 585, y: 700 }
  },
  {
    id: 'MORAN',
    nombre: 'Morán',
    capital: 'El Tocuyo',
    colorBase: '#A67650', // Brown
    colorBorder: '#784E2F',
    // Southwest
    svgPath: 'M 485 450 L 490 600 L 530 630 L 505 770 L 480 870 L 430 870 L 350 780 L 375 700 L 340 595 L 400 485 L 460 480 Z',
    labelPos: { x: 440, y: 670 }
  }
];

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
  'MPPAPT SEDE CENTRAL LARA',
  'INTI (INSTITUTO NACIONAL DE TIERRAS)',
  'INSAI (INSTITUTO NACIONAL DE SALUD AGRÍCOLA INTEGRAL)',
  'CIARA (FUNDACIÓN DE CAPACITACIÓN E INNOVACIÓN PARA APOYAR LA REVOLUCIÓN AGRARIA)',
  'INDER (INSTITUTO NACIONAL DE DESARROLLO RURAL)',
  'BANCO AGRÍCOLA DE VENEZUELA (BAV)',
  'FONDAS (FONDO PARA EL DESARROLLO AGRARIO SOCIALISTA)',
  'AGROPATRIA',
  'PESCALBA',
  'CORPOLARA (GERENCIA AGRÍCOLA)'
];
