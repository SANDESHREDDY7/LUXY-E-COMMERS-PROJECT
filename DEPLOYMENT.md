# Deployment Guide — LUXÉ Full-Stack App

This document records the production deployment architecture, URLs, environment variable names, and redeploy steps. **No secrets, passwords, or API keys are stored in this repository.**

---

## Architecture Overview

| Layer | Platform | Live URL | Config Files |
| :--- | :--- | :--- | :--- |
| **Frontend (React + Vite)** | **Netlify** | https://luxe-luxury-bags.netlify.app | `netlify.toml`, `frontend/netlify.toml`, `frontend/src/utils/api.ts` |
| **Backend (Spring Boot 3.2.5 / Java 17)** | **Railway** | https://luxe-api-production-22b05bf1.up.railway.app | `Dockerfile`, `src/main/resources/application-prod.properties`, `CorsConfig.java` |
| **Database** | **Railway PostgreSQL** | Private Railway network (`Postgres`) | `application-prod.properties` |

---

## 1. Frontend — Netlify

- **Project Name:** `luxe-luxury-bags`
- **Build Base Directory:** `frontend`
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **SPA Routing:** Configured in `netlify.toml` (`/* -> /index.html`, status `200`).

### Required Netlify Environment Variable
Set in **Netlify Dashboard → Site configuration → Environment variables**:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://luxe-api-production-22b05bf1.up.railway.app` |

> **Note:** After changing `VITE_API_BASE_URL`, trigger a redeploy so Vite bakes the updated URL into the static bundle.

### Fallback Mode
If `VITE_API_BASE_URL` is unset or the backend is unreachable, `frontend/src/utils/api.ts` falls back to static catalog/collection data (`frontend/src/app/data/products.ts`) and `localStorage` for Cart/Wishlist.

---

## 2. Backend & Database — Railway

- **Railway Project:** `luxe-backend`
- **Services:**
  1. `Postgres` — Managed PostgreSQL database
  2. `luxe-api` — Spring Boot backend built from `Dockerfile` (`-Xmx320m -XX:+UseSerialGC`)

### Required Railway Environment Variables (`luxe-api`)
Set in **Railway Dashboard → `luxe-api` → Variables** (never commit values to Git):

| Key | Value / Reference |
| :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `CORS_ALLOWED_ORIGINS` | `https://luxe-luxury-bags.netlify.app` |
| `DATABASE_URL` | `jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}` |
| `DB_USERNAME` | `${{Postgres.PGUSER}}` |
| `DB_PASSWORD` | `${{Postgres.PGPASSWORD}}` |
| `MAIL_USERNAME` | *(Optional)* Your SMTP/Gmail address |
| `MAIL_PASSWORD` | *(Optional)* Your Gmail App Password |
| `STRIPE_SECRET_KEY` | *(Optional)* Your Stripe secret key (`sk_live_...` or `sk_test_...`) |
| `STRIPE_PUBLISHABLE_KEY` | *(Optional)* Your Stripe publishable key (`pk_live_...` or `pk_test_...`) |

### Redeploy Backend via Railway CLI
```bash
npx -y @railway/cli login
npx -y @railway/cli link
npx -y @railway/cli up --service luxe-api
```

---

## 3. Local Development

Run locally with H2 in-memory database (no external credentials required):
```bash
mvn spring-boot:run
```
- App & API: `http://localhost:8080`
- Admin Dashboard: `http://localhost:8080/admin`
- H2 Console: `http://localhost:8080/h2-console`
