import { useState, useEffect, useRef } from "react";
import philipPhoto from "/philip.png";
import philipPhoto2 from "/philip2.png";

const LIME = "#D4ED2A";
const BLACK = "#111111";
const WHITE = "#F5F5F0";
const GRAY = "#888880";

const GLUTENFRY_CARDS = [
  { id: 1, label: "01 — Briefing",        title: "Der Auftrag",   desc: "Soul Food. Glutenfrei. Ein Brand der das genauso mutig sagt.",           img: "/gf_brand.png",  rot: -11, offX: -320, topOff: 80, zi: 1 },
  { id: 2, label: "02 — Visual Identity", title: "Logo & Marke",  desc: "GF-Maskottchen, Orange, Lila. Verspielt und unverwechselbar.",             img: "/gf_logo.png",   rot: -5,  offX: -160, topOff: 40, zi: 2 },
  { id: 3, label: "03 — Packaging",       title: "Verpackung",   desc: "Das Pattern zieht sich durch – von der Tüte bis zum Becher.",              img: "/gf_bag.png",    rot:  0,  offX:    0, topOff:  8, zi: 3 },
  { id: 4, label: "04 — Print",           title: "Flyer",          desc: "Crunchy Chicken Bowl. Null Weizen. Voller Hunger-Faktor.",                  img: "/gf_flyer.png",  rot:  5,  offX:  160, topOff: 40, zi: 2 },
  { id: 5, label: "05 — Ergebnis",        title: "Kein Verzicht",  desc: "Ein Brand der beweist: glutenfrei kann großartig aussehen.",               img: "/gf_result.png", rot: 11,  offX:  320, topOff: 80, zi: 1 },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Karla:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  html, body { background: ${BLACK}; color: ${WHITE}; font-family: 'Karla', sans-serif; overflow-x: hidden; cursor: none; }
  body::after { content: ''; position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: 0.035; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size: 180px; }
  .cursor-dot { position:fixed; top:0; left:0; z-index:10000; width:8px; height:8px; background:${LIME}; border-radius:50%; pointer-events:none; transform:translate(-50%,-50%); mix-blend-mode:difference; }
  .cursor-ring { position:fixed; top:0; left:0; z-index:9999; width:40px; height:40px; border:1px solid rgba(212,237,42,0.5); border-radius:50%; pointer-events:none; transform:translate(-50%,-50%); transition:left 0.08s linear,top 0.08s linear,width 0.3s,height 0.3s,border-color 0.3s; }
  .cursor-ring.hovering { width:64px; height:64px; border-color:${LIME}; background:rgba(212,237,42,0.04); }
  .cursor-ring.grabbing { width:28px; height:28px; border-color:${LIME}; border-width:2px; }
  .scroll-progress { position:fixed; top:0; left:0; right:0; z-index:200; height:2px; }
  .scroll-progress-bar { height:100%; background:${LIME}; transform-origin:left; }
  .portfolio-root { background:${BLACK}; min-height:100vh; color:${WHITE}; }
  .nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; justify-content:space-between; align-items:center; padding:20px 40px; background:rgba(17,17,17,0.88); backdrop-filter:blur(14px); border-bottom:1px solid rgba(255,255,255,0.04); transition:padding 0.3s; }
  .nav.scrolled { padding:13px 40px; }
  .nav-logo { font-family:'Bebas Neue',sans-serif; font-size:22px; letter-spacing:3px; color:${LIME}; cursor:none; }
  .nav-links { display:flex; gap:32px; align-items:center; }
  .nav-link { font-family:'Space Mono',monospace; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:${GRAY}; cursor:none; transition:color 0.3s; background:none; border:none; padding:0; position:relative; }
  .nav-link::after { content:''; position:absolute; bottom:-4px; left:0; right:0; height:1px; background:${LIME}; transform:scaleX(0); transform-origin:left; transition:transform 0.3s; }
  .nav-link:hover::after,.nav-link.active::after { transform:scaleX(1); }
  .nav-link:hover,.nav-link.active { color:${LIME}; }
  .nav-back { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:${GRAY}; cursor:none; background:none; border:1px solid rgba(255,255,255,0.12); padding:8px 16px; display:flex; align-items:center; gap:8px; transition:all 0.3s; }
  .nav-back:hover { color:${LIME}; border-color:${LIME}; }
  .nav-back-arrow { transition:transform 0.3s; display:inline-block; }
  .nav-back:hover .nav-back-arrow { transform:translateX(-4px); }
  .hero { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; align-items:center; padding:100px 40px 60px; gap:60px; position:relative; overflow:hidden; }
  .hero-bg-text { position:absolute; bottom:-60px; left:-20px; font-family:'Bebas Neue',sans-serif; font-size:clamp(100px,16vw,240px); color:rgba(255,255,255,0.022); white-space:nowrap; pointer-events:none; user-select:none; letter-spacing:-4px; }
  .hero-grid-dots { position:absolute; inset:0; background-image:radial-gradient(circle,rgba(212,237,42,0.07) 1px,transparent 1px); background-size:60px 60px; pointer-events:none; -webkit-mask-image:radial-gradient(ellipse 60% 80% at 85% 50%,black,transparent); mask-image:radial-gradient(ellipse 60% 80% at 85% 50%,black,transparent); }
  .hero-left { position:relative; z-index:1; }
  .hero-tag { font-family:'Space Mono',monospace; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:${LIME}; margin-bottom:24px; display:flex; align-items:center; gap:12px; opacity:0; animation:slideUp 0.8s 0.2s forwards; }
  .hero-tag::before { content:''; display:block; width:40px; height:1px; background:${LIME}; }
  .hero-name { font-family:'Bebas Neue',sans-serif; font-size:clamp(64px,9vw,140px); line-height:0.88; letter-spacing:-2px; color:${WHITE}; margin-bottom:16px; opacity:0; animation:slideUp 0.8s 0.4s forwards; }
  .hero-name span { color:${LIME}; }
  .hero-typewriter { font-family:'Space Mono',monospace; font-size:14px; letter-spacing:2px; text-transform:uppercase; color:${GRAY}; margin-bottom:32px; height:20px; opacity:0; animation:slideUp 0.8s 0.6s forwards; }
  .typewriter-cursor { display:inline-block; width:2px; height:14px; background:${LIME}; margin-left:2px; vertical-align:middle; animation:blink 1s infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .hero-desc { font-size:15px; line-height:1.8; color:${GRAY}; max-width:400px; font-weight:300; margin-bottom:40px; opacity:0; animation:slideUp 0.8s 0.8s forwards; }
  .hero-cta { display:flex; gap:16px; flex-wrap:wrap; opacity:0; animation:slideUp 0.8s 1s forwards; }
  @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  .btn-primary { background:${LIME}; color:${BLACK}; font-family:'Space Mono',monospace; font-size:11px; letter-spacing:2px; text-transform:uppercase; padding:14px 28px; border:none; cursor:none; transition:background 0.25s,box-shadow 0.25s,transform 0.2s; font-weight:700; text-decoration:none; display:inline-block; position:relative; overflow:hidden; }
  .btn-primary::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,0.2); transform:translateX(-100%); transition:transform 0.4s; }
  .btn-primary:hover::after { transform:translateX(100%); }
  .btn-primary:hover { background:${WHITE}; box-shadow:0 0 30px rgba(212,237,42,0.3); transform:translateY(-2px); }
  .btn-outline { background:transparent; color:${WHITE}; font-family:'Space Mono',monospace; font-size:11px; letter-spacing:2px; text-transform:uppercase; padding:13px 28px; border:1px solid rgba(255,255,255,0.25); cursor:none; transition:all 0.25s; text-decoration:none; display:inline-block; }
  .btn-outline:hover { border-color:${LIME}; color:${LIME}; box-shadow:0 0 20px rgba(212,237,42,0.15); transform:translateY(-2px); }
  .hero-right { position:relative; display:flex; justify-content:center; align-items:center; opacity:0; animation:slideUp 0.8s 0.5s forwards; }
  .photo-frame { position:relative; width:clamp(280px,35vw,480px); aspect-ratio:1; }
  .photo-frame::before { content:''; position:absolute; inset:-12px; border:2px solid ${LIME}; opacity:0.3; transform:rotate(3deg); transition:transform 0.6s cubic-bezier(0.23,1,0.32,1),opacity 0.4s; }
  .photo-frame:hover::before { transform:rotate(0deg); opacity:0.7; }
  .photo-frame::after { content:''; position:absolute; top:-16px; right:-16px; width:72px; height:72px; background:${LIME}; z-index:3; transition:transform 0.4s cubic-bezier(0.23,1,0.32,1); }
  .photo-frame:hover::after { transform:translate(5px,-5px); }
  .hero-photo { width:100%; height:100%; object-fit:cover; object-position:top center; display:block; position:absolute; top:0; left:0; z-index:1; filter:grayscale(100%) contrast(1.1); transition:opacity 1s ease, filter 0.6s; }
  .hero-photo.hidden { opacity:0; }
  .hero-photo.visible { opacity:1; }
  .photo-frame:hover .hero-photo { filter:grayscale(75%) contrast(1.05); }
  .photo-frame-inner { position:relative; width:100%; height:100%; }
  .photo-label { position:absolute; bottom:-36px; left:0; font-family:'Space Mono',monospace; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:${GRAY}; }
  .scroll-hint { position:absolute; bottom:32px; left:40px; display:flex; align-items:center; gap:12px; opacity:0; animation:slideUp 0.8s 1.4s forwards; }
  .scroll-line { width:60px; height:1px; background:linear-gradient(to right,${LIME},transparent); animation:scrollPulse 2s ease-in-out infinite; }
  .scroll-hint span { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:${GRAY}; }
  @keyframes scrollPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
  .full-divider { width:100%; height:1px; background:rgba(255,255,255,0.06); }
  .section { padding:100px 40px; max-width:1100px; margin:0 auto; }
  .section-label { font-family:'Space Mono',monospace; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:${LIME}; margin-bottom:16px; display:flex; align-items:center; gap:12px; }
  .section-label::before { content:''; display:block; width:30px; height:1px; background:${LIME}; }
  .section-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(48px,7vw,100px); line-height:0.9; letter-spacing:-1px; margin-bottom:60px; color:${WHITE}; }
  .about-grid { display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:start; }
  .about-quote { font-family:'Bebas Neue',sans-serif; font-size:52px; line-height:1.0; color:${LIME}; margin-bottom:24px; }
  .about-text { font-size:16px; line-height:1.8; color:#BBBBB5; font-weight:300; }
  .about-stats { display:grid; grid-template-columns:1fr 1fr; gap:30px; }
  .stat-box { border-left:2px solid ${LIME}; padding-left:20px; transition:border-color 0.3s; }
  .stat-box:hover { border-color:${WHITE}; }
  .stat-number { font-family:'Bebas Neue',sans-serif; font-size:52px; color:${WHITE}; line-height:1; transition:color 0.3s; }
  .stat-box:hover .stat-number { color:${LIME}; }
  .stat-label { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:${GRAY}; margin-top:4px; }
  .interests { margin-top:40px; display:flex; flex-wrap:wrap; gap:10px; }
  .interest-tag { border:1px solid rgba(255,255,255,0.15); padding:6px 14px; font-family:'Space Mono',monospace; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:${GRAY}; transition:all 0.3s; cursor:none; }
  .interest-tag:hover { border-color:${LIME}; color:${LIME}; background:rgba(212,237,42,0.05); transform:translateY(-2px); }
  .exp-item { border-top:1px solid rgba(255,255,255,0.08); padding:48px 0; display:grid; grid-template-columns:200px 1fr; gap:40px; transition:border-color 0.3s; }
  .exp-item:hover { border-color:rgba(212,237,42,0.3); }
  .exp-company { font-family:'Bebas Neue',sans-serif; font-size:22px; color:${LIME}; letter-spacing:1px; margin-bottom:6px; }
  .exp-period { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:2px; color:${GRAY}; }
  .exp-bullets { list-style:none; }
  .exp-bullets li { font-size:15px; line-height:1.7; color:#BBBBB5; font-weight:300; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04); display:flex; gap:12px; transition:color 0.3s,padding-left 0.3s; }
  .exp-bullets li:hover { color:${WHITE}; padding-left:8px; }
  .exp-bullets li::before { content:'→'; color:${LIME}; flex-shrink:0; }
  .skills-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; }
  .skill-card { background:rgba(255,255,255,0.03); padding:36px 30px; transition:background 0.4s,transform 0.3s; cursor:none; position:relative; overflow:hidden; }
  .skill-card::before { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:${LIME}; transform:scaleX(0); transform-origin:left; transition:transform 0.4s; }
  .skill-card:hover { background:rgba(212,237,42,0.06); transform:translateY(-4px); }
  .skill-card:hover::before { transform:scaleX(1); }
  .skill-card-icon { font-size:28px; margin-bottom:20px; display:block; transition:transform 0.3s; }
  .skill-card:hover .skill-card-icon { transform:scale(1.2) rotate(5deg); }
  .skill-card-title { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:1px; color:${WHITE}; margin-bottom:20px; }
  .skill-list { list-style:none; }
  .skill-list li { font-family:'Space Mono',monospace; font-size:11px; letter-spacing:1px; color:${GRAY}; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; gap:8px; transition:color 0.3s,gap 0.3s; }
  .skill-list li:hover { color:${WHITE}; gap:12px; }
  .skill-list li::before { content:'·'; color:${LIME}; font-size:18px; line-height:0; }
  .marquee-section { padding:32px 0 22px; overflow:hidden; border-top:1px solid rgba(255,255,255,0.06); border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(212,237,42,0.02); position:relative; user-select:none; }
  .marquee-item { font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:4px; color:rgba(255,255,255,0.15); padding:0 36px; white-space:nowrap; transition:color 0.3s; display:inline-flex; align-items:center; }
  .marquee-item:hover { color:rgba(255,255,255,0.4); }
  .marquee-item.clickable { color:${LIME}; }
  .marquee-item.clickable:hover { color:${WHITE}; }
  .marquee-badge { font-family:'Space Mono',monospace; font-size:8px; letter-spacing:2px; background:${LIME}; color:${BLACK}; padding:2px 7px; text-transform:uppercase; font-weight:700; margin-left:8px; transition:background 0.3s; }
  .marquee-item.clickable:hover .marquee-badge { background:${WHITE}; }
  .marquee-sep { color:${LIME}; padding:0 8px; opacity:0.45; }

  .contact-wrapper { background:rgba(255,255,255,0.03); padding:80px; text-align:center; position:relative; overflow:hidden; }
  .contact-wrapper::before { content:'"'; position:absolute; font-family:'Bebas Neue',sans-serif; font-size:400px; color:rgba(212,237,42,0.04); top:-100px; left:-30px; pointer-events:none; }
  .contact-tagline { font-family:'Space Mono',monospace; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:${LIME}; margin-bottom:24px; }
  .contact-heading { font-family:'Bebas Neue',sans-serif; font-size:clamp(48px,6vw,90px); line-height:0.95; margin-bottom:40px; }
  .contact-links { display:flex; justify-content:center; gap:20px; flex-wrap:wrap; margin-top:48px; }
  .contact-info { font-family:'Space Mono',monospace; font-size:12px; color:${GRAY}; letter-spacing:1px; margin-top:32px; }
  .contact-info a { color:${GRAY}; text-decoration:none; transition:color 0.3s; }
  .contact-info a:hover { color:${LIME}; }
  .footer { padding:30px 40px; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; }
  .footer-name { font-family:'Bebas Neue',sans-serif; font-size:18px; letter-spacing:3px; color:rgba(255,255,255,0.2); }
  .footer-copy { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:1px; color:rgba(255,255,255,0.15); }
  .fade-in { opacity:0; transform:translateY(30px); transition:opacity 0.7s ease,transform 0.7s ease; }
  .fade-in.visible { opacity:1; transform:translateY(0); }
  .cs-hero { min-height:80vh; display:flex; flex-direction:column; justify-content:flex-end; padding:140px 40px 80px; position:relative; overflow:hidden; border-bottom:1px solid rgba(255,255,255,0.06); }
  .mobile-cards-scroll { display:flex; overflow-x:auto; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; gap:16px; padding:4px 20px 24px; scrollbar-width:none; }
  .mobile-cards-scroll::-webkit-scrollbar { display:none; }
  .mobile-card { flex-shrink:0; width:78vw; max-width:300px; scroll-snap-align:center; background:rgba(16,16,16,0.96); border:1px solid rgba(255,255,255,0.1); overflow:hidden; position:relative; }
  .mobile-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:${LIME}; }
  .mobile-card-hint { text-align:center; padding:14px 0 4px; font-family:'Space Mono',monospace; font-size:9px; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,0.2); }
  @keyframes pulse { 0%,100%{transform:scale(1);opacity:1;box-shadow:0 0 0 0 rgba(212,237,42,0.5)} 50%{transform:scale(1.35);opacity:0.7;box-shadow:0 0 0 10px rgba(212,237,42,0)} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width:900px) {
    html,body { cursor:auto; }
    .cursor-dot,.cursor-ring { display:none; }
    .hero { grid-template-columns:1fr; padding:100px 20px 60px; }
    .hero-right { order:-1; }
    .photo-frame { width:clamp(200px,60vw,320px); }
    .nav { padding:16px 20px; }
    .nav.scrolled { padding:12px 20px; }
    .nav-links { display:none; }
    .section { padding:70px 20px; }
    .about-grid { grid-template-columns:1fr; }
    .exp-item { grid-template-columns:1fr; gap:16px; }
    .skills-grid { grid-template-columns:1fr; }
    .contact-wrapper { padding:48px 24px; }
    .footer { flex-direction:column; gap:12px; text-align:center; }
    .cs-hero { padding:120px 20px 60px; }
    .cs-cards-desktop { display:none !important; }
    .cs-cards-mobile { display:block !important; }
  }
  @media (min-width:901px) {
    .cs-cards-desktop { display:block; }
    .cs-cards-mobile { display:none; }
  }
