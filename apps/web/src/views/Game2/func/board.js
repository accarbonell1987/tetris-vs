// func/board.js

import { Container, Sprite } from 'pixi.js'
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT } from '../static/commons'

export function drawBoard(app) {
  const boardContainer = new Container()

  // Loop through each row and column of the board
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      // Create a sprite for the block
      const blockSprite = new Sprite('../../../assets/images/block-wall.png')

      // Position the sprite based on row and column
      blockSprite.x = col * BLOCK_SIZE
      blockSprite.y = row * BLOCK_SIZE

      // Add the sprite to the container
      boardContainer.addChild(blockSprite)
    }
  }

  // Position the board container in the center of the stage
  boardContainer.x = (app.screen.width - BLOCK_SIZE * BOARD_WIDTH) / 2
  boardContainer.y = (app.screen.height - BLOCK_SIZE * BOARD_HEIGHT) / 2

  // Add the board container to the stage
  app.stage.addChild(boardContainer)
}
