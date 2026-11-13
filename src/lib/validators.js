export const isEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())

export const isPhone = (v = '') => {
  const digits = v.replace(/[^\d]/g, '')
  return /^[+\d][\d\s()-]*$/.test(v.trim()) && digits.length >= 7 && digits.length <= 15
}

export const luhn = (num = '') => {
  const digits = num.replace(/\s/g, '')
  if (!/^\d{13,19}$/.test(digits)) return false
  let sum = 0
  let alt = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i])
    if (alt) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alt = !alt
  }
  return sum % 10 === 0
}

export const isFutureExpiry = (v = '') => {
  const m = /^(\d{2})\/(\d{2})$/.exec(v)
  if (!m) return false
  const month = Number(m[1])
  const year = 2000 + Number(m[2])
  if (month < 1 || month > 12) return false
  const now = new Date()
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}
