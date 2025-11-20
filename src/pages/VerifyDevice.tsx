import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Camera, QrCode, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function VerifyDevice() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera when component mounts
  useEffect(() => {
    // Add a small delay to ensure the video element is rendered
    const timer = setTimeout(() => {
      startCamera();
    }, 500);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      console.log("Starting camera...");
      
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser");
      }
      
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: { facingMode: "environment" }, // Use back camera if available
        audio: false
      };
      
      console.log("Requesting camera with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      console.log("Camera stream obtained:", stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          videoRef.current?.play()
            .then(() => console.log("Video playback started"))
            .catch(e => console.error("Error playing video:", e));
        };
        
        setCameraActive(true);
        setCameraError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(`Camera error: ${err instanceof Error ? err.message : String(err)}. Please check permissions and try again.`);
    }
  };

  // Stop camera when component unmounts
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
    setScanning(false);
  };

  const captureQR = () => {
    // Start scanning process
    setScanning(true);
    
    // Simulate QR code scanning with a timeout
    setTimeout(() => {
      // Simulate successful scan
      toast({
        title: "Device Verified",
        description: "Your device has been successfully verified.",
        variant: "default",
        className: "bg-green-500 text-white border-green-600",
      });
      stopCamera();
      navigate('/');
    }, 3000); // Simulate scan after 3 seconds
  };

  const handleBack = () => {
    stopCamera();
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-6 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Verify Device</h1>
            <p className="text-muted-foreground">Scan QR code to verify ownership</p>
          </div>
        </div>

        <Card className="card-glow overflow-hidden border border-primary/30">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
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
                    Position QR code within the frame to scan
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 h-14 text-lg"
          onClick={captureQR}
          disabled={scanning || !cameraActive}
        >
          <QrCode className="mr-2 h-5 w-5" />
          {scanning ? "Scanning..." : "Capture QR"}
        </Button>

        {cameraError && (
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