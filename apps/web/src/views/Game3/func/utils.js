export const randomIntFromRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const randomElement = (arrs) => {
  return arrs[Math.floor(Math.random() * arrs.length)]
}
