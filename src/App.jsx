import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  BadgeCheck,
  Bot,
  BrainCircuit,
  DatabaseZap,
  FileText,
  Image,
  Mail,
  MessageSquareText,
  Phone,
  Radar,
  Send,
  Server,
  Sparkles,
  Workflow,
  X,
} from 'lucide-react'

const profile = {
  name: '李京卓',
  role: 'AI 训练师',
  tagline: '多模态数据评测 / 标注质检 / Prompt 自动化',
  email: 'coilbiue@163.com',
  phone: '15527321821',
  school: '湖北工业大学 · 电子信息工程（2027 届）',
  site: 'coilbiue7.github.io',
  summary:
    '我关注 AI 数据生产链路中的规则沉淀、批量生成、脚本处理与抽检复盘。能把模型评测、标注质检、Prompt 设计、知识库文档交付拆成可执行流程，并用 Python、Coze / 影刀 RPA、Trae / Cursor、飞书表格提升协作效率。',
}

const profileContext = `
李京卓，AI 训练师，方向包含多模态数据评测、数据标注质检、Prompt 自动化。
核心技能：Python 自动化、Coze/影刀 RPA、Trae/Cursor、飞书表格、Obsidian 知识库、本地 Markdown 文档生成、T2I/I2V、多模态视频 Caption、Badcase 归因、Checklist、供应商试标质检、Prompt 种子集与审美判断。
教育背景：湖北工业大学电子信息工程本科，2027 届，GPA 3.6/4.0，专业排名前 20%。
经历：武汉麻小袋科技数据标注实习，批量撰写/改写 1000+ 套对话数据，归因 Badcase 2000+ 条，团队标注准确率稳定 95%，审核通过率 62% 提升至 80%。
经历：上海阶跃星辰数据标注实习，设计类 T2I 模型评测体系与 API 选型，5 维度×3 难度评测框架，Python 并发调用 3 个候选模型 API，评测集构建效率提升约 200%。
经历：多模态视频评测、Caption 质控与高质量素材筛选，跟进 10+ 次规则迭代，8 步 SOP 和 16 项 Checklist，累计参与 20 万级视频素材筛选，推动供应商 3 进 2。
实践：自定义 AI Skill 大学生期末复习辅助系统，结合 Obsidian 搭建本地知识库，生成 Markdown 复习文档、章节重点、模拟题、错题复盘和复习计划。
实践：国际学院学工办 Coze 工作流数字化提效项目，图文归档、图片分类、合规预检自动化，40% 图文数据可自动合规通过，单人日均处理效率提升 50%，每周节省约 5 小时。
联系方式：coilbiue@163.com，15527321821。
`

const projects = [
  {
    id: 'P01',
    title: '设计类 T2I 模型评测体系建设与 API 选型',
    tag: 'T2I Evaluation',
    image: '/project-t2i.svg',
    meta: '上海阶跃星辰 · 2026',
    desc: '围绕海报设计、电商促销、社媒运营场景，共建 5 维度 × 3 难度评测框架，使用 Trae / Cursor 生成 Prompt 种子集，并用 Python 并发调用 3 个候选模型 API。',
    result: '评测集构建效率提升约 200%，完成模型 API 选型并交付业务方使用。',
  },
  {
    id: 'P02',
    title: '多模态视频评测、Caption 质控与素材筛选',
    tag: 'Multimodal QA',
    image: '/project-video.svg',
    meta: 'I2V / Caption / Video Scoring',
    desc: '将画面、运动、速度、美学、音频拆成 5 大维度 / 15 项评分，识别字幕、水印、黑边、Logo 与 AIGC 瑕疵，搭建标注-质检-Badcase-对齐-培训闭环。',
    result: '累计参与 20 万级视频素材筛选，推动供应商 3 进 2，沉淀多源视频评分口径。',
  },
  {
    id: 'P03',
    title: '对话数据生产与质检流程优化',
    tag: 'Data QA Workflow',
    image: '/project-dialog.svg',
    meta: '武汉麻小袋科技 · 2025',
    desc: '批量撰写 / 改写 1000+ 套单轮与多轮对话数据，沉淀标准化回答模板、Prompt 指令集与自动审核口径，搭建多人盲标 + 交叉质检机制。',
    result: '审核通过率由 62% 提升至 80%，单月 0 重大交付错误。',
  },
  {
    id: 'P04',
    title: '自定义 AI Skill：大学生期末复习辅助系统',
    tag: 'AI Skill / Obsidian',
    image: '/project-skill.svg',
    meta: 'Campus AI Practice · 2026',
    desc: '将课程资料导入、知识点拆解、重点提炼、题型生成、错题复盘、复习计划拆成标准流程，并结合 Obsidian 搭建本地知识库。',
    result: '实现从零散课件到 Markdown 复习文档、模拟题与复盘计划的结构化生成。',
  },
]

