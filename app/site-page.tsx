"use client";

import { createContext, useContext, useEffect, useState, type CSSProperties } from "react";
import { KakuIdentityHero } from "./components/kaku-identity-hero";

const nav = [
  ["Forum AIR", "AI 论坛 AIR", "/forum"],
  ["Explore", "探索", "/workshops"],
  ["Ka-Ku", "认识 Ka-Ku", "/kaku/"],
  ["Membership", "会员计划", "/membership"],
  ["Community", "社群", "/community"],
  ["Calendar", "活动日历", "/calendar"],
  ["AI Pulse", "AI 动态", "/pulse"],
  ["About", "关于我们", "/about"],
];

type Lang = "en" | "zh";
const LanguageContext = createContext<{lang:Lang;setLang:(lang:Lang)=>void}>({lang:"en",setLang:()=>{}});
const useLanguage = () => useContext(LanguageContext);
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const withBase = (path:string) => path.startsWith("/") ? `${BASE_PATH}${path}` : path;
const localPath = (path:string, lang:Lang) => withBase(lang === "zh" ? `/zh${path === "/" ? "" : path}` : path);
const KAKU_365_PAYMENT_URL = "https://fgj4h8mrk8.sg.larksuite.com/share/base/form/shrlgOqgSh5gOey0V4RbRhf0R6c";
const FORUM_AIR_REGISTRATION_URL = "https://fgj4h8mrk8.sg.larksuite.com/share/base/form/shrlgvDOScY0lhvGzOraLkmKNgb";
const KAKU_GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/u/0?cid=Y18yZDUyODFhYWFiZDk3NjFhZmUwYWY5Mjc3N2YzMDg4MDgxYWI2MjA1NDYzMzFmMWJmMzZhMjZkYWYzZDBkODk4QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20";

const pageData: Record<string, { eyebrow: [string,string]; title: [string,string]; lead: [string,string] }> = {
  forum: { eyebrow: ["CST AI Forum AIR #01","CST AI Forum AIR #01"], title: ["The conversation Malaysia needs about AI.","马来西亚需要的一场 AI 对话。"], lead: ["A podcast-style community forum exploring AI Reality, Opportunity, Challenges and Readiness—through real experiences, not hype.","一个播客式社群论坛，从真实经验出发，共同探讨 AI 现实、机遇、挑战与就绪能力，而不是追逐炒作。"] },
  workshops: { eyebrow: ["FREE • 3 HOURS • BEGINNER-FRIENDLY","免费 • 3 小时 • 新手友好"], title: ["From AI curious to AI capable.","从对 AI 好奇，到真正会用 AI。"], lead: ["Practical AI foundations for everyday work, business and creation. Learn the habits behind the tools—and leave with something useful.","为工作、事业与创作打好实用 AI 基础。掌握工具背后的方法，并带走立即可用的成果。"] },
  membership: { eyebrow: ["365 DAYS OF CONTINUOUS LEARNING","365 天持续学习"], title: ["Learn. Apply. Connect. Grow.","学习、应用、连接、成长。"], lead: ["Kaku is a living learning community: a calendar of practical sessions, shared resources and people navigating change together.","Kaku 是一个持续运作的学习社群：实用活动、共享资源，以及一群共同探索变化的人。"] },
  community: { eyebrow: ["BUILT WITH MEMBERS, NOT JUST FOR THEM","由会员共同建构"], title: ["Learn something. Share something. Know a friend.","学到一点，分享一点，认识一位朋友。"], lead: ["Members become practitioners, speakers, builders and representatives by contributing what they discover and create.","会员通过分享自己的发现与创造，逐步成为实践者、讲者、建设者与社群代表。"] },
  calendar: { eyebrow: ["THE KAKU CALENDAR","KAKU 活动日历"], title: ["There is always a next step.","每一次参与，都有下一步。"], lead: ["Awareness events, onboarding, implementation workshops and member-led activities—one connected rhythm.","从公众论坛、会员入门、实作工作坊到会员共创活动，形成持续学习的节奏。"] },
  pulse: { eyebrow: ["KAKU INTELLIGENCE • DAILY","KAKU 智能动态 • 每日更新"], title: ["The AI news that matters, made understandable.","把真正重要的 AI 新闻讲明白。"], lead: ["An agentic newsroom gathers, verifies, ranks and translates the world’s AI developments into plain-language relevance for Malaysia.","智能新闻流程自动搜集、核实、筛选并解读全球 AI 发展，以马来西亚大众听得懂的方式呈现。"] },
  speakers: { eyebrow: ["VOICES OF THE COMMUNITY","社群的声音"], title: ["Experts, practitioners and builders.","专家、实践者与建设者。"], lead: ["Resident speakers, community teachers, forum panelists and guests turn experience into shared capability.","常驻讲者、社群导师、论坛嘉宾与实践者，把经验转化为共同能力。"] },
  enterprise: { eyebrow: ["CST AI ENTERPRISE","CST 企业 AI 服务"], title: ["Move from readiness to implementation.","从 AI 就绪走向真正落地。"], lead: ["Practical AI strategy, training, workflows and adoption support for teams and organisations.","为团队与组织提供实用的 AI 策略、培训、工作流程与落地支持。"] },
  about: { eyebrow: ["ABOUT THE INITIATIVE","关于 CST AI 倡议"], title: ["Navigate every era together.","携手同行，共同探索每一个时代。"], lead: ["The CST AI Initiative helps people move from AI hype to AI habit. Kaku keeps the learning continuous as technology and society evolve.","CST AI Initiative 帮助大众从 AI 热潮走向 AI 习惯；Kaku 则让学习随着科技与社会持续进化。"] },
};

type CalendarEvent = {
  category: string;
  iso: string;
  date: string;
  time: string;
  title: string;
  copy: string;
  href?: string;
};

