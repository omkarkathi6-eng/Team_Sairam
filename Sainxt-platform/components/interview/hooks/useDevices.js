import { useState, useEffect, useRef, useCallback } from 'react';

export function useDevices() {
  const [devices, setDevices] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const streamRef = useRef(null);

  const getDevices = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: true 
      });
      
      // Stop all tracks to release devices
      stream.getTracks().forEach(track => track.stop());
      
      setHasPermission(true);
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      setDevices(deviceList);
    } catch (error) {
      console.error("Error accessing devices:", error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getDevices();
    
    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [getDevices]);

  const hasVideoDevices = devices.some(device => device.kind === 'videoinput');
  const hasAudioDevices = devices.some(device => device.kind === 'audioinput');

  return {
    devices,
    hasPermission,
    isLoading,
    hasVideoDevices,
    hasAudioDevices,
    refreshDevices: getDevices
  };
}
