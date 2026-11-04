import type {Scene} from './model';
export const examples:Scene[]=[
{id:'forest',name:'El bosque despierta',description:'Hojas, pájaros y un arroyo cercano.',art:'forest',tracks:[{trackId:'birds',volume:.48},{trackId:'stream',volume:.26},{trackId:'wind',volume:.16}]},
{id:'tavern',name:'La última taberna',description:'Un refugio cálido al final del camino.',art:'tavern',tracks:[{trackId:'coffee-shop',volume:.38},{trackId:'fireplace',volume:.52},{trackId:'rain',volume:.18}]},
{id:'storm-night',name:'Se acerca la tormenta',description:'El cielo tiene otros planes.',art:'storm',tracks:[{trackId:'rain',volume:.48},{trackId:'storm',volume:.32},{trackId:'gusts',volume:.2}]},
{id:'harbor',name:'Puerto al anochecer',description:'Madera, sal y un horizonte abierto.',art:'sea',tracks:[{trackId:'waves',volume:.43},{trackId:'boat',volume:.27},{trackId:'wind',volume:.18}]},
{id:'space',name:'A la deriva',description:'Un pulso tenue en el vacío.',art:'space',tracks:[{trackId:'engine',volume:.2},{trackId:'starlight',volume:.25},{trackId:'air-vent',volume:.16}]},
{id:'night',name:'Antes del siguiente paso',description:'La noche guarda sus secretos.',art:'night',tracks:[{trackId:'summer-night',volume:.4},{trackId:'embers',volume:.2},{trackId:'fireplace',volume:.25}]}
];
