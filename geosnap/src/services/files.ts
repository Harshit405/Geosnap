let dir:any=null;
export const pickDir=async()=>{if(!(window as any).showDirectoryPicker)return false;try{dir=await (window as any).showDirectoryPicker({mode:'readwrite'});return true}catch{return false}};
export async function saveFile(b:Blob,name:string){
 if(dir){try{const f=await dir.getFileHandle(name,{create:true});const w=await f.createWritable();await w.write(b);await w.close();return}catch{}}
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5e3)}
