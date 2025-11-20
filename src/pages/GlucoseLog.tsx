import { useState } from "react";
import { ChevronDown, TrendingDown, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/appStore";
import { format, isSameDay } from "date-fns";



export default function GlucoseLog() {
  const [filter, setFilter] = useState("day"); // day, week, month
  const { logs } = useAppStore();

  // derive stats
  const allValues = logs.map((l) => l.glucose);
  const avg = allValues.length ? (allValues.reduce((s, v) => s + v, 0) / allValues.length).toFixed(1) : "-";
  const highest = allValues.length ? Math.max(...allValues).toFixed(1) : "-";
  const lowest = allValues.length ? Math.min(...allValues).toFixed(1) : "-";

  const getStatusColor = (status: string) => {
    if (status === "normal") return "text-glucose-normal";
    if (status === "high") return "text-glucose-high";
    return "text-glucose-low";
  };

  const getStatusBg = (status: string) => {
    if (status === "normal") return "bg-glucose-normal/10";
    if (status === "high") return "bg-glucose-high/10";
    return "bg-glucose-low/10";
  };

  const getTrendIcon = (glucose: number, prevGlucose?: number) => {
    if (!prevGlucose) return null;
    if (glucose > prevGlucose) {
      return <TrendingUp className="h-4 w-4 text-warning" />;
    }
    return <TrendingDown className="h-4 w-4 text-success" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-6 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Glucose Log</h1>
          <p className="text-muted-foreground">Track your glucose history</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-secondary rounded-lg">
          <Button
            variant={filter === "day" ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setFilter("day")}
          >
            Day
          </Button>
          <Button
            variant={filter === "week" ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setFilter("week")}
          >
            Week
          </Button>
          <Button
            variant={filter === "month" ? "default" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setFilter("month")}
          >
            Month
          </Button>
        </div>

        {/* Stats Summary */}
        <Card className="card-glow">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">{avg}</div>
                <div className="text-xs text-muted-foreground mt-1">Avg</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-glucose-high">{highest}</div>
                <div className="text-xs text-muted-foreground mt-1">Highest</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-glucose-normal">{lowest}</div>
                <div className="text-xs text-muted-foreground mt-1">Lowest</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="space-y-4">
          {logs.length === 0 && (
            <div className="text-center text-sm text-muted-foreground">No logs yet — use Scanner to add a meal reading.</div>
          )}

          {logs.map((entry, index) => {
            const prevEntry = logs[index + 1];
            const entryDate = new Date(entry.timestamp);
            const showDateHeader = index === 0 || !isSameDay(new Date(logs[index - 1].timestamp), entryDate);
            const displayDate = format(entryDate, "MMM d");
            const displayTime = format(entryDate, "HH:mm");

            return (
              <div key={entry.id}>
                {showDateHeader && (
                  <div className="flex items-center gap-2 mb-3 mt-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">{displayDate}</span>
                  </div>
                )}

                <Card className="card-glow overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-muted-foreground min-w-[60px]">
                          {displayTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`text-2xl font-bold ${getStatusColor(entry.status ?? "normal")}`}>
                            {entry.glucose}
                          </div>
                          <span className="text-sm text-muted-foreground">mmol/L</span>
                          {getTrendIcon(entry.glucose, prevEntry?.glucose)}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBg(entry.status ?? "normal")} ${getStatusColor(entry.status ?? "normal")}`}>
                        {entry.status}
                      </div>
                    </div>

                    {entry.meal && (
                      <div className="mb-2 p-3 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🍽️</span>
                          <span className="text-sm font-medium">{entry.meal}</span>
                        </div>
                      </div>
                    )}

                    {entry.notes && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm text-muted-foreground">💡 {entry.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Load More */}
        <Button variant="outline" className="w-full">
          <ChevronDown className="mr-2 h-4 w-4" />
          Load More
        </Button>
      </div>
    </div>
  );
}
