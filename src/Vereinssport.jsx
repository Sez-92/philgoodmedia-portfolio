import './vereinssport.css';
import SportsMarquee from './SportsMarquee.jsx';

const enquiry='mailto:philipspiekermann@hotmail.com?subject=Social-Media-Design%20f%C3%BCr%20unseren%20Verein';
export const sportsTitle='Social Media Design für Sportvereine in Recklinghausen | Philgood Media';
export const sportsDescription='Social-Media-Vorlagen im Poster-Look für Sportvereine im Kreis Recklinghausen. Spieltag, Ergebnis und Tor – in euren Vereinsfarben und selbst in Canva befüllbar.';

const clubs=[
 {id:'herten07',name:'DJK Spvgg Herten 07',short:'Herten 07',accent:'#ed1c24',copy:'Rot. Schwarz. Volle Lautstärke.'},
 {id:'langenbochum',name:'BW Westfalia Langenbochum',short:'Langenbochum',accent:'#526bff',copy:'Blau-weißer Zusammenhalt. Ein klarer Auftritt.'},
 {id:'hochlar28',name:'SV Hochlar 28',short:'Hochlar 28',accent:'#ff5a15',copy:'Heimat im Herzen. Orange im Feed.'},
];
const formats=[['spieltag','Spieltag'],['ergebnis','Ergebnis'],['tor','Tor']];
const packages=[
 {title:'Starter-Kit',line:'Der erste gemeinsame Auftritt.',items:['6 Feed-Vorlagen','Mini-Styleguide auf einer Seite','30 Minuten Einweisung','1 Korrekturschleife']},
 {title:'Club-Kit Komplett',line:'Ein Design-System für die ganze Saison.',items:['12 Feed- und 6 Story-Vorlagen','Profilbild und Highlight-Cover','Ausführlicher Styleguide','60 Minuten Einweisung','2 Korrekturschleifen']},
 {title:'Laufende Betreuung',line:'Verstärkung für euer Social-Team.',items:['Monatliche Zusammenarbeit','Anpassungen an euren Vorlagen','Individuelle Sonderposts','Umfang nach eurem Bedarf']},
];
const credits=[
 ['Herten 07 · Spieltag','Ben Weber','https://unsplash.com/photos/man-wearing-black-and-blue-jersey-shirt-on-field-r-krWscXjvQ'],
 ['Herten 07 · Ergebnis','Nihar Reddy Jangam','https://unsplash.com/photos/two-soccer-players-in-red-uniforms-hugging-on-field-31RUFbcbC50'],
 ['Herten 07 · Tor','Blake Emge','https://unsplash.com/photos/a-person-running-in-the-air-0Lt8YmvrhwA'],
 ['Langenbochum · Spieltag','Blake Emge','https://unsplash.com/photos/a-man-jumping-in-the-air-RrfZGnLpU_k'],
 ['Langenbochum · Ergebnis','Maximilian Müller','https://unsplash.com/photos/soccer-players-celebrate-a-victory-with-a-team-hug-kWNi7fbOdlk'],
 ['Langenbochum · Tor','Ruben Leija','https://unsplash.com/photos/man-playing-soccer-Qlrcw3yOKec'],
 ['Hochlar 28 · Spieltag','Sven Kucinic','https://unsplash.com/photos/man-playing-soccer-during-daytime-Z0KjmjxUsKs'],
 ['Hochlar 28 · Ergebnis','Omar Ramadan','https://unsplash.com/photos/man-in-blue-and-white-adidas-soccer-jersey-shirt-holding-white-and-blue-soccer-ball-0C2s_k5yPPM'],
 ['Hochlar 28 · Tor','Elin Tabitha','https://unsplash.com/photos/man-in-black-and-white-hoodie-and-black-pants-Gjvjvwi9Emw'],
 ['Hochlar 28 · Himmel','Tom Barrett','https://unsplash.com/photos/storm-clouds-with-bright-glowing-light--bSucp2nUdQ'],
];

