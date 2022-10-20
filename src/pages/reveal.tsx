import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { deobfuscate, firstQp, hexToString, obfuscate } from '../lib'

const Reveal = () => {
  const router = useRouter()
  const [name, setName] = useState('')

  useEffect(() => {
    if (router.isReady) {
      setName(deobfuscate(firstQp(router.query.name)))
    }
  }, [router.isReady])

  return (
    <div>
      <Head>
        <title>wichteln.ch</title>
      </Head>
      <h1>Du musst {name} wichteln</h1>
    </div>
  )
}

export default Reveal
