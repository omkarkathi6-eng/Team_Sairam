"use client";

import React, { forwardRef, useImperativeHandle, useState, useRef, useCallback, useEffect } from 'react';
import { TrainingVideo } from './TrainingVideo';

// Function to generate a consistent color based on the title
const stringToColor = (str) => {
  // Return a default color if str is undefined or empty
  if (!str) return 'hsl(210, 70%, 50%)';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
};

export const AITrainingVideo = forwardRef(({ videoSrc, title, onVideoComplete, autoplay = false, className = '' }, ref) => {
  const videoRef = useRef(null);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [hasError, setHasError] = useState(false);
  const hasStartedPlaying = useRef(false);
  const loadingTimeout = useRef(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    play: () => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    scrollIntoView: (options) => {
      if (videoRef.current) {
        videoRef.current.scrollIntoView(options);
      }
    }
  }));

  // Handle autoplay when component mounts or videoSrc changes
  useEffect(() => {
    if (autoplay && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current.play();
          hasStartedPlaying.current = true;
          setShowThumbnail(false);
        } catch (err) {
          console.error('Autoplay was prevented:', err);
        }
      };
      
      // Clear any existing timeouts
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
      
      // Set a timeout to handle initial loading
      loadingTimeout.current = setTimeout(() => {
        playVideo();
      }, 100);
      
      return () => {
        if (loadingTimeout.current) {
          clearTimeout(loadingTimeout.current);
        }
      };
    }
  }, [videoSrc, autoplay]);

  const handleVideoEnded = useCallback(() => {
    onVideoComplete?.();
  }, [onVideoComplete]);

  const handlePlay = useCallback(() => {
    setShowThumbnail(false);
    hasStartedPlaying.current = true;
  }, []);

  // Generate a consistent color based on the video title
  const bgColor = stringToColor(title);

  return (
    <div className={`relative ${className}`}>
      {/* Thumbnail Placeholder */}
      {showThumbnail && (
        <div 
          className="absolute inset-0 flex items-center justify-center text-white z-10"
          style={{ backgroundColor: bgColor }}
        >
          <div className="text-center p-4">
            <div className="text-4xl mb-2">
              {title ? 
                title.split(' ').map(word => word[0]).join('').toUpperCase() :
                'AI'
              }
            </div>
            <p className="text-sm opacity-80">{title || 'AI Training Video'}</p>
          </div>
        </div>
      )}

      {/* Video Element */}
      <TrainingVideo
        ref={videoRef}
        videoSrc={videoSrc}
        onVideoComplete={handleVideoEnded}
        className="w-full h-full object-cover"
        controls
        controlsList="nodownload" 
        onPlay={handlePlay}
        preload="auto"
        playsInline
        disablePictureInPicture
        onTimeUpdate={(e) => {
          const video = e.target;
          if (video.currentTime > video.duration * 0.9) {
            handleVideoEnded();
          }
        }}
        style={{ opacity: showThumbnail ? 0 : 1, transition: 'opacity 0.3s ease' }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </TrainingVideo>

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-600 p-4 z-10">
          <div className="text-center">
            <p className="font-medium">⚠️ Failed to load video</p>
            <p className="text-sm text-gray-600 mt-1">Please check your connection and try again</p>
          </div>
        </div>
      )}
      
      {/* Custom controls overlay if needed */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
    </div>
  );
});

AITrainingVideo.displayName = 'AITrainingVideo';
