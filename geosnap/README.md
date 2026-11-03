# GeoSnap

Privacy-first GPS map camera that runs in the browser (Android Chrome, iOS Safari, desktop). React, TypeScript, Vite, Tailwind CSS, MapLibre GL JS with OpenFreeMap, Nominatim, IndexedDB, piexifjs. Installable PWA. No login, backend or cloud storage.

## Run
```
npm install
npm run dev
```
Camera and GPS need HTTPS or localhost.

## Build and deploy (Vercel)
```
npm run build
```
Push to GitHub (without node_modules or dist), import the repo in Vercel. Build command `npm run build`, output directory `dist`. CLI: `npm i -g vercel && vercel --prod`.

## Install on a phone
- Android Chrome: menu > Install app.
- iPhone/iPad: open in Safari, Share > Add to Home Screen.

## Features
Auto GPS on launch, cached reverse geocoding, automatic location history (interval, pause, search, date filter, delete, clear), real camera (front/rear, torch, zoom, video), canvas watermark with a real OpenFreeMap map, verified GPS EXIF, local gallery, IndexedDB and folder/download saving, settings (theme, map style, quality, storage), PWA.

## Not yet implemented
Templates 2-7, watermark on video, gallery multi-select and bulk download, QR detection, volume/tap actions, language, Help pages beyond a privacy summary, video quality selector, focus control, bottom toolbar Preview/Default/Template.

## Limits
- Resolution is limited by device and browser. Nothing is upscaled.
- OpenFreeMap is vector street maps only, not satellite.
- Address lookup and new tiles need internet. No offline maps.
- Location history records only while the app is open.
- iOS: no flash, no folder picker (use Share > Save to Photos), preview-size photos instead of full sensor resolution, MP4 video, iOS 16+ for stamping.

## Privacy
Nothing is uploaded. Nominatim receives coordinates for address lookup; OpenFreeMap serves tiles. Settings > Clear local data removes everything.

Maps © OpenFreeMap, © OpenStreetMap contributors.
