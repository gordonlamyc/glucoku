import { useState, useEffect, useRef } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/appStore";
import { ChatMessage } from "@/lib/appStore";

// ===== Azure OpenAI Configuration =====
const AZURE_ENDPOINT_FULL = import.meta.env.VITE_AZURE_ENDPOINT as string;
const AZURE_API_KEY = import.meta.env.VITE_AZURE_API_KEY as string;

// ===== Component Start =====
export default function Chatbot() {
  const { logs, chatMessages, addChatMessage, setChatMessages, latestGlucose } = useAppStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // If there are stored chat messages, use them
    if (chatMessages.length > 0) {
      return chatMessages;
    }
    // Otherwise, use the default welcome message
    return [{
      id: "1",
      text: "Hi there 👋 I'm Glucoku, your diabetes and nutrition assistant. Ask me anything — about your meals, glucose readings, or health tips!",
      sender: "bot",
      timestamp: new Date(),
    }];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Use latestGlucose from Blynk if available, otherwise fall back to logs
  const latest = logs[0];
  const currentGlucose = latestGlucose !== null ? latestGlucose : (latest ? latest.glucose : 5.8);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===== Azure GPT-4o Call =====
  const getResponse = async (userMessage: string): Promise<string> => {
    try {
      // Build context summary
      const recentLogs = logs
        .slice(0, 5)
        .map((l: any) => {
          const time = new Date(l.timestamp).toLocaleString();
          return `${time}: ${l.meal ?? "no meal"} — ${l.glucose} mmol/L;`;
        })
        .join("\n") || "No recent logs.";

      const systemPrompt = `
You are Glucoku, a friendly, concise diabetes assistant that also answers general questions when asked.
Use the following context to provide practical, safe, and clear guidance.

Context:
- Current glucose: ${currentGlucose} mmol/L
- Recent logs:
${recentLogs}

Rules:
- Keep answers under 150 words.
- Be warm, supportive, and clear.
- If it's a medical/emergency question, advise consulting a clinician.
`;

      const body = {
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 300,
        temperature: 0.3,
      };

      const resp = await fetch(AZURE_ENDPOINT_FULL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": AZURE_API_KEY,
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        console.error("Azure API error:", resp.status, txt);
        return "⚠ Sorry, I'm having trouble connecting to the assistant right now.";
      }

      const data = await resp.json();
      const assistantContent = data?.choices?.[0]?.message?.content;
      if (!assistantContent) return "I couldn't generate an answer — please try again.";

      return assistantContent.trim();
    } catch (err) {
      console.error("Error calling Azure OpenAI:", err);
      return "⚠ Sorry, something went wrong while getting a response.";
    }
  };

  // ===== Send Message Handler =====
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    // Update both local state and app store
    setMessages((prev) => [...prev, userMessage]);
    addChatMessage(userMessage);
    
    setInput("");
    setIsTyping(true);

    try {
      const botText = await getResponse(input);

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: "bot",
        timestamp: new Date(),
      };

      // Update both local state and app store
      setMessages((prev) => [...prev, botResponse]);
      addChatMessage(botResponse);
    } catch (err) {
      console.error("Chatbot error:", err);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        text: "⚠ I couldn't fetch a reply. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      
      // Update both local state and app store
      setMessages((prev) => [...prev, errorMessage]);
      addChatMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ===== UI =====
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-6 animate-fade-in">
      <div className="max-w-md mx-auto space-y-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold mb-2">💬 Glucoku Chat</h1>
          <p className="text-muted-foreground">
            Ask health, meal, or glucose-related questions — or just chat.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Current glucose: <strong>{currentGlucose} mmol/L</strong>
          </p>
        </div>

        <Card className="card-glow border border-primary/30">
          <CardContent className="p-4 h-[60vh] overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    m.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-secondary/70 text-foreground"
                  }`}
                >
                  {m.sender === "user" ? (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {m.text}
                    </div>
                  ) : (
                    <div className="flex items-start gap-1">
                      <Bot className="h-3 w-3 mt-[2px]" />{" "}
                      <span>{m.text}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="h-3 w-3" /> Glucoku is typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleSend}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
