export const CURRENCY_SYMBOLS = { INR: "₹", AED: "AED ", USD: "$" };
export const CURRENCY_OPTIONS = ["INR", "AED", "USD"];

// Used immediately (before the live fetch resolves) and as a fallback if it
// fails outright — keeps conversions correct-ish instead of wrong.
export const FALLBACK_RATES = { usd: 1, inr: 87, aed: 3.67 };

// Free, keyless, CORS-enabled FX API (community-maintained, daily rates).
// Two mirrors of the same dataset for resilience.
const FX_SOURCES = [
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
  "https://latest.currency-api.pages.dev/v1/currencies/usd.json",
];

/**
 * Fetches live USD-based FX rates. Falls back to a small hardcoded rate
 * table if every live source fails.
 * @returns {Promise<{rates: Object, live: boolean}>}
 */
export async function fetchFxRates() {
  for (const url of FX_SOURCES) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = await res.json();
      if (json?.usd) return { rates: json.usd, live: true };
    } catch {
      // try next source
    }
  }
  return { rates: FALLBACK_RATES, live: false };
}

/**
 * Converts an amount between currency codes using USD-based rates
 * (rates[code] = units of that currency per 1 USD).
 */
export function convertAmount(amount, fromCode, toCode, rates) {
  if (!amount) return 0;
  const from = (fromCode || "INR").toLowerCase();
  const to = (toCode || "INR").toLowerCase();
  if (from === to) return amount;
  const usdAmount = amount / (rates?.[from] ?? FALLBACK_RATES[from] ?? 1);
  return usdAmount * (rates?.[to] ?? FALLBACK_RATES[to] ?? 1);
}

/**
 * Formats an amount with the given currency's symbol. INR uses Indian
 * Lakh/Crore abbreviations; other currencies use K/M.
 */
export const fmtByCurrency = (n, code = "INR") => {
  const symbol = CURRENCY_SYMBOLS[code] || `${code} `;
  const abs = Math.abs(n || 0);
  if (code === "INR") {
    if (abs >= 10000000) return `${symbol}${(n / 10000000).toFixed(1)}Cr`;
    if (abs >= 100000) return `${symbol}${(n / 100000).toFixed(1)}L`;
    if (abs >= 1000) return `${symbol}${(n / 1000).toFixed(0)}K`;
    return `${symbol}${Math.round(n || 0)}`;
  }
  if (abs >= 1000000) return `${symbol}${(n / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${symbol}${(n / 1000).toFixed(0)}K`;
  return `${symbol}${Math.round(n || 0)}`;
};
