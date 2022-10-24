import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { deobfuscate, firstQp } from '../lib'

const Reveal = () => {
  const router = useRouter()
  const [santa, setSanta] = useState('')
  const [presentee, setPresentee] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (router.isReady) {
      const santa = firstQp(router.query.s)
      const presentee = deobfuscate(firstQp(router.query.p))
      if (!santa || !presentee) {
        setInvalid(true)
      } else {
        setSanta(santa)
        setPresentee(presentee)
        setReady(true)
      }
    }
  }, [router.isReady])

  if (invalid) {
    return (
      <article>
        Diese URL ist ungültig.
        <style jsx>{`
          article {
            text-align: center;
          }
        `}</style>
      </article>
    )
  }

  if (ready) {
    return (
      <>
        <article>
          <h2 className="person">{santa},</h2>
          <p>du bist der Wichtel von</p>
          {revealed ? (
            <span className="person">{presentee}</span>
          ) : (
            <button className="primary" onClick={() => setRevealed(true)}>
              Enthülle den Namen
            </button>
          )}
        </article>
        <style jsx>{`
          article {
            text-align: center;
          }

          .person {
            color: var(--primary-bg-color);
            font-size: xx-large;
            font-weight: bold;
          }
        `}</style>
      </>
    )
  }

  return <p>...</p>
}

export default Reveal
