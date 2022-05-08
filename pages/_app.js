import { ChakraProvider } from '@chakra-ui/react';
import { THEME_DATA } from '../constants/';
import '@fontsource/poppins';
import Script from 'next/script';
import { UserDataContextProvider } from '../src/context/UserDataContext';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={THEME_DATA}>
        <UserDataContextProvider>
      <Component {...pageProps} />
      <Script src="https://meet.jit.si/external_api.js"></Script>
      </UserDataContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
