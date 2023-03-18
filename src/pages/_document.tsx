import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="font-notosans">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/images/shortcut-icon.png" />
        <meta property="title" content="INTOUCH LEADERS" />
        <meta
          name="description"
          content="슬기로운 리더생활을 위한 Intouch Leaders"
        />
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <meta property="og:title" content="INTOUCH LEADERS" />
        <meta
          name="og:description"
          content="슬기로운 리더생활을 위한 Intouch Leaders"
        />
        <meta property="og:image" content="/images/thumbnail.png" />
        <meta name="twitter:image" content="/images/thumbnail.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
