# TETRIS-VS: TODO List

> Estado actual del proyecto analizado el 24 de Enero, 2026

---

## Leyenda de Prioridad

- `[P0]` - **Crítico** - Bloquea funcionalidad core
- `[P1]` - **Alta** - Necesario para MVP funcional
- `[P2]` - **Media** - Mejora significativa
- `[P3]` - **Baja** - Nice to have

## Leyenda de Estado

- `[ ]` - Pendiente
- `[~]` - En progreso
- `[x]` - Completado

---

## 1. WebSocket API - Server Side

### 1.1 Corregir Bugs Críticos

- [ ] `[P0]` **Fix lobbyServices.js Map syntax**
  - Archivo: `apps/api/src/services/lobbyServices.js`
  - Problema: `.set(players)` debe ser `.set(playerId, player)`
  - Afecta: `addPlayer()`, `setConnectedPlayers()`

### 1.2 Implementar Handler de Login

- [ ] `[P0]` **Agregar listener para evento 'login' en server**
  - Archivo: `apps/api/src/server.js`
  - Tareas:
    - [ ] Crear handler `socket.on('login', (playerData) => {...})`
    - [ ] Validar datos del jugador (name, image requeridos)
    - [ ] Generar/asignar ID único al jugador
    - [ ] Agregar jugador al Lobby service
    - [ ] Emitir `lobby-update` a todos los clientes
    - [ ] Emitir confirmación `login-success` al cliente

### 1.3 Mejorar Gestión de Conexiones

- [ ] `[P1]` **Mejorar manejo de desconexión**
  - Archivo: `apps/api/src/server.js`
  - Tareas:
    - [ ] Remover jugador del lobby al desconectar
    - [ ] Broadcast `lobby-update` tras desconexión
    - [ ] Logging de conexiones/desconexiones

- [ ] `[P1]` **Agregar evento de reconexión**
  - Restaurar sesión del jugador si se reconecta
  - Mantener estado del juego si estaba en partida

---

## 2. WebSocket API - Client Side

### 2.1 Mejorar Socket Service

- [ ] `[P1]` **Refactorizar socketService.js**
  - Archivo: `apps/web/src/services/socketService.js`
  - Tareas:
    - [ ] Agregar listener para `login-success`
    - [ ] Agregar listener para `login-error`
    - [ ] Agregar listener para `lobby-update`
    - [ ] Manejar errores de conexión
    - [ ] Implementar retry logic con backoff

### 2.2 Integrar con Zustand Store

- [ ] `[P1]` **Conectar socket con global store**
  - Archivo: `apps/web/src/store/slices/createGlobalStore.js`
  - Tareas:
    - [ ] Guardar instancia de socket en store
    - [ ] Crear acciones para eventos de socket
    - [ ] Sincronizar estado de conexión

---

## 3. Sistema de Login

### 3.1 Mejoras de Flujo

- [ ] `[P1]` **Esperar confirmación del servidor antes de navegar**
  - Archivo: `apps/web/src/views/Login/index.jsx`
  - Tareas:
    - [ ] Mostrar loading mientras espera `login-success`
    - [ ] Manejar `login-error` con mensaje al usuario
    - [ ] Solo navegar a Lobby tras confirmación

### 3.2 Validación y Errores

- [ ] `[P2]` **Agregar validación de nickname**
  - Longitud mínima/máxima
  - Caracteres permitidos
  - Verificar disponibilidad (opcional)

- [ ] `[P2]` **Mejorar feedback de errores**
  - Toast notifications para errores
  - Estados de loading en botones

### 3.3 Funcionalidades Adicionales

- [ ] `[P3]` **Implementar logout**
  - Agregar botón de logout en header/lobby
  - Limpiar localStorage
  - Emitir evento de desconexión
  - Navegar a login

- [ ] `[P3]` **Implementar "Remember Me" funcional**
  - El campo existe pero no se usa
  - Extender expiración si está activo

---

## 4. Sistema de Lobby

### 4.1 Conectar con Backend (CRÍTICO)

- [ ] `[P0]` **Reemplazar datos hardcodeados con datos reales**
  - Archivo: `apps/web/src/views/Lobby/index.jsx`
  - Tareas:
    - [ ] Eliminar array de jugadores ficticios
    - [ ] Crear estado local para lista de jugadores
    - [ ] Suscribirse a evento `lobby-update` al montar
    - [ ] Actualizar lista cuando llegue `lobby-update`
    - [ ] Desuscribirse al desmontar

### 4.2 UI del Lobby

- [ ] `[P1]` **Mostrar estado de conexión**
  - Indicador visual de conectado/desconectado
  - Contador de jugadores online

- [ ] `[P1]` **Implementar botón "VS"**
  - Archivo: `apps/web/src/views/Lobby/components/PlayerCard.jsx`
  - Tareas:
    - [ ] Agregar onClick handler
    - [ ] Emitir evento `challenge-player` con ID del oponente
    - [ ] Mostrar estado "Esperando respuesta..."

### 4.3 Sistema de Invitaciones

