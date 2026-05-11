import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Sun, Moon, Send, BrainCircuit, ClipboardCheck } from "lucide-react";

// Initialize the Gemini AI SDK with the API key from environment variables
const genAI: GoogleGenAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
});

const App = () => {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Toggle navbar styling based on scroll position
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync theme state with the document root class for Tailwind dark mode
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  // Primary logic to fetch interview questions from Gemini
  const generateQuestions = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    // Reset UI state before starting the request
    setIsLoading(true);
    setError("");
    setQuestions([]);

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate 3 interview questions for ${jobTitle}. 
                  Return them separated by double pipes, like this: Question 1 || Question 2 || Question 3`,
      });

      const text = result.text;

      // Ensure the API returned a valid string
      if (!text || text.trim().length === 0) {
        setError(
          "The AI returned an empty response. This might be due to safety filters. Please try a different role.",
        );
        setIsLoading(false);
        return; // Stop execution here
      }

      // Parse the piped string into an array of clean strings
      const parsedQuestions: string[] = text
        .split("||")
        .map((q) => q.trim())
        .filter((q) => q.length > 0);

      // Verify that splitting actually resulted in usable questions
      if (parsedQuestions.length === 0) {
        throw new Error("Could not parse questions from the AI response.");
      }

      // Limit to exactly 3 questions to maintain UI consistency
      setQuestions(parsedQuestions.slice(0, 3));
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("429")) {
        setError(
          "Too many requests! Please wait a moment before trying again.",
        );
      } else {
        setError("We couldn't generate questions right now. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-brand p-2 rounded-lg shrink-0">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              AI Interviewer
            </span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:ring-2 ring-brand transition-all"
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-slate-600" />
            )}
          </button>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-6 pt-10 pb-20">
        <section className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-linear-to-r from-brand to-purple-500 bg-clip-text text-transparent">
            Smart Interview Architect
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Enter a role to generate high-signal interview questions instantly.
          </p>
        </section>
        <form onSubmit={generateQuestions} className="relative mb-8">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Customer Success Manager"
            className="w-full p-4 pr-16 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-brand dark:focus:border-brand outline-none transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !jobTitle}
            className="absolute right-2 top-2 bottom-2 px-4 bg-brand hover:bg-brand-dark text-white rounded-xl disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
              </div>
            ))
          ) : questions.length > 0 ? (
            questions.map((q, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand transition-all shadow-sm animate-in fade-in slide-in-from-bottom-2"
                style={{
                  animationDelay: `${i * 150}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <div className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-brand/10 dark:bg-brand/20 text-brand flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <p className="text-lg leading-relaxed">{q}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <ClipboardCheck
                className="mx-auto mb-4 text-slate-300"
                size={48}
              />
              <p className="text-slate-400">Questions will appear here...</p>
            </div>
          )}
        </div>
      </main>
      <footer className="py-10 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} AI Interviewer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
