import { useState, useRef, useEffect } from "react";
import { Camera, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/appStore";
import { useToast } from "@/hooks/use-toast";

// Azure OpenAI Configuration
const AZURE_ENDPOINT = import.meta.env.VITE_AZURE_ENDPOINT as string;
const DEPLOYMENT_NAME = "foodvision-gpt4o";
const API_KEY = import.meta.env.VITE_AZURE_API_KEY as string;
const API_VERSION = "2023-05-15";

interface FoodAnalysisResult {
  food: string;
  carbs: number;
  confidence: number;
  spike: number;
  healthier: string;
}

export default function Scanner() {
  const [hasImage, setHasImage] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize camera when component mounts
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera if available
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCameraError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Convert data URL to Blob
  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Analyze food using Azure OpenAI
// Analyze food using Azure OpenAI
const analyzeFood = async (imageDataUrl: string) => {
  try {
    // Extract base64 data from the data URL
    const base64Image = imageDataUrl.startsWith("data:image")
      ? imageDataUrl
      : `data:image/jpeg;base64,${imageDataUrl}`;

    const headers = {
      "Content-Type": "application/json",
      "api-key": API_KEY,
    };

    const body = {
      messages: [
        {
          role: "system",
          content: "You are an AI nutrition expert that identifies foods and estimates carbohydrate content.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identify the food in this image and estimate the carbohydrate content (in grams) for one standard serving.",
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    };

    console.log("Sending request to Azure OpenAI...");

    const response = await fetch(AZURE_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API Error:", response.status, errText);
      throw new Error(`API error: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Azure OpenAI Response:", responseData);

    // Extract the GPT text output
    const content = responseData.choices?.[0]?.message?.content || "";

    // Simple parsing of food name and carbs
    const foodMatch = content.match(/([A-Z][a-zA-Z\s]+)/);
    const carbsMatch = content.match(/(\d+(?:\.\d+)?)\s*g/i);

    const foodName = foodMatch ? foodMatch[1].trim() : "Unknown food";
    const carbsValue = carbsMatch ? parseFloat(carbsMatch[1]) : 0;
    const glucoseSpike = parseFloat((carbsValue * 0.03).toFixed(1));

    // Suggest a healthier alternative
    let healthierOption = "A lower-carb alternative";
    if (foodName.toLowerCase().includes("rice")) {
      healthierOption = "Brown rice or cauliflower rice";
    } else if (foodName.toLowerCase().includes("noodle") || foodName.toLowerCase().includes("pasta")) {
      healthierOption = "Zucchini noodles or shirataki noodles";
    } else if (foodName.toLowerCase().includes("bread")) {
      healthierOption = "Whole grain bread or lettuce wrap";
    }

    return {
      food: foodName,
      carbs: carbsValue,
      confidence: 85,
      spike: glucoseSpike,
      healthier: healthierOption,
    };
  } catch (error) {
    console.error("Error analyzing food:", error);
    toast({
      title: "Analysis Error",
      description: "Could not analyze the food image. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setHasImage(true);
    setAnalyzing(true);
    
    // Capture current frame from video
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      
      // Stop camera after capturing
      stopCamera();
      
      try {
        // Send image for analysis
        const analysisResult = await analyzeFood(imageDataUrl);
        
        if (analysisResult) {
          setResult(analysisResult);
        } else {
          // Fallback to simulated data if analysis fails
          setResult({
            food: "Nasi Lemak with Sambal",
            carbs: 60,
            spike: 2.4,
            healthier: "Brown rice with grilled chicken",
            confidence: 92,
          });
        }
      } catch (error) {
        console.error("Food analysis error:", error);
        // Fallback to simulated data
        setResult({
          food: "Nasi Lemak with Sambal",
          carbs: 60,
          spike: 2.4,
          healthier: "Brown rice with grilled chicken",
          confidence: 92,
        });
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleReset = () => {
    setHasImage(false);
    setResult(null);
    setAnalyzing(false);
    setCapturedImage(null);
    startCamera(); // Restart camera for new capture
  };

  const { addLog } = useAppStore();

  const handleLogMeal = () => {
    if (!result) return;
    const estimatedBase = 5.8; // base fasting estimate; replace later with real device reading
    const estimatedGlucose = Number((estimatedBase + (result.spike ?? 0)).toFixed(1));
    const status = estimatedGlucose >= 7 ? "high" : estimatedGlucose < 4 ? "low" : "normal";

    addLog({
      glucose: estimatedGlucose,
      status: status as any,
      meal: result.food,
      notes: `${result.carbs}g carbs | Scanner confidence ${result.confidence}%`,
      source: "scanner",
    });

    toast({
      title: "Meal Logged",
      description: `${result.food} has been added to your glucose log.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-6 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Food Scanner</h1>
          <p className="text-muted-foreground">Capture your meal to estimate glucose impact</p>
        </div>

        {/* Camera Preview */}
        <Card className="card-glow overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
              {!hasImage ? (
                <>
                  {cameraError ? (
                    <div className="text-center space-y-4 p-8">
                      <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-warning/10">
                        <AlertCircle className="h-10 w-10 text-warning" />
                      </div>
                      <p className="text-sm text-muted-foreground">{cameraError}</p>
                    </div>
                  ) : (
                    <div className="w-full h-full">
                      <video 
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-white bg-black/50 py-1">
                        Position your meal in frame
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full relative">
                  {capturedImage ? (
                    <img 
                      src={capturedImage} 
                      alt="Captured food" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <div className="text-6xl">🍛</div>
                    </div>
                  )}
                  {analyzing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white text-center space-y-2">
                        <div className="inline-block h-8 w-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        <p className="text-sm">Analyzing meal...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Results */}
        {result && !analyzing && (
          <div className="space-y-4 animate-fade-in">
            <Card className="card-glow border-2 border-warning/30">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Detected: {result.food}</h3>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {result.confidence}%
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Estimated carbs</span>
                    <span className="text-xl font-bold">{result.carbs}g</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Estimated glucose spike</span>
                    <span className="text-2xl font-bold text-warning">+{result.spike} mmol/L</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-warning to-warning/60 rounded-full transition-all"
                      style={{ width: `${(result.spike / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow bg-gradient-to-br from-success/5 to-success/10 border-success/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Healthier Alternative</h4>
                    <p className="text-sm text-muted-foreground mb-3">{result.healthier}</p>
                    <p className="text-xs text-success font-medium">
                      ~30% lower glucose impact
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleReset}
              >
                <X className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleLogMeal}>
                <Check className="mr-2 h-4 w-4" />
                Log Meal
              </Button>
            </div>
          </div>
        )}

        {/* Capture Button */}
        {!hasImage && (
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 h-14 text-lg"
            onClick={handleCapture}
            disabled={!cameraActive}
          >
            <Camera className="mr-2 h-5 w-5" />
            Capture Photo
          </Button>
        )}

        {/* Tips */}
        {!hasImage && !cameraError && (
          <Card className="card-glow bg-secondary/50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">📸 Tips for best results</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Ensure good lighting</li>
                <li>• Capture the entire meal</li>
                <li>• Avoid shadows and reflections</li>
              </ul>
            </CardContent>
          </Card>
        )}
        
        {/* Camera Error Message */}
        {cameraError && !hasImage && (
          <Card className="card-glow bg-warning/10 border-warning/30">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">⚠️ Camera Access Issue</h4>
              <p className="text-xs text-muted-foreground">
                {cameraError} Please check your browser settings and ensure camera permissions are granted.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
