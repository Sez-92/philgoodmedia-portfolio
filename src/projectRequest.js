export const requestAreas = [
  ['gastronomie', 'Gastronomie'],
  ['sport', 'Sport & Vereine'],
  ['marken', 'Marken & Unternehmen'],
  ['anderes', 'Etwas anderes'],
];

export const requestServices = [
  'Rebranding', 'Logo-Design', 'Website', 'Social-Media-Design',
  'Flyer', 'Plakat', 'Weitere Printprodukte', 'Packaging',
  'Messedesign', 'Erst mal beraten lassen',
];

export function localToday() {
  const date = new Date();
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

export function buildProjectRequest(data) {
  const area = requestAreas.find(([id]) => id === data.area)?.[1] || 'Noch offen';
  const deadline = data.timing === 'date' && data.deadline
    ? data.deadline.split('-').reverse().join('.') : 'Zeitlich flexibel / nach Absprache';
  const subject = 'Projektanfrage · ' + area + ' · ' + data.services.join(', ');
  const body = [
    'Hallo Philip,', '', 'ich möchte ein Projekt mit dir besprechen.', '',
    'Bereich: ' + area,
    'Gewünschte Leistungen: ' + data.services.join(', '),
    data.package ? 'Paket: ' + data.package : null,
    data.company.trim() ? 'Unternehmen / Verein: ' + data.company.trim() : null,
    '', 'Kurz zum Projekt:', data.description.trim() || 'Die Details würde ich gerne mit dir besprechen.',
    '', 'Benötigt bis: ' + deadline,
    '', 'So erreichst du mich:',
    'Name: ' + data.name.trim(),
    data.email.trim() ? 'E-Mail: ' + data.email.trim() : null,
    data.phone.trim() ? 'Telefon: ' + data.phone.trim() : null,
    'Gewünschte Rückmeldung: ' + (data.reply === 'phone' ? 'Bitte zurückrufen' : 'Per E-Mail'),
    data.callbackTime.trim() && data.reply === 'phone' ? 'Am besten erreichbar: ' + data.callbackTime.trim() : null,
    '', 'Viele Grüße', data.name.trim(),
  ].filter(line => line !== null).join('\n');
  return {area, deadline, subject, body, mailto: 'mailto:philipspiekermann@hotmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body)};
}
