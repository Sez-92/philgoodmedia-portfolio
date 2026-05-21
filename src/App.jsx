import { useState, useEffect, useRef } from "react";
import philipPhoto from "/philip.png";

const LIME = "#D4ED2A";
const BLACK = "#111111";
const WHITE = "#F5F5F0";
const GRAY = "#888880";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Karla:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: ${BLACK}; color: ${WHITE}; font-family: 'Karla', sans-serif; overflow-x: hidden; }

  .portfolio-root { background: ${BLACK}; min-height: 100vh; color: ${WHITE}; font-family: 'Karla', sans-serif; }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 20px 40px;
    background: rgba(17,17,17,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 3px; color: ${LIME}; cursor: pointer; }
  .nav-links { display: flex; gap: 32px; }
  .nav-link {
    font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 2px;
    text-transform: uppercase; color: ${GRAY}; cursor: pointer;
    transition: color 0.3s; background: none; border: none; padding: 0;
  }
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
  }
  .hero-left { position: relative; z-index: 1; }
  .hero-tag {
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: 3px; text-transform: uppercase; color: ${LIME};
    margin-bottom: 24px; display: flex; align-items: center; gap: 12px;
  }
  .hero-tag::before { content: ''; display: block; width: 40px; height: 1px; background: ${LIME}; }
  .hero-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(64px, 9vw, 140px);
    line-height: 0.88; letter-spacing: -2px; color: ${WHITE}; margin-bottom: 32px;
  }
  .hero-name span { color: ${LIME}; }
  .hero-desc {
    font-size: 15px; line-height: 1.8; color: ${GRAY}; max-width: 400px;
    font-weight: 300; margin-bottom: 40px;
  }
  .hero-cta { display: flex; gap: 16px; flex-wrap: wrap; }

  /* Photo side */
  .hero-right { position: relative; display: flex; justify-content: center; align-items: center; }
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
    transition: transform 0.4s;
  }
  .photo-frame:hover::before { transform: rotate(0deg); opacity: 0.6; }
  .photo-frame::after {
    content: '';
    position: absolute;
    bottom: -20px; right: -20px;
    width: 80px; height: 80px;
    background: ${LIME};
    z-index: 0;
  }
  .hero-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
    position: relative;
    z-index: 1;
    filter: grayscale(100%) contrast(1.1);
  }
  .photo-label {
    position: absolute;
    bottom: -36px; left: 0;
    font-family: 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${GRAY};
  }

  .scroll-hint {
    position: absolute; bottom: 32px; left: 40px;
    display: flex; align-items: center; gap: 12px;
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

  .btn-primary {
    background: ${LIME}; color: ${BLACK};
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 14px 28px; border: none; cursor: pointer;
    transition: all 0.25s; font-weight: 700;
    text-decoration: none; display: inline-block;
  }
  .btn-primary:hover { background: ${WHITE}; transform: translateY(-2px); }
  .btn-outline {
    background: transparent; color: ${WHITE};
    font-family: 'Space Mono', monospace; font-size: 11px;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 13px 28px; border: 1px solid rgba(255,255,255,0.25);
    cursor: pointer; transition: all 0.25s;
    text-decoration: none; display: inline-block;
  }
  .btn-outline:hover { border-color: ${LIME}; color: ${LIME}; transform: translateY(-2px); }

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
  .stat-box { border-left: 2px solid ${LIME}; padding-left: 20px; }
  .stat-number { font-family: 'Bebas Neue', sans-serif; font-size: 52px; color: ${WHITE}; line-height: 1; }
  .stat-label { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: ${GRAY}; margin-top: 4px; }
  .interests { margin-top: 40px; display: flex; flex-wrap: wrap; gap: 10px; }
  .interest-tag {
    border: 1px solid rgba(255,255,255,0.15); padding: 6px 14px;
    font-family: 'Space Mono', monospace; font-size: 10px;
    letter-spacing: 1.5px; text-transform: uppercase; color: ${GRAY};
    transition: all 0.25s; cursor: default;
  }
  .interest-tag:hover { border-color: ${LIME}; color: ${LIME}; }

  /* EXPERIENCE */
  .exp-item {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 48px 0;
    display: grid; grid-template-columns: 200px 1fr; gap: 40px;
  }
  .exp-company { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: ${LIME}; letter-spacing: 1px; margin-bottom: 6px; }
  .exp-period { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 2px; color: ${GRAY}; }
  .exp-bullets { list-style: none; }
  .exp-bullets li {
    font-size: 15px; line-height: 1.7; color: #BBBBB5; font-weight: 300;
    padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
    display: flex; gap: 12px;
  }
  .exp-bullets li::before { content: '→'; color: ${LIME}; flex-shrink: 0; }

  /* SKILLS */
  .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
  .skill-card { background: rgba(255,255,255,0.03); padding: 36px 30px; transition: background 0.3s; cursor: default; }
  .skill-card:hover { background: rgba(212,237,42,0.06); }
  .skill-card-icon { font-size: 28px; margin-bottom: 20px; }
  .skill-card-title { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 1px; color: ${WHITE}; margin-bottom: 20px; }
  .skill-list { list-style: none; }
  .skill-list li {
    font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 1px;
    color: ${GRAY}; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; gap: 8px;
  }
  .skill-list li::before { content: '·'; color: ${LIME}; font-size: 18px; line-height: 0; }

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
  }
  .contact-tagline { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: ${LIME}; margin-bottom: 24px; }
  .contact-heading { font-family: 'Bebas Neue', sans-serif; font-size: clamp(48px, 6vw, 90px); line-height: 0.95; margin-bottom: 40px; }
  .contact-links { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin-top: 48px; }
  .contact-info { font-family: 'Space Mono', monospace; font-size: 12px; color: ${GRAY}; letter-spacing: 1px; margin-top: 32px; }
  .contact-info a { color: ${GRAY}; text-decoration: none; }
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
    .hero { grid-template-columns: 1fr; padding: 100px 20px 60px; }
    .hero-right { order: -1; }
    .photo-frame { width: clamp(200px, 60vw, 320px); }
    .nav { padding: 16px 20px; }
    .nav-links { display: none; }
    .section { padding: 70px 20px; }
    .about-grid { grid-template-columns: 1fr; }
    .exp-item { grid-template-columns: 1fr; gap: 16px; }
    .skills-grid { grid-template-columns: 1fr; }
    .contact-wrapper { padding: 48px 24px; }
    .footer { flex-direction: column; gap: 12px; text-align: center; }
  }
