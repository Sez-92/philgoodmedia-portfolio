import { useEffect, useRef, useState } from 'react';

const posters = [
  ['langenbochum_tor', 'Langenbochum · Tor'],
  ['herten07_spieltag', 'Herten 07 · Spieltag'],
  ['hochlar28_ergebnis', 'Hochlar 28 · Ergebnis'],
  ['herten07_tor', 'Herten 07 · Tor'],
  ['langenbochum_spieltag', 'Langenbochum · Spieltag'],
  ['hochlar28_spieltag', 'Hochlar 28 · Spieltag'],
  ['herten07_ergebnis', 'Herten 07 · Ergebnis'],
  ['langenbochum_ergebnis', 'Langenbochum · Ergebnis'],
  ['hochlar28_tor', 'Hochlar 28 · Tor'],
];

export default function SportsMarquee() {
  const viewport = useRef(null);
  const group = useRef(null);
  const drag = useRef(null);
  const resumeTimer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPlaying(!preference.matches);
    const respectPreference = () => setPlaying(!preference.matches);
    preference.addEventListener('change', respectPreference);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(viewport.current);
    return () => {
      preference.removeEventListener('change', respectPreference);
      observer.disconnect();
      clearTimeout(resumeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!playing || hovered || focused || interacting || !visible) return;
    const el = viewport.current;
    let width = group.current.getBoundingClientRect().width;
    let position = el.scrollLeft;
    let previous;
    let frame;
    const resize = new ResizeObserver(() => {
      width = group.current.getBoundingClientRect().width;
      position = el.scrollLeft;
    });
    resize.observe(group.current);
    const tick = now => {
      if (previous !== undefined && width > 0) {
        position = (position + Math.min(now - previous, 50) * .026) % width;
        el.scrollLeft = position;
      }
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      previous = undefined;
      if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    document.addEventListener('visibilitychange', visibility);
    if (!document.hidden) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [playing, hovered, focused, interacting, visible]);

  const hold = () => {
    clearTimeout(resumeTimer.current);
    setInteracting(true);
  };
  const release = () => {
    drag.current = null;
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setInteracting(false), 1600);
  };

  return <div className="sports-marquee">
    <div className="sports-marquee-controls">
      <span id="sports-marquee-hint">Vereinslooks entdecken · Ziehen oder wischen ↔</span>
      <button type="button" aria-controls="sports-marquee-viewport" onClick={() => setPlaying(value => !value)}>
        <span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span> {playing ? 'Pause' : 'Abspielen'}
      </button>
    </div>
    <div className="sports-marquee-viewport" id="sports-marquee-viewport" ref={viewport} role="region" aria-label="Vereinsmotive im Überblick" aria-describedby="sports-marquee-hint" tabIndex={0}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      onTouchStart={hold} onTouchEnd={release} onTouchCancel={release}
      onPointerDown={event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        hold();
        drag.current = {x: event.clientX, scroll: viewport.current.scrollLeft};
        event.currentTarget.setPointerCapture(event.pointerId);
        event.preventDefault();
      }}
      onPointerMove={event => {
        if (drag.current) viewport.current.scrollLeft = drag.current.scroll - (event.clientX - drag.current.x);
      }}
      onPointerUp={event => { if (event.pointerType === 'mouse') release(); }}
      onPointerCancel={event => { if (event.pointerType === 'mouse') release(); }}>
      <div className="sports-marquee-track">
        {[false, true].map(duplicate => <div className="sports-marquee-group" key={String(duplicate)} ref={duplicate ? undefined : group} aria-hidden={duplicate || undefined} role={duplicate ? undefined : 'list'}>
          {posters.map(([file, label], index) => <div className="sports-marquee-card" key={file} role={duplicate ? undefined : 'listitem'}>
            <img src={'/vereinssport/' + file + '.jpg'} alt={duplicate ? '' : label + ' – freies Designkonzept'} width="1080" height="1350" loading={!duplicate && index < 3 ? 'eager' : 'lazy'} fetchpriority={!duplicate && index === 0 ? 'high' : undefined} decoding="async" draggable="false"/>
          </div>)}
        </div>)}
      </div>
    </div>
  </div>;
}
