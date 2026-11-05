"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import EditorialOverview from "@/components/EditorialOverview";
import {
  Activity, ArrowDownLeft, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCircle2,
  ChevronDown, ChevronRight, CircleHelp, Clock3, Database, Eye, EyeOff, Fingerprint,
  GitBranch, LockKeyhole, Menu, MousePointer2, Plus, RefreshCw, Search, Shield,
  ShieldCheck, SlidersHorizontal, Sparkles, Unplug, X, type LucideIcon
} from "lucide-react";

type Status = "active" | "expiring" | "revoked";
type Screen = "overview" | "connections" | "activity" | "case";
type Connection = { id: string; name: string; initials: string; color: string; purpose: string; description: string; scopes: string[]; days: number; status: Status; last: string };
type Event = { id: string; name: string; detail: string; time: string; kind: "access" | "consent" | "revoke" };
type Dialog = "new" | "detail" | "revoke" | null;
type Filter = "all" | Status;

const SEED: Connection[] = [
  { id:"boreal", name:"Boreal Wealth", initials:"BW", color:"mint", purpose:"Consolidated investment overview", description:"Combines selected accounts and investments in a single portfolio view.", scopes:["Account details","Investments"], days:82, status:"active", last:"Today, 09:42" },
  { id:"orbit", name:"Orbit Finance", initials:"OF", color:"lilac", purpose:"Personal budget insights", description:"Categorizes spending to help understand your monthly budget.", scopes:["Account details","Transactions"], days:14, status:"expiring", last:"Yesterday, 16:18" },
  { id:"lumen", name:"Lumen Credit", initials:"LC", color:"peach", purpose:"Credit eligibility evaluation", description:"Uses limited financial history to estimate repayment capacity.", scopes:["Account details","Transactions"], days:65, status:"active", last:"Nov 01, 11:07" },
  { id:"equinox", name:"Equinox Pay", initials:"EP", color:"blue", purpose:"Payment experience", description:"Previously used your account information to initialize payment services.", scopes:["Account details"], days:0, status:"revoked", last:"Oct 23, 12:10" }
];
const INITIAL_EVENTS: Event[] = [
  { id:"e1", name:"Data accessed", detail:"Boreal Wealth viewed investment information", time:"TODAY · 09:42", kind:"access" },
  { id:"e2", name:"Data accessed", detail:"Orbit Finance accessed transaction information", time:"YESTERDAY · 16:18", kind:"access" },
  { id:"e3", name:"Permission revoked", detail:"Equinox Pay no longer has an active permission", time:"OCT 23 · 12:10", kind:"revoke" },
  { id:"e4", name:"Permission approved", detail:"Lumen Credit received access to two data categories", time:"OCT 09 · 14:36", kind:"consent" }
];
const RECIPIENTS = [
  { name:"Cedar Insights", initials:"CI", color:"mint", purpose:"Personal spending insights" },
  { name:"Daylight Invest", initials:"DI", color:"lilac", purpose:"Investment planning overview" },
  { name:"Mosaic Money", initials:"MM", color:"peach", purpose:"Financial wellness tools" }
];
const SCOPE_INFO: Record<string,string> = {
  "Account details":"Account type, account identification and balance.",
  "Transactions":"Amounts, dates and descriptions of selected transactions.",
  "Investments":"Holdings, investment values and related positions.",
  "Credit information":"Selected credit and financing information."
};
const SCOPE_OPTIONS = Object.keys(SCOPE_INFO);
const NAV: {id:Screen; label:string; icon:LucideIcon}[] = [
  {id:"overview",label:"Overview",icon:Shield},
  {id:"connections",label:"Connections",icon:GitBranch},
  {id:"activity",label:"Activity log",icon:Activity},
  {id:"case",label:"Design rationale",icon:BookOpen}
];
const fade={initial:{opacity:0,y:28},animate:{opacity:1,y:0},exit:{opacity:0,y:-16},transition:{duration:.55,ease:[.22,1,.36,1] as [number,number,number,number]}};

