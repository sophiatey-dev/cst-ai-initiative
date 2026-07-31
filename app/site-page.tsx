"use client";

import { createContext, useContext, useEffect, useState, type CSSProperties } from "react";

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

const events = [
  { category: "AI for All", iso: "2026-07-25", date: "25 JUL", time: "12:00–4:00 PM", title: "CST AI Forum AIR #01", copy: "Reality, opportunity, challenges and readiness." },
  { category: "AI for All", iso: "2026-07-25", date: "25 JUL", time: "8:00–11:00 AM", title: "Practical AI for Everyday Work", copy: "Fundamentals, prompting and useful daily workflows." },
  { category: "AI for Skills", iso: "2026-08-02", date: "02 AUG", time: "8:00–9:00 PM", title: "Kaku AI Onboarding", copy: "Meet the people, calendar, resources and pathways." },
  { category: "AI for Business and Works", iso: "2026-08-09", date: "09 AUG", time: "2:00–3:00 PM", title: "Vibe Coding: Build a Website", copy: "A one-hour community speaker session." },
  { category: "Community and Life Interests", iso: "2026-08-16", date: "16 AUG", time: "8:00–9:00 PM", title: "Prompt Jam", copy: "Bring one problem. Build and compare prompt loops." },
];

const learning = [
  ["01", "AI foundations", "Practical AI, productivity and prompt thinking for day-to-day work."],
  ["02", "AI workflows", "Agents, automation, dashboards and repeatable business systems."],
  ["03", "AI creation", "Images, video, filmmaking, content and media production."],
  ["04", "Vibe coding", "Websites, apps, games, prototypes and useful internal tools."],
  ["05", "AI leadership", "Systems, leverage, decision intelligence and self-organisation."],
];

function AssetSlot({ label, tall = false }: { label: string; tall?: boolean }) {
  return <div className={`asset-slot ${tall ? "tall" : ""}`}><span>CONTENT SLOT</span><strong>{label}</strong><small>Replace with approved photography / video</small></div>;
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
      <span>AI Initiative<small>{lang==="zh"?"由 Kaku 社群推动":"Powered by Kaku"}</small></span>
    </a>
    <nav className={open ? "open" : ""}>{nav.map(([en,zh,href]) => <a key={href} href={href==="/kaku/"?withBase(href):localPath(href,lang)}>{lang==="zh"?zh:en}</a>)}</nav>
    <div className="header-actions"><div className="language-switch" aria-label="Language"><button className={lang==="en"?"active":""} onClick={()=>setLang("en")}>EN</button><span>/</span><button className={lang==="zh"?"active":""} onClick={()=>setLang("zh")}>中文</button></div><a className="button compact" href={FORUM_AIR_REGISTRATION_URL} target="_blank" rel="noreferrer">{lang==="zh"?"立即报名":"Register"} <span>↗</span></a></div>
    <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
  </header>;
}

function Footer() {
  const {lang}=useLanguage();
  return <footer><div><div className="brand"><span className="brand-mark"><img src={withBase("/assets/brand/cst-logo-black.png")} alt="CST" /></span><span>AI Initiative<small>{lang==="zh"?"从 AI 热潮走向 AI 习惯":"From AI hype to AI habit."}</small></span></div></div><div><strong>{lang==="zh"?"探索":"Explore"}</strong><a href={localPath("/forum",lang)}>Forum AIR</a><a href={localPath("/workshops",lang)}>{lang==="zh"?"免费工作坊":"Free workshops"}</a><a href={localPath("/membership",lang)}>Kaku {lang==="zh"?"会员计划":"membership"}</a></div><div><strong>{lang==="zh"?"参与":"Participate"}</strong><a href={localPath("/calendar",lang)}>{lang==="zh"?"活动日历":"Calendar"}</a><a href={localPath("/community",lang)}>{lang==="zh"?"社群":"Community"}</a><a href={localPath("/enterprise",lang)}>{lang==="zh"?"企业服务":"Enterprise"}</a></div><div><strong>{lang==="zh"?"联系我们":"Contact"}</strong><a href="mailto:anna@cst.training">anna@cst.training</a><a href="https://wa.me/60186606731" target="_blank" rel="noreferrer">WhatsApp · 018-660 6731</a><span>Malaysia</span></div></footer>;
}

