import type { Locale } from "./types";

export const SHOWCASE_BRAND = "Maison Aurelia";

export type ShowcaseCopy = {
  metaTitle: string;
  metaDescription: string;
  demoRibbon: string;
  openPanel: string;
  lang: string;
  nav: {
    about: string;
    menu: string;
    lunch: string;
    groups: string;
    contact: string;
    reserve: string;
    gift: string;
  };
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroCta: string;
  heroScroll: string;
  experienceTitle: string;
  experienceLead: string;
  experienceBody: string;
  foodTitle: string;
  foodLead: string;
  foodBody: string;
  menuTitle: string;
  menuLead: string;
  dishes: { name: string; desc: string; tag: string }[];
  menuNote: string;
  lunchTitle: string;
  lunchLead: string;
  lunchBody: string;
  lunchItems: { name: string; desc: string; price: string }[];
  drinksTitle: string;
  drinksLead: string;
  drinksBody: string;
  groupsTitle: string;
  groupsLead: string;
  groupsBody: string;
  groupsCta: string;
  atmosphereTitle: string;
  atmosphereLead: string;
  hoursTitle: string;
  hours: { day: string; time: string }[];
  addressLabel: string;
  address: string;
  phoneLabel: string;
  phone: string;
  giftTitle: string;
  giftLead: string;
  giftBody: string;
  giftCta: string;
  footerCredit: string;
  footerDemo: string;
};

const fi: ShowcaseCopy = {
  metaTitle: "Maison Aurelia — Restadigi showcase",
  metaDescription:
    "Maison Aurelia: moderni fine dining Helsingissä. Varaa pöytä verkossa — Restadigi-esittelysivusto.",
  demoRibbon: "Restadigi-esittely · tämä on esimerkki ravintolasivustosta",
  openPanel: "Avaa hallintapaneeli",
  lang: "Kieli",
  nav: {
    about: "Meistä",
    menu: "À la carte",
    lunch: "Lounas",
    groups: "Ryhmät & tilaisuudet",
    contact: "Yhteystiedot & aukioloajat",
    reserve: "Varaa",
    gift: "Lahjakortti",
  },
  heroEyebrow: "Helsinki · Bulevardi",
  heroTitle: "Illallinen, joka jää mieleen",
  heroLead:
    "Kausiluontoisia makuja, rauhallinen sali ja palvelu joka tuntuu henkilökohtaiselta — varaa pöytäsi muutamassa sekunnissa.",
  heroCta: "Varaa pöytä",
  heroScroll: "Tutustu",
  experienceTitle: "Talomme",
  experienceLead: "Hiljainen luksus, tarkka keittiö.",
  experienceBody:
    "Maison Aurelia yhdistää pohjoisen raaka-aineet ja eurooppalaisen tekniikan. Illallinen on kokonaisuus: valo, tempo, maku ja seura. Rakennamme lautaselle muhkeita makuja ilman turhia muodollisuuksia.",
  foodTitle: "Ruoka",
  foodLead: "Parhaista raaka-aineista, intohimolla.",
  foodBody:
    "Emme sitoudu yhteen tyyliin — yhdistämme rohkeasti vaikutteita. Listalta löytyy aina vaihtoehtoja kasvis-, kala- ja liharuokien ystäville. Kerro erityisruokavaliosta varatessa.",
  menuTitle: "À la carte",
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
  menuNote: "Koko menu ja allergeenit esitetään salissa.",
  lunchTitle: "Lounas",
  lunchLead: "Arkisin kevyt, huolella tehty.",
  lunchBody:
    "Tiistaista perjantaihin tarjoamme vaihtuvan lounaskokonaisuuden — sopii nopeaan taukoon ilman kiireen tuntua.",
  lunchItems: [
    { name: "Päivän keitto", desc: "Kausivihanneksia, yrttiöljy", price: "9 €" },
    { name: "Lounaspääruoka", desc: "Kala tai kasvis — vaihtuu päivittäin", price: "16 €" },
    { name: "Kahvi & makea", desc: "Espresso ja pieni jälkiruoka", price: "6 €" },
  ],
  drinksTitle: "Juoma",
  drinksLead: "Match made in Maison.",
  drinksBody:
    "Viinit maailmalta, cocktaileja ja huolella valittuja alkoholittomia — juoma kruunaa illallisen.",
  groupsTitle: "Ryhmät & tilaisuudet",
  groupsLead: "Yksityinen illallinen, yritystilaisuus tai juhla.",
  groupsBody:
    "Sali sopii 8–28 hengen tilaisuuksiin. Autamme menun, juomien ja aikataulun suunnittelussa.",
  groupsCta: "Kysy tarjousta",
  atmosphereTitle: "Tunnelma",
  atmosphereLead: "Tummaa puuta, pehmeää valoa, tilaa hengittää.",
  hoursTitle: "Aukiolo",
  hours: [
    { day: "Lounas Ti–Pe", time: "11:30–14:00" },
    { day: "Illallinen Ti–To", time: "17:00–23:00" },
    { day: "Pe–La", time: "17:00–00:00" },
    { day: "Su–Ma", time: "Suljettu" },
  ],
  addressLabel: "Osoite",
  address: "Bulevardi 12, 00120 Helsinki",
  phoneLabel: "Puhelin",
  phone: "+358 40 000 0000",
  giftTitle: "Lahjakortti",
  giftLead: "Anna illallinen, joka jää mieleen.",
  giftBody:
    "Digitaalinen lahjakortti 50–300 €. Voimassa vuoden — lunastetaan varauksen yhteydessä. Demoesimerkki.",
  giftCta: "Osta lahjakortti",
  footerCredit: "Suunniteltu esittelyksi Restadigille",
  footerDemo: "Esimerkkisivusto · ei oikea ravintola",
};

