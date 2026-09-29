# Типовые экраны

## Вход

```tsx
<div className="auth-page">
  <div className="auth-corner"><AppearancePopover /></div>
  <form className="auth-card" onSubmit={submit}>
    <Logo name="Продукт" glyph={GLYPH} />
    <h1 className="auth-title">Вход</h1>
    <label className="label" htmlFor="login">Логин</label>
    <input id="login" className="field" autoComplete="username" value={login} onChange={(e) => setLogin(e.target.value)} />
    <label className="label mt-4" htmlFor="password">Пароль</label>
    <input id="password" className="field" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
    {error && <div className="field-error" role="alert">{error}</div>}
    <button type="submit" className="btn btn-cta w-full mt-5" disabled={!login || !password}>Войти</button>
  </form>
  <div className="auth-foot">Внутренний инструмент</div>
</div>
```

## Форма с боковой панелью

```tsx
<>
  <PageHeader title="Новый запуск"><Pill tone="ok" dot>Очередь свободна</Pill></PageHeader>
  <div className="grid-2">
    <section className="card">
      <label className="label" htmlFor="hosts"><span>Хосты <span className="req">*</span></span><span>{count} хостов</span></label>
      <textarea id="hosts" className="field field-mono" rows={4} />
      <div className="hint mt-2">Через пробел, запятую или с новой строки.</div>
      <div className="flex flex-wrap gap-2.5 mt-4">
        <Toggle label="Dry-run" checked={dryRun} onChange={setDryRun} />
      </div>
      <Disclosure title="Дополнительно" summary="не задано" open={open} onToggle={() => setOpen(!open)}>…</Disclosure>
      <Banner tone="info">Dry-run: изменения только покажутся.</Banner>
      <div className="flex justify-end gap-2.5 mt-5">
        <button type="button" className="btn btn-ghost">Сбросить</button>
        <button type="submit" className="btn btn-cta">Запустить</button>
      </div>
    </section>
    <aside className="panel"><h2 className="panel-title">Последние</h2>…</aside>
  </div>
</>
```

## Таблица

```tsx
<section className="panel">
  <table className="table">
    <thead><tr><th>#</th><th>Что</th><th className="num">Длительность</th><th>Статус</th></tr></thead>
    <tbody>
      <tr className="clickable" onClick={() => open(run.id)}>
        <td>#0009</td>
        <td>Синк · 3 хоста<div className="sub">a.smirnova · сегодня 10:25</div></td>
        <td className="num">4:37</td>
        <td><Pill tone="dry">dry-run</Pill></td>
      </tr>
    </tbody>
  </table>
</section>
```

## Страница объекта со статистикой и логом

```tsx
<>
  <PageHeader title="Запуск #0009" crumb={<Link to="/history">История</Link>}><Pill tone="ok">применено</Pill></PageHeader>
  <div className="meta"><span>Кто: <b>a.smirnova</b></span><span>Длительность: <b>4:37</b></span></div>
  <div className="stats">
    <div className="stat"><div className="stat-n">3</div><div className="stat-l">обработано</div></div>
  </div>
  <section className="log" aria-label="Лог">
    <div className="log-bar">…</div>
    <pre className="log-body"><div className="log-line">12:00:01 INFO готово</div></pre>
  </section>
</>
```
