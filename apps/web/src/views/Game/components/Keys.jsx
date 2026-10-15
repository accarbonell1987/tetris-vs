import { useState } from 'react';
import { Button } from '@nextui-org/react';
import {
  ArrowNarrowDown,
  ArrowNarrowLeft,
  ArrowNarrowRight,
  ArrowBarToDown,
  Archive,
  KeyboardHide,
  KeyboardShow,
  PlayerPause,
  Rotate,
  RotateClockwise
} from 'tabler-icons-react';

/**
 * One touch button. It reports press and release so the view can repeat moves while it is held
 * (same DAS/ARR as the keyboard). Large, equal targets; no text selection or double-tap zoom.
 */
const PadButton = ({ label, action, onPress, onRelease, className, children }) => (
  <Button
    isIconOnly
    aria-label={label}
    disableRipple
    className={`h-14 w-full min-w-0 rounded-xl data-[pressed=true]:scale-95 ${className}`}
    onPressStart={() => onPress(action)}
    onPressEnd={() => onRelease(action)}>
    {children}
  </Button>
);

const ICON = { size: 26, strokeWidth: 2.25 };

/**
 * Touch controls laid out like a gamepad: moves under the left thumb, both rotations stacked under the right.
 * `onPause` is only given in the local mode (there is no pause online).
 */
const Keys = ({ show, onPress, onRelease = () => {}, onPause }) => {
  const [visible, setVisible] = useState(show || false);
  const pad = { onPress, onRelease };

  if (!visible) {
    // Desktop: the controls stay out of the way until asked for.
    return (
      <div className="flex w-full justify-center">
        <Button isIconOnly aria-label="Mostrar controles táctiles" variant="flat" onPress={() => setVisible(true)}>
          <KeyboardShow size={22} strokeWidth={2} />
        </Button>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-[3fr_2fr] gap-4 select-none touch-none">
      <div className="grid grid-cols-3 gap-2">
        <PadButton label="Guardar pieza" action="hold" className="bg-secondary text-white" {...pad}>
          <Archive {...ICON} />
        </PadButton>
        {/* Online there is no pause: the hard drop, the most used button, takes its place. */}
        <PadButton label="Soltar" action="hardDrop" className={`bg-danger text-white ${onPause || !show ? '' : 'col-span-2'}`} {...pad}>
          <ArrowBarToDown {...ICON} />
        </PadButton>
        {onPause ? (
          <Button isIconOnly aria-label="Pausa" className="h-14 w-full min-w-0 rounded-xl" onPress={onPause}>
            <PlayerPause size={22} strokeWidth={2} />
          </Button>
        ) : !show ? (
          <Button isIconOnly aria-label="Ocultar controles táctiles" variant="flat" className="h-14 w-full min-w-0 rounded-xl" onPress={() => setVisible(false)}>
            <KeyboardHide size={22} strokeWidth={2} />
          </Button>
        ) : null}
        <PadButton label="Mover a la izquierda" action="left" className="bg-default-200 text-foreground" {...pad}>
          <ArrowNarrowLeft {...ICON} />
        </PadButton>
        <PadButton label="Bajar" action="softDrop" className="bg-default-200 text-foreground" {...pad}>
          <ArrowNarrowDown {...ICON} />
        </PadButton>
        <PadButton label="Mover a la derecha" action="right" className="bg-default-200 text-foreground" {...pad}>
          <ArrowNarrowRight {...ICON} />
        </PadButton>
      </div>
      <div className="grid grid-rows-2 gap-2">
        <PadButton label="Girar a la derecha" action="rotateCW" className="bg-success text-black" {...pad}>
          <RotateClockwise {...ICON} />
        </PadButton>
        <PadButton label="Girar a la izquierda" action="rotateCCW" className="bg-success text-black" {...pad}>
          <Rotate {...ICON} />
        </PadButton>
      </div>
    </div>
  );
};

export default Keys;
