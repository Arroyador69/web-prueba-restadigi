import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const useAbsoluteLogo = process.argv.includes("--abs-logo");
const logoFs = path.join(root, "src/assets/restadigi-logo.png");
const logoRel = useAbsoluteLogo
  ? "file:///" + logoFs.replace(/\\/g, "/")
  : "../src/assets/restadigi-logo.png";

const assetUri = (name) =>
  useAbsoluteLogo
    ? "file:///" + path.join(root, "src/assets", name).replace(/\\/g, "/")
    : `../src/assets/${name}`;

const imgGoogle = assetUri("pkg-vis-google.jpg");
const imgAi = assetUri("pkg-vis-ai.jpg");
const imgChat = assetUri("pdf-digi-chat.jpg");
const imgBook = assetUri("pdf-digi-booking.jpg");

const cssShared = `
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  width: 210mm; height: 297mm;
  font-family: "Segoe UI", Calibri, Arial, sans-serif;
  color: #2a2018; background: #fff;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
.page {
  width: 210mm; height: 297mm; padding: 10mm 11mm 9mm;
  display: flex; flex-direction: column; background: #fff; position: relative; overflow: hidden;
}
.header {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 14px; padding-bottom: 9px; border-bottom: 3px solid #432f24;
  margin-bottom: 9px; flex-shrink: 0; position: relative; z-index: 2;
}
.brand-wrap { display: flex; flex-direction: column; gap: 3px; }
.logo { display: block; height: 72px; width: auto; }
.brand-sub { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #7a6a5c; font-weight: 700; }
.header-right { text-align: right; font-size: 11px; line-height: 1.45; color: #5a4a3e; }
.header-right strong { display: block; color: #432f24; font-size: 13px; margin-bottom: 2px; }
.intro { font-size: 11.5px; line-height: 1.4; color: #4a3c32; margin-bottom: 10px; flex-shrink: 0; position: relative; z-index: 2; }
.section-title { font-size: 10px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #432f24; margin: 0 0 7px; flex-shrink: 0; position: relative; z-index: 2; }
.card {
  border: 2px solid #432f24; border-radius: 10px; padding: 11px 12px 10px;
  background: #fbf8f4; position: relative; display: flex; flex-direction: column; min-height: 0; z-index: 2;
}
.card.featured { border-color: #2a1c16; border-width: 2.5px; background: linear-gradient(165deg, #fff7f0 0%, #fbf8f4 60%); }
.badge { position: absolute; top: 9px; right: 9px; background: #c45c26; color: #fff; font-size: 8px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 7px; border-radius: 999px; }
.name { font-size: 17px; font-weight: 800; color: #432f24; padding-right: 54px; line-height: 1.15; }
.price { margin-top: 2px; font-size: 15px; font-weight: 800; color: #c45c26; }
.tagline { margin-top: 3px; font-size: 10.5px; line-height: 1.3; color: #5a4a3e; font-style: italic; }
.divider { height: 1px; background: #e0d6cb; margin: 7px 0 6px; flex-shrink: 0; }
ul { list-style: none; display: flex; flex-direction: column; gap: 4px; flex: 1; }
li { position: relative; padding-left: 11px; font-size: 10px; line-height: 1.32; color: #3a2f27; }
li::before { content: ""; position: absolute; left: 0; top: 0.42em; width: 4.5px; height: 4.5px; border-radius: 50%; background: #432f24; }
.card.featured li::before { background: #c45c26; }
.note { font-size: 10.5px; line-height: 1.4; color: #3a2f27; background: #f1ebe3; border-radius: 8px; padding: 9px 11px; margin-bottom: 7px; flex-shrink: 0; position: relative; z-index: 2; }
.note strong { color: #432f24; }
.footer { margin-top: auto; padding-top: 7px; border-top: 1.5px solid #d4c9bc; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #5a4a3e; flex-shrink: 0; position: relative; z-index: 2; }
.footer a { color: #432f24; text-decoration: none; font-weight: 800; }
`;

