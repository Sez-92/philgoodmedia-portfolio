import { useState, useEffect, useRef } from "react";
import philipPhoto from "/philip.png";
import philipPhoto2 from "/philip2.png";

const LIME = "#F2E5AE";
const BLACK = "#211923";
const WHITE = "#F8F1E3";
const GRAY = "#C2B6B6";

const GLUTENFRY_CARDS = [
  { id: 1, label: "01 — Briefing",        title: "Der Auftrag",   desc: "Soul Food. Glutenfrei. Ein Brand der das genauso mutig sagt.",           img: "/gf_brand.png",  rot: -11, offX: -320, topOff: 80, zi: 1 },
  { id: 2, label: "02 — Visual Identity", title: "Logo & Marke",  desc: "GF-Maskottchen, Orange, Lila. Verspielt und unverwechselbar.",             img: "/gf_logo.png",   rot: -5,  offX: -160, topOff: 40, zi: 2 },
  { id: 3, label: "03 — Packaging",       title: "Verpackung",   desc: "Das Pattern zieht sich durch – von der Tüte bis zum Becher.",              img: "/gf_bag.png",    rot:  0,  offX:    0, topOff:  8, zi: 3 },
  { id: 4, label: "04 — Print",           title: "Flyer",          desc: "Crunchy Chicken Bowl. Null Weizen. Voller Hunger-Faktor.",                  img: "/gf_flyer.png",  rot:  5,  offX:  160, topOff: 40, zi: 2 },
  { id: 5, label: "05 — Ergebnis",        title: "Kein Verzicht",  desc: "Ein Brand der beweist: glutenfrei kann großartig aussehen.",               img: "/gf_result.png", rot: 11,  offX:  320, topOff: 80, zi: 1 },
];