const abilities = [
  {
    icon: Workflow,
    title: '流程自动化拆解',
    text: '能把复杂数据生产任务拆为规则沉淀、批量生成、脚本处理、抽检复盘，让交付过程可复制。',
  },
  {
    icon: DatabaseZap,
    title: '多模态评测与质控',
    text: '熟悉 T2I / I2V、视频 Caption、图文理解、GSB 对比、Checklist、Badcase 归因与报告交付。',
  },
  {
    icon: BrainCircuit,
    title: 'Prompt 与审美判断',
    text: '能搭建 Prompt 种子集和优化库，关注构图、光影、色调、文字排版、商业可用性与 AIGC 瑕疵。',
  },
  {
    icon: FileText,
    title: '知识库与本地文档',
    text: '使用 Obsidian 按项目、规则、Badcase、Prompt 模板结构化沉淀，并生成 Markdown 文档与 SOP。',
  },
]

const experience = [
  '上海阶跃星辰｜设计类 T2I 模型评测体系、I2V 视频评测、Caption 质控',
  '武汉麻小袋科技｜对话数据生产、质检负责人、Badcase 归因与 SOP 沉淀',
  '校园 AI 实践｜自定义复习 Skill、Coze 工作流数字化提效、双语推文辅助',
]

const quickQuestions = [
  '你适合什么岗位？',
  '你做过哪些多模态评测？',
  '你的自动化能力体现在哪里？',
  '如何联系你？',
]

const galleryFiles = [
  '微信图片_2026-06-12_143832_116.png','微信图片_2026-06-12_143910_306.png',
  '微信图片_20260612140252_182_23.jpg','微信图片_20260612140257_183_23.jpg',
  '微信图片_20260612140300_184_23.jpg','微信图片_20260612140303_185_23.jpg',
  '微信图片_20260612140305_186_23.jpg','微信图片_20260612140309_187_23.jpg',
  '微信图片_20260612140314_188_23.jpg','微信图片_20260612140317_189_23.jpg',
  '微信图片_20260612140658_190_23.jpg','微信图片_20260612140659_191_23.jpg',
  '微信图片_20260612140700_192_23.jpg','微信图片_20260612140702_193_23.jpg',
  '微信图片_20260612140703_194_23.jpg','微信图片_20260612140704_195_23.jpg',
  '微信图片_20260612140706_196_23.jpg','微信图片_20260612140706_197_23.jpg',
  '微信图片_20260612140708_198_23.jpg','微信图片_20260612140709_199_23.jpg',
  '微信图片_20260612140715_200_23.png','微信图片_20260612140716_201_23.jpg',
  '微信图片_20260612140717_202_23.jpg','微信图片_20260612140718_203_23.jpg',
  '微信图片_20260612140720_204_23.jpg','微信图片_20260612140721_205_23.jpg',
  '微信图片_20260612140723_206_23.jpg','微信图片_20260612140725_207_23.jpg',
  '微信图片_20260612140726_208_23.jpg','微信图片_20260612140731_211_23.jpg',
]
const galleryImages = galleryFiles.map((f, i) => ({ src: `/gallery/${f}`, alt: `审美收集 ${i + 1}`, id: i }))

