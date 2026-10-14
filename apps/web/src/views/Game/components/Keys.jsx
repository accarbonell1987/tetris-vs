import { Button } from '@nextui-org/react';
import {
  ArrowNarrowDown,
  ArrowNarrowLeft,
  ArrowNarrowRight,
  ArrowBarToDown,
  KeyboardHide,
  KeyboardShow,
  PlayerPause,
  RotateClockwise
} from 'tabler-icons-react';
import { useState } from 'react';

/**
 * Componente que muestra las flechas de dirección (Izquierda, Derecha, Abajo).
 */
const LeftArrows = ({ onAction }) => {
  return (
    <div className="flex gap-2 flex-col">
      <div className="flex gap-2">
        {/* Botón Mover a la Izquierda */}
        <Button color="warning" variant="solid" onClick={() => onAction('left')}>
          <ArrowNarrowLeft size={48} strokeWidth={2} color={'black'} />
        </Button>
        {/* Botón Mover a la Derecha */}
        <Button
          color="warning"
          variant="solid"
          onClick={() => onAction('right')}>
          <ArrowNarrowRight size={48} strokeWidth={2} color={'black'} />
        </Button>
      </div>
      <div className="flex justify-center">
        {/* Botón Mover Abajo (Soft Drop) */}
        <Button
          className="w-full"
          color="warning"
          variant="solid"
          onClick={() => onAction('softDrop')}>
          <ArrowNarrowDown size={48} strokeWidth={2} color={'black'} />
        </Button>
      </div>
    </div>
  );
};

/**
 * Componente que muestra los botones de acción (Rotar y Booster).
 */
const RightButtons = ({ onAction }) => {
  return (
    <div>
      <div>
        {/* Botón Rotar Pieza */}
        <Button
          color="success"
          variant="solid"
          onClick={() => onAction('rotateCW')}>
          <RotateClockwise size={48} strokeWidth={2} color={'black'} />
        </Button>
      </div>
      <div>
        {/* Botón de caída instantánea (hard drop) */}
        <Button color="danger" variant="solid" onClick={() => onAction('hardDrop')}>
          <ArrowBarToDown size={48} strokeWidth={2} color={'black'} />
        </Button>
      </div>
    </div>
  );
};

/**
 * Botones centrales: Pausa y control de visibilidad de los controles.
 */
const MiddleButtons = ({ isMobile, showKeys, setShowKeys, onPause }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Botón de Pausa */}
      <Button isIconOnly variant="solid" size="sm" onClick={onPause}>
        <PlayerPause size={18} strokeWidth={2} color={'white'} />
      </Button>
      {/* Botón para ocultar los controles visuales (solo desktop) */}
      {!isMobile ? (
        <Button
          isIconOnly
          color="success"
          variant="solid"
          size="sm"
          onClick={() => {
            setShowKeys(!showKeys);
          }}>
          <KeyboardHide size={22} strokeWidth={2} color={'white'} />
        </Button>
      ) : null}
    </div>
  );
};

/**
 * Componente principal Keys que maneja la interfaz de controles táctiles/visuales.
 */
const Keys = ({ show, onAction, onPause }) => {
  const isMobile = show;
  const [showKeys, setShowKeys] = useState(show || false);

  const keysComponents = (
    <div className="flex justify-center gap-2">
      <LeftArrows onAction={onAction} />
      <MiddleButtons
        isMobile={isMobile}
        showKeys={showKeys}
        setShowKeys={setShowKeys}
        onPause={onPause}
      />
      <RightButtons onAction={onAction} />
    </div>
  );

  return showKeys ? (
    keysComponents
  ) : (
    // Botón para volver a mostrar los controles cuando están ocultos
    <div className="flex justify-center w-full">
      <Button
        isIconOnly
        color="success"
        variant="solid"
        onClick={() => {
          setShowKeys(!showKeys);
        }}>
        <KeyboardShow size={22} strokeWidth={2} color={'white'} />
      </Button>
    </div>
  );
};

export default Keys;
