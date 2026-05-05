"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, BrainCircuit, Code, Bot, Rocket, Play, BookOpen, Cpu, Code2 } from 'lucide-react';

const carouselItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1677442135136-760c813d047f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    title: "AI for Individuals",
    description: "Transforming your career with intelligent tools",
    gradient: "from-[hsl(210_35%_17%/0.9)] via-[hsl(210_40%_8%/0.7)] to-[hsl(210_35%_17%/0.9)]"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    title: "Machine Learning",
    description: "Unlock the power of predictive analytics",
    gradient: "from-[hsl(11_100%_61%/0.9)] via-[hsl(14_100%_64%/0.7)] to-[hsl(11_100%_61%/0.9)]"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1560472578-9d2a6e8f2a1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    title: "Neural Networks",
    description: "Mimicking the human brain's learning process",
    gradient: "from-[hsl(172_75%_52%/0.9)] via-[hsl(172_75%_52%/0.7)] to-[hsl(172_75%_52%/0.9)]"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    title: "Data Science",
    description: "Extracting insights from complex datasets",
    gradient: "from-[hsl(215_8%_18%/0.9)] via-[hsl(210_35%_17%/0.7)] to-[hsl(215_8%_18%/0.9)]"
  },
];

export function IntroAnimation({ onGetStarted }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef(null);

  // Reset animation state when index changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAnimating) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
        setDirection(1);
      }, 5000);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isAnimating]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[hsl(var(--background))]">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 -z-20 opacity-10">
        <div className="absolute inset-0 bg-grid-[hsl(var(--deep-navy))]/10 [mask-image:linear-gradient(0deg,transparent,white,transparent)]" />
      </div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 -z-10">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: `hsl(${i % 2 === 0 ? 'var(--neon-coral)' : 'var(--aqua-blue)'}/0.3)`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 4 + 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Carousel Background */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${carouselItems[currentIndex].image})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              filter: 'blur(10px) brightness(0.6)'
            }}
            custom={direction}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ 
              opacity: 1, 
              scale: 1.1,
              transition: { 
                duration: 1,
                ease: [0.4, 0.0, 0.2, 1]
              }
            }}
            exit={{
              opacity: 0,
              scale: 1,
              transition: {
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1]
              }
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${carouselItems[currentIndex].gradient}`} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Light Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(var(--neon-coral)/0.1) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, hsl(var(--aqua-blue)/0.1) 0%, transparent 70%)' }}
        />
      </div>
      
      {/* Content */}
      <motion.div 
        className="text-center px-6 max-w-5xl mx-auto relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
               style={{ background: 'linear-gradient(135deg, hsl(var(--neon-coral)) 0%, hsl(var(--electric-orange)) 100%)' }}>
            <Cpu className="h-10 w-10 text-white" />
          </div>
        </motion.div>
        
        <motion.h1 
          variants={item}
          className="text-4xl md:text-6xl font-bold mb-6"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--deep-navy)) 0%, hsl(var(--graphite-gray)) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent'
          }}
        >
          Unlock Your AI Potential
        </motion.h1>
        
        <motion.p 
          variants={item}
          className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Embark on a transformative journey into the world of Artificial Intelligence. 
          Our interactive training will guide you through the fundamentals of AI in an engaging, hands-on way.
        </motion.p>
        
        <motion.div variants={item} className="flex flex-wrap justify-center gap-4 mb-16">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[hsl(var(--border))]">
            <Play className="h-4 w-4 text-[hsl(var(--neon-coral))]" />
            <span className="text-sm font-medium text-[hsl(var(--graphite-gray))]">Interactive Learning</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[hsl(var(--border))]">
            <BookOpen className="h-4 w-4 text-[hsl(var(--neon-coral))]" />
            <span className="text-sm font-medium text-[hsl(var(--graphite-gray))]">AI Fundamentals</span>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-[hsl(var(--border))]">
            <Code className="h-4 w-4 text-[hsl(var(--neon-coral))]" />
            <span className="text-sm font-medium text-[hsl(var(--graphite-gray))]">Hands-on Practice</span>
          </div>
        </motion.div>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="text-lg px-8 py-6 font-semibold group text-white hover:shadow-lg transition-all duration-200"
            style={{
              background: 'linear-gradient(90deg, hsl(var(--neon-coral)) 0%, hsl(var(--electric-orange)) 100%)',
              boxShadow: '0 4px 14px 0 hsla(11, 100%, 61%, 0.3)'
            }}
          >
            Get Started
            <Rocket className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
        
        {/* Carousel indicators */}
        <motion.div 
          className="flex justify-center mt-12 gap-2"
          variants={item}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {[
            { icon: <BrainCircuit className="h-8 w-8" />, text: "AI Fundamentals" },
            { icon: <Bot className="h-8 w-8" />, text: "Interactive Learning" },
            { icon: <Cpu className="h-8 w-8" />, text: "Hands-on Practice" },
            { icon: <Code2 className="h-8 w-8" />, text: "Real-world Projects" },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="p-3 bg-white/90 rounded-xl border border-gray-200 group-hover:bg-[hsl(var(--neon-coral))] group-hover:border-transparent transition-all duration-300 mb-2 shadow-sm">
                {React.cloneElement(item.icon, { className: 'h-8 w-8 text-gray-600 group-hover:text-white' })}
              </div>
              <span className="text-sm text-gray-600 group-hover:text-[hsl(var(--neon-coral))] font-medium transition-colors">
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
