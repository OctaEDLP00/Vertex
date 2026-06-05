function getOperativeSystem(platform: 'win32' | 'linux' | 'darwin') {
  if (platform === 'linux') return 'linux'
  if (platform === 'darwin') return 'darwin'
  if (platform === 'win32') return 'windows'
  return null
}

export default getOperativeSystem
