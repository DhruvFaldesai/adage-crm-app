// Microsoft Entra ID (Azure AD) sign-in config for this SPA.
// Client ID / tenant ID are public identifiers for a browser (public client) app
// registration — they are not secrets, so it's fine that they ship in the bundle.
export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MICROSOFT_TENANT_ID}`,
    // Kept at the site root (not /signin) so this doesn't require adding a
    // second redirect URI in the Azure app registration. RequireAuth sends
    // unauthenticated visitors to /signin; SignInPage sends authenticated
    // ones back to "/" once the login redirect lands.
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

// Only accounts with an email on one of these domains may use the dashboard.
// This is a client-side check (defense in depth for an internal tool) — the
// real secret (the Odoo API key) always stays server-side in the Vercel proxy.
export const ALLOWED_EMAIL_DOMAINS = ["adage-automation.com", "adage-kanoo.com"];

export function isAllowedEmail(email) {
  if (!email) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
}

// Which res.company records each signed-in user may see. Automation-domain
// users see only the Automation entity, Kanoo-domain users see only the Kanoo
// entities; the named admins see everything regardless of domain.
export const AUTOMATION_COMPANY_NAMES = ["Adage Automation Private Ltd."];
export const KANOO_COMPANY_NAMES = ["Adage Kanoo Analytical Industry", "Adage Kanoo Industrial Company"];
export const ALL_COMPANY_NAMES = [...AUTOMATION_COMPANY_NAMES, ...KANOO_COMPANY_NAMES];

export const ADMIN_EMAILS = ["adarsh@adage-automation.com", "oindrilla@adage-automation.com"];

export function getAllowedCompanyNames(email) {
  if (!email) return [];
  const lower = email.toLowerCase();
  if (ADMIN_EMAILS.includes(lower)) return ALL_COMPANY_NAMES;

  const domain = lower.split("@")[1];
  if (domain === "adage-automation.com") return AUTOMATION_COMPANY_NAMES;
  if (domain === "adage-kanoo.com") return KANOO_COMPANY_NAMES;
  return [];
}
