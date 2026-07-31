# ADAGE CRM Dashboard

React dashboard for Odoo CRM (leads, pipeline, visits, calendar, team view).

## Run locally

```powershell
cd C:\Users\adarsh.ADAGE\Projects\adage-crm-dashboard
npm install
npm run dev
```

Open **http://localhost:5173/**

## Odoo credentials

Copy `.env.example` to `.env` and fill in your values:

| Variable | Description |
|---|---|
| `VITE_ODOO_URL` | Your Odoo instance URL, e.g. `https://your-instance.odoo.com` |
| `VITE_ODOO_DB` | Database name — usually the subdomain (optional on Odoo SaaS) |
| `VITE_ODOO_LOGIN` | Login email of the Odoo user |
| `VITE_ODOO_API_KEY` | API key — generate in Odoo → Settings → Technical → API Keys |

These are **server-side only** — they are never sent to the browser. The proxy (`api/odoo.js` on Vercel, `vite-odoo-proxy.js` in dev) uses HTTP Basic auth (`login:apikey`) and forwards all requests to Odoo, avoiding CORS entirely.

For Vercel: add the same four variables in **Project → Settings → Environment Variables**.

## Microsoft sign-in setup

The dashboard requires Microsoft sign-in before showing any data, restricted to accounts on
`adage-automation.com` or `adage-kanoo.com` (see `src/lib/authConfig.js`). This is a **public
client (SPA)** app registration — no client secret is needed or should be created.

1. Go to [Azure Portal](https://portal.azure.com) → **Azure Active Directory** → **App registrations**
2. Click **New registration**:
   - Name: `Adage CRM Dashboard`
   - Account type: **Single tenant** (or **Multitenant** if Kanoo users are in a different tenant)
   - Platform: **Single-page application (SPA)**
   - Redirect URI: `http://localhost:5173` for local dev, plus your Vercel production URL
3. After creation, copy from the **Overview** page:
   - **Application (client) ID**
   - **Directory (tenant) ID**
4. Go to **API permissions** → verify `User.Read` (Microsoft Graph, delegated) is present
5. Go to **Authentication** → under the SPA platform, add every URL the app is served from
   (localhost + all Vercel preview/production domains) as redirect URIs

Add to `.env` (and the same two variables in Vercel → Project → Settings → Environment Variables):

```bash
VITE_MICROSOFT_CLIENT_ID=paste-your-client-id-here
VITE_MICROSOFT_TENANT_ID=paste-your-tenant-id-here
```

No client secret is required — browser SPAs authenticate with PKCE, not a secret. The allowed
email domains are enforced client-side after sign-in (`isAllowedEmail` in `authConfig.js`); update
`ALLOWED_EMAIL_DOMAINS` there if the set of domains changes.
