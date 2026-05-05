'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, MapPin, Clock, Briefcase, DollarSign, Check, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function JobCard({ job, onClick }) {
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const handleCardClick = (e) => {
    if (e.target.closest('button, a')) {
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleApply = (e) => {
    e.stopPropagation();
    setIsApplying(true);
    // Simulate API call
    setTimeout(() => {
      setHasApplied(true);
      setIsApplying(false);
    }, 1000);
  };

  return (
    <div 
      className="bg-white rounded-xl border border-soft-gray p-6 hover:shadow-xl transition-all duration-300 hover:border-neon-coral/30 card-ai-enhanced cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-neon-coral/10 to-aqua-blue/10 rounded-xl flex items-center justify-center border border-neon-coral/20">
            <Briefcase className="w-8 h-8 text-neon-coral" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-deep-navy hover:text-neon-coral transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-deep-navy/80">{job.company}</p>
            <div className="flex items-center mt-1">
              <MapPin className="w-4 h-4 text-deep-navy/60 mr-1" />
              <span className="text-sm text-deep-navy/70">{job.location}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          className="text-gray-400 hover:text-blue-600 transition-colors"
          aria-label={isSaved ? 'Unsave job' : 'Save job'}
        >
          <Bookmark 
            className={`w-5 h-5 transition-colors ${isSaved ? 'fill-neon-coral text-neon-coral' : 'text-deep-navy/40 hover:text-neon-coral'}`} 
          />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.map((skill, index) => (
          <Badge 
            key={index} 
            variant="outline" 
            className="text-sm font-normal bg-white/80 backdrop-blur-sm border-neon-coral/20 text-deep-navy/80 hover:bg-gradient-to-r hover:from-neon-coral/5 hover:to-aqua-blue/5 transition-colors"
          >
            {skill}
          </Badge>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-soft-gray/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center text-sm bg-gradient-to-r from-neon-coral/10 to-aqua-blue/10 text-deep-navy px-3 py-1 rounded-full border border-neon-coral/20">
            <Clock className="w-4 h-4 mr-1.5 text-neon-coral" />
            {job.type}
          </div>
          <div className="flex items-center text-sm bg-gradient-to-r from-neon-coral/5 to-aqua-blue/5 text-deep-navy px-3 py-1 rounded-full border border-soft-gray/50">
            <DollarSign className="w-4 h-4 mr-1.5 text-aqua-blue" />
            {job.salary}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-neon-coral/10 to-aqua-blue/10 rounded-full border border-neon-coral/20">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-neon-coral to-aqua-blue mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-deep-navy">
              {job.match}% Match
            </span>
          </div>
          
          {hasApplied ? (
            <Button variant="outline" size="sm" className="gap-2" disabled>
              <Check className="w-4 h-4 text-green-500" />
              Applied
            </Button>
          ) : (
            <Button 
              onClick={handleApply}
              size="sm"
              className="bg-gradient-to-r from-neon-coral to-aqua-blue hover:from-neon-coral/90 hover:to-aqua-blue/90 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              disabled={true}
            >
              Apply Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
