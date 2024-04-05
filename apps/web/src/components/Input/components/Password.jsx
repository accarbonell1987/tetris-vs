import React from 'react'

import { Input } from '@nextui-org/react'

import { useAssets } from '../../../hooks'

const PasswordContainer = ({ ...props }) => {
  const { icons } = useAssets()
  const [isVisible, setIsVisible] = React.useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <Input
      endContent={
        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <img src={icons.eyeSlashFilled} alt="" />
          ) : (
            <img src={icons.eyeFilled} alt="" />
          )}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
      className="max-w-xs"
      {...props}
    />
  )
}

export default PasswordContainer
