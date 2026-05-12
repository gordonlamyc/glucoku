import { useState, useRef, useEffect } from "react";
import { Camera, X, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import jsQR from "jsqr";

export default function DeviceVerification() {
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { toast } = useToast();
  const scanInterval = useRef<number | null>(null);

  // Start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraError(null);
        setScanning(true);
      }

      // Start scanning every 500ms
      scanInterval.current = window.setInterval(scanQRCode, 500);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError("Cannot access camera. Please check browser permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    if (scanInterval.current) {
      clearInterval(scanInterval.current);
      scanInterval.current = null;
    }
    setScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, canvas.width, canvas.height);
    if (code && code.data && code.data !== qrResult) {
      console.log("QR Code detected:", code.data);
      setQrResult(code.data);
      toast({
        title: "QR Code Detected!",
        description: code.data,
      });
    }
  };

  const handleReset = () => {
    setQrResult(null);
    stopCamera();
    startCamera();
  };

  const handleOpenLink = () => {
    if (qrResult && qrResult.startsWith("http")) {
      window.open(qrResult, "_blank");
    } else {
      toast({
        title: "Invalid QR Code",
        description: "The QR code does not contain a valid URL.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-6 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Device Verification</h1>
          <p className="text-muted-foreground">
            Scan your device QR code to view its details
          </p>
        </div>

        {/* Camera View */}
        <Card className="card-glow overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-black flex items-center justify-center">
              {cameraError ? (
                <div className="text-center space-y-4 p-8">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-warning/10">
                    <AlertCircle className="h-10 w-10 text-warning" />
                  </div>
                  <p className="text-sm text-muted-foreground">{cameraError}</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {/* QR Overlay */}
              {qrResult && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 text-center">
                  <p className="text-sm truncate">{qrResult}</p>
                  <Button
                    onClick={handleOpenLink}
                    className="mt-2 w-full bg-primary hover:bg-primary/90 text-sm"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Link
                  </Button>
                </div>
              )}

              {!qrResult && (
                <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-white bg-black/50 py-1">
                  Position the QR code within the frame
                </p>
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
            disabled={!scanning}
          >
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-primary hover:bg-primary/90"
            disabled
          >
            <Camera className="mr-2 h-4 w-4" />
            {scanning ? "Scanning..." : "Starting Camera"}
          </Button>
        </div>

        {/* Tips */}
        {!cameraError && (
          <Card className="card-glow bg-secondary/50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">📸 Tips for best results</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use good lighting conditions</li>
                <li>• Keep the QR code centered</li>
                <li>• Hold the camera steady</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}