import React from 'react'
import { UserTwitterCard } from '../../../components'

import { Popover, PopoverTrigger, PopoverContent, User } from '@nextui-org/react'

const Player = ({ name, description, score, image }) => {
  return (
    <Popover showArrow placement="bottom">
      <PopoverTrigger>
        <User
          as="button"
          name={name}
          description={score}
          className="transition-transform"
          avatarProps={{
            src: image,
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <UserTwitterCard name={name} score={score} description={description} />
      </PopoverContent>
    </Popover>
  )
}

export default Player
