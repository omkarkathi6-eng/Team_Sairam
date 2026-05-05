export async function fetchJobs({ query = 'ai engineer', page = 1, numPages = 1 }) {
  try {
    const params = new URLSearchParams({
      query,
      page,
      num_pages: numPages,
    });

    const response = await fetch(`/api/jobs?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
}

export function mapJobData(job) {
  if (!job) return null;
  
  return {
    id: job.job_id || Math.random().toString(36).substr(2, 9),
    title: job.job_title || 'Job Title Not Available',
    company: job.employer_name || 'Company Not Specified',
    location: job.job_city && job.job_country 
      ? `${job.job_city}, ${job.job_country}` 
      : job.job_location || 'Location Not Specified',
    type: job.job_employment_type?.toLowerCase() || 'full-time',
    salary: formatSalary(job.job_min_salary, job.job_max_salary, job.job_salary_period, job.job_salary_currency),
    match: calculateMatchScore(job),
    skills: extractSkills(job),
    posted: formatPostedDate(job.job_posted_at_datetime_utc || job.job_posted_at_timestamp),
    description: job.job_description || 'No description available',
    applyLink: job.job_apply_link || '#',
    isRemote: job.job_is_remote || false,
    logo: job.employer_logo || '/images/default-company.png',
    experience: formatExperience(job.job_required_experience),
  };
}

function formatSalary(min, max, period = 'year', currency = 'USD') {
  if (!min && !max) return 'Salary not specified';
  
  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const periodText = {
    'year': 'year',
    'month': 'month',
    'hour': 'hour',
    'day': 'day',
  }[period?.toLowerCase()] || '';

  if (min && max) {
    return `${formatCurrency(min)} - ${formatCurrency(max)}/${periodText}`;
  }
  
  return min ? `${formatCurrency(min)}/${periodText}` : `${formatCurrency(max)}/${periodText}`;
}

function calculateMatchScore(job) {
  // Simple match score based on job details
  let score = 70; // Base score
  
  if (job.job_is_remote) score += 10;
  if (job.job_highlights?.Qualifications?.length > 0) score += 5;
  if (job.job_benefits?.length > 0) score += 5;
  
  return Math.min(score, 99); // Cap at 99%
}

function extractSkills(job) {
  const skills = new Set();
  
  // Add skills from job title
  if (job.job_title) {
    const titleSkills = job.job_title.toLowerCase().match(/\b(ai|ml|machine learning|data science|python|tensorflow|pytorch|nlp|computer vision|deep learning|data analysis)\b/g) || [];
    titleSkills.forEach(skill => skills.add(skill));
  }
  
  // Add skills from description
  if (job.job_description) {
    const descSkills = job.job_description.toLowerCase().match(/\b(ai|ml|machine learning|data science|python|tensorflow|pytorch|nlp|computer vision|deep learning|data analysis|pandas|numpy|scikit|opencv|spark|hadoop|aws|azure|gcp|docker|kubernetes|git|sql|nosql|mongodb|postgresql|mysql|react|node|javascript|typescript|java|c\+\+|r\b|go\b|rust\b|scala\b|ruby\b|php\b)\b/g) || [];
    descSkills.forEach(skill => skills.add(skill));
  }
  
  // Convert Set to array and format
  return Array.from(skills)
    .filter(skill => skill && skill.length > 1)
    .map(skill => skill.charAt(0).toUpperCase() + skill.slice(1))
    .slice(0, 10); // Limit to 10 skills
}

function formatPostedDate(dateString) {
  if (!dateString) return 'Recently';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatExperience(exp) {
  if (!exp) return 'Experience not specified';
  
  if (exp.required_experience_in_months) {
    const years = Math.floor(exp.required_experience_in_months / 12);
    const months = exp.required_experience_in_months % 12;
    
    if (years > 0 && months > 0) {
      return `${years}+ years ${months} months`;
    } else if (years > 0) {
      return `${years}+ years`;
    } else {
      return `${months} months`;
    }
  }
  
  return exp || 'Experience not specified';
}
