/**
 * Metadata and helper definitions for CIFAR-10 classes.
 */

export interface CifarClassDef {
  index: number;
  label: string;
  nameEn: string;
  namePt: string;
  emoji: string;
  category: 'vehicle' | 'animal';
  accentColor: string;
  description: string;
}

export const CIFAR10_CLASSES: CifarClassDef[] = [
  {
    index: 0,
    label: 'airplane',
    nameEn: 'Airplane',
    namePt: 'Avião',
    emoji: '✈️',
    category: 'vehicle',
    accentColor: '#38bdf8', // sky-400
    description: 'Aeronaves de transporte e aviação civil ou militar.',
  },
  {
    index: 1,
    label: 'automobile',
    nameEn: 'Automobile',
    namePt: 'Automóvel',
    emoji: '🚗',
    category: 'vehicle',
    accentColor: '#ef4444', // red-500
    description: 'Veículos de passeio, sedãs, hatchbacks e SUVs.',
  },
  {
    index: 2,
    label: 'bird',
    nameEn: 'Bird',
    namePt: 'Pássaro',
    emoji: '🐦',
    category: 'animal',
    accentColor: '#10b981', // emerald-500
    description: 'Aves de diversos tamanhos, espécies e habitats.',
  },
  {
    index: 3,
    label: 'cat',
    nameEn: 'Cat',
    namePt: 'Gato',
    emoji: '🐱',
    category: 'animal',
    accentColor: '#f59e0b', // amber-500
    description: 'Felinos domésticos em variadas poses e iluminações.',
  },
  {
    index: 4,
    label: 'deer',
    nameEn: 'Deer',
    namePt: 'Cervo',
    emoji: '🦌',
    category: 'animal',
    accentColor: '#84cc16', // lime-500
    description: 'Cervos, veados e animais silvestres de chifres.',
  },
  {
    index: 5,
    label: 'dog',
    nameEn: 'Dog',
    namePt: 'Cachorro',
    emoji: '🐶',
    category: 'animal',
    accentColor: '#ec4899', // pink-500
    description: 'Caninos domésticos de múltiplas raças e portes.',
  },
  {
    index: 6,
    label: 'frog',
    nameEn: 'Frog',
    namePt: 'Sapo',
    emoji: '🐸',
    category: 'animal',
    accentColor: '#22c55e', // green-500
    description: 'Anfíbios anuros, sapos, rãs e pererecas.',
  },
  {
    index: 7,
    label: 'horse',
    nameEn: 'Horse',
    namePt: 'Cavalo',
    emoji: '🐴',
    category: 'animal',
    accentColor: '#d97706', // amber-600
    description: 'Equinos em pastagens, campos e ambientes rurais.',
  },
  {
    index: 8,
    label: 'ship',
    nameEn: 'Ship',
    namePt: 'Navio',
    emoji: '🚢',
    category: 'vehicle',
    accentColor: '#06b6d4', // cyan-500
    description: 'Embarcações marinhas, navios de carga, cruzeiros e barcos.',
  },
  {
    index: 9,
    label: 'truck',
    nameEn: 'Truck',
    namePt: 'Caminhão',
    emoji: '🚚',
    category: 'vehicle',
    accentColor: '#8b5cf6', // purple-500
    description: 'Veículos pesados de transporte rodoviário e frete.',
  },
];

export const getClassByIndex = (index: number): CifarClassDef => {
  return CIFAR10_CLASSES[index] ?? CIFAR10_CLASSES[0];
};

export const getClassByLabel = (label: string): CifarClassDef | undefined => {
  return CIFAR10_CLASSES.find((c) => c.label.toLowerCase() === label.toLowerCase());
};
