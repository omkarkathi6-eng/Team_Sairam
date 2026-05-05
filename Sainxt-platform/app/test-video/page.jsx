'use client';

export default function TestVideo() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Video Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Test Video 1 (Direct MP4)</h2>
        <video 
          controls 
          width="640" 
          height="360"
          className="border rounded-lg"
        >
          <source src="/videos/ai-training/ai-intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="mt-2 text-sm text-gray-600">/videos/ai-training/ai-intro.mp4</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Test Video 2 (Public Folder)</h2>
        <video 
          controls 
          width="640" 
          height="360"
          className="border rounded-lg"
        >
          <source src="/videos/ai-training/ai-intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="mt-2 text-sm text-gray-600">/videos/ai-training/ai-intro.mp4</p>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Troubleshooting Steps:</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Check if the video plays when you open <a href="/videos/ai-training/ai-intro.mp4" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">this link</a> directly</li>
          <li>Check browser console for any error messages (F12 → Console)</li>
          <li>Try a different browser</li>
          <li>Clear browser cache</li>
        </ol>
      </div>
    </div>
  );
}