function Home() {
  const {lang}=useLanguage();
  return <>
    <section className="hero">
      <div className="hero-protocol" aria-hidden="true">
        <img src={withBase("/assets/brand/kaku-identity.png")} alt="" />
        <div className="protocol-scan" />
        <div className="protocol-glitch glitch-a" />
        <div className="protocol-glitch glitch-b" />
      </div>
      <div className="orb one" /><div className="orb two" />
      <div className="hero-copy"><p className="eyebrow">CST AI INITIATIVE · MALAYSIA</p><h1>{lang==="zh"?<>从 AI 热潮<br />走向 <em>AI 习惯。</em></>:<>From AI hype<br />to <em>AI habit.</em></>}</h1><p className="lead">{lang==="zh"?"一个推动实用 AI 就绪的行动，让人们共同学习、应用、分享，并携手探索 AI 时代。":"A practical AI readiness movement bringing people together to learn, apply, share and navigate the AI era."}</p><div className="actions"><a className="button" href={FORUM_AIR_REGISTRATION_URL} target="_blank" rel="noreferrer">{lang==="zh"?"报名参加 Forum AIR":"Register for Forum AIR"} <span>↗</span></a><a className="text-link" href={localPath("/workshops",lang)}>{lang==="zh"?"探索免费工作坊 →":"Explore free workshops →"}</a></div><div className="hero-signals"><span>CST</span><i>×</i><span className="kaku-word">KAKU</span><small>{lang==="zh"?"携手探索 AI 时代":"Navigating the AI era together"}</small></div></div>
      <div className="hero-visual"><Photo src="/assets/events/forum-air/cst-audience.jpg" alt="Audience participating at a CST community event" className="tall" /><div className="live-note"><i /> Next: Forum AIR #01 · 25 July</div></div>
      <div className="hero-index"><span>{lang==="zh"?"AI 现实":"Reality"}</span><span>{lang==="zh"?"AI 机遇":"Opportunity"}</span><span>{lang==="zh"?"AI 挑战":"Challenges"}</span><span>{lang==="zh"?"AI 就绪":"Readiness"}</span></div>
    </section>
    <section className="statement"><p className="eyebrow dark">{lang==="zh"?"为什么是 AI · 为什么是现在":"WHY AI · WHY NOW"}</p><h2>{lang==="zh"?<>AI 不只是一场信息革命，更是一场<em>认知革命。</em></>:<>AI is not only an information revolution. It is a <em>cognitive revolution.</em></>}</h2><p>{lang==="zh"?"今天的挑战不再是如何取得信息，而是如何与 AI 一起思考、判断与行动。":"The challenge is no longer accessing information. It is learning how to think, decide and act alongside AI."}</p></section>
    <section className="four-pillars">{(lang==="zh"?["AI 现实|现在究竟正在发生什么？","AI 机遇|AI 可以在哪里创造真正的价值？","AI 挑战|我们必须面对哪些风险与障碍？","AI 就绪|如何从认知走向行动？"]:["AI Reality|What is actually happening now?","AI Opportunity|Where can AI create meaningful value?","AI Challenges|What risks and barriers must we face?","AI Readiness|How do we move from awareness to action?"]).map((x,i)=>{const [a,b]=x.split("|");return <article key={a}><span>0{i+1}</span><h3>{a}</h3><p>{b}</p></article>})}</section>
    <section className="cinematic-band"><Photo src="/assets/events/forum-air/cst-keynote.jpg" alt="CST community keynote and learning session" /><div><span>HUMAN TRANSITION PROTOCOL</span><strong>See the shift.<br/>Name your position.<br/>Move together.</strong></div></section>
    <section className="journey"><div><p className="eyebrow dark">{lang==="zh"?"KAKU 持续学习循环":"THE KAKU LEARNING LOOP"}</p><h2>{lang==="zh"?"一个持续学习的社群。":"A community that keeps learning."}</h2><p>{lang==="zh"?"科技会持续进化，而持续学习的社群也会持续成长。":"Technology will continue to evolve. Communities that continue learning will continue to thrive."}</p></div><div className="loop">{(lang==="zh"?["发现","理解","应用","分享","连接","成长"]:["Discover","Understand","Apply","Share","Connect","Grow"]).map((x,i)=><div key={x}><span>{i+1}</span>{x}</div>)}</div></section>
    <section className="events-section"><div className="section-head"><div><p className="eyebrow">UPCOMING</p><h2>Step into the conversation.</h2></div><a className="text-link light" href={localPath("/calendar",lang)}>View full calendar →</a></div><div className="event-grid">{events.slice(0,3).map(e=><EventCard key={e.title} e={e}/>)}</div></section>
    <section className="learning"><div className="section-head"><div><p className="eyebrow dark">LEARN BY BUILDING</p><h2>Practical capability.<br />Deeper thinking.</h2></div><p>Start with useful AI skills. Grow into systems, decisions and community leadership.</p></div>{learning.map(x=><a href={localPath("/workshops",lang)} className="learning-row" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p><b>↗</b></a>)}</section>
    <MembershipStrip />
    <section className="pulse-preview"><div><p className="eyebrow dark">AI PULSE · AGENTIC NEWSROOM</p><h2>Understand what changed—and why it matters.</h2><p>Gather → verify → cluster → rank → explain → publish → learn from feedback.</p><a className="button dark-button" href={localPath("/pulse",lang)}>Explore AI Pulse →</a></div><div className="news-card"><span>TODAY · PLACEHOLDER FEED</span><h3>Top AI developments, translated for real life.</h3><ul><li>What happened</li><li>Why it matters</li><li>What it means for SMEs, professionals and communities</li><li>Sources and confidence</li></ul></div></section>
  </>;
}

