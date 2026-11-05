"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown,
  Clock3, Database, Eye, Fingerprint, Layers3, LockKeyhole,
  Menu, Play, ShieldCheck, Sparkles, Unplug, X, type LucideIcon
} from "lucide-react";

type Props = { onStart: () => void; onExplore: () => void };

const HERO_PHOTO = "https://images.unsplash.com/photo-1758876018661-41b3c4012df8?auto=format&fit=crop&w=1200&q=85";
const HUMAN_PHOTO = "https://images.unsplash.com/photo-1758274252219-5f20097548c9?auto=format&fit=crop&w=900&q=85";
const CAFE_PHOTO = "https://images.unsplash.com/photo-1741486366310-63a8a11b6d31?auto=format&fit=crop&w=1000&q=85";

const STEPS: {number:string; label:string; title:string; text:string; icon:LucideIcon}[] = [
  {number:"01",label:"CHOOSE",title:"Start with a bank.",text:"Pick a fictional institution and see exactly where the journey begins.",icon:Fingerprint},
  {number:"02",label:"UNDERSTAND",title:"Decide what moves.",text:"Review the purpose, the categories and the duration—before you consent.",icon:Layers3},
  {number:"03",label:"CONTROL",title:"Stay in charge.",text:"Explore your permissions, see their history and withdraw a simulated authorization.",icon:ShieldCheck}
];

const BENEFITS: {number:string; eyebrow:string; title:string; body:string; icon:LucideIcon}[] = [
  {number:"01",eyebrow:"VISIBILITY",title:"Know who's connected.",body:"A useful overview of the institutions that can access specific categories of information.",icon:Eye},
  {number:"02",eyebrow:"CLARITY",title:"Details without the fine print.",body:"Who receives your data, for what purpose, and when their access should end.",icon:Database},
  {number:"03",eyebrow:"AUTONOMY",title:"Change your mind.",body:"Review and revoke a simulated permission when you no longer want it active.",icon:Unplug}
];

function Brand({inverted=false}:{inverted?:boolean}) {
  return <span className={"site-brand"+(inverted?" site-brand-light":"")}>
    <span className="site-brand-mark" aria-hidden="true"><i/><i/><i/></span>
    trust<span>flow</span><b>.</b>
  </span>;
}

function Reveal({children,className="",delay=0}:{children:React.ReactNode;className?:string;delay?:number}) {
  const reduced=useReducedMotion();
  return <motion.div className={className}
    initial={reduced?false:{opacity:0,y:32,filter:"blur(6px)"}}
    whileInView={{opacity:1,y:0,filter:"blur(0px)"}}
    viewport={{once:true,amount:.12}}
    transition={{duration:reduced?0:.75,delay:reduced?0:delay,ease:[.22,1,.36,1] as [number,number,number,number]}}
  >{children}</motion.div>;
}

function FlowIllustration() {
  const reduced=useReducedMotion();
  return <div className="site-flow-art" role="img" aria-label="Illustration of a person's financial data flowing from a bank through a permission to a secure connection">
    <svg className="site-flow-lines" viewBox="0 0 730 330" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="flowMint" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#84e9cf" stopOpacity=".1"/><stop offset=".5" stopColor="#a4f4d1"/><stop offset="1" stopColor="#84e9cf" stopOpacity=".18"/></linearGradient>
      </defs>
      <motion.path d="M120 160 C230 160 228 78 350 115 S520 160 610 160" stroke="url(#flowMint)" strokeWidth="2"
        strokeDasharray="7 8" initial={reduced?false:{pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true}} transition={{duration:reduced?0:1.7}}/>
      <motion.path d="M120 160 C225 160 252 242 360 204 S523 160 610 160" stroke="#a5ebca" opacity=".24" strokeWidth="1.3"
        initial={reduced?false:{pathLength:0}} whileInView={{pathLength:1}} viewport={{once:true}} transition={{duration:reduced?0:2,delay:.25}}/>
      {[145,365,587].map((x,i)=><motion.circle key={x} cx={x} cy={i===1?155:160} r="4" fill="#a6f2d6" animate={reduced?undefined:{opacity:[.2,1,.2],r:[3,5,3]}} transition={{repeat:Infinity,duration:2.3,delay:i*.5}} />)}
    </svg>
    <motion.div className="site-flow-node site-flow-bank" animate={reduced?undefined:{y:[0,-7,0]}} transition={{duration:5,repeat:Infinity,ease:"easeInOut"}}>
      <Database size={24} strokeWidth={1.6}/><span>BANK</span>
    </motion.div>
    <motion.div className="site-flow-node site-flow-consent" animate={reduced?undefined:{y:[0,7,0]}} transition={{duration:6,repeat:Infinity,ease:"easeInOut"}}>
      <span className="site-flow-asterisk">✳</span><span>CONSENT</span>
      <span className="site-flow-check"><Check size={16}/></span>
    </motion.div>
    <motion.div className="site-flow-node site-flow-control" animate={reduced?undefined:{y:[0,-5,0]}} transition={{duration:4.5,repeat:Infinity,ease:"easeInOut"}}>
      <LockKeyhole size={24} strokeWidth={1.5}/><span>CONTROL</span>
    </motion.div>
    <span className="site-flow-caption">ILLUSTRATIVE DATA PATH / NOT A LIVE CONNECTION</span>
  </div>;
}

