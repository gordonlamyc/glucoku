import { ArrowRight, Camera, Activity, TrendingUp, QrCode } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/appStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logs } = useAppStore();
  const latest = logs[0];
  const glucoseLevel = latest ? latest.glucose : 5.8;
  const status = latest ? latest.status ?? "normal" : "normal";

  const getStatusColor = () => {
    if (status === "normal") return "bg-glucose-normal";
    if (status === "high") return "bg-glucose-high";
    return "bg-glucose-low";
  };

  const getStatusText = () => {
    if (status === "normal") return "Normal";
    if (status === "high") return "High";
    return "Low";
  };

  // today's summary
  const today = new Date().toDateString();
  const todays = logs.filter((l) => new Date(l.timestamp).toDateString() === today);
  const avg = todays.length ? (todays.reduce((s, v) => s + v.glucose, 0) / todays.length).toFixed(1) : "-";
  const readings = todays.length;
  const meals = todays.filter((l) => !!l.meal).length;

  const handleVerifyDevice = () => {
    navigate('/verify-device');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-6 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gradient-primary mb-2">Glucoku</h1>
            <p className="text-muted-foreground">Your glucose companion</p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full h-10 w-10 border-primary/30"
            onClick={handleVerifyDevice}
          >
            <QrCode className="h-5 w-5 text-primary" />
          </Button>
        </div>

        {/* Main Glucose Card */}
        <Card className="card-glow overflow-hidden border-2">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Current Reading</span>
              </div>
              
              <div className="relative">
                <div className="text-6xl font-bold text-foreground">
                  {glucoseLevel}
                </div>
                <div className="text-muted-foreground mt-1">mmol/L</div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <div className={`h-3 w-3 rounded-full ${getStatusColor()} animate-pulse-glow`} />
                <span className="text-lg font-semibold">{getStatusText()}</span>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last updated</span>
                  <span className="font-medium">2 min ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/scanner">
            <Card className="card-glow hover:scale-105 transition-transform cursor-pointer border-2 border-primary/20">
              <CardContent className="p-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10">
                  <Camera className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Scan Meal</h3>
                  <p className="text-xs text-muted-foreground mt-1">Check impact</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/log">
            <Card className="card-glow hover:scale-105 transition-transform cursor-pointer border-2 border-primary/20">
              <CardContent className="p-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-success/10">
                  <TrendingUp className="h-7 w-7 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">View Log</h3>
                  <p className="text-xs text-muted-foreground mt-1">Track history</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Today's Summary */}
        <Card className="card-glow">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Today's Summary</h3>
              <Link to="/log">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">Average</span>
                <span className="font-semibold">{avg} mmol/L</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">Readings</span>
                <span className="font-semibold">{readings} times</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">Meals logged</span>
                <span className="font-semibold">{meals} meals</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Tip */}
        <Card className="card-glow bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xl">💡</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Today's Tip</h4>
                <p className="text-sm text-muted-foreground">
                  A 10-minute walk after meals can help stabilize your glucose levels.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