const events: CalendarEvent[] = [
  { category: "AI for All", iso: "2026-07-25", date: "25 JUL", time: "12:00–4:00 PM", title: "CST AI Forum AIR #01", copy: "Reality, opportunity, challenges and readiness." },
  { category: "AI for All", iso: "2026-07-25", date: "25 JUL", time: "8:00–11:00 AM", title: "Practical AI for Everyday Work", copy: "Fundamentals, prompting and useful daily workflows." },
  { category: "AI for Skills", iso: "2026-08-02", date: "02 AUG", time: "8:00–9:00 PM", title: "Kaku AI Onboarding", copy: "Meet the people, calendar, resources and pathways." },
  { category: "AI for Business and Works", iso: "2026-08-03", date: "03 AUG", time: "Full day", title: "BiggIns · Full Scale Traders — Day 1", copy: "Trend-trading strategy and risk-management intensive." },
  { category: "AI for Business and Works", iso: "2026-08-04", date: "04 AUG", time: "Full day", title: "BiggIns · Full Scale Traders — Day 2", copy: "Continue the two-day strategy and risk-management intensive." },
  { category: "AI for Business and Works", iso: "2026-08-07", date: "07 AUG", time: "Time TBA", title: "BiggIns · Live Trading Gathering", copy: "Observe the market, exchange decisions and learn through live practice." },
  { category: "AI for Skills", iso: "2026-08-07", date: "07 AUG", time: "7:00–10:00 PM", title: "AI Prompt Thinking Workshop", copy: "Move from chat and prompts to loops, meta-prompting and reusable AI thinking." },
  { category: "AI for Skills", iso: "2026-08-08", date: "08 AUG", time: "9:00 AM–12:00 PM", title: "AI Prompt Thinking Workshop", copy: "Move from chat and prompts to loops, meta-prompting and reusable AI thinking." },
  { category: "AI for Business and Works", iso: "2026-08-09", date: "09 AUG", time: "2:00–3:00 PM", title: "Vibe Coding: Build a Website", copy: "A one-hour community speaker session." },
  { category: "AI for Business and Works", iso: "2026-08-12", date: "12 AUG", time: "Time TBA", title: "BiggIns · Preview Class", copy: "Discover the AI-ready trader foundation and the 1% learning pathway." },
  { category: "Community and Life Interests", iso: "2026-08-16", date: "16 AUG", time: "2:00–4:00 PM", title: "Lunavera Crossover · Signature Scent Experience", copy: "Make your own perfume and explore scent as personal expression.", href: "https://lunavera.space/" },
  { category: "Community and Life Interests", iso: "2026-08-16", date: "16 AUG", time: "8:00–9:00 PM", title: "Prompt Jam", copy: "Bring one problem. Build and compare prompt loops." },
  { category: "Community and Life Interests", iso: "2026-08-18", date: "18 AUG", time: "8:00–10:00 PM", title: "Lunavera Crossover · Wine Yoga", copy: "Connect and destress through a relaxed shared yoga experience.", href: "https://lunavera.space/" },
  { category: "AI for Business and Works", iso: "2026-08-19", date: "19 AUG", time: "Time TBA", title: "BiggIns · AI Trader Foundation — The 1% Playbook", copy: "Master the Basics. Trade Smarter. Become AI-Ready." },
  { category: "AI for Skills", iso: "2026-08-22", date: "22 AUG", time: "9:00 AM–12:00 PM", title: "AI Prompt Thinking Workshop", copy: "Move from chat and prompts to loops, meta-prompting and reusable AI thinking." },
  { category: "Community and Life Interests", iso: "2026-08-23", date: "23 AUG", time: "8:00–10:00 AM", title: "Lunavera Crossover · Forest Bath Yoga", copy: "Reconnect and destress through forest bathing and yoga.", href: "https://lunavera.space/" },
  { category: "AI for Business and Works", iso: "2026-08-26", date: "26 AUG", time: "Time TBA", title: "BiggIns · Preview Class", copy: "Discover the AI-ready trader foundation and the 1% learning pathway." },
  { category: "Community and Life Interests", iso: "2026-08-27", date: "27 AUG", time: "2:00–4:00 PM", title: "Lunavera Crossover · Coffee Tasting Experience", copy: "Know your beans and make your own coffee drip bag.", href: "https://lunavera.space/" },
];

const learning = [
  ["01", "AI foundations", "Practical AI, productivity and prompt thinking for day-to-day work."],
  ["02", "AI workflows", "Agents, automation, dashboards and repeatable business systems."],
  ["03", "AI creation", "Images, video, filmmaking, content and media production."],
  ["04", "Vibe coding", "Websites, apps, games, prototypes and useful internal tools."],
  ["05", "AI leadership", "Systems, leverage, decision intelligence and self-organisation."],
];

const categoryZh: Record<string,string> = {
  "AI for All":"全民 AI",
  "AI for Skills":"AI 技能",
  "AI for Business and Works":"AI 商业与工作",
  "Community and Life Interests":"社群与生活兴趣",
};

const eventZh: Record<string,{title:string;copy:string;date:string;time:string}> = {
  "CST AI Forum AIR #01":{title:"CST AI 论坛 AIR #01",copy:"共同讨论 AI 现实、机遇、挑战与就绪能力。",date:"7月25日",time:"中午12:00–下午4:00"},
  "Practical AI for Everyday Work":{title:"日常工作实用 AI",copy:"掌握 AI 基础、提示方法与日常实用工作流程。",date:"7月25日",time:"上午8:00–11:00"},
  "Kaku AI Onboarding":{title:"Kaku AI 会员入门",copy:"认识社群伙伴、活动日历、学习资源与成长路径。",date:"8月2日",time:"晚上8:00–9:00"},
  "Vibe Coding: Build a Website":{title:"氛围编程：建立网站",copy:"由社群讲者带领的一小时实作分享。",date:"8月9日",time:"下午2:00–3:00"},
  "Prompt Jam":{title:"提示词共创会",copy:"带来一个真实问题，一起建立并比较不同的提示循环。",date:"8月16日",time:"晚上8:00–9:00"},
  "2026-08-03|BiggIns · Full Scale Traders — Day 1":{title:"BiggIns · 两天全面交易课程 — 第一天",copy:"趋势交易策略与风险管理密集课程。",date:"8月3日",time:"全天"},
  "2026-08-04|BiggIns · Full Scale Traders — Day 2":{title:"BiggIns · 两天全面交易课程 — 第二天",copy:"继续深入趋势交易策略与风险管理。",date:"8月4日",time:"全天"},
  "2026-08-07|BiggIns · Live Trading Gathering":{title:"BiggIns · 实盘交易聚会",copy:"共同观察市场、交流判断，并从实盘中学习。",date:"8月7日",time:"时间待公布"},
  "2026-08-07|AI Prompt Thinking Workshop":{title:"AI 提示思维工作坊",copy:"从 Chat、Prompt 到 Loop 与 Meta-Prompting，建立可重复使用的 AI 思考方法。",date:"8月7日",time:"晚上7:00–10:00"},
  "2026-08-08|AI Prompt Thinking Workshop":{title:"AI 提示思维工作坊",copy:"从 Chat、Prompt 到 Loop 与 Meta-Prompting，建立可重复使用的 AI 思考方法。",date:"8月8日",time:"上午9:00–中午12:00"},
  "2026-08-12|BiggIns · Preview Class":{title:"BiggIns · 预览课",copy:"认识 AI 交易员基础与 1% 实战学习路径。",date:"8月12日",time:"时间待公布"},
  "2026-08-16|Lunavera Crossover · Signature Scent Experience":{title:"Lunavera 联名体验 · 个人香氛工作坊",copy:"亲手调制属于自己的香水，透过气味探索感官与个人表达。",date:"8月16日",time:"下午2:00–4:00"},
  "2026-08-18|Lunavera Crossover · Wine Yoga":{title:"Lunavera 联名体验 · 红酒瑜伽",copy:"在轻松的瑜伽体验中连结彼此、释放压力。",date:"8月18日",time:"晚上8:00–10:00"},
  "2026-08-19|BiggIns · AI Trader Foundation — The 1% Playbook":{title:"BiggIns · AI 交易员基础 — 1% 实战手册",copy:"掌握基础，聪明交易，迈向 AI Ready。",date:"8月19日",time:"时间待公布"},
  "2026-08-22|AI Prompt Thinking Workshop":{title:"AI 提示思维工作坊",copy:"从 Chat、Prompt 到 Loop 与 Meta-Prompting，建立可重复使用的 AI 思考方法。",date:"8月22日",time:"上午9:00–中午12:00"},
  "2026-08-23|Lunavera Crossover · Forest Bath Yoga":{title:"Lunavera 联名体验 · 森林浴瑜伽",copy:"走进自然，通过森林浴与瑜伽重新连结身心。",date:"8月23日",time:"上午8:00–10:00"},
  "2026-08-26|BiggIns · Preview Class":{title:"BiggIns · 预览课",copy:"认识 AI 交易员基础与 1% 实战学习路径。",date:"8月26日",time:"时间待公布"},
  "2026-08-27|Lunavera Crossover · Coffee Tasting Experience":{title:"Lunavera 联名体验 · 咖啡品鉴",copy:"认识咖啡豆风味，并亲手制作自己的咖啡滤泡包。",date:"8月27日",time:"下午2:00–4:00"},
};

const displayEvent = (e:typeof events[number],lang:Lang) => lang==="zh"
  ? {...e,category:categoryZh[e.category]||e.category,...(eventZh[`${e.iso}|${e.title}`]||eventZh[e.title]||{})}
  : e;

function AssetSlot({ label, tall = false }: { label: string; tall?: boolean }) {
  const {lang}=useLanguage();
  return <div className={`asset-slot ${tall ? "tall" : ""}`}><span>{lang==="zh"?"内容位置":"CONTENT SLOT"}</span><strong>{label}</strong><small>{lang==="zh"?"请替换为已核准的照片或视频":"Replace with approved photography / video"}</small></div>;
}

