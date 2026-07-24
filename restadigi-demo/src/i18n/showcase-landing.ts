import type { Locale } from "./types";

export const SHOWCASE_BRAND = "Maison Aurelia";

export type ShowcaseCopy = {
  metaTitle: string;
  metaDescription: string;
  demoRibbon: string;
  openPanel: string;
  lang: string;
  nav: { experience: string; menu: string; atmosphere: string; reserve: string };
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroCta: string;
  heroScroll: string;
  experienceTitle: string;
  experienceLead: string;
  experienceBody: string;
  pillars: { title: string; body: string }[];
  menuTitle: string;
  menuLead: string;
  dishes: { name: string; desc: string; tag: string }[];
  menuNote: string;
  atmosphereTitle: string;
  atmosphereLead: string;
  hoursTitle: string;
  hours: { day: string; time: string }[];
  addressLabel: string;
  address: string;
  phoneLabel: string;
  phone: string;
  reserveTitle: string;
  reserveLead: string;
  fields: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    party: string;
    notes: string;
    notesPlaceholder: string;
  };
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  successClose: string;
  errorGeneric: string;
  footerCredit: string;
  footerDemo: string;
};

const fi: ShowcaseCopy = {
  metaTitle: "Maison Aurelia — Pöytävaraus",
  metaDescription:
    "Maison Aurelia: moderni fine dining Helsingissä. Varaa pöytä verkossa — Restadigi-esittelysivusto.",
  demoRibbon: "Restadigi-esittely · tämä on esimerkki ravintolasivustosta",
  openPanel: "Avaa hallintapaneeli",
  lang: "Kieli",
  nav: {
    experience: "Kokemus",
    menu: "Menu",
    atmosphere: "Tunnelma",
    reserve: "Varaa",
  },
  heroEyebrow: "Helsinki · fine dining",
  heroTitle: "Illallinen, joka jää mieleen",
  heroLead:
    "Kausiluontoisia makuja, rauhallinen sali ja palvelu joka tuntuu henkilökohtaiselta — varaa pöytäsi muutamassa sekunnissa.",
  heroCta: "Varaa pöytä",
  heroScroll: "Tutustu",
  experienceTitle: "Talomme",
  experienceLead: "Hiljainen luksus, tarkka keittiö.",
  experienceBody:
    "Maison Aurelia yhdistää pohjoisen raaka-aineet ja eurooppalaisen tekniikan. Illallinen on kokonaisuus: valo, tempo, maku ja seura.",
  pillars: [
    {
      title: "Kausi edellä",
      body: "Menu vaihtuu luonnon rytmissä. Jokainen lautanen kertoo, mitä juuri nyt kannattaa syödä.",
    },
    {
      title: "Viinit huolella",
      body: "Sommelierimme rakentaa paritukset lautaselle — myös alkoholittomat vaihtoehdot kuuluvat asiaan.",
    },
    {
      title: "Yksityinen tunnelma",
      body: "Pieni sali, pehmeä valaistus ja tilaa keskustelulle. Sopii juhlaan tai hiljaiseen iltaan kahdestaan.",
    },
  ],
  menuTitle: "Maistiaisia",
  menuLead: "Muutama merkki nykyisestä menusta.",
  dishes: [
    {
      name: "Paahdettu merikala",
      desc: "Voikastike, raparperi, tilliöljy",
      tag: "Alkuruoka",
    },
    {
      name: "Hirven filee",
      desc: "Mustaherukka, paahdettu juuriselleri, katajanen liemi",
      tag: "Pääruoka",
    },
    {
      name: "Valkosuklaa & tyrni",
      desc: "Kevyt mousse, hunajainen tuuli ja tyrnin hapokkuus",
      tag: "Jälkiruoka",
    },
  ],
  menuNote: "Koko menu ja allergeenit esitetään salissa. Kerro erityisruokavaliosta varauksessa.",
  atmosphereTitle: "Tunnelma",
  atmosphereLead: "Tummaa puuta, pehmeää valoa, tilaa hengittää.",
  hoursTitle: "Aukiolo",
  hours: [
    { day: "Ti–To", time: "17:00–23:00" },
    { day: "Pe–La", time: "17:00–00:00" },
    { day: "Su–Ma", time: "Suljettu" },
  ],
  addressLabel: "Osoite",
  address: "Bulevardi 12, 00120 Helsinki",
  phoneLabel: "Puhelin",
  phone: "+358 40 000 0000",
  reserveTitle: "Varaa pöytä",
  reserveLead:
    "Täytä tiedot — saat heti vahvistuksen. Tämä on Restadigi-demo: varaus ei tallennu oikeaan järjestelmään.",
  fields: {
    name: "Nimi",
    email: "Sähköposti",
    phone: "Puhelin",
    date: "Päivä",
    time: "Aika",
    party: "Henkilöä",
    notes: "Toiveet",
    notesPlaceholder: "Esim. juhla, allergiat, ikkuna…",
  },
  submit: "Vahvista varaus",
  sending: "Vahvistetaan…",
  successTitle: "Varaus vastaanotettu",
  successBody:
    "Kiitos — tämä demo näyttää onnistuneen varauksen. Oikeassa Restadigi-sivustossa vahvistus menisi ravintolaan ja asiakkaalle.",
  successClose: "Sulje",
  errorGeneric: "Jotain meni pieleen. Kokeile uudelleen.",
  footerCredit: "Suunniteltu esittelyksi Restadigille",
  footerDemo: "Esimerkkisivusto · ei oikea ravintola",
};

