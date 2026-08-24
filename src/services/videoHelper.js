/**
 * Universal YouTube Video ID & Embed Helper
 * Handles standard watch URLs, youtu.be, shorts, live streams, mobile links, etc.
 */

export const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // 1. YouTube Shorts: youtube.com/shorts/<id>
  const shortsMatch = cleanUrl.match(/(?:youtube\.com|youtube-nocookie\.com)\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // 2. Short links: youtu.be/<id>
  const youtuBeMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (youtuBeMatch && youtuBeMatch[1]) return youtuBeMatch[1];

  // 3. YouTube Live: youtube.com/live/<id>
  const liveMatch = cleanUrl.match(/(?:youtube\.com|youtube-nocookie\.com)\/live\/([a-zA-Z0-9_-]{11})/i);
  if (liveMatch && liveMatch[1]) return liveMatch[1];

  // 4. Standard watch?v=<id> or ?v=<id> or &v=<id>
  const vMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (vMatch && vMatch[1]) return vMatch[1];

  // 5. Existing embed links: youtube.com/embed/<id>
  const embedMatch = cleanUrl.match(/(?:youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // 6. Generic pattern fallback
  const genericMatch = cleanUrl.match(/(?:v\/|e\/|u\/\w+\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/i);
  if (genericMatch && genericMatch[1]) return genericMatch[1];

  return null;
};

export const getYouTubeEmbedUrl = (url, autoplay = false) => {
  if (!url) return null;
  const videoId = extractYouTubeId(url);
  if (videoId) {
    const autoParam = autoplay ? '&autoplay=1' : '';
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1${autoParam}`;
  }
  return url;
};

export const isDirectVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const clean = url.toLowerCase().trim();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.includes('/uploads/') ||
    clean.includes('res.cloudinary.com')
  );
};
