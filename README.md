# Kube Garden Frontend

Kube Garden is a garden-themed deployment service platform. It helps teams treat each Kubernetes workload like a plant: you cultivate, monitor, and ship changes with the support of a Gardener Agent that keeps releases calm and observable. This repository contains the React + Vite frontend for that experience.

## Highlights

- 🌱 **Garden Dashboard**: Visualizes services as plants with status, version, and "last watered" history
- 🤖 **Deployment Console**: Powered by a Gardener Agent guiding tests, security scans, canary rollout, and promotion
- 📊 **Real-time Monitoring**: Live logs, toast notifications, latency charts, and celebratory confetti when releases bloom
- 🌍 **Internationalization**: Supports English and Japanese (日本語)
- 🎵 **Audio Experience**: Optional background music during deployments
- 📜 **Deployment History**: Track all deployment activities and growth records
- ⚙️ **Settings Page**: Customize language and BGM

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **lucide-react** for icons
- **canvas-confetti** for celebrations
- **react-hot-toast** for notifications
- **React Compiler** (babel-plugin-react-compiler) for optimization

## Getting Started

### Prerequisites

- Node.js 18+ (20 recommended)
- npm 9+

### Installation

```bash
npm install
```

### Development

Run the dev server with HMR (default `http://localhost:5173`):

```bash
npm run dev
```

### Production Build

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Start Vite dev server with React Fast Refresh |
| `npm run build` | Run TypeScript build (`tsc -b`) and bundle with Vite |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Execute ESLint across the repo |

## Project Structure

```
kube-garden-fe/
├── src/
│   ├── main.tsx                    # App entry point with providers
│   ├── App.tsx                     # Main app component with routing
│   ├── App.css                     # Global app styles
│   ├── index.css                   # Base styles
│   ├── pages/
│   │   ├── LoginPage.tsx           # Login/authentication page
│   │   ├── DashboardPage.tsx       # Garden view of services
│   │   ├── DeploymentConsole.tsx   # Gardener Agent rollout console
│   │   ├── HistoryPage.tsx          # Deployment history/journal
│   │   ├── SettingsPage.tsx        # User settings (language, BGM, AI persona)
│   │   └── NewDeploymentPage.tsx   # Form to start new deployments
│   └── components/
│       ├── Navbar.tsx               # Top navigation bar
│       ├── LanguageContext.tsx      # i18n context (en/ja)
│       └── AudioContext.tsx        # BGM audio context
├── public/
│   ├── garden.png                  # Garden logo/asset
│   └── mainbgm.mp3                 # Background music
├── docs/
│   └── README.md                   # Backend API reference
├── Dockerfile                      # Container configuration
├── nginx.conf                      # Nginx configuration
└── package.json                    # Dependencies and scripts
```

## Pages Overview

### LoginPage
Authentication entry point for the application.

### DashboardPage
Main garden view showing all services as plant cards with:
- Service status (healthy/warning)
- Version information
- Pod count
- Last deployment time
- Quick actions (Manage, Delete)

### DeploymentConsole
Full-featured deployment monitoring console with:
- **Gardener Agent**: Real-time logs and guidance
- **Plant Animation**: Visual growth indicator (Sprout → Flower → Tree)
- **Rollout Timeline**: Step-by-step deployment progress
- **Metrics Charts**: Latency and performance visualization
- **Actions**: Promote, Rollback, and Cancel buttons

### HistoryPage
Deployment journal tracking:
- All past deployments
- Status (Success/Failed/In Progress)
- Service name and version
- Deployment strategy
- Timestamps
- Delete functionality

### SettingsPage
User preferences:
- **Language**: Switch between English and Japanese
- **Background Music**: Toggle BGM on/off
- **Gardener Agent Personality**: Choose communication style (Helpful/Strict/Pirate)

### NewDeploymentPage
Form to configure new deployments:
- Service name
- GitHub repository URL
- Deployment strategy (Canary/Blue-Green/Rolling)
- Description
- Triggers GitHub Actions workflow

## Backend API

프론트엔드는 서버리스 백엔드 API를 호출합니다.  
API 엔드포인트 및 사용법은 [docs/README.md](./docs/README.md)을 참고하세요.

**API Base URL**: `.env` 파일에서 `VITE_API_URL` 환경 변수로 설정

```env
VITE_API_URL=https://your-api-endpoint.com
```

## Features

### Internationalization (i18n)
- Supported languages: English (`en`), Japanese (`ja`)
- Language switching via Settings page
- All UI text is localized

### Audio Context
- Background music (BGM) support
- Toggle on/off in Settings
- Plays during deployment activities

### Deployment Strategies
- **Canary Deployment**: Gradual rollout with monitoring
- **Blue-Green Deployment**: Instant switch between environments
- **Rolling Update**: Sequential pod updates