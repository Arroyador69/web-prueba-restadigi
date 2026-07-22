/**
 * i18n ES / EN / FI — selector compartido en demos, landing, login y dashboard.
 * Uso: I18n.t('key') | I18n.setLang('en') | I18n.langSelectorHtml()
 */
(function (global) {
  var STORAGE_KEY = 'app_lang';
  var SUPPORTED = ['es', 'en', 'fi'];

  var DICT = {
    es: {
      lang_es: 'Español', lang_en: 'English', lang_fi: 'Suomi',
      language: 'Idioma',
      // Common
      email: 'Email', password: 'Contraseña', name: 'Nombre', phone: 'Teléfono',
      save: 'Guardar', cancel: 'Cancelar', delete: 'Eliminar', edit: 'Editar',
      create: 'Crear', update: 'Actualizar', loading: 'Cargando...', search: 'Buscar',
      yes: 'Sí', no: 'No', close: 'Cerrar', copy: 'Copiar', optional: 'opcional',
      // Login
      login_title: 'Dashboard',
      login_subtitle: 'Inicia sesión para gestionar tus citas',
      login_btn: 'Iniciar sesión',
      login_loading: 'Iniciando sesión...',
      login_forgot: '¿Olvidaste tu contraseña? Restablecer',
      login_email_ph: 'tu@email.com',
      login_pass_ph: 'Tu contraseña',
      // Landing
      landing_book_title: 'Reservar cita',
      landing_book_intro: 'Completa tus datos y elige fecha y hora. Solo se crean citas reales; recibirás confirmación por email.',
      landing_full_name: 'Nombre completo *',
      landing_name_ph: 'Tu nombre',
      landing_email: 'Email *',
      landing_phone: 'Teléfono (recomendado para confirmaciones)',
      landing_date: 'Fecha *',
      landing_time: 'Hora *',
      landing_choose_time: 'Elige una hora',
      landing_loading_slots: 'Cargando horarios...',
      landing_no_slots: 'No hay horas disponibles este día',
      landing_legal: 'Acepto la política de privacidad y el consentimiento',
      landing_view_legal: 'Ver textos legales',
      landing_submit: 'Confirmar reserva',
      landing_submitting: 'Reservando...',
      landing_welcome: 'Bienvenido',
      landing_default_sub: 'Reserva tu cita de forma sencilla y rápida.',
      landing_cta: 'Reservar cita',
      landing_about: 'Sobre la consulta',
      landing_clinic: 'Consultorio',
      // Demos
      demos_eyebrow: 'Ventas · multi-tenant',
      demos_title: 'Demos por llamada',
      demos_intro: 'Crea un espacio aislado, envía la landing, activa el usuario y copia todos los enlaces. Cambia el idioma con el selector.',
      demos_access: 'Acceso equipo',
      demos_access_hint: 'Clave DEMO_ADMIN_SECRET de Vercel.',
      demos_key_ph: 'Clave de demos',
      demos_enter: 'Entrar',
      demos_exit: 'Salir',
      demos_new: 'Nueva demo (durante la llamada)',
      demos_new_hint: 'Nombre + email → enlace único para WhatsApp.',
      demos_biz_name: 'Nombre consulta / psicólogo',
      demos_create: 'Crear y copiar landing',
      demos_landing_ready: 'Landing lista para enviar',
      demos_whatsapp: 'WhatsApp',
      demos_list: 'Todos los demos y accesos',
      demos_refresh: 'Actualizar',
      demos_empty: 'Aún no hay demos.',
      demos_appointments: 'citas',
      demos_users: 'usuarios',
      demos_principal: 'principal',
      demos_activate: 'Activar / crear usuario',
      demos_delete: 'Eliminar',
      demos_landing_label: 'Landing (enviar en la llamada)',
      demos_login_label: 'Login dashboard',
      demos_dash_label: 'Dashboard (tras login)',
      demos_users_title: 'Usuarios con acceso a este negocio',
      demos_no_users: 'Todavía no hay usuario. Usa «Activar / crear usuario».',
      demos_email_login: 'Email login',
      demos_copy_pack: 'Copiar pack de acceso (landing + login + email)',
      demos_modal_title: 'Crear acceso dashboard',
      demos_modal_hint: 'Tú eliges email y contraseña. Quedan ligados solo a este negocio.',
      demos_pass_label: 'Contraseña (la que tú creas)',
      demos_create_user: 'Crear usuario',
      demos_copy_all: 'Copiar todo para enviarle',
      demos_user_ready: 'Usuario creado. Copia el pack de acceso y envíaselo.',
      // Dashboard nav
      dash_panel: 'Panel de gestión',
      dash_logout: 'Cerrar sesión',
      tab_home: 'Inicio',
      tab_appointments: 'Citas',
      tab_patients: 'Pacientes',
      tab_landing: 'Landing',
      tab_invoices: 'Facturas',
      tab_reputation: 'Reputación',
      tab_config: 'Configuración',
      tab_hours: 'Horarios',
      tab_blocked: 'Bloqueos',
      tab_users: 'Usuarios',
      dash_sessions_month: 'Sesiones este mes',
      dash_billing: 'Facturación estimada (€)',
      dash_cancellations: 'Cancelaciones',
      dash_active_patients: 'Pacientes activos (mes)',
      dash_appointments: 'Citas',
      dash_new_appointment: '+ Crear cita',
      dash_refresh: 'Actualizar',
      dash_prev: '← Anterior',
      dash_today: 'Hoy',
      dash_next: 'Siguiente →',
      dash_legend: 'Leyenda',
      st_confirmed: 'confirmada',
      st_completed: 'completada',
      st_past: 'pasada',
      st_cancelled: 'cancelada',
      st_pending: 'pendiente',
      st_no_show: 'no asistió',
      day_0: 'Domingo', day_1: 'Lunes', day_2: 'Martes', day_3: 'Miércoles',
      day_4: 'Jueves', day_5: 'Viernes', day_6: 'Sábado',
      patients_title: 'Pacientes',
      patients_new: '+ Nuevo paciente',
      patients_search: 'Buscar paciente',
      patients_status: 'Estado',
      hours_title: 'Horarios de Atención',
      blocked_title: 'Bloqueos',
      users_title: 'Usuarios',
      config_title: 'Configuración',
      landing_tab_title: 'Landing page',
      invoices_title: 'Facturas',
      reputation_title: 'Reputación'
    },
    en: {
      lang_es: 'Español', lang_en: 'English', lang_fi: 'Suomi',
      language: 'Language',
      email: 'Email', password: 'Password', name: 'Name', phone: 'Phone',
      save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit',
      create: 'Create', update: 'Refresh', loading: 'Loading...', search: 'Search',
      yes: 'Yes', no: 'No', close: 'Close', copy: 'Copy', optional: 'optional',
      login_title: 'Dashboard',
      login_subtitle: 'Sign in to manage your appointments',
      login_btn: 'Sign in',
      login_loading: 'Signing in...',
      login_forgot: 'Forgot your password? Reset',
      login_email_ph: 'you@email.com',
      login_pass_ph: 'Your password',
      landing_book_title: 'Book appointment',
      landing_book_intro: 'Fill in your details and choose a date and time. Only real bookings are created; you will get an email confirmation.',
      landing_full_name: 'Full name *',
      landing_name_ph: 'Your name',
      landing_email: 'Email *',
      landing_phone: 'Phone (recommended for confirmations)',
      landing_date: 'Date *',
      landing_time: 'Time *',
      landing_choose_time: 'Choose a time',
      landing_loading_slots: 'Loading times...',
      landing_no_slots: 'No times available this day',
      landing_legal: 'I accept the privacy policy and consent',
      landing_view_legal: 'View legal texts',
      landing_submit: 'Confirm booking',
      landing_submitting: 'Booking...',
      landing_welcome: 'Welcome',
      landing_default_sub: 'Book your appointment quickly and easily.',
      landing_cta: 'Book appointment',
      landing_about: 'About the practice',
      landing_clinic: 'Practice',
      demos_eyebrow: 'Sales · multi-tenant',
      demos_title: 'Call demos',
      demos_intro: 'Create an isolated space, send the landing, activate the user and copy all access links. Switch language with the selector.',
      demos_access: 'Team access',
      demos_access_hint: 'DEMO_ADMIN_SECRET key from Vercel.',
      demos_key_ph: 'Demos password',
      demos_enter: 'Enter',
      demos_exit: 'Log out',
      demos_new: 'New demo (during the call)',
      demos_new_hint: 'Name + email → unique WhatsApp link.',
      demos_biz_name: 'Practice / psychologist name',
      demos_create: 'Create & copy landing',
      demos_landing_ready: 'Landing ready to send',
      demos_whatsapp: 'WhatsApp',
      demos_list: 'All demos and access links',
      demos_refresh: 'Refresh',
      demos_empty: 'No demos yet.',
      demos_appointments: 'appointments',
      demos_users: 'users',
      demos_principal: 'main',
      demos_activate: 'Activate / create user',
      demos_delete: 'Delete',
      demos_landing_label: 'Landing (send during the call)',
      demos_login_label: 'Dashboard login',
      demos_dash_label: 'Dashboard (after login)',
      demos_users_title: 'Users with access to this business',
      demos_no_users: 'No user yet. Use “Activate / create user”.',
      demos_email_login: 'Login email',
      demos_copy_pack: 'Copy access pack (landing + login + email)',
      demos_modal_title: 'Create dashboard access',
      demos_modal_hint: 'You choose email and password. They are linked only to this business.',
      demos_pass_label: 'Password (you create it)',
      demos_create_user: 'Create user',
      demos_copy_all: 'Copy everything to send them',
      demos_user_ready: 'User created. Copy the access pack and send it.',
      dash_panel: 'Management panel',
      dash_logout: 'Log out',
      tab_home: 'Home',
      tab_appointments: 'Appointments',
      tab_patients: 'Patients',
      tab_landing: 'Landing',
      tab_invoices: 'Invoices',
      tab_reputation: 'Reputation',
      tab_config: 'Settings',
      tab_hours: 'Hours',
      tab_blocked: 'Blocks',
      tab_users: 'Users',
      dash_sessions_month: 'Sessions this month',
      dash_billing: 'Estimated billing (€)',
      dash_cancellations: 'Cancellations',
      dash_active_patients: 'Active patients (month)',
      dash_appointments: 'Appointments',
      dash_new_appointment: '+ New appointment',
      dash_refresh: 'Refresh',
      dash_prev: '← Previous',
      dash_today: 'Today',
      dash_next: 'Next →',
      dash_legend: 'Legend',
      st_confirmed: 'confirmed',
      st_completed: 'completed',
      st_past: 'past',
      st_cancelled: 'cancelled',
      st_pending: 'pending',
      st_no_show: 'no-show',
      day_0: 'Sunday', day_1: 'Monday', day_2: 'Tuesday', day_3: 'Wednesday',
      day_4: 'Thursday', day_5: 'Friday', day_6: 'Saturday',
      patients_title: 'Patients',
      patients_new: '+ New patient',
      patients_search: 'Search patient',
      patients_status: 'Status',
      hours_title: 'Opening hours',
      blocked_title: 'Blocked slots',
      users_title: 'Users',
      config_title: 'Settings',
      landing_tab_title: 'Landing page',
      invoices_title: 'Invoices',
      reputation_title: 'Reputation'
    },
    fi: {
      lang_es: 'Español', lang_en: 'English', lang_fi: 'Suomi',
      language: 'Kieli',
      email: 'Sähköposti', password: 'Salasana', name: 'Nimi', phone: 'Puhelin',
      save: 'Tallenna', cancel: 'Peruuta', delete: 'Poista', edit: 'Muokkaa',
      create: 'Luo', update: 'Päivitä', loading: 'Ladataan...', search: 'Haku',
      yes: 'Kyllä', no: 'Ei', close: 'Sulje', copy: 'Kopioi', optional: 'valinnainen',
      login_title: 'Hallintapaneeli',
      login_subtitle: 'Kirjaudu sisään hallitaksesi aikoja',
      login_btn: 'Kirjaudu',
      login_loading: 'Kirjaudutaan...',
      login_forgot: 'Unohditko salasanan? Palauta',
      login_email_ph: 'sinä@email.com',
      login_pass_ph: 'Salasanasi',
      landing_book_title: 'Varaa aika',
      landing_book_intro: 'Täytä tietosi ja valitse päivä sekä kellonaika. Vain oikeita varauksia luodaan; saat vahvistuksen sähköpostiin.',
      landing_full_name: 'Koko nimi *',
      landing_name_ph: 'Nimesi',
      landing_email: 'Sähköposti *',
      landing_phone: 'Puhelin (suositellaan vahvistuksiin)',
      landing_date: 'Päivä *',
      landing_time: 'Aika *',
      landing_choose_time: 'Valitse aika',
      landing_loading_slots: 'Ladataan aikoja...',
      landing_no_slots: 'Ei vapaita aikoja tänä päivänä',
      landing_legal: 'Hyväksyn tietosuojaselosteen ja suostumuksen',
      landing_view_legal: 'Näytä juridinen teksti',
      landing_submit: 'Vahvista varaus',
      landing_submitting: 'Varataan...',
      landing_welcome: 'Tervetuloa',
      landing_default_sub: 'Varaa aikasi helposti ja nopeasti.',
      landing_cta: 'Varaa aika',
      landing_about: 'Vastaanotosta',
      landing_clinic: 'Vastaanotto',
      demos_eyebrow: 'Myynti · multi-tenant',
      demos_title: 'Demot puheluun',
      demos_intro: 'Luo eristetty tila, lähetä landing, aktivoi käyttäjä ja kopioi linkit. Vaihda kieltä valitsimesta.',
      demos_access: 'Tiimin pääsy',
      demos_access_hint: 'Vercelin DEMO_ADMIN_SECRET-avain.',
      demos_key_ph: 'Demo-salasana',
      demos_enter: 'Kirjaudu',
      demos_exit: 'Kirjaudu ulos',
      demos_new: 'Uusi demo (puhelun aikana)',
      demos_new_hint: 'Nimi + email → ainutlaatuinen WhatsApp-linkki.',
      demos_biz_name: 'Vastaanoton / psykologin nimi',
      demos_create: 'Luo ja kopioi landing',
      demos_landing_ready: 'Landing valmis lähetettäväksi',
      demos_whatsapp: 'WhatsApp',
      demos_list: 'Kaikki demot ja käyttöoikeudet',
      demos_refresh: 'Päivitä',
      demos_empty: 'Ei demoja vielä.',
      demos_appointments: 'aikaa',
      demos_users: 'käyttäjää',
      demos_principal: 'pää',
      demos_activate: 'Aktivoi / luo käyttäjä',
      demos_delete: 'Poista',
      demos_landing_label: 'Landing (lähetä puhelussa)',
      demos_login_label: 'Kirjautuminen',
      demos_dash_label: 'Hallinta (kirjautumisen jälkeen)',
      demos_users_title: 'Käyttäjät tällä tilillä',
      demos_no_users: 'Ei käyttäjää vielä. Käytä «Aktivoi / luo käyttäjä».',
      demos_email_login: 'Kirjautumissähköposti',
      demos_copy_pack: 'Kopioi käyttöpaketti (landing + login + email)',
      demos_modal_title: 'Luo hallinnan käyttöoikeus',
      demos_modal_hint: 'Sinä valitset sähköpostin ja salasanan. Ne liittyvät vain tähän tiliin.',
      demos_pass_label: 'Salasana (sinä luot sen)',
      demos_create_user: 'Luo käyttäjä',
      demos_copy_all: 'Kopioi kaikki lähetettäväksi',
      demos_user_ready: 'Käyttäjä luotu. Kopioi paketti ja lähetä se.',
      dash_panel: 'Hallintapaneeli',
      dash_logout: 'Kirjaudu ulos',
      tab_home: 'Etusivu',
      tab_appointments: 'Ajat',
      tab_patients: 'Potilaat',
      tab_landing: 'Landing',
      tab_invoices: 'Laskut',
      tab_reputation: 'Maine',
      tab_config: 'Asetukset',
      tab_hours: 'Aukioloajat',
      tab_blocked: 'Estot',
      tab_users: 'Käyttäjät',
      dash_sessions_month: 'Istunnot tässä kuussa',
      dash_billing: 'Arvioitu laskutus (€)',
      dash_cancellations: 'Peruutukset',
      dash_active_patients: 'Aktiiviset potilaat (kk)',
      dash_appointments: 'Ajat',
      dash_new_appointment: '+ Luo aika',
      dash_refresh: 'Päivitä',
      dash_prev: '← Edellinen',
      dash_today: 'Tänään',
      dash_next: 'Seuraava →',
      dash_legend: 'Selite',
      st_confirmed: 'vahvistettu',
      st_completed: 'valmis',
      st_past: 'mennyt',
      st_cancelled: 'peruttu',
      st_pending: 'odottaa',
      st_no_show: 'ei saapunut',
      day_0: 'Sunnuntai', day_1: 'Maanantai', day_2: 'Tiistai', day_3: 'Keskiviikko',
      day_4: 'Torstai', day_5: 'Perjantai', day_6: 'Lauantai',
      patients_title: 'Potilaat',
      patients_new: '+ Uusi potilas',
      patients_search: 'Hae potilasta',
      patients_status: 'Tila',
      hours_title: 'Aukioloajat',
      blocked_title: 'Estetyt ajat',
      users_title: 'Käyttäjät',
      config_title: 'Asetukset',
      landing_tab_title: 'Landing-sivu',
      invoices_title: 'Laskut',
      reputation_title: 'Maine'
    }
  };

  function detectLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    var nav = (navigator.language || 'es').toLowerCase();
    if (nav.indexOf('fi') === 0) return 'fi';
    if (nav.indexOf('en') === 0) return 'en';
    return 'es';
  }

  var current = detectLang();

  function t(key, fallback) {
    var pack = DICT[current] || DICT.es;
    if (pack[key] != null) return pack[key];
    if (DICT.es[key] != null) return DICT.es[key];
    return fallback != null ? fallback : key;
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    current = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    try { document.documentElement.lang = lang; } catch (e) {}
    applyDom();
    try {
      window.dispatchEvent(new CustomEvent('app-lang-changed', { detail: { lang: lang } }));
    } catch (e) {}
  }

  function getLang() { return current; }

  function applyDom(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', t(key));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      if (key) el.setAttribute('title', t(key));
    });
    scope.querySelectorAll('select.lang-switcher').forEach(function (sel) {
      if (sel.value !== current) sel.value = current;
    });
  }

  function langSelectorHtml(extraClass) {
    var cls = extraClass || '';
    return (
      '<label class="inline-flex items-center gap-2 text-sm ' + cls + '">' +
      '<span class="sr-only">' + t('language') + '</span>' +
      '<select class="lang-switcher border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white min-h-[40px]" ' +
      'onchange="window.I18n.setLang(this.value)" aria-label="' + t('language') + '">' +
      '<option value="es"' + (current === 'es' ? ' selected' : '') + '>ES · Español</option>' +
      '<option value="en"' + (current === 'en' ? ' selected' : '') + '>EN · English</option>' +
      '<option value="fi"' + (current === 'fi' ? ' selected' : '') + '>FI · Suomi</option>' +
      '</select></label>'
    );
  }

  /**
   * Helpers para Alpine: t() lee this.lang para que al cambiar el selector
   * se re-rendericen todos los x-text="t('...')".
   */
  function alpineHelpers() {
    return {
      lang: current,
      langHtml: langSelectorHtml(),
      t: function (key, fallback) {
        var lang = this.lang || current;
        var pack = DICT[lang] || DICT.es;
        if (pack[key] != null) return pack[key];
        if (DICT.es[key] != null) return DICT.es[key];
        return fallback != null ? fallback : key;
      },
      setLang: function (lang) {
        setLang(lang);
        this.lang = lang;
        this.langHtml = langSelectorHtml();
      },
      onLangChanged: function (e) {
        var lang = (e && e.detail && e.detail.lang) || getLang();
        this.lang = lang;
        this.langHtml = langSelectorHtml();
      },
      dayNames: function () {
        var lang = this.lang || current;
        var pack = DICT[lang] || DICT.es;
        return [0, 1, 2, 3, 4, 5, 6].map(function (i) {
          var k = 'day_' + i;
          return pack[k] || DICT.es[k] || k;
        });
      }
    };
  }

  // Init
  try { document.documentElement.lang = current; } catch (e) {}
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { applyDom(); });
  } else {
    applyDom();
  }

  global.I18n = {
    t: t,
    setLang: setLang,
    getLang: getLang,
    applyDom: applyDom,
    langSelectorHtml: langSelectorHtml,
    alpineHelpers: alpineHelpers,
    SUPPORTED: SUPPORTED
  };
})(typeof window !== 'undefined' ? window : global);