function Photo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <figure className={`photo ${className}`}><img src={withBase(src)} alt={alt} /></figure>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const {lang,setLang}=useLanguage();
  return <header>
    <a className="brand" href={localPath("/",lang)}>
      <span className="brand-mark"><img src={withBase("/assets/brand/cst-logo-black.png")} alt="CST" /></span>
      <span>{lang==="zh"?"AI 倡议":"AI Initiative"}<small>{lang==="zh"?"由 Kaku 社群推动":"Powered by Kaku"}</small></span>
    </a>
    <nav className={open ? "open" : ""}>{nav.map(([en,zh,href]) => <a key={href} href={href==="/kaku/"?withBase(href):localPath(href,lang)}>{lang==="zh"?zh:en}</a>)}</nav>
    <div className="header-actions"><div className="language-switch" aria-label="Language"><button className={lang==="en"?"active":""} onClick={()=>setLang("en")}>EN</button><span>/</span><button className={lang==="zh"?"active":""} onClick={()=>setLang("zh")}>中文</button></div><a className="button compact" href={FORUM_AIR_REGISTRATION_URL} target="_blank" rel="noreferrer">{lang==="zh"?"立即报名":"Register"} <span>↗</span></a></div>
    <button className="menu" onClick={() => setOpen(!open)} aria-label={lang==="zh"?"开启或关闭菜单":"Toggle menu"}>☰</button>
  </header>;
}

function Footer() {
  const {lang}=useLanguage();
  return <footer><div><div className="brand"><span className="brand-mark"><img src={withBase("/assets/brand/cst-logo-black.png")} alt="CST" /></span><span>{lang==="zh"?"AI 倡议":"AI Initiative"}<small>{lang==="zh"?"从 AI 热潮走向 AI 习惯":"From AI hype to AI habit."}</small></span></div></div><div><strong>{lang==="zh"?"探索":"Explore"}</strong><a href={localPath("/forum",lang)}>{lang==="zh"?"AI 论坛 AIR":"Forum AIR"}</a><a href={localPath("/workshops",lang)}>{lang==="zh"?"免费工作坊":"Free workshops"}</a><a href={localPath("/membership",lang)}>{lang==="zh"?"Kaku 会员计划":"Kaku membership"}</a></div><div><strong>{lang==="zh"?"参与":"Participate"}</strong><a href={localPath("/calendar",lang)}>{lang==="zh"?"活动日历":"Calendar"}</a><a href={localPath("/community",lang)}>{lang==="zh"?"社群":"Community"}</a><a href={localPath("/enterprise",lang)}>{lang==="zh"?"企业服务":"Enterprise"}</a></div><div><strong>{lang==="zh"?"联系我们":"Contact"}</strong><a href="mailto:anna@cst.training">anna@cst.training</a><a href="https://wa.me/60186606731" target="_blank" rel="noreferrer">WhatsApp · 018-660 6731</a><span>{lang==="zh"?"马来西亚":"Malaysia"}</span></div></footer>;
}