- [ ] `[P2]` **Crear flujo de invitación a partida**
  - Eventos necesarios:
    - [ ] `challenge-player` (cliente → server)
    - [ ] `challenge-received` (server → oponente)
    - [ ] `challenge-accepted` (oponente → server)
    - [ ] `challenge-declined` (oponente → server)
    - [ ] `match-created` (server → ambos)
  - UI:
    - [ ] Modal de invitación recibida
    - [ ] Botones Aceptar/Rechazar
    - [ ] Timer de expiración (30s)

---

## 5. Sistema de Matchmaking

### 5.1 Crear Room/Match Service

- [ ] `[P1]` **Implementar servicio de salas en backend**
  - Archivo nuevo: `apps/api/src/services/matchServices.js`
  - Funcionalidades:
    - [ ] Crear sala con 2 jugadores
    - [ ] Generar ID único de partida
    - [ ] Trackear estado de la partida
    - [ ] Manejar abandono de jugador

### 5.2 Eventos de Partida

- [ ] `[P1]` **Implementar eventos de match**
  - Server events:
    - [ ] `match-start` - Iniciar partida
    - [ ] `match-end` - Finalizar partida
    - [ ] `player-left` - Jugador abandonó
  - Client handlers para cada evento

---

## 6. Sincronización de Juego

### 6.1 Eventos de Gameplay

- [ ] `[P1]` **Implementar sincronización de estado**
  - Eventos necesarios:
    - [ ] `game-state` - Estado completo del tablero
    - [ ] `piece-move` - Movimiento de pieza
    - [ ] `piece-rotate` - Rotación de pieza
    - [ ] `piece-drop` - Hard drop
    - [ ] `lines-cleared` - Líneas eliminadas
    - [ ] `garbage-sent` - Líneas de basura enviadas

### 6.2 Integrar con Game View

- [ ] `[P1]` **Modificar Game para multiplayer**
  - Archivo: `apps/web/src/views/Game/index.jsx`
  - Tareas:
    - [ ] Recibir ID de partida como parámetro
    - [ ] Conectar eventos de socket
    - [ ] Renderizar tablero del oponente en tiempo real
    - [ ] Enviar actualizaciones propias

### 6.3 Lógica de Victoria

- [ ] `[P2]` **Implementar condiciones de fin de partida**
  - Game over cuando tablero lleno
  - Notificar al servidor
  - Mostrar pantalla de resultado
  - Opción de revancha

---

## 7. Mejoras de Arquitectura

### 7.1 Error Handling

- [ ] `[P2]` **Implementar manejo global de errores de socket**
  - Error boundaries para componentes
  - Retry automático con exponential backoff
  - UI de reconexión

### 7.2 Testing

- [ ] `[P3]` **Agregar tests para socket events**
  - Tests unitarios para lobbyServices
  - Tests de integración para flujo login
  - Tests E2E para partida completa

### 7.3 Logging y Debugging

- [ ] `[P3]` **Mejorar logging en servidor**
  - Logs estructurados
  - Tracking de eventos por sesión
  - Métricas de conexiones

---

## 8. Seguridad

- [ ] `[P2]` **Validar datos en servidor**
  - Sanitizar inputs del cliente
  - Rate limiting en eventos
  - Validar que jugador pertenece a la partida

- [ ] `[P3]` **Implementar autenticación real**
  - JWT tokens
  - Refresh token flow
  - Proteger endpoints HTTP

---

## Orden de Implementación Sugerido

### Fase 1: Conexión Básica Funcional
1. Fix `lobbyServices.js` Map bug
2. Agregar handler `login` en server
3. Conectar Lobby UI con `lobby-update`
4. Esperar confirmación antes de navegar

### Fase 2: Matchmaking
5. Implementar botón VS funcional
6. Sistema de invitaciones
7. Crear servicio de salas

### Fase 3: Gameplay Multiplayer
8. Eventos de sincronización de juego
9. Renderizar oponente en tiempo real
10. Lógica de victoria/derrota

### Fase 4: Polish
11. Error handling robusto
12. Testing
13. Mejoras de UX

---

## Archivos Clave a Modificar

| Archivo | Cambios Necesarios |
|---------|-------------------|
| `apps/api/src/server.js` | Agregar handler login, mejorar disconnect |
| `apps/api/src/services/lobbyServices.js` | Fix Map syntax bug |
| `apps/web/src/services/socketService.js` | Agregar listeners, error handling |
| `apps/web/src/views/Lobby/index.jsx` | Conectar con websocket real |
| `apps/web/src/views/Lobby/components/PlayerCard.jsx` | Implementar botón VS |
| `apps/web/src/views/Login/index.jsx` | Esperar confirmación server |
| `apps/web/src/views/Game/index.jsx` | Integrar multiplayer |

---

## Referencias

- [Socket.IO Docs](https://socket.io/docs/v4/)
- [Zustand](https://github.com/pmndrs/zustand)
- [NextUI](https://nextui.org/)

---

*Generado automáticamente por análisis de código - Claude Code*
