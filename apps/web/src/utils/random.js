const GetRandomElementFromList = (listOfElements) =>
  listOfElements[Math.floor(Math.random() * listOfElements.length)]

const GetRandomNumber = (max) => Math.floor(Math.random() * max)

const GetRandomWordFromArrayAndLength = (array, length) => {
  return Array.from({ length: length }, () => array[Math.floor(Math.random() * array.length)]).join(
    ''
  )
}

export { GetRandomElementFromList, GetRandomWordFromArrayAndLength, GetRandomNumber }
