import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Technology from "./components/Technology";
import Products from "./components/Products";
import Projects from "./components/Projects";
import FAQ from "./components/FAQ";
import About from "./components/About";
import Downloads from "./components/Downloads";
import Lab from "./components/InteractiveLab";
import MicpSimulator from "./components/MicpSimulator";
import Micp3DLab from "./components/Micp3DLab";
import Contact from "./components/Contact";
import Copilot from "./components/Copilot";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();

  // Keep the original gesture-based lab and expose the new MICP simulator separately.
  if (location.pathname === "/lab") {
    return <Lab />;
  }
  if (location.pathname === "/micp-sim") {
    return <MicpSimulator />;
  }
  if (location.pathname === "/micp-3d-lab") {
    return <Micp3DLab />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/products" element={<Products />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Copilot />
      <Footer />
    </div>
  );
}
