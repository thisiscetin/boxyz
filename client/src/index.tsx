import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useAtom } from 'jotai';

import MMProvider from './Components/MMProvider';
import ChainChecker from './Components/ChainChecker';
import FactoryProvider from './Components/FactoryProvider';
import Navigation from './Components/Navigation';
import ChainStatus from './Components/ChainStatus';
import TxInProgress from './Components/TxInProgress';

import Boxes from './Pages/Boxes';
import Breed from './Pages/Breed';
import Inventory from './Pages/Inventory';
import Box from './Pages/Box';

import { Theme } from './Constants/theme';
import { transactionInProgressAtom } from './store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [transactionInProgress] = useAtom(transactionInProgressAtom);

  return (
    <div className="App">
      <MMProvider />
      <FactoryProvider />
      <ThemeProvider theme={Theme}>
        <Navigation />
        <ChainStatus />

        {transactionInProgress && <TxInProgress />}

        <ChainChecker>
          <Routes>
            <Route path="/" element={<Boxes />} />
            <Route path="breed" element={<Breed />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="boxes/:boxId" element={<Box />} />
          </Routes>
        </ChainChecker>
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