function PermissionPreview({onExplore}:{onExplore:()=>void}) {
  const reduced=useReducedMotion();
  return <div className="site-preview-wrap" aria-label="Illustration of TrustFlow's permission overview">
    <motion.div className="site-preview-glow" aria-hidden="true" animate={reduced?undefined:{opacity:[.45,.8,.45],scale:[1,1.08,1]}} transition={{duration:7,repeat:Infinity}}/>
    <motion.div className="site-preview-window" initial={reduced?false:{opacity:0,y:40,rotateX:7}} whileInView={{opacity:1,y:0,rotateX:0}} viewport={{once:true}} transition={{duration:1,ease:[.22,1,.36,1] as [number,number,number,number]}}>
      <div className="site-window-top"><Brand/><span>01 / 03 <i/> LIVE DEMO</span></div>
      <div className="site-window-content">
        <span className="site-window-eyebrow">YOUR PERMISSION SPACE</span>
        <h3>Make every connection<br/><em>make sense.</em></h3>
        <div className="site-window-feature">
          <div className="site-window-feature-symbol"><span>OF</span></div>
          <div><span>PERMISSION REQUIRES REVIEW</span><strong>Orbit Finance</strong><small>Account details · Transactions</small></div>
          <span className="site-window-expire">14 <small>DAYS</small></span>
        </div>
        <div className="site-window-row"><span><span className="site-window-dot site-dot-mint"/> Boreal Wealth</span><strong>Active</strong><ArrowUpRight size={16}/></div>
        <div className="site-window-row"><span><span className="site-window-dot site-dot-orange"/> Lumen Credit</span><strong>Active</strong><ArrowUpRight size={16}/></div>
        <button className="site-window-button" onClick={onExplore}>Explore the actual demo <ArrowRight size={16}/></button>
      </div>
    </motion.div>
    <motion.div className="site-floating-mini glass-surface" animate={reduced?undefined:{y:[0,-12,0]}} transition={{duration:4.8,repeat:Infinity,ease:"easeInOut"}}>
      <span className="site-floating-icon"><ShieldCheck size={20}/></span>
      <span><strong>Access is your choice.</strong><small>Review it. Change it.</small></span>
      <CheckCircle2 size={18}/>
    </motion.div>
  </div>;
}

