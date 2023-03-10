interface ThrottleOptions {
  leading?: boolean
  trailing?: boolean
}

type ThrottleFunc<T extends (...args: any[]) => any> = (
  func: T,
  wait: number,
  options?: ThrottleOptions
) => (...args: Parameters<T>) => ReturnType<T>

/**
 * 节流函数
 */
export const throttle: ThrottleFunc<(...args: any[]) => any> = (func, wait, options) => {
  let context: any, args: any, result: any
  let timeout: any = null
  let previous = 0

  const later = () => {
    previous = options?.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout)
      context = args = null
  }

  return (...innerArgs: any[]) => {
    const now = Date.now()
    if (!previous && options && options.leading === false)
      previous = now
    const remaining = wait - (now - previous)
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    context = this
    args = innerArgs
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout)
        context = args = null
    }
    else if (!timeout && options && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}
