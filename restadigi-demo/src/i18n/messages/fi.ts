import type { Messages } from "./types";
import {
  CONTACT_ADDRESS,
  CONTACT_COMPANY,
  CONTACT_EMAIL,
  CONTACT_PERSON,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_DISPLAY,
} from "@/lib/company-contact";

const siteIntroBullet =
  "Selkeät ja houkuttelevat perustekstit etusivulle, palveluille ja yhteystiedoille – avaimet käteen paketti ja kattava käyttökoulutus";

const siteSharedBullets = [
  "Helppokäyttöinen hallintapaneeli, jolla voit päivittää sisältöjä itse",
  "Responsiivinen toteutus, joka toimii erinomaisesti niin mobiilissa, tabletissa kuin tietokoneellakin",
  "Integroitu yhteydenottolomake, jonka avulla asiakkaasi tavoittavat sinut helposti",
  "Perus-SEO-optimointi, joka sisältää meta-tiedot, sivukartan ja sivuston suorituskyvyn optimoinnin",
  "Nopea toimitus – verkkosivusto valmiina jopa 5 arkipäivässä",
  "30 päivän asiakastuki julkaisun jälkeen mahdollisia kysymyksiä ja pieniä muutoksia varten",
];

const withSitePages = (pagesBullet: string, extras: string[] = []) => [
  siteIntroBullet,
  pagesBullet,
  ...siteSharedBullets,
  ...extras,
];

