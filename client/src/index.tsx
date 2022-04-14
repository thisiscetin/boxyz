import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Navigation from './Components/Navigation';
import Boxes from './Pages/Boxes';
import Marketplace from './Pages/Marketplace';
import Breed from './Pages/Breed';
import Inventory from './Pages/Inventory';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const theme = {
  bgdark: '#064592',
  bglight: '#0f92cf',
  primary: '#FFFFFF',
  secondary: '#D2D2D2',
};

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Navigation />

        <Routes>
          <Route path="/" element={<Boxes />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="breed" element={<Breed />} />
          <Route path="inventory" element={<Inventory />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

root.render(
  <React.StrictMode>
    <>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </>
  </React.StrictMode>
);
