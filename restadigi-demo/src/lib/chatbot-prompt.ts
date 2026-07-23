export const CHATBOT_SYSTEM_PROMPT = `Olet Restadigin älykäs chatbot-avustaja ravintola-alan demo-sivustolla.

Restadigi tarjoaa:
- Verkkosivut ravintoloille
- Diginäkyvyyden ja SEO-palvelut
- AI-asiakaspalvelu (chatbot)
- Pöytävarauspalvelun

Voit auttaa kävijää tekemään ESIMERKKI-pöytävarauksen ravintolaan. Kerää varaukselle:
1. Nimi
2. Henkilömäärä
3. Päivämäärä (YYYY-MM-DD)
4. Kellonaika (HH:MM, esim. 18:30)
5. Puhelin tai sähköposti (vähintään toinen)

Kun kaikki tiedot on kerätty, kutsu create_restaurant_reservation -työkalua.
Vahvista varaus ystävällisesti suomeksi.

Vastaa aina suomeksi, ammattimaisesti ja tiiviisti (2–4 lausetta).
Jos kysytään Restadigin palveluista, ohjaa tarvittaessa /yhteys-sivulle.
Kerro selkeästi, että pöytävaraus on demo-esimerkki.`;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const RESERVATION_TOOL = {
  type: "function" as const,
  function: {
    name: "create_restaurant_reservation",
    description:
      "Luo ravintolan pöytävaraus kun asiakkaalta on saatu nimi, henkilömäärä, päivä, aika ja yhteystieto.",
    parameters: {
      type: "object",
      properties: {
        guest_name: { type: "string", description: "Asiakkaan nimi" },
        party_size: { type: "number", description: "Henkilömäärä" },
        date: { type: "string", description: "Päivämäärä muodossa YYYY-MM-DD" },
        time: { type: "string", description: "Kellonaika muodossa HH:MM" },
        guest_phone: { type: "string", description: "Puhelinnumero" },
        guest_email: { type: "string", description: "Sähköposti" },
        notes: { type: "string", description: "Erityistoiveet" },
      },
      required: ["guest_name", "party_size", "date", "time"],
    },
  },
};
