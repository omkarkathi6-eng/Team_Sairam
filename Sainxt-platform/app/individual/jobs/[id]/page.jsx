'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Bookmark, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/arbeitnow`);
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        const jobs = await response.json();
        const foundJob = jobs.find(job => job.id.toString() === id);
        
        if (!foundJob) {
          throw new Error('Job not found');
        }
        
        setJob(foundJob);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApply = async (e) => {
    e.stopPropagation();
    setIsApplying(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setHasApplied(true);
    setIsApplying(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          
          <div className="flex gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          
          <div className="pt-4">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
        </Button>
        
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-deep-navy mb-2">Job Not Found</h2>
          <p className="text-deep-navy/70">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/individual/jobs')} className="mt-6">
            Browse All Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6 hover:bg-neon-coral/10 hover:text-neon-coral transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </Button>
      
      <div className="bg-white rounded-xl border border-soft-gray p-8 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-deep-navy mb-2">{job.title}</h1>
            <p className="text-xl text-deep-navy/80 mb-4">{job.company}</p>
            
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center text-deep-navy/70">
                <MapPin className="w-4 h-4 mr-1.5" />
                <span>{job.location}</span>
              </div>
              
              <div className="flex items-center text-deep-navy/70">
                <Clock className="w-4 h-4 mr-1.5" />
                <span>{job.type}</span>
              </div>
              
              {job.salary && (
                <div className="flex items-center text-deep-navy/70">
                  <DollarSign className="w-4 h-4 mr-1.5" />
                  <span>{job.salary}</span>
                </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={isSaved ? 'Unsave job' : 'Save job'}
          >
            <Bookmark 
              className={`w-6 h-6 ${isSaved ? 'fill-neon-coral text-neon-coral' : 'text-deep-navy/40'}`} 
            />
          </button>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-deep-navy mb-4">Job Description</h2>
          <div 
            className="prose max-w-none text-deep-navy/80"
            dangerouslySetInnerHTML={{ __html: job.description || 'No description available.' }}
          />
        </div>
        
        {job.skills && job.skills.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-deep-navy mb-3">Skills & Requirements</h3>
            <div className="flex flex-wrap gap-2">
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
          </div>
        )}
        
        <div className="mt-8 pt-6 border-t border-soft-gray/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center text-sm text-deep-navy/70">
            <Clock className="w-4 h-4 mr-1.5" />
            <span>Posted {job.posted || 'recently'}</span>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto hover:bg-deep-navy/5 hover:text-deep-navy/90 border-deep-navy/20"
              onClick={() => window.open(job.url, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Original
            </Button>
            
            <Button 
              onClick={handleApply}
              disabled={isApplying || hasApplied}
              className={`w-full sm:w-auto ${
                hasApplied 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gradient-to-r from-neon-coral to-aqua-blue hover:from-neon-coral/90 hover:to-aqua-blue/90'
              } text-white`}
            >
              {isApplying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Applying...
                </>
              ) : hasApplied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Applied
                </>
              ) : (
                'Apply Now'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
