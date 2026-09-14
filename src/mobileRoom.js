export const usesMobileRoomControls = () =>
  typeof window !== 'undefined' &&
  (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(max-width: 900px)').matches
  )

export const requestMobileRoomMode = async () => {
  if (!usesMobileRoomControls()) return

  const root = document.documentElement
  const requestFullscreen = root.requestFullscreen || root.webkitRequestFullscreen

  try {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && requestFullscreen) {
      await requestFullscreen.call(root)
    }
  } catch {
    // Fullscreen is optional: iOS and embedded browsers may reject it.
  }

  try {
    await screen.orientation?.lock?.('landscape')
  } catch {
    // Orientation locking is also optional and requires browser support.
  }
}