function EventCard({e}:{e:typeof events[number]}) {
 const {lang}=useLanguage();
 const isForum=e.title.includes("Forum AIR");
 return <article className="event-card"><span className="tag">{e.category}</span><div className="event-date"><strong>{e.date}</strong><span>{e.time}</span></div><h3>{e.title}</h3><p>{e.copy}</p><a href={isForum?FORUM_AIR_REGISTRATION_URL:localPath("/calendar",lang)} target={isForum?"_blank":undefined} rel={isForum?"noreferrer":undefined}>{isForum?(lang==="zh"?"立即报名":"Register now"):(lang==="zh"?"查看详情":"Details")} ↗</a></article>
}

function MembershipStrip() {
 const {lang}=useLanguage();
 return <section className="membership-strip"><div><p className="eyebrow">KAKU {lang==="zh"?"会员计划":"MEMBERSHIP"}</p><h2>{lang==="zh"?"365 天，持续学习、应用、连接与成长。":"365 days to learn, apply, connect and grow."}</h2><p>{lang==="zh"?"加入持续学习社群，或选择完整的四大进阶课程路径。":"Join the continuous learning community—or take the complete cohort pathway."}</p></div><article><span>KAKU 365</span><strong>RM365<small>/ {lang==="zh"?"年":"year"}</small></strong><p>{lang==="zh"?"社群、会员入门、资源库，以及按日历开放的 AI Prompt Thinking。":"Community, onboarding, resources and scheduled AI Prompt Thinking."}</p><a className="button white" href={KAKU_365_PAYMENT_URL} target="_blank" rel="noreferrer">{lang==="zh"?"立即注册与付款":"Register & pay"} →</a></article><article className="featured"><span>KAKU GO</span><strong>RM1,825<small>/ {lang==="zh"?"年":"year"}</small></strong><p>{lang==="zh"?"包含 Kaku 365 的所有权益，以及四大旗舰课程。":"Everything in 365 plus the four flagship cohort programmes."}</p><a className="button" href={localPath("/membership",lang)}>{lang==="zh"?"了解 Kaku Go":"Explore Go"} →</a></article></section>;
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
  <div className="month-scroll"><div className="month-weekdays">{weekdays.map(w=><span key={w}>{w}</span>)}</div><div className="month-grid">{days.map(day=>{const key=iso(day);const dayEvents=visibleEvents.filter(e=>e.iso===key);return <div className={`month-day${day.getMonth()!==month.getMonth()?" outside":""}`} key={key}><span className="month-number">{day.getDate()}</span><div className="month-events">{dayEvents.map(e=>{const forum=e.title.includes("Forum AIR");return <a className={`month-event ${cat(e.category)}`} href={forum?FORUM_AIR_REGISTRATION_URL:localPath("/calendar",lang)} target={forum?"_blank":undefined} rel={forum?"noreferrer":undefined} key={e.title}><small>{e.time}</small><strong>{e.title}</strong></a>})}</div></div>})}</div></div>
  <div className="month-legend"><span className="cat-all">AI for All</span><span className="cat-skills">AI for Skills</span><span className="cat-business">AI for Business and Works</span><span className="cat-community">Community and Life Interests</span></div>
 </section>;
}