const web = `<!DOCTYPE html>
<html lang="fi">
<head>
<meta charset="utf-8" />
<title>Restadigi – Verkkosivu- ja hosting-paketit</title>
<style>${cssShared}
.grid-web { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 8px; flex: 1.3; min-height: 0; margin-bottom: 8px; position: relative; z-index: 2; }
.grid-host { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; flex: 0.8; min-height: 0; margin-bottom: 8px; position: relative; z-index: 2; }
.shared { border-radius: 9px; padding: 9px 11px; background: #432f24; color: #f7f3ee; margin-bottom: 8px; flex-shrink: 0; position: relative; z-index: 2; }
.shared h2 { font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; opacity: 0.88; }
.shared-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px 12px; }
.shared-grid span { font-size: 9.5px; line-height: 1.3; position: relative; padding-left: 12px; }
.shared-grid span::before { content: "✓"; position: absolute; left: 0; color: #e8a06a; font-weight: 800; }
.footnote { font-size: 9px; line-height: 1.35; color: #6a5a4e; margin-bottom: 6px; flex-shrink: 0; position: relative; z-index: 2; }
</style>
</head>
<body>
<div class="page">
  <header class="header">
    <div class="brand-wrap">
      <img class="logo" src="${logoRel}" alt="Restadigi" />
      <div class="brand-sub">Verkkosivu- ja hosting-paketit</div>
    </div>
    <div class="header-right">
      <strong>www.restadigi.fi</strong>
      info@restadigi.fi<br />
      +358 403 738 332<br />
      Asiakaspalvelu ma–pe 9.00–16.00
    </div>
  </header>
  <p class="intro">Selkeät ja vaikuttavat kotisivupaketit yrityksille ja yhdistyksille. Kiinteät hinnat – ammattimainen toteutus, hallintapaneeli ja perus-SEO sisältyvät verkkosivupaketteihin.</p>
  <h2 class="section-title">Verkkosivupaketit</h2>
  <div class="grid-web">
    <article class="card"><div class="name">Start</div><div class="price">399 € + alv</div><p class="tagline">Yksinkertainen mutta vaikuttava sivusto pienyritykselle</p><div class="divider"></div><ul><li>Ammattimainen 1–3-sivuinen verkkosivusto</li><li>Perustekstit etusivulle, palveluille ja yhteystiedoille</li><li>Hallintapaneeli, responsiivisuus ja yhteydenottolomake</li><li>Perus-SEO · toimitus jopa 5 arkipäivässä</li><li>30 päivän asiakastuki julkaisun jälkeen</li></ul></article>
    <article class="card"><div class="name">Plus</div><div class="price">549 € + alv</div><p class="tagline">Tyylikäs kokonaisuus, joka esittelee palvelusi selkeästi</p><div class="divider"></div><ul><li>Ammattimainen 4–6-sivuinen verkkosivusto</li><li>Perustekstit etusivulle, palveluille ja yhteystiedoille</li><li>Hallintapaneeli, responsiivisuus ja yhteydenottolomake</li><li>Perus-SEO · toimitus jopa 5 arkipäivässä</li><li>30 päivän asiakastuki julkaisun jälkeen</li></ul></article>
    <article class="card"><div class="name">Kulta</div><div class="price">759 € + alv</div><p class="tagline">7–9 sivua ja AI-asiakaspalvelu 1 vuodeksi</p><div class="divider"></div><ul><li>Ammattimainen 7–9-sivuinen verkkosivusto</li><li>Kaikki Start/Plus-perussisällöt</li><li>AI-asiakaspalvelu (chatbot) 1 vuodeksi</li><li>Vastaa asiakkaille 24/7 ja kerää liidejä</li><li>Perus-SEO · nopea toimitus · 30 pv tuki</li></ul></article>
    <article class="card featured"><span class="badge">Suosittu</span><div class="name">Timantti</div><div class="price">929 € + alv</div><p class="tagline">Yli 10 sivua, AI ja valitsemasi varauspalvelu 1 vuodeksi</p><div class="divider"></div><ul><li>Ammattimainen yli 10-sivuinen verkkosivusto</li><li>AI-asiakaspalvelu (chatbot) 1 vuodeksi</li><li>Valitsemasi varauspalvelu 1 vuodeksi</li><li>Esim. pöytä-, majoitus- tai ajanvaraus</li><li>Perus-SEO · nopea toimitus · 30 pv tuki</li></ul></article>
  </div>
  <section class="shared"><h2>Kaikissa verkkosivupaketeissa</h2><div class="shared-grid"><span>Hallintapaneeli sisältöjen päivitykseen</span><span>Toimii mobiilissa, tabletissa ja tietokoneella</span><span>Yhteydenottolomake</span><span>Perus-SEO (meta, sivukartta)</span><span>Toimitus jopa 5 arkipäivässä</span><span>30 päivän asiakastuki julkaisun jälkeen</span></div></section>
  <h2 class="section-title">Hosting-paketit</h2>
  <div class="grid-host">
    <article class="card"><div class="name">Basic</div><div class="price">11,90 € / kk + alv</div><p class="tagline">Laskutetaan vuosittain</p><div class="divider"></div><ul><li>Hosting ja verkkotunnus sisältyvät hintaan</li><li>Nopea ja luotettava hosting Suomessa</li><li>SSL-sertifikaatti (HTTPS) sisältyy</li><li>Domain (.fi tai muu) sisältyy hintaan</li></ul></article>
    <article class="card featured"><span class="badge">Suosittu</span><div class="name">Pro Business</div><div class="price">29,99 € / kk + alv</div><p class="tagline">Kuukausilaskutus · täysi ylläpito</p><div class="divider"></div><ul><li>Hosting, domain ja SSL sisältyvät</li><li>Sähköpostiosoitteet sisältyvät</li><li>Jatkuva ylläpito, päivitykset ja tietoturva</li><li>Pienet sisältömuutokset · henkilökohtainen puhelintuki</li><li>AI- ja/tai varauspalvelun tuki ja kehitys</li></ul></article>
  </div>
  <p class="note"><strong>Domain ja hosting:</strong> Pakettihinnat ovat kiinteitä. Verkkotunnus ja hosting valitaan erikseen ylläpitopalveluista. Voit myös ostaa domainin ja verkkohotellin itse tai käyttää jo olemassa olevaa domainia.</p>
  <p class="footnote">Basic-paketti laskutetaan vuosittain (11,90 € / kk). Pro Business laskutetaan kuukausittain. Domain ja SSL-sertifikaatti sisältyvät hosting-paketteihin.</p>
  <footer class="footer"><span>Restadigi Finland · Erkkiläntie 47, 04740 Mäntsälä</span><a href="https://www.restadigi.fi">www.restadigi.fi</a></footer>
</div>
</body>
</html>`;

