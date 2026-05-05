import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Video } from "lucide-react";

export default function DeviceTestStep({ onStartInterview }) {
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [audioChecked, setAudioChecked] = useState(false);
  const [consent, setConsent] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Handle camera + mic stream
  useEffect(() => {
    const initStream = async () => {
      try {
        const constraints = {
          video: cameraEnabled,
          audio: micEnabled,
        };

        if (cameraEnabled || micEnabled) {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          streamRef.current = stream;

          if (cameraEnabled && videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
      } catch (err) {
        console.error("Error accessing devices:", err);
      }
    };

    initStream();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [cameraEnabled, micEnabled]);

  // Start audio recognition
  const handleAudioCheck = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setRecognizedText(text);

      if (text.includes("hello")) {
        setAudioChecked(true);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  return (
    <Card className="p-6 flex flex-col md:flex-row gap-6 items-start">
      {/* Left: Video Preview */}
      <div className="relative w-full md:w-1/2 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        {cameraEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Camera is off
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-3">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setMicEnabled(!micEnabled)}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setCameraEnabled(!cameraEnabled)}
          >
            <Video className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Right: Instructions */}
      <div className="flex flex-col w-full md:w-1/2 gap-4">
        <h2 className="text-lg font-semibold">DeviceTestStep</h2>

        <div className="flex items-center justify-between border rounded-md px-3 py-2">
          <input
            type="text" 
            value={recognizedText || "Say 'hello' to test your audio"}
            readOnly
            className="flex-1 outline-none text-gray-600 bg-transparent"
          />
          <Button
            size="sm"
            variant="ghost"
            className={audioChecked ? "text-green-600" : "text-red-500"}
            onClick={handleAudioCheck}
          >
            {audioChecked ? "Audio OK" : "Check audio"}
          </Button>
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1"
          />
          I agree to{" "}
          <a href="#" className="underline font-medium">
            record and use
          </a>{" "}
          my video, audio, and screenshots for evaluation purposes.
        </label>

        <Button 
          onClick={onStartInterview}
          disabled={!consent || !audioChecked} 
          className="mt-2"
        >
          Start Interview
        </Button>
      </div>
    </Card>
  );
}
