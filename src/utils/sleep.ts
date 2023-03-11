// Sleep function
export function sleep(ms = 500) {
  // setTimeout() method to delay the execution of the code
  return new Promise(resolve => setTimeout(resolve, ms))
}
