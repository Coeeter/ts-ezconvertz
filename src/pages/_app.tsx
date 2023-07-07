import { VideoServiceProvider } from '@/context/VideoServiceContext';
import '@/styles/globals.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { mode } from '@chakra-ui/theme-tools';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider
      theme={extendTheme({
        config: {
          initialColorMode: 'dark',
          useSystemColorMode: false,
        },
        styles: {
          global: (props: Record<string, string>) => ({
            body: {
              bgColor: mode('#ffe0e0', '#1A202C')(props),
            },
          }),
        },
      })}
    >
      <VideoServiceProvider>
        <Component {...pageProps} />
      </VideoServiceProvider>
    </ChakraProvider>
  );
}
