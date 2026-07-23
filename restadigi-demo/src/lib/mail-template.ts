/** Shared Finnish mail template defaults + placeholders (safe for client + server). */

export const DEFAULT_MAIL_SUBJECT = "Restadigi — verkkosivupaketti [YRITYS]";

export const DEFAULT_MAIL_BODY_FI = `Hei [ETUNIMI],

kiitos mielenkiinnostanne Restadigi.fi-palvelun verkkosivu- ja verkkonäkyvyyspaketteja kohtaan.

Juttelimme puhelimessa Start-verkkosivupaketista [YRITYS]-yritykselle. Paketti sisältää kaiken verkkosivujen suunnittelusta julkaisuun — myös sisällöntuotannon.

Viitaten puheluumme ja kuten sovimme, löydät verkkosivupakettimme tiedot oheisista liitteistä.

Jos sinulle herää kysymyksiä, voit vastata tähän sähköpostiin. Autamme mielellämme.

Restadigi.fi — verkkosivut, sisällöt ja digimarkkinointi helposti, nopeasti ja edullisesti, laadusta tinkimättä.

Tutustu palveluumme: https://restadigi.fi`;

export function applyMailPlaceholders(
  text: string,
  vars: { firstName?: string; company?: string },
) {
  return text
    .replaceAll("[ETUNIMI]", vars.firstName?.trim() || "[ETUNIMI]")
    .replaceAll("[YRITYS]", vars.company?.trim() || "[YRITYS]");
}
