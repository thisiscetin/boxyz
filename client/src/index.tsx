import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { MetaMaskInpageProvider } from '@metamask/providers';

import Navigation from './Components/Navigation';
import Boxes from './Pages/Boxes';
import Marketplace from './Pages/Marketplace';
import Breed from './Pages/Breed';
import Inventory from './Pages/Inventory';

import { useAtom } from 'jotai';
import { wProviderAtom, rpcProviderAtom, blockNumber } from './store';
import { ethers } from 'ethers';

// import Web3Provider from './Components/_Web3Provider';

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
  const [bNumber, setBNumber] = useAtom(blockNumber);

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
      setBNumber(block || 0);
    }
    getBlockNumber();
  }, [rpcProvider, setBNumber]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Navigation />
        {bNumber ? <p>{bNumber}</p> : null}
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