`;

function useIntersection(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} className={`fade-in${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

const sections = ["hero", "about", "experience", "skills", "contact"];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("hero");

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const handleScroll = () => {
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

  return (
    <div className="portfolio-root">
      <style>{styles}</style>

      <nav className="nav">
        <div className="nav-logo" onClick={() => scrollTo("hero")}>PS</div>
        <div className="nav-links">
          {["about","experience","skills","contact"].map(s => (
            <button key={s} className={`nav-link${activeSection === s ? " active" : ""}`} onClick={() => scrollTo(s)}>
              {s}
            </button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-bg-text">ART DIRECTOR</div>

        <div className="hero-left">
          <div className="hero-tag">Art Director · Print · Digital</div>
          <h1 className="hero-name">PHILIP<br /><span>SPIEKERMANN</span></h1>
          <p className="hero-desc">
            Kreativität trifft Haltung. Ich gestalte Markenauftritte,
            die hängenbleiben – von der Idee bis zur finalen Umsetzung.
            Ruhrgebiet im Herzen, Medien im Blut.
          </p>
          <div className="hero-cta">
            <a href="https://www.behance.net/philsez" target="_blank" rel="noreferrer" className="btn-primary">
              Portfolio ansehen
            </a>
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

      <div className="full-divider" />

      {/* ABOUT */}
      <section id="about">
        <div className="section">
          <FadeIn>
            <div className="section-label">Über mich</div>
            <h2 className="section-title">PERSÖN<br />LICH</h2>
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
                <div className="stat-box"><div className="stat-number">2+</div><div className="stat-label">Jahre Erfahrung</div></div>
                <div className="stat-box"><div className="stat-number">3</div><div className="stat-label">Tool-Suiten</div></div>
                <div className="stat-box"><div className="stat-number">4+</div><div className="stat-label">Große Kunden</div></div>
                <div className="stat-box"><div className="stat-number">∞</div><div className="stat-label">Kreative Ideen</div></div>
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
            <h2 className="section-title">ERFAH<br />RUNG</h2>
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
                  <div className="skill-card-icon">{card.icon}</div>
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
