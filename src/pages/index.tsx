import _sample from 'lodash/sample'
import Head from 'next/head'
import { useState } from 'react'
import { obfuscate } from '../lib'

type Person = {
  name: string
  wichtel?: string
  url?: string
}

const Index = () => {
  const [persons, setPersons] = useState<Person[]>([
    { name: '' },
    { name: '' },
    { name: '' },
  ])
  const [drawing, setDrawing] = useState(false)
  const [drawn, setDrawn] = useState(false) // TODO useMemo?

  const drawLots = () => {
    setDrawing(true)
    while (persons.some(p => !p.wichtel)) {
      for (const person of persons) {
        const otherPersons = persons.filter(p => p.name !== person.name)
        const wichtel = _sample(otherPersons)
        const alreadyWichtel = persons.some(p => p.wichtel === wichtel.name)
        if (!alreadyWichtel) {
          person.wichtel = wichtel.name
        }
      }
    }
    setPersons([...persons]) // FIXME
    setDrawing(false)
    setDrawn(true)

    const padToLength =
      Math.max(...persons.map(person => person.name.length)) + 2
  }

  const reset = () => {
    setPersons(ps => ps.map(p => ({ name: p.name })))
    setDrawn(false)
  }

  const addPerson = () => setPersons(n => [...persons, { name: '' }])
  const generateLink = (person: Person) =>
    `${location.origin}/reveal?name=${obfuscate(person.wichtel)}`

  const isValid = (): boolean =>
    persons.every(person => (person.name?.length ?? 0) > 0) &&
    persons.length === new Set(persons.map(p => p.name)).size

  return (
    <div>
      <Head>
        <title>Einfach wichteln</title>
      </Head>
      <h1>Einfach wichteln</h1>
      <table>
        <tbody>
          {persons.map((person, i) => (
            <tr key={i}>
              <td>
                <input
                  onChange={event =>
                    setPersons(persons => {
                      persons[i] = { name: event.target.value }
                      return persons.slice()
                    })
                  }
                  type="text"
                  size={12}
                  value={persons[i].name}
                />
              </td>
              <td>
                {drawn ? (
                  ''
                ) : (
                  <button
                    onClick={() =>
                      setPersons(persons => persons.filter((_, l) => l !== i))
                    }
                  >
                    entfernen
                  </button>
                )}
              </td>
              <td>
                {person.wichtel ? <a href={generateLink(person)}>Link</a> : ''}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>
              {drawn ? (
                ''
              ) : (
                <button onClick={addPerson}>Person hinzufügen</button>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <button disabled={!isValid() || drawing} onClick={() => drawLots()}>
        Auslosen
      </button>
      {drawing && <span>Auslosung läuft...</span>}
      {drawn && <button onClick={reset}>Zurücksetzen</button>}
      <style jsx>{`
        input,
        button {
          font-size: large;
        }
      `}</style>
    </div>
  )
}

export default Index
