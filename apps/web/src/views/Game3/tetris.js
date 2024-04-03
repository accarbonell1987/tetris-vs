import {
  BLOCK_SIZE,
  BOARD_HEIGHT,
  BOARD_WIDTH,
  VELOCITY,
  MOVEMENTS,
  PIECES
} from './static/commons'

const game = {
  canvas: null,
  context: null,
  state: {
    score: 0,
    level: 1
  },
  render: {
    dropCounter: 0,
    lastTime: 0
  },
  board: null,
  piece: null
}

export const inject = (element) => {
  // const canvas = document.querySelector('canvas')

  const canvas = document.querySelector('canvas')
  const context = canvas.getContext('2d')

  canvas.width = BLOCK_SIZE * BOARD_WIDTH
  canvas.height = BLOCK_SIZE * BOARD_HEIGHT

  game.canvas = canvas
  game.context = context

  init()
}

export const init = () => {
  game.canvas.width = BLOCK_SIZE * BOARD_WIDTH
  game.canvas.height = BLOCK_SIZE * BOARD_HEIGHT

  game.context.scale(BLOCK_SIZE, BLOCK_SIZE)

  setup()
}

// const $score = document.querySelector('span')

// const audio = new window.Audio('./tetris.mp3')
// let audioState = true

const setup = () => {
  game.board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)
  game.piece = {
    position: { x: 5, y: 5 },
    shape: [
      [1, 1],
      [1, 1]
    ]
  }

  update()
}

function drawMatrix(matrix, color) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        game.context.fillStyle = color
        game.context.fillRect(x, y, 1, 1)
      }
    })
  })
}

function drawPiece(piece, color) {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        game.context.fillStyle = color
        game.context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })
}

function createBoard(width, height) {
  return Array(height)
    .fill()
    .map(() => Array(width).fill(0))
}

function draw() {
  game.context.fillStyle = '#000'
  game.context.fillRect(0, 0, game.canvas.width, game.canvas.height)

  drawMatrix(game.board, 'yellow')
  drawPiece(game.piece, 'red')

  // $score.innerText = score
}

function update(time = 0) {
  const deltaTime = time - game.render.lastTime

  game.render.lastTime = time
  game.render.dropCounter += deltaTime

  if (game.render.dropCounter > VELOCITY[game.state.level - 1].speed) {
    game.piece.position.y++
    game.render.dropCounter = 0
  }

  if (checkCollisions()) {
    game.piece.position.y--
    solidifyPiece()
    removeRows()
  }

  draw()
  window.requestAnimationFrame(update)
}

function checkCollisions() {
  return game.piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return value !== 0 && game.board[y + game.piece.position.y]?.[x + game.piece.position.x] !== 0
    })
  })
}

function solidifyPiece() {
  game.piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        game.board[y + game.piece.position.y][x + game.piece.position.x] = 1
      }
    })
  })

  game.piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]
  game.piece.position.x = 0
  game.piece.position.y = 0

  //! gameover
  if (checkCollisions()) {
    game.board.forEach((row) => row.fill(0))
  }
}

function removeRows() {
  const rowsToRemove = []

  game.board.forEach((row, y) => {
    if (row.every((value) => value === 1)) {
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach((y) => {
    game.board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    game.board.unshift(newRow)
  })

  game.state.score += rowsToRemove.length * 10

  let currentLevel = 1
  for (const item of VELOCITY) {
    if (item.score.max > game.state.score) {
      game.state.level = currentLevel
      break
    }
    currentLevel++
  }
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case MOVEMENTS.LEFT:
      {
        game.piece.position.x--
        if (checkCollisions()) piece.position.x++
      }
      break
    case MOVEMENTS.RIGHT:
      {
        game.piece.position.x++
        if (checkCollisions()) piece.position.x--
      }
      break
    case MOVEMENTS.DOWN:
      {
        game.piece.position.y++
        if (checkCollisions()) {
          game.piece.position.y--
          solidifyPiece()
          removeRows()
        }
      }
      break
    case MOVEMENTS.ROTATE:
      {
        const rotated = []

        for (let i = 0; i < game.piece.shape[0].length; i++) {
          const row = []
          for (let j = game.piece.shape.length - 1; j >= 0; j--) {
            row.push(game.piece.shape[j][i])
          }

          rotated.push(row)
        }

        const previousShape = game.piece.shape
        game.piece.shape = rotated
        if (checkCollisions()) game.piece.shape = previousShape
      }
      break

    default:
      break
  }
})

// const $section = document.querySelector('section')
// const $info = document.querySelector('article')

// $info.addEventListener('click', () => {
//   // audioState ? audio.pause() : audio.play()
//   // audioState = !audioState
//   // $info.innerText = `Music: ${audioState ? 'ON' : 'OFF'} | Speed: ${
//   //   VELOCITY[level - 1].speed
//   // } | Level: ${level}`
//   // $info.innerText = `Music: ${audioState ? "ON" : "OFF"}`;
// })

// $section.addEventListener('click', () => {
//   update()
//   // $section.remove()

//   // audio.volume = 0.5
//   // audio.play()
// })
