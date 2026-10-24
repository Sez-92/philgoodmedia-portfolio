import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { buildProjectRequest, localToday, requestAreas, requestServices } from './projectRequest.js';
import './project-request.css';

export const ProjectRequestContext = createContext(null);

export function ProjectLink({area = '', services = [], package: packageName = '', children, onClick, ...props}) {
  const open = useContext(ProjectRequestContext);
  return <a {...props} href="mailto:philipspiekermann@hotmail.com?subject=Projektanfrage" onClick={event => {
    onClick?.(event);
    if (open && !event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      open({area, services, package: packageName});
    }
  }}>{children}</a>;
}

const titles = ['Dein Projekt.', 'Kurz zum Projekt.', 'Dein Kontakt.', 'Alles richtig?'];

export default function ProjectRequest({initial = {}}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(() => ({area: initial.area || '', services: initial.services || [], package: initial.package || '', company: '', description: '', timing: 'flexible', deadline: '', name: '', email: '', phone: '', reply: 'email', callbackTime: ''}));
  const [serviceError, setServiceError] = useState(false);
  const [copyState, setCopyState] = useState('');
  const [mailOpened, setMailOpened] = useState(false);
  const heading = useRef(null);
  const form = useRef(null);
  const set = (key, value) => setData(current => ({...current, [key]: value}));
  const request = buildProjectRequest(data);
  const services = data.area === 'gastronomie' ? [...requestServices.slice(0, 6), 'Speisekarte', ...requestServices.slice(6)] : requestServices;

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      heading.current?.focus({preventScroll: true});
      heading.current?.closest('dialog')?.scrollTo({top: 0});
    });
    return () => cancelAnimationFrame(frame);
  }, [step]);

  function next(event) {
    event.preventDefault();
    if (!form.current.reportValidity()) return;
    if (step === 0 && data.services.length === 0) {
      setServiceError(true);
      form.current.querySelector('input[name="service"]')?.focus();
      return;
    }
    // Read the form as well, so browser autofill and native date pickers are included.
    const fields = new FormData(form.current);
    if (step === 1) setData(current => ({...current,
      company: String(fields.get('organization') || ''),
      description: String(fields.get('project') || ''),
      timing: String(fields.get('timing') || current.timing),
      deadline: String(fields.get('deadline') || ''),
    }));
    if (step === 2) setData(current => ({...current,
      name: String(fields.get('name') || ''),
      email: String(fields.get('email') || ''),
      phone: String(fields.get('tel') || ''),
      callbackTime: String(fields.get('callback-time') || ''),
    }));
    setServiceError(false);
    setStep(current => Math.min(current + 1, 3));
  }

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(request.subject + '\n\n' + request.body);
      setCopyState('copied');
    } catch {
      setCopyState('manual');
    }
  }

  return <div className="project-request">
    <div className="request-topline"><span>Projektanfrage</span><span aria-label={'Schritt ' + (step + 1) + ' von 4'}>{String(step + 1).padStart(2, '0')} / 04</span></div>
    <h2 ref={heading} tabIndex={-1}>{titles[step]}</h2>
    {data.package && <p className="request-package">Paket: <strong>{data.package}</strong></p>}
    <form ref={form} onSubmit={next}>
      {step === 0 && <>
        <label className="request-field request-area-select">Bereich<select name="area" value={data.area} required onChange={event => {const area = event.target.value;setData(current => ({...current, area, package: area === 'sport' ? current.package : ''}));}}><option value="" disabled>Bitte wählen</option>{requestAreas.map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        <fieldset aria-describedby={serviceError ? 'request-service-error' : undefined}><legend>Was brauchst du? <span className="request-optional">Mehrfachauswahl</span></legend><div className="request-choices">{services.map(label => <label key={label}><input type="checkbox" name="service" checked={data.services.includes(label)} onChange={() => {set('services', data.services.includes(label) ? data.services.filter(value => value !== label) : [...data.services, label]);setServiceError(false);}}/><span>{label}<span className="request-choice-mark" aria-hidden="true">{data.services.includes(label) ? '✓' : ''}</span></span></label>)}</div>{serviceError && <p id="request-service-error" className="request-error" role="alert">Wähle mindestens eine Leistung – „Erst mal beraten lassen“ geht auch.</p>}</fieldset>
      </>}
      {step === 1 && <>
        <label className="request-field">Unternehmen / Verein <span className="request-optional">optional</span><input name="organization" autoComplete="organization" value={data.company} onChange={event => set('company', event.target.value)} maxLength={120} placeholder="Wie heißt dein Projekt?"/></label>
        <label className="request-field">Was schwebt dir vor? <span className="request-optional">optional</span><textarea name="project" rows={3} value={data.description} onChange={event => set('description', event.target.value)} maxLength={1200} placeholder="Deine Idee in ein, zwei Sätzen …"/></label>
        <fieldset><legend>Bis wann brauchst du es?</legend><div className="request-choices request-areas">{[['flexible', 'Noch flexibel'], ['date', 'Wunschtermin']].map(([value, label]) => <label key={value}><input type="radio" name="timing" value={value} checked={data.timing === value} onChange={() => set('timing', value)}/><span>{label}</span></label>)}</div></fieldset>
        {data.timing === 'date' && <label className="request-field request-date">Gewünschter Fertigstellungstermin<input type="date" name="deadline" value={data.deadline} min={localToday()} required onInput={event => set('deadline', event.currentTarget.value)} onChange={event => set('deadline', event.target.value)}/></label>}
      </>}
      {step === 2 && <>
        <label className="request-field">Dein Name<input name="name" autoComplete="name" value={data.name} required maxLength={100} onChange={event => set('name', event.target.value)} placeholder="Vor- und Nachname" pattern=".*\S.*"/></label>
        <fieldset><legend>Wie soll ich mich melden?</legend><div className="request-choices request-areas">{[['email', 'Per E-Mail'], ['phone', 'Gerne zurückrufen']].map(([value, label]) => <label key={value}><input type="radio" name="reply" checked={data.reply === value} onChange={() => set('reply', value)}/><span>{label}</span></label>)}</div></fieldset>
        <div className="request-contact-grid"><label className="request-field">Deine E-Mail {data.reply === 'phone' && <span className="request-optional">optional</span>}<input type="email" name="email" autoComplete="email" inputMode="email" required={data.reply === 'email'} value={data.email} maxLength={160} onChange={event => set('email', event.target.value)} placeholder="du@beispiel.de"/></label><label className="request-field">Deine Telefonnummer {data.reply === 'email' && <span className="request-optional">optional</span>}<input type="tel" name="tel" autoComplete="tel" inputMode="tel" required={data.reply === 'phone'} pattern=".*[0-9].*" minLength={5} value={data.phone} maxLength={40} onChange={event => set('phone', event.target.value)} placeholder="Für einen Rückruf"/></label></div>
        {data.reply === 'phone' && <label className="request-field">Wann bist du gut erreichbar? <span className="request-optional">optional</span><input name="callback-time" value={data.callbackTime} maxLength={100} onChange={event => set('callbackTime', event.target.value)} placeholder="Zum Beispiel: werktags ab 16 Uhr"/></label>}
      </>}
      {step === 3 && <>
        <div className="request-summary">
          <section><div className="request-summary-heading"><h3>Dein Vorhaben</h3><button type="button" onClick={() => setStep(0)} aria-label="Bereich und Leistungen ändern">Ändern ↗</button></div><p>{request.area}</p><ul className="request-service-tags">{data.services.map(service => <li key={service}>{service}</li>)}</ul>{data.package && <p>{data.package}</p>}</section>
          <section><div className="request-summary-heading"><h3>Details & Termin</h3><button type="button" onClick={() => setStep(1)} aria-label="Details und Termin ändern">Ändern ↗</button></div>{data.company.trim() && <p><strong>{data.company}</strong></p>}<p className="request-preserve-lines">{data.description.trim() || 'Details klären wir gemeinsam.'}</p><p className="request-deadline">Benötigt bis: {request.deadline}</p></section>
          <section><div className="request-summary-heading"><h3>Dein Kontakt</h3><button type="button" onClick={() => setStep(2)} aria-label="Kontaktdaten ändern">Ändern ↗</button></div><p>{data.name}</p>{data.email && <p>{data.email}</p>}{data.phone && <p>{data.phone}</p>}<p className="request-field-note">{data.reply === 'phone' ? 'Rückruf gewünscht' + (data.callbackTime.trim() ? ' · ' + data.callbackTime : '') : 'Antwort per E-Mail gewünscht'}</p></section>
        </div>
        <div className="request-send"><p>Die Anfrage ist vorbereitet. Öffne dein Mailprogramm und sende sie dort ab.</p><a className="request-primary" href={request.mailto} onClick={() => setMailOpened(true)}>E-Mail vorbereiten <span aria-hidden="true">↗</span></a><button type="button" className="request-copy" onClick={copyRequest}>{copyState === 'copied' ? 'Anfragetext kopiert ✓' : 'Anfragetext kopieren'}</button><p className="request-recipient">An: philipspiekermann@hotmail.com</p>
          <div role="status" aria-live="polite">{mailOpened && <p className="request-field-note">Falls sich kein Mailprogramm öffnet: Kopiere den Anfragetext und füge ihn in deine E-Mail ein.</p>}{copyState === 'copied' && <span className="request-sr-only">Der Anfragetext wurde kopiert.</span>}</div>
          {copyState === 'manual' && <label className="request-field">Markiere und kopiere den Text hier:<textarea readOnly rows={10} value={request.subject + '\n\n' + request.body} onFocus={event => event.target.select()}/></label>}
        </div>
      </>}
      <div className="request-navigation">{step > 0 ? <button type="button" className="request-back" onClick={() => setStep(current => current - 1)}>← Zurück</button> : <span className="request-field-note">Unverbindlich anfragen.</span>}{step < 3 && <button type="submit" className="request-primary">{step === 2 ? 'Anfrage ansehen' : 'Weiter'} <span aria-hidden="true">→</span></button>}</div>
    </form>
    <p className="request-privacy">Deine Angaben werden erst mit deiner E-Mail übermittelt.</p>
  </div>;
}
