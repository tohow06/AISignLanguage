import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Play, Download, Share, RotateCcw, BicepsFlexed, Keyboard, Brain, Video, Mail, Github } from "lucide-react";
import heeJooHeadshot from "@assets/Screenshot 2025-06-30 171450_1751334184032.png";
import heeJooHeadshotNew from "@assets/headshot_1751336151694.png";

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
  const [inputText, setInputText] = useState("Nice to meet you");
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
      // Stop polling if video is completed or failed
      if (data?.status === "completed" || data?.status === "failed") {
        return false;
      }
      return 2000;
    },
    refetchIntervalInBackground: false,
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

    // Check if input is exactly "Nice to meet you"
    if (inputText.trim().toLowerCase() !== "nice to meet you") {
      toast({
        title: "Coming Soon",
        description: "I'm still making other interpretations. For now, please try 'Nice to meet you'",
        variant: "default",
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
      <header className="bg-gradient-to-br from-blue-50 to-white shadow-sm border-b-4 border-material-blue">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-material-gray mb-3">
              HeeJoo Hong
            </h1>
            <p className="text-material-blue text-xl font-medium mb-2">AI Sign Language Interpreter</p>
            <p className="text-material-gray-light text-lg mb-6">Bridging communication gaps through AI-powered sign language interpretation</p>
            
            {/* HeeJoo's Professional Headshot */}
            <div className="mb-4">
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-material-blue bg-gradient-to-br from-blue-100 to-blue-50 p-1 group cursor-pointer">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <img 
                    src={heeJooHeadshotNew}
                    alt="HeeJoo Hong - AI Sign Language Interpreter"
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                  />
                  <img 
                    src={heeJooHeadshot}
                    alt="HeeJoo Hong - AI Sign Language Interpreter"
                    className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>
              </div>
            </div>
            
            {/* Contact Icons - Under Headshot */}
            <div className="flex justify-center gap-3 mb-6">
              <a 
                href="mailto:tohow0606@gmail.com"
                className="inline-flex items-center justify-center w-10 h-10 bg-material-blue text-white rounded-full hover:bg-blue-600 transition-colors shadow-md"
                aria-label="Email HeeJoo Hong"
              >
                <Mail size={20} />
              </a>
              <a 
                href="https://github.com/tohow06/AISignLanguage"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 bg-material-blue text-white rounded-full hover:bg-blue-600 transition-colors shadow-md"
                aria-label="View GitHub Repository"
              >
                <Github size={20} />
              </a>
            </div>
            
            <p className="text-material-gray-light text-lg">I can convert your text into sign language videos</p>
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
                <h2 className="text-2xl font-medium text-material-gray mb-2">Try My Services</h2>
                <p className="text-material-gray-light">Experience my sign language interpretation with "Nice to meet you" - more phrases coming soon!</p>
              </div>
              
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="relative">
                  <label htmlFor="textInput" className="sr-only">Text to convert to sign language</label>
                  <Textarea 
                    id="textInput"
                    placeholder="Try 'Nice to meet you' to see my interpretation!"
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
                    <span className="text-material-error">Sorry, I encountered an issue creating your video. Please try again!</span>
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
                        I'm working on it...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Let Me Create Your Video
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
                  <h3 className="text-lg font-medium text-material-gray">HeeJoo is Creating Your Sign Language Video</h3>
                  <p className="text-material-gray-light">Please wait while I prepare your personalized sign language interpretation...</p>
                  
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
                  <h2 className="text-xl font-medium text-material-gray mb-2">Your Professional Sign Language Interpretation</h2>
                  <p className="text-material-gray-light">
                    HeeJoo has created this interpretation for: <span className="font-medium">"{videoStatus.inputText}"</span>
                  </p>
                </div>
                
                <div className="bg-black rounded-lg overflow-hidden max-w-2xl mx-auto mb-6">
                  <video 
                    controls 
                    className="w-full h-auto"
                    poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfkYsgU2lnbiBMYW5ndWFnZSBWaWRlbzwvdGV4dD48L3N2Zz4="
                  >
                    <source src={videoStatus?.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline"
                    className="border-material-blue text-material-blue hover:bg-material-blue hover:text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Video
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-material-blue text-material-blue hover:bg-material-blue hover:text-white"
                  >
                    <Share className="mr-2 h-4 w-4" />
                    Share Video
                  </Button>
                  <Button 
                    onClick={() => {
                      setInputText("");
                      setRequestId(null);
                    }}
                    variant="outline"
                    className="border-material-blue text-material-blue hover:bg-material-blue hover:text-white"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Create Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* About Me Section */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-medium text-material-gray mb-4">About Me</h2>
                <div className="max-w-3xl mx-auto text-material-gray-light leading-relaxed">
                  <p className="mb-4">
                    Hello! I'm HeeJoo Hong, a professional AI Sign Language Interpreter dedicated to making communication accessible for everyone. 
                    With advanced AI technology, I can transform your written text into clear, accurate sign language videos.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <span className="bg-material-blue text-white px-4 py-2 rounded-full text-sm font-medium">
                      AI Interpretation
                    </span>
                    <span className="bg-material-blue text-white px-4 py-2 rounded-full text-sm font-medium">
                      Sign Language
                    </span>
                    <span className="bg-material-blue text-white px-4 py-2 rounded-full text-sm font-medium">
                      Accessibility
                    </span>
                    <span className="bg-material-blue text-white px-4 py-2 rounded-full text-sm font-medium">
                      Communication
                    </span>
                  </div>
                </div>
              </div>
              
              {/* My Process Section within About Me */}
              <div className="border-t border-gray-200 pt-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-medium text-material-gray mb-2">My Method</h3>
                  <p className="text-material-gray-light">How I deliver professional sign language interpretations</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-material-blue rounded-full mb-4 shadow-lg">
                      <Keyboard className="text-white" size={28} />
                    </div>
                    <h4 className="font-medium text-material-gray mb-2">1. Text Analysis</h4>
                    <p className="text-material-gray-light text-sm">I carefully analyze your message to understand context and meaning</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-material-blue rounded-full mb-4 shadow-lg">
                      <Brain className="text-white" size={28} />
                    </div>
                    <h4 className="font-medium text-material-gray mb-2">2. AI Processing</h4>
                    <p className="text-material-gray-light text-sm">Advanced AI technology generates natural sign language movements</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-material-blue rounded-full mb-4 shadow-lg">
                      <Video className="text-white" size={28} />
                    </div>
                    <h4 className="font-medium text-material-gray mb-2">3. Video Delivery</h4>
                    <p className="text-material-gray-light text-sm">Receive your professional interpretation ready to use and share</p>
                  </div>
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
            © 2025 HeeJoo Hong - Professional AI Sign Language Interpreter
          </p>
          <p className="text-material-gray-light text-xs mt-2">
            Dedicated to making communication accessible through advanced AI technology
          </p>
        </div>
      </footer>
    </div>
  );
}
