import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Leaf, Sparkles, Bot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "首頁", path: "/" },
    { name: "技術原理", path: "/technology" },
    { name: "產品介紹", path: "/products" },
    { name: "工程實績", path: "/projects" },
    { name: "自癒互動實驗室", path: "/lab" },
    { name: "MICP 生化自癒模擬器", path: "/micp-sim" },
    { name: "MICP 3D 實驗室", path: "/micp-3d-lab" },
    { name: "常見問題", path: "/faq" },
    { name: "關於綠築", path: "/about" },
    { name: "自動擷取工具", path: "/downloads" },
    { name: "聯絡我們", path: "/contact" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-45 transition-all duration-300 ${
        scrolled
          ? "bg-[#0d110d]/95 backdrop-blur-md border-b border-emerald-500/10 shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 group whitespace-nowrap">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50 transition">
              <Leaf className="w-5 h-5 animate-pulse" />
            </div>
            <div className="whitespace-nowrap">
              <span className="block whitespace-nowrap font-display text-base font-semibold tracking-wide text-[#e0e7e0] transition group-hover:text-emerald-400">
                GreenBuilt <span className="text-emerald-400">Taiwan</span>
              </span>
              <span className="text-[9px] text-[#e0e7e0]/60 block font-light tracking-[0.2em] -mt-1 uppercase">
                綠築再生科技有限公司
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden min-w-0 flex-1 items-center justify-end gap-1 lg:mx-4 lg:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-semibold tracking-wide transition ${
                    isActive
                      ? "text-emerald-400"
                      : "text-[#e0e7e0]/80 hover:text-[#e0e7e0] hover:bg-[#151a15]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Trigger (AI Quick Start) */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <button
              onClick={() => {
                const el = document.getElementById("co-pilot-toggle");
                if (el) el.click();
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 hover:from-emerald-600/20 hover:to-teal-600/25 text-emerald-400 border border-emerald-500/30 py-2 px-3.5 rounded-xl text-xs font-medium tracking-wider transition shadow-lg shrink-0 cursor-pointer"
            >
              <Bot className="w-4 h-4 animate-bounce" />
              智能提問
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-[#e0e7e0]/70 hover:text-[#e0e7e0] transition"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden bg-[#0d110d] border-b border-emerald-500/10 bg-opacity-98 backdrop-blur-xl px-4 py-6 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  onClick={() => setIsOpen(false)}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition ${
                    isActive
                      ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/30"
                      : "text-[#e0e7e0]/80 hover:text-[#e0e7e0] hover:bg-[#151a15]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-emerald-500/10">
              <button
                onClick={() => {
                  setIsOpen(false);
                  const el = document.getElementById("co-pilot-toggle");
                  if (el) el.click();
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-[#0d110d] font-bold py-3 rounded-xl text-xs font-semibold tracking-wider transition"
              >
                <Bot className="w-4 h-4" />
                呼叫 AI 智能助教
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