function localAnswer(question) {
  const q = question.trim().toLowerCase()

  if (!q) return '你可以问我关于李京卓的项目经历、技能优势、联系方式或适合岗位。'

  if (q.includes('岗位') || q.includes('适合') || q.includes('role')) {
    return '李京卓适合 AI 训练师、数据标注质检、多模态模型评测、Prompt 运营、AIGC 内容评测、数据生产流程优化等岗位。优势是能把标注、评测、质检和文档沉淀做成可复用流程。'
  }

  if (q.includes('多模态') || q.includes('t2i') || q.includes('i2v') || q.includes('视频') || q.includes('caption')) {
    return '他参与过设计类 T2I 模型评测体系和 API 选型，也做过 I2V 视频评测、Caption 质控与高质量素材筛选。工作包括 5 维度×3 难度评测框架、8 步 SOP、16 项 Checklist、Badcase 归因和供应商试标质检。'
  }

  if (q.includes('自动化') || q.includes('python') || q.includes('coze') || q.includes('效率')) {
    return '他的自动化能力主要体现在：用 Python 并发调用模型 API、用 Trae/Cursor 辅助生成 Prompt 种子集、用 Coze/影刀 RPA 拆解图文归档与合规预检流程，并把规则沉淀为 SOP、Wiki 和本地 Markdown 文档。'
  }

  if (q.includes('skill') || q.includes('复习') || q.includes('obsidian') || q.includes('知识库')) {
    return '他做过"大学生期末复习辅助 Skill"，把课程资料导入、知识点拆解、重点提炼、题型生成、错题复盘、复习计划拆成标准流程，并用 Obsidian 组织课程、章节、考点、题型与 Prompt 模板。'
  }

  if (q.includes('联系') || q.includes('邮箱') || q.includes('电话') || q.includes('email')) {
    return '可以通过邮箱 coilbiue@163.com 或电话 15527321821 联系李京卓。'
  }

  if (q.includes('项目') || q.includes('经历')) {
    return '代表项目包括：设计类 T2I 模型评测体系建设与 API 选型、多模态视频评测与 Caption 质控、对话数据生产与质检流程优化、自定义 AI Skill 期末复习辅助系统、Coze 工作流数字化提效。'
  }

  return '从简历知识库看，李京卓的核心标签是 AI 训练师、多模态评测、标注质检、Prompt 自动化和知识库文档交付。你可以继续问具体项目、技能优势、成果数据或联系方式。'
}

function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

