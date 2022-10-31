import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="de">
      <Head>
        <meta
          name="description"
          content="Wichtel-Auslosung schnell und ohne Anmeldung"
        />
        <meta
          name="keywords"
          content="wichtel, wichteln, secret santa, auslosen, zuweisen, express, schnell, einfach, unkompliziert, ohne anmeldung"
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
