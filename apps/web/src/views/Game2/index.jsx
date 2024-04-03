import React, { useEffect, useRef, useState } from 'react'
import { CustomLayout } from '../../components'
import { displayCanvas } from './game'

const Game2 = () => {
  const gameRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted) setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !gameRef.current.hasChildNodes()) {
      displayCanvas(gameRef.current)
    }
  }, [mounted])

  if (!mounted) return

  return (
    <CustomLayout>
      <div ref={gameRef} id="game" />
    </CustomLayout>
  )
}

export default Game2
