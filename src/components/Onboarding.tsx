"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Check, CheckCircle2,
  Database, Fingerprint, KeyRound, Landmark, LockKeyhole, ShieldCheck,
} from "lucide-react";

export type FictionalBank = {
  id: string;
  name: string;
  initials: string;
  tone: "terracotta" | "olive" | "blue";
  subtitle: string;
};

const BANKS: FictionalBank[] = [
  { id: "lumera", name: "Banco Lumera", initials: "LU", tone: "terracotta", subtitle: "Everyday banking" },
  { id: "bruma", name: "Bruma Bank", initials: "BR", tone: "olive", subtitle: "Digital banking" },
  { id: "terravista", name: "Banco Terravista", initials: "TV", tone: "blue", subtitle: "Accounts and investments" },
];

const CATEGORIES = [
  { id: "Account details", name: "Account details", description: "Account type, identifier and balance" },
  { id: "Transactions", name: "Transactions", description: "Transaction amounts, dates and descriptions" },
  { id: "Investments", name: "Investments", description: "Investment holdings and values" },
];

type Stage = "login" | "choose" | "verify" | "consent" | "completed";

type Props = {
  onComplete: (bank: FictionalBank, categories: string[]) => void;
  onSkip: () => void;
};

function Brand() {
  return <span className="onboard-brand" aria-label="TrustFlow"><span className="onboard-logo" aria-hidden="true"><span/><span/><span/></span><span>trust<strong>flow</strong><i>.</i></span></span>;
}

function Emblem({ bank }: { bank: FictionalBank }) {
  return <span className={"onboard-bank-emblem tone-"+bank.tone} aria-hidden="true">{bank.initials}</span>;
}

