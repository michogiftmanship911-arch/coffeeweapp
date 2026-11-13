// ---------------------------------------------------------------------------
// Central site configuration. Edit values here and they update everywhere.
// ---------------------------------------------------------------------------

export const SITE = {
  name: 'MotherEarth Tea Shop',
  owner: 'AYENI MICHAEL GIFT',
  email: 'michaelayen001@gmail.com',
  whatsappDisplay: '+234 906 119 1243',
  // Every "Contact Us" / "Get in Touch" / footer WhatsApp icon uses this exact link.
  whatsappUrl: 'https://wa.me/2349061191243',
  // Every "Email Us" button / mailto link uses this.
  mailto: 'mailto:michaelayen001@gmail.com',
}

// Replace with the shop's real profiles when you have them.
export const SOCIALS = {
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  x: 'https://x.com',
}

// Prices in products.js are stored in USD. Change this block to show another
// currency, e.g. { code: 'NGN', locale: 'en-NG', rate: 1500 } (rate = units per USD).
export const CURRENCY = { code: 'USD', locale: 'en-US', rate: 1 }

export const formatPrice = (usd) =>
  new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    maximumFractionDigits: CURRENCY.rate > 1 ? 0 : 2,
  }).format(usd * CURRENCY.rate)

export const TAX_RATE = 0.075
export const DELIVERY_FEE = 3
export const FREE_DELIVERY_OVER = 25

// Demo authentication: this password grants immediate access.
export const DEMO_PASSWORD = 'michael'