const digi = `<!DOCTYPE html>
<html lang="fi">
<head>
<meta charset="utf-8" />
<title>Restadigi – Digipalvelut</title>
<style>${cssShared}
.page { padding: 9mm 10mm 8mm; }
.logo { height: 62px; }
.intro { font-size: 11px; margin-bottom: 7px; line-height: 1.38; }
.section-title { margin-bottom: 5px; font-size: 10px; }
.header { margin-bottom: 7px; padding-bottom: 7px; }
.grid {
  display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;
  gap: 7px; flex: 1; min-height: 0; margin-bottom: 6px; position: relative; z-index: 2;
}
.card { padding: 0; overflow: hidden; background: #fbf8f4; }
.card-media {
  width: 100%; height: 28mm; min-height: 28mm; max-height: 28mm;
  object-fit: cover; object-position: center 28%;
  display: block; border-bottom: 1px solid #e0d6cb; flex-shrink: 0;
  background: #fff;
}
.card-media--devices {
  object-fit: contain; object-position: center center;
  padding: 3mm 2mm; height: 28mm; box-sizing: border-box;
}
.card-body { padding: 6px 9px 7px; display: flex; flex-direction: column; flex: 1; min-height: 0; justify-content: flex-start; }
.name { font-size: 14.5px; padding-right: 54px; }
.price { font-size: 13px; margin-top: 1px; }
.tagline { font-size: 10px; margin-top: 2px; line-height: 1.28; }
.blurb {
  display: block; margin-top: 4px; font-size: 9.5px; line-height: 1.32; color: #4a3c32; flex-shrink: 0;
}
.divider { margin: 5px 0 4px; }
ul { gap: 3px; flex: 0; justify-content: flex-start; }
li { font-size: 9.5px; line-height: 1.3; padding-left: 11px; }
.result { margin-top: auto; padding-top: 5px; border-top: 1px dashed #d9d0c6; font-size: 9.5px; line-height: 1.28; color: #432f24; font-weight: 700; flex-shrink: 0; }
.note { font-size: 9.5px; padding: 7px 9px; margin-bottom: 4px; }
.icon-row { display: none; }
.decor { display: none; }
.badge { top: 7px; right: 7px; font-size: 8px; z-index: 3; }
</style>
</head>
<body>
<div class="page">
  <header class="header">
    <div class="brand-wrap">
      <img class="logo" src="${logoRel}" alt="Restadigi" />
      <div class="brand-sub">Diginäkyvyys · AI · Varaukset</div>
    </div>
    <div class="header-right">
      <strong>www.restadigi.fi</strong>
      info@restadigi.fi<br />
      +358 403 738 332<br />
      Asiakaspalvelu ma–pe 9.00–16.00
    </div>
  </header>
  <p class="intro">Neljä palvelua, joilla parannat löydettävyyttä, asiakaspalvelua ja varauksia. Vuosihinnat – maksat vain siitä, mitä tarvitset. Palvelut voi yhdistää verkkosivu- ja hosting-paketteihin.</p>
  <h2 class="section-title">Palvelut</h2>
  <div class="grid">
    <article class="card">
      <img class="card-media card-media--devices" src="${imgGoogle}" alt="" />
      <div class="card-body">
        <div>
          <div class="name">Google-optimointi</div>
          <div class="price">alk. 99 € / vuosi</div>
          <p class="tagline">Varmista, että asiakkaat löytävät yrityksesi</p>
          <p class="blurb">Kevyt vuosittainen SEO-ylläpito: sivusto täyttää perusvaatimukset ja tukee löydettävyyttä Googlessa.</p>
        </div>
        <div class="divider"></div>
        <ul>
          <li>Verkkosivujen perustason SEO-tarkistus</li>
          <li>Sivujen otsikoiden ja metakuvausten läpikäynti</li>
          <li>Yrityksen tärkeimpien hakusanojen arviointi</li>
          <li>Teknisten perusasioiden tarkistus (nopeus, rakenne)</li>
          <li>Kehitysehdotukset näkyvyyden parantamiseksi</li>
          <li>Vuosittainen tarkistus ja päivitys – ei piilokuluja</li>
        </ul>
        <p class="result">→ Yrityksesi näkyvyys Googlessa pysyy ajan tasalla.</p>
      </div>
    </article>
    <article class="card">
      <img class="card-media card-media--devices" src="${imgAi}" alt="" />
      <div class="card-body">
        <div>
          <div class="name">AI-optimointi</div>
          <div class="price">alk. 99 € / vuosi</div>
          <p class="tagline">Näkyväksi ChatGPT:n, Clauden, Geminin ja Copilotin hauissa</p>
          <p class="blurb">Pidä yritystiedot ajan tasalla, jotta ChatGPT, Claude, Gemini ja Copilot tunnistavat yrityksesi oikein.</p>
        </div>
        <div class="divider"></div>
        <ul>
          <li>Yrityksen verkkosivujen AI-näkyvyyden tarkistus</li>
          <li>Tärkeimpien yritystietojen läpikäynti</li>
          <li>Sisältöjen ja metatietojen perusoptimoinnin suositukset</li>
          <li>Rakenteellisten puutteiden tunnistaminen</li>
          <li>Vuosittainen tarkistus ja päivitys</li>
          <li>Valmius tulevaisuuden hakutapoihin jo nyt</li>
        </ul>
        <p class="result">→ Yrityksesi on mukana myös tulevaisuuden hauissa.</p>
      </div>
    </article>
    <article class="card featured">
      <img class="card-media" src="${imgChat}" alt="" />
      <span class="badge">Suosittu</span>
      <div class="card-body">
        <div>
          <div class="name">AI-asiakaspalvelu</div>
          <div class="price">alk. 199 € / vuosi</div>
          <p class="tagline">Chatbot – ympärivuorokautinen myyjä ja asiakaspalvelija</p>
          <p class="blurb">Chatbot sivuille: vastaa kysymyksiin, ohjaa palveluihin ja kerää liidejä 24/7 – myös kun henkilökunta on vapaalla.</p>
        </div>
        <div class="divider"></div>
        <ul>
          <li>Asiakaspalvelu 24/7 – vastaukset heti ilman jonotusta</li>
          <li>Tehokas liidien keräys myös yöaikaan</li>
          <li>Kasvanut konversio matalalla yhteydenottokynnyksellä</li>
          <li>Resurssien säästö: rutiinikysymykset botille</li>
          <li>Päivittyvä teknologia ja botin koulutus yrityksesi datalla</li>
          <li>Avaimet käteen -ylläpito asiantuntijoiltamme</li>
        </ul>
        <p class="result">→ Palvele paremmin. Kerää liidejä. Kasva tehokkaammin.</p>
      </div>
    </article>
    <article class="card featured">
      <img class="card-media" src="${imgBook}" alt="" />
      <span class="badge">Ravintolat</span>
      <div class="card-body">
        <div>
          <div class="name">Pöytävarauspalvelu</div>
          <div class="price">alk. 299 € / vuosi</div>
          <p class="tagline">Asiakkaat varaavat pöydän itse – 24/7</p>
          <p class="blurb">Asiakas varaa ajan ja seurueen koon sivuilta; vahvistus sähköpostiin ja varaukset hallintapaneeliin.</p>
        </div>
        <div class="divider"></div>
        <ul>
          <li>Varaukset suoraan verkkosivuiltasi ympäri vuorokauden</li>
          <li>Vähemmän no-showta: vahvistukset ja muistutukset</li>
          <li>Selkeä hallinta kalenterissa ja listalla</li>
          <li>Kustomoitu pöytäkartta salin mukaan</li>
          <li>Sama näkymä puhelimella, tabletilla ja isolla näytöllä</li>
          <li>Integroitu sivustosi ilmeeseen · kiinteä vuosihinta</li>
        </ul>
        <p class="result">→ Ota pöytävaraukset haltuun ilman puhelinkierrosta.</p>
      </div>
    </article>
  </div>
  <p class="note"><strong>Huomio:</strong> Hinnat ovat vuosihintoja (alk. + alv). Palvelut voidaan yhdistää verkkosivu- ja hosting-paketteihin. Kysy sopiva kokonaisuus: info@restadigi.fi · +358 403 738 332</p>
  <footer class="footer"><span>Restadigi Finland · Erkkiläntie 47, 04740 Mäntsälä</span><a href="https://www.restadigi.fi">www.restadigi.fi</a></footer>
</div>
</body>
</html>`;

fs.writeFileSync(path.join(root, "docs/verkkosivupaketit-a4.html"), web, "utf8");
fs.writeFileSync(path.join(root, "docs/digipalvelut-a4.html"), digi, "utf8");
console.log("written utf8", useAbsoluteLogo ? "(abs logo)" : "(rel logo)");
console.log("euro ok:", web.includes("€") && digi.includes("€"));
console.log("ä ok:", web.includes("Mäntsälä"));
