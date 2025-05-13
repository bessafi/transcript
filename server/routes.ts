import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";

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
      
      // Simulated response since in a real implementation we would call 
      // either a YouTube API or use a library like youtube-transcript
      // This is a simplified implementation for demo purposes
      
      const paragraphs = [
        "Hello everyone, and welcome to this session on how to build a successful startup. My name is Sarah Johnson, and I'm excited to share some insights with you today.",
        "Before we dive in, I want to emphasize that building a startup is both challenging and rewarding. It requires dedication, resilience, and a clear vision.",
        "First, let's talk about identifying a problem worth solving. Every successful startup begins with recognizing a genuine need in the market. You should be able to clearly articulate the problem you're addressing.",
        "Ask yourself: Is this problem significant enough that people will pay for a solution? Is it something that affects many people or businesses? The more pressing the problem, the better positioned your startup will be.",
        "Next, develop a unique value proposition. What makes your solution different and better than existing alternatives? This could be based on technology, approach, pricing, or user experience.",
        "Remember, you don't always need to reinvent the wheel. Sometimes, significant improvements to existing solutions can create tremendous value.",
        "The third key element is building the right team. Surround yourself with people who complement your skills and share your passion for solving the problem.",
        "Look for team members who are not only talented but also adaptable and resilient. The startup journey is unpredictable, and you need people who can navigate uncertainty.",
        "Now, let's discuss customer validation. Before investing heavily in development, test your assumptions with real potential customers."
      ];
      
      // Create a full text and timestamps for the transcript
      const fullText = paragraphs.join("\n\n");
      const timestamps = [];
      
      let currentTime = 0;
      for (const paragraph of paragraphs) {
        // Approximate 5 seconds per sentence
        const sentences = paragraph.split('. ');
        for (const sentence of sentences) {
          if (sentence.trim()) {
            const duration = sentence.length / 20 * 5; // Very rough approximation
            timestamps.push({
              start: currentTime,
              end: currentTime + duration,
              text: sentence.trim() + (sentence.endsWith('.') ? '' : '.')
            });
            currentTime += duration;
          }
        }
      }
      
      res.json({
        text: fullText,
        timestamps,
        language: 'en'
      });
      
    } catch (error) {
      console.error("YouTube transcript error:", error);
      res.status(500).json({ 
        error: "Failed to get transcript", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
