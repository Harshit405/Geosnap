import piexif from 'piexifjs';
const dms=(v:number)=>{v=Math.abs(v);const d=Math.floor(v),m=Math.floor((v-d)*60),s=Math.round(((v-d)*60-m)*6000);return[[d,1],[m,1],[s,100]]};
export function addGps(jpeg:string,p:{lat:number;lon:number;alt:number|null}){
 const G=piexif.GPSIFD,g:any={};
 g[G.GPSLatitudeRef]=p.lat<0?'S':'N';g[G.GPSLatitude]=dms(p.lat);g[G.GPSLongitudeRef]=p.lon<0?'W':'E';g[G.GPSLongitude]=dms(p.lon);
 if(p.alt!=null){g[G.GPSAltitudeRef]=p.alt<0?1:0;g[G.GPSAltitude]=[Math.round(Math.abs(p.alt)*100),100]}
 const n=new Date();g[G.GPSDateStamp]=`${n.getUTCFullYear()}:${String(n.getUTCMonth()+1).padStart(2,'0')}:${String(n.getUTCDate()).padStart(2,'0')}`;
 const out=piexif.insert(piexif.dump({'0th':{},Exif:{},GPS:g}),jpeg);
 const chk=piexif.load(out).GPS;if(!chk||!chk[G.GPSLatitude])throw new Error('EXIF verification failed');
 return out}
