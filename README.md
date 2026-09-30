# A&S — «Сайт-фильм» (свадьба Александра & Софии)

Кинематографичный свадебный сайт-приглашение: пять актов (ACT I–V), языки камеры,
переходы-склейки, интерактивные галереи, RSVP и финальные титры.

## Структура

```
wedding/
├── index.html          # единая страница-фильм (все сцены)
├── assets/
│   ├── css/
│   │   ├── tokens.css      # дизайн-токены (цвет, типографика, шкалы)
│   │   ├── base.css        # каркас: header, cursor, progress rail, меню, финал
│   │   ├── scenes.css      # сцены ACT I–V (hero, letter, typo, date, venue…)
│   │   ├── galleries.css   # contact sheet, film strip, альбом, коллаж, mood
│   │   └── responsive.css  # планшет и мобильный (мобильный — отдельный «фильм»)
│   └── js/
│       ├── core.js     # cursor, меню-сцена, progress rail, parallax, sound
│       ├── hero.js     # таймлайн FRAME 01–08, openInvitation, fallback
│       ├── galleries.js# photo stack, contact sheet, film strip, viewer, collage
│       ├── scenes.js   # reveals, countdown/archive, camera moves, RSVP, wishes, финал
│       └── main.js     # archive mode, прыжок по hash, fallback без GSAP
└── vendor/             # GSAP 3.13 + ScrollTrigger (vendored, без npm)
```

## Запуск

Любой статический сервер из корня репозитория:

```bash
python -m http.server 8137 --directory wedding
# → http://127.0.0.1:8137/
```

Сборка не требуется: только HTML/CSS/JS + vendored GSAP.

## Ключевые решения

- **Статический сайт** (не Next.js) — спека реализована как самостоятельный проект
  в отдельной папке `wedding/`, портфолио в корне не затронуто.
- **Фотографии** — свободные сток-фото Unsplash (URL), `loading="lazy"` кроме hero.
- **Язык** — русский контент; английский только как графические микро-лейблы
  (`FRAME 001`, `ACT I`, `THE END`).
- **Данные свадьбы** — «Александр & София», 19.09.2026 16:30, Villa Verde,
  монограмма A/S. Легко меняются в `index.html` + `assets/js/main.js`.
- **RSVP** — при пустом Supabase URL ответы сохраняются в `localStorage`
  (`as-rsvp`); форма переворачивает карточку (`#rsvp-card.is-open`).
- **Archive mode** — после даты свадьбы `data-archive="true"`: счётчик заменяется
  статичной датой `19 09 20 26`, сайт остаётся доступным как «фильм».
- **Reduced motion** — `prefers-reduced-motion` уважается: параллакс и сложные
  таймлайны отключаются, сцены показываются статично.
- **Фолбэки** — без GSAP/JS сцены раскрываются через CSS-классы (`main.js`),
  hero открывается кнопкой, меню и RSVP доступны с клавиатуры (aria-*).

## Проверка

Скриншоты снимаются в реальном времени через CDP (headless Chrome):
`--virtual-time-budget` не продвигает rAF, GSAP «замерзает» — только живые
wait/settle. Свежесть кадра проверяется маркером-пикселем (`surf-verified`).

Инструменты: `ascii.js` (ASCII-превью PNG), `verify.js` (пиксель-анализ),
`cdp.js` (CDP-драйвер скриншотов).
