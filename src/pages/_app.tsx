import Head from 'next/head'
import '../style.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="container">
      <Head>
        <title>wichtel.express</title>
      </Head>
      <Component {...pageProps} />
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          flex-direction: column;
          flex-wrap: wrap;
          align-items: center;
          max-width: 450px;
        }
      `}</style>
    </div>
  )
}
