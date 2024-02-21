function existsOrError(value: string): boolean {
  if (!value) return false
  if (Array.isArray(value) && value.length === 0) return false
  if (typeof value === 'string' && !value.trim()) return false
  return true
}


function equalsOrError(valueA: string, valueB: string, msg: string): boolean {
  if (valueA !== valueB) return false
  return true
}

export { existsOrError, equalsOrError }

