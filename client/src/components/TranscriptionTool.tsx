import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { transcribeVideo, getVideoMetadata, detectPlatform, type TranscriptionResult } from "@/lib/transcriptionService";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Platform icons
const PlatformIcon: React.FC<{ platform: string }> = ({ platform }) => {
  switch (platform) {
    case 'youtube':
      return <i className="fab fa-youtube text-red-600"></i>;
    case 'tiktok':
      return <i className="fab fa-tiktok text-black"></i>;
    case 'instagram':
      return <i className="fab fa-instagram text-pink-600"></i>;
    default:
      return <i className="fas fa-link text-gray-600"></i>;
  }
};

const TranscriptionTool: React.FC = () => {
  const { toast } = useToast();
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState('auto');
  const [options, setOptions] = useState({
    timestamps: true,
    speakerIdentification: true,
    autoTranslate: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [videoMetadata, setVideoMetadata] = useState<any>(null);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [displayMode, setDisplayMode] = useState<'text' | 'paragraphs' | 'timestamps'>('text');
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState('');
  
  // Reference for transcript container to auto-scroll
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Update estimated time remaining based on progress
  useEffect(() => {
    if (isProcessing && transcriptionProgress < 100) {
      const remainingPercent = 100 - transcriptionProgress;
      const secondsRemaining = Math.round((remainingPercent / 10) * 30); // Rough estimate
      
      if (secondsRemaining > 60) {
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        setEstimatedTimeRemaining(`~ ${minutes}:${seconds < 10 ? '0' + seconds : seconds} remaining`);
      } else {
        setEstimatedTimeRemaining(`~ ${secondsRemaining}s remaining`);
      }
    } else {
      setEstimatedTimeRemaining('');
    }
  }, [transcriptionProgress, isProcessing]);

  // Platform detection on URL input
  useEffect(() => {
    if (videoUrl) {
      setDetectedPlatform(detectPlatform(videoUrl));
    } else {
      setDetectedPlatform('');
    }
  }, [videoUrl]);

  // Handle transcription
  const handleTranscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl) {
      toast({
        title: "Error",
        description: "Please enter a video URL",
        variant: "destructive"
      });
      return;
    }

    // Reset states
    setIsProcessing(true);
    setTranscriptionProgress(0);
    setTranscriptionResult(null);
    setShowResult(false);
    
    try {
      // Get video metadata
      const metadata = await getVideoMetadata(videoUrl);
      setVideoMetadata(metadata);
      
      // Start transcription
      const result = await transcribeVideo(
        videoUrl, 
        language,
        (progress) => setTranscriptionProgress(progress)
      );
      
      setTranscriptionResult(result);
      setShowResult(true);
      
      // Check if it's a fallback response (no captions available)
      if (result.isFallback) {
        toast({
          title: "Transcription Notice",
          description: "This video doesn't have captions available. We're showing limited information.",
          variant: "default"
        });
      } else {
        toast({
          title: "Success",
          description: "Transcription completed successfully",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Transcription Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy transcript to clipboard
  const copyTranscript = () => {
    if (transcriptionResult) {
      navigator.clipboard.writeText(transcriptionResult.text);
      toast({
        title: "Copied",
        description: "Transcript copied to clipboard",
        variant: "default"
      });
    }
  };

  // Download transcript as text file
  const downloadAsText = () => {
    if (transcriptionResult) {
      const element = document.createElement("a");
      const file = new Blob([transcriptionResult.text], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "transcript.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // Download as SRT (SubRip) format
  const downloadAsSRT = () => {
    if (transcriptionResult && transcriptionResult.timestamps) {
      let srtContent = '';
      transcriptionResult.timestamps.forEach((item, index) => {
        const startTime = formatSRTTime(item.start);
        const endTime = formatSRTTime(item.end);
        
        srtContent += `${index + 1}\n`;
        srtContent += `${startTime} --> ${endTime}\n`;
        srtContent += `${item.text}\n\n`;
      });
      
      const element = document.createElement("a");
      const file = new Blob([srtContent], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "transcript.srt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // Helper to format time for SRT
  const formatSRTTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    const timeString = date.toISOString().substring(11, 23);
    return timeString.replace('.', ',');
  };

  return (
    <section id="transcribe" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Transcribe Any Video</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Simply paste a YouTube, TikTok or Instagram video URL and get an accurate transcription in seconds.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8 mb-12">
          <form onSubmit={handleTranscribe} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="video-url" className="text-gray-700 font-medium">Video URL</label>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0">
                <input 
                  type="text" 
                  id="video-url" 
                  placeholder="Paste YouTube, TikTok, or Instagram URL"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={isProcessing}
                />
                <div className="sm:ml-4 flex">
                  <button
                    type="button"
                    className={`bg-gray-100 px-4 py-3 border border-gray-300 rounded-l-md hover:bg-gray-200 transition-colors focus:outline-none ${detectedPlatform === 'youtube' ? 'bg-gray-200' : ''}`}
                  >
                    <i className="fab fa-youtube text-red-600"></i>
                  </button>
                  <button
                    type="button"
                    className={`bg-gray-100 px-4 py-3 border-t border-b border-gray-300 hover:bg-gray-200 transition-colors focus:outline-none ${detectedPlatform === 'tiktok' ? 'bg-gray-200' : ''}`}
                  >
                    <i className="fab fa-tiktok text-black"></i>
                  </button>
                  <button
                    type="button"
                    className={`bg-gray-100 px-4 py-3 border border-gray-300 rounded-r-md hover:bg-gray-200 transition-colors focus:outline-none ${detectedPlatform === 'instagram' ? 'bg-gray-200' : ''}`}
                  >
                    <i className="fab fa-instagram text-pink-600"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-full sm:w-1/3">
                <label htmlFor="language" className="block text-gray-700 font-medium mb-2">Language</label>
                <select 
                  id="language" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isProcessing}
                >
                  <option value="auto">Auto Detect</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="ru">Russian</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                </select>
              </div>
              <div className="w-full sm:w-2/3">
                <label className="block text-gray-700 font-medium mb-2">Options</label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="timestamps" 
                      checked={options.timestamps}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, timestamps: checked === true }))
                      }
                      disabled={isProcessing}
                    />
                    <label htmlFor="timestamps" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Add timestamps
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="speakerIdentification" 
                      checked={options.speakerIdentification}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, speakerIdentification: checked === true }))
                      }
                      disabled={isProcessing}
                    />
                    <label htmlFor="speakerIdentification" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Speaker identification
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="autoTranslate" 
                      checked={options.autoTranslate}
                      onCheckedChange={(checked) => 
                        setOptions(prev => ({ ...prev, autoTranslate: checked === true }))
                      }
                      disabled={isProcessing}
                    />
                    <label htmlFor="autoTranslate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Auto-translate
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                className={`bg-primary hover:bg-secondary transition-colors text-white font-semibold py-3 px-8 rounded-md text-lg w-full sm:w-auto ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner animate-spin mr-2"></i>Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-closed-captioning mr-2"></i>Transcribe Now
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Video Preview */}
        {videoMetadata && isProcessing && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8 mb-12">
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="md:w-2/5 mb-6 md:mb-0">
                {/* Video thumbnail preview */}
                <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <img 
                    src={videoMetadata.thumbnail} 
                    alt="Video thumbnail preview" 
                    className="object-cover w-full h-full" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white bg-opacity-80 rounded-full p-3 text-primary hover:text-secondary transition-colors">
                      <i className="fas fa-play text-xl"></i>
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{videoMetadata.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{videoMetadata.platform.charAt(0).toUpperCase() + videoMetadata.platform.slice(1)} video</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="flex items-center mr-4">
                    <i className="fas fa-language mr-1"></i> {language === 'auto' ? 'Auto-detected' : language}
                  </span>
                </div>
              </div>
              
              <div className="md:w-3/5">
                {/* Transcription progress */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">Transcription in Progress</h3>
                  <Progress value={transcriptionProgress} className="mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing audio: {transcriptionProgress}%</span>
                    <span>{estimatedTimeRemaining}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full ${transcriptionProgress >= 20 ? 'bg-primary' : 'bg-gray-300'} flex items-center justify-center text-white`}>
                      {transcriptionProgress >= 20 ? <i className="fas fa-check text-xs"></i> : <i className="fas fa-ellipsis-h text-xs"></i>}
                    </div>
                    <span className={transcriptionProgress >= 20 ? 'text-gray-700' : 'text-gray-500'}>Downloading video</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full ${transcriptionProgress >= 40 ? 'bg-primary' : 'bg-gray-300'} flex items-center justify-center text-white`}>
                      {transcriptionProgress >= 40 ? <i className="fas fa-check text-xs"></i> : <i className="fas fa-ellipsis-h text-xs"></i>}
                    </div>
                    <span className={transcriptionProgress >= 40 ? 'text-gray-700' : 'text-gray-500'}>Extracting audio</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full ${transcriptionProgress >= 60 ? 'bg-primary' : (transcriptionProgress >= 40 ? 'bg-primary animate-pulse' : 'bg-gray-300')} flex items-center justify-center text-white`}>
                      {transcriptionProgress >= 60 ? <i className="fas fa-check text-xs"></i> : (transcriptionProgress >= 40 ? <i className="fas fa-spinner text-xs"></i> : <i className="fas fa-ellipsis-h text-xs"></i>)}
                    </div>
                    <span className={transcriptionProgress >= 40 ? 'text-gray-700' : 'text-gray-500'}>Processing speech recognition</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full ${transcriptionProgress >= 80 ? 'bg-primary' : (transcriptionProgress >= 60 ? 'bg-primary animate-pulse' : 'bg-gray-300')} flex items-center justify-center text-white`}>
                      {transcriptionProgress >= 80 ? <i className="fas fa-check text-xs"></i> : (transcriptionProgress >= 60 ? <i className="fas fa-spinner text-xs"></i> : <i className="fas fa-ellipsis-h text-xs"></i>)}
                    </div>
                    <span className={transcriptionProgress >= 60 ? 'text-gray-700' : 'text-gray-500'}>Generating transcript</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full ${transcriptionProgress >= 100 ? 'bg-primary' : (transcriptionProgress >= 80 ? 'bg-primary animate-pulse' : 'bg-gray-300')} flex items-center justify-center text-white`}>
                      {transcriptionProgress >= 100 ? <i className="fas fa-check text-xs"></i> : (transcriptionProgress >= 80 ? <i className="fas fa-spinner text-xs"></i> : <i className="fas fa-ellipsis-h text-xs"></i>)}
                    </div>
                    <span className={transcriptionProgress >= 80 ? 'text-gray-700' : 'text-gray-500'}>Formatting output</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Transcript Result */}
        {showResult && transcriptionResult && (
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-12">
            <div className="bg-gray-100 p-4 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Transcript Results</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={copyTranscript}
                  className="text-gray-600 hover:text-primary transition-colors px-2 py-1 rounded" 
                  title="Copy Transcript"
                >
                  <i className="far fa-copy"></i>
                </button>
                <button 
                  onClick={downloadAsText}
                  className="text-gray-600 hover:text-primary transition-colors px-2 py-1 rounded" 
                  title="Download as Text"
                >
                  <i className="fas fa-file-download"></i>
                </button>
                <button 
                  onClick={downloadAsSRT}
                  className="text-gray-600 hover:text-primary transition-colors px-2 py-1 rounded" 
                  title="Download as SRT"
                >
                  <i className="fas fa-closed-captioning"></i>
                </button>
                <button 
                  className="text-gray-600 hover:text-primary transition-colors px-2 py-1 rounded" 
                  title="Share"
                >
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200">
              <div className="p-4 flex space-x-3">
                <div className="space-x-3">
                  <button 
                    onClick={() => setDisplayMode('text')}
                    className={`px-3 py-1 ${displayMode === 'text' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} text-sm rounded-md transition-colors`}
                  >
                    Text
                  </button>
                  <button 
                    onClick={() => setDisplayMode('paragraphs')}
                    className={`px-3 py-1 ${displayMode === 'paragraphs' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} text-sm rounded-md transition-colors`}
                  >
                    Paragraphs
                  </button>
                  <button 
                    onClick={() => setDisplayMode('timestamps')}
                    className={`px-3 py-1 ${displayMode === 'timestamps' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} text-sm rounded-md transition-colors`}
                  >
                    Timestamps
                  </button>
                </div>
              </div>
            </div>
            
            <div ref={transcriptRef} className="transcript-container h-80 overflow-y-auto p-6">
              {displayMode === 'text' && (
                <div className="text-gray-700">
                  {transcriptionResult.text}
                </div>
              )}
              
              {displayMode === 'paragraphs' && (
                <div className="space-y-4">
                  {transcriptionResult.text.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700">{paragraph}</p>
                  ))}
                </div>
              )}
              
              {displayMode === 'timestamps' && (
                <div className="space-y-4">
                  {transcriptionResult.timestamps?.map((item, index) => (
                    <p key={index}>
                      <span className="text-primary font-medium">[{Math.floor(item.start / 60)}:{(item.start % 60).toString().padStart(2, '0')}]</span> 
                      <span className="text-gray-700"> {item.text}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TranscriptionTool;