const en: ShowcaseCopy = {
  metaTitle: "Maison Aurelia — Table reservation",
  metaDescription:
    "Maison Aurelia: modern fine dining in Helsinki. Reserve a table online — a Restadigi showcase site.",
  demoRibbon: "Restadigi showcase · sample restaurant website",
  openPanel: "Open dashboard",
  lang: "Language",
  nav: {
    experience: "Experience",
    menu: "Menu",
    atmosphere: "Atmosphere",
    reserve: "Reserve",
  },
  heroEyebrow: "Helsinki · fine dining",
  heroTitle: "An evening worth remembering",
  heroLead:
    "Seasonal flavours, a calm dining room and service that feels personal — reserve your table in seconds.",
  heroCta: "Reserve a table",
  heroScroll: "Explore",
  experienceTitle: "Our house",
  experienceLead: "Quiet luxury, precise cooking.",
  experienceBody:
    "Maison Aurelia brings northern produce and European craft together. Dinner is a whole: light, pace, flavour and company.",
  pillars: [
    {
      title: "Season first",
      body: "The menu follows the land and sea. Every plate answers what is best to eat right now.",
    },
    {
      title: "Wine with care",
      body: "Our sommelier pairs each course — including thoughtful alcohol-free options.",
    },
    {
      title: "Intimate room",
      body: "A small hall, soft light and space to talk. Ideal for celebrations or a quiet evening for two.",
    },
  ],
  menuTitle: "Signatures",
  menuLead: "A few notes from the current menu.",
  dishes: [
    {
      name: "Roasted white fish",
      desc: "Beurre blanc, rhubarb, dill oil",
      tag: "Starter",
    },
    {
      name: "Venison loin",
      desc: "Blackcurrant, roasted celeriac, juniper jus",
      tag: "Main",
    },
    {
      name: "White chocolate & sea buckthorn",
      desc: "Light mousse, honeyed crunch and bright acidity",
      tag: "Dessert",
    },
  ],
  menuNote: "Full menu and allergens are presented in the room. Mention dietary needs when booking.",
  atmosphereTitle: "Atmosphere",
  atmosphereLead: "Dark wood, soft light, room to breathe.",
  hoursTitle: "Hours",
  hours: [
    { day: "Tue–Thu", time: "17:00–23:00" },
    { day: "Fri–Sat", time: "17:00–00:00" },
    { day: "Sun–Mon", time: "Closed" },
  ],
  addressLabel: "Address",
  address: "Bulevardi 12, 00120 Helsinki",
  phoneLabel: "Phone",
  phone: "+358 40 000 0000",
  reserveTitle: "Reserve a table",
  reserveLead:
    "Fill in your details — you’ll see an instant confirmation. This is a Restadigi demo: the booking is not saved to a live system.",
  fields: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    date: "Date",
    time: "Time",
    party: "Guests",
    notes: "Requests",
    notesPlaceholder: "e.g. celebration, allergies, window seat…",
  },
  submit: "Confirm reservation",
  sending: "Confirming…",
  successTitle: "Reservation received",
  successBody:
    "Thank you — this demo shows a successful booking flow. On a real Restadigi site, confirmation would reach the restaurant and the guest.",
  successClose: "Close",
  errorGeneric: "Something went wrong. Please try again.",
  footerCredit: "Designed as a Restadigi showcase",
  footerDemo: "Sample website · not a real restaurant",
};

