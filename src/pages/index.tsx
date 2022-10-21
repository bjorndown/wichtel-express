import _sample from 'lodash/sample'
import { useMemo, useState } from 'react'
import { obfuscate } from '../lib'

type SecretSanta = {
  name: string
  presentee?: string
  url?: string
}

const Index = () => {
  const [santas, setSantas] = useState<SecretSanta[]>([
    { name: '' },
    { name: '' },
    { name: '' },
  ])
  const [drawingLots, setDrawingLots] = useState(false)
  const lotsDrawn = useMemo(() => santas.some(p => !!p.presentee), [santas])

  const drawLots = () => {
    setDrawingLots(true)
    while (santas.some(p => !p.presentee)) {
      // TODO pull out
      for (const person of santas) {
        const otherPersons = santas.filter(p => p.name !== person.name)
        const wichtel = _sample(otherPersons)
        const alreadyWichtel = santas.some(p => p.presentee === wichtel.name)
        if (!alreadyWichtel) {
          person.presentee = wichtel.name
        }
      }
    }
    setDrawingLots(false)

    setSantas(santas =>
      santas.map(santa => ({ ...santa, url: generateLink(santa) }))
    )
  }

  const reset = () => {
    setSantas(ps => ps.map(p => ({ name: p.name })))
  }

  const addPerson = () => setSantas(n => [...santas, { name: '' }])
  const generateLink = (santa: SecretSanta) =>
    `${location.href}reveal?p=${obfuscate(santa.presentee)}&s=${obfuscate(
      santa.name
    )}` // TODO use new URL(..)

  const isValid = (): boolean =>
    santas.every(person => (person.name?.length ?? 0) > 0) &&
    santas.length === new Set(santas.map(p => p.name)).size

  if (lotsDrawn) {
    return (
      <>
        <table>
          <tbody>
            {santas.map((person, i) => (
              <tr key={`person-${i}`}>
                <td>{person.name}</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() =>
                      `Wichtel-Link für ${
                        person.name
                      }: ${navigator.clipboard.writeText(person.url)}`
                    }
                  >
                    Link kopieren
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="full-width"
          onClick={() =>
            navigator.clipboard.writeText(
              santas.map(person => `${person.name}: ${person.url}`).join('\n')
            )
          }
        >
          Alle Links kopieren
        </button>
        <button className="full-width" onClick={reset}>
          Zurücksetzen
        </button>
      </>
    )
  } else {
    return (
      <>
        <table>
          <tbody>
            {santas.map((person, i) => (
              <tr key={`person-${i}`}>
                <td>
                  <input
                    onChange={event =>
                      setSantas(persons => {
                        persons[i] = { name: event.target.value }
                        return persons.slice()
                      })
                    }
                    type="text"
                    size={12}
                    value={person.name}
                  />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() =>
                      setSantas(persons => persons.filter((_, l) => l !== i))
                    }
                  >
                    entfernen
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={2}>
                <button className="full-width" onClick={addPerson}>
                  Person hinzufügen
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <button
          className="full-width"
          disabled={!isValid() || drawingLots}
          onClick={drawLots}
        >
          Wichtel auslosen
        </button>
        {drawingLots && <span>Auslosung läuft...</span>}
      </>
    )
  }
}

export default Index
