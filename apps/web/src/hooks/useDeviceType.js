import { useState, useEffect } from 'react'

const deviceStatics = {
  deviceType: '',
  isMobile: null,
  isAndroid: false,
  isIphone: false,
  isWeb: false
}

const useDeviceType = () => {
  const [device, setDevice] = useState(deviceStatics)

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera

    if (/android/i.test(userAgent)) {
      setDevice({ ...device, deviceType: 'android', isMobile: true, isAndroid: true })
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setDevice({ ...device, deviceType: 'iphone', isMobile: true, isIphone: true })
    } else {
      setDevice({ ...device, deviceType: 'web', isMobile: false, isWeb: true })
    }
  }, [])

  return { device }
}

export default useDeviceType
