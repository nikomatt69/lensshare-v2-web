import { getCurrentBrowserFingerPrint } from '@rajesh896/broprint.js'


const getFingerprint = async () => {
  const fingerprint = await getCurrentBrowserFingerPrint()
  return fingerprint
}

export const setFingerprint = async () => {
  const storedFingerprint = localStorage.getItem(localStorage.FingerprintStore)
  if (!storedFingerprint) {
    const fingerprint = await getFingerprint()
    if (fingerprint) {
      localStorage.setItem(localStorage.FingerprintStore, fingerprint)
    }
  }
}
