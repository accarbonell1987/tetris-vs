# web

React 18 + Vite + NextUI client for tetris-vs.

- `src/views/Login`, `src/views/Lobby`: session (localStorage, 24 h) and the lobby with "VS" challenges and "Partida local".
- `src/views/Game`: local shared-board match. It holds pieces shared with the online view:
  - `input.js`: DAS/ARR keyboard repeat.
  - `render.js`: canvas renderer.
  - `static/commons.js`: key bindings and legends.
- `src/views/Match`: online match view. `logic.js` is the round/match reducer plus the board snapshot builder.
- `src/routes/AppShell.jsx` (root route): app-level socket listeners, so invites and `match-start` reach every screen.

```bash
npm run dev
```

```bash
npm test -- --run
```

```bash
npm run lint
```

It connects to `VITE_API_SERVER` (default `http://localhost:3000`).
