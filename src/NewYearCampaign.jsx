import { useEffect, useRef, useState } from 'react';
import './new-year-campaign.css';

// Visible through 1 January 2027 in Germany; no browser storage is used.
export const campaignEndsAt = Date.parse('2027-01-02T00:00:00+01:00');
export const isCampaignActive = (now = Date.now()) => now < campaignEndsAt;

export default function NewYearCampaign({ enabled = true }) {
  const [active, setActive] = useState(isCampaignActive);
  const [open, setOpen] = useState(false);
  const shown = useRef(false);
  const dialog = useRef(null);

  useEffect(() => {
    let timer;
    const update = () => {
      window.clearTimeout(timer);
      const remaining = campaignEndsAt - Date.now();
      setActive(remaining > 0);
      if (remaining > 0) timer = window.setTimeout(update, Math.min(remaining, 2147483647));
    };
    update();
    window.addEventListener('focus', update);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('focus', update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setOpen(false);
      return;
    }
    if (!active || shown.current) return;
    const poster = new window.Image();
    poster.src = '/campaigns/new-year-2026.webp';
    const timer = window.setTimeout(() => {
      if (!isCampaignActive()) return;
      shown.current = true;
      setOpen(true);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [active, enabled]);

  useEffect(() => {
    if (!open || !active || !enabled) return;
    const element = dialog.current;
    const prior = document.activeElement;
    element.showModal();
    return () => {
      if (element.open) element.close();
      if (prior?.isConnected) prior.focus({ preventScroll: true });
    };
  }, [open, active, enabled]);

  if (!active || !open || !enabled) return null;

  const dismiss = () => setOpen(false);
  return (
    <dialog
      ref={dialog}
      className="new-year-campaign"
      aria-labelledby="new-year-title"
      aria-describedby="new-year-description"
      onCancel={event => { event.preventDefault(); dismiss(); }}
      onClick={event => { if (event.target === event.currentTarget) dismiss(); }}
    >
      <header className="new-year-top">
        <span>Zum Jahreswechsel.</span>
        <button className="new-year-close" type="button" autoFocus onClick={dismiss} aria-label="Pop-up schließen">
          Schließen <span aria-hidden="true">×</span>
        </button>
      </header>
      <div className="new-year-body">
        <img
          className="new-year-art"
          src="/campaigns/new-year-2026.webp"
          width="1054"
          height="1492"
          decoding="async"
          alt="NEW WAR: Menschen und Tiere fliehen vor Raketen und Explosionen. Kampagne für einen Jahreswechsel ohne Böller."
        />
        <div className="new-year-copy">
          <h2 id="new-year-title"><span className="new-year-black">Neues Jahr.</span><span className="new-year-red">Mehr Rücksicht.</span></h2>
          <p id="new-year-description">Für ein Silvester ohne Böller.<br/>Für Mensch und Tier.</p>
        </div>
      </div>
    </dialog>
  );
}
