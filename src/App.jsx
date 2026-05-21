import { useState, useEffect, useRef } from "react";
import philipPhoto from "/philip.png";

// ─── Tokens ──────────────────────────────────────────────────────────────────

const LIME  = "#D4ED2A";
const BLACK = "#0d0d0d";
const OFF   = "#F5F5F0";
const GRAY  = "#666660";
const DIM   = "rgba(255,255,255,0.06)";

// ─── Data ────────────────────────────────────────────────────────────────────

const WORDS = ["Art Director", "Brand Designer", "Print & Digital", "Creative Mind"];

const MARQUEE = [
  "Flughafen Salzburg", "Events & Festivals", "Volksbank Dortmund",
  "Vonovia", "Klostermann Hamm", "Brand Design", "Print", "Digital", "KI & Prompting",
];

const INTERESTS = [
  "Hip-Hop","Klassische Musik","Calisthenics","Yoga","Kochen","Interior","Wandern","Nachhaltigkeit",
];

const STATS = [
  { num: 2,   suffix: "+", label: "Jahre Erfahrung" },
  { num: 3,   suffix: "",  label: "Tool-Suiten" },
  { num: 4,   suffix: "+", label: "Große Kunden" },
  { num: "∞", suffix: "",  label: "Kreative Ideen" },
];

const EXP_BULLETS = [
  "Kreative Betreuung des Flughafen Salzburg – Kampagnen für Social Media, Google Ads und Print, von der Idee bis zur finalen Umsetzung.",
  "Visuelle Verantwortung für Events und Festivals: vom Konzept über den Markenauftritt bis zur kanalübergreifenden Umsetzung.",
  "Kampagnenentwicklung für die Volksbank Dortmund – Print, Digital und OOH mit klarem, wiedererkennbarem Markenauftritt.",
  "Entwurf und Layout umfangreicher Printmedien: saisonales Buch für Vonovia, Nachhaltigkeitsbericht für Klostermann Hamm.",
];

const PROJECTS = [
  {
    title: "Flughafen Salzburg",
    cat:   "Social Media · Google Ads · Print",
    year:  "2024",
    tag:   "Kampagne",
    featured: true,
    bg: "linear-gradient(135deg,#1a1000 0%,#3a2800 40%,#1a1200 70%,#0f0900 100%)",
    glow: "rgba(212,237,42,.12)",
    label: "FLUGHAFEN\nSALZBURG",
  },
  {
    title: "Volksbank Dortmund",
    cat:   "Print · Digital · OOH",
    year:  "2024",
    tag:   "Brand · OOH",
    bg: "linear-gradient(135deg,#0a0a18 0%,#1a1430 55%,#0a0a14 100%)",
    glow: "rgba(120,80,255,.15)",
    label: "VOLKSBANK\nDORTMUND",
  },
  {
    title: "Vonovia Saisonbuch",
    cat:   "Editorial Design · Print",
    year:  "2024",
    tag:   "Editorial · Print",
    bg: "linear-gradient(135deg,#001610 0%,#002a1e 55%,#000f0a 100%)",
    glow: "rgba(0,200,100,.10)",
    label: "VONOVIA\nSAISONBUCH",
  },
  {
    title: "Klostermann Hamm",
    cat:   "Nachhaltigkeitsbericht · Print",
    year:  "2024",
    tag:   "Nachhaltigkeit",
    bg: "linear-gradient(135deg,#0f1400 0%,#2a3000 55%,#0a0f00 100%)",
    glow: "rgba(212,237,42,.09)",
    label: "KLOSTERMANN\nHAMM",
  },
];

