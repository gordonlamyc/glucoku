import { useState } from "react";
import { 
  Bluetooth, 
  Languages, 
  Volume2, 
  Vibrate, 
  Type, 
  Wifi, 
  WifiOff,
  ChevronRight,
  User,
  Shield
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/appStore";

export default function Settings() {
  const [bluetoothConnected, setBluetoothConnected] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [largeText, setLargeText] = useState(false);
  const { settings, updateSettings } = useAppStore();
  const voiceEnabled = settings.voiceEnabled;
  const offlineMode = settings.offlineMode;

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    description, 
    action 
  }: { 
    icon: any; 
    title: string; 
    description?: string; 
    action: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="font-medium">{title}</div>
          {description && (
            <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">
        {action}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-6 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your Glucoku experience</p>
        </div>

        {/* Device Connection */}
        <Card className="card-glow">
          <CardContent className="p-6 space-y-0 divide-y divide-border">
            <div className="pb-4">
              <h2 className="font-semibold text-lg mb-1">Device</h2>
              <p className="text-sm text-muted-foreground">Connect to your glucometer</p>
            </div>
            
            <SettingItem
              icon={Bluetooth}
              title="Bluetooth"
              description={bluetoothConnected ? "Connected to Glucoku-ESP32" : "Not connected"}
              action={
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${bluetoothConnected ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setBluetoothConnected(!bluetoothConnected)}
                  >
                    {bluetoothConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              }
            />
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card className="card-glow">
          <CardContent className="p-6 space-y-0 divide-y divide-border">
            <div className="pb-4">
              <h2 className="font-semibold text-lg mb-1">Accessibility</h2>
              <p className="text-sm text-muted-foreground">Customize for easier use</p>
            </div>

            <SettingItem
              icon={Volume2}
              title="Voice Guidance"
              description="Read advice aloud"
              action={
                <Switch 
                  checked={voiceEnabled} 
                  onCheckedChange={(v) => updateSettings({ voiceEnabled: !!v })}
                />
              }
            />

            <SettingItem
              icon={Vibrate}
              title="Vibration Alerts"
              description="Haptic feedback for notifications"
              action={
                <Switch 
                  checked={vibrationEnabled} 
                  onCheckedChange={setVibrationEnabled}
                />
              }
            />

            <SettingItem
              icon={Type}
              title="Large Text"
              description="Increase text size"
              action={
                <Switch 
                  checked={largeText} 
                  onCheckedChange={setLargeText}
                />
              }
            />

            <SettingItem
              icon={Languages}
              title="Language"
              description={settings.language}
              action={
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              }
            />
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="card-glow">
          <CardContent className="p-6 space-y-0 divide-y divide-border">
            <div className="pb-4">
              <h2 className="font-semibold text-lg mb-1">Data & Privacy</h2>
              <p className="text-sm text-muted-foreground">Manage your information</p>
            </div>

            <SettingItem
              icon={offlineMode ? WifiOff : Wifi}
              title="Offline Mode"
              description="Save data locally only"
              action={
                <Switch 
                  checked={offlineMode} 
                  onCheckedChange={(v) => updateSettings({ offlineMode: !!v })}
                />
              }
            />

            <SettingItem
              icon={User}
              title="Profile"
              description="Manage personal information"
              action={
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              }
            />

            <SettingItem
              icon={Shield}
              title="Privacy Policy"
              description="View our privacy practices"
              action={
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              }
            />
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="card-glow bg-secondary/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Glucoku Version 1.0.0</p>
            <p className="text-xs text-muted-foreground">Made with ❤️ for Malaysian users</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