const en: ShowcaseCopy = {
  metaTitle: "Maison Aurelia — Restadigi showcase",
  metaDescription:
    "Maison Aurelia: modern fine dining in Helsinki. Reserve a table online — a Restadigi showcase site.",
  demoRibbon: "Restadigi showcase · sample restaurant website",
  openPanel: "Open dashboard",
  lang: "Language",
  nav: {
    about: "About",
    menu: "À la carte",
    lunch: "Lunch",
    groups: "Groups & events",
    contact: "Contact & hours",
    reserve: "Reserve",
    gift: "Gift card",
  },
  heroEyebrow: "Helsinki · Bulevardi",
  heroTitle: "An evening worth remembering",
  heroLead:
    "Seasonal flavours, a calm dining room and service that feels personal — reserve your table in seconds.",
  heroCta: "Reserve a table",
  heroScroll: "Explore",
  experienceTitle: "Our house",
  experienceLead: "Quiet luxury, precise cooking.",
  experienceBody:
    "Maison Aurelia brings northern produce and European craft together. Dinner is a whole: light, pace, flavour and company — big flavours without unnecessary formality.",
  foodTitle: "Food",
  foodLead: "The best ingredients, made with passion.",
  foodBody:
    "We don’t stick to one style — we mix influences boldly. The menu always has options for vegetable, fish and meat lovers. Mention dietary needs when booking.",
  menuTitle: "À la carte",
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
  menuNote: "Full menu and allergens are presented in the room.",
  lunchTitle: "Lunch",
  lunchLead: "Weekday lunch, carefully made.",
  lunchBody:
    "Tuesday to Friday we serve a changing lunch set — a proper break without the rush.",
  lunchItems: [
    { name: "Soup of the day", desc: "Seasonal vegetables, herb oil", price: "9 €" },
    { name: "Lunch main", desc: "Fish or vegetables — changes daily", price: "16 €" },
    { name: "Coffee & sweet", desc: "Espresso and a small dessert", price: "6 €" },
  ],
  drinksTitle: "Drinks",
  drinksLead: "Match made in Maison.",
  drinksBody:
    "Wines from around the world, cocktails and thoughtful alcohol-free options — drinks crown the dinner.",
  groupsTitle: "Groups & events",
  groupsLead: "Private dinner, company event or celebration.",
  groupsBody:
    "The room suits groups of 8–28. We help plan the menu, drinks and timing.",
  groupsCta: "Request a quote",
  atmosphereTitle: "Atmosphere",
  atmosphereLead: "Dark wood, soft light, room to breathe.",
  hoursTitle: "Hours",
  hours: [
    { day: "Lunch Tue–Fri", time: "11:30–14:00" },
    { day: "Dinner Tue–Thu", time: "17:00–23:00" },
    { day: "Fri–Sat", time: "17:00–00:00" },
    { day: "Sun–Mon", time: "Closed" },
  ],
  addressLabel: "Address",
  address: "Bulevardi 12, 00120 Helsinki",
  phoneLabel: "Phone",
  phone: "+358 40 000 0000",
  giftTitle: "Gift card",
  giftLead: "Give an evening to remember.",
  giftBody:
    "Digital gift cards from 50–300 €. Valid for one year — redeemed when booking. Demo example.",
  giftCta: "Buy a gift card",
  footerCredit: "Designed as a Restadigi showcase",
  footerDemo: "Sample website · not a real restaurant",
};

