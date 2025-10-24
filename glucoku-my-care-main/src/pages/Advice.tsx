import { useState } from "react";
import { Volume2, Languages, Lightbulb, Heart, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const adviceContent = {
  en: [
    {
      icon: "🚶",
      title: "Post-Meal Activity",
      advice: "Your glucose rose after lunch. Consider walking for 10 minutes after meals to help stabilize levels.",
    },
    {
      icon: "🥗",
      title: "Food Choice",
      advice: "Brown rice has a lower glycemic index than white rice. Try swapping next time!",
    },
    {
      icon: "💧",
      title: "Hydration",
      advice: "Drinking water can help regulate blood sugar. Aim for 8 glasses daily.",
    },
  ],
  bm: [
    {
      icon: "🚶",
      title: "Aktiviti Selepas Makan",
      advice: "Glukosa anda meningkat selepas makan tengahari. Cuba berjalan kaki 10 minit selepas makan.",
    },
    {
      icon: "🥗",
      title: "Pilihan Makanan",
      advice: "Nasi perang mempunyai indeks glisemik yang lebih rendah daripada nasi putih. Cuba tukar!",
    },
    {
      icon: "💧",
      title: "Pengambilan Air",
      advice: "Minum air dapat membantu mengawal gula darah. Sasarkan 8 gelas sehari.",
    },
  ],
  zh: [
    {
      icon: "🚶",
      title: "餐后活动",
      advice: "午餐后您的血糖升高。建议餐后步行10分钟以稳定血糖水平。",
    },
    {
      icon: "🥗",
      title: "食物选择",
      advice: "糙米的血糖指数比白米低。下次试试看！",
    },
    {
      icon: "💧",
      title: "补充水分",
      advice: "喝水有助于调节血糖。每天喝8杯水。",
    },
  ],
  ta: [
    {
      icon: "🚶",
      title: "உணவுக்குப் பிறகு செயல்பாடு",
      advice: "மதிய உணவுக்குப் பிறகு உங்கள் குளுக்கோஸ் அதிகரித்தது. சர்க்கரை நிலையை சமநிலைப்படுத்த உணவுக்குப் பிறகு 10 நிமிடங்கள் நடக்கவும்.",
    },
    {
      icon: "🥗",
      title: "உணவு தேர்வு",
      advice: "பழுப்பு அரிசி வெள்ளை அரிசியை விட குறைந்த கிளைசெமிக் இண்டெக்ஸ் கொண்டது. அடுத்த முறை மாற்றி பாருங்கள்!",
    },
    {
      icon: "💧",
      title: "நீர்ச்சத்து",
      advice: "தண்ணீர் குடிப்பது இரத்த சர்க்கரையை ஒழுங்குபடுத்த உதவும். தினமும் 8 கிளாஸ் குடிக்கவும்.",
    },
  ],
};

const languageNames: Record<string, string> = {
  en: "English",
  bm: "Bahasa Malaysia",
  zh: "中文",
  ta: "தமிழ்",
};

export default function Advice() {
  const [language, setLanguage] = useState<"en" | "bm" | "zh" | "ta">("en");
  const [speaking, setSpeaking] = useState<number | null>(null);

  const handleSpeak = (index: number) => {
    setSpeaking(index);
    // Simulate speech
    setTimeout(() => setSpeaking(null), 2000);
  };

  const cycleLanguage = () => {
    const langs: ("en" | "bm" | "zh" | "ta")[] = ["en", "bm", "zh", "ta"];
    const currentIndex = langs.indexOf(language);
    setLanguage(langs[(currentIndex + 1) % langs.length]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-6 animate-fade-in">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Health Advice</h1>
          <p className="text-muted-foreground">Personalized tips for you</p>
        </div>

        {/* Language Selector */}
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                <span className="font-medium">Language</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={cycleLanguage}
                className="gap-2"
              >
                {languageNames[language]}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="card-glow bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                <Activity className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Overall Status: Good</h3>
                <p className="text-sm text-muted-foreground">
                  {language === "en" && "Your glucose levels have been stable this week. Keep up the great work!"}
                  {language === "bm" && "Paras glukosa anda stabil minggu ini. Teruskan usaha yang baik!"}
                  {language === "zh" && "本周您的血糖水平稳定。继续保持！"}
                  {language === "ta" && "இந்த வாரம் உங்கள் குளுக்கோஸ் அளவுகள் நிலையாக உள்ளன. நல்ல வேலையைத் தொடரவும்!"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advice Cards */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">
              {language === "en" && "Personalized Tips"}
              {language === "bm" && "Petua Peribadi"}
              {language === "zh" && "个性化建议"}
              {language === "ta" && "தனிப்பயனாக்கப்பட்ட குறிப்புகள்"}
            </h2>
          </div>

          {adviceContent[language].map((item, index) => (
            <Card key={index} className="card-glow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <h3 className="font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.advice}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSpeak(index)}
                    className={speaking === index ? "text-primary animate-pulse-glow" : ""}
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Wellness Resources */}
        <Card className="card-glow bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">
                  {language === "en" && "Need Help?"}
                  {language === "bm" && "Perlukan Bantuan?"}
                  {language === "zh" && "需要帮助？"}
                  {language === "ta" && "உதவி தேவையா?"}
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {language === "en" && "Contact your healthcare provider for personalized guidance."}
                  {language === "bm" && "Hubungi penyedia penjagaan kesihatan anda untuk panduan peribadi."}
                  {language === "zh" && "联系您的医疗保健提供者获取个性化指导。"}
                  {language === "ta" && "தனிப்பயனாக்கப்பட்ட வழிகாட்டுதலுக்கு உங்கள் சுகாதார வழங்குநரைத் தொடர்பு கொள்ளவும்."}
                </p>
                <Button variant="outline" size="sm">
                  {language === "en" && "Learn More"}
                  {language === "bm" && "Ketahui Lebih Lanjut"}
                  {language === "zh" && "了解更多"}
                  {language === "ta" && "மேலும் அறிக"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