const styles = `
/* Fruehschicht project tile: photo-led editorial cover, not a generic card */
.project-visual.fs-project-visual{position:relative;isolation:isolate;background:#7B1528;overflow:hidden}
.project-visual.fs-project-visual .fs-cover-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.85) brightness(.75);transition:transform .7s ease;z-index:-2}
.project-link:hover .fs-cover-photo{transform:scale(1.06)}
.project-visual.fs-project-visual .fs-cover-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(29,9,13,.5),rgba(29,9,13,.03) 40%,rgba(29,9,13,.85));z-index:-1}
.project-visual.fs-project-visual .fs-cover-overline{position:absolute;top:8%;left:7%;font:10px 'Space Mono',monospace;letter-spacing:.16em;color:#F1E2BF}
.project-visual.fs-project-visual .fs-cover-wordmark{position:absolute;left:6%;bottom:18%;font-family:'Bagel Fat One',Georgia,serif;font-size:clamp(32px,5.3vw,86px);line-height:1;letter-spacing:-.065em;color:#F1E2BF;white-space:nowrap}
.project-visual.fs-project-visual .fs-cover-foot{position:absolute;left:7%;bottom:7%;font:10px 'Space Mono',monospace;letter-spacing:.1em;color:#F1E2BF}
@media(max-width:700px){.project-visual.fs-project-visual .fs-cover-wordmark{font-size:clamp(35px,10vw,68px)}}

  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Karla:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  html, body { background: ${BLACK}; color: ${WHITE}; font-family: 'Karla', sans-serif; overflow-x: hidden; cursor: none; }
  body::after { content: ''; position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: 0.035; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-size: 180px; }
  .cursor-dot { position:fixed; top:0; left:0; z-index:10000; width:8px; height:8px; background:${LIME}; border-radius:50%; pointer-events:none; transform:translate(-50%,-50%); mix-blend-mode:difference; }
  .cursor-ring { position:fixed; top:0; left:0; z-index:9999; width:40px; height:40px; border:1px solid rgba(185,229,212,0.5); border-radius:50%; pointer-events:none; transform:translate(-50%,-50%); transition:left 0.08s linear,top 0.08s linear,width 0.3s,height 0.3s,border-color 0.3s; }
  .cursor-ring.hovering { width:64px; height:64px; border-color:${LIME}; background:rgba(185,229,212,0.04); }
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
  .hero-grid-dots { position:absolute; inset:0; background-image:radial-gradient(circle,rgba(185,229,212,0.07) 1px,transparent 1px); background-size:60px 60px; pointer-events:none; -webkit-mask-image:radial-gradient(ellipse 60% 80% at 85% 50%,black,transparent); mask-image:radial-gradient(ellipse 60% 80% at 85% 50%,black,transparent); }
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
  .btn-primary:hover { background:${WHITE}; box-shadow:0 0 30px rgba(185,229,212,0.3); transform:translateY(-2px); }
  .btn-outline { background:transparent; color:${WHITE}; font-family:'Space Mono',monospace; font-size:11px; letter-spacing:2px; text-transform:uppercase; padding:13px 28px; border:1px solid rgba(255,255,255,0.25); cursor:none; transition:all 0.25s; text-decoration:none; display:inline-block; }
  .btn-outline:hover { border-color:${LIME}; color:${LIME}; box-shadow:0 0 20px rgba(185,229,212,0.15); transform:translateY(-2px); }
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
  .interest-tag:hover { border-color:${LIME}; color:${LIME}; background:rgba(185,229,212,0.05); transform:translateY(-2px); }
  .exp-item { border-top:1px solid rgba(255,255,255,0.08); padding:48px 0; display:grid; grid-template-columns:200px 1fr; gap:40px; transition:border-color 0.3s; }
  .exp-item:hover { border-color:rgba(185,229,212,0.3); }
  .exp-company { font-family:'Bebas Neue',sans-serif; font-size:22px; color:${LIME}; letter-spacing:1px; margin-bottom:6px; }
  .exp-period { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:2px; color:${GRAY}; }
  .exp-bullets { list-style:none; }
  .exp-bullets li { font-size:15px; line-height:1.7; color:#BBBBB5; font-weight:300; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04); display:flex; gap:12px; transition:color 0.3s,padding-left 0.3s; }
  .exp-bullets li:hover { color:${WHITE}; padding-left:8px; }
  .exp-bullets li::before { content:'→'; color:${LIME}; flex-shrink:0; }
  .skills-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; }
  .skill-card { background:rgba(255,255,255,0.03); padding:36px 30px; transition:background 0.4s,transform 0.3s; cursor:none; position:relative; overflow:hidden; }
  .skill-card::before { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:${LIME}; transform:scaleX(0); transform-origin:left; transition:transform 0.4s; }
  .skill-card:hover { background:rgba(185,229,212,0.06); transform:translateY(-4px); }
  .skill-card:hover::before { transform:scaleX(1); }
  .skill-card-icon { font-size:28px; margin-bottom:20px; display:block; transition:transform 0.3s; }
  .skill-card:hover .skill-card-icon { transform:scale(1.2) rotate(5deg); }
  .skill-card-title { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:1px; color:${WHITE}; margin-bottom:20px; }
  .skill-list { list-style:none; }
  .skill-list li { font-family:'Space Mono',monospace; font-size:11px; letter-spacing:1px; color:${GRAY}; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; gap:8px; transition:color 0.3s,gap 0.3s; }
  .skill-list li:hover { color:${WHITE}; gap:12px; }
  .skill-list li::before { content:'·'; color:${LIME}; font-size:18px; line-height:0; }
  .marquee-section { padding:32px 0 22px; overflow:hidden; border-top:1px solid rgba(255,255,255,0.06); border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(185,229,212,0.02); position:relative; user-select:none; }
  .marquee-item { font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:4px; color:rgba(255,255,255,0.15); padding:0 36px; white-space:nowrap; transition:color 0.3s; display:inline-flex; align-items:center; }
  .marquee-item:hover { color:rgba(255,255,255,0.4); }
  .marquee-item.clickable { color:${LIME}; }
  .marquee-item.clickable:hover { color:${WHITE}; }
  .marquee-badge { font-family:'Space Mono',monospace; font-size:8px; letter-spacing:2px; background:${LIME}; color:${BLACK}; padding:2px 7px; text-transform:uppercase; font-weight:700; margin-left:8px; transition:background 0.3s; }
  .marquee-item.clickable:hover .marquee-badge { background:${WHITE}; }
  .marquee-sep { color:${LIME}; padding:0 8px; opacity:0.45; }

  .contact-wrapper { background:rgba(255,255,255,0.03); padding:80px; text-align:center; position:relative; overflow:hidden; }
  .contact-wrapper::before { content:'"'; position:absolute; font-family:'Bebas Neue',sans-serif; font-size:400px; color:rgba(185,229,212,0.04); top:-100px; left:-30px; pointer-events:none; }
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
  .fs-project-visual{background:#7B1528!important;color:#F4EEE3;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:8% 7%;aspect-ratio:4/3;overflow:hidden;position:relative}.fs-project-visual::before{content:"";position:absolute;inset:7%;border:1px solid rgba(244,238,227,.28);transform:rotate(-3deg)}.fs-project-label{font-family:'Georgia',serif;font-weight:900;font-size:clamp(28px,4vw,68px);letter-spacing:-.07em;line-height:.9;z-index:1}.fs-project-sub{font:9px 'Space Mono',monospace;letter-spacing:2px;margin-top:16px;color:#F1E2BF;z-index:1}
  .mobile-cards-scroll { display:flex; overflow-x:auto; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; gap:16px; padding:4px 20px 24px; scrollbar-width:none; }
  .mobile-cards-scroll::-webkit-scrollbar { display:none; }
  .mobile-card { flex-shrink:0; width:78vw; max-width:300px; scroll-snap-align:center; background:rgba(16,16,16,0.96); border:1px solid rgba(255,255,255,0.1); overflow:hidden; position:relative; }
  .mobile-card.cutout-card { background:transparent; border-color:transparent; }
  .mobile-card.cutout-card::before { display:none; }
  .mobile-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:${LIME}; }
  .mobile-card-hint { text-align:center; padding:14px 0 4px; font-family:'Space Mono',monospace; font-size:9px; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,0.2); }
  @keyframes pulse { 0%,100%{transform:scale(1);opacity:1;box-shadow:0 0 0 0 rgba(185,229,212,0.5)} 50%{transform:scale(1.35);opacity:0.7;box-shadow:0 0 0 10px rgba(185,229,212,0)} }
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
  /* Editorial refinement: the original interactions remain intact. */
  :root { color-scheme:dark; }
  .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
  section[id] { scroll-margin-top:100px; }
  button, a { -webkit-tap-highlight-color:transparent; }
  button { font:inherit; }
  :focus-visible { outline:2px solid ${LIME}; outline-offset:6px; }
  .skip-link { position:fixed; top:12px; left:20px; z-index:11000; background:${LIME}; color:${BLACK}; padding:12px 20px; transform:translateY(-160%); }
  .skip-link:focus { transform:none; }
  body::after { opacity:0.018; }
  .nav { padding:22px 5vw; background:rgba(17,17,17,.94); }
  .nav.scrolled { padding:16px 5vw; }
  .nav-logo { background:none; border:0; display:flex; align-items:center; gap:10px; letter-spacing:1px; }
  .logo-name { font-family:'Karla',sans-serif; font-size:15px; font-weight:700; color:${WHITE}; letter-spacing:-.5px; }
  .nav-link { letter-spacing:1px; min-height:36px; color:#b3b3aa; }
  .menu-toggle { display:none; background:none; border:1px solid #555; color:${WHITE}; padding:10px 14px; }
  .hero { min-height: min(900px,100svh); padding:150px 5vw 110px; grid-template-columns:1.25fr 1fr; gap:5vw; }
  .hero-name { font-size:clamp(64px,8.3vw,132px); line-height:.94; letter-spacing:-2px; }
  .hero-tag { font-size:10px; letter-spacing:1.5px; }
  .hero-desc { color:#bdbdb3; max-width:410px; font-size:18px; line-height:1.65; font-weight:400; }
  .hero-typewriter { font-size:12px; letter-spacing:1px; margin:24px 0; }
  .hero-bg-text,.hero-grid-dots { display:none; }
  .photo-frame { width:100%; max-width:440px; aspect-ratio:4/5; }
  .hero-right > div { width:100%; max-width:440px; }
  .photo-frame::before { inset:12px -12px -12px 12px; border-width:1px; transform:none; opacity:.4; }
  .photo-frame::after { width:16px; height:16px; top:18px; right:18px; border-radius:50%; }
  .photo-label { z-index:4; bottom:18px; left:20px; color:${WHITE}; background:rgba(17,17,17,.7); padding:8px 10px; font-size:9px; }
  .scroll-hint { left:5vw; }
  .btn-primary,.btn-outline { font-family:'Karla',sans-serif; font-size:14px; letter-spacing:0; text-transform:none; padding:16px 24px; min-height:48px; }
  .btn-primary:hover,.btn-outline:hover { box-shadow:none; }
  .section { max-width:1440px; padding:110px 5vw; }
  .section-title { font-size:clamp(48px,6vw,88px); margin-bottom:48px; }
  .section-label { font-size:10px; letter-spacing:1.5px; }
  .work-heading { display:flex; align-items:end; justify-content:space-between; gap:32px; margin-bottom:48px; }
  .work-heading .section-title { margin:0; }
  .work-intro { max-width:280px; color:#bdbdb3; font-size:16px; line-height:1.7; }
  .project-grid { display:grid; grid-template-columns:1fr 1fr; gap:32px; }
  .project-link { text-decoration:none; color:${WHITE}; display:block; min-width:0; }
  .project-visual { aspect-ratio:5/4; background:#23231f; overflow:hidden; position:relative; }
  .project-visual img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .7s cubic-bezier(.2,.7,.2,1); }
  .project-visual.bank { background:#d7dfec; }
  .project-visual.bank img { object-fit:contain; padding:24px; }
  .project-link:hover img,.project-link:focus-visible img { transform:scale(1.035); }
  .project-open { position:absolute; right:20px; bottom:20px; width:48px; height:48px; display:grid; place-items:center; background:${LIME}; color:${BLACK}; font-size:24px; border-radius:50%; transition:transform .3s; }
  .project-link:hover .project-open { transform:rotate(-45deg); }
  .project-meta { display:flex; justify-content:space-between; gap:20px; padding-top:22px; }
  .project-meta h3 { font-family:'Bebas Neue',sans-serif; font-size:36px; font-weight:400; }
  .project-meta p { color:#bdbdb3; font-size:14px; margin-top:6px; line-height:1.5; }
  .project-index { color:${GRAY}; font-family:'Space Mono',monospace; font-size:11px; padding-top:8px; }
  .work-footnote { margin-top:30px; color:${GRAY}; font-size:12px; }
  .marquee-item { font-size:24px; letter-spacing:1px; color:#8f8f85; }
  button.marquee-item { background:none; border:0; }
  .marquee-section { padding:24px 0; }
  .skill-card { background:transparent; border-top:1px solid #44443c; padding:28px 16px 28px 0; }
  .skill-card-icon { font-family:'Space Mono',monospace; font-size:12px; color:${LIME}; }
  .contact-wrapper { text-align:left; background:${LIME}; color:${BLACK}; padding:64px; }
  .contact-wrapper::before { display:none; }
  .contact-tagline { color:#393e15; }
  .contact-heading { font-size:clamp(60px,8vw,120px); letter-spacing:-1px; }
  .contact-links { justify-content:flex-start; margin-top:32px; }
  .contact-wrapper .btn-primary { background:${BLACK}; color:${WHITE}; }
  .contact-wrapper .btn-outline { border-color:#657020; color:${BLACK}; }
  .contact-wrapper .contact-info,.contact-wrapper .contact-info a { color:#343917; }
  .case-next { max-width:1280px; margin:40px auto 60px; padding:40px 5vw; border-top:1px solid #45453a; display:flex; justify-content:space-between; align-items:center; gap:24px; flex-wrap:wrap; }
  .case-next h2 { font-family:'Bebas Neue',sans-serif; font-size:42px; font-weight:400; margin-bottom:8px; }
  .case-next p { color:${GRAY}; }
  .case-next-actions { display:flex; gap:12px; flex-wrap:wrap; }
  .footer-copy { color:${GRAY}; }
  .footer-name { color:#bdbdb3; }
  @media (max-width:900px) {
    .hero { min-height:auto; grid-template-columns:1fr; padding:130px 24px 80px; gap:48px; }
    .hero-right { order:0; justify-content:flex-start; }
    .hero-right > div { max-width:380px; }
    .hero-name { font-size:clamp(64px,13vw,110px); }
    .hero-desc { font-size:17px; }
    .hero-tag { flex-wrap:wrap; }
    .scroll-hint { display:none; }
    .nav,.nav.scrolled { padding:16px 24px; }
    .menu-toggle { display:block; }
    .nav-links { display:none; position:absolute; top:100%; left:0; right:0; padding:20px 24px 28px; background:${BLACK}; border-bottom:1px solid #444; flex-direction:column; align-items:stretch; gap:8px; }
    .nav-links.open { display:flex; }
    .nav-link { text-align:left; font-size:13px; min-height:44px; }
    .section { padding:72px 24px; }
    .work-heading { display:block; }
    .work-intro { margin-top:24px; max-width:420px; }
    .project-grid { gap:40px; grid-template-columns:1fr; }
    .project-meta h3 { font-size:32px; }
    .contact-wrapper { padding:36px 24px; }
    .contact-info { overflow-wrap:anywhere; line-height:2; }
    .cs-hero { overflow-wrap:anywhere; }
  }
  @media (hover:none), (pointer:coarse) {
    html,body,button,a,.nav-logo,.nav-link,.btn-primary,.btn-outline { cursor:auto !important; }
    .cursor-dot,.cursor-ring { display:none; }
  }
  @media (prefers-reduced-motion:reduce) {
    *,*::before,*::after { animation:none !important; transition:none !important; scroll-behavior:auto !important; }
    .fade-in,.hero-tag,.hero-name,.hero-typewriter,.hero-desc,.hero-cta,.hero-right,.scroll-hint { opacity:1; transform:none; }
  }

  .poster-section { border-top:1px solid #36362e; }
  .poster-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:24px; }
  .poster-card { background:none; border:0; color:inherit; padding:0; text-align:left; cursor:pointer; min-width:0; }
  .poster-picture { aspect-ratio:3/4; display:flex; align-items:center; justify-content:center; background:#23231f; overflow:hidden; position:relative; }
  .poster-picture img { width:100%; height:100%; object-fit:contain; transition:transform .5s; }
  .poster-card:hover img,.poster-card:focus-visible img { transform:scale(1.025); }
  .poster-picture .project-open { width:36px; height:36px; right:12px; bottom:12px; font-size:22px; }
  .poster-card h3 { font-size:18px; margin:18px 0 6px; font-weight:500; }
  .poster-card p { font-size:12px; line-height:1.6; color:${GRAY}; }
  .poster-dialog { width:min(1200px,96vw); max-width:none; height:94svh; max-height:94svh; padding:0; margin:auto; border:1px solid #55554b; background:#151512; color:${WHITE}; }
  .poster-dialog::backdrop { background:rgba(0,0,0,.9); backdrop-filter:blur(8px); }
  .poster-dialog-inner { height:100%; display:flex; flex-direction:column; }
  .poster-toolbar { display:flex; justify-content:space-between; align-items:center; padding:16px 24px; gap:16px; border-bottom:1px solid #36362e; }
  .poster-toolbar span { font:11px 'Space Mono',monospace; color:${GRAY}; }
  .poster-control { background:none; border:1px solid #66665c; color:${WHITE}; padding:12px 16px; min-height:44px; cursor:pointer; }
  .poster-control:hover { color:${LIME}; border-color:${LIME}; }
  .poster-full-image { flex:1; min-height:0; width:100%; object-fit:contain; padding:24px; }
  .poster-caption { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-top:1px solid #36362e; gap:16px; }
  .poster-caption h3 { font-size:20px; margin-bottom:6px; }
  .poster-caption p { font-size:13px; color:${GRAY}; }
  .poster-controls { display:flex; gap:10px; flex-shrink:0; }
  @media (max-width:1100px) { .poster-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } }
  @media (max-width:600px) {
    .poster-grid { gap:24px 14px; }
    .poster-card h3 { font-size:15px; line-height:1.4; }
    .poster-picture .project-open { width:28px; height:28px; font-size:18px; right:8px; bottom:8px; }
    .poster-dialog { width:100vw; height:100svh; max-height:100svh; border:0; }
    .poster-toolbar,.poster-caption { padding:16px; }
    .poster-caption { flex-wrap:wrap; }
    .poster-full-image { padding:12px; }
  }

  .case-intro { padding-top:150px; padding-bottom:64px; }
  .case-title { font-family:'Bebas Neue','Arial Narrow',sans-serif; font-size:clamp(48px,7.5vw,112px); letter-spacing:-2px; line-height:1; margin:32px 0; overflow-wrap:anywhere; }
  .case-title span { display:block; }
  .case-title .accent { color:${LIME}; }
  .case-lead { max-width:760px; font-size:clamp(18px,2vw,23px); color:#bdbdb3; line-height:1.7; }
  .case-facts { display:flex; flex-wrap:wrap; gap:32px 64px; margin-top:48px; padding-top:28px; border-top:1px solid #36362e; }
  .case-facts dt { color:${GRAY}; font:10px 'Space Mono',monospace; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; }
  .case-facts dd { font-size:15px; line-height:1.6; }
  .case-showcase { padding-top:0; padding-bottom:64px; }
  .case-image-stage { background:#f5f5f0; height:clamp(280px,48vw,640px); display:flex; align-items:center; justify-content:center; }
  .case-image-stage img { width:100%; height:100%; object-fit:contain; }
  .case-showcase figcaption { padding:18px 0; color:${GRAY}; font-size:14px; line-height:1.6; }
  .case-thumbnails { display:flex; gap:12px; padding:6px 0; overflow-x:auto; scrollbar-width:thin; }
  .case-thumbnails button { flex-shrink:0; }
  .case-thumbnails button { width:clamp(64px,12vw,150px); height:clamp(60px,9vw,105px); background:#f5f5f0; border:2px solid transparent; padding:4px; cursor:pointer; }
  .case-thumbnails button.selected { border-color:${LIME}; }
  .case-thumbnails img { width:100%; height:100%; object-fit:contain; }
  .case-gallery-controls { display:flex; flex-wrap:wrap; gap:12px; margin-top:24px; }
  .case-story { padding-top:64px; border-top:1px solid #36362e; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:48px; }
  .case-story h2 { font-size:28px; margin:12px 0 20px; }
  .case-story p { color:#bdbdb3; font-size:16px; line-height:1.8; }
  @media(max-width:900px) { .case-story { grid-template-columns:1fr; gap:32px; } .case-intro { padding-top:120px; } .case-title { letter-spacing:-1px; } .case-image-stage { height:340px; } }

  /* Media retains its own proportions; transparent artwork sits on the page. */
  .case-intro { padding-bottom:48px; }
  .case-showcase { max-width:1600px; padding-left:4vw; padding-right:4vw; }
  .case-image-stage { position:relative; width:100%; height:auto; aspect-ratio:auto; border:0; padding:0; cursor:zoom-in; overflow:hidden; background:transparent; }
  .case-image-stage img { display:block; width:100%; height:auto; object-fit:contain; }
  .image-expand { position:absolute; right:20px; bottom:20px; background:#111; color:#f5f5f0; padding:12px 18px; font-size:13px; border:1px solid #555; }
  .case-thumbnails button { width:120px; height:80px; background:transparent; padding:0; border:3px solid transparent; opacity:.65; }
  .case-thumbnails button.selected { opacity:1; border-color:${LIME}; }
  .case-thumbnails img { object-fit:contain; display:block; }
  .case-gallery-controls { justify-content:space-between; }
  .project-grid { align-items:start; }
  .project-visual { aspect-ratio:auto; background:transparent; }
  .project-visual img { width:100%; height:auto; object-fit:contain; }
  .project-visual.bank { background:transparent; }
  .project-visual.bank img { padding:0; }
  .project-visual.cutout img { height:clamp(280px,40vw,540px); width:100%; object-fit:contain; }
  .case-image-stage.cutout img { height:clamp(320px,65vw,740px); width:100%; object-fit:contain; }
  .image-detail { position:fixed; inset:0; width:100vw; max-width:100vw; height:100svh; max-height:100svh; margin:0; padding:0; border:0; background:#141412; color:${WHITE}; }
  .image-detail::backdrop { background:#141412; }
  .image-detail-toolbar { min-height:80px; display:flex; justify-content:space-between; align-items:center; gap:20px; padding:16px 28px; border-bottom:1px solid #444; }
  .image-detail-toolbar p { color:#bdbdb3; font-size:15px; }
  .image-detail-toolbar button { flex-shrink:0; }
  .image-detail-body { height:calc(100svh - 88px); padding:20px; display:flex; align-items:center; justify-content:center; overflow:auto; }
  .image-detail-body img { max-width:100%; max-height:100%; object-fit:contain; }
  .bank-project-intro { padding-top:64px; padding-bottom:40px; max-width:1600px; }
  .bank-project-intro .section-title { font-size:clamp(38px,5vw,72px); margin-bottom:24px; }
  .bank-project-intro p { color:#bdbdb3; font-size:18px; line-height:1.7; max-width:720px; }
  .bank-experience { scroll-margin-top:90px; margin:0 24px 80px; border:1px solid #44443c; background:#1c1c18; }
  .bank-toolbar { display:flex; align-items:center; justify-content:space-between; gap:24px; padding:20px 24px; }
  .bank-toolbar .section-label { margin-bottom:8px; }
  .bank-hint { color:#bdbdb3; font-size:13px; }
  .bank-actions { display:flex; gap:12px; flex-wrap:wrap; }
  .bank-experience iframe { width:100%; height:calc(100svh - 150px); min-height:720px; border:0; display:block; background:white; }
  .bank-fallback { padding:14px 24px; color:#bdbdb3; font-size:12px; line-height:1.6; }
  .bank-fallback a { color:${LIME}; }
  .bank-experience.expanded { position:fixed; inset:0; z-index:12000; margin:0; display:flex; flex-direction:column; border:0; }
  .bank-experience.expanded iframe { flex:1; min-height:0; height:auto; }
  .bank-experience.expanded .bank-fallback { margin:0; }
  @media (max-width:900px) {
    .nav-back { letter-spacing:1px; padding:10px; }
    .case-showcase { padding-left:16px; padding-right:16px; }
    .case-image-stage { height:auto; aspect-ratio:auto; }
    .image-expand { font-size:11px; padding:8px 10px; right:10px; bottom:10px; }
    .case-thumbnails button { width:90px; height:60px; }
    .case-gallery-controls .btn-outline { padding:12px; font-size:12px; }
    .bank-experience { margin:0 12px 48px; }
    .bank-toolbar { flex-wrap:wrap; padding:16px; gap:16px; }
    .bank-actions { width:100%; }
    .bank-actions > * { flex:1; text-align:center; padding:12px; font-size:13px; }
    .bank-experience iframe { height:78svh; min-height:520px; }
    .bank-experience.expanded iframe { min-height:0; }
    .bank-fallback { padding:12px 16px; }
    .image-detail-toolbar { padding:12px; min-height:88px; }
    .image-detail-toolbar p { font-size:12px; }
    .image-detail-body { padding:0; }
  }


  /* Spacious desktop project rows with natural image proportions. */
  #work { max-width:1680px; }
  #work .project-grid { grid-template-columns:minmax(0,1fr); gap:80px; }
  #work .project-link { display:grid; grid-template-columns:minmax(0,1.9fr) minmax(260px,1fr); align-items:center; gap:clamp(32px,5vw,88px); padding-bottom:64px; border-bottom:1px solid #33332e; }
  #work .project-visual { display:flex; align-items:center; justify-content:center; min-width:0; background:transparent; }
  #work .project-visual img, #work .project-visual.cutout img { width:auto; height:auto; max-width:100%; max-height:720px; object-fit:contain; }
  #work .project-meta { padding-top:0; gap:16px; }
  #work .project-meta h3 { font-size:clamp(38px,3.5vw,60px); line-height:1.05; }
  #work .project-meta p { font-size:16px; line-height:1.7; margin-top:16px; }
  #work .project-index { padding-top:6px; }
  @media (max-width:900px) {
    #work .project-grid { gap:48px; }
    #work .project-link { grid-template-columns:minmax(0,1fr); gap:24px; padding-bottom:40px; }
    #work .project-visual img, #work .project-visual.cutout img { max-height:620px; }
    #work .project-meta h3 { font-size:36px; }
    #work .project-meta p { font-size:14px; margin-top:8px; }
  }

/* --- PHILGOOD / editorial art-direction system v2 --- */
:root{--pg-paper:#F8F1E3;--pg-acid:#F2E5AE;--pg-cobalt:#4D52ED}
.portfolio-root{background:#211923;color:var(--pg-paper)}
.nav{background:rgba(21,21,21,.93);border-bottom:1px solid rgba(240,237,229,.18)}
.nav-logo{color:var(--pg-paper);font-family:'Karla',sans-serif;font-weight:800;letter-spacing:-.06em;font-size:26px}
.nav-logo span{color:var(--pg-acid)}
.hero{grid-template-columns:minmax(0,1.25fr) minmax(0,.75fr);gap:2vw;padding:150px clamp(24px,5vw,90px) 100px;min-height:95svh;background:#211923}
.hero-grid-dots{display:none}
.hero-bg-text{bottom:-4vw;left:-.03em;font-size:clamp(110px,23vw,380px);color:rgba(255,255,255,.028);letter-spacing:-.06em;line-height:.75}
.hero-tag{font-size:11px;color:var(--pg-acid);letter-spacing:.13em}
.hero-tag:before{background:var(--pg-acid)}
.hero-name{font-family:'Karla',Arial,sans-serif;font-weight:800;letter-spacing:-.095em;font-size:clamp(84px,11.8vw,215px);line-height:.79;margin:0 0 40px;overflow:visible}
.hero-name span{color:var(--pg-acid)}
.hero-desc{font-size:clamp(18px,1.6vw,24px);font-weight:400;line-height:1.42;color:#F8F1E3;max-width:460px}
.hero-typewriter{font-size:11px;letter-spacing:.16em;color:#D6C7CA}
.btn-primary{background:var(--pg-acid);color:#211923;border-radius:0;font-weight:700}
.btn-primary:hover{background:var(--pg-paper)}
.hero-right{transform:rotate(3deg) translateY(25px)}
.photo-frame{border:0!important}
.photo-frame-inner{filter:grayscale(1) contrast(1.15)}
.photo-label{background:var(--pg-acid)!important;color:#211923!important}
#work{background:var(--pg-paper);color:#211923}
#work .section-label,#work .section-title,#work .work-intro{color:#211923}
#work .work-heading{align-items:end}
#work .section-title{font-family:'Karla',sans-serif;font-weight:800;letter-spacing:-.08em;font-size:clamp(60px,10vw,160px);line-height:.84}
#work .work-intro{font-size:clamp(16px,1.6vw,21px);line-height:1.35}
#work .project-grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));column-gap:clamp(16px,2.5vw,40px);row-gap:clamp(55px,8vw,140px)}
#work .project-link{grid-column:span 7;color:#211923;min-width:0}
#work .project-link:nth-child(even){grid-column:span 5;margin-top:clamp(40px,10vw,160px)}
#work .project-link:nth-child(3n){grid-column:span 8;margin-top:0}
#work .project-visual{aspect-ratio:4/3;background:#342733}
#work .project-link:nth-child(even) .project-visual{aspect-ratio:3/4}
#work .project-meta{border-top:2px solid #211923;padding-top:16px;margin-top:20px}
#work .project-meta h3{font-family:'Karla',sans-serif;font-weight:800;letter-spacing:-.055em;font-size:clamp(31px,4vw,70px);line-height:1}
#work .project-meta p{color:#51404A}
#work .project-index{color:#211923}
#work .project-open{background:var(--pg-acid);border-radius:0;right:0;bottom:0;width:56px;height:56px;font-size:30px}
#work .project-visual.fs-project-visual{background:#7B1528}
#work .project-visual.fs-project-visual .fs-cover-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 48%;filter:none;z-index:0}
#work .project-visual.fs-project-visual .fs-cover-shade{display:none}
#work .project-visual.fs-project-visual .fs-cover-overline,
#work .project-visual.fs-project-visual .fs-cover-wordmark,
#work .project-visual.fs-project-visual .fs-cover-foot{display:none}
#work .project-visual.fs-project-visual:after{content:'IDENTITY / 2026';position:absolute;left:0;top:0;background:#7B1528;color:#F1E2BF;font:700 11px 'Space Mono',monospace;letter-spacing:.06em;padding:12px 14px;z-index:2}
#work .project-visual.fs-project-visual .project-open{background:#F1E2BF;color:#7B1528}
@media(max-width:900px){
.hero{grid-template-columns:1fr;gap:38px;min-height:0;padding:145px 24px 75px}
.hero-name{font-size:clamp(70px,16.8vw,135px);line-height:.83;letter-spacing:-.09em;margin-bottom:28px}
.hero-right{max-width:460px;width:86%;justify-self:end;transform:rotate(3deg) translateY(0)}
.hero-desc{font-size:19px;line-height:1.4}
#work .project-grid{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:65px;column-gap:16px}
#work .project-link,#work .project-link:nth-child(even),#work .project-link:nth-child(3n){grid-column:span 1;margin-top:0}
#work .project-link:nth-child(even){margin-top:80px}
#work .project-meta h3{font-size:clamp(26px,4vw,44px)}
}
@media(max-width:600px){
.hero{padding:130px 20px 60px}
.hero-tag{font-size:9px;letter-spacing:.08em;margin-bottom:30px}
.hero-name{font-size:clamp(66px,18.5vw,104px);letter-spacing:-.085em;line-height:.81}
.hero-desc{max-width:29ch}
.hero-right{width:78%;margin-top:12px}
#work .work-heading{display:block}
#work .work-intro{margin-top:20px}
#work .project-grid{display:flex;flex-direction:column;gap:70px}
#work .project-link,#work .project-link:nth-child(even),#work .project-link:nth-child(3n){width:100%;margin:0}
#work .project-link:nth-child(even){width:87%;align-self:flex-end}
#work .project-visual,#work .project-link:nth-child(even) .project-visual{aspect-ratio:4/3}
#work .project-visual.fs-project-visual{aspect-ratio:4/3}
#work .project-meta h3{font-size:clamp(35px,10vw,54px)}
#work .project-meta p{font-size:13px}
#work .project-open{width:50px;height:50px}
}
@media(prefers-reduced-motion:reduce){.hero-name,.hero-tag,.hero-desc,.hero-typewriter,.hero-cta,.hero-right{animation:none!important;opacity:1!important}}
/* --- 2026 palette: butter / oxblood / cobalt; no neon mint --- */
:root{--pg-paper:#F6EDCE;--pg-acid:#3555F6;--pg-oxblood:#651D35;--pg-ink:#231D1B}
html,body{background:var(--pg-paper);color:var(--pg-ink)}
.portfolio-root{background:var(--pg-paper);color:var(--pg-ink)}
.nav{background:rgba(246,237,206,.96);border-bottom:1px solid rgba(35,29,27,.18)}
.nav-logo{color:var(--pg-ink)}
.nav-logo span,.nav-link:hover,.nav-link.active{color:var(--pg-oxblood)}
.nav-link{color:#5C514A}
.nav-link:after{background:var(--pg-oxblood)}
.nav-back{color:var(--pg-ink);border-color:rgba(35,29,27,.3)}
.nav-back:hover{color:var(--pg-oxblood);border-color:var(--pg-oxblood)}
.hero{background:var(--pg-paper)}
.hero-bg-text{color:rgba(101,29,53,.045)}
.hero-tag{color:var(--pg-oxblood)}
.hero-tag:before{background:var(--pg-oxblood)}
.hero-name{color:var(--pg-ink);font-size:clamp(80px,10vw,172px);letter-spacing:-.085em;line-height:.88}
.hero-name span{color:var(--pg-oxblood)}
.hero-desc{color:#51453E}
.hero-typewriter{color:#7C6B60}
.typewriter-cursor{background:var(--pg-oxblood)}
.btn-primary{background:var(--pg-oxblood);color:var(--pg-paper)}
.btn-primary:hover{background:var(--pg-ink);color:var(--pg-paper)}
.btn-outline{color:var(--pg-ink);border-color:rgba(35,29,27,.35)}
.btn-outline:hover{color:var(--pg-oxblood);border-color:var(--pg-oxblood)}
.photo-label{background:var(--pg-oxblood)!important;color:var(--pg-paper)!important}
#work{background:#E4E9F7;color:var(--pg-ink)}
#work .section-label,#work .section-title,#work .work-intro{color:var(--pg-ink)}
#work .project-link{color:var(--pg-ink)}
#work .project-meta{border-color:var(--pg-ink)}
#work .project-meta h3,#work .project-index{color:var(--pg-ink)}
#work .project-open{background:var(--pg-oxblood);color:var(--pg-paper)}
#work .project-visual.fs-project-visual .project-open{background:#F1E2BF;color:#7B1528}
.scroll-progress-bar{background:var(--pg-oxblood)}
.cursor-dot{background:var(--pg-oxblood)}
.cursor-ring{border-color:var(--pg-oxblood)}
@media(max-width:900px){.hero-name{font-size:clamp(65px,13vw,125px)}}
@media(max-width:600px){.hero-name{font-size:clamp(64px,14.7vw,96px);line-height:.92;letter-spacing:-.075em}}



/* Final contrast repair: dark aubergine + butter, one consistent palette */
:root{--pg-paper:#F2E5AE;--pg-oxblood:#8A2442;--pg-ink:#211923;--pg-acid:#4D52ED}
.portfolio-root{background:#211923;color:#F8F1E3}
.nav{background:rgba(33,25,35,.97);border-bottom:1px solid rgba(242,229,174,.25)}
.nav-logo{color:#F8F1E3!important}
.nav-logo span{color:#F2E5AE!important}
.nav-link,.nav-back{color:#F8F1E3!important}
.nav-link:hover,.nav-link.active{color:#F2E5AE!important}
.hero{background:radial-gradient(ellipse 50% 55% at 90% 15%,rgba(77,82,237,.14),transparent 80%),#211923}
.hero-name{color:#F8F1E3!important;font-size:clamp(74px,10.7vw,188px);line-height:.9;letter-spacing:-.085em}
.hero-name span{color:#F2E5AE!important}
.hero-tag,.hero-typewriter{color:#F2E5AE!important}
.hero-tag:before,.typewriter-cursor{background:#F2E5AE}
.hero-desc{color:#E4DBD1!important}
.hero-bg-text{color:rgba(242,229,174,.045)}
.btn-primary{background:#4D52ED!important;color:#fff!important}
.btn-outline{color:#F8F1E3!important;border-color:rgba(248,241,227,.5)!important}
.btn-outline:hover{border-color:#F2E5AE!important;color:#F2E5AE!important}
.hero-right{transform:rotate(-3deg) translateY(25px)}
.hero-right:after{content:'DESIGN WITH CHARACTER ↗';position:absolute;right:-12px;bottom:2%;z-index:2;background:#4D52ED;color:#fff;font:700 10px 'Space Mono',monospace;letter-spacing:.05em;padding:15px 18px;transform:rotate(7deg)}
#work{background:#F2E5AE;color:#211923}
#work .section-label,#work .section-title,#work .work-intro,#work .project-link,#work .project-index,#work .project-meta h3{color:#211923!important}
#work .project-meta{border-top-color:#211923}
#work .project-open{background:#4D52ED;color:#fff}
#work .project-visual.fs-project-visual .project-open{background:#4D52ED;color:#fff}
@media(max-width:900px){.hero-right{transform:rotate(-3deg)}}
@media(max-width:600px){.hero-name{font-size:clamp(60px,15vw,100px);line-height:.94}.hero-right:after{right:-8px;font-size:8px;padding:10px 12px}}


/* Mobile legibility and hero lockup: fix low contrast in Vercel screenshots */
.portfolio-root .nav-logo,.portfolio-root .nav-logo span{color:#F8F1E3!important;opacity:1!important}
.portfolio-root .nav-logo span{color:#F2E5AE!important}
.portfolio-root .hero-name{color:#F8F1E3!important;opacity:1!important;animation:none!important;text-shadow:none!important}
.portfolio-root .hero-name span{color:#F2E5AE!important}
.portfolio-root .hero-desc{color:#F8F1E3!important;opacity:1!important;animation:none!important}
.portfolio-root .hero-typewriter{color:#F2E5AE!important;opacity:1!important;animation:none!important}
.portfolio-root .hero-cta{opacity:1!important;animation:none!important}
.portfolio-root .hero-tag{color:#F2E5AE!important;opacity:1!important;animation:none!important}
.portfolio-root .btn-outline{color:#F8F1E3!important;opacity:1!important}
.portfolio-root .nav-menu-btn{color:#F8F1E3!important;border-color:rgba(248,241,227,.55)!important}
@media(max-width:600px){.portfolio-root .hero-name{font-size:clamp(56px,14.3vw,94px)!important;line-height:.97!important;letter-spacing:-.075em!important;overflow-wrap:normal;word-break:normal}.portfolio-root .hero{padding-top:130px!important}}

/* Editorial hero repair: one caption, centered portrait, no overlapping ribbons */
.portfolio-root .hero-right{width:100%;justify-content:center!important;opacity:1!important;animation:none!important}
.portfolio-root .hero-right>div{width:100%;max-width:480px!important;transform:none!important}
.portfolio-root .photo-frame{width:min(100%,440px)!important;aspect-ratio:4/5!important;margin-inline:auto!important}
.portfolio-root .photo-frame::before,.portfolio-root .photo-frame::after{display:none!important}
.portfolio-root .photo-frame-inner{overflow:hidden!important}
.portfolio-root .hero-photo{object-fit:contain!important;object-position:center bottom!important}
.portfolio-root .photo-label{position:absolute!important;bottom:0!important;left:0!important;right:auto!important;max-width:100%!important;transform:none!important;rotate:0deg!important;white-space:normal!important;z-index:5!important;background:#F2E5AE!important;color:#251D25!important;padding:11px 15px!important;font-size:10px!important;letter-spacing:.14em!important}
.portfolio-root .photo-frame .photo-label::before,.portfolio-root .photo-frame .photo-label::after{display:none!important}
@media(max-width:900px){.portfolio-root .hero-right{justify-content:center!important}.portfolio-root .hero-right>div{max-width:440px!important}.portfolio-root .photo-frame{width:min(86vw,420px)!important}}

/* Editorial Ruhrgebiet refresh: one image, centered, no stacked stickers */
.hero{position:relative;isolation:isolate;overflow:hidden}
.ruhr-tower{position:absolute;right:-3%;top:7%;height:86%;width:min(43vw,540px);color:#F2E5AE;opacity:.15;pointer-events:none;z-index:0}
.hero-bg-text,.hero-grid-dots{display:none!important}
.hero-right{transform:none!important;animation:none!important;opacity:1!important;position:relative;z-index:1}
.hero-right:after,.photo-frame:before,.photo-frame:after,.photo-label{display:none!important;content:none!important}
.hero-right>div{transform:none!important;width:100%;display:flex;justify-content:center}
.photo-frame{width:min(100%,440px)!important;aspect-ratio:4/5!important;border:1px solid rgba(242,229,174,.45);overflow:hidden;background:#211923;margin-inline:auto}
.photo-frame-inner{position:absolute;inset:0;overflow:hidden}
.photo-frame .hero-photo{width:100%;height:100%;object-fit:cover;object-position:center 28%;filter:grayscale(100%) contrast(1.05);opacity:1!important;transform:none!important}
.hero-cta{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.hero-cta .btn-primary,.hero-cta .btn-outline{margin:0!important;transform:none!important}
@media(max-width:900px){.ruhr-tower{top:4%;right:-18%;width:65vw;height:55%;opacity:.11}.hero-right{width:100%;margin:32px auto 0!important}.photo-frame{width:min(78vw,430px)!important;aspect-ratio:4/5!important}}
@media(max-width:600px){.hero{padding-top:110px!important}.hero-right{padding:0!important;margin:48px auto 0!important;justify-content:center!important}.hero-right>div{width:100%!important}.photo-frame{width:min(82vw,390px)!important;aspect-ratio:4/5!important}.hero-cta{gap:12px!important}.hero-cta .btn-primary,.hero-cta .btn-outline{width:auto!important;max-width:100%;padding:14px 18px!important}.ruhr-tower{right:-28%;top:4%;width:95vw;height:45%;opacity:.12}}

/* Philgood Media positioning: minimal, sharp, customer-facing */
.portfolio-root .hero{background:#F4F1E8!important;color:#1C2522!important;min-height:0!important}
.portfolio-root .nav{background:#F4F1E8!important;border-bottom:1px solid #1C2522!important}
.portfolio-root .nav-logo,.portfolio-root .nav-logo span,.portfolio-root .menu-toggle{color:#1C2522!important}
.portfolio-root .menu-toggle{border-color:#1C2522!important}
.portfolio-root .hero-tag{color:#304C3D!important;font-weight:700!important}
.portfolio-root .hero-tag:before{background:#304C3D!important}
.portfolio-root .hero-name{font-family:'Karla',Arial,sans-serif!important;font-size:clamp(66px,9.3vw,152px)!important;font-weight:700!important;line-height:.91!important;letter-spacing:-.095em!important;color:#1C2522!important}
.portfolio-root .hero-name span{color:#304C3D!important}
.portfolio-root .hero-desc{color:#303A34!important;font-size:clamp(16px,1.5vw,21px)!important;line-height:1.45!important;font-weight:400!important;max-width:580px!important}
.portfolio-root .hero-typewriter{display:none!important}
.portfolio-root .hero-bg-text{display:none!important}
.portfolio-root .ruhr-tower{color:#304C3D!important;opacity:.10!important}
.portfolio-root .btn-primary{background:#D5F15C!important;color:#1C2522!important;border:1px solid #1C2522!important}
.portfolio-root .btn-outline{color:#1C2522!important;border:1px solid #1C2522!important}
.portfolio-root .photo-frame{border:0!important;box-shadow:none!important;aspect-ratio:4/5!important}
.portfolio-root .hero-photo{filter:grayscale(1)!important}
.portfolio-root #work{background:#D5F15C!important}
.pg-services{display:flex;flex-wrap:wrap;gap:7px;margin:24px 0 26px;max-width:590px}
.pg-services span{font:700 10px 'Space Mono',monospace;letter-spacing:.02em;color:#1C2522;border:1px solid #1C2522;padding:9px 11px;background:transparent}
@media(max-width:900px){.portfolio-root .hero-name{font-size:clamp(54px,11vw,95px)!important}.portfolio-root .hero-right{margin-top:36px!important}}
@media(max-width:600px){.portfolio-root .hero{padding-top:116px!important}.portfolio-root .hero-name{font-size:clamp(52px,13.1vw,80px)!important;letter-spacing:-.085em!important;line-height:.95!important}.portfolio-root .hero-desc{font-size:16px!important}.pg-services{margin:20px 0 24px;gap:6px}.pg-services span{font-size:9px;padding:8px 9px}.portfolio-root .hero-cta{gap:10px!important}.portfolio-root .hero-right{margin-top:42px!important}}

/* Clean studio homepage v3 – deliberately remove previous stacked hero visuals */
.portfolio-root{background:#F7F6F2!important;color:#202421!important}
.portfolio-root .nav{background:#F7F6F2!important;border-bottom:1px solid #D8D8D0!important;box-shadow:none!important}
.portfolio-root .nav-logo,.portfolio-root .nav-logo span,.portfolio-root .menu-toggle{color:#202421!important}
.portfolio-root .menu-toggle{border:1px solid #202421!important}
.portfolio-root .hero{background:#F7F6F2!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:stretch!important;gap:0!important;min-height:88svh!important;padding:170px max(6vw,24px) 100px!important;overflow:hidden!important}
.portfolio-root .hero-left{max-width:1300px;width:100%;margin:0 auto!important}
.portfolio-root .hero-left>div{transform:none!important}
.portfolio-root .hero-right,.portfolio-root .ruhr-tower,.portfolio-root .hero-bg-text,.portfolio-root .hero-grid-dots,.portfolio-root .scroll-hint{display:none!important}
.portfolio-root .hero-tag{font:600 12px 'Space Mono',monospace!important;letter-spacing:.08em!important;color:#536058!important;margin-bottom:42px!important;animation:none!important;opacity:1!important}
.portfolio-root .hero-tag:before{width:28px!important;background:#536058!important}
.portfolio-root .hero-name{font-family:'Karla',Arial,sans-serif!important;font-size:clamp(68px,9.5vw,160px)!important;line-height:.95!important;letter-spacing:-.085em!important;font-weight:700!important;color:#202421!important;margin:0 0 35px!important;animation:none!important;opacity:1!important;max-width:1200px!important}
.portfolio-root .hero-name span{color:#202421!important}
.portfolio-root .hero-desc{color:#404740!important;max-width:560px!important;font:400 clamp(18px,1.8vw,23px)/1.45 'Karla',Arial,sans-serif!important;animation:none!important;opacity:1!important;margin-bottom:38px!important}
.portfolio-root .hero-typewriter,.portfolio-root .pg-services{display:none!important}
.portfolio-root .hero-cta{display:flex!important;gap:20px!important;animation:none!important;opacity:1!important;align-items:center!important}
.portfolio-root .btn-primary{background:#202421!important;color:#F7F6F2!important;border:1px solid #202421!important;padding:18px 24px!important;font:700 12px 'Space Mono',monospace!important;letter-spacing:0!important}
.portfolio-root .btn-outline{background:transparent!important;color:#202421!important;border:0!important;border-bottom:1px solid #202421!important;padding:15px 0!important;font:700 12px 'Space Mono',monospace!important;letter-spacing:0!important}
.portfolio-root #work{background:#E7E9E1!important;color:#202421!important;padding-top:90px!important}
.portfolio-root #work .section-title{font-family:'Karla',Arial,sans-serif!important;font-size:clamp(44px,6vw,94px)!important;letter-spacing:-.075em!important;line-height:1!important}
.portfolio-root #work .section-label{font-size:11px!important;letter-spacing:.08em!important}
.portfolio-root #work .project-grid{gap:42px!important}
.portfolio-root #work .project-visual{border-radius:0!important}
.portfolio-root #work .project-meta{padding-top:15px!important}
@media(max-width:900px){.portfolio-root .hero{min-height:auto!important;padding:170px 34px 95px!important}.portfolio-root .hero-name{font-size:clamp(58px,10vw,105px)!important}.portfolio-root #work{padding-top:70px!important}}
@media(max-width:600px){.portfolio-root .nav{padding:20px 24px!important}.portfolio-root .hero{padding:152px 25px 85px!important;min-height:80svh!important}.portfolio-root .hero-tag{font-size:9px!important;letter-spacing:.02em!important;margin-bottom:36px!important}.portfolio-root .hero-name{font-size:clamp(48px,11.5vw,76px)!important;letter-spacing:-.09em!important;line-height:1.02!important;margin-bottom:30px!important}.portfolio-root .hero-desc{font-size:17px!important;margin-bottom:28px!important}.portfolio-root .hero-cta{gap:20px!important;flex-wrap:wrap!important}.portfolio-root .btn-primary{padding:15px 17px!important}.portfolio-root .btn-outline{padding:13px 0!important}.portfolio-root #work{padding-top:65px!important}.portfolio-root #work .section-title{font-size:clamp(38px,9vw,65px)!important}}

/* Heavy black editorial typography */
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800;900&display=swap');
.portfolio-root .hero-name,.portfolio-root #work .section-title,.portfolio-root .section-title,.portfolio-root .about-quote{font-family:'Archivo Black','Arial Black',sans-serif!important;font-weight:900!important;letter-spacing:-.065em!important}
.portfolio-root .hero-name{font-size:clamp(62px,8.6vw,148px)!important;line-height:.98!important}
.portfolio-root #work .section-title{line-height:1.02!important}
.portfolio-root .nav-logo,.portfolio-root .nav-logo .logo-name{font-family:'Inter',Arial,sans-serif!important;font-weight:900!important;letter-spacing:-.055em!important}
.portfolio-root .project-meta h3,.portfolio-root .poster-card h3{font-family:'Inter',Arial,sans-serif!important;font-weight:900!important;letter-spacing:-.045em!important}
@media(max-width:900px){.portfolio-root .hero-name{font-size:clamp(54px,9.5vw,100px)!important}}
@media(max-width:600px){.portfolio-root .hero-name{font-size:clamp(40px,9.7vw,64px)!important;line-height:1.08!important;letter-spacing:-.075em!important;overflow-wrap:normal!important}.portfolio-root #work .section-title{font-size:clamp(36px,8.4vw,60px)!important}}

/* Studio editorial homepage: image-first work and disciplined service columns */
.portfolio-root .hero{padding-bottom:0!important;min-height:0!important}
.portfolio-root .hero-left{padding-bottom:92px!important}
.portfolio-root .hero-name{font-size:clamp(68px,10vw,160px)!important;max-width:1200px!important;line-height:.91!important}
.portfolio-root .hero-name span{color:#1E211E!important}
.portfolio-root .hero-tag{margin-bottom:36px!important}
.portfolio-root .hero-desc{max-width:480px!important}
.portfolio-root .hero-cta .btn-primary{background:#1E211E!important;color:#F7F6F2!important}
.pg-focus-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:calc(100% + 12vw);margin:0 -6vw;background:#F7F6F2;border-top:1px solid #1E211E;border-bottom:1px solid #1E211E}
.pg-focus-grid>div{padding:36px 6vw 38px;border-right:1px solid #C8C9C2;min-width:0}
.pg-focus-grid>div:last-child{border-right:0}
.pg-focus-grid small{display:block;font:600 11px 'Space Mono',monospace;letter-spacing:.05em;margin-bottom:12px}
.pg-focus-grid strong{display:block;font-family:'Archivo Black','Arial Black',sans-serif;font-size:clamp(24px,3.2vw,58px);letter-spacing:-.065em;line-height:1;color:#1E211E}
.pg-focus-grid p{max-width:240px;font-size:15px;line-height:1.4;margin-top:15px;color:#404740}
.portfolio-root #work{background:#171A18!important;color:#F7F6F2!important;padding-top:85px!important}
.portfolio-root #work .section-label,.portfolio-root #work .section-title,.portfolio-root #work .work-intro,.portfolio-root #work .project-meta h3,.portfolio-root #work .project-index{color:#F7F6F2!important}
.portfolio-root #work .project-meta{border-color:rgba(255,255,255,.3)!important}
.portfolio-root #work .project-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:28px!important}
.portfolio-root #work .project-link{grid-column:auto!important;transform:none!important}
.portfolio-root #work .project-visual{aspect-ratio:4/3!important}
.portfolio-root #work .project-visual img{filter:none!important}
.portfolio-root #work .project-open{background:#D6F25E!important;color:#171A18!important}
@media(max-width:900px){.pg-focus-grid{width:calc(100% + 68px);margin:0 -34px}.pg-focus-grid>div{padding:24px 20px}.pg-focus-grid strong{font-size:clamp(23px,3.4vw,40px)}}
@media(max-width:600px){.portfolio-root .hero{padding-bottom:0!important}.portfolio-root .hero-left{padding-bottom:70px!important}.portfolio-root .hero-name{font-size:clamp(51px,12.1vw,82px)!important;letter-spacing:-.075em!important;line-height:.96!important}.pg-focus-grid{width:calc(100% + 50px);margin:0 -25px;grid-template-columns:1fr!important}.pg-focus-grid>div{padding:22px 25px;border-right:0;border-bottom:1px solid #C8C9C2;display:grid;grid-template-columns:1fr 1.2fr;column-gap:12px;align-items:start}.pg-focus-grid>div:last-child{border-bottom:0}.pg-focus-grid small{grid-column:1/-1;margin-bottom:8px}.pg-focus-grid strong{font-size:clamp(27px,8vw,42px)}.pg-focus-grid p{font-size:13px;margin:0}.portfolio-root #work{padding-top:64px!important}.portfolio-root #work .project-grid{grid-template-columns:1fr!important;gap:35px!important}.portfolio-root #work .project-visual{aspect-ratio:4/3!important}}
`;