`;

const WORDS = ["Art Director", "Brand Designer", "Print & Digital", "Creative Mind"];
function Typewriter() {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = WORDS[wordIdx];
    const t = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1));
        if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), 1500);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDeleting(false); setWordIdx(i => (i + 1) % WORDS.length); }
      }
    }, deleting ? 60 : 120);
    return () => clearTimeout(t);
  }, [text, deleting, wordIdx]);
  return <div className="hero-typewriter">{text}<span className="typewriter-cursor" /></div>;
}

function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        if (target === "INF") { setCount("∞"); return; }
        let s = 0; const step = Math.ceil(target / 40);
        const timer = setInterval(() => { s += step; if (s >= target) { setCount(target); clearInterval(timer); } else setCount(s); }, 40);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

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
  return <div ref={ref} className={"fade-in" + (visible ? " visible" : "")} style={{ transitionDelay: delay + "ms", ...style }}>{children}</div>;
}

function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ── DRAGGABLE MARQUEE ── */
function DraggableMarquee({ items, onNavigate, onDragStateChange }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const rafRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startPos = useRef(0);
  const hasDragged = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const tick = () => {
      if (!isDragging.current) {
        const hw = track.scrollWidth / 2;
        posRef.current -= 0.65;
        if (posRef.current <= -hw) posRef.current = 0;
        track.style.transform = "translateX(" + posRef.current + "px)";
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const delta = e.touches[0].clientX - startX.current;
      if (Math.abs(delta) > 5) hasDragged.current = true;
      applyDelta(delta);
    };
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, []);

  const applyDelta = (delta) => {
    const track = trackRef.current;
    if (!track) return;
    const hw = track.scrollWidth / 2;
    let np = startPos.current + delta;
    if (np > 0) np -= hw;
    if (np < -hw) np += hw;
    posRef.current = np;
    track.style.transform = "translateX(" + np + "px)";
  };

  const startDrag = (clientX) => {
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = clientX;
    startPos.current = posRef.current;
    onDragStateChange(true);
  };

  const moveDrag = (clientX) => {
    if (!isDragging.current) return;
    const delta = clientX - startX.current;
    if (Math.abs(delta) > 5) hasDragged.current = true;
    applyDelta(delta);
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    onDragStateChange(false);
  };

  const handleItemClick = (item, e) => {
    if (hasDragged.current) { e.stopPropagation(); return; }
    if (item === "Glutenfry") onNavigate("glutenfry");
    if (item === "Dortmunder Volksbank") onNavigate("volksbank");
  };

  return (
    <div
      ref={containerRef}
      className="marquee-section"
      onMouseDown={e => startDrag(e.clientX)}
      onMouseMove={e => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={e => startDrag(e.touches[0].clientX)}
      onTouchEnd={endDrag}
      onTouchCancel={endDrag}
    >
      <div style={{ overflow: "hidden" }}>
        <div ref={trackRef} style={{ display: "inline-flex", whiteSpace: "nowrap" }}>
          {[...items, ...items].map((item, i) =>
            (item === "Glutenfry" || item === "Dortmunder Volksbank") ? (
              <span key={i} className="marquee-item clickable" onClick={e => handleItemClick(item, e)}>
                {item}<span className="marquee-badge">Case Study</span><span className="marquee-sep">✦</span>
              </span>
            ) : (
              <span key={i} className="marquee-item">{item}<span className="marquee-sep">✦</span></span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ── CARD SHARED PIECES ── */
function CardMedia({ img, id }) {
  return (
    <div style={{ width:"100%", height:210, position:"relative", overflow:"hidden", background:"#1a1a1a" }}>
      {img ? (
        <img
          src={img}
          alt={"Glutenfry " + id}
          style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block", transition:"transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        />
      ) : (
        <>
          <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(212,237,42,0.055) 1px,transparent 1px)", backgroundSize:"28px 28px" }} />
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:80, color:"rgba(212,237,42,0.09)", lineHeight:1 }}>0{id}</div>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:2, textTransform:"uppercase", color:"rgba(255,255,255,0.18)" }}>Bild folgt</div>
          </div>
        </>
      )}
    </div>
  );
}
function CardBody({ card }) {
  return (
    <div style={{ padding:"18px 16px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:2, textTransform:"uppercase", color:LIME, marginBottom:7 }}>{card.label}</div>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:27, color:WHITE, marginBottom:9, lineHeight:1 }}>{card.title}</div>
      <div style={{ fontSize:11, lineHeight:1.65, color:GRAY, fontWeight:300 }}>{card.desc}</div>
    </div>
  );
}

/* ── DESKTOP SPREAD CARD ── */
function SpreadCard({ card, hoveredCard, setHoveredCard }) {
  const isHovered = hoveredCard === card.id;
  const isDimmed  = hoveredCard !== null && !isHovered;
  return (
    <div
      style={{
        position:"absolute",
        left:"calc(50% + " + (card.offX - 120) + "px)",
        top:(80 + card.topOff) + "px",
        width:240, height:360,
        zIndex: isHovered ? 20 : card.zi,
        transform: isHovered ? "rotate(0deg) translateY(-44px) scale(1.12)" : "rotate(" + card.rot + "deg)",
        opacity: isDimmed ? 0.42 : 1,
        filter: isDimmed ? "brightness(0.48) saturate(0.6)" : "none",
        border: "1px solid " + (isHovered ? LIME : "rgba(255,255,255,0.1)"),
        background:"rgba(16,16,16,0.96)", overflow:"hidden", cursor:"none",
        transition:"all 0.52s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: isHovered ? "0 70px 130px rgba(0,0,0,0.98),0 0 70px rgba(212,237,42,0.14)" : "0 20px 50px rgba(0,0,0,0.6)",
      }}
      onMouseEnter={() => setHoveredCard(card.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:LIME, zIndex:3, transform: isHovered ? "scaleX(1)" : "scaleX(0)", transformOrigin:"left", transition:"transform 0.4s ease" }} />
      <CardMedia img={card.img} id={card.id} />
      <CardBody card={card} />
    </div>
  );
}

/* ── MOBILE SWIPE CAROUSEL ── */
function MobileCardScroll() {
  return (
    <div>
      <div className="mobile-cards-scroll">
        {GLUTENFRY_CARDS.map(card => (
          <div key={card.id} className="mobile-card">
            <CardMedia img={card.img} id={card.id} />
            <CardBody card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── VOLKSBANK PAGE ── */
function VolksbankPage({ onBack }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div style={{ minHeight:"100vh" }}>
      {/* HERO */}
      <section className="cs-hero">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 55% 65% at 92% 35%, rgba(30,90,200,0.07) 0%, transparent 68%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle, rgba(212,237,42,0.07) 1px, transparent 1px)", backgroundSize:"60px 60px", WebkitMaskImage:"radial-gradient(ellipse 50% 70% at 5% 75%, black, transparent)", maskImage:"radial-gradient(ellipse 50% 70% at 5% 75%, black, transparent)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-40, right:-20, fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(80px,14vw,220px)", color:"rgba(255,255,255,0.018)", pointerEvents:"none", userSelect:"none", letterSpacing:-4, lineHeight:0.85 }}>VERLAUF<br />DER<br />VERÄNDERUNG</div>
        <div style={{ position:"relative", zIndex:1 }}>
          <div className="section-label" style={{ animation:"slideUp 0.7s 0.1s both" }}>Case Study · Bounty Communication Group · 2026</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(60px,11vw,180px)", lineHeight:0.82, letterSpacing:-4, animation:"slideUp 0.7s 0.2s both" }}>
            <span style={{ color:WHITE, display:"block" }}>DORTMUNDER</span>
            <span style={{ color:LIME, display:"block" }}>VOLKSBANK</span>
          </div>
          <div style={{ display:"flex", gap:60, marginTop:48, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.08)", animation:"slideUp 0.7s 0.35s both", flexWrap:"wrap" }}>
            {[{l:"Jahr",v:"2026"},{l:"Kategorie",v:"Brand Design · Web · Print"},{l:"Rolle",v:"Art Direction"},{l:"Projekt",v:"Geschäftsbericht"}].map(m => (
              <div key={m.l}>
                <label style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:2, textTransform:"uppercase", color:GRAY, display:"block", marginBottom:6 }}>{m.l}</label>
                <span style={{ fontSize:15, color:WHITE, fontWeight:500 }}>{m.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAPTOP MOCKUP */}
      <section style={{ padding:"100px 40px 60px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="section-label">Das Projekt</div>
          <h2 className="section-title">VERLAUF DER<br />VERÄNDERUNG</h2>
          <p style={{ fontSize:15, lineHeight:1.8, color:"#BBBBB5", fontWeight:300, maxWidth:520, marginTop:-36, marginBottom:64 }}>
            Geschäftsbericht der Dortmunder Volksbank – Leitmotiv, Key Visual, Web und Print.
          </p>
          <div style={{ maxWidth:860, margin:"0 auto" }}>
            <img
              src="/vob_laptop.png"
              alt="Dortmunder Volksbank"
              style={{ width:"100%", display:"block", filter:"drop-shadow(0 32px 64px rgba(0,0,0,0.85))" }}
            />
          </div>
        </div>
      </section>

      {/* LIVE WEBSITE */}
      <section style={{ padding:"0 0 80px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 40px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:28 }}>
            <div className="section-label" style={{ margin:0 }}>Live Website</div>
            <a href="https://geschaeftsbericht.dovoba.de/" target="_blank" rel="noreferrer" className="btn-outline">↗ Im Browser öffnen</a>
          </div>

          <div style={{ maxWidth:880, margin:"0 auto", borderRadius:"10px 10px 0 0", overflow:"hidden", border:"1px solid rgba(255,255,255,0.12)", boxShadow:"0 -16px 60px rgba(0,0,0,0.55)" }}>
            <div style={{ background:"#1e1e1e", padding:"12px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display:"flex", gap:6 }}>
                {["#ff5f57","#ffbd2e","#28c840"].map(c => <div key={c} style={{ width:12, height:12, borderRadius:"50%", background:c, opacity:0.8 }} />)}
              </div>
              <div style={{ flex:1, background:"rgba(255,255,255,0.07)", borderRadius:6, padding:"5px 16px", fontFamily:"'Space Mono',monospace", fontSize:11, color:GRAY }}>
                geschaeftsbericht.dovoba.de
              </div>
              <div style={{ width:20 }} />
            </div>
            <div style={{ position:"relative" }}>
              {!iframeLoaded && (
                <div style={{ position:"absolute", inset:0, background:"#161616", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, zIndex:2, minHeight:500 }}>
                  <div style={{ width:36, height:36, border:"2px solid rgba(212,237,42,0.2)", borderTopColor:LIME, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, letterSpacing:3, textTransform:"uppercase", color:GRAY }}>Website wird geladen…</span>
                </div>
              )}
              <iframe
                src="https://geschaeftsbericht.dovoba.de/"
                title="Dortmunder Volksbank"
                onLoad={() => setIframeLoaded(true)}
                style={{ width:"100%", height:"72vh", minHeight:500, border:"none", display:"block" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <div style={{ padding:"52px 40px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:10, height:10, background:LIME, borderRadius:"50%", animation:"pulse 2s ease-in-out infinite" }} />
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:2, textTransform:"uppercase", color:GRAY }}>Brand Design · Web · Print · 2026</span>
        </div>
        <button className="btn-outline" onClick={onBack}>← Zurück zur Übersicht</button>
      </div>
      <footer className="footer">
        <div className="footer-name">PHILIP SPIEKERMANN</div>
        <div className="footer-copy">Case Study · Dortmunder Volksbank · 2026</div>
      </footer>
    </div>
  );
}

/* ── GLUTENFRY PAGE ── */
function GlutenfryPage({ onBack }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{ minHeight:"100vh" }}>
      <section className="cs-hero">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 55% 65% at 8% 65%,rgba(212,237,42,0.065) 0%,transparent 68%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(212,237,42,0.07) 1px,transparent 1px)", backgroundSize:"60px 60px", WebkitMaskImage:"radial-gradient(ellipse 50% 70% at 95% 25%,black,transparent)", maskImage:"radial-gradient(ellipse 50% 70% at 95% 25%,black,transparent)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-60, right:-30, fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(120px,20vw,300px)", color:"rgba(255,255,255,0.018)", pointerEvents:"none", userSelect:"none", letterSpacing:-6, lineHeight:0.85 }}>GLUTEN<br/>FREE</div>
        <div style={{ position:"relative", zIndex:1 }}>
          <div className="section-label" style={{ animation:"slideUp 0.7s 0.1s both" }}>Case Study · Bounty Communication Group · 2024</div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(80px,15vw,220px)", lineHeight:0.82, letterSpacing:-5, animation:"slideUp 0.7s 0.2s both" }}>
            <span style={{ color:WHITE, display:"block" }}>GLUTEN</span>
            <span style={{ color:LIME, display:"block" }}>FRY</span>
          </div>
          <div style={{ display:"flex", gap:60, marginTop:48, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.08)", animation:"slideUp 0.7s 0.35s both", flexWrap:"wrap" }}>
            {[{l:"Jahr",v:"2024"},{l:"Kategorie",v:"Brand Design · Packaging · Print"},{l:"Rolle",v:"Art Direction"},{l:"Konzept",v:"Glutenfreies Soul-Food Restaurant"}].map(m => (
              <div key={m.l}>
                <label style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:2, textTransform:"uppercase", color:GRAY, display:"block", marginBottom:6 }}>{m.l}</label>
                <span style={{ fontSize:15, color:WHITE, fontWeight:500 }}>{m.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding:"100px 40px 80px" }}>
        <div style={{ marginBottom:80 }}>
          <div className="section-label">Projekt-Einblick</div>
          <h2 className="section-title">DER PROZESS</h2>
          <p style={{ fontSize:15, lineHeight:1.8, color:"#BBBBB5", fontWeight:300, maxWidth:480, marginTop:-36 }}>
            Glutenfrei frittiertes Soul Food – und ein Brand der genauso direkt ist wie das Essen.
          </p>
        </div>
        <div className="cs-cards-desktop" style={{ position:"relative", height:520 }}>
          {GLUTENFRY_CARDS.map(card => (
            <SpreadCard key={card.id} card={card} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} />
          ))}
        </div>
        <div className="cs-cards-mobile" style={{ margin:"0 -40px" }}>
          <MobileCardScroll />
        </div>
      </section>

      <div style={{ padding:"52px 40px", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:10, height:10, background:LIME, borderRadius:"50%", animation:"pulse 2s ease-in-out infinite" }} />
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:2, textTransform:"uppercase", color:GRAY }}>Brand Design · Packaging · Print · 2024</span>
        </div>
        <button className="btn-outline" onClick={onBack}>← Zurück zur Übersicht</button>
      </div>
      <footer className="footer">
        <div className="footer-name">PHILIP SPIEKERMANN</div>
        <div className="footer-copy">Case Study · Glutenfry · 2024</div>
      </footer>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
function PhotoSwitcher() {
  const [show2, setShow2] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => setShow2(v => !v), 3500);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <img src={philipPhoto}  alt="Philip Spiekermann" className={"hero-photo " + (show2 ? "hidden" : "visible")} />
      <img src={philipPhoto2} alt="Philip Spiekermann" className={"hero-photo " + (show2 ? "visible" : "hidden")} />
    </>
  );
}

const sections = ["hero","about","experience","skills","contact"];

export default function Portfolio() {
  const [currentPage,      setCurrentPage]      = useState("home");
  const [transitioning,   setTransitioning]   = useState(false);
  const [activeSection,   setActiveSection]   = useState("hero");
  const [scrolled,        setScrolled]        = useState(false);
  const [scrollProgress,  setScrollProgress]  = useState(0);
  const [hovering,        setHovering]        = useState(false);
  const [draggingMarquee, setDraggingMarquee] = useState(false);

  const cursorDot      = useRef(null);
  const cursorRing     = useRef(null);
  const parallaxBg     = useRef(null);
  const heroLeftRef    = useRef(null);
  const heroRightRef   = useRef(null);
  const currentPageRef = useRef("home");
  currentPageRef.current = currentPage;

  // Modifizierte Navigation mit HTML5 History API Integration
  const navigateTo = (page, isPopState = false) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "instant" });
      
      // Nur einen neuen Verlaufseintrag pushen, wenn wir NICHT via Browser-Zurück navigieren
      if (!isPopState) {
        const url = page === "home" ? "/" : `/${page}`;
        window.history.pushState({ page }, "", url);
      }
      
      requestAnimationFrame(() => requestAnimationFrame(() => setTransitioning(false)));
    }, 420);
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  // Event Listener für den Zurück-Button des Browsers (popstate)
  useEffect(() => {
    const handlePopState = (event) => {
      const targetPage = event.state && event.state.page ? event.state.page : "home";
      navigateTo(targetPage, true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    // Initialen Verlaufseintrag für die Startseite setzen, falls noch keiner existiert
    if (!window.history.state) {
      window.history.replaceState({ page: "home" }, "", "/");
    }

    const move = (e) => {
      if (cursorDot.current)  { cursorDot.current.style.left  = e.clientX+"px"; cursorDot.current.style.top  = e.clientY+"px"; }
      if (cursorRing.current) { cursorRing.current.style.left = e.clientX+"px"; cursorRing.current.style.top = e.clientY+"px"; }
      const px = e.clientX/window.innerWidth-0.5, py = e.clientY/window.innerHeight-0.5;
      if (heroLeftRef.current)  heroLeftRef.current.style.transform  = "translate("+(px*-9)+"px,"+(py*-5)+"px)";
      if (heroRightRef.current) heroRightRef.current.style.transform = "translate("+(px*14)+"px,"+(py*9)+"px)";
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const sel = "a,button,.interest-tag,.skill-card,.marquee-item";
    const els = document.querySelectorAll(sel);
    const on = () => setHovering(true), off = () => setHovering(false);
    els.forEach(el => { el.addEventListener("mouseenter",on); el.addEventListener("mouseleave",off); });
    return () => els.forEach(el => { el.removeEventListener("mouseenter",on); el.removeEventListener("mouseleave",off); });
  });

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY, max = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(y/max); setScrolled(y>60);
      if (parallaxBg.current) parallaxBg.current.style.transform = "translateY("+(y*0.15)+"px)";
      if (currentPageRef.current === "home") {
        for (const id of sections) {
          const el = document.getElementById(id); if (!el) continue;
          const r = el.getBoundingClientRect();
          if (r.top <= 200 && r.bottom > 200) { setActiveSection(id); break; }
        }
      }
    };
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const marqueeItems = ["Glutenfry","Vonovia","Dortmunder Volksbank","Salzburger Flughafen","Mopla"];
  const cursorClass = "cursor-ring" + (hovering && !draggingMarquee ? " hovering" : "") + (draggingMarquee ? " grabbing" : "");

  return (
    <div className="portfolio-root">
      <style>{styles}</style>
      <div ref={cursorDot} className="cursor-dot" />
      <div ref={cursorRing} className={cursorClass} />
      <div className="scroll-progress">
        <div className="scroll-progress-bar" style={{ transform:"scaleX("+scrollProgress+")" }} />
      </div>

      <nav className={"nav" + (scrolled ? " scrolled" : "")}>
        <div className="nav-logo" onClick={() => navigateTo("home")}>PS</div>
        {(currentPage === "glutenfry" || currentPage === "volksbank") ? (
          <button className="nav-back" onClick={() => navigateTo("home")}><span className="nav-back-arrow">←</span> Alle Projekte</button>
        ) : (
          <div className="nav-links">
            {["about","experience","skills","contact"].map(s => (
              <button key={s} className={"nav-link"+(activeSection===s?" active":"")} onClick={() => scrollTo(s)}>{s}</button>
            ))}
          </div>
        )}
      </nav>

      <div style={{ opacity:transitioning?0:1, transform:transitioning?"translateY(22px)":"none", transition:"opacity 0.42s ease,transform 0.42s ease" }}>
        {currentPage === "volksbank" ? (
          <VolksbankPage onBack={() => navigateTo("home")} />
        ) : currentPage === "glutenfry" ? (
          <GlutenfryPage onBack={() => navigateTo("home")} />
        ) : (
          <>
            <section id="hero" className="hero">
              <div ref={parallaxBg} className="hero-bg-text">ART DIRECTOR</div>
              <div className="hero-grid-dots" />
              <div className="hero-left">
                <div ref={heroLeftRef} style={{ transition:"transform 0.18s ease-out" }}>
                  <div className="hero-tag">Philip Spiekermann · Ruhrgebiet</div>
                  <h1 className="hero-name">PHILIP<br /><span>SPIEKERMANN</span></h1>
                  <Typewriter />
                  <p className="hero-desc">Marken die hängenbleiben. Von der Idee bis zur Umsetzung.</p>
                  <div className="hero-cta">
                    <a href="https://www.behance.net/philsez" target="_blank" rel="noreferrer" className="btn-primary">Portfolio ansehen</a>
                    <button className="btn-outline" onClick={() => scrollTo("contact")}>Kontakt</button>
                  </div>
                </div>
              </div>
              <div className="hero-right">
                <div ref={heroRightRef} style={{ transition:"transform 0.18s ease-out" }}>
                  <div className="photo-frame">
                    <div className="photo-frame-inner">
                      <PhotoSwitcher />
                    </div>
                    <div className="photo-label">Recklinghausen · Ruhrgebiet</div>
                  </div>
                </div>
              </div>
              <div className="scroll-hint"><div className="scroll-line" /><span>Scroll</span></div>
            </section>

            <DraggableMarquee items={marqueeItems} onNavigate={navigateTo} onDragStateChange={setDraggingMarquee} />

            <section id="about">
              <div className="section">
                <FadeIn><div className="section-label">Über mich</div><h2 className="section-title">PERSÖNLICH</h2></FadeIn>
                <div className="about-grid">
                  <FadeIn delay={100}>
                    <div className="about-quote">„Medien sind<br />mein Zuhause."</div>
                    <p className="about-text">Art Director aus dem Ruhrgebiet. Ich gestalte Marken, die hängenbleiben – kanalübergreifend, konsequent und mit Haltung. KI nutze ich als Werkzeug, nicht als Ausrede.</p>
                    <div className="interests">
                      {["Hip-Hop","Klassische Musik","Calisthenics","Yoga","Meditation","BMX","Kochen","Interior","Wandern","Nachhaltigkeit"].map(i => <div key={i} className="interest-tag">{i}</div>)}
                    </div>
                  </FadeIn>
                  <FadeIn delay={200}>
                    <div className="about-stats">
                      {[{num:2,suffix:"+",label:"Jahre Experience"},{num:3,suffix:"",label:"Tool-Suiten"},{num:4,suffix:"+",label:"Großkunden"},{num:"INF",suffix:"",label:"Kreative Ideen"}].map(s => (
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

            <section id="experience">
              <div className="section">
                <FadeIn><div className="section-label">Werdegang</div><h2 className="section-title">ERFAHRUNG</h2></FadeIn>
                <FadeIn delay={100}>
                  <div className="exp-item">
                    <div><div className="exp-company">Bounty Communication Group</div><div className="exp-period">2024 — heute</div></div>
                    <ul className="exp-bullets">
                      <li>Kampagnen für den Salzburger Flughafen – Social Media, Google Ads, Print.</li>
                      <li>Geschäftsbericht & Kampagnen für die Dortmunder Volksbank – Konzept bis Reinzeichnung.</li>
                      <li>Visuelle Auftritte für Events & Festivals – Markenentwicklung, Key Visuals, Werbemittel.</li>
                      <li>Printprojekte: Vonovia × VfL Bochum, H. Klostermann Nachhaltigkeitsbericht.</li>
                    </ul>
                  </div>
                </FadeIn>
              </div>
            </section>

            <div className="full-divider" />

            <section id="skills">
              <div className="section">
                <FadeIn><div className="section-label">Kompetenzen</div><h2 className="section-title">SKILLS</h2></FadeIn>
                <div className="skills-grid">
                  {[
                    {icon:"🎨", title:"Design", items:["Brand Design","Kampagnen","Print & OOH","Social Media","Packaging"]},
                    {icon:"🛠", title:"Tools",   items:["Photoshop","InDesign","Illustrator","Canva"]},
                    {icon:"🤖", title:"KI",      items:["Bild-Prompting","Layout-Konzepte","KI-Workflows"]},
                  ].map((card,i) => (
                    <FadeIn key={card.title} delay={i*80}>
                      <div className="skill-card">
                        <span className="skill-card-icon">{card.icon}</span>
                        <div className="skill-card-title">{card.title}</div>
                        <ul className="skill-list">{card.items.map(item=><li key={item}>{item}</li>)}</ul>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </section>

            <div className="full-divider" />

            <section id="contact">
              <div className="section">
                <FadeIn>
                  <div className="contact-wrapper">
                    <div className="contact-tagline">Lass uns reden</div>
                    <h2 className="contact-heading">READY<br />TO CREATE?</h2>
                    <p style={{ fontSize:15, color:GRAY, maxWidth:360, margin:"0 auto", lineHeight:1.8, fontWeight:300 }}>Ruf an. Schreib. Oder schau dir mein Behance an.</p>
                    <div className="contact-links">
                      <a href="https://www.behance.net/philsez" target="_blank" rel="noreferrer" className="btn-primary">Behance Portfolio</a>
                      <a href="https://www.linkedin.com/in/philip-spiekermann-450403205/" target="_blank" rel="noreferrer" className="btn-outline">LinkedIn</a>
                      <a href="mailto:philipspiekermann@hotmail.com" className="btn-outline">E-Mail</a>
                    </div>
                    <div className="contact-info" style={{ marginTop:40 }}>
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
          </>
        )}
      </div>
    </div>
  );
}
