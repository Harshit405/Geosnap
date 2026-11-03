import {useEffect,useRef,useState} from 'react';
export function useCamera(on:boolean,facing:'environment'|'user',res:string){
 const v=useRef<HTMLVideoElement>(null);const [stream,setS]=useState<MediaStream|null>(null);const [err,setErr]=useState('');
 useEffect(()=>{if(!on)return;let st:MediaStream|undefined,dead=false;const w=res==='8k'?7680:res==='4k'?3840:1920;
  navigator.mediaDevices.getUserMedia({video:{facingMode:facing,width:{ideal:w},height:{ideal:w*9/16}},audio:false}).then(s=>{if(dead){s.getTracks().forEach(t=>t.stop());return}st=s;setS(s);setErr('');if(v.current)v.current.srcObject=s}).catch(e=>setErr(e.name==='NotAllowedError'?'Camera permission denied. Allow Camera in site settings.':e.message));
  return()=>{dead=true;st?.getTracks().forEach(t=>t.stop());setS(null)}},[on,facing,res]);
 return{v,stream,err}}
export const caps=(s:MediaStream|null)=>{const t=s?.getVideoTracks()[0];return{t,c:(t?.getCapabilities?.()||{}) as any,set:t?.getSettings()}};
export async function grab(v:HTMLVideoElement,s:MediaStream){
 try{const ic=new (window as any).ImageCapture(s.getVideoTracks()[0]);return await createImageBitmap(await ic.takePhoto())}catch{return createImageBitmap(v)}}
