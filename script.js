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

// Prompt del "operador" y comandos que teclea entre cada ciclo de logs,
// para que la consola se vea usada activamente y no solo reproduciendo un loop.
const consolePromptByLang = {
  es: { user: 'frank@soc', cwd: '~' },
  en: { user: 'frank@soc', cwd: '~' },
};

const consoleCommands = [
  'tail -f access.log',
  'grep ALERT access.log',
  'systemctl status wazuh-agent',
  'clear && ./monitor.sh --resume',
];

let consoleRunToken = 0;

function typeConsole(lang) {
  if (!consoleBody) return;
  const lines = consoleLinesByLang[lang] || consoleLinesByLang.es;
  const prompt = consolePromptByLang[lang] || consolePromptByLang.es;
  const myToken = ++consoleRunToken;

  if (prefersReducedMotion) {
    const logHtml = lines
      .map(l => `<span class="console__line"><span class="lvl-${l.level}">[${l.level}]</span> ${l.text}</span>`)
      .join('');
    const promptHtml = `<span class="console__line console__prompt"><span class="console__prompt-label">${prompt.user}:${prompt.cwd}$ </span><span class="console__prompt-cmd">${consoleCommands[0]}</span></span>`;
    consoleBody.innerHTML = logHtml + promptHtml;
    return;
  }

  consoleBody.innerHTML = '';
  let lineIndex = 0;
  let liveCursor = null; // única referencia al cursor visible; nunca desaparece
                          // del todo, solo se reubica — así la terminal siempre
                          // se ve "encendida" y en uso, como una real.

  function placeCursor(parentEl) {
    if (liveCursor) liveCursor.remove();
    liveCursor = document.createElement('span');
    liveCursor.className = 'console__cursor';
    parentEl.appendChild(liveCursor);
    return liveCursor;
  }

  function nextLine() {
    if (myToken !== consoleRunToken) return; // idioma cambió a mitad de animación
    if (lineIndex >= lines.length) {
      setTimeout(() => {
        if (myToken !== consoleRunToken) return;
        promptForCommand();
      }, 900);
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

    consoleBody.appendChild(lineEl);
    placeCursor(lineEl);

    let charIndex = 0;
    const typeSpeed = 18;

    function typeChar() {
      if (myToken !== consoleRunToken) return;
      if (charIndex < text.length) {
        textEl.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, typeSpeed);
      } else {
        // El cursor se queda parpadeando sobre esta línea durante la pausa;
        // recién se retira cuando arranca la siguiente (terminal siempre "viva").
        lineIndex++;
        setTimeout(nextLine, 500);
      }
    }
    typeChar();
  }

  // Tras el último log, la consola queda "esperando" un comando (cursor
  // parpadeando, inactivo), luego lo teclea y recién ahí reinicia el ciclo —
  // da la sensación de que alguien la está operando en vivo.
  function promptForCommand() {
    if (myToken !== consoleRunToken) return;

    const promptLine = document.createElement('span');
    promptLine.className = 'console__line console__prompt';

    const label = document.createElement('span');
    label.className = 'console__prompt-label';
    label.textContent = `${prompt.user}:${prompt.cwd}$ `;
    promptLine.appendChild(label);

    const cmdEl = document.createElement('span');
    cmdEl.className = 'console__prompt-cmd';
    promptLine.appendChild(cmdEl);

    consoleBody.appendChild(promptLine);
    placeCursor(promptLine);

    const idleWait = 1300 + Math.random() * 1000; // pausa "pensando" antes de teclear
    setTimeout(() => {
      if (myToken !== consoleRunToken) return;
      const command = consoleCommands[Math.floor(Math.random() * consoleCommands.length)];
      let charIndex = 0;
      const typeSpeed = 42;

      function typeCmdChar() {
        if (myToken !== consoleRunToken) return;
        if (charIndex < command.length) {
          cmdEl.textContent += command.charAt(charIndex);
          charIndex++;
          promptLine.appendChild(liveCursor); // el cursor sigue al final del texto
          setTimeout(typeCmdChar, typeSpeed);
        } else {
          // El cursor sigue parpadeando al final del comando "escrito" hasta
          // el instante justo antes de limpiar la pantalla y reiniciar.
          setTimeout(() => {
            if (myToken !== consoleRunToken) return;
            liveCursor = null;
            consoleBody.innerHTML = '';
            lineIndex = 0;
            nextLine();
          }, 900);
        }
      }
      typeCmdChar();
    }, idleWait);
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