function Calendar() {
 const {lang}=useLanguage();
 const [filter,setFilter]=useState("All");
 const categories=["AI for All","AI for Skills","AI for Business and Works","Community and Life Interests"];
 const filtered=events.filter(e=>filter==="All"||e.category===filter);
 return <><InnerHero page="calendar"/><section className="calendar-section"><div className="filters">{["All",...categories].map(f=><button className={filter===f?"active":""} onClick={()=>setFilter(f)} key={f}>{f==="All"?(lang==="zh"?"所有活动":"All events"):f}</button>)}</div><div className="calendar-grid">{filtered.map(e=><EventCard key={e.title} e={e}/>)}</div><MonthlyCalendar visibleEvents={filtered} lang={lang}/><p className="placeholder-note">Required: confirmed dates, registration links, venues, capacity, host and member/public access rules for each event.</p></section></>;
}

function Pulse() {
 const steps=["Gather trusted sources","Verify & deduplicate","Cluster related stories","Score relevance & impact","Explain in plain language","Human review gate","Publish & learn"];
 return <><InnerHero page="pulse"/><section className="pulse-flow">{steps.map((s,i)=><div key={s}><span>0{i+1}</span><h3>{s}</h3><p>{i===0?"Official labs, research, regulators and reputable reporting.":i===5?"Recommended before public auto-publishing high-impact claims.":"Agentic loop with source traceability and feedback."}</p></div>)}</section><section className="light-section"><div className="section-head"><div><p className="eyebrow dark">DAILY OUTPUT</p><h2>One story. Five useful views.</h2></div></div><div className="audience-cards">{["Everyone","SME owners","Professionals","Educators","Community leaders"].map(x=><article key={x}><span>{x}</span><h3>Why should I care?</h3><p>Plain-language context, likely impact and one practical next step.</p></article>)}</div></section></>;
}

function Membership() {
 return <><InnerHero page="membership"/><MembershipStrip/><section className="journey"><div><p className="eyebrow dark">MEMBER EXPERIENCE</p><h2>From joining to contributing.</h2></div><div className="loop">{["Join","Onboard","Learn","Apply","Share","Lead"].map((x,i)=><div key={x}><span>{i+1}</span>{x}</div>)}</div></section><section className="comparison"><h2>Two ways to enter the ecosystem.</h2><div><article><span>KAKU 365</span><h3>Continuous learning</h3><ul><li>365-day membership</li><li>Kaku AI Onboarding</li><li>Monthly learning touchpoints</li><li>Resource library</li><li>Community activities</li><li>Scheduled Prompt Thinking access</li></ul><a className="button dark-button" href={KAKU_365_PAYMENT_URL} target="_blank" rel="noreferrer">Register & pay RM365 →</a></article><article className="accent-card"><span>KAKU GO</span><h3>Complete pathway</h3><ul><li>Everything in Kaku 365</li><li>AI Prompt Thinking</li><li>Systems & Leverage</li><li>Decision Intelligence</li><li>Community & Self-Organisation</li><li>Builder and speaker pathways</li></ul></article></div></section></>;
}

