import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateVideoSchema } from "@shared/schema";
import { z } from "zod";

// Simulate AI video generation with a delay
async function generateSignLanguageVideo(text: string): Promise<string> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // For demo purposes, return a sample video URL
  // In production, this would call an actual AI service
  const sampleVideos = [
    "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  ];
  
  return sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate sign language video
  app.post("/api/generate-video", async (req, res) => {
    try {
      const validatedData = generateVideoSchema.parse(req.body);
      
      // Create video request
      const videoRequest = await storage.createVideoRequest({
        inputText: validatedData.text,
      });

      // Start processing (in background for real implementation)
      setTimeout(async () => {
        try {
          // Update status to processing
          await storage.updateVideoRequest(videoRequest.id, { status: "processing" });
          
          // Generate video (this would call actual AI service)
          const videoUrl = await generateSignLanguageVideo(validatedData.text);
          
          // Update with completed video
          await storage.updateVideoRequest(videoRequest.id, {
            status: "completed",
            videoUrl: videoUrl,
          });
        } catch (error) {
          console.error("Video generation failed:", error);
          await storage.updateVideoRequest(videoRequest.id, { status: "failed" });
        }
      }, 100);

      res.json({ 
        success: true, 
        requestId: videoRequest.id,
        message: "Video generation started" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid input", 
          errors: error.errors 
        });
      } else {
        console.error("Video generation error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to start video generation" 
        });
      }
    }
  });

  // Check video status
  app.get("/api/video-status/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid request ID" 
        });
      }

      const videoRequest = await storage.getVideoRequest(id);
      if (!videoRequest) {
        return res.status(404).json({ 
          success: false, 
          message: "Video request not found" 
        });
      }

      res.json({
        success: true,
        status: videoRequest.status,
        videoUrl: videoRequest.videoUrl,
        inputText: videoRequest.inputText,
      });
    } catch (error) {
      console.error("Status check error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to check video status" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
