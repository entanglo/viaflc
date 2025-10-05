import { Container } from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Script from 'next/script';
import '@styles/scss/globals.scss';
import customTheme from '@styles/theme';
import { throwErrorIfEnvVarsNotFound } from '@utils/ConfigUtils';
import '@utils/i18n';

export interface MyAppProps extends AppProps {}

const App = (props: AppProps) => {
  throwErrorIfEnvVarsNotFound();

  const { Component, pageProps } = props;
  const outerTheme: any = useTheme();
  const Header = dynamic(() => import('@components/layouts/Header'), { ssr: false });
  const Footer = dynamic(() => import('@components/layouts/Footer'), { ssr: false });

  return (
    <ThemeProvider theme={customTheme(outerTheme)}>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-57MPTSDC1R"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-57MPTSDC1R');
        `}
      </Script>
      <Head>
        <title>ViaFLC</title>
        <meta
          name="description"
          content="ViaFLC - More Coins Same Power"
        />
        <meta property="og:image" content="/assets/og.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="ViaFLC" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/assets/favicon-96x96.png" sizes="96x96"></link>
        <link rel="icon" href="/assets/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/assets/favicon.ico"></link>
        <meta name="apple-mobile-web-app-title" content="ViaFLC"></meta>
        <link rel="manifest" href="/assets/site.webmanifest"></link>
      </Head>
      <Header />
      <Container
        maxWidth="md"
        sx={{
          marginTop: '69px',
          px: { xs: 1, md: 5 },
          py: { xs: 1, md: 1 },
          display: 'flex',
          flexDirection: 'column'
        }}>
        <Component {...pageProps} />
      </Container>

      <Footer />
    </ThemeProvider>
  );
};

export default App;
