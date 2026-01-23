import { BLOCK_SIZE } from '../static/commons';
import wallSrc from '../../../assets/images/block-wall.png';

import blueSrc from '../../../assets/images/block-blue.png';
import cyanSrc from '../../../assets/images/block-cyan.png';
import greenSrc from '../../../assets/images/block-green.png';
import orangeSrc from '../../../assets/images/block-orange.png';
import purpleSrc from '../../../assets/images/block-purple.png';
import redSrc from '../../../assets/images/block-red.png';
import yellowSrc from '../../../assets/images/block-yellow.png';

/**
 * Genera un número entero aleatorio dentro de un rango inclusivo.
 */
export const randomIntFromRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Selecciona un elemento aleatorio de un array.
 */
export const randomElement = arrs => {
  return arrs[Math.floor(Math.random() * arrs.length)];
};

/**
 * Crea una nueva instancia de Image y le asigna una fuente.
 */
export const createImage = (imageSrc, width, height) => {
  const image = new Image(width, height);
  image.src = imageSrc;

  return image;
};

/**
 * Mapea un índice numérico a un sprite (imagen) específico de bloque.
 * @param {number} index - El ID del bloque/color.
 * @returns {HTMLImageElement} La imagen cargada.
 */
export const loadSprite = index => {
  const width = BLOCK_SIZE;
  const height = BLOCK_SIZE;

  switch (index) {
    case 1:
      return createImage(wallSrc, width, height);
    case 2:
      return createImage(cyanSrc, width, height);
    case 3:
      return createImage(blueSrc, width, height);
    case 4:
      return createImage(orangeSrc, width, height);
    case 5:
      return createImage(yellowSrc, width, height);
    case 6:
      return createImage(greenSrc, width, height);
    case 7:
      return createImage(purpleSrc, width, height);
    case 8:
      return createImage(redSrc, width, height);

    default:
      return createImage(wallSrc, width, height);
  }
};
