import Head from 'next/head'
import '../style.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="container">
      <Head>
        <title>wichtel.express</title>
      </Head>
      <header>
        <h1>
          Wichtel<span className="flipped">🚄</span>
        </h1>
        <a title="Anleitung & Impressum" href="/impressum">
          ?
        </a>
      </header>
      <main>
        <Component {...pageProps} />
      </main>

      <style jsx>{`
        .container {
          max-width: 450px;
        }

        header {
          display: flex;
          flex-flow: row;
          flex-flow: wrap;
          justify-content: space-between;
          margin: 1.5rem 0;
        }

        header h1 {
          margin: 0;
        }

        .flipped {
          -moz-transform: scale(-1, 1);
          -webkit-transform: scale(-1, 1);
          -o-transform: scale(-1, 1);
          -ms-transform: scale(-1, 1);
          transform: scale(-1, 1);
          display: inline-block;
        }

        header a {
          place-self: start;
        }

        main {
        }
      `}</style>
    </div>
  )
}
