import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import * as cheerio from 'cheerio';

// Import the 'he' module for HTML entity decoding
import * as he from 'he';

// Function to extract YouTube transcript using a web scraping approach
async function extractYouTubeTranscript(videoId: string, language = 'auto'): Promise<any> {
  try {
    // Step 1: Get the video page - this helps us get necessary tokens
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await axios.get(videoUrl);
    const html = response.data;

    // Find the transcript data in the page's JavaScript
    let transcriptData;
    
    // Two approaches to try to extract transcript
    // First approach: Try to get captions data from page content
    try {
      // Match the captions track data
      const captionsMatch = html.match(/"captionTracks":\s*(\[.*?\])/);
      if (captionsMatch && captionsMatch[1]) {
        const captionTracks = JSON.parse(captionsMatch[1].replace(/\\"/g, '"'));
        
        // Find the appropriate caption track (prefer en if available)
        const track = captionTracks.find((track: any) => 
          language === 'auto' ? 
            (track.languageCode === 'en' || track.vssId.includes('.en')) : 
            track.languageCode === language
        ) || captionTracks[0]; // fallback to first available
        
        if (track && track.baseUrl) {
          // Get the transcript XML
          const transcriptResponse = await axios.get(track.baseUrl);
          const xml = transcriptResponse.data;
          
          // Parse XML to extract transcript text with timestamps
          const $ = cheerio.load(xml, { xmlMode: true });
          const texts: any[] = [];
          const timestamps: any[] = [];
          
          $('text').each((i, elem) => {
            const start = parseFloat($(elem).attr('start') || '0');
            const duration = parseFloat($(elem).attr('dur') || '0');
            const text = he.decode($(elem).text().trim());
            
            if (text) {
              texts.push(text);
              timestamps.push({
                start,
                end: start + duration,
                text
              });
            }
          });
          
          return {
            text: texts.join(' '),
            timestamps,
            language: track.languageCode || 'en'
          };
        }
      }
    } catch (e: any) {
      console.log("First transcript extraction approach failed:", e.message);
    }
    
    // Second approach: Try to extract from player response data
    try {
      const ytInitialPlayerMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
      if (ytInitialPlayerMatch && ytInitialPlayerMatch[1]) {
        const playerData = JSON.parse(ytInitialPlayerMatch[1]);
        
        if (playerData.captions && 
            playerData.captions.playerCaptionsTracklistRenderer && 
            playerData.captions.playerCaptionsTracklistRenderer.captionTracks) {
          
          const captionTracks = playerData.captions.playerCaptionsTracklistRenderer.captionTracks;
          
          // Find the appropriate caption track
          const track = captionTracks.find((track: any) => 
            language === 'auto' ? 
              (track.languageCode === 'en' || track.vssId.includes('.en')) : 
              track.languageCode === language
          ) || captionTracks[0]; // fallback to first available
          
          if (track && track.baseUrl) {
            // Get the transcript XML
            const transcriptResponse = await axios.get(track.baseUrl);
            const xml = transcriptResponse.data;
            
            // Parse XML to extract transcript text with timestamps
            const $ = cheerio.load(xml, { xmlMode: true });
            const texts: any[] = [];
            const timestamps: any[] = [];
            
            $('text').each((i, elem) => {
              const start = parseFloat($(elem).attr('start') || '0');
              const duration = parseFloat($(elem).attr('dur') || '0');
              const text = he.decode($(elem).text().trim());
              
              if (text) {
                texts.push(text);
                timestamps.push({
                  start,
                  end: start + duration,
                  text
                });
              }
            });
            
            return {
              text: texts.join(' '),
              timestamps,
              language: track.languageCode || 'en'
            };
          }
        }
      }
    } catch (e: any) {
      console.log("Second transcript extraction approach failed:", e.message);
    }
    
    // If we reach here, both methods failed or no transcripts available
    throw new Error("Unable to find transcript for this video. The video might not have captions available.");
    
  } catch (error) {
    console.error("Error extracting YouTube transcript:", error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // YouTube Transcript API route
  app.get("/api/youtube-transcript", async (req, res) => {
    try {
      const { videoId, language = 'auto' } = req.query;
      
      if (!videoId) {
        return res.status(400).json({ 
          error: "Missing videoId parameter" 
        });
      }
      
      console.log(`Processing transcript request for video ID: ${videoId}, language: ${language}`);
      
      // Use the actual YouTube transcript extraction function
      const transcriptData = await extractYouTubeTranscript(videoId as string, language as string);
      res.json(transcriptData);
      
    } catch (error) {
      console.error("YouTube transcript error:", error);
      res.status(500).json({ 
        error: "Failed to get transcript", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Fallback route for videos without transcripts
  app.get("/api/fallback-transcript", async (req, res) => {
    try {
      const { videoId } = req.query;
      
      if (!videoId) {
        return res.status(400).json({ error: "Missing videoId parameter" });
      }
      
      // Get the video title at least
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const response = await axios.get(videoUrl);
      const html = response.data;
      
      let videoTitle = "YouTube Video";
      const titleMatch = html.match(/<title>([^<]*)<\/title>/);
      if (titleMatch && titleMatch[1]) {
        videoTitle = titleMatch[1].replace(" - YouTube", "");
      }
      
      // Generate a simple fallback response
      const fallbackText = `This video titled "${videoTitle}" doesn't have available captions. ` +
                           `We're unable to provide a transcript for this content.`;
      
      res.json({
        text: fallbackText,
        timestamps: [{ start: 0, end: 5, text: fallbackText }],
        language: 'en',
        isFallback: true,
        videoTitle: videoTitle
      });
      
    } catch (error) {
      console.error("Fallback transcript error:", error);
      res.status(500).json({ 
        error: "Failed to get video information", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
