import {dbGet,dbPut} from './db';
export type Addr={name:string;country:string;full:string;state?:string;city?:string;postcode?:string};
let last=0;
export async function reverse(lat:number,lon:number):Promise<Addr|null>{
 const id=lat.toFixed(4)+','+lon.toFixed(4);
 const c=await dbGet('geo',id);if(c)return c.a;
 if(!navigator.onLine)return null;
 const wait=1100-(Date.now()-last);if(wait>0)await new Promise(r=>setTimeout(r,wait));last=Date.now();
 try{const r=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${lat}&lon=${lon}`,{headers:{'Accept-Language':navigator.language}});
  if(!r.ok)return null;const j=await r.json();const a=j.address||{};
  const addr:Addr={name:j.name||a.road||a.suburb||a.city||a.town||a.village||'Unknown place',country:a.country||'',full:j.display_name||'',state:a.state,city:a.city||a.town||a.village,postcode:a.postcode};
  await dbPut('geo',{id,a:addr});return addr}catch{return null}}