export default function Onboarding({ onComplete, onSkip }: Props) {
  const [stage, setStage] = useState<Stage>("login");
  const [bankId, setBankId] = useState(BANKS[0].id);
  const [scopes, setScopes] = useState<string[]>(["Account details", "Transactions"]);
  const [confirmed, setConfirmed] = useState(false);
  const reduced = useReducedMotion();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bank = BANKS.find((item) => item.id === bankId) ?? BANKS[0];

  useEffect(() => { if (stage !== "login") titleRef.current?.focus(); }, [stage]);

  const title = {
    login: <>A clearer view of<br/><em>what&apos;s yours.</em></>,
    choose: <>Where is your<br/><em>information held?</em></>,
    verify: <>A secure handoff,<br/><em>made understandable.</em></>,
    consent: <>Know what moves.<br/><em>Choose what stays.</em></>,
    completed: <>You&apos;re connected.<br/><em>You&apos;re in control.</em></>,
  }[stage];

  function goTo(next: Stage) { setStage(next); }
  function toggleScope(category: string) {
    setConfirmed(false);
    setScopes((current) => current.includes(category) ? current.filter((x) => x !== category) : [...current, category]);
  }
  function approve() { if (scopes.length > 0 && confirmed) goTo("completed"); }

  return <div className="onboard-app">
    <a href="#onboard-main" className="skip-link">Skip to content</a>
    <header className="onboard-header">
      <Brand/>
      <div className="onboard-header-right"><span className="onboard-prototype-tag"><span/> INTERACTIVE PROTOTYPE</span><button className="onboard-text-button" onClick={onSkip}>Explore dashboard <ArrowUpRight size={17}/></button></div>
    </header>

    <main id="onboard-main" className="onboard-main">
      <div className="onboard-stage-top">
        <div className="onboard-stage-label">THE TRUSTFLOW EXPERIENCE <span>—</span> 2026</div>
        <span className="onboard-stage-count">0{["login","choose","verify","consent","completed"].indexOf(stage)+1} / 05</span>
      </div>
      <div className="onboard-layout">
        <div className="onboard-editorial">
          <div className="onboard-dash"><span/> A PERSONAL FINANCIAL CONTROL SPACE</div>
          <AnimatePresence mode="wait">
            <motion.div key={stage} initial={reduced ? false : {opacity:0,y:27}} animate={{opacity:1,y:0}} exit={reduced ? undefined : {opacity:0,y:-15}} transition={{duration:reduced?0:.45,ease:[.22,1,.36,1] as [number,number,number,number]}}>
              <h1 ref={titleRef} tabIndex={-1} className="onboard-display-heading">{title}</h1>
              <p className="onboard-editorial-caption">
                {stage === "login" && "Financial permissions should be easy to understand, not buried behind technical language. Start with a fictional profile."}
                {stage === "choose" && "Choose where the sample information comes from. Every financial institution shown here is invented for this experience."}
                {stage === "verify" && "In a live Open Finance experience, you would authenticate with the institution holding your data. Here, the handoff is completely simulated."}
                {stage === "consent" && "You decide which categories you would share and why. Nothing is sent to a bank or an external service."}
                {stage === "completed" && "Your simulated consent is ready to inspect. Continue to the dashboard to review it alongside other illustrative permissions."}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="onboard-editorial-rail">
            <div className="onboard-rail-numbers"><span>CLARITY</span><span>CONSENT</span><span>CONTROL</span></div>
            <div className="onboard-track" aria-label={"Progress, "+(["login","choose","verify","consent","completed"].indexOf(stage)+1)+" of 5"}>
              {(["login","choose","verify","consent","completed"] as Stage[]).map((s,i)=><span className={["login","choose","verify","consent","completed"].indexOf(stage)>=i?"complete":""} key={s}/>)}
            </div>
          </div>
        </div>

        <div className="onboard-interaction">
          <AnimatePresence mode="wait">
            <motion.section key={stage} initial={reduced?false:{opacity:0,x:22}} animate={{opacity:1,x:0}} exit={reduced?undefined:{opacity:0,x:-18}} transition={{duration:reduced?0:.35,ease:"easeOut"}} aria-label={stage+" step"}>
              {stage === "login" && <>
                <span className="onboard-form-step">01 / WELCOME</span>
                <div className="onboard-icon-well"><Fingerprint size={30} strokeWidth={1.6}/></div>
                <h2>Enter your space.</h2>
                <p className="onboard-form-description">Use a pre-configured fictional profile. No password, CPF or personal banking information is needed.</p>
                <div className="onboard-identity">
                  <div className="onboard-profile-avatar">JD</div>
                  <div><strong>Jamie Doe</strong><span>demo.user@example.test</span></div>
                  <span className="onboard-sample-marker">SAMPLE</span>
                </div>
                <button className="onboard-primary" onClick={()=>goTo("choose")}>Continue as Jamie <ArrowRight size={19}/></button>
                <p className="onboard-help"><LockKeyhole size={16}/> This is a mock sign-in, not real authentication.</p>
              </>}
              {stage === "choose" && <>
                <span className="onboard-form-step">02 / SOURCE INSTITUTION</span>
                <h2>Select a fictional bank.</h2>
                <p className="onboard-form-description">In a real integration, this is the institution that already holds your financial information.</p>
                <div className="onboard-bank-list" role="group" aria-label="Choose bank">
                  {BANKS.map((item)=><button key={item.id} type="button" aria-pressed={bankId===item.id} className={"onboard-bank-option"+(bankId===item.id?" is-selected":"")} onClick={()=>setBankId(item.id)}>
                    <Emblem bank={item}/>
                    <span className="onboard-bank-label"><strong>{item.name}</strong><span>{item.subtitle}</span></span>
                    <span className="onboard-radio">{bankId===item.id&&<Check size={14}/>}</span>
                  </button>)}
                </div>
                <p className="onboard-inline-disclaimer"><ShieldCheck size={18}/> All names and identities are fictional.</p>
                <div className="onboard-actions"><button className="onboard-back" onClick={()=>goTo("login")}><ArrowLeft size={18}/> Back</button><button className="onboard-primary" onClick={()=>goTo("verify")}>Continue <ArrowRight size={19}/></button></div>
              </>}
              {stage === "verify" && <>
                <span className="onboard-form-step">03 / BANK HANDOFF</span>
                <div className="onboard-handoff-heading"><Emblem bank={bank}/><span><small>SIMULATED BANK EXPERIENCE</small><strong>{bank.name}</strong></span></div>
                <h2>Confirm your identity.</h2>
                <p className="onboard-form-description">A participating bank would handle its own secure authentication. We intentionally do not ask for passwords or simulate genuine identity verification.</p>
                <div className="onboard-verification-card"><KeyRound size={27}/><div><strong>Demo verification</strong><p>Preview the journey without connecting to any banking system.</p></div></div>
                <div className="onboard-actions"><button className="onboard-back" onClick={()=>goTo("choose")}><ArrowLeft size={18}/> Change bank</button><button className="onboard-primary" onClick={()=>goTo("consent")}>Simulate verification <ArrowRight size={19}/></button></div>
                <p className="onboard-help"><LockKeyhole size={16}/> No login credentials are requested, transmitted or stored.</p>
              </>}
              {stage === "consent" && <>
                <span className="onboard-form-step">04 / INFORMED CONSENT</span>
                <h2>Review before sharing.</h2>
                <p className="onboard-form-description">You&apos;re authorizing <strong>TrustFlow Demo</strong> to receive selected sample categories from <strong>{bank.name}</strong> in this prototype.</p>
                <div className="onboard-consent-summary">
                  <div><span>DATA HOLDER</span><strong>{bank.name}</strong></div>
                  <div><span>RECIPIENT</span><strong>TrustFlow Demo</strong></div>
                  <div><span>PURPOSE</span><strong>Understand and manage permissions</strong></div>
                  <div><span>DURATION</span><strong>90 days (illustrative)</strong></div>
                </div>
                <fieldset className="onboard-scopes">
                  <legend>Choose information categories</legend>
                  {CATEGORIES.map(item=><label key={item.id} className="onboard-scope">
                    <input type="checkbox" checked={scopes.includes(item.id)} onChange={()=>toggleScope(item.id)}/>
                    <span><strong>{item.name}</strong><small>{item.description}</small></span>
                  </label>)}
                </fieldset>
                <label className="onboard-confirmation"><input type="checkbox" checked={confirmed} onChange={(e)=>setConfirmed(e.target.checked)}/><span>I understand that this is a simulation and does not share real financial data.</span></label>
                <div className="onboard-actions"><button className="onboard-back" onClick={()=>goTo("verify")}><ArrowLeft size={18}/> Back</button><button className="onboard-primary" disabled={scopes.length===0||!confirmed} onClick={approve}>Authorize in demo <ShieldCheck size={19}/></button></div>
              </>}
              {stage === "completed" && <>
                <span className="onboard-form-step">05 / SIMULATION COMPLETE</span>
                <motion.div className="onboard-done-symbol" initial={reduced?false:{scale:.65,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:200,damping:18}}><CheckCircle2 size={41} strokeWidth={1.7}/></motion.div>
                <h2>Permission recorded.</h2>
                <p className="onboard-form-description">The following permission will appear in the sample dashboard. You can inspect its scope and revoke it there.</p>
                <div className="onboard-finish-card">
                  <span><Landmark size={18}/> SOURCE INSTITUTION</span><strong>{bank.name}</strong>
                  <span><Database size={18}/> SHARING SCOPE</span><strong>{scopes.join(" · ")}</strong>
                  <span><ShieldCheck size={18}/> STATUS</span><strong>Active in demo only</strong>
                </div>
                <button className="onboard-primary" onClick={()=>onComplete(bank,scopes)}>Open my dashboard <ArrowUpRight size={19}/></button>
                <p className="onboard-help"><ShieldCheck size={16}/> No data left this browser as part of this simulation.</p>
              </>}
            </motion.section>
          </AnimatePresence>
        </div>
      </div>
      <div className="onboard-endnote"><span>INDEPENDENT DESIGN CONCEPT</span><span>NO REAL BANK CONNECTIONS · NO REAL CUSTOMER DATA</span></div>
    </main>
  </div>;
}
