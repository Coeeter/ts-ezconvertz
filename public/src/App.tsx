import {
  ChakraProvider,
  extendTheme,
  Theme,
  theme as defaultTheme,
} from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { VideoServiceProvider } from './context/VideoServiceContext';
import Completion from './pages/Completion';
import Home from './pages/Home';
import Landing from './pages/Landing';
import './App.css';

function App() {
  const theme: Theme = {
    ...defaultTheme,
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
    },
  };

  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <VideoServiceProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/completed" element={<Completion />} />
          </Routes>
        </VideoServiceProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
