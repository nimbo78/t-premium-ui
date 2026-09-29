---
name: t-premium-ui
description: T-Premium UI design system (the Switch Sync look) — installs it into a project, updates it and sets the rules for any UI work there. Use when the user says «подключи дизайн-систему», «обнови дизайн-систему», «сделай интерфейс в нашем стиле / как в Switch Sync», or edits UI code in a project that has ds/VERSION (src/ds/VERSION or static/ds/VERSION).
---

# T-Premium UI

Дизайн-система внутренних инструментов: вид Switch Sync, два стиля (T-Premium и Классика) × светлая,
тёмная и авто-тема (по восходу и закату в Москве). Файлы системы — в `kit/` репозитория этого плагина:
папка скилла — `<plugin>/skills/t-premium-ui/`, значит `kit/` — это `<папка скилла>/../../kit`
(путь к папке скилла приходит при его загрузке). История версий — `<папка скилла>/../../CHANGELOG.md`.

Справочник: `reference/components.md` (компоненты и разметка), `reference/tokens.md` (токены),
`reference/screens.md` (типовые экраны).

## Подключить — React + Vite + Tailwind 3

Проверь стек: `package.json` с `react`, `vite`, `tailwindcss` 3.x и `index.html` в корне фронтенда. Другой
стек (Tailwind 4, Jinja / HTML, без Vite) — скажи пользователю, что пока поддержан только React + Vite +
Tailwind 3, и остановись.

1. Скопируй из `kit/`:
   - `kit/css/tokens.css`, `kit/css/base.css`, `kit/css/components.css` → `src/ds/css/`;
   - `kit/react/` целиком → `src/ds/react/` (`theme/`, `components/`, `guards/`, `index.ts`);
   - `kit/tailwind/preset.js` → `src/ds/tailwind/preset.js`;
   - `kit/js/boot.template.html` → `src/ds/js/boot.template.html`;
   - `kit/VERSION` → `src/ds/VERSION`.
2. Шрифты:
   - обычно — `kit/css/fonts.css` → `src/ds/css/fonts.css` и `kit/fonts/` → `src/ds/fonts/` (Vite упакует их сам);
   - если проект уже отдаёт шрифты сам (в `index.html` есть `<link rel="stylesheet" href="/fonts.css">`,
     как у Switch Sync) — `kit/fonts/*` → `public/fonts/`, а `fonts.css` не копируй.
3. `src/index.css` — сначала система, потом Tailwind, потом стили проекта:
   ```css
   @import "./ds/css/fonts.css"; /* только если копировал fonts.css */
   @import "./ds/css/tokens.css";
   @import "./ds/css/base.css";
   @import "./ds/css/components.css";
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. `tailwind.config.js`: `import preset from "./src/ds/tailwind/preset.js";`, `presets: [preset]`; `content`
   покрывает `./src/**/*.{ts,tsx}` (а значит и `src/ds/`). Если в Vitest-конфиге есть `test.css.include`,
   добавь туда `/ds\/css\//` (без `$`: id модуля оканчивается на `.css?raw`).
5. Ключ темы проекта — короткое имя в kebab-case (у Switch Sync `switch-sync`). Смена ключа сбрасывает
   выбор темы у всех пользователей, поэтому выбирается один раз.
   - `index.html`: вставь в `<head>` содержимое `src/ds/js/boot.template.html`, заменив `__STORAGE_KEY__` на ключ;
   - `src/main.tsx` до `createRoot(...)`: `configureTheme({ storageKey: "<ключ>" })` из `./ds/react/theme`;
   - в корне приложения — `<ThemeController />`;
   - в файле настройки тестов (`test.setupFiles`) — тот же `configureTheme(...)`.
6. Зависимости: `npm i zustand lucide-react` (нужен React 19).
7. Проверка: `npm test` (включая `src/ds/react/guards/noRawColors.test.ts`) и `npm run build`.

## Обновить

1. Сравни `src/ds/VERSION` проекта с `kit/VERSION`. Совпадают — скажи, что система актуальна.
2. Покажи записи `CHANGELOG.md` новее версии проекта, особенно «Шаги». Сменилась мажорная версия —
   перечисли, что придётся поправить в коде проекта.
3. `git status --porcelain -- src/ds` и `git diff -- src/ds`: есть правки внутри `src/ds/` — остановись и
   спроси. `src/ds/` принадлежит системе: общие правки делаются в системе, не в проекте.
4. Есть скрипт снимков (у Switch Sync — `web/frontend/scripts/ui-snapshots.cjs`) — сними «до».
5. Замени файлы `src/ds/` файлами `kit/` по тем же правилам, что при подключении (включая шрифты); файлы,
   которых больше нет в `kit/`, удали. Выполни «Шаги» новых версий.
6. Тесты и сборка проекта, снимки «после» и сравнение; отличия покажи пользователю.
7. Коммит: `⬆️ chore(ds): T-Premium UI <старая> → <новая>`.

## Правила работы с интерфейсом

- `src/ds/` руками не правится. Стили и токены, которые нужны только проекту, — в `src/index.css` после
  `@tailwind utilities` (свои классы — в `@layer components`).
- Цвета — только токены (`var(--…)`, Tailwind-цвета из preset: `bg-page`, `text-fg-muted`, `text-accent`…).
  Палитра Tailwind (`text-red-600`) и hex запрещены — это ловит `src/ds/react/guards/noRawColors.test.ts`.
- Сначала компоненты системы (`src/ds/react/components`), потом её классы (`reference/components.md`), и
  только потом Tailwind-утилиты для раскладки (`flex`, `gap-*`, `mt-*`). Имена классов — целиком: не
  склеивай `pill-${tone}`, используй таблицы «тон → класс», как в `Pill`.
- Нужен новый общий компонент — сделай его в проекте на токенах и классах системы; если он пригодится
  другим, предложи перенести его в систему (репозиторий `nimbo78/t-premium-ui`, папка `plugin/`: CSS в `kit/css/components.css`,
  компонент в `kit/react/components`, тест, раздел в `reference/components.md`, запись в `CHANGELOG.md`,
  новая версия) и обновить проекты.
- Типографика: заголовки — T-Sans (`font-family: TinkoffSans` / `font-heading`), текст — Haas (`font-sans`).
  Заголовок страницы — `.page-title` (28/34, 700), заголовок панели — `.panel-title` (19, 600), текст 14/1.45,
  подсказки и подписи 12.5–13.
- Радиусы: 12 — поля, кнопки, сегменты; 24 — карточки и панели; 28 — диалог и карточка входа; 999 — бейджи.
  Отступы: карточка 22, панель 20, между блоками 16.
- Тексты интерфейса — по-русски, с «ёлочками» и буквой ё; кнопки — глаголом («Запустить», «Применить»).
- Доступность — как у компонентов системы: `aria-label` у иконочных кнопок, `role="radiogroup"` и
  `aria-checked` у сегментов, `role="alert"` у ошибок, видимый фокус с клавиатуры, контраст AA (токены его
  соблюдают — не подменяй их).
- Любой новый экран проверь во всех четырёх сочетаниях: T-Premium и Классика × светлая и тёмная
  (переключатель — `AppearancePopover` в `PageHeader`).
