import {useEffect,useRef,useState} from 'react';
import {reverse,Addr} from '../services/geocode';
import {dbPut,uid} from '../services/db';
export type Fix={lat:number;lon:number;acc:number;alt:number|null;head:number|null;speed:number|null;ts:number;stale:boolean};
export const dist=(a:{lat:number;lon:number},b:{lat:number;lon:number})=>{const R=6371e3,r=Math.PI/180,x=(b.lon-a.lon)*r*Math.cos((a.lat+b.lat)/2*r),y=(b.lat-a.lat)*r;return Math.hypot(x,y)*R};
export function useGps(paused:boolean,interval:number){
 const [fix,setFix]=useState<Fix|null>(null);const [addr,setAddr]=useState<Addr|null>(null);const [err,setErr]=useState('');
 const fr=useRef<Fix|null>(null),ar=useRef<Addr|null>(null),geoAt=useRef<Fix|null>(null),lastRec=useRef<Fix|null>(null);
 useEffect(()=>{ // starts on launch, independent of camera
  if(!navigator.geolocation){setErr('Geolocation is not supported in this browser.');return}
  const id=navigator.geolocation.watchPosition(p=>{setErr('');
   const f:Fix={lat:p.coords.latitude,lon:p.coords.longitude,acc:p.coords.accuracy,alt:p.coords.altitude,head:p.coords.heading,speed:p.coords.speed,ts:p.timestamp,stale:Date.now()-p.timestamp>60000};
   fr.current=f;setFix(f);
   if(!geoAt.current||dist(geoAt.current,f)>30){geoAt.current=f;reverse(f.lat,f.lon).then(a=>{ar.current=a;setAddr(a)})}},
  e=>setErr(e.code===1?'Location permission denied. Open the browser site settings (lock icon) and allow Location for GeoSnap, then reload.':e.code===2?'GPS unavailable. Check that device location is on.':'Location timed out. Retrying…'),
  {enableHighAccuracy:true,maximumAge:5000,timeout:20000});
  return()=>navigator.geolocation.clearWatch(id)},[]);
 useEffect(()=>{if(paused)return;
  const t=setInterval(()=>{const f=fr.current;if(!f)return;
   if(lastRec.current&&dist(lastRec.current,f)<Math.max(15,f.acc/2))return;
   lastRec.current=f;const d=new Date(f.ts);
   dbPut('history',{id:uid(),lat:f.lat,lon:f.lon,acc:f.acc,alt:f.alt,head:f.head,speed:f.speed,ts:f.ts,date:d.toLocaleDateString(),time:d.toLocaleTimeString(),tz:Intl.DateTimeFormat().resolvedOptions().timeZone,addr:ar.current,stale:f.stale})},interval);
  return()=>clearInterval(t)},[paused,interval]);
 return{fix,addr,err};
}
