import type { ThemeConfig } from '@livepeer/react'
import { createReactClient, studioProvider } from '@livepeer/react'
import { BASE_URL, LIVEPEER_API_KEY } from '@lensshare/data/constants'

export const getLivepeerClient = () => {
  return createReactClient({
    provider: studioProvider({
      apiKey: '9e17a7ab-3370-4e31-85c3-43072da2315e'
    })
  })
}

export const videoPlayerTheme: ThemeConfig = {
  colors: {
    accent: '#fff',
    progressLeft: '#1d4ed8',
    loading: '#1d4ed8'
  },
  fontSizes: {
    timeFontSize: '12px'
  },
  space: {
    timeMarginX: '22px',
    controlsBottomMarginX: '10px',
    controlsBottomMarginY: '10px'
  },
  sizes: {
    iconButtonSize: '35px',
    loading: '30px',
    thumb: '7px',
    trackInactive: '3px',
    thumbActive: '10px',
    trackActive: '5px'
  },
  radii: {
    containerBorderRadius: '0px'
  }
}
