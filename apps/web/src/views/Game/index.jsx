import React, { useRef, useState, useEffect } from 'react'
import { CustomLayout } from '../../components'
import { inject } from './tetris'
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from '@nextui-org/react'

const Game = () => {
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
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">Player 1</p>
            <p className="text-small text-default-500">tetris.org</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <canvas ref={gameRef}></canvas>
        </CardBody>
        <Divider />
        <CardFooter>
          <Link isExternal showAnchorIcon href="https://github.com/nextui-org/nextui">
            Buttons
          </Link>
        </CardFooter>
      </Card>
    </CustomLayout>
  )
}

export default Game
