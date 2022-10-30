import { useMemo, useState } from 'react'
import { ALLOWED_CHARS, drawLots, generateLink, SecretSanta } from '../lib'

const Index = () => {
  const [santas, setSantas] = useState<SecretSanta[]>([
    { name: '' },
    { name: '' },
    { name: '' },
  ])
  const [drawingLots, setDrawingLots] = useState(false)
  const lotsDrawn = useMemo(() => santas.some(p => !!p.presentee), [santas])

  const doDrawLots = (): void => {
    setDrawingLots(true)
    drawLots(santas)
    setDrawingLots(false)

    setSantas(santas =>
      santas.map(santa => ({ ...santa, url: generateLink(santa) }))
    )
  }

  const reset = (): void => setSantas(ps => ps.map(p => ({ name: p.name })))
  const addPerson = (): void => {
    setSantas(_ => [...santas, { name: '' }])
  }

  const isReadyToDrawLots = (): boolean =>
    santas.every(person => (person.name?.length ?? 0) > 0) &&
    santas.length === new Set(santas.map(p => p.name)).size &&
    santas.length > 2

  if (lotsDrawn) {
    return (
      <>
        <p>
          Versenden Sie nun die persönlichen Links per e-Mail, SMS, WhatsApp,
          Signal etc:
        </p>
        {santas.map((person, i) => (
          <div className="row" key={`person-${i}`}>
            <span className="name">{person.name}</span>

            <button
              className="action"
              onClick={() =>
                navigator.clipboard.writeText(person.url as string)
              }
            >
              Link kopieren
            </button>
          </div>
        ))}
        <button
          className="full-width"
          onClick={() =>
            navigator.clipboard.writeText(
              santas.map(person => `${person.name}: ${person.url}`).join('\n')
            )
          }
        >
          Alle Namen und Links kopieren
        </button>
        <button className="full-width" onClick={reset}>
          Zurücksetzen
        </button>

        <style jsx>{`
          .name {
            overflow-wrap: break-word;
          }
        `}</style>
      </>
    )
  } else {
    return (
      <>
        <form onSubmit={doDrawLots}>
          <p>Erfassen Sie alle Teilnehmer:</p>
          {santas.map((person, i) => (
            <div className="row" key={`input-person-${i}`}>
              <label className="visually-hidden" htmlFor={`input-person-${i}`}>
                Name Person {i + 1}
              </label>
              <input
                id={`input-person-${i}`}
                onChange={event =>
                  setSantas(persons => {
                    persons[i] = { name: event.target.value }
                    return persons.slice()
                  })
                }
                placeholder={`Name Person ${i + 1}`}
                type="text"
                size={16}
                value={person.name}
                minLength={3}
                pattern={ALLOWED_CHARS.source}
                aria-label={`Name Person ${i + 1}`}
              />
              <button
                type="button"
                className="delete-button"
                onClick={() =>
                  setSantas(persons => persons.filter((_, l) => l !== i))
                }
              >
                Löschen
              </button>
            </div>
          ))}
          <button type="button" className="full-width" onClick={addPerson}>
            Person hinzufügen
          </button>

          <input
            type="submit"
            className="full-width primary"
            disabled={!isReadyToDrawLots() || drawingLots}
            value="Wichtel auslosen"
          />
        </form>

        {drawingLots && <span>Auslosung läuft...</span>}
        <style jsx>{`
          .delete-button {
            margin-left: 0.5rem;
          }
        `}</style>
      </>
    )
  }
}

export default Index
