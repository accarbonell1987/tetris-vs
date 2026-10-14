import InputDefault from './components/Input'
import InputPassword from './components/Password'

// handleChange is taken out of props on purpose so it is not forwarded to the DOM input.
// eslint-disable-next-line no-unused-vars
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
