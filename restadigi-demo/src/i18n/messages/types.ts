export type Messages = {
  meta: {
    defaultTitle: string;
    defaultDescription: string;
    ogTitle: string;
    ogDescription: string;
  };
  notFound: {
    code: string;
    title: string;
    description: string;
    goHome: string;
  };
  error: {
    title: string;
    description: string;
    tryAgain: string;
    goHome: string;
  };
  header: {
    services: string;
    industries: string;
    pricing: string;
    languages: string;
    contact: string;
    menu: string;
    homeAria: string;
    logoAlt: string;
    industriesIntro: string;
    industriesList: Array<{ title: string; body: string }>;
    servicesList: Array<{ to: string; label: string }>;
    languagesList: Array<{ code: "fi" | "en" | "es"; label: string }>;
    contactPanel: {
      company: string;
      person: string;
      address: string;
      emailLabel: string;
      email: string;
      phoneLabel: string;
      whatsappLabel: string;
      phoneDisplay: string;
      phoneTel: string;
      whatsappDisplay: string;
    };
  };
  footer: {
    copyright: string;
  };
  home: {
    meta: {
      title: string;
      description: string;
      ogTitle: string;
      ogDescription: string;
    };
    hero: {
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      description: string;
      cta: string;
    };
    sitePreview: {
      navMenu: string;
      navHours: string;
      navContact: string;
      tagline: string;
      openBadge: string;
      bookTable: string;
      customerService: string;
      tileSpecialMenus: string;
      tileEvents: string;
      tileGroups: string;
    };
    barberPreview: {
      brand: string;
      menu: string;
      tagline: string;
      headline: string;
      bookCta: string;
      bookShort: string;
      services: [string, string, string];
    };
    intro: {
      titleLine1: string;
      titleLine2: string;
      body: string;
      callCta: string;
      phoneDisplay: string;
      phoneTel: string;
      whatsappCta: string;
      bookCta: string;
    };
    whyUs: {
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      description: string;
      items: Array<{
        title: string;
        body: string;
        href: string;
        linkLabel: string;
      }>;
    };
    serviceTeasers: {
      title: string;
      items: Array<{
        title: string;
        body: string;
        href: string;
        linkLabel: string;
      }>;
    };
    bookingPromo: {
      title: string;
      body: string;
      linkLabel: string;
    };
    projects: {
      titleBefore: string;
      titleAccent: string;
      delfin: {
        logoAlt: string;
        screenAlt: string;
        calendarAlt: string;
        title: string;
        titleAccent: string;
        platforms: string;
        body: string;
        link: string;
      };
      rafa: {
        heroAlt: string;
        logoAlt: string;
        title: string;
        titleAccent: string;
        tag: string;
        body: string;
        link: string;
      };
    };
    cta: {
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      quoteCta: string;
      callCta: string;
      whatsappCta: string;
    };
  };
  contact: {
    meta: {
      title: string;
      description: string;
      ogTitle: string;
      ogDescription: string;
    };
    hero: {
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      description: string;
    };
    labels: {
      email: string;
      phone: string;
      whatsapp: string;
      studio: string;
      person: string;
    };
    email: string;
    phoneDisplay: string;
    phoneTel: string;
    whatsappDisplay: string;
    studioLine1: string;
    studioLine2: string;
    person: string;
    form: {
      name: string;
      company: string;
      email: string;
      budget: string;
      message: string;
      messagePlaceholder: string;
      selectPlaceholder: string;
      submit: string;
      sending: string;
      budgetOptions: string[];
      mailSubject: string;
      mailBody: string;
    };
  };
  pricing: {
    meta: {
      title: string;
      description: string;
      ogTitle: string;
      ogDescription: string;
    };
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    titleAfter: string;
    lead: string;
    sections: {
      websites: string;
      visibility: string;
      branding: string;
      hosting: string;
    };
    seeMore: string;
    vatNote: string;
  };
  about: {
    meta: {
      title: string;
      description: string;
      ogTitle: string;
      ogDescription: string;
    };
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    titleAfter: string;
    lead: string;
    secondary: string;
    imageAlt: string;
    values: Array<{ titleAccent: string; titleRest: string; body: string }>;
    process: {
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      steps: Array<{ n: string; title: string; body: string }>;
    };
    cta: {
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      button: string;
    };
  };
  websites: {
    meta: {
      title: string;
      description: string;
      ogTitle: string;
      ogDescription: string;
    };
    hero: {
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      description: string;
      promo: string;
      promoLine1: string;
      promoLine2: string;
      phoneShop: {
        brand: string;
        product: string;
        price: string;
        addToCart: string;
      };
    };
    midBanner: {
      title: string;
      description: string;
      imageAlt: string;
    };
    popular: string;
    requestQuote: string;
    explore: string;
    packagesTitle: string;
    packages: Array<{
      name: string;
      tagline: string;
      summary: string;
      price: string;
      featured?: boolean;
      bullets: string[];
    }>;
    footnoteBefore: string;
    footnoteLink: string;
    footnoteAfter: string;
    process: {
      title: string;
      steps: Array<{ title: string; body: string }>;
    };
  };
  visibility: {
    meta: {
      title: string;
      description: string;
      ogTitle: string;
      ogDescription: string;
    };
    hero: {
      brand: string;
      headlineLine1: string;
      headlineLine2: string;
      searchPlaceholder: string;
      searchAriaLabel: string;
    };
    popular: string;
    contactCta: string;
    resultPrefix: string;
    explore: string;
    packagesTitle: string;
    packages: Array<{
      name: string;
      tagline: string;
      summary: string;
      description: string;
      price: string;
      featured?: boolean;
      bullets: string[];
      result: string;
    }>;
    footnote: string;
    branding: {
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      description: string;
      products: Array<{ name: string; description?: string; price: string }>;
      billing: {
        title: string;
        intro: string;
        providerLead: string;
        providerName: string;
        providerEmail: string;
        providerPhone: string;
        providerHours: string;
        providerSiteLabel: string;
        providerSiteUrl: string;
        providerAddressNote: string;
        groundsTitle: string;
        groundsBody: string[];
      };
      form: {
        title: string;
        name: string;
        email: string;
        phone: string;
        submit: string;
        sending: string;
        mailSubject: string;
        mailBody: string;
      };
    };
    cta: {
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      button: string;
    };
  };
  chatbot: {
    meta: {
      title: string;
      description: string;
      ogTitle: string;
      ogDescription: string;
    };
    hero: {
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      description: string;
      headlineLine1: string;
      headlineLine2: string;
      subtitle: string;
      cta: string;
    };
    chatbot: {
      eyebrow: string;
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      intro: string;
      benefits: Array<{ title: string; body: string }>;
      safeTitleBefore: string;
      safeTitleAccent: string;
      safeTitleAfter: string;
      safeBody: string;
      monthly: Array<{ title: string; body: string }>;
    };
    cta: {
      titleBefore: string;
      titleAccent: string;
      body: string;
      questions: string[];
      price: string;
      priceNote: string;
      button: string;
    };
  };
  booking: {
    meta: {
      title: string;
      description: string;
      ogTitle: string;
      ogDescription: string;
    };
    hero: {
      titleAccent: string;
      titleAfter: string;
      description: string;
      headlineLine1: string;
      headlineLine2: string;
      subtitle: string;
    };
    dashboard: {
      eyebrow: string;
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      body: string;
    };
    floorPlan: {
      eyebrow: string;
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      body: string;
    };
    features: Array<{ title: string; body: string }>;
    cta: {
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      price: string;
      priceNote: string;
      button: string;
    };
  };
  hosting: {
    meta: {
      title: string;
      description: string;
      ogTitle: string;
      ogDescription: string;
    };
    hero: {
      titleBefore: string;
      titleAccent: string;
      titleAfter: string;
      description: string;
      features: string[];
      askCta: string;
    };
    popular: string;
    requestQuote: string;
    explore: string;
    packagesTitle: string;
    packages: Array<{
      name: string;
      summary: string;
      price: string;
      featured?: boolean;
      bullets: string[];
    }>;
    footnote: string;
  };
  widget: {
    sales: {
      openLabel: string;
      closeLabel: string;
      openAria: string;
      closeAria: string;
      dialogAria: string;
      eyebrow: string;
      title: string;
      welcome: string;
      placeholder: string;
      sendAria: string;
      typing: string;
      sendFailed: string;
      genericError: string;
    };
    booking: {
      openLabel: string;
      closeLabel: string;
      openAria: string;
      closeAria: string;
      dialogAria: string;
      eyebrow: string;
      title: string;
      welcome: string;
      placeholder: string;
      sendAria: string;
      typing: string;
      sendFailed: string;
      genericError: string;
    };
  };
};
