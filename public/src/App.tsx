import { ChakraProvider, theme as defaultTheme, Theme } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { VideoServiceProvider } from './context/VideoServiceContext';
import Completion from './pages/Completion';
import Home from './pages/Home';
import Landing from './pages/Landing';

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
            <Route path="/convert" element={<Home />}>
              <Route path="/convert/completion" element={<Completion />} />
            </Route>
          </Routes>
        </VideoServiceProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
