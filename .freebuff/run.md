# Run doc — anti port (portfolio)

Vite + React 19 + Tailwind v4 portfolio with WebGL (three.js / React Three Fiber) scenes.

## Reproduce artifacts (fresh checkout)

1. Install dependencies with npm (an `.npmrc` pins `legacy-peer-deps=true`, required by the R3F peer range):
   ```
   npm install
   ```
2. No `.env*` files are needed — the project has no environment secrets.

## Run the dev server

```
npm run dev
```

- Default port: **5173** (Vite default; the script passes no port flag, so Vite auto-increments to 5174+ if 5173 is taken).
- URL once running: `http://localhost:5173/`
- Detached start (this workspace, PowerShell):

  ```powershell
  powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -RedirectStandardOutput '.freebuff\preview.log' -RedirectStandardError '.freebuff\preview.log.err' -WindowStyle Hidden -PassThru).Id"
  ```

  Confirm alive: `powershell -NoProfile -Command "Get-Process -Id <pid>"`, then wait for `http://localhost:5173/` to answer before registering the preview.

## Production build (verification)

```
npx tsc -b        # typecheck
npm run build     # rolldown/vite build
npm run lint      # oxlint
```
