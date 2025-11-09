import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FormInput, Palette, Code, Zap, ArrowRight } from "lucide-react";
import { APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">{APP_TITLE}</h1>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button onClick={() => setLocation("/dashboard")}>Dashboard</Button>
            ) : (
              <Button onClick={handleGetStarted}>Accedi</Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Crea Form Bellissimi in Pochi Minuti
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Editor drag and drop intuitivo, personalizzazione completa dello stile,
            e integrazione semplice con qualsiasi sito web tramite iframe o script embed.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
            Inizia Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 bg-white/50">
        <h3 className="text-3xl font-bold text-center mb-12">Funzionalità Principali</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FormInput className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Editor Drag & Drop</h4>
            <p className="text-muted-foreground">
              Crea form complessi senza scrivere codice, con un editor visuale intuitivo
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Personalizzazione Totale</h4>
            <p className="text-muted-foreground">
              Colori, font, spaziatura e stili completamente personalizzabili
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Facile Integrazione</h4>
            <p className="text-muted-foreground">
              Embed con iframe o script JavaScript in qualsiasi sito web
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Risposte in Tempo Reale</h4>
            <p className="text-muted-foreground">
              Visualizza e gestisci le risposte con export CSV integrato
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto a Creare il Tuo Primo Form?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Inizia subito, è gratis e non richiede carta di credito
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleGetStarted}
            className="text-lg px-8"
          >
            Crea il Tuo Form
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm py-8">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2025 {APP_TITLE}. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}
