import type {Scene} from './model';

export const examples: Scene[] = [
  {
    id: 'investigation', art: 'investigation', name: 'Investigación',
    description: 'Música sin percusión · cavernas',
    tracks: [
      {trackId: 'km-controlled-chaos-soft', volume: .34},
      {trackId: 'dungeon-air', volume: .36},
      {trackId: 'radio', volume: .07},
    ],
  },
  {
    id: 'threat', art: 'threat', name: 'Amenaza cercana',
    description: 'Piano grave · textura oscura · latido',
    tracks: [
      {trackId: 'km-long-note-two', volume: .32},
      {trackId: 'underground', volume: .26},
      {trackId: 'heartbeat', volume: .22},
    ],
  },
  {
    id: 'chase', art: 'city', name: 'Persecución',
    description: 'Música con percusión · calle · motor',
    tracks: [
      {trackId: 'km-controlled-chaos', volume: .36},
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
    description: 'Textura electrónica · cavernas',
    tracks: [
      {trackId: 'km-gathering-darkness', volume: .28},
      {trackId: 'dungeon-air', volume: .28},
      {trackId: 'underground', volume: .2},
    ],
  },
  {
    id: 'space', art: 'space', name: 'Nave a la deriva',
    description: 'Motor · interferencias · música oscura',
    tracks: [
      {trackId: 'engine', volume: .25},
      {trackId: 'km-long-note-three', volume: .32},
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
