import React, { useEffect } from 'react'
import { CustomLayout } from '../../components'
import { displayCanvas } from './game'

const Game = () => {
  useEffect(() => {
    const element = document.getElementById('game')
    if (element && !element?.hasChildNodes()) {
      displayCanvas(element)
    }

    return () => {
      element.innerHTML = ''
    }
  }, [])

  return (
    <CustomLayout>
      <div id="game" />
    </CustomLayout>
  )
}

export default Game
