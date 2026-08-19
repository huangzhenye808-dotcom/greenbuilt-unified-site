import { useEffect } from "react";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import { MicpSimulator3D } from "./MicpSimulator3D";
import "./MicpSimulator3D.css";

export default function Micp3DLab() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "GreenBuilt｜MICP 3D 自癒實驗室";
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="micp3d-page min-h-screen bg-[#0b0d0c] text-[#eef2ec]">
      <header className="micp3d-site-bar">
        <Link to="/" className="micp3d-back-link">
          <ArrowLeft className="h-4 w-4" />
          返回 GreenBuilt 首頁
        </Link>
        <div className="micp3d-site-label">
          <FlaskConical className="h-4 w-4 text-emerald-400" />
          <span>GREENBUILT MICP 3D LAB</span>
        </div>
      </header>
      <MicpSimulator3D />
    </div>
  );
}
