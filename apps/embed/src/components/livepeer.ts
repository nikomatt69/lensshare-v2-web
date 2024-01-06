import type { ThemeConfig } from '@livepeer/react'
import { createReactClient, studioProvider } from '@livepeer/react'
import { BASE_URL, LIVEPEER_API_KEY } from '@lensshare/data/constants'

export const getLivepeerClient = () => {
  return createReactClient({
    provider: studioProvider({
      apiKey: '30c0057f-d721-414e-8e03-7ff98f407535'
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
