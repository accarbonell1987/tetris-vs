import React, { useRef, useState, useEffect } from 'react'
import { CustomLayout } from '../../components'
import { inject } from './tetris'

const Game3 = () => {
  const gameRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted) setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !gameRef.current.hasChildNodes()) {
      inject(gameRef.current)
    }
  }, [mounted])

  if (!mounted) return

  return (
    <CustomLayout>
      <canvas ref={gameRef}></canvas>
    </CustomLayout>
  )
}

export default Game3
