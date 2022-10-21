import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { deobfuscate, firstQp } from '../lib'
import classNames from 'classnames'

const Reveal = () => {
  const router = useRouter()
  const [santa, setSanta] = useState('')
  const [presentee, setPresentee] = useState('')
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    if (router.isReady) {
      setSanta(deobfuscate(firstQp(router.query.s)))
      setPresentee(deobfuscate(firstQp(router.query.p)))
    }
  }, [router.isReady])

  return (
    <div className="container">
      <h1 className="person">{santa}</h1>
      <p>du bist der Wichtel von</p>
      {!clicked && (
        <button onClick={() => setClicked(true)}>Enthülle den Namen</button>
      )}
      {clicked && <h2 className="person">{presentee}</h2>}

      <style jsx>{`
        .container {
          text-align: center;
        }
        .person {
          color: var(--primary-bg-color);
        }
      `}</style>
    </div>
  )
}

export default Reveal
