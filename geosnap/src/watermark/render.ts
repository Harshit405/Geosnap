import maplibre from 'maplibre-gl';
import {Addr} from '../services/geocode';
export type Info={lat:number;lon:number;addr:Addr|null;ts:number;note:string};
export type Opt={style:string;size:number;alpha:number;logo:boolean;pos:'bottom'|'top'};
export async function mapSnap(lat:number,lon:number,style:string,px=512):Promise<HTMLCanvasElement|null>{
 const el=document.createElement('div');el.style.cssText=`position:fixed;left:-9999px;top:0;width:${px}px;height:${px}px`;document.body.append(el);
 try{const m=new maplibre.Map({container:el,style,center:[lon,lat],zoom:16,interactive:false,attributionControl:false,canvasContextAttributes:{preserveDrawingBuffer:true},pixelRatio:1} as any);
  await new Promise<void>(r=>{m.once('idle',()=>r());setTimeout(r,8000)});
  const c=document.createElement('canvas');c.width=c.height=px;c.getContext('2d')!.drawImage(m.getCanvas(),0,0,px,px);m.remove();return c}catch{return null}finally{el.remove()}}
const rr=(g:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number)=>{g.beginPath();g.roundRect(x,y,w,h,r)};
export async function stamp(bm:ImageBitmap,i:Info,o:Opt){
 const c=document.createElement('canvas');c.width=bm.width;c.height=bm.height;const g=c.getContext('2d')!;g.drawImage(bm,0,0);
 const u=Math.min(c.width,c.height)/1000*o.size,w=c.width-60*u,h=210*u,x=30*u,y=o.pos==='top'?30*u:c.height-h-30*u;
 g.fillStyle=`rgba(0,0,0,${o.alpha})`;rr(g,x,y,w,h,24*u);g.fill();
 const s=h-20*u,mx=x+10*u,my=y+10*u,map=await mapSnap(i.lat,i.lon,o.style);
 if(map){g.save();rr(g,mx,my,s,s,16*u);g.clip();g.drawImage(map,mx,my,s,s);g.restore();
  g.fillStyle='#e11d48';g.strokeStyle='#fff';g.lineWidth=3*u;g.beginPath();g.arc(mx+s/2,my+s/2,10*u,0,7);g.fill();g.stroke();
  g.fillStyle='rgba(255,255,255,.8)';g.font=`${11*u}px sans-serif`;g.fillText('© OpenFreeMap © OpenStreetMap',mx+6*u,my+s-6*u)}
 else{g.fillStyle='#222';rr(g,mx,my,s,s,16*u);g.fill();g.fillStyle='#fff';g.font=`${18*u}px sans-serif`;g.fillText('Map offline',mx+s/2-50*u,my+s/2)}
 const tx=mx+s+20*u,tw=x+w-tx-16*u;g.fillStyle='#fff';g.textBaseline='top';
 g.font=`bold ${34*u}px sans-serif`;g.fillText(i.addr?.name||'Location',tx,y+14*u,tw-(o.logo?120*u:0));
 if(o.logo){g.font=`bold ${22*u}px sans-serif`;g.fillStyle='#FFC400';g.textAlign='right';g.fillText('GeoSnap',x+w-16*u,y+18*u);{const lw=g.measureText('GeoSnap').width,cx=x+w-16*u-lw-16*u,cy=y+30*u;g.fillStyle='#FFC400';g.beginPath();g.arc(cx,cy,10*u,0,7);g.fill();g.fillStyle='#000';g.beginPath();g.arc(cx,cy,4*u,0,7);g.fill()}g.textAlign='left';g.fillStyle='#fff'}
 g.font=`${20*u}px sans-serif`;const d=new Date(i.ts);
 const lines=[i.addr?.country,i.addr?.full,`Lat ${i.lat.toFixed(6)}  Long ${i.lon.toFixed(6)}`,`${d.toLocaleDateString()} ${d.toLocaleTimeString()} ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,i.note].filter(Boolean) as string[];
 let ly=y+58*u;for(const t of lines){let line='';for(const wd of t.split(' ')){if(g.measureText(line+wd).width>tw&&line){g.fillText(line,tx,ly);ly+=24*u;line=''}line+=wd+' '}g.fillText(line,tx,ly);ly+=24*u;if(ly>y+h-20*u)break}
 return c}