function Brand({large=false}:{large?:boolean}) {
  return <span className={"brand"+(large?" brand-large":"")} aria-label="TrustFlow"><span className="brand-symbol"><i/><i/><i/></span><span>trust<span className="brand-green">flow</span><b>.</b></span></span>;
}
function StatusPill({status}:{status:Status}) { return <span className={"status-pill status-"+status}><i/>{status==="active"?"Active":status==="expiring"?"Expiring soon":"Revoked"}</span>; }
function Avatar({item,small=false}:{item:Pick<Connection,"initials"|"color">;small?:boolean}) {
  return <span className={"partner-avatar partner-"+item.color+(small?" avatar-small":"")}>{item.initials}</span>;
}
function Eyebrow({children}:{children:React.ReactNode}) { return <span className="eyebrow"><span className="eyebrow-dot"/>{children}</span>; }

function Intro({onDone}:{onDone:()=>void}) {
  const reduced=useReducedMotion();
  useEffect(()=>{ if(reduced){onDone();return;} const t=window.setTimeout(onDone,3200); return ()=>window.clearTimeout(t); },[onDone,reduced]);
  return <motion.div className="intro" aria-label="TrustFlow introduction" initial={{opacity:1}} exit={{opacity:0,filter:"blur(15px)"}} transition={{duration:.7}}>
    <div className="intro-orbit intro-orbit-one"/><div className="intro-orbit intro-orbit-two"/>
    <motion.div className="intro-content" initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} transition={{duration:.9}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.1,duration:.7}}><Brand large/></motion.div>
      <motion.div className="intro-rule" initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:.75,duration:.9}}/>
      <motion.p className="intro-kicker" initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:1,duration:.65}}>A NEW PERSPECTIVE ON FINANCIAL CONTROL</motion.p>
      <motion.h2 initial={{opacity:0,y:55}} animate={{opacity:1,y:0}} transition={{delay:1.22,duration:.9}}>Your data.<br/><em>Your call.</em></motion.h2>
    </motion.div>
    <button className="intro-skip" onClick={onDone}>Skip intro <ArrowRight size={16}/></button>
    <div className="intro-progress"><motion.span initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:3.1,ease:"linear"}}/></div>
  </motion.div>;
}

function Network({connections,onSelect}:{connections:Connection[];onSelect:(id:string)=>void}) {
  const live=connections.filter(c=>c.status!=="revoked").slice(0,3);
  return <div className="network-wrap">
    <div className="network-top"><span>DATA SHARING MAP</span><span className="network-status"><i/> CONNECTIONS ACTIVE</span></div>
    <div className="network-stage">
      <svg className="network-lines" viewBox="0 0 620 380" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs><linearGradient id="flowStroke"><stop stopColor="#bbf87c"/><stop offset=".55" stopColor="#a3e2ca"/><stop offset="1" stopColor="#87c9c9"/></linearGradient></defs>
        <motion.path d="M306 182 C246 182 210 92 141 92" stroke="url(#flowStroke)" strokeWidth="1.8" strokeDasharray="5 6" fill="none" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.8,delay:.5}}/>
        <motion.path d="M306 182 C391 177 408 87 490 92" stroke="url(#flowStroke)" strokeWidth="1.8" strokeDasharray="5 6" fill="none" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.8,delay:.7}}/>
        <motion.path d="M306 182 C313 266 399 291 479 289" stroke="url(#flowStroke)" strokeWidth="1.8" strokeDasharray="5 6" fill="none" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.8,delay:.9}}/>
        <circle cx="141" cy="92" r="5" fill="#b9f877"/><circle cx="490" cy="92" r="5" fill="#b9f877"/><circle cx="479" cy="289" r="5" fill="#b9f877"/>
      </svg>
      <div className="network-halo"/>
      <motion.div className="network-center" initial={{opacity:0,scale:.65}} animate={{opacity:1,scale:1}} transition={{delay:.4,type:"spring",stiffness:150,damping:18}}>
        <div className="network-ring"><div className="network-ring-inner"><Fingerprint size={37} strokeWidth={1.5}/></div></div>
        <strong>YOUR DATA</strong><span>YOU'RE IN CONTROL</span>
      </motion.div>
      {live.map((item,index)=><motion.button key={item.id} className={"network-partner network-partner-"+index} onClick={()=>onSelect(item.id)} initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{duration:.5,delay:.6+index*.18}} title={"View "+item.name+" permission"}>
        <Avatar item={item} small/><span>{item.name}</span><ArrowUpRight size={12}/>
      </motion.button>)}
      <div className="network-orbit orbit-a"/><div className="network-orbit orbit-b"/>
    </div>
    <div className="network-bottom"><span><span className="legend-green"/> Permission active</span><span><span className="legend-grey"/> Illustrative connections</span></div>
  </div>;
}

