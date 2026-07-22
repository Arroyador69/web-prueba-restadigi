/**
 * Brand theme: primary + secondary colours → CSS variables.
 * Mobile-friendly; used by landing and dashboard.
 */
(function (global) {
  var DEFAULT_PRIMARY = '#2563eb';
  var DEFAULT_SECONDARY = '#0f172a';

  function normalizeHex(value) {
    var h = String(value || '').trim();
    if (!h) return null;
    if (h.charAt(0) !== '#') h = '#' + h;
    if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h)) return null;
    if (h.length === 4) {
      h = '#' + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2) + h.charAt(3) + h.charAt(3);
    }
    return h.toLowerCase();
  }

  function hexToRgb(hex) {
    var h = normalizeHex(hex);
    if (!h) return { r: 37, g: 99, b: 235 };
    return {
      r: parseInt(h.slice(1, 3), 16),
      g: parseInt(h.slice(3, 5), 16),
      b: parseInt(h.slice(5, 7), 16)
    };
  }

  function rgbToHex(r, g, b) {
    function c(n) {
      var s = Math.max(0, Math.min(255, Math.round(n))).toString(16);
      return s.length === 1 ? '0' + s : s;
    }
    return '#' + c(r) + c(g) + c(b);
  }

  function darken(hex, amount) {
    var rgb = hexToRgb(hex);
    var f = 1 - (amount == null ? 0.18 : amount);
    return rgbToHex(rgb.r * f, rgb.g * f, rgb.b * f);
  }

  function rgba(hex, a) {
    var rgb = hexToRgb(hex);
    return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + a + ')';
  }

  function apply(primary, secondary) {
    var p = normalizeHex(primary) || DEFAULT_PRIMARY;
    var s = normalizeHex(secondary) || DEFAULT_SECONDARY;
    var root = document.documentElement;
    root.style.setProperty('--primary-color', p);
    root.style.setProperty('--primary-hover', darken(p, 0.18));
    root.style.setProperty('--primary-light', rgba(p, 0.12));
    root.style.setProperty('--secondary-color', s);
    try {
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', p);
    } catch (e) {}
    return { primary: p, secondary: s };
  }

  var PRESETS = [
    { primary: '#0d9488', secondary: '#134e4a', label: 'Teal' },
    { primary: '#2563eb', secondary: '#0f172a', label: 'Blue' },
    { primary: '#166534', secondary: '#14532d', label: 'Green' },
    { primary: '#c2410c', secondary: '#1c1917', label: 'Orange' },
    { primary: '#be123c', secondary: '#1f2937', label: 'Rose' },
    { primary: '#334155', secondary: '#0f172a', label: 'Slate' }
  ];

  global.BrandTheme = {
    DEFAULT_PRIMARY: DEFAULT_PRIMARY,
    DEFAULT_SECONDARY: DEFAULT_SECONDARY,
    PRESETS: PRESETS,
    normalizeHex: normalizeHex,
    apply: apply,
    darken: darken
  };
})(typeof window !== 'undefined' ? window : global);
