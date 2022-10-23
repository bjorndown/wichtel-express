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

  const addPerson = () => setSantas(_ => [...santas, { name: '' }])
  const generateLink = (santa: SecretSanta): string => {
    const url = new URL('reveal', location.href)
    url.searchParams.append('s', santa.name)
    url.searchParams.append('p', obfuscate(santa.presentee))
    return url.toString()
  }

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
                <td className="name">{person.name}</td>

                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => navigator.clipboard.writeText(person.url)}
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

        <style jsx>{`
          .name {
            max-width: 125px;
            overflow-wrap: break-word;
          }

          .footnote {
            font-weight: bold;
            margin: 0 0.2rem;
          }

          .visit-link {
            font-size: medium;
            text-align: right;
          }
        `}</style>
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
                  <label
                    className="visuallyhidden"
                    htmlFor={`input-person-${i}`}
                  >
                    Name Person {i}
                  </label>
                  <input
                    id={`input-person-${i}`}
                    onChange={event =>
                      setSantas(persons => {
                        persons[i] = { name: event.target.value }
                        return persons.slice()
                      })
                    }
                    type="text"
                    size={16}
                    value={person.name}
                  />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() =>
                      setSantas(persons => persons.filter((_, l) => l !== i))
                    }
                  >
                    Löschen
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
          className="full-width primary"
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