function Home() {
  const {lang}=useLanguage();
  const worlds=lang==="zh"?[
    {no:"01",eyebrow:"AI 论坛 AIR",title:"看见 AI 时代",copy:"一个播客式公共论坛，让不同背景的人一起讨论 AI 现实、机遇、挑战与就绪能力。",cta:"进入论坛",href:"/forum",image:"/assets/events/forum-air/cst-audience.jpg"},
    {no:"02",eyebrow:"实用 AI 课堂",title:"从好奇到会用",copy:"三小时建立 AI 基础、提示思维与日常工作流程，把 AI 热潮转化成真正的 AI 习惯。",cta:"探索免费课堂",href:"/workshops",image:"/assets/learning/prompt-thinking/prompt-thinking-class.png"},
    {no:"03",eyebrow:"KAKU 学习社群",title:"一起学习与进化",copy:"365 天持续学习、应用、分享与连接。课程带来能力，社群让学习持续发生。",cta:"认识 Kaku",href:"/community",image:"/assets/events/community/cst-538.jpg"}
  ]:[
    {no:"01",eyebrow:"AI FORUM AIR",title:"See the AI era",copy:"A podcast-style public forum where different perspectives meet AI Reality, Opportunity, Challenges and Readiness.",cta:"Enter the forum",href:"/forum",image:"/assets/events/forum-air/cst-audience.jpg"},
    {no:"02",eyebrow:"PRACTICAL AI CLASSES",title:"From curious to capable",copy:"Three practical hours to build AI foundations, prompt thinking and everyday workflows—from AI hype to AI habit.",cta:"Explore free classes",href:"/workshops",image:"/assets/learning/prompt-thinking/prompt-thinking-class.png"},
    {no:"03",eyebrow:"KAKU LEARNING COMMUNITY",title:"Learn and evolve together",copy:"365 days to learn, apply, share and connect. Courses build capability; community keeps learning alive.",cta:"Meet Kaku",href:"/community",image:"/assets/events/community/cst-538.jpg"}
  ];
  const pathway=lang==="zh"?[
    ["提示","AI 提示思维","用语言与 AI 一起思考"],
    ["系统","系统与杠杆","看见关系、反馈与关键杠杆点"],
    ["决策","决策智能","在不确定中做更好的选择"],
    ["社群","社群与自组织","建立能够持续进化的共同体"]
  ]:[
    ["PROMPT","AI Prompt Thinking","Use language to think with AI"],
    ["SYSTEM","Systems & Leverage","See relationships, feedback and leverage"],
    ["DECIDE","Decision Intelligence","Choose better under uncertainty"],
    ["ORGANISE","Community & Self-Organisation","Build communities that keep evolving"]
  ];
  return <>
    <KakuIdentityHero protocol={lang==="zh"?"系统在线 // CST_AI_倡议 // KAKU_协议_V2":"SYSTEM ONLINE // CST_AI_INITIATIVE // KAKU_PROTOCOL_V2"} eyebrow={lang==="zh"?"CST AI 倡议 · KAKU 社群":"CST AI INITIATIVE · KAKU COMMUNITY"} headline={lang==="zh"?<>一起学习。<br/><em>一起进化。</em></>:<>We learn.<br/><em>We evolve.</em></>} description={lang==="zh"?"连接真实的人、实用的 AI 与持续学习的社群，一起探索 AI 时代，也一起探索未来的每一个时代。":"Connecting real people, practical AI and a continuously learning community—to navigate the AI era and every era after it."} primaryLabel={lang==="zh"?"加入下一场对话":"Join the next conversation"} primaryHref={FORUM_AIR_REGISTRATION_URL} primaryExternal secondaryLabel={lang==="zh"?"探索 Kaku":"Explore Kaku"} secondaryHref={localPath("/community",lang)} identityLabel={lang==="zh"?"持续学习协议已启动":"CONTINUOUS LEARNING PROTOCOL ACTIVE"} imageAlt={lang==="zh"?"Ka-Ku 黑猩猩身份协议":"Ka-Ku chimpanzee identity protocol"} scrollLabel={lang==="zh"?"向下探索":"SCROLL TO EXPLORE"}/>
    <section className="wow-manifesto"><p className="eyebrow dark">{lang==="zh"?"为什么是 AI · 为什么是现在":"WHY AI · WHY NOW"}</p><h2>{lang==="zh"?<>AI 不只是信息革命。<br/>它是一场<em>认知革命。</em></>:<>AI is more than an information revolution.<br/>It is a <em>cognitive revolution.</em></>}</h2><p>{lang==="zh"?"我们创造连接、体验与学习路径，让不同背景的人从 AI 热潮走向 AI 习惯，并在变化中找到自己的位置。":"We create connections, experiences and learning pathways that move people from AI hype to AI habit—and help them find their place in a changing world."}</p></section>
    <section className="wow-proof"><article className="wow-proof-number"><strong>365</strong><span>{lang==="zh"?"天持续学习":"DAYS OF LEARNING"}</span></article><Photo src="/assets/events/community/cst-276.jpg" alt={lang==="zh"?"Kaku 社群交流":"Kaku community gathering"}/><article><strong>4</strong><span>{lang==="zh"?"条旗舰学习路径":"FLAGSHIP PATHWAYS"}</span></article><Photo src="/assets/events/forum-air/cst-keynote.jpg" alt={lang==="zh"?"CST AI 论坛现场":"CST AI forum keynote"}/><article><strong>1</strong><span>{lang==="zh"?"个共同成长的社群":"COMMUNITY, GROWING TOGETHER"}</span></article></section>
    <section className="wow-worlds"><div className="wow-section-title"><p className="eyebrow dark">{lang==="zh"?"进入我们的世界":"ENTER THE ECOSYSTEM"}</p><h2>{lang==="zh"?"从一场对话开始。":"It starts with a conversation."}</h2></div>{worlds.map((w,i)=><article className={`wow-world ${i%2?"reverse":""}`} key={w.no}><div className="wow-world-image"><Photo src={w.image} alt={w.title}/><span>{w.no}</span></div><div className="wow-world-copy"><p>{w.eyebrow}</p><h3>{w.title}</h3><div>{w.copy}</div><a className="wow-round-link" href={localPath(w.href,lang)}>{w.cta}<span>→</span></a></div></article>)}</section>
    <section className="wow-pathway"><div className="wow-section-title light"><p className="eyebrow">{lang==="zh"?"完整学习路径":"THE LEARNING COLLECTION"}</p><h2>{lang==="zh"?"工具会改变，思维会留下。":"Tools change. Thinking remains."}</h2></div><div className="wow-pathway-strip">{pathway.map((x,i)=><a href={localPath("/workshops",lang)} key={x[0]}><span>0{i+1}</span><small>{x[0]}</small><h3>{x[1]}</h3><p>{x[2]}</p><b>↗</b></a>)}</div></section>
    <section className="wow-community-wall"><div className="wow-section-title"><p className="eyebrow dark">{lang==="zh"?"被看见 · 被分享 · 被连接":"SEEN · SHARED · CONNECTED"}</p><h2>{lang==="zh"?"社群让学习持续发生。":"Community keeps learning alive."}</h2></div><div className="wow-wall-grid"><article className="quote-card"><span>“</span><p>{lang==="zh"?"每一位 Kaku 会员，都应该学到一点、分享一点、连接一点，并认识一位新朋友。":"Every Kaku member should learn something, share something, connect something—and know one new friend."}</p></article><Photo src="/assets/events/community/cst-510.jpg" alt={lang==="zh"?"会员分享观点":"Member sharing an idea"}/><Photo src="/assets/learning/prompt-thinking/prompt-thinking-community.png" alt={lang==="zh"?"提示思维学习社群":"Prompt Thinking learning community"}/><article className="pulse-card"><p>AI PULSE</p><h3>{lang==="zh"?"把全球 AI 动态，变成人人听得懂的共同讨论。":"Turn global AI developments into conversations everyone can understand."}</h3><a href={localPath("/pulse",lang)}>{lang==="zh"?"查看 AI 动态":"Explore AI Pulse"} ↗</a></article><Photo src="/assets/events/community/cst-458.jpg" alt={lang==="zh"?"社群共同学习":"Community learning together"}/></div></section>
    <div className="wow-marquee" aria-label={lang==="zh"?"携手探索每一个时代":"Navigating every era together"}><div>{Array(4).fill(lang==="zh"?"携手探索每一个时代 · ":"NAVIGATING EVERY ERA TOGETHER · ").join("")}</div></div>
    <section className="wow-final"><div className="wow-final-orbit"><img src={withBase("/assets/brand/kaku-identity.png")} alt="Ka-Ku"/></div><p className="eyebrow">{lang==="zh"?"持续学习 · 共同进化":"CONTINUOUS LEARNING · COLLECTIVE EVOLUTION"}</p><h2>{lang==="zh"?"一起走进 AI 时代。":"Navigate the AI era together."}</h2><p>{lang==="zh"?"参加 Forum AIR，体验一堂实用 AI 课堂，或加入 Kaku 365 天学习社群。":"Join Forum AIR, experience a practical AI class, or enter the Kaku 365-day learning community."}</p><div className="actions"><a className="button" href={FORUM_AIR_REGISTRATION_URL} target="_blank" rel="noreferrer">{lang==="zh"?"报名 Forum AIR":"Register for Forum AIR"} ↗</a><a className="wow-round-link" href={localPath("/membership",lang)}>{lang==="zh"?"探索会员计划":"Explore membership"}<span>→</span></a></div></section>
  </>;
}

function EventCard({e}:{e:typeof events[number]}) {
 const {lang}=useLanguage();
 const isForum=e.title.includes("Forum AIR");
 const externalHref=isForum?FORUM_AIR_REGISTRATION_URL:e.href;
 const shown=displayEvent(e,lang);
 return <article className="event-card"><span className="tag">{shown.category}</span><div className="event-date"><strong>{shown.date}</strong><span>{shown.time}</span></div><h3>{shown.title}</h3><p>{shown.copy}</p><a href={externalHref||localPath("/calendar",lang)} target={externalHref?"_blank":undefined} rel={externalHref?"noreferrer":undefined}>{isForum?(lang==="zh"?"立即报名":"Register now"):e.href?(lang==="zh"?"认识合作伙伴":"Visit partner"):(lang==="zh"?"查看详情":"Details")} ↗</a></article>
}

function MembershipStrip() {
 const {lang}=useLanguage();
 return <section className="membership-strip"><div><p className="eyebrow">KAKU {lang==="zh"?"会员计划":"MEMBERSHIP"}</p><h2>{lang==="zh"?"365 天，持续学习、应用、连接与成长。":"365 days to learn, apply, connect and grow."}</h2><p>{lang==="zh"?"加入持续学习社群，或选择完整的四大进阶课程路径。":"Join the continuous learning community—or take the complete cohort pathway."}</p></div><article><span>KAKU 365</span><strong>RM365<small>/ {lang==="zh"?"年":"year"}</small></strong><p>{lang==="zh"?"社群、会员入门、资源库，以及按日历开放的 AI 提示思维课程。":"Community, onboarding, resources and scheduled AI Prompt Thinking."}</p><a className="button white" href={KAKU_365_PAYMENT_URL} target="_blank" rel="noreferrer">{lang==="zh"?"立即注册与付款":"Register & pay"} →</a></article><article className="featured"><span>KAKU GO</span><strong>RM1,825<small>/ {lang==="zh"?"年":"year"}</small></strong><p>{lang==="zh"?"包含 Kaku 365 的所有权益，以及四大旗舰课程。":"Everything in 365 plus the four flagship cohort programmes."}</p><a className="button" href={localPath("/membership",lang)}>{lang==="zh"?"了解 Kaku Go":"Explore Go"} →</a></article></section>;
}

