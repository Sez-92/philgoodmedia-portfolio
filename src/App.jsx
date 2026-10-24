import { useEffect, useRef, useState } from 'react';
import './style.css';
import PosterGallery from './PosterGallery.jsx';

const projects = [
  {id:'fruehschicht',name:'Frühschicht',category:'Branding · Packaging · Interior',intro:'Brot. Butter. Revier.',description:'Eine Bäckerei-Marke mit Ruhrgebiets-DNA. Die Idee verbindet die traditionelle Frühschicht im Revier mit dem Duft frischer Backwaren.',note:'Freies Konzeptprojekt',color:'#701d2e',images:[['/fruehschicht/01-storefront.jpg','Ein Auftritt mit Charakter.'],['/fruehschicht/02-interior.jpg','Die Marke im Raum.'],['/fruehschicht/03-cups.jpg','Identität zum Mitnehmen.'],['/fruehschicht/04-bag.jpg','Schichtrot trifft Mehlweiß.'],['/fruehschicht/05-box.jpg','Bis ins letzte Detail.']]},
  {id:'glutenfry',name:'Glutenfry',category:'Brand Design · Packaging · Print',intro:'Null Weizen. Voller Charakter.',description:'Glutenfreies Soul Food mit einem mutigen visuellen Auftritt. Ein verspieltes Maskottchen, satte Farben und eine Identität, die vom Logo bis zur Verpackung zusammenhält.',color:'#9c274e',images:[['/gf_brand.png','Die Markenwelt.'],['/gf_logo.png','Das Gesicht der Marke.'],['/gf_bag.png','Packaging mit Haltung.'],['/gf_flyer.png','Appetit auf gutes Design.'],['/gf_result.png','Eine Idee. Viele Möglichkeiten.']]},
];
const posters = [
  {title:'Head in the Clouds',category:'Poster · Typografie & Collage',src:'/posters/head-in-the-clouds.webp',thumbnail:'/posters/head-in-the-clouds-thumb.webp',thumbnailWidth:566,width:1414},
  {title:'Rarámuri',category:'Sport · Posterdesign',src:'/posters/ramuri.webp',thumbnail:'/posters/ramuri-thumb.webp',thumbnailWidth:450,width:1080},
  {title:'Bootshaus — Pfingst Festival',category:'Event · Artwork',src:'/posters/pfingsten-bootshaus.webp',thumbnail:'/posters/pfingsten-bootshaus-thumb.webp',thumbnailWidth:450,width:1080},
  {title:'Shiro & Sansa — Halloween',category:'Illustration · Eventmotiv',src:'/posters/sans-shiro-halloween.webp',thumbnail:'/posters/sans-shiro-halloween-thumb.webp',thumbnailWidth:800,width:1800},
  {title:'CHILL no. 1',category:'Editorial · Covergestaltung',src:'/posters/chill.webp',thumbnail:'/posters/chill-thumb.webp',thumbnailWidth:564,width:1410},
  {title:'Cali Couture — Anime',category:'Typografie & Illustration',src:'/posters/cali-anime.webp'},
  {title:'Heute schon Schwein gehabt?',category:'Gesellschaft & Gestaltung',src:'/posters/schwein-gehabt.webp'},
  {title:'Her Art, Her Voice',category:'Museum · Plakatserie',src:'/posters/her-art-her-voice.webp'},
];
const services = [
  {title:'Gastronomie',number:'01',text:'Für Restaurants, Cafés und Food-Konzepte: ein Auftritt, der schon vor dem ersten Bissen Lust macht.',tags:'Logo & Identität / Speisekarten / Packaging / Social Design / Raumgrafik'},
  {title:'Sport & Vereine',number:'02',text:'Für Vereine und Sportmarken: Gestaltung, die Teamgeist sichtbar macht und Menschen zusammenbringt.',tags:'Vereinsbranding / Merchandise / Kampagnen / Sponsoring / Social Media'},
  {title:'Marken & Messe',number:'03',text:'Für Unternehmen mit etwas zu sagen: eine klare Identität, die auf Papier, im Web und im Raum funktioniert.',tags:'Corporate Design / Brand Design / Messedesign / Print & Digital'},
];
const email = 'mailto:philipspiekermann@hotmail.com?subject=Projektanfrage';

