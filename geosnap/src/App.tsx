import {useEffect,useRef,useState} from 'react';
import {Camera,Image as Img,MapPin,Settings as Cog,Zap,RefreshCw,Trash2,Download,Circle,Square,Pause,Play} from 'lucide-react';
import maplibre from 'maplibre-gl';import 'maplibre-gl/dist/maplibre-gl.css';
import {useGps} from './gps/gps';import {useCamera,caps,grab} from './camera/camera';
import {stamp} from './watermark/render';import {addGps} from './metadata/exif';
import {dbAll,dbPut,dbDel,dbClear,uid} from './services/db';import {saveFile,pickDir} from './services/files';import {STYLES} from './maps/styles';

const S0={theme:'system',style:'liberty',size:1,alpha:.55,note:'',exif:true,saveOrig:false,saveStamp:true,res:'max',interval:30000,logo:true,pos:'bottom' as 'bottom'|'top',paused:false};
type St=typeof S0;
const useSet=()=>{const[s,set]=useState<St>(()=>({...S0,...JSON.parse(localStorage.getItem('gs')||'{}')}));useEffect(()=>{localStorage.setItem('gs',JSON.stringify(s))},[s]);return[s,set] as const};
const blobOf=(c:HTMLCanvasElement,q=.95)=>new Promise<Blob>(r=>c.toBlob(b=>r(b!),'image/jpeg',q));

