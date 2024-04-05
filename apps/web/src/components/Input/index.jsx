import React from 'react'

import InputDefault from './components/Input'
import InputPassword from './components/Password'

const CustomInput = ({ type, handleChange, ...props }) => {
  // const [inputData, setInputData] = useState({ color: '' })

  // const onValueChange = (e) => {
  //   const filled = !!e.target.value
  //   const error = required ? (filled === true ? false : true) : false
  //   setInputData({ color: error ? 'error' : '' })
  //   handleChange(e)
  // }

  return type === 'password' ? <InputPassword {...props} /> : <InputDefault {...props} />
}

export default CustomInput
