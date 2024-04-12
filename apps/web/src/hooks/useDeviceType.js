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

  return { deviceType, isSmallScreen };
};

export default useDevice;