function MonthlyCalendar({visibleEvents,lang}:{visibleEvents:typeof events;lang:Lang}) {
 const [month,setMonth]=useState(new Date(2026,7,1));
 const first=new Date(month.getFullYear(),month.getMonth(),1);
 const start=new Date(first);
 start.setDate(first.getDate()-first.getDay());
 const days=Array.from({length:42},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d});
 const weekdays=lang==="zh"?["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
 const label=new Intl.DateTimeFormat(lang==="zh"?"zh-CN":"en-MY",{month:"long",year:"numeric"}).format(month);
 const iso=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
 const cat=(c:string)=>c==="AI for All"?"cat-all":c==="AI for Skills"?"cat-skills":c==="AI for Business and Works"?"cat-business":"cat-community";
 return <section className="month-calendar" aria-label={lang==="zh"?"完整月历":"Full month calendar"}>
  <div className="month-toolbar"><div><span className="eyebrow">{lang==="zh"?"月历总览":"MONTHLY OVERVIEW"}</span><h2>{label}</h2></div><div className="month-nav"><button type="button" aria-label={lang==="zh"?"上个月":"Previous month"} onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}>←</button><button type="button" aria-label={lang==="zh"?"下个月":"Next month"} onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}>→</button></div></div>
  <div className="month-scroll"><div className="month-weekdays">{weekdays.map(w=><span key={w}>{w}</span>)}</div><div className="month-grid">{days.map(day=>{const key=iso(day);const dayEvents=visibleEvents.filter(e=>e.iso===key);return <div className={`month-day${day.getMonth()!==month.getMonth()?" outside":""}`} key={key}><span className="month-number">{day.getDate()}</span><div className="month-events">{dayEvents.map(e=>{const forum=e.title.includes("Forum AIR");const href=forum?FORUM_AIR_REGISTRATION_URL:e.href;const shown=displayEvent(e,lang);return <a className={`month-event ${cat(e.category)}`} href={href||localPath("/calendar",lang)} target={href?"_blank":undefined} rel={href?"noreferrer":undefined} key={`${e.iso}-${e.title}-${e.time}`}><small>{shown.time}</small><strong>{shown.title}</strong></a>})}</div></div>})}</div></div>
  <div className="month-legend"><span className="cat-all">{lang==="zh"?"全民 AI":"AI for All"}</span><span className="cat-skills">{lang==="zh"?"AI 技能":"AI for Skills"}</span><span className="cat-business">{lang==="zh"?"AI 商业与工作":"AI for Business and Works"}</span><span className="cat-community">{lang==="zh"?"社群与生活兴趣":"Community and Life Interests"}</span></div>
 </section>;
}

