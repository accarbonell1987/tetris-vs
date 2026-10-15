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
  'Esc o P: pausa',
  'Mandos: el 1.º es J1 y el 2.º J2 · cruceta/stick mover · ↑ soltar · ✕/A y ○/B girar · L1/R1 guardar · Options pausa'
];

// Pending garbage meter next to the online board (NextUI danger).
export const GARBAGE_COLOR = '#f31260';

// Online: one player per keyboard, so both key sets drive the same board (A4). No pause.
export const ONLINE_CONTROLS_LEGEND = [
  'A/D o ←/→ mover · S o ↓ bajar · W/↑ o Q// girar',
  'Espacio o Enter soltar · Shift guardar',
  'Mando: cruceta/stick mover · ↑ soltar · ✕/A y ○/B girar · L1/R1 guardar'
];

// Phones: the game fills the screen (safe areas included) and the canvas shrinks to the space left
// between the header and the controls. Desktop: the usual centered card.
export const GAME_CARD =
  'h-[100dvh] w-full max-w-full rounded-none pb-[env(safe-area-inset-bottom)] sm:h-auto sm:w-auto sm:rounded-large sm:pb-0';
export const CANVAS_FRAME = 'relative flex min-h-0 w-full flex-1 items-center justify-center';
export const CANVAS = 'block max-h-full max-w-full rounded-md';
