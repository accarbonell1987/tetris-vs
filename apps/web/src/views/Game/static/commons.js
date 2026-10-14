// Size of one block in pixels.
export const BLOCK_SIZE = 24;

// Outline color of each player's falling piece (NextUI warning / primary).
export const PLAYER_COLORS = ['#f5a524', '#006fee'];

// Two players on one keyboard: KeyboardEvent.code → engine action.
export const KEY_BINDINGS = {
  KeyA: { player: 0, action: 'left' },
  KeyD: { player: 0, action: 'right' },
  KeyS: { player: 0, action: 'softDrop' },
  KeyW: { player: 0, action: 'rotateCW' },
  KeyQ: { player: 0, action: 'rotateCCW' },
  Space: { player: 0, action: 'hardDrop' },
  ShiftLeft: { player: 0, action: 'hold' },

  ArrowLeft: { player: 1, action: 'left' },
  ArrowRight: { player: 1, action: 'right' },
  ArrowDown: { player: 1, action: 'softDrop' },
  ArrowUp: { player: 1, action: 'rotateCW' },
  Slash: { player: 1, action: 'rotateCCW' },
  Enter: { player: 1, action: 'hardDrop' },
  ShiftRight: { player: 1, action: 'hold' }
};

export const PAUSE_KEYS = ['Escape', 'KeyP'];

// Controls legend shown under the board; keep it in sync with KEY_BINDINGS.
export const CONTROLS_LEGEND = [
  'J1: A/D mover · S bajar · W/Q girar · Espacio soltar · Shift izq. guardar',
  'J2: ←/→ mover · ↓ bajar · ↑// girar · Enter soltar · Shift der. guardar',
  'Esc o P: pausa'
];

// Pending garbage meter next to the online board (NextUI danger).
export const GARBAGE_COLOR = '#f31260';

// Online: one player per keyboard, so both key sets drive the same board (A4). No pause.
export const ONLINE_CONTROLS_LEGEND = [
  'A/D o ←/→ mover · S o ↓ bajar · W/↑ o Q// girar',
  'Espacio o Enter soltar · Shift guardar'
];