function Workshops() {
 const {lang}=useLanguage();
 const workshops=[["Practical AI for Everyday Work","3 hours · Free","Understand AI, prompt for better results and apply it to real work."],["AI Media Creation","3 hours · Free","Build a simple campaign from idea to copy, image and video concept."],["Build Your AI Workflow","3 hours · Free","Connect capture, clarify, generate, check, improve, store and reuse."]];
 const classroom=lang==="zh"?[
   ["01","AI 提示思维","学会设定情境、持续对话与检查判断，让 AI 从聊天工具成为思考伙伴。",["Prompt Thinking","人机协作","工作流程应用"]],
   ["02","系统思维与杠杆","看见事件背后的结构、关系与循环，运用十二个杠杆点寻找更有影响力的行动。",["结构化思维","十二个杠杆点","系统诊断"]],
   ["03","决策智能","面对真正的两难与不确定性，识别认知偏误，建立更清晰的决策结构。",["决策架构","真实两难实验室","战略思考"]],
   ["04","社群与自组织","设计能够持续学习、分享知识与自我进化的社群系统，减少对单向指令的依赖。",["社群架构","知识分享","内在动力循环"]]
 ]:[
   ["01","AI Prompt Thinking","Strengthen context-setting, iterative dialogue and the human judgement needed to work meaningfully with AI.",["Prompt Thinking","Human–AI collaboration","Workflow application"]],
   ["02","Systems & Leverage","See the structures, relationships and recurring patterns beneath events—and find higher-impact places to intervene.",["Structural thinking","12 Leverage Points","System diagnosis"]],
   ["03","Decision Intelligence","Process genuine dilemmas, recognise cognitive biases and make stronger decisions under uncertainty.",["Decision architecture","Live dilemma labs","Strategic thinking"]],
   ["04","Community & Self-Organisation","Design learning structures that continue beyond formal training and reduce dependence on top-down direction.",["Community architecture","Knowledge sharing","Intrinsic motivation loops"]]
 ];
 return <><InnerHero page="workshops"/><section className="explore-intro"><p className="eyebrow dark">{lang==="zh"?"从这里开始":"START HERE"}</p><h2>{lang==="zh"?"先体验实用 AI，建立你的第一个 AI 习惯。":"Experience practical AI. Build your first useful habit."}</h2></section><section className="workshop-grid">{workshops.map((w,i)=><article key={w[0]}><span>0{i+1}</span><p className="tag">{w[1]}</p><h2>{w[0]}</h2><p>{w[2]}</p><ul><li>Live demonstrations</li><li>Hands-on practice</li><li>One reusable workflow</li></ul><a href="#">{lang==="zh"?"报名链接待补":"Registration link required"} ↗</a></article>)}</section><section className="classroom"><div className="classroom-head"><div><p className="eyebrow">KAKU GO · RM1,825 / YEAR</p><h2>{lang==="zh"?"学习课堂":"Learning Classroom"}</h2></div><div><strong>{lang==="zh"?"从使用工具，到提升思维、判断与共创能力。":"From using tools to strengthening how you think, decide and build with others."}</strong><p>{lang==="zh"?"Kaku Go 会员可在会员年度内，根据课程日历与席位安排，参与四大旗舰学习路径。":"Kaku Go members can access the four flagship learning pathways during their membership year, subject to the published calendar and seat availability."}</p><a className="button" href={localPath("/membership",lang)}>{lang==="zh"?"了解 Kaku Go":"Explore Kaku Go"} →</a></div></div><div className="classroom-story"><div><p className="eyebrow">{lang==="zh"?"课程路径的教学背景":"WHY THIS PATHWAY"}</p><h3>{lang==="zh"?"真正困难的，不只是解决问题，而是理解为什么同样的问题不断回来。":"The real challenge is not solving one problem. It is understanding why the same problem keeps returning."}</h3></div><div><p>{lang==="zh"?"员工换了一批，团队的问题仍然存在；策略更新了，组织却没有真正改变；投入更多资源，结果依然不如预期。很多时候，我们缺少的不是努力，而是还没有看见问题背后的结构、关系、信息流动与反馈机制。":"Teams change, strategies are rewritten and more resources are invested—yet familiar problems return. The missing piece is often not effort, but the ability to see the structures, relationships, information flows and feedback loops beneath the visible event."}</p><p>{lang==="zh"?"受到 Donella Meadows《系统之美》与十二个杠杆点的启发，这条完整课程路径把 AI 视为思考伙伴：帮助领导者探索不同决定的影响、识别隐藏的模式，并找到能够以更少资源创造更大影响的关键介入点。":"Inspired by Donella Meadows’ Thinking in Systems and the twelve leverage points, this pathway treats AI as a thinking partner—helping leaders explore consequences, surface hidden patterns and find interventions capable of creating greater impact with fewer resources."}</p><blockquote>{lang==="zh"?"未来的领导力，不只是拥有更多答案，而是能够看见整个系统，并创造一个可以持续成长的系统。":"Future leadership is not about having more answers. It is about seeing the whole system—and creating one that can continue to learn and grow."}</blockquote></div></div><div className="classroom-grid">{classroom.map(c=><article key={c[0] as string}><span>{c[0] as string}</span><h3>{c[1] as string}</h3><p>{c[2] as string}</p><ul>{(c[3] as string[]).map(x=><li key={x}>{x}</li>)}</ul></article>)}</div><div className="classroom-outcomes"><p>{lang==="zh"?"你将带走":"WHAT CHANGES"}</p>{(lang==="zh"?["共同的思考语言","更清晰的系统诊断","更高影响力的优先次序","更成熟的决策能力","更精准的人机协作","持续发生的社群学习"]:["A shared thinking language","Structural diagnosis","Higher-impact priorities","Decision intelligence","Precision AI collaboration","Learning that continues"]).map((x,i)=><span key={x}><b>0{i+1}</b>{x}</span>)}</div></section><section className="prompt-feature"><div><p className="eyebrow">AI PROMPT THINKING</p><h2>{lang==="zh"?"从寻找答案，到构建思维。":"From asking for answers to building thinking."}</h2><p>{lang==="zh"?"工具会改变，但提问、检查、反思与持续迭代的能力会留下。AI Prompt Thinking 帮助参与者从一次性的聊天，走向可重复使用的思考与工作流程。":"Tools will change. The ability to ask, check, reflect and iterate will remain. AI Prompt Thinking moves people beyond one-off chats into repeatable thinking and working loops."}</p><div className="prompt-metrics"><span><b>Chat</b>{lang==="zh"?"提出问题":"Ask"}</span><span><b>Prompt</b>{lang==="zh"?"设计提示":"Design"}</span><span><b>Loop</b>{lang==="zh"?"持续优化":"Improve"}</span><span><b>System</b>{lang==="zh"?"构建流程":"Build"}</span></div></div><Photo src="/assets/learning/prompt-thinking/prompt-thinking-class.png" alt="AI Prompt Thinking class and community learning journey" className="tall"/></section><section className="learning-gallery"><Photo src="/assets/learning/prompt-thinking/prompt-thinking-framework.png" alt="AI Prompt Thinking framework visual"/><Photo src="/assets/learning/prompt-thinking/prompt-thinking-journey.png" alt="AI Prompt Thinking learning journey"/></section><section className="trainer-slot"><Photo src="/assets/people/paul-phong.jpeg" alt="Paul Phong, lead trainer and speaker" className="tall paul-photo"/><div><p className="eyebrow dark">{lang==="zh"?"首席培训导师":"LEAD TRAINER"}</p><h2>Paul Phong</h2><p className="trainer-line">{lang==="zh"?"拥有 13 年经验的 CPA 转型讲者、马来西亚讲师协会演讲比赛亚军——一位让数字有温度、有血有肉的会计师。":"A CPA with 13 years’ experience turned speaker, first runner-up in the Malaysia Speakers Association public speaking contest—and an accountant who brings numbers to life."}</p></div></section></>;
}

