# Product CRUD Demo

Simple product CRUD app built with Django for the API and React + Tailwind CSS for the UI.

## Current work

Tracked in Jira as `SCRUM-1`: add a basic login page flow to the frontend.

## Run the backend

```bash
.venv/bin/python backend/manage.py migrate
.venv/bin/python backend/manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`.

## Run the frontend

```bash
cd frontend
npm run dev
```

Frontend runs at `http://127.0.0.1:5173` and proxies `/api` to Django.

## Project structure

```text
backend/
  config/            Django project settings and urls
  products/
    models.py        Product model
    forms.py         Input validation
    urls.py          Product route entry
    api/
      product_views.py
      helpers.py
    tests.py         API tests

frontend/
  src/
    App.jsx          App entry
    pages/
      ProductPage.jsx
    components/
      ProductForm.jsx
      ProductList.jsx
    api/
      products.js    API helper for product requests
```

The frontend is intentionally split the same way as larger projects like `projectline`:
- `App.jsx` stays small
- `pages/` holds screen-level logic
- `components/` holds UI pieces
- `api/` holds fetch logic

## Verification

```bash
cd backend && ../.venv/bin/python manage.py test
cd frontend && npm run lint && npm run build
```
