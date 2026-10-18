export function formatCurrency(amount, currency = 'USD') {
  if (currency === 'KHR') {
    // បង្ហាញសញ្ញា ៛ ជំនួសឱ្យពាក្យ KHR
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'KHR', 
      maximumFractionDigits: 0,
      currencyDisplay: 'narrowSymbol' 
    }).format(amount).replace('KHR', '៛')
  }
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD', 
    maximumFractionDigits: 2 
  }).format(amount)
}

export function formatDate(date, format = 'short') {
  const d = new Date(date)
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return d.toLocaleDateString()
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function getLastNDays(n) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}