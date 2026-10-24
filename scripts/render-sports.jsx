import React from 'react';
import {renderToString} from 'react-dom/server';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import Vereinssport,{sportsTitle,sportsDescription} from '../src/Vereinssport.jsx';
import {SiteHeader,Footer} from '../src/App.jsx';

const markup=renderToString(<><a className="skip" href="#main">Zum Inhalt</a><SiteHeader home={false}/><main id="main" tabIndex={-1}><Vereinssport/></main><Footer/></>);
const escape=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
let html=readFileSync('dist/index.html','utf8')
 .replace('<div id="root"></div>','<div id="root">'+markup+'</div>')
 .replace(/<title>.*?<\/title>/,'<title>'+escape(sportsTitle)+'</title>')
 .replace(/<meta name="description" content="[^"]*"\s*\/>/,'<meta name="description" content="'+escape(sportsDescription)+'" />')
 .replace('<meta name="theme-color" content="#ffffff" />','<meta name="theme-color" content="#0e0e0e" />')
 .replace('</head>','<link rel="canonical" href="https://www.philgoodmedia.de/vereinssport/" /><meta property="og:title" content="'+escape(sportsTitle)+'" /><meta property="og:description" content="'+escape(sportsDescription)+'" /><meta property="og:type" content="website" /><meta property="og:url" content="https://www.philgoodmedia.de/vereinssport/" /><meta property="og:image" content="https://www.philgoodmedia.de/vereinssport/hero_vereinssport_1920x1080.jpg" /><link rel="preload" as="font" href="/fonts/Anton-Regular.woff2" type="font/woff2" crossorigin /></head>');
mkdirSync('dist/vereinssport',{recursive:true});
writeFileSync('dist/vereinssport/index.html',html);
console.log('Prerendered /vereinssport/ with nine posts, metadata and contact links.');
