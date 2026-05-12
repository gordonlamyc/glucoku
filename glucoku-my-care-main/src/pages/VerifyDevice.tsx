import { useState } from "react";
import { Link as LinkIcon, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const VERIFY_URL = "https://medicode-eight.vercel.app";

export default function DeviceVerification() {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const { toast } = useToast();

  const verifyOnChain = async () => {
    setVerificationError(null);
    setVerifying(true);

    try {
      // PLACEHOLDER: Replace this block with a real on-chain verification call.
      // Example: `await fetch('/api/verify-onchain', { method: 'POST', body: JSON.stringify({ deviceId }) })`
      // For now, we'll simulate a short delay and then redirect the user to your URL.
      await new Promise((res) => setTimeout(res, 900));

      // Open the verification / result page in a new tab so users don't lose the current app state.
      window.open(VERIFY_URL, "_blank");

      setQrResult(VERIFY_URL);
      setVerified(true);

      toast({
        title: "Verification started",
        description: "Opening verification page in a new tab.",
      });
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationError("Verification failed. Please try again.");
      toast({
        title: "Verification failed",
        description: "There was a problem verifying the device.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleReset = () => {
    setVerified(false);
    setQrResult(null);
    setVerificationError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-6 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Device Verification</h1>
          <p className="text-muted-foreground">Verify the device using blockchain verification</p>
        </div>

        <Card className="card-glow overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
              {!verified ? (
                verificationError ? (
                  <div className="text-center space-y-4 p-8">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-warning/10">
                      <AlertCircle className="h-10 w-10 text-warning" />
                    </div>
                    <p className="text-sm text-muted-foreground">{verificationError}</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-4">
                      <LinkIcon className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center mb-2">Click the button below to verify on the blockchain and open the verification page.</p>
                    {qrResult && (
                      <p className="text-xs text-muted-foreground break-all text-center">Last Redirect: <span className="font-medium">{qrResult}</span></p>
                    )}
                  </div>
                )
              ) : (
                <div className="w-full h-full relative flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center bg-success/10 rounded-full p-6 mb-3">
                    <Check className="text-success h-10 w-10" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Verification initiated:
                    <br />
                    <span className="font-medium break-all text-success">{qrResult}</span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleReset} disabled={verifying}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>

          {!verified && (
            <Button
              size="lg"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={verifyOnChain}
              disabled={verifying}
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              {verifying ? "Verifying..." : "Verify on Blockchain"}
            </Button>
          )}
        </div>

        {/* Tips */}
        {!verified && (
          <Card className="card-glow bg-secondary/50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">🔗 Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• This button redirects to your verification page: {VERIFY_URL}</li>
                <li>• Replace the placeholder in <code>verifyOnChain</code> with your actual on-chain verification API call.</li>
                <li>• Consider opening verification results in a modal or embedded view if you want to keep users in-app.</li>
              </ul>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
