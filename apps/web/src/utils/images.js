import { Buffer } from 'buffer'

const ConvertToBase64 = (data) => {
  const buffer = Buffer.from(data)
  return buffer.toString('base64')
}

const GetImage = (image) => {
  return image && `data:image/svg+xml;base64,${image}`
}

export { ConvertToBase64, GetImage }
