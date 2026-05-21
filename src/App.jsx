import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  Compass,
  Layout,
  LoaderCircle,
  Mail,
  MessageSquare,
  SendHorizonal,
  Sparkles,
  Terminal,
} from 'lucide-react';

const signaturePills = ['需求反问', '上下文压缩', '约束编排', '记忆沉淀'];

const suggestedPrompts = [
  '你会怎么把模糊需求问清楚？',
  '用三句话介绍 Forky',
  '怎么一起做一个 AI 项目？',
];

const perspectives = [
  {
    category: 'PHILOSOPHY',
    title: '好用的 AI 不是更会答，而是更会协作。',
    description:
      '我更关注 AI 如何被提问、被约束、被记录，而不是单纯追逐模型参数和一次性输出。',
    tone: 'tone-yellow',
  },
  {
    category: 'SIGNAL',
    title: 'Prompt 只是入口，流程和记忆才是系统。',
    description:
      '我把 Prompt 设计、上下文治理和日志沉淀看作同一件事，它们共同决定 AI 是否真的能用。',
    tone: 'tone-blue',
  },
  {
    category: 'OUTPUT',
    title: '持续输出 AI 调教笔记与行业观察。',
    description:
      '围绕工作流优化、需求澄清、提示词约束和个人记忆库，持续形成对外可传播的方法论内容。',
    tone: 'tone-pink',
  },
];

const capabilities = [
  {
    title: 'AI 工作流设计',
    subtitle: 'Workflow',
    icon: Layout,
    description:
      '把 AI 交互过程转成可沉淀、可追踪、可迭代的 Markdown 资产，而不是一次性的问答记录。',
    tone: 'tone-teal',
  },
  {
    title: '人机交互调优',
    subtitle: 'Interaction',
    icon: MessageSquare,
    description:
      '通过需求反问、边界澄清和上下文压缩，让模型先理解问题，再进入生成流程。',
    tone: 'tone-yellow',
  },
  {
    title: '深度提示词工程',
    subtitle: 'Prompting',
    icon: Terminal,
    description:
      '把角色、限制、输出结构和口径要求写成系统约束，稳定模型表达与风格。',
    tone: 'tone-green',
  },
];

const trainingLoop = [
  {
    step: '01',
    title: '拆需求',
    detail: '把模糊问题拆成目标、边界、变量和风险，先定义问题，再组织回答。',
  },
  {
    step: '02',
    title: '设约束',
    detail: '把角色、语气、格式、禁用项与输出结构提前写进系统边界里。',
  },
  {
    step: '03',
    title: '留记忆',
    detail: '把对话、偏好和决策过程沉淀成 Markdown 日志，持续训练个人 AI 记忆库。',
  },
  {
    step: '04',
    title: '迭代回路',
    detail: '根据结果反向修 Prompt、修流程、修交互，让模型一步步贴近真实工作方式。',
  },
];

const works = [
  {
    label: 'AI 调教笔记',
    type: '小红书 / 博客',
    summary: '把 AI 工作流中的高频动作拆成可复用技巧，从文档优化到需求澄清都做成内容输出。',
    tone: 'tone-orange',
  },
  {
    label: '前沿分享拆解',
    type: '行业观察',
    summary: '把行业专家经验、案例与趋势判断转成自己可执行的 Prompt 模板和流程框架。',
    tone: 'tone-blue',
  },
  {
    label: '个人记忆库实践',
    type: '方法论',
    summary: '让模型上下文、用户偏好和操作轨迹都有据可循，形成长期演进的 AI 协作系统。',
    tone: 'tone-green',
  },
  {
    label: '需求反问框架',
    type: '交互设计',
    summary: '通过反问收窄问题空间，减少无效返工，让 AI 从源头就进入正确的任务轨道。',
    tone: 'tone-pink',
  },
];

const brandManifesto = [
  '训练 AI 的协作方式，而不只是写 Prompt。',
  '把流程设计、约束逻辑和记忆沉淀整合成一套可持续的方法。',
  '让个人品牌不只是一段介绍，而是一个有输出、有方法、有辨识度的 AI 训练者形象。',
];

const initialMessages = [
  {
    role: 'assistant',
    content:
      '喵，你好。我是 Forky 的小猫咪助手，想聊 AI 调教、工作流设计、合作方式，直接问我就行。',
  },
];

const systemPrompt = [
  '你是 Forky 个人网站上的 AI 助手。',
  'Forky 是大三学生 / 准 AI 训练师，关注 AI 调教、工作流优化、人机交互调优、需求澄清和记忆沉淀。',
  '回答风格要简洁、专业、友好，尽量贴合个人品牌表达。',
  '如果用户询问合作方式、能力范围或研究方向，要优先从 AI 工作流设计、人机交互调优、深度提示词工程、AI 调教笔记几个维度来回答。',
].join(' ');

