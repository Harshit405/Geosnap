## 🌐 Deployed Website

**Live Website:** [https://your-deployed-website-url.com](https://your-deployed-website-url.com)

---

# GPSnapix 📍📸

### Capture • Locate • Remember

GPSnapix is a modern GPS-powered camera application that combines photography with real-time location information. Capture photos with GPS coordinates, addresses, maps, timestamps, and customizable watermarks.

Designed for travellers, explorers, field researchers, photographers, and anyone who wants to remember exactly where a photo was taken.

---

## ✨ Features

### 📸 Smart GPS Camera
- Live camera preview.
- Front and rear camera switching.
- Fast photo capture.
- Flash and zoom controls where supported.
- Photo preview, retake, and save.
- Video recording support.
- High-quality image capture based on device capabilities.

### 📍 Real-Time GPS Tracking
- Automatically detect device location.
- Latitude and longitude.
- GPS accuracy in metres.
- Address and locality detection.
- Altitude, speed, and heading when available.
- Refresh location.
- Live location updates.

### 🗺️ GPS Watermark

Add location information directly to captured photos.

Watermark information includes:
- Location name.
- Country and flag.
- Full address.
- Latitude and longitude.
- Date and time.
- Timezone.
- Custom notes.
- GPSnapix branding.
- Map preview with location marker.

### 🎨 Watermark Templates
- Classic GPS Map
- Professional GPS
- Minimal GPS
- Field Survey
- Travel Photography
- Compact GPS
- Full Location Card

Customize watermark position, size, transparency, text, map dimensions, and visibility.

### 🗺️ Maps
- MapLibre GL JS.
- OpenFreeMap integration.
- Liberty, Positron, Bright, and Dark map styles.
- Current location marker.
- Photo location markers.
- Location history visualization.

### 📚 Location History
- Automatic location recording while tracking is active.
- Configurable tracking intervals.
- Previous location records.
- Date-based filtering.
- Search locations.
- Pause and resume tracking.
- Delete individual records or clear history.

### 🖼️ Photo Gallery
- Photo grid.
- Full-screen photo preview.
- Original and stamped photos.
- Location and timestamp details.
- Search and filters.
- Individual downloads.
- Bulk export.

### 💾 Local Storage
- IndexedDB photo storage.
- Automatic saving options.
- Device file saving where supported.
- No mandatory cloud photo storage.
- Local data management.

### 📱 Installation
- Android PWA installation.
- iPhone Add to Home Screen.
- Standalone app experience.
- Capacitor preparation for Android and iOS app-store distribution.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type safety |
| Vite | Development and build |
| Tailwind CSS | Styling |
| MapLibre GL JS | Interactive maps |
| OpenFreeMap | Map tiles |
| Geolocation API | Device location |
| MediaDevices API | Camera access |
| Canvas API | Watermark rendering |
| IndexedDB | Local data storage |
| MediaRecorder API | Video recording |
| PWA | Web app installation |
| Capacitor | Native app packaging |

---

## 📂 Project Structure

```text
GPSnapix/
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── service-worker.js
│
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── CameraPage.tsx
│   │   ├── GalleryPage.tsx
│   │   ├── LocationPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── camera/
│   ├── gps/
│   ├── maps/
│   ├── watermark/
│   ├── metadata/
│   ├── storage/
│   ├── gallery/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Install:
- Node.js (LTS version recommended).
- npm.
- Git.
- VS Code or another code editor.

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project

```bash
cd GPSnapix
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start development server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 5. Build for production

```bash
npm run build
```

### 6. Preview production build

```bash
npm run preview
```

The production files will be generated in the `dist` directory.

---

## 📱 Installation

### Android

1. Open the deployed GPSnapix website in Chrome.
2. Select Install App or Add to Home Screen.
3. Confirm installation.
4. Open GPSnapix from your home screen.

### iPhone

1. Open GPSnapix in Safari.
2. Tap the Share icon.
3. Select Add to Home Screen.
4. Tap Add.
5. Open GPSnapix from your home screen.

### Native App Distribution

Capacitor can be used to prepare Android and iOS packages.

App Store and Google Play publication require their respective developer accounts, build processes, and review approvals.

---

## 🌐 Deployment

GPSnapix can be deployed using Vercel.

1. Push the source code to GitHub.
2. Sign in to Vercel.
3. Import the GPSnapix repository.
4. Select Vite as the framework.
5. Configure:

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

6. Deploy the project.

**Important:** Use HTTPS for camera and GPS permissions.

---

## 🔐 Privacy

GPSnapix is designed with local-first data storage.

- No mandatory account.
- No automatic cloud photo uploads.
- Photos stored locally by default.
- GPS permissions requested separately.
- Users can delete their local data.
- Map and geocoding providers may receive requests needed to provide their services.

Location tracking is subject to browser background restrictions. Continuous tracking cannot be guaranteed when the browser is suspended or closed.

---

## ⚠️ Important Technical Notes

- GPS accuracy depends on the device and environment.
- Camera resolution depends on hardware and browser support.
- Native 8K capture is available only when supported by the camera.
- OpenFreeMap provides vector maps, not satellite imagery.
- Satellite imagery requires a compatible imagery provider.
- Reverse geocoding generally requires an internet connection.
- EXIF metadata support depends on the image format and implementation.
- File System Access API support varies by browser.
- iOS and Android browser capabilities differ.

Do not use simulated GPS data or fake resolution information in production.

---

## 🎯 Project Goal

Build GPSnapix into a reliable, easy-to-use GPS camera application that makes it simple to capture photos, preserve location information, and organize memories geographically.

**GPSnapix — Every Photo Has a Place.**

---

## License

Choose and add an appropriate open-source or proprietary license before publishing this repository.

## Project Status

Development in progress.
