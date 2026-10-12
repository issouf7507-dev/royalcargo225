"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import DotMap from "@/components/admin/DotMap";
import { cn } from "@/lib/utils";

const inputCls =
  "flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/tableau-de-bord");
        toast.success("La Connexion c'est bien passée");
        return;
      }
      setError("Email ou mot de passe incorrect");
    } catch (err) {
      setError("Une erreur est survenue");
    }
    setPending(false);
  };

  return (
    // Animations en CSS (globals.css) : framer-motion 11.2 ne fonctionne pas avec le React 19 de Next 16
    <div className="flex min-h-dvh w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="login-pop flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl"
        >
          {/* Panneau gauche : carte animée */}
          <div className="relative hidden h-[600px] w-1/2 overflow-hidden border-r border-gray-100 md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
              <DotMap />
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Royal Cargo Express"
                  style={{ animationDelay: "0.6s" }}
                  className="login-drop mb-6 w-56 rounded-2xl bg-white/80 px-4 py-2 shadow-lg shadow-blue-200 backdrop-blur-sm"
                />
                <h2
                  style={{ animationDelay: "0.7s" }}
                  className="login-drop mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-center text-3xl font-bold text-transparent"
                >
                  Back office
                </h2>
                <p
                  style={{ animationDelay: "0.8s" }}
                  className="login-drop max-w-xs text-center text-sm text-gray-600"
                >
                  Suivez les colis de la Chine jusqu&apos;à Abidjan et prévenez vos clients par SMS à chaque étape.
                </p>
              </div>
            </div>
          </div>

          {/* Panneau droit : formulaire */}
          <div className="flex w-full flex-col justify-center bg-white p-8 md:w-1/2 md:p-10">
            <div className="hero-fade-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Royal Cargo Express" className="mb-6 w-40 md:hidden" />
              <h1 className="mb-1 text-2xl font-bold text-gray-800 md:text-3xl">Bon retour 👋</h1>
              <p className="mb-8 text-gray-500">Connectez-vous au back office Royal Cargo</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                    Email <span className="text-blue-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@royalcargo225.com"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                    Mot de passe <span className="text-blue-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Votre mot de passe"
                      className={cn(inputCls, "pr-10")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="flex items-start gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    {error}
                  </p>
                )}

                <div
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className="pt-2 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98]"
                >
                  <button
                    type="submit"
                    disabled={pending}
                    className={cn(
                      "relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70",
                      hovered && "shadow-lg shadow-blue-200"
                    )}
                  >
                    <span className="flex items-center justify-center">
                      {pending ? "Connexion…" : "Se connecter"}
                      {pending ? <Loader2 className="ml-2 size-4 animate-spin" /> : <ArrowRight className="ml-2 size-4" />}
                    </span>
                    {hovered && (
                      <span
                        className="login-shine absolute bottom-0 left-0 top-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-md"
                      />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}