async function readErrorMessage(response) {
  const text = await response.text();

  try {
    const data = JSON.parse(text);
    return data.error || data.message || '聊天请求失败';
  } catch {
    return text || '聊天请求失败';
  }
}

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const [chatSessionId, setChatSessionId] = useState('');
  const [chatTransport, setChatTransport] = useState('idle');
  const chatMessagesRef = useRef(null);

  const dashscopeApiKey = import.meta.env.VITE_DASHSCOPE_API_KEY || '';
  const dashscopeBaseUrl =
    (import.meta.env.VITE_DASHSCOPE_BASE_URL ||
      'https://dashscope.aliyuncs.com/compatible-mode/v1').replace(/\/$/, '');
  const dashscopeModel = import.meta.env.VITE_DASHSCOPE_MODEL || 'qwen-plus';

  useEffect(() => {
    if (!chatMessagesRef.current) {
      return;
    }

    chatMessagesRef.current.scrollTo({
      top: chatMessagesRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isSending]);

  const resetConversation = () => {
    setMessages(initialMessages);
    setInputValue('');
    setChatError('');
    setChatSessionId('');
    setChatTransport('idle');
  };

  const callDirectDashScope = async (chatMessages) => {
    if (!dashscopeApiKey) {
      throw new Error(
        '本地未配置阿里云 API Key。请设置 `VITE_DASHSCOPE_API_KEY`，或部署到 Vercel 后使用服务端代理。',
      );
    }

    const response = await fetch(`${dashscopeBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${dashscopeApiKey}`,
      },
      body: JSON.stringify({
        model: dashscopeModel,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...chatMessages,
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error('阿里云返回内容为空，请检查模型配置。');
    }

    return {
      reply,
      mode: 'direct',
      sessionId: '',
    };
  };

  const callChatbot = async (chatMessages, sessionId) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: chatMessages,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      const data = await response.json();
      if (!data.reply) {
        throw new Error('聊天接口没有返回有效内容。');
      }

      return {
        reply: data.reply,
        mode: data.mode || 'server',
        sessionId: data.sessionId || '',
      };
    } catch (error) {
      if (!dashscopeApiKey) {
        throw error;
      }

      return callDirectDashScope(chatMessages);
    }
  };

  const sendMessage = async (content) => {
    const trimmed = content.trim();
    if (!trimmed || isSending) {
      return;
    }

    const nextMessages = [
      ...messages,
      {
        role: 'user',
        content: trimmed,
      },
    ];

    setMessages(nextMessages);
    setInputValue('');
    setChatError('');
    setIsSending(true);

    try {
      const result = await callChatbot(
        nextMessages.map(({ role, content: itemContent }) => ({
          role,
          content: itemContent,
        })),
        chatSessionId,
      );

      setChatSessionId(result.sessionId || '');
      setChatTransport(result.mode || 'server');

      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: result.reply,
        },
      ]);
    } catch (error) {
      setChatError(
        error instanceof Error ? error.message : '聊天请求失败，请稍后再试。',
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(inputValue);
  };

  const handleInputKeyDown = async (event) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    await sendMessage(inputValue);
  };

  const transportLabelMap = {
    idle: '等待连接',
    catbot: '小猫咪',
    app: '百炼应用',
    model: '模型代理',
    direct: '本地直连',
    server: '服务端代理',
  };

  const styleSheet = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;700;800&display=swap');

    :root {
      --page-green: #7dc395;
      --page-green-dark: #69b483;
      --paper: #f8f8f0;
      --paper-warm: rgb(247, 243, 223);
      --text-primary: #794f27;
      --text-body: #725d42;
      --text-muted: #9f927d;
      --line: #9f927d;
      --line-soft: #cdbfa8;
      --shadow-btn: #bdaea0;
      --shadow-input: #d4c9b4;
      --mint: #19c8b9;
      --focus-yellow: #ffcc00;
      --tone-pink: #f8a6b2;
      --tone-blue: #889df0;
      --tone-yellow: #f7cd67;
      --tone-orange: #e59266;
      --tone-teal: #82d5bb;
      --tone-green: #8ac68a;
    }

    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      background: var(--page-green);
      color: var(--text-body);
      font-family: Nunito, 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    button,
    input {
      font: inherit;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    .page-shell {
      position: relative;
      min-height: 100vh;
      overflow: hidden;
      background:
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.34), transparent 28%),
        linear-gradient(180deg, var(--page-green) 0%, var(--page-green-dark) 100%);
    }

    .ambient-scene {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .poster-wash,
    .poster-wash::before,
    .poster-wash::after {
      content: '';
      position: absolute;
      inset: -8%;
      background: url('/poster.jpg') center center / cover no-repeat;
    }

    .poster-wash {
      opacity: 0.22;
      filter: saturate(1.15) contrast(1.08) blur(1px);
      animation: posterDrift 22s ease-in-out infinite alternate;
    }

    .poster-wash::before {
      opacity: 0.42;
      mix-blend-mode: screen;
      filter: blur(28px);
      transform: scale(1.08);
    }

    .poster-wash::after {
      background:
        linear-gradient(180deg, rgba(248, 248, 240, 0.08), rgba(248, 248, 240, 0.3)),
        url('/poster.jpg') center center / cover no-repeat;
      opacity: 0.18;
      mix-blend-mode: soft-light;
      filter: blur(8px);
    }

    .grain-layer {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(rgba(255,255,255,0.12) 0.7px, transparent 0.7px),
        radial-gradient(rgba(121,79,39,0.07) 0.8px, transparent 0.8px);
      background-size: 18px 18px, 28px 28px;
      background-position: 0 0, 9px 9px;
      opacity: 0.18;
    }

    .ambient-glow {
      position: absolute;
      border-radius: 999px;
      filter: blur(70px);
      opacity: 0.55;
      animation: floatGlow 14s ease-in-out infinite;
    }

    .ambient-blue {
      width: 30vw;
      height: 30vw;
      left: -6vw;
      top: 20vh;
      background: rgba(72, 133, 255, 0.28);
    }

    .ambient-red {
      width: 34vw;
      height: 34vw;
      right: -8vw;
      top: 10vh;
      background: rgba(255, 78, 68, 0.24);
      animation-delay: -4s;
    }

    .ambient-green {
      width: 28vw;
      height: 28vw;
      left: 28vw;
      bottom: -10vh;
      background: rgba(125, 195, 149, 0.28);
      animation-delay: -8s;
    }

    .floating-dot {
      position: absolute;
      border-radius: 999px;
      background: rgba(255, 248, 221, 0.58);
      box-shadow: 0 0 0 2px rgba(255, 248, 221, 0.18);
      animation: floatDot 13s linear infinite;
    }

    .dot-a { width: 10px; height: 10px; left: 14%; top: 72%; }
    .dot-b { width: 8px; height: 8px; left: 79%; top: 65%; animation-delay: -4s; }
    .dot-c { width: 14px; height: 14px; left: 58%; top: 18%; animation-delay: -8s; }

    .topbar {
      position: sticky;
      top: 0;
      z-index: 30;
      background: rgba(248, 248, 240, 0.84);
      border-bottom: 2px solid var(--line);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .topbar-inner {
      max-width: 1360px;
      margin: 0 auto;
      padding: 14px 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--text-primary);
      font-weight: 800;
      letter-spacing: 0.01em;
    }

    .brand-mark {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      border: 2.5px solid var(--line);
      background: var(--paper-warm);
      display: grid;
      place-items: center;
      box-shadow: 0 3px 0 0 var(--shadow-input);
    }

    .brand-stack {
      display: flex;
      flex-direction: column;
      gap: 2px;
      line-height: 1.05;
    }

    .brand-name {
      font-size: 16px;
    }

    .brand-subline {
      color: var(--text-muted);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      font-weight: 700;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .nav-links a {
      padding: 10px 16px;
      min-height: 40px;
      border-radius: 50px;
      border: 2px solid transparent;
      color: var(--text-body);
      font-size: 14px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .nav-links a:hover {
      background: #d6dff0;
      color: #ffffff;
    }

    .page-grid {
      position: relative;
      z-index: 1;
      max-width: 1360px;
      margin: 0 auto;
      padding: 26px 22px 72px;
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      gap: 22px;
    }

    .sidebar {
      position: sticky;
      top: 84px;
      align-self: start;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .paper-card,
    .poster-panel,
    .soft-card,
    .contact-panel {
      position: relative;
      border: 2px solid var(--line);
      background: var(--paper-warm);
      border-radius: 20px;
      box-shadow: 0 4px 10px rgba(107, 92, 67, 0.2);
    }

    .organic-card {
      border-radius: 40px 35px 45px 38px / 38px 45px 35px 40px;
    }

    .sidebar-card {
      padding: 20px;
    }

    .sidebar-kicker,
    .section-kicker,
    .card-kicker {
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .sidebar-title {
      margin: 12px 0 8px;
      color: var(--text-primary);
      font-size: 30px;
      line-height: 1;
      font-weight: 900;
      letter-spacing: -0.03em;
    }

    .sidebar-text,
    .card-text,
    .work-summary,
    .section-text,
    .contact-text,
    .hero-lead,
    .loop-detail,
    .capability-description {
      margin: 0;
      color: var(--text-body);
      font-size: 15px;
      line-height: 1.75;
      font-weight: 600;
    }

    .sidebar-identity {
      margin-top: 14px;
      padding: 12px 14px;
      border-radius: 18px;
      border: 2px solid var(--line-soft);
      background: rgba(255, 255, 255, 0.34);
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 700;
      line-height: 1.7;
    }

    .signature-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }

    .signature-tag {
      padding: 8px 12px;
      border-radius: 999px;
      border: 2px solid var(--line-soft);
      background: var(--paper);
      font-size: 12px;
      font-weight: 800;
      color: var(--text-body);
      box-shadow: 0 2px 0 0 var(--shadow-input);
    }

    .sidebar-list {
      display: grid;
      gap: 10px;
      margin-top: 16px;
    }

    .sidebar-pill {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      min-height: 40px;
      padding: 0 14px;
      border-radius: 50px;
      border: 2.5px solid var(--line-soft);
      background: var(--paper);
      box-shadow: 0 3px 0 0 var(--shadow-input);
      font-size: 13px;
      font-weight: 700;
      color: var(--text-body);
    }

    .tone-teal { background: var(--tone-teal); }
    .tone-yellow { background: var(--tone-yellow); }
    .tone-blue { background: var(--tone-blue); color: #fff; }
    .tone-pink { background: var(--tone-pink); }
    .tone-green { background: var(--tone-green); }
    .tone-orange { background: var(--tone-orange); }

    .main-column {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .hero-card {
      padding: 26px;
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
      gap: 22px;
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(248, 248, 240, 0.92), rgba(247, 243, 223, 0.96)),
        radial-gradient(circle at right top, rgba(25, 200, 185, 0.12), transparent 32%);
    }

    .hero-copy {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 18px;
    }

    .hero-head {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .hero-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .hero-tag {
      min-height: 40px;
      padding: 0 14px;
      border-radius: 50px;
      border: 2.5px solid var(--line-soft);
      background: var(--paper);
      box-shadow: 0 3px 0 0 var(--shadow-input);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--text-body);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .hero-brandline,
    .hero-signal {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 50px;
      border: 2px solid var(--line-soft);
      background: rgba(255, 255, 255, 0.38);
      color: var(--text-primary);
      font-size: 13px;
      font-weight: 800;
      box-shadow: 0 2px 0 0 rgba(212, 201, 180, 0.85);
      width: fit-content;
    }

    .hero-title {
      margin: 0;
      color: var(--text-primary);
      font-size: clamp(48px, 7vw, 96px);
      line-height: 0.92;
      font-weight: 900;
      letter-spacing: -0.06em;
      max-width: 9.5ch;
    }

    .hero-title .accent {
      color: var(--mint);
      text-shadow: 0 2px 0 rgba(17, 168, 155, 0.14);
    }

    .hero-quote {
      padding: 18px 18px 18px 22px;
      border-radius: 18px;
      border: 2px solid var(--line-soft);
      background: rgba(255, 255, 255, 0.32);
      color: var(--text-primary);
      font-size: 15px;
      line-height: 1.75;
      font-weight: 700;
      position: relative;
    }

    .hero-quote::before {
      content: '';
      position: absolute;
      left: 12px;
      top: 12px;
      bottom: 12px;
      width: 5px;
      border-radius: 999px;
      background: linear-gradient(180deg, var(--mint), #86d67a);
    }

    .hero-quote span {
      display: block;
      padding-left: 14px;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .action-primary,
    .action-secondary,
    .chat-submit {
      min-height: 45px;
      padding: 0 20px;
      border-radius: 50px;
      border: 2.5px solid var(--line-soft);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.02em;
      transition: all 0.22s ease;
      cursor: pointer;
    }

    .action-primary,
    .chat-submit {
      background: var(--mint);
      color: #ffffff;
      box-shadow: 0 5px 0 0 #11a89b;
      border-color: #11a89b;
    }

    .action-secondary {
      background: var(--paper);
      color: var(--text-body);
      box-shadow: 0 5px 0 0 var(--shadow-btn);
    }

    .action-primary:hover,
    .action-secondary:hover,
    .chat-submit:hover {
      transform: translateY(-1px);
    }

    .action-primary:active,
    .action-secondary:active,
    .chat-submit:active {
      transform: translateY(2px);
      box-shadow: 0 1px 0 0 currentColor;
    }

    .quick-prompt-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .quick-prompt {
      min-height: 36px;
      padding: 0 14px;
      border-radius: 999px;
      border: 2px solid var(--line-soft);
      background: rgba(255, 255, 255, 0.62);
      color: var(--text-body);
      box-shadow: 0 2px 0 0 var(--shadow-input);
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      transition: transform 0.2s ease, background-color 0.2s ease;
    }

    .quick-prompt:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.85);
    }

    .chat-panel {
      padding: 18px;
      border-radius: 30px;
      background: rgba(248, 248, 240, 0.76);
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-height: 520px;
      border: 2px solid var(--line);
      box-shadow: 0 4px 10px rgba(107, 92, 67, 0.2);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }

    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .chat-header-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .chat-heading {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-primary);
      font-weight: 900;
    }

    .chat-heading-mark {
      width: 40px;
      height: 40px;
      border-radius: 999px;
      border: 2px solid var(--line-soft);
      background: rgba(255, 255, 255, 0.55);
      display: grid;
      place-items: center;
      box-shadow: 0 3px 0 0 var(--shadow-input);
    }

    .chat-status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      border: 2px solid var(--line-soft);
      background: rgba(255,255,255,0.5);
      color: var(--text-body);
      font-size: 12px;
      font-weight: 800;
    }

    .chat-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }

    .chat-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .chat-chip,
    .chat-reset {
      min-height: 34px;
      padding: 0 12px;
      border-radius: 999px;
      border: 2px solid var(--line-soft);
      background: rgba(255, 255, 255, 0.56);
      color: var(--text-body);
      box-shadow: 0 2px 0 0 var(--shadow-input);
      font-size: 12px;
      font-weight: 800;
    }

    .chat-reset {
      cursor: pointer;
      transition: transform 0.2s ease, background-color 0.2s ease;
    }

    .chat-reset:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.82);
    }

    .chat-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #6fba2c;
      box-shadow: 0 0 0 4px rgba(111, 186, 44, 0.15);
    }

    .chat-messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow: auto;
      padding-right: 4px;
    }

    .chat-messages::-webkit-scrollbar {
      width: 8px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(121, 79, 39, 0.2);
      border-radius: 999px;
    }

    .chat-bubble {
      max-width: 100%;
      padding: 12px 14px;
      border-radius: 18px;
      border: 2px solid var(--line-soft);
      font-size: 14px;
      line-height: 1.7;
      font-weight: 700;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .chat-bubble-user {
      align-self: flex-end;
      background: var(--mint);
      color: #ffffff;
      border-color: #11a89b;
      box-shadow: 0 4px 0 0 #11a89b;
    }

    .chat-bubble-assistant {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.6);
      color: var(--text-body);
    }

    .chat-bubble-pending {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .chat-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: rgba(121, 79, 39, 0.4);
      animation: pulseDot 1.1s ease-in-out infinite;
    }

    .chat-dot:nth-child(2) {
      animation-delay: 0.15s;
    }

    .chat-dot:nth-child(3) {
      animation-delay: 0.3s;
    }

    .chat-error {
      padding: 10px 12px;
      border-radius: 16px;
      border: 2px solid rgba(224, 90, 90, 0.28);
      background: rgba(224, 90, 90, 0.1);
      color: #9f3027;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.6;
    }

    .chat-input-wrap {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
      align-items: end;
    }

    .chat-input {
      width: 100%;
      min-height: 90px;
      padding: 14px 16px;
      border-radius: 22px;
      border: 2.5px solid var(--line-soft);
      background: rgba(255, 255, 255, 0.62);
      color: var(--text-body);
      box-shadow: 0 3px 0 0 var(--shadow-input);
      outline: none;
      resize: vertical;
    }

    .chat-input:focus {
      border-color: var(--focus-yellow);
      box-shadow: 0 3px 0 0 #e0b800, 0 0 0 3px rgba(255, 204, 0, 0.15);
    }

    .chat-submit {
      width: 48px;
      padding: 0;
    }

    .chat-submit:disabled {
      cursor: not-allowed;
      opacity: 0.7;
      transform: none;
    }

    .chat-footnote {
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 700;
      line-height: 1.6;
    }

    .spin {
      animation: spin 0.9s linear infinite;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .section-header {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .section-title {
      margin: 6px 0 0;
      color: var(--text-primary);
      font-size: clamp(28px, 4vw, 48px);
      line-height: 1;
      font-weight: 900;
      letter-spacing: -0.05em;
    }

    .section-text {
      max-width: 420px;
    }

    .grid-3,
    .grid-4,
    .grid-2 {
      display: grid;
      gap: 16px;
    }

    .grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }

    .soft-card {
      padding: 22px;
      min-height: 220px;
      transition: transform 0.24s ease, box-shadow 0.24s ease;
    }

    .soft-card:hover,
    .work-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(114, 93, 66, 0.15);
    }

    .card-title {
      margin: 12px 0 8px;
      color: var(--text-primary);
      font-size: 26px;
      line-height: 1.1;
      font-weight: 900;
      letter-spacing: -0.04em;
    }

    .loop-step {
      color: rgba(121, 79, 39, 0.72);
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .loop-title,
    .work-title,
    .capability-title {
      margin: 16px 0 10px;
      color: var(--text-primary);
      font-size: 28px;
      line-height: 1.05;
      font-weight: 900;
      letter-spacing: -0.05em;
    }

    .capability-icon {
      width: 52px;
      height: 52px;
      border-radius: 18px;
      border: 2px solid rgba(121, 79, 39, 0.18);
      background: rgba(255, 255, 255, 0.36);
      display: grid;
      place-items: center;
      color: var(--text-primary);
      box-shadow: 0 3px 0 0 rgba(189, 174, 160, 0.9);
    }

    .work-card {
      padding: 22px;
      min-height: 250px;
      transition: transform 0.24s ease, box-shadow 0.24s ease;
    }

    .work-type {
      color: rgba(121, 79, 39, 0.78);
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .work-link {
      margin-top: 20px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 900;
      color: var(--text-primary);
    }

    .manifesto-card {
      padding: 26px;
      background:
        linear-gradient(135deg, rgba(25, 200, 185, 0.16), rgba(255, 204, 0, 0.16)),
        var(--paper-warm);
    }

    .manifesto-title {
      margin: 10px 0 16px;
      color: var(--text-primary);
      font-size: clamp(32px, 4.4vw, 58px);
      line-height: 0.96;
      font-weight: 900;
      letter-spacing: -0.06em;
      max-width: 12ch;
    }

    .manifesto-list {
      display: grid;
      gap: 12px;
      max-width: 760px;
    }

    .manifesto-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      color: var(--text-body);
      font-size: 15px;
      line-height: 1.8;
      font-weight: 700;
    }

    .manifesto-dot {
      width: 10px;
      height: 10px;
      margin-top: 8px;
      border-radius: 999px;
      background: var(--mint);
      box-shadow: 0 2px 0 0 #11a89b;
      flex-shrink: 0;
    }

    .contact-panel {
      padding: 24px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 18px;
      align-items: center;
      background: linear-gradient(180deg, rgba(248,248,240,0.96), rgba(247,243,223,0.98));
    }

    .contact-title {
      margin: 10px 0 10px;
      color: var(--text-primary);
      font-size: clamp(30px, 4vw, 54px);
      line-height: 0.98;
      font-weight: 900;
      letter-spacing: -0.05em;
      max-width: 11ch;
    }

    .contact-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: flex-end;
    }

    .contact-actions a {
      min-height: 45px;
      padding: 0 20px;
      border-radius: 50px;
      border: 2.5px solid var(--line-soft);
      background: var(--paper);
      box-shadow: 0 5px 0 0 var(--shadow-btn);
      color: var(--text-body);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 900;
      transition: all 0.22s ease;
    }

    .contact-actions a:hover {
      transform: translateY(-1px);
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      color: rgba(248, 248, 240, 0.86);
      font-size: 13px;
      font-weight: 800;
      padding: 6px 2px 0;
      text-shadow: 0 1px 0 rgba(114, 93, 66, 0.25);
    }

    @keyframes posterDrift {
      0% { transform: scale(1.02) translate3d(0, 0, 0); }
      100% { transform: scale(1.08) translate3d(0, -1.8%, 0); }
    }

    @keyframes floatGlow {
      0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
      50% { transform: translate3d(0, -18px, 0) scale(1.08); }
    }

    @keyframes floatDot {
      0% { transform: translateY(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-28px); opacity: 0; }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes pulseDot {
      0%, 80%, 100% {
        transform: translateY(0);
        opacity: 0.35;
      }
      40% {
        transform: translateY(-2px);
        opacity: 1;
      }
    }

    @media (max-width: 1160px) {
      .page-grid {
        grid-template-columns: 1fr;
      }

      .sidebar {
        position: static;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .hero-card,
      .grid-4,
      .grid-3,
      .grid-2,
      .contact-panel {
        grid-template-columns: 1fr;
      }

      .contact-actions {
        justify-content: flex-start;
      }
    }

    @media (max-width: 760px) {
      .topbar-inner,
      .page-grid {
        padding-left: 16px;
        padding-right: 16px;
      }

      .nav-links {
        display: none;
      }

      .sidebar {
        grid-template-columns: 1fr;
      }

      .hero-card,
      .sidebar-card,
      .soft-card,
      .contact-panel,
      .chat-panel,
      .manifesto-card {
        padding: 18px;
      }

      .hero-title {
        max-width: none;
      }

      .section-header,
      .footer,
      .chat-header,
      .chat-header-main {
        flex-direction: column;
        align-items: flex-start;
      }

      .chat-input-wrap {
        grid-template-columns: 1fr;
      }

      .chat-submit {
        width: 100%;
      }
    }
  `;

  return (
    <div className="page-shell">
      <style>{styleSheet}</style>

      <div className="ambient-scene" aria-hidden="true">
        <div className="poster-wash" />
        <div className="grain-layer" />
        <div className="ambient-glow ambient-blue" />
        <div className="ambient-glow ambient-red" />
        <div className="ambient-glow ambient-green" />
        <span className="floating-dot dot-a" />
        <span className="floating-dot dot-b" />
        <span className="floating-dot dot-c" />
      </div>

      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark">
              <Sparkles size={18} />
            </div>
            <div className="brand-stack">
              <span className="brand-name">Forky</span>
              <span className="brand-subline">AI Trainer in Progress</span>
            </div>
          </div>

          <nav className="nav-links">
            <a href="#about">About</a>
            <a href="#workflow">Workflow</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#works">Works</a>
            <a href="#connect">Connect</a>
          </nav>
        </div>
      </header>

      <div className="page-grid">
        <aside className="sidebar">
          <div className="paper-card sidebar-card organic-card">
            <div className="sidebar-kicker">Profile</div>
            <div className="sidebar-title">Forky</div>
            <p className="sidebar-text">
              大三学生 / 准 AI 训练师。关注 AI 调教、Prompt 约束设计、工作流优化与人机协作体验。
            </p>
            <div className="sidebar-identity">个人标签：把 AI 从“能回答”训练成“能协作”。</div>
            <div className="signature-strip">
              {signaturePills.map((item) => (
                <span className="signature-tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <div className="sidebar-list">
              <div className="sidebar-pill">
                <span>Email</span>
                <span>coilbiue@163.com</span>
              </div>
              <div className="sidebar-pill">
                <span>小红书</span>
                <span>Forky</span>
              </div>
            </div>
          </div>

          <div className="paper-card sidebar-card tone-teal">
            <div className="sidebar-kicker">Focus</div>
            <p className="sidebar-text">
              让 AI 不只是“回答问题”，而是变成一个能被持续调优、可积累记忆、可稳定协作的系统。
            </p>
          </div>
        </aside>

        <main className="main-column">
          <section id="about" className="paper-card hero-card organic-card">
            <div className="hero-copy">
              <div>
                <div className="hero-head">
                  <div className="hero-tags">
                    <span className="hero-tag">AI Trainer</span>
                    <span className="hero-tag">Workflow Design</span>
                    <span className="hero-tag">Live Chat</span>
                  </div>
                  <div className="card-kicker">Forky / Live</div>
                </div>

                <div className="hero-brandline">
                  <Sparkles size={14} />
                  <span>把 AI 从会答，调到会协作。</span>
                </div>

                <h1 className="hero-title">
                  我把 <span className="accent">AI 工作流</span>、
                  <br />
                  Prompt 约束和交互逻辑做成我的个人风格。
                </h1>

                <p className="hero-lead">
                  我擅长先问清问题，再搭流程，再把上下文沉淀成可复用的 AI 记忆。
                </p>
              </div>

              <div className="hero-quote">
                <span>“我不只想让 AI 会回答，我更想让它真正会干活。”</span>
              </div>

              <div>
                <div className="hero-signal">
                  <Compass size={14} />
                  <span>右侧连的是我的小猫咪助手，想聊方法、项目或合作，直接开问。</span>
                </div>
                <div className="hero-actions">
                  <a href="#works" className="action-primary">
                    查看输出 <ArrowUpRight size={16} />
                  </a>
                  <a href="mailto:coilbiue@163.com" className="action-secondary">
                    联系我 <Mail size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div className="chat-panel">
              <div className="chat-header">
                <div style={{ width: '100%' }}>
                  <div className="chat-header-main">
                    <div className="chat-heading">
                      <div className="chat-heading-mark">
                        <Bot size={18} />
                      </div>
                      <div>
                        <div>Forky x 小猫咪</div>
                        <div className="card-kicker">实时聊天入口</div>
                      </div>
                    </div>
                    <div className="chat-status">
                      <span className="chat-status-dot" />
                      <span>{isSending ? '正在思考' : '可直接提问'}</span>
                    </div>
                  </div>

                  <div className="chat-toolbar">
                    <div className="chat-meta">
                      <span className="chat-chip">{transportLabelMap[chatTransport] || '服务端代理'}</span>
                      <span className="chat-chip">{chatSessionId ? '会话已建立' : '新会话'}</span>
                    </div>
                    <button className="chat-reset" type="button" onClick={resetConversation}>
                      清空对话
                    </button>
                  </div>
                </div>
              </div>

              <div className="quick-prompt-row">
                {suggestedPrompts.map((prompt) => (
                  <button
                    className="quick-prompt"
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    disabled={isSending}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="chat-messages" ref={chatMessagesRef}>
                {messages.map((message, index) => (
                  <div
                    className={
                      message.role === 'user'
                        ? 'chat-bubble chat-bubble-user'
                        : 'chat-bubble chat-bubble-assistant'
                    }
                    key={`${message.role}-${index}`}
                  >
                    {message.content}
                  </div>
                ))}
                {isSending ? (
                  <div className="chat-bubble chat-bubble-assistant chat-bubble-pending">
                    <span className="chat-dot" />
                    <span className="chat-dot" />
                    <span className="chat-dot" />
                  </div>
                ) : null}
              </div>

              {chatError ? <div className="chat-error">{chatError}</div> : null}

              <form onSubmit={handleSubmit}>
                <div className="chat-input-wrap">
                  <textarea
                    className="chat-input"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="问我：你怎么做 AI 调教？按 Enter 发送，Shift + Enter 换行。"
                  />
                  <button className="chat-submit" type="submit" disabled={isSending}>
                    {isSending ? (
                      <LoaderCircle className="spin" size={18} />
                    ) : (
                      <SendHorizonal size={18} />
                    )}
                  </button>
                </div>
              </form>

              <p className="chat-footnote">
                当前默认连接你在 `47.97.222.168` 上的小猫咪助手；若远程不可用，再切换到其他代理或本地调试配置。
              </p>
            </div>
          </section>

          <section id="workflow" className="section">
            <div className="section-header">
              <div>
                <div className="section-kicker">Signature Workflow</div>
                <h2 className="section-title">我的 AI 调教回路</h2>
              </div>
              <p className="section-text">
                这部分是我的方法论识别点，也是和普通“会写提示词的人”拉开差异的地方。
              </p>
            </div>

            <div className="grid-4">
              {trainingLoop.map((item, index) => (
                <article className={`soft-card paper-card ${index % 2 === 0 ? 'tone-yellow' : 'tone-teal'}`} key={item.step}>
                  <div>
                    <div className="loop-step">{item.step}</div>
                    <h3 className="loop-title">{item.title}</h3>
                  </div>
                  <p className="loop-detail">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="section-header">
              <div>
                <div className="section-kicker">Point Of View</div>
                <h2 className="section-title">我在研究什么</h2>
              </div>
              <p className="section-text">
                用更柔和的卡片和更直接的阅读节奏，讲清楚我的方法、立场和持续输出方向。
              </p>
            </div>

            <div className="grid-3">
              {perspectives.map((item) => (
                <article className={`soft-card paper-card ${item.tone}`} key={item.title}>
                  <div>
                    <div className="card-kicker">{item.category}</div>
                    <h3 className="card-title">{item.title}</h3>
                  </div>
                  <p className="card-text">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="manifesto-card paper-card organic-card">
            <div className="section-kicker">Brand Manifesto</div>
            <h2 className="manifesto-title">我想把 AI 调教，做成一种可被记住的个人品牌。</h2>
            <div className="manifesto-list">
              {brandManifesto.map((item) => (
                <div className="manifesto-item" key={item}>
                  <span className="manifesto-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="capabilities" className="section">
            <div className="section-header">
              <div>
                <div className="section-kicker">Core Signature</div>
                <h2 className="section-title">我的核心能力</h2>
              </div>
              <p className="section-text">
                视觉更强调易读和互动，但能力表达仍然聚焦在你的 AI 训练师身份与实际方法论。
              </p>
            </div>

            <div className="grid-3">
              {capabilities.map((item) => {
                const Icon = item.icon;
                return (
                  <article className={`soft-card paper-card ${item.tone}`} key={item.title}>
                    <div>
                      <div className="capability-icon">
                        <Icon size={22} />
                      </div>
                      <div className="card-kicker" style={{ marginTop: '16px' }}>
                        {item.subtitle}
                      </div>
                      <h3 className="capability-title">{item.title}</h3>
                    </div>
                    <p className="capability-description">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="works" className="section">
            <div className="section-header">
              <div>
                <div className="section-kicker">Signals & Outputs</div>
                <h2 className="section-title">代表作品与长期观察</h2>
              </div>
              <p className="section-text">
                这一块继续突出你的研究路线和输出习惯，让访客更容易理解你真正擅长什么。
              </p>
            </div>

            <div className="grid-2">
              {works.map((item) => (
                <article className={`work-card paper-card ${item.tone}`} key={item.label}>
                  <div>
                    <div className="work-type">{item.type}</div>
                    <h3 className="work-title">{item.label}</h3>
                    <p className="work-summary">{item.summary}</p>
                  </div>
                  <div className="work-link">
                    <span>继续阅读</span>
                    <ArrowUpRight size={16} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="connect" className="contact-panel paper-card organic-card">
            <div>
              <div className="section-kicker">Let&apos;s Build</div>
              <h2 className="contact-title">如果你也相信 AI 需要被调教，欢迎来找我聊聊。</h2>
              <p className="contact-text">
                无论是 AI 调教、Prompt 设计、工作流优化，还是想把一个个人品牌做得更有方法感和辨识度，我都很乐意继续交流。
              </p>
            </div>
            <div className="contact-actions">
              <a href="mailto:coilbiue@163.com">
                <Mail size={16} /> Email
              </a>
              <a href="#about">
                <Bot size={16} /> 试试聊天
              </a>
            </div>
          </section>

          <footer className="footer">
            <div>Forky / Interactive AI portfolio</div>
            <div>© {new Date().getFullYear()} Forky</div>
          </footer>
        </main>
      </div>
    </div>
  );
}
