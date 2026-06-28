export function getStoredUser() {
  const storedUser = localStorage.getItem('adflowUser')
  if (!storedUser || storedUser === 'undefined') return null

  try {
    return JSON.parse(storedUser)
  } catch (error) {
    localStorage.removeItem('adflowUser')
    return null
  }
}
