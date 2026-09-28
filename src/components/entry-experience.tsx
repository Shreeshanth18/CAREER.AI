"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, Activity, ShieldCheck, Sparkles } from "lucide-react";
import { useRef } from "react";

const CareerScene = dynamic(() => import("@/components/career-scene"), { ssr: false });

export default function EntryExperience() {
  const stageRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const noMotion = Boolean(reducedMotion);

  return <main className="experience">
    <section className="entry-screen" id="entry" ref={stageRef}>
      <div className="entry-noise" />
      <header className="entry-topline">
        <Link className="wordmark" href="/"><span><Sparkles size={15} /></span>CAREER<span className="wordmark-accent">.AI</span></Link>
        <span className="engine-state"><i /> CAREER ENGINE <b>ONLINE</b></span>
        <Link className="entry-open" href="/workspace">OPEN WORKSPACE <ArrowUpRight size={14} /></Link>
      </header>
      <div className="hero-stage">
        <CareerScene mode="hero" reducedMotion={noMotion} />
        <div className="hero-concepts" aria-label="Career concepts in the AI core">
          {["PYTHON", "MACHINE LEARNING", "DEEP LEARNING", "SQL", "DOCKER", "CLOUD", "MLOPS", "SYSTEM DESIGN"].map((concept, index) => <Link href="/workspace/skills" className={`hero-concept concept-${index + 1}`} key={concept}><i />{concept}</Link>)}
        </div>
        <motion.div className="hero-copy" initial={noMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: noMotion ? 0 : .7, ease: [.2, .75, .25, 1] }}>
          <p className="eyebrow"><i className="label-rule" /> YOUR PERSONAL CAREER INTELLIGENCE SYSTEM</p>
          <h1>Your career.<br /><em>Engineered</em> by intelligence.</h1>
          <p className="hero-subtitle">An AI career operating system that understands your skills, identifies your gaps, builds your roadmap, and evolves with you.</p>
          <div className="hero-buttons"><Link className="button button-primary magnetic" href="/workspace">ENTER YOUR CAREER <ArrowRight size={16} /></Link><a className="button button-minimal" href="#system-preview">EXPLORE THE SYSTEM <ArrowDown size={14} /></a></div>
          <div className="hero-trust"><span><ShieldCheck size={14} /> Evidence over assumptions</span><span><Activity size={14} /> Built around your trajectory</span></div>
        </motion.div>
        <div className="hero-telemetry telemetry-left"><span>CAREER CORE / 01</span><small>PROFILE SIGNALS / LIVE</small><small>ROLE TARGET / AI ENGINEER</small></div>
        <div className="hero-telemetry telemetry-right"><span>LIVE SIGNAL</span><b><i /> SYSTEM READY</b><small>PROFILE SYNCHRONIZED</small></div>
        <a className="hero-scroll" href="#system-preview">SCROLL TO EXPLORE <span /></a>
      </div>
      <section className="system-preview" id="system-preview"><div><span>ONE CAREER. CONNECTED SIGNALS.</span><p>Skills, projects, learning, and opportunity<br /><em>working as one system.</em></p></div><div className="preview-flow"><span>PROFILE</span><i /><span>SKILL MAP</span><i /><span>ROADMAP</span><i /><span>OPPORTUNITY</span></div><Link href="/workspace">ENTER COMMAND CENTER <ArrowUpRight size={14} /></Link></section>
      <footer className="entry-footer"><span>DESIGNED FOR THE CAREER YOU WANT TO BUILD</span><span>SCROLL / 01</span></footer>
    </section>
  </main>;
}