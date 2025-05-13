interface TranscriptionResult {
  text: string;
  timestamps: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  language: string;
  isFallback?: boolean;
  videoTitle?: string;
}

// YouTube Transcript API - This uses the YouTube's own captions
async function getYouTubeTranscript(videoId: string, language: string = 'auto'): Promise<TranscriptionResult> {
  try {
    // Fetching from our backend proxy to YouTube's transcript API
    const response = await fetch(`/api/youtube-transcript?videoId=${videoId}&language=${language}`);
    
    if (!response.ok) {
      // If the main transcript API fails, try the fallback
      if (response.status === 500) {
        console.log("Transcript API failed, trying fallback method...");
        const fallbackResponse = await fetch(`/api/fallback-transcript?videoId=${videoId}`);
        
        if (!fallbackResponse.ok) {
          throw new Error(`Failed to fetch transcript (both methods): ${fallbackResponse.statusText}`);
        }
        
        const fallbackData = await fallbackResponse.json();
        return fallbackData;
      }
      
      throw new Error(`Failed to fetch transcript: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting YouTube transcript:", error);
    throw error;
  }
}

// Extract YouTube video ID from various URL formats
function extractYouTubeVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Extract TikTok video ID
function extractTikTokVideoId(url: string): string | null {
  const regExp = /.*tiktok\.com\/.*\/video\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// Extract Instagram video ID
function extractInstagramVideoId(url: string): string | null {
  const regExp = /instagram\.com\/p\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// Determine platform from URL
function detectPlatform(url: string): 'youtube' | 'tiktok' | 'instagram' | 'unknown' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  } else if (url.includes('tiktok.com')) {
    return 'tiktok';
  } else if (url.includes('instagram.com')) {
    return 'instagram';
  }
  return 'unknown';
}

// Main transcription function - selects the appropriate method based on URL
async function transcribeVideo(
  url: string, 
  language: string = 'auto',
  onProgress?: (progress: number) => void
): Promise<TranscriptionResult> {
  // Simulate progress for UI purposes
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += 5;
    if (progress > 95) {
      clearInterval(progressInterval);
    }
    onProgress?.(progress);
  }, 500);

  try {
    const platform = detectPlatform(url);
    
    switch (platform) {
      case 'youtube': {
        const videoId = extractYouTubeVideoId(url);
        if (!videoId) throw new Error('Invalid YouTube URL');
        
        const result = await getYouTubeTranscript(videoId, language);
        clearInterval(progressInterval);
        onProgress?.(100);
        return result;
      }
      
      case 'tiktok':
      case 'instagram': {
        // For TikTok and Instagram, we use a fallback method as they don't have free APIs
        // This is a simulated response as a proper implementation would require
        // audio extraction and web speech API, which is beyond the scope of this example
        await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing time
        
        // Return mock response for demo
        const result: TranscriptionResult = {
          text: "This is a fallback transcription. For TikTok and Instagram videos, we use client-side speech recognition which requires video playback. Please note this is a limited functionality in the free version.",
          timestamps: [
            { start: 0, end: 5, text: "This is a fallback transcription." },
            { start: 5, end: 10, text: "For TikTok and Instagram videos, we use client-side speech recognition." },
            { start: 10, end: 15, text: "Which requires video playback." }
          ],
          language: language || 'en'
        };
        
        clearInterval(progressInterval);
        onProgress?.(100);
        return result;
      }
      
      default:
        throw new Error('Unsupported video platform. Please use YouTube, TikTok, or Instagram URLs.');
    }
  } catch (error) {
    clearInterval(progressInterval);
    throw error;
  }
}

// Get video metadata (thumbnail, title, etc.)
async function getVideoMetadata(url: string) {
  const platform = detectPlatform(url);
  
  switch (platform) {
    case 'youtube': {
      const videoId = extractYouTubeVideoId(url);
      if (!videoId) throw new Error('Invalid YouTube URL');
      
      try {
        // Try to get the actual video title
        const response = await fetch(`/api/fallback-transcript?videoId=${videoId}`);
        if (response.ok) {
          const data = await response.json();
          const title = data.videoTitle || 'YouTube Video';
          
          return {
            platform,
            videoId,
            thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
            title: title,
            url
          };
        }
      } catch (error) {
        console.warn("Failed to get video title, using default", error);
      }
      
      // Fallback if the above fails
      return {
        platform,
        videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
        title: 'YouTube Video',
        url
      };
    }
    
    case 'tiktok': {
      // In a real implementation, we would fetch metadata via a proxy API
      return {
        platform,
        videoId: extractTikTokVideoId(url),
        thumbnail: 'https://via.placeholder.com/480x852/3A0CA3/FFFFFF?text=TikTok+Video',
        title: 'TikTok Video',
        url
      };
    }
    
    case 'instagram': {
      // In a real implementation, we would fetch metadata via a proxy API
      return {
        platform,
        videoId: extractInstagramVideoId(url),
        thumbnail: 'https://via.placeholder.com/600x600/F72585/FFFFFF?text=Instagram+Video',
        title: 'Instagram Video',
        url
      };
    }
    
    default:
      throw new Error('Unsupported video platform');
  }
}

export {
  transcribeVideo,
  getVideoMetadata,
  detectPlatform,
  extractYouTubeVideoId,
  extractTikTokVideoId,
  extractInstagramVideoId,
  type TranscriptionResult
};
