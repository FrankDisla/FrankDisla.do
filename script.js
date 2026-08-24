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
// Fecha de última actualización
// ==========================================================
const lastUpdatedEl = document.getElementById('lastUpdated');
if (lastUpdatedEl) {
  lastUpdatedEl.textContent = new Date().toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'long'
  });
}

// ==========================================================
// Consola SOC animada (elemento firma del hero)
// Simula el triaje real de un incidente: detección -> IOC -> contención
// ==========================================================
const consoleLines = [
  { level: 'INFO',  text: 'Conexión establecida — 190.111.xx.xx' },
  { level: 'INFO',  text: 'Iniciando monitoreo de tráfico entrante' },
  { level: 'WARN',  text: 'Múltiples intentos de login fallidos detectados' },
  { level: 'ALERT', text: 'Patrón de fuerza bruta identificado — IOC registrado' },
  { level: 'OK',    text: 'IP añadida a lista de bloqueo — contención aplicada' },
  { level: 'OK',    text: 'Incidente documentado — ciclo PICERL: Contención ✔' },
];

const consoleBody = document.getElementById('consoleBody');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function typeConsole() {
  if (!consoleBody) return;

  if (prefersReducedMotion) {
    consoleBody.innerHTML = consoleLines
      .map(l => `<span class="console__line"><span class="lvl-${l.level}">[${l.level}]</span> ${l.text}</span>`)
      .join('');
    return;
  }

  consoleBody.innerHTML = '';
  let lineIndex = 0;

  function nextLine() {
    if (lineIndex >= consoleLines.length) {
      setTimeout(() => {
        consoleBody.innerHTML = '';
        lineIndex = 0;
        nextLine();
      }, 2600);
      return;
    }

    const { level, text } = consoleLines[lineIndex];
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

typeConsole();