function Forum() {
 const {lang}=useLanguage();
 return <><InnerHero page="forum"/><section className="forum-register"><div><span>25 JUL · CST AI FORUM AIR #01</span><strong>{lang==="zh"?"加入这场关于 AI 现实、机遇、挑战与就绪能力的社群对话。":"Join the community conversation on AI Reality, Opportunity, Challenges and Readiness."}</strong></div><a className="button" href={FORUM_AIR_REGISTRATION_URL} target="_blank" rel="noreferrer">{lang==="zh"?"立即报名参加":"Register for Forum AIR"} →</a></section><section className="agenda"><div><p className="eyebrow dark">12:00–7:00 PM</p><h2>A forum shaped like a conversation.</h2><Photo src="/assets/events/forum-air/cst-audience.jpg" alt="Audience discussion at a CST community forum" className="tall"/></div><div>{["12:00 · Registration & Experience Zone","1:00 · Opening Ceremony","1:15 · Opening Keynote","1:50 · Main Forum Discussion","2:50 · Fireside Chat","3:15 · Community Spotlight","3:30 · Networking & Experience Zone","5:00 · Free Flow Networking"].map((x,i)=><div className="agenda-row" key={x}><span>0{i+1}</span><h3>{x}</h3></div>)}</div></section><section className="profile"><Photo src="/assets/people/sophia-tey.jpg" alt="Coach Sophia Tey speaking at a CST event" className="tall focus-sophia"/><div><p className="eyebrow">INITIATOR & CURATOR</p><h2>Coach Sophia Tey</h2><p>Malaysian entrepreneur, strategic advisor and systems-thinking practitioner with more than 22 years of experience. Creator of the AI Prompt Thinking Program™, helping founders and leaders discover systemic problems and leverage points for better decisions in the AI era.</p><div className="profile-stats"><span><b>22+</b>Years</span><span><b>30K+</b>Trained</span><span><b>14×</b>Champion</span><span><b>500+</b>Members</span></div><blockquote>“Navigating the AI era together.”</blockquote></div></section></>;
}

