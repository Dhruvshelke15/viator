import { useState } from "react";
import { motion } from "framer-motion";
import { signIn, signUp } from "../auth-client.js";
import { Globe } from "../components/Globe.js";

export function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: err } = await signUp.email({ email, password, name });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await signIn.email({ email, password });
        if (err) throw new Error(err.message);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      <div className="bg-mesh" />
      <div className="noise-overlay" />

      <div className="relative z-10 grid lg:grid-cols-2 gap-12 max-w-5xl w-full px-6 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-[400px] hidden lg:block"
        >
          <Globe />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl p-10 w-full max-w-md mx-auto"
        >
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">VIATOR</h1>
          <p className="text-text-muted text-sm mb-8 font-display tracking-wider uppercase">
            {mode === "signin" ? "Welcome back" : "Start your journey"}
          </p>

          <div className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs text-text-dim font-display tracking-wider uppercase mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-text-dim font-display tracking-wider uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs text-text-dim font-display tracking-wider uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm"
                placeholder="At least 8 characters"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-danger text-xs"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading || !email || !password || (mode === "signup" && !name)}
              className="w-full bg-ember text-void font-display text-xs tracking-wider uppercase font-semibold px-6 py-3.5 rounded-xl glow-ember disabled:opacity-40 disabled:shadow-none transition-all mt-2"
            >
              {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Create Account"}
            </motion.button>

            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
              }}
              className="w-full text-xs text-text-muted hover:text-ember transition-colors font-display tracking-wider uppercase pt-2"
            >
              {mode === "signin"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
