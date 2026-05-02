import React from 'react';
import { Mail, GraduationCap, Bot, Terminal, MessageSquare, Cpu } from 'lucide-react';

export default function App() {
  const posterImg = "/poster.jpg";

  const styleSheet = `
    body { margin: 0; background-color: black; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; }
    @keyframes lightning-flash {
      0%, 9%, 11%, 19%, 21%, 100% { opacity: 0; filter: brightness(1); }
      10% { opacity: 0.8; filter: brightness(1.5); background: rgba(200, 240, 255, 0.2); }
      20% { opacity: 1; filter: brightness(2); background: rgba(255, 255, 255, 0.4); }
      22% { opacity: 0; }
      80% { opacity: 0.5; filter: brightness(1.2); }
      81% { opacity: 0; }
    }
    @keyframes dark-matter-writhing {
      0% { opacity: 0.4; transform: scale(1) translate(0, 0); }
      50% { opacity: 0.8; transform: scale(1.05) translate(-2%, 2%); }
      100% { opacity: 0.95; transform: scale(1.1) translate(2%, -2%); }
    }
  `;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      <style>{styleSheet}</style>

      {/* 1. 全屏海报 */}
      <img
        src={posterImg}
        alt="全屏海报背景"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />

      {/* 2. 左侧闪电特效 */}
      <div 
        className="absolute top-0 left-0 w-1/2 h-full z-10 pointer-events-none mix-blend-screen"
        style={{ background: 'linear-gradient(90deg, rgba(150, 220, 255, 0.1) 0%, transparent 80%)', animation: 'lightning-flash 5s infinite' }}
      />

      {/* 3. 右侧暗物质特效 */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-full z-10 pointer-events-none mix-blend-multiply"
        style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(60, 0, 0, 0.6) 0%, rgba(10, 0, 0, 0.9) 60%, black 100%)', animation: 'dark-matter-writhing 6s ease-in-out infinite alternate' }}
      />

      {/* 4. 底部渐变暗黑遮罩 */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

      {/* 5. 前景 UI 层 */}
      <div className="absolute inset-0 z-30 flex flex-col h-full">
        <nav className="flex justify-between items-center px-6 md:px-16 py-8">
          <div className="text-2xl font-bold tracking-widest drop-shadow-lg">FORKY.</div>
          <a href="mailto:coilbiue@163.com" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full text-sm transition-colors border border-white/10">
            <Mail size={16} /> Contact
          </a>
        </nav>

        <main className="flex-1 flex flex-col lg:flex-row items-start lg:items-end px-6 md:px-16 pb-12 md:pb-20 gap-10 lg:gap-16">
          <div className="flex-1 max-w-2xl">
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex items-center gap-2 bg-black/60 border border-blue-500/30 px-3 py-1.5 rounded-full backdrop-blur-md text-blue-400 text-sm font-medium"><GraduationCap size={16} /> 大三学生</div>
              <div className="flex items-center gap-2 bg-black/60 border border-red-500/30 px-3 py-1.5 rounded-full backdrop-blur-md text-red-400 text-sm font-medium"><Bot size={16} /> 准 AI 训练师</div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">深度剖析 AI 行业的 <br className="hidden md:block" /> 每一次进化。</h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl leading-relaxed drop-shadow-md">“保持对前沿的敏锐，在沟通与碰撞中，释放大语言模型的生产力潜能。” 我相信好的 AI 工具是靠精细的调教打磨出来的。</p>
          </div>

          <div className="w-full lg:w-[450px] shrink-0">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h3 className="text-sm font-semibold text-gray-300 uppercase mb-6 border-b border-red-500/50 pb-2">核心能力</h3>
              <div className="flex flex-col gap-6">
                <div><h4 className="text-white font-medium mb-1.5 flex items-center gap-2 text-lg"><Terminal size={18} className="text-blue-400" /> AI 工作流设计</h4><p className="text-sm text-gray-300 pl-6">跳出传统 RAG 框架，搭建高效记忆库。</p></div>
                <div><h4 className="text-white font-medium mb-1.5 flex items-center gap-2 text-lg"><MessageSquare size={18} className="text-red-400" /> 人机交互调优</h4><p className="text-sm text-gray-300 pl-6">熟练运用「需求反问」模式，降低无效返工。</p></div>
                <div><h4 className="text-white font-medium mb-1.5 flex items-center gap-2 text-lg"><Cpu size={18} className="text-purple-400" /> 深度提示词工程</h4><p className="text-sm text-gray-300 pl-6">将「约束条件」视为 Prompt 的灵魂，精准掌控输出。</p></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}