# Kube Garden Frontend

Kube Garden is a garden-themed deployment service platform. It helps teams treat each Kubernetes workload like a plant: you cultivate, monitor, and ship changes with the support of an AI deployment agent that keeps releases calm and observable. This repository contains the React + Vite frontend for that experience.

## Highlights

- Garden dashboard that visualizes services as plants with status, version, and “last watered” history.
- Deployment console powered by an AI agent guiding tests, security scans, canary rollout, and promotion.
- Real-time logs, toast notifications, latency charts, and celebratory confetti when releases bloom.
- Built with React 19, TypeScript, Vite 7, Tailwind CSS, Recharts, lucide icons, canvas-confetti, and react-hot-toast.

## Getting Started

Prerequisites:

- Node.js 18+ (20 recommended)
- npm 9+

Install dependencies:

```bash
cd ../GitHub/kube-garden-fe
npm install
```

Run the dev server with HMR (default `http://localhost:5173`):

```bash
npm run dev
```

Build for production and preview:

```bash
npm run build
npm run preview
```

## Available Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Start Vite dev server with React Fast Refresh. |
| `npm run build` | Run TypeScript build (`tsc -b`) and bundle with Vite. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Execute ESLint across the repo. |

## Project Structure

```
src/
├── main.tsx                 # App entry
├── pages/
│   ├── DashboardPage.tsx    # Garden view of services
│   └── DeploymentConsole.tsx# AI agent rollout console
└── components/              # Shared UI widgets
```

## Key Screens

- `DashboardPage`: shows each deployment as a card with plant metaphors, quick vitals, and “Manage Garden” actions.
- `DeploymentConsole`: split-view with AI agent logs, growing plant animation, rollout timeline, metrics, and promote/rollback buttons.

## Contributing

1. Create a feature branch.
2. Run `npm run lint` and `npm run build` before committing.
3. Open a PR with context, screenshots/GIFs of UI changes, and checklist of tests.

## License

MIT © 2025 term2-bear Team @ Softbank Hackathon