# TETRIS-VS: Roadmap

> Actualizado el 14 de octubre de 2026. Lo ya construido está en el [README](README.md); las decisiones y la evidencia de cada feature, en `odd/tasks/`.

Prioridad: `[P1]` alta · `[P2]` media · `[P3]` baja.

## Online: robustez

- [ ] `[P1]` **Reconexión a una partida en curso.** Hoy un corte de red de unos 7 s hace perder la partida por abandono. El servidor debería esperar un margen y reincorporar al jugador.
- [ ] `[P1]` **Validación en el servidor.** El servidor confía en el cliente (top-outs, basura enviada). Es necesario validar o simular las partidas en el servidor para evitar trampas.
- [ ] `[P2]` **Salir de `/match` sin "Abandonar"** (por ejemplo, con el botón atrás) deja la partida guardada en el store del cliente.
- [ ] `[P2]` **Cualquier socket desconectado hace perder la partida.** Cerrar una segunda pestaña que solo estaba en el lobby también hace perder la partida.
- [ ] `[P3]` **Invitación obsoleta.** Si un jugador te desafía y después desafía a otro, tu invitación sigue abierta y al aceptarla responde "El desafío ya no está disponible".

## Producto

- [ ] `[P2]` **Nombres reales en el modo local.** `/game` usa jugadores fijos ("Tokisha" y "Candy") definidos en el router.
- [ ] `[P2]` **Controles táctiles en el modo online.** Hoy el online solo se juega con teclado.
- [ ] `[P3]` **Persistencia:** historial de partidas, ranking y estadísticas.
- [ ] `[P3]` **Efectos de sonido** para líneas, combos y basura recibida. Hoy solo hay música.

## Infraestructura

- [ ] `[P2]` **Versionar `package-lock.json`.** Hoy está en `.gitignore`, así que el CI instala con `npm install` y no con `npm ci`.
- [ ] `[P2]` **Deploy.** No hay ningún entorno publicado.
- [ ] `[P3]` **Prettier.** `apps/api` tiene `format:check`, pero varios archivos no lo cumplen y el CI no lo ejecuta.
