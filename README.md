<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Trader's Insight — запуск и предпросмотр

## Быстрый старт

1. Установи зависимости:
   ```bash
   npm install
   ```
2. Запусти dev-сервер:
   ```bash
   npm run dev -- --host 0.0.0.0 --port 4173
   ```
3. Открой в браузере:
   `http://localhost:4173`

## Как запустить **предварительный просмотр** (preview)

`preview` работает только после сборки:

```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

Открыть: `http://localhost:4173`

## Почему может быть белый экран

Частые причины:

1. Запущен `npm run preview` **без** `npm run build`.
2. Открыт не тот адрес/порт.
3. В localStorage остались старые/битые данные.

Что сделать:

1. Остановить сервер.
2. Выполнить:
   ```bash
   npm run build
   npm run preview -- --host 0.0.0.0 --port 4173
   ```
3. Если не помогло — очистить localStorage для сайта и перезагрузить страницу.

В приложении также добавлен Error Boundary: вместо полностью белого экрана теперь показывается понятный экран ошибки с кнопкой сброса сессии.