const es: ShowcaseCopy = {
  metaTitle: "Maison Aurelia — Restadigi showcase",
  metaDescription:
    "Maison Aurelia: fine dining moderno en Helsinki. Reserva mesa online — web de muestra Restadigi.",
  demoRibbon: "Muestra Restadigi · ejemplo de web de restaurante",
  openPanel: "Abrir panel",
  lang: "Idioma",
  nav: {
    about: "Nosotros",
    menu: "À la carte",
    lunch: "Menú del día",
    groups: "Grupos y eventos",
    contact: "Contacto y horario",
    reserve: "Reservar",
    gift: "Tarjeta regalo",
  },
  heroEyebrow: "Helsinki · Bulevardi",
  heroTitle: "Una cena que se recuerda",
  heroLead:
    "Sabores de temporada, un salón sereno y un servicio cercano — reserva tu mesa en segundos.",
  heroCta: "Reservar mesa",
  heroScroll: "Descubrir",
  experienceTitle: "Nuestra casa",
  experienceLead: "Lujo discreto, cocina precisa.",
  experienceBody:
    "Maison Aurelia une producto nórdico y oficio europeo. La cena es un conjunto: luz, ritmo, sabor y compañía — sabores generosos sin formalidades innecesarias.",
  foodTitle: "Comida",
  foodLead: "Los mejores ingredientes, con pasión.",
  foodBody:
    "No nos ceñimos a un solo estilo — mezclamos influencias con valentía. Siempre hay opciones vegetales, de pescado y de carne. Indica dietas especiales al reservar.",
  menuTitle: "À la carte",
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
  menuNote: "La carta completa y alérgenos se presentan en sala.",
  lunchTitle: "Menú del día",
  lunchLead: "Comida de diario, hecha con cuidado.",
  lunchBody:
    "De martes a viernes ofrecemos un menú cambiante — una pausa sin prisas.",
  lunchItems: [
    { name: "Sopa del día", desc: "Verduras de temporada, aceite de hierbas", price: "9 €" },
    { name: "Plato principal", desc: "Pescado o verduras — cambia a diario", price: "16 €" },
    { name: "Café y dulce", desc: "Espresso y un pequeño postre", price: "6 €" },
  ],
  drinksTitle: "Bebidas",
  drinksLead: "Match made in Maison.",
  drinksBody:
    "Vinos del mundo, cócteles y opciones sin alcohol — la bebida corona la cena.",
  groupsTitle: "Grupos y eventos",
  groupsLead: "Cena privada, evento de empresa o celebración.",
  groupsBody:
    "El salón encaja con grupos de 8–28. Ayudamos con el menú, bebidas y horarios.",
  groupsCta: "Pedir presupuesto",
  atmosphereTitle: "Ambiente",
  atmosphereLead: "Madera oscura, luz suave, espacio para respirar.",
  hoursTitle: "Horario",
  hours: [
    { day: "Comida mar–vie", time: "11:30–14:00" },
    { day: "Cena mar–jue", time: "17:00–23:00" },
    { day: "Vie–sáb", time: "17:00–00:00" },
    { day: "Dom–lun", time: "Cerrado" },
  ],
  addressLabel: "Dirección",
  address: "Bulevardi 12, 00120 Helsinki",
  phoneLabel: "Teléfono",
  phone: "+358 40 000 0000",
  giftTitle: "Tarjeta regalo",
  giftLead: "Regala una cena para recordar.",
  giftBody:
    "Tarjetas digitales de 50–300 €. Válidas un año — se canjean al reservar. Ejemplo de demo.",
  giftCta: "Comprar tarjeta",
  footerCredit: "Diseñado como muestra de Restadigi",
  footerDemo: "Web de ejemplo · no es un restaurante real",
};

export const SHOWCASE_COPY: Record<Locale, ShowcaseCopy> = { fi, en, es };

export function getShowcaseCopy(locale: Locale): ShowcaseCopy {
  return SHOWCASE_COPY[locale] ?? SHOWCASE_COPY.fi;
}
