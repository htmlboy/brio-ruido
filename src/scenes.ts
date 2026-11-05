import type {Scene} from './model';

export const examples: Scene[] = [
  {
    id: 'investigation', art: 'investigation', name: 'Investigación',
    description: 'Dron industrial · cavernas',
    tracks: [
      {trackId: 'dark-sequence', volume: .3},
      {trackId: 'dungeon-air', volume: .36},
      {trackId: 'radio', volume: .07},
    ],
  },
  {
    id: 'threat', art: 'threat', name: 'Amenaza cercana',
    description: 'Cuerdas · textura oscura · latido',
    tracks: [
      {trackId: 'presence', volume: .36},
      {trackId: 'underground', volume: .26},
      {trackId: 'heartbeat', volume: .22},
    ],
  },
  {
    id: 'chase', art: 'city', name: 'Persecución',
    description: 'Ritmo a 120 BPM · calle · motor',
    tracks: [
      {trackId: 'pursuit', volume: .48},
      {trackId: 'city', volume: .24},
      {trackId: 'engine', volume: .14},
    ],
  },
  {
    id: 'combat', art: 'battle', name: 'Combate',
    description: 'Percusión · piano y coro',
    tracks: [
      {trackId: 'war-drums', volume: .46},
      {trackId: 'dissonance', volume: .2},
      {trackId: 'storm', volume: .14},
    ],
  },
  {
    id: 'catacombs', art: 'dungeon', name: 'Catacumbas',
    description: 'Viento espectral · cavernas',
    tracks: [
      {trackId: 'cave-resonance', volume: .34},
      {trackId: 'dungeon-air', volume: .28},
      {trackId: 'underground', volume: .2},
    ],
  },
  {
    id: 'space', art: 'space', name: 'Nave a la deriva',
    description: 'Motor · interferencias · fondo hostil',
    tracks: [
      {trackId: 'engine', volume: .25},
      {trackId: 'hostile', volume: .3},
      {trackId: 'radio', volume: .17},
    ],
  },
  {
    id: 'tavern', art: 'tavern', name: 'Taberna',
    description: 'Conversaciones · fuego · lluvia',
    tracks: [
      {trackId: 'coffee-shop', volume: .38},
      {trackId: 'fireplace', volume: .52},
      {trackId: 'rain', volume: .18},
    ],
  },
  {
    id: 'forest', art: 'forest', name: 'Bosque',
    description: 'Pájaros · arroyo · viento',
    tracks: [
      {trackId: 'birds', volume: .48},
      {trackId: 'stream', volume: .26},
      {trackId: 'wind', volume: .16},
    ],
  },
];
