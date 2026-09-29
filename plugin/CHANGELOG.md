# Changelog

Каждая версия: что изменилось и что сделать в проекте при обновлении («Шаги»).

## 0.1.1 — 2026-09-29

- `useThemeStore` вызывает хук zustand штатно (`useStore`), а не через переменную: так требуют правила React и React Compiler.
- `kit/MANIFEST` и защитный тест `react/guards/dsIntact.test.ts`: любая правка внутри `src/ds`, в том числе закоммиченная, видна в `npm test` и останавливает «Обновить».
- Скилл: «Подключить» работает в чистом проекте `npm create vite` — ставит Tailwind 3 и Vitest, если их нет, убирает шаблонные стили Vite, собирает каркас; «Обновить» проверяет `src/ds` защитным тестом и работает из папки фронтенда.

Шаги при обновлении с 0.1.0:
- скопировать `kit/MANIFEST` → `src/ds/MANIFEST` и папку `kit/react/guards/` целиком;
- в конфиге Vitest `test.css.include` должен покрывать `/ds\/css\//`: защитный тест читает CSS системы как текст.

## 0.1.0 — 2026-09-29

Первая версия, вынесена из Switch Sync без изменения вида.

- CSS-ядро: токены (T-Premium и Классика × светлая и тёмная), база, классы компонентов; шрифты T-Sans и Neue Haas Unica; Tailwind preset.
- Механизм тем: светлая / тёмная / авто по восходу и закату в Москве, ключ хранения свой у каждого проекта (`configureTheme`), скрипт первой отрисовки.
- React: `AppShell`, `NavList`, `UserRow`, `PageHeader`, `AppearancePopover`, `Logo`, `LogoTile`, `Toggle`, `Segmented`, `Disclosure`, `ConfirmDialog`, `Pill`, `Banner`.
- Скилл: подключение в React + Vite + Tailwind 3, обновление, правила работы с интерфейсом.
