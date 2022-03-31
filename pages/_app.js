import { ChakraProvider } from '@chakra-ui/react';
import { THEME_DATA } from '../constants/';
import '@fontsource/poppins';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={THEME_DATA}>
      <Component {...pageProps} />
      <Script src="https://meet.jit.si/external_api.js"></Script>
    </ChakraProvider>
  );
}

export default MyApp;
