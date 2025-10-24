import { useState, useRef, useEffect } from "react";
import { Camera, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function DeviceVerification() {
  const [hasImage, setHasImage] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
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

  const verifyDevice = async (imageDataUrl: string) => {
    try {
      // Simulate device verification process
      // In a real implementation, you would send the image to a backend service
      // that would analyze the image to verify the device
      
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll assume verification is successful
      return true;
    } catch (error) {
      console.error("Error verifying device:", error);
      toast({
        title: "Verification Error",
        description: "Could not verify the device. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setHasImage(true);
    setVerifying(true);
    
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
        // Send image for verification
        const verificationResult = await verifyDevice(imageDataUrl);
        setVerified(verificationResult);
      } catch (error) {
        console.error("Device verification error:", error);
        setVerified(false);
      } finally {
        setVerifying(false);
      }
    }
  };

  const handleReset = () => {
    setHasImage(false);
    setVerified(false);
    setVerifying(false);
    setCapturedImage(null);
    startCamera(); // Restart camera for new capture
  };

  const handleConfirm = () => {
    toast({
      title: "Device Verified",
      description: "Your device has been successfully verified.",
    });
    // Here you would typically navigate to the next step or update app state
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-6 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Device Verification</h1>
          <p className="text-muted-foreground">Scan your device to verify authenticity</p>
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
                        Position your device QR code in frame
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full relative">
                  {capturedImage ? (
                    <img 
                      src={capturedImage} 
                      alt="Captured device" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                      <div className="text-6xl">📱</div>
                    </div>
                  )}
                  {verifying && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white text-center space-y-2">
                        <div className="inline-block h-8 w-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        <p className="text-sm">Verifying device...</p>
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
        {hasImage && !verifying && (
          <div className="space-y-4 animate-fade-in">
            {verified ? (
              <Card className="card-glow bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Device Verified</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Your device has been successfully verified as authentic.
                      </p>
                      <p className="text-xs text-success font-medium">
                        You can now proceed to use all features.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="card-glow border-2 border-warning/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-warning" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Verification Failed</h3>
                      <p className="text-sm text-muted-foreground">
                        We couldn't verify your device. Please try again or contact support.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleReset}
              >
                <X className="mr-2 h-4 w-4" />
                Retry
              </Button>
              {verified && (
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90" 
                  onClick={handleConfirm}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Confirm
                </Button>
              )}
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
            Scan Device
          </Button>
        )}

        {/* Tips */}
        {!hasImage && !cameraError && (
          <Card className="card-glow bg-secondary/50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">📸 Tips for best results</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Ensure good lighting</li>
                <li>• Position the QR code clearly in frame</li>
                <li>• Hold the camera steady</li>
                <li>• Remove any protective covering from the QR code</li>
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