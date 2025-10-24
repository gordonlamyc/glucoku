import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Home, Camera, FileText, MessageCircle, MessageSquare, Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </NavLink>

          <NavLink
            to="/scanner"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Camera className="h-5 w-5" />
            <span className="text-xs font-medium">Scanner</span>
          </NavLink>

          <NavLink
            to="/log"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs font-medium">Log</span>
          </NavLink>

          <NavLink
            to="/chatbot"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-xs font-medium">Chat</span>
          </NavLink>

          <NavLink
            to="/advice"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs font-medium">Advice</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs font-medium">Settings</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
