import React from 'react';
import { Mail, Compass, Cpu, MessageSquare, Terminal, Layout } from 'lucide-react';

export default function App() {
  const styleSheet = `
    body { 
      margin: 0; 
      background-color: #000; 
      color: #f5f5f7;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
      overflow-x: hidden;
    }
    
    /* 左侧闪电特效 */
    @keyframes lightning-flash {
      0%, 9%, 11%, 19%, 21%, 100% { opacity: 0; filter: brightness(1); }
      10% { opacity: 0.8; filter: brightness(1.5); background: rgba(200, 240, 255, 0.15); }
      20% { opacity: 1; filter: brightness(2); background: rgba(255, 255, 255, 0.3); }
      22% { opacity: 0; }
      80% { opacity: 0.5; filter: brightness(1.2); }
      81% { opacity: 0; }
    }
    .lightning-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, rgba(150, 220, 255, 0.1) 0%, transparent 80%);
      animation: lightning-flash 6s infinite;
      pointer-events: none;
      mix-blend-mode: screen;
      z-index: 0;
    }

    /* 右侧暗物质蠕动特效 */
    @keyframes dark-matter-blob {
      0% { transform: scale(1) translate(0, 0) rotate(0deg); border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
      33% { transform: scale(1.1) translate(-2%, 2%) rotate(10deg); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      66% { transform: scale(0.9) translate(2%, -2%) rotate(-5deg); border-radius: 50% 60% 40% 60% / 40% 60% 40% 60%; }
      100% { transform: scale(1) translate(0, 0) rotate(0deg); border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
    }
    .dark-matter-container {
      position: absolute;
      top: -10%;
      right: -10%;
      width: 60%;
      height: 120%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
      filter: blur(60px);
      opacity: 0.8;
    }
    .dark-matter-blob-1 {
      position: absolute;
      top: 20%;
      right: 10%;
      width: 80%;
      height: 80%;
      background: radial-gradient(circle at center, rgba(30, 0, 50, 0.8), rgba(0, 0, 0, 0.9));
      animation: dark-matter-blob 15s ease-in-out infinite;
      mix-blend-mode: multiply;
    }
    .dark-matter-blob-2 {
      position: absolute;
      top: 40%;
      right: 30%;
      width: 60%;
      height: 60%;
      background: radial-gradient(circle at center, rgba(60, 0, 20, 0.6), rgba(10, 10, 10, 0.8));
      animation: dark-matter-blob 12s ease-in-out infinite reverse;
      mix-blend-mode: multiply;
    }

    /* 苹果风格 UI 组件 */
    .glass-panel {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    .glass-button {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 9999px;
      transition: all 0.3s ease;
    }
    .glass-button:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.02);
    }
    
    .text-gradient {
      background: linear-gradient(135deg, #fff 0%, #a5a5aa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .fade-in-up {
      animation: fadeInUp 1s ease-out forwards;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col font-sans text-gray-100 selection:bg-blue-500/30 selection:text-white">
      <style>{styleSheet}</style>

      {/* 动态背景层 */}
      <div className="fixed inset-0 z-0">
        <div className="lightning-bg" />
        <div className="dark-matter-container">
          <div className="dark-matter-blob-1" />
          <div className="dark-matter-blob-2" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black pointer-events-none" />
      </div>

      {/* 内容层 */}
      <div className="relative z-10 flex flex-col flex-1 max-w-6xl mx-auto w-full px-6 py-12 md:px-12 md:py-20">
        
        {/* 顶部导航 */}
        <header className="flex justify-between items-center mb-24 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-2xl font-bold tracking-tight text-white drop-shadow-lg">Forky.</div>
          <a href="mailto:coilbiue@163.com" className="glass-button px-5 py-2 text-sm font-medium flex items-center gap-2 text-white shadow-lg">
            <Mail size={16} /> 联系我
          </a>
        </header>

        <main className="flex-1 flex flex-col gap-32">
          
          {/* Hero 区域：头衔与个人理念 */}
          <section className="flex flex-col md:flex-row gap-16 items-center fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex-1">
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-medium tracking-wider text-gray-300 uppercase border border-white/10 backdrop-blur-md shadow-sm">
                  大三学生
                </span>
                <span className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-medium tracking-wider text-gray-300 uppercase border border-white/10 backdrop-blur-md shadow-sm">
                  准 AI 训练师
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-10 leading-[1.15]">
                <span className="text-gradient">深度剖析</span> <br />
                AI 行业的每一次进化。
              </h1>
              
              <div className="glass-panel p-8 md:p-10 max-w-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors duration-500"></div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Compass size={16} /> 个人理念 | Philosophy
                </h3>
                <blockquote className="text-xl font-medium text-white mb-6 leading-relaxed">
                  “保持对前沿的敏锐，在沟通与碰撞中，深度剖析 AI 行业的每一次进化。”
                </blockquote>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                  我相信好的 AI 工具是靠“调教”和“设计流程”打磨出来的，而不只是模型本身。我致力于探索如何通过更优的人机交互逻辑，释放大语言模型的生产力潜能。
                </p>
              </div>
            </div>
          </section>

          {/* 核心能力区域 */}
          <section className="fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center md:text-left text-white tracking-tight">
              核心能力 <span className="text-gray-500 font-normal ml-2 tracking-normal text-2xl md:text-4xl">Core Capabilities</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="glass-panel p-8 hover:bg-white/5 transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 transition-transform duration-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <Layout size={26} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">AI 工作流设计</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  跳出传统的检索增强生成（RAG）框架，擅长将 AI 的交互与思考过程转化为 Markdown 日志，为模型搭建高效、长期的“个人记忆库”。
                </p>
              </div>

              <div className="glass-panel p-8 hover:bg-white/5 transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 text-purple-400 group-hover:scale-110 transition-transform duration-500 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  <MessageSquare size={26} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">人机交互调优</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  熟练运用「需求反问」模式。在处理模糊需求时，引导 AI 主动通过提问来澄清意图，从源头降低 80% 的无效返工。
                </p>
              </div>

              <div className="glass-panel p-8 hover:bg-white/5 transition-all duration-300 group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 text-emerald-400 group-hover:scale-110 transition-transform duration-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <Terminal size={26} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">深度提示词工程</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  不局限于基础指令，将「约束条件」视为 Prompt 设计的灵魂。通过构建严密的逻辑边界，精准掌控 AI 的输出质量与风格。
                </p>
              </div>
            </div>
          </section>

          {/* 代表作品与观察区域 */}
          <section className="glass-panel p-8 md:p-14 relative overflow-hidden fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="absolute -right-20 -bottom-20 opacity-[0.03] pointer-events-none transform rotate-12">
              <Cpu size={400} />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-12 text-white tracking-tight">
                代表作品与观察 <span className="text-gray-500 font-normal ml-2 tracking-normal text-2xl md:text-4xl">Insights & Works</span>
              </h2>
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                  <div className="pl-8 py-2">
                    <h3 className="text-2xl font-semibold text-white mb-6 flex items-baseline gap-3">
                      AI 调教笔记
                      <span className="text-sm font-normal text-gray-500 tracking-wide uppercase">(小红书 / 个人博客)</span>
                    </h3>
                    <ul className="space-y-5 text-gray-400 list-none font-medium text-base">
                      <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-white/40 before:rounded-full hover:text-gray-300 transition-colors">
                        深度解析 AI 工作流中的小技巧：从文档的 AI 友好度优化到需求澄清策略。
                      </li>
                      <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-white/40 before:rounded-full hover:text-gray-300 transition-colors">
                        剖析行业前沿分享（如潘凯等专家的实操经验），并将其转化为可落地的 Prompt 模板与流程设计。
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* 页脚联系方式区域 */}
        <footer className="mt-32 text-center pb-12 pt-20 border-t border-white/10 fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">随时联系，共同探索</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            如果你也对 AI 调教、工作流优化感兴趣，或者想一起碰撞关于 AI 行业的最新思考，欢迎随时联系。
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a href="mailto:coilbiue@163.com" className="glass-button px-8 py-4 flex items-center gap-3 text-white hover:text-blue-400 transition-all font-medium text-lg">
              <Mail size={22} /> coilbiue@163.com
            </a>
            <a href="#" className="glass-button px-8 py-4 flex items-center gap-3 text-white hover:text-red-400 transition-all font-medium text-lg">
              <span className="font-bold text-xl leading-none">小红书</span> Forky
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}