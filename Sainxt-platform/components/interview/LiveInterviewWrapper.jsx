'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This wrapper is needed because the LiveInterview component uses React Router's useNavigate
const LiveInterviewWrapper = () => {
  const router = useRouter();
  
  // This effect will only run on the client side
  useEffect(() => {
    // Dynamically import the LiveInterview component on the client side
    const loadLiveInterview = async () => {
      const LiveInterview = (await import('@/interview-frontend/src/components/LiveInterview')).default;
      
      // Create a wrapper component that provides the router prop
      const WrappedLiveInterview = () => {
        // Provide a mock navigate function that uses Next.js router
        const navigate = (path, options = {}) => {
          if (options.replace) {
            router.replace(path);
          } else {
            router.push(path);
          }
        };
        
        return <LiveInterview navigate={navigate} />;
      };
      
      // Render the wrapped component
      const root = document.getElementById('live-interview-root');
      if (root) {
        const { createRoot } = await import('react-dom/client');
        createRoot(root).render(<WrappedLiveInterview />);
      }
    };
    
    loadLiveInterview();
  }, [router]);
  
  return <div id="live-interview-root" className="w-full h-full" />;
};

export default LiveInterviewWrapper;
