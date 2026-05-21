import { useState, useEffect, useRef, useCallback } from "react";
import philipPhoto from "/philip.png";

const LIME = "#D4ED2A";
const BLACK = "#111111";
const WHITE = "#F5F5F0";
const GRAY = "#888880";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Karla:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  html, body { background: ${BLACK}; color: ${WHITE}; font-family: 'Karla', sans-serif; overflow-x: hidden; cursor: none; }

  /* GRAIN OVERLAY */
  body::after {
    content: '';
    position: fixed; inset: 0; z-index: 9999;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 180px;
  }

  /* CUSTOM CURSOR */
  .cursor-dot {
    position: fixed; top: 0; left: 0; z-index: 10000;
    width: 8px; height: 8px;
    background: ${LIME};
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: transform 0.1s, width 0.3s, height 0.3s, opacity 0.3s;
    mix-blend-mode: difference;
  }
  .cursor-ring {
    position: fixed; top: 0; left: 0; z-index: 9999;
    width: 40px; height: 40px;
    border: 1px solid rgba(212,237,42,0.5);
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: transform 0.08s linear, width 0.3s, height 0.3s, opacity 0.3s, border-color 0.3s;
  }
  .cursor-ring.hovering {
    width: 60px; height: 60px;
    border-color: ${LIME};
    background: rgba(212,237,42,0.05);
  }

  /* SCROLL PROGRESS */
  .scroll-progress {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    height: 2px; background: transparent;
  }
  .scroll-progress-bar {
    height: 100%;
    background: ${LIME};
    transform-origin: left;
    transition: transform 0.1s linear;
  }

  .portfolio-root { background: ${BLACK}; min-height: 100vh; color: ${WHITE}; font-family: 'Karla', sans-serif; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 40px;
    background: rgba(17,17,17,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: padding 0.3s;
  }
  .nav.scrolled { padding: 14px 40px; }
  .nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 3px; color: ${LIME}; cursor: none; }
  .nav-links { display: flex; gap: 32px; }
  .nav-link {
    font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 2px;
    text-transform: uppercase; color: ${GRAY}; cursor: none;
    transition: color 0.3s; background: none; border: none; padding: 0;
    position: relative;
  }
  .nav-link::after {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
    height: 1px; background: ${LIME};
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s;
  }
  .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
  .nav-link:hover, .nav-link.active { color: ${LIME}; }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding: 100px 40px 60px;
    gap: 60px;
    position: relative;
    overflow: hidden;
  }
  .hero-bg-text {
    position: absolute;
    bottom: -60px; left: -20px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(100px, 16vw, 240px);
    color: rgba(255,255,255,0.025);
    white-space: nowrap;
    pointer-events: none; user-select: none; letter-spacing: -4px;
    transition: transform 0.1s linear;
  }
  .hero-left { position: relative; z-index: 1; }
  .hero-tag {
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: 3px; text-transform: uppercase; color: ${LIME};
    margin-bottom: 24px; display: flex; align-items: center; gap: 12px;
    opacity: 0; animation: slideUp 0.8s 0.2s forwards;
  }
  .hero-tag::before { content: ''; display: block; width: 40px; height: 1px; background: ${LIME}; }

  .hero-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(64px, 9vw, 140px);
    line-height: 0.88; letter-spacing: -2px; color: ${WHITE}; margin-bottom: 16px;
    opacity: 0; animation: slideUp 0.8s 0.4s forwards;
  }
  .hero-name span { color: ${LIME}; }

  .hero-typewriter {
    font-family: 'Space Mono', monospace;
    font-size: 14px; letter-spacing: 2px; text-transform: uppercase;
    color: ${GRAY}; margin-bottom: 32px; height: 20px;
    opacity: 0; animation: slideUp 0.8s 0.6s forwards;
  }
  .typewriter-cursor {
    display: inline-block; width: 2px; height: 14px;
    background: ${LIME}; margin-left: 2px; vertical-align: middle;
    animation: blink 1s infinite;
  }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

  .hero-desc {
    font-size: 15px; line-height: 1.8; color: ${GRAY}; max-width: 400px;
    font-weight: 300; margin-bottom: 40px;
    opacity: 0; animation: slideUp 0.8s 0.8s forwards;
  }
  .hero-cta {
    display: flex; gap: 16px; flex-wrap: wrap;
    opacity: 0; animation: slideUp 0.8s 1s forwards;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* MAGNETIC BUTTON */
  .btn-primary {
    background: ${LIME}; color: ${BLACK};
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 14px 28px; border: none; cursor: none;
    transition: background 0.25s, box-shadow 0.25s;
    font-weight: 700; text-decoration: none; display: inline-block;
    position: relative; overflow: hidden;
  }
  .btn-primary::after {
    content: ''; position: absolute; inset: 0;
    background: rgba(255,255,255,0.2);
    transform: translateX(-100%);
    transition: transform 0.4s;
  }
  .btn-primary:hover::after { transform: translateX(100%); }
  .btn-primary:hover { background: ${WHITE}; box-shadow: 0 0 30px rgba(212,237,42,0.3); }

  .btn-outline {
    background: transparent; color: ${WHITE};
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 13px 28px; border: 1px solid rgba(255,255,255,0.25);
    cursor: none; transition: all 0.25s;
    text-decoration: none; display: inline-block; position: relative;
  }
  .btn-outline:hover { border-color: ${LIME}; color: ${LIME}; box-shadow: 0 0 20px rgba(212,237,42,0.15); }

  /* PHOTO */
  .hero-right {
    position: relative; display: flex; justify-content: center; align-items: center;
    opacity: 0; animation: slideUp 0.8s 0.5s forwards;
  }
  .photo-frame {
    position: relative;
    width: clamp(280px, 35vw, 480px);
    aspect-ratio: 1;
  }
  .photo-frame::before {
    content: '';
    position: absolute;
    inset: -12px; border: 2px solid ${LIME};
    opacity: 0.3;
    transform: rotate(3deg);
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s;
  }
  .photo-frame:hover::before { transform: rotate(0deg); opacity: 0.7; }
  .photo-frame::after {
    content: '';
    position: absolute;
    bottom: -20px; right: -20px;
    width: 80px; height: 80px;
    background: ${LIME};
    z-index: 0;
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .photo-frame:hover::after { transform: translate(6px, 6px); }
  .hero-photo {
    width: 100%; height: 100%;
    object-fit: cover; object-position: top center;
    display: block; position: relative; z-index: 1;
    filter: grayscale(100%) contrast(1.1);
    transition: filter 0.6s;
  }
  .photo-frame:hover .hero-photo { filter: grayscale(80%) contrast(1.05); }
  .photo-label {
    position: absolute; bottom: -36px; left: 0;
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${GRAY};
  }

  .scroll-hint {
    position: absolute; bottom: 32px; left: 40px;
    display: flex; align-items: center; gap: 12px;
    opacity: 0; animation: slideUp 0.8s 1.4s forwards;
  }
  .scroll-line {
    width: 60px; height: 1px;
    background: linear-gradient(to right, ${LIME}, transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }
  .scroll-hint span {
    font-family: 'Space Mono', monospace; font-size: 10px;
    letter-spacing: 3px; text-transform: uppercase; color: ${GRAY};
  }
  @keyframes scrollPulse {
    0%,100% { opacity: 0.4; transform: scaleX(0.8); transform-origin: left; }
    50% { opacity: 1; transform: scaleX(1); }
  }

  .full-divider { width: 100%; height: 1px; background: rgba(255,255,255,0.06); }

  .section { padding: 100px 40px; max-width: 1100px; margin: 0 auto; }
  .section-label {
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: 3px; text-transform: uppercase; color: ${LIME};
    margin-bottom: 16px; display: flex; align-items: center; gap: 12px;
  }
  .section-label::before { content: ''; display: block; width: 30px; height: 1px; background: ${LIME}; }
  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(48px, 7vw, 100px);
    line-height: 0.9; letter-spacing: -1px; margin-bottom: 60px; color: ${WHITE};
  }

  /* ABOUT */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
  .about-quote {
    font-family: 'Bebas Neue', sans-serif; font-size: 52px;
    line-height: 1.0; color: ${LIME}; margin-bottom: 24px;
  }
  .about-text { font-size: 16px; line-height: 1.8; color: #BBBBB5; font-weight: 300; }
  .about-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
  .stat-box {
    border-left: 2px solid ${LIME}; padding-left: 20px;
    transition: border-color 0.3s;
  }
  .stat-box:hover { border-color: ${WHITE}; }
  .stat-number {
    font-family: 'Bebas Neue', sans-serif; font-size: 52px; color: ${WHITE}; line-height: 1;
    transition: color 0.3s;
  }
  .stat-box:hover .stat-number { color: ${LIME}; }
  .stat-label { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${GRAY}; margin-top: 4px; }

  .interests { margin-top: 40px; display: flex; flex-wrap: wrap; gap: 10px; }
  .interest-tag {
    border: 1px solid rgba(255,255,255,0.15); padding: 6px 14px;
    font-family: 'Space Mono', monospace; font-size: 10px;
    letter-spacing: 1.5px; text-transform: uppercase; color: ${GRAY};
    transition: all 0.3s; cursor: none;
  }
  .interest-tag:hover {
    border-color: ${LIME}; color: ${LIME};
    background: rgba(212,237,42,0.05);
    transform: translateY(-2px);
  }

  /* EXPERIENCE */
  .exp-item {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 48px 0;
    display: grid; grid-template-columns: 200px 1fr; gap: 40px;
    transition: border-color 0.3s;
  }
  .exp-item:hover { border-color: rgba(212,237,42,0.3); }
  .exp-company { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: ${LIME}; letter-spacing: 1px; margin-bottom: 6px; }
  .exp-period { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 2px; color: ${GRAY}; }
  .exp-bullets { list-style: none; }
  .exp-bullets li {
    font-size: 15px; line-height: 1.7; color: #BBBBB5; font-weight: 300;
    padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
    display: flex; gap: 12px;
    transition: color 0.3s, padding-left 0.3s;
  }
  .exp-bullets li:hover { color: ${WHITE}; padding-left: 8px; }
  .exp-bullets li::before { content: '→'; color: ${LIME}; flex-shrink: 0; }

  /* SKILLS */
  .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
  .skill-card {
    background: rgba(255,255,255,0.03); padding: 36px 30px;
    transition: background 0.4s, transform 0.3s;
    cursor: none; position: relative; overflow: hidden;
  }
  .skill-card::before {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: ${LIME};
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s;
  }
  .skill-card:hover { background: rgba(212,237,42,0.06); transform: translateY(-4px); }
  .skill-card:hover::before { transform: scaleX(1); }
  .skill-card-icon { font-size: 28px; margin-bottom: 20px; display: block; transition: transform 0.3s; }
  .skill-card:hover .skill-card-icon { transform: scale(1.2) rotate(5deg); }
  .skill-card-title { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 1px; color: ${WHITE}; margin-bottom: 20px; }
  .skill-list { list-style: none; }
  .skill-list li {
    font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 1px;
    color: ${GRAY}; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; gap: 8px;
    transition: color 0.3s, gap 0.3s;
  }
  .skill-list li:hover { color: ${WHITE}; gap: 12px; }
  .skill-list li::before { content: '·'; color: ${LIME}; font-size: 18px; line-height: 0; }

  /* MARQUEE */
  .marquee-section {
    padding: 40px 0; overflow: hidden;
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(212,237,42,0.03);
  }
  .marquee-track {
    display: flex; gap: 0;
    animation: marquee 20s linear infinite;
    width: max-content;
  }
  .marquee-track:hover { animation-play-state: paused; }
  .marquee-item {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px; letter-spacing: 4px;
    color: rgba(255,255,255,0.15);
    padding: 0 40px; white-space: nowrap;
    transition: color 0.3s;
  }
  .marquee-item:hover { color: ${LIME}; }
  .marquee-sep { color: ${LIME}; padding: 0 10px; opacity: 0.5; }
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  /* CONTACT */
  .contact-wrapper {
    background: rgba(255,255,255,0.03); padding: 80px;
    text-align: center; position: relative; overflow: hidden;
  }
  .contact-wrapper::before {
    content: '"';
    position: absolute; font-family: 'Bebas Neue', sans-serif;
    font-size: 400px; color: rgba(212,237,42,0.04);
    top: -100px; left: -30px; pointer-events: none;
    transition: transform 0.1s linear;
  }
  .contact-tagline { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: ${LIME}; margin-bottom: 24px; }
  .contact-heading { font-family: 'Bebas Neue', sans-serif; font-size: clamp(48px, 6vw, 90px); line-height: 0.95; margin-bottom: 40px; }
  .contact-links { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 48px; }
  .contact-info { font-family: 'Space Mono', monospace; font-size: 12px; color: ${GRAY}; letter-spacing: 1px; margin-top: 32px; }
  .contact-info a { color: ${GRAY}; text-decoration: none; transition: color 0.3s; }
  .contact-info a:hover { color: ${LIME}; }

  .footer {
    padding: 30px 40px; border-top: 1px solid rgba(255,255,255,0.06);
    display: flex; justify-content: space-between; align-items: center;
  }
  .footer-name { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 3px; color: rgba(255,255,255,0.2); }
  .footer-copy { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 1px; color: rgba(255,255,255,0.15); }

  .fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 900px) {
    html, body { cursor: auto; }
    .cursor-dot, .cursor-ring { display: none; }
    .hero { grid-template-columns: 1fr; padding: 100px 20px 60px; }
    .hero-right { order: -1; }
    .photo-frame { width: clamp(200px, 60vw, 320px); }
    .nav { padding: 16px 20px; }
    .nav.scrolled { padding: 12px 20px; }
    .nav-links { display: none; }
    .section { padding: 70px 20px; }
    .about-grid { grid-template-columns: 1fr; }
    .exp-item { grid-template-columns: 1fr; gap: 16px; }
    .skills-grid { grid-template-columns: 1fr; }
    .contact-wrapper { padding: 48px 24px; }
    .footer { flex-direction: column; gap: 12px; text-align: center; }
  }
`;

// TYPEWRITER
const WORDS = ["Art Director", "Brand Designer", "Print & Digital", "Creative Mind"];

function Typewriter() {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = WORDS[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1));
        if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), 1500);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDeleting(false); setWordIdx((i) => (i + 1) % WORDS.length); }
      }
    }, deleting ? 60 : 120);
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIdx]);
  return <div className="hero-typewriter">{text}<span className="typewriter-cursor" /></div>;
}

// COUNTER
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const isInfinity = target === "∞";
        if (isInfinity) { setCount("∞"); return; }
        let start = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 40);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// FADE IN
function useIntersection(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}
function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return <div ref={ref} className={`fade-in${visible ? " visible" : ""}`} style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</div>;
}

const sections = ["hero", "about", "experience", "skills", "contact"];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);
  const [hovering, setHovering] = useState(false);
  const parallaxBg = useRef(null);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Cursor
  useEffect(() => {
    const move = (e) => {
      if (cursorDot.current) {
        cursorDot.current.style.left = e.clientX + "px";
        cursorDot.current.style.top = e.clientY + "px";
      }
      if (cursorRing.current) {
        cursorRing.current.style.left = e.clientX + "px";
        cursorRing.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Hover detection for interactive elements
  useEffect(() => {
    const els = document.querySelectorAll("a, button, .interest-tag, .skill-card, .marquee-item");
    const on = () => setHovering(true);
    const off = () => setHovering(false);
    els.forEach(el => { el.addEventListener("mouseenter", on); el.addEventListener("mouseleave", off); });
    return () => els.forEach(el => { el.removeEventListener("mouseenter", on); el.removeEventListener("mouseleave", off); });
  });

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(scrollY / maxScroll);
      setScrolled(scrollY > 60);

      // Parallax bg text
      if (parallaxBg.current) parallaxBg.current.style.transform = `translateY(${scrollY * 0.15}px)`;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom > 200) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const marqueeItems = ["Flughafen Salzburg", "Events & Festivals", "Volksbank Dortmund", "Vonovia", "Klostermann Hamm", "Brand Design", "Print", "Digital", "KI & Prompting"];

  return (
    <div className="portfolio-root">
      <style>{styles}</style>

      {/* CUSTOM CURSOR */}
      <div ref={cursorDot} className="cursor-dot" />
      <div ref={cursorRing} className={`cursor-ring${hovering ? " hovering" : ""}`} />

      {/* SCROLL PROGRESS */}
      <div className="scroll-progress">
        <div className="scroll-progress-bar" style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>

      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo" onClick={() => scrollTo("hero")}>PS</div>
        <div className="nav-links">
          {["about","experience","skills","contact"].map(s => (
            <button key={s} className={`nav-link${activeSection === s ? " active" : ""}`} onClick={() => scrollTo(s)}>{s}</button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        <div ref={parallaxBg} className="hero-bg-text">ART DIRECTOR</div>

        <div className="hero-left">
          <div className="hero-tag">Philip Spiekermann · Ruhrgebiet</div>
          <h1 className="hero-name">PHILIP<br /><span>SPIEKERMANN</span></h1>
          <Typewriter />
          <p className="hero-desc">
            Kreativität trifft Haltung. Ich gestalte Markenauftritte,
            die hängenbleiben – von der Idee bis zur finalen Umsetzung.
            Ruhrgebiet im Herzen, Medien im Blut.
          </p>
          <div className="hero-cta">
            <a href="https://www.behance.net/philsez" target="_blank" rel="noreferrer" className="btn-primary">Portfolio ansehen</a>
            <button className="btn-outline" onClick={() => scrollTo("contact")}>Kontakt</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="photo-frame">
            <img src={philipPhoto} alt="Philip Spiekermann" className="hero-photo" />
            <div className="photo-label">Recklinghausen · Ruhrgebiet</div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">
              {item} <span className="marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="section">
          <FadeIn>
            <div className="section-label">Über mich</div>
            <h2 className="section-title">PERSÖNLICH</h2>
          </FadeIn>
          <div className="about-grid">
            <FadeIn delay={100}>
              <div className="about-quote">„Medien sind<br />mein Zuhause."</div>
              <p className="about-text">
                Ich bin Art Director aus dem Ruhrgebiet und fühle mich am wohlsten dort,
                wo es nicht nach Schema F läuft. Ich arbeite gerne im Team, übernehme
                Verantwortung und begleite Projekte mit Blick fürs große Ganze –
                vom Markenaufbau bis zur Optimierung interner Prozesse.
              </p>
              <p className="about-text" style={{ marginTop: 16 }}>
                KI nutze ich dabei gern als Sparringspartner, um schneller zu Lösungen
                zu kommen und kreative Wege konsequent weiterzudenken.
              </p>
              <div className="interests">
                {["Hip-Hop","Klassische Musik","Calisthenics","Yoga","Kochen","Interior","Wandern","Nachhaltigkeit"].map(i => (
                  <div key={i} className="interest-tag">{i}</div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="about-stats">
                {[
                  { num: 2, suffix: "+", label: "Jahre Erfahrung" },
                  { num: 3, suffix: "", label: "Tool-Suiten" },
                  { num: 4, suffix: "+", label: "Große Kunden" },
                  { num: "∞", suffix: "", label: "Kreative Ideen" },
                ].map(s => (
                  <div key={s.label} className="stat-box">
                    <div className="stat-number"><Counter target={s.num} suffix={s.suffix} /></div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <div className="full-divider" />

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="section">
          <FadeIn>
            <div className="section-label">Werdegang</div>
            <h2 className="section-title">ERFAHRUNG</h2>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="exp-item">
              <div>
                <div className="exp-company">Bounty Communication Group</div>
                <div className="exp-period">2024 — heute</div>
              </div>
              <ul className="exp-bullets">
                <li>Kreative Betreuung des Flughafen Salzburg – Kampagnen für Social Media, Google Ads und Print, von der Idee bis zur finalen Umsetzung.</li>
                <li>Visuelle Verantwortung für Events und Festivals: vom Konzept über den Markenauftritt bis zur kanalübergreifenden Umsetzung.</li>
                <li>Kampagnenentwicklung für die Volksbank Dortmund – Print, Digital und OOH mit klarem, wiedererkennbarem Markenauftritt.</li>
                <li>Entwurf und Layout umfangreicher Printmedien: saisonales Buch für Vonovia, Nachhaltigkeitsbericht für Klostermann Hamm.</li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="full-divider" />

      {/* SKILLS */}
      <section id="skills">
        <div className="section">
          <FadeIn>
            <div className="section-label">Kompetenzen</div>
            <h2 className="section-title">SKILLS</h2>
          </FadeIn>
          <div className="skills-grid">
            {[
              { icon: "🤖", title: "KI & Prompting", items: ["KI-Prompting für Bild- & Layoutideen", "Erstellung von KI-Vorlagen", "Harmonisierung von KI-Visuals"] },
              { icon: "🎨", title: "Layout & Design", items: ["Social-Media-Layouts", "Printmedien", "Logo-Design", "Markenkonforme Kampagnen", "Brand Design"] },
              { icon: "🛠", title: "Tools", items: ["Adobe Photoshop", "InDesign", "Illustrator", "Canva"] },
            ].map((card, i) => (
              <FadeIn key={card.title} delay={i * 80}>
                <div className="skill-card">
                  <span className="skill-card-icon">{card.icon}</span>
                  <div className="skill-card-title">{card.title}</div>
                  <ul className="skill-list">{card.items.map(item => <li key={item}>{item}</li>)}</ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <div className="full-divider" />

      {/* CONTACT */}
      <section id="contact">
        <div className="section">
          <FadeIn>
            <div className="contact-wrapper">
              <div className="contact-tagline">Lass uns reden</div>
              <h2 className="contact-heading">READY<br />TO CREATE?</h2>
              <p style={{ fontSize: 15, color: GRAY, maxWidth: 440, margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
                Ich bin kein Schema-F-Mensch – und suche Projekte, die das auch nicht sind.
                Schreib mir, ruf an, oder schau dir mein Portfolio an.
              </p>
              <div className="contact-links">
                <a href="https://www.behance.net/philsez" target="_blank" rel="noreferrer" className="btn-primary">Behance Portfolio</a>
                <a href="https://www.linkedin.com/in/philip-spiekermann-450403205/" target="_blank" rel="noreferrer" className="btn-outline">LinkedIn</a>
                <a href="mailto:philipspiekermann@hotmail.com" className="btn-outline">E-Mail</a>
              </div>
              <div className="contact-info" style={{ marginTop: 40 }}>
                <a href="tel:015208950009">01520 8950009</a>{" · "}
                <a href="mailto:philipspiekermann@hotmail.com">philipspiekermann@hotmail.com</a>{" · "}
                45659 Recklinghausen
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-name">PHILIP SPIEKERMANN</div>
        <div className="footer-copy">Art Director · Print · Digital · 2026</div>
      </footer>
    </div>
  );
}