export default function MarketingSite({onStart,onExplore}:Props) {
  const [menuOpen,setMenuOpen]=useState(false);
  const reduced=useReducedMotion();
  const close=()=>setMenuOpen(false);
  return <div className="site-shell">
    <a href="#site-main" className="site-skip-link">Skip to main content</a>
    <div className="site-grain" aria-hidden="true"/>
    <header className="site-header">
      <div className="site-header-inner">
        <a href="#top" className="site-logo-link" aria-label="TrustFlow, back to top" onClick={close}><Brand inverted/></a>
        <nav className="site-nav" aria-label="Website navigation">
          <a href="#why">The idea</a><a href="#how">How it works</a><a href="#experience">The experience</a>
        </nav>
        <div className="site-header-end">
          <button className="site-header-link" onClick={onExplore}>Open workspace <ArrowUpRight size={16}/></button>
          <button className="site-header-cta" onClick={onStart}>Try the demo <ArrowUpRight size={17}/></button>
          <button type="button" className="site-mobile-toggle" aria-label={menuOpen?"Close navigation":"Open navigation"} aria-expanded={menuOpen} onClick={()=>setMenuOpen(o=>!o)}>{menuOpen?<X size={22}/>:<Menu size={22}/>}</button>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen&&<motion.nav className="site-mobile-menu" initial={reduced?false:{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={reduced?undefined:{opacity:0,height:0}} aria-label="Mobile navigation">
          <a href="#why" onClick={close}>The idea <ArrowUpRight size={17}/></a>
          <a href="#how" onClick={close}>How it works <ArrowUpRight size={17}/></a>
          <a href="#experience" onClick={close}>The experience <ArrowUpRight size={17}/></a>
          <button onClick={()=>{close();onExplore()}}>Open workspace <ArrowUpRight size={17}/></button>
        </motion.nav>}
      </AnimatePresence>
    </header>

    <main id="site-main">
      <section id="top" className="site-hero" aria-labelledby="site-hero-title">
        <div className="site-hero-aura" aria-hidden="true"/>
        <div className="site-orbit-line site-orbit-line-one" aria-hidden="true"/>
        <div className="site-hero-container">
          <div className="site-hero-copy">
            <motion.div className="site-overline" initial={reduced?false:{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{duration:.7}}><span className="site-pulse"/> A NEW WAY TO UNDERSTAND FINANCIAL CONSENT</motion.div>
            <motion.h1 id="site-hero-title" initial={reduced?false:{opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{duration:.85,delay:.1,ease:[.22,1,.36,1] as [number,number,number,number]}}>
              Your data.<br/><span className="site-hero-italic">Your rules.</span><br/><span className="site-hero-outline">Your world.</span>
            </motion.h1>
            <motion.p className="site-hero-sub" initial={reduced?false:{opacity:0,y:25}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.35}}>Open Finance shouldn&apos;t feel like a mystery. See who can access your information, understand why, and decide what happens next.</motion.p>
            <motion.div className="site-hero-actions" initial={reduced?false:{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.5}}>
              <button className="site-button-primary" onClick={onStart}>Experience TrustFlow <ArrowUpRight size={19}/></button>
              <button className="site-button-secondary" onClick={onExplore}><span><Play size={14} fill="currentColor"/></span> Explore the workspace</button>
            </motion.div>
            <div className="site-hero-micro"><span className="site-micro-rule"/><span>DESIGNED FOR CLARITY. BUILT AROUND PEOPLE.</span></div>
          </div>
          <div className="site-hero-visual">
            <motion.div className="site-hero-photo-frame" initial={reduced?false:{opacity:0,scale:1.08}} animate={{opacity:1,scale:1}} transition={{duration:1.25,ease:"easeOut"}}>
              <img src={HERO_PHOTO} alt="Woman using her smartphone in a bright workplace, illustrative photography by Vitaly Gariev on Unsplash" width="1200" height="1450" fetchPriority="high"/>
            </motion.div>
            <div className="site-hero-photo-vignette" aria-hidden="true"/>
            <motion.div className="site-hero-card glass-surface" initial={reduced?false:{opacity:0,y:55,rotate:-6}} animate={{opacity:1,y:0,rotate:-3}} transition={{duration:.9,delay:.75,ease:"easeOut"}}>
              <div className="site-glass-top"><span className="site-glass-symbol"><LockKeyhole size={18}/></span><span>YOUR CONSENT</span><span className="site-glass-live"><i/> ACTIVE</span></div>
              <div className="site-glass-count"><strong>03</strong><span>connections<br/>within your control</span></div>
              <div className="site-glass-bottom"><span>YOU&apos;RE IN CHARGE</span><ArrowUpRight size={18}/></div>
            </motion.div>
            <motion.div className="site-orbit-badge glass-surface" initial={reduced?false:{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{duration:.7,delay:1}}><Sparkles size={21}/><span>CLARITY<br/>BY DESIGN</span></motion.div>
            <div className="site-photo-vertical-label">PEOPLE FIRST / TECHNOLOGY SECOND</div>
          </div>
        </div>
        <a className="site-scroll-cue" href="#why">SCROLL TO EXPLORE <ArrowDown size={18}/></a>
      </section>

      <div className="site-ribbon" aria-hidden="true"><div className="site-ribbon-track">
        {Array.from({length:4},(_,i)=><span key={i}>A LITTLE MORE CLARITY <span>✳</span> A LOT MORE CONTROL <span>✳</span> ALWAYS YOUR CHOICE <span>✳</span></span>)}
      </div></div>

      <section id="why" className="site-section site-why" aria-labelledby="why-heading">
        <div className="site-section-number"><span>01 / THE QUESTION</span><span>WHY IT EXISTS</span></div>
        <div className="site-why-layout">
          <Reveal className="site-why-visual">
            <div className="site-why-image-mask"><img src={CAFE_PHOTO} alt="Person sitting thoughtfully in a café, an illustrative Unsplash photograph by Đào Việt Hoàng" width="1000" height="1200" loading="lazy"/></div>
            <div className="site-why-glass glass-surface"><span className="site-why-glass-icon"><Fingerprint size={24}/></span><span>YOUR FINANCIAL LIFE<br/>IS PERSONAL.</span><span className="site-why-glass-star">✳</span></div>
            <div className="site-why-doodle" aria-hidden="true"><svg viewBox="0 0 270 140" fill="none"><path d="M10 108C57 91 44 35 103 46s59 69 103 23 32-52 55-48" stroke="currentColor" strokeWidth="2" strokeDasharray="6 7"/><path d="m243 14 21 6-8 20" stroke="currentColor" strokeWidth="2"/></svg></div>
          </Reveal>
          <div className="site-why-copy">
            <Reveal><span className="site-kicker"><span/> THE HUMAN SIDE OF DATA</span><h2 id="why-heading">When did<br/><em>“I agree”</em> become<br/>so complicated?</h2></Reveal>
            <Reveal delay=.12><p>We grant permission in seconds. Then the details disappear into menus, terms and technical language.</p><p>TrustFlow reimagines that experience so that understanding comes <strong>before</strong> consent—and control doesn&apos;t end after you tap agree.</p></Reveal>
            <Reveal delay=.22><div className="site-why-statement"><span>LESS ASSUMPTION.</span><span>MORE UNDERSTANDING.</span><span>MORE AGENCY.</span></div></Reveal>
          </div>
        </div>
      </section>

      <section id="how" className="site-section site-how" aria-labelledby="how-heading">
        <div className="site-section-number"><span>02 / THE JOURNEY</span><span>MADE TO FEEL HUMAN</span></div>
        <Reveal className="site-how-heading"><span className="site-kicker"><span/> FROM QUESTION TO CONTROL</span><h2 id="how-heading">A complicated system.<br/><em>A simpler journey.</em></h2><p>Three moments that turn financial consent into something understandable.</p></Reveal>
        <FlowIllustration/>
        <div className="site-steps">
          {STEPS.map((step,i)=><Reveal key={step.number} className="site-step" delay={i*.1}>
            <div className="site-step-top"><span>{step.number} / {step.label}</span><step.icon size={27} strokeWidth={1.4}/></div>
            <h3>{step.title}</h3><p>{step.text}</p>
            <span className="site-step-corner" aria-hidden="true">↗</span>
          </Reveal>)}
        </div>
        <Reveal className="site-how-cta"><button className="site-text-link" onClick={onStart}>Take the journey yourself <ArrowUpRight size={19}/></button><span>NO REAL ACCOUNT OR BANK DETAILS NEEDED</span></Reveal>
      </section>

      <section className="site-section site-people" aria-labelledby="people-heading">
        <div className="site-people-photo"><img src={HUMAN_PHOTO} alt="Woman at a café enjoying a moment on her smartphone; illustrative photo by Vitaly Gariev on Unsplash" width="900" height="1200" loading="lazy"/><div className="site-people-photo-overlay"/></div>
        <div className="site-people-content">
          <Reveal><span className="site-kicker"><span/> A DIFFERENT STARTING POINT</span><h2 id="people-heading">The technology<br/>is complex.<br/><em>Life shouldn&apos;t be.</em></h2></Reveal>
          <Reveal delay=.12><p>The best financial experiences don&apos;t ask people to understand the infrastructure. They help people understand their choices.</p><span className="site-people-asterisk" aria-hidden="true">✳</span></Reveal>
        </div>
        <span className="site-people-index">03 / HUMAN FIRST</span>
      </section>

      <section id="experience" className="site-section site-experience" aria-labelledby="experience-heading">
        <div className="site-section-number"><span>04 / INSIDE TRUSTFLOW</span><span>THE PRODUCT EXPERIENCE</span></div>
        <div className="site-experience-top">
          <Reveal><span className="site-kicker"><span/> NOT JUST INFORMATION. UNDERSTANDING.</span><h2 id="experience-heading">Control you can<br/><em>actually feel.</em></h2></Reveal>
          <Reveal delay=.12><p>A permission isn&apos;t just a row in a table. It&apos;s a relationship you should be able to inspect, understand and end.</p></Reveal>
        </div>
        <div className="site-experience-grid">
          <Reveal className="site-experience-showcase"><PermissionPreview onExplore={onExplore}/></Reveal>
          <div className="site-benefits">{BENEFITS.map((b,i)=><Reveal key={b.number} className="site-benefit" delay={i*.1}>
            <div className="site-benefit-icon"><b.icon size={23} strokeWidth={1.6}/></div>
            <div><span>{b.eyebrow} / {b.number}</span><h3>{b.title}</h3><p>{b.body}</p></div>
            <ArrowUpRight className="site-benefit-arrow" size={21}/>
          </Reveal>)}</div>
        </div>
      </section>

      <section className="site-section site-statement" aria-labelledby="statement-heading">
        <div className="site-statement-orbit" aria-hidden="true"><div/><div/><div/><span>✳</span></div>
        <Reveal className="site-statement-copy"><span className="site-kicker"><span/> OUR DESIGN PRINCIPLE</span><h2 id="statement-heading">Trust isn&apos;t a checkbox.<br/><em>It&apos;s an experience.</em></h2><p>Designed as an independent UX concept to explore better financial transparency and meaningful consent.</p><button className="site-button-primary" onClick={onStart}>Start the interactive demo <ArrowUpRight size={20}/></button></Reveal>
      </section>
    </main>
    <footer className="site-footer">
      <div className="site-footer-first"><Brand inverted/><p>A more human way to understand who can access your financial information.</p><button onClick={onStart} className="site-footer-cta">Try the experience <ArrowUpRight size={17}/></button></div>
      <div className="site-footer-row"><span>INDEPENDENT UX CONCEPT · FICTIONAL BANKS · NO REAL FINANCIAL DATA</span><div className="site-footer-links"><a href="#top">Back to top ↑</a><a href="https://github.com/AndrezzaNascimento6/trustflow-financial-transparency" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div></div>
      <div className="site-photo-credits">
        <span>ILLUSTRATIVE PHOTOGRAPHY VIA <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">UNSPLASH LICENSE</a>; PEOPLE SHOWN ARE NOT TRUSTFLOW CUSTOMERS.</span>
        <span>PHOTOS: <a href="https://unsplash.com/photos/woman-smiling-while-looking-at-her-smartphone-NtFfR3xULbQ" target="_blank" rel="noopener noreferrer">VITALY GARIEV</a>, <a href="https://unsplash.com/photos/young-woman-smiling-while-looking-at-her-phone-5qANSc28FrE" target="_blank" rel="noopener noreferrer">VITALY GARIEV</a>, <a href="https://unsplash.com/photos/man-sits-thoughtfully-outside-a-cafe-JDQTqv7pkJs" target="_blank" rel="noopener noreferrer">ĐÀO VIỆT HOÀNG</a>.</span>
      </div>
    </footer>
  </div>;
}
