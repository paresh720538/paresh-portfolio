/** Only hijack plain primary clicks — keep Cmd/Ctrl/Shift/middle-click native. */
export function shouldSoftNavigate(e: {
  metaKey?: boolean
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  button?: number
}) {
  return !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button !== undefined && e.button !== 0))
}

export function softClick(
  e: { preventDefault: () => void; metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean; button?: number },
  navigate: (to: string) => void,
  to: string,
) {
  if (!shouldSoftNavigate(e)) return
  e.preventDefault()
  navigate(to)
}
