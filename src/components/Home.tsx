import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Shield, HeartPulse, Recycle, Waves, AlertTriangle } from "lucide-react";
import { useScrollHighlight } from "../hooks/useScrollHighlight";
import { motion } from "motion/react";
import AppleInteractiveHealing from "./AppleInteractiveHealing";

export default function Home() {
  const { triggerScroll } = useScrollHighlight();

  const heroStats = [
    { label: "二氧化碳排放量減少", val: "25%", color: "text-emerald-400" },
    { label: "建築使用壽命延長", val: "30%+", color: "text-teal-400" },
    { label: "修繕維護工期與費用降幅", val: "40%", color: "text-emerald-300" }
  ];

  const features = [
    {
      icon: <Recycle className="w-6 h-6 text-emerald-400" />,
      title: "自發性裂痕修復 (Bio-Healing)",
      desc: "配方植入休眠細菌。一旦混凝土因應力或熱脹開裂使水分入侵，細菌即會甦醒，消耗水分並轉化為不溶性碳酸鈣結晶，自主黏合高達 1mm 大小的物理裂縫。"
    },
    {
      icon: <Shield className="w-6 h-6 text-teal-400" />,
      title: "鋼筋全面防鏽與防漏水",
      desc: "裂痕於水分切入點第一時間自動縫合，有效抗滲防漏。阻斷氧氣、二氧化碳及氯離子等極致腐蝕因子滲透，保護鋼筋骨架免於嚴重鏽融，延長結構安全壽命。"
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-emerald-300" />,
      title: "全效無毒綠色永續配方",
      desc: "專利生化自癒細菌完全源於自然界，對人體及生物圈安全無害。施工添加不釋放有害氣味或揮發物，為當代綠色低碳建築體制提供最為關鍵的外加核心。"
    }
  ];

  return (
    <div className="space-y-24 pb-20 bg-[#0d110d] text-[#e0e7e0]">
      
      {/* 1. Hero Spotlight Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-gradient-to-b from-[#0d110d] via-[#151a15] to-[#0d110d]">
        {/* Background grids with organic green accentuation */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#151a15_1px,transparent_1px),linear-gradient(to_bottom,#151a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy (Lg-span 7) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <span className="px-4 py-2 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-wider inline-flex items-center gap-2 uppercase">
              <Leaf className="w-3.5 h-3.5 animate-spin-slow" />
              TU Delft 專利授權・生物科技混凝土自癒時代
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-[#e0e7e0] tracking-tight leading-[1.1]">
              讓台灣建築 <br />
              擁有<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-300 tracking-tighter">「神奇自癒修復」</span>能力
            </h1>
            
            <p className="text-[#e0e7e0]/80 text-sm md:text-base leading-relaxed max-w-2xl font-light">
              綠築 (GreenBuilt Taiwan) 引進荷蘭台夫特理工大學十年研發之專利生化結晶添加劑，藉由獨特「休眠細菌」，讓混凝土能在龜裂瞬間自動密合防漏，全面終結台灣海島型漏水與震損威脅，攜手全球走入低碳永續世代。
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/technology"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-[#0d110d] font-bold px-6 py-4 rounded-xl transition duration-300 shadow-xl flex items-center gap-1.5 text-xs tracking-wider uppercase"
              >
                探索自癒技術原理
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/downloads"
                className="bg-[#151a15] hover:bg-[#151a15]/80 text-[#e0e7e0] border border-emerald-500/20 px-6 py-4 rounded-xl transition font-medium text-xs tracking-wider"
              >
                AI 網頁內容擷取器
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-emerald-500/10 max-w-xl">
              {heroStats.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <span className={`text-2xl sm:text-3xl font-display font-black ${stat.color}`}>
                     {stat.val}
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-[#e0e7e0]/60 select-none tracking-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Hero Banner Card Panel (Lg-span 5) */}
          <div id="lgs-highlight" className="lg:col-span-5 bg-[#151a15] border border-emerald-500/15 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm shadow-2xl space-y-4">
            <div className="h-48 bg-[#090b09] rounded-xl flex items-center justify-center relative overflow-hidden group border border-emerald-500/10">
              {/* Dynamic visual representation of concrete repair */}
              <div className="absolute inset-x-0 top-1/2 h-1 bg-[#151a15] border-dashed border-t border-emerald-500/20 select-none group-hover:bg-emerald-500/20 transition duration-1000" />
              <div className="absolute w-28 h-28 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
              
              {/* Bacteria Micro-Simulation */}
              <div className="absolute left-[3%] top-[10%] text-[8px] font-mono text-emerald-400/60 select-none">
                SYS_STATUS: ONLINE // BIO_READY
              </div>
              <div className="absolute left-[30%] top-[40%] text-[10px] font-mono text-emerald-400 select-none flex items-center gap-1 bg-[#0d110d]/80 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                <span>Basilisk Active</span>
              </div>
              <div className="absolute right-[25%] top-[55%] text-[10px] font-mono text-teal-400 select-none flex items-center gap-1 bg-[#0d110d]/80 px-2 py-0.5 rounded border border-teal-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping inline-block [animation-delay:0.5s]"></span>
                <span>CaCO3 Generating</span>
              </div>

              <div className="z-10 text-center space-y-1.5 p-4 bg-[#090b09]/40 backdrop-blur-[1px] w-full h-full flex flex-col justify-center items-center">
                <p className="text-[10px] font-mono text-emerald-400 tracking-widest">BASILISK BIOTECH SYSTEM</p>
                <h4 className="text-sm font-semibold text-[#e0e7e0] font-display">細菌自動生成石灰石（碳酸鈣）結晶</h4>
                <p className="text-[11px] text-[#e0e7e0]/60">水分子入侵 ➡️ 孢子被激活 ➡️ 微生物生成石灰石 ➡️ 裂縫完整填補</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-[#e0e7e0] font-display flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                荷蘭 Basilisk 生物型自行修復水泥
              </h3>
              <p className="text-xs text-[#e0e7e0]/70 leading-relaxed font-light">
                發源自歐洲 MIT 頂尖學術重鎮——「台夫特理工大學」。其利用能隨混凝土休眠數百年的堅韌芽孢桿菌。只要結構出現 0.05 至 1.0 毫米的裂縫，使氧氣與水分侵入時，孢子便會「自我喚醒」進行礦物化鈣沉澱，由內而外將龜裂口完整封住。
              </p>
            </div>
            
            <div className="pt-3 border-t border-emerald-500/10 flex items-center justify-between text-[11px] text-[#e0e7e0]/60">
              <span className="font-mono">專利認證：歐盟 NEN-EN規範</span>
              <span className="text-emerald-400 hover:underline cursor-pointer flex items-center gap-0.5">
                詳細技術報告 →
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Labs Section styled directly from Apple dynamic specs */}
      <AppleInteractiveHealing />

      {/* 1.5. MICP Biochemical Self-Healing Simulator Entry */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-[#151a15] via-[#101710] to-[#0d110d] p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-mono font-semibold tracking-[0.18em] text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                NEW / MICP SIMULATOR
              </div>
              <h2 className="text-3xl font-display font-extrabold tracking-tight text-[#e0e7e0] sm:text-4xl">
                MICP 生化自癒模擬器
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-[#e0e7e0]/70">
                親自觀察裂縫如何被水分、細菌與 CaCO₃ 結晶逐步封閉。透過互動模擬器探索 MICP 自癒混凝土的六個科學階段。
              </p>
              <Link
                to="/micp-sim"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-xs font-bold tracking-wider text-[#0d110d] shadow-lg transition hover:from-emerald-500 hover:to-teal-500"
              >
                進入 MICP 生化自癒模擬器
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="lg:col-span-5">
              <Link to="/micp-sim" className="group block rounded-2xl border border-emerald-500/15 bg-[#090b09]/80 p-4 transition hover:border-emerald-400/40 hover:bg-[#0b120b]">
                <div className="mb-4 flex items-center justify-between text-[10px] font-mono tracking-widest text-emerald-400/70">
                  <span>MICP-BIOCHEMICAL-SIM.LAB</span>
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />LIVE</span>
                </div>
                <div className="relative h-36 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-700/70 via-slate-900 to-emerald-950/30">
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.25) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                  <div className="absolute left-1/2 top-1/2 h-1 w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-red-500/80 via-cyan-300/90 to-emerald-400/80 shadow-[0_0_18px_rgba(34,211,238,0.45)] transition group-hover:shadow-[0_0_30px_rgba(34,211,238,0.8)]" />
                  <div className="absolute left-[22%] top-[38%] h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse" />
                  <div className="absolute left-[62%] top-[60%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)] animate-pulse [animation-delay:400ms]" />
                  <div className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-black/60 px-2 py-1 text-[9px] font-mono text-neutral-300">裂縫封閉進度 0—100%</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 1.75. Integrated 3D MICP Lab Entry */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#101a18] via-[#0d1513] to-[#0b0d0c] p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-mono font-semibold tracking-[0.18em] text-cyan-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                NEW / 3D RESEARCH LAB
              </div>
              <h2 className="text-3xl font-display font-extrabold tracking-tight text-[#e0e7e0] sm:text-4xl">
                MICP 3D 自癒實驗室
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-[#e0e7e0]/70">
                以 Three.js 將水分傳輸、包埋菌體、活化孢子與 CaCO₃ 晶簇放進同一個可旋轉的微裂縫模型，調整場域、裂縫寬度、含水率與溫度，觀察自癒趨勢如何逐日變化。
              </p>
              <Link
                to="/micp-3d-lab"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-3 text-xs font-bold tracking-wider text-[#07100b] shadow-lg transition hover:from-cyan-300 hover:to-emerald-300"
              >
                開啟 MICP 3D 實驗室
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="lg:col-span-5">
              <Link to="/micp-3d-lab" className="group block rounded-2xl border border-cyan-400/15 bg-[#080c0b]/80 p-4 transition hover:border-cyan-300/40 hover:bg-[#0b1513]">
                <div className="mb-4 flex items-center justify-between text-[10px] font-mono tracking-widest text-cyan-300/80">
                  <span>MICRO-CRACK / 600X</span>
                  <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />INTERACTIVE</span>
                </div>
                <div className="relative h-36 overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_28%_45%,rgba(86,211,131,0.5),transparent_3%),linear-gradient(135deg,#17231e,#090b09)]">
                  <div className="absolute left-[10%] top-1/2 h-[2px] w-[80%] -rotate-12 bg-gradient-to-r from-emerald-400/20 via-cyan-200 to-emerald-400/20 shadow-[0_0_18px_rgba(103,232,249,0.65)]" />
                  <div className="absolute left-[28%] top-[34%] h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse" />
                  <div className="absolute left-[60%] top-[58%] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(103,232,249,0.9)] animate-pulse [animation-delay:400ms]" />
                  <div className="absolute right-3 top-3 rounded-md border border-white/10 bg-black/60 px-2 py-1 text-[9px] font-mono text-neutral-300">CaCO₃ / WATER / SPORES</div>
                  <div className="absolute bottom-3 left-3 rounded-md border border-white/10 bg-black/60 px-2 py-1 text-[9px] font-mono text-neutral-300">旋轉模型・調整參數・開始癒合</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Value Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">OUR STRENGTHS</span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#e0e7e0]">卓越的核心優勢</h2>
          <p className="text-xs sm:text-sm text-[#e0e7e0]/70 max-w-2xl mx-auto font-light">
            Greenbuilt 自癒混凝土為您免除傳統補強所需的二次防漏工程與大量維護碳排放
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="bg-[#151a15] border border-emerald-500/10 p-6 rounded-2xl relative group overflow-hidden transition-all duration-300 hover:border-emerald-500/30 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition" />
              <div className="w-12 h-12 rounded-xl bg-[#090b09] flex items-center justify-center border border-emerald-500/10 mb-5 text-emerald-400">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-[#e0e7e0] font-display group-hover:text-emerald-400 transition pb-2 border-b border-emerald-500/5">
                {feat.title}
              </h3>
              <p className="text-xs text-[#e0e7e0]/70 leading-relaxed mt-3 text-justify font-light text-[13px]">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Taiwan Architecture Reality Check */}
      <section id="taiwan-future" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#151a15] border border-emerald-500/10 rounded-3xl p-8 md:p-12 relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          
          {/* Section left (Lg-span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full w-fit text-xs font-mono">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
              <span>TAIWAN STRUCTURAL RISKS REPORT</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-[#e0e7e0] leading-tight">
              台灣建築的未来：<br className="hidden md:inline" />應對環太平洋地震帶與極端氣候
            </h2>
            
            <div className="space-y-4 text-xs md:text-sm text-[#e0e7e0]/70 leading-relaxed font-light">
              <p>
                台灣位處於強大斷層活動帶，地震頻繁。鋼筋混凝土常因反覆形變與微小沉陷，產生眼睛難以查覺的細微物理裂痕。加之台灣四面環海，高溫炎熱且多雨潮濕。
              </p>
              <p>
                全台屋齡超過 30 年的老屋目前也已正式**超越 50%**。長期微漏水會造成內部鋼筋腐蝕、膨脹、進而剝落拉低整體結構，形成公共安全最大隱憂。綠築生化自癒科技是防止濕氣腐蝕的革命性防護層。
              </p>
            </div>

            <div className="pt-2 flex items-center gap-6">
              <div className="border-l-2 border-emerald-500 pl-4">
                <span className="text-2xl font-display font-black text-[#e0e7e0]">50% +</span>
                <p className="text-[10px] text-[#e0e7e0]/40 font-mono tracking-tight">全台 30 年以上高齡老屋</p>
              </div>
              <div className="border-l-2 border-emerald-500 pl-4">
                <span className="text-2xl font-display font-black text-[#e0e7e0]">1.0 mm</span>
                <p className="text-[10px] text-[#e0e7e0]/40 font-mono tracking-tight">自癒最大裂紋跨度容許值</p>
              </div>
            </div>
          </div>

          {/* Section right (Lg-span 5) */}
          <div className="lg:col-span-5 bg-[#090b09]/80 p-6 rounded-2xl border border-emerald-500/10 space-y-4">
            <h4 className="text-sm font-semibold text-[#e0e7e0] font-display flex items-center gap-2">
              <Waves className="w-4 h-4 text-emerald-400" />
              台灣高危海事與基礎建設應用
            </h4>
            <p className="text-xs text-[#e0e7e0]/70 leading-relaxed font-light">
              除了都市樓宇住宅之外，Basilisk 生物修復添加劑在亞洲與荷蘭已被廣泛應用在：堤壩阻漏、跨海高架水泥墩、地下蓄水站、隧道頂拱防漏。在面對高鹽分海水或高溫高濕衝擊下，自癒混凝土能迅速自癒修復，將後續長期的海事與維護成本下調接近零。
            </p>
            <div className="pt-3 border-t border-emerald-500/10 flex justify-end">
              <Link to="/contact" className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-0.5">
                聯絡綠築專業技術諮詢 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Help CTA Bottom */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-[#e0e7e0]">
          需要工程師與與專人為您介紹嗎？
        </h2>
        <p className="text-xs sm:text-sm text-[#e0e7e0]/60 max-w-lg mx-auto font-light">
          我們的專業工程顧問隨時為您提供詳細的 Basilisk 生物配方設計、材料技術規格諮詢和專案估算！
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-[#0d110d] font-black px-6 py-3 rounded-xl text-xs tracking-wider uppercase shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            立即預約線上會議
          </Link>
          <button
            onClick={() => {
              const el = document.getElementById("co-pilot-toggle");
              if (el) el.click();
            }}
            className="bg-[#151a15] hover:bg-[#151a15]/80 text-emerald-400 border border-emerald-500/20 px-5 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-300"
          >
            呼叫 AI 開啟技術對談
          </button>
        </div>
      </section>

    </div>
  );
}
