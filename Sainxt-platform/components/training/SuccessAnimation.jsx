'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function SuccessAnimation({ onContinue, isFinalVideo, userName = 'Learner' }) {
  const router = useRouter();
  const canvasRef = useRef(null);
  
  // Confetti effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const colors = ['#FFD700', '#FF5E78', '#4CC9F0', '#F72585', '#7209B7', '#3A0CA3'];
    
    class Confetti {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 10 + 5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speed = Math.random() * 3 + 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 5 - 2.5;
        this.shape = Math.random() > 0.5 ? 'circle' : 'rectangle';
      }
      
      update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        
        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        if (this.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        } else {
          ctx.fillStyle = this.color;
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
        
        ctx.restore();
      }
    }
    
    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
      confettiPieces.push(new Confetti());
    }
    
    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < confettiPieces.length; i++) {
        confettiPieces[i].update();
        confettiPieces[i].draw();
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 flex items-center justify-center p-4">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 text-center z-10"
      >
        <div className="relative inline-block mb-6">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto" />
          </motion.div>
          
          <motion.div 
            className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 20, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              delay: 0.5
            }}
          >
            <Star className="w-6 h-6 fill-current" />
          </motion.div>
        </div>
        
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-gray-900 mb-3"
        >
          {isFinalVideo ? `Congratulations, ${userName}! 🎉` : "Great Job!"}
        </motion.h3>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 mb-8 text-lg"
        >
          {isFinalVideo ? (
            <>
              <span className="block mb-4">You've successfully completed the training program!</span>
              <span className="text-gray-700 font-medium">🎓 Certificate of Completion Unlocked!</span>
            </>
          ) : (
            "You've successfully completed this lesson."
          )}
        </motion.p>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {isFinalVideo ? (
            <Button
              onClick={() => {
                // Go to certificates page
                router.push("/individual/certificates");
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20"
            >
              🏆 View Your Certificate
            </Button>
          ) : (
            <Button 
              onClick={onContinue}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg transform transition-all hover:scale-105"
            >
              <CheckCircle className="mr-2 h-6 w-6" />
              Continue to Next Video
            </Button>
          )}
        </motion.div>
        
        <div className="mt-8 flex justify-center space-x-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
