/**
 * Lightweight SVG illustration of each drink, tinted with the product colours.
 * Used for catalog cards, the cart and as the 3D fallback — so the shop grid
 * never spins up more than one WebGL context.
 */
export default function ProductArt({ product, className = '' }) {
  const { vessel, colors, temp, id, name } = product
  const g = `art-${id}`

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={name}>
      <defs>
        <linearGradient id={`${g}-liq`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.liquid} />
          <stop offset="1" stopColor={colors.liquid} stopOpacity="0.78" />
        </linearGradient>
        <linearGradient id={`${g}-cup`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e6dcc4" />
          <stop offset="0.45" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#d5c9ad" />
        </linearGradient>
        <radialGradient id={`${g}-sh`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.45" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {vessel === 'glass' ? (
        <>
          <ellipse cx="100" cy="170" rx="58" ry="8" fill={`url(#${g}-sh)`} />
          <line x1="110" y1="22" x2="99" y2="124" stroke={colors.accent} strokeWidth="5" strokeLinecap="round" />
          <path d="M64 70 H136 L128 152 Q100 160 72 152 Z" fill={`url(#${g}-liq)`} />
          <g fill="#eaf8ff" fillOpacity="0.5" stroke="#fff" strokeOpacity="0.4">
            <rect x="72" y="62" width="22" height="22" rx="4" transform="rotate(14 83 73)" />
            <rect x="100" y="70" width="22" height="22" rx="4" transform="rotate(-10 111 81)" />
            <rect x="84" y="100" width="22" height="22" rx="4" transform="rotate(24 95 111)" />
          </g>
          <path
            d="M58 46 H142 L130 156 Q100 166 70 156 Z"
            fill="#fff"
            fillOpacity="0.1"
            stroke="#fff"
            strokeOpacity="0.6"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M70 56 L76 140" stroke="#fff" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="100" cy="170" rx="76" ry="9" fill={`url(#${g}-sh)`} />
          <ellipse cx="100" cy="160" rx="68" ry="10" fill={`url(#${g}-cup)`} />
          <ellipse cx="100" cy="157" rx="52" ry="6" fill="#efe6d2" />
          <path d="M150 104 C180 98 180 142 146 138" fill="none" stroke={`url(#${g}-cup)`} strokeWidth="9" strokeLinecap="round" />
          <path d="M44 86 H156 C156 122 140 154 100 156 C60 154 44 122 44 86 Z" fill={`url(#${g}-cup)`} />
          <ellipse cx="100" cy="86" rx="56" ry="9" fill="#f4ecda" />
          <ellipse cx="100" cy="88" rx="50" ry="7" fill={`url(#${g}-liq)`} />
          {temp === 'hot' && (
            <g fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="3" strokeLinecap="round">
              <path className="steam-line" d="M84 70 C76 60 92 54 84 42" />
              <path className="steam-line" style={{ animationDelay: '0.9s' }} d="M102 68 C94 58 110 50 102 36" />
              <path className="steam-line" style={{ animationDelay: '1.8s' }} d="M120 70 C112 60 128 54 120 44" />
            </g>
          )}
        </>
      )}
    </svg>
  )
}
