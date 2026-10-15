import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

const useDevice = () => {
  const [deviceType, setDeviceType] = useState('');

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      setDeviceType('android');
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setDeviceType('iphone');
    } else {
      setDeviceType('unknown');
    }
  }, []);

  const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' });
  // Touch screens (phones, tablets, iPads that report a desktop user agent) get on-screen controls.
  const isTouch = useMediaQuery({ query: '(pointer: coarse)' });

  return { deviceType, isSmallScreen, isTouch };
};

export default useDevice;