export function VereinssportTeaser(){return <a className="sports-teaser" href="/vereinssport/" aria-label="Vereinssport — Social-Media-Design ansehen">
 <div className="sports-teaser-top"><span>03 / Ausgewählte Arbeiten</span><span>Social Media · Vereinsdesign</span></div>
 <img src="/vereinssport/hero_vereinssport_1920x1080.jpg" alt="Social-Media-Designs für Herten 07, Langenbochum und Hochlar 28" width="1920" height="1080" loading="lazy"/>
 <div className="sports-teaser-bottom"><div><span>Euer Verein. Euer Auftritt.</span><h2>Vereinssport.</h2></div><span className="pill">Social Media ansehen ↗</span></div>
 </a>;}

export default function Vereinssport({onImage}){
 return <article className="sports-page">
  <header className="sports-hero">
   <div className="sports-eyebrow"><span>Philgood Media / Vereinssport</span><span>Für den Kreis Recklinghausen & darüber hinaus</span></div>
   <p className="sports-kicker">Social-Media-Design für Sportvereine</p>
   <h1>Kreisliga auf dem Platz.<br/><span>Bundesliga im Feed.</span></h1>
   <div className="sports-hero-bottom"><p>Ein eigener Look für euren Verein.<br/>Von mir gestaltet. Von euch in Canva befüllt.</p><a className="sports-cta" href={enquiry}>Anfrage stellen <span aria-hidden="true">↗</span></a><a className="sports-text-link" href="#beispiele">Beispiele entdecken ↓</a></div>
   <SportsMarquee/>
   <div className="sports-hero-note"><span>Vereinsfarben statt Einheitsbrei.</span><span>Feed / Story / Saison</span></div>
  </header>

  <section className="sports-intro" aria-labelledby="sports-idea"><span className="sports-kicker">Ein System. Eure ganze Saison.</span><div><h2 id="sports-idea">Am Wochenende<br/>zählt das Spiel.</h2><p>Jedes Wochenende Handyfoto plus Canva-Text? Ich baue eurem Verein ein Design-System, das zusammenhält: Spieltag, Ergebnis, Tor und alles dazwischen. Eure Farben, eure Bilder, euer Charakter.</p><p>Danach übernimmt euer Team: Foto tauschen, Text eintragen, posten. Auch wenn neben Job, Training und Ehrenamt wenig Zeit bleibt.</p></div></section>

  <section className="sports-examples" id="beispiele" aria-labelledby="sports-examples-title">
   <div className="sports-section-label"><h2 id="sports-examples-title">Drei Vereine. Drei eigene Looks.</h2><span>Freie Designkonzepte / 2026</span></div>
   {clubs.map((club,index)=><section className="sports-club" key={club.id} aria-labelledby={'club-'+club.id} style={{'--club-accent':club.accent}}>
    <header><div><span className="sports-club-number">0{index+1}</span><h3 id={'club-'+club.id}>{club.name}</h3></div><p>{club.copy}</p></header>
    <div className="sports-posts" role="region" aria-label={'Beispielposts für '+club.name} tabIndex={0}>{formats.map(([file,label])=>{
     const src='/vereinssport/'+club.id+'_'+file+'.jpg';const alt=label+'-Poster – freies Konzept für '+club.name;
     return <figure key={file}><button onClick={()=>onImage?.({src,title:alt})} aria-label={alt+' – Großansicht öffnen'} aria-haspopup="dialog"><img src={src} alt={alt} width="1080" height="1350" loading="lazy" decoding="async"/><span aria-hidden="true">↗</span></button><figcaption><span>{label}</span><span>Feed · 4:5</span></figcaption></figure>;
    })}</div><p className="sports-swipe">Auf dem Handy durch die Motive wischen ↔</p>
   </section>)}
   <p className="sports-concept-note">Freie Konzepte – keine offiziellen Vereinsposts. Die gezeigten Personen sind Stockmotive. Für euren Auftritt arbeiten wir mit euren eigenen Vereinsfotos.</p>
  </section>

  <section className="sports-formats" aria-labelledby="sports-formats-title"><span className="sports-kicker">Mehr als nur Spieltag.</span><h2 id="sports-formats-title">Alles, was euren<br/>Verein bewegt.</h2><div>{['Spieltag','Ergebnis','Tor','Aufstellung','Neuzugang','Spieler des Spiels','Tabelle','Geburtstag','Sponsor'].map((name,i)=><span key={name}><small>{String(i+1).padStart(2,'0')}</small>{name}</span>)}</div></section>

  <section className="sports-packages" id="pakete" aria-labelledby="sports-packages-title"><div className="sports-section-label"><h2 id="sports-packages-title">So können wir zusammenarbeiten.</h2><span>Passend zu eurem Team.</span></div><div className="sports-package-grid">{packages.map((pack,i)=><article key={pack.title} className={i===1?'sports-package featured':'sports-package'}><span className="sports-package-number">0{i+1}</span><h3>{pack.title}</h3><p>{pack.line}</p><ul>{pack.items.map(item=><li key={item}>{item}</li>)}</ul><a href={enquiry}>Angebot anfragen ↗</a></article>)}</div><p className="sports-extras">Dazu buchbar: Sponsoren-Vorlagen, Reel-Vorlagen und eine Kampagne zum Saisonstart.</p></section>

  <section className="sports-process" aria-labelledby="sports-process-title"><span className="sports-kicker">Vom ersten Gespräch bis zum Anpfiff.</span><h2 id="sports-process-title">Einfach zum<br/>eigenen Auftritt.</h2><ol>{[['Kennenlernen.','Wir sprechen über euren Verein, eure Ziele und wer eure Social-Media-Kanäle betreut.'],['Eure Farben. Euer Design.','Ich entwickle euren Look und gestalte daraus Vorlagen für eure wichtigsten Formate.'],['Übergabe. Loslegen.','Ihr bekommt eure Vorlagen, den Styleguide und eine Einweisung. Danach kann euer Team selbst posten.']].map(([title,text],i)=><li key={title}><span>0{i+1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></section>

  <section className="sports-faq" aria-labelledby="sports-faq-title"><h2 id="sports-faq-title">Kurz geklärt.</h2>{[['Läuft das in Canva?','Ja. Die Vorlagen werden für Canva vorbereitet. Photoshop-Dateien sind auf Wunsch möglich.'],['Kann das unser Jugendwart bedienen?','Ja. Die Vorlagen sind für euren Vereinsalltag gedacht. In der Einweisung gehen wir gemeinsam durch, wie ihr Fotos, Namen, Gegner und Ergebnisse austauscht.'],['Kann ein Sponsor das mitfinanzieren?','Ja. Sponsor-Platzierungen können direkt im Design vorgesehen werden.'],['Geht das auch für andere Sportarten?','Ja. Die gezeigten Beispiele sind Fußballkonzepte. Euer Design richtet sich nach eurem Verein und eurer Sportart.']].map(([q,a])=><details key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}</section>

  <section className="sports-contact" id="vereinskontakt"><span className="sports-kicker">Euer nächstes Heimspiel: im Feed.</span><h2>Dein Verein will<br/>auch so aussehen?</h2><p>Schreib mir, für welchen Verein du anfragst und was ihr braucht. Dann besprechen wir euren Auftritt.</p><a className="sports-cta" href={enquiry}>Lass uns loslegen <span aria-hidden="true">↗</span></a></section>

  <details className="sports-credits"><summary>Bildnachweise der freien Konzepte</summary><p>Fotografie: Unsplash. Konzeption, Layout und Bildbearbeitung: Philgood Media.</p><ul>{credits.map(([use,name,url])=><li key={use}>{use}: <a href={url} target="_blank" rel="noreferrer">{name} ↗</a></li>)}</ul><a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash-Lizenz ↗</a></details>
 </article>;
}
