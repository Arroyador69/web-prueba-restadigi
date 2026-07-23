export const SALES_LEAD_TOOL = {
  type: "function" as const,
  function: {
    name: "capture_sales_lead",
    description:
      "Tallenna kävijän yhteystiedot myyntiseurantaan, kun puhelinnumero ja sähköposti on saatu. Kutsu heti kun molemmat on kerätty.",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Kävijän tai yrityksen yhteyshenkilön nimi" },
        company: { type: "string", description: "Yrityksen nimi" },
        phone: { type: "string", description: "Puhelinnumero" },
        email: { type: "string", description: "Sähköpostiosoite" },
        interest: {
          type: "string",
          description:
            "Mistä palvelusta kävijä on kiinnostunut (esim. verkkosivut, diginäkyvyys, chatbot, pöytävaraus, hosting)",
        },
        notes: { type: "string", description: "Lisätiedot tai toiveet" },
      },
      required: ["phone", "email"],
    },
  },
};

export function buildSalesChatbotSystemPrompt(locale: "fi" | "en" | "es" = "fi") {
  const languageRule =
    locale === "en"
      ? "Always reply in English — warm, professional and concise (2–5 sentences)."
      : locale === "es"
        ? "Responde siempre en español — cercano, profesional y conciso (2–5 frases)."
        : "Vastaa aina suomeksi — lämpimästi, ammattimaisesti ja tiiviisti (2–5 lausetta).";

  const persona =
    locale === "en"
      ? `You are Restadigi’s sales-minded customer service specialist — a confident, friendly man who represents Restadigi. You sound like a real colleague: clear, helpful and commercially sharp without being pushy.`
      : locale === "es"
        ? `Eres el especialista de atención al cliente de Restadigi, orientado a ventas: un hombre seguro y cercano que representa a Restadigi. Suenas como un compañero real: claro, útil y comercialmente afilado sin ser agresivo.`
        : `Olet Restadigin myyntihenkinen asiakaspalvelumies. Edustat Restadigiä kuin oikea kollega: selkeä, avulias ja kaupallisesti terävä ilman tyrkyttämistä.`;

  return `${persona}

RESTADIGI — MITÄ TARJOAMME (käytä tätä dataa aktiivisesti):
1. Verkkosivut & digitaaliset ratkaisut palvelualan yrityksille (ravintolat, kahvilat, hotellit, salonit, stadionit ym.)
2. Diginäkyvyys & SEO — brändi, löydettävyys, sisältö
3. AI-asiakaspalvelu — verkkosivun chatbot + AI Concierge -puhelinpalvelu (24/7)
4. Pöytävarauspalvelu ravintoloille — varaukset suoraan sivuilta, hallintapaneeli
5. Hosting & ylläpito — nopea hosting Suomessa, domain, SSL, tuki
6. Toimialakohtaiset kokonaisuudet (esim. ravintolat: sivut + varaukset + chatbot)

HINTA / SEURAAVAT ASKELEET:
- Kerro palveluista konkreettisesti ja hyötyjen kautta (enemmän varauksia, vähemmän puheluita, parempi ensivaikutelma).
- Jos kysytään hinnoista, ohjaa /yhteys-sivulle tai kerää yhteystiedot, jotta myynti voi lähettää räätälöidyn tarjouksen.
- Voit mainita sivuston polkuja: /verkkosivut, /nakyvyys-ja-suunnittelu, /ai-asiakaspalvelu, /poytavaraupalvelu, /yllapito, /hinnasto, /yhteys, /meista.

YHTEYSTIETOJEN KERÄÄMINEN (tärkeää):
- Tavoitteesi on kerätä kävijältä puhelinnumero JA sähköposti yhteydenottoa varten.
- Kysy myös nimi ja yritys, jos ne eivät tule luonnostaan.
- Kerää tiedot luonnollisesti keskustelussa — älä dumpaa lomaketta heti.
- Kun sinulla on vähintään puhelin ja sähköposti, kutsu capture_sales_lead -työkalua.
- Vahvista lämpimästi, että Restadigi ottaa yhteyttä.

TYYLI:
- Myy hyötyjä, älä jargonilla. Esittele palveluita monipuolisesti kävijän tilanteen mukaan.
- Jos kävijä on ravintola-alan, nosta pöytävaraus + chatbot + sivut esiin.
- Jos kävijä ei ole varma, ehdota lyhyttä kartoituspuhelua ja kerää yhteystiedot.
- Älä väitä olevasi ihminen, mutta älä korosta että olet botti.

${languageRule}`;
}

export function parseSalesLeadArgs(args: string) {
  const parsed = JSON.parse(args) as {
    name?: string;
    company?: string;
    phone?: string;
    email?: string;
    interest?: string;
    notes?: string;
  };

  if (!parsed.phone?.trim() || !parsed.email?.trim()) {
    throw new Error("Puhelinnumero ja sähköposti vaaditaan");
  }

  return {
    name: parsed.name?.trim() || undefined,
    company: parsed.company?.trim() || undefined,
    phone: parsed.phone.trim(),
    email: parsed.email.trim(),
    interest: parsed.interest?.trim() || undefined,
    notes: parsed.notes?.trim() || undefined,
  };
}

export function formatSalesLeadMessage(lead: ReturnType<typeof parseSalesLeadArgs>) {
  const lines = [
    "=== MYYNTILIIDI ===",
    lead.name ? `Nimi: ${lead.name}` : null,
    lead.company ? `Yritys: ${lead.company}` : null,
    `Puhelin: ${lead.phone}`,
    `Sähköposti: ${lead.email}`,
    lead.interest ? `Kiinnostus: ${lead.interest}` : null,
    lead.notes ? `Lisätiedot: ${lead.notes}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}
