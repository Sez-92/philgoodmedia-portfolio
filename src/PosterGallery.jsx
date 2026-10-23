import { useEffect, useRef, useState } from 'react';
import './posters.css';

const palettes = ['#dceae1','#eddfd4','#deebf2','#e4e5dc','#e9dce3','#e8e6e2','#dce8eb','#e7e4ec'];
const notes = ['Den Kopf in den Wolken. Die Idee auf Papier.','Bewegung, Rhythmus und ein langer Atem.','Ein bisschen Eskapismus. Ganz viel Vorfreude.','Zwei Katzen. Eine ziemlich dunkle Nacht.','Große Stadt. Kleine Auszeit.','Typografie mit einer anderen Perspektive.','Ein Motiv, das Fragen stellt.','Eine Bühne für starke Stimmen.'];

export default function PosterGallery({items,onOpen}) {
  const [active,setActive]=useState(0);
  const [direction,setDirection]=useState(1);
  const [playing,setPlaying]=useState(false);
  const [paused,setPaused]=useState(false);
  const [visible,setVisible]=useState(false);
  const [reduced,setReduced]=useState(false);
  const [hidden,setHidden]=useState(document.hidden);
  const section=useRef(null);
  const artwork=useRef(null);
  const rail=useRef(null);
  const start=useRef(null);
  const swiped=useRef(false);
  const item=items[active];
  const running=playing&&!paused&&visible&&!hidden&&!reduced;

  useEffect(()=>{
    const query=matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(query.matches);
    update();query.addEventListener('change',update);
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.2});
    observer.observe(section.current);
    const frame=location.hash==='#poster'?requestAnimationFrame(()=>section.current?.scrollIntoView({behavior:'instant'})):null;
    const visibility=()=>setHidden(document.hidden);
    document.addEventListener('visibilitychange',visibility);
    return()=>{query.removeEventListener('change',update);observer.disconnect();if(frame!==null)cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',visibility);};
  },[]);

  useEffect(()=>{
    if(!running)return;
    const timer=setTimeout(()=>{setDirection(1);setActive(i=>(i+1)%items.length);},6000);
    return()=>clearTimeout(timer);
  },[active,running,items.length]);

  useEffect(()=>{
    const container=rail.current;
    const selected=container.children[active];
    container.scrollTo({left:selected.offsetLeft-(container.clientWidth-selected.offsetWidth)/2,behavior:reduced?'instant':'smooth'});
  },[active,reduced]);

  function choose(index,delta=index-active) {
    setPlaying(false);setDirection(delta<0?-1:1);
    setActive((index+items.length)%items.length);
  }
  function resetTilt(){
    artwork.current?.style.setProperty('--tilt-x','0deg');
    artwork.current?.style.setProperty('--tilt-y','0deg');
  }
  function tilt(event){
    if(event.pointerType!=='mouse'||reduced)return;
    const rect=event.currentTarget.getBoundingClientRect();
    artwork.current?.style.setProperty('--tilt-y',`${((event.clientX-rect.left)/rect.width-.5)*8}deg`);
    artwork.current?.style.setProperty('--tilt-x',`${(.5-(event.clientY-rect.top)/rect.height)*6}deg`);
  }

  return <section ref={section} className="poster-showcase" id="poster" aria-labelledby="poster-title" style={{'--poster-bg':palettes[active%palettes.length]}}>
    <div className="showcase-top"><h2 id="poster-title">Poster & Motive</h2><span>Ein Motiv. Ein Moment.</span></div>
    <div className="poster-stage" role="region" aria-roledescription="Karussell" aria-label="Poster entdecken" tabIndex={0}
      onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(event.key==='ArrowRight'){event.preventDefault();choose(active+1,1);}if(event.key==='ArrowLeft'){event.preventDefault();choose(active-1,-1);}}}
      onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>{setPaused(false);resetTilt();}}
      onFocusCapture={()=>setPaused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setPaused(false);}}
      onPointerDown={event=>{if(event.pointerType==='mouse')return;start.current={x:event.clientX,y:event.clientY};swiped.current=false;}}
      onPointerUp={event=>{if(!start.current)return;const dx=event.clientX-start.current.x,dy=event.clientY-start.current.y;start.current=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3){swiped.current=true;choose(active+(dx<0?1:-1),dx<0?1:-1);}}}
      onPointerCancel={()=>{start.current=null;}}>
      <div className="showcase-number" aria-hidden="true">{String(active+1).padStart(2,'0')}</div>
      <div className="showcase-copy" key={'copy-'+active} style={{'--slide-from':`${direction*22}px`}} aria-live={playing?'off':'polite'}>
        <span className="showcase-category">{item.category}</span>
        <h3>{item.title}</h3><p>{notes[active%notes.length]}</p>
        <button className="showcase-open" onClick={()=>{setPlaying(false);onOpen(active);}}>Motiv ansehen <span aria-hidden="true">↗</span></button>
      </div>
      <button className="showcase-art" aria-label={item.title+' — Großansicht öffnen'} aria-haspopup="dialog" onPointerMove={tilt} onPointerLeave={resetTilt}
        onClick={()=>{if(swiped.current){swiped.current=false;return;}setPlaying(false);onOpen(active);}}>
        <span className="showcase-art-enter" key={item.src} style={{'--slide-from':`${direction*65}px`}}>
          <span className="showcase-art-tilt" ref={artwork}><img src={item.src} alt={item.title} loading="lazy" decoding="async" draggable="false"/></span>
        </span><span className="showcase-zoom" aria-hidden="true">↗</span>
      </button>
      <div className="showcase-controls"><span className="showcase-count">{String(active+1).padStart(2,'0')} <span>/ {String(items.length).padStart(2,'0')}</span></span><span className="showcase-hint">Wischen oder weiterklicken ↔</span><div><button aria-label="Vorheriges Motiv" onClick={()=>choose(active-1,-1)}>←</button><button aria-label="Nächstes Motiv" onClick={()=>choose(active+1,1)}>→</button></div></div>
      {playing&&<div className="showcase-progress" key={'progress-'+active} style={{animationPlayState:running?'running':'paused'}} aria-hidden="true"/>}
    </div>
    <div className="showcase-bottom"><span>Die Sammlung <span>({String(items.length).padStart(2,'0')})</span></span><button className="showcase-play" aria-pressed={playing} disabled={reduced} onClick={()=>setPlaying(v=>!v)}>{playing?'Ⅱ Pause':'▷ Abspielen'}</button></div>
    <div className="showcase-rail" ref={rail} aria-label="Motiv auswählen">{items.map((poster,index)=><button key={poster.src} className={'showcase-thumb'+(active===index?' is-active':'')} aria-label={poster.title+' auswählen'} aria-pressed={active===index} onClick={()=>choose(index)}><span className="showcase-thumb-image"><img src={poster.thumbnail||poster.src} alt="" loading="lazy" decoding="async" draggable="false"/></span><span>{String(index+1).padStart(2,'0')}</span></button>)}</div>
  </section>;
}
