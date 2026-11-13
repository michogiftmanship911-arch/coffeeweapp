export const SIZES = [
  { id: 'S', label: 'Small', oz: 8, add: 0, factor: 0.75 },
  { id: 'M', label: 'Medium', oz: 12, add: 0.8, factor: 1 },
  { id: 'L', label: 'Large', oz: 16, add: 1.5, factor: 1.3 },
]

export const getSize = (id) => SIZES.find((s) => s.id === id) ?? SIZES[1]

export const unitPrice = (product, sizeId) => product.price + getSize(sizeId).add

// Nutrition values in products.js are for a Medium (12 oz). Scale for other sizes.
export const scaledNutrition = (product, sizeId) => {
  const f = getSize(sizeId).factor
  const n = product.nutrition
  const r = (v) => Math.round(v * f)
  return {
    calories: r(n.calories),
    sugar: r(n.sugar),
    addedSugar: r(n.addedSugar),
    carbs: r(n.carbs),
    fat: r(n.fat),
    protein: r(n.protein),
    caffeine: Math.round((n.caffeine * f) / 5) * 5,
  }
}
