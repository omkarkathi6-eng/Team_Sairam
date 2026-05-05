import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

export default function GoogleStyleMic() {
  const [level, setLevel] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (!isMounted) return;

        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);

        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const updateLevel = () => {
          if (!isMounted || !analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          setLevel(avg);
          animationFrameRef.current = requestAnimationFrame(updateLevel);
        };

        updateLevel();
      })
      .catch((err) => console.error("Mic error:", err));

    return () => {
      isMounted = false;
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current)
        audioContextRef.current.close().catch(() => {});
    };
  }, []);

  return (
    <div className="flex justify-center items-center p-4">
      <motion.div
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex justify-center items-center bg-white shadow-md"
        animate={{
          scale: 1 + Math.min(level / 400, 0.1),
          boxShadow: `0 0 ${4 + level / 6}px rgba(66,133,244,0.4)`,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Mic
          className="w-5 h-5 sm:w-6 sm:h-6"
          style={{ color: level > 20 ? "#4285F4" : "#555" }}
        />
      </motion.div>
    </div>
  );
}
