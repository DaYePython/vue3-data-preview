/**
 * Format float to fixed.
 * @param {number} num - Float number.
 * @param {number} decimal - Decimal number.
 * @returns {string} - Formatted number.
 */
export function formaterFloatToFixed(num: number, decimal: number) {
  try {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: decimal }).format(num)
  }
  catch (error) {
    console.error(error)
    return num
  }
}
// The function formaterNumber takes a number as an argument and returns a string
// containing the number formatted with commas separating groups of thousands.
// The function uses the Intl.NumberFormat class to get a formatter
// for the en-US locale and then calls the format method on the formatter
// to format the number.
export function formatNumberWithCommas(num: number): string {
  try {
    return new Intl.NumberFormat('en-US').format(num)
  }
  catch (error) {
    console.error(error)
    return num.toString()
  }
}
