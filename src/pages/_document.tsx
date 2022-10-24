import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="de">
      <Head>
        <meta
          name="description"
          content="Wichtel-Auslosung ohne Anmeldung &ndash; schnell und unkompliziert."
        />
        <meta
          name="keywords"
          content="wichtel, wichteln, auslosen, secret santa, schnell, einfach, unkompliziert, ohne anmeldung"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
