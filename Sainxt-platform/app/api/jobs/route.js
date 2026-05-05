import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'ai engineer';
  const page = searchParams.get('page') || 1;
  const numPages = searchParams.get('num_pages') || 1;

  // Get API key from environment variables
  const apiKey = process.env.JSEARCH_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  try {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    };

    // Build the query URL
    const baseUrl = 'https://jsearch.p.rapidapi.com/search';
    const queryParams = new URLSearchParams({
      query: `${query} in India`,
      page,
      num_pages: numPages,
      date_posted: 'month',
      employment_types: 'FULLTIME,PARTTIME,CONTRACTOR',
      job_requirements: 'no_degree,no_experience,under_3_years_experience,more_than_3_years_experience',
    });

    const url = `${baseUrl}?${queryParams.toString()}`;
    
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch jobs');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
