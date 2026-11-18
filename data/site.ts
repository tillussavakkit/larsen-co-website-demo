export const company = {
  name: 'Larsen & Co.',
  location: 'Nuuk, Greenland',
  phone: '+299 32 22 28',
  phoneHref: 'tel:+299322228',
  experienceYears: '',
  description:
    'Larsen & Co. udfører minør- og sprængningsarbejde samt jord- og terrænarbejde i Nuuk.',
} as const;

export const navigation = [
  { href: '/', label: 'Forside' },
  { href: '/om-os', label: 'Om os' },
  { href: '/kompetencer', label: 'Kompetencer' },
  { href: '/projekter', label: 'Projekter' },
  { href: '/nyheder', label: 'Nyheder' },
  { href: '/kontakt', label: 'Kontakt' },
] as const;

export const competencies = [
  {
    id: 'minor-sprangning',
    number: '01',
    title: 'Minør- & sprængningsarbejde',
    description: 'Larsen & Co. arbejder med minør- og sprængningsarbejde.',
    image: '/images/larsen-co/work/11-waterfront-drilling-earthworks.jpg',
    alt: 'Boremaskine og entreprenørmaskiner arbejder i klippe ved vandet',
  },
  {
    id: 'jord-terran',
    number: '02',
    title: 'Jord- & terrænarbejde',
    description: 'Larsen & Co. arbejder med jord- og terrænarbejde.',
    image: '/images/larsen-co/work/02-rock-excavation-blue-building.jpg',
    alt: 'Gravemaskine arbejder i stenet terræn ved en blå bygning',
  },
] as const;

// Jimmy's portrait was supplied directly by Larsen & Co. Benny's remains a
// temporary reference image until matching final photography is supplied.
export const owners = [
  {
    name: 'Jimmy H. Rødgaard',
    email: 'jimmy@larsenco.gl',
    role: 'Ejer',
    image: '/images/larsen-co/owners/jimmy-h-roedgaard.jpg',
    alt: 'Jimmy H. Rødgaard',
    imagePosition: 'center center',
  },
  {
    name: 'Benny Larsen',
    email: 'benny@larsenco.gl',
    role: 'Ejer',
    image: '/images/larsen-co/owners/benny-larsen-reference.jpg',
    alt: 'Benny Larsen i et sneklædt bjerglandskab',
    imagePosition: 'center center',
  },
] as const;

export const projects = [
  {
    id: 'arbejde-01',
    label: 'Entreprenørarbejde',
    image: '/images/larsen-co/work/01-demolition-construction-site.jpg',
    alt: 'Maskine på et aktivt arbejdsområde',
    orientation: 'portrait',
  },
  {
    id: 'arbejde-02',
    label: 'Arbejde i fjeld',
    image: '/images/larsen-co/work/02-rock-excavation-blue-building.jpg',
    alt: 'Gravemaskine arbejder i klippe ved en blå bygning',
    orientation: 'landscape',
  },
  {
    id: 'arbejde-03',
    label: 'Jord- & terrænarbejde',
    image: '/images/larsen-co/work/03-trench-earthworks.jpg',
    alt: 'Udgravet rende i stenet terræn',
    orientation: 'portrait',
  },
  {
    id: 'arbejde-04',
    label: 'Jord- & terrænarbejde',
    image: '/images/larsen-co/work/04-excavator-trench-work.jpg',
    alt: 'Gravemaskine ved en udgravet rende',
    orientation: 'portrait',
  },
  {
    id: 'arbejde-05',
    label: 'Arbejde med tungt materiel',
    image: '/images/larsen-co/work/05-bell-dumper-excavator.jpg',
    alt: 'Dumper og gravemaskine på et stenet arbejdsområde',
    orientation: 'landscape',
  },
  {
    id: 'arbejde-06',
    label: 'Entreprenørarbejde',
    image: '/images/larsen-co/work/06-road-earthworks-nuuk.jpg',
    alt: 'Jordarbejde ved en vej',
    orientation: 'landscape',
  },
  {
    id: 'arbejde-07',
    label: 'Entreprenørarbejde',
    image: '/images/larsen-co/work/07-foundation-excavators.jpg',
    alt: 'To gravemaskiner på et arbejdsområde',
    orientation: 'landscape',
  },
  {
    id: 'arbejde-08',
    label: 'Arbejde i terræn',
    image: '/images/larsen-co/work/08-surveying-hillside-excavation.jpg',
    alt: 'Opmåling på en stor udgravning i fjeldterræn',
    orientation: 'landscape',
  },
  {
    id: 'arbejde-09',
    label: 'Entreprenørarbejde',
    image: '/images/larsen-co/work/09-concrete-site-work.jpg',
    alt: 'Arbejdsområde ved betonkonstruktioner',
    orientation: 'portrait',
  },
  {
    id: 'arbejde-10',
    label: 'Arbejde med tungt materiel',
    image: '/images/larsen-co/work/10-machinery-building-site.jpg',
    alt: 'Entreprenørmaskiner ved en byggeplads',
    orientation: 'landscape',
  },
  {
    id: 'arbejde-11',
    label: 'Minør- & sprængningsarbejde',
    image: '/images/larsen-co/work/11-waterfront-drilling-earthworks.jpg',
    alt: 'Larsen & Co.-maskiner arbejder i klippe ved vandet',
    orientation: 'landscape',
  },
  {
    id: 'arbejde-12',
    label: 'Grønlandske forhold',
    image: '/images/larsen-co/work/12-winter-night-excavator.jpg',
    alt: 'Gravemaskine arbejder i sne og vintermørke',
    orientation: 'landscape',
  },
  {
    id: 'arbejde-13',
    label: 'Grønlandske forhold',
    image: '/images/larsen-co/work/13-winter-night-machinery.jpg',
    alt: 'Entreprenørmaskiner på et oplyst arbejdsområde i vintermørke',
    orientation: 'landscape',
  },
  {
    id: 'arbejde-14',
    label: 'Jord- & terrænarbejde',
    image: '/images/larsen-co/work/14-deep-excavation-worker.jpg',
    alt: 'Medarbejder i en dyb udgravning i klippe',
    orientation: 'portrait',
  },
] as const;

export const pendingContent = [
  'Virksomhedens e-mailadresse',
  'Fysisk adresse',
  'Ejertitler ud over “Ejer”',
  'Den komplette liste over ydelser',
  'Konkrete projektnavne og projektdetaljer',
  'Endelige professionelle ejerportrætter',
  'Eventuel yderligere virksomhedstekst',
] as const;