function ModalShell({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}) {
  const modalRef=useRef<HTMLDivElement>(null);
  const closeRef=useRef<HTMLButtonElement>(null);
  const onCloseRef=useRef(onClose);
  useEffect(()=>{onCloseRef.current=onClose},[onClose]);
  useEffect(()=>{
    const before=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const old=document.body.style.overflow;document.body.style.overflow="hidden";
    closeRef.current?.focus();
    const handle=(e:KeyboardEvent)=>{
      if(e.key==="Escape"){e.preventDefault();onCloseRef.current();}
      if(e.key==="Tab" && modalRef.current){
        const elements=Array.from(modalRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')).filter(el=>el.getClientRects().length>0);
        if(elements.length){const first=elements[0],last=elements[elements.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
      }
    };
    document.addEventListener("keydown",handle);
    return ()=>{document.body.style.overflow=old;document.removeEventListener("keydown",handle);before?.focus()};
  },[]);
  return <motion.div className="modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={onClose}>
    <motion.div ref={modalRef} className="modal-panel" role="dialog" aria-modal="true" aria-label={title} onMouseDown={e=>e.stopPropagation()} initial={{opacity:0,y:30,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:.97}} transition={{type:"spring",stiffness:320,damping:30}}>
      <button className="icon-button modal-close" aria-label="Close dialog" ref={closeRef} onClick={onClose}><X size={19}/></button>{children}
    </motion.div>
  </motion.div>;
}

export default function TrustFlow() {
  const [screen,setScreen]=useState<Screen>("overview");
  const [connections,setConnections]=useState<Connection[]>(SEED);
  const [events,setEvents]=useState<Event[]>(INITIAL_EVENTS);
  const [loaded,setLoaded]=useState(false);
  const [showIntro,setShowIntro]=useState(true);
  const [filter,setFilter]=useState<Filter>("all");
  const [search,setSearch]=useState("");
  const [dialog,setDialog]=useState<Dialog>(null);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [step,setStep]=useState(0);
  const [recipient,setRecipient]=useState(0);
  const [scopes,setScopes]=useState<string[]>(["Account details","Transactions"]);
  const [toast,setToast]=useState("");
  const [mobileNav,setMobileNav]=useState(false);
  const [comparison,setComparison]=useState<"before"|"after">("after");
  const reduced=useReducedMotion();
  const live=connections.filter(c=>c.status!=="revoked");
  const selected=connections.find(c=>c.id===selectedId)??null;
  const visible=useMemo(()=>connections.filter(c=>(filter==="all"||c.status===filter)&& (c.name+" "+c.purpose+" "+c.scopes.join(" ")).toLowerCase().includes(search.toLowerCase())),[connections,filter,search]);
  useEffect(()=>{
    try{const raw=localStorage.getItem("trustflow-v2");if(raw){const data=JSON.parse(raw) as {connections?:Connection[];events?:Event[]};if(Array.isArray(data.connections)&&Array.isArray(data.events)){setConnections(data.connections);setEvents(data.events)}}}catch{/* Optional local persistence */}setLoaded(true);
  },[]);
  useEffect(()=>{if(loaded){try{localStorage.setItem("trustflow-v2",JSON.stringify({connections,events}))}catch{/* Optional local persistence */}}},[connections,events,loaded]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(""),3800);return()=>clearTimeout(t)},[toast]);
  const closeIntro=()=>setShowIntro(false);
  function navigate(next:Screen){setScreen(next);setMobileNav(false);window.scrollTo({top:0,behavior:reduced?"instant":"smooth"})}
  function beginNew(){setStep(0);setRecipient(0);setScopes(["Account details","Transactions"]);setDialog("new")}
  function detail(id:string){setSelectedId(id);setDialog("detail")}
  function revoke(){
    if(!selected)return;
    setConnections(items=>items.map(c=>c.id===selected.id?{...c,status:"revoked" as const,days:0}:c));
    setEvents(items=>[{id:String(Date.now()),name:"Permission revoked",detail:selected.name+" access was withdrawn in the prototype",time:"JUST NOW",kind:"revoke"},...items]);
    setDialog(null);setToast("Permission revoked in this simulation.");
  }
  function grant(){
    const r=RECIPIENTS[recipient];
    const item:Connection={id:"new-"+Date.now(),name:r.name,initials:r.initials,color:r.color,purpose:r.purpose,description:"Limited permission created in the interactive prototype.",scopes,days:90,status:"active",last:"Not accessed yet"};
    setConnections(items=>[item,...items]);setEvents(items=>[{id:String(Date.now()),name:"Permission created",detail:r.name+" received "+scopes.length+" simulated data categories",time:"JUST NOW",kind:"consent"},...items]);
    setDialog(null);setScreen("connections");setFilter("all");setSearch("");setToast("Simulated permission created.");
  }
  function simulateEvent(){
    const partner=live[0];if(!partner){setToast("Create a connection first.");return;}
    setEvents(items=>[{id:String(Date.now()),name:"Simulated data access",detail:partner.name+" requested "+partner.scopes[0].toLowerCase(),time:"JUST NOW",kind:"access"},...items]);
    setToast("Simulated activity added.");
  }
  function reset(){setConnections(SEED);setEvents(INITIAL_EVENTS);setFilter("all");setSearch("");setDialog(null);setScreen("overview");setToast("Sample data restored.")}
  return <div className="app">
    <AnimatePresence>{showIntro&&!reduced&&<Intro onDone={closeIntro}/>}</AnimatePresence>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="ambient ambient-left"/><div className="ambient ambient-right"/>
    <aside className={"sidebar"+(mobileNav?" sidebar-visible":"")}>
      <div className="sidebar-brand"><Brand/><button className="icon-button mobile-only" onClick={()=>setMobileNav(false)} aria-label="Close navigation"><X size={20}/></button></div>
      <div className="sidebar-caption">WORKSPACE <span>01 / 01</span></div>
      <nav aria-label="Primary navigation">{NAV.map(n=>{const Icon=n.icon;return <button key={n.id} className={"nav-link"+(screen===n.id?" nav-selected":"")} aria-current={screen===n.id?"page":undefined} onClick={()=>navigate(n.id)}><Icon size={18}/><span>{n.label}</span>{screen===n.id&&<motion.i layoutId="nav-indicator"/>}</button>})}</nav>
      <div className="sidebar-info"><div className="sidebar-info-icon"><ShieldCheck size={25}/></div><span>BUILT AROUND YOU</span><p>Clarity is the beginning of financial confidence.</p><div className="sidebar-info-bars"><i/><i/><i/></div></div>
      <div className="sidebar-foot"><button className="reset-button" onClick={reset}><RefreshCw size={16}/> Reset sample data</button><div className="profile"><div className="profile-avatar">TF</div><div><strong>TrustFlow</strong><span>Independent UX concept</span></div><span className="profile-dots">•••</span></div></div>
    </aside>
    {mobileNav&&<button className="mobile-scrim" aria-label="Close navigation" onClick={()=>setMobileNav(false)}/>}
    <div className="main">
      <header className="topbar"><div className="breadcrumb"><button onClick={()=>setMobileNav(true)} className="icon-button mobile-only" aria-label="Open navigation"><Menu size={20}/></button><span>Workspace</span><ChevronRight size={14}/><strong>{NAV.find(n=>n.id===screen)?.label}</strong></div><div className="topbar-actions"><span className="prototype-tag"><i/> INTERACTIVE CONCEPT</span><button className="icon-button" aria-label="Read design rationale" onClick={()=>navigate("case")}><CircleHelp size={19}/></button><div className="topbar-initials">TF</div></div></header>
      <main id="main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={screen} {...(reduced?{initial:{opacity:1},animate:{opacity:1},exit:{opacity:1},transition:{duration:0}}:fade)}>
          {screen==="overview"&&<EditorialOverview connections={connections} events={events} onReview={detail} onManage={()=>navigate("connections")} onNew={beginNew} onActivity={()=>navigate("activity")} onDesign={()=>navigate("case")} />}
          {screen==="connections"&&<section className="sub-page"><div className="page-header"><div><Eyebrow>PERMISSIONS / 01</Eyebrow><h1>Who has access<span className="accent">?</span></h1><p>Explore the exact data shared with each partner. Change your mind whenever you need.</p></div><button className="button-primary" onClick={beginNew}><Plus size={18}/> New connection</button></div><div className="toolbar"><div className="filter-list">{(["all","active","expiring","revoked"] as Filter[]).map(f=><button key={f} aria-pressed={filter===f} className={filter===f?"filter-on":""} onClick={()=>setFilter(f)}>{f==="all"?"All":f==="expiring"?"Expiring":f==="revoked"?"Revoked":"Active"}</button>)}</div><label className="search-wrap"><Search size={17}/><span className="sr-only">Search connections</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search connections..."/></label></div><div className="connection-grid">{visible.map((c,index)=><motion.button key={c.id} className="connection-card" onClick={()=>detail(c.id)} initial={reduced?false:{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:index*.055}} whileHover={reduced?undefined:{y:-6}}><div className="connection-top"><Avatar item={c}/><StatusPill status={c.status}/></div><h3>{c.name}</h3><p>{c.purpose}</p><div className="scope-chips">{c.scopes.map(s=><span key={s}>{s}</span>)}</div><div className="connection-bottom"><span>{c.status==="revoked"?"Permission ended":c.days+" days remaining"}</span><span className="circle-arrow"><ArrowUpRight size={16}/></span></div></motion.button>)}</div>{visible.length===0&&<div className="empty-state"><Search size={28}/><h3>No matching permissions</h3><p>Try a different filter or search term.</p></div>}<div className="section-notice"><ShieldCheck size={18}/> All institutions and permissions shown here are fictional. Actions only change this prototype.</div></section>}
          {screen==="activity"&&<section className="sub-page"><div className="page-header"><div><Eyebrow>TRANSPARENCY / 02</Eyebrow><h1>Nothing hidden<span className="accent">.</span></h1><p>A readable record of simulated permission changes and information access.</p></div><button className="button-outline" onClick={simulateEvent}><Plus size={17}/> Simulate an event</button></div><div className="timeline-layout"><div className="timeline-panel"><div className="timeline-head"><div><Eyebrow>ACTIVITY HISTORY</Eyebrow><h2>Every interaction, in context.</h2></div><span>{events.length} EVENTS</span></div><div className="timeline">{events.map((e,index)=><motion.div className="timeline-event" key={e.id} initial={reduced?false:{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:index*.04}}><span className={"timeline-icon timeline-"+e.kind}>{e.kind==="revoke"?<Unplug size={18}/>:e.kind==="access"?<Eye size={18}/>:<ShieldCheck size={18}/>}</span><div><strong>{e.name}</strong><p>{e.detail}</p><small>{e.time}</small></div></motion.div>)}</div></div><aside className="timeline-aside"><div className="aside-symbol"><Eye size={31}/></div><Eyebrow>VISIBILITY FIRST</Eyebrow><h3>Control starts with understanding.</h3><p>Instead of hiding important changes in technical logs, this view turns permission events into clear language.</p><div className="aside-line"/><span>FICTIONAL LOCAL ACTIVITY — NOT A BANK AUDIT LOG</span></aside></div></section>}
          {screen==="case"&&<section className="case-page"><div className="case-hero"><Eyebrow>PRODUCT DESIGN CASE STUDY / 2026</Eyebrow><h1>Make the invisible<br/><em>visible.</em></h1><p>A human-centered exploration of transparency, informed consent and meaningful control in Brazil's Open Finance ecosystem.</p><div className="case-tags"><span>Product Strategy</span><span>Interaction Design</span><span>UX Writing</span><span>Accessibility</span></div></div><div className="case-numbers"><div><span>01 / UNDERSTAND</span><strong>Who?</strong><small>Identify data recipients</small></div><div><span>02 / DECIDE</span><strong>What?</strong><small>Inspect scope and purpose</small></div><div><span>03 / ACT</span><strong>How?</strong><small>Control your permissions</small></div></div>
            <article className="case-section"><Eyebrow>01 — PROBLEM FRAMING</Eyebrow><h2>Consent without comprehension is not meaningful control.</h2><p>Data sharing can enable more useful financial experiences. But users should be able to understand who receives their information, which categories are included, why access is needed and how to withdraw it. TrustFlow proposes a unified, plain-language interface around those decisions.</p><div className="principles"><div><Eye size={26}/><h3>Visibility by default</h3><p>Recipient, status and duration stay visible without requiring multiple screens.</p></div><div><MousePointer2 size={26}/><h3>Clear next steps</h3><p>Review and revocation remain easy to find, with explicit confirmation.</p></div><div><ShieldCheck size={26}/><h3>Meaningful language</h3><p>Scope and consequence are explained in everyday terms.</p></div></div></article>
            <article className="case-section"><Eyebrow>02 — EXPLORING ALTERNATIVES</Eyebrow><div className="comparison-head"><div><h2>Information density, reconsidered.</h2><p>An illustrative design comparison, not a tested before-and-after result.</p></div><div className="segmented"><button className={comparison==="before"?"selected":""} onClick={()=>setComparison("before")}>Before</button><button className={comparison==="after"?"selected":""} onClick={()=>setComparison("after")}>After</button></div></div><AnimatePresence mode="wait"><motion.div className="comparison" key={comparison} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><div className={"comparison-sample "+comparison}>{comparison==="before"?<><div className="legacy-line long"/><div className="legacy-line"/><div className="legacy-line medium"/><div className="legacy-line"/><div className="legacy-line short"/></>:<><div className="modern-title"><Avatar item={SEED[0]} small/><strong>Boreal Wealth</strong><StatusPill status="active"/></div><div className="modern-row"><span>Purpose</span><strong>Financial overview</strong></div><div className="modern-row"><span>Shared information</span><strong>Accounts · Investments</strong></div><div className="modern-row"><span>Control</span><strong>Revoke at any time</strong></div></>}</div><div className="comparison-copy"><span>{comparison==="before"?"ILLUSTRATIVE FRICTION":"PROPOSED EXPERIENCE"}</span><h3>{comparison==="before"?"Key decisions are difficult to scan.":"Essential information at a glance."}</h3><p>{comparison==="before"?"Generic grouping forces people to work harder to understand the scope and purpose.":"A consistent hierarchy reveals partner, scope, purpose and control without hiding details."}</p></div></motion.div></AnimatePresence></article>
            <article className="case-section"><Eyebrow>03 — VALIDATION PLAN</Eyebrow><h2>What would we test?</h2><p>This is an independent concept. No participant research, business outcomes or measured improvement is claimed. The following are hypotheses to validate in future sessions.</p><div className="hypotheses"><div><span>H01</span><div><h3>Findability</h3><p>Can users identify which company can access their transactions?</p><small>Task success · first-click accuracy · time on task</small></div></div><div><span>H02</span><div><h3>Comprehension</h3><p>Can users explain what permission withdrawal does and does not change?</p><small>Comprehension checks · confidence calibration</small></div></div><div><span>H03</span><div><h3>Inclusive interaction</h3><p>Can keyboard and reduced-motion users complete the key flows?</p><small>Keyboard navigation · screen reader checks · WCAG review</small></div></div></div></article>
            <article className="case-section"><Eyebrow>04 — INTERACTION PRINCIPLES</Eyebrow><h2>Motion that communicates.</h2><div className="motion-rules"><div><span>01</span><strong>Hierarchy</strong><p>Content enters in a clear visual sequence.</p></div><div><span>02</span><strong>Continuity</strong><p>Transitions maintain spatial context.</p></div><div><span>03</span><strong>Feedback</strong><p>Every consent change has visible confirmation.</p></div><div><span>04</span><strong>Choice</strong><p>Nonessential animation respects reduced-motion settings.</p></div></div></article><div className="case-footer"><div><Eyebrow>EXPLORE THE PRODUCT</Eyebrow><h2>Less friction.<br/>More understanding.</h2></div><button className="button-primary" onClick={()=>navigate("overview")}>Back to the experience <ArrowRight size={18}/></button></div>
          </section>}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer><span>© 2026 TRUSTFLOW <span className="footer-separator">/</span> HUMAN-CENTERED FINANCIAL EXPERIENCES</span><span><ShieldCheck size={14}/> FICTIONAL INSTITUTIONS. NO REAL DATA.</span></footer>
    </div>
    <AnimatePresence>
      {dialog==="detail"&&selected&&<ModalShell title={selected.name+" connection details"} onClose={()=>setDialog(null)}><Eyebrow>CONNECTION DETAILS</Eyebrow><div className="dialog-heading"><Avatar item={selected}/><div><h2>{selected.name}</h2><StatusPill status={selected.status}/></div></div><p className="dialog-description">{selected.description}</p><div className="detail-section"><span>PURPOSE</span><strong>{selected.purpose}</strong></div><div className="detail-section"><span>SHARED DATA</span><div className="scope-stack">{selected.scopes.map(s=><div key={s}><Database size={17}/><div><strong>{s}</strong><small>{SCOPE_INFO[s]}</small></div></div>)}</div></div><div className="detail-columns"><div><span>EXPIRY</span><strong>{selected.status==="revoked"?"Permission ended":selected.days+" days remaining"}</strong></div><div><span>LAST REPORTED ACCESS</span><strong>{selected.last}</strong></div></div>{selected.status!=="revoked"?<button className="button-danger" onClick={()=>setDialog("revoke")}><Unplug size={18}/> Revoke permission <ArrowRight size={17}/></button>:<div className="confirmation-inline"><CheckCircle2 size={18}/> This permission has ended in the prototype.</div>}<p className="dialog-disclaimer">Example data only. No bank or financial institution is connected.</p></ModalShell>}
      {dialog==="revoke"&&selected&&<ModalShell title="Confirm permission revocation" onClose={()=>setDialog(null)}><div className="revoke-icon"><Unplug size={30}/></div><Eyebrow>REVIEW YOUR DECISION</Eyebrow><h2 className="dialog-title">Revoke access for {selected.name}?</h2><p className="dialog-description">The recipient will no longer be marked as authorized to request new data in this prototype. This does not delete information previously received or revoke any real bank authorization.</p><div className="revoke-summary"><Shield size={19}/><div><strong>What changes?</strong><p>The connection becomes inactive and a local activity event is added.</p></div></div><div className="dialog-buttons"><button className="button-outline" onClick={()=>setDialog("detail")}>Go back</button><button className="button-danger" onClick={revoke}>Confirm revocation <ArrowRight size={16}/></button></div></ModalShell>}
      {dialog==="new"&&<ModalShell title="Create a simulated connection" onClose={()=>setDialog(null)}><Eyebrow>NEW CONNECTION / STEP 0{step+1} OF 03</Eyebrow><h2 className="dialog-title">Make an informed choice.</h2><div className="steps"><span className={step>=0?"filled":""}/><span className={step>=1?"filled":""}/><span className={step>=2?"filled":""}/></div><AnimatePresence mode="wait"><motion.div key={step} className="wizard-content" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}} transition={{duration:.22}}>{step===0?<><h3>Choose a recipient</h3><p>Which fictional company should receive selected information?</p><div className="recipient-list">{RECIPIENTS.map((r,i)=><button key={r.name} className={"recipient-option"+(recipient===i?" chosen":"")} aria-pressed={recipient===i} onClick={()=>setRecipient(i)}><Avatar item={r}/><span><strong>{r.name}</strong><small>{r.purpose}</small></span><span className="option-radio">{recipient===i&&<Check size={14}/>}</span></button>)}</div></>:step===1?<><h3>Choose exactly what to share</h3><p>Review each data category before continuing.</p><div className="scope-options">{SCOPE_OPTIONS.map(s=><label key={s} className={"scope-option"+(scopes.includes(s)?" chosen":"")}><input type="checkbox" checked={scopes.includes(s)} onChange={()=>setScopes(items=>items.includes(s)?items.filter(x=>x!==s):[...items,s])}/><span><strong>{s}</strong><small>{SCOPE_INFO[s]}</small></span><Check size={16}/></label>)}</div></>:<><h3>Review your permission</h3><p>Confirm the recipient, purpose, categories and duration.</p><div className="review-list"><div><span>Recipient</span><strong>{RECIPIENTS[recipient].name}</strong></div><div><span>Purpose</span><strong>{RECIPIENTS[recipient].purpose}</strong></div><div><span>Information shared</span><strong>{scopes.join(", ")}</strong></div><div><span>Duration</span><strong>90 days (simulated)</strong></div><div><span>Withdrawal</span><strong>Available at any time</strong></div></div><div className="simulation-warning"><LockKeyhole size={18}/> Real authorization requires authentication and approval through participating institutions. This flow changes local UI state only.</div></>}</motion.div></AnimatePresence><div className="dialog-buttons"><button className="button-outline" onClick={()=>step===0?setDialog(null):setStep(s=>s-1)}>{step===0?"Cancel":"Back"}</button><button className="button-primary" disabled={step===1&&scopes.length===0} onClick={()=>step===2?grant():setStep(s=>s+1)}>{step===2?"Confirm simulation":"Continue"} <ArrowRight size={16}/></button></div></ModalShell>}
    </AnimatePresence>
    <AnimatePresence>{toast&&<motion.div className="toast" role="status" aria-live="polite" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:15}}><CheckCircle2 size={20}/>{toast}<button onClick={()=>setToast("")} aria-label="Dismiss notification"><X size={16}/></button></motion.div>}</AnimatePresence>
  </div>;
}
