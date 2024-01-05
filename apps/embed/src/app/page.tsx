'use client'

import { DESCRIPTION, APP_NAME } from '@lensshare/data/constants'

const Home = () => {
  return (
    <main>
      <div>{APP_NAME}</div>
      <p>{DESCRIPTION}</p>
    </main>
  )
}

export default Home
