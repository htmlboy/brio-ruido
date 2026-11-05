import type {Scene} from './model';

/** Original, bundled illustrations. IDs are persisted in scene exports. */
export const SCENE_ARTWORKS = [
  {id: 'investigation', label: 'Investigación'},
  {id: 'threat', label: 'Amenaza'},
  {id: 'city', label: 'Ciudad'},
  {id: 'battle', label: 'Combate'},
  {id: 'dungeon', label: 'Mazmorra'},
  {id: 'space', label: 'Espacio'},
  {id: 'tavern', label: 'Taberna'},
  {id: 'forest', label: 'Bosque'},
  {id: 'rain', label: 'Lluvia'},
  {id: 'coast', label: 'Costa'},
  {id: 'mountains', label: 'Montañas'},
  {id: 'ruins', label: 'Ruinas'},
  {id: 'fire', label: 'Campamento'},
  {id: 'interior', label: 'Interior'},
  {id: 'night', label: 'Noche'},
  {id: 'abstract', label: 'Sin tema'},
] as const;

export type SceneArtId = typeof SCENE_ARTWORKS[number]['id'];

/** Unknown IDs stay intact in saved data and render with a neutral fallback. */
export function sceneArtId(scene?: Pick<Scene, 'art'>): SceneArtId {
  return SCENE_ARTWORKS.find(art => art.id === scene?.art)?.id ?? 'abstract';
}
