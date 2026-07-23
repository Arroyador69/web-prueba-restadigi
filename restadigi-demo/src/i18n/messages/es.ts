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
  "Textos base claros y atractivos para inicio, servicios y contacto — paquete llave en mano y formación completa de uso";

const siteSharedBullets = [
  "Panel de administración fácil de usar para actualizar contenidos tú mismo",
  "Diseño responsive que funciona excelentemente en móvil, tablet y ordenador",
  "Formulario de contacto integrado para que tus clientes te encuentren fácilmente",
  "SEO básico que incluye metadatos, mapa del sitio y optimización del rendimiento",
  "Entrega rápida — sitio listo en tan solo 5 días laborables",
  "30 días de soporte al cliente tras el lanzamiento para consultas y pequeños cambios",
];

const withSitePages = (pagesBullet: string, extras: string[] = []) => [
  siteIntroBullet,
  pagesBullet,
  ...siteSharedBullets,
  ...extras,
];

export const es: Messages = {
  meta: {
    defaultTitle: "Restadigi — Sitios web y visibilidad digital para empresas",
    defaultDescription:
      "Restadigi crea sitios web modernos y refuerza la visibilidad digital de las empresas. Con la tecnología más reciente, los sitios se lanzan rápido y son fáciles de actualizar.",
    ogTitle: "Restadigi — Sitios web y visibilidad digital para empresas",
    ogDescription:
      "Sitios web modernos, SEO y servicios de visibilidad digital para el crecimiento de tu empresa.",
  },
  notFound: {
    code: "404",
    title: "Página no encontrada",
    description: "La página que buscas no existe o ha sido movida.",
    goHome: "Ir al inicio",
  },
  error: {
    title: "Esta página no se cargó",
    description: "Algo salió mal de nuestra parte. Puedes intentar de nuevo o volver al inicio.",
    tryAgain: "Intentar de nuevo",
    goHome: "Ir al inicio",
  },
  header: {
    services: "Servicios",
    industries: "Sectores",
    pricing: "Precios",
    languages: "Idiomas",
    contact: "Contacto",
    menu: "Menú",
    homeAria: "Restadigi — inicio",
    logoAlt: "Restadigi Finland",
    industriesIntro:
      "Soluciones digitales por sector — sitios web, reservas, visibilidad y atención al cliente con IA para empresas de servicios.",
    industriesList: [
      {
        title: "Estadios, eventos y artistas",
        body: "Sitios web, visibilidad digital y soluciones de entradas y ventas que unen a fans, entradas y artistas — con claridad y fidelidad a la marca.",
      },
      {
        title: "Hoteles y hostales",
        body: "Gestión y venta de reservas, check-in digital y registro de viajeros, atención con IA 24/7 — la columna digital del alojamiento.",
      },
      {
        title: "Turismo y actividades",
        body: "Sistemas de reserva, soluciones de visibilidad y ventas, además de atención con IA para que las actividades y experiencias se encuentren y reserven con facilidad.",
      },
      {
        title: "Restaurantes",
        body: "Del fine dining a la comida rápida: sitios web, apps móviles, reservas de mesa y atención con IA — ventas y servicio las 24 horas.",
      },
      {
        title: "Cafeterías y kioscos",
        body: "Sitios web elegantes y una app móvil con programa de fidelización — marca, repetición y relación con el cliente en un solo conjunto.",
      },
      {
        title: "Gimnasios y entrenadores personales",
        body: "Panel a medida para horarios de entrenamiento — reservas, agendas y comunicación con clientes en una vista clara.",
      },
      {
        title: "Peluquerías, salones y bienestar",
        body: "Sitios web modernos y reserva de citas para que tus servicios se vean, se reserven y se vendan sin interminables llamadas.",
      },
    ],
    servicesList: [
      { to: "/verkkosivut", label: "Sitios web" },
      { to: "/nakyvyys-ja-suunnittelu", label: "Visibilidad y diseño" },
      { to: "/ai-asiakaspalvelu", label: "Atención con IA" },
      { to: "/poytavaraupalvelu", label: "Reservas de mesa" },
      { to: "/yllapito", label: "Hosting y mantenimiento" },
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
      emailLabel: "Correo",
      email: CONTACT_EMAIL,
      phoneLabel: "Teléfono",
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
      title:
        "Restadigi — Sitios web inteligentes y soluciones digitales para empresas de servicios",
      description:
        "Creamos sitios web, apps móviles y otras soluciones digitales inteligentes para empresas de servicios — incluidos sistemas de reserva, atención al cliente y ventas.",
      ogTitle: "Restadigi — Un sitio web inteligente que atiende a tus clientes",
      ogDescription:
        "Sitios web, apps móviles y soluciones digitales inteligentes para empresas de servicios.",
    },
    hero: {
      titleBefore: "Un sitio web inteligente que ",
      titleAccent: "atiende a tus clientes 24/7",
      titleAfter: ".",
      description:
        "Creamos sitios web, apps móviles y otras soluciones digitales inteligentes para empresas de servicios. Un conjunto de servicios rápido y rentable que incluye sitios web, sistemas de reserva, atención al cliente y ventas.",
      cta: "Solicitar presupuesto",
    },
    sitePreview: {
      navMenu: "Menú",
      navHours: "Horario",
      navContact: "Contacto",
      tagline: "Helsinki · Café",
      openBadge: "Abierto hoy 8–18",
      bookTable: "Pedir para llevar",
      customerService: "Atención al cliente",
      tileSpecialMenus: "Espresso",
      tileEvents: "Latte",
      tileGroups: "Brunch",
    },
    barberPreview: {
      brand: "Freddos",
      menu: "Menú",
      tagline: "Café · Para llevar",
      headline: "Fresco en tu taza.",
      bookCta: "Pedir",
      bookShort: "Pedir",
      services: ["Espresso", "Ice latte", "Brunch"],
    },
    intro: {
      titleLine1: "Soluciones por sector.",
      titleLine2: "Contacta con nosotros, hablemos.",
      body: "Queremos conocer a fondo cómo funciona tu empresa para servirte lo mejor posible. Todos los proyectos empiezan con una llamada de presentación de al menos 30 minutos. Reserva una hora abajo o llámanos directamente — juntos encontraremos la solución óptima.",
      callCta: "Llámanos",
      phoneDisplay: CONTACT_PHONE_DISPLAY,
      phoneTel: CONTACT_PHONE_TEL,
      whatsappCta: "Llamada WhatsApp",
      bookCta: "Reservar hora →",
    },
    whyUs: {
      titleBefore: "¿Por qué ",
      titleAccent: "elegirnos",
      titleAfter: "?",
      description:
        "Nuestros clientes valoran el conocimiento del sector, precios sensatos y soluciones digitales que crecen con el negocio.",
      items: [
        {
          title: "Comprensión del negocio",
          body: "Nuestra larga trayectoria emprendedora en hostelería, turismo y restauración nos ayuda a entender tu negocio de forma integral. Queremos aumentar tus ventas desde el primer día y seguir creciendo contigo como socio digital.",
          href: "/yhteys",
          linkLabel: "Reservar llamada de presentación",
        },
        {
          title: "Precio asequible",
          body: "Los costes son altos en el sector servicios y encontrar nuevos clientes puede ser difícil. Gracias a la IA ofrecemos servicios a un precio razonable sin sacrificar la calidad — la mejor relación calidad-precio del mercado.",
          href: "/verkkosivut",
          linkLabel: "Ver paquetes",
        },
        {
          title: "Operaciones automatizadas",
          body: "Un bot de atención con IA gestiona por ti el servicio al cliente y la recepción de reservas por chat, teléfono y correo 24/7. Precio anual fijo desde 199 € / año.",
          href: "/ai-asiakaspalvelu",
          linkLabel: "Conocer el servicio de IA",
        },
        {
          title: "Gestión de contenidos sin esfuerzo",
          body: "Actualiza el menú, precios, horarios e imágenes desde tu propio panel. El mantenimiento de contenidos se hace con unos clics — sin conocimientos técnicos.",
          href: "/verkkosivut",
          linkLabel: "Más información",
        },
      ],
    },
    serviceTeasers: {
      title: "Servicios inteligentes",
      items: [
        {
          title: "Atención al cliente con IA",
          body: "Un chatbot atiende a tus clientes 24/7 — responde preguntas, captura leads y libera a tu equipo.",
          href: "/ai-asiakaspalvelu",
          linkLabel: "Conocer el chatbot",
        },
        {
          title: "Reservas de mesa",
          body: "Los clientes reservan mesa en tu web a cualquier hora — gestiona las reservas en tablet y móvil.",
          href: "/poytavaraupalvelu",
          linkLabel: "Conocer el servicio",
        },
      ],
    },
    bookingPromo: {
      title: "Reservas de mesa para restaurantes",
      body: "A precio anual fijo — desde 299 € / año.",
      linkLabel: "Leer más",
    },
    projects: {
      titleBefore: "Proyectos ",
      titleAccent: "seleccionados",
      delfin: {
        logoAlt: "Logo de la app Delfin Check-In",
        screenAlt: "Pantalla de la app Delfin Check-In",
        calendarAlt: "Vista de calendario de Delfin Check-In",
        title: "Delfin Check-In",
        titleAccent: "— servicio y app móvil",
        platforms: "App Store y Google Play",
        body: "App de check-in y registro de viajeros para anfitriones y empresas de alojamiento. Sincroniza reservas, gestiona huéspedes y se ocupa de los informes oficiales — disponible en las tiendas de Apple y Google.",
        link: "Ver en App Store →",
      },
      rafa: {
        heroAlt: "Sitio web del músico Rafa Romera",
        logoAlt: "Logo de Rafa Romera",
        title: "Rafa Romera",
        titleAccent: "— sitio web e integración con Spotify",
        tag: "Sitio de artista",
        body: "Sitio web del músico andaluz Rafa Romera con integración de Spotify — biografía, discografía, galería y próximos conciertos en un solo lugar que lleva a los oyentes directamente a la música.",
        link: "Abrir sitio →",
      },
    },
    cta: {
      titleBefore: "¿Listo para dar el ",
      titleAccent: "siguiente paso",
      titleAfter: "?",
      quoteCta: "Solicitar presupuesto",
      callCta: "Llámanos →",
      whatsappCta: "WhatsApp →",
    },
  },
  contact: {
    meta: {
      title: "Contacto — Restadigi",
      description: `Cuéntanos tu proyecto; te responderemos en un día laborable. ${CONTACT_EMAIL}`,
      ogTitle: "Contacto — Restadigi",
      ogDescription: "Cuéntanos tu proyecto — te responderemos en un día laborable.",
    },
    hero: {
      titleBefore: "Cuéntanos ",
      titleAccent: "tu proyecto",
      titleAfter: ".",
      description:
        "Normalmente respondemos en un día laborable. También puedes escribirnos por correo o reservar una breve llamada.",
    },
    labels: {
      email: "Correo",
      phone: "Teléfono",
      whatsapp: "WhatsApp",
      studio: "Dirección",
      person: "Persona de contacto",
    },
    email: CONTACT_EMAIL,
    phoneDisplay: CONTACT_PHONE_DISPLAY,
    phoneTel: CONTACT_PHONE_TEL,
    whatsappDisplay: CONTACT_WHATSAPP_DISPLAY,
    studioLine1: CONTACT_ADDRESS,
    studioLine2: CONTACT_COMPANY,
    person: CONTACT_PERSON,
    form: {
      name: "Nombre",
      company: "Empresa",
      email: "Correo",
      budget: "Presupuesto",
      message: "Mensaje",
      messagePlaceholder: "Cuéntanos el proyecto, plazos y objetivos…",
      selectPlaceholder: "Seleccionar…",
      submit: "Enviar mensaje",
      sending: "Abriendo el cliente de correo…",
      budgetOptions: [
        "Menos de 1 000 €",
        "1 000 – 2 500 €",
        "2 500 – 5 000 €",
        "Más de 5 000 €",
        "Aún no lo sé",
      ],
      mailSubject: "Consulta de proyecto — {name}",
      mailBody:
        "Nombre: {name}\nEmpresa: {company}\nCorreo: {email}\nPresupuesto: {budget}\n\nMensaje:\n{message}",
    },
  },
  pricing: {
    meta: {
      title: "Precios — Restadigi",
      description:
        "Lista de precios de Restadigi: sitios web, visibilidad digital, diseño gráfico y hosting.",
      ogTitle: "Precios — Restadigi",
      ogDescription:
        "Precios claros de paquetes para sitios web, visibilidad, diseño gráfico y hosting.",
    },
    eyebrow: "Precios",
    titleBefore: "Precios ",
    titleAccent: "claros",
    titleAfter: " sin sorpresas.",
    lead: "Resumen de los precios de los paquetes. Consulta en la página de cada producto el contenido detallado de los paquetes.",
    sections: {
      websites: "Sitios web",
      visibility: "Visibilidad digital",
      branding: "Diseño gráfico",
      hosting: "Hosting y mantenimiento",
    },
    seeMore: "Ver el servicio",
    vatNote: "Los precios se indican sin IVA salvo que se indique lo contrario.",
  },
  about: {
    meta: {
      title: "Sobre nosotros — Restadigi",
      description:
        "Restadigi es un estudio pequeño que crea sitios web y refuerza la visibilidad digital de las empresas. Conoce nuestra forma de trabajar.",
      ogTitle: "Sobre nosotros — Restadigi",
      ogDescription:
        "Un estudio pequeño, una gran responsabilidad. Sitios web y visibilidad digital para empresas.",
    },
    eyebrow: "Sobre nosotros",
    titleBefore: "Un estudio pequeño, ",
    titleAccent: "gran",
    titleAfter: " responsabilidad.",
    lead: "Restadigi es un estudio digital independiente que crea sitios web y refuerza la visibilidad digital de pymes. Usamos la tecnología más reciente para que los sitios se lancen rápido, funcionen en todos los dispositivos y sean fáciles de actualizar.",
    secondary:
      "Preferimos colaboraciones a largo plazo: las mismas manos que diseñan tu sitio también ayudan con su visibilidad y desarrollo a futuro.",
    imageAlt: "Chef preparando un plato en la cocina de un restaurante",
    values: [
      {
        titleAccent: "Hecho a",
        titleRest: "mano",
        body: "Sin plantillas. Cada proyecto se diseña desde cero según tus objetivos.",
      },
      {
        titleAccent: "Precios",
        titleRest: "transparentes",
        body: "Paquetes y extras claros — sabes por qué pagas, de principio a fin.",
      },
      {
        titleAccent: "Colaboración",
        titleRest: "a largo plazo",
        body: "También ayudamos después del lanzamiento — en actualizaciones, desarrollo y mantenimiento.",
      },
    ],
    process: {
      titleBefore: "Cuatro ",
      titleAccent: "pasos",
      titleAfter: " hasta el sitio terminado.",
      steps: [
        {
          n: "01",
          title: "Conversación",
          body: "Definimos juntos objetivos, público y plazos.",
        },
        {
          n: "02",
          title: "Diseño",
          body: "Estructura, identidad visual y contenido se refinan de forma iterativa.",
        },
        {
          n: "03",
          title: "Desarrollo",
          body: "Construimos el sitio optimizado para buscadores y accesible.",
        },
        {
          n: "04",
          title: "Lanzamiento y soporte",
          body: "Publicación, formación en el panel y soporte continuo.",
        },
      ],
    },
    cta: {
      titleBefore: "¿Te suena bien ",
      titleAccent: "colaborar",
      titleAfter: "?",
      button: "Contactar",
    },
  },
  websites: {
    meta: {
      title: "Sitios web para empresas — Restadigi",
      description:
        "Paquetes de sitios web claros e impactantes y extras gráficos para empresas y asociaciones.",
      ogTitle: "Sitios web para empresas — Restadigi",
      ogDescription:
        "Paquetes de sitios web y extras gráficos según las necesidades de tu empresa.",
    },
    hero: {
      titleBefore: "Sitios web para ",
      titleAccent: "tu empresa",
      titleAfter: ".",
      description:
        "Unos sitios web y contenidos bien diseñados son tus herramientas digitales más importantes. Refuerzan la visibilidad de tu marca, facilitan el contacto de los clientes y dejan una fuerte primera impresión.",
      promo: "desde 399€",
      promoLine1: "desde",
      promoLine2: "399€",
      phoneShop: {
        brand: "Freddo's",
        product: "Ice latte",
        price: "5,90 €",
        addToCart: "Añadir",
      },
    },
    midBanner: {
      title: "¡Tu camino hacia la máxima visibilidad empieza aquí!",
      description:
        "Descubre abajo los paquetes con los que elevarás la visibilidad online de tu empresa.",
      imageAlt: "Más visitantes y reservas",
    },
    popular: "Popular",
    requestQuote: "Solicitar presupuesto",
    explore: "Descubrir",
    packagesTitle: "Paquetes web",
    packages: [
      {
        name: "Start",
        tagline: "Un sitio sencillo pero impactante para una pequeña empresa",
        summary:
          "Un sitio claro de 1–3 páginas que presenta tu negocio de inmediato. Ideal para un pequeño operador que quiere presencia profesional sin complejidad innecesaria.",
        price: "399 € + IVA",
        bullets: withSitePages("Un sitio web profesional de 1–3 páginas adaptado a tu negocio"),
      },
      {
        name: "Plus",
        tagline: "Un conjunto elegante que presenta tus servicios con claridad",
        summary:
          "4–6 páginas para servicios, contacto y una primera impresión fuerte. Presenta tu oferta con claridad y guía al visitante hacia el contacto.",
        price: "549 € + IVA",
        bullets: withSitePages("Un sitio web profesional de 4–6 páginas adaptado a tu negocio"),
      },
      {
        name: "Oro",
        tagline: "7–9 páginas y atención con IA durante 1 año",
        summary:
          "Un sitio más amplio para un negocio en crecimiento. Incluye atención con IA durante un año: el bot responde y captura leads también cuando no estás disponible.",
        price: "759 € + IVA",
        bullets: withSitePages("Un sitio web profesional de 7–9 páginas adaptado a tu negocio", [
          "Atención con IA (chatbot) incluida durante 1 año — responde a clientes 24/7 y captura leads",
        ]),
      },
      {
        name: "Diamante",
        tagline:
          "Más de 10 páginas, atención con IA y el servicio de reservas que elijas durante 1 año",
        summary:
          "El paquete más completo: más de 10 páginas, atención con IA y el servicio de reservas que elijas durante un año. Para cuando ventas y servicio deben funcionar online las 24 horas.",
        price: "929 € + IVA",
        featured: true,
        bullets: withSitePages(
          "Un sitio web profesional de más de 10 páginas adaptado a tu negocio",
          [
            "Atención con IA (chatbot) incluida durante 1 año — responde a clientes 24/7 y captura leads",
            "El servicio de reservas que elijas durante 1 año — p. ej. mesas, alojamiento o citas de peluquería",
          ],
        ),
      },
    ],
    footnoteBefore:
      "Los precios de los paquetes son fijos. El dominio y el hosting se eligen por separado en ",
    footnoteLink: "servicios de mantenimiento",
    footnoteAfter:
      ". También puedes comprar el dominio y el hosting tú mismo, o usar un dominio que ya tengas.",
    process: {
      title: "Proceso de compra del sitio web — 8 pasos",
      steps: [
        {
          title: "Análisis de necesidades",
          body: "El proceso comienza aclarando los objetivos del cliente y el uso del sitio web. Al mismo tiempo se definen el contenido, las funciones y el calendario del proyecto.",
        },
        {
          title: "Elección del paquete adecuado",
          body: "El cliente elige la solución web que mejor se adapta a su empresa. Si hace falta, se pueden añadir servicios extra como SEO o producción de contenidos.",
        },
        {
          title: "Confirmación del pedido",
          body: "Cuando el servicio está elegido, se confirma el pedido y arranca el proyecto. Se acuerdan los detalles prácticos y se entregan los materiales necesarios.",
        },
        {
          title: "Diseño del sitio",
          body: "Restadigi diseña la estructura, la apariencia y la experiencia de uso según los deseos del cliente y la identidad visual de la empresa.",
        },
        {
          title: "Desarrollo del sitio web",
          body: "Sobre la base del plan se construye un sitio funcional y responsive, que funciona con fluidez en ordenadores y dispositivos móviles.",
        },
        {
          title: "Revisión y comentarios del cliente",
          body: "El borrador final se presenta al cliente. Las posibles peticiones de cambio se revisan y se aplican antes de la publicación.",
        },
        {
          title: "Publicación online",
          body: "Cuando el sitio está aprobado, se publica en el dominio elegido y se comprueba que todo funciona correctamente.",
        },
        {
          title: "Soporte y desarrollo continuo",
          body: "Tras la publicación, Restadigi puede ofrecer mantenimiento, actualizaciones y servicios de desarrollo para que el sitio se mantenga al día y apoye el crecimiento de la empresa.",
        },
      ],
    },
  },
  visibility: {
    meta: {
      title: "Visibilidad digital — Restadigi",
      description:
        "Pon tu visibilidad digital en orden: optimización IA, optimización Google y paquete de visibilidad en deporte de élite.",
      ogTitle: "Visibilidad digital — Restadigi",
      ogDescription:
        "Tres formas de crecer en visibilidad: optimización IA, optimización Google y paquete de visibilidad en deporte de élite.",
    },
    hero: {
      brand: "Restadigi",
      headlineLine1: "¿Ponemos tu visibilidad",
      headlineLine2: "en orden de una vez?",
      searchPlaceholder: "Buscar",
      searchAriaLabel: "Buscar en visibilidad digital",
    },
    popular: "Popular",
    contactCta: "Contactar",
    resultPrefix: "Obtienes:",
    explore: "Descubrir",
    packagesTitle: "Paquetes de visibilidad",
    packages: [
      {
        name: "Optimización IA",
        tagline: "Visible también en búsquedas de ChatGPT, Claude, Gemini y Copilot",
        summary:
          "Cada vez más personas buscan servicios a través de la IA. Mantenemos tus datos y contenido listos para la visibilidad en ChatGPT, Claude, Gemini y Copilot — año tras año.",
        description:
          "La búsqueda en la web está cambiando. Cada vez más personas encuentran empresas, productos y servicios conversando con la IA. Nuestro servicio de optimización IA ayuda a mantener al día los datos de tu empresa y a que el contenido de tu sitio respalde la capacidad de los servicios de IA para reconocer tu negocio en el contexto correcto.",
        price: "desde 99 € / año",
        bullets: [
          "Revisión básica de visibilidad IA del sitio web",
          "Revisión de la información empresarial clave",
          "Recomendaciones de optimización básica de contenidos y metadatos",
          "Identificación de carencias estructurales",
          "Revisión y actualización anuales",
        ],
        result: "Tu empresa también forma parte de las búsquedas del futuro.",
      },
      {
        name: "Optimización Google",
        tagline: "Asegura que los clientes encuentren tu empresa",
        summary:
          "Google sigue siendo el canal principal cuando un cliente busca una empresa. Mantenemos los fundamentos SEO al día cada año para que la descubribilidad no se deteriore.",
        description:
          "Google sigue siendo uno de los canales más importantes para encontrar empresas, productos y servicios. Nuestra optimización Google es un servicio ligero de mantenimiento anual cuyo objetivo es garantizar que tu sitio cumpla los requisitos básicos de SEO y apoye la descubribilidad.",
        price: "desde 99 € / año",
        bullets: [
          "Revisión SEO básica del sitio web",
          "Revisión de títulos y meta descripciones",
          "Evaluación de las palabras clave principales",
          "Comprobación de aspectos técnicos básicos",
          "Propuestas de mejora de la visibilidad",
          "Revisión y actualización anuales",
        ],
        result: "Tu visibilidad en Google se mantiene al día.",
      },
      {
        name: "Paquete de visibilidad en deporte de élite",
        tagline: "Visibilidad en las ligas deportivas más populares de Finlandia",
        summary:
          "Visibilidad ligada a Liiga, Veikkausliiga y Superpesis. Una microcolaboración asequible lleva tu marca a las gradas, canales digitales y eventos de networking.",
        description:
          "El deporte de élite ofrece a las empresas una oportunidad única de llegar a clientes, reforzar la marca y construir una imagen fiable. Ofrecemos microcolaboraciones asequibles con clubes de Liiga, Veikkausliiga y Superpesis.",
        price: "desde 299 € / año",
        featured: true,
        bullets: [
          "Visibilidad publicitaria en vallas y LED en los partidos",
          "Visibilidad en pantallas mediáticas de los estadios",
          "Presentación de la empresa o logo en la web del club",
          "Visibilidad en los canales digitales del club",
          "Invitaciones a reuniones de partners y networking",
          "Entradas a partidos para clientes o personal",
          "Servicios VIP y experiencias en días de partido",
          "Otros beneficios de partnership según el club",
        ],
        result:
          "Una colaboración profesional, visibilidad ante miles de espectadores e imagen deportiva positiva.",
      },
      {
        name: "Diseño gráfico",
        tagline: "Identidad de marca, logo y materiales de marketing",
        summary:
          "Logo, identidad y materiales de marketing desde un solo lugar. Una imagen moderna y coherente que funciona online y en impresión.",
        description:
          "Identidad de marca, materiales de marketing y trabajos de diseño individuales — precios claros y resultado profesional.",
        price: "desde 99 €",
        bullets: [
          "Diseño de identidad corporativa — desde 199 € (incluye logo y tarjetas)",
          "Materiales publicitarios y de marketing — desde 149 €",
          "Diseño de logo — desde 149 €",
          "Diseño de tarjetas de visita — desde 99 €",
        ],
        result: "Una imagen visual profesional para tu empresa.",
      },
    ],
    footnote: "Los precios son anuales. Solo pagas por lo que necesitas — sin costes ocultos.",
    branding: {
      titleBefore: "Diseño ",
      titleAccent: "gráfico",
      titleAfter: ".",
      description:
        "Identidad de marca, materiales de marketing y trabajos de diseño individuales — precios claros y resultado profesional.",
      products: [
        {
          name: "Diseño de identidad corporativa",
          description: "Imagen de marca completa, incluye diseño de logo y tarjetas de visita.",
          price: "desde 199 €",
        },
        {
          name: "Materiales publicitarios y de marketing",
          price: "desde 149 €",
        },
        {
          name: "Diseño de logo",
          price: "desde 149 €",
        },
        {
          name: "Diseño de tarjetas de visita",
          price: "desde 99 €",
        },
      ],
      billing: {
        title: "Sobre la facturación",
        intro:
          "Aplicamos un anticipo: parte del trabajo se factura antes de empezar el proyecto, una vez aceptado el presupuesto por escrito. Así se comprometen tanto el cliente como el proveedor.",
        providerLead:
          "La facturación de los servicios de Restadigi Finland en Finlandia la gestiona Laskuttamo.",
        providerName: "Laskuttamo",
        providerEmail: "asiakaspalvelu@laskuttamo.com",
        providerPhone: "02 0730 6710",
        providerHours: "lun–vie 8:00–16:00",
        providerSiteLabel: "laskuttamo.com",
        providerSiteUrl: "https://laskuttamo.com/",
        providerAddressNote:
          "Los datos de contacto y las direcciones están en el sitio web de Laskuttamo.",
        groundsTitle: "¿Por qué un anticipo?",
        groundsBody: [
          "Cuando arranca un proyecto, reservamos tiempo en el calendario. Si el pedido se cancela a mitad o se corta la comunicación, perdemos la oportunidad de aceptar otros encargos en ese periodo. El anticipo actúa por tanto como una reserva que confirma el compromiso del cliente.",
          "En el trabajo creativo el resultado — como un logo o una identidad visual — suele tomar forma durante el proceso. Sin anticipo podríamos quedar con una factura sin pagar, un cliente que desaparece o un proyecto interrumpido. Facturar solo al final también podría significar semanas o meses de trabajo sin flujo de caja. El anticipo alivia estos riesgos y garantiza al menos parte de la retribución por el trabajo ya realizado.",
        ],
      },
      form: {
        title: "Solicita presupuesto de diseño gráfico o de web",
        name: "Nombre",
        email: "Correo electrónico",
        phone: "Teléfono",
        submit: "Enviar solicitud",
        sending: "Abriendo el correo…",
        mailSubject: "Solicitud de presupuesto: diseño gráfico / web — {name}",
        mailBody:
          "Nombre: {name}\nCorreo: {email}\nTeléfono: {phone}\n\nSolicito presupuesto de diseño gráfico o de una web.",
      },
    },
    cta: {
      titleBefore: "¿Quieres mejor ",
      titleAccent: "visibilidad",
      titleAfter: "?",
      button: "Preguntar por paquetes de visibilidad",
    },
  },
  chatbot: {
    meta: {
      title: "Atención al cliente con IA — Restadigi",
      description:
        "Chatbot inteligente para tu web — atiende clientes 24/7, responde preguntas, captura leads y libera a tu equipo.",
      ogTitle: "Atención al cliente con IA — Restadigi",
      ogDescription: "Chatbot para la web — ventas y atención al cliente las 24 horas.",
    },
    hero: {
      titleBefore: "Atención ",
      titleAccent: "inteligente",
      titleAfter: " para tu empresa.",
      description:
        "El chatbot de Restadigi se instala en tu web y atiende a los clientes las 24 horas — responde preguntas, guía hacia los servicios adecuados y captura leads.",
      headlineLine1: "El empleado más barato de tu empresa",
      headlineLine2: "está aquí.",
      subtitle: "Conoce el chatbot personalizable de Restadigi.",
      cta: "Conocer el chatbot",
    },
    chatbot: {
      eyebrow: "Chatbot",
      titleBefore: "Un ",
      titleAccent: "chatbot",
      titleAfter: " inteligente — vendedor y agente de atención las 24 horas.",
      intro:
        "El chatbot es un asistente virtual inteligente instalado en tu web que atiende a los clientes 24/7 — responde preguntas frecuentes, guía hacia los servicios adecuados y captura leads. No sustituye a las personas; es una mano extra fiable cuando tu equipo no está disponible.",
      benefits: [
        {
          title: "Atención al cliente 24/7",
          body: "El bot responde al instante a las preguntas más comunes, sin que el cliente tenga que esperar o buscar información.",
        },
        {
          title: "Captura eficaz de leads",
          body: "El bot guía al visitante con fluidez en el recorrido de compra y recoge datos de contacto también de noche.",
        },
        {
          title: "Mayor conversión",
          body: "El umbral de contacto es bajo. Con el chatbot, más visitantes se convierten en clientes de pago.",
        },
        {
          title: "Ahorro de recursos",
          body: "Las preguntas rutinarias pasan al bot y liberan tiempo para tareas más exigentes.",
        },
      ],
      safeTitleBefore: "Una solución ",
      safeTitleAccent: "segura y sencilla",
      safeTitleAfter: ".",
      safeBody:
        "Para que el chatbot dé resultados año tras año, necesita cuidado continuo. Nuestro modelo mensual garantiza que el bot evolucione y funcione sin fricción con los datos y la tecnología cambiantes de tu empresa.",
      monthly: [
        {
          title: "Tecnología siempre actualizada",
          body: "La web y la IA evolucionan sin parar. Con la cuota mensual aseguramos que tu bot funcione siempre en la plataforma más reciente y segura.",
        },
        {
          title: "Adaptado a los datos de tu empresa",
          body: "El bot se puede entrenar. El mantenimiento mensual permite formarlo con tus últimos datos de producto, campañas y respuestas.",
        },
        {
          title: "Desarrollo proactivo",
          body: "Analizamos el historial de conversaciones y lo optimizamos para cubrir cada vez mejor las necesidades más frecuentes de tus clientes.",
        },
        {
          title: "Servicio llave en mano",
          body: "No tienes que preocuparte por instalaciones técnicas ni código. Nuestros especialistas se ocupan del mantenimiento.",
        },
      ],
    },
    cta: {
      titleBefore: "Atiende mejor. Captura leads. ",
      titleAccent: "Crece con más eficiencia.",
      body: "Restadigi desarrolla soluciones digitales para empresas de servicios. Nuestro chatbot ayuda a mejorar la experiencia del cliente, agilizar la operación y aumentar las ventas con una herramienta de IA fácil de adoptar.",
      questions: [
        "¿Cuáles son las preguntas más frecuentes de vuestros clientes?",
        "¿Queréis que el bot se centre más en la atención o en las ventas y la captura de leads?",
        "¿En qué idiomas queréis que el bot atienda a los visitantes?",
      ],
      price: "desde 199 €",
      priceNote: "/ año",
      button: "Solicitar demo gratuita",
    },
  },
  booking: {
    meta: {
      title: "Servicio de reservas de mesa — Restadigi",
      description:
        "Servicio moderno de reservas de mesa para restaurantes — los clientes reservan directamente desde tu web las 24 horas.",
      ogTitle: "Servicio de reservas de mesa — Restadigi",
      ogDescription: "Reservas de mesa fluidas directamente desde la web de tu restaurante.",
    },
    hero: {
      titleAccent: "Reservas de mesa",
      titleAfter: " directamente desde tu web.",
      description:
        "Integramos en la web de tu restaurante un servicio moderno de reservas de mesa que funciona las 24 horas. El cliente elige hora y tamaño del grupo, recibe confirmación por correo y tu equipo ve las reservas en un panel claro.",
      headlineLine1: "Los clientes reservan mesa",
      headlineLine2: "ellos mismos — 24/7.",
      subtitle: "Conoce el servicio de reservas de Restadigi y prueba el bot de reservas.",
    },
    dashboard: {
      eyebrow: "Panel de administración",
      titleBefore: "Reservas en ",
      titleAccent: "calendario",
      titleAfter: " y lista.",
      body: "El equipo ve las reservas del día en tablet o pantalla — confirma, cancela y sigue la disponibilidad de un vistazo.",
    },
    floorPlan: {
      eyebrow: "Plano de mesas",
      titleBefore: "El salón ",
      titleAccent: "en el mapa",
      titleAfter: " — del móvil a la gran pantalla.",
      body: "Plano personalizado según el aforo de tu restaurante. La misma vista funciona en móvil, tablet y la pantalla grande del restaurante.",
    },
    features: [
      {
        title: "Reservas 24/7",
        body: "Los clientes pueden reservar mesa cuando les convenga — sin llamadas.",
      },
      {
        title: "Menos no-shows",
        body: "Confirmaciones y recordatorios automáticos reducen las ausencias.",
      },
      {
        title: "Gestión clara",
        body: "Ves las reservas del día de un vistazo y ajustas la disponibilidad con facilidad.",
      },
      {
        title: "Integrado en tu web",
        body: "El servicio encaja a la perfección con la imagen de la web de tu restaurante.",
      },
    ],
    cta: {
      titleBefore: "Toma el control de las ",
      titleAccent: "reservas de mesa",
      titleAfter: ".",
      price: "desde 299 €",
      priceNote: "/ año — precio anual fijo",
      button: "Preguntar más",
    },
  },
  hosting: {
    meta: {
      title: "Mantenimiento — Restadigi",
      description:
        "Paquetes de hosting y mantenimiento para empresas — hosting rápido en Finlandia, dominio, SSL y soporte continuo.",
      ogTitle: "Mantenimiento — Restadigi",
      ogDescription: "Paquetes de hosting y mantenimiento: Basic y Pro Business.",
    },
    hero: {
      titleBefore: "Hosting ",
      titleAccent: "finlandés",
      titleAfter: "",
      description:
        "Mantenemos tu sitio rápido, seguro y al día. Elige el paquete de hosting y mantenimiento adecuado — dominio y SSL incluidos.",
      features: [
        "Hosting rápido en Finlandia",
        "Dominio y SSL incluidos",
        "Gestión en finlandés o inglés",
        "Servidores en Helsinki",
        "Actualizaciones y soporte regulares",
        "Precio mensual fijo y claro",
      ],
      askCta: "Preguntar más",
    },
    popular: "Popular",
    requestQuote: "Solicitar presupuesto",
    explore: "Descubrir",
    packagesTitle: "Paquetes de hosting",
    packages: [
      {
        name: "Basic",
        summary:
          "Hosting rápido en Finlandia con dominio y SSL incluidos. Ideal cuando necesitas un mantenimiento básico fiable sin servicios extra.",
        price: "11,90 € / mes + IVA (facturación anual)",
        bullets: [
          "Hosting y dominio incluidos",
          "Hosting rápido y fiable en Finlandia",
          "Certificado SSL (HTTPS) incluido",
          "Dominio (.fi u otro) incluido",
        ],
      },
      {
        name: "Pro Business",
        summary:
          "Además del hosting: mantenimiento continuo, pequeños cambios de contenido y soporte personal. Elige esto cuando el sitio deba mantenerse al día y haya ayuda disponible.",
        price: "29,99 € / mes + IVA",
        featured: true,
        bullets: [
          "Hosting y dominio incluidos",
          "Hosting rápido y fiable en Finlandia",
          "Certificado SSL (HTTPS) incluido",
          "Dominio (.fi u otro) incluido",
          "Direcciones de correo incluidas",
          "Mantenimiento y actualizaciones continuas",
          "Pequeños cambios de contenido incluidos",
          "Actualizaciones de seguridad",
          "Soporte y desarrollo del servicio de atención con IA y/o del servicio de reservas",
          "Soporte personal por teléfono",
        ],
      },
    ],
    footnote:
      "El paquete Basic se factura anualmente (11,90 € / mes). Pro Business se factura mensualmente. Dominio y certificado SSL incluidos.",
  },
  widget: {
    sales: {
      openLabel: "Atención al cliente",
      closeLabel: "Cerrar",
      openAria: "Abrir atención al cliente de Restadigi",
      closeAria: "Cerrar atención al cliente",
      dialogAria: "Atención al cliente de Restadigi",
      eyebrow: "Restadigi",
      title: "Atención al cliente",
      welcome:
        "¡Hola! Soy del equipo de atención de Restadigi — encantado de ayudarte a encontrar la solución digital adecuada. Cuéntame brevemente sobre tu negocio y tus ideas, y te presento los servicios que encajan. También puedes dejar teléfono y correo y te contactamos.",
      placeholder: "Escribe tu mensaje…",
      sendAria: "Enviar mensaje",
      typing: "Escribiendo…",
      sendFailed: "No se pudo enviar el mensaje.",
      genericError: "Se produjo un error.",
    },
    booking: {
      openLabel: "Reservar mesa",
      closeLabel: "Cerrar chat",
      openAria: "Abrir reserva de mesa",
      closeAria: "Cerrar reserva de mesa",
      dialogAria: "Reserva de mesa del restaurante",
      eyebrow: "Reservas",
      title: "Reservar mesa",
      welcome:
        "¡Hola! Puedo ayudarte a reservar mesa. Indica nombre, personas, fecha, hora (12:00–22:00) y teléfono. El correo es opcional. La duración normal es 2 horas — 3 horas bajo petición.",
      placeholder: "Escribe tu mensaje…",
      sendAria: "Enviar mensaje",
      typing: "Escribiendo…",
      sendFailed: "No se pudo enviar el mensaje.",
      genericError: "Se produjo un error.",
    },
  },
};
