import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // First, fetch all jobs
    const response = await fetch('https://www.arbeitnow.com/api/job-board-api');
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // AI/ML/Python related keywords to filter jobs
    const aiMlKeywords = [
      'AI', 'Artificial Intelligence', 'Machine Learning', 'Deep Learning',
      'ML', 'NLP', 'Natural Language Processing', 'Computer Vision',
      'Data Science', 'Data Analysis', 'Python', 'TensorFlow', 'PyTorch',
      'Neural Networks', 'LLM', 'Generative AI', 'AI/ML', 'AI Engineer',
      'ML Engineer', 'Data Scientist', 'AI Research', 'ML Ops', 'MLOps',
      'Data Engineer', 'AI Developer', 'Machine Learning Engineer'
    ];
    
    // Common non-English words to detect non-English jobs
    const nonEnglishWords = [
      'die', 'der', 'das', 'und', 'für', 'von', 'zu', 'mit', 'sich', 'auf',
      'für', 'ist', 'im', 'dem', 'nicht', 'ein', 'eine', 'in', 'als', 'auch',
      'es', 'an', 'werden', 'aus', 'er', 'einen', 'dieser', 'deren', 'wird',
      'bei', 'einer', 'um', 'am', 'sind', 'noch', 'wie', 'einem', 'über',
      'eines', 'sich', 'so', 'zum', 'hat', 'nur', 'oder', 'aber', 'vor', 'nach'
    ];
    
    // Filter jobs to only include AI/ML/Python related ones in English
    data.data = data.data.filter(job => {
      if (!job) return false;
      
      // Check if job is in English (simple check)
      const description = (job.description || '').toLowerCase();
      const isEnglish = nonEnglishWords.every(word => 
        !description.includes(` ${word} `) // Check for word with spaces around it
      );
      
      if (!isEnglish) return false;
      
      // Check title
      const title = job.title?.toLowerCase() || '';
      const hasTitleMatch = aiMlKeywords.some(keyword => 
        title.includes(keyword.toLowerCase())
      );
      
      // Check description
      const hasDescriptionMatch = aiMlKeywords.some(keyword => 
        description.includes(keyword.toLowerCase())
      );
      
      // Check tags
      const tags = (job.tags || []).join(' ').toLowerCase();
      const hasTagMatch = aiMlKeywords.some(keyword => 
        tags.includes(keyword.toLowerCase())
      );
      
      return hasTitleMatch || hasDescriptionMatch || hasTagMatch;
    });
    
    // Helper function to format date
    const formatDate = (dateString) => {
      try {
        if (!dateString) return 'Recently';
        
        // Handle Unix timestamp (in seconds or milliseconds)
        let date;
        if (typeof dateString === 'number') {
          // Check if it's in seconds (10 digits) or milliseconds (13 digits)
          date = dateString.toString().length === 10 
            ? new Date(dateString * 1000) // Convert seconds to milliseconds
            : new Date(dateString); // Already in milliseconds
        } else if (typeof dateString === 'string') {
          // Try to parse the date string
          const parsedDate = Date.parse(dateString);
          date = isNaN(parsedDate) ? new Date() : new Date(parsedDate);
        } else {
          date = new Date(); // Fallback to current date
        }
        
        // If we still don't have a valid date, return 'Recently'
        if (isNaN(date.getTime())) {
          console.log('Invalid date:', dateString);
          return 'Recently';
        }
        
        // Ensure the date is not in the future (which would happen with 1970 dates)
        const now = new Date();
        if (date > now) {
          date = now;
        }
        
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
        
        // For older dates, return the actual date
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (e) {
        console.error('Error formatting date:', e, 'Date string was:', dateString);
        return 'Recently';
      }
    };

    // Transform the data to match your existing job structure
    const transformedJobs = data.data.map(job => {
      // Extract salary range if available
      let salaryDisplay = 'Salary not specified';
      if (job.salary) {
        if (typeof job.salary === 'string') {
          salaryDisplay = job.salary;
        } else if (job.salary.min && job.salary.max) {
          salaryDisplay = `${job.salary.min} - ${job.salary.max} ${job.salary.currency || ''}`.trim();
        }
      }
      
      // Determine experience level based on job data
      let experienceLevel = 'mid-level';
      if (job.tags) {
        const tags = job.tags.map(tag => tag.toLowerCase());
        if (tags.some(tag => ['senior', 'lead', 'principal', 'head'].some(level => tag.includes(level)))) {
          experienceLevel = 'senior';
        } else if (tags.some(tag => ['junior', 'entry', 'fresher', 'intern'].some(level => tag.includes(level)))) {
          experienceLevel = 'entry';
        }
      }
      
      // Get relevant AI/ML skills from tags
      const aiKeywords = ['ai', 'machine learning', 'deep learning', 'nlp', 'computer vision', 
                         'data science', 'ml', 'artificial intelligence', 'data analysis'];
      const aiSkills = (job.tags || []).filter(tag => 
        aiKeywords.some(keyword => tag.toLowerCase().includes(keyword))
      );
      
      // If no AI skills found, use some default ones randomly
      const defaultAiFocus = ['AI', 'Machine Learning', 'Data Science'];
      const aiFocus = aiSkills.length > 0 
        ? aiSkills.slice(0, 3) 
        : defaultAiFocus.filter(() => Math.random() > 0.3);
      
      return {
        id: job.id || Math.random().toString(36).substr(2, 9),
        title: job.title || 'AI/ML Position',
        company: job.company_name || 'Leading Tech Company',
        location: job.location || 'Remote',
        type: (job.job_types && job.job_types[0]) || 'Full-time',
        salary: salaryDisplay,
        match: Math.floor(Math.random() * 20) + 80, // Random match score between 80-100
        skills: job.tags || [],
        posted: formatDate(job.created_at),
        aiFocus: aiFocus,
        experience: job.experience_level || 'Experience not specified',
        experienceLevel: experienceLevel,
        logo: '/images/default-company.png',
        isRemote: job.remote || false,
        isFeatured: Math.random() > 0.7, // 30% chance to be featured
        description: job.description || 'No description available',
        requirements: job.requirements || 'No specific requirements listed',
        responsibilities: job.responsibilities || 'Not specified',
        benefits: job.benefits || [],
        url: job.url || '#',
        // Add more fields as needed
      };
    });
    
    return NextResponse.json(transformedJobs);
  } catch (error) {
    console.error('Error fetching jobs from Arbeitnow:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
