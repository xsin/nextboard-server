/**
 * Utility function to convert undefined values to null
 * @param {T} obj - Object to convert
 * @param {boolean} deep - Indicates if the conversion should be deep
 * @returns {T} Converted object
 */
export function undefinedToNull<T>(obj: T, deep: boolean = false): T {
  if (obj === undefined || obj === null) {
    return null
  }
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (deep && typeof obj[key] === 'object' && obj[key] !== null) {
          obj[key] = undefinedToNull(obj[key], true)
        }
        else if (obj[key] === undefined) {
          obj[key] = null
        }
      }
    }
  }
  return obj
}
