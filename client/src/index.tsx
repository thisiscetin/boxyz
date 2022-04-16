import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import Navigation from './Components/Navigation';
import Boxes from './Pages/Boxes';
import Marketplace from './Pages/Marketplace';
import Breed from './Pages/Breed';
import Inventory from './Pages/Inventory';

import ChainStatus from './Components/ChainStatus';

import { useAtom } from 'jotai';
import { wProviderAtom, rpcProviderAtom, blockNumberAtom } from './store';
import { ethers } from 'ethers';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const theme = {
  bgdark: '#064592',
  bglight: '#0f92cf',
  primary: '#FFFFFF',
  secondary: '#D2D2D2',
};

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [, setWProvider] = useAtom(wProviderAtom);
  const [rpcProvider, setRPCProvider] = useAtom(rpcProviderAtom);
  const [, setBlockNumber] = useAtom(blockNumberAtom);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setWProvider(provider);
  }, [setWProvider]);

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-mainnet.plutotest.network/');
    setRPCProvider(provider);
  }, [setRPCProvider]);

  useEffect(() => {
    async function getBlockNumber() {
      const block = await rpcProvider?.getBlockNumber();
      setBlockNumber(block || 0);
    }
    getBlockNumber();
  }, [rpcProvider, setBlockNumber]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Navigation />
        <ChainStatus />

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
