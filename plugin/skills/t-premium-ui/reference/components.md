# Компоненты и классы T-Premium UI

React-компоненты — `ds/react/components` (`import { Pill, Banner } from "./ds/react/components"`), классы —
`ds/css/components.css`. Классы пишутся целиком.

## AppShell, NavList, UserRow

Каркас страницы: боковая панель (логотип, навигация, пользователь внизу) и основная область `main#main`.
Уже 900px — одна колонка.

```tsx
<AppShell
  logo={<Link to="/" className="no-underline" aria-label="Продукт — главная"><Logo name="Продукт" glyph={GLYPH} /></Link>}
  nav={
    <NavList label="Разделы">
      <NavLink to="/" end className="nav-item"><Home size={17} aria-hidden="true" />Главная</NavLink>
      <NavLink to="/history" className="nav-item"><Clock size={17} aria-hidden="true" />История<span className="nav-count">2</span></NavLink>
    </NavList>
  }
  footer={<UserRow user={login} onLogout={logout} />}
>
  <Outlet />
</AppShell>
```

Активный пункт — `aria-current="page"` (ставит `NavLink` сам). Счётчик у пункта — `.nav-count`.

## Logo, LogoTile

Плитка с градиентом стиля и знак продукта (рисуется на сетке 48×48 цветом `var(--mark-ink)`) плюс название.
`LogoTile` — только плитка (например, для favicon-подобных мест).

```tsx
const GLYPH = <path d="M14 24h20M24 14v20" fill="none" stroke="var(--mark-ink)" strokeWidth="3" strokeLinecap="round" />;
<Logo name="Продукт" glyph={GLYPH} />
```

## PageHeader

Заголовок страницы (`h1.page-title`), необязательные «хлебные крошки» (`crumb`) и правая часть: свои
элементы (`children`) и переключатель оформления.

```tsx
<PageHeader title="История" crumb={<Link to="/">Новый запуск</Link>}>
  <Pill tone="ok" dot>Очередь свободна</Pill>
</PageHeader>
```

## AppearancePopover

Кнопка «Оформление»: стиль (T-Premium / Классика) и тема (светлая / тёмная / авто). Уже есть в `PageHeader`;
отдельно — на странице входа (`<div className="auth-corner"><AppearancePopover /></div>`).

## Toggle

Чип с переключателем (чекбокс внутри `label`). `note` — пояснение после подписи.

```tsx
<Toggle label="Dry-run" checked={dryRun} onChange={setDryRun} />
<Toggle label="Обновить location" checked disabled note="включено данными размещения" onChange={() => {}} />
```

## Segmented

Выбор одного из нескольких (`role="radiogroup"`).

```tsx
<Segmented label="Режим" value={mode} onChange={setMode}
  options={[{ value: "sync", label: "Синк свитчей" }, { value: "placement", label: "Только размещение" }]} />
```

## Disclosure

Раскрывающийся блок с кратким итогом справа.

```tsx
<Disclosure title="Дополнительно: site / facility" summary="не задано" open={open} onToggle={() => setOpen(!open)}>
  …поля…
</Disclosure>
```

## ConfirmDialog

Модальное подтверждение опасного действия (`<dialog>`, `Esc` = отмена).

```tsx
<ConfirmDialog open={confirming} title="Применить изменения в NetBox?" confirmLabel="Применить"
  onConfirm={apply} onCancel={() => setConfirming(false)} busy={applying}>
  <p>Будет применено:</p>
  <ul><li>2 хоста: sw1, sw2</li></ul>
</ConfirmDialog>
```

## Pill

Бейдж статуса. Тоны: `ok` (успех), `run` (идёт), `q` (ждёт), `dry` (контурный, «dry-run»), `bad` (ошибка),
`warn` (предупреждение). `spinner` — идёт процесс, `dot` — устойчивое состояние.

```tsx
<Pill tone="run" spinner>идёт #0011</Pill>
<Pill tone="ok" dot>Очередь свободна</Pill>
```

## Banner

Сообщение во всю ширину: `info`, `warn`, `neg` (ошибка, `role="alert"`).

```tsx
<Banner tone="info" icon={<Info size={17} aria-hidden="true" />}>Dry-run: изменения только покажутся.</Banner>
```

## Поверхности (CSS)

- `.card` — главная карточка формы (градиент в T-Premium светлой); `.panel` + `.panel-title` — боковые и
  вторичные блоки; `.grid-2` — две колонки 1.45 : 1 (уже 1100px — одна).

```html
<div class="grid-2">
  <section class="card">…форма…</section>
  <aside class="panel"><h2 class="panel-title">Последние запуски</h2>…</aside>
</div>
```

## Формы (CSS)

- `.label` (подпись; вторая `span` прижимается вправо), `.req` (звёздочка), `.field` (`input`, `textarea`,
  `select`), `.field-mono` (моноширинный), `.field-icon` (кнопка в поле, например «показать пароль»),
  `.hint`, `.field-error` (с `role="alert"`), `aria-invalid="true"` у поля с ошибкой.
- `.chip` + `.toggle` — это `Toggle`; `.seg` + `.seg-item` — `Segmented`; `.disclosure` — `Disclosure`.

## Кнопки (CSS)

- `.btn.btn-cta` — главное действие; `.btn.btn-danger` — опасное (запись в продуктив); `.btn.btn-ghost` —
  «Сбросить», «Отмена» рядом с главной; `.btn-sec` — вторичная с рамкой; `.link` — ссылка-действие.

## Таблицы и статистика (CSS)

- `.table` (`th`, `td`, `.num` — числа вправо, `tr.clickable` — строка-ссылка), `.sub` — вторая строка в ячейке.
- `.stats` > `.stat` (`.stat-n` — число, `.stat-l` — подпись), `.meta` (`b` — значение), `.tag`, `.filters`,
  `.empty` — пустое состояние.

## Лог (CSS)

- `section.log[aria-label]` > `.log-bar` (кнопки `.log-btn`, `aria-pressed`; `.log-follow`) + `pre.log-body` со
  строками `.log-line` (`.log-warning`, `.log-error`, `.log-muted`).

## Вход (CSS)

- `.auth-page` (фон `--auth-bg`) > `.auth-corner` (поповер оформления) + `form.auth-card` (`.auth-title`) +
  `.auth-foot`.