function Community() {
 const {lang}=useLanguage();
 const groups=[["Learn Together","Prompt Labs, tool sharing and workflow sharing."],["Talk Together","Dialogues, podcasts and industry conversations."],["Build Together","Community projects, coding and media sessions."],["Connect Together","Networking, gatherings and partner events."],["Lead Together","Speakers, curators, representatives and partners."]];
 return <><InnerHero page="community"/><section className="community-proof"><Photo src="/assets/learning/prompt-thinking/prompt-thinking-community.png" alt="AI Prompt Thinking learning community"/><div><p className="eyebrow">AI-NATIVE · HUMAN-LED</p><h2>{lang==="zh"?"课程让我们学习，社群让我们持续进化。":"Courses help us learn. Community helps us keep evolving."}</h2><p>{lang==="zh"?"成员不只是听课。他们分享提示词、工作流程、案例、失败与新发现，并在真实交流中认识新的伙伴。":"Members do more than attend. They share prompts, workflows, cases, failures and discoveries—and meet new people through real participation."}</p></div></section><section className="community-grid">{groups.map((x,i)=><article key={x[0]}><span>0{i+1}</span><h2>{x[0]}</h2><p>{x[1]}</p></article>)}</section><section className="gallery"><Photo src="/assets/events/community/cst-538.jpg" alt="CST community members participating together" className="tall"/><Photo src="/assets/events/community/cst-510.jpg" alt="Audience member contributing to a community discussion"/><Photo src="/assets/learning/prompt-thinking/prompt-thinking-class.png" alt="AI Prompt Thinking class group"/><Photo src="/assets/events/community/cst-458.jpg" alt="Facilitator mapping ideas during a learning session"/></section></>;
}

function Enterprise() {
 return <><InnerHero page="enterprise"/><section className="enterprise-grid">{["AI readiness assessment","Executive & team training","Workflow and agent design","Enterprise implementation"].map((x,i)=><article key={x}><span>0{i+1}</span><h2>{x}</h2><p>Service scope, target customer, process, outcomes and proof point required.</p></article>)}</section><section className="cta"><p className="eyebrow">CST AI ENTERPRISE</p><h2>Bring one real business challenge.</h2><p>We will shape the pathway from AI awareness to responsible implementation.</p><div className="actions"><a className="button" href="mailto:anna@cst.training">Email Anna →</a><a className="text-link light" href="https://wa.me/60186606731" target="_blank" rel="noreferrer">WhatsApp · 018-660 6731</a></div></section></>;
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
 return <section style={style} className={`inner-hero ${page==="about"?"about-hero":""}`}><p className="eyebrow">{d.eyebrow[i]}</p><h1>{d.title[i]}</h1><p>{d.lead[i]}</p>{page==="about"&&<small className="image-credit">{lang==="zh"?"Jane Goodall 与黑猩猩 · 用户提供图片":"Jane Goodall with a chimpanzee · user-provided image"}</small>}<div className="line"/></section>;
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
 useEffect(()=>{const saved=localStorage.getItem("cst-language") as Lang|null;if(saved&&saved!==lang&&initialLang==="en")setLangState(saved)},[]);
 let body;
 switch(page){case"forum":body=<Forum/>;break;case"workshops":body=<Workshops/>;break;case"membership":body=<Membership/>;break;case"community":body=<Community/>;break;case"calendar":body=<Calendar/>;break;case"pulse":body=<Pulse/>;break;case"enterprise":body=<Enterprise/>;break;case"about":body=<About/>;break;default:body=<Home/>}
 return <LanguageContext.Provider value={{lang,setLang}}><Header/><main>{body}</main><Footer/><a className="mobile-cta" href={FORUM_AIR_REGISTRATION_URL} target="_blank" rel="noreferrer">{lang==="zh"?"报名参加 Forum AIR":"Register for Forum AIR"} ↗</a></LanguageContext.Provider>;
}