const SKILLS = [
  {
    icon: "🤖", title: "KI & Prompting",
    items: ["KI-Prompting für Bild- & Layoutideen","Erstellung von KI-Vorlagen","Harmonisierung von KI-Visuals"],
  },
  {
    icon: "🎨", title: "Layout & Design",
    items: ["Social-Media-Layouts","Printmedien","Logo-Design","Markenkonforme Kampagnen","Brand Design"],
  },
  {
    icon: "🛠", title: "Tools",
    items: ["Adobe Photoshop","InDesign","Illustrator","Canva"],
  },
];

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Karla:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: ${BLACK}; color: ${OFF};
    font-family: 'Karla', sans-serif; font-weight: 300;
    overflow-x: hidden; cursor: none;
  }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }

  /* ── Grain ── */
  body::after {
    content: ''; position: fixed; inset: 0; z-index: 9000;
    pointer-events: none; opacity: 0.038;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px; mix-blend-mode: screen;
  }

  /* ── Cursor ── */
  .c-dot, .c-ring {
    position: fixed; border-radius: 50%;
    pointer-events: none; z-index: 99999;
    transform: translate(-50%,-50%);
  }
  .c-dot {
    width: 7px; height: 7px;
    background: ${LIME};
    box-shadow: 0 0 8px ${LIME};
    transition: width .2s, height .2s;
    mix-blend-mode: difference;
  }
  .c-ring {
    width: 36px; height: 36px;
    border: 1px solid rgba(212,237,42,.4);
    transition: width .28s ease, height .28s ease, border-color .28s, background .28s;
  }
  .c-ring.hov {
    width: 60px; height: 60px;
    border-color: ${LIME};
    background: rgba(212,237,42,.04);
  }

  /* ── Scroll progress ── */
  .pbar {
    position: fixed; top: 0; left: 0; right: 0; height: 2px;
    z-index: 200; overflow: hidden;
  }
  .pbar-fill {
    height: 100%; background: ${LIME};
    transform-origin: left; transition: transform .08s linear;
    box-shadow: 0 0 8px ${LIME};
  }

  /* ── Nav ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 22px 48px;
    background: rgba(13,13,13,.88); backdrop-filter: blur(14px);
    border-bottom: 1px solid ${DIM};
    transition: padding .3s;
  }
  nav.scrolled { padding: 14px 48px; }
  .nav-logo {
    font-family: 'Bebas Neue', sans-serif; font-size: 22px;
    letter-spacing: 4px; color: ${LIME}; cursor: none;
  }
  .nav-links { display: flex; gap: 36px; }
  .nav-btn {
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 2px; text-transform: uppercase;
    color: ${GRAY}; background: none; border: none; cursor: none;
    transition: color .25s; position: relative; padding: 0;
  }
  .nav-btn::after {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
    height: 1px; background: ${LIME};
    transform: scaleX(0); transform-origin: left; transition: transform .3s;
  }
  .nav-btn:hover, .nav-btn.active { color: ${LIME}; }
  .nav-btn:hover::after, .nav-btn.active::after { transform: scaleX(1); }

  /* ── Hero ── */
  .hero {
    min-height: 100vh;
    display: grid; grid-template-columns: 1fr 1fr;
    align-items: center;
    padding: 110px 48px 60px; gap: 80px;
    position: relative; overflow: hidden;
  }
  .hero-bg-text {
    position: absolute; bottom: -80px; left: -10px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(100px, 16vw, 240px);
    color: rgba(255,255,255,.02);
    white-space: nowrap; pointer-events: none; user-select: none;
    letter-spacing: -4px; will-change: transform;
  }
  .hero-left { position: relative; z-index: 2; }

  .hero-eyebrow {
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 3px; text-transform: uppercase; color: ${LIME};
    margin-bottom: 28px;
    display: flex; align-items: center; gap: 14px;
    opacity: 0; animation: up .8s .2s forwards;
  }
  .hero-eyebrow::before { content: ''; width: 40px; height: 1px; background: ${LIME}; flex-shrink: 0; }

  .hero-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(64px, 9.5vw, 150px);
    line-height: .88; letter-spacing: -1px; color: ${OFF};
    margin-bottom: 20px;
    opacity: 0; animation: up .8s .4s forwards;
  }
  .hero-name em { font-style: normal; color: ${LIME}; }

  .hero-tw {
    font-family: 'DM Mono', monospace; font-size: 13px;
    letter-spacing: 2.5px; text-transform: uppercase; color: ${GRAY};
    margin-bottom: 32px; height: 20px; display: flex; align-items: center;
    opacity: 0; animation: up .8s .6s forwards;
  }
  .tw-caret {
    display: inline-block; width: 2px; height: 13px;
    background: ${LIME}; margin-left: 3px; vertical-align: middle;
    animation: blink 1s infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  .hero-desc {
    font-size: 15px; line-height: 1.85; color: ${GRAY};
    max-width: 400px; margin-bottom: 44px;
    opacity: 0; animation: up .8s .8s forwards;
  }
  .hero-cta {
    display: flex; gap: 16px; flex-wrap: wrap;
    opacity: 0; animation: up .8s 1s forwards;
  }
  @keyframes up { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }

  .scroll-hint {
    position: absolute; bottom: 36px; left: 48px;
    display: flex; align-items: center; gap: 14px;
    opacity: 0; animation: up .8s 1.4s forwards;
  }
  .scroll-line {
    width: 56px; height: 1px;
    background: linear-gradient(to right, ${LIME}, transparent);
    animation: spulse 2.2s ease-in-out infinite;
  }
  .scroll-hint span {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 3px; text-transform: uppercase; color: ${GRAY};
  }
  @keyframes spulse { 0%,100%{opacity:.35;transform:scaleX(.8);transform-origin:left} 50%{opacity:1;transform:scaleX(1)} }

  /* ── Photo ── */
  .hero-right {
    position: relative; z-index: 2;
    display: flex; justify-content: center; align-items: center;
    opacity: 0; animation: up .8s .5s forwards;
  }
  .photo-frame {
    position: relative;
    width: clamp(280px, 34vw, 480px);
    aspect-ratio: 1;
  }
  .photo-frame::before {
    content: ''; position: absolute; inset: -12px;
    border: 2px solid ${LIME}; opacity: .25;
    transform: rotate(3deg);
    transition: transform .6s cubic-bezier(.23,1,.32,1), opacity .4s;
  }
  .photo-frame:hover::before { transform: rotate(0deg); opacity: .65; }
  .photo-frame::after {
    content: ''; position: absolute; bottom: -20px; right: -20px;
    width: 72px; height: 72px; background: ${LIME}; z-index: 0;
    transition: transform .4s cubic-bezier(.23,1,.32,1);
  }
  .photo-frame:hover::after { transform: translate(6px,6px); }
  .hero-photo {
    width: 100%; height: 100%; object-fit: cover; object-position: top center;
    display: block; position: relative; z-index: 1;
    filter: grayscale(100%) contrast(1.1);
    transition: filter .6s;
  }
  .photo-frame:hover .hero-photo { filter: grayscale(70%) contrast(1.05); }
  .photo-location {
    position: absolute; bottom: -36px; left: 0;
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 2px; text-transform: uppercase; color: ${GRAY};
  }

  /* ── Buttons ── */
  .btn-p {
    background: ${LIME}; color: ${BLACK};
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 14px 30px; border: none; cursor: none;
    display: inline-block; font-weight: 500;
    position: relative; overflow: hidden;
    transition: background .25s, box-shadow .25s;
  }
  .btn-p::after {
    content: ''; position: absolute; inset: 0;
    background: rgba(255,255,255,.2);
    transform: translateX(-110%); transition: transform .4s;
  }
  .btn-p:hover::after { transform: translateX(110%); }
  .btn-p:hover { background: ${OFF}; box-shadow: 0 0 32px rgba(212,237,42,.3); }

  .btn-o {
    background: transparent; color: ${OFF};
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 13px 30px; border: 1px solid rgba(255,255,255,.2);
    cursor: none; display: inline-block;
    transition: border-color .25s, color .25s, box-shadow .25s;
    position: relative; overflow: hidden;
  }
  .btn-o:hover { border-color: ${LIME}; color: ${LIME}; box-shadow: 0 0 20px rgba(212,237,42,.12); }

  /* ── Marquee ── */
  .marquee-wrap {
    overflow: hidden; padding: 36px 0;
    border-top: 1px solid ${DIM}; border-bottom: 1px solid ${DIM};
    background: rgba(212,237,42,.025);
  }
  .marquee-track {
    display: flex; width: max-content;
    animation: marquee 22s linear infinite;
  }
  .marquee-track:hover { animation-play-state: paused; }
  .marquee-item {
    font-family: 'Bebas Neue', sans-serif; font-size: 26px;
    letter-spacing: 4px; color: rgba(255,255,255,.14);
    padding: 0 40px; white-space: nowrap;
    transition: color .3s; cursor: none;
  }
  .marquee-item:hover { color: ${LIME}; }
  .marquee-sep { color: ${LIME}; opacity: .5; padding: 0 8px; }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* ── Divider ── */
  .divider { width: 100%; height: 1px; background: ${DIM}; }

  /* ── Section shell ── */
  .section { padding: 100px 48px; max-width: 1100px; margin: 0 auto; }
  .section-label {
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 3px; text-transform: uppercase; color: ${LIME};
    margin-bottom: 16px; display: flex; align-items: center; gap: 14px;
  }
  .section-label::before { content: ''; width: 28px; height: 1px; background: ${LIME}; }
  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(52px, 7vw, 110px);
    line-height: .88; letter-spacing: -1px; color: ${OFF};
    margin-bottom: 64px;
  }

  /* ── About ── */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: start; }
  .about-quote {
    font-family: 'Bebas Neue', sans-serif; font-size: 54px;
    line-height: 1; color: ${LIME}; margin-bottom: 28px;
  }
  .about-body { font-size: 15px; line-height: 1.85; color: #aaa; }
  .about-body + .about-body { margin-top: 18px; }

  .interests { margin-top: 40px; display: flex; flex-wrap: wrap; gap: 10px; }
  .int-tag {
    border: 1px solid rgba(255,255,255,.12); padding: 6px 14px;
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 1.5px; text-transform: uppercase; color: ${GRAY};
    transition: all .3s; cursor: none;
  }
  .int-tag:hover {
    border-color: ${LIME}; color: ${LIME};
    background: rgba(212,237,42,.05); transform: translateY(-2px);
  }

  .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .stat-box {
    border-left: 2px solid ${LIME}; padding-left: 22px;
    transition: border-color .3s;
  }
  .stat-box:hover { border-color: ${OFF}; }
  .stat-num {
    font-family: 'Bebas Neue', sans-serif; font-size: 58px;
    color: ${OFF}; line-height: 1; transition: color .3s;
  }
  .stat-box:hover .stat-num { color: ${LIME}; }
  .stat-lbl {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 2px; text-transform: uppercase; color: ${GRAY}; margin-top: 4px;
  }

  /* ── Experience ── */
  .exp-block {
    border-top: 1px solid rgba(255,255,255,.08);
    padding: 52px 0;
    display: grid; grid-template-columns: 220px 1fr; gap: 48px;
    transition: border-color .3s;
  }
  .exp-block:hover { border-color: rgba(212,237,42,.3); }
  .exp-company {
    font-family: 'Bebas Neue', sans-serif; font-size: 22px;
    color: ${LIME}; letter-spacing: 1px; margin-bottom: 8px;
  }
  .exp-period {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 2px; text-transform: uppercase; color: ${GRAY};
  }
  .exp-bullets { list-style: none; }
  .exp-bullets li {
    font-size: 14px; line-height: 1.75; color: #aaa; font-weight: 300;
    padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,.04);
    display: flex; gap: 14px;
    transition: color .3s, padding-left .3s;
  }
  .exp-bullets li::before { content: '→'; color: ${LIME}; flex-shrink: 0; line-height: 1.75; }
  .exp-bullets li:hover { color: ${OFF}; padding-left: 8px; }

  /* ── Projects ── */
  .projects-section { padding: 8rem 3rem; }
  .projects-header { max-width: 1200px; margin: 0 auto 3.5rem; }
  .proj-grid {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(2,1fr);
    gap: 2px; background: var(--border); border: 1px solid var(--border);
  }
  .proj-card {
    background: var(--dark); cursor: none;
    position: relative; overflow: hidden;
  }
  .proj-card.featured { grid-column: span 2; }
  .proj-thumb {
    position: relative; overflow: hidden;
  }
  .proj-card.featured .proj-thumb { aspect-ratio: 21/8; }
  .proj-card:not(.featured) .proj-thumb { aspect-ratio: 16/10; }
  .proj-fill {
    position: absolute; inset: 0;
    transition: transform .65s cubic-bezier(.23,1,.32,1);
  }
  .proj-card:hover .proj-fill { transform: scale(1.06); }
  .proj-glow {
    position: absolute; inset: 0;
    pointer-events: none;
  }
  .proj-label {
    position: absolute; bottom: 20%; left: 8%;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(20px,4vw,64px);
    color: rgba(255,255,255,.1); letter-spacing: 3px;
    line-height: 1; pointer-events: none; white-space: pre-line;
  }
  .proj-card.featured .proj-label { font-size: clamp(32px,5vw,72px); color: rgba(212,237,42,.18); }
  .proj-overlay {
    position: absolute; inset: 0;
    background: rgba(8,8,8,.55);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity .3s;
    font-family: 'Bebas Neue', sans-serif; font-size: 1rem;
    letter-spacing: .1em; color: var(--lime);
  }
  .proj-card:hover .proj-overlay { opacity: 1; }
  .proj-tag {
    position: absolute; top: 1.1rem; left: 1.4rem;
    padding: .3rem .85rem;
    background: rgba(8,8,8,.75); border: 1px solid var(--border); border-radius: 100px;
    font-size: .58rem; letter-spacing: .12em; text-transform: uppercase; color: var(--lime);
  }
  .proj-meta {
    padding: 1.25rem 1.75rem;
    display: flex; justify-content: space-between; align-items: flex-end;
    border-top: 1px solid var(--border);
  }
  .proj-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 1.1rem;
    color: #fff; letter-spacing: .04em; margin-bottom: .3rem;
  }
  .proj-cat { font-size: .64rem; color: var(--muted); letter-spacing: .04em; }
  .proj-year { font-size: .64rem; color: var(--muted); }

  /* ── Skills ── */
  .skills-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; }
  .skill-card {
    background: rgba(255,255,255,.03); padding: 40px 32px;
    transition: background .4s, transform .3s; cursor: none;
    position: relative; overflow: hidden;
  }
  .skill-card::before {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: ${LIME};
    transform: scaleX(0); transform-origin: left; transition: transform .4s;
  }
  .skill-card:hover { background: rgba(212,237,42,.055); transform: translateY(-5px); }
  .skill-card:hover::before { transform: scaleX(1); }
  .skill-icon { font-size: 30px; margin-bottom: 22px; display: block; transition: transform .3s; }
  .skill-card:hover .skill-icon { transform: scale(1.18) rotate(5deg); }
  .skill-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 28px;
    letter-spacing: 1px; color: ${OFF}; margin-bottom: 22px;
  }
  .skill-items { list-style: none; }
  .skill-items li {
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 1px;
    color: ${GRAY}; padding: 7px 0;
    border-bottom: 1px solid rgba(255,255,255,.05);
    display: flex; align-items: center; gap: 10px;
    transition: color .25s, gap .25s;
  }
  .skill-items li::before { content: '·'; color: ${LIME}; font-size: 20px; line-height: 0; }
  .skill-items li:hover { color: ${OFF}; gap: 14px; }

  /* ── Contact ── */
  .contact-box {
    background: rgba(255,255,255,.03); padding: 88px 80px;
    text-align: center; position: relative; overflow: hidden;
  }
  .contact-box::before {
    content: '"';
    position: absolute; font-family: 'Bebas Neue', sans-serif;
    font-size: 400px; color: rgba(212,237,42,.04);
    top: -100px; left: -30px; pointer-events: none; line-height: 1;
  }
  .contact-tag {
    font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 3px; text-transform: uppercase; color: ${LIME};
    margin-bottom: 24px; position: relative;
  }
  .contact-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(52px, 6vw, 96px); line-height: .92;
    color: ${OFF}; margin-bottom: 28px; position: relative;
  }
  .contact-sub {
    font-size: 15px; color: ${GRAY}; max-width: 440px;
    margin: 0 auto 52px; line-height: 1.85; font-weight: 300; position: relative;
  }
  .contact-btns {
    display: flex; justify-content: center; gap: 18px; flex-wrap: wrap; position: relative;
  }
  .contact-info {
    margin-top: 44px;
    font-family: 'DM Mono', monospace; font-size: 11px;
    letter-spacing: 1px; color: ${GRAY}; position: relative;
    display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 24px;
  }
  .contact-info a { color: ${GRAY}; transition: color .25s; }
  .contact-info a:hover { color: ${LIME}; }

  /* ── Footer ── */
  footer {
    padding: 28px 48px; border-top: 1px solid ${DIM};
    display: flex; justify-content: space-between; align-items: center;
  }
  .footer-name {
    font-family: 'Bebas Neue', sans-serif; font-size: 18px;
    letter-spacing: 4px; color: rgba(255,255,255,.18);
  }
  .footer-copy {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 1px; color: rgba(255,255,255,.14);
  }

  /* ── FadeIn ── */
  .fi { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s ease; }
  .fi.vis { opacity: 1; transform: translateY(0); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    body { cursor: auto; }
    .c-dot, .c-ring { display: none; }
    .hero { grid-template-columns: 1fr; padding: 100px 24px 60px; gap: 48px; }
    .hero-right { order: -1; }
    .photo-frame { width: clamp(200px, 60vw, 320px); }
    nav { padding: 16px 24px; }
    nav.scrolled { padding: 12px 24px; }
    .nav-links { display: none; }
    .section { padding: 72px 24px; }
    .about-grid { grid-template-columns: 1fr; gap: 48px; }
    .exp-block { grid-template-columns: 1fr; gap: 20px; }
    .proj-grid { grid-template-columns: 1fr; }
      .proj-card.featured { grid-column: span 1; }
      .proj-card.featured .proj-thumb { aspect-ratio: 16/9; }
      .projects-section { padding: 5rem 1.5rem; }
    .contact-box { padding: 52px 24px; }
    footer { flex-direction: column; gap: 12px; text-align: center; padding: 24px; }
    .scroll-hint { left: 24px; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useIntersect(ref, threshold = 0.12) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return vis;
}

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const vis  = useIntersect(ref);
  return (
    <div ref={ref} className={`fi${vis ? " vis" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Typewriter() {
  const [txt, setTxt]   = useState("");
  const [idx, setIdx]   = useState(0);
  const [del, setDel]   = useState(false);
  useEffect(() => {
    const word = WORDS[idx];
    const t = setTimeout(() => {
      if (!del) {
        setTxt(word.slice(0, txt.length + 1));
        if (txt.length + 1 === word.length) setTimeout(() => setDel(true), 1600);
      } else {
        setTxt(word.slice(0, txt.length - 1));
        if (txt.length - 1 === 0) { setDel(false); setIdx(i => (i + 1) % WORDS.length); }
      }
    }, del ? 55 : 110);
    return () => clearTimeout(t);
  }, [txt, del, idx]);
  return (
    <div className="hero-tw">
      {txt}<span className="tw-caret" />
    </div>
  );
}

function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref     = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        if (target === "∞") { setVal("∞"); return; }
        let cur = 0;
        const step = Math.ceil(target / 40);
        const id = setInterval(() => {
          cur += step;
          if (cur >= target) { setVal(target); clearInterval(id); }
          else setVal(cur);
        }, 40);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function MagBtn({ children, className, href, onClick }) {
  const ref = useRef(null);
  const [xy, setXy] = useState({ x: 0, y: 0 });
  const onMove = e => {
    const r = ref.current.getBoundingClientRect();
    setXy({ x: (e.clientX - r.left - r.width/2)*.32, y: (e.clientY - r.top - r.height/2)*.32 });
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag ref={ref} href={href} className={className} onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() => setXy({ x:0, y:0 })}
      style={{ transform:`translate(${xy.x}px,${xy.y}px)`, transition:"transform .4s cubic-bezier(.23,1,.32,1)", display:"inline-block" }}>
      {children}
    </Tag>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const SECTIONS = ["hero","projects","about","experience","skills","contact"];

export default function App() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const bgRef   = useRef(null);

  const [hov,        setHov]        = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [activeSection, setActive]  = useState("hero");

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Cursor
  useEffect(() => {
    const fn = e => {
      const { clientX: x, clientY: y } = e;
      if (dotRef.current)  { dotRef.current.style.left  = x+"px"; dotRef.current.style.top  = y+"px"; }
      if (ringRef.current) { ringRef.current.style.left = x+"px"; ringRef.current.style.top = y+"px"; }
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  useEffect(() => {
    const on  = () => setHov(true);
    const off = () => setHov(false);
    const els = document.querySelectorAll("a,button,.int-tag,.skill-card,.proj-card,.marquee-item");
    els.forEach(el => { el.addEventListener("mouseenter", on); el.addEventListener("mouseleave", off); });
    return () => els.forEach(el => { el.removeEventListener("mouseenter", on); el.removeEventListener("mouseleave", off); });
  });

  // Scroll
  useEffect(() => {
    const fn = () => {
      const sy = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(sy / max);
      setScrolled(sy > 60);
      if (bgRef.current) bgRef.current.style.transform = `translateY(${sy * .15}px)`;
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= 200 && bottom > 200) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const allMarquee = [...MARQUEE, ...MARQUEE];

  return (
    <div style={{ background: BLACK, minHeight: "100vh" }}>
      <style>{CSS}</style>

      {/* Cursor */}
      <div ref={dotRef}  className="c-dot" />
      <div ref={ringRef} className={`c-ring${hov ? " hov" : ""}`} />

      {/* Progress */}
      <div className="pbar">
        <div className="pbar-fill" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* ── Nav ── */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-logo" onClick={() => scrollTo("hero")}>PS</div>
        <div className="nav-links">
          {["projects","about","experience","skills","contact"].map(s => (
            <button key={s} className={`nav-btn${activeSection === s ? " active" : ""}`} onClick={() => scrollTo(s)}>
              {s}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="hero" style={{ minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr", alignItems:"center", padding:"110px 48px 60px", gap:80, position:"relative", overflow:"hidden" }}>
        <div ref={bgRef} className="hero-bg-text">ART DIRECTOR</div>

        <div className="hero-left">
          <div className="hero-eyebrow">Philip Spiekermann · Ruhrgebiet</div>
          <h1 className="hero-name">
            PHILIP<br /><em>SPIEKERMANN</em>
          </h1>
          <Typewriter />
          <p className="hero-desc">
            Kreativität trifft Haltung. Ich gestalte Markenauftritte,
            die hängenbleiben – von der Idee bis zur finalen Umsetzung.
            Ruhrgebiet im Herzen, Medien im Blut.
          </p>
          <div className="hero-cta">
            <MagBtn href="https://www.behance.net/philsez" className="btn-p">Portfolio ansehen</MagBtn>
            <MagBtn onClick={() => scrollTo("contact")} className="btn-o">Kontakt</MagBtn>
          </div>
        </div>

        <div className="hero-right">
          <div className="photo-frame">
            <img src={philipPhoto} alt="Philip Spiekermann" className="hero-photo" />
            <div className="photo-location">Recklinghausen · Ruhrgebiet</div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── Marquee ── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {allMarquee.map((item, i) => (
            <span key={i} className="marquee-item">
              {item} <span className="marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Projects ── */}
      <div className="divider" />
      <section id="projects" className="projects-section">
        <div className="projects-header">
          <p className="section-label">— Ausgewählte Arbeiten</p>
          <h2 className="section-title">PROJEKTE</h2>
        </div>
        <div className="proj-grid">
          {PROJECTS.map((p, i) => (
            <div key={i} className={`proj-card${p.featured ? " featured" : ""}`}>
              <div className="proj-thumb">
                <div className="proj-fill" style={{ background: p.bg }} />
                <div
                  className="proj-glow"
                  style={{ background: `radial-gradient(ellipse at 40% 60%, ${p.glow}, transparent 55%)` }}
                />
                <div className="proj-label">{p.label}</div>
                <div className="proj-overlay">Ansehen →</div>
                <div className="proj-tag">{p.tag}</div>
              </div>
              <div className="proj-meta">
                <div>
                  <div className="proj-title">{p.title}</div>
                  <div className="proj-cat">{p.cat}</div>
                </div>
                <div className="proj-year">{p.year}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about">
        <div className="section">
          <FadeIn>
            <div className="section-label">Über mich</div>
            <h2 className="section-title">PERSÖN<br />LICH</h2>
          </FadeIn>
          <div className="about-grid">
            <FadeIn delay={80}>
              <div className="about-quote">„Medien sind<br />mein Zuhause."</div>
              <p className="about-body">
                Ich bin Art Director aus dem Ruhrgebiet und fühle mich am wohlsten dort,
                wo es nicht nach Schema F läuft. Ich arbeite gerne im Team, übernehme
                Verantwortung und begleite Projekte mit Blick fürs große Ganze –
                vom Markenaufbau bis zur Optimierung interner Prozesse.
              </p>
              <p className="about-body" style={{ marginTop: 18 }}>
                KI nutze ich dabei gern als Sparringspartner, um schneller zu Lösungen
                zu kommen und kreative Wege konsequent weiterzudenken.
              </p>
              <div className="interests">
                {INTERESTS.map(t => <div key={t} className="int-tag">{t}</div>)}
              </div>
            </FadeIn>
            <FadeIn delay={180}>
              <div className="about-stats">
                {STATS.map(s => (
                  <div key={s.label} className="stat-box">
                    <div className="stat-num">
                      <Counter target={s.num} suffix={s.suffix} />
                    </div>
                    <div className="stat-lbl">{s.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Experience ── */}
      <section id="experience">
        <div className="section">
          <FadeIn>
            <div className="section-label">Werdegang</div>
            <h2 className="section-title">ERFAH<br />RUNG</h2>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="exp-block">
              <div>
                <div className="exp-company">Bounty Communication Group</div>
                <div className="exp-period">2024 — heute</div>
              </div>
              <ul className="exp-bullets">
                {EXP_BULLETS.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="divider" />

      {/* ── Skills ── */}
      <section id="skills">
        <div className="section">
          <FadeIn>
            <div className="section-label">Kompetenzen</div>
            <h2 className="section-title">SKILLS</h2>
          </FadeIn>
          <div className="skills-grid">
            {SKILLS.map((card, i) => (
              <FadeIn key={card.title} delay={i * 80}>
                <div className="skill-card">
                  <span className="skill-icon">{card.icon}</span>
                  <div className="skill-title">{card.title}</div>
                  <ul className="skill-items">
                    {card.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── Contact ── */}
      <section id="contact">
        <div className="section">
          <FadeIn>
            <div className="contact-box">
              <div className="contact-tag">Lass uns reden</div>
              <h2 className="contact-heading">READY<br />TO CREATE?</h2>
              <p className="contact-sub">
                Ich bin kein Schema-F-Mensch – und suche Projekte, die das auch nicht sind.
                Schreib mir, ruf an, oder schau dir mein Portfolio an.
              </p>
              <div className="contact-btns">
                <MagBtn href="https://www.behance.net/philsez" className="btn-p">Behance Portfolio</MagBtn>
                <MagBtn href="https://www.linkedin.com/in/philip-spiekermann-450403205/" className="btn-o">LinkedIn</MagBtn>
                <MagBtn href="mailto:philipspiekermann@hotmail.com" className="btn-o">E-Mail</MagBtn>
              </div>
              <div className="contact-info">
                <a href="tel:015208950009">01520 8950009</a>
                <a href="mailto:philipspiekermann@hotmail.com">philipspiekermann@hotmail.com</a>
                <span>45659 Recklinghausen</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <div className="footer-name">PHILIP SPIEKERMANN</div>
        <div className="footer-copy">Art Director · Print · Digital · 2026</div>
      </footer>
    </div>
  );
}