function Hero() {
  const heroVideoUrl = import.meta.env.VITE_HERO_VIDEO_URL || ''

  const heroChips = [
    { label: '多模态评测', sub: '文本 / 图像 / 音视频' },
    { label: '质检流程', sub: '标准制定 · 质量把控' },
    { label: 'Prompt 自动化', sub: '模板生成 · 评测迭代' },
    { label: 'Obsidian 知识库', sub: '沉淀方法 · 本地文档' },
  ]

  return (
    <section className="hero" id="top">
      <div className="hero-media" aria-hidden="true">
        {heroVideoUrl ? (
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/forky-space-hero.webp"
          >
            <source src={heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <picture>
            <source srcSet="/forky-space-hero.avif" type="image/avif" />
            <source srcSet="/forky-space-hero.webp" type="image/webp" />
            <img
              className="hero-image"
              src="/forky-space-hero.webp"
              width="1672"
              height="941"
              alt=""
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
        )}
      </div>
      <div className="hero-overlay" />

      <nav className="nav max-shell">
        <a className="brand" href="#top" aria-label="回到首页">
          <span className="brand-logo">李京卓</span>
        </a>
        <div className="nav-links" aria-label="主导航">
          <a href="#profile">About</a>
          <a href="#projects">Projects</a>
          <a href="#abilities">Strengths</a>
          <a href="#gallery">Gallery</a>
        </div>
        <div className="nav-actions">
          <a className="nav-sign" href={`mailto:${profile.email}`}>联系我</a>
          <a className="nav-start" href="#ai-node">Ask AI</a>
        </div>
      </nav>

      <div className="hero-content max-shell">
        <div className="hero-kicker">
          <span className="pulse-dot" />
          AI Trainer · Multimodal Evaluation
        </div>
        <h1>
          让数据、评测与 Prompt
          <br />
          形成可复用的 AI 生产力
        </h1>
        <p>
          专注多模态评测、数据质量与自动化流程构建，帮助团队把复杂的 AI 能力，转化为稳定、可复用的生产力。
        </p>
        <div className="hero-actions">
          <a className="primary-btn" href="#projects">
            查看精选项目 <ArrowUpRight size={18} />
          </a>
          <a className="ghost-btn" href={`mailto:${profile.email}`}>
            <Mail size={18} /> 联系我
          </a>
        </div>
      </div>

      <div className="hero-panel max-shell" aria-label="核心能力概览">
        {heroChips.map((item) => (
          <div className="stat-card" key={item.label}>
            <strong>{item.label}</strong>
            <span>{item.sub}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Profile() {
  return (
    <section className="profile-section section-padding" id="profile">
      <div className="max-shell profile-grid">
        <div className="portrait-card">
          <div className="portrait-rings" />
          <img src="/portrait-photo.jpg" alt="李京卓照片" />
          <div className="portrait-caption">
            <Radar size={18} />
            <span>Rule · Prompt · QA · Report</span>
          </div>
        </div>

        <div className="profile-copy">
          <SectionHeader
            eyebrow="PROFILE"
            title="以数据质量和流程效率为核心的 AI 训练师"
            text="不是只做标注执行，而是把需求、规则、质检、复盘与文档交付串成闭环。"
          />
          <p className="lead-text">{profile.summary}</p>

          <div className="experience-list">
            {experience.map((item) => (
              <div key={item}>
                <BadgeCheck size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="contact-strip">
            <a href={`mailto:${profile.email}`}>
              <Mail size={17} /> {profile.email}
            </a>
            <a href={`tel:${profile.phone}`}>
              <Phone size={17} /> {profile.phone}
            </a>
            <span>{profile.school}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section className="projects-section section-padding" id="projects">
      <div className="max-shell">
        <SectionHeader
          eyebrow="SELECTED PROJECTS"
          title="精选项目：从规则到交付的可视化证明"
          text="用大卡片展示项目的真实场景、关键动作和可量化结果。"
        />

        <div className="project-grid">
          {projects.map((project, i) => (
            <article className="project-card" key={project.id} style={{ '--stagger': i }}>
              <div className="project-media">
                <img src={project.image} alt={`${project.title} 项目视觉图`} />
                <span>{project.id}</span>
              </div>
              <div className="project-body">
                <div className="project-topline">
                  <span>{project.tag}</span>
                  <small>{project.meta}</small>
                </div>
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
                <div className="project-result">
                  <Sparkles size={17} />
                  <strong>{project.result}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Abilities() {
  return (
    <section className="abilities-section section-padding" id="abilities">
      <div className="max-shell">
        <SectionHeader
          eyebrow="ADVANTAGES"
          title="个人优势：懂评测，也懂怎么把评测做成系统"
          text="把项目能力拆成四个可展示、可解释、可落地的能力模块。"
        />

        <div className="ability-grid">
          {abilities.map(({ icon: Icon, title, text }, i) => (
            <article className="ability-card" key={title} style={{ '--stagger': i }}>
              <div className="ability-icon">
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pupil({ size = 7, maxDistance = 5, forceX, forceY }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const pos = (() => {
    if (forceX !== undefined && forceY !== undefined) return { x: forceX, y: forceY }
    if (!ref.current) return { x: 0, y: 0 }
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dist = Math.min(Math.sqrt((mouse.x - cx) ** 2 + (mouse.y - cy) ** 2), maxDistance)
    const angle = Math.atan2(mouse.y - cy, mouse.x - cx)
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
  })()

  return (
    <div
      ref={ref}
      className="pupil"
      style={{
        width: size, height: size,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
    />
  )
}

function EyeBall({ size = 18, pupilSize = 7, maxDistance = 5, blinking = false, forceX, forceY }) {
  return (
    <div className={`eyeball${blinking ? ' blinking' : ''}`} style={{ width: size, height: blinking ? 2 : size }}>
      {!blinking && <Pupil size={pupilSize} maxDistance={maxDistance} forceX={forceX} forceY={forceY} />}
    </div>
  )
}

function CharacterShow({ state }) {
  const [purpleBlink, setPurpleBlink] = useState(false)
  const [blackBlink, setBlackBlink] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const stageRef = useRef(null)

  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Random blinking
  useEffect(() => {
    let t
    const schedule = () => {
      t = setTimeout(() => {
        setPurpleBlink(true)
        setTimeout(() => { setPurpleBlink(false); schedule() }, 120)
      }, Math.random() * 3500 + 2500)
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    let t
    const schedule = () => {
      t = setTimeout(() => {
        setBlackBlink(true)
        setTimeout(() => { setBlackBlink(false); schedule() }, 120)
      }, Math.random() * 3500 + 2500)
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  // Body lean toward mouse
  const lean = (() => {
    if (!stageRef.current) return 0
    const r = stageRef.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const dx = (mouse.x - cx) / 100
    return Math.max(-6, Math.min(6, -dx))
  })()

  // Reactive look directions per state
  const look = {
    idle: { purple: null, black: null, orange: null, yellow: null },
    typing: { purple: { x: 2, y: 3 }, black: { x: 2, y: 3 }, orange: { x: 3, y: 4 }, yellow: { x: 3, y: 4 } },
    loading: { purple: { x: 3, y: 3 }, black: { x: -2, y: -3 }, orange: { x: -1, y: 2 }, yellow: { x: -2, y: 2 } },
    answered: { purple: { x: 0, y: -3 }, black: { x: 0, y: -2 }, orange: { x: 0, y: -3 }, yellow: { x: 0, y: -3 } },
  }[state] || { purple: null, black: null, orange: null, yellow: null }

  return (
    <div className="characters-stage" ref={stageRef}>
      <div className="characters-canvas">
        <div className={`char-group${state !== 'idle' ? ` ${state}` : ''}`}>
          {/* Purple */}
          <div className="char-body char-purple" style={{ transform: state === 'idle' ? `skewX(${lean}deg)` : undefined }}>
            <div className="char-eyes" style={state === 'idle' ? { left: 34 + lean * 1.2, top: 36 } : undefined}>
              <EyeBall size={18} pupilSize={7} maxDistance={5} blinking={purpleBlink} forceX={look.purple?.x} forceY={look.purple?.y} />
              <EyeBall size={18} pupilSize={7} maxDistance={5} blinking={purpleBlink} forceX={look.purple?.x} forceY={look.purple?.y} />
            </div>
          </div>

          {/* Black */}
          <div className="char-body char-black" style={{ transform: state === 'idle' ? `skewX(${lean * 1.2}deg)` : undefined }}>
            <div className="char-eyes" style={state === 'idle' ? { left: 21 + lean * 1.5, top: 25 } : undefined}>
              <EyeBall size={16} pupilSize={6} maxDistance={4} blinking={blackBlink} forceX={look.black?.x} forceY={look.black?.y} />
              <EyeBall size={16} pupilSize={6} maxDistance={4} blinking={blackBlink} forceX={look.black?.x} forceY={look.black?.y} />
            </div>
          </div>

          {/* Orange */}
          <div className="char-body char-orange" style={{ transform: state === 'idle' ? `skewX(${lean * 0.8}deg)` : undefined }}>
            <div className="char-eyes" style={state === 'idle' ? { left: 64 + lean * 0.8, top: 64 } : undefined}>
              <Pupil size={13} maxDistance={5} forceX={look.orange?.x} forceY={look.orange?.y} />
              <Pupil size={13} maxDistance={5} forceX={look.orange?.x} forceY={look.orange?.y} />
            </div>
          </div>

          {/* Yellow */}
          <div className="char-body char-yellow" style={{ transform: state === 'idle' ? `skewX(${lean * 0.9}deg)` : undefined }}>
            <div className="char-eyes" style={state === 'idle' ? { left: 40 + lean * 0.9, top: 32 } : undefined}>
              <Pupil size={12} maxDistance={5} forceX={look.yellow?.x} forceY={look.yellow?.y} />
              <Pupil size={12} maxDistance={5} forceX={look.yellow?.x} forceY={look.yellow?.y} />
            </div>
            <div className="char-mouth" style={state === 'idle' ? { left: 36 + lean * 0.9, top: 68 } : undefined} />
          </div>
        </div>
      </div>
    </div>
  )
}

function AiNode() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '你好，我是部署在作品集里的"关于李京卓"小 AI。你可以问我：项目经历、能力优势、联系方式、适合岗位。',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [charState, setCharState] = useState('idle')
  const messagesEndRef = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function onInputFocus() {
    setCharState('typing')
    clearTimeout(typingTimer.current)
  }

  function onInputChange(e) {
    setInput(e.target.value)
    setCharState('typing')
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => { if (!loading) setCharState('idle') }, 1500)
  }

  async function askAi(nextQuestion) {
    const question = nextQuestion ?? input
    if (!question.trim() || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setInput('')
    setLoading(true)
    setCharState('loading')
    clearTimeout(typingTimer.current)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: profileContext },
            { role: 'user', content: question },
          ],
        }),
      })

      if (!response.ok) throw new Error('Chat API error')
      const data = await response.json()
      const apiReply = data.reply || ''
      const isNonsense = /主人|看不懂|乱码|发串|问号.*怎么回事|人家看不懂/i.test(apiReply)
      const isRelevant = !isNonsense && apiReply.length > 50
      const reply = isRelevant ? apiReply : localAnswer(question)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setCharState('answered')
      setTimeout(() => { if (!loading) setCharState('idle') }, 2000)
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: localAnswer(question) },
      ])
      setCharState('answered')
      setTimeout(() => { if (!loading) setCharState('idle') }, 2000)
    }

    setLoading(false)
  }

  return (
    <section className="ai-node-section section-padding" id="ai-node">
      <div className="max-shell ai-node-grid">
        <div>
          <SectionHeader
            eyebrow="ALIYUN AI NODE"
            title={'一个可以回答“关于我”的小 AI 模块'}
            text="基础版已做好前端交互和本地兜底知识库；上线时只需要把你的阿里云接口地址写进环境变量。"
          />
          <div className="server-card">
            <div>
              <Server size={24} />
            </div>
            <div>
              <h3>我的小助手助手在线</h3>
              <p>当前通过服务器代理连接我的小助手 AI，回答关于李京卓的项目经历、技能优势和联系方式。</p>
            </div>
          </div>
        </div>

        <div>
          <CharacterShow state={charState} />

          <div className="chat-card" aria-label="关于我的 AI 问答模块" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
            <div className="chat-head">
              <div>
                <Bot size={20} />
                <span>Ask About Jingzhuo</span>
              </div>
              <small>我的小助手 47.97.222.168</small>
            </div>

            <div className="chat-messages">
              {messages.map((message, index) => (
                <div className={`message ${message.role}`} key={`${message.role}-${index}`}>
                  {message.content}
                </div>
              ))}
              {loading && <div className="message assistant"><span className="typing-dots"><span /><span /><span /></span></div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="quick-questions">
              {quickQuestions.map((q) => (
                <button type="button" key={q} onClick={() => askAi(q)}>
                  {q}
                </button>
              ))}
            </div>

            <form
              className="chat-input"
              onSubmit={(event) => {
                event.preventDefault()
                askAi()
              }}
            >
              <MessageSquareText size={18} />
              <input
                value={input}
                onChange={onInputChange}
                onFocus={onInputFocus}
                placeholder="输入问题，例如：你的 Prompt 能力体现在哪里？"
              />
              <button type="submit" aria-label="发送问题">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function GallerySection() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)

  const openLightbox = (idx) => { setLightboxIdx(idx); setLightboxOpen(true); document.body.style.overflow = 'hidden' }
  const closeLightbox = () => { setLightboxOpen(false); document.body.style.overflow = '' }
  const prevImg = (e) => { e.stopPropagation(); setLightboxIdx((p) => (p - 1 + galleryImages.length) % galleryImages.length) }
  const nextImg = (e) => { e.stopPropagation(); setLightboxIdx((p) => (p + 1) % galleryImages.length) }

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e) => { if (e.key === 'Escape') closeLightbox(); if (e.key === 'ArrowLeft') setLightboxIdx((p) => (p - 1 + galleryImages.length) % galleryImages.length); if (e.key === 'ArrowRight') setLightboxIdx((p) => (p + 1) % galleryImages.length) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen])

  return (
    <section className="gallery-section section-padding" id="gallery">
      <div className="max-shell">
        <SectionHeader eyebrow="AESTHETIC COLLECTION" title="审美收集" text="一些我喜欢的视觉设计参考，点击任意图片进入全屏浏览。" />
        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <button className="gallery-thumb" key={img.id} onClick={() => openLightbox(i)} style={{ '--stagger': i }}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}><X size={24} /></button>
          <button className="lightbox-nav lightbox-prev" onClick={prevImg}>‹</button>
          <img className="lightbox-img" src={galleryImages[lightboxIdx].src} alt={galleryImages[lightboxIdx].alt} onClick={(e) => e.stopPropagation()} />
          <button className="lightbox-nav lightbox-next" onClick={nextImg}>›</button>
          <span className="lightbox-count">{lightboxIdx + 1} / {galleryImages.length}</span>
        </div>
      )}
    </section>
  )
}

function ClosingContact() {
  return (
    <section className="closing-section" id="contact">
      <div className="max-shell closing-content">
        <span className="closing-eyebrow">CONTACT / NEXT STEP</span>
        <h2>需要一个能把 AI 数据流程做稳、做快、做成文档的人吗？</h2>
        <p>
          我可以参与 AI 训练、模型评测、数据标注质检、Prompt 自动化、知识库建设与交付复盘。
        </p>
        <div className="closing-actions">
          <a className="primary-btn" href={`mailto:${profile.email}`}>
            <Mail size={18} /> {profile.email}
          </a>
          <a className="ghost-btn" href={`tel:${profile.phone}`}>
            <Phone size={18} /> {profile.phone}
          </a>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <main>
      <Hero />
      <Profile />
      <Projects />
      <Abilities />
      <GallerySection />
      <AiNode />
      <ClosingContact />
    </main>
  )
}
