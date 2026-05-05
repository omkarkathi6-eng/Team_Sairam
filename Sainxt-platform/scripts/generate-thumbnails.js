const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const thumbnails = [
  { name: 'intro.jpg', color: '#4F46E5', text: 'AI Intro' },
  { name: 'ml-fundamentals.jpg', color: '#10B981', text: 'ML Basics' },
  { name: 'neural-networks.jpg', color: '#F59E0B', text: 'Neural Nets' },
  { name: 'deep-learning.jpg', color: '#3B82F6', text: 'Deep Learning' },
  { name: 'future-ai.jpg', color: '#8B5CF6', text: 'Future AI' },
];

// Create thumbnails directory if it doesn't exist
const thumbnailsDir = path.join(process.cwd(), 'public', 'ai-thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Generate each thumbnail
thumbnails.forEach(({ name, color, text }) => {
  const width = 320;
  const height = 180;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  // Save as JPEG
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(thumbnailsDir, name), buffer);
});

console.log(`Generated ${thumbnails.length} thumbnails in ${thumbnailsDir}`);
