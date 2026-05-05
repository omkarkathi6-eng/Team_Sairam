"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Fullscreen, PictureInPicture, Clock, Bookmark, Settings, Maximize2, Minimize2, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const TrainingVideo = React.forwardRef(({ onVideoComplete, videoSrc = "/sample.mp4", className }, ref) => {
  // Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const hasStartedPlaying = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [chapters] = useState([
    { time: 0, title: 'Introduction' },
    { time: 60, title: 'Getting Started' },
    { time: 180, title: 'Key Concepts' },
    { time: 300, title: 'Advanced Topics' },
  ]);

  const videoRef = useRef(null);
  
  // Forward the ref to the video element
  React.useImperativeHandle(ref, () => ({
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    videoRef: { current: videoRef.current }
  }));
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!videoRef.current) return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'arrowleft':
          seek(-5);
          break;
        case 'arrowright':
          seek(5);
          break;
        case 'arrowup':
          adjustVolume(0.1);
          break;
        case 'arrowdown':
          adjustVolume(-0.1);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle video loading
  const handleLoadedData = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // Only set loading to false if not already playing
      if (!isPlaying) {
        setIsLoading(false);
      }
    }
  };
  
  // Handle when video starts playing
  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(false);
  };
  
  // Handle when video is waiting for data
  const handleWaiting = () => {
    // Only show loading if video was playing
    if (isPlaying) {
      setIsLoading(true);
    }
  };
  
  // Handle when enough data is available to play
  const handleCanPlay = () => {
    setIsLoading(false);
  };

  // Handle mouse movement for controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
          .then(() => {
            hasStartedPlaying.current = true;
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(err => console.error('Error playing video:', err));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Adjust volume
  const adjustVolume = (delta) => {
    if (videoRef.current) {
      const newVolume = Math.min(1, Math.max(0, volume + delta));
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      if (newVolume === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  // Seek video
  const seek = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    const currentProgress = (currentTime / video.duration) * 100;
    
    setCurrentTime(currentTime);
    setProgress(currentProgress);

    // Check if video is within 1 second of ending
    if (currentTime >= video.duration - 1 && !isCompleted) {
      setIsCompleted(true);
      onVideoComplete?.();
    }
  };

  const handleVideoEnd = () => {
    setIsCompleted(true);
    setShowReplay(true);
    onVideoComplete?.();
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play();
    setIsCompleted(false);
    setShowReplay(false);
    setProgress(0);
  };

  // Get current chapter
  const getCurrentChapter = () => {
    for (let i = chapters.length - 1; i >= 0; i--) {
      if (currentTime >= chapters[i].time) {
        return chapters[i];
      }
    }
    return chapters[0];
  };

  // Handle chapter click
  const handleChapterClick = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Handle progress bar click
  const handleProgressBarClick = (e) => {
    if (!videoRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        'relative w-full bg-black rounded-lg overflow-hidden group',
        isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen' : 'max-w-4xl mx-auto',
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Video Container */}
      <div className="relative aspect-video">
        {/* Loading Overlay - Only show if video is actually buffering */}
        {isLoading && hasStartedPlaying.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain bg-black"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          onLoadedData={handleLoadedData}
          onPlay={handlePlay}
          onWaiting={handleWaiting}
          onCanPlay={handleCanPlay}
          onClick={togglePlayPause}
          playsInline
          muted={isMuted}
          preload="auto"
        />

        {/* Play/Pause Overlay */}
        <AnimatePresence>
          {(!isPlaying || isHovering) && showControls && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={togglePlayPause}
                className="p-4 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
              >
                {isPlaying ? (
                  <Pause className="h-12 w-12 text-white" />
                ) : (
                  <Play className="h-12 w-12 text-white ml-1" />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 cursor-pointer group-hover:h-2 transition-all duration-200"
          onClick={handleProgressBarClick}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute -right-1.5 -top-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>

        {/* Chapter Markers */}
        <div className="absolute bottom-2 left-0 right-0 px-2">
          <div className="relative h-1 mt-2">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                className="absolute -top-2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors"
                style={{ left: `${(chapter.time / duration) * 100}%` }}
                onClick={() => handleChapterClick(chapter.time)}
              />
            ))}
          </div>
        </div>

        {/* Bottom Controls */}
        <AnimatePresence>
          {(isHovering || !isPlaying) && showControls && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10"
                          onClick={togglePlayPause}
                        >
                          {isPlaying ? (
                            <Pause className="h-5 w-5" />
                          ) : (
                            <Play className="h-5 w-5 ml-0.5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isPlaying ? 'Pause' : 'Play'} (k)</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10"
                          onClick={toggleMute}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="h-5 w-5" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isMuted ? 'Unmute' : 'Mute'} (m)</p>
                      </TooltipContent>
                    </Tooltip>

                    <div className="w-24">
                      <Slider
                        value={[isMuted ? 0 : volume * 100]}
                        max={100}
                        step={1}
                        onValueChange={(value) => {
                          const newVolume = value[0] / 100;
                          setVolume(newVolume);
                          if (videoRef.current) {
                            videoRef.current.volume = newVolume;
                            videoRef.current.muted = newVolume === 0;
                            setIsMuted(newVolume === 0);
                          }
                        }}
                        className="h-1"
                      />
                    </div>

                    <div className="text-xs text-white/70 min-w-[80px] text-right">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </TooltipProvider>
                </div>

                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10"
                          onClick={async () => {
                            if (document.pictureInPictureElement) {
                              await document.exitPictureInPicture();
                            } else if (document.pictureInPictureEnabled) {
                              await videoRef.current.requestPictureInPicture();
                            }
                          }}
                        >
                          <PictureInPicture className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Picture in Picture</p>
                      </TooltipContent>
                    </Tooltip>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10"
                        >
                          <Settings className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-2 bg-gray-800 border-gray-700">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-white/80 px-2 py-1">Playback Speed</p>
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              className={`w-full text-left px-2 py-1 text-sm rounded ${
                                playbackRate === rate
                                  ? 'bg-blue-500 text-white'
                                  : 'text-white/70 hover:bg-white/10'
                              }`}
                              onClick={() => {
                                if (videoRef.current) {
                                  videoRef.current.playbackRate = rate;
                                  setPlaybackRate(rate);
                                }
                              }}
                            >
                              {rate === 1 ? 'Normal' : `${rate}x`}
                            </button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10"
                          onClick={toggleFullscreen}
                        >
                          {isFullscreen ? (
                            <Minimize2 className="h-5 w-5" />
                          ) : (
                            <Maximize2 className="h-5 w-5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} (f)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chapter Info */}
      <div className="p-4 bg-gradient-to-b from-black/80 to-black/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-white/70">
                {getCurrentChapter()?.title || 'Introduction'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 px-3 bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
              onClick={handleReplay}
            >
              <RefreshCw className="h-3 w-3 mr-1.5" />
              Replay
            </Button>
            
            {isCompleted ? (
              <div className="flex items-center space-x-1.5 text-sm">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-medium">Completed</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-sm">
                <Bookmark className="h-4 w-4 text-amber-400" />
                <span className="text-amber-400">In Progress</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

TrainingVideo.displayName = 'TrainingVideo';

export { TrainingVideo };
