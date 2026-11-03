# GeoSnap

Privacy-first GPS map camera that runs in the browser (Android Chrome, iOS Safari, desktop). Built with React, TypeScript, Vite, Tailwind CSS, MapLibre GL JS with OpenFreeMap, Nominatim, IndexedDB and piexifjs. Installable as a PWA. No login, backend or cloud storage.

## Run locally
```
npm install
npm run dev
```
Camera and GPS need HTTPS or localhost.

## Build
```
npm run build
npm run preview
```
Output goes to `dist/`.

## Deploy on Vercel
1. Push the project to a GitHub repo (do not commit `node_modules` or `dist`).
2. On vercel.com choose Add New > Project and import the repo.
3. Vercel detects Vite. Build command `npm run build`, output directory `dist`.
4. Click Deploy.

CLI alternative:
```
npm i -g vercel
vercel --prod
```
Netlify and GitHub Pages also work, as long as the site is served over HTTPS.

## Install on a phone
- Android Chrome: open the site, then menu > Install app.
- iPhone/iPad: open in Safari, then Share > Add to Home Screen.
Allow Camera and Location when asked.

## Features
- Automatic GPS on launch, independent of the camera. Old fixes are labelled "last known". Clear message and steps if permission is denied.
- Reverse geocoding with Nominatim: cached locally, throttled, with a coordinates-only fallback.
- Automatic location history in IndexedDB: interval (10 s, 30 s, 1 min, 5 min), duplicate skipping, pause/resume, search, date filter, delete, clear all, map markers.
- Real camera: front/rear, torch and zoom where supported, up to 8K requested, full-resolution capture via ImageCapture where available, photo preview, retake and save, video recording.
- Watermark card drawn on canvas with a real square OpenFreeMap map, red marker, attribution, address, coordinates, date, time, time zone and custom note.
- GPS EXIF written to JPEGs and verified before saving; can be turned off in Settings.
- Local gallery with search and sort, full-screen view, download and delete.
- Saving: IndexedDB, optional folder (File System Access API), download fallback. Auto-save original and stamped photos are independent options.
- Settings: theme, photo quality, map style (Liberty, Positron, Bright, Dark), logo, stamp position, size, opacity, note, EXIF, storage, clear data.
- PWA: manifest, service worker, app shell caching.

## Not yet implemented
- Watermark templates 2 to 7 (only the default card exists)
- GPS watermark on recorded video
- Gallery multi-select and bulk download
- QR detection, volume button and screen tap actions, language selection
- How to Use, About, Permissions Guide and Support pages (Privacy summary only)
- Video quality selector and camera focus control
- Bottom toolbar items Preview, Default and Template

## Limits
- Image size is limited by the device camera and browser. Nothing is upscaled, so 8K only appears where the hardware and browser provide it.
- OpenFreeMap serves vector street maps, not satellite imagery. The style list in `src/maps/styles.ts` can take a future satellite provider.
- Address lookup and new map tiles need internet. Photos, history and the gallery work offline. There are no offline maps.
- Location history records only while the app is open. It does not track after the browser is closed or the device sleeps.

### iPhone / iPad (Safari)
- No flash, because Safari does not allow torch control (the button is disabled).
- No folder picker. Photos download as files, so use Share > Save to Photos.
- Photos use the live preview frame size, not full sensor resolution, so 8K is not available.
- Video records as MP4. Tracking pauses when the app is in the background or the screen locks.
- Canvas stamping needs iOS 16 or later.
- If location is blocked: Settings > Privacy & Security > Location Services > Safari Websites.

## Privacy
Nothing is uploaded. Photos and location history stay in your browser storage. Third-party requests:
- Nominatim (OpenStreetMap) receives coordinates for address lookup.
- OpenFreeMap serves map tiles and sees the tile areas requested.

Use Settings > Clear local data to delete everything.

## Project structure
```
src/
  App.tsx, main.tsx
  camera/      camera access, capture
  gps/         GPS watching, history recording
  maps/        map styles
  watermark/   map snapshot and stamp rendering
  metadata/    EXIF GPS
  services/    IndexedDB, geocoding, file saving
```

## Testing checklist
Test on a real Android phone, an iPhone and desktop: rear and front camera, capture, flash, zoom, video; GPS on launch, permission denied, GPS unavailable, history; map style switching and watermark map; photo size, EXIF GPS, local saving and gallery after reload; settings persistence.

## Attribution
Maps © OpenFreeMap, © OpenStreetMap contributors. Address data from OpenStreetMap Nominatim.