function Calendar() {
 const {lang}=useLanguage();
 const [filter,setFilter]=useState("All");
 const [calendarEvents,setCalendarEvents]=useState<CalendarEvent[]>(events);
 const [synced,setSynced]=useState(false);
 const categories=["AI for All","AI for Skills","AI for Business and Works","Community and Life Interests"];
 useEffect(()=>{
   fetch(withBase("/calendar-events.json"),{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject()).then((data:CalendarEvent[])=>{if(Array.isArray(data)&&data.length){setCalendarEvents(data);setSynced(true)}}).catch(()=>{});
 },[]);
 const filtered=calendarEvents.filter(e=>filter==="All"||e.category===filter);
 return <><InnerHero page="calendar"/><section className="calendar-section"><div className="calendar-live-bar"><div><span className={`sync-dot ${synced?"active":""}`}/><p><strong>{lang==="zh"?"Kaku Google Calendar 已连接":"Connected to Kaku Google Calendar"}</strong><small>{lang==="zh"?"后台更新会自动同步，网页仍使用 Ka-Ku 原本设计。":"Backend updates sync automatically while the website keeps the original Ka-Ku design."}</small></p></div><a href={KAKU_GOOGLE_CALENDAR_URL} target="_blank" rel="noreferrer">{lang==="zh"?"查看 Google Calendar":"View Google Calendar"} ↗</a></div><div className="filters">{["All",...categories].map(f=><button className={filter===f?"active":""} onClick={()=>setFilter(f)} key={f}>{f==="All"?(lang==="zh"?"所有活动":"All events"):(lang==="zh"?categoryZh[f]:f)}</button>)}</div><div className="calendar-grid">{filtered.map(e=><EventCard key={`${e.iso}-${e.title}-${e.time}`} e={e}/>)}</div><MonthlyCalendar visibleEvents={filtered} lang={lang}/><div className="calendar-contact"><span>🐵</span><p>{lang==="zh"?"想预留座位？请私讯 Anna：018-660 6731。部分活动已满额；Chimps 会员可享有指定活动的免费席位或专属优惠价。":"Want to reserve a seat? PM Anna at 018-660 6731. Some events may be fully booked; selected events include complimentary seats or exclusive Chimps member rates."}</p><a href="https://wa.me/60186606731" target="_blank" rel="noreferrer">WhatsApp Anna ↗</a></div></section></>;
}

function Pulse() {
 const {lang}=useLanguage();
 const steps=lang==="zh"?["搜集可信来源","核实并去除重复资讯","归纳相关报道","评估相关性与影响","以浅白语言解读","人工审核关卡","发布并持续学习"]:["Gather trusted sources","Verify & deduplicate","Cluster related stories","Score relevance & impact","Explain in plain language","Human review gate","Publish & learn"];
 return <><InnerHero page="pulse"/><section className="pulse-flow">{steps.map((s,i)=><div key={s}><span>0{i+1}</span><h3>{s}</h3><p>{lang==="zh"?(i===0?"从官方实验室、研究机构、监管单位与可信媒体搜集资讯。":i===5?"在自动公开发布高影响内容前，建议由人员完成审核。":"保留消息来源轨迹，并透过反馈持续优化的智能循环。"):(i===0?"Official labs, research, regulators and reputable reporting.":i===5?"Recommended before public auto-publishing high-impact claims.":"Agentic loop with source traceability and feedback.")}</p></div>)}</section><section className="light-section"><div className="section-head"><div><p className="eyebrow dark">{lang==="zh"?"每日输出":"DAILY OUTPUT"}</p><h2>{lang==="zh"?"一则新闻，五种实用视角。":"One story. Five useful views."}</h2></div></div><div className="audience-cards">{(lang==="zh"?["大众","中小企业主","专业人士","教育工作者","社群领导者"]:["Everyone","SME owners","Professionals","Educators","Community leaders"]).map(x=><article key={x}><span>{x}</span><h3>{lang==="zh"?"为什么与我有关？":"Why should I care?"}</h3><p>{lang==="zh"?"以浅白语言说明背景、可能影响，以及一个可以立即采取的行动。":"Plain-language context, likely impact and one practical next step."}</p></article>)}</div></section></>;
}

function Membership() {
 const {lang}=useLanguage();
 return <><InnerHero page="membership"/><MembershipStrip/><section className="journey"><div><p className="eyebrow dark">{lang==="zh"?"会员体验":"MEMBER EXPERIENCE"}</p><h2>{lang==="zh"?"从加入，到成为贡献者。":"From joining to contributing."}</h2></div><div className="loop">{(lang==="zh"?["加入","入门","学习","应用","分享","带领"]:["Join","Onboard","Learn","Apply","Share","Lead"]).map((x,i)=><div key={x}><span>{i+1}</span>{x}</div>)}</div></section><section className="comparison"><h2>{lang==="zh"?"两种进入 Kaku 生态系统的方式。":"Two ways to enter the ecosystem."}</h2><div><article><span>KAKU 365</span><h3>{lang==="zh"?"持续学习":"Continuous learning"}</h3><ul>{(lang==="zh"?["365 天会员资格","Kaku AI 会员入门","每月学习交流活动","会员资源库","社群活动","按活动日历开放的 AI 提示思维课程"]:["365-day membership","Kaku AI Onboarding","Monthly learning touchpoints","Resource library","Community activities","Scheduled Prompt Thinking access"]).map(x=><li key={x}>{x}</li>)}</ul><a className="button dark-button" href={KAKU_365_PAYMENT_URL} target="_blank" rel="noreferrer">{lang==="zh"?"注册并支付 RM365":"Register & pay RM365"} →</a></article><article className="accent-card"><span>KAKU GO</span><h3>{lang==="zh"?"完整学习路径":"Complete pathway"}</h3><ul>{(lang==="zh"?["包含 Kaku 365 的全部权益","AI 提示思维","系统思维与杠杆","决策智能","社群与自组织","建设者与讲者成长路径"]:["Everything in Kaku 365","AI Prompt Thinking","Systems & Leverage","Decision Intelligence","Community & Self-Organisation","Builder and speaker pathways"]).map(x=><li key={x}>{x}</li>)}</ul><a className="button" href={`${localPath("/workshops",lang)}#systems-pathway`}>{lang==="zh"?"查看完整课程路径与影像":"View the pathway & visual"} →</a></article></div></section></>;
}

function Workshops() {
 const {lang}=useLanguage();
 useEffect(()=>{
  const pathway=document.querySelector(".classroom");
  pathway?.setAttribute("id","systems-pathway");
  if(location.hash==="#systems-pathway") pathway?.scrollIntoView({behavior:"smooth",block:"start"});
 },[]);
 const workshops=lang==="zh"?[["日常工作实用 AI","3 小时 · 免费","认识 AI、掌握取得更好结果的提示方法，并应用到真实工作。"],["AI 媒体创作","3 小时 · 免费","从创意、文案、图像到短视频概念，完成一个简单的推广活动。"],["建立你的 AI 工作流程","3 小时 · 免费","把记录、厘清、生成、检查、改进、储存与重复使用连接起来。"]]:[["Practical AI for Everyday Work","3 hours · Free","Understand AI, prompt for better results and apply it to real work."],["AI Media Creation","3 hours · Free","Build a simple campaign from idea to copy, image and video concept."],["Build Your AI Workflow","3 hours · Free","Connect capture, clarify, generate, check, improve, store and reuse."]];
 const classroom=lang==="zh"?[
   ["01","AI 提示思维","学会设定情境、持续对话与检查判断，让 AI 从聊天工具成为思考伙伴。",["提示思维","人机协作","工作流程应用"]],
   ["02","系统思维与杠杆","看见事件背后的结构、关系与循环，运用十二个杠杆点寻找更有影响力的行动。",["结构化思维","十二个杠杆点","系统诊断"]],
   ["03","决策智能","面对真正的两难与不确定性，识别认知偏误，建立更清晰的决策结构。",["决策架构","真实两难实验室","战略思考"]],
   ["04","社群与自组织","设计能够持续学习、分享知识与自我进化的社群系统，减少对单向指令的依赖。",["社群架构","知识分享","内在动力循环"]]
 ]:[
   ["01","AI Prompt Thinking","Strengthen context-setting, iterative dialogue and the human judgement needed to work meaningfully with AI.",["Prompt Thinking","Human–AI collaboration","Workflow application"]],
   ["02","Systems & Leverage","See the structures, relationships and recurring patterns beneath events—and find higher-impact places to intervene.",["Structural thinking","12 Leverage Points","System diagnosis"]],
   ["03","Decision Intelligence","Process genuine dilemmas, recognise cognitive biases and make stronger decisions under uncertainty.",["Decision architecture","Live dilemma labs","Strategic thinking"]],
   ["04","Community & Self-Organisation","Design learning structures that continue beyond formal training and reduce dependence on top-down direction.",["Community architecture","Knowledge sharing","Intrinsic motivation loops"]]
 ];
 return <><InnerHero page="workshops"/><section className="explore-intro"><p className="eyebrow dark">{lang==="zh"?"从这里开始":"START HERE"}</p><h2>{lang==="zh"?"先体验实用 AI，建立你的第一个 AI 习惯。":"Experience practical AI. Build your first useful habit."}</h2></section><section className="workshop-grid">{workshops.map((w,i)=><article key={w[0]}><span>0{i+1}</span><p className="tag">{w[1]}</p><h2>{w[0]}</h2><p>{w[2]}</p><ul>{(lang==="zh"?["现场示范","动手实践","一套可重复使用的工作流程"]:["Live demonstrations","Hands-on practice","One reusable workflow"]).map(x=><li key={x}>{x}</li>)}</ul><a href="#">{lang==="zh"?"报名链接待补":"Registration link required"} ↗</a></article>)}</section><section className="classroom"><div className="classroom-head"><div><p className="eyebrow">{lang==="zh"?"KAKU GO · RM1,825 / 年":"KAKU GO · RM1,825 / YEAR"}</p><h2>{lang==="zh"?"学习课堂":"Learning Classroom"}</h2></div><div><strong>{lang==="zh"?"从使用工具，到提升思维、判断与共创能力。":"From using tools to strengthening how you think, decide and build with others."}</strong><p>{lang==="zh"?"Kaku Go 会员可在会员年度内，根据课程日历与席位安排，参与四大旗舰学习路径。":"Kaku Go members can access the four flagship learning pathways during their membership year, subject to the published calendar and seat availability."}</p><a className="button" href={localPath("/membership",lang)}>{lang==="zh"?"了解 Kaku Go":"Explore Kaku Go"} →</a></div></div><div className="classroom-story"><div className="classroom-story-media"><video autoPlay muted loop playsInline preload="metadata" poster={withBase("/assets/learning/systems/donella-meadows-sophia.jpg")}><source src={withBase("/assets/learning/systems/donella-meadows-sophia.mp4")} type="video/mp4"/></video><div className="story-media-overlay"><span>{lang==="zh"?"跨越思想与时代的对话":"A CONVERSATION ACROSS IDEAS & ERAS"}</span><strong>Donella Meadows × Sophia Tey</strong><small>{lang==="zh"?"AI 创作概念影像":"AI-CREATED CONCEPT VISUAL"}</small></div></div><div><p className="eyebrow">{lang==="zh"?"课程路径的教学背景":"WHY THIS PATHWAY"}</p><h3>{lang==="zh"?"真正困难的，不只是解决问题，而是理解为什么同样的问题不断回来。":"The real challenge is not solving one problem. It is understanding why the same problem keeps returning."}</h3></div><div><p>{lang==="zh"?"员工换了一批，团队的问题仍然存在；策略更新了，组织却没有真正改变；投入更多资源，结果依然不如预期。很多时候，我们缺少的不是努力，而是还没有看见问题背后的结构、关系、信息流动与反馈机制。":"Teams change, strategies are rewritten and more resources are invested—yet familiar problems return. The missing piece is often not effort, but the ability to see the structures, relationships, information flows and feedback loops beneath the visible event."}</p><p>{lang==="zh"?"受到 Donella Meadows《系统之美》与十二个杠杆点的启发，这条完整课程路径把 AI 视为思考伙伴：帮助领导者探索不同决定的影响、识别隐藏的模式，并找到能够以更少资源创造更大影响的关键介入点。":"Inspired by Donella Meadows’ Thinking in Systems and the twelve leverage points, this pathway treats AI as a thinking partner—helping leaders explore consequences, surface hidden patterns and find interventions capable of creating greater impact with fewer resources."}</p><blockquote>{lang==="zh"?"未来的领导力，不只是拥有更多答案，而是能够看见整个系统，并创造一个可以持续成长的系统。":"Future leadership is not about having more answers. It is about seeing the whole system—and creating one that can continue to learn and grow."}</blockquote></div></div><div className="classroom-grid">{classroom.map(c=><article key={c[0] as string}><span>{c[0] as string}</span><h3>{c[1] as string}</h3><p>{c[2] as string}</p><ul>{(c[3] as string[]).map(x=><li key={x}>{x}</li>)}</ul></article>)}</div><div className="classroom-outcomes"><p>{lang==="zh"?"你将带走":"WHAT CHANGES"}</p>{(lang==="zh"?["共同的思考语言","更清晰的系统诊断","更高影响力的优先次序","更成熟的决策能力","更精准的人机协作","持续发生的社群学习"]:["A shared thinking language","Structural diagnosis","Higher-impact priorities","Decision intelligence","Precision AI collaboration","Learning that continues"]).map((x,i)=><span key={x}><b>0{i+1}</b>{x}</span>)}</div></section><section className="prompt-feature"><div><p className="eyebrow">{lang==="zh"?"AI 提示思维":"AI PROMPT THINKING"}</p><h2>{lang==="zh"?"从寻找答案，到构建思维。":"From asking for answers to building thinking."}</h2><p>{lang==="zh"?"工具会改变，但提问、检查、反思与持续迭代的能力会留下。AI 提示思维帮助参与者从一次性的聊天，走向可重复使用的思考与工作流程。":"Tools will change. The ability to ask, check, reflect and iterate will remain. AI Prompt Thinking moves people beyond one-off chats into repeatable thinking and working loops."}</p><div className="prompt-metrics"><span><b>{lang==="zh"?"对话":"Chat"}</b>{lang==="zh"?"提出问题":"Ask"}</span><span><b>{lang==="zh"?"提示":"Prompt"}</b>{lang==="zh"?"设计提示":"Design"}</span><span><b>{lang==="zh"?"循环":"Loop"}</b>{lang==="zh"?"持续优化":"Improve"}</span><span><b>{lang==="zh"?"系统":"System"}</b>{lang==="zh"?"构建流程":"Build"}</span></div></div><Photo src="/assets/learning/prompt-thinking/prompt-thinking-class.png" alt={lang==="zh"?"AI 提示思维课程与社群学习现场":"AI Prompt Thinking class and community learning journey"} className="tall"/></section><section className="learning-gallery"><Photo src="/assets/learning/prompt-thinking/prompt-thinking-framework.png" alt={lang==="zh"?"AI 提示思维框架":"AI Prompt Thinking framework visual"}/><Photo src="/assets/learning/prompt-thinking/prompt-thinking-journey.png" alt={lang==="zh"?"AI 提示思维学习路径":"AI Prompt Thinking learning journey"}/></section><section className="trainer-slot"><Photo src="/assets/people/paul-phong.jpeg" alt={lang==="zh"?"首席培训导师与讲者 Paul Phong":"Paul Phong, lead trainer and speaker"} className="tall paul-photo"/><div><p className="eyebrow dark">{lang==="zh"?"首席培训导师":"LEAD TRAINER"}</p><h2>Paul Phong</h2><p className="trainer-line">{lang==="zh"?"拥有 13 年经验的 CPA 转型讲者、马来西亚讲师协会演讲比赛亚军——一位让数字有温度、有血有肉的会计师。":"A CPA with 13 years’ experience turned speaker, first runner-up in the Malaysia Speakers Association public speaking contest—and an accountant who brings numbers to life."}</p></div></section></>;
}

function Forum() {
 const {lang}=useLanguage();
 const agenda=lang==="zh"?["12:00 · 报到与体验区","1:00 · 开幕仪式","1:15 · 开幕主题演讲","1:50 · 主论坛讨论","2:50 · 炉边对谈","3:15 · 社群焦点分享","3:30 · 交流与体验区","5:00 · 自由交流"]:["12:00 · Registration & Experience Zone","1:00 · Opening Ceremony","1:15 · Opening Keynote","1:50 · Main Forum Discussion","2:50 · Fireside Chat","3:15 · Community Spotlight","3:30 · Networking & Experience Zone","5:00 · Free Flow Networking"];
 return <><InnerHero page="forum"/><section className="forum-register"><div><span>{lang==="zh"?"7月25日 · CST AI 论坛 AIR #01":"25 JUL · CST AI FORUM AIR #01"}</span><strong>{lang==="zh"?"加入这场关于 AI 现实、机遇、挑战与就绪能力的社群对话。":"Join the community conversation on AI Reality, Opportunity, Challenges and Readiness."}</strong></div><a className="button" href={FORUM_AIR_REGISTRATION_URL} target="_blank" rel="noreferrer">{lang==="zh"?"立即报名参加":"Register for Forum AIR"} →</a></section><section className="agenda"><div><p className="eyebrow dark">{lang==="zh"?"中午12:00–晚上7:00":"12:00–7:00 PM"}</p><h2>{lang==="zh"?"一场以对话为核心的论坛。":"A forum shaped like a conversation."}</h2><Photo src="/assets/events/forum-air/cst-audience.jpg" alt={lang==="zh"?"CST 社群论坛现场讨论":"Audience discussion at a CST community forum"} className="tall"/></div><div>{agenda.map((x,i)=><div className="agenda-row" key={x}><span>0{i+1}</span><h3>{x}</h3></div>)}</div></section><section className="profile"><Photo src="/assets/people/sophia-tey.jpg" alt={lang==="zh"?"Sophia Tey 教练在 CST 活动分享":"Coach Sophia Tey speaking at a CST event"} className="tall focus-sophia"/><div><p className="eyebrow">{lang==="zh"?"发起人与策展人":"INITIATOR & CURATOR"}</p><h2>Coach Sophia Tey</h2><p>{lang==="zh"?"马来西亚企业家、战略顾问与系统思维实践者，拥有超过 22 年经验。她创立 AI 提示思维课程™，帮助创办人与领导者发现系统性问题与关键杠杆点，在 AI 时代做出更好的决策。":"Malaysian entrepreneur, strategic advisor and systems-thinking practitioner with more than 22 years of experience. Creator of the AI Prompt Thinking Program™, helping founders and leaders discover systemic problems and leverage points for better decisions in the AI era."}</p><div className="profile-stats"><span><b>22+</b>{lang==="zh"?"年经验":"Years"}</span><span><b>30K+</b>{lang==="zh"?"培训人数":"Trained"}</span><span><b>14×</b>{lang==="zh"?"冠军":"Champion"}</span><span><b>500+</b>{lang==="zh"?"会员":"Members"}</span></div><blockquote>{lang==="zh"?"“携手探索 AI 时代。”":"“Navigating the AI era together.”"}</blockquote></div></section></>;
}

function Community() {
 const {lang}=useLanguage();
 const groups=lang==="zh"?[["一起学习","提示实验室、AI 工具分享与工作流程分享。"],["一起对话","社群对谈、播客与行业交流。"],["一起建构","社群项目、编程与媒体创作活动。"],["一起连接","人脉交流、社群聚会与伙伴活动。"],["一起带领","成为讲者、策展人、社群代表或合作伙伴。"]]:[["Learn Together","Prompt Labs, tool sharing and workflow sharing."],["Talk Together","Dialogues, podcasts and industry conversations."],["Build Together","Community projects, coding and media sessions."],["Connect Together","Networking, gatherings and partner events."],["Lead Together","Speakers, curators, representatives and partners."]];
 return <><InnerHero page="community"/><section className="community-proof"><Photo src="/assets/learning/prompt-thinking/prompt-thinking-community.png" alt={lang==="zh"?"AI 提示思维学习社群":"AI Prompt Thinking learning community"}/><div><p className="eyebrow">{lang==="zh"?"AI 原生 · 以人为本":"AI-NATIVE · HUMAN-LED"}</p><h2>{lang==="zh"?"课程让我们学习，社群让我们持续进化。":"Courses help us learn. Community helps us keep evolving."}</h2><p>{lang==="zh"?"成员不只是听课。他们分享提示词、工作流程、案例、失败与新发现，并在真实交流中认识新的伙伴。":"Members do more than attend. They share prompts, workflows, cases, failures and discoveries—and meet new people through real participation."}</p></div></section><section className="community-grid">{groups.map((x,i)=><article key={x[0]}><span>0{i+1}</span><h2>{x[0]}</h2><p>{x[1]}</p></article>)}</section><section className="gallery"><Photo src="/assets/events/community/cst-538.jpg" alt={lang==="zh"?"共同参与活动的 CST 社群会员":"CST community members participating together"} className="tall"/><Photo src="/assets/events/community/cst-510.jpg" alt={lang==="zh"?"会员参与社群讨论":"Audience member contributing to a community discussion"}/><Photo src="/assets/learning/prompt-thinking/prompt-thinking-class.png" alt={lang==="zh"?"AI 提示思维课程合照":"AI Prompt Thinking class group"}/><Photo src="/assets/events/community/cst-458.jpg" alt={lang==="zh"?"引导师在学习活动中整理观点":"Facilitator mapping ideas during a learning session"}/></section></>;
}

function Enterprise() {
 const {lang}=useLanguage();
 const services=lang==="zh"?["AI 就绪评估","高管与团队培训","工作流程与智能体设计","企业 AI 落地实施"]:["AI readiness assessment","Executive & team training","Workflow and agent design","Enterprise implementation"];
 return <><InnerHero page="enterprise"/><section className="enterprise-grid">{services.map((x,i)=><article key={x}><span>0{i+1}</span><h2>{x}</h2><p>{lang==="zh"?"将根据企业需求确认服务范围、目标对象、执行流程、预期成果与验证方式。":"Service scope, target customer, process, outcomes and proof point required."}</p></article>)}</section><section className="cta"><p className="eyebrow">{lang==="zh"?"CST 企业 AI 服务":"CST AI ENTERPRISE"}</p><h2>{lang==="zh"?"带来一个真实的商业挑战。":"Bring one real business challenge."}</h2><p>{lang==="zh"?"我们将协助你规划从 AI 认知、就绪评估到负责任落地实施的完整路径。":"We will shape the pathway from AI awareness to responsible implementation."}</p><div className="actions"><a className="button" href="mailto:anna@cst.training">{lang==="zh"?"电邮联系 Anna":"Email Anna"} →</a><a className="text-link light" href="https://wa.me/60186606731" target="_blank" rel="noreferrer">WhatsApp · 018-660 6731</a></div></section></>;
}

function About() {
 const {lang}=useLanguage();
 return <><InnerHero page="about"/><section className="statement"><p className="eyebrow dark">{lang==="zh"?"我们的理念":"OUR PHILOSOPHY"}</p><h2>{lang==="zh"?<>科技持续进化，学习型社群也会<em>一起进化。</em></>:<>Technology evolves. Learning communities <em>evolve with it.</em></>}</h2><p>{lang==="zh"?"Kaku 以持续学习为核心，让人们不只探索 AI 时代，也能共同面对未来的每一个时代。":"Kaku centres continuous learning so people can navigate not only the AI era, but any era together."}</p></section><section className="kaku-origin"><div className="origin-art"><img src={withBase("/assets/brand/kaku-identity.png")} alt="Chimpanzee Ka-Ku identity protocol"/><span>CHIMPANZEE KA-KU SOCIETY</span></div><div><p className="eyebrow">{lang==="zh"?"名字背后的故事":"BEHIND THE NAME"}</p><h2>{lang==="zh"?"为什么叫 Ka-Ku？":"Why Ka-Ku?"}</h2><p>{lang==="zh"?"六十多年前，Jane Goodall 让世界重新认识黑猩猩：它们会观察、学习、使用工具，也会在群体中传递经验。面对新环境，真正重要的不是已有多少答案，而是持续适应的能力。":"More than sixty years ago, Jane Goodall helped the world see chimpanzees differently: they observe, learn, use tools and pass knowledge through their groups. In a new environment, what matters is not having every answer—it is the ability to keep adapting."}</p><p>{lang==="zh"?"今天，AI 成为新的工作与认知环境。Chimpanzee Ka-Ku Society 因此而生：放下人类中心的傲慢，保持好奇与敏锐，并通过群体一起学习、实践和进化。":"Today, AI is becoming a new working and cognitive environment. Chimpanzee Ka-Ku Society was created to meet it with humility, curiosity and alertness—and to learn, practise and evolve together."}</p><blockquote>{lang==="zh"?"每一位 Chimp，都从一个 Ka-Ku Moment 开始：AI 不再只是聊天机器人，而开始成为你的思考伙伴。":"Every Chimp begins with a Ka-Ku Moment: when AI stops being just another chatbot and starts becoming your thinking partner."}</blockquote></div></section><section className="origin-principles">{(lang==="zh"?[["保持好奇","主动观察新的工具与可能。"],["保持敏锐","看见变化，也看见真正重要的信号。"],["保持学习","在实践、试错与反思中持续更新。"],["保持连接","把经验带回社群，与伙伴共同成长。"]]:[["Stay curious","Observe new tools and possibilities."],["Stay alert","Notice change—and the signals that truly matter."],["Keep learning","Update through practice, experimentation and reflection."],["Stay connected","Bring experience back and grow with others."]]).map((x,i)=><article key={x[0]}><span>0{i+1}</span><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</section><section className="about-grid"><article><span>{lang==="zh"?"愿景":"VISION"}</span><h2>{lang==="zh"?"让个人与社群做好 AI 就绪。":"AI readiness for people and communities."}</h2><p>{lang==="zh"?"共同走进一个 AI 影响工作、学习、创造、判断与生活的新时代。":"Move together from the non-AI era into a world where AI touches how we work, learn, create, decide and live."}</p></article><article><span>{lang==="zh"?"会员成果":"MEMBER OUTCOME"}</span><h2>{lang==="zh"?"学习、应用、分享、连接。":"Learn. Apply. Share. Connect."}</h2><p>{lang==="zh"?"每一位会员都应该学到一个有用的想法、付诸实践、回馈社群，并认识一位新朋友。":"Every member should gain one useful idea, put it into practice, contribute something back and leave knowing one new person."}</p></article></section></>;
}

function InnerHero({page}:{page:string}) {
 const {lang}=useLanguage();
 const d=pageData[page]||pageData.about;
 const i=lang==="zh"?1:0;
 const style = page==="about" ? ({"--about-image":`url("${withBase("/assets/about/jane-goodall-chimpanzee-about.png")}")`} as CSSProperties) : undefined;
 return <section style={style} data-protocol={lang==="zh"?"系统在线 // CST_AI_倡议 // KAKU_协议_V1":"SYSTEM ONLINE // CST_AI_INITIATIVE // KAKU_PROTOCOL_V1"} className={`inner-hero ${page==="about"?"about-hero":""}`}><p className="eyebrow">{d.eyebrow[i]}</p><h1>{d.title[i]}</h1><p>{d.lead[i]}</p>{page==="about"&&<small className="image-credit">{lang==="zh"?"Jane Goodall 与黑猩猩 · 用户提供图片":"Jane Goodall with a chimpanzee · user-provided image"}</small>}<div className="line"/></section>;
}

export function SitePage({page,initialLang="en"}:{page:string;initialLang?:Lang}) {
 const [lang,setLangState]=useState<Lang>(initialLang);
 const setLang=(next:Lang)=>{
   setLangState(next);
   localStorage.setItem("cst-language",next);
   const clean=window.location.pathname.replace(/^\/zh(?=\/|$)/,"")||"/";
   window.history.pushState({}, "", next==="zh"?`/zh${clean==="/"?"":clean}`:clean);
 };
 useEffect(()=>{window.scrollTo(0,0)},[page]);
 useEffect(()=>{document.documentElement.lang=lang==="zh"?"zh-CN":"en"},[lang]);
 let body;
 switch(page){case"forum":body=<Forum/>;break;case"workshops":body=<Workshops/>;break;case"membership":body=<Membership/>;break;case"community":body=<Community/>;break;case"calendar":body=<Calendar/>;break;case"pulse":body=<Pulse/>;break;case"enterprise":body=<Enterprise/>;break;case"about":body=<About/>;break;default:body=<Home/>}
 return <LanguageContext.Provider value={{lang,setLang}}><Header/><main>{body}</main><Footer/><a className="mobile-cta" href={FORUM_AIR_REGISTRATION_URL} target="_blank" rel="noreferrer">{lang==="zh"?"报名参加 Forum AIR":"Register for Forum AIR"} ↗</a></LanguageContext.Provider>;
}
