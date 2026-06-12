# NS Trip Analyzer

A small PWA that analyzes your Dutch Railways (NS) trip history and recommends the cheapest NS subscription for your travel pattern. Upload the CSV you can export from `ns.nl → Mijn NS → Reishistorie` (everything is processed locally in the browser — no data leaves your device) and it breaks down your spend by peak / off-peak / weekend, surfaces your top routes, and compares all standard NS subscriptions (including a configurable Traject Vrij) over your actual travel window.

Built with React + Vite + Recharts and shipped as a PWA. Deployed to GitHub Pages via the workflow in `.github/workflows/deploy.yml`.

## Development

```bash
npm install
npm run dev      # start the Vite dev server
npm run lint     # run ESLint
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow, which builds the app and publishes `dist/` to GitHub Pages. The `base` path in `vite.config.js` is `/ns-trip-analyzer/` — adjust it if you fork to a different repo name.
