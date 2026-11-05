import {SCENE_ARTWORKS, type SceneArtId} from '../sceneArt';
import {SceneIllustration} from './SceneIllustration';

export function SceneArtPicker({value, onChange}: {value: SceneArtId; onChange: (art: SceneArtId) => void}) {
 return <fieldset className="art-picker">
  <legend>Ilustración</legend>
  <div className="art-options">
   {SCENE_ARTWORKS.map(art => <label key={art.id} className={`art-option ${value === art.id ? 'selected' : ''}`}>
    <input type="radio" name="scene-art" value={art.id} checked={value === art.id} onChange={() => onChange(art.id)}/>
    <SceneIllustration art={art.id}/>
    <span className="art-option-name">{art.label}</span>
   </label>)}
  </div>
 </fieldset>;
}
