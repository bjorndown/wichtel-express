import Head from 'next/head'
import '../style.css'
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="container">
      <Head>
        <title>
          wichtel.express &ndash; Wichtel-Auslosung schnell und ohne Anmeldung
        </title>
      </Head>
      <header>
        <h1>
          <a href="/">
            Wichtel<span className="flipped">🚄</span>
          </a>
        </h1>
        <a title="Anleitung & Impressum" href="/impressum">
          ?
        </a>
        <span className="claim">Auslosen ohne Anmeldung</span>
      </header>
      <main>
        <Component {...pageProps} />
      </main>

      <style jsx>{`
        .container {
          max-width: 400px;
        }

        header {
          display: flex;
          flex-flow: row wrap;
          justify-content: space-between;
          margin: 0.5rem 0 1.5rem 0;
        }

        header h1 {
          margin: 0;
        }

        .flipped {
          transform: scale(-1, 1);
          display: inline-block;
        }

        header a {
          text-decoration: none;
          place-self: flex-start;
        }

        header .claim {
          flex-basis: 100%;
          font-size: medium;
        }

        main {
          padding-top: 1rem;
        }
      `}</style>
    </div>
  )
}
