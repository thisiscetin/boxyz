import { useEffect } from 'react';
import { providerAtom, blockNumberAtom, chainIDAtom, selectedAccountAtom } from '../../store';
import { useAtom } from 'jotai';
import { ethers } from 'ethers';

function MMProvider() {
  const [provider, setProvider] = useAtom(providerAtom);
  const [, setSelectedAccount] = useAtom(selectedAccountAtom);
  const [, wSetChainID] = useAtom(chainIDAtom);
  const [, setBlockNumber] = useAtom(blockNumberAtom);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' });
      setProvider(new ethers.providers.Web3Provider(window.ethereum));
    }
  }, [setProvider]);

  useEffect(() => {
    async function getChainID() {
      await provider?.getNetwork().then(({ chainId }) => {
        wSetChainID(chainId);
      });

      window.ethereum.on('chainChanged', (_chainID: number) => {
        wSetChainID(Number(_chainID));
        window.location.reload();
      });
    }
    getChainID();
  }, [provider, wSetChainID]);

  useEffect(() => {
    async function getBlockNumber() {
      const block = await provider?.getBlockNumber();
      setBlockNumber(block || 0);
    }
    getBlockNumber();
  }, [provider, setBlockNumber]);

  useEffect(() => {
    provider
      ?.getSigner()
      .getAddress()
      .then((address: string) => setSelectedAccount(address));

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      setSelectedAccount(accounts[0]);
      window.location.reload();
    });
  }, [provider, setSelectedAccount]);

  return <></>;
}

export default MMProvider;
