"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Material, Subject, Week } from "@/data/courses";
import {
  ArrowLeft, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight,
  BookOpen, Save, Sparkles, X, Menu, Bot, Send, Loader2, RotateCcw, Key
} from "lucide-react";
import { askGemini } from "@/lib/gemini";

interface LearningEnvironmentProps {
  subject: Subject;
  week: Week;
  material: Material;
  allMaterials: Material[];
  semId: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function LearningEnvironment({ subject, week, material, allMaterials, semId }: LearningEnvironmentProps) {
  const [zoom, setZoom] = useState(100);
  const [activeTab, setActiveTab] = useState<"notes" | "ai">("notes");
  const [notes, setNotes] = useState("");
  const [isSaved, setIsSaved] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [userApiKey, setUserApiKey] = useState("");
  const [showApiKeySettings, setShowApiKeySettings] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load notes from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`notes-${material.id}`);
    if (saved) {
      setNotes(saved);
    } else {
      setNotes("");
    }
    setIsSaved(true);
    setChatMessages([]);
  }, [material.id]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setUserApiKey(savedKey);
  }, []);

  // Save notes
  const handleSaveNotes = () => {
    localStorage.setItem(`notes-${material.id}`, notes);
    setIsSaved(true);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setIsSaved(false);
  };

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

  // Find next/prev materials
  const currentIndex = allMaterials.findIndex(m => m.id === material.id);
  const prevMaterial = currentIndex > 0 ? allMaterials[currentIndex - 1] : null;
  const nextMaterial = currentIndex < allMaterials.length - 1 ? allMaterials[currentIndex + 1] : null;

  const basePath = `/semester/${semId}/${subject.code.toLowerCase()}/${week.id}`;

  // Get lecture content from iframe for AI context
  const getLectureContent = (): string => {
    try {
      const iframe = iframeRef.current;
      if (iframe?.contentDocument) {
        return iframe.contentDocument.body?.innerText?.slice(0, 15000) || "";
      }
    } catch {
      // Cross-origin, can't access
    }
    return `Lecture: ${material.title} from ${subject.name}, Week ${week.id}`;
  };

  // AI quick actions
  const handleAiAction = async (action: string) => {
    const prompts: Record<string, string> = {
      summarize: "Provide a concise summary of this lecture. Highlight the main topics covered and key conclusions.",
      explain: "Explain the main concepts of this lecture in very simple terms, as if explaining to someone with no background in this field. Use analogies where helpful.",
      key_points: "Extract the key points from this lecture as a bulleted list. Focus on the most important concepts, definitions, formulas, and takeaways.",
    };

    const prompt = prompts[action] || action;
    const userMsg: ChatMessage = { role: "user", content: prompt };
    setChatMessages(prev => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const context = getLectureContent();
      const response = await askGemini(prompt, context, userApiKey);
      setChatMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "⚠️ Failed to get AI response. Please try again." }]);
    }
    setIsAiLoading(false);
  };

  // Free-form chat
  const handleSendChat = async () => {
    if (!chatInput.trim() || isAiLoading) return;

    const userMsg: ChatMessage = { role: "user", content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsAiLoading(true);

    try {
      const context = getLectureContent();
      const response = await askGemini(chatInput, context, userApiKey);
      setChatMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "⚠️ Failed to get AI response. Please try again." }]);
    }
    setIsAiLoading(false);
  };

  return (
    <div className="flex h-screen bg-surface-primary text-text-primary overflow-hidden font-sans">

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 glass rounded-lg">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* LEFT PANEL: Nav Pipeline */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-surface-primary border-r border-gray-200/50 dark:border-white/10 shadow-xl
        transform transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 border-b border-gray-200/50 dark:border-white/10">
          <Link href={`/semester/${semId}/${subject.code.toLowerCase()}`} className="flex items-center gap-2 text-sm text-text-muted hover:text-brand-blue transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to {subject.code}
          </Link>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            {subject.name}
          </h2>
          <p className="text-sm text-text-secondary mt-1">Week {week.id}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-2">Lectures</div>
          {allMaterials.map((m, idx) => (
            <Link
              key={m.id}
              href={`${basePath}/view/${m.id}`}
              onClick={() => setSidebarOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                m.id === material.id
                  ? "bg-brand-blue/10 text-brand-blue shadow-sm border border-brand-blue/20"
                  : "text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${m.id === material.id ? 'bg-brand-blue text-white' : 'bg-gray-200 dark:bg-gray-800'}`}>
                  {idx + 1}
                </span>
                <span className="truncate">{m.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* OVERLAY for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* CENTER PANEL: HTML File Viewer */}
      <div className="flex-1 flex flex-col relative z-0 min-w-0">

        {/* Top Viewer Toolbar */}
        <div className="h-16 glass border-b border-gray-200/50 dark:border-white/10 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4 lg:ml-0 ml-12 truncate">
            <h1 className="font-bold text-text-primary truncate">{material.title}</h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-text-muted border border-gray-200 dark:border-gray-700">
              {material.estimatedMinutes} min
            </span>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <div className="hidden sm:flex items-center bg-black/5 dark:bg-white/5 rounded-lg p-1">
              <button onClick={handleZoomOut} className="p-1.5 rounded hover:bg-white dark:hover:bg-black/50 text-text-secondary transition-colors">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium w-12 text-center text-text-muted">{zoom}%</span>
              <button onClick={handleZoomIn} className="p-1.5 rounded hover:bg-white dark:hover:bg-black/50 text-text-secondary transition-colors">
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <a
              href={`/materials/${material.fileName}`}
              download
              className="p-2 rounded-lg hover:bg-brand-blue/10 hover:text-brand-blue text-text-secondary transition-colors"
              title="Download HTML"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Viewer Area */}
        <div className="flex-1 bg-gray-100 dark:bg-black/50 overflow-auto relative flex justify-center p-4 lg:p-8">
          <div
            className="w-full max-w-5xl bg-white shadow-2xl rounded-xl overflow-hidden transition-transform ease-out duration-200 origin-top"
            style={{
              transform: `scale(${zoom / 100})`,
              minHeight: "100%",
            }}
          >
            <iframe
              ref={iframeRef}
              src={`/materials/${material.fileName}`}
              className="w-full h-full border-0 bg-white"
              title={material.title}
            />
          </div>
        </div>

        {/* Bottom Nav Bar */}
        <div className="h-16 glass border-t border-gray-200/50 dark:border-white/10 flex items-center justify-between px-6 shrink-0">
          {prevMaterial ? (
            <Link href={`${basePath}/view/${prevMaterial.id}`} className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-brand-blue transition-colors">
              <ChevronLeft className="w-4 h-4" /> Prev Lecture
            </Link>
          ) : <div />}

          {nextMaterial ? (
            <Link href={`${basePath}/view/${nextMaterial.id}`} className="flex items-center gap-2 text-sm font-semibold text-brand-blue hover:text-brand-blue/80 transition-colors">
              Next Lecture <ChevronRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </div>
      </div>

      {/* RIGHT PANEL: Notes & AI */}
      <div className="hidden xl:flex w-96 glass-card border-l border-gray-200/50 dark:border-white/10 flex-col relative z-10 shadow-2xl">

        {/* Tabs */}
        <div className="flex p-2 gap-2 border-b border-gray-200/50 dark:border-white/10">
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 flex justify-center py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "notes" ? "bg-brand-blue text-white shadow-md" : "text-text-secondary hover:bg-black/5 dark:hover:bg-white/5"}`}
          >
            <BookOpen className="w-4 h-4 mr-2" /> Notes
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 flex justify-center py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "ai" ? "bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-md" : "text-text-secondary hover:bg-black/5 dark:hover:bg-white/5"}`}
          >
            <Sparkles className="w-4 h-4 mr-2" /> AI Chat
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {activeTab === "notes" ? (
            <div className="p-5 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-text-primary uppercase tracking-wider">My Notes</span>
                <span className={`text-xs px-2 py-1 rounded-full border ${isSaved ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'}`}>
                  {isSaved ? "Saved to browser" : "Unsaved changes"}
                </span>
              </div>

              <textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="Type your notes here... They will be saved automatically to your device per file."
                className="flex-1 w-full bg-surface-secondary border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none shadow-inner"
              />

              <button
                onClick={handleSaveNotes}
                disabled={isSaved}
                className={`mt-4 w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${isSaved ? 'bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500 cursor-not-allowed' : 'btn-primary'}`}
              >
                <Save className="w-4 h-4" /> {isSaved ? "Saved" : "Save Notes"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* AI Header */}
              <div className="p-4">
                <div className="flex items-center gap-3 bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-lg text-white shadow-lg shadow-purple-500/30">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary leading-tight text-sm">AI Assistant</h3>
                    <p className="text-xs text-text-muted">Powered by Gemini</p>
                  </div>
                  {chatMessages.length > 0 && (
                    <button
                      onClick={() => setChatMessages([])}
                      className="ml-auto p-1.5 rounded-lg hover:bg-purple-500/10 text-text-muted hover:text-purple-500 transition-colors"
                      title="Clear chat"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowApiKeySettings(!showApiKeySettings)}
                    className={`${chatMessages.length === 0 ? "ml-auto " : ""}p-1.5 rounded-lg hover:bg-purple-500/10 text-text-muted hover:text-purple-500 transition-colors`}
                    title="API Key Settings"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                </div>

                {/* API Key settings panel */}
                {showApiKeySettings && (
                  <div className="mt-3 flex flex-col gap-2 p-4 bg-surface-secondary/50 border shadow-sm border-purple-500/30 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-fuchsia-500"></div>
                    <p className="text-xs text-text-secondary">
                      Our default API key is shared among all users. Add your own Gemini API key for unlimited personal use.
                    </p>
                    <div className="flex gap-2">
                       <input 
                         type="password" 
                         value={userApiKey} 
                         onChange={(e) => setUserApiKey(e.target.value)}
                         placeholder="Paste your Gemini API Key..."
                         className="flex-1 min-w-0 px-3 py-2 text-sm bg-surface-primary border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                       />
                       <button 
                         onClick={() => {
                           localStorage.setItem('gemini_api_key', userApiKey);
                           setShowApiKeySettings(false);
                         }}
                         className="px-4 py-2 shrink-0 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
                       >
                         Save
                       </button>
                    </div>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-xs text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 font-medium inline-flex items-center gap-1 w-fit">
                      Get your free API key <span>&rarr;</span>
                    </a>
                  </div>
                )}

                {/* Quick actions */}
                {chatMessages.length === 0 && (
                  <div className="grid grid-cols-1 gap-2 mt-3">
                    <button onClick={() => handleAiAction("summarize")} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-surface-secondary hover:border-purple-400 hover:bg-purple-500/5 transition-all text-sm font-medium text-text-secondary hover:text-purple-500 group">
                      Summarize Lecture
                      <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                    <button onClick={() => handleAiAction("explain")} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-surface-secondary hover:border-purple-400 hover:bg-purple-500/5 transition-all text-sm font-medium text-text-secondary hover:text-purple-500 group">
                      Explain like I&apos;m 5
                      <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                    <button onClick={() => handleAiAction("key_points")} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-surface-secondary hover:border-purple-400 hover:bg-purple-500/5 transition-all text-sm font-medium text-text-secondary hover:text-purple-500 group">
                      Extract Key Points
                      <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-4 space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-brand-blue text-white rounded-br-md"
                          : "bg-surface-secondary text-text-primary border border-gray-200 dark:border-white/10 rounded-bl-md"
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-surface-secondary border border-gray-200 dark:border-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                        <span className="animate-pulse">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200/50 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    placeholder="Ask anything about this lecture..."
                    className="flex-1 px-4 py-3 rounded-xl bg-surface-secondary border border-gray-200 dark:border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    disabled={isAiLoading}
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={!chatInput.trim() || isAiLoading}
                    className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