export const fi: Messages = {
  meta: {
    defaultTitle: "Restadigi — Kotisivut ja diginäkyvyys yrityksille",
    defaultDescription:
      "Restadigi rakentaa moderneja kotisivuja ja vahvistaa yritysten diginäkyvyyttä. Uuden teknologian avulla sivut valmistuvat nopeasti ja niitä on helppo päivittää.",
    ogTitle: "Restadigi — Kotisivut ja diginäkyvyys yrityksille",
    ogDescription: "Modernit kotisivut, SEO ja diginäkyvyyden palvelut yrityksesi kasvun tueksi.",
  },
  notFound: {
    code: "404",
    title: "Sivua ei löytynyt",
    description: "Etsimääsi sivua ei ole olemassa tai se on siirretty.",
    goHome: "Etusivulle",
  },
  error: {
    title: "Sivu ei latautunut",
    description:
      "Jokin meni pieleen meidän päässämme. Voit yrittää uudelleen tai palata etusivulle.",
    tryAgain: "Yritä uudelleen",
    goHome: "Etusivulle",
  },
  header: {
    services: "Palvelut",
    industries: "Toimialat",
    pricing: "Hinnasto",
    languages: "Kielet",
    contact: "Ota yhteyttä",
    menu: "Valikko",
    homeAria: "Restadigi — etusivu",
    logoAlt: "Restadigi Finland",
    industriesIntro:
      "Toimialakohtaiset digiratkaisut — verkkosivut, varaukset, näkyvyys ja AI-asiakaspalvelu palvelualan yrityksille.",
    industriesList: [
      {
        title: "Areenat, tapahtumat ja esiintyjät",
        body: "Verkkosivut, diginäkyvyys sekä lippu- ja myyntiratkaisut, jotka tuovat fanit, liput ja esiintyjät yhteen — selkeästi ja brändin mukaisesti.",
      },
      {
        title: "Hotellit ja hostellit",
        body: "Varausten hallinta ja myynti, digitaalinen check-in sekä matkustajarekisteröinti, AI-asiakaspalvelu 24/7 — majoitustoiminnan digitaalinen selkäranka.",
      },
      {
        title: "Matkailu ja aktiviteetit",
        body: "Varausjärjestelmät, näkyvyys- ja myyntiratkaisut sekä AI-asiakaspalvelu, joilla aktiviteetit ja elämykset löytyvät ja varataan helposti.",
      },
      {
        title: "Ravintolat",
        body: "Fine diningista fast foodiin: verkkosivut, mobiiliapplikaatiot, pöytävaraukset ja AI-asiakaspalvelu — myynti ja palvelu ympäri vuorokauden.",
      },
      {
        title: "Kahvilat ja kioskit",
        body: "Tyylikkäät verkkosivut ja mobiiliapplikaatio kanta-asiakasohjelmalla — brändi, toistot ja asiakassuhde samassa kokonaisuudessa.",
      },
      {
        title: "Kuntosalit ja personal trainerit",
        body: "Kustomoitu treeniaikataulujen hallintapaneeli — varaukset, aikataulut ja asiakasviestintä yhdessä selkeässä näkymässä.",
      },
      {
        title: "Parturit, kampaamot ja hoitolapalvelut",
        body: "Modernit verkkosivut ja ajanvaraus, joilla palvelusi näkyvät, varataan ja myydään ilman turhaa puhelinkierrosta.",
      },
    ],
    servicesList: [
      { to: "/verkkosivut", label: "Verkkosivut" },
      { to: "/nakyvyys-ja-suunnittelu", label: "Näkyvyys ja suunnittelu" },
      { to: "/ai-asiakaspalvelu", label: "AI-asiakaspalvelu" },
      { to: "/poytavaraupalvelu", label: "Pöytävarauspalvelu" },
      { to: "/yllapito", label: "Ylläpito" },
    ],
    languagesList: [
      { code: "fi", label: "Suomi" },
      { code: "en", label: "English" },
      { code: "es", label: "Español" },
    ],
    contactPanel: {
      company: CONTACT_COMPANY,
      person: CONTACT_PERSON,
      address: CONTACT_ADDRESS,
      emailLabel: "Sähköposti",
      email: CONTACT_EMAIL,
      phoneLabel: "Puhelin",
      whatsappLabel: "WhatsApp",
      phoneDisplay: CONTACT_PHONE_DISPLAY,
      phoneTel: CONTACT_PHONE_TEL,
      whatsappDisplay: CONTACT_WHATSAPP_DISPLAY,
    },
  },
  footer: {
    copyright: "© {year} Restadigi",
  },
  home: {
    meta: {
      title: "Restadigi — Älykkäät verkkosivut ja digitaaliset ratkaisut palvelualan yrityksille",
      description:
        "Rakennamme verkkosivuja, mobiiliapplikaatioita ja muita älykkäitä digitaalisia ratkaisuja palvelualan yrityksille — sisältäen varausjärjestelmät, asiakaspalvelun ja myynnin.",
      ogTitle: "Restadigi — Älykäs verkkosivusto, joka palvelee asiakkaitasi",
      ogDescription:
        "Verkkosivut, mobiiliapplikaatiot ja älykkäät digitaaliset ratkaisut palvelualan yrityksille.",
    },
    hero: {
      titleBefore: "Älykäs verkkosivusto, joka ",
      titleAccent: "palvelee asiakkaitasi 24/7",
      titleAfter: ".",
      description:
        "Rakennamme verkkosivuja, mobiiliapplikaatioita ja muita älykkäitä digitaalisia ratkaisuja palvelualan yrityksille. Nopea ja kustannustehokas palvelukokonaisuus sisältäen verkkosivut, varausjärjestelmät, asiakaspalvelun ja myynnin.",
      cta: "Pyydä tarjous",
    },
    sitePreview: {
      navMenu: "Menu",
      navHours: "Aukiolo",
      navContact: "Yhteys",
      tagline: "Helsinki · Kahvila",
      openBadge: "Auki tänään 8–18",
      bookTable: "Tilaa noutona",
      customerService: "Asiakaspalvelu",
      tileSpecialMenus: "Espresso",
      tileEvents: "Latte",
      tileGroups: "Brunch",
    },
    barberPreview: {
      brand: "Freddos",
      menu: "Valikko",
      tagline: "Kahvila · Take away",
      headline: "Tuoreena kuppiin.",
      bookCta: "Tilaa",
      bookShort: "Tilaa",
      services: ["Espresso", "Ice latte", "Brunch"],
    },
    intro: {
      titleLine1: "Toimialakohtaiset ratkaisut.",
      titleLine2: "Ota yhteyttä, jutellaan lisää.",
      body: "Haluamme tutustua yrityksesi toimintaan mahdollisimman tarkasti ymmärtääksemme miten voimme palvella teitä parhaiten. Aloitamme kaikki projektit vähintään 30 minuutin pituisella tutustumispuhelulla. Varaa alta aika puhelulle tai soittele meille vaikka ihan suoraan itse, niin katsotaan teille optimaalinen palveluratkaisu yhdessä.",
      callCta: "Soita meille",
      phoneDisplay: CONTACT_PHONE_DISPLAY,
      phoneTel: CONTACT_PHONE_TEL,
      whatsappCta: "WhatsApp-puhelu",
      bookCta: "Varaa aika →",
    },
    whyUs: {
      titleBefore: "Miksi valita ",
      titleAccent: "meidät",
      titleAfter: "?",
      description:
        "Asiakkaamme arvostavat toimialaymmärrystä, järkevää hinnoittelua ja digiratkaisuja, jotka kasvavat liiketoiminnan mukana.",
      items: [
        {
          title: "Liiketoimintaymmärrys",
          body: "Pitkä yrittäjätaustamme majoitus-, matkailu- ja ravintola-alalla auttaa meitä ymmärtämään yrityksesi liiketoimintaa kokonaisvaltaisesti. Haluamme kasvattaa myyntiäsi heti ja jatkaa kasvamista kanssanne digiliiketoimintakumppanina.",
          href: "/yhteys",
          linkLabel: "Varaa tutustumispuhelu",
        },
        {
          title: "Edullisuus",
          body: "Palvelualan kulurakenne on nousussa ja uusien asiakkaiden löytäminen voi olla haastavaa ja kallista. Tekoälyn ansioista tuotamme palveluita järkevään hintaan laadusta tinkimättä — markkinoiden parhaalla hinta–laatusuhteella.",
          href: "/verkkosivut",
          linkLabel: "Katso paketit",
        },
        {
          title: "Automatisoitua liiketoimintaa",
          body: "AI-asiakaspalvelubotti hoitaa puolestasi asiakaspalvelua, varausten vastaanottoa chatissa, puhelimessa ja sähköpostitse 24/7. Kiinteään vuosihintaan alk. 199 € / vuosi.",
          href: "/ai-asiakaspalvelu",
          linkLabel: "Tutustu AI-palveluun",
        },
        {
          title: "Vaivatonta sisällönhallintaa",
          body: "Päivitä menu, hinnasto, aukioloajat ja kuvat omasta hallintapaneelistasi. Sisältöjen ylläpito sujuu itsenäisesti muutamalla klikkauksella — ilman teknistä osaamista.",
          href: "/verkkosivut",
          linkLabel: "Lue lisää",
        },
      ],
    },
    serviceTeasers: {
      title: "Älykkäät palvelut",
      items: [
        {
          title: "AI-asiakaspalvelu",
          body: "Chatbot palvelee asiakkaitasi 24/7 — vastaa kysymyksiin, kerää liidejä ja vapauttaa henkilökunnan.",
          href: "/ai-asiakaspalvelu",
          linkLabel: "Tutustu chatbottiin",
        },
        {
          title: "Pöytävarauspalvelu",
          body: "Asiakkaat varaavat pöydän suoraan sivustoltasi ympäri vuorokauden — hallinta tabletilla ja mobiilissa.",
          href: "/poytavaraupalvelu",
          linkLabel: "Tutustu varauspalveluun",
        },
      ],
    },
    bookingPromo: {
      title: "Pöytävarauspalvelu ravintoloille",
      body: "Kiinteän vuosihintaan — alk. 299 € / vuosi.",
      linkLabel: "Lue lisää",
    },
    projects: {
      titleBefore: "Valikoidut ",
      titleAccent: "projektit",
      delfin: {
        logoAlt: "Delfin Check-In -sovelluksen logo",
        screenAlt: "Delfin Check-In -sovelluksen näkymä",
        calendarAlt: "Delfin Check-In -sovelluksen kalenterinäkymä",
        title: "Delfin Check-In",
        titleAccent: "— palvelu & mobiiliapplikaatio",
        platforms: "App Store & Google Play",
        body: "Majoituspalveluiden check-in- ja matkustajarekisteröintisovellus vuokranantajille ja majoitusyrityksille. Sovellus synkronoi varaukset, hallinnoi vieraita ja hoitaa viranomaisraportoinnin — saatavilla Applen ja Googlen sovelluskaupoissa.",
        link: "Katso App Storessa →",
      },
      rafa: {
        heroAlt: "Rafa Romera -muusikon sivusto",
        logoAlt: "Rafa Romera -logo",
        title: "Rafa Romera",
        titleAccent: "— sivusto & Spotify-integraatio",
        tag: "Artistisivusto",
        body: "Andalusialaisen muusikon Rafa Romeran verkkosivusto Spotify-integraatiolla — biografia, discografia, galleria ja tulevat konsertit yhdessä kokonaisuudessa, joka ohjaa kuulijat suoraan kuuntelemaan.",
        link: "Avaa sivusto →",
      },
    },
    cta: {
      titleBefore: "Valmis ottamaan ",
      titleAccent: "seuraavan askeleen",
      titleAfter: "?",
      quoteCta: "Pyydä tarjous",
      callCta: "Soita meille →",
      whatsappCta: "WhatsApp →",
    },
  },
  contact: {
    meta: {
      title: "Ota yhteyttä — Restadigi",
      description: `Kerro projektistasi, palaamme asiaan yhden arkipäivän kuluessa. ${CONTACT_EMAIL}`,
      ogTitle: "Ota yhteyttä — Restadigi",
      ogDescription: "Kerro projektistasi — palaamme asiaan yhden arkipäivän kuluessa.",
    },
    hero: {
      titleBefore: "Kerro ",
      titleAccent: "projektistasi",
      titleAfter: ".",
      description:
        "Vastaamme yleensä yhden arkipäivän sisällä. Voit myös laittaa suoraan sähköpostia tai varata lyhyen puhelun.",
    },
    labels: {
      email: "Sähköposti",
      phone: "Puhelin",
      whatsapp: "WhatsApp",
      studio: "Osoite",
      person: "Yhteyshenkilö",
    },
    email: CONTACT_EMAIL,
    phoneDisplay: CONTACT_PHONE_DISPLAY,
    phoneTel: CONTACT_PHONE_TEL,
    whatsappDisplay: CONTACT_WHATSAPP_DISPLAY,
    studioLine1: CONTACT_ADDRESS,
    studioLine2: CONTACT_COMPANY,
    person: CONTACT_PERSON,
    form: {
      name: "Nimi",
      company: "Yritys",
      email: "Sähköposti",
      budget: "Budjetti",
      message: "Viesti",
      messagePlaceholder: "Kerro projektista, aikataulusta ja tavoitteista…",
      selectPlaceholder: "Valitse…",
      submit: "Lähetä viesti",
      sending: "Avataan sähköpostiohjelmaa…",
      budgetOptions: [
        "Alle 1 000 €",
        "1 000 – 2 500 €",
        "2 500 – 5 000 €",
        "Yli 5 000 €",
        "En osaa vielä sanoa",
      ],
      mailSubject: "Projektikysely — {name}",
      mailBody:
        "Nimi: {name}\nYritys: {company}\nSähköposti: {email}\nBudjetti: {budget}\n\nViesti:\n{message}",
    },
  },
  pricing: {
    meta: {
      title: "Hinnasto — Restadigi",
      description:
        "Restadigin palveluiden hinnasto: verkkosivut, diginäkyvyys, graafinen suunnittelu ja hosting.",
      ogTitle: "Hinnasto — Restadigi",
      ogDescription:
        "Selkeät pakettihinnat verkkosivuille, näkyvyydelle, graafiselle suunnittelulle ja hostingille.",
    },
    eyebrow: "Hinnasto",
    titleBefore: "Selkeät ",
    titleAccent: "hinnat",
    titleAfter: " ilman yllätyksiä.",
    lead: "Kooste pakettihinnoista. Tutustu tuotteiden palvelusivuilla pakettien tarkempaan sisältöön.",
    sections: {
      websites: "Verkkosivut",
      visibility: "Diginäkyvyys",
      branding: "Graafinen suunnittelu",
      hosting: "Hosting & ylläpito",
    },
    seeMore: "Tutustu palveluun",
    vatNote: "Hinnat ilmoitetaan ilman arvonlisäveroa, ellei toisin mainita.",
  },
  about: {
    meta: {
      title: "Meistä — Restadigi",
      description:
        "Restadigi on pieni studio, joka rakentaa kotisivuja ja vahvistaa yritysten diginäkyvyyttä. Tutustu tapaamme tehdä työtä.",
      ogTitle: "Meistä — Restadigi",
      ogDescription:
        "Pieni studio, iso vastuu. Kotisivuja ja diginäkyvyyttä suomalaisille yrityksille.",
    },
    eyebrow: "Meistä",
    titleBefore: "Pieni studio, ",
    titleAccent: "iso",
    titleAfter: " vastuu.",
    lead: "Restadigi on itsenäinen digistudio, joka rakentaa kotisivuja ja vahvistaa pienten ja keskisuurten yritysten diginäkyvyyttä. Käytämme uusinta teknologiaa, jotta sivut valmistuvat nopeasti, toimivat kaikilla laitteilla ja ovat helposti päivitettävissä.",
    secondary:
      "Työskentelemme mielellämme pitkäjänteisesti: samat kädet, jotka suunnittelevat sivustosi, auttavat myös sen näkyvyyden ja kehittämisen kanssa eteenpäin.",
    imageAlt: "Kokki valmistaa annosta ravintolan keittiössä",
    values: [
      {
        titleAccent: "Käsityönä",
        titleRest: "tehty",
        body: "Ei mallipohjia. Jokainen projekti suunnitellaan alusta asti tavoitteidesi mukaan.",
      },
      {
        titleAccent: "Läpinäkyvä",
        titleRest: "hinnoittelu",
        body: "Selkeät paketit ja lisäpalvelut — tiedät mistä maksat, alusta loppuun.",
      },
      {
        titleAccent: "Pitkäjänteinen",
        titleRest: "kumppanuus",
        body: "Autamme myös julkaisun jälkeen — päivityksissä, kehityksessä ja ylläpidossa.",
      },
    ],
    process: {
      titleBefore: "Neljä ",
      titleAccent: "askelta",
      titleAfter: " valmiiseen sivustoon.",
      steps: [
        {
          n: "01",
          title: "Keskustelu",
          body: "Kartoitetaan tavoitteet, kohderyhmä ja aikataulu yhdessä.",
        },
        {
          n: "02",
          title: "Suunnittelu",
          body: "Rakenne, visuaalinen ilme ja sisältö hiotaan iteratiivisesti.",
        },
        {
          n: "03",
          title: "Toteutus",
          body: "Rakennamme sivuston hakukoneoptimoituna ja saavutettavana.",
        },
        {
          n: "04",
          title: "Julkaisu & tuki",
          body: "Julkaisu, koulutus hallintapaneelin käyttöön ja jatkotuki.",
        },
      ],
    },
    cta: {
      titleBefore: "Kuulostaako ",
      titleAccent: "yhteistyö",
      titleAfter: " hyvältä?",
      button: "Ota yhteyttä",
    },
  },
  websites: {
    meta: {
      title: "Kotisivut yrityksille — Restadigi",
      description:
        "Selkeät ja vaikuttavat kotisivupaketit ja graafiset lisäpalvelut yrityksille ja yhdistyksille.",
      ogTitle: "Kotisivut yrityksille — Restadigi",
      ogDescription: "Kotisivupaketit ja graafiset lisäpalvelut yrityksesi tarpeisiin.",
    },
    hero: {
      titleBefore: "Verkkosivut ",
      titleAccent: "yritykselle",
      titleAfter: ".",
      description:
        "Hyvin suunnitellut verkkosivut ja verkkosisällöt ovat yrityksesi tärkeimmät digitaaliset työkalut. Ne vahvistavat brändisi näkyvyyttä, helpottavat asiakkaiden yhteydenottoa ja jättävät vahvan ensivaikutelman.",
      promo: "alk. 399€",
      promoLine1: "alk.",
      promoLine2: "399€",
      phoneShop: {
        brand: "Freddo's",
        product: "Ice latte",
        price: "5,90 €",
        addToCart: "Lisää koriin",
      },
    },
    midBanner: {
      title: "Matkasi huippunäkyvyyksille alkaa tästä!",
      description:
        "Tutustu alta paketteihin, joilla nostat yrityksesi verkkonäkyvyyden uudelle tasolle.",
      imageAlt: "Lisää kävijöitä ja varauksia",
    },
    popular: "Suosittu",
    requestQuote: "Pyydä tarjous",
    explore: "Tutustu",
    packagesTitle: "Verkkosivupaketit",
    packages: [
      {
        name: "Start",
        tagline: "Yksinkertainen mutta vaikuttava sivusto pienyritykselle",
        summary:
          "Selkeä 1–3-sivuinen kokonaisuus, joka kertoo yrityksestäsi heti. Sopii pienelle toimijalle, joka haluaa ammattimaisen verkkonäkyvyyden ilman turhaa monimutkaisuutta.",
        price: "399 € + alv",
        bullets: withSitePages("Ammattimainen 1–3-sivuinen verkkosivusto yrityksesi tarpeisiin"),
      },
      {
        name: "Plus",
        tagline: "Tyylikäs kokonaisuus, joka esittelee palvelusi selkeästi",
        summary:
          "4–6 sivua palveluille, yhteystiedoille ja vahvalle ensivaikutelmalle. Esittelee tarjontasi selkeästi ja ohjaa kävijän helposti yhteydenottoon.",
        price: "549 € + alv",
        bullets: withSitePages("Ammattimainen 4–6-sivuinen verkkosivusto yrityksesi tarpeisiin"),
      },
      {
        name: "Kulta",
        tagline: "7–9 sivua ja AI-asiakaspalvelu 1 vuodeksi",
        summary:
          "Laajempi sivusto kasvavalle yritykselle. Sisältää AI-asiakaspalvelun vuodeksi — botti vastaa kysymyksiin ja kerää liidejä myös silloin, kun et itse ole paikalla.",
        price: "759 € + alv",
        bullets: withSitePages("Ammattimainen 7–9-sivuinen verkkosivusto yrityksesi tarpeisiin", [
          "AI-asiakaspalvelu (chatbot) sisältyy 1 vuodeksi — vastaa asiakkaille 24/7 ja kerää liidejä",
        ]),
      },
      {
        name: "Timantti",
        tagline: "Yli 10 sivua, AI-asiakaspalvelu ja valitsemasi varauspalvelu 1 vuodeksi",
        summary:
          "Kattavin paketti: yli 10 sivua, AI-asiakaspalvelu ja valitsemasi varauspalvelu vuodeksi. Sopii, kun haluat myynnin ja palvelun toimivan verkossa ympäri vuorokauden.",
        price: "929 € + alv",
        featured: true,
        bullets: withSitePages(
          "Ammattimainen yli 10-sivuinen verkkosivusto yrityksesi tarpeisiin",
          [
            "AI-asiakaspalvelu (chatbot) sisältyy 1 vuodeksi — vastaa asiakkaille 24/7 ja kerää liidejä",
            "Valitsemasi varauspalvelu 1 vuodeksi — esim. pöytävaraus-, majoitusvaraus- tai parturin ajanvarauspalvelu",
          ],
        ),
      },
    ],
    footnoteBefore: "Pakettihinnat ovat kiinteitä. Verkkotunnus ja hosting valitaan erikseen ",
    footnoteLink: "ylläpitopalveluista",
    footnoteAfter:
      ". Voit myös ostaa domainin ja verkkohotellin itse tai käyttää jo olemassa olevaa domainia.",
    process: {
      title: "Verkkosivujen ostoprosessi — 8 askelta",
      steps: [
        {
          title: "Tarpeiden kartoitus",
          body: "Prosessi alkaa asiakkaan tavoitteiden ja verkkosivuston käyttötarkoituksen selvittämisellä. Samalla määritellään sivuston sisältö, ominaisuudet sekä projektin aikataulu.",
        },
        {
          title: "Sopivan paketin valinta",
          body: "Asiakas valitsee yritykselleen parhaiten sopivan verkkosivuratkaisun. Tarvittaessa valintaan voidaan yhdistää lisäpalveluita, kuten hakukoneoptimointi tai sisällöntuotanto.",
        },
        {
          title: "Tilauksen vahvistaminen",
          body: "Kun palvelu on valittu, tilaus vahvistetaan ja projekti käynnistyy. Samalla sovitaan käytännön asioista sekä toimitetaan tarvittavat materiaalit.",
        },
        {
          title: "Sivuston suunnittelu",
          body: "Restadigi suunnittelee verkkosivujen rakenteen, ulkoasun ja käyttökokemuksen asiakkaan toiveiden sekä yrityksen ilmeen mukaisesti.",
        },
        {
          title: "Verkkosivujen toteutus",
          body: "Suunnitelman pohjalta rakennetaan toimiva ja responsiivinen verkkosivusto, joka toimii sujuvasti niin tietokoneilla kuin mobiililaitteillakin.",
        },
        {
          title: "Asiakkaan tarkistus ja palautteet",
          body: "Valmis luonnos esitellään asiakkaalle. Mahdolliset muutostoiveet käydään läpi ja toteutetaan ennen julkaisua.",
        },
        {
          title: "Julkaisu verkkoon",
          body: "Kun sivusto on hyväksytty, se julkaistaan valittuun verkkotunnukseen ja varmistetaan, että kaikki toimii moitteettomasti.",
        },
        {
          title: "Jatkuva tuki ja kehitys",
          body: "Julkaisun jälkeen Restadigi tarjoaa tarvittaessa ylläpitoa, päivityksiä ja kehityspalveluita, jotta verkkosivut pysyvät ajan tasalla ja tukevat yrityksen kasvua.",
        },
      ],
    },
  },
  visibility: {
    meta: {
      title: "Diginäkyvyys — Restadigi",
      description:
        "Diginäkyvyytesi kerralla kuntoon: AI-optimointi, Google-optimointi ja huippu-urheilun näkyvyyspaketti.",
      ogTitle: "Diginäkyvyys — Restadigi",
      ogDescription:
        "Kolme tapaa kasvattaa näkyvyyttä: AI-optimointi, Google-optimointi ja huippu-urheilun näkyvyyspaketti.",
    },
    hero: {
      brand: "Restadigi",
      headlineLine1: "Laitetaanko näkyvyydet",
      headlineLine2: "kerralla kuntoon?",
      searchPlaceholder: "Haku",
      searchAriaLabel: "Hae diginäkyvyydestä",
    },
    popular: "Suosittu",
    contactCta: "Ota yhteyttä",
    resultPrefix: "Saat:",
    explore: "Tutustu",
    packagesTitle: "Näkyvyyspaketit",
    packages: [
      {
        name: "AI-optimointi",
        tagline: "Näkyväksi myös ChatGPT:n, Clauden, Geminin ja Copilotin hauissa",
        summary:
          "Yhä useampi etsii palveluita tekoälyn kautta. Varmistamme, että yrityksesi tiedot ja sisältö tukevat näkyvyyttä ChatGPT:ssä, Claudessa, Geminissä ja Copilotissa — vuodesta toiseen.",
        description:
          "Verkkohaku on muuttumassa. Yhä useampi etsii yrityksiä, tuotteita ja palveluita keskustelemalla tekoälyn kanssa. AI-optimointipalvelumme auttaa varmistamaan, että yrityksesi tiedot ovat ajan tasalla ja että verkkosivustosi sisältö tukee tekoälypalveluiden kykyä tunnistaa yrityksesi oikeassa yhteydessä.",
        price: "alk. 99 € / vuosi",
        bullets: [
          "Yrityksen verkkosivujen perustason AI-näkyvyyden tarkistus",
          "Tärkeimpien yritystietojen läpikäynti",
          "Keskeisten sisältöjen ja metatietojen perusoptimoinnin suositukset",
          "Rakenteellisten puutteiden tunnistaminen",
          "Vuosittainen tarkistus ja päivitys",
        ],
        result: "Yrityksesi on mukana myös tulevaisuuden hauissa.",
      },
      {
        name: "Google-optimointi",
        tagline: "Varmista, että asiakkaat löytävät yrityksesi",
        summary:
          "Google on edelleen tärkein kanava, kun asiakas etsii yritystä. Pidämme sivustosi SEO-perusteet kunnossa vuosittain, jotta löydettävyys ei pääse rapistumaan.",
        description:
          "Google on edelleen yksi tärkeimmistä kanavista, kun etsitään yrityksiä, tuotteita ja palveluita. Google-optimointipalvelumme on kevyt vuosittainen ylläpitopalvelu, jonka tavoitteena on varmistaa, että verkkosivustosi täyttää tärkeimmät hakukoneoptimoinnin perusvaatimukset ja tukee asiakkaiden löydettävyyttä.",
        price: "alk. 99 € / vuosi",
        bullets: [
          "Verkkosivujen perustason SEO-tarkistus",
          "Sivujen otsikoiden ja metakuvausten läpikäynti",
          "Yrityksen tärkeimpien hakusanojen arviointi",
          "Teknisten perusasioiden tarkistus",
          "Kehitysehdotukset näkyvyyden parantamiseksi",
          "Vuosittainen tarkistus ja päivitys",
        ],
        result: "Yrityksesi näkyvyys Googlessa pysyy ajan tasalla.",
      },
      {
        name: "Huippu-urheilun näkyvyyspaketti",
        tagline: "Näkyvyyttä Suomen suosituimmissa urheilusarjoissa",
        summary:
          "Näkyvyyttä Liigan, Veikkausliigan ja Superpesiksen yhteydessä. Edullinen mikrokumppanuus tuo brändisi katsomoon, digikanaviin ja verkostoitumistilaisuuksiin.",
        description:
          "Huippu-urheilu tarjoaa yrityksille ainutlaatuisen mahdollisuuden tavoittaa asiakkaita, vahvistaa brändiään ja rakentaa luotettavaa yrityskuvaa. Tarjoamme edullisia mikrokumppanuuksia Liigan, Veikkausliigan ja Superpesiksen seurojen kanssa.",
        price: "alk. 299 € / vuosi",
        featured: true,
        bullets: [
          "Kentänlaita- ja LED-mainosnäkyvyyttä otteluissa",
          "Näkyvyyttä areenoiden mediatauluilla",
          "Yritysesittelyn tai logon seuran verkkosivuilla",
          "Näkyvyyttä seuran digitaalisissa kanavissa",
          "Kutsuja kumppanitapaamisiin ja verkostoitumistilaisuuksiin",
          "Ottelulippuja asiakkaille tai henkilöstölle",
          "VIP-palveluja ja ottelutapahtumaelämyksiä",
          "Muita seurakohtaisia kumppanuusetuja",
        ],
        result:
          "Ammattimainen kumppanuus, näkyvyyttä tuhansille katsojille ja positiivista urheiluimagoa.",
      },
      {
        name: "Graafinen suunnittelu",
        tagline: "Yritysilme, logo ja markkinointimateriaalit",
        summary:
          "Logo, yritysilme ja markkinointimateriaalit yhdestä paikasta. Saat modernin, yhtenäisen visuaalisen ilmeen, joka toimii sekä verkossa että painetuissa materiaaleissa.",
        description: "Tuotteet yritysilmeen, mainosmateriaaleihin ja yksittäisiin design-töihin.",
        price: "alk. 99 €",
        bullets: [
          "Yritysilmeen suunnittelu — alk. 199 € (sis. logo ja käyntikortit)",
          "Mainos- ja markkinointimateriaalit — alk. 149 €",
          "Logon suunnittelu — alk. 149 €",
          "Käyntikorttien suunnittelu — alk. 99 €",
        ],
        result: "ammattimaisen ja modernin visuaalisen ilmeen yrityksellesi.",
      },
    ],
    footnote: "Hinnat ovat vuosihintoja. Maksat vain siitä, mitä tarvitset — ei piilokustannuksia.",
    branding: {
      titleBefore: "Graafinen ",
      titleAccent: "suunnittelu",
      titleAfter: ".",
      description: "Tuotteet yritysilmeen, mainosmateriaaleihin ja yksittäisiin design-töihin.",
      products: [
        {
          name: "Yritysilmeen suunnittelu",
          description:
            "Kokonaisvaltainen yritysilme, sisältää logon ja käyntikorttien suunnittelun.",
          price: "alk. 199 €",
        },
        {
          name: "Mainos- ja markkinointimateriaalit",
          price: "alk. 149 €",
        },
        {
          name: "Logon suunnittelu",
          price: "alk. 149 €",
        },
        {
          name: "Käyntikorttien suunnittelu",
          price: "alk. 99 €",
        },
      ],
      billing: {
        title: "Laskutuksesta",
        intro:
          "Noudatamme töissämme ennakkomaksukäytäntöä, jossa osa työstä veloitetaan jo ennen projektin alkua, kun tarjous on kirjallisesti hyväksytty. Tällä sitoutetaan sekä tilaaja että toimittaja projektiin.",
        providerLead: "Restadigi Finland -palvelun laskutuksesta Suomessa vastaa Laskuttamo.",
        providerName: "Laskuttamo",
        providerEmail: "asiakaspalvelu@laskuttamo.com",
        providerPhone: "02 0730 6710",
        providerHours: "ma–pe 8:00–16:00",
        providerSiteLabel: "laskuttamo.com",
        providerSiteUrl: "https://laskuttamo.com/",
        providerAddressNote: "Yhteystiedot ja osoitteet löytyvät Laskuttamon sivuilta.",
        groundsTitle: "Miksi ennakkomaksu?",
        groundsBody: [
          "Kun projekti käynnistyy, varaamme sille kalenteriaikaa. Jos tilaus peruuntuu kesken kaiken tai yhteydenpito katkeaa, menetämme mahdollisuuden ottaa muita toimeksiantoja samalle jaksolle. Ennakkomaksu toimii siksi varauksena, joka vahvistaa asiakkaan sitoutumisen.",
          "Luovassa työssä lopputulos — kuten logo tai visuaalinen ilme — syntyy usein vasta prosessin aikana. Ilman ennakkoa voisimme jäädä tilanteeseen, jossa lasku jää maksamatta, asiakas katoaa tai projekti keskeytyy. Pelkkä loppulaskutus voisi myös tarkoittaa viikkojen tai kuukausien työtä ilman kassavirtaa. Ennakkomaksu keventää näitä riskejä ja varmistaa, että saamme ainakin osan korvauksesta jo tehdystä työstä.",
        ],
      },
      form: {
        title: "Pyydä tarjous graafisen suunnittelun työstä tai kotisivuista",
        name: "Nimi",
        email: "Sähköposti",
        phone: "Puhelinnumero",
        submit: "Lähetä tarjouspyyntö",
        sending: "Avataan sähköposti…",
        mailSubject: "Tarjouspyyntö: graafinen suunnittelu / kotisivut — {name}",
        mailBody:
          "Nimi: {name}\nSähköposti: {email}\nPuhelin: {phone}\n\nPyydän tarjousta graafisen suunnittelun työstä tai kotisivuista.",
      },
    },
    cta: {
      titleBefore: "Haluatko paremman ",
      titleAccent: "näkyvyyden",
      titleAfter: "?",
      button: "Kysy näkyvyyspaketista",
    },
  },
  chatbot: {
    meta: {
      title: "AI-asiakaspalvelu — Restadigi",
      description:
        "Älykäs chatbot verkkosivustollesi — palvelee asiakkaita 24/7, vastaa kysymyksiin, kerää liidejä ja vapauttaa henkilökunnan.",
      ogTitle: "AI-asiakaspalvelu — Restadigi",
      ogDescription: "Chatbot verkkosivuille — ympärivuorokautinen myynti ja asiakaspalvelu.",
    },
    hero: {
      titleBefore: "Älykäs ",
      titleAccent: "asiakaspalvelu",
      titleAfter: " yrityksellesi.",
      description:
        "Restadigin chatbot asennetaan verkkosivuillesi ja palvelee asiakkaita ympäri vuorokauden — vastaa kysymyksiin, ohjaa oikeiden palveluiden pariin ja kerää liidejä.",
      headlineLine1: "Yrityksesi halvin työntekijä",
      headlineLine2: "on tässä.",
      subtitle: "Tutustu Restadigin personoitavaan chatbottiin.",
      cta: "Tutustu chatbottiin",
    },
    chatbot: {
      eyebrow: "Chatbot",
      titleBefore: "Älykäs ",
      titleAccent: "chatbot",
      titleAfter: " — ympärivuorokautinen myyjä ja asiakaspalvelija.",
      intro:
        "Chatbot on verkkosivuille asennettava älykäs virtuaaliavustaja, joka palvelee asiakkaita 24/7 — vastaa yleisiin kysymyksiin, opastaa oikeiden palveluiden pariin ja kerää liidejä. Se ei korvaa ihmistä, vaan toimii luotettavana apukätenä silloinkin, kun oma henkilökuntasi on vapaalla.",
      benefits: [
        {
          title: "Asiakaspalvelu 24/7",
          body: "Botti vastaa yleisimpiin kysymyksiin heti, jolloin asiakkaan ei tarvitse jonottaa tai etsiä tietoa.",
        },
        {
          title: "Tehokas liidien keräys",
          body: "Botti ohjaa vierailijan vaivattomasti eteenpäin ostopolulla ja kerää yhteystiedot talteen myös yöaikaan.",
        },
        {
          title: "Kasvanut konversio",
          body: "Yhteydenottokynnys on matala. Chatbotin avulla yhä suurempi osa kävijöistä muuttuu maksaviksi asiakkaiksi.",
        },
        {
          title: "Resurssien säästö",
          body: "Rutiininomaiset kysymykset siirtyvät botin hoidettavaksi ja vapauttavat aikaa vaativampiin työtehtäviin.",
        },
      ],
      safeTitleBefore: "Turvallinen ja ",
      safeTitleAccent: "vaivaton",
      safeTitleAfter: " ratkaisu.",
      safeBody:
        "Jotta chatbot tuottaa tulosta vuodesta toiseen, se vaatii jatkuvaa huolenpitoa. Vuosimaksullinen palvelumalli varmistaa, että botti kehittyy ja toimii saumattomasti yrityksen muuttuvan datan ja teknologian mukana — päivitämme alustan turvalliseksi, koulutamme botin uusilla tuotetiedoilla ja kampanjoilla, analysoimme keskusteluja ja optimoimme vastauksia. Sinun ei tarvitse huolehtia teknisestä ylläpidosta: asiantuntijamme pitävät huolen, että botti palvelee asiakkaitasi luotettavasti vuosi toisensa perään.",
      monthly: [
        {
          title: "Päivittyvä teknologia",
          body: "Verkkoympäristö ja tekoäly kehittyvät jatkuvasti. Vuosimaksulla varmistamme, että bottisi toimii aina uusimmalla ja turvallisimmalla alustalla.",
        },
        {
          title: "Sopii yrityksen omaan dataan",
          body: "Bottia voidaan opettaa. Vuosittainen ylläpito mahdollistaa botin kouluttamisen yrityksesi uusilla tuotetiedoilla, kampanjoilla ja vastauksilla.",
        },
        {
          title: "Proaktiivinen kehitys",
          body: "Analysoimme botin keskusteluhistoriaa ja optimoimme sen vastaamaan asiakkaidenne yleisimpiin tarpeisiin yhä paremmin.",
        },
        {
          title: "Avaimet käteen -palvelu",
          body: "Sinun ei tarvitse huolehtia teknisistä asennuksista tai koodauksesta. Asiantuntijamme vastaavat ylläpidosta.",
        },
      ],
    },
    cta: {
      titleBefore: "Palvele paremmin. Kerää liidejä. ",
      titleAccent: "Kasva tehokkaammin.",
      body: "Restadigi kehittää digitaalisia ratkaisuja palvelualan yrityksille. Chatbot auttaa parantamaan asiakaskokemusta, tehostamaan toimintaa ja kasvattamaan myyntiä helposti käyttöönotettavalla tekoälyratkaisulla.",
      questions: [
        "Mitkä ovat yleisimmät kysymykset, joita asiakkaanne esittävät?",
        "Haluatteko botin keskittyvän enemmän asiakaspalveluun vai myyntiin ja liidien keruuseen?",
        "Millä kielillä haluatte botin palvelevan kävijöitä?",
      ],
      price: "alk. 199 €",
      priceNote: "/ vuosi",
      button: "Pyydä maksuton esittely",
    },
  },
  booking: {
    meta: {
      title: "Pöytävarauspalvelu — Restadigi",
      description:
        "Moderni pöytävarauspalvelu ravintoloille — asiakkaat varaavat pöydän suoraan verkkosivuiltasi ympäri vuorokauden.",
      ogTitle: "Pöytävarauspalvelu — Restadigi",
      ogDescription: "Sujuvat pöytävaraukset suoraan ravintolasi verkkosivuilta.",
    },
    hero: {
      titleAccent: "Pöytävaraukset",
      titleAfter: " suoraan sivustolta.",
      description:
        "Integroimme ravintolasi verkkosivuille modernin pöytävarauspalvelun, joka toimii ympäri vuorokauden. Asiakas valitsee ajan ja seurueen koon, saa vahvistuksen sähköpostiin ja henkilökuntasi näkee varaukset selkeästä hallintapaneelista.",
      headlineLine1: "Asiakkaat varaavat pöydän",
      headlineLine2: "itse — 24/7.",
      subtitle: "Tutustu Restadigin pöytävarauspalveluun ja kokeile varausbottia.",
    },
    dashboard: {
      eyebrow: "Hallintapaneeli",
      titleBefore: "Varaukset ",
      titleAccent: "kalenterissa",
      titleAfter: " ja listalla.",
      body: "Henkilökunta näkee päivän pöytävaraukset tabletilla tai näytöllä — vahvista, peruuta ja seuraa saatavuutta yhdellä silmäyksellä.",
    },
    floorPlan: {
      eyebrow: "Pöytäkartta",
      titleBefore: "Sali ",
      titleAccent: "kartalla",
      titleAfter: " — mobiilista isoon näyttöön.",
      body: "Kustomoitu pöytäkartta ravintolan asiakaspaikkojen mukaan. Sama näkymä toimii puhelimella, tabletilla ja ravintolan isolla näytöllä.",
    },
    features: [
      {
        title: "Varaukset 24/7",
        body: "Asiakkaat voivat varata pöydän silloin kun heille sopii — ilman puhelinsoittoja.",
      },
      {
        title: "Vähemmän no-showta",
        body: "Automaattiset vahvistukset ja muistutukset vähentävät saapumatta jäämisiä.",
      },
      {
        title: "Selkeä hallinta",
        body: "Näet päivän varaukset yhdellä silmäyksellä ja voit muokata saatavuutta helposti.",
      },
      {
        title: "Integroitu sivustoon",
        body: "Palvelu istuu saumattomasti ravintolasi verkkosivujen ilmeeseen.",
      },
    ],
    cta: {
      titleBefore: "Ota ",
      titleAccent: "pöytävaraukset",
      titleAfter: " haltuun.",
      price: "alk. 299 €",
      priceNote: "/ vuosi — kiinteä vuosihinta",
      button: "Kysy lisää",
    },
  },
  hosting: {
    meta: {
      title: "Ylläpito — Restadigi",
      description:
        "Hosting- ja ylläpitopaketit yrityksille — nopea hosting Suomessa, domain, SSL ja jatkuva tuki.",
      ogTitle: "Ylläpito — Restadigi",
      ogDescription: "Hosting- ja ylläpitopaketit: Basic ja Pro Business.",
    },
    hero: {
      titleBefore: "Kotimainen ",
      titleAccent: "hosting",
      titleAfter: "",
      description:
        "Pidämme sivustosi nopeana, turvallisena ja ajan tasalla. Valitse sopiva hosting- ja ylläpitopaketti — domain ja SSL sisältyvät hintaan.",
      features: [
        "Nopea hosting Suomessa",
        "Domain ja SSL sisältyvät",
        "Hallinta suomeksi",
        "Palvelimet Helsingissä",
        "Säännölliset päivitykset ja tuki",
        "Selkeä kiinteä kuukausihinta",
      ],
      askCta: "Kysy lisää",
    },
    popular: "Suosittu",
    requestQuote: "Pyydä tarjous",
    explore: "Tutustu",
    packagesTitle: "Hosting-paketit",
    packages: [
      {
        name: "Basic",
        summary:
          "Nopea hosting Suomessa domainin ja SSL:n kanssa. Sopii, kun tarvitset luotettavan perustason ylläpidon sivustollesi ilman ylimääräisiä palveluita.",
        price: "11,90 € / kk + alv (laskutetaan vuosittain)",
        bullets: [
          "Hosting ja verkkotunnus sisältyvät hintaan",
          "Nopea ja luotettava hosting Suomessa",
          "SSL-sertifikaatti (HTTPS) sisältyy",
          "Domain (.fi tai muu) sisältyy hintaan",
        ],
      },
      {
        name: "Pro Business",
        summary:
          "Hostingin lisäksi jatkuva ylläpito, pienet sisältömuutokset ja henkilökohtainen tuki. Valitse tämä, kun sivuston pitää pysyä ajan tasalla ja apua on saatavilla tarvittaessa.",
        price: "29,99 € / kk + alv",
        featured: true,
        bullets: [
          "Hosting ja verkkotunnus sisältyvät hintaan",
          "Nopea ja luotettava hosting Suomessa",
          "SSL-sertifikaatti (HTTPS) sisältyy",
          "Domain (.fi tai muu) sisältyy hintaan",
          "Sähköpostiosoitteet sisältyvät",
          "Jatkuva ylläpito ja päivitykset",
          "Pienet sisältömuutokset sisältyvät",
          "Tietoturvapäivitykset",
          "AI-asiakaspalvelun ja/tai varauspalvelun tuki ja kehitys",
          "Henkilökohtainen tuki puhelimitse",
        ],
      },
    ],
    footnote:
      "Basic-paketti laskutetaan vuosittain (11,90 € / kk). Pro Business laskutetaan kuukausittain. Domain ja SSL-sertifikaatti sisältyvät hintaan.",
  },
  widget: {
    sales: {
      openLabel: "Asiakaspalvelu",
      closeLabel: "Sulje",
      openAria: "Avaa Restadigin asiakaspalvelu",
      closeAria: "Sulje asiakaspalvelu",
      dialogAria: "Restadigin asiakaspalvelu",
      eyebrow: "Restadigi",
      title: "Asiakaspalvelu",
      welcome:
        "Hei! Olen Restadigin asiakaspalvelusta — autan mielelläni löytämään oikean digiratkaisun. Kerro lyhyesti yrityksestäsi ja ajatuksistasi, niin esittelen sopivat palvelut. Voit jättää myös puhelinnumeron ja sähköpostin, niin olemme yhteydessä.",
      placeholder: "Kirjoita viestisi…",
      sendAria: "Lähetä viesti",
      typing: "Kirjoittaa…",
      sendFailed: "Viestin lähetys epäonnistui.",
      genericError: "Tapahtui virhe.",
    },
    booking: {
      openLabel: "Varaa pöytä",
      closeLabel: "Sulje chat",
      openAria: "Avaa pöytävaraus",
      closeAria: "Sulje pöytävaraus",
      dialogAria: "Ravintolan pöytävaraus",
      eyebrow: "Pöytävaraus",
      title: "Varaa pöytä",
      welcome:
        "Hei! Autan pöytävarauksessa. Kerro nimesi, henkilömäärä, päivä, kellonaika (12–22) ja puhelinnumero. Sähköposti on vapaaehtoinen. Normaali pöytäaika on 2 tuntia — 3 tuntia onnistuu pyynnöstä.",
      placeholder: "Kirjoita viestisi…",
      sendAria: "Lähetä viesti",
      typing: "Kirjoittaa…",
      sendFailed: "Viestin lähetys epäonnistui.",
      genericError: "Tapahtui virhe.",
    },
  },
};
