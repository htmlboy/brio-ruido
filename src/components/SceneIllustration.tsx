import type {ReactNode} from 'react';
import type {SceneArtId} from '../sceneArt';

const palettes: Record<SceneArtId, [string, string, string]> = {
 investigation: ['#252c31', '#576168', '#d9b16c'],
 threat: ['#292326', '#60524b', '#c66548'],
 city: ['#222d38', '#486371', '#dfa467'],
 battle: ['#342b27', '#695345', '#c99c65'],
 dungeon: ['#242c2d', '#53645f', '#b6aa78'],
 space: ['#242734', '#575f78', '#bab8ce'],
 tavern: ['#382c25', '#795b42', '#e4b878'],
 forest: ['#26352e', '#587159', '#b6bf86'],
 rain: ['#25333b', '#5a7781', '#b8cbd0'],
 coast: ['#2e3b40', '#638384', '#d7c7a0'],
 mountains: ['#303a42', '#70828b', '#cfcec0'],
 ruins: ['#34382e', '#7b8063', '#c2b28c'],
 fire: ['#292d2b', '#596048', '#e5a268'],
 interior: ['#34312e', '#7c7262', '#d0ba87'],
 night: ['#252c39', '#536377', '#c7caba'],
 abstract: ['#2b3033', '#657075', '#b6b4a2'],
};

