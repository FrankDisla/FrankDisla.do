# Portafolio — Frank Disla

Sitio de una sola página (HTML/CSS/JS puro, sin frameworks ni build step) para presentar tu perfil de Ingeniero Jr. de Ciberseguridad ante reclutadores del sector financiero.

```
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

No requiere `npm install` ni compilación: son archivos estáticos, así que cualquiera de las dos opciones de hosting de abajo funciona directo.

---

## Opción A — GitHub Pages (recomendada, gratis, ya usas GitHub)

### 1. Sube el código a un repositorio
```bash
cd portfolio
git init
git add .
git commit -m "Primer commit: portafolio v1"
git branch -M main
git remote add origin https://github.com/FrankDisla/frankdisla.git
git push -u origin main
```
(Puedes llamar el repo como quieras, por ejemplo `portfolio` o `frankdisla.do`.)

### 2. Activa GitHub Pages
1. En GitHub, entra al repo → **Settings** → **Pages**.
2. En **Source**, elige la rama `main` y la carpeta `/ (root)`.
3. Guarda. En unos minutos tu sitio estará en:
   `https://frankdisla.github.io/NOMBRE-DEL-REPO/`

### 3. Conecta tu dominio propio (frankdisla.do)
1. En el mismo repo, crea un archivo llamado **`CNAME`** (sin extensión) en la raíz, con una sola línea:
   ```
   frankdisla.do
   ```
2. En el panel de tu proveedor de dominio (donde compraste `frankdisla.do`), agrega estos registros DNS:

   | Tipo  | Nombre/Host | Valor                  |
   |-------|-------------|-------------------------|
   | A     | @           | 185.199.108.153         |
   | A     | @           | 185.199.109.153         |
   | A     | @           | 185.199.110.153         |
   | A     | @           | 185.199.111.153         |
   | CNAME | www         | frankdisla.github.io    |

3. Vuelve a **Settings → Pages** en GitHub, escribe `frankdisla.do` en el campo **Custom domain** y guarda.
4. Marca **Enforce HTTPS** (puede tardar hasta 24h en habilitarse mientras se emite el certificado).
5. Los cambios de DNS pueden tardar de minutos a horas en propagarse.

---

## Opción B — Vercel (deploy más rápido, buena integración con dominios)

### 1. Sube el repo a GitHub (pasos 1 de la Opción A).

### 2. Importa el proyecto en Vercel
1. Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. **Add New → Project** → selecciona tu repositorio.
3. Framework Preset: **Other** (es HTML estático, no necesita build command).
4. Deploy. En ~30 segundos tendrás una URL tipo `frankdisla.vercel.app`.

### 3. Conecta tu dominio
1. En el proyecto de Vercel → **Settings → Domains** → agrega `frankdisla.do`.
2. Vercel te mostrará los registros DNS exactos a configurar (normalmente un registro `A` apuntando a `76.76.21.21` y/o un `CNAME` para `www`).
3. Agrégalos en el panel de tu proveedor de dominio y espera la propagación (Vercel valida automáticamente y emite el certificado SSL).

---

## Personalización rápida

- **Colores / severidad SOC**: variables al inicio de `css/style.css`, en `:root` (`--cyan`, `--amber`, `--green`, etc.).
- **Colores Red / Blue / Purple / Cloud**: variables `--team-red`, `--team-blue`, `--team-purple`, `--team-cloud` en `css/style.css`. Se usan en `.badge--red/blue/purple/cloud`, `.module--*`, `.case--*` y `.cert--*`.
- **Texto de la consola animada del hero**: objeto `consoleLinesByLang` (claves `es` / `en`) en `js/script.js`.
- **Enlaces de contacto**: sección `#contacto` en `index.html` (correo, GitHub, LinkedIn).
- **Nuevos proyectos**: duplica un bloque `<article class="case">` en `index.html`, sube el número de `CASE-00X` y aplica `case--red` o `case--blue` según su naturaleza.
- **Nuevas certificaciones**: duplica un bloque `<div class="cert">` en `#certificaciones` y añade la clase `cert--red`, `cert--blue`, `cert--purple` o `cert--cloud` según corresponda.

## Sistema Red / Blue / Purple / Cloud

Las habilidades, proyectos y certificaciones están clasificados visualmente:

| Clase CSS         | Color   | Significado                                  |
|--------------------|---------|-----------------------------------------------|
| `--red` / `.badge--red`       | Carmesí | Red Team — ofensivo (pentesting, hacking ético) |
| `--blue` / `.badge--blue`     | Cian    | Blue Team — defensivo (SOC, monitoreo, IR)     |
| `--purple` / `.badge--purple` | Violeta | Purple / transversal (forense, cumplimiento, OSINT) |
| `--cloud` / `.badge--cloud`   | Verde azulado | Cloud & Networking (Azure)              |

Para reclasificar un elemento, cambia la clase modificadora (`module--red`, `cert--blue`, etc.) y, si aplica, el texto del `<span class="badge">`.

## Bilingüe (ES / EN)

El botón **ES / EN** de la barra de navegación alterna todo el texto marcado con los atributos `data-es` y `data-en` en `index.html` (incluyendo la consola animada del hero). La preferencia se guarda en `localStorage` y, si el visitante no ha elegido antes, se detecta el idioma del navegador.

Para traducir contenido nuevo, agrega ambos atributos al elemento:
```html
<h3 data-es="Texto en español" data-en="Text in English">Texto en español</h3>
```
El script `js/script.js` se encarga del resto — no requiere tocar el JS al añadir texto nuevo.

## Notas técnicas

- Sin dependencias de build; las únicas llamadas externas son a Google Fonts (JetBrains Mono + IBM Plex Sans).
- Respeta `prefers-reduced-motion`: si el visitante lo activa en su sistema, la animación de la consola se muestra estática.
- Foco de teclado visible en todos los enlaces y botones (accesibilidad).
- Totalmente responsivo (probado en breakpoints de escritorio, tablet y móvil).
- `localStorage` se usa únicamente para recordar el idioma elegido — no se envía a ningún servidor.
