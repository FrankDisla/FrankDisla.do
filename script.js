// ==========================================================
// Menú móvil
// ==========================================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ==========================================================
// Idioma (ES / EN)
// Cada elemento traducible trae data-es / data-en en el HTML.
// Se guarda la preferencia en localStorage.
// ==========================================================
const LANG_KEY = 'preferred_lang';
const langToggle = document.getElementById('langToggle');
const translatable = document.querySelectorAll('[data-es][data-en]');

function applyLang(lang) {
  translatable.forEach(el => {
    const text = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-es');
    if (text !== null) el.textContent = text;
  });

  document.documentElement.lang = lang;

  if (langToggle) {
    langToggle.querySelectorAll('.lang-toggle__opt').forEach(opt => {
      opt.classList.toggle('is-active', opt.dataset.lang === lang);
    });
  }

  localStorage.setItem(LANG_KEY, lang);
  typeConsole(lang);
}

function getInitialLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === 'es' || saved === 'en') return saved;
  return navigator.language && navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es';
}

if (langToggle) {
  langToggle.addEventListener('click', () => {
    const current = document.documentElement.lang === 'en' ? 'en' : 'es';
    applyLang(current === 'es' ? 'en' : 'es');
  });
}

// ==========================================================
// Fecha de última actualización
// ==========================================================
const lastUpdatedEl = document.getElementById('lastUpdated');
function renderLastUpdated(lang) {
  if (!lastUpdatedEl) return;
  const locale = lang === 'en' ? 'en-US' : 'es-DO';
  lastUpdatedEl.textContent = new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long'
  });
}

// ==========================================================
// Consola SOC animada (elemento firma del hero)
// Simula el triaje real de un incidente: detección -> IOC -> contención
// ==========================================================
const consoleLinesByLang = {
  es: [
    { level: 'INFO',  text: 'Conexión establecida — 190.111.xx.xx' },
    { level: 'INFO',  text: 'Iniciando monitoreo de tráfico entrante' },
    { level: 'WARN',  text: 'Múltiples intentos de login fallidos detectados' },
    { level: 'ALERT', text: 'Patrón de fuerza bruta identificado — IOC registrado' },
    { level: 'OK',    text: 'IP añadida a lista de bloqueo — contención aplicada' },
    { level: 'OK',    text: 'Incidente documentado — ciclo PICERL: Contención OK' },
  ],
  en: [
    { level: 'INFO',  text: 'Connection established — 190.111.xx.xx' },
    { level: 'INFO',  text: 'Starting inbound traffic monitoring' },
    { level: 'WARN',  text: 'Multiple failed login attempts detected' },
    { level: 'ALERT', text: 'Brute-force pattern identified — IOC logged' },
    { level: 'OK',    text: 'IP added to blocklist — containment applied' },
    { level: 'OK',    text: 'Incident documented — PICERL cycle: Containment OK' },
  ],
};

const consoleBody = document.getElementById('consoleBody');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let consoleRunToken = 0;

function typeConsole(lang) {
  if (!consoleBody) return;
  const lines = consoleLinesByLang[lang] || consoleLinesByLang.es;
  const myToken = ++consoleRunToken;

  if (prefersReducedMotion) {
    consoleBody.innerHTML = lines
      .map(l => `<span class="console__line"><span class="lvl-${l.level}">[${l.level}]</span> ${l.text}</span>`)
      .join('');
    return;
  }

  consoleBody.innerHTML = '';
  let lineIndex = 0;

  function nextLine() {
    if (myToken !== consoleRunToken) return; // language changed mid-animation
    if (lineIndex >= lines.length) {
      setTimeout(() => {
        if (myToken !== consoleRunToken) return;
        consoleBody.innerHTML = '';
        lineIndex = 0;
        nextLine();
      }, 2600);
      return;
    }

    const { level, text } = lines[lineIndex];
    const lineEl = document.createElement('span');
    lineEl.className = 'console__line';

    const prefix = document.createElement('span');
    prefix.className = `lvl-${level}`;
    prefix.textContent = `[${timestamp()}] ${level.padEnd(5, ' ')} `;
    lineEl.appendChild(prefix);

    const textEl = document.createElement('span');
    lineEl.appendChild(textEl);

    const cursor = document.createElement('span');
    cursor.className = 'console__cursor';
    lineEl.appendChild(cursor);

    consoleBody.appendChild(lineEl);

    let charIndex = 0;
    const typeSpeed = 18;

    function typeChar() {
      if (myToken !== consoleRunToken) return;
      if (charIndex < text.length) {
        textEl.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, typeSpeed);
      } else {
        cursor.remove();
        lineIndex++;
        setTimeout(nextLine, 500);
      }
    }
    typeChar();
  }

  nextLine();
}

function timestamp() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// ==========================================================
// Init
// ==========================================================
const initialLang = getInitialLang();
applyLang(initialLang);
renderLastUpdated(initialLang);