function subject(art: SceneArtId, mid: string, light: string): ReactNode {
 switch (art) {
  case 'investigation': return <>
   <path d="M40 145h249v35H40z" fill="#151c21"/><path d="m78 148 17-88h7l-8 88m5-88 80-23 4 8-80 24" fill={mid}/>
   <path d="m159 29 48 13-12 39-54-16z" fill={light}/><path d="m153 72 48 4 38 70-124-1z" fill={light} opacity=".11"/>
   <path d="m112 132 86-17 32 34-98 10z" fill="#adab96"/><path d="m133 134 43-8m-35 17 51-10" stroke="#686b61" strokeWidth="3"/>
   <path d="M240 120h22v24h-22z" fill={mid}/><path d="M263 124h7v12h-7" fill="none" stroke={mid} strokeWidth="4"/>
  </>;
  case 'threat': return <>
   <path d="M63 180V25h190v155z" fill={mid}/><path d="M81 180V43h153v137z" fill="#121719"/>
   <path d="m81 180 55-22V43H81z" fill="#332c2b"/><path d="m137 180 23-81 22 2 25 79" fill="#202121"/>
   <ellipse cx="171" cy="82" rx="16" ry="20" fill="#202121"/><circle cx="189" cy="47" r="5" fill={light}/>
   <path d="m82 180 72-15 73 15" fill={light} opacity=".13"/>
  </>;
  case 'city': return <>
   <path d="M0 180V51h48v129M52 180V23h56v157m106 0V39h53v141m7 0V64h46v116" fill="#19242e"/>
   <path d="m93 180 54-84h23l67 84" fill={mid}/><path d="m160 121 1 15m2 13 2 22" stroke={light} strokeWidth="4"/>
   <path d="M20 71h8m-8 22h8m42-47h10m0 25h10m148-15h9m-9 23h9m46 7h10" stroke={light} strokeWidth="5" opacity=".75"/>
   <path d="m116 155 10-23h38l16 23v18h-64z" fill="#1a242c"/><path d="M122 157h9m31 0h10" stroke={light} strokeWidth="5"/>
  </>;
  case 'battle': return <>
   <path d="M0 162 50 145 104 153 157 128 208 142 268 127 320 153v27H0" fill="#242723"/>
   <path d="m94 158 59-111m26 111-41-106" stroke={mid} strokeWidth="8"/><path d="m144 60 18-34 3 39-14 15m-19-13-8-37-7 31 7 24" fill={light}/>
   <path d="m73 107 47-18 43 23-6 42-32 24-37-18z" fill={mid} stroke="#282b27" strokeWidth="5"/><path d="m89 111 34-11 23 16-3 30-20 14-24-12z" fill="#38382e"/>
   <path d="M227 159V42m-2 0h44l-18 20 18 17h-42" stroke={mid} strokeWidth="5" fill={mid}/>
  </>;
  case 'dungeon': return <>
   <path d="M25 180V78q0-65 65-65t65 65v102m24 0V91q0-44 44-44t44 44v89" fill="#152222"/>
   <path d="M25 180V78q0-65 65-65t65 65v102m24 0V91q0-44 44-44t44 44v89" fill="none" stroke={mid} strokeWidth="13"/>
   <path d="M66 180v-19h25v-16h27v-16h29v-16h35v67" fill={mid} opacity=".5"/>
   <path d="M287 85v37" stroke={mid} strokeWidth="6"/><path d="m279 90 8-24 10 24-10 12" fill={light}/>
   <path d="M11 50h24M143 47h22m99 82h21M12 121h20" stroke="#253837" strokeWidth="4"/>
  </>;
  case 'space': return <>
   <circle cx="235" cy="75" r="44" fill={mid}/><path d="M217 35a44 44 0 0 1 0 80 44 44 0 0 0 0-80" fill={light} opacity=".16"/>
   <ellipse cx="232" cy="81" rx="79" ry="12" transform="rotate(-24 232 81)" fill="none" stroke={light} strokeWidth="2" opacity=".7"/>
   <path d="m46 112 49-21 25 11-24 4-8 25-11-19z" fill={light}/><path d="m75 112-19 15 14-20" fill={mid}/>
   {[27,65,112,157,178,292].map((x,i)=><circle key={x} cx={x} cy={28+(i*29)%116} r="1.5" fill={light}/>)}
   <path d="M0 174 54 151 119 169 182 148 259 171 320 145v35H0" fill="#19212b"/>
  </>;
  case 'tavern': return <>
   <path d="M23 155V65q0-42 42-42t42 42v90m20 0V65q0-42 42-42t42 42v90m20 0V65q0-32 32-32t32 32v90" fill="#251f1b" stroke={mid} strokeWidth="8"/>
   <path d="M9 151h302v29H9" fill="#201e19"/><path d="M47 151v-30m124 30v-30m92 30v-30" stroke={light} strokeWidth="5"/>
   <path d="m42 119 5-14 5 14m114 0 5-14 5 14m82 0 5-14 5 14" fill={light}/><path d="M94 132h23v18H94z" fill={mid}/>
  </>;
  case 'forest': return <>
   <path d="m-20 151 61-104 59 104 60-128 66 128 54-117 65 117v29H0" fill={mid} opacity=".75"/>
   <path d="m-12 180 62-107 62 107m35 0 67-145 66 145m-48 0 58-100 60 100" fill="#1a2b25"/>
   <path d="m123 180 34-41-6-27 16 26 38 42" fill={light} opacity=".17"/><path d="M54 18v145m161-158v162" stroke="#21372b" strokeWidth="9"/>
  </>;
  case 'rain': return <>
   <path d="M38 15h244v151H38z" fill="#18262c" stroke={mid} strokeWidth="8"/><path d="M161 16v149M40 91h242" stroke={mid} strokeWidth="6"/>
   <path d="m70 34-8 24m53-14-9 30m91-43-7 24m53-12-8 27m-157 43-8 26m57-17-8 29m70-39-9 27m57-13-6 21" stroke={light} strokeWidth="2" opacity=".55"/>
   <path d="M21 169h278v11H21" fill="#15212a"/>
  </>;
  case 'coast': return <>
   <circle cx="236" cy="49" r="24" fill={light} opacity=".65"/><path d="M0 103q40-13 80 0t80 0 80 0 80 0v77H0" fill={mid}/>
   <path d="M0 135q40-13 80 0t80 0 80 0 80 0v45H0" fill="#36565f"/><path d="M0 163q50-10 100 0t100 0 120 0" fill="none" stroke={light} strokeWidth="2" opacity=".5"/>
   <path d="m76 131 19-56 23 56zm-10 7h62l-12 12H77z" fill="#243c44"/><path d="M0 180v-26l41-10 23 36m199 0 29-43 28 12v31" fill="#253b3c"/>
  </>;
  case 'mountains': return <>
   <path d="m-10 153 88-111 78 111 55-132 119 132v27H0" fill={mid}/><path d="m50 77 28-35 27 38-24-9-11 10m122-14 19-46 44 49-28-10-16 12" fill={light} opacity=".85"/>
   <path d="m-10 180 66-65 89 41 42-42 86 66m-115 0 90-91 82 91" fill="#34464d"/><path d="M0 142h320m-320 15h260" stroke={light} opacity=".08" strokeWidth="11"/>
  </>;
  case 'ruins': return <>
   <path d="M61 158V64h31v94m82 0V64h30v94M50 59h164V39H50m9 119h43v15H59m104-15h51v15h-51" fill={mid}/>
   <path d="m61 39 60-27 93 27m-100 20 12 18-13 18 9 21" fill="none" stroke="#30382c" strokeWidth="6"/>
   <path d="m243 164-16-55 23-7 23 52m-47-46 31-8 6 12-36 10" fill={mid}/><path d="m0 180 41-14 55 8 61-13 70 14 62-8 31 13" fill="#25362b"/>
   <path d="m70 150 4-35 9-15m106 51-1-24 8-10" stroke={light} opacity=".4" strokeWidth="3" fill="none"/>
  </>;
  case 'fire': return <>
   <path d="m0 144 43-54 45 54 59-81 60 81 64-57 49 57v36H0" fill={mid} opacity=".4"/>
   <path d="m25 180 39-77 38 77m135 0 44-91 43 91" fill="#1d3029"/>
   <path d="m120 165 64-10m-63 0 64 12" stroke={mid} strokeWidth="8" strokeLinecap="round"/>
   <path d="M137 151q-20-24 4-44-4 20 10 20 10-18 5-42 45 41 14 66z" fill={light}/><path d="M148 153q-13-13 8-34 17 19 8 34" fill="#f4d09a"/>
   <path d="M90 31h2m58 8h2m68-19h2m38 34h2" stroke={light} strokeWidth="2"/>
  </>;
  case 'interior': return <>
   <path d="M174 22h103v110H174z" fill="#25383b" stroke={mid} strokeWidth="7"/><path d="M226 23v108m-50-55h100" stroke={mid} strokeWidth="4"/>
   <path d="M23 145h274v12H23m25 0v23m227-23v23" stroke="#242827" strokeWidth="8"/>
   <path d="M71 142V94m-17 49h35m-28-48 5-42h27l8 42z" stroke={mid} strokeWidth="5" fill={light}/>
   <path d="m130 133 34-5 20 11-36 7z" fill={mid}/><path d="M185 145v-21h24v21" fill="#434c47"/>
  </>;
  case 'night': return <>
   <path d="M241 26a25 25 0 1 0 17 44 25 25 0 0 1-17-44" fill={light}/>
   <path d="M0 171v-36l31-25 29 25v36m3 0v-51l38-31 36 31v51m47 0v-42l33-28 34 28v42m4 0v-31l29-27 36 27v31" fill={mid} opacity=".7"/>
   <path d="M0 180v-22l65-20 74 20 63-17 118 25v14" fill="#202c38"/>
   <path d="M84 127h13v16H84m125-10h12v16h-12" fill={light} opacity=".65"/>
   {[37,76,121,158,282].map((x,i)=><circle key={x} cx={x} cy={24+(i*23)%65} r="1.4" fill={light}/>)}
  </>;
  case 'abstract': return <>
   <path d="M0 111h320M0 139h320M0 167h320M36 180l86-69m24 69 14-69m96 69-59-69" stroke={mid} opacity=".4" strokeWidth="2"/>
   <circle cx="163" cy="77" r="39" fill="none" stroke={light} strokeWidth="3"/>
   <path d="m163 32 40 45-40 45-40-45z" fill={mid}/><path d="m163 44 29 33-29 33-29-33z" fill="#2b3033"/>
  </>;
 }
}

/** The adjacent scene name supplies the accessible label; artwork is decorative. */
export function SceneIllustration({art, className = ''}: {art: SceneArtId; className?: string}) {
 const [background, mid, light] = palettes[art];
 return <span className={`scene-illustration ${className}`} aria-hidden="true">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" focusable="false">
   <path fill={background} d="M0 0h320v180H0z"/>
   {subject(art, mid, light)}
  </svg>
 </span>;
}
