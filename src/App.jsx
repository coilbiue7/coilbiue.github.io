import React, { useEffect, useState } from 'react';
import { Mail, Compass, Cpu, MessageSquare, Terminal, Layout, ArrowRight, ChevronRight } from 'lucide-react';

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const styleSheet = `
    :root {
      --apple-blue: #2997ff;
      --apple-gray: #86868b;
      --apple-bg: #000000;
      --apple-text: #f5f5f7;
    }
    
    body { 
      margin: 0; 
      background-color: var(--apple-bg); 
      color: var(--apple-text);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* 左侧真实闪电特效 */
    @keyframes lightning-strike {
      0% { opacity: 0; }
      1% { opacity: 1; filter: drop-shadow(0 0 20px rgba(150, 220, 255, 0.8)); }
      2% { opacity: 0; }
      3% { opacity: 0.5; }
      4% { opacity: 0; }
      40% { opacity: 0; }
      41% { opacity: 0.8; filter: drop-shadow(0 0 30px rgba(200, 240, 255, 1)); }
      42% { opacity: 0; }
      100% { opacity: 0; }
    }
    @keyframes lightning-glow {
      0%, 100% { opacity: 0; }
      1%, 3%, 41% { opacity: 0.6; }
      2%, 4%, 42% { opacity: 0; }
    }
    .lightning-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 40vw;
      height: 100vh;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }
    .lightning-glow-bg {
      position: absolute;
      top: 0;
      left: -20%;
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse at left, rgba(120, 200, 255, 0.15) 0%, transparent 60%);
      animation: lightning-glow 7s infinite;
      mix-blend-mode: screen;
    }
    .lightning-bolt {
      position: absolute;
      top: -10%;
      left: 5%;
      width: 2px;
      height: 120%;
      background: #fff;
      box-shadow: 0 0 15px 5px rgba(150, 220, 255, 0.6);
      clip-path: polygon(0% 0%, 100% 0%, 80% 20%, 100% 20%, 60% 40%, 80% 40%, 40% 60%, 60% 60%, 20% 80%, 40% 80%, 0% 100%, 20% 100%);
      animation: lightning-strike 7s infinite;
      transform-origin: top;
      opacity: 0;
    }
    .lightning-bolt:nth-child(2) {
      left: 15%;
      clip-path: polygon(20% 0%, 100% 0%, 50% 30%, 80% 30%, 30% 60%, 60% 60%, 0% 100%, 30% 100%);
      animation: lightning-strike 11s infinite 2s;
      width: 1px;
    }

    /* 右侧暗物质蠕动特效 */
    @keyframes dark-matter-morph {
      0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(0deg) scale(1); }
      34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; transform: rotate(120deg) scale(1.05); }
      67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; transform: rotate(240deg) scale(0.95); }
      100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(360deg) scale(1); }
    }
    .dark-matter-container {
      position: fixed;
      top: 0;
      right: 0;
      width: 50vw;
      height: 100vh;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
      filter: blur(80px);
    }
    .dark-matter-core {
      position: absolute;
      top: 20%;
      right: -10%;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(20, 0, 40, 0.9) 0%, rgba(5, 0, 15, 0.8) 40%, transparent 70%);
      animation: dark-matter-morph 20s linear infinite;
      transform-origin: center;
      mix-blend-mode: hard-light;
    }
    .dark-matter-pulse {
      position: absolute;
      top: 40%;
      right: 10%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(40, 0, 60, 0.7) 0%, transparent 60%);
      animation: dark-matter-morph 15s linear infinite reverse;
      transform-origin: center;
    }

    /* 苹果风格 UI 组件 */
    .apple-glass {
      background: rgba(28, 28, 30, 0.5);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    }
    .apple-glass:hover {
      background: rgba(44, 44, 46, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.15);
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    
    .apple-button {
      background: var(--apple-text);
      color: var(--apple-bg);
      border-radius: 980px;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.01em;
      padding: 12px 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .apple-button:hover {
      transform: scale(1.02);
      background: #ffffff;
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
    }
    
    .apple-button-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: var(--apple-text);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .apple-button-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
    }

    .apple-title {
      font-weight: 700;
      letter-spacing: -0.04em;
      line-height: 1.05;
    }
    
    .apple-gradient-text {
      background: linear-gradient(180deg, #fff 0%, #86868b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .fade-in-up {
      opacity: 0;
      animation: fadeInUp 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* 自定义光标跟随高亮 */
    .glow-effect {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1;
      background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.03), transparent 40%);
    }
  `;

  return (
    <div 
      className="relative min-h-screen bg-black overflow-hidden flex flex-col font-sans text-[#f5f5f7] selection:bg-[#2997ff]/30 selection:text-white"
      style={{ '--mouse-x': `${mousePos.x}px`, '--mouse-y': `${mousePos.y}px` }}
    >
      <style>{styleSheet}</style>

      {/* 动态背景层 */}
      <div className="fixed inset-0 z-0">
        <div className="lightning-container">
          <div className="lightning-glow-bg" />
          <div className="lightning-bolt" />
          <div className="lightning-bolt" />
        </div>
        
        <div className="dark-matter-container">
          <div className="dark-matter-core" />
          <div className="dark-matter-pulse" />
        </div>
        
        {/* 暗色遮罩，保证文字可读性 */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>
      
      {/* 光标发光特效 */}
      <div className="glow-effect hidden md:block" />

      {/* 导航栏 (仿 Apple) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between text-xs font-medium tracking-wide text-gray-300">
          <div className="text-white font-semibold text-lg tracking-tight">Forky</div>
          <div className="hidden md:flex gap-8">
            <a href="#philosophy" className="hover:text-white transition-colors">Philosophy</a>
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#works" className="hover:text-white transition-colors">Works</a>
          </div>
          <a href="mailto:coilbiue@163.com" className="hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      {/* 内容层 */}
      <div className="relative z-10 flex flex-col flex-1 max-w-6xl mx-auto w-full px-6 pt-32 pb-24 md:px-12">
        
        <main className="flex-1 flex flex-col gap-40">
          
          {/* Hero 区域 */}
          <section className="flex flex-col items-center text-center fade-in-up mt-10 md:mt-20" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold tracking-widest text-[#86868b] uppercase border border-white/10 backdrop-blur-md">
                大三学生
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold tracking-widest text-[#86868b] uppercase border border-white/10 backdrop-blur-md">
                准 AI 训练师
              </span>
            </div>
            
            <h1 className="apple-title text-6xl md:text-[100px] mb-6">
              Forky.
            </h1>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#86868b] mb-12 max-w-3xl leading-tight">
              深度剖析 <br className="md:hidden" />
              <span className="text-white">AI 行业的每一次进化。</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-20">
              <a href="#philosophy" className="apple-button gap-2">
                了解更多 <ChevronRight size={16} />
              </a>
              <a href="mailto:coilbiue@163.com" className="apple-button apple-button-secondary gap-2">
                联系我 <Mail size={16} />
              </a>
            </div>
          </section>

          {/* 个人理念 */}
          <section id="philosophy" className="fade-in-up scroll-mt-24" style={{ animationDelay: '0.2s' }}>
            <div className="max-w-4xl mx-auto apple-glass p-10 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2997ff] to-transparent opacity-50"></div>
              <h3 className="text-sm font-bold text-[#86868b] uppercase tracking-[0.2em] mb-8 flex items-center justify-center gap-2">
                <Compass size={18} /> 个人理念 | Philosophy
              </h3>
              <blockquote className="text-2xl md:text-4xl font-semibold text-white mb-10 leading-tight text-center tracking-tight apple-gradient-text">
                “保持对前沿的敏锐，在沟通与碰撞中，深度剖析 AI 行业的每一次进化。”
              </blockquote>
              <p className="text-[#86868b] leading-relaxed text-lg md:text-xl font-medium text-center max-w-3xl mx-auto">
                我相信好的 AI 工具是靠<span className="text-white">“调教”</span>和<span className="text-white">“设计流程”</span>打磨出来的，而不只是模型本身。我致力于探索如何通过更优的人机交互逻辑，释放大语言模型的生产力潜能。
              </p>
            </div>
          </section>

          {/* 核心能力区域 */}
          <section id="capabilities" className="fade-in-up scroll-mt-24" style={{ animationDelay: '0.3s' }}>
            <div className="text-center mb-16">
              <h2 className="apple-title text-4xl md:text-6xl mb-4">核心能力.</h2>
              <p className="text-xl md:text-2xl font-medium text-[#86868b]">Core Capabilities</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="apple-glass p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#2997ff]/20 to-transparent flex items-center justify-center mb-8 text-[#2997ff] border border-[#2997ff]/20">
                  <Layout size={28} />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">AI 工作流设计</h3>
                <p className="text-[#86868b] text-base leading-relaxed font-medium">
                  跳出传统的检索增强生成（RAG）框架，擅长将 AI 的交互与思考过程转化为 Markdown 日志，为模型搭建高效、长期的“个人记忆库”。
                </p>
              </div>

              <div className="apple-glass p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#bf5af2]/20 to-transparent flex items-center justify-center mb-8 text-[#bf5af2] border border-[#bf5af2]/20">
                  <MessageSquare size={28} />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">人机交互调优</h3>
                <p className="text-[#86868b] text-base leading-relaxed font-medium">
                  熟练运用「需求反问」模式。在处理模糊需求时，引导 AI 主动通过提问来澄清意图，从源头降低 80% 的无效返工。
                </p>
              </div>

              <div className="apple-glass p-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#30d158]/20 to-transparent flex items-center justify-center mb-8 text-[#30d158] border border-[#30d158]/20">
                  <Terminal size={28} />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">深度提示词工程</h3>
                <p className="text-[#86868b] text-base leading-relaxed font-medium">
                  不局限于基础指令，将「约束条件」视为 Prompt 设计的灵魂。通过构建严密的逻辑边界，精准掌控 AI 的输出质量与风格。
                </p>
              </div>
            </div>
          </section>

          {/* 代表作品与观察区域 */}
          <section id="works" className="fade-in-up scroll-mt-24" style={{ animationDelay: '0.4s' }}>
            <div className="apple-glass p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 z-10">
                <h2 className="apple-title text-4xl md:text-5xl mb-4">代表作品与观察.</h2>
                <p className="text-xl font-medium text-[#86868b] mb-10">Insights & Works</p>
                
                <div className="space-y-6">
                  <div className="bg-black/30 rounded-2xl p-6 border border-white/5">
                    <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
                      AI 调教笔记
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-white/10 text-[#86868b] uppercase">小红书 / 博客</span>
                    </h3>
                    <ul className="mt-4 space-y-4 text-[#86868b] font-medium text-base">
                      <li className="flex items-start gap-3">
                        <ArrowRight size={18} className="text-[#2997ff] shrink-0 mt-0.5" />
                        <span>深度解析 AI 工作流中的小技巧：从文档的 AI 友好度优化到需求澄清策略。</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight size={18} className="text-[#2997ff] shrink-0 mt-0.5" />
                        <span>剖析行业前沿分享（如潘凯等专家的实操经验），并将其转化为可落地的 Prompt 模板与流程设计。</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex justify-center z-10">
                <div className="w-48 h-48 md:w-64 md:h-64 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#2997ff] to-[#bf5af2] rounded-full blur-[60px] opacity-30"></div>
                  <Cpu className="w-full h-full text-white/10 drop-shadow-2xl" />
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* 页脚联系方式区域 */}
        <footer className="mt-40 text-center pb-12 pt-20 border-t border-white/10 fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="apple-title text-3xl md:text-5xl mb-6">随时联系，共同探索。</h2>
          <p className="text-[#86868b] max-w-2xl mx-auto mb-12 font-medium text-lg md:text-xl">
            如果你也对 AI 调教、工作流优化感兴趣，或者想一起碰撞关于 AI 行业的最新思考，欢迎随时联系。
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="mailto:coilbiue@163.com" className="apple-button gap-2 px-8 py-4 text-base">
              <Mail size={18} /> coilbiue@163.com
            </a>
            <a href="#" className="apple-button apple-button-secondary gap-2 px-8 py-4 text-base">
              小红书: Forky <ArrowRight size={18} />
            </a>
          </div>
          
          <div className="mt-24 text-sm text-[#86868b] font-medium">
            &copy; {new Date().getFullYear()} Forky. All rights reserved.
          </div>
        </footer>

      </div>
    </div>
  );
}