const WORDS = ["Art Director", "Brand Designer", "Print & Digital", "Creative Mind"];
function Typewriter() {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setText(WORDS[0]); return; }
    const word = WORDS[wordIdx];
    const complete = !deleting && text === word;
    const t = setTimeout(() => {
      if (complete) setDeleting(true);
      else if (!deleting) setText(word.slice(0, text.length + 1));
      else if (text.length <= 1) { setText(""); setDeleting(false); setWordIdx(i => (i + 1) % WORDS.length); }
      else setText(word.slice(0, text.length - 1));
    }, complete ? 1500 : deleting ? 60 : 120);
    return () => clearTimeout(t);
  }, [text, deleting, wordIdx]);
  return <div className="hero-typewriter"><span aria-hidden="true">{text}<span className="typewriter-cursor" /></span><span className="sr-only">Art Director · Brand Designer · Print & Digital</span></div>;
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
  const startY = useRef(0);
  const touchAxis = useRef(null);
  const startPos = useRef(0);
  const hasDragged = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const tick = () => {
      if (!isDragging.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !containerRef.current?.matches(":hover, :focus-within")) {
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
      const delta = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - startY.current;
      if (!touchAxis.current && Math.max(Math.abs(delta), Math.abs(dy)) > 5) touchAxis.current = Math.abs(delta) > Math.abs(dy) ? "x" : "y";
      if (touchAxis.current !== "x") return;
      e.preventDefault();
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
    const project = PROJECTS.find(project => project.title === item);
    if (project) onNavigate(project.page);
  };

  return (
    <div
      ref={containerRef}
      className="marquee-section"
      onMouseDown={e => startDrag(e.clientX)}
      onMouseMove={e => moveDrag(e.clientX)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchStart={e => { startY.current = e.touches[0].clientY; touchAxis.current = null; startDrag(e.touches[0].clientX); }}
      onTouchEnd={endDrag}
      onTouchCancel={endDrag}
    >
      <div style={{ overflow: "hidden" }}>
        <div ref={trackRef} style={{ display: "inline-flex", whiteSpace: "nowrap" }}>
          {[...items, ...items].map((item, i) =>
            PROJECTS.some(project => project.title === item) ? (
              <button type="button" key={i} className="marquee-item clickable" onClick={e => handleItemClick(item, e)}>
                {item}<span className="marquee-badge">Case Study</span><span className="marquee-sep">✦</span>
              </button>
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
  const isCutout = img === "/gf_logo.png" || img === "/gf_result.png";
  return (
    <div style={{ width:"100%", height:210, position:"relative", overflow:"hidden", background:"transparent" }}>
      {img ? (
        <img
          src={img}
          loading="lazy"
          alt={"Glutenfry – Projektschritt " + id}
          style={{ width:"100%", height:"100%", objectFit:isCutout ? "contain" : "cover", objectPosition:"center", display:"block", transition:"transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}
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
  const isCutout = card.img === "/gf_logo.png" || card.img === "/gf_result.png";
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
        border: isCutout ? "1px solid transparent" : "1px solid " + (isHovered ? LIME : "rgba(255,255,255,0.1)"),
        background:isCutout ? "transparent" : "rgba(16,16,16,0.96)", overflow:"hidden", cursor:"none",
        transition:"all 0.52s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: isCutout ? "none" : isHovered ? "0 70px 130px rgba(0,0,0,0.98),0 0 70px rgba(212,237,42,0.14)" : "0 20px 50px rgba(0,0,0,0.6)",
      }}
      tabIndex={0}
      onFocus={() => setHoveredCard(card.id)}
      onBlur={() => setHoveredCard(null)}
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
      <p className="mobile-card-hint">Wischen, um den Prozess zu entdecken →</p>
      <div className="mobile-cards-scroll">
        {GLUTENFRY_CARDS.map(card => (
          <div key={card.id} className={"mobile-card" + ([2,5].includes(card.id) ? " cutout-card" : "")}>
            <CardMedia img={card.img} id={card.id} />
            <CardBody card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── GLUTENFRY PAGE ── */
function GlutenfryPage({ onBack, onNavigate }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{ minHeight:"100vh" }}>
      <section className="cs-hero">
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 55% 65% at 8% 65%,rgba(212,237,42,0.065) 0%,transparent 68%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(212,237,42,0.07) 1px,transparent 1px)", backgroundSize:"60px 60px", WebkitMaskImage:"radial-gradient(ellipse 50% 70% at 95% 25%,black,transparent)", maskImage:"radial-gradient(ellipse 50% 70% at 95% 25%,black,transparent)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-60, right:-30, fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(120px,20vw,300px)", color:"rgba(255,255,255,0.018)", pointerEvents:"none", userSelect:"none", letterSpacing:-6, lineHeight:0.85 }}>GLUTEN<br/>FREE</div>
        <div style={{ position:"relative", zIndex:1 }}>
          <div className="section-label" style={{ animation:"slideUp 0.7s 0.1s both" }}>Case Study · Brand Design · 2024</div>
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
      <CaseNext page="glutenfry" onNavigate={onNavigate} />
      <footer className="footer">
        <div className="footer-name">PHILIP SPIEKERMANN</div>
        <div className="footer-copy">Case Study · Glutenfry · 2024</div>
      </footer>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
function PhotoSwitcher() {
  return <img src={philipPhoto} alt="Philip Spiekermann" className="hero-photo visible" />;
}


const POSTERS = [
  {title:"Cali Couture — Anime", category:"Poster · Typografie & Illustration", src:"/posters/cali-anime.webp", alt:"Cali-Couture-Poster mit weißhaariger Animefigur, diagonalen Aussparungen und schwarzer Typografie auf Weiß"},
  {title:"Heute schon Schwein gehabt?", category:"Poster · Gesellschaft & Gestaltung", src:"/posters/schwein-gehabt.webp", alt:"Gesellschaftskritisches Poster mit futuristischen Schweinen, großer weiß-roter Typografie und Informationen zur Tierhaltung"},
  {title:"Her Art, Her Voice", category:"Museum · Plakatserie", src:"/posters/her-art-her-voice.webp", alt:"Drei Museumsplakate mit bunten Kunstmotiven auf einer Außenwand, jeweils mit dem Titel Her Art, Her Voice"},
  {title:"Cali Couture — Streetworkout", category:"Poster · Collage & Typografie", src:"/posters/cali-streetworkout.webp", alt:"Cali-Couture-Collage mit schwarzhaariger Figur, pinken Akzenten und rotem Streetworkout-Schriftzug"},
];
function PosterGallery() {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const opener = useRef(null);
  const touchStart = useRef(null);
  const step = (direction) => setSelected(i => (i + direction + POSTERS.length) % POSTERS.length);
  const close = () => dialog.current?.close();
  useEffect(() => {
    if (selected === null) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selected !== null]);
  const poster = selected === null ? null : POSTERS[selected];
  return <section id="posters" className="section poster-section">
    <div className="work-heading">
      <div><div className="section-label">02 / Poster & freie Arbeiten</div><h2 className="section-title">PLATZ FÜR<br />EIGENE IDEEN.</h2></div>
      <p className="work-intro">Typografie, Collage und visuelle Experimente. Motiv öffnen und die Details entdecken.</p>
    </div>
    <div className="poster-grid">
      {POSTERS.map((item,i) => <button key={item.src} className="poster-card" aria-label={item.title+" – Großansicht öffnen"} aria-haspopup="dialog" onClick={event=>{opener.current=event.currentTarget;setSelected(i);}}>
        <div className="poster-picture"><img src={item.src} alt={item.alt} loading="lazy" width="600" height="800"/><span className="project-open" aria-hidden="true">+</span></div>
        <h3>{item.title}</h3><p>{item.category}</p>
      </button>)}
    </div>
    <dialog ref={dialog} className="poster-dialog" aria-labelledby="poster-title" onClose={()=>{setSelected(null);opener.current?.focus({preventScroll:true});}} onClick={e=>{if(e.target===dialog.current)close();}} onKeyDown={e=>{
      if(e.key === "ArrowRight") {e.preventDefault();step(1);}
      if(e.key === "ArrowLeft") {e.preventDefault();step(-1);}
    }}>
      {poster && <div className="poster-dialog-inner">
        <div className="poster-toolbar"><span>POSTER & FREIE ARBEITEN · {selected+1} / {POSTERS.length}</span><button className="poster-control" autoFocus onClick={close} aria-label="Großansicht schließen">Schließen ×</button></div>
        <img className="poster-full-image" src={poster.src} alt={poster.alt} onTouchStart={e=>{touchStart.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{
          if(!touchStart.current)return;
          const dx=e.changedTouches[0].clientX-touchStart.current.x,dy=e.changedTouches[0].clientY-touchStart.current.y;
          if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy))step(dx<0?1:-1);
          touchStart.current=null;
        }}/>
        <div className="poster-caption"><div aria-live="polite"><h3 id="poster-title">{poster.title}</h3><p>{poster.category}</p></div><div className="poster-controls"><button className="poster-control" onClick={()=>step(-1)} aria-label="Vorheriges Poster">←</button><button className="poster-control" onClick={()=>step(1)} aria-label="Nächstes Poster">→</button></div></div>
      </div>}
    </dialog>
  </section>;
}


const PROJECTS = [
  {page:"glutenfry",title:"Glutenfry",description:"Eine mutige Marke für glutenfreies Soul Food.",category:"Brand Design · Packaging · Print",img:"/gf_brand.png"},
  {page:"fruehschicht",title:"Frühschicht",description:"Eine Bäckerei mit Ruhrgebiets-DNA.",category:"Branding · Packaging · Interior",img:"/fruehschicht/01-storefront.jpg"}
];

function ImageDetail({ image, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    ref.current.showModal(); document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; previousFocus?.focus({preventScroll:true}); };
  }, []);
  return <dialog ref={ref} className="image-detail" aria-label="Projektmotiv in Großansicht" onClose={onClose} onClick={e=>{if(e.target===ref.current)ref.current.close();}}>
    <div className="image-detail-toolbar"><p>{image.caption}</p><button autoFocus className="poster-control" onClick={()=>ref.current.close()}>Schließen ×</button></div>
    <div className="image-detail-body"><img src={image.src} alt={image.alt}/></div>
  </dialog>;
}

function ProjectPage({ project, onNavigate }) {
  const [activeImage, setActiveImage] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  return <article className="project-case">
    <header className="case-intro section">
      <div className="section-label">Case Study / {project.title}</div>
      <h1 className="case-title">{project.headline.split("\n").map((line,i)=><span key={line} className={i===1?"accent":""}>{line}</span>)}</h1>
      <p className="case-lead">{project.intro}</p>
      <dl className="case-facts"><div><dt>Projekt</dt><dd>{project.year}</dd></div><div><dt>Mein Beitrag</dt><dd>{project.role}</dd></div></dl>
    </header>
    <section className="case-showcase section" aria-label="Projektgalerie">
      <figure><button className={"case-image-stage" + (project.images[activeImage].cutout ? " cutout" : "")} onClick={()=>setDetailOpen(true)} aria-label="Motiv in Großansicht öffnen"><img src={project.images[activeImage].src} alt={project.images[activeImage].alt}/><span className="image-expand">Großansicht ⤢</span></button><figcaption aria-live="polite">{String(activeImage+1).padStart(2,"0")} / {String(project.images.length).padStart(2,"0")} — {project.images[activeImage].caption}</figcaption></figure>
      <div className="case-thumbnails">{project.images.map((im,i)=><button key={im.src} className={activeImage===i?"selected":""} aria-label={"Motiv "+(i+1)+": "+im.alt} aria-pressed={activeImage===i} onClick={()=>setActiveImage(i)}><img src={im.src} alt="" loading="lazy"/></button>)}</div>
      <div className="case-gallery-controls"><button className="btn-outline" onClick={()=>setActiveImage(i=>(i-1+project.images.length)%project.images.length)}>← Vorheriges Motiv</button><button className="btn-outline" onClick={()=>setActiveImage(i=>(i+1)%project.images.length)}>Nächstes Motiv →</button></div>
    </section>
    <section className="case-story section" aria-label="Aufgabe, Idee und Umsetzung">{project.steps.map(([title,body],i)=><div key={title}><div className="section-label">0{i+1}</div><h2>{title}</h2><p>{body}</p></div>)}</section>
    {detailOpen && <ImageDetail image={project.images[activeImage]} onClose={()=>setDetailOpen(false)}/>}
    <CaseNext page={project.page} onNavigate={onNavigate}/>
    <footer className="footer"><button className="btn-outline" onClick={()=>onNavigate("home")}>← Alle Projekte</button><div className="footer-copy">Philip Spiekermann · {project.title}</div></footer>
  </article>;
}

const sections = ["hero","work","posters","about","experience","skills","contact"];
const pageFromLocation = () => {
  const page = window.location.hash.slice(1) || window.location.pathname.slice(1);
  return PROJECTS.some(project => project.page === page) ? page : "home";
};
function CaseNext({ page, onNavigate }) {
  return <section className="case-next">
    <div><h2>So etwas für deine Marke?</h2><p>Erzähl mir, was du vorhast.</p></div>
    <div className="case-next-actions">
      <a className="btn-primary" href="mailto:philipspiekermann@hotmail.com?subject=Projektanfrage">Projekt anfragen ↗</a>
      <button className="btn-outline" onClick={() => onNavigate(PROJECTS[(PROJECTS.findIndex(project => project.page === page)+1)%PROJECTS.length].page)}>Nächstes Projekt →</button>
    </div>
  </section>;
}


function FruehschichtPage({ onNavigate }) {
  const gallery = [
{src:"/fruehschicht/03-cups.jpg",title:"Coffee to go",caption:"Der erste Kaffee gehört uns."},
{src:"/fruehschicht/04-bag.jpg",title:"Daily bread",caption:"Gutes Brot. Klare Haltung."},
{src:"/fruehschicht/02-interior.jpg",title:"The space",caption:"Ein Laden, der sich nach Zuhause anfühlt."},
{src:"/fruehschicht/05-box.jpg",title:"Take a piece",caption:"Branding bis zum letzten Krümel."},
{src:"/fruehschicht/01-storefront.jpg",title:"The storefront",caption:"Von der Straße direkt ins Herz."}
];
  return <article className="case-fruehschicht">
    <style>{"@import url('https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Inter+Tight:wght@400;500;600;700;800;900&display=swap');\n\n.case-fruehschicht{--wine:#7B1528;--deep:#4E0E1D;--cream:#F4EEE3;--butter:#F1E2BF;--ink:#221b19;background:var(--cream);color:var(--ink);font-family:'Inter Tight',Arial,sans-serif;overflow:hidden}\n.case-fruehschicht *{box-sizing:border-box}\n.case-fruehschicht h1,.case-fruehschicht h2,.case-fruehschicht p,.case-fruehschicht figure{margin:0}\n.case-fruehschicht img{display:block;width:100%;height:100%;object-fit:cover}\n.case-fruehschicht .cb-mono{font-family:monospace;font-size:11px;letter-spacing:.13em;text-transform:uppercase}\n.case-fruehschicht .cb-display{font-family:'Bagel Fat One',Georgia,serif;font-weight:400;letter-spacing:-.065em;line-height:.91}\n.case-fruehschicht .cb-hero{position:relative;min-height:clamp(640px,94svh,1100px);background:var(--deep);color:var(--cream);display:flex;flex-direction:column;isolation:isolate}\n.case-fruehschicht .cb-hero-photo{position:absolute;inset:0;z-index:-2;overflow:hidden}\n.case-fruehschicht .cb-hero-photo img{filter:brightness(.65) saturate(.9);object-position:center 58%;animation:cb-zoom 1.5s ease-out both}\n.case-fruehschicht .cb-hero:after{content:\"\";position:absolute;inset:0;background:linear-gradient(180deg,rgba(25,8,9,.5) 0%,rgba(25,8,9,.05) 35%,rgba(25,8,9,.82) 100%);z-index:-1}\n.case-fruehschicht .cb-topline{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:clamp(22px,4vw,52px) clamp(22px,5vw,80px);color:var(--cream)}\n.case-fruehschicht .cb-topline span:last-child{border:1px solid rgba(255,255,255,.6);padding:10px 13px;border-radius:50px}\n.case-fruehschicht .cb-hero-inner{margin-top:auto;padding:40px clamp(20px,5vw,80px) clamp(46px,7vw,110px)}\n.case-fruehschicht .cb-hero-title{font-size:clamp(65px,14.7vw,225px);white-space:nowrap;color:var(--butter);text-shadow:0 12px 40px rgba(0,0,0,.25);animation:cb-rise .9s both}\n.case-fruehschicht .cb-hero-bottom{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-top:clamp(30px,5vw,70px);max-width:1250px}\n.case-fruehschicht .cb-hero-bottom p{max-width:570px;font-size:clamp(19px,2.3vw,32px);line-height:1.13;font-weight:600;letter-spacing:-.03em}\n.case-fruehschicht .cb-hero-bottom a{flex-shrink:0;color:var(--deep);background:var(--butter);text-decoration:none;width:72px;height:72px;border-radius:50%;display:grid;place-items:center;font-size:32px;transition:transform .25s}\n.case-fruehschicht .cb-hero-bottom a:hover{transform:translateY(7px)}\n.case-fruehschicht .cb-ticker{background:var(--butter);color:var(--wine);overflow:hidden;white-space:nowrap;padding:17px 0;font-size:clamp(18px,2.7vw,35px);font-weight:800;letter-spacing:-.03em}\n.case-fruehschicht .cb-ticker-track{display:flex;gap:40px;width:max-content;animation:cb-marquee 24s linear infinite}\n.case-fruehschicht .cb-ticker-track span{display:inline-block}\n.case-fruehschicht .cb-story{padding:clamp(90px,13vw,180px) clamp(22px,7vw,110px);display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(40px,8vw,140px);align-items:start}\n.case-fruehschicht .cb-story h2{font-size:clamp(52px,7.2vw,120px);color:var(--wine);margin-top:20px}\n.case-fruehschicht .cb-story-copy{padding-top:clamp(15px,8vw,115px)}\n.case-fruehschicht .cb-story-copy p{font-size:clamp(18px,2vw,25px);line-height:1.48;max-width:640px}\n.case-fruehschicht .cb-story-copy p+p{margin-top:26px}\n.case-fruehschicht .cb-note{margin-top:40px;padding-top:20px;border-top:1px solid #c6b9a6;display:flex;justify-content:space-between;gap:12px;color:var(--wine)}\n.case-fruehschicht .cb-feature{position:relative;min-height:clamp(520px,80vw,950px);background:var(--wine);color:var(--cream);overflow:hidden;display:grid;grid-template-columns:1fr 1fr}\n.case-fruehschicht .cb-feature-copy{padding:clamp(32px,6vw,100px);display:flex;flex-direction:column;justify-content:space-between;gap:40px;z-index:1}\n.case-fruehschicht .cb-feature h2{font-size:clamp(60px,8vw,138px);color:var(--butter)}\n.case-fruehschicht .cb-feature-copy p{max-width:450px;font-size:clamp(18px,2.1vw,26px);line-height:1.25}\n.case-fruehschicht .cb-feature-photo{min-height:100%;overflow:hidden}\n.case-fruehschicht .cb-feature-photo img{object-position:center;transition:transform .8s}\n.case-fruehschicht .cb-feature:hover img{transform:scale(1.04)}\n.case-fruehschicht .cb-stamp{position:absolute;left:calc(50% - 85px);top:calc(50% - 85px);width:170px;height:170px;border-radius:50%;background:var(--butter);color:var(--wine);display:grid;place-items:center;text-align:center;transform:rotate(-14deg);font-weight:900;font-size:19px;line-height:1.05;z-index:2;box-shadow:0 10px 30px rgba(0,0,0,.12)}\n.case-fruehschicht .cb-statement{background:var(--butter);padding:clamp(85px,12vw,160px) clamp(22px,7vw,110px);text-align:center}\n.case-fruehschicht .cb-statement h2{max-width:1250px;margin:20px auto 0;font-size:clamp(46px,8.8vw,145px);color:var(--wine)}\n.case-fruehschicht .cb-statement p{max-width:700px;margin:35px auto 0;font-size:clamp(17px,2vw,24px);line-height:1.5}\n.case-fruehschicht .cb-chapter{padding:clamp(90px,12vw,170px) clamp(22px,6vw,100px)}\n.case-fruehschicht .cb-chapter-head{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:clamp(45px,6vw,85px)}\n.case-fruehschicht .cb-chapter-head h2{font-size:clamp(52px,8vw,130px);color:var(--wine);max-width:850px}\n.case-fruehschicht .cb-chapter-head p{max-width:280px;line-height:1.4}\n.case-fruehschicht .cb-showcase{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:clamp(24px,4vw,70px) clamp(15px,3vw,50px);align-items:start}\n.case-fruehschicht .cb-shot{grid-column:span 6;min-width:0}\n.case-fruehschicht .cb-shot:nth-child(2){grid-column:span 5;margin-top:25%}\n.case-fruehschicht .cb-shot:nth-child(1){grid-column:span 7}\n.case-fruehschicht .cb-shot:nth-child(3){grid-column:span 5;margin-top:16%}\n.case-fruehschicht .cb-shot:nth-child(4){grid-column:span 7}\n.case-fruehschicht .cb-shot:nth-child(5){grid-column:3/span 8}\n.case-fruehschicht .cb-shot-frame{position:relative;overflow:hidden;background:#e7dccb;aspect-ratio:4/5}\n.case-fruehschicht .cb-shot:nth-child(1) .cb-shot-frame,.case-fruehschicht .cb-shot:nth-child(4) .cb-shot-frame{aspect-ratio:5/4}\n.case-fruehschicht .cb-shot:nth-child(5) .cb-shot-frame{aspect-ratio:16/10}\n.case-fruehschicht .cb-shot-frame img{transition:transform .65s cubic-bezier(.2,.7,.1,1)}\n.case-fruehschicht .cb-shot:hover img{transform:scale(1.055)}\n.case-fruehschicht .cb-shot-meta{display:flex;justify-content:space-between;gap:14px;padding-top:16px;border-top:1px solid #bfb3a3;margin-top:15px;align-items:baseline}\n.case-fruehschicht .cb-shot-meta strong{font-size:clamp(19px,2.3vw,31px);letter-spacing:-.04em}\n.case-fruehschicht .cb-shot-meta span{font-size:12px;text-align:right;max-width:200px}\n.case-fruehschicht .cb-values{background:var(--wine);color:var(--butter);padding:clamp(80px,10vw,145px) clamp(22px,6vw,100px)}\n.case-fruehschicht .cb-values h2{font-size:clamp(70px,13vw,210px);max-width:1200px}\n.case-fruehschicht .cb-values p{margin-top:40px;max-width:650px;font-size:clamp(18px,2.3vw,28px);line-height:1.3}\n.case-fruehschicht .cb-palette{display:grid;grid-template-columns:repeat(4,1fr);margin-top:70px;gap:8px}\n.case-fruehschicht .cb-swatch{min-height:150px;display:flex;align-items:end;padding:15px;font-size:12px}\n.case-fruehschicht .cb-end{background:var(--deep);color:var(--cream);padding:clamp(90px,12vw,180px) clamp(22px,7vw,110px)}\n.case-fruehschicht .cb-end h2{font-size:clamp(55px,10vw,150px);max-width:1200px;color:var(--butter)}\n.case-fruehschicht .cb-end p{max-width:700px;font-size:clamp(18px,2vw,24px);line-height:1.45;margin-top:36px}\n.case-fruehschicht .cb-end a{display:inline-block;margin-top:45px;padding:19px 30px;border-radius:50px;background:var(--butter);color:var(--deep);text-decoration:none;font-weight:800;transition:transform .2s}\n.case-fruehschicht .cb-end a:hover{transform:translateY(-4px)}\n.case-fruehschicht .cb-footer{background:#300913;color:#d3bfb7;display:flex;justify-content:space-between;gap:25px;align-items:center;padding:28px clamp(22px,7vw,110px);font-size:12px}\n.case-fruehschicht .cb-footer button{background:none;border:1px solid #d3bfb7;color:inherit;padding:12px 15px;cursor:pointer}\n@keyframes cb-rise{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}\n@keyframes cb-zoom{from{transform:scale(1.06)}to{transform:scale(1)}}\n@keyframes cb-marquee{to{transform:translateX(-50%)}}\n@media(max-width:800px){\n.case-fruehschicht .cb-hero{min-height:80svh}\n.case-fruehschicht .cb-hero-title{font-size:clamp(46px,13.8vw,110px);letter-spacing:-.075em}\n.case-fruehschicht .cb-hero-bottom a{width:54px;height:54px}\n.case-fruehschicht .cb-story{grid-template-columns:1fr}\n.case-fruehschicht .cb-story-copy{padding-top:0}\n.case-fruehschicht .cb-feature{grid-template-columns:1fr;display:flex;flex-direction:column}\n.case-fruehschicht .cb-feature-copy{min-height:350px}\n.case-fruehschicht .cb-feature-photo{height:450px}\n.case-fruehschicht .cb-stamp{left:auto;right:20px;top:calc(350px - 70px);width:140px;height:140px}\n.case-fruehschicht .cb-chapter-head{display:block}\n.case-fruehschicht .cb-chapter-head p{margin-top:24px}\n.case-fruehschicht .cb-showcase{grid-template-columns:repeat(2,minmax(0,1fr));gap:36px 12px}\n.case-fruehschicht .cb-shot,.case-fruehschicht .cb-shot:nth-child(1),.case-fruehschicht .cb-shot:nth-child(2),.case-fruehschicht .cb-shot:nth-child(3),.case-fruehschicht .cb-shot:nth-child(4),.case-fruehschicht .cb-shot:nth-child(5){grid-column:span 1;margin-top:0}\n.case-fruehschicht .cb-shot:nth-child(1),.case-fruehschicht .cb-shot:nth-child(5){grid-column:span 2}\n.case-fruehschicht .cb-shot-frame,.case-fruehschicht .cb-shot:nth-child(1) .cb-shot-frame,.case-fruehschicht .cb-shot:nth-child(4) .cb-shot-frame,.case-fruehschicht .cb-shot:nth-child(5) .cb-shot-frame{aspect-ratio:4/5}\n.case-fruehschicht .cb-shot:nth-child(1) .cb-shot-frame,.case-fruehschicht .cb-shot:nth-child(5) .cb-shot-frame{aspect-ratio:5/4}\n.case-fruehschicht .cb-shot-meta{display:block}\n.case-fruehschicht .cb-shot-meta span{display:block;text-align:left;margin-top:6px}\n.case-fruehschicht .cb-palette{grid-template-columns:repeat(2,1fr)}\n.case-fruehschicht .cb-footer{display:block}\n.case-fruehschicht .cb-footer button{margin-top:20px}\n}\n@media(max-width:390px){.case-fruehschicht .cb-hero-title{font-size:13.3vw}.case-fruehschicht .cb-topline{font-size:9px}.case-fruehschicht .cb-hero-bottom p{font-size:18px}}\n@media(prefers-reduced-motion:reduce){.case-fruehschicht *{animation:none!important;transition:none!important}}\n\n/* Mobile fixes: safe typography, no overlapping sticker, no clipped section copy */\n.case-fruehschicht .cb-feature{min-height:0}\n.case-fruehschicht .cb-feature-copy{min-width:0}\n.case-fruehschicht .cb-feature-copy p{max-width:100%}\n.case-fruehschicht .cb-feature h2{overflow-wrap:normal}\n.case-fruehschicht .cb-hero{padding-top:70px}\n.case-fruehschicht .cb-hero-title{max-width:100%}\n@media(max-width:800px){\n.case-fruehschicht .cb-feature-copy{min-height:0;padding:76px 24px 85px;gap:28px}\n.case-fruehschicht .cb-feature h2{font-size:clamp(48px,12.6vw,90px);line-height:.98}\n.case-fruehschicht .cb-feature-copy p{font-size:clamp(16px,4.6vw,21px);line-height:1.42;max-width:30ch;padding-right:0}\n.case-fruehschicht .cb-stamp{width:110px;height:110px;font-size:12px;right:16px;top:auto;bottom:calc(450px - 45px)}\n.case-fruehschicht .cb-feature-photo{height:450px}\n.case-fruehschicht .cb-topline{flex-wrap:wrap}\n.case-fruehschicht .cb-hero-title{font-size:clamp(44px,12.9vw,100px)}\n}\n@media(max-width:420px){.case-fruehschicht .cb-feature-copy{padding-top:65px;padding-bottom:70px}.case-fruehschicht .cb-feature h2{font-size:clamp(45px,12vw,58px)}.case-fruehschicht .cb-hero-title{font-size:12.5vw}}\n\n/* Cover v3: same editorial hierarchy as Gluten Fry, but own bakery identity */\n.case-fruehschicht .cb-hero{min-height:0;padding-top:0;display:block;background:#151515;color:#F4EEE3;overflow:visible}\n.case-fruehschicht .cb-hero:after{display:none}\n.case-fruehschicht .cb-hero-photo{position:relative;inset:auto;height:clamp(390px,57vw,780px);z-index:auto}\n.case-fruehschicht .cb-hero-photo img{filter:none;object-position:center 58%}\n.case-fruehschicht .cb-topline{padding:clamp(26px,4vw,55px) clamp(22px,5vw,80px) 12px;color:#B9E5D4}\n.case-fruehschicht .cb-topline span:last-child{border-color:#444;color:#F4EEE3}\n.case-fruehschicht .cb-hero-inner{margin:0;padding:clamp(38px,5vw,80px) clamp(22px,5vw,80px) clamp(40px,6vw,85px)}\n.case-fruehschicht .cb-hero-title{font-size:clamp(58px,12vw,180px);white-space:normal;overflow-wrap:normal;word-break:normal;line-height:1.05;letter-spacing:-.065em;color:#F1E2BF;text-shadow:none}\n.case-fruehschicht .cb-hero-bottom{margin-top:clamp(22px,3vw,45px)}\n.case-fruehschicht .cb-hero-bottom p{font-size:clamp(18px,2.1vw,28px);max-width:640px}\n.case-fruehschicht .cb-hero-bottom a{width:56px;height:56px}\n.case-fruehschicht .cb-hero-kicker{display:flex;justify-content:space-between;align-items:center;gap:20px;border-top:1px solid #444;padding-top:20px;margin-top:25px;color:#bcb9af}\n.case-fruehschicht .cb-hero-photo-label{position:absolute;left:clamp(22px,5vw,80px);bottom:25px;background:#F1E2BF;color:#7B1528;padding:10px 17px;font-weight:800;letter-spacing:.07em;font-size:11px}\n@media(max-width:800px){\n.case-fruehschicht .cb-hero{min-height:0}\n.case-fruehschicht .cb-hero-inner{padding:30px 22px 38px}\n.case-fruehschicht .cb-hero-title{font-size:clamp(48px,12.2vw,92px);line-height:1.05}\n.case-fruehschicht .cb-hero-photo{height:clamp(340px,110vw,560px)}\n.case-fruehschicht .cb-hero-bottom{align-items:center}\n.case-fruehschicht .cb-hero-bottom p{font-size:17px;line-height:1.3}\n.case-fruehschicht .cb-topline{padding:24px 22px 10px}\n}\n"}</style>
    <header className="cb-hero">
      <div className="cb-topline cb-mono"><span>Case Study / Brand Design / 2026</span><span>Independent Concept</span></div>
      <div className="cb-hero-inner">
        <div className="cb-mono" style={{marginBottom:22,color:"#B9E5D4"}}>01 — Naming · Branding · Packaging · Interior</div>
        <h1 className="cb-display cb-hero-title">Frühschicht.</h1>
        <div className="cb-hero-bottom"><p>Eine Bäckerei für das Ruhrgebiet, die da anfängt, wo hier früher jeder Tag anfing: in der Frühschicht.</p><a href="#cb-story" aria-label="Zum Konzept scrollen">↓</a></div>
        <div className="cb-hero-kicker cb-mono"><span>Ruhrgebiet / Konzept / Visualisierung</span><span>Scroll to explore ↓</span></div>
      </div>
      <div className="cb-hero-photo"><img src="/fruehschicht/01-storefront.jpg" alt="Frühschicht Bäckerei – Storefront Branding" fetchPriority="high"/><span className="cb-hero-photo-label">A NEW KIND OF BAKERY ↗</span></div>
    </header>
    <div className="cb-ticker" aria-label="Fresh bread. Early mornings. Ruhrgebiet."><div className="cb-ticker-track">{Array.from({length:4},(_,i)=><span key={i}>FRESH BREAD ✳ EARLY MORNINGS ✳ RUHRGEBIET ✳ GOOD STUFF ✳ </span>)}</div></div>
    <section className="cb-story" id="cb-story">
      <div><div className="cb-mono">01 — The story / Die Idee</div><h2 className="cb-display">Morgens.<br/>Malochen.<br/>Machen.</h2></div>
      <div className="cb-story-copy"><p>Wer früh anfängt, macht das Beste draus. Frühschicht ist eine Bäckerei-Marke mit Ruhrgebiets-DNA. Inspiriert von den Menschen, die früh aufstehen, anpacken und ihre Arbeit ernst nehmen.</p><p>Ich habe selbst fast zehn Jahre unter Tage gearbeitet, bevor ich in die Gestaltung gewechselt bin. Diese Geschichte steckt im Namen – nicht als Zechen-Kitsch, sondern als Haltung.</p><div className="cb-note cb-mono"><span>Naming · Identity · Packaging · Interior</span><span>Ruhrgebiet / 2026</span></div></div>
    </section>
    <section className="cb-feature">
      <div className="cb-feature-copy"><div className="cb-mono">02 — A place to stay</div><h2 className="cb-display">Nicht nur<br/>Brot.<br/>Gefühl.</h2><p>Warmes Licht, ehrliche Materialien und eine Marke, die man sofort wiedererkennt. Kein Zechenmuseum. Eine Bäckerei von heute.</p></div>
      <div className="cb-feature-photo"><img src="/fruehschicht/02-interior.jpg" loading="lazy" alt="Frühschicht Interior-Konzept"/></div>
      <div className="cb-stamp">GOOD<br/>MORNINGS<br/>ONLY ✳</div>
    </section>
    <section className="cb-statement"><div className="cb-mono">Our philosophy / Unsere Haltung</div><h2 className="cb-display">Kein Zechen-Kitsch.<br/>Nur Charakter.</h2><p>Warm. Laut. Ehrlich. Eine Marke, die ihre Herkunft kennt, aber nicht in der Vergangenheit lebt.</p></section>
    <section className="cb-chapter">
      <div className="cb-chapter-head"><div><div className="cb-mono">03 — Made to be remembered</div><h2 className="cb-display">Eine Marke.<br/>Jeden Morgen.</h2></div><p>Vom ersten Kaffee bis zur letzten Krume: ein konsistenter Auftritt über alle Touchpoints.</p></div>
      <div className="cb-showcase">{gallery.map((item,i)=><figure className="cb-shot" key={item.src}><div className="cb-shot-frame"><img src={item.src} alt={item.title+" – Frühschicht Markenanwendung"} loading="lazy"/></div><figcaption className="cb-shot-meta"><strong>{item.title}</strong><span>{item.caption}</span></figcaption></figure>)}</div>
    </section>
    <section className="cb-values"><div className="cb-mono">04 — Brand ingredients</div><h2 className="cb-display">Warm.<br/>Laut.<br/>Ehrlich.</h2><p>Schichtrot, Butter, Mehl und Edelstahl. Eine visuelle Sprache zwischen Bäckerei-Kultur und urbanem Ruhrgebiet.</p><div className="cb-palette"><div className="cb-swatch" style={{background:"#7B1528",border:"1px solid #b55a6c"}}>Schichtrot / #7B1528</div><div className="cb-swatch" style={{background:"#F1E2BF",color:"#221b19"}}>Butter / #F1E2BF</div><div className="cb-swatch" style={{background:"#F4EEE3",color:"#221b19"}}>Mehl / #F4EEE3</div><div className="cb-swatch" style={{background:"linear-gradient(135deg,#a2a6a7,#e3e4e1,#7c8183)",color:"#221b19"}}>Edelstahl / Metallic</div></div></section>
    <section className="cb-end"><div className="cb-mono">05 — Let's make something good</div><h2 className="cb-display">Hungrig auf<br/>mehr?</h2><p>Frühschicht ist ein selbstinitiiertes Konzeptprojekt. Wenn ihr einen Laden, Verein oder ein Produkt habt, das mehr Charakter verdient – lasst uns reden.</p><a href="mailto:philipspiekermann@hotmail.com?subject=Fr%C3%BChschicht%20%2F%20Projektanfrage">Projekt anfragen ↗</a></section>
    <footer className="cb-footer"><span>Selbstinitiiertes Konzept · 2026 — Konzept, Naming & Design: Philgood Media · Visualisierungen KI-gestützt erstellt</span><button onClick={()=>onNavigate("home")}>← Alle Projekte</button></footer>
  </article>;
}

export default function Portfolio() {
  const [currentPage,      setCurrentPage]      = useState(pageFromLocation);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigationTimer = useRef(null);
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
    setMenuOpen(false);
    clearTimeout(navigationTimer.current);
    setTransitioning(true);
    navigationTimer.current = setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "instant" });
      
      // Nur einen neuen Verlaufseintrag pushen, wenn wir NICHT via Browser-Zurück navigieren
      if (!isPopState) {
        const url = page === "home" ? "/" : `/#${page}`;
        window.history.pushState({ page }, "", url);
      }
      
      requestAnimationFrame(() => requestAnimationFrame(() => { setTransitioning(false); document.getElementById("main-content")?.focus({ preventScroll:true }); }));
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 250);
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  useEffect(() => () => clearTimeout(navigationTimer.current), []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => { if (e.key === "Escape") { setMenuOpen(false); document.querySelector(".menu-toggle")?.focus(); } };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  // Event Listener für den Zurück-Button des Browsers (popstate)
  useEffect(() => {
    const handlePopState = (event) => {
      const targetPage = pageFromLocation();
      navigateTo(targetPage, true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    // Initialen Verlaufseintrag für die Startseite setzen, falls noch keiner existiert
    if (!window.history.state) {
      window.history.replaceState({ page: pageFromLocation() }, "", window.location.href);
    }

    const move = (e) => {
      if (cursorDot.current)  { cursorDot.current.style.left  = e.clientX+"px"; cursorDot.current.style.top  = e.clientY+"px"; }
      if (cursorRing.current) { cursorRing.current.style.left = e.clientX+"px"; cursorRing.current.style.top = e.clientY+"px"; }
      if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
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
      setScrollProgress(max > 0 ? Math.min(1, y/max) : 0); setScrolled(y>60);
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

  const marqueeItems = PROJECTS.map(project => project.title);
  const cursorClass = "cursor-ring" + (hovering && !draggingMarquee ? " hovering" : "") + (draggingMarquee ? " grabbing" : "");

  return (
    <div className="portfolio-root">
      <style>{styles}</style>
      <a className="skip-link" href="#main-content">Zum Inhalt</a>
      <div ref={cursorDot} className="cursor-dot" />
      <div ref={cursorRing} className={cursorClass} />
      <div className="scroll-progress">
        <div className="scroll-progress-bar" style={{ transform:"scaleX("+scrollProgress+")" }} />
      </div>

      <nav className={"nav" + (scrolled ? " scrolled" : "")}>
        <button className="nav-logo" aria-label="Philgood Media – Startseite" onClick={() => navigateTo("home")}>PS<span className="logo-name">philgoodmedia.</span></button>
        {(currentPage !== "home") ? (
          <button className="nav-back" onClick={() => navigateTo("home")}><span className="nav-back-arrow">←</span> Alle Projekte</button>
        ) : (
          <>
            <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(v => !v)}>{menuOpen ? "Schließen ×" : "Menü +"}</button>
            <div id="main-navigation" className={"nav-links" + (menuOpen ? " open" : "")}>
              {[["work","Projekte"],["posters","Poster"],["about","Über mich"],["skills","Leistungen"],["contact","Kontakt ↗"]].map(([s,label]) => (
                <button key={s} className={"nav-link"+(activeSection===s?" active":"")} onClick={() => scrollTo(s)}>{label}</button>
              ))}
            </div>
          </>
        )}
      </nav>

      <main id="main-content" tabIndex={-1} style={{ opacity:transitioning?0:1, transform:transitioning?"translateY(22px)":"none", transition:"opacity 0.42s ease,transform 0.42s ease" }}>
        {PROJECTS.find(project => project.page === currentPage)?.images ? (
          <ProjectPage key={currentPage} project={PROJECTS.find(project => project.page === currentPage)} onNavigate={navigateTo}/>
        ) : currentPage === "fruehschicht" ? (
          <FruehschichtPage onNavigate={navigateTo} />
        ) : currentPage === "glutenfry" ? (
          <GlutenfryPage onBack={() => navigateTo("home")} onNavigate={navigateTo} />
        ) : (
          <>
            <section id="hero" className="hero">
              <div ref={parallaxBg} className="hero-bg-text">PHILGOOD.</div>
              
              <div className="hero-left">
                <div ref={heroLeftRef} style={{ transition:"transform 0.18s ease-out" }}>
                  <div className="hero-tag">INDEPENDENT CREATIVE STUDIO · RUHRGEBIET</div>
                  <h1 className="hero-name">DESIGN,<br/><span>DAS WIRKT.</span></h1>
                  <Typewriter />
                  <p className="hero-desc">Für Restaurants, Marken und Sportvereine. Visuelle Identitäten, Rebranding und Kampagnen, die Menschen erreichen.</p>
                  
                  <div className="hero-cta">
                    <button className="btn-primary" onClick={() => scrollTo("work")}>Arbeiten ansehen ↓</button>
                    <button className="btn-outline" onClick={() => scrollTo("contact")}>Lass uns sprechen ↗</button>
                  </div>
                </div>
              </div>
              <div className="pg-focus-grid"><div><small>01 / GASTRO</small><strong>GASTRO</strong><p>Branding, Speisekarten, Interior und Social Media.</p></div><div><small>02 / MARKEN</small><strong>BRANDING</strong><p>Identitäten, Rebranding, Kampagnen und Designsysteme.</p></div><div><small>03 / VEREINE</small><strong>SPORT</strong><p>Social Media, Vereinsmarketing und Anzeigen.</p></div></div>
            </section>


            <section id="work" className="section">
              <div className="work-heading">
                <div><div className="section-label">01 / Ausgewählte Arbeiten</div><h2 className="section-title">DESIGN, DAS<br />ETWAS BEWEGT.</h2></div>
                <p className="work-intro">Branding, Rebranding und Kampagnen. Konzipiert mit Haltung, gestaltet mit Charakter.</p>
              </div>
              <div className="project-grid">
                {PROJECTS.map((project,i) => <a key={project.page} className="project-link" href={"/#"+project.page} onClick={e => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault(); navigateTo(project.page);
                }}>
                  <div className={"project-visual"+(["volksbank","vonovia","salzburg"].includes(project.page) ? " bank" : "")+(project.cutout ? " cutout" : "")+(project.page==="fruehschicht" ? " fs-project-visual" : "")}>{project.page==="fruehschicht" ? <><img src="/fruehschicht/01-storefront.jpg" alt="Frühschicht – Bäckerei Branding Konzept" loading="lazy" className="fs-cover-photo"/><span className="fs-cover-shade" aria-hidden="true"/><span className="fs-cover-overline">BRAND IDENTITY / 2026</span><span className="fs-cover-wordmark">Frühschicht.</span><span className="fs-cover-foot">BROT. BUTTER. REVIER. ↗</span></> : <img src={project.img} alt={project.title+" – "+project.description} loading="lazy" />}<span className="project-open" aria-hidden="true">↗</span></div>
                  <div className="project-meta"><div><h3>{project.title}</h3><p>{project.category}</p><p>{project.description}</p></div><span className="project-index">0{i+1}</span></div>
                </a>)}
              </div>

            </section>

            <PosterGallery />

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

            <section id="skills">
              <div className="section">
                <FadeIn><div className="section-label">Kompetenzen</div><h2 className="section-title">SKILLS</h2></FadeIn>
                <div className="skills-grid">
                  {[
                    {icon:"01 /", title:"Design", items:["Brand Design","Kampagnen","Print & OOH","Social Media","Packaging"]},
                    {icon:"02 /", title:"Tools",   items:["Photoshop","InDesign","Illustrator","Canva"]},
                    {icon:"03 /", title:"KI",      items:["Bild-Prompting","Layout-Konzepte","KI-Workflows"]},
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
                    <h2 className="contact-heading">GUTES BEGINNT<br />MIT EINEM HALLO.</h2>
                    <p style={{ fontSize:17, color:BLACK, maxWidth:440, lineHeight:1.7 }}>Eine neue Marke, eine Kampagne oder eine erste Idee? Erzähl mir, was du vorhast.</p>
                    <div className="contact-links">
                      <a href="mailto:philipspiekermann@hotmail.com?subject=Projektanfrage" className="btn-primary">Projekt anfragen ↗</a>
                      <a href="https://www.linkedin.com/in/philip-spiekermann-450403205/" target="_blank" rel="noreferrer" className="btn-outline">LinkedIn</a>
                      <a href="https://www.behance.net/philsez" target="_blank" rel="noreferrer" className="btn-outline">Mehr auf Behance ↗</a>
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
      </main>
    </div>
  );
}
