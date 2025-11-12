import { useState, useRef, useEffect } from "react";
import { Camera, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import jsQR from "jsqr";

export default function DeviceVerification() {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { toast } = useToast();
  const scanInterval = useRef<number | null>(null);

  // Initialize camera when component mounts
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // back camera
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCameraError(null);
      }

      // Start scanning loop
      scanInterval.current = window.setInterval(scanQRCode, 500);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);

    if (scanInterval.current) {
      clearInterval(scanInterval.current);
      scanInterval.current = null;
    }
  };

  const scanQRCode = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    // Match canvas to video frame
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, canvas.width, canvas.height);
    if (code && code.data) {
      console.log("QR Detected:", code.data);
      stopCamera();
      setQrResult(code.data);
      setVerified(true);
      toast({
        title: "QR Code Detected!",
        description: "Redirecting to: " + code.data,
      });

      // Auto-redirect after short delay
      setTimeout(() => {
        if (code.data.startsWith("http")) {
          window.location.href = code.data;
        } else {
          toast({
            title: "Invalid QR Code",
            description: "The QR code does not contain a valid URL.",
            variant: "destructive",
          });
        }
      }, 1500);
    }
  };

  const handleReset = () => {
    setVerified(false);
    setQrResult(null);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-6 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Device Verification</h1>
          <p className="text-muted-foreground">Scan your device QR code to verify</p>
        </div>

        {/* Camera Preview */}
        <Card className="card-glow overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
              {!verified ? (
                cameraError ? (
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
                      Position the QR code in the frame
                    </p>
                  </div>
                )
              ) : (
                <div className="w-full h-full relative flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center bg-success/10 rounded-full p-6 mb-3">
                    <Check className="text-success h-10 w-10" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    QR Detected:
                    <br />
                    <span className="font-medium break-all text-success">
                      {qrResult}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <canvas ref={canvasRef} className="hidden" />

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReset}
            disabled={cameraActive && !verified}
          >
            <X className="mr-2 h-4 w-4" />
            Retry
          </Button>
          {!verified && (
            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={!cameraActive}
            >
              <Camera className="mr-2 h-4 w-4" />
              Scanning...
            </Button>
          )}
        </div>

        {/* Tips */}
        {!verified && !cameraError && (
          <Card className="card-glow bg-secondary/50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">📸 Tips for best results</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Ensure good lighting</li>
                <li>• Keep the QR code fully in view</li>
                <li>• Hold the camera steady</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}