export default function App(){
 const[s,setS]=useSet();const[tab,setTab]=useState<'cam'|'gal'|'loc'|'set'>('cam');
 const{fix,addr,err}=useGps(s.paused,s.interval);
 const up=(p:Partial<St>)=>setS({...s,...p});
 const dark=s.theme==='dark'||(s.theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
 const light=tab==='set'&&!dark;
 return <div style={{paddingTop:'env(safe-area-inset-top)'}} className={`h-full flex flex-col ${light?'bg-white text-slate-900':'bg-black text-white'}`}>
  {err&&<div className="bg-red-700 text-sm p-2">{err}</div>}
  <div className="flex-1 min-h-0 overflow-auto relative">
   {tab==='cam'&&<Cam s={s} fix={fix} addr={addr} go={setTab}/>}
   {tab==='gal'&&<Gallery/>}
   {tab==='loc'&&<Loc s={s} up={up} fix={fix} addr={addr}/>}
   {tab==='set'&&<Prefs s={s} up={up}/>}
  </div>
  <nav style={{paddingBottom:'env(safe-area-inset-bottom)'}} className="flex justify-around py-2 bg-black text-white border-t border-white/10">
   {([['cam',Camera,'Camera'],['gal',Img,'Gallery'],['loc',MapPin,'Location'],['set',Cog,'Settings']] as const).map(([k,I,l])=>
    <button key={k} onClick={()=>setTab(k)} className={`flex flex-col items-center text-xs ${tab===k?'text-yellow-400':''}`}><I size={22}/>{l}</button>)}
  </nav></div>}

function Cam({s,fix,addr,go}:any){
 const[face,setFace]=useState<'environment'|'user'>('environment');const{v,stream,err}=useCamera(true,face,s.res);
 const[torch,setTorch]=useState(false);const[zoom,setZoom]=useState(1);const[pend,setPend]=useState<any>(null);const[msg,setMsg]=useState('');
 const rec=useRef<MediaRecorder|null>(null);const[recording,setRec]=useState(false);const[sec,setSec]=useState(0);
 const{t,c,set}=caps(stream);
 useEffect(()=>{if(!recording)return;const i=setInterval(()=>setSec(x=>x+1),1000);return()=>clearInterval(i)},[recording]);
 const adv=(o:any)=>t?.applyConstraints({advanced:[o]}).catch(()=>setMsg('Not supported on this camera'));
 const shoot=async()=>{
  if(!fix||!stream||!v.current){setMsg('Waiting for GPS fix…');return}
  setMsg('Processing…');const bm=await grab(v.current,stream);
  const out=await stamp(bm,{lat:fix.lat,lon:fix.lon,addr,ts:Date.now(),note:s.note},s);
  let d=out.toDataURL('image/jpeg',.95);if(s.exif){try{d=addGps(d,fix)}catch(e:any){setMsg(e.message)}}
  const sb=await (await fetch(d)).blob();const oc=document.createElement('canvas');oc.width=bm.width;oc.height=bm.height;oc.getContext('2d')!.drawImage(bm,0,0);
  setPend({sb,ob:await blobOf(oc),w:bm.width,h:bm.height,fix,addr,url:URL.createObjectURL(sb)});setMsg('')};
 const confirm=async()=>{const p=pend,id=uid();
  await dbPut('photos',{id,ts:Date.now(),stamped:p.sb,orig:s.saveOrig?p.ob:null,w:p.w,h:p.h,lat:p.fix.lat,lon:p.fix.lon,acc:p.fix.acc,addr:p.addr});
  if(s.saveStamp)await saveFile(p.sb,`GeoSnap_${id}.jpg`);if(s.saveOrig)await saveFile(p.ob,`GeoSnap_${id}_original.jpg`);
  setPend(null);setMsg('Saved')};
 const record=()=>{if(recording){rec.current?.stop();return}if(!stream)return;
  const ch:Blob[]=[];const mt=['video/mp4','video/webm;codecs=vp9','video/webm'].find(t=>MediaRecorder.isTypeSupported(t))||'';const r=new MediaRecorder(stream,mt?{mimeType:mt,videoBitsPerSecond:s.res==='1080'?8e6:2e7}:undefined);rec.current=r;
  r.ondataavailable=e=>ch.push(e.data);r.onstop=()=>{setRec(false);saveFile(new Blob(ch,{type:r.mimeType}),`GeoSnap_${Date.now()}.${r.mimeType.includes('mp4')?'mp4':'webm'}`)};
  r.start();setSec(0);setRec(true)};
 return <div className="h-full relative bg-black">
  <video ref={v} autoPlay playsInline muted className="w-full h-full object-cover"/>
  {err&&<p className="absolute inset-x-0 top-1/3 text-center p-4">{err}</p>}
  <div className="absolute top-2 inset-x-2 flex justify-between">
   <button disabled={!c.torch} onClick={()=>{setTorch(!torch);adv({torch:!torch})}} className={torch?'text-yellow-400':''} title="Flash"><Zap/></button>
   {recording?<span className="text-red-500">● {sec}s</span>:<img src="/logo.svg" alt="GeoSnap" className="h-8 w-8 rounded-lg"/>}
   <button onClick={()=>setFace(face==='user'?'environment':'user')} title="Switch camera"><RefreshCw/></button></div>
  {fix&&<div className="absolute left-2 right-2 bottom-36 bg-black/55 rounded-xl p-3 text-sm">
   <b className="text-lg">{addr?.name||'Locating address…'}</b>{fix.stale&&<span className="text-yellow-400"> (last known)</span>}
   <div>{addr?.full}</div><div>{fix.lat.toFixed(6)}, {fix.lon.toFixed(6)} ±{Math.round(fix.acc)} m</div></div>}
  <div className="absolute bottom-4 inset-x-0 flex items-center justify-around">
   <button onClick={()=>{const z=zoom===1?2:1;setZoom(z);adv({zoom:Math.min(z,c.zoom?.max||1)})}} className="w-12 h-12 rounded-full border text-sm">{zoom}x</button>
   <button onClick={shoot} className="w-20 h-20 rounded-full bg-yellow-400 border-4 border-white" title="Capture"/>
   <button onClick={record} className="w-12 h-12 rounded-full border grid place-items-center">{recording?<Square className="text-red-500"/>:<Circle/>}</button></div>
  <div className="absolute bottom-24 inset-x-0 text-center text-xs">{msg}{set?.width&&` · ${set.width}×${set.height}`}</div>
  {pend&&<div className="absolute inset-0 bg-black flex flex-col"><img src={pend.url} className="flex-1 min-h-0 object-contain"/>
   <div className="flex justify-around p-4"><button onClick={()=>setPend(null)} className="px-6 py-2 border rounded">Retake</button><button onClick={confirm} className="px-6 py-2 bg-yellow-400 text-black rounded">Save</button></div></div>}
 </div>}

function Gallery(){
 const[rows,setRows]=useState<any[]>([]);const[q,setQ]=useState('');const[desc,setDesc]=useState(true);const[view,setView]=useState<any>(null);
 const load=()=>dbAll('photos').then(r=>setRows(r));useEffect(()=>{load()},[]);
 const list=rows.filter(r=>(r.addr?.full||'').toLowerCase().includes(q.toLowerCase())).sort((a,b)=>desc?b.ts-a.ts:a.ts-b.ts);
 return <div className="p-2"><div className="flex gap-2 mb-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search location" className="flex-1 bg-white/10 rounded px-3 py-2"/><button onClick={()=>setDesc(!desc)} className="px-3 border rounded">{desc?'Newest':'Oldest'}</button></div>
  {!list.length&&<p className="text-center opacity-60 mt-10">No photos yet. Capture one from the Camera tab.</p>}
  <div className="grid grid-cols-3 gap-1">{list.map(r=><Thumb key={r.id} r={r} open={()=>setView(r)}/>)}</div>
  {view&&<div className="fixed inset-0 bg-black z-50 flex flex-col"><Thumb r={view} full/>
   <div className="p-3 text-sm">{view.w}×{view.h} · {view.lat.toFixed(5)}, {view.lon.toFixed(5)} · ±{Math.round(view.acc)} m · {new Date(view.ts).toLocaleString()}</div>
   <div className="flex justify-around p-3"><button onClick={()=>saveFile(view.stamped,`GeoSnap_${view.id}.jpg`)}><Download/></button>
    <button onClick={async()=>{await dbDel('photos',view.id);setView(null);load()}}><Trash2/></button><button onClick={()=>setView(null)}>Close</button></div></div>}</div>}
function Thumb({r,open,full}:any){const[u,setU]=useState('');useEffect(()=>{const x=URL.createObjectURL(r.stamped);setU(x);return()=>URL.revokeObjectURL(x)},[r]);
 return <img src={u} onClick={open} className={full?'flex-1 min-h-0 object-contain':'aspect-square object-cover w-full'}/>}

function Loc({s,up,fix,addr}:any){
 const el=useRef<HTMLDivElement>(null);const map=useRef<maplibre.Map>();const[rows,setRows]=useState<any[]>([]);const[q,setQ]=useState('');const[day,setDay]=useState('');
 const load=()=>dbAll('history').then(r=>setRows(r.sort((a:any,b:any)=>b.ts-a.ts)));useEffect(()=>{load();const i=setInterval(load,5000);return()=>clearInterval(i)},[]);
 const list=rows.filter(r=>(r.addr?.full||'').toLowerCase().includes(q.toLowerCase())&&(!day||new Date(r.ts).toISOString().slice(0,10)===day));
 useEffect(()=>{const m=new maplibre.Map({container:el.current!,style:STYLES[s.style],center:fix?[fix.lon,fix.lat]:[0,20],zoom:fix?15:2});map.current=m;m.addControl(new maplibre.NavigationControl());return()=>m.remove()},[s.style]);
 useEffect(()=>{const m=map.current;if(!m)return;const mk:maplibre.Marker[]=[];
  list.slice(0,200).forEach(r=>mk.push(new maplibre.Marker({color:'#64748b',scale:.6}).setLngLat([r.lon,r.lat]).setPopup(new maplibre.Popup().setText(`${r.addr?.name||''} ${r.date} ${r.time}`)).addTo(m)));
  if(fix)mk.push(new maplibre.Marker({color:'#e11d48'}).setLngLat([fix.lon,fix.lat]).setPopup(new maplibre.Popup().setText(addr?.full||'Current location')).addTo(m));
  return()=>mk.forEach(k=>k.remove())},[rows,q,day,fix?.lat,fix?.lon,s.style]);
 return <div className="h-full flex flex-col"><div ref={el} className="h-1/2"/>
  <div className="p-2 flex gap-2 text-sm"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" className="flex-1 bg-white/10 rounded px-2"/><input type="date" value={day} onChange={e=>setDay(e.target.value)} className="bg-white/10 rounded px-1"/>
   <button onClick={()=>up({paused:!s.paused})}>{s.paused?<Play/>:<Pause/>}</button>
   <select value={s.interval} onChange={e=>up({interval:+e.target.value})} className="bg-black"><option value={1e4}>10s</option><option value={3e4}>30s</option><option value={6e4}>1m</option><option value={3e5}>5m</option></select>
   <button onClick={async()=>{await dbClear('history');load()}}><Trash2/></button></div>
  <div className="flex-1 overflow-auto px-2 text-sm">{list.map(r=><div key={r.id} className="py-2 border-b border-white/10 flex justify-between gap-2">
   <button className="text-left" onClick={()=>map.current?.flyTo({center:[r.lon,r.lat],zoom:16})}><b>{r.addr?.name||'Unknown'}</b><br/>{r.lat.toFixed(5)}, {r.lon.toFixed(5)} · ±{Math.round(r.acc)} m<br/>{r.date} {r.time} {r.tz}</button>
   <button onClick={async()=>{await dbDel('history',r.id);load()}}><Trash2 size={18}/></button></div>)}
   <p className="text-xs opacity-60 py-2">Maps © OpenFreeMap © OpenStreetMap contributors. Recording runs only while GeoSnap is open.</p></div></div>}

function Prefs({s,up}:any){
 const Row=({l,children}:any)=><div className="flex justify-between items-center py-3 border-b border-slate-200">{l}<div>{children}</div></div>;
 const Tg=({k}:{k:keyof St})=><input type="checkbox" checked={!!s[k]} onChange={e=>up({[k]:e.target.checked})} className="w-5 h-5"/>;
 const Sel=({k,o}:{k:keyof St;o:string[][]})=><select value={String(s[k])} onChange={e=>up({[k]:isNaN(+e.target.value)?e.target.value:+e.target.value})} className="border rounded px-2 py-1 bg-transparent">{o.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>;
 const H=({t}:any)=><h2 className="font-bold mt-5 mb-1">{t}</h2>;
 const[use,setUse]=useState('');useEffect(()=>{navigator.storage?.estimate().then(e=>setUse(`${((e.usage||0)/1e6).toFixed(1)} MB`))},[]);
 return <div className="p-4"><H t="General"/><Row l="App theme"><Sel k="theme" o={[['system','System default'],['light','Light mode'],['dark','Dark mode']]}/></Row>
  <H t="Camera"/><Row l="Photo quality"><Sel k="res" o={[['max','Highest available (up to 8K)'],['4k','4K UHD'],['1080','Full HD']]}/></Row>
  <H t="Stamp"/><Row l="Map style"><Sel k="style" o={[['liberty','Liberty'],['positron','Positron'],['bright','Bright'],['dark','Dark']]}/></Row>
  <Row l="Show app logo"><Tg k="logo"/></Row><Row l="Stamp position"><Sel k="pos" o={[['bottom','Bottom'],['top','Top']]}/></Row>
  <Row l="Stamp size"><input type="range" min=".6" max="1.6" step=".1" value={s.size} onChange={e=>up({size:+e.target.value})}/></Row>
  <Row l="Background opacity"><input type="range" min=".2" max=".9" step=".05" value={s.alpha} onChange={e=>up({alpha:+e.target.value})}/></Row>
  <Row l="Custom note"><input value={s.note} onChange={e=>up({note:e.target.value})} className="border rounded px-2 py-1 bg-transparent"/></Row>
  <Row l="Write GPS EXIF"><Tg k="exif"/></Row>
  <H t="Storage"/><Row l="Auto save original photos"><Tg k="saveOrig"/></Row><Row l="Auto save stamped photos"><Tg k="saveStamp"/></Row>
  {'showDirectoryPicker' in window&&<Row l="Save folder"><button className="underline" onClick={async()=>{if(!(await pickDir()))alert('Folder access is not supported here; downloads are used instead.')}}>Choose</button></Row>}
  <Row l="Storage usage">{use}</Row>
  <Row l="Clear local data"><button className="text-red-600" onClick={async()=>{if(confirm('Delete all photos, history and cached addresses?')){for(const x of['photos','history','geo'])await dbClear(x)}}}>Clear</button></Row>
  <H t="Help & support"/><p className="text-sm opacity-80">GeoSnap runs entirely in your browser. Nothing is uploaded. Location is sent to Nominatim (address lookup) and map tiles are fetched from OpenFreeMap. Allow Camera and Location in your browser's site settings. Tracking records only while the app is open.</p></div>}
