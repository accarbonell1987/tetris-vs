import React, { useRef, useState, useEffect, useMemo } from 'react'
import { CustomLayout } from '../../components'
import { getGameInstance, inject } from './tetris'
import { Card, CardHeader, CardBody, CardFooter, Divider, Link } from '@nextui-org/react'
import { Player } from './components'
import { useDevice } from '../../hooks'

const GameComponent = () => {
  const gameRef = useRef(null)

  // Create game only once
  const game = useMemo(() => getGameInstance(), [])

  const [mounted, setMounted] = useState(false)
  const { deviceType } = useDevice()

  useEffect(() => {
    if (!mounted) setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !gameRef.current.hasChildNodes()) {
      inject(gameRef.current)
    }
  }, [mounted])

  useEffect(() => {
    console.log(game)
  }, [game.state.paused])

  if (!mounted) return

  return (
    <CustomLayout>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3 justify-center">
          <div className="flex h-7 justify-evenly items-center space-x-4 text-small">
            <Player
              name={'Piño'}
              image={'https://i.pravatar.cc/150?u=a042581f4e29026024d'}
              score={`${0} / 3000`}
              description={'CAMARADA'}
            />
            <Divider orientation="vertical" />
            <Player
              name={'Tunga'}
              image={'https://i.pravatar.cc/150?u=a04258114e29026702d'}
              score={`${0} / 3000`}
              description={'TENIENTE'}
            />
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <canvas ref={gameRef}></canvas>
        </CardBody>
        <Divider />
        <CardFooter>{deviceType !== 'unknown' ? 'PC' : 'Mobile'}</CardFooter>
      </Card>
    </CustomLayout>
  )
}

export default GameComponent
