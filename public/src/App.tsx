import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

import { VideoServiceProvider } from './context/VideoServiceContext';
import Download from './pages/Download';
import Home from './pages/Home';
import Landing from './pages/Landing';

function App() {
  const theme = extendTheme({
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
  });

  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <VideoServiceProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/convert" element={<Home />} />
            <Route path="/download" element={<Download />} />
          </Routes>
        </VideoServiceProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
