import type {Scene} from './model';

export const sceneTones = ['Todas', 'Aventura', 'Tensión', 'Cotidiano'] as const;
export type SceneTone = typeof sceneTones[number];
type PresetScene = Scene & {tone: Exclude<SceneTone, 'Todas'>};

export const examples: PresetScene[] = [
  {
    id: 'investigation', tone: 'Tensión', art: 'investigation', name: 'Investigación',
    description: 'Música sin percusión · cavernas',
    tracks: [
      {trackId: 'km-controlled-chaos-soft', volume: .34},
      {trackId: 'dungeon-air', volume: .36},
      {trackId: 'radio', volume: .07},
    ],
  },
  {
    id: 'threat', tone: 'Tensión', art: 'threat', name: 'Amenaza cercana',
    description: 'Piano grave · textura oscura · latido',
    tracks: [
      {trackId: 'km-long-note-two', volume: .32},
      {trackId: 'underground', volume: .26},
      {trackId: 'heartbeat', volume: .22},
    ],
  },
  {
    id: 'chase', tone: 'Tensión', art: 'city', name: 'Persecución',
    description: 'Música con percusión · calle · motor',
    tracks: [
      {trackId: 'km-controlled-chaos', volume: .36},
      {trackId: 'city', volume: .24},
      {trackId: 'engine', volume: .14},
    ],
  },
  {
    id: 'combat', tone: 'Tensión', art: 'battle', name: 'Combate',
    description: 'Percusión · piano y coro',
    tracks: [
      {trackId: 'war-drums', volume: .46},
      {trackId: 'dissonance', volume: .2},
      {trackId: 'storm', volume: .14},
    ],
  },
  {
    id: 'catacombs', tone: 'Tensión', art: 'dungeon', name: 'Catacumbas',
    description: 'Textura electrónica · cavernas',
    tracks: [
      {trackId: 'km-gathering-darkness', volume: .28},
      {trackId: 'dungeon-air', volume: .28},
      {trackId: 'underground', volume: .2},
    ],
  },
  {
    id: 'space', tone: 'Tensión', art: 'space', name: 'Nave a la deriva',
    description: 'Motor · interferencias · música oscura',
    tracks: [
      {trackId: 'engine', volume: .25},
      {trackId: 'km-long-note-three', volume: .32},
      {trackId: 'radio', volume: .17},
    ],
  },
  {
    id: 'tavern', tone: 'Cotidiano', art: 'tavern', name: 'Taberna',
    description: 'Conversaciones · fuego · lluvia',
    tracks: [
      {trackId: 'coffee-shop', volume: .38},
      {trackId: 'fireplace', volume: .52},
      {trackId: 'rain', volume: .18},
    ],
  },
  {
    id: 'forest', tone: 'Cotidiano', art: 'forest', name: 'Bosque',
    description: 'Pájaros · arroyo · viento',
    tracks: [
      {trackId: 'birds', volume: .48},
      {trackId: 'stream', volume: .26},
      {trackId: 'wind', volume: .16},
    ],
  },
  {
    id: 'journey', art: 'mountains', name: 'Camino abierto', tone: 'Aventura',
    description: 'Melodía medieval · pájaros · viento',
    tracks: [
      {trackId: 'km-lord-of-the-land', volume: 0.32},
      {trackId: 'birds', volume: 0.24},
      {trackId: 'wind', volume: 0.16},
    ],
  },
  {
    id: 'discovery', art: 'ruins', name: 'Ruinas olvidadas', tone: 'Aventura',
    description: 'Melodía celta · agua · viento',
    tracks: [
      {trackId: 'km-hidden-past', volume: 0.32},
      {trackId: 'stream', volume: 0.16},
      {trackId: 'wind', volume: 0.12},
    ],
  },
  {
    id: 'harbor', art: 'coast', name: 'Puerto de partida', tone: 'Aventura',
    description: 'Viaje · oleaje · madera del barco',
    tracks: [
      {trackId: 'km-ascending-the-vale', volume: 0.32},
      {trackId: 'waves', volume: 0.23},
      {trackId: 'boat', volume: 0.18},
    ],
  },
  {
    id: 'camp', art: 'fire', name: 'Relatos junto al fuego', tone: 'Aventura',
    description: 'Cuerdas pulsadas · hoguera · noche',
    tracks: [
      {trackId: 'km-teller-of-the-tales', volume: 0.32},
      {trackId: 'fireplace', volume: 0.32},
      {trackId: 'summer-night', volume: 0.18},
    ],
  },
  {
    id: 'enchanted', art: 'forest', name: 'Bosque encantado', tone: 'Aventura',
    description: 'Fantasía · pájaros · arroyo',
    tracks: [
      {trackId: 'km-magic-forest', volume: 0.3},
      {trackId: 'birds', volume: 0.22},
      {trackId: 'stream', volume: 0.2},
    ],
  },
  {
    id: 'heroic', art: 'battle', name: 'La última carga', tone: 'Aventura',
    description: 'Orquesta heroica · viento · tormenta lejana',
    tracks: [
      {trackId: 'km-heroic-age', volume: 0.38},
      {trackId: 'wind', volume: 0.16},
      {trackId: 'storm', volume: 0.1},
    ],
  },
  {
    id: 'ritual', art: 'interior', name: 'El ritual', tone: 'Tensión',
    description: 'Acordes graves · resonancia subterránea',
    tracks: [
      {trackId: 'km-rites', volume: 0.34},
      {trackId: 'cave-resonance', volume: 0.19},
      {trackId: 'presence', volume: 0.12},
    ],
  },
  {
    id: 'aftermath', art: 'night', name: 'Después de la batalla', tone: 'Tensión',
    description: 'Música sombría · viento · fuego',
    tracks: [
      {trackId: 'km-oppressive-gloom', volume: 0.32},
      {trackId: 'wind', volume: 0.22},
      {trackId: 'fireplace', volume: 0.15},
    ],
  },
];

const order = ['investigation','journey','threat','discovery','chase','heroic','tavern','forest','harbor','camp','enchanted','combat','catacombs','space','ritual','aftermath'];
examples.sort((a,b) => order.indexOf(a.id)-order.indexOf(b.id));
export function scenesForTone(tone: SceneTone) {
  return examples.filter(scene => tone === 'Todas' || scene.tone === tone);
}