function readRoute(){ const id=window.location.hash.slice(1); return projects.some(p=>p.id===id)?id:'home'; }
function Modal({children,label,onClose}){
  const dialog=useRef(null);
  useEffect(()=>{
    const prior=document.activeElement;
    dialog.current.showModal();
    const overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow=overflow;prior?.focus();};
  },[]);
  return <dialog ref={dialog} className="modal" aria-label={label} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="modal-inner"><button className="pill modal-close" autoFocus onClick={onClose}>Schließen ×</button>{children}</div>
  </dialog>;
}
function Contact(){return <section className="contact" id="kontakt" aria-labelledby="contact-title">
  <div className="section-top"><span>Der nächste gute Anfang.</span><span>Kontakt ↘</span></div>
  <h2 id="contact-title"><a href={email}>Hallo.<span aria-hidden="true">↗</span></a></h2>
  <div className="contact-bottom"><p>Eine neue Marke, ein Restaurant,<br/>ein Verein oder eine erste Idee?</p><a href={email}>Erzähl mir davon ↗</a></div>
</section>;}
function Footer(){return <footer><a className="brand-link brand-footer" href="#" aria-label="Philgood Media — Startseite"><img src="/brand/pg-horizontal.svg" alt="Philgood Media" width="1078" height="240" loading="lazy"/></a><span>Philip Spiekermann · Recklinghausen</span><div><a href="https://www.linkedin.com/in/philip-spiekermann-450403205/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://www.behance.net/philsez" target="_blank" rel="noreferrer">Behance ↗</a><a href="mailto:philipspiekermann@hotmail.com">E-Mail ↗</a></div><span>© {new Date().getFullYear()}</span></footer>;}
function CaseStudy({project,onImage}){
 return <article className={'case case-'+project.id}>
   <header className="case-heading"><a className="text-link" href="#arbeiten">← Alle Arbeiten</a><div className="case-heading-top"><span>{project.category}</span>{project.note&&<span>{project.note}</span>}</div><h1>{project.name}</h1><p>{project.intro}</p></header>
   <div className="case-description"><span>Idee & Gestaltung</span><p>{project.description}</p></div>
   <div className="case-gallery">{project.images.map(([src,caption],i)=><figure key={src} className={i===0?'case-wide':''}><button className={'case-image'+(src==='/gf_logo.png'||src==='/gf_result.png'?' cutout':'')} onClick={()=>onImage({src,title:project.name+' — '+caption})} aria-label={caption+' Vergrößern'}><img src={src} alt={project.name+' — '+caption} loading={i===0?'eager':'lazy'}/><span aria-hidden="true">↗</span></button><figcaption><span>0{i+1}</span>{caption}</figcaption></figure>)}</div>
   <a className="next-case" href={'#'+projects.find(p=>p.id!==project.id).id}><span>Nächstes Projekt ↗</span><strong>{projects.find(p=>p.id!==project.id).name}</strong></a>
 </article>;
}
export default function App(){
 const [route,setRoute]=useState(readRoute);
 const [menu,setMenu]=useState(false);
 const [poster,setPoster]=useState(null);
 const [image,setImage]=useState(null);
 const [egg,setEgg]=useState(false);
 const taps=useRef(0);
 const previousRoute=useRef(route);
 useEffect(()=>{
  const navigate=()=>{const next=readRoute();setRoute(next);setMenu(false);setPoster(null);setImage(null);setEgg(false);
   requestAnimationFrame(()=>{
    if(next!=='home'){window.scrollTo(0,0);document.getElementById('main')?.focus({preventScroll:true});}
    else {const target=document.getElementById(window.location.hash.slice(1));if(target)target.scrollIntoView();else window.scrollTo(0,0);}
   });
  };
  window.addEventListener('hashchange',navigate);return()=>window.removeEventListener('hashchange',navigate);
 },[]);
 useEffect(()=>{
  document.title=route==='home'?'Philgood Media — Art Direction & Brand Design':projects.find(p=>p.id===route).name+' — Philgood Media';
  if(previousRoute.current!==route){document.getElementById('main')?.focus({preventScroll:true});previousRoute.current=route;}
 },[route]);
 useEffect(()=>{if(!menu)return;const close=e=>{if(e.key==='Escape'){setMenu(false);document.getElementById('menu-toggle')?.focus();}};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);},[menu]);
 useEffect(()=>{if(poster===null)return;const keys=e=>{if(e.key==='ArrowRight')setPoster(i=>(i+1)%posters.length);if(e.key==='ArrowLeft')setPoster(i=>(i-1+posters.length)%posters.length);};window.addEventListener('keydown',keys);return()=>window.removeEventListener('keydown',keys);},[poster]);
 const selected=projects.find(p=>p.id===route);
 return <>
  <a className="skip" href="#main">Zum Inhalt</a>
  <nav className="nav" aria-label="Hauptnavigation"><a className="brand-link brand-nav" href="#" aria-label="Philgood Media — Startseite"><img src="/brand/pg-horizontal.svg" alt="Philgood Media" width="1078" height="240"/></a><button className="menu-toggle pill" id="menu-toggle" aria-controls="navigation-links" aria-expanded={menu} onClick={()=>setMenu(v=>!v)}>{menu?'Schließen ×':'Menü +'}</button><div id="navigation-links" className={'nav-links'+(menu?' is-open':'')}><a href="#arbeiten" onClick={()=>setMenu(false)}>Arbeiten</a><a href="#leistungen" onClick={()=>setMenu(false)}>Leistungen</a><a href="#ueber" onClick={()=>setMenu(false)}>Über mich</a><a href="#kontakt" className="pill dark" onClick={()=>setMenu(false)}>Let’s talk ↗</a></div></nav>
  <main id="main" tabIndex={-1}>{selected?<CaseStudy project={selected} onImage={setImage}/>:<>
   <section className="hero" aria-labelledby="hero-title"><div className="hero-caption"><span>Independent Art Direction<br/>& Brand Design</span><span>Philip Spiekermann<br/>Ruhrgebiet, Deutschland</span></div><div className="hero-center"><h1 id="hero-title"><img className="hero-brand" src="/brand/pg-wordmark.svg" alt="Philgood Media" width="800" height="90" fetchPriority="high"/></h1><p>Gute Ideen. Eigener Charakter.</p></div><div className="hero-bottom"><span>Für Marken, die etwas bewegen.</span><a className="pill" href="#arbeiten">Arbeiten entdecken <span aria-hidden="true">↓</span></a><button className="asterisk" aria-label="Verstecktes Extra: dreimal tippen" title="Dreimal tippen" onClick={()=>{taps.current++;if(taps.current===3){setEgg(true);taps.current=0;}}}>✳</button></div></section>
   <section id="arbeiten" className="work" aria-label="Ausgewählte Arbeiten">
    {projects.map((project,i)=><a href={'#'+project.id} key={project.id} className={'project-panel panel-'+project.id} aria-label={project.name+' — Projekt ansehen'}><div className="panel-background">{project.id==='fruehschicht'?<img src="/fruehschicht/02-interior.jpg" alt="Frühschicht — Bäckerei-Interior mit rotem Tresen und warmen Holztönen" loading="lazy"/>:<><img src="/gf_bag.png" alt="Glutenfry — Packaging in Beerentönen und Gelb" loading="lazy"/><img src="/gf_flyer.png" alt="Glutenfry — Printdesign für glutenfreies Soul Food" loading="lazy"/></>}</div><div className="panel-top"><span>0{i+1} / Ausgewählte Arbeiten</span><span>{project.note||project.category}</span></div><div className="panel-bottom"><h2>{project.name}</h2><div className="panel-description"><span>{project.category}</span><span className="pill">Projekt ansehen ↗</span></div></div></a>)}
   </section>
   <PosterGallery items={posters} onOpen={setPoster}/>
   <section className="intro" id="leistungen" aria-labelledby="intro-title"><div className="section-top"><span>Was ich mache.</span><span>Konzept bis Umsetzung ↘</span></div><h2 id="intro-title">Ein guter Auftritt<br/>ist kein Zufall.</h2><p className="intro-copy">Ich bin Philip. Art Director aus dem Ruhrgebiet. Ich entwickle visuelle Identitäten und übersetze Ideen in Gestaltung – für Restaurants, Sportvereine, Unternehmen und Marken.</p><div className="service-list">{services.map(s=><details key={s.title}><summary><span className="service-number">{s.number}</span><h3>{s.title}</h3><span className="service-plus" aria-hidden="true">+</span></summary><div className="service-content"><p>{s.text}</p><span>{s.tags}</span><a href={email}>Projekt besprechen ↗</a></div></details>)}</div></section>
   <section className="about" id="ueber" aria-labelledby="about-title"><figure className="about-photo"><div className="about-portrait"><img src="/philip-on-location.jpg" alt="Philip Spiekermann an Bord eines Bootes, mit orangefarbenen Ballons vor blauem Himmel" width="1272" height="1536" loading="lazy" decoding="async"/></div><figcaption><span>Philip Spiekermann</span><span>Art Direction · Ruhrgebiet</span></figcaption></figure><div className="about-copy"><span>Der Kopf dahinter.</span><h2 id="about-title">Philip.<br/>Philgood.</h2><p>Von der Idee bis zur Reinzeichnung. Ich mag Gestaltung, die klar ist und trotzdem etwas Eigenes hat. Auf Papier, digital und im Raum.</p><p>Mein Revier: Brand Design, Kampagnen, Packaging und Messe. Mein Anspruch: ein Auftritt, der zu dir passt und im Kopf bleibt.</p><a className="pill" href={email}>Lernen wir uns kennen ↗</a></div></section>
  </>}<Contact/></main><Footer/>
  {poster!==null&&<Modal label="Poster-Großansicht" onClose={()=>setPoster(null)}><div className="viewer-caption" aria-live="polite"><h2>{posters[poster].title}</h2><span>{poster+1} / {posters.length}</span></div><img className="viewer-image" src={posters[poster].src} alt={posters[poster].title}/><div className="viewer-controls"><button className="pill" onClick={()=>setPoster(i=>(i-1+posters.length)%posters.length)}>← Vorheriges</button><button className="pill" onClick={()=>setPoster(i=>(i+1)%posters.length)}>Nächstes →</button></div></Modal>}
  {image&&<Modal label={image.title} onClose={()=>setImage(null)}><h2 className="viewer-caption">{image.title}</h2><img className="viewer-image" src={image.src} alt={image.title}/></Modal>}
  {egg&&<Modal label="Kleine kreative Pause" onClose={()=>setEgg(false)}><div className="egg"><span>Gefunden. Eine kleine kreative Pause.</span><img src="https://media1.tenor.com/m/ur0xcQWCkegAAAAd/the-office-michael-scott.gif" alt="Michael Scott aus The Office"/><h2>Gute Ideen<br/>brauchen Humor.</h2></div></Modal>}
 </>;
}