const es: ShowcaseCopy = {
  metaTitle: "Maison Aurelia — Reserva de mesa",
  metaDescription:
    "Maison Aurelia: fine dining moderno en Helsinki. Reserva mesa online — web de muestra Restadigi.",
  demoRibbon: "Muestra Restadigi · ejemplo de web de restaurante",
  openPanel: "Abrir panel",
  lang: "Idioma",
  nav: {
    experience: "Experiencia",
    menu: "Carta",
    atmosphere: "Ambiente",
    reserve: "Reservar",
  },
  heroEyebrow: "Helsinki · fine dining",
  heroTitle: "Una cena que se recuerda",
  heroLead:
    "Sabores de temporada, un salón sereno y un servicio cercano — reserva tu mesa en segundos.",
  heroCta: "Reservar mesa",
  heroScroll: "Descubrir",
  experienceTitle: "Nuestra casa",
  experienceLead: "Lujo discreto, cocina precisa.",
  experienceBody:
    "Maison Aurelia une producto nórdico y oficio europeo. La cena es un conjunto: luz, ritmo, sabor y compañía.",
  pillars: [
    {
      title: "La temporada manda",
      body: "La carta sigue la tierra y el mar. Cada plato responde a lo mejor del momento.",
    },
    {
      title: "Vinos con criterio",
      body: "Nuestro sommelier armoniza cada pase — también con opciones sin alcohol pensadas.",
    },
    {
      title: "Salón íntimo",
      body: "Espacio pequeño, luz suave y sitio para conversar. Ideal para celebrar o una noche en pareja.",
    },
  ],
  menuTitle: "Firmas",
  menuLead: "Algunas notas de la carta actual.",
  dishes: [
    {
      name: "Pescado blanco asado",
      desc: "Beurre blanc, ruibarbo, aceite de eneldo",
      tag: "Entrante",
    },
    {
      name: "Solomillo de ciervo",
      desc: "Grosella negra, apio nabo asado, jugo de enebro",
      tag: "Principal",
    },
    {
      name: "Chocolate blanco y espino amarillo",
      desc: "Mousse ligera, crujiente de miel y acidez brillante",
      tag: "Postre",
    },
  ],
  menuNote: "La carta completa y alérgenos se presentan en sala. Indica dietas especiales al reservar.",
  atmosphereTitle: "Ambiente",
  atmosphereLead: "Madera oscura, luz suave, espacio para respirar.",
  hoursTitle: "Horario",
  hours: [
    { day: "Mar–Jue", time: "17:00–23:00" },
    { day: "Vie–Sáb", time: "17:00–00:00" },
    { day: "Dom–Lun", time: "Cerrado" },
  ],
  addressLabel: "Dirección",
  address: "Bulevardi 12, 00120 Helsinki",
  phoneLabel: "Teléfono",
  phone: "+358 40 000 0000",
  reserveTitle: "Reservar mesa",
  reserveLead:
    "Completa los datos — verás la confirmación al instante. Es una demo Restadigi: la reserva no se guarda en un sistema real.",
  fields: {
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    date: "Fecha",
    time: "Hora",
    party: "Comensales",
    notes: "Preferencias",
    notesPlaceholder: "p. ej. celebración, alergias, mesa junto a la ventana…",
  },
  submit: "Confirmar reserva",
  sending: "Confirmando…",
  successTitle: "Reserva recibida",
  successBody:
    "Gracias — esta demo muestra un flujo de reserva exitoso. En una web Restadigi real, la confirmación llegaría al restaurante y al cliente.",
  successClose: "Cerrar",
  errorGeneric: "Algo ha fallado. Inténtalo de nuevo.",
  footerCredit: "Diseñado como muestra de Restadigi",
  footerDemo: "Web de ejemplo · no es un restaurante real",
};

export const SHOWCASE_COPY: Record<Locale, ShowcaseCopy> = { fi, en, es };

export function getShowcaseCopy(locale: Locale): ShowcaseCopy {
  return SHOWCASE_COPY[locale] ?? SHOWCASE_COPY.fi;
}
