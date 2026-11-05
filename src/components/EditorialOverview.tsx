"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, Clock3, Eye, FileSearch,
  LockKeyhole, Plus, ShieldCheck, Unplug
} from "lucide-react";

type Permission = {
  id: string;
  name: string;
  initials: string;
  color: string;
  purpose: string;
  description: string;
  scopes: string[];
  days: number;
  status: "active" | "expiring" | "revoked";
  last: string;
};
type AccessEvent = {
  id: string;
  name: string;
  detail: string;
  time: string;
  kind: "access" | "consent" | "revoke";
};
type Props = {
  connections: Permission[];
  events: AccessEvent[];
  onReview: (id: string) => void;
  onManage: () => void;
  onNew: () => void;
  onActivity: () => void;
  onDesign: () => void;
};

const easing = [0.22, 1, 0.36, 1] as const;

export default function EditorialOverview({
  connections, events, onReview, onManage, onNew, onActivity, onDesign
}: Props) {
  const reduced = useReducedMotion();
  const active = connections.filter((item) => item.status !== "revoked");
  const focus = active.find((item) => item.status === "expiring") ?? active[0];
  const visible = [...active, ...connections.filter((item) => item.status === "revoked")].slice(0, 4);
  const uniqueScopes = [...new Set(active.flatMap((item) => item.scopes))];

  function entrance(delay: number) {
    return reduced
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.8, ease: easing }
        };
  }

  return (
    <div className="editorial-home">
      <section className="editorial-hero" aria-labelledby="intro-title">
        <motion.div className="editorial-hero-meta" {...entrance(0)}>
          <span><span className="editorial-mark" /> THE PERMISSION DESK</span>
          <span>YOUR FINANCIAL INFORMATION / UNDER YOUR CONTROL</span>
        </motion.div>
        <div className="editorial-hero-columns">
          <motion.h1 id="intro-title" {...entrance(0.08)}>
            Your money.<br />
            <em>Your information.</em><br />
            Your decision.
          </motion.h1>
          <motion.div className="editorial-hero-aside" {...entrance(0.2)}>
            <span className="editorial-aside-index">01 — THE BIG PICTURE</span>
            <p>
              Check who you have allowed to access your financial data, what
              they can see, and when their permission ends.
            </p>
            <button className="editorial-link" onClick={onManage}>
              Review all permissions <ArrowUpRight size={19} />
            </button>
          </motion.div>
        </div>
        <motion.div className="editorial-rule" {...entrance(0.3)}>
          <span>{String(active.length).padStart(2, "0")} CURRENT PERMISSIONS</span>
          <span>{String(uniqueScopes.length).padStart(2, "0")} TYPES OF INFORMATION SHARED</span>
          <span>DEMO DATA, NOT A BANK ACCOUNT</span>
        </motion.div>
      </section>

      <motion.section className="editorial-feature" aria-labelledby="feature-title" {...entrance(0.3)}>
        <div className="editorial-feature-main">
          <div className="feature-overline">
            <span><span className="feature-alert-dot"/> {focus?.status === "expiring" ? "TIME TO REVIEW" : "YOUR NEXT DECISION"}</span>
            <span>PERMISSION SPOTLIGHT / 01</span>
          </div>
          {focus ? (
            <>
              <div className="feature-body">
                <span className="feature-entity">{focus.name.toUpperCase()} <span>—</span> {focus.purpose}</span>
                <h2 id="feature-title">
                  {focus.status === "expiring" ? "This permission is almost up." : "Know what you've shared."}
                </h2>
                <p>
                  {focus.name} is allowed to access {focus.scopes.join(" and ").toLowerCase()}.
                  {focus.status === "expiring"
                    ? " Review the details before the permission expires."
                    : " You can review the scope and withdraw access."}
                </p>
                <div className="feature-buttons">
                  <button className="feature-primary" onClick={() => onReview(focus.id)}>
                    Examine this permission <ArrowUpRight size={19} />
                  </button>
                  <button className="feature-secondary" onClick={onManage}>
                    View every connection <ArrowRight size={18} />
                  </button>
                </div>
              </div>
              <div className="feature-foot">
                <span>SHARED CATEGORIES</span>
                <span>{focus.scopes.join("  /  ").toUpperCase()}</span>
              </div>
            </>
          ) : (
            <div className="feature-body">
              <h2 id="feature-title">Nothing currently shared.</h2>
              <p>Explore the guided flow to see how informed consent could work.</p>
              <button className="feature-primary" onClick={onNew}>Explore a permission <Plus size={19}/></button>
            </div>
          )}
        </div>
        <div className="editorial-feature-side">
          <span className="feature-side-top"><Clock3 size={20}/> PERMISSION WINDOW</span>
          {focus ? (
            <>
              <div className="feature-clock" aria-label={focus.days + " days remaining"}>
                <motion.div className="clock-background" initial={reduced ? false : { rotate: -25, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{duration:1.3,ease:easing}}>
                  <div className="clock-inner">
                    <strong>{String(focus.days).padStart(2, "0")}</strong>
                    <span>DAYS LEFT</span>
                  </div>
                </motion.div>
              </div>
              <div className="feature-side-bottom">
                <span>{focus.status === "expiring" ? "EXPIRING SOON" : "ACTIVE ACCESS"}</span>
                <strong>{focus.name}</strong>
                <p>Duration shown is illustrative, not live account data.</p>
              </div>
            </>
          ) : (
            <div className="feature-clock"><div className="clock-background"><div className="clock-inner"><strong>00</strong><span>ACTIVE</span></div></div></div>
          )}
        </div>
      </motion.section>

      <section className="editorial-sections" aria-label="Permission overview and activity">
        <div className="editorial-permissions">
          <div className="editorial-section-heading">
            <div>
              <span className="editorial-kicker">02 / ACCESS REGISTER</span>
              <h2>Who can see <em>what.</em></h2>
              <p>Not a collection of scores. A record of real decisions you should be able to understand.</p>
            </div>
            <button className="editorial-icon-link" onClick={onManage} aria-label="See all connections"><ArrowUpRight size={21}/></button>
          </div>

          <div className="editorial-table-wrap">
            <table className="editorial-access-table">
              <thead><tr><th scope="col">RECIPIENT</th><th scope="col">DATA SHARED</th><th scope="col">ACCESS</th><th scope="col"><span className="sr-only">Review</span></th></tr></thead>
              <tbody>{visible.map((item, index) => (
                <motion.tr key={item.id} {...entrance(0.36 + index * 0.07)}>
                  <td><button className="editorial-company" onClick={() => onReview(item.id)}>
                    <span className={"editorial-monogram editorial-monogram-"+item.color}>{item.initials}</span>
                    <span><strong>{item.name}</strong><small>{item.purpose}</small></span>
                  </button></td>
                  <td><span className="editorial-data-label">{item.scopes.join(" · ")}</span></td>
                  <td><span className={"editorial-status editorial-status-"+item.status}><span/>{item.status === "revoked" ? "Ended" : item.status === "expiring" ? "Expiring" : "Active"}</span></td>
                  <td><button className="editorial-row-action" aria-label={"Review "+item.name} onClick={() => onReview(item.id)}><ArrowUpRight size={20}/></button></td>
                </motion.tr>
              ))}</tbody>
            </table>
            {connections.length === 0 && <p className="editorial-empty">No permissions in this demonstration.</p>}
          </div>
          <button className="editorial-more" onClick={onManage}>Open the full register <ArrowRight size={18}/></button>
        </div>
        <div className="editorial-ledger">
          <div className="editorial-section-heading">
            <div>
              <span className="editorial-kicker">03 / ACCESS HISTORY</span>
              <h2>A record you <em>can read.</em></h2>
            </div>
          </div>
          <div className="ledger-list">
            {events.slice(0, 3).map((event, index) => (
              <motion.div key={event.id} className="ledger-event" {...entrance(0.5 + index * 0.09)}>
                <span className={"ledger-glyph ledger-glyph-"+event.kind}>
                  {event.kind === "revoke" ? <Unplug size={19}/> : event.kind === "access" ? <Eye size={19}/> : <Check size={19}/>}
                </span>
                <div>
                  <span className="ledger-date">{event.time}</span>
                  <h3>{event.name}</h3>
                  <p>{event.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="editorial-link ledger-link" onClick={onActivity}>Read the full timeline <ArrowUpRight size={19}/></button>
        </div>
      </section>

      <section className="editorial-bottom" aria-label="Consent principles">
        <div className="editorial-bottom-number">04 <span>/</span> A BETTER QUESTION</div>
        <div className="editorial-bottom-main">
          <h2>Not just <em>“Do you agree?”</em><br/>But “Do you understand?”</h2>
          <p>A useful consent experience explains the purpose, the data involved, the duration and what changes when access is withdrawn.</p>
          <button className="editorial-link" onClick={onDesign}>Read the product rationale <ArrowUpRight size={19}/></button>
        </div>
        <span className="editorial-bottom-icon"><FileSearch size={36} strokeWidth={1.3}/></span>
      </section>
      <div className="editorial-legal-note"><LockKeyhole size={17}/><span>TrustFlow is a fictional UX prototype. The listed organizations and activities are sample data; no real financial information is accessed.</span><ShieldCheck size={17}/></div>
    </div>
  );
}
