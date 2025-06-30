import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, Download, Share, RotateCcw, BicepsFlexed, Keyboard, Brain, Video } from "lucide-react";

interface VideoResponse {
  success: boolean;
  requestId: number;
  message: string;
}

interface VideoStatus {
  success: boolean;
  status: string;
  videoUrl?: string;
  inputText: string;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [requestId, setRequestId] = useState<number | null>(null);
  const { toast } = useToast();

  const generateVideoMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/generate-video", { text });
      return response.json() as Promise<VideoResponse>;
    },
    onSuccess: (data) => {
      if (data.success) {
        setRequestId(data.requestId);
        toast({
          title: "Success",
          description: "Video generation started successfully",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate video",
        variant: "destructive",
      });
    },
  });

  const { data: videoStatus, isLoading: isCheckingStatus } = useQuery({
    queryKey: ["/api/video-status", requestId],
    queryFn: async () => {
      if (!requestId) return null;
      const response = await fetch(`/api/video-status/${requestId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to check status");
      return response.json() as Promise<VideoStatus>;
    },
    enabled: !!requestId,
    refetchInterval: (data) => {
      // Keep polling while status is pending or processing
      return data?.status === "pending" || data?.status === "processing" ? 2000 : false;
    },
  });

  const handleSubmit = () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert",
        variant: "destructive",
      });
      return;
    }

    if (inputText.length > 500) {
      toast({
        title: "Error",
        description: "Text must be less than 500 characters",
        variant: "destructive",
      });
      return;
    }

    generateVideoMutation.mutate(inputText);
  };

  const isGenerating = generateVideoMutation.isPending || 
    (videoStatus?.status === "pending" || videoStatus?.status === "processing");
  
  const isVideoReady = videoStatus?.status === "completed" && videoStatus.videoUrl;
  const hasError = videoStatus?.status === "failed";

  const handleReplay = () => {
    const video = document.querySelector('video') as HTMLVideoElement;
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  };

  const handleDownload = () => {
    if (videoStatus?.videoUrl) {
      const link = document.createElement('a');
      link.href = videoStatus.videoUrl;
      link.download = 'sign-language-video.mp4';
      link.click();
    }
  };

  const handleShare = () => {
    if (navigator.share && videoStatus?.videoUrl) {
      navigator.share({
        title: 'AI Sign Language Interpretation',
        text: `Sign language video for: "${videoStatus.inputText}"`,
        url: videoStatus.videoUrl,
      });
    } else {
      toast({
        title: "Info",
        description: "Share functionality not available in this browser",
      });
    }
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            {/* AI Interpreter Avatar */}
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-material-blue to-material-blue-dark rounded-full flex items-center justify-center shadow-lg">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <BicepsFlexed className="text-material-blue" size={36} />
                </div>
              </div>
              <p className="text-sm text-material-gray-light mt-2">AI Interpreter Assistant</p>
            </div>
            
            <h1 className="text-3xl font-bold text-material-gray mb-2">
              AI Sign Language Interpreter
            </h1>
            <p className="text-material-gray-light text-lg">Convert your text into sign language videos</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* Text Input Section */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-medium text-material-gray mb-2">Enter Your Text</h2>
                <p className="text-material-gray-light">Type the phrase or sentence you'd like to convert to sign language</p>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="relative">
                  <label htmlFor="textInput" className="sr-only">Text to convert to sign language</label>
                  <Textarea 
                    id="textInput"
                    placeholder="Enter your text here... (e.g., 'Hello, how are you today?')"
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-material-blue focus:ring-2 focus:ring-material-blue focus:ring-opacity-20 outline-none transition-all duration-200 resize-none min-h-[100px]"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    maxLength={500}
                  />
                  <div className="absolute bottom-3 right-3 text-sm text-material-gray-light">
                    {inputText.length}/500
                  </div>
                </div>
                
                {/* Error State */}
                {hasError && (
                  <div className="bg-red-50 border border-material-error rounded-lg p-4 flex items-center">
                    <span className="text-material-error">Failed to generate video. Please try again.</span>
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="text-center">
                  <Button 
                    onClick={handleSubmit}
                    disabled={isGenerating || !inputText.trim()}
                    className="bg-material-blue hover:bg-material-blue-dark text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 focus:ring-4 focus:ring-material-blue focus:ring-opacity-30 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Generate Sign Language Video
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading Section */}
          {isGenerating && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-material-blue bg-opacity-10 rounded-full">
                    <Loader2 className="h-8 w-8 text-material-blue animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium text-material-gray">Generating Sign Language Video</h3>
                  <p className="text-material-gray-light">Our AI is creating your personalized sign language interpretation...</p>
                  
                  {/* Progress Bar */}
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className="bg-material-blue h-2 rounded-full transition-all duration-300 animate-pulse" style={{width: "65%"}}></div>
                    </div>
                    <p className="text-sm text-material-gray-light mt-2">Processing... Please wait</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Video Player Section */}
          {isVideoReady && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-medium text-material-gray mb-2">Your Sign Language Video</h2>
                  <p className="text-material-gray-light">
                    Generated interpretation for: <span className="font-medium">"{videoStatus.inputText}"</span>
                  </p>
                </div>
                
                <div className="max-w-3xl mx-auto">
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                    <video 
                      className="w-full h-auto"
                      controls
                      src={videoStatus.videoUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <Button 
                      variant="outline"
                      onClick={handleReplay}
                      className="bg-gray-100 hover:bg-gray-200 text-material-gray"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Replay
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={handleDownload}
                      className="bg-gray-100 hover:bg-gray-200 text-material-gray"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={handleShare}
                      className="bg-gray-100 hover:bg-gray-200 text-material-gray"
                    >
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feature Info */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-medium text-material-gray mb-2">How It Works</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-material-blue bg-opacity-10 rounded-full mb-4">
                    <Keyboard className="text-material-blue" size={24} />
                  </div>
                  <h3 className="font-medium text-material-gray mb-2">1. Enter Text</h3>
                  <p className="text-material-gray-light text-sm">Type or paste the text you want to convert to sign language</p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-material-blue bg-opacity-10 rounded-full mb-4">
                    <Brain className="text-material-blue" size={24} />
                  </div>
                  <h3 className="font-medium text-material-gray mb-2">2. AI Processing</h3>
                  <p className="text-material-gray-light text-sm">Our AI model generates accurate sign language movements</p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-material-blue bg-opacity-10 rounded-full mb-4">
                    <Video className="text-material-blue" size={24} />
                  </div>
                  <h3 className="font-medium text-material-gray mb-2">3. Watch Video</h3>
                  <p className="text-material-gray-light text-sm">View and download your personalized sign language video</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-material-gray-light text-sm">
            © 2024 AI Sign Language Interpreter. Making communication accessible for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}
