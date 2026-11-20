/** sessionStorage access that never throws (Safari private / blocked storage). */
export function storageGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

export function storageSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    // ignore quota / private-mode failures
  }
